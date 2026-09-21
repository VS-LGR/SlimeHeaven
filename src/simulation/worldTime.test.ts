import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SIMULATION_TICK_MS, SIMULATION_TICKS_PER_SECOND } from "./constants";
import { Simulation } from "./Simulation";
import { TIME, dayPeriodAtMinute, millisecondsPerGameMinute, type TimeConfig } from "./timeConfig";
import {
  advanceGameMinutes,
  advanceSimMilliseconds,
  advanceToNextDay,
  createDefaultWorldTime,
  formatClock,
  formatClockFromTime,
  formatDayLabel,
  readClock,
  setWorldClock,
  tickWorldTime,
  visualDayProgress,
  visualMinuteOfDay,
} from "./worldTime";

const TICKS_PER_GAME_MINUTE = millisecondsPerGameMinute() / SIMULATION_TICK_MS;

describe("world time 05.5A", () => {
  it("uses a configurable real-time day duration of 24 minutes by default", () => {
    expect(TIME.dayDurationRealMs).toBe(24 * 60 * 1000);
    expect(millisecondsPerGameMinute()).toBe(1000);
    expect(TICKS_PER_GAME_MINUTE).toBe(SIMULATION_TICKS_PER_SECOND);
    const faster: TimeConfig = { ...TIME, dayDurationRealMs: 12 * 60 * 1000 };
    expect(millisecondsPerGameMinute(faster)).toBe(500);
    const time = createDefaultWorldTime();
    advanceSimMilliseconds(time, 500, faster);
    expect(readClock(time, faster)).toMatchObject({ dayNumber: 1, hour: 9, minute: 31 });
  });

  it("starts a new game at Day 1 09:30 and formats independently of elapsed minutes", () => {
    const time = createDefaultWorldTime();
    const clock = readClock(time);
    expect(clock.dayNumber).toBe(1);
    expect(clock.hour).toBe(9);
    expect(clock.minute).toBe(30);
    expect(clock.minuteOfDay).toBe(9 * 60 + 30);
    expect(formatClock(clock.hour, clock.minute)).toBe("09:30");
    expect(formatDayLabel(clock.dayNumber)).toBe("Dia 1");
    expect(formatClock(0, 0)).toBe("00:00");
    expect(formatClock(5, 7)).toBe("05:07");
    expect(formatClock(23, 59)).toBe("23:59");
    expect(formatClockFromTime(time)).not.toMatch(/570/);
  });

  it("advances deterministically through the 4 TPS tick path", () => {
    const a = new Simulation();
    const b = new Simulation();
    for (let tick = 0; tick < TICKS_PER_GAME_MINUTE; tick += 1) {
      a.tick();
      b.tick();
    }
    expect(a.getClock()).toMatchObject({ dayNumber: 1, hour: 9, minute: 31 });
    expect(b.getClock()).toEqual(a.getClock());
    const viaUpdate = new Simulation();
    for (let tick = 0; tick < TICKS_PER_GAME_MINUTE; tick += 1) {
      viaUpdate.update(SIMULATION_TICK_MS);
    }
    expect(viaUpdate.getClock()).toMatchObject({ dayNumber: 1, hour: 9, minute: 31 });
    expect(viaUpdate.getClock().remainderMs).toBe(0);
  });

  it("rolls minutes and hours without assuming one-minute updates", () => {
    const time = createDefaultWorldTime();
    setWorldClock(time, { hour: 9, minute: 59 });
    advanceSimMilliseconds(time, millisecondsPerGameMinute() * 1.5);
    expect(readClock(time)).toMatchObject({ hour: 10, minute: 0 });
    expect(time.remainderMs).toBe(millisecondsPerGameMinute() * 0.5);
    advanceGameMinutes(time, 59);
    expect(readClock(time)).toMatchObject({ hour: 10, minute: 59 });
  });

  it("increments the day exactly once at midnight and preserves leftover time", () => {
    const time = createDefaultWorldTime();
    setWorldClock(time, { day: 1, hour: 23, minute: 59 });
    const first = tickWorldTime(time, millisecondsPerGameMinute());
    expect(first.midnightCrossed).toBe(true);
    expect(first.midnightsCrossed).toBe(1);
    expect(readClock(time)).toMatchObject({ dayNumber: 2, hour: 0, minute: 0 });
    expect(formatDayLabel(readClock(time).dayNumber)).toBe("Dia 2");
    expect(formatClockFromTime(time)).toBe("00:00");
    const second = tickWorldTime(time, millisecondsPerGameMinute());
    expect(second.midnightCrossed).toBe(false);
    expect(readClock(time)).toMatchObject({ dayNumber: 2, hour: 0, minute: 1 });
    setWorldClock(time, { day: 1, hour: 23, minute: 59 });
    const leftover = advanceSimMilliseconds(time, millisecondsPerGameMinute() * 2.25);
    expect(leftover.midnightsCrossed).toBe(1);
    expect(readClock(time)).toMatchObject({ dayNumber: 2, hour: 0, minute: 1 });
    expect(time.remainderMs).toBeCloseTo(millisecondsPerGameMinute() * 0.25, 8);
  });

  it("supports multi-day deterministic advances without duplicate midnight counts", () => {
    const time = createDefaultWorldTime();
    const result = advanceGameMinutes(time, TIME.minutesPerDay * 3 + 90);
    expect(result.midnightsCrossed).toBe(3);
    expect(readClock(time)).toMatchObject({ dayNumber: 4, hour: 11, minute: 0 });
    const none = advanceGameMinutes(time, 0);
    expect(none.midnightCrossed).toBe(false);
    expect(readClock(time).dayNumber).toBe(4);
    advanceToNextDay(time);
    expect(readClock(time)).toMatchObject({ dayNumber: 5, hour: 0, minute: 0 });
  });

  it("classifies periods and normalized day progress from a single config", () => {
    const time = createDefaultWorldTime();
    expect(readClock(time).period).toBe("day");
    expect(readClock(time).dayProgress).toBeCloseTo((9 * 60 + 30) / TIME.minutesPerDay, 10);
    setWorldClock(time, { hour: 4, minute: 30 });
    expect(readClock(time).period).toBe("night");
    setWorldClock(time, { hour: 5, minute: 0 });
    expect(readClock(time).period).toBe("dawn");
    setWorldClock(time, { hour: 6, minute: 30 });
    expect(readClock(time).period).toBe("dawn");
    setWorldClock(time, { hour: 7, minute: 0 });
    expect(readClock(time).period).toBe("day");
    setWorldClock(time, { hour: 17, minute: 0 });
    expect(readClock(time).period).toBe("dusk");
    setWorldClock(time, { hour: 18, minute: 30 });
    expect(readClock(time).period).toBe("dusk");
    setWorldClock(time, { hour: 19, minute: 0 });
    expect(readClock(time).period).toBe("night");
    setWorldClock(time, { hour: 23, minute: 30 });
    expect(readClock(time).period).toBe("night");
    expect(dayPeriodAtMinute(0)).toBe("night");
    expect(visualDayProgress(time)).toBeGreaterThan(0.9);
    expect(visualMinuteOfDay(time, millisecondsPerGameMinute() / 2)).toBeGreaterThan(time.totalGameMinutes % TIME.minutesPerDay);
  });

  it("stops with the authoritative simulation pause and ignores zero deltas", () => {
    const sim = new Simulation();
    sim.setPaused(true);
    for (let frame = 0; frame < 40; frame += 1) {
      sim.update(SIMULATION_TICK_MS);
    }
    expect(sim.tickCount).toBe(0);
    expect(sim.getClock()).toMatchObject({ dayNumber: 1, hour: 9, minute: 30 });
    sim.setPaused(false);
    sim.update(0);
    expect(sim.tickCount).toBe(0);
    sim.update(SIMULATION_TICK_MS * TICKS_PER_GAME_MINUTE);
    expect(sim.getClock()).toMatchObject({ hour: 9, minute: 31 });
  });

  it("does not attach time to jobs, needs, or slime behavior", () => {
    const files = [
      "src/simulation/systems/JobSystem.ts",
      "src/simulation/systems/SlimeSystem.ts",
      "src/simulation/systems/NeedsSystem.ts",
      "src/simulation/systems/FarmSystem.ts",
      "src/simulation/systems/VisitorSystem.ts",
    ];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/timeConfig|dayPeriodAtMinute/);
      if (file.endsWith("JobSystem.ts")) {
        expect(source).not.toMatch(/from ["'].*worldTime["']/);
        continue;
      }
      expect(source).not.toMatch(/worldTime/);
    }
  });
});
