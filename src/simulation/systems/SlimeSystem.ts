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
  deliver,
  releaseSlime,
  slimeAtDestination,
  startWorking,
} from "./JobSystem";
import { completeHarvest, completePlant, completeTill } from "./FarmSystem";
import { startPlotWorkRecoverHop, startTillRecoverHop } from "./tillStance";
import { startEating } from "./NeedsSystem";
import { beginFishingOnArrival, releaseOrphanedFishingSlime } from "./FishingSystem";
import { syncOpportunityFromSlime } from "./FishingOpportunitySystem";
import { finishAmbientArrival, tickAmbientActing } from "./AmbientBehaviorSystem";

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

function finishWork(state: GameState, slime: SlimeState): void {
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task) {
    slime.state = "idle";
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
        startWorking(slime, task.type === "till_soil" ? task.target : undefined);
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
