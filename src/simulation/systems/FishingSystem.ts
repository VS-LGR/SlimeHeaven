import type { GameState } from "../GameState";
import { FISHING, msToTicks } from "../fishingConfig";
import { FISH, emptyFishCollection, type FishId } from "../data/fish";
import {
  fishingSessionForSlime,
  fightingSession,
  idleFishingSession,
  isLiveFishingPhase,
  primaryFishingSession,
  removeFishingSession,
  upsertFishingSession,
  type FishingSession,
} from "../entities/FishingSession";
import type { FishingOpportunity } from "../entities/FishingOpportunity";
import type { AquaticActivity } from "../entities/AquaticActivity";
import type { FishingAccessPoint } from "../entities/WaterBody";
import type { SlimeState } from "../entities/SlimeState";
import { clampAttributes, type SlimeAttributes } from "../slimeAttributes";
import {
  activityById,
  consumeActivity,
  releaseReservation,
} from "./AquaticActivitySystem";
import { completeFishingOpportunity, cancelFishingOpportunity, opportunityById } from "./FishingOpportunitySystem";
import { bobberWorldFromAccess } from "../waterBodies";
import { FISHING_SUCCESS_PRESENTATION_HOLD_TICKS } from "../entities/FishingPresentation";

export type StrikeResult = "hit" | "miss" | "ignored";

const DEFAULT_ATTRS: SlimeAttributes = { technique: 3, strength: 3, instinct: 3, luck: 3 };

export function startSlimeFishingSession(
  state: GameState,
  slime: SlimeState,
  opportunity: FishingOpportunity,
  activity: AquaticActivity,
  access: FishingAccessPoint,
): void {
  const bobber = bobberWorldFromAccess(access, activity);
  const delay = FISH[activity.speciesId].biteDelayRangeMs;
  const arriveUntilTick = state.tickIndex + FISHING.arriveTicks;
  const castUntilTick = arriveUntilTick + FISHING.castTicks;
  slime.faceTile = { ...access.waterTile };
  upsertFishingSession(state, {
    ...idleFishingSession(),
    phase: "casting",
    sessionId: state.nextSessionId(),
    tileX: bobber.tileX,
    tileY: bobber.tileY,
    worldX: bobber.x,
    worldY: bobber.y,
    activityId: activity.id,
    speciesId: activity.speciesId,
    assignedSlimeId: slime.id,
    opportunityId: opportunity.id,
    accessPointId: access.id,
    arriveUntilTick,
    castUntilTick,
    waitUntilTick: castUntilTick + msToTicks(state.rng.range(delay.min, delay.max)),
  });
}

export function beginFishingOnArrival(state: GameState, slime: SlimeState): void {
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task || task.type !== "fish_activity") {
    return;
  }
  const opportunity = state.opportunities.find((entry) => entry.taskId === task.id);
  const activity = opportunity ? activityById(state, opportunity.activityId) : undefined;
  const access = opportunity
    ? state.fishingAccessPoints.find((point) => point.id === opportunity.accessPointId)
    : undefined;
  if (!opportunity || !activity || activity.state === "consumed" || !access) {
    cancelFishingOpportunity(state, opportunity?.id ?? null);
    return;
  }
  slime.state = "fishing_wait";
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.destination = undefined;
  opportunity.state = "fishing";
  startSlimeFishingSession(state, slime, opportunity, activity, access);
}

export function releaseOrphanedFishingSlime(state: GameState, slime: SlimeState): boolean {
  if (slime.state !== "fishing_wait" && slime.state !== "fishing_bite") {
    return false;
  }
  const session = fishingSessionForSlime(state.fishingSessions, slime.id);
  if (session && isLiveFishingPhase(session.phase)) {
    return false;
  }
  slime.state = "idle";
  slime.currentTaskId = undefined;
  slime.path = [];
  slime.destination = undefined;
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.workElapsedMs = 0;
  return true;
}

export function cancelFishing(state: GameState): void {
  const session = primaryFishingSession(state.fishingSessions);
  if (session?.opportunityId) {
    cancelFishingOpportunity(state, session.opportunityId);
    return;
  }
  const inFlight = state.opportunities.find(
    (entry) =>
      entry.state === "assigned" ||
      entry.state === "slime_traveling" ||
      entry.state === "fishing" ||
      entry.state === "bite" ||
      entry.state === "player_interaction",
  );
  if (inFlight) {
    cancelFishingOpportunity(state, inFlight.id);
    return;
  }
  if (!session || session.phase === "idle") {
    return;
  }
  if (session.phase !== "caught" && session.phase !== "escaped") {
    releaseReservation(activityById(state, session.activityId), session.sessionId);
  }
  removeFishingSession(state, { sessionId: session.sessionId });
}

