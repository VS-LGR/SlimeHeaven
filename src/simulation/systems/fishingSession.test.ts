import { describe, expect, it } from "vitest";
import { TILE_SIZE } from "@/src/world/constants";
import { SLIME_IDS } from "../entities/SlimeState";
import { EAT_FOOD_COST } from "../needsConfig";
import { commitFishingAtWorld } from "./FishingOpportunitySystem";
import { cancelFishing, resolveStrike } from "./FishingSystem";
import { commitUntilWaiting, enterFight, spawnShallow, villageSim } from "./fishingTestUtils";
import { fishingPresentationPhase } from "../entities/FishingPresentation";
import { isAmbientEligible, isJobAssignable } from "./slimeAvailability";

describe("fishing session", () => {
  it("rejects a commit on land with no clue", () => {
    const sim = villageSim();
    expect(commitFishingAtWorld(sim.state, 2 * TILE_SIZE + 16, 12 * TILE_SIZE + 16)).toBe(false);
    expect(sim.state.fishing.phase).toBe("idle");
  });

  it("walks a slime to shore land, waits, then hooks", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    expect(slime.state).toBe("fishing_wait");
    const access = sim.state.fishingAccessPoints.find(
      (point) => point.id === sim.state.fishing.accessPointId,
    );
    expect(slime.tileX).toBe(access?.landTile.x);
    expect(slime.tileY).toBe(access?.landTile.y);
    expect(sim.state.fishing.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    enterFight(sim.state);
    expect(sim.state.fishing.phase).toBe("fighting");
  });

  it("succeeds a timing strike and credits the slime", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    enterFight(sim.state);
    sim.state.fishing.fightStartedAtMs = 1000;
    sim.state.fishing.zoneStart = 0;
    sim.state.fishing.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1000)).toBe("hit");
    expect(sim.state.fishing.phase).toBe("caught");
    expect(sim.state.fishing.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.fishInventory.blue_darter).toBe(1);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
  });

  it("holds a success leftover on Pingo without blocking jobs", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    enterFight(sim.state);
    sim.state.fishing.fightStartedAtMs = 1000;
    sim.state.fishing.zoneStart = 0;
    sim.state.fishing.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1000)).toBe("hit");
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    expect(pingo.fishingCelebrateUntilTick).toBeGreaterThan(sim.state.tickIndex);
    expect(fishingPresentationPhase(pingo, undefined, sim.state.tickIndex)).toBe("success");
    expect(isAmbientEligible(sim.state, pingo)).toBe(false);
    expect(isJobAssignable(sim.state, pingo)).toBe(true);
  });

  it("fails a strike outside the zone and releases reservations", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    enterFight(sim.state);
    sim.state.fishing.fightStartedAtMs = 1000;
    sim.state.fishing.zoneStart = 0.8;
    sim.state.fishing.zoneWidth = 0.1;
    expect(resolveStrike(sim.state, 1000)).toBe("miss");
    expect(sim.state.fishing.phase).toBe("escaped");
    expect(sim.state.fishInventory.blue_darter).toBe(0);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
  });

  it("cancels a waiting session and releases the reservation", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    expect(activity.state).toBe("reserved");
    cancelFishing(sim.state);
    expect(sim.state.fishing.phase).toBe("idle");
    expect(activity.state).toBe("active");
    expect(activity.ownerSessionId).toBeNull();
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
  });

  it("finishes a short fishing session before seeking food", () => {
    const sim = villageSim();
    sim.state.resources.food = EAT_FOOD_COST;
    const { activity } = spawnShallow(sim.state);
    commitUntilWaiting(sim, activity);
    sim.state.slimes[SLIME_IDS.PINGO].satiety = 0;
    sim.tick();
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("fishing_wait");
    expect(sim.state.fishing.phase).toBe("waiting");
  });
});
