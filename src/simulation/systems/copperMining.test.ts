import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { ObjectType } from "@/src/world/tileTypes";
import { COPPER_DEPOSIT_SEEDS } from "@/src/world/villageMap";
import {
  assignAvailableTasks,
  createGatherTask,
  designateGatherAt,
  inspectGatherTarget,
  inspectMiningTarget,
  startWorking,
} from "./JobSystem";
import { tickSlimes } from "./SlimeSystem";
import {
  COPPER_MINING_DURATION_MULTIPLIER,
  COPPER_ORE_GATHER_AMOUNT,
  SIMULATION_TICK_MS,
  WORK_DURATION_MS,
  workDurationMsForTask,
} from "../constants";
import { resolveGatherBundle } from "../data/materials";
import { spawnLilyVisitor } from "./VisitorSystem";
import { canPerformTaskCapabilities } from "../slimeCapabilities";
import { RESOURCE_IDS } from "../resources";
import { gatheringToolForTask, isPickaxeToolActive } from "@/src/game/render/gathering/chopPresentation";

function copperOrigin(state: GameState) {
  const deposit = state.grid.objects.find((object) => object.type === ObjectType.COPPER_ORE);
  expect(deposit).toBeDefined();
  return { x: deposit!.x, y: deposit!.y };
}

function finishWorking(state: GameState, durationMs: number): void {
  const ticks = durationMs / SIMULATION_TICK_MS;
  for (let i = 0; i < ticks; i += 1) {
    tickSlimes(state);
  }
}

