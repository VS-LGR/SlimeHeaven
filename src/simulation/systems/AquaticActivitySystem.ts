import type { GameState } from "../GameState";
import { FISHING, instinctScaledClueOnTicks } from "../fishingConfig";
import { FISH, type FishId, type WaterDepth, isSpeciesValidAtDepth, speciesAtDepth } from "../data/fish";
import type { AquaticActivity, FishingWaterSpot } from "../entities/AquaticActivity";
import { maxIdleInstinct } from "./slimeAvailability";

export function liveActivities(state: GameState): AquaticActivity[] {
  return state.activities.filter((activity) => activity.state !== "consumed");
}

export function activityById(state: GameState, id: string | null): AquaticActivity | undefined {
  if (!id) {
    return undefined;
  }
  return state.activities.find((activity) => activity.id === id);
}

export function findActivityInRadius(
  state: GameState,
  worldX: number,
  worldY: number,
  radiusPx: number = FISHING.castRadiusPx,
): AquaticActivity | undefined {
  const radiusSq = radiusPx * radiusPx;
  let best: AquaticActivity | undefined;
  let bestDist = radiusSq;
  for (const activity of state.activities) {
    if (activity.state !== "active") {
      continue;
    }
    const dx = activity.worldX - worldX;
    const dy = activity.worldY - worldY;
    const dist = dx * dx + dy * dy;
    if (dist <= bestDist) {
      best = activity;
      bestDist = dist;
    }
  }
  return best;
}

export function reserveActivity(activity: AquaticActivity, sessionId: string): void {
  activity.state = "reserved";
  activity.ownerSessionId = sessionId;
  activity.clueVisible = false;
}

export function releaseReservation(activity: AquaticActivity | undefined, sessionId: string): void {
  if (!activity || activity.ownerSessionId !== sessionId || activity.state !== "reserved") {
    return;
  }
  activity.state = "active";
  activity.ownerSessionId = null;
}

export function consumeActivity(activity: AquaticActivity | undefined): void {
  if (!activity) {
    return;
  }
  activity.state = "consumed";
  activity.clueVisible = false;
}

export function clearAquaticActivities(state: GameState): void {
  state.activities = [];
}

export function spawnAquaticAt(
  state: GameState,
  speciesId: FishId,
  tileX: number,
  tileY: number,
): AquaticActivity | null {
  const spot = state.fishingSpots.find((entry) => entry.tileX === tileX && entry.tileY === tileY);
  if (!spot) {
    return null;
  }
  if (!isSpeciesValidAtDepth(speciesId, spot.depth)) {
    return null;
  }
  if (occupiedTiles(state).has(`${tileX},${tileY}`)) {
    const existing = liveActivities(state).find((activity) => activity.tileX === tileX && activity.tileY === tileY);
    return existing ?? null;
  }
  const activity = createActivity(state, speciesId, spot);
  state.activities.push(activity);
  return activity;
}

export function tickAquatic(state: GameState): void {
  expireActivities(state);
  pulseClues(state);
  maybeSpawn(state);
}

function expireActivities(state: GameState): void {
  const tick = state.tickIndex;
  state.activities = state.activities.filter((activity) => {
    if (activity.state === "consumed") {
      return false;
    }
    if (activity.state === "reserved") {
      return true;
    }
    return activity.expiresAtTick > tick;
  });
}

function pulseClues(state: GameState): void {
  const tick = state.tickIndex;
  for (const activity of state.activities) {
    if (activity.state !== "active") {
      continue;
    }
    if (tick < activity.nextClueToggleTick) {
      continue;
    }
    activity.clueVisible = !activity.clueVisible;
    const range = activity.clueVisible
      ? instinctScaledClueOnTicks(maxIdleInstinct(state))
      : FISHING.clueOffTicks;
    activity.nextClueToggleTick = tick + state.rng.range(range.min, range.max);
  }
}

function maybeSpawn(state: GameState): void {
  if (liveActivities(state).length >= FISHING.maxActivities) {
    return;
  }
  if (state.tickIndex < state.nextAquaticSpawnTick) {
    return;
  }
  const spawned = trySpawnRandom(state);
  const interval = FISHING.spawnIntervalTicks;
  state.nextAquaticSpawnTick = state.tickIndex + state.rng.range(interval.min, interval.max);
  if (!spawned && liveActivities(state).length < FISHING.maxActivities) {
    state.nextAquaticSpawnTick = state.tickIndex + 1;
  }
}

function trySpawnRandom(state: GameState): boolean {
  const occupied = occupiedTiles(state);
  const shallow = availableSpots(state.fishingSpots, occupied, "shallow");
  const deep = availableSpots(state.fishingSpots, occupied, "deep");
  const buckets: Array<{ depth: WaterDepth; spots: FishingWaterSpot[] }> = [];
  if (shallow.length > 0 && speciesAtDepth("shallow").length > 0) {
    buckets.push({ depth: "shallow", spots: shallow });
  }
  if (deep.length > 0 && speciesAtDepth("deep").length > 0) {
    buckets.push({ depth: "deep", spots: deep });
  }
  if (buckets.length === 0) {
    return false;
  }
  const bucket = state.rng.pick(buckets);
  const compatible = speciesAtDepth(bucket.depth);
  if (compatible.length === 0) {
    return false;
  }
  const species = state.rng.pickWeighted(
    compatible.map((def) => ({ item: def, weight: def.activityWeight })),
  );
  const spot = state.rng.pick(bucket.spots);
  state.activities.push(createActivity(state, species.id, spot));
  return true;
}

function createActivity(state: GameState, speciesId: FishId, spot: FishingWaterSpot): AquaticActivity {
  const def = FISH[speciesId];
  const lifetime = FISHING.activityLifetimeTicks;
  const onRange = FISHING.clueOnTicks;
  const visible = true;
  return {
    id: state.nextActivityId(),
    speciesId,
    tileX: spot.tileX,
    tileY: spot.tileY,
    worldX: spot.worldX,
    worldY: spot.worldY,
    depth: spot.depth,
    clueType: def.clueType,
    waterBodyId: spot.waterBodyId,
    state: "active",
    ownerSessionId: null,
    expiresAtTick: state.tickIndex + state.rng.range(lifetime.min, lifetime.max),
    clueVisible: visible,
    nextClueToggleTick: state.tickIndex + state.rng.range(onRange.min, onRange.max),
  };
}

function occupiedTiles(state: GameState): Set<string> {
  const tiles = new Set<string>();
  for (const activity of liveActivities(state)) {
    tiles.add(`${activity.tileX},${activity.tileY}`);
  }
  return tiles;
}

function availableSpots(
  spots: readonly FishingWaterSpot[],
  occupied: Set<string>,
  depth: WaterDepth,
): FishingWaterSpot[] {
  return spots.filter((spot) => spot.depth === depth && !occupied.has(`${spot.tileX},${spot.tileY}`));
}
