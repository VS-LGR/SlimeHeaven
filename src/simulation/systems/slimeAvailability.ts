import type { GameState } from "../GameState";
import type { SlimeState } from "../entities/SlimeState";
import { isVillageResident } from "../data/residents";
import { EAT_FOOD_COST, hungerState } from "../needsConfig";

export function isFishingBusy(slime: SlimeState): boolean {
  return (
    slime.state === "moving_to_fishing" ||
    slime.state === "fishing_wait" ||
    slime.state === "fishing_bite"
  );
}

export function isAmbientState(slime: SlimeState): boolean {
  return slime.state === "moving_to_ambient" || slime.state === "ambient";
}

export function isProductiveBusy(slime: SlimeState): boolean {
  return (
    Boolean(slime.currentTaskId) ||
    slime.state === "moving_to_task" ||
    slime.state === "working" ||
    slime.state === "carrying_to_storage" ||
    slime.state === "delivering" ||
    slime.state === "moving_to_food" ||
    slime.state === "eating" ||
    isFishingBusy(slime)
  );
}

export function isIdleAvailable(state: GameState, slime: SlimeState): boolean {
  return isJobAssignable(state, slime);
}

export function isJobAssignable(state: GameState, slime: SlimeState): boolean {
  if (!isVillageResident(slime)) {
    return false;
  }
  if (hungerState(slime.satiety) === "starving" && state.resources.food >= EAT_FOOD_COST) {
    return false;
  }
  if (isFishingBusy(slime) || slime.state === "moving_to_food" || slime.state === "eating") {
    return false;
  }
  if (slime.state === "working" || slime.state === "carrying_to_storage" || slime.state === "delivering") {
    return false;
  }
  if (slime.state === "moving_to_task" && slime.currentTaskId) {
    return false;
  }
  if (slime.currentTaskId && !isAmbientState(slime)) {
    return false;
  }
  if (slime.state === "idle" || isAmbientState(slime)) {
    return true;
  }
  return false;
}

export function isAmbientEligible(state: GameState, slime: SlimeState): boolean {
  if (!isVillageResident(slime)) {
    return false;
  }
  if (isProductiveBusy(slime) || isAmbientState(slime)) {
    return false;
  }
  if (slime.state !== "idle" || slime.hopTo) {
    return false;
  }
  if (slime.fishingCelebrateUntilTick > state.tickIndex) {
    return false;
  }
  if (hungerState(slime.satiety) === "starving" && state.resources.food >= EAT_FOOD_COST) {
    return false;
  }
  return true;
}

export function slimeMode(slime: SlimeState): "JOB" | "NEED" | "AMBIENT" | "IDLE" {
  if (slime.state === "moving_to_food" || slime.state === "eating") {
    return "NEED";
  }
  if (isAmbientState(slime)) {
    return "AMBIENT";
  }
  if (isProductiveBusy(slime) || slime.state === "moving_to_task") {
    return "JOB";
  }
  return "IDLE";
}

export function maxIdleInstinct(state: GameState): number {
  let best = ATTR_FALLBACK;
  let found = false;
  for (const slime of Object.values(state.slimes)) {
    if (!isJobAssignable(state, slime)) {
      continue;
    }
    found = true;
    best = Math.max(best, slime.attributes.instinct);
  }
  if (found) {
    return best;
  }
  for (const slime of Object.values(state.slimes)) {
    best = Math.max(best, slime.attributes.instinct);
  }
  return best;
}

const ATTR_FALLBACK = 3;
