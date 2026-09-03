import { describe, expect, it } from "vitest";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import type { Task } from "../entities/Task";
import { GATHER_AMOUNT } from "../constants";
import { designateFarmTile } from "./FarmSystem";
import { assignAvailableTasks, createGatherTask } from "./JobSystem";
import { uniqueCapabilities } from "../slimeCapabilities";
import { forceAmbientBehavior } from "./AmbientBehaviorSystem";
import { EAT_FOOD_COST } from "../needsConfig";

const FARM_X = 2;
const FARM_Y = 12;

function universalTask(state: GameState, id: string): Task {
  const task: Task = {
    id,
    type: "gather_wood",
    target: { x: 8, y: 6 },
    nodeId: id,
    workTile: { x: 8, y: 6 },
    state: "available",
    requiredCapabilities: [],
  };
  state.tasks[task.id] = task;
  return task;
}

describe("job capability eligibility", () => {
  it("assigns gathering to Tito only", () => {
    const state = new GameState();
    const wood = createGatherTask(state, "gather_wood");
    assignAvailableTasks(state);
    expect(wood?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
  });

  it("leaves a second gather task available while Tito is busy", () => {
    const state = new GameState();
    const first = createGatherTask(state, "gather_wood");
    const second = createGatherTask(state, "gather_wood");
    assignAvailableTasks(state);
    expect(first?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(second?.state).toBe("available");
    expect(second?.assignedSlimeId).toBeUndefined();
  });

  it("assigns farm work to Momo only", () => {
    const sim = new Simulation();
    expect(designateFarmTile(sim.state, FARM_X, FARM_Y)).toBe(true);
    sim.tick();
    const farm = Object.values(sim.state.tasks).find(
      (task) => task.type === "till_soil" && task.state !== "cancelled",
    );
    expect(farm?.assignedSlimeId).toBe(SLIME_IDS.MOMO);
    expect(sim.state.slimes[SLIME_IDS.PINGO].currentTaskId).not.toBe(farm?.id);
    expect(sim.state.slimes[SLIME_IDS.TITO].currentTaskId).not.toBe(farm?.id);
  });

  it("lets a gatherer finish carry and delivery without a mid-job capability reject", () => {
    const sim = new Simulation();
    const created = createGatherTask(sim.state, "gather_wood");
    expect(created).toBeDefined();
    for (let i = 0; i < 240; i += 1) {
      sim.tick();
      if (sim.state.resources.wood >= GATHER_AMOUNT) {
        break;
      }
    }
    expect(sim.state.resources.wood).toBe(GATHER_AMOUNT);
    expect(created?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(created?.state).toBe("completed");
    expect(sim.state.slimes[SLIME_IDS.TITO].state).toBe("idle");
  });

  it("lets Momo harvest then deliver food as a continuation of farming", () => {
    const sim = new Simulation();
    expect(designateFarmTile(sim.state, FARM_X, FARM_Y)).toBe(true);
    for (let i = 0; i < 400; i += 1) {
      const plot = sim.state.farmAt(FARM_X, FARM_Y);
      if (plot && (plot.state === "growing" || plot.state === "planted")) {
        plot.growthMs = 999_999;
      }
      sim.tick();
      if (sim.state.resources.food > 0) {
        break;
      }
    }
    expect(sim.state.resources.food).toBeGreaterThan(0);
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    expect(momo.carriedResource).toBeUndefined();
    expect(["idle", "ambient", "moving_to_ambient"]).toContain(momo.state);
  });

  it("still assigns universal jobs with no required capabilities", () => {
    const state = new GameState();
    const task = universalTask(state, "universal_1");
    assignAvailableTasks(state);
    expect(task.assignedSlimeId).toBe(SLIME_IDS.PINGO);
  });

  it("supports a synthetic future tag without changing JobSystem logic", () => {
    const state = new GameState();
    state.slimes[SLIME_IDS.MOMO].capabilities = uniqueCapabilities(["test_special"]);
    const task: Task = {
      id: "synth_1",
      type: "gather_wood",
      target: { x: 9, y: 6 },
      nodeId: "synth",
      workTile: { x: 9, y: 6 },
      state: "available",
      requiredCapabilities: ["test_special"],
    };
    state.tasks[task.id] = task;
    assignAvailableTasks(state);
    expect(task.assignedSlimeId).toBe(SLIME_IDS.MOMO);
    expect(state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(state.slimes[SLIME_IDS.TITO].currentTaskId).toBeUndefined();
  });

  it("does not leak capability filters into ambient water observation", () => {
    const sim = new Simulation();
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.MOMO, "observe_water")).toBe(true);
    expect(forceAmbientBehavior(sim.state, SLIME_IDS.TITO, "observe_water")).toBe(true);
    expect(["moving_to_ambient", "ambient"]).toContain(sim.state.slimes[SLIME_IDS.MOMO].state);
    expect(["moving_to_ambient", "ambient"]).toContain(sim.state.slimes[SLIME_IDS.TITO].state);
  });

  it("lets every slime eat regardless of productive capabilities", () => {
    const sim = new Simulation();
    sim.state.resources.food = EAT_FOOD_COST * 3;
    for (const slime of Object.values(sim.state.slimes)) {
      slime.satiety = 5;
    }
    sim.tick();
    const eating = Object.values(sim.state.slimes).filter(
      (slime) => slime.state === "moving_to_food" || slime.state === "eating",
    );
    expect(eating.length).toBeGreaterThan(0);
  });
});
