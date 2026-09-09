import { findPath, cardinalNeighbors } from "@/src/world/pathfinding";
import type { GridPosition } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import { SLIME_IDS, type SlimeState } from "../entities/SlimeState";
import {
  AMBIENT,
  AMBIENT_BEHAVIORS,
  type AmbientBehaviorDefinition,
  type AmbientBehaviorId,
} from "../ambientConfig";
import type { AmbientInterestProfile } from "../ambientPersonality";
import { isVillageResident } from "../data/residents";
import { isAmbientEligible } from "./slimeAvailability";
import {
  chebyshev,
  interestPointById,
  isFishingReservedLand,
  releaseInterestReservation,
  standTileFor,
} from "./InterestPointSystem";
import type { InterestPoint } from "../entities/InterestPoint";

export function behaviorScore(
  def: AmbientBehaviorDefinition,
  profile: AmbientInterestProfile,
  distance: number,
): number {
  const affinity = profile[def.profileKey] / 5;
  return def.baseWeight * (0.35 + 0.65 * affinity) / (1 + distance * AMBIENT.distanceCostPerTile);
}

export function cancelAmbientBehavior(state: GameState, slime: SlimeState): void {
  if (slime.state !== "moving_to_ambient" && slime.state !== "ambient") {
    return;
  }
  const partnerId = slime.ambientPartnerId;
  releaseInterestReservation(state, slime.id);
  clearAmbient(slime);
  if (partnerId) {
    const partner = state.slimes[partnerId];
    if (partner && partner.ambientPartnerId === slime.id) {
      releaseInterestReservation(state, partner.id);
      clearAmbient(partner);
    }
  }
}

export function clearAllAmbientBehaviors(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
      cancelAmbientBehavior(state, slime);
    }
  }
}

export function tickAmbientBehaviors(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    if (!isVillageResident(slime)) {
      continue;
    }
    if (slime.ambientEmote && state.tickIndex >= slime.ambientEmoteUntilTick) {
      slime.ambientEmote = null;
    }
    if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
      if (slime.ambientTargetId) {
        const point = interestPointById(state, slime.ambientTargetId);
        if (!point) {
          cancelAmbientBehavior(state, slime);
        }
      }
      continue;
    }
    if (!isAmbientEligible(state, slime)) {
      continue;
    }
    if (slime.idleWanderTicks > 0) {
      continue;
    }
    considerAmbient(state, slime);
  }
}

export function finishAmbientArrival(state: GameState, slime: SlimeState): void {
  const def = AMBIENT_BEHAVIORS.find((entry) => entry.id === slime.ambientBehaviorId);
  const duration = def
    ? state.rng.range(def.durationRange.min, def.durationRange.max)
    : AMBIENT.inspectDurationTicks.min;
  slime.state = "ambient";
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.ambientUntilTick = state.tickIndex + duration;
  if (slime.ambientBehaviorId === "observe_water") {
    const point = interestPointById(state, slime.ambientTargetId);
    const access = point?.sourceId
      ? state.fishingAccessPoints.find((entry) => entry.id === point.sourceId)
      : undefined;
    slime.faceTile = access ? { ...access.waterTile } : slime.faceTile;
  }
}

export function tickAmbientActing(state: GameState, slime: SlimeState): void {
  if (slime.ambientTargetId) {
    const point = interestPointById(state, slime.ambientTargetId);
    if (!point || (point.reservedBy && point.reservedBy !== slime.id)) {
      cancelAmbientBehavior(state, slime);
      return;
    }
  }
  if (slime.ambientBehaviorId === "observe_water") {
    maybeWaterReaction(state, slime);
  }
  if (state.tickIndex >= slime.ambientUntilTick) {
    completeAmbient(state, slime);
  }
}

export function forceAmbientBehavior(state: GameState, slimeId: string, behaviorId: AmbientBehaviorId): boolean {
  const slime = state.slimes[slimeId];
  if (!slime) {
    return false;
  }
  cancelAmbientBehavior(state, slime);
  if (slime.currentTaskId) {
    return false;
  }
  if (behaviorId === "social_greet") {
    return startSocialGreet(state, slime, true);
  }
  return startBehavior(state, slime, behaviorId, true);
}

export function forceSocialGreet(state: GameState): boolean {
  const pingo = state.slimes[SLIME_IDS.PINGO];
  if (!pingo) {
    return false;
  }
  cancelAmbientBehavior(state, pingo);
  return startSocialGreet(state, pingo, true);
}

function considerAmbient(state: GameState, slime: SlimeState): void {
  slime.idleWanderTicks = nextConsiderDelay(state);
  if (state.tickIndex < slime.ambientCooldownUntilTick) {
    return;
  }
  if (state.rng.next() < AMBIENT.idleStayChance) {
    return;
  }
  const weighted: Array<{ item: AmbientBehaviorId; weight: number }> = [];
  for (const def of AMBIENT_BEHAVIORS) {
    const distance = previewDistance(state, slime, def);
    if (distance === null) {
      continue;
    }
    const score = behaviorScore(def, slime.interest, distance);
    if (score > 0) {
      weighted.push({ item: def.id, weight: score });
    }
  }
  if (weighted.length === 0) {
    return;
  }
  const picked = state.rng.pickWeighted(weighted);
  startBehavior(state, slime, picked, false);
}

