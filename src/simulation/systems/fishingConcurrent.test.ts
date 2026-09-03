import { describe, expect, it } from "vitest";
import { SLIME_IDS } from "../entities/SlimeState";
import { fishingSessionForSlime } from "../entities/FishingSession";
import { spawnAquaticAt } from "./AquaticActivitySystem";
import { commitFishingOpportunity } from "./FishingOpportunitySystem";
import { resolveStrike } from "./FishingSystem";
import { commitUntilWaiting, enterFight, grantFishingCapability, villageSim } from "./fishingTestUtils";

describe("concurrent slime fishing", () => {
  it("lets two slimes wait at shore without trapping either in work", () => {
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
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first!.id).not.toBe(second!.id);

    commitUntilWaiting(sim, first!);
    const pingoWait = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO);
    expect(pingoWait).toBeTruthy();
    pingoWait!.waitUntilTick = sim.state.tickIndex + 100_000;

    expect(commitFishingOpportunity(sim.state, second!.id)).toBe(true);
    const secondSlimeId = sim.state.opportunities.find((entry) => entry.activityId === second!.id)
      ?.assignedSlimeId;
    expect(secondSlimeId).toBe(SLIME_IDS.MOMO);
    for (let i = 0; i < 400; i += 1) {
      const momoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO);
      if (sim.state.slimes[SLIME_IDS.MOMO].state === "fishing_wait" && momoSession?.phase === "waiting") {
        break;
      }
      sim.tick();
    }

    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("fishing_wait");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("fishing_wait");
    expect(sim.state.fishingSessions).toHaveLength(2);
    expect(fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)?.phase).toBe("waiting");
    expect(fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO)?.phase).toBe("waiting");

    enterFight(sim.state, SLIME_IDS.PINGO);
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("fishing_bite");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("fishing_wait");
    const pingoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)!;
    expect(pingoSession.phase).toBe("fighting");
    pingoSession.fightStartedAtMs = 1;
    pingoSession.zoneStart = 0;
    pingoSession.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1)).toBe("hit");

    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("fishing_wait");
    expect(fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO)?.phase).toBe("waiting");

    enterFight(sim.state, SLIME_IDS.MOMO);
    const momoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO)!;
    expect(momoSession.phase).toBe("fighting");
    momoSession.fightStartedAtMs = 1;
    momoSession.zoneStart = 0;
    momoSession.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1)).toBe("hit");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("idle");
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
  });

  it("holds a second slime's bite until the hook bar is free", () => {
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
    fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)!.waitUntilTick =
      sim.state.tickIndex + 100_000;
    expect(commitFishingOpportunity(sim.state, second!.id)).toBe(true);
    for (let i = 0; i < 400; i += 1) {
      const momoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO);
      if (sim.state.slimes[SLIME_IDS.MOMO].state === "fishing_wait" && momoSession?.phase === "waiting") {
        break;
      }
      sim.tick();
    }

    enterFight(sim.state, SLIME_IDS.PINGO);
    const momoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.MOMO)!;
    momoSession.waitUntilTick = sim.state.tickIndex;
    for (let i = 0; i < 8; i += 1) {
      sim.tick();
    }

    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("fishing_bite");
    expect(momoSession.phase).toBe("bite");
    expect(fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)?.phase).toBe("fighting");

    const pingoSession = fishingSessionForSlime(sim.state.fishingSessions, SLIME_IDS.PINGO)!;
    pingoSession.fightStartedAtMs = 1;
    pingoSession.zoneStart = 0;
    pingoSession.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1)).toBe("hit");

    sim.tick();
    expect(momoSession.phase).toBe("fighting");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("fishing_bite");
    momoSession.fightStartedAtMs = 1;
    momoSession.zoneStart = 0;
    momoSession.zoneWidth = 1;
    expect(resolveStrike(sim.state, 1)).toBe("hit");
    expect(sim.state.slimes[SLIME_IDS.MOMO].state).toBe("idle");
    expect(sim.state.slimes[SLIME_IDS.PINGO].state).toBe("idle");
  });
});
