import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { ObjectType } from "@/src/world/tileTypes";
import { CORAL_SEEDS } from "@/src/world/villageMap";
import {
  assignAvailableTasks,
  cancelTask,
  createGatherTask,
  designateGatherAt,
  inspectCoralTarget,
  inspectShoreTarget,
  startWorking,
} from "./JobSystem";
import { tickSlimes } from "./SlimeSystem";
import {
  CORAL_COLLECT_DURATION_MULTIPLIER,
  CORAL_GATHER_AMOUNT,
  SIMULATION_TICK_MS,
  WORK_DURATION_MS,
  workDurationMsForTask,
} from "../constants";
import { resolveGatherBundle } from "../data/materials";
import { setWorldClock } from "../worldTime";
import { spawnLilyVisitor } from "./VisitorSystem";
import { canPerformTaskCapabilities, requiredCapabilitiesForTask } from "../slimeCapabilities";
import { RESOURCE_IDS } from "../resources";
import { slimeView } from "@/src/game/render/slimeView";
import { SLIME_ANIM } from "@/src/game/render/slimeVisualConfig";
import { isLandTileReserved } from "../waterBodies";
import type { Task } from "../entities/Task";

function coralOrigin(state: GameState) {
  const coral = state.grid.objects.find((object) => object.type === ObjectType.CORAL);
  expect(coral).toBeDefined();
  return { x: coral!.x, y: coral!.y };
}

function finishWorking(state: GameState, durationMs: number): void {
  const ticks = durationMs / SIMULATION_TICK_MS;
  for (let i = 0; i < ticks; i += 1) {
    tickSlimes(state);
  }
}

function dummyTask(type: Task["type"]): Task {
  return {
    id: "task_test",
    type,
    target: { x: 0, y: 0 },
    nodeId: "n",
    workTile: { x: 0, y: 0 },
    state: "in_progress",
  };
}

