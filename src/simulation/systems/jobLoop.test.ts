import { describe, expect, it, vi } from "vitest";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import {
  assignAvailableTasks,
  beginAssignedTask,
  createGatherTask,
  deliver,
  startWorking,
} from "./JobSystem";
import { tickSlimes } from "./SlimeSystem";
import { GATHER_AMOUNT, SIMULATION_TICK_MS, WORK_DURATION_MS } from "../constants";
import { DEBUG_HUNGRY_SATIETY } from "../needsConfig";

describe("job loop", () => {
  it("assigns gathering only to Tito and leaves extra wood tasks waiting", () => {
    const state = new GameState();
    const first = createGatherTask(state, "gather_wood");
    const second = createGatherTask(state, "gather_wood");
    expect(first).toBeDefined();
    expect(second).toBeDefined();

    assignAvailableTasks(state);

    expect(first?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(second?.state).toBe("available");
    expect(second?.assignedSlimeId).toBeUndefined();
    expect(state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();

    assignAvailableTasks(state);
    expect(first?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(state.slimes[SLIME_IDS.TITO].currentTaskId).toBe(first?.id);
  });

  it("does not add stock until the slime delivers at storage", () => {
    const state = new GameState();
    const slime = state.slimes[SLIME_IDS.PINGO];
    slime.carriedResource = { type: "wood", amount: GATHER_AMOUNT };
    slime.state = "working";
    expect(state.resources.wood).toBe(0);

    slime.state = "carrying_to_storage";
    slime.tileX = 0;
    slime.tileY = 0;
    slime.path = [];
    tickSlimes(state);
    expect(state.resources.wood).toBe(0);

    slime.tileX = state.storage.x;
    slime.tileY = state.storage.y;
    slime.state = "carrying_to_storage";
    slime.path = [];
    slime.hopTo = undefined;
    slime.carriedResource = { type: "wood", amount: GATHER_AMOUNT };
    tickSlimes(state);
    expect(state.resources.wood).toBe(GATHER_AMOUNT);
    expect(slime.carriedResource).toBeUndefined();
    expect(slime.state).toBe("idle");
  });

  it("only deposits through deliver()", () => {
    const state = new GameState();
    const slime = state.slimes[SLIME_IDS.TITO];
    slime.carriedResource = { type: "stone", amount: 2 };
    deliver(state, slime);
    expect(state.resources.stone).toBe(2);
    expect(slime.state).toBe("idle");
  });

  it("cancels an unreachable task and returns the slime to idle", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const state = new GameState();
    const slime = state.slimes[SLIME_IDS.PINGO];
    const task = {
      id: "unreachable_1",
      type: "gather_wood" as const,
      target: { x: 15, y: 11 },
      nodeId: "fake",
      workTile: { x: 15, y: 11 },
      resourceType: "wood" as const,
      state: "assigned" as const,
      assignedSlimeId: slime.id,
    };
    state.tasks[task.id] = task;
    slime.currentTaskId = task.id;
    slime.state = "idle";

    beginAssignedTask(state, slime);

    expect(task.state).toBe("cancelled");
    expect(slime.state).toBe("idle");
    expect(slime.currentTaskId).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("completes a gather-wood loop on the village map", () => {
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
    expect(created?.state).toBe("completed");
    const worker = Object.values(sim.state.slimes).find(
      (slime) => slime.id === created?.assignedSlimeId,
    );
    expect(worker?.state).toBe("idle");
    expect(worker?.carriedResource).toBeUndefined();
  });

  it("completes a gather-stone loop from rock objects", () => {
    const sim = new Simulation();
    const created = createGatherTask(sim.state, "gather_stone");
    expect(created).toBeDefined();
    expect(sim.state.nodeById(created!.nodeId)?.type).toBe("stone");

    for (let i = 0; i < 240; i += 1) {
      sim.tick();
      if (sim.state.resources.stone >= GATHER_AMOUNT) {
        break;
      }
    }

    expect(sim.state.resources.stone).toBe(GATHER_AMOUNT);
    expect(created?.state).toBe("completed");
  });

  it("finishes gather_wood at WORK_DURATION_MS without an animation gate", () => {
    const state = new GameState();
    const tito = state.slimes[SLIME_IDS.TITO];
    const wood = createGatherTask(state, "gather_wood");
    expect(wood).toBeDefined();
    wood!.state = "in_progress";
    wood!.assignedSlimeId = tito.id;
    tito.currentTaskId = wood!.id;
    startWorking(tito);

    const genericTicks = WORK_DURATION_MS / SIMULATION_TICK_MS;
    for (let i = 0; i < genericTicks - 1; i += 1) {
      tickSlimes(state);
    }
    expect(tito.workElapsedMs).toBeLessThan(WORK_DURATION_MS);
    expect(tito.state).toBe("working");
    expect(tito.carriedResource).toBeUndefined();

    tickSlimes(state);
    expect(tito.workElapsedMs).toBe(WORK_DURATION_MS);
    expect(tito.state).toBe("carrying_to_storage");
    expect(tito.carriedResource).toEqual({ type: "wood", amount: GATHER_AMOUNT });
    expect(state.resources.wood).toBe(0);
  });

  it("finishes hungry gather_wood from the existing work-speed multiplier, not clip length", () => {
    const state = new GameState();
    const tito = state.slimes[SLIME_IDS.TITO];
    tito.satiety = DEBUG_HUNGRY_SATIETY;
    const wood = createGatherTask(state, "gather_wood");
    expect(wood).toBeDefined();
    wood!.state = "in_progress";
    wood!.assignedSlimeId = tito.id;
    tito.currentTaskId = wood!.id;
    startWorking(tito);

    const genericTicks = WORK_DURATION_MS / SIMULATION_TICK_MS;
    for (let i = 0; i < genericTicks; i += 1) {
      tickSlimes(state);
    }
    expect(tito.workElapsedMs).toBeLessThan(WORK_DURATION_MS);
    expect(tito.state).toBe("working");

    while (tito.state === "working") {
      tickSlimes(state);
    }
    expect(tito.workElapsedMs).toBeGreaterThanOrEqual(WORK_DURATION_MS);
    expect(tito.state).toBe("carrying_to_storage");
  });

  it("still finishes gather_stone at the generic work window", () => {
    const state = new GameState();
    const tito = state.slimes[SLIME_IDS.TITO];
    const stone = createGatherTask(state, "gather_stone");
    expect(stone).toBeDefined();
    stone!.state = "in_progress";
    stone!.assignedSlimeId = tito.id;
    tito.currentTaskId = stone!.id;
    startWorking(tito);

    const genericTicks = WORK_DURATION_MS / SIMULATION_TICK_MS;
    for (let i = 0; i < genericTicks; i += 1) {
      tickSlimes(state);
    }
    expect(tito.state).toBe("carrying_to_storage");
  });

  it("keeps spawn tiles walkable", () => {
    const state = new GameState();
    for (const slime of Object.values(state.slimes)) {
      expect(state.grid.isWalkable(slime.tileX, slime.tileY)).toBe(true);
    }
    expect(state.grid.isWalkable(state.storage.x, state.storage.y)).toBe(true);
  });
});