export function tickFishing(state: GameState): void {
  const tick = state.tickIndex;
  for (const session of [...state.fishingSessions]) {
    tickOneSession(state, session, tick);
  }
}

function tickOneSession(state: GameState, session: FishingSession, tick: number): void {
  const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
  if (session.phase === "casting" && tick >= session.castUntilTick) {
    session.phase = "waiting";
  }
  if (session.phase === "waiting" && tick >= session.waitUntilTick) {
    if (!session.activityId || !session.speciesId) {
      beginResult(session, "escaped");
      return;
    }
    const activity = activityById(state, session.activityId);
    if (!activity || activity.state === "consumed") {
      beginResult(session, "escaped");
      completeFishingOpportunity(state, "escaped", session.opportunityId);
      return;
    }
    session.phase = "bite";
    session.biteUntilTick = tick + FISHING.biteDisplayTicks;
    if (slime) {
      slime.state = "fishing_bite";
      slime.ambientEmote = "!";
      slime.ambientEmoteUntilTick = tick + 6;
    }
    const opportunity = opportunityById(state, session.opportunityId);
    if (opportunity) {
      opportunity.state = "bite";
    }
    return;
  }
  if (session.phase === "bite" && tick >= session.biteUntilTick) {
    if (fightingSession(state.fishingSessions) && fightingSession(state.fishingSessions) !== session) {
      session.biteUntilTick = tick;
      return;
    }
    beginFight(state, session);
  }
}

export function advanceFishingClock(state: GameState, nowMs: number): void {
  for (const session of [...state.fishingSessions]) {
    if (session.phase === "fighting") {
      if (session.fightStartedAtMs <= 0) {
        session.fightStartedAtMs = nowMs;
      }
      const elapsed = nowMs - session.fightStartedAtMs;
      const timeout = session.markerPeriodMs * FISHING.fightPassesBeforeTimeout;
      if (elapsed >= timeout) {
        failCatch(state, session, nowMs);
      }
      continue;
    }
    if (session.phase === "caught" || session.phase === "escaped") {
      if (session.resultAtMs <= 0) {
        session.resultAtMs = nowMs;
      }
      if (session.resultAtMs > 0 && nowMs - session.resultAtMs >= 400) {
        removeFishingSession(state, { sessionId: session.sessionId });
      }
    }
  }
}

export function resolveStrike(state: GameState, nowMs: number): StrikeResult {
  const session = fightingSession(state.fishingSessions);
  if (!session) {
    return "ignored";
  }
  if (session.fightStartedAtMs <= 0) {
    session.fightStartedAtMs = nowMs;
  }
  const t = fightMarkerT(session, nowMs);
  const inZone = t >= session.zoneStart && t <= session.zoneStart + session.zoneWidth;
  if (inZone) {
    session.lastStrike = isPerfectStrike(session, t) ? "perfect" : "hit";
    succeedCatch(state, session, nowMs);
    return "hit";
  }
  session.lastStrike = "miss";
  failCatch(state, session, nowMs);
  return "miss";
}

export function isPerfectStrike(session: FishingSession, t: number): boolean {
  const center = session.zoneStart + session.zoneWidth / 2;
  const window = Math.max(FISHING.perfectZoneMin, session.zoneWidth * FISHING.perfectZoneFactor);
  return Math.abs(t - center) <= window;
}

export function fightMarkerT(session: FishingSession, nowMs: number): number {
  if (session.phase !== "fighting" || session.markerPeriodMs <= 0 || session.fightStartedAtMs <= 0) {
    return 0;
  }
  const elapsed = Math.max(0, nowMs - session.fightStartedAtMs);
  const period = session.markerPeriodMs;
  const cycle = elapsed % (period * 2);
  if (cycle <= period) {
    return cycle / period;
  }
  return 2 - cycle / period;
}

export function forceBite(state: GameState, slimeId?: string): boolean {
  const session = slimeId
    ? fishingSessionForSlime(state.fishingSessions, slimeId)
    : state.fishingSessions.find(
        (entry) =>
          (entry.phase === "waiting" || entry.phase === "casting") && entry.activityId,
      );
  if (!session || !session.activityId) {
    return false;
  }
  if (session.phase === "casting") {
    session.phase = "waiting";
  }
  if (session.phase !== "waiting") {
    return false;
  }
  session.waitUntilTick = state.tickIndex;
  tickFishing(state);
  return sessionIsBiteOrFight(session);
}

