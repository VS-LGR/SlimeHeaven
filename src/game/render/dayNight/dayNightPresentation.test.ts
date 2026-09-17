import { describe, expect, it } from "vitest";
import { TIME, minutesFromTimeOfDay } from "@/src/simulation/timeConfig";
import {
  DAY_NIGHT_LIGHTING_KEYS,
  celestialOpacities,
  lightingAtMinute,
} from "./dayNightPresentation";

function alphaAt(hour: number, minute: number): number {
  return lightingAtMinute(minutesFromTimeOfDay(hour, minute)).alpha;
}

describe("day/night presentation 05.5A", () => {
  it("keeps daytime at zero wash and night readable, not black", () => {
    expect(alphaAt(12, 0)).toBe(0);
    expect(alphaAt(7, 0)).toBe(0);
    expect(alphaAt(16, 59)).toBe(0);
    expect(alphaAt(0, 0)).toBeGreaterThan(0.2);
    expect(alphaAt(0, 0)).toBeLessThan(0.6);
    expect(alphaAt(23, 30)).toBeGreaterThan(0.2);
    expect(alphaAt(23, 30)).toBeLessThan(0.6);
  });

  it("interpolates smoothly across period boundaries and midnight wrap", () => {
    const dawnStart = lightingAtMinute(TIME.periods.dawn.startMinute);
    const dawnMid = lightingAtMinute((TIME.periods.dawn.startMinute + TIME.periods.dawn.endMinute) / 2);
    const dayStart = lightingAtMinute(TIME.periods.day.startMinute);
    expect(dawnStart.alpha).toBeGreaterThan(dayStart.alpha);
    expect(dawnMid.alpha).toBeGreaterThan(0);
    expect(dawnMid.alpha).toBeLessThan(dawnStart.alpha);
    const beforeMidnight = lightingAtMinute(TIME.minutesPerDay - 1);
    const atMidnight = lightingAtMinute(0);
    const wrapped = lightingAtMinute(TIME.minutesPerDay);
    expect(Math.abs(beforeMidnight.alpha - atMidnight.alpha)).toBeLessThan(0.05);
    expect(wrapped).toEqual(atMidnight);
    expect(DAY_NIGHT_LIGHTING_KEYS[0]?.minute).toBe(0);
    expect(DAY_NIGHT_LIGHTING_KEYS.at(-1)?.minute).toBe(TIME.minutesPerDay);
  });

  it("crossfades sun and moon during dawn and dusk", () => {
    expect(celestialOpacities(minutesFromTimeOfDay(12, 0))).toEqual({ sun: 1, moon: 0 });
    expect(celestialOpacities(minutesFromTimeOfDay(0, 0))).toEqual({ sun: 0, moon: 1 });
    const dawn = celestialOpacities(minutesFromTimeOfDay(6, 0));
    expect(dawn.sun).toBeGreaterThan(0.3);
    expect(dawn.sun).toBeLessThan(0.7);
    expect(dawn.moon).toBeCloseTo(1 - dawn.sun, 8);
    const dusk = celestialOpacities(minutesFromTimeOfDay(18, 0));
    expect(dusk.moon).toBeGreaterThan(0.3);
    expect(dusk.moon).toBeLessThan(0.7);
  });
});