describe("coral collect 05.6A.3", () => {
  it("resolves one coral and never fish or ingot", () => {
    expect(resolveGatherBundle("collect_coral", { next: () => 0 })).toEqual({
      coral: CORAL_GATHER_AMOUNT,
    });
    expect(JSON.stringify(resolveGatherBundle("collect_coral", { next: () => 0 }))).not.toMatch(
      /ingot|fish|blue_darter/,
    );
    expect(workDurationMsForTask("collect_coral")).toBe(
      WORK_DURATION_MS * CORAL_COLLECT_DURATION_MULTIPLIER,
    );
    expect(workDurationMsForTask("inspect_shore")).toBe(WORK_DURATION_MS);
  });

  it("seeds identifiable coral on water, not as land rocks", () => {
    const state = new GameState();
    const corals = state.grid.objects.filter((object) => object.type === ObjectType.CORAL);
    expect(corals.map((entry) => ({ x: entry.x, y: entry.y, variant: entry.variant }))).toEqual([
      ...CORAL_SEEDS,
    ]);
    for (const seed of CORAL_SEEDS) {
      expect(state.grid.isWalkable(seed.x, seed.y)).toBe(false);
      expect(inspectCoralTarget(state, seed)?.valid).toBe(true);
    }
    const rock = state.grid.objects.find((object) => object.type === ObjectType.ROCK)!;
    expect(inspectCoralTarget(state, { x: rock.x, y: rock.y })).toBeNull();
    expect(state.interestPoints.some((point) => point.tags.includes("rock") && CORAL_SEEDS.some((seed) => seed.x === point.tile.x && seed.y === point.tile.y))).toBe(false);
  });

  it("assigns coral through aquatic_foraging to Pingo, not a slime id", () => {
    const state = new GameState();
    setWorldClock(state.worldTime, { hour: 12, minute: 0 });
    expect(requiredCapabilitiesForTask({ type: "collect_coral" })).toEqual(["aquatic_foraging"]);
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.PINGO], { type: "collect_coral" })).toBe(
      true,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.MOMO], { type: "collect_coral" })).toBe(
      false,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.TITO], { type: "collect_coral" })).toBe(
      false,
    );
    spawnLilyVisitor(state);
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.LILY], { type: "collect_coral" })).toBe(
      false,
    );
    const task = createGatherTask(state, "collect_coral");
    assignAvailableTasks(state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    const jobs = readFileSync("src/simulation/systems/JobSystem.ts", "utf8");
    expect(jobs).not.toMatch(/slime_pingo/);
  });

  it("is not fishing: no opportunity, session, or fish toast path", () => {
    const state = new GameState();
    const origin = coralOrigin(state);
    const task = designateGatherAt(state, "collect_coral", origin);
    expect(task?.type).toBe("collect_coral");
    expect(state.opportunities).toHaveLength(0);
    expect(state.fishingSessions).toHaveLength(0);
    expect(state.fishing.phase).toBe("idle");
    const controller = readFileSync("src/game/input/FishingController.ts", "utf8");
    expect(controller).not.toMatch(/collect_coral|inspect_shore/);
  });

  it("takes twice as long as shore inspect and depletes exactly once at commit", () => {
    const state = new GameState();
    const origin = coralOrigin(state);
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(state, "collect_coral", origin);
    expect(task).toBeDefined();
    expect(state.grid.isWalkable(task!.workTile.x, task!.workTile.y)).toBe(true);
    task!.state = "in_progress";
    task!.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task!.id;
    startWorking(pingo, task!.target);
    finishWorking(state, WORK_DURATION_MS);
    expect(pingo.carriedResource).toBeUndefined();
    expect(state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.CORAL);
    finishWorking(state, WORK_DURATION_MS);
    expect(pingo.carriedResource).toEqual({ coral: CORAL_GATHER_AMOUNT });
    expect(state.resources.coral).toBe(0);
    expect(state.grid.objectAt(origin.x, origin.y)).toBeUndefined();
    const node = state.nodes.find((entry) => entry.id === task!.nodeId);
    expect(node?.depleted).toBe(true);
    expect(designateGatherAt(state, "collect_coral", origin)).toBeUndefined();
    expect(inspectCoralTarget(state, origin)?.reason).toBe("depleted");
  });

  it("credits coral discovery only after stored delivery", () => {
    const state = new GameState();
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const task = createGatherTask(state, "collect_coral");
    task!.state = "in_progress";
    task!.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task!.id;
    startWorking(pingo);
    finishWorking(state, workDurationMsForTask("collect_coral"));
    expect(state.discoveredResources.coral).toBe(false);
    pingo.tileX = state.storage.x;
    pingo.tileY = state.storage.y;
    pingo.path = [];
    pingo.hopTo = undefined;
    tickSlimes(state);
    expect(state.resources.coral).toBe(CORAL_GATHER_AMOUNT);
    expect(state.discoveredResources.coral).toBe(true);
    expect(state.pendingMaterialToasts[0]?.lines).toEqual([
      { type: RESOURCE_IDS.CORAL, amount: CORAL_GATHER_AMOUNT },
    ]);
  });

  it("does not deplete coral when bedtime interrupts before commit", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const origin = coralOrigin(sim.state);
    const task = designateGatherAt(sim.state, "collect_coral", origin);
    assignAvailableTasks(sim.state);
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    pingo.workElapsedMs = 100;
    sim.setClock({ hour: 3, minute: 0 });
    expect(pingo.carriedResource).toBeUndefined();
    expect(sim.state.resources.coral).toBe(0);
    expect(sim.state.grid.objectAt(origin.x, origin.y)?.type).toBe(ObjectType.CORAL);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.PINGO).toBe(true);
  });

  it("keeps committed coral cargo through bedtime after the object is gone", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const origin = coralOrigin(sim.state);
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(sim.state, "collect_coral", origin)!;
    task.state = "in_progress";
    task.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task.id;
    startWorking(pingo);
    finishWorking(sim.state, workDurationMsForTask("collect_coral"));
    expect(pingo.carriedResource).toEqual({ coral: CORAL_GATHER_AMOUNT });
    expect(sim.state.grid.objectAt(origin.x, origin.y)).toBeUndefined();
    pingo.tileX = sim.state.storage.x;
    pingo.tileY = sim.state.storage.y;
    pingo.path = [];
    sim.setClock({ hour: 3, minute: 0 });
    expect(pingo.carriedResource).toEqual({ coral: CORAL_GATHER_AMOUNT });
    sim.tick();
    expect(sim.state.resources.coral).toBe(CORAL_GATHER_AMOUNT);
  });

  it("blocks the reserved land tile for fishing and the reverse, then releases on cancel", () => {
    const state = new GameState();
    const origin = coralOrigin(state);
    const coralTask = designateGatherAt(state, "collect_coral", origin)!;
    expect(isLandTileReserved(state.fishingAccessPoints, coralTask.workTile)).toBe(true);
    const shore = inspectShoreTarget(state, origin);
    expect(shore?.valid).toBe(true);

    for (const point of state.fishingAccessPoints) {
      if (point.id !== coralTask.accessPointId) {
        point.reservedBy = "opp_block";
      }
    }
    expect(inspectShoreTarget(state, origin)?.reason).toBe("unreachable");
    expect(designateGatherAt(state, "inspect_shore", origin)).toBeUndefined();

    cancelTask(state, coralTask, undefined, "release coral ap");
    expect(state.fishingAccessPoints.find((point) => point.id === coralTask.accessPointId)?.reservedBy).toBeNull();

    for (const point of state.fishingAccessPoints) {
      point.reservedBy = "opp_all";
    }
    expect(inspectCoralTarget(state, origin)?.reason).toBe("unreachable");
    expect(designateGatherAt(state, "collect_coral", origin)).toBeUndefined();
  });

  it("uses generic work bob, not fishing presentation", () => {
    const pingo = new GameState().slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    expect(slimeView(pingo, 0, 0, undefined, 0, dummyTask("collect_coral")).anim).toBe(SLIME_ANIM.WORK);
  });

  it("uses the canonical red coral artwork for every color variant", () => {
    const def = readFileSync("src/world/tileTypes.ts", "utf8");
    expect(def).toMatch(/Coral_Red\.png/);
    expect(def).toMatch(/Coral_Blue\.png/);
    expect(def).toMatch(/world-object-coral-red/);
    expect(def).not.toMatch(/Coral_Placeholder\.png/);
    expect(def).not.toMatch(/Final coral artwork is still required/);
    const red = readFileSync("public/assets/world/objects/Coral_Red.png");
    const shell = readFileSync("public/assets/world/materials/Shell.png");
    expect(red.equals(shell)).toBe(false);
    expect(red.length).toBeGreaterThan(1000);
  });

  it("credits one shared coral stock from two color deposits after delivery", () => {
    const state = new GameState();
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const harvestOne = (): string => {
      const object = state.grid.objects.find((entry) => entry.type === ObjectType.CORAL);
      expect(object?.variant).toBeDefined();
      const storedBefore = state.resources.coral;
      const task = createGatherTask(state, "collect_coral");
      expect(task?.type).toBe("collect_coral");
      task!.state = "in_progress";
      task!.assignedSlimeId = pingo.id;
      pingo.currentTaskId = task!.id;
      startWorking(pingo);
      finishWorking(state, workDurationMsForTask("collect_coral"));
      expect(state.grid.objectAt(object!.x, object!.y)).toBeUndefined();
      if (pingo.carriedResource) {
        expect(pingo.carriedResource).toEqual({ coral: CORAL_GATHER_AMOUNT });
        expect(state.resources.coral).toBe(storedBefore);
        pingo.tileX = state.storage.x;
        pingo.tileY = state.storage.y;
        pingo.path = [];
        pingo.hopTo = undefined;
        tickSlimes(state);
      }
      expect(pingo.carriedResource).toBeUndefined();
      expect(state.resources.coral).toBe(storedBefore + CORAL_GATHER_AMOUNT);
      return object!.variant!;
    };
    const first = harvestOne();
    const second = harvestOne();
    expect(second).not.toBe(first);
    expect(state.resources.coral).toBe(CORAL_GATHER_AMOUNT * 2);
    expect(state.discoveredResources.coral).toBe(true);
    expect(state.resources).not.toHaveProperty("blue_coral");
    expect(state.resources).not.toHaveProperty("red_coral");
    expect(Object.keys(state.resources).filter((key) => key.includes("coral"))).toEqual(["coral"]);
  });
});
