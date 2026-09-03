import { describe, expect, it } from "vitest";
import { Simulation } from "../Simulation";
import { GameState } from "../GameState";
import { SLIME_IDS } from "../entities/SlimeState";
import { hungerState, EAT_FOOD_COST, EAT_SATIETY_RESTORE, SATIETY_INITIAL } from "../needsConfig";
import { tryConsumeFood } from "./NeedsSystem";
import { createGatherTask, assignAvailableTasks } from "./JobSystem";

describe("needs system", () => {
  it("decreases satiety on each simulation tick", () => {
    const sim = new Simulation();
    const before = sim.state.slimes[SLIME_IDS.PINGO].satiety;
    expect(before).toBe(SATIETY_INITIAL);
    sim.tick();
    expect(sim.state.slimes[SLIME_IDS.PINGO].satiety).toBeLessThan(before);
  });

  it("derives hunger states from satiety thresholds", () => {
    expect(hungerState(100)).toBe("fed");
    expect(hungerState(75)).toBe("fed");
    expect(hungerState(74)).toBe("normal");
    expect(hungerState(40)).toBe("normal");
    expect(hungerState(39)).toBe("hungry");
    expect(hungerState(15)).toBe("hungry");
    expect(hungerState(14)).toBe("starving");
    expect(hungerState(0)).toBe("starving");
  });

  it("consumes food and restores satiety when a hungry slime eats", () => {
    const sim = new Simulation();
    const slime = sim.state.slimes[SLIME_IDS.PINGO];
    slime.tileX = sim.state.storage.x;
    slime.tileY = sim.state.storage.y;
    slime.satiety = 10;
    slime.idleWanderTicks = 99;
    sim.state.resources.food = 3;
    sim.tick();
    expect(sim.state.resources.food).toBe(3 - EAT_FOOD_COST);
    expect(slime.state).toBe("eating");
    for (let i = 0; i < 20; i += 1) {
      sim.tick();
      if (slime.state === "idle") {
        break;
      }
    }
    expect(slime.state).toBe("idle");
    expect(slime.satiety).toBeGreaterThan(10);
    expect(slime.satiety).toBeGreaterThanOrEqual(10 + EAT_SATIETY_RESTORE - 5);
  });

  it("does not let two slimes consume the same food unit", () => {
    const sim = new Simulation();
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    for (const slime of [pingo, momo]) {
      slime.tileX = sim.state.storage.x;
      slime.tileY = sim.state.storage.y;
      slime.satiety = 10;
      slime.idleWanderTicks = 99;
    }
    sim.state.resources.food = 1;
    sim.tick();
    expect(sim.state.resources.food).toBe(0);
    const eating = [pingo, momo].filter((slime) => slime.state === "eating");
    expect(eating).toHaveLength(1);
    const idle = [pingo, momo].filter((slime) => slime.state !== "eating");
    expect(idle).toHaveLength(1);
  });

  it("tryConsumeFood is atomic", () => {
    const state = new GameState();
    state.resources.food = 1;
    expect(tryConsumeFood(state, 1)).toBe(true);
    expect(state.resources.food).toBe(0);
    expect(tryConsumeFood(state, 1)).toBe(false);
    expect(state.resources.food).toBe(0);
  });

  it("does not lock the simulation when food is zero", () => {
    const sim = new Simulation();
    for (const slime of Object.values(sim.state.slimes)) {
      slime.satiety = 5;
    }
    sim.state.resources.food = 0;
    for (let i = 0; i < 12; i += 1) {
      sim.tick();
    }
    expect(sim.tickCount).toBe(12);
    for (const slime of Object.values(sim.state.slimes)) {
      expect(["idle", "ambient", "moving_to_ambient"]).toContain(slime.state);
      expect(slime.state === "moving_to_food" || slime.state === "eating").toBe(false);
    }
  });

  it("starving slimes skip new work when food exists and go eat instead", () => {
    const sim = new Simulation();
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.satiety = 5;
    sim.state.resources.food = 4;
    const task = createGatherTask(sim.state, "gather_wood");
    expect(task).toBeDefined();
    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).not.toBe(SLIME_IDS.PINGO);
    sim.tick();
    expect(pingo.state === "moving_to_food" || pingo.state === "eating").toBe(true);
    expect(pingo.currentTaskId).toBeUndefined();
  });

  it("starving slimes still take jobs when food is zero so the farm can bootstrap", () => {
    const sim = new Simulation();
    for (const slime of Object.values(sim.state.slimes)) {
      slime.satiety = 5;
    }
    sim.state.resources.food = 0;
    const task = createGatherTask(sim.state, "gather_wood");
    sim.tick();
    expect(task?.assignedSlimeId).toBeDefined();
    expect(task?.state === "assigned" || task?.state === "in_progress").toBe(true);
  });

  it("hungry slimes keep working when food is zero", () => {
    const sim = new Simulation();
    for (const slime of Object.values(sim.state.slimes)) {
      slime.satiety = 25;
    }
    sim.state.resources.food = 0;
    const task = createGatherTask(sim.state, "gather_wood");
    sim.tick();
    expect(task?.assignedSlimeId).toBeDefined();
    const worker = sim.state.slimes[task!.assignedSlimeId!];
    expect(worker.state === "moving_to_task" || worker.state === "working" || worker.state === "idle").toBe(
      true,
    );
    expect(worker.state === "moving_to_food" || worker.state === "eating").toBe(false);
  });
});
