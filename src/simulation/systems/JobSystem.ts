import { findPath } from "@/src/world/pathfinding";
import { positionsEqual, type GridPosition } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import type { ResourceNode } from "../entities/ResourceNode";
import type { FarmPlot } from "../entities/FarmPlot";
import { farmNodeId } from "../entities/FarmPlot";
import type { FarmTaskType, GatherTaskType, Task } from "../entities/Task";
import { isConstructionTask, jobCategory, resourceTypeForTask } from "../entities/Task";
import { SLIME_IDS, type SlimeState } from "../entities/SlimeState";
import { RESOURCE_IDS } from "../resources";
import { isIdleAvailable } from "./slimeAvailability";
import { cancelAmbientBehavior } from "./AmbientBehaviorSystem";
import { isFishingTask } from "../entities/Task";
import { cancelFishingOpportunity } from "./FishingOpportunitySystem";
import { FISHING } from "../fishingConfig";
import { JOB_ATTRIBUTE_WEIGHTS, getAttributeContribution } from "../slimeAttributes";
import { canPerformTaskCapabilities } from "../slimeCapabilities";
import { startPlotWorkRecoverHop, startTillRecoverHop, tillStanceWorkTile } from "./tillStance";
import type { ConstructionSite } from "../entities/ConstructionSite";
import { buildingById, entranceTile } from "../data/buildings";

const SLIME_ASSIGN_ORDER = [SLIME_IDS.PINGO, SLIME_IDS.MOMO, SLIME_IDS.TITO];

export { isIdleAvailable };

function nodeMatches(type: GatherTaskType, node: ResourceNode): boolean {
  if (type === "gather_wood") {
    return node.type === RESOURCE_IDS.WOOD;
  }
  return node.type === RESOURCE_IDS.STONE;
}

function nodeHasActiveTask(state: GameState, nodeId: string): boolean {
  return state.activeTasks().some((task) => task.nodeId === nodeId);
}

/**
 * Capability gate. Universal jobs (no requiredCapabilities) stay eligible for every slime.
 * Attributes and affinity are scored only after this returns true.
 */
export function canPerformTask(slime: SlimeState, task: Task): boolean {
  return canPerformTaskCapabilities(slime, task);
}

export function taskSuitability(slime: SlimeState, task: Task, pathLength = 0): number {
  const affinity = slime.jobAffinity?.[jobCategory(task.type)] ?? 1;
  if (!isFishingTask(task.type)) {
    return affinity;
  }
  return (
    affinity +
    getAttributeContribution(slime.attributes, JOB_ATTRIBUTE_WEIGHTS.fishing) -
    pathLength * FISHING.distancePenaltyPerTile
  );
}

function slimeAssignIds(state: GameState): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const id of SLIME_ASSIGN_ORDER) {
    if (state.slimes[id]) {
      seen.add(id);
      ids.push(id);
    }
  }
  for (const id of Object.keys(state.slimes)) {
    if (!seen.has(id)) {
      ids.push(id);
    }
  }
  return ids;
}

function pickWorker(state: GameState, task: Task): SlimeState | undefined {
  let best: SlimeState | undefined;
  let bestScore = -Infinity;
  for (const id of slimeAssignIds(state)) {
    const slime = state.slimes[id];
    if (!canPerformTask(slime, task) || !isIdleAvailable(state, slime)) {
      continue;
    }
    const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, task.workTile);
    if (path === null) {
      continue;
    }
    const score = taskSuitability(slime, task, path.length);
    if (!best || score > bestScore) {
      best = slime;
      bestScore = score;
    }
  }
  return best;
}

export function createGatherTask(
  state: GameState,
  type: GatherTaskType,
  preferredTile?: GridPosition,
): Task | undefined {
  let node: ResourceNode | undefined;
  if (preferredTile) {
    const atTile = state.nodeAtTile(preferredTile.x, preferredTile.y);
    if (atTile && nodeMatches(type, atTile) && !nodeHasActiveTask(state, atTile.id)) {
      node = atTile;
    }
  }
  if (!node) {
    node = state.nodes.find(
      (candidate) => nodeMatches(type, candidate) && !nodeHasActiveTask(state, candidate.id),
    );
  }
  if (!node) {
    return undefined;
  }

  const resourceType = resourceTypeForTask(type);
  const task: Task = {
    id: state.nextTaskId(type),
    type,
    target: node.tile,
    nodeId: node.id,
    workTile: node.workTile,
    resourceType,
    state: "available",
  };
  state.tasks[task.id] = task;
  return task;
}

export function createFarmTask(state: GameState, type: FarmTaskType, plot: FarmPlot): Task | undefined {
  const nodeId = farmNodeId(plot.tile.x, plot.tile.y);
  if (nodeHasActiveTask(state, nodeId)) {
    return undefined;
  }
  const task: Task = {
    id: state.nextTaskId(type),
    type,
    target: { x: plot.tile.x, y: plot.tile.y },
    nodeId,
    workTile:
      type === "till_soil"
        ? tillStanceWorkTile(state.grid, plot.tile)
        : { x: plot.tile.x, y: plot.tile.y },
    resourceType: resourceTypeForTask(type),
    state: "available",
  };
  state.tasks[task.id] = task;
  return task;
}

