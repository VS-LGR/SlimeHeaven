import { TIME, millisecondsPerGameMinute } from "./timeConfig";
import { createDefaultWorldTime, type WorldTimeState } from "./worldTime";

export const WORLD_TIME_STORAGE_KEY = "slimeheaven.world-time.v1";
export const WORLD_TIME_SAVE_VERSION = 1;

export interface WorldTimeSaveV1 {
  version: 1;
  totalGameMinutes: number;
  remainderMs: number;
}

export type WorldTimeSave = WorldTimeSaveV1;

export function serializeWorldTime(time: WorldTimeState): WorldTimeSaveV1 {
  return {
    version: WORLD_TIME_SAVE_VERSION,
    totalGameMinutes: Math.max(0, Math.floor(time.totalGameMinutes)),
    remainderMs: Math.max(0, time.remainderMs),
  };
}

/** Restore authoritative time. Missing or invalid payloads use the new-game default. */
export function restoreWorldTime(raw: unknown): WorldTimeState {
  const fallback = createDefaultWorldTime();
  if (!raw || typeof raw !== "object") {
    return fallback;
  }
  const record = raw as Record<string, unknown>;
  if (record.version !== WORLD_TIME_SAVE_VERSION) {
    return fallback;
  }
  if (!isNonNegativeFinite(record.totalGameMinutes) || !isNonNegativeFinite(record.remainderMs)) {
    return fallback;
  }
  const restored: WorldTimeState = {
    totalGameMinutes: Math.floor(record.totalGameMinutes),
    remainderMs: record.remainderMs,
  };
  return normalizeWorldTime(restored);
}

export function normalizeWorldTime(time: WorldTimeState): WorldTimeState {
  const msPer = millisecondsPerGameMinute(TIME);
  let total = Math.max(0, Math.floor(time.totalGameMinutes));
  let remainder = Math.max(0, time.remainderMs);
  if (msPer > 0 && remainder >= msPer) {
    const extra = Math.floor(remainder / msPer);
    total += extra;
    remainder -= extra * msPer;
  }
  return { totalGameMinutes: total, remainderMs: remainder };
}

export function readWorldTimeSave(storage?: Pick<Storage, "getItem"> | null): WorldTimeState {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    const raw = store?.getItem(WORLD_TIME_STORAGE_KEY);
    if (!raw) {
      return createDefaultWorldTime();
    }
    return restoreWorldTime(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultWorldTime();
  }
}

export function writeWorldTimeSave(
  time: WorldTimeState,
  storage?: Pick<Storage, "setItem"> | null,
): void {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    store?.setItem(WORLD_TIME_STORAGE_KEY, JSON.stringify(serializeWorldTime(time)));
  } catch {
    /* private mode / quota: keep session clock only */
  }
}

export function hydrateWorldTime(target: WorldTimeState, storage?: Pick<Storage, "getItem"> | null): WorldTimeState {
  const restored = readWorldTimeSave(storage);
  target.totalGameMinutes = restored.totalGameMinutes;
  target.remainderMs = restored.remainderMs;
  return target;
}

function isNonNegativeFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
