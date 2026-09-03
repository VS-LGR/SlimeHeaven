import { SIMULATION_TICKS_PER_SECOND } from "./constants";

/** Temporary testing values. Not final game balance. */

export const SATIETY_MAX = 100;
export const SATIETY_INITIAL = 100;

/** ~0.14 satiety per second → starving in ~10 minutes from full (threshold 15). */
export const SATIETY_DECAY_PER_SECOND = 0.14;
export const SATIETY_DECAY_PER_TICK = SATIETY_DECAY_PER_SECOND / SIMULATION_TICKS_PER_SECOND;

/**
 * Inclusive lower bounds. Derive one HungerState from satiety.
 * 75–100 fed, 40–74 normal, 15–39 hungry, 0–14 starving.
 */
export const HUNGER_THRESHOLDS = {
  fed: 75,
  normal: 40,
  hungry: 15,
} as const;

export type HungerState = "fed" | "normal" | "hungry" | "starving";

export const WORK_SPEED_HUNGRY = 0.8;

export const EAT_FOOD_COST = 1;
export const EAT_SATIETY_RESTORE = 50;
export const EAT_DURATION_MS = 1000;

export const DEBUG_HUNGRY_SATIETY = 25;
export const DEBUG_ADD_FOOD_AMOUNT = 5;

export function hungerState(satiety: number): HungerState {
  if (satiety >= HUNGER_THRESHOLDS.fed) {
    return "fed";
  }
  if (satiety >= HUNGER_THRESHOLDS.normal) {
    return "normal";
  }
  if (satiety >= HUNGER_THRESHOLDS.hungry) {
    return "hungry";
  }
  return "starving";
}

export function workSpeedMultiplier(satiety: number): number {
  const hunger = hungerState(satiety);
  if (hunger === "hungry" || hunger === "starving") {
    return WORK_SPEED_HUNGRY;
  }
  return 1;
}

export function clampSatiety(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > SATIETY_MAX) {
    return SATIETY_MAX;
  }
  return value;
}
