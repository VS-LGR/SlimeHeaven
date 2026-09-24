import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { TileType } from "@/src/world/tileTypes";
import { findPath } from "@/src/world/pathfinding";
import {
  assignAvailableTasks,
  beginAssignedTask,
  cancelTask,
  createGatherTask,
  designateGatherAt,
  inspectShoreTarget,
  pickFreeAccessPoint,
  startWorking,
} from "./JobSystem";
import { isLandTileReserved } from "../waterBodies";
import { tickSlimes } from "./SlimeSystem";
import {
  SHELL_GATHER_AMOUNT,
  SHELL_INSPECT_REGEN_GAME_MINUTES,
  SIMULATION_TICK_MS,
  WORK_DURATION_MS,
} from "../constants";
import { resolveGatherBundle } from "../data/materials";
import { setWorldClock } from "../worldTime";
import { spawnLilyVisitor } from "./VisitorSystem";
import { canPerformTaskCapabilities, requiredCapabilitiesForTask } from "../slimeCapabilities";
import { RESOURCE_IDS } from "../resources";
import { slimeView } from "@/src/game/render/slimeView";
import { SLIME_ANIM } from "@/src/game/render/slimeVisualConfig";
import type { Task } from "../entities/Task";

function shoreTile(state: GameState) {
  const node = state.nodes.find((entry) => entry.type === RESOURCE_IDS.SHELL);
  expect(node).toBeDefined();
  return node!.tile;
}

