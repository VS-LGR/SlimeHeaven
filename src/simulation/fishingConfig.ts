import { SIMULATION_TICK_MS } from "./constants";

/** Development timings. Not final balance. */
export const FISHING = {
  maxActivities: 3,
  spawnIntervalTicks: { min: 8, max: 16 },
  activityLifetimeTicks: { min: 32, max: 80 },
  clueOnTicks: { min: 3, max: 6 },
  clueOffTicks: { min: 4, max: 8 },
  castRadiusPx: 64,
  clueHitRadiusPx: 48,
  emptyWaitTicks: 8,
  arriveTicks: 1,
  castTicks: 2,
  biteDisplayTicks: 2,
  perfectZoneFactor: 0.2,
  perfectZoneMin: 0.04,
  fightPassesBeforeTimeout: 2,
  caughtRevealMs: 1400,
  newCatchRevealMs: 2200,
  pondMaxTiles: 12,
  techniqueZoneBonusPerPoint: 0.06,
  strengthPeriodBonusPerPoint: 0.07,
  instinctClueOnBonusPerPoint: 0.08,
  luckWidenChanceFactor: 0.15,
  luckWidenAmount: 0.12,
  distancePenaltyPerTile: 0.12,
  challengeMatchWeight: 0.15,
} as const;

export function msToTicks(ms: number): number {
  return Math.max(1, Math.ceil(ms / SIMULATION_TICK_MS));
}

/** Instinct lengthens clue-on pulses. Uses max Instinct among idle-available slimes. */
export function instinctScaledClueOnTicks(instinct: number): { min: number; max: number } {
  const onBonus = 1 + FISHING.instinctClueOnBonusPerPoint * (instinct - 1);
  const min = Math.max(1, Math.round(FISHING.clueOnTicks.min * onBonus));
  const max = Math.max(min, Math.round(FISHING.clueOnTicks.max * onBonus));
  return { min, max };
}