describe("copper mining 05.6A.2", () => {
  it("resolves one copper ore and never an ingot", () => {
    expect(resolveGatherBundle("gather_copper", { next: () => 0 })).toEqual({
      copperOre: COPPER_ORE_GATHER_AMOUNT,
    });
    expect(JSON.stringify(resolveGatherBundle("gather_copper", { next: () => 0 }))).not.toMatch(
      /ingot/,
    );
    expect(workDurationMsForTask("gather_copper")).toBe(
      WORK_DURATION_MS * COPPER_MINING_DURATION_MULTIPLIER,
    );
    expect(workDurationMsForTask("gather_stone")).toBe(WORK_DURATION_MS);
  });

  it("seeds identifiable copper deposits separate from rocks", () => {
    const state = new GameState();
    const deposits = state.grid.objects.filter((object) => object.type === ObjectType.COPPER_ORE);
    expect(deposits.map((entry) => ({ x: entry.x, y: entry.y }))).toEqual([...COPPER_DEPOSIT_SEEDS]);
    const origin = copperOrigin(state);
    expect(inspectMiningTarget(state, origin)?.type).toBe("gather_copper");
    const rock = state.grid.objects.find((object) => object.type === ObjectType.ROCK)!;
    expect(inspectMiningTarget(state, { x: rock.x, y: rock.y })?.type).toBe("gather_stone");
    expect(inspectGatherTarget(state, "gather_stone", origin)).toBeNull();
    expect(inspectGatherTarget(state, "gather_copper", { x: rock.x, y: rock.y })).toBeNull();
  });

  it("assigns copper through gathering capability to Tito, not a slime id", () => {
    const state = new GameState();
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.TITO], { type: "gather_copper" })).toBe(
      true,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.MOMO], { type: "gather_copper" })).toBe(
      false,
    );
    spawnLilyVisitor(state);
    expect(
      canPerformTaskCapabilities(state.slimes[SLIME_IDS.LILY], { type: "gather_copper" }),
    ).toBe(false);
    const task = createGatherTask(state, "gather_copper");
    assignAvailableTasks(state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    const jobs = readFileSync("src/simulation/systems/JobSystem.ts", "utf8");
    expect(jobs).not.toMatch(/slime_tito/);
    expect(gatheringToolForTask("gather_copper")).toBe("pickaxe");
    expect(isPickaxeToolActive({ state: "working" }, task)).toBe(true);
  });

  it("takes twice as long as stone and depletes the deposit exactly once at commit", () => {
    const state = new GameState();
    const origin = copperOrigin(state);
    const tito = state.slimes[SLIME_IDS.TITO];
    const task = designateGatherAt(state, "gather_copper", origin);
    expect(task).toBeDefined();
    task!.state = "in_progress";
    task!.assignedSlimeId = tito.id;
    tito.currentTaskId = task!.id;
    startWorking(tito);
    finishWorking(state, WORK_DURATION_MS);
    expect(tito.carriedResource).toBeUndefined();
    expect(state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.COPPER_ORE);
    finishWorking(state, WORK_DURATION_MS);
    expect(tito.carriedResource).toEqual({ copperOre: COPPER_ORE_GATHER_AMOUNT });
    expect(state.resources.copperOre).toBe(0);
    expect(state.grid.objectAt(origin.x, origin.y)).toBeUndefined();
    const node = state.nodes.find((entry) => entry.id === task!.nodeId);
    expect(node?.depleted).toBe(true);
    expect(designateGatherAt(state, "gather_copper", origin)).toBeUndefined();
    expect(inspectMiningTarget(state, origin)).toBeNull();
  });

  it("credits copper discovery only after stored delivery", () => {
    const state = new GameState();
    const tito = state.slimes[SLIME_IDS.TITO];
    const task = createGatherTask(state, "gather_copper");
    task!.state = "in_progress";
    task!.assignedSlimeId = tito.id;
    tito.currentTaskId = task!.id;
    startWorking(tito);
    finishWorking(state, workDurationMsForTask("gather_copper"));
    expect(state.discoveredResources.copperOre).toBe(false);
    tito.tileX = state.storage.x;
    tito.tileY = state.storage.y;
    tito.path = [];
    tito.hopTo = undefined;
    tickSlimes(state);
    expect(state.resources.copperOre).toBe(COPPER_ORE_GATHER_AMOUNT);
    expect(state.discoveredResources.copperOre).toBe(true);
    expect(state.pendingMaterialToasts[0]?.lines).toEqual([
      { type: RESOURCE_IDS.COPPER_ORE, amount: COPPER_ORE_GATHER_AMOUNT },
    ]);
  });

  it("does not deplete copper when bedtime interrupts before commit", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const origin = copperOrigin(sim.state);
    const task = designateGatherAt(sim.state, "gather_copper", origin);
    assignAvailableTasks(sim.state);
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    tito.state = "working";
    tito.workElapsedMs = 100;
    sim.setClock({ hour: 23, minute: 0 });
    expect(tito.carriedResource).toBeUndefined();
    expect(sim.state.resources.copperOre).toBe(0);
    expect(sim.state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.COPPER_ORE);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.TITO).toBe(true);
  });

  it("keeps committed copper cargo through bedtime after the deposit is gone", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const origin = copperOrigin(sim.state);
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    const task = designateGatherAt(sim.state, "gather_copper", origin)!;
    task.state = "in_progress";
    task.assignedSlimeId = tito.id;
    tito.currentTaskId = task.id;
    startWorking(tito);
    finishWorking(sim.state, workDurationMsForTask("gather_copper"));
    expect(tito.carriedResource).toEqual({ copperOre: COPPER_ORE_GATHER_AMOUNT });
    expect(sim.state.grid.objectAt(origin.x, origin.y)).toBeUndefined();
    tito.tileX = sim.state.storage.x;
    tito.tileY = sim.state.storage.y;
    tito.path = [];
    sim.setClock({ hour: 23, minute: 0 });
    expect(tito.carriedResource).toEqual({ copperOre: COPPER_ORE_GATHER_AMOUNT });
    sim.tick();
    expect(sim.state.resources.copperOre).toBe(COPPER_ORE_GATHER_AMOUNT);
  });
});
