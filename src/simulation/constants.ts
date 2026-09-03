/** Fixed simulation rate. Gameplay must not advance with render FPS. */
export const SIMULATION_TICKS_PER_SECOND = 4;
export const SIMULATION_TICK_MS = 1000 / SIMULATION_TICKS_PER_SECOND;

export const SLIME_HOP_DURATION_MS = 800;
export const SLIME_HOP_HEIGHT_PX = 7;

export const WORK_DURATION_MS = 1250;
export const GATHER_AMOUNT = 2;

/** Idle wait before a possible 1-tile wander, in ticks. */
export const IDLE_WANDER_DELAY_TICKS = {
  min: 10,
  max: 22,
} as const;

export const STORAGE_TILE = { x: 10, y: 8 } as const;
