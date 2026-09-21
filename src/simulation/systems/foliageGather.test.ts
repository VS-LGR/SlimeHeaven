import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { ObjectType } from "@/src/world/tileTypes";
import {
  assignAvailableTasks,
  createGatherTask,
  designateGatherAt,
  inspectFoliageTarget,
  inspectGatherTarget,
  startWorking,
} from "./JobSystem";
import { tickSlimes } from "./SlimeSystem";
import {
  FOLIAGE_GATHER_AMOUNT,
  FOLIAGE_REGEN_GAME_MINUTES,
  SIMULATION_TICK_MS,
  WORK_DURATION_MS,
} from "../constants";
import { resolveGatherBundle } from "../data/materials";
import { setWorldClock } from "../worldTime";
import { spawnLilyVisitor } from "./VisitorSystem";
import { canPerformTaskCapabilities, requiredCapabilitiesForTask } from "../slimeCapabilities";
import { RESOURCE_IDS } from "../resources";

function treeOrigin(state: GameState) {
  const tree = state.grid.objects.find((object) => object.type === ObjectType.TREE);
  expect(tree).toBeDefined();
  return { x: tree!.x, y: tree!.y };
}

function finishWorking(state: GameState, durationMs = WORK_DURATION_MS): void {
  const ticks = durationMs / SIMULATION_TICK_MS;
  for (let i = 0; i < ticks; i += 1) {
    tickSlimes(state);
  }
}

