import { findPath } from "@/src/world/pathfinding";
import type { GameState } from "../GameState";
import { isVillageResident } from "../data/residents";
import type { SlimeState } from "../entities/SlimeState";
import {
  clampSatiety,
  EAT_FOOD_COST,
  hungerState,
  SATIETY_DECAY_PER_TICK,
} from "../needsConfig";
import { cancelTask, releaseSlime } from "./JobSystem";
import { cancelAmbientBehavior } from "./AmbientBehaviorSystem";

export function tryConsumeFood(state: GameState, amount: number): boolean {
  if (state.resources.food < amount) {
    return false;
  }
  state.resources.food -= amount;
  return true;
}

export function isSeekingFood(slime: SlimeState): boolean {
  return slime.state === "moving_to_food" || slime.state === "eating";
}

export function tickNeeds(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    if (!isVillageResident(slime)) {
      continue;
    }
    slime.satiety = clampSatiety(slime.satiety - SATIETY_DECAY_PER_TICK);
    maybeSeekFood(state, slime);
  }
}

function maybeSeekFood(state: GameState, slime: SlimeState): void {
  if (isSeekingFood(slime)) {
    return;
  }

  const hunger = hungerState(slime.satiety);
  const foodReady = state.resources.food >= EAT_FOOD_COST;

  if (hunger === "starving") {
    if (
      slime.state === "carrying_to_storage" ||
      slime.state === "delivering" ||
      slime.state === "moving_to_fishing" ||
      slime.state === "fishing_wait" ||
      slime.state === "fishing_bite"
    ) {
      return;
    }
    if (foodReady) {
      interruptForFood(state, slime);
    }
    return;
  }
}

function interruptForFood(state: GameState, slime: SlimeState): void {
  cancelAmbientBehavior(state, slime);
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (task && (task.state === "assigned" || task.state === "in_progress" || task.state === "available")) {
    cancelTask(state, task, slime, `${slime.id} interrupted work to eat; task ${task.id} cancelled.`);
  }
  beginMovingToFood(state, slime);
}

export function beginMovingToFood(state: GameState, slime: SlimeState): void {
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, state.storage);
  if (path === null) {
    state.warnOnce(`eat:${slime.id}`, `Storage unreachable for ${slime.id}; cannot eat.`);
    if (slime.state !== "idle") {
      releaseSlime(slime);
    }
    return;
  }
  slime.state = "moving_to_food";
  slime.destination = state.storage;
  slime.path = path;
  slime.currentTaskId = undefined;
  if (path.length === 0) {
    startEating(state, slime);
  }
}

export function startEating(state: GameState, slime: SlimeState): void {
  if (!tryConsumeFood(state, EAT_FOOD_COST)) {
    releaseSlime(slime);
    return;
  }
  slime.state = "eating";
  slime.workElapsedMs = 0;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.destination = undefined;
}
