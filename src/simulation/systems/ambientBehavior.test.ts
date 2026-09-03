import { describe, expect, it } from "vitest";
import { SLIME_IDS } from "../entities/SlimeState";
import { HUNGER_THRESHOLDS, SATIETY_DECAY_PER_SECOND, SATIETY_MAX } from "../needsConfig";
import { PINGO_AMBIENT_INTEREST, MOMO_AMBIENT_INTEREST, TITO_AMBIENT_INTEREST } from "../ambientPersonality";
import { AMBIENT_BEHAVIORS } from "../ambientConfig";
import { SIMULATION_TICKS_PER_SECOND } from "../constants";
import { designateFarmTile, removeFarmTile } from "./FarmSystem";
import { createGatherTask, assignAvailableTasks } from "./JobSystem";
import { commitFishingOpportunity } from "./FishingOpportunitySystem";
import { spawnShallow, villageSim } from "./fishingTestUtils";
import { isAmbientEligible, isJobAssignable } from "./slimeAvailability";
import { behaviorScore, forceAmbientBehavior, cancelAmbientBehavior } from "./AmbientBehaviorSystem";
import { interestPointById } from "./InterestPointSystem";
import { Simulation } from "../Simulation";
import { GameState } from "../GameState";
import { createRng } from "../rng";
import { createVillageMap } from "@/src/world/villageMap";

describe("ambient eligibility", () => {
  it("lets an idle slime consider ambient", () => {
    const sim = villageSim();
    expect(isAmbientEligible(sim.state, sim.state.slimes[SLIME_IDS.PINGO])).toBe(true);
  });

  it("blocks working, hauling, eating, and fishing slimes", () => {
    const sim = villageSim();
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    slime.state = "working";
    slime.currentTaskId = "task";
    expect(isAmbientEligible(sim.state, slime)).toBe(false);
    slime.state = "carrying_to_storage";
    expect(isAmbientEligible(sim.state, slime)).toBe(false);
    slime.currentTaskId = undefined;
    slime.state = "eating";
    expect(isAmbientEligible(sim.state, slime)).toBe(false);
    slime.state = "fishing_wait";
    expect(isAmbientEligible(sim.state, slime)).toBe(false);
  });

  it("prioritizes eating when starving with food available", () => {
    const sim = villageSim();
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    slime.satiety = 10;
    sim.state.resources.food = 2;
    expect(isAmbientEligible(sim.state, slime)).toBe(false);
    expect(isJobAssignable(sim.state, slime)).toBe(false);
  });
});

describe("interest points", () => {
  it("derives water, farm, and nature points from world state", () => {
    const sim = villageSim();
    expect(sim.state.interestPoints.some((point) => point.tags.includes("water_edge"))).toBe(true);
    expect(sim.state.interestPoints.some((point) => point.tags.includes("tree"))).toBe(true);
    expect(sim.state.interestPoints.some((point) => point.tags.includes("storage"))).toBe(true);
    const before = sim.state.interestPoints.filter((point) => point.tags.includes("farm")).length;
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    expect(sim.state.interestPoints.filter((point) => point.tags.includes("farm")).length).toBe(before + 1);
  });

  it("invalidates farm interest when the plot is removed", () => {
    const sim = villageSim();
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    const id = "farm:2,12";
    expect(interestPointById(sim.state, id)).toBeTruthy();
    removeFarmTile(sim.state, 2, 12);
    expect(interestPointById(sim.state, id)).toBeUndefined();
  });
});

describe("personality weights", () => {
  it("scores Pingo toward water and Momo toward farm", () => {
    const water = AMBIENT_BEHAVIORS.find((entry) => entry.id === "observe_water")!;
    const farm = AMBIENT_BEHAVIORS.find((entry) => entry.id === "inspect_farm")!;
    const wander = AMBIENT_BEHAVIORS.find((entry) => entry.id === "wander")!;
    expect(behaviorScore(water, PINGO_AMBIENT_INTEREST, 3)).toBeGreaterThan(
      behaviorScore(water, MOMO_AMBIENT_INTEREST, 3),
    );
    expect(behaviorScore(farm, MOMO_AMBIENT_INTEREST, 3)).toBeGreaterThan(
      behaviorScore(farm, PINGO_AMBIENT_INTEREST, 3),
    );
    expect(behaviorScore(wander, TITO_AMBIENT_INTEREST, 3)).toBeGreaterThan(
      behaviorScore(wander, MOMO_AMBIENT_INTEREST, 3),
    );
  });
});