export function autoSucceedCatch(state: GameState, nowMs: number): boolean {
  const session =
    fightingSession(state.fishingSessions) ??
    state.fishingSessions.find((entry) => entry.phase === "bite") ??
    state.fishingSessions.find((entry) => entry.phase === "waiting" && entry.activityId && entry.speciesId) ??
    state.fishingSessions.find((entry) => entry.phase === "casting" && entry.activityId && entry.speciesId);
  if (!session) {
    return false;
  }
  if (session.phase === "casting") {
    session.phase = "waiting";
  }
  if (session.phase === "bite" || session.phase === "waiting") {
    beginFight(state, session);
  }
  if (session.phase !== "fighting") {
    return false;
  }
  succeedCatch(state, session, nowMs);
  return true;
}

export function resetFishCollection(state: GameState): void {
  state.fishCollection = emptyFishCollection();
}

export function hookFightStats(
  speciesId: FishId,
  attrs: SlimeAttributes,
  rngNext: () => number,
): { markerPeriodMs: number; zoneWidth: number; zoneStart: number } {
  const def = FISH[speciesId];
  const technique = clampAttributes(attrs).technique;
  const strength = clampAttributes(attrs).strength;
  const luck = clampAttributes(attrs).luck;
  let zoneWidth = def.targetZoneWidth * (1 + FISHING.techniqueZoneBonusPerPoint * (technique - 1));
  const luckRoll = rngNext();
  if (luckRoll < (luck / 5) * FISHING.luckWidenChanceFactor) {
    zoneWidth += FISHING.luckWidenAmount;
  }
  zoneWidth = Math.min(0.9, zoneWidth);
  const demand = def.challenge.strengthDemand;
  const markerPeriodMs =
    def.markerPeriodMs * (1 + FISHING.strengthPeriodBonusPerPoint * Math.max(0, strength - demand));
  const zoneStart = rngNext() * (1 - zoneWidth);
  return { markerPeriodMs, zoneWidth, zoneStart };
}

function sessionAttrs(state: GameState, session: FishingSession): SlimeAttributes {
  const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
  return slime?.attributes ?? DEFAULT_ATTRS;
}

function beginFight(state: GameState, session: FishingSession): void {
  const busy = fightingSession(state.fishingSessions);
  if (busy && busy !== session) {
    return;
  }
  const speciesId = session.speciesId;
  if (!speciesId) {
    beginResult(session, "escaped");
    return;
  }
  const stats = hookFightStats(speciesId, sessionAttrs(state, session), () => state.rng.next());
  session.phase = "fighting";
  session.fightStartedAtMs = 0;
  session.markerPeriodMs = stats.markerPeriodMs;
  session.zoneWidth = stats.zoneWidth;
  session.zoneStart = stats.zoneStart;
  const opportunity = opportunityById(state, session.opportunityId);
  if (opportunity) {
    opportunity.state = "player_interaction";
  }
}

function succeedCatch(state: GameState, session: FishingSession, nowMs: number): void {
  const speciesId = session.speciesId;
  if (!speciesId) {
    beginResult(session, "escaped", nowMs);
    return;
  }
  consumeActivity(activityById(state, session.activityId));
  grantCatch(state, session, speciesId);
  session.phase = "caught";
  session.caughtSpeciesId = speciesId;
  session.resultAtMs = nowMs;
  completeFishingOpportunity(state, "caught", session.opportunityId);
  const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
  if (slime) {
    slime.fishingCelebrateUntilTick = state.tickIndex + FISHING_SUCCESS_PRESENTATION_HOLD_TICKS;
  }
}

function failCatch(state: GameState, session: FishingSession, nowMs: number): void {
  consumeActivity(activityById(state, session.activityId));
  beginResult(session, "escaped", nowMs);
  completeFishingOpportunity(state, "escaped", session.opportunityId);
}

function grantCatch(state: GameState, session: FishingSession, speciesId: FishId): void {
  const entry = state.fishCollection[speciesId];
  session.isNewDiscovery = !entry.discovered;
  state.fishCollection = {
    ...state.fishCollection,
    [speciesId]: {
      speciesId,
      discovered: true,
      caughtCount: entry.caughtCount + 1,
    },
  };
  state.fishInventory = {
    ...state.fishInventory,
    [speciesId]: state.fishInventory[speciesId] + 1,
  };
}

function beginResult(session: FishingSession, phase: "caught" | "escaped", nowMs = 0): void {
  session.phase = phase;
  session.resultAtMs = nowMs;
}

function sessionIsBiteOrFight(session: FishingSession): boolean {
  return session.phase === "bite" || session.phase === "fighting";
}
