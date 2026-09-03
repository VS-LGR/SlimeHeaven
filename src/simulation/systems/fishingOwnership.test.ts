import { describe, expect, it } from "vitest";
import { SLIME_IDS } from "../entities/SlimeState";
import { fightingSession, fishingSessionForSlime } from "../entities/FishingSession";
import { spawnAquaticAt } from "./AquaticActivitySystem";
import { commitFishingOpportunity } from "./FishingOpportunitySystem";
import { cancelFishing, resolveStrike } from "./FishingSystem";
import { commitUntilWaiting, enterFight, grantFishingCapability, spawnShallow, villageSim } from "./fishingTestUtils";

describe("fishing ownership invariants", () => {
  it("does not create two committed opportunities for one activity", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    const live = sim.state.opportunities.filter(
      (entry) => entry.state !== "expired" && entry.state !== "caught" && entry.state !== "escaped",
    );
    expect(live).toHaveLength(1);
    expect(live[0].assignedSlimeId).toBe(SLIME_IDS.PINGO);
  });

  it("does not assign two slimes to one opportunity", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    const opportunity = sim.state.opportunities[0];
    expect(opportunity.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.slimes[SLIME_IDS.MOMO].currentTaskId).not.toBe(opportunity.taskId);
  });

  it("does not let two fishing jobs share one access land tile", () => {
    const sim = villageSim();
    grantFishingCapability(sim.state, SLIME_IDS.MOMO);
    const spots = sim.state.fishingSpots.filter((entry) => entry.depth === "shallow");
    const first = spawnAquaticAt(sim.state, "blue_darter", spots[0].tileX, spots[0].tileY);
    const second = spawnAquaticAt(
      sim.state,
      "blue_darter",
      spots[spots.length - 1].tileX,
      spots[spots.length - 1].tileY,
    );
    expect(commitFishingOpportunity(sim.state, first!.id)).toBe(true);
    expect(commitFishingOpportunity(sim.state, second!.id)).toBe(true);
    const reserved = sim.state.fishingAccessPoints.filter((point) => point.reservedBy);
    const landKeys = reserved.map((point) => `${point.landTile.x},${point.landTile.y}`);
    expect(new Set(landKeys).size).toBe(landKeys.length);
  });

  it("does not give one slime two live fishing sessions", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    const sessions = sim.state.fishingSessions.filter((entry) => entry.assignedSlimeId === SLIME_IDS.PINGO);
    expect(sessions).toHaveLength(1);
  });

  it("owns at most one fighting hook UI", () => {
    const sim = villageSim();
    grantFishingCapability(sim.state, SLIME_IDS.MOMO);
    const spots = sim.state.fishingSpots.filter((entry) => entry.depth === "shallow");
    const first = spawnAquaticAt(sim.state, "blue_darter", spots[0].tileX, spots[0].tileY);
    const second = spawnAquaticAt(
      sim.state,
      "blue_darter",
      spots[spots.length - 1].tileX,
      spots[spots.length - 1].tileY,
    );
    commitUntilWaiting(sim, first!);
    expect(commitFishingOpportunity(sim.state, second!.id)).toBe(true);
    fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)!.waitUntilTick =
      sim.state.tickIndex + 100_000;
    for (let i = 0; i < 400; i += 1) {
      const momoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO);
      if (sim.state.slimes[SLIME_IDS.MOMO].state === "fishing_wait" && momoSession?.phase === "waiting") {
        break;
      }
      sim.tick();
    }
    enterFight(sim.state, SLIME_IDS.PINGO);
    const momo = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO)!;
    momo.waitUntilTick = sim.state.tickIndex;
    for (let i = 0; i < 8; i += 1) {
      sim.tick();
    }
    expect(fightingSession(sim.state.fishingSessions)?.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.fishingSessions.filter((entry) => entry.phase === "fighting")).toHaveLength(1);
  });

  it("releases activity, access, and session on cancel, success, and escape", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    const opportunity = sim.state.opportunities[0];
    cancelFishing(sim.state);
    expect(activity.state).toBe("active");
    expect(sim.state.fishingAccessPoints.find((point) => point.id === opportunity.accessPointId)?.reservedBy).toBeNull();

    const again = spawnShallow(sim.state);
    commitUntilWaiting(sim, again.activity);
    enterFight(sim.state);
    sim.state.fishing.fightStartedAtMs = 1;
    sim.state.fishing.zoneStart = 0;
    sim.state.fishing.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1)).toBe("hit");
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);

    const third = spawnShallow(sim.state);
    commitUntilWaiting(sim, third.activity);
    enterFight(sim.state);
    sim.state.fishing.fightStartedAtMs = 1;
    sim.state.fishing.zoneStart = 0.9;
    sim.state.fishing.zoneWidth = 0.05;
    expect(resolveStrike(sim.state, 1)).toBe("miss");
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
  });
});