describe("ambient interruption and reservations", () => {
  it("cancels inspect_nature when a gathering job is assigned to Tito", () => {
    const sim = villageSim();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.TITO, "inspect_nature")).toBe(true);
    const slime = sim.state.slimes[SLIME_IDS.TITO];
    expect(slime.state === "moving_to_ambient" || slime.state === "ambient").toBe(true);
    const reserved = sim.state.interestPoints.find((point) => point.reservedBy === SLIME_IDS.TITO);
    expect(reserved).toBeTruthy();
    const task = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(slime.ambientBehaviorId).toBeUndefined();
    expect(sim.state.interestPoints.find((point) => point.reservedBy === SLIME_IDS.TITO)).toBeUndefined();
  });

  it("does not interrupt Pingo observe_water for a gathering job", () => {
    const sim = villageSim();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.PINGO, "observe_water")).toBe(true);
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    const task = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(slime.state === "moving_to_ambient" || slime.state === "ambient").toBe(true);
    expect(slime.ambientBehaviorId).toBe("observe_water");
  });

  it("lets Momo observe_water without becoming a fisher", () => {
    const sim = villageSim();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.MOMO, "observe_water")).toBe(true);
    expect(["moving_to_ambient", "ambient"]).toContain(sim.state.slimes[SLIME_IDS.MOMO].state);
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    expect(sim.state.opportunities[0].assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(sim.state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
  });

  it("moves from observe_water into fishing from the current tile", () => {
    const sim = villageSim();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.PINGO, "observe_water")).toBe(true);
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    const from = { x: slime.tileX, y: slime.tileY };
    const { activity } = spawnShallow(sim.state);
    expect(commitFishingOpportunity(sim.state, activity.id)).toBe(true);
    expect(slime.state).toBe("moving_to_fishing");
    expect(slime.tileX).toBe(from.x);
    expect(slime.tileY).toBe(from.y);
    expect(slime.ambientBehaviorId).toBeUndefined();
  });

  it("forces observe_water even when the slime is outside the local radius", () => {
    const sim = villageSim();
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    slime.tileX = 1;
    slime.tileY = 1;
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.PINGO, "observe_water")).toBe(true);
    expect(slime.state === "moving_to_ambient" || slime.state === "ambient").toBe(true);
  });

  it("does not reserve the same interest tile for two slimes", () => {
    const sim = villageSim();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.PINGO, "observe_water")).toBe(true);
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.MOMO, "observe_water")).toBe(true);
    const pingoPoint = sim.state.interestPoints.find((point) => point.reservedBy === SLIME_IDS.PINGO);
    const momoPoint = sim.state.interestPoints.find((point) => point.reservedBy === SLIME_IDS.MOMO);
    expect(pingoPoint).toBeTruthy();
    expect(momoPoint).toBeTruthy();
    expect(pingoPoint!.id).not.toBe(momoPoint!.id);
    cancelAmbientBehavior(sim.state, sim.state.slimes[SLIME_IDS.PINGO]);
    expect(sim.state.interestPoints.find((point) => point.reservedBy === SLIME_IDS.PINGO)).toBeUndefined();
  });
});

describe("satiety cozy pacing", () => {
  it("does not reach starvation near 70 seconds from full", () => {
    const sim = new Simulation();
    const ticks = 70 * SIMULATION_TICKS_PER_SECOND;
    for (let i = 0; i < ticks; i += 1) {
      sim.tick();
    }
    const satiety = sim.state.slimes[SLIME_IDS.PINGO].satiety;
    expect(satiety).toBeGreaterThan(HUNGER_THRESHOLDS.hungry);
    expect(SATIETY_MAX - satiety).toBeCloseTo(70 * SATIETY_DECAY_PER_SECOND, 0);
  });
});

describe("long idle ambient", () => {
  it("produces some ambient life without generating fish", () => {
    const sim = new Simulation(new GameState(createVillageMap(), createRng(7)));
    sim.state.nextAquaticSpawnTick = 999_999;
    let ambientTicks = 0;
    let idleTicks = 0;
    for (let i = 0; i < 480; i += 1) {
      sim.tick();
      for (const slime of Object.values(sim.state.slimes)) {
        if (slime.state === "ambient" || slime.state === "moving_to_ambient") {
          ambientTicks += 1;
        }
        if (slime.state === "idle") {
          idleTicks += 1;
        }
      }
    }
    expect(ambientTicks).toBeGreaterThan(0);
    expect(idleTicks).toBeGreaterThan(0);
    expect(Object.values(sim.state.fishInventory).every((count) => count === 0)).toBe(true);
    const task = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).toBeDefined();
  });
});
