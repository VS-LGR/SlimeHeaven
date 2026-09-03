import { findPath } from "@/src/world/pathfinding";
import type { GameState } from "../GameState";
import { FISHING } from "../fishingConfig";
import { FISH } from "../data/fish";
import { JOB_ATTRIBUTE_WEIGHTS, getAttributeContribution } from "../slimeAttributes";
import { removeFishingSession } from "../entities/FishingSession";
import type { FishingCandidateScore, FishingOpportunity } from "../entities/FishingOpportunity";
import type { FishingAccessPoint } from "../entities/WaterBody";
import type { AquaticActivity } from "../entities/AquaticActivity";
import type { SlimeState } from "../entities/SlimeState";
import type { Task } from "../entities/Task";
import { activityById, findActivityInRadius, releaseReservation, reserveActivity } from "./AquaticActivitySystem";
import { isIdleAvailable } from "./slimeAvailability";
import { cancelAmbientBehavior } from "./AmbientBehaviorSystem";
import { accessPointById, isLandTileReserved } from "../waterBodies";
import { TILE_SIZE } from "@/src/world/constants";
import {
  explainCapabilityEligibility,
  hasRequiredCapabilities,
  playerCapableBusyMessage,
  playerCapabilityRequiredMessage,
  type JobEligibilityLine,
  type JobFeedback,
} from "../slimeCapabilities";

export function opportunityById(state: GameState, id: string | null): FishingOpportunity | undefined {
  if (!id) {
    return undefined;
  }
  return state.opportunities.find((entry) => entry.id === id);
}

export function commitFishingOpportunity(state: GameState, activityId: string): boolean {
  const activity = activityById(state, activityId);
  if (!activity || activity.state !== "active") {
    state.lastJobFeedback = { reason: "no_activity", message: "" };
    return false;
  }
  const points = validAccessPointsFor(state, activity);
  state.lastFishingEligibility = diagnoseFishingCandidates(state, points);
  if (points.length === 0) {
    state.lastFishingScores = [];
    state.lastJobFeedback = { reason: "no_access", message: "" };
    return false;
  }
  const scored = scoreFishingCandidates(state, activity, points);
  state.lastFishingScores = scored;
  const best = scored[0];
  if (!best) {
    state.lastJobFeedback = fishingUnavailableFeedback(state);
    return false;
  }
  const slime = state.slimes[best.slimeId];
  const access = accessPointById(state.fishingAccessPoints, best.accessPointId);
  if (!slime || !access || !isIdleAvailable(state, slime)) {
    state.lastJobFeedback = fishingUnavailableFeedback(state);
    return false;
  }
  cancelAmbientBehavior(state, slime);

  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, access.landTile);
  if (path === null) {
    state.lastJobFeedback = { reason: "no_access", message: "" };
    return false;
  }

  state.lastJobFeedback = null;

  const opportunity: FishingOpportunity = {
    id: state.nextOpportunityId(),
    activityId: activity.id,
    speciesId: activity.speciesId,
    waterBodyId: activity.waterBodyId,
    activityPosition: { x: activity.tileX, y: activity.tileY },
    validAccessPointIds: points.map((point) => point.id),
    state: "assigned",
    assignedSlimeId: slime.id,
    accessPointId: access.id,
    taskId: null,
  };

  const task: Task = {
    id: state.nextTaskId("fish_activity"),
    type: "fish_activity",
    target: { x: activity.tileX, y: activity.tileY },
    nodeId: opportunity.id,
    workTile: { ...access.landTile },
    state: "assigned",
    assignedSlimeId: slime.id,
  };
  opportunity.taskId = task.id;
  state.tasks[task.id] = task;
  slime.currentTaskId = task.id;
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.state = "moving_to_fishing";
  slime.destination = { ...access.landTile };
  slime.path = path;
  task.state = "in_progress";
  opportunity.state = "slime_traveling";
  access.reservedBy = opportunity.id;
  reserveActivity(activity, opportunity.id);
  state.opportunities.push(opportunity);
  return true;
}