export function createConstructTask(state: GameState, site: ConstructionSite): Task | undefined {
  if (site.status === "completed" || site.status === "cancelled") {
    return undefined;
  }
  if (nodeHasActiveTask(state, site.id)) {
    return undefined;
  }
  const def = buildingById(site.buildingTypeId);
  const origin = { x: site.tileX, y: site.tileY };
  const entrance = entranceTile(origin, def);
  const task: Task = {
    id: state.nextTaskId("construct_building"),
    type: "construct_building",
    target: origin,
    nodeId: site.id,
    constructionSiteId: site.id,
    workTile: { x: entrance.x, y: entrance.y },
    state: "available",
    requiredCapabilities: ["build"],
  };
  state.tasks[task.id] = task;
  return task;
}

function bindConstructionAssignment(state: GameState, task: Task, slime: SlimeState): void {
  if (!isConstructionTask(task.type)) {
    return;
  }
  const site = state.constructionSites[task.constructionSiteId ?? task.nodeId];
  if (!site || site.status === "completed" || site.status === "cancelled") {
    return;
  }
  site.assignedSlimeId = slime.id;
  site.status = "building";
}

export function assignAvailableTasks(state: GameState): void {
  const openTasks = Object.values(state.tasks)
    .filter((task) => task.state === "available")
    .sort((a, b) => a.id.localeCompare(b.id));

  for (const task of openTasks) {
    const slime = pickWorker(state, task);
    if (!slime) {
      continue;
    }
    cancelAmbientBehavior(state, slime);
    task.state = "assigned";
    task.assignedSlimeId = slime.id;
    slime.currentTaskId = task.id;
    bindConstructionAssignment(state, task, slime);
  }
}

export function beginAssignedTask(state: GameState, slime: SlimeState): void {
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task || (task.state !== "assigned" && task.state !== "in_progress")) {
    return;
  }
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, task.workTile);
  if (path === null) {
    cancelTask(state, task, slime, `Task ${task.id} unreachable from ${slime.id}; cancelled.`);
    return;
  }
  task.state = "in_progress";
  slime.state = task.type === "fish_activity" ? "moving_to_fishing" : "moving_to_task";
  slime.destination = task.workTile;
  slime.path = path;
  if (path.length === 0) {
    if (task.type === "fish_activity") {
      return;
    }
    startWorking(slime, task.type === "till_soil" || isConstructionTask(task.type) ? task.target : undefined);
  }
}

export function startWorking(slime: SlimeState, faceTile?: GridPosition): void {
  slime.state = "working";
  slime.workElapsedMs = 0;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.destination = undefined;
  if (faceTile) {
    slime.faceTile = { x: faceTile.x, y: faceTile.y };
  }
}

export function beginCarryToStorage(state: GameState, slime: SlimeState): void {
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, state.storage);
  if (path === null) {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (task && (task.state === "assigned" || task.state === "in_progress")) {
      cancelTask(state, task, slime, `Storage unreachable for ${slime.id}; task ${task.id} cancelled.`);
    } else {
      slime.carriedResource = undefined;
      releaseSlime(slime);
    }
    return;
  }
  slime.state = "carrying_to_storage";
  slime.destination = state.storage;
  slime.path = path;
  if (path.length === 0) {
    deliver(state, slime);
  }
}

export function deliver(state: GameState, slime: SlimeState): void {
  slime.state = "delivering";
  const carried = slime.carriedResource;
  if (carried) {
    state.resources[carried.type] += carried.amount;
    slime.carriedResource = undefined;
  }
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (task && task.state !== "completed" && task.state !== "cancelled") {
    task.state = "completed";
  }
  releaseSlime(slime);
}

export function cancelTask(
  state: GameState,
  task: Task,
  slime: SlimeState | undefined,
  message: string,
  options?: { recreateConstruction?: boolean },
): void {
  if (isFishingTask(task.type)) {
    const opportunity = state.opportunities.find((entry) => entry.taskId === task.id);
    if (opportunity) {
      cancelFishingOpportunity(state, opportunity.id);
      return;
    }
  }
  const siteId = isConstructionTask(task.type) ? (task.constructionSiteId ?? task.nodeId) : undefined;
  const site = siteId ? state.constructionSites[siteId] : undefined;
  task.state = "cancelled";
  task.assignedSlimeId = undefined;
  state.warnOnce(`task:${task.id}`, message);
  if (site && site.status !== "completed" && site.status !== "cancelled") {
    site.assignedSlimeId = undefined;
    site.status = "awaiting_builder";
  }
  if (slime) {
    slime.carriedResource = undefined;
    const recoverPlot =
      task.type === "till_soil" || task.type === "plant_crop" || task.type === "harvest_crop"
        ? { x: task.target.x, y: task.target.y }
        : undefined;
    releaseSlime(slime);
    if (recoverPlot) {
      if (task.type === "till_soil") {
        startTillRecoverHop(slime, recoverPlot);
      } else {
        startPlotWorkRecoverHop(slime, recoverPlot);
      }
    }
  }
  if (
    options?.recreateConstruction !== false &&
    site &&
    site.status !== "completed" &&
    site.status !== "cancelled"
  ) {
    createConstructTask(state, site);
  }
}

export function clearActiveTasks(state: GameState): void {
  for (const task of state.activeTasks()) {
    const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
    cancelTask(state, task, slime, `Task ${task.id} cleared.`);
  }
}

export function releaseSlime(slime: SlimeState): void {
  slime.state = "idle";
  slime.currentTaskId = undefined;
  slime.destination = undefined;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.workElapsedMs = 0;
  slime.tillRecoverPlot = undefined;
}

export function slimeAtDestination(slime: SlimeState, dest: GridPosition): boolean {
  return positionsEqual({ x: slime.tileX, y: slime.tileY }, dest) && slime.path.length === 0 && !slime.hopTo;
}