describe("foliage gather 05.6A.2", () => {
  it("resolves one foliage and never wood, vine, or ingot", () => {
    expect(resolveGatherBundle("gather_foliage", { next: () => 0 })).toEqual({
      foliage: FOLIAGE_GATHER_AMOUNT,
    });
    expect(resolveGatherBundle("gather_foliage", { next: () => 0 }).wood).toBeUndefined();
    expect(resolveGatherBundle("gather_foliage", { next: () => 0 }).vine).toBeUndefined();
  });

  it("makes Momo eligible through foraging, not a slime id check", () => {
    const state = new GameState();
    expect(requiredCapabilitiesForTask({ type: "gather_foliage" })).toEqual(["foraging"]);
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.MOMO], { type: "gather_foliage" })).toBe(
      true,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.TITO], { type: "gather_foliage" })).toBe(
      false,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.PINGO], { type: "gather_foliage" })).toBe(
      false,
    );
    const jobs = readFileSync("src/simulation/systems/JobSystem.ts", "utf8");
    expect(jobs).not.toMatch(/slime_momo/);
    expect(state.slimes[SLIME_IDS.MOMO].jobAffinity?.foraging).toBe(1.25);
  });

  it("rejects Lily while she is a visitor", () => {
    const state = new GameState();
    spawnLilyVisitor(state);
    const lily = state.slimes[SLIME_IDS.LILY];
    expect(lily).toBeDefined();
    expect(lily.capabilities).toEqual([]);
    expect(canPerformTaskCapabilities(lily, { type: "gather_foliage" })).toBe(false);
    const task = createGatherTask(state, "gather_foliage");
    assignAvailableTasks(state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.MOMO);
    expect(lily.currentTaskId).toBeUndefined();
  });

  it("assigns foliage to Momo and keeps the tree in the world", () => {
    const state = new GameState();
    const origin = treeOrigin(state);
    const task = designateGatherAt(state, "gather_foliage", origin);
    assignAvailableTasks(state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.MOMO);
    expect(state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.TREE);
    const momo = state.slimes[SLIME_IDS.MOMO];
    task!.state = "in_progress";
    momo.currentTaskId = task!.id;
    startWorking(momo);
    finishWorking(state);
    expect(momo.carriedResource).toEqual({ foliage: FOLIAGE_GATHER_AMOUNT });
    expect(state.resources.foliage).toBe(0);
    expect(state.discoveredResources.foliage).toBe(false);
    expect(state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.TREE);
  });

  it("credits foliage and discovery only after delivery", () => {
    const state = new GameState();
    const momo = state.slimes[SLIME_IDS.MOMO];
    const task = createGatherTask(state, "gather_foliage");
    task!.state = "in_progress";
    task!.assignedSlimeId = momo.id;
    momo.currentTaskId = task!.id;
    startWorking(momo);
    finishWorking(state);
    expect(state.resources.foliage).toBe(0);
    momo.tileX = state.storage.x;
    momo.tileY = state.storage.y;
    momo.path = [];
    momo.hopTo = undefined;
    tickSlimes(state);
    expect(state.resources.foliage).toBe(FOLIAGE_GATHER_AMOUNT);
    expect(state.discoveredResources.foliage).toBe(true);
    expect(state.pendingMaterialToasts[0]?.lines).toEqual([
      { type: RESOURCE_IDS.FOLIAGE, amount: FOLIAGE_GATHER_AMOUNT },
    ]);
  });

  it("blocks a second foliage job on the same tree and shares occupancy with wood", () => {
    const state = new GameState();
    const origin = treeOrigin(state);
    const first = designateGatherAt(state, "gather_foliage", origin);
    expect(first).toBeDefined();
    expect(designateGatherAt(state, "gather_foliage", origin)).toBeUndefined();
    expect(inspectFoliageTarget(state, origin)?.valid).toBe(false);
    expect(inspectGatherTarget(state, "gather_wood", origin)?.valid).toBe(false);

    const other = state.grid.objects.find(
      (object) => object.type === ObjectType.TREE && (object.x !== origin.x || object.y !== origin.y),
    );
    expect(other).toBeDefined();
    const wood = designateGatherAt(state, "gather_wood", { x: other!.x, y: other!.y });
    expect(wood).toBeDefined();
    expect(designateGatherAt(state, "gather_foliage", { x: other!.x, y: other!.y })).toBeUndefined();
  });

  it("starts regen only after commit and restores availability after 6 game hours including midnight", () => {
    const state = new GameState();
    setWorldClock(state.worldTime, { hour: 22, minute: 0 });
    const origin = treeOrigin(state);
    const node = state.gatherNodeAtTile(RESOURCE_IDS.FOLIAGE, origin.x, origin.y)!;
    const momo = state.slimes[SLIME_IDS.MOMO];
    const task = designateGatherAt(state, "gather_foliage", origin);
    task!.state = "in_progress";
    task!.assignedSlimeId = momo.id;
    momo.currentTaskId = task!.id;
    startWorking(momo);
    expect(inspectFoliageTarget(state, origin)?.reason).toBe("reserved");
    finishWorking(state);
    expect(node.foliageReadyAtMinute).toBe(state.worldTime.totalGameMinutes + FOLIAGE_REGEN_GAME_MINUTES);
    expect(state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.TREE);
    momo.tileX = state.storage.x;
    momo.tileY = state.storage.y;
    momo.path = [];
    momo.hopTo = undefined;
    tickSlimes(state);
    expect(inspectFoliageTarget(state, origin)?.reason).toBe("regenerating");

    setWorldClock(state.worldTime, { hour: 3, minute: 0, day: 2 });
    expect(inspectFoliageTarget(state, origin)?.reason).toBe("regenerating");
    setWorldClock(state.worldTime, { hour: 4, minute: 0, day: 2 });
    expect(inspectFoliageTarget(state, origin)?.valid).toBe(true);
    expect(designateGatherAt(state, "gather_foliage", origin)).toBeDefined();
  });

  it("cancels foliage before commit with no reward or regen", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const origin = treeOrigin(sim.state);
    const node = sim.state.gatherNodeAtTile(RESOURCE_IDS.FOLIAGE, origin.x, origin.y)!;
    const task = designateGatherAt(sim.state, "gather_foliage", origin);
    assignAvailableTasks(sim.state);
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    momo.state = "working";
    momo.workElapsedMs = 100;
    sim.setClock({ hour: 21, minute: 30 });
    expect(momo.carriedResource).toBeUndefined();
    expect(sim.state.resources.foliage).toBe(0);
    expect(node.foliageReadyAtMinute ?? 0).toBe(0);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.MOMO).toBe(true);
  });

  it("keeps committed foliage cargo through bedtime", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    momo.carriedResource = { foliage: FOLIAGE_GATHER_AMOUNT };
    momo.state = "carrying_to_storage";
    momo.tileX = sim.state.storage.x;
    momo.tileY = sim.state.storage.y;
    momo.path = [];
    sim.setClock({ hour: 21, minute: 30 });
    expect(momo.carriedResource).toEqual({ foliage: FOLIAGE_GATHER_AMOUNT });
    sim.tick();
    expect(sim.state.resources.foliage).toBe(FOLIAGE_GATHER_AMOUNT);
    expect(sim.state.discoveredResources.foliage).toBe(true);
  });
});
