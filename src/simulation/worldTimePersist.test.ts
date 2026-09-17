import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TIME } from "./timeConfig";
import { createDefaultWorldTime, readClock, setWorldClock } from "./worldTime";
import {
  WORLD_TIME_STORAGE_KEY,
  hydrateWorldTime,
  readWorldTimeSave,
  restoreWorldTime,
  serializeWorldTime,
  writeWorldTimeSave,
} from "./worldTimePersist";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem(key: string) {
      return key in data ? data[key] : null;
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
    data,
  };
}

describe("world time persistence 05.5A", () => {
  it("round-trips day and time of day without presentation fields", () => {
    const time = createDefaultWorldTime();
    setWorldClock(time, { day: 3, hour: 23, minute: 41 });
    time.remainderMs = 250;
    const saved = serializeWorldTime(time);
    expect(saved).toEqual({ version: 1, totalGameMinutes: time.totalGameMinutes, remainderMs: 250 });
    expect(saved).not.toHaveProperty("color");
    expect(saved).not.toHaveProperty("sunOpacity");
    expect(saved).not.toHaveProperty("timeLabel");
    const restored = restoreWorldTime(saved);
    expect(readClock(restored)).toMatchObject({ dayNumber: 3, hour: 23, minute: 41 });
    expect(restored.remainderMs).toBe(250);
  });

  it("falls back to the new-game clock for missing or older saves", () => {
    const fallback = readClock(createDefaultWorldTime());
    expect(readClock(restoreWorldTime(null))).toMatchObject({
      dayNumber: fallback.dayNumber,
      hour: fallback.hour,
      minute: fallback.minute,
    });
    expect(readClock(restoreWorldTime(undefined))).toMatchObject({ hour: 9, minute: 30, dayNumber: 1 });
    expect(readClock(restoreWorldTime({}))).toMatchObject({ hour: 9, minute: 30, dayNumber: 1 });
    expect(readClock(restoreWorldTime({ version: 0, totalGameMinutes: 99, remainderMs: 1 }))).toMatchObject({
      hour: 9,
      minute: 30,
    });
    expect(readClock(restoreWorldTime({ version: 1, day: 4, hour: 18 }))).toMatchObject({
      dayNumber: 1,
      hour: 9,
      minute: 30,
    });
    expect(TIME.newGame).toEqual({ day: 1, hour: 9, minute: 30 });
  });

  it("reads and writes through the project storage pattern", () => {
    const store = memoryStorage();
    const time = createDefaultWorldTime();
    setWorldClock(time, { day: 2, hour: 0, minute: 0 });
    writeWorldTimeSave(time, store);
    expect(store.data[WORLD_TIME_STORAGE_KEY]).toContain("totalGameMinutes");
    const hydrated = createDefaultWorldTime();
    hydrateWorldTime(hydrated, store);
    expect(readClock(hydrated)).toMatchObject({ dayNumber: 2, hour: 0, minute: 0 });
    expect(readClock(readWorldTimeSave(memoryStorage()))).toMatchObject({ dayNumber: 1, hour: 9, minute: 30 });
    const persistSource = readFileSync("src/simulation/worldTimePersist.ts", "utf8");
    expect(persistSource).not.toMatch(/Date\.now|performance\.now/);
    const gameSource = readFileSync("src/game/Game.ts", "utf8");
    expect(gameSource).toMatch(/hydrateWorldTime/);
    expect(gameSource).not.toMatch(/offline|catch-up|catchUpHours/);
  });
});
