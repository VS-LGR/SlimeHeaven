/** Fixed simulation rate. Gameplay must not advance with render FPS. */
export const SIMULATION_TICKS_PER_SECOND = 4;
export const SIMULATION_TICK_MS = 1000 / SIMULATION_TICKS_PER_SECOND;

export const SLIME_HOP_DURATION_MS = 800;
export const SLIME_HOP_HEIGHT_PX = 7;

export const WORK_DURATION_MS = 1250;
export const GATHER_AMOUNT = 2;
export const FOLIAGE_GATHER_AMOUNT = 1;
export const COPPER_ORE_GATHER_AMOUNT = 1;
/** Authoritative world-time regen. Not a wall-clock timer. */
export const FOLIAGE_REGEN_GAME_MINUTES = 6 * 60;
export const COPPER_MINING_DURATION_MULTIPLIER = 2;

export function workDurationMsForTask(type: string): number {
  if (type === "gather_copper") {
    return WORK_DURATION_MS * COPPER_MINING_DURATION_MULTIPLIER;
  }
  return WORK_DURATION_MS;
}

/** Authoritative accumulated construction work. Not animation duration. */
export const BASE_CONSTRUCTION_WORK_MS = 5000;

/** Idle wait before a possible 1-tile wander, in ticks. */
export const IDLE_WANDER_DELAY_TICKS = {
  min: 10,
  max: 22,
} as const;

export const STORAGE_TILE = { x: 10, y: 8 } as const;