export function commitFishingAtWorld(state: GameState, worldX: number, worldY: number): boolean {
  const activity = findActivityInRadius(state, worldX, worldY, FISHING.clueHitRadiusPx);
  if (!activity) {
    state.lastJobFeedback = { reason: "no_activity", message: "" };
    return false;
  }
  return commitFishingOpportunity(state, activity.id);
}

const FISHING_REQUIRED = ["fishing"] as const;

export function scoreFishingCandidates(
  state: GameState,
  activity: AquaticActivity,
  points: FishingAccessPoint[],
): FishingCandidateScore[] {
  const results: FishingCandidateScore[] = [];
  const challenge = FISH[activity.speciesId].challenge;
  for (const slime of Object.values(state.slimes)) {
    if (!hasRequiredCapabilities(slime, FISHING_REQUIRED)) {
      continue;
    }
    if (!isIdleAvailable(state, slime)) {
      continue;
    }
    const best = bestReachableAccess(state, slime, points);
    if (!best) {
      continue;
    }
    const affinity = slime.jobAffinity?.fishing ?? 1;
    const contribution = getAttributeContribution(slime.attributes, JOB_ATTRIBUTE_WEIGHTS.fishing);
    const match =
      FISHING.challengeMatchWeight *
      (slime.attributes.technique - challenge.techniqueDemand +
        slime.attributes.strength - challenge.strengthDemand +
        slime.attributes.instinct - challenge.instinctDemand);
    const score = affinity + contribution + match - best.pathLength * FISHING.distancePenaltyPerTile;
    results.push({
      slimeId: slime.id,
      name: slime.name,
      score,
      accessPointId: best.point.id,
      pathLength: best.pathLength,
    });
  }
  return results.sort((a, b) => b.score - a.score);
}

export function diagnoseFishingCandidates(
  state: GameState,
  points: FishingAccessPoint[],
): JobEligibilityLine[] {
  return Object.values(state.slimes).map((slime) => {
    const capable = hasRequiredCapabilities(slime, FISHING_REQUIRED);
    const available = isIdleAvailable(state, slime);
    const reachable =
      capable && available ? Boolean(bestReachableAccess(state, slime, points)) : true;
    return explainCapabilityEligibility(slime, FISHING_REQUIRED, available, reachable);
  });
}

export function fishingUnavailableFeedback(state: GameState): JobFeedback {
  const capable = Object.values(state.slimes).filter((slime) =>
    hasRequiredCapabilities(slime, FISHING_REQUIRED),
  );
  if (capable.length === 0) {
    return { reason: "no_capable", message: playerCapabilityRequiredMessage("fishing") };
  }
  const idleCapable = capable.filter((slime) => isIdleAvailable(state, slime));
  if (idleCapable.length === 0) {
    return {
      reason: "capable_busy",
      message: playerCapableBusyMessage(capable.map((slime) => slime.name)),
    };
  }
  return { reason: "no_access", message: "" };
}

function bestReachableAccess(
  state: GameState,
  slime: SlimeState,
  points: FishingAccessPoint[],
): { point: FishingAccessPoint; pathLength: number } | undefined {
  let best: { point: FishingAccessPoint; pathLength: number } | undefined;
  for (const point of points) {
    if (point.reservedBy || isLandTileReserved(state.fishingAccessPoints, point.landTile)) {
      continue;
    }
    const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, point.landTile);
    if (path === null) {
      continue;
    }
    const pathLength = path.length;
    if (!best || pathLength < best.pathLength) {
      best = { point, pathLength };
    }
  }
  return best;
}

export function validAccessPointsFor(state: GameState, activity: AquaticActivity): FishingAccessPoint[] {
  return state.fishingAccessPoints.filter((point) => {
    if (!point.enabled || point.waterBodyId !== activity.waterBodyId) {
      return false;
    }
    if (point.reservedBy || isLandTileReserved(state.fishingAccessPoints, point.landTile)) {
      return false;
    }
    if (!point.reachableDepths.includes(activity.depth)) {
      return false;
    }
    const water = state.fishingSpots.find(
      (spot) => spot.tileX === point.waterTile.x && spot.tileY === point.waterTile.y,
    );
    const originX = water?.worldX ?? point.waterTile.x * TILE_SIZE + TILE_SIZE / 2;
    const originY = water?.worldY ?? point.waterTile.y * TILE_SIZE + TILE_SIZE / 2;
    const dx = activity.worldX - originX;
    const dy = activity.worldY - originY;
    return dx * dx + dy * dy <= FISHING.castRadiusPx * FISHING.castRadiusPx;
  });
}

