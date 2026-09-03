import type { FishId } from "../data/fish";

export type FishingPhase =
  | "idle"
  | "casting"
  | "waiting"
  | "bite"
  | "fighting"
  | "caught"
  | "escaped";

export interface FishingSession {
  phase: FishingPhase;
  sessionId: string;
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
  activityId: string | null;
  speciesId: FishId | null;
  assignedSlimeId: string | null;
  opportunityId: string | null;
  accessPointId: string | null;
  waitUntilTick: number;
  biteUntilTick: number;
  arriveUntilTick: number;
  castUntilTick: number;
  lastStrike: "hit" | "miss" | "perfect" | null;
  fightStartedAtMs: number;
  markerPeriodMs: number;
  zoneStart: number;
  zoneWidth: number;
  caughtSpeciesId: FishId | null;
  isNewDiscovery: boolean;
  resultAtMs: number;
}

export function idleFishingSession(): FishingSession {
  return {
    phase: "idle",
    sessionId: "",
    tileX: 0,
    tileY: 0,
    worldX: 0,
    worldY: 0,
    activityId: null,
    speciesId: null,
    assignedSlimeId: null,
    opportunityId: null,
    accessPointId: null,
    waitUntilTick: 0,
    biteUntilTick: 0,
    arriveUntilTick: 0,
    castUntilTick: 0,
    lastStrike: null,
    fightStartedAtMs: 0,
    markerPeriodMs: 0,
    zoneStart: 0,
    zoneWidth: 0,
    caughtSpeciesId: null,
    isNewDiscovery: false,
    resultAtMs: 0,
  };
}

export function sessionOwnsInput(session: FishingSession): boolean {
  return session.phase === "fighting";
}

export function isLiveFishingPhase(phase: FishingPhase): boolean {
  return (
    phase === "waiting" ||
    phase === "casting" ||
    phase === "bite" ||
    phase === "fighting"
  );
}

const PRIMARY_ORDER: FishingPhase[] = ["fighting", "bite", "waiting", "casting", "caught", "escaped"];

export function primaryFishingSession(sessions: readonly FishingSession[]): FishingSession | undefined {
  for (const phase of PRIMARY_ORDER) {
    const found = sessions.find((session) => session.phase === phase);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export function fishingSessionForSlime(
  sessions: readonly FishingSession[],
  slimeId: string | null,
): FishingSession | undefined {
  if (!slimeId) {
    return undefined;
  }
  return sessions.find((session) => session.assignedSlimeId === slimeId);
}

export function fightingSession(sessions: readonly FishingSession[]): FishingSession | undefined {
  return sessions.find((session) => session.phase === "fighting");
}

export function upsertFishingSession(
  state: { fishingSessions: FishingSession[] },
  session: FishingSession,
): void {
  if (session.phase === "idle") {
    const primary = primaryFishingSession(state.fishingSessions);
    if (primary) {
      state.fishingSessions = state.fishingSessions.filter((entry) => entry !== primary);
    }
    return;
  }
  const idx = state.fishingSessions.findIndex((entry) => {
    if (session.sessionId && entry.sessionId === session.sessionId) {
      return true;
    }
    return Boolean(session.assignedSlimeId) && entry.assignedSlimeId === session.assignedSlimeId;
  });
  if (idx >= 0) {
    state.fishingSessions[idx] = session;
  } else {
    state.fishingSessions.push(session);
  }
}

export function removeFishingSession(
  state: { fishingSessions: FishingSession[] },
  match: { sessionId?: string | null; opportunityId?: string | null; slimeId?: string | null },
): void {
  state.fishingSessions = state.fishingSessions.filter((entry) => {
    if (match.sessionId && entry.sessionId === match.sessionId) {
      return false;
    }
    if (match.opportunityId && entry.opportunityId === match.opportunityId) {
      return false;
    }
    if (match.slimeId && entry.assignedSlimeId === match.slimeId) {
      return false;
    }
    return true;
  });
}
