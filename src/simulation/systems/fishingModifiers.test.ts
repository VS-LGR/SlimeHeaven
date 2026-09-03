import { describe, expect, it } from "vitest";
import { FISH } from "../data/fish";
import { FISHING, instinctScaledClueOnTicks } from "../fishingConfig";
import { hookFightStats } from "./FishingSystem";

describe("fishing attribute modifiers", () => {
  it("widens the target zone with Technique", () => {
    const base = FISH.blue_darter.targetZoneWidth;
    const low = hookFightStats("blue_darter", { technique: 1, strength: 3, instinct: 3, luck: 1 }, () => 1);
    const high = hookFightStats("blue_darter", { technique: 5, strength: 3, instinct: 3, luck: 1 }, () => 1);
    expect(low.zoneWidth).toBeCloseTo(base);
    expect(high.zoneWidth).toBeCloseTo(base * (1 + FISHING.techniqueZoneBonusPerPoint * 4));
    expect(high.zoneWidth).toBeGreaterThan(low.zoneWidth);
  });

  it("slows the marker when Strength exceeds species demand", () => {
    const demand = FISH.blue_darter.challenge.strengthDemand;
    const low = hookFightStats("blue_darter", { technique: 3, strength: demand, instinct: 3, luck: 1 }, () => 1);
    const high = hookFightStats("blue_darter", { technique: 3, strength: demand + 2, instinct: 3, luck: 1 }, () => 1);
    expect(low.markerPeriodMs).toBe(FISH.blue_darter.markerPeriodMs);
    expect(high.markerPeriodMs).toBeCloseTo(
      FISH.blue_darter.markerPeriodMs * (1 + FISHING.strengthPeriodBonusPerPoint * 2),
    );
  });

  it("lengthens clue-on pulses from Instinct", () => {
    const low = instinctScaledClueOnTicks(1);
    const high = instinctScaledClueOnTicks(5);
    expect(low.min).toBe(FISHING.clueOnTicks.min);
    expect(high.min).toBeGreaterThan(low.min);
    expect(high.max).toBeGreaterThan(low.max);
  });

  it("applies a seeded Luck widen when the roll succeeds", () => {
    const miss = hookFightStats("blue_darter", { technique: 1, strength: 3, instinct: 3, luck: 5 }, () => 0.99);
    const hit = hookFightStats("blue_darter", { technique: 1, strength: 3, instinct: 3, luck: 5 }, () => 0);
    expect(hit.zoneWidth).toBeCloseTo(miss.zoneWidth + FISHING.luckWidenAmount);
  });
});