export function syncOpportunityFromSlime(state: GameState, slime: SlimeState): void {
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task || task.type !== "fish_activity") {
    return;
  }
  const opportunity = state.opportunities.find((entry) => entry.taskId === task.id);
  if (!opportunity) {
    return;
  }
  if (slime.state === "moving_to_fishing") {
    opportunity.state = "slime_traveling";
  }
  if (slime.state === "fishing_wait") {
    opportunity.state = "fishing";
  }
  if (slime.state === "fishing_bite") {
    opportunity.state = "bite";
  }
}

export function cancelFishingOpportunity(state: GameState, opportunityId: string | null): void {
  const opportunity = opportunityById(state, opportunityId);
  if (!opportunity) {
    return;
  }
  if (opportunity.state === "caught" || opportunity.state === "escaped" || opportunity.state === "expired") {
    return;
  }
  const access = accessPointById(state.fishingAccessPoints, opportunity.accessPointId);
  if (access && access.reservedBy === opportunity.id) {
    access.reservedBy = null;
  }
  const activity = activityById(state, opportunity.activityId);
  releaseReservation(activity, opportunity.id);
  const task = opportunity.taskId ? state.tasks[opportunity.taskId] : undefined;
  const slime = opportunity.assignedSlimeId ? state.slimes[opportunity.assignedSlimeId] : undefined;
  if (task && task.state !== "completed" && task.state !== "cancelled") {
    task.state = "cancelled";
    task.assignedSlimeId = undefined;
  }
  if (slime && slime.currentTaskId === opportunity.taskId) {
    slime.currentTaskId = undefined;
    if (
      slime.state === "moving_to_fishing" ||
      slime.state === "fishing_wait" ||
      slime.state === "fishing_bite"
    ) {
      slime.state = "idle";
      slime.path = [];
      slime.destination = undefined;
      slime.hopFrom = undefined;
      slime.hopTo = undefined;
    }
  }
  opportunity.state = "expired";
  removeFishingSession(state, { opportunityId: opportunity.id, slimeId: opportunity.assignedSlimeId });
}

export function completeFishingOpportunity(
  state: GameState,
  result: "caught" | "escaped",
  opportunityId: string | null = primaryOpportunityId(state),
): void {
  const opportunity = opportunityById(state, opportunityId);
  if (!opportunity) {
    return;
  }
  opportunity.state = result;
  const access = accessPointById(state.fishingAccessPoints, opportunity.accessPointId);
  if (access && access.reservedBy === opportunity.id) {
    access.reservedBy = null;
  }
  const task = opportunity.taskId ? state.tasks[opportunity.taskId] : undefined;
  if (task && task.state !== "cancelled") {
    task.state = "completed";
  }
  const slime = opportunity.assignedSlimeId ? state.slimes[opportunity.assignedSlimeId] : undefined;
  if (slime) {
    slime.currentTaskId = undefined;
    slime.state = "idle";
    slime.path = [];
    slime.destination = undefined;
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.workElapsedMs = 0;
  }
}

function primaryOpportunityId(state: GameState): string | null {
  return state.fishing.opportunityId;
}

export function tickFishingOpportunities(state: GameState): void {
  for (const opportunity of state.opportunities) {
    if (
      opportunity.state === "caught" ||
      opportunity.state === "escaped" ||
      opportunity.state === "expired"
    ) {
      continue;
    }
    const activity = activityById(state, opportunity.activityId);
    if (!activity || activity.state === "consumed") {
      if (opportunity.state === "slime_traveling" || opportunity.state === "assigned") {
        cancelFishingOpportunity(state, opportunity.id);
      }
    }
  }
}