function startBehavior(
  state: GameState,
  slime: SlimeState,
  behaviorId: AmbientBehaviorId,
  forced: boolean,
): boolean {
  if (behaviorId === "social_greet") {
    return startSocialGreet(state, slime, forced);
  }
  if (behaviorId === "wander") {
    return startWander(state, slime);
  }
  if (behaviorId === "rest") {
    beginAmbientStay(slime, "rest", undefined, state.tickIndex + durationFor(state, "rest"));
    return true;
  }
  const def = AMBIENT_BEHAVIORS.find((entry) => entry.id === behaviorId);
  if (!def) {
    return false;
  }
  const chosen = pickInterest(state, slime, def, forced);
  if (!chosen) {
    return false;
  }
  const stand = standTileFor(state, chosen.point);
  if (!stand) {
    return false;
  }
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, stand);
  if (path === null) {
    return false;
  }
  chosen.point.reservedBy = slime.id;
  slime.ambientBehaviorId = behaviorId;
  slime.ambientTargetId = chosen.point.id;
  slime.ambientPartnerId = undefined;
  slime.destination = stand;
  slime.path = path;
  slime.faceTile = { ...chosen.point.tile };
  if (path.length === 0) {
    finishAmbientArrival(state, slime);
    return true;
  }
  slime.state = "moving_to_ambient";
  return true;
}

function startWander(state: GameState, slime: SlimeState): boolean {
  const dest = pickWanderTile(state, slime);
  if (!dest) {
    return false;
  }
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, dest);
  if (path === null || path.length === 0) {
    return false;
  }
  slime.ambientBehaviorId = "wander";
  slime.ambientTargetId = undefined;
  slime.destination = dest;
  slime.path = path;
  slime.state = "moving_to_ambient";
  slime.ambientUntilTick = state.tickIndex + path.length + 1;
  return true;
}

function startSocialGreet(state: GameState, slime: SlimeState, forced: boolean): boolean {
  const partner = pickGreetPartner(state, slime, forced);
  if (!partner) {
    return false;
  }
  const dest = adjacentStand(state, slime, partner);
  if (!dest) {
    return false;
  }
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, dest);
  if (path === null) {
    return false;
  }
  const until = state.tickIndex + durationFor(state, "social_greet") + path.length;
  slime.ambientBehaviorId = "social_greet";
  slime.ambientPartnerId = partner.id;
  slime.destination = dest;
  slime.path = path;
  slime.faceTile = { x: partner.tileX, y: partner.tileY };
  slime.state = path.length === 0 ? "ambient" : "moving_to_ambient";
  slime.ambientUntilTick = until;
  partner.ambientBehaviorId = "social_greet";
  partner.ambientPartnerId = slime.id;
  partner.faceTile = { x: slime.tileX, y: slime.tileY };
  partner.state = "ambient";
  partner.ambientUntilTick = until;
  partner.ambientEmote = "!";
  partner.ambientEmoteUntilTick = state.tickIndex + AMBIENT.emoteTicks;
  if (path.length === 0) {
    slime.state = "ambient";
    slime.ambientEmote = "!";
    slime.ambientEmoteUntilTick = state.tickIndex + AMBIENT.emoteTicks;
  }
  return true;
}

function completeAmbient(state: GameState, slime: SlimeState): void {
  if (slime.ambientBehaviorId === "social_greet") {
    slime.ambientCooldownUntilTick = state.tickIndex + AMBIENT.socialCooldownTicks;
    const partner = slime.ambientPartnerId ? state.slimes[slime.ambientPartnerId] : undefined;
    releaseInterestReservation(state, slime.id);
    clearAmbient(slime);
    if (partner && partner.ambientPartnerId === slime.id) {
      partner.ambientCooldownUntilTick = state.tickIndex + AMBIENT.socialCooldownTicks;
      clearAmbient(partner);
    }
    return;
  }
  slime.ambientCooldownUntilTick = state.tickIndex + AMBIENT.behaviorCooldownTicks;
  releaseInterestReservation(state, slime.id);
  clearAmbient(slime);
}

function clearAmbient(slime: SlimeState): void {
  if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
    slime.state = "idle";
  }
  slime.ambientBehaviorId = undefined;
  slime.ambientTargetId = undefined;
  slime.ambientPartnerId = undefined;
  slime.ambientUntilTick = 0;
  slime.destination = undefined;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.faceTile = undefined;
}

function beginAmbientStay(
  slime: SlimeState,
  behaviorId: AmbientBehaviorId,
  targetId: string | undefined,
  untilTick: number,
): void {
  slime.state = "ambient";
  slime.ambientBehaviorId = behaviorId;
  slime.ambientTargetId = targetId;
  slime.ambientUntilTick = untilTick;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
}

