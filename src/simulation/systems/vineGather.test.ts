import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { createVillageMap } from "@/src/world/villageMap";
import { SLIME_IDS } from "../entities/SlimeState";
import {
  assignAvailableTasks,
  createGatherTask,
  deliver,
  startWorking,
} from "./JobSystem";
import { tickSlimes } from "./SlimeSystem";
import { GATHER_AMOUNT, SIMULATION_TICK_MS, WORK_DURATION_MS } from "../constants";
import { createRng, type Rng } from "../rng";
import {
  MATERIAL_ICON_FILES,
  MATERIALS,
  resolveGatherBundle,
  WOOD_GATHER_VINE_BONUS,
} from "../data/materials";
import { placeConstructionSite } from "./BuildingSystem";
import { tryConsumeFood } from "./NeedsSystem";
import { EAT_FOOD_COST } from "../needsConfig";

function countingRng(rolls: number[]): { rng: Rng; calls: () => number } {
  const inner = createRng(99);
  let calls = 0;
  const rng: Rng = {
    next() {
      const scripted = rolls[calls];
      calls += 1;
      return scripted ?? inner.next();
    },
    range: (min, max) => inner.range(min, max),
    pick: (items) => inner.pick(items),
    pickWeighted: (items) => inner.pickWeighted(items),
  };
  return { rng, calls: () => calls };
}

function finishGatherWork(state: GameState, type: "gather_wood" | "gather_stone") {
  const slime = state.slimes[SLIME_IDS.TITO];
  const task = createGatherTask(state, type);
  expect(task).toBeDefined();
  task!.state = "in_progress";
  task!.assignedSlimeId = slime.id;
  slime.currentTaskId = task!.id;
  startWorking(slime);
  const ticks = WORK_DURATION_MS / SIMULATION_TICK_MS;
  for (let i = 0; i < ticks; i += 1) {
    tickSlimes(state);
  }
  return { slime, task: task! };
}

