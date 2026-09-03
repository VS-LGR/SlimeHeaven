import { describe, expect, it } from "vitest";
import { SLIME_IDS } from "../entities/SlimeState";
import { EAT_FOOD_COST } from "../needsConfig";
import { FISHING } from "../fishingConfig";
import { createGatherTask, assignAvailableTasks } from "./JobSystem";
import {
  commitFishingOpportunity,
  diagnoseFishingCandidates,
  scoreFishingCandidates,
  validAccessPointsFor,
} from "./FishingOpportunitySystem";
import { spawnShallow, villageSim } from "./fishingTestUtils";

describe("fishing job assignment", () => {
  it("assigns only Pingo when all slimes are idle", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state, "blue_darter");
    const points = validAccessPointsFor(sim.state, activity);
    const diagnosis = diagnoseFishingCandidates(sim.state, points);
    expect(diagnosis.find((entry) => entry.slimeId === SLIME_IDS.PINGO)?.debugLine).toBe("Pingo: ELIGIBLE");
    expect(diagnosis.find((entry) => entry.slimeId === SLIME_IDS.MOMO)?.debugLine).toBe(
      "Momo: REJECTED — missing fishing",
    );
    expect(diagnosis.find((entry) => entry.slimeId === SLIME_IDS.TITO)?.debugLine).toBe(
      "Tito: REJECTED — missing fishing",
    );
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    expect(sim.state.opportunities[0].assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.lastFishingScores[0]?.slimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.lastFishingScores.every((entry) => entry.slimeId === SLIME_IDS.PINGO)).toBe(true);
  });

  it("does not fall back to Momo or Tito when Pingo is busy", () => {
    const sim = villageSim();
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    pingo.currentTaskId = "busy";
    const { activity } = spawnShallow(sim.state, "blue_darter");
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    expect(sim.state.opportunities).toHaveLength(0);
    expect(activity.state).toBe("active");
    expect(sim.state.lastJobFeedback?.reason).toBe("capable_busy");
    expect(sim.state.lastJobFeedback?.message).toBe("Pingo is busy.");
    expect(sim.state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
    expect(sim.state.slimes[SLIME_IDS.TITO].currentTaskId).toBeUndefined();
  });

  it("does not assign Momo when Pingo is starving with food available", () => {
    const sim = villageSim();
    sim.state.resources.food = EAT_FOOD_COST;
    sim.state.slimes[SLIME_IDS.PINGO].satiety = 0;
    const { activity } = spawnShallow(sim.state, "blue_darter");
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    expect(activity.state).toBe("active");
    expect(sim.state.lastJobFeedback?.reason).toBe("capable_busy");
    expect(sim.state.lastJobFeedback?.message).toBe("Pingo is busy.");
  });

  it("does not assign Tito when Pingo and Momo are busy", () => {
    const sim = villageSim();
    createGatherTask(sim.state, "gather_wood");
    createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(sim.state.slimes[SLIME_IDS.TITO].currentTaskId).toBeDefined();
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    pingo.currentTaskId = "busy";
    const { activity } = spawnShallow(sim.state, "pond_carp");
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    expect(sim.state.opportunities).toHaveLength(0);
    expect(activity.state).toBe("active");
  });

  it("reports no capable slime instead of busy when fishing is stripped", () => {
    const sim = villageSim();
    sim.state.slimes[SLIME_IDS.PINGO].capabilities = sim.state.slimes[SLIME_IDS.PINGO].capabilities.filter(
      (tag) => tag !== "fishing",
    );
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    expect(sim.state.lastJobFeedback?.reason).toBe("no_capable");
    expect(sim.state.lastJobFeedback?.message).toBe("Requires a slime with Fishing.");
    expect(activity.state).toBe("active");
  });

  it("includes distance in the candidate score for eligible fishers only", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    const points = validAccessPointsFor(sim.state, activity);
    const scores = scoreFishingCandidates(sim.state, activity, points);
    expect(scores).toHaveLength(1);
    const pingo = scores.find((entry) => entry.slimeId === SLIME_IDS.PINGO);
    expect(pingo).toBeDefined();
    expect(pingo!.pathLength).toBeGreaterThanOrEqual(0);
    const withoutDistance = pingo!.score + pingo!.pathLength * FISHING.distancePenaltyPerTile;
    expect(withoutDistance).toBeGreaterThan(pingo!.score);
  });
});