function previewDistance(
  state: GameState,
  slime: SlimeState,
  def: AmbientBehaviorDefinition,
): number | null {
  if (def.id === "rest") {
    return 0;
  }
  if (def.id === "wander") {
    return AMBIENT.wanderRadius.min;
  }
  if (def.id === "social_greet") {
    const partner = pickGreetPartner(state, slime, false);
    if (!partner) {
      return null;
    }
    return chebyshev({ x: slime.tileX, y: slime.tileY }, { x: partner.tileX, y: partner.tileY });
  }
  const chosen = pickInterest(state, slime, def, false);
  return chosen ? chosen.distance : null;
}

function pickInterest(
  state: GameState,
  slime: SlimeState,
  def: AmbientBehaviorDefinition,
  forced = false,
): { point: InterestPoint; distance: number } | undefined {
  let best: { point: InterestPoint; distance: number; score: number } | undefined;
  for (const point of state.interestPoints) {
    if (def.validInterestTags.length > 0 && !def.validInterestTags.some((tag) => point.tags.includes(tag))) {
      continue;
    }
    if (point.reservedBy && point.reservedBy !== slime.id) {
      continue;
    }
    if (def.id === "observe_water" && point.sourceId) {
      const access = state.fishingAccessPoints.find((entry) => entry.id === point.sourceId);
      if (access?.reservedBy) {
        continue;
      }
    }
    const stand = standTileFor(state, point);
    if (!stand) {
      continue;
    }
    const distance = chebyshev({ x: slime.tileX, y: slime.tileY }, stand);
    if (!forced && distance > AMBIENT.maxInterestDistance) {
      continue;
    }
    const score = behaviorScore(def, slime.interest, distance);
    if (!best || score > best.score) {
      best = { point, distance, score };
    }
  }
  return best;
}

function pickWanderTile(state: GameState, slime: SlimeState): GridPosition | undefined {
  const options: GridPosition[] = [];
  const min = AMBIENT.wanderRadius.min;
  const max = AMBIENT.wanderRadius.max;
  for (let dy = -max; dy <= max; dy += 1) {
    for (let dx = -max; dx <= max; dx += 1) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      if (dist < min || dist > max) {
        continue;
      }
      const tile = { x: slime.tileX + dx, y: slime.tileY + dy };
      if (!state.grid.isWalkable(tile.x, tile.y) || isFishingReservedLand(state, tile)) {
        continue;
      }
      options.push(tile);
    }
  }
  if (options.length === 0) {
    return undefined;
  }
  return state.rng.pick(options);
}

function pickGreetPartner(state: GameState, slime: SlimeState, forced: boolean): SlimeState | undefined {
  let best: SlimeState | undefined;
  let bestDist = Infinity;
  for (const other of Object.values(state.slimes)) {
    if (other.id === slime.id) {
      continue;
    }
    if (!forced && state.tickIndex < other.ambientCooldownUntilTick) {
      continue;
    }
    if (!isAmbientEligible(state, other) && other.state !== "idle") {
      continue;
    }
    if (other.state !== "idle" && other.state !== "ambient") {
      continue;
    }
    if (other.currentTaskId) {
      continue;
    }
    const dist = chebyshev({ x: slime.tileX, y: slime.tileY }, { x: other.tileX, y: other.tileY });
    if (!forced && dist > AMBIENT.socialRadius) {
      continue;
    }
    if (dist < bestDist) {
      best = other;
      bestDist = dist;
    }
  }
  return best;
}

function adjacentStand(state: GameState, from: SlimeState, to: SlimeState): GridPosition | undefined {
  const here = { x: from.tileX, y: from.tileY };
  if (chebyshev(here, { x: to.tileX, y: to.tileY }) <= 1) {
    return here;
  }
  for (const neighbor of cardinalNeighbors(to.tileX, to.tileY)) {
    if (state.grid.isWalkable(neighbor.x, neighbor.y) && !isFishingReservedLand(state, neighbor)) {
      return neighbor;
    }
  }
  return undefined;
}

function maybeWaterReaction(state: GameState, slime: SlimeState): void {
  if (slime.ambientEmote && state.tickIndex < slime.ambientEmoteUntilTick) {
    return;
  }
  const nearby = state.activities.some((activity) => {
    if (activity.state === "consumed") {
      return false;
    }
    return chebyshev({ x: slime.tileX, y: slime.tileY }, { x: activity.tileX, y: activity.tileY }) <= 4;
  });
  if (!nearby) {
    return;
  }
  if (state.rng.next() > 0.2) {
    return;
  }
  slime.ambientEmote = state.rng.next() < 0.5 ? "?" : "!";
  slime.ambientEmoteUntilTick = state.tickIndex + AMBIENT.emoteTicks;
}

function durationFor(state: GameState, id: AmbientBehaviorId): number {
  const def = AMBIENT_BEHAVIORS.find((entry) => entry.id === id);
  if (!def) {
    return AMBIENT.inspectDurationTicks.min;
  }
  return state.rng.range(def.durationRange.min, def.durationRange.max);
}

function nextConsiderDelay(state: GameState): number {
  return state.rng.range(AMBIENT.considerDelayTicks.min, AMBIENT.considerDelayTicks.max);
}