function finishWorking(state: GameState, durationMs = WORK_DURATION_MS): void {
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

describe("shell inspect 05.6A.3", () => {
  it("resolves one shell and never fish or ingot", () => {
    expect(resolveGatherBundle("inspect_shore", { next: () => 0 })).toEqual({
      shell: SHELL_GATHER_AMOUNT,
    });
    const json = JSON.stringify(resolveGatherBundle("inspect_shore", { next: () => 0 }));
    expect(json).not.toMatch(/fish|ingot|blue_darter|pond_carp/);
  });

  it("makes Pingo eligible through aquatic_foraging, not a slime id check", () => {
    const state = new GameState();
    expect(requiredCapabilitiesForTask({ type: "inspect_shore" })).toEqual(["aquatic_foraging"]);
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.PINGO], { type: "inspect_shore" })).toBe(
      true,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.MOMO], { type: "inspect_shore" })).toBe(
      false,
    );
    expect(canPerformTaskCapabilities(state.slimes[SLIME_IDS.TITO], { type: "inspect_shore" })).toBe(
      false,
    );
    const jobs = readFileSync("src/simulation/systems/JobSystem.ts", "utf8");
    expect(jobs).not.toMatch(/slime_pingo/);
    expect(state.slimes[SLIME_IDS.PINGO].jobAffinity?.aquatic_foraging).toBe(1.25);
    expect(state.slimes[SLIME_IDS.PINGO].capabilities).toEqual([
      "fishing",
      "exploration",
      "aquatic_foraging",
    ]);
  });

  it("rejects Lily while she is a visitor", () => {
    const state = new GameState();
    setWorldClock(state.worldTime, { hour: 12, minute: 0 });
    spawnLilyVisitor(state);
    const lily = state.slimes[SLIME_IDS.LILY];
    expect(lily.capabilities).toEqual([]);
    expect(canPerformTaskCapabilities(lily, { type: "inspect_shore" })).toBe(false);
    const task = createGatherTask(state, "inspect_shore");
    assignAvailableTasks(state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.PINGO);
    expect(lily.currentTaskId).toBeUndefined();
  });

  it("requires a reachable access point and does not create a job when unreachable", () => {
    const state = new GameState();
    const tile = shoreTile(state);
    expect(inspectShoreTarget(state, tile)?.valid).toBe(true);
    for (const point of state.fishingAccessPoints) {
      point.enabled = false;
    }
    expect(inspectShoreTarget(state, tile)?.reason).toBe("unreachable");
    expect(designateGatherAt(state, "inspect_shore", tile)).toBeUndefined();
    expect(Object.values(state.tasks)).toHaveLength(0);
  });

  it("allows one inspect job per water body", () => {
    const state = new GameState();
    const tile = shoreTile(state);
    const first = designateGatherAt(state, "inspect_shore", tile);
    expect(first).toBeDefined();
    expect(first?.accessPointId).toBeDefined();
    expect(designateGatherAt(state, "inspect_shore", tile)).toBeUndefined();
    const otherWater = state.waterBodies[0]?.shallowTiles.find(
      (entry) => entry.x !== tile.x || entry.y !== tile.y,
    );
    if (otherWater) {
      expect(designateGatherAt(state, "inspect_shore", otherWater)).toBeUndefined();
    }
  });

  it("does not spawn fishing opportunities or sessions", () => {
    const state = new GameState();
    const task = designateGatherAt(state, "inspect_shore", shoreTile(state));
    expect(task?.type).toBe("inspect_shore");
    expect(state.opportunities).toHaveLength(0);
    expect(state.fishingSessions).toHaveLength(0);
    expect(state.fishing.phase).toBe("idle");
  });

  it("assigns Pingo on land, commits one shell, then credits stock after delivery", () => {
    const state = new GameState();
    const tile = shoreTile(state);
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(state, "inspect_shore", tile);
    expect(task).toBeDefined();
    expect(state.grid.isWalkable(task!.workTile.x, task!.workTile.y)).toBe(true);
    const access = state.fishingAccessPoints.find((point) => point.id === task!.accessPointId);
    expect(access?.reservedBy).toBe(task!.id);
    expect(isLandTileReserved(state.fishingAccessPoints, task!.workTile)).toBe(true);

    task!.state = "in_progress";
    task!.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task!.id;
    startWorking(pingo, task!.target);
    finishWorking(state);
    expect(pingo.carriedResource).toEqual({ shell: SHELL_GATHER_AMOUNT });
    expect(state.resources.shell).toBe(0);
    expect(state.discoveredResources.shell).toBe(false);
    expect(access?.reservedBy).toBeNull();

    pingo.tileX = state.storage.x;
    pingo.tileY = state.storage.y;
    pingo.path = [];
    pingo.hopTo = undefined;
    tickSlimes(state);
    expect(state.resources.shell).toBe(SHELL_GATHER_AMOUNT);
    expect(state.discoveredResources.shell).toBe(true);
    expect(state.pendingMaterialToasts[0]?.lines).toEqual([
      { type: RESOURCE_IDS.SHELL, amount: SHELL_GATHER_AMOUNT },
    ]);
  });

  it("starts 4h regen only after commit, including midnight", () => {
    const state = new GameState();
    setWorldClock(state.worldTime, { hour: 22, minute: 0 });
    const tile = shoreTile(state);
    const node = state.nodes.find((entry) => entry.type === RESOURCE_IDS.SHELL)!;
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(state, "inspect_shore", tile);
    task!.state = "in_progress";
    task!.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task!.id;
    startWorking(pingo);
    expect(inspectShoreTarget(state, tile)?.reason).toBe("reserved");
    finishWorking(state);
    expect(node.shellReadyAtMinute).toBe(
      state.worldTime.totalGameMinutes + SHELL_INSPECT_REGEN_GAME_MINUTES,
    );
    pingo.tileX = state.storage.x;
    pingo.tileY = state.storage.y;
    pingo.path = [];
    pingo.hopTo = undefined;
    tickSlimes(state);
    expect(inspectShoreTarget(state, tile)?.reason).toBe("regenerating");

    setWorldClock(state.worldTime, { hour: 1, minute: 0, day: 2 });
    expect(inspectShoreTarget(state, tile)?.reason).toBe("regenerating");
    setWorldClock(state.worldTime, { hour: 2, minute: 0, day: 2 });
    expect(inspectShoreTarget(state, tile)?.valid).toBe(true);
    expect(designateGatherAt(state, "inspect_shore", tile)).toBeDefined();
  });

  it("cancels before commit with no reward or cooldown", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tile = shoreTile(sim.state);
    const node = sim.state.nodes.find((entry) => entry.type === RESOURCE_IDS.SHELL)!;
    const task = designateGatherAt(sim.state, "inspect_shore", tile);
    assignAvailableTasks(sim.state);
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    pingo.workElapsedMs = 100;
    sim.setClock({ hour: 3, minute: 0 });
    expect(pingo.carriedResource).toBeUndefined();
    expect(sim.state.resources.shell).toBe(0);
    expect(node.shellReadyAtMinute ?? 0).toBe(0);
    expect(task?.state === "cancelled" || task?.assignedSlimeId !== SLIME_IDS.PINGO).toBe(true);
    expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
  });

  it("keeps committed shell cargo through bedtime", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    pingo.carriedResource = { shell: SHELL_GATHER_AMOUNT };
    pingo.state = "carrying_to_storage";
    pingo.tileX = sim.state.storage.x;
    pingo.tileY = sim.state.storage.y;
    pingo.path = [];
    sim.setClock({ hour: 3, minute: 0 });
    expect(pingo.carriedResource).toEqual({ shell: SHELL_GATHER_AMOUNT });
    sim.tick();
    expect(sim.state.resources.shell).toBe(SHELL_GATHER_AMOUNT);
    expect(sim.state.discoveredResources.shell).toBe(true);
  });

  it("releases the access point on cancel so fishing can use the land tile again", () => {
    const state = new GameState();
    const tile = shoreTile(state);
    const task = designateGatherAt(state, "inspect_shore", tile)!;
    const access = state.fishingAccessPoints.find((point) => point.id === task.accessPointId)!;
    expect(access.reservedBy).toBe(task.id);
    cancelTask(state, task, undefined, "test cancel");
    expect(access.reservedBy).toBeNull();
    expect(pickFreeAccessPoint(state, access.waterBodyId, access.waterTile)?.id).toBe(access.id);
  });

  it("uses idle facing water while inspecting, not fishing clips", () => {
    const pingo = new GameState().slimes[SLIME_IDS.PINGO];
    pingo.state = "working";
    expect(slimeView(pingo, 0, 0, undefined, 0, dummyTask("inspect_shore")).anim).toBe(SLIME_ANIM.IDLE);
    const fishingSession = {
      id: "fish_1",
      assignedSlimeId: pingo.id,
      phase: "waiting" as const,
      activityId: "a",
      accessPointId: "ap",
      startedAtTick: 0,
    };
    expect(
      slimeView(pingo, 0, 0, fishingSession as never, 0, dummyTask("inspect_shore")).anim,
    ).toBe(SLIME_ANIM.IDLE);
  });

  it("starts aquatic forage as moving_to_task and cancels a leftover fishing opportunity", () => {
    const state = new GameState();
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(state, "inspect_shore", shoreTile(state))!;
    task.state = "assigned";
    task.assignedSlimeId = pingo.id;
    pingo.currentTaskId = task.id;
    pingo.tileX = task.workTile.x;
    pingo.tileY = task.workTile.y;
    state.opportunities.push({
      id: "opp_stale",
      activityId: "act",
      speciesId: "blue_darter",
      waterBodyId: "water_1",
      activityPosition: { x: 14, y: 10 },
      validAccessPointIds: [],
      state: "slime_traveling",
      assignedSlimeId: pingo.id,
      accessPointId: "ap_stale",
      taskId: "fish_stale",
    });
    beginAssignedTask(state, pingo);
    expect(pingo.state).toBe("working");
    expect(state.opportunities.every((entry) => entry.assignedSlimeId !== pingo.id || entry.state === "expired" || entry.state === "caught" || entry.state === "escaped")).toBe(true);
  });

  it("walks the shore inspect loop to storage without teleporting or entering water", () => {
    const sim = new Simulation();
    sim.setClock({ hour: 12, minute: 0 });
    const tile = shoreTile(sim.state);
    const pingo = sim.state.slimes[SLIME_IDS.PINGO];
    const task = designateGatherAt(sim.state, "inspect_shore", tile);
    expect(task?.type).toBe("inspect_shore");
    expect(Object.values(sim.state.tasks).filter((entry) => entry.type === "inspect_shore")).toHaveLength(1);
    expect(sim.state.grid.isWalkable(task!.workTile.x, task!.workTile.y)).toBe(true);
    expect(findPath(sim.state.grid, { x: pingo.tileX, y: pingo.tileY }, task!.workTile)).not.toBeNull();
    expect(findPath(sim.state.grid, task!.workTile, sim.state.storage)).not.toBeNull();

    const transitions: string[] = [];
    let last = "";
    let sawCargo = false;
    let stockWhileCarrying = 0;
    for (let i = 0; i < 900; i += 1) {
      expect(sim.state.grid.getTile(pingo.tileX, pingo.tileY)?.terrain).not.toBe(TileType.WATER);
      expect(sim.state.grid.isWalkable(pingo.tileX, pingo.tileY)).toBe(true);
      const label = `${pingo.state}@${pingo.tileX},${pingo.tileY}`;
      if (label !== last) {
        transitions.push(label);
        last = label;
      }
      if (pingo.carriedResource) {
        sawCargo = true;
        stockWhileCarrying = sim.state.resources.shell;
        expect(pingo.carriedResource).toEqual({ shell: SHELL_GATHER_AMOUNT });
        expect(sim.state.discoveredResources.shell).toBe(false);
      }
      if (
        sim.state.resources.shell === SHELL_GATHER_AMOUNT &&
        !pingo.carriedResource &&
        (pingo.state === "idle" || pingo.state === "ambient" || pingo.state === "moving_to_ambient")
      ) {
        expect(sawCargo).toBe(true);
        expect(stockWhileCarrying).toBe(0);
        expect(sim.state.discoveredResources.shell).toBe(true);
        expect(sim.state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
        expect(transitions.some((entry) => entry.startsWith("moving_to_task"))).toBe(true);
        expect(transitions.some((entry) => entry.startsWith("working"))).toBe(true);
        expect(transitions.some((entry) => entry.startsWith("carrying_to_storage"))).toBe(true);
        return;
      }
      sim.tick();
    }
    throw new Error(`shell walk-loop timed out; last=${last} transitions=${transitions.join(" -> ")}`);
  });
});
