import { describe, expect, it } from "vitest";
import { TILE_SIZE } from "@/src/world/constants";
import { FISHING } from "../fishingConfig";
import { SLIME_IDS } from "../entities/SlimeState";
import { commitFishingAtWorld, commitFishingOpportunity } from "./FishingOpportunitySystem";
import { cancelFishing } from "./FishingSystem";
import { spawnAquaticAt } from "./AquaticActivitySystem";
import { spawnShallow, villageSim } from "./fishingTestUtils";

describe("fishing opportunity", () => {
  it("rejects a click with no activity in range", () => {
    const sim = villageSim();
    expect(commitFishingAtWorld(sim.state, 2 * TILE_SIZE + 16, 12 * TILE_SIZE + 16)).toBe(false);
    expect(sim.state.opportunities).toHaveLength(0);
    expect(sim.state.fishing.phase).toBe("idle");
  });

  it("commits a nearby clue, reserves the activity, and ignores a far one", () => {
    const sim = villageSim();
    const { activity: near } = spawnShallow(sim.state, "blue_darter");
    const far = sim.state.fishingSpots.find((entry) => {
      if (entry.depth !== "shallow") {
        return false;
      }
      const dx = (entry.tileX - near.tileX) * TILE_SIZE;
      const dy = (entry.tileY - near.tileY) * TILE_SIZE;
      return dx * dx + dy * dy > FISHING.clueHitRadiusPx * FISHING.clueHitRadiusPx * 4;
    });
    if (far) {
      spawnAquaticAt(sim.state, "blue_darter", far.tileX, far.tileY);
    }
    expect(commitFishingAtWorld(sim.state, near.worldX, near.worldY)).toBe(true);
    expect(near.state).toBe("reserved");
    const opportunity = sim.state.opportunities[0];
    expect(opportunity.activityId).toBe(near.id);
    expect(opportunity.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    const access = sim.state.fishingAccessPoints.find((point) => point.id === opportunity.accessPointId);
    expect(access?.reservedBy).toBe(opportunity.id);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("moving_to_fishing");
    expect(sim.state.slimes[SLIME_IDS.PINGO].destination).toEqual(access?.landTile);
  });

  it("pauses reserved activity expiry while the slime is traveling", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    activity.expiresAtTick = sim.state.tickIndex + 1;
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    for (let i = 0; i < 8; i += 1) {
      sim.tick();
    }
    expect(sim.state.activities.some((entry) => entry.id === activity.id)).toBe(true);
    expect(activity.state).toBe("reserved");
  });

  it("cancels cleanly when no access point can reach the activity", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    sim.state.fishingAccessPoints = [];
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(false);
    expect(sim.state.opportunities).toHaveLength(0);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
    expect(activity.state).toBe("active");
  });

  it("releases slime, access, and activity when cancelled in transit", () => {
    const sim = villageSim();
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    const opportunity = sim.state.opportunities[0];
    cancelFishing(sim.state);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
    expect(sim.state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(activity.state).toBe("active");
    const access = sim.state.fishingAccessPoints.find((point) => point.id === opportunity.accessPointId);
    expect(access?.reservedBy).toBeNull();
    expect(opportunity.state).toBe("expired");
  });
});
