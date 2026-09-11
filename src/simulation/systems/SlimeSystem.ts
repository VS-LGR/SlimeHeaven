import {
  SIMULATION_TICK_MS,
  SLIME_HOP_DURATION_MS,
  WORK_DURATION_MS,
  GATHER_AMOUNT,
} from "../constants";
import { EAT_DURATION_MS, EAT_SATIETY_RESTORE, SATIETY_MAX, workSpeedMultiplier } from "../needsConfig";
import type { GameState } from "../GameState";
import type { SlimeState } from "../entities/SlimeState";
import {
  beginAssignedTask,
  beginCarryToStorage,
  cancelTask,
  deliver,
  releaseSlime,
  slimeAtDestination,
  startWorking,
  workFaceTile,
} from "./JobSystem";
import { isConstructionTask } from "../entities/Task";
import type { Task } from "../entities/Task";
import { completeHarvest, completePlant, completeTill } from "./FarmSystem";
import { completeConstruction } from "./BuildingSystem";
import { startPlotWorkRecoverHop, startTillRecoverHop } from "./tillStance";
import { startEating } from "./NeedsSystem";
import { beginFishingOnArrival, releaseOrphanedFishingSlime } from "./FishingSystem";
import { syncOpportunityFromSlime } from "./FishingOpportunitySystem";
import { finishAmbientArrival, tickAmbientActing } from "./AmbientBehaviorSystem";
import { cancelVisitorWander, finishVisitorWander, visitorPathStillValid } from "./VisitorSystem";

function startHop(slime: SlimeState, nextX: number, nextY: number): void {
  slime.hopFrom = { x: slime.tileX, y: slime.tileY };
  slime.hopTo = { x: nextX, y: nextY };
  slime.hopElapsedMs = 0;
}

function finishHop(slime: SlimeState): void {
  if (!slime.hopTo) {
    return;
  }
  slime.tileX = slime.hopTo.x;
  slime.tileY = slime.hopTo.y;
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.tillRecoverPlot = undefined;
}

function dequeueHop(slime: SlimeState): boolean {
  const next = slime.path.shift();
  if (!next) {
    return true;
  }
  startHop(slime, next.x, next.y);
  return false;
}

function advanceHop(slime: SlimeState): boolean {
  if (!slime.hopTo) {
    return dequeueHop(slime);
  }

  slime.hopElapsedMs += SIMULATION_TICK_MS;
  if (slime.hopElapsedMs < SLIME_HOP_DURATION_MS) {
    return false;
  }
  finishHop(slime);
  if (slime.path.length === 0) {
    return true;
  }
  return dequeueHop(slime);
}

function tickIdle(state: GameState, slime: SlimeState): void {
  if (slime.currentTaskId) {
    beginAssignedTask(state, slime);
    if (slime.state === "moving_to_fishing") {
      const task = state.tasks[slime.currentTaskId];
      if (task && slimeAtDestination(slime, task.workTile)) {
        beginFishingOnArrival(state, slime);
      } else {
        syncOpportunityFromSlime(state, slime);
      }
    }
    return;
  }

  slime.idleWanderTicks -= 1;
}

function tickHoppingIdle(slime: SlimeState): void {
  slime.hopElapsedMs += SIMULATION_TICK_MS;
  if (slime.hopElapsedMs >= SLIME_HOP_DURATION_MS) {
    finishHop(slime);
  }
}

function tickConstructionWork(state: GameState, slime: SlimeState, task: Task): void {
  const site = state.constructionSites[task.constructionSiteId ?? task.nodeId];
  if (!site || site.status === "cancelled" || site.status === "completed") {
    cancelTask(state, task, slime, `Construction site missing for ${task.id}; cancelled.`, {
      recreateConstruction: false,
    });
    return;
  }
  if (site.assignedSlimeId && site.assignedSlimeId !== slime.id) {
    cancelTask(state, task, slime, `Construction site ${site.id} already has a builder.`, {
      recreateConstruction: false,
    });
    return;
  }

  site.assignedSlimeId = slime.id;
  site.status = "building";
  const delta = SIMULATION_TICK_MS * workSpeedMultiplier(slime.satiety);
  slime.workElapsedMs += delta;
  site.workCompletedMs = Math.min(site.workRequiredMs, site.workCompletedMs + delta);
  if (site.workCompletedMs < site.workRequiredMs) {
    return;
  }
  completeConstruction(state, site.id);
}

