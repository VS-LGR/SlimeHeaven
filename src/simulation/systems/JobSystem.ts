import { findPath } from "@/src/world/pathfinding";
import { positionsEqual, type GridPosition } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import type { ResourceNode } from "../entities/ResourceNode";
import type { FarmPlot } from "../entities/FarmPlot";
import { farmNodeId } from "../entities/FarmPlot";
import type { FarmTaskType, GatherTaskType, Task } from "../entities/Task";
import { isConstructionTask, isGatherTask, jobCategory, resourceTypeForTask } from "../entities/Task";
import { SLIME_IDS, type SlimeState } from "../entities/SlimeState";
import { creditStoredResources, hasCargo, RESOURCE_IDS } from "../resources";
import { isIdleAvailable } from "./slimeAvailability";
import { cancelAmbientBehavior } from "./AmbientBehaviorSystem";
import { isFishingTask } from "../entities/Task";
import { cancelFishingOpportunity } from "./FishingOpportunitySystem";
import { FISHING } from "../fishingConfig";
import { JOB_ATTRIBUTE_WEIGHTS, getAttributeContribution } from "../slimeAttributes";
import { canPerformTaskCapabilities } from "../slimeCapabilities";
import { startPlotWorkRecoverHop, startTillRecoverHop, tillStanceWorkTile } from "./tillStance";
import { rebuildInterestPoints } from "./InterestPointSystem";
import type { ConstructionSite } from "../entities/ConstructionSite";
import { buildingById, entranceTile } from "../data/buildings";
import { FOLIAGE_REGEN_GAME_MINUTES } from "../constants";
import { deliveryNoticeFromBundle } from "../data/materials";

const SLIME_ASSIGN_ORDER = [SLIME_IDS.PINGO, SLIME_IDS.MOMO, SLIME_IDS.TITO];

export { isIdleAvailable };

function nodeMatches(type: GatherTaskType, node: ResourceNode): boolean {
  if (type === "gather_wood") {
    return node.type === RESOURCE_IDS.WOOD;
  }
  if (type === "gather_foliage") {
    return node.type === RESOURCE_IDS.FOLIAGE;
  }
  if (type === "gather_copper") {
    return node.type === RESOURCE_IDS.COPPER_ORE;
  }
  return node.type === RESOURCE_IDS.STONE;
}

function nodeHasActiveTask(state: GameState, nodeId: string): boolean {
  return state.activeTasks().some((task) => task.nodeId === nodeId);
}

function occupancyHasActiveTask(state: GameState, occupancyKey: string): boolean {
  return state.activeTasks().some((task) => {
    const node = state.nodeById(task.nodeId);
    return node?.occupancyKey === occupancyKey;
  });
}

function gatherTargetBlocked(state: GameState, node: ResourceNode): boolean {
  if (node.depleted) {
    return true;
  }
  return occupancyHasActiveTask(state, node.occupancyKey);
}

export function isFoliageReady(state: GameState, node: ResourceNode): boolean {
  const readyAt = node.foliageReadyAtMinute ?? 0;
  return state.worldTime.totalGameMinutes >= readyAt;
}

export type FoliageInspectReason = "ready" | "regenerating" | "reserved";

export function inspectFoliageTarget(
  state: GameState,
  tile: GridPosition,
): { node: ResourceNode; valid: boolean; reason: FoliageInspectReason } | null {
  const node = state.gatherNodeAtTile(RESOURCE_IDS.FOLIAGE, tile.x, tile.y);
  if (!node) {
    return null;
  }
  if (occupancyHasActiveTask(state, node.occupancyKey)) {
    return { node, valid: false, reason: "reserved" };
  }
  if (!isFoliageReady(state, node)) {
    return { node, valid: false, reason: "regenerating" };
  }
  return { node, valid: true, reason: "ready" };
}

export function inspectMiningTarget(
  state: GameState,
  tile: GridPosition,
): { type: GatherTaskType; node: ResourceNode; valid: boolean } | null {
  const copper = inspectGatherTarget(state, "gather_copper", tile);
  if (copper) {
    return { type: "gather_copper", node: copper.node, valid: copper.valid };
  }
  const stone = inspectGatherTarget(state, "gather_stone", tile);
  if (stone) {
    return { type: "gather_stone", node: stone.node, valid: stone.valid };
  }
  return null;
}

export function commitFoliageCollection(state: GameState, node: ResourceNode): void {
  node.foliageReadyAtMinute = state.worldTime.totalGameMinutes + FOLIAGE_REGEN_GAME_MINUTES;
}

export function commitCopperDepletion(state: GameState, node: ResourceNode): void {
  if (node.depleted) {
    return;
  }
  node.depleted = true;
  state.grid.removeObjectAt(node.tile.x, node.tile.y);
  state.refreshTileBlocking(node.tile.x, node.tile.y);
  state.markObjectRemoved(node.tile.x, node.tile.y);
  rebuildInterestPoints(state);
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

function createGatherTaskForNode(
  state: GameState,
  type: GatherTaskType,
  node: ResourceNode,
): Task {
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

export function inspectGatherTarget(
  state: GameState,
  type: GatherTaskType,
  tile: GridPosition,
): { node: ResourceNode; valid: boolean } | null {
  const resourceType = resourceTypeForTask(type);
  if (!resourceType) {
    return null;
  }
  const atTile = state.gatherNodeAtTile(resourceType, tile.x, tile.y);
  if (!atTile || !nodeMatches(type, atTile)) {
    return null;
  }
  if (type === "gather_foliage") {
    const foliage = inspectFoliageTarget(state, tile);
    if (!foliage) {
      return null;
    }
    return { node: foliage.node, valid: foliage.valid };
  }
  return { node: atTile, valid: !gatherTargetBlocked(state, atTile) };
}

/** Player designation: never falls back to another node. Debug spawn still uses createGatherTask. */
export function designateGatherAt(
  state: GameState,
  type: GatherTaskType,
  tile: GridPosition,
): Task | undefined {
  const inspected = inspectGatherTarget(state, type, tile);
  if (!inspected?.valid) {
    return undefined;
  }
  return createGatherTaskForNode(state, type, inspected.node);
}

export function createGatherTask(
  state: GameState,
  type: GatherTaskType,
  preferredTile?: GridPosition,
): Task | undefined {
  let node: ResourceNode | undefined;
  if (preferredTile) {
    const inspected = inspectGatherTarget(state, type, preferredTile);
    if (inspected?.valid) {
      node = inspected.node;
    }
  }
  if (!node) {
    node = state.nodes.find((candidate) => {
      if (!nodeMatches(type, candidate) || gatherTargetBlocked(state, candidate)) {
        return false;
      }
      if (type === "gather_foliage" && !isFoliageReady(state, candidate)) {
        return false;
      }
      return true;
    });
  }
  if (!node) {
    return undefined;
  }
  return createGatherTaskForNode(state, type, node);
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
    startWorking(slime, workFaceTile(task));
  }
}

export function workFaceTile(task: Task): GridPosition | undefined {
  if (task.type === "till_soil" || isConstructionTask(task.type) || isGatherTask(task.type)) {
    return task.target;
  }
  return undefined;
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
  if (hasCargo(carried) && carried) {
    creditStoredResources(state.resources, state.discoveredResources, carried);
    slime.carriedResource = undefined;
    const notice = deliveryNoticeFromBundle(slime.name, carried);
    if (notice) {
      state.pendingMaterialToasts.push(notice);
    }
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