describe("vine gather 05.6A.1", () => {
  it("keeps the Vine.png material asset on disk for the player-facing summary", () => {
    expect(MATERIALS.vine.iconSrc).toBe("/assets/world/materials/Vine.png");
    expect(existsSync(MATERIAL_ICON_FILES.vine)).toBe(true);
  });

  it("always yields wood and grants vine only below the chance boundary", () => {
    expect(WOOD_GATHER_VINE_BONUS).toEqual({ chance: 0.25, quantity: 1 });
    expect(resolveGatherBundle("gather_wood", { next: () => 0 })).toEqual({
      wood: GATHER_AMOUNT,
      vine: 1,
    });
    expect(resolveGatherBundle("gather_wood", { next: () => 0.249 })).toEqual({
      wood: GATHER_AMOUNT,
      vine: 1,
    });
    expect(resolveGatherBundle("gather_wood", { next: () => 0.25 })).toEqual({ wood: GATHER_AMOUNT });
    expect(resolveGatherBundle("gather_wood", { next: () => 1 })).toEqual({ wood: GATHER_AMOUNT });
  });

  it("never rolls vines for stone gathering", () => {
    let called = false;
    const bundle = resolveGatherBundle("gather_stone", {
      next() {
        called = true;
        return 0;
      },
    });
    expect(bundle).toEqual({ stone: GATHER_AMOUNT });
    expect(called).toBe(false);
  });

  it("skips RNG when a force override is set", () => {
    let called = false;
    const rng = {
      next() {
        called = true;
        return 0;
      },
    };
    expect(resolveGatherBundle("gather_wood", rng, { forceVineBonus: true })).toEqual({
      wood: GATHER_AMOUNT,
      vine: 1,
    });
    expect(resolveGatherBundle("gather_wood", rng, { forceVineBonus: false })).toEqual({
      wood: GATHER_AMOUNT,
    });
    expect(called).toBe(false);
  });

  it("resolves the vine bonus exactly once per completed wood collection", () => {
    const scripted = countingRng([0]);
    const state = new GameState(createVillageMap(), scripted.rng);
    const { slime } = finishGatherWork(state, "gather_wood");
    expect(scripted.calls()).toBe(1);
    expect(slime.carriedResource).toEqual({ wood: GATHER_AMOUNT, vine: 1 });
    expect(state.resources.wood).toBe(0);
    expect(state.resources.vine).toBe(0);

    const cargo = { ...slime.carriedResource };
    tickSlimes(state);
    expect(scripted.calls()).toBe(1);
    expect(slime.carriedResource).toEqual(cargo);
    expect(state.resources.wood).toBe(0);
    expect(state.resources.vine).toBe(0);

    slime.tileX = state.storage.x;
    slime.tileY = state.storage.y;
    slime.path = [];
    slime.hopTo = undefined;
    slime.state = "carrying_to_storage";
    tickSlimes(state);
    expect(state.resources.wood).toBe(GATHER_AMOUNT);
    expect(state.resources.vine).toBe(1);
    expect(scripted.calls()).toBe(1);
    expect(state.pendingMaterialToasts).toHaveLength(1);
    deliver(state, slime);
    expect(state.resources.wood).toBe(GATHER_AMOUNT);
    expect(state.resources.vine).toBe(1);
    expect(state.pendingMaterialToasts).toHaveLength(1);
    expect(state.pendingMaterialToasts[0]?.lines).toEqual([{ type: "vine", amount: 1 }]);
  });

  it("does not award materials when gather is interrupted before collection commits", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    const task = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    tito.state = "working";
    tito.workElapsedMs = 100;
    sim.setClock({ hour: 23, minute: 0 });
    expect(tito.carriedResource).toBeUndefined();
    expect(sim.state.resources.wood).toBe(0);
    expect(sim.state.resources.vine).toBe(0);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.TITO).toBe(true);
  });

  it("keeps a wood-plus-vine cargo through pause, bedtime, and a second deliver", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.carriedResource = { wood: GATHER_AMOUNT, vine: 1 };
    tito.state = "carrying_to_storage";
    tito.tileX = sim.state.storage.x;
    tito.tileY = sim.state.storage.y;
    tito.path = [];
    sim.setPaused(true);
    sim.update(4000);
    expect(tito.carriedResource).toEqual({ wood: GATHER_AMOUNT, vine: 1 });
    expect(sim.state.resources.wood).toBe(0);
    expect(sim.state.resources.vine).toBe(0);

    sim.setPaused(false);
    sim.setClock({ hour: 23, minute: 0 });
    expect(tito.carriedResource).toEqual({ wood: GATHER_AMOUNT, vine: 1 });
    sim.tick();
    expect(sim.state.resources.wood).toBe(GATHER_AMOUNT);
    expect(sim.state.resources.vine).toBe(1);
    expect(tito.carriedResource).toBeUndefined();
    deliver(sim.state, tito);
    expect(sim.state.resources.wood).toBe(GATHER_AMOUNT);
    expect(sim.state.resources.vine).toBe(1);
  });

  it("does not credit stock until a wood-plus-vine cargo is delivered", () => {
    const state = new GameState(createVillageMap(), countingRng([0]).rng);
    const { slime } = finishGatherWork(state, "gather_wood");
    expect(slime.carriedResource).toEqual({ wood: GATHER_AMOUNT, vine: 1 });
    slime.state = "carrying_to_storage";
    slime.tileX = 0;
    slime.tileY = 0;
    slime.path = [];
    tickSlimes(state);
    expect(state.resources.wood).toBe(0);
    expect(state.resources.vine).toBe(0);
  });

  it("never produces vines from stone gathering even with a vine-forcing roll", () => {
    const state = new GameState(createVillageMap(), countingRng([0, 0, 0]).rng);
    const { slime } = finishGatherWork(state, "gather_stone");
    expect(slime.carriedResource).toEqual({ stone: GATHER_AMOUNT });
    expect(slime.carriedResource?.vine).toBeUndefined();
    slime.tileX = state.storage.x;
    slime.tileY = state.storage.y;
    slime.path = [];
    slime.hopTo = undefined;
    tickSlimes(state);
    expect(state.resources.stone).toBe(GATHER_AMOUNT);
    expect(state.resources.vine).toBe(0);
    expect(state.pendingMaterialToasts).toEqual([]);
  });

  it("preserves construction costs and food consumption", () => {
    const sim = new Simulation();
    sim.state.resources.wood = 20;
    sim.state.resources.stone = 20;
    sim.state.resources.food = 4;
    sim.state.resources.vine = 3;
    delete sim.state.buildings.home_tito;
    const site = placeConstructionSite(sim.state, "brown_house", { x: 7, y: 11 });
    expect(site).not.toBeNull();
    expect(sim.state.resources.wood).toBe(14);
    expect(sim.state.resources.stone).toBe(16);
    expect(sim.state.resources.vine).toBe(3);
    expect(tryConsumeFood(sim.state, EAT_FOOD_COST)).toBe(true);
    expect(sim.state.resources.food).toBe(3);
    expect(sim.state.resources.vine).toBe(3);
  });
});