function finishWork(state: GameState, slime: SlimeState): void {
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task) {
    slime.state = "idle";
    return;
  }

  if (isConstructionTask(task.type)) {
    tickConstructionWork(state, slime, task);
    return;
  }

  if (task.type === "till_soil") {
    completeTill(state, task);
    task.state = "completed";
    const plot = { x: task.target.x, y: task.target.y };
    releaseSlime(slime);
    startTillRecoverHop(slime, plot);
    return;
  }

  if (task.type === "plant_crop") {
    completePlant(state, task);
    task.state = "completed";
    const plot = { x: task.target.x, y: task.target.y };
    releaseSlime(slime);
    startPlotWorkRecoverHop(slime, plot);
    return;
  }

  if (task.type === "harvest_crop") {
    const amount = completeHarvest(state, task);
    slime.carriedResource = { type: "food", amount };
    task.state = "completed";
    beginCarryToStorage(state, slime);
    return;
  }

  if (!task.resourceType) {
    task.state = "completed";
    releaseSlime(slime);
    return;
  }

  slime.carriedResource = { type: task.resourceType, amount: GATHER_AMOUNT };
  beginCarryToStorage(state, slime);
}

export function tickSlimes(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    tickSlime(state, slime);
  }
}

function tickSlime(state: GameState, slime: SlimeState): void {
  if (slime.state === "idle") {
    if (slime.hopTo) {
      tickHoppingIdle(slime);
      return;
    }
    tickIdle(state, slime);
    return;
  }

  if (slime.state === "moving_to_task" || slime.state === "moving_to_fishing") {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (!task || task.state === "cancelled") {
      slime.carriedResource = undefined;
      slime.state = "idle";
      slime.currentTaskId = undefined;
      slime.path = [];
      slime.hopFrom = undefined;
      slime.hopTo = undefined;
      return;
    }
    const arrived = advanceHop(slime);
    if (arrived && slimeAtDestination(slime, task.workTile)) {
      if (slime.state === "moving_to_fishing" || task.type === "fish_activity") {
        beginFishingOnArrival(state, slime);
      } else {
        startWorking(slime, workFaceTile(task));
      }
      return;
    }
    syncOpportunityFromSlime(state, slime);
    return;
  }

  if (slime.state === "moving_to_ambient") {
    const dest = slime.destination;
    const arrived = advanceHop(slime);
    if (arrived && dest && slimeAtDestination(slime, dest)) {
      finishAmbientArrival(state, slime);
    }
    return;
  }

  if (slime.state === "wandering") {
    if (!visitorPathStillValid(state, slime)) {
      cancelVisitorWander(slime);
      return;
    }
    const dest = slime.destination;
    const arrived = advanceHop(slime);
    if (arrived && dest && slimeAtDestination(slime, dest)) {
      finishVisitorWander(state, slime);
    } else if (arrived && !dest) {
      finishVisitorWander(state, slime);
    }
    return;
  }

  if (slime.state === "ambient") {
    tickAmbientActing(state, slime);
    return;
  }

  if (slime.state === "fishing_wait" || slime.state === "fishing_bite") {
    if (releaseOrphanedFishingSlime(state, slime)) {
      return;
    }
    syncOpportunityFromSlime(state, slime);
    return;
  }

  if (slime.state === "working") {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (task && isConstructionTask(task.type)) {
      tickConstructionWork(state, slime, task);
      return;
    }
    slime.workElapsedMs += SIMULATION_TICK_MS * workSpeedMultiplier(slime.satiety);
    if (slime.workElapsedMs < WORK_DURATION_MS) {
      return;
    }
    finishWork(state, slime);
    return;
  }

  if (slime.state === "carrying_to_storage") {
    const arrived = advanceHop(slime);
    if (arrived && slimeAtDestination(slime, state.storage)) {
      deliver(state, slime);
    }
    return;
  }

  if (slime.state === "delivering") {
    deliver(state, slime);
    return;
  }

  if (slime.state === "moving_to_food") {
    const arrived = advanceHop(slime);
    if (arrived && slimeAtDestination(slime, state.storage)) {
      startEating(state, slime);
    }
    return;
  }

  if (slime.state === "eating") {
    slime.workElapsedMs += SIMULATION_TICK_MS;
    if (slime.workElapsedMs < EAT_DURATION_MS) {
      return;
    }
    slime.satiety = Math.min(SATIETY_MAX, slime.satiety + EAT_SATIETY_RESTORE);
    releaseSlime(slime);
  }
}
