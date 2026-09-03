import { describe, expect, it } from "vitest";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { farmKey, farmNodeId } from "../entities/FarmPlot";
import { CROPS, DEFAULT_CROP_ID } from "../data/crops";
import { SIMULATION_TICK_MS } from "../constants";
import { designateFarmTile, isValidFarmTerrain, removeFarmTile } from "./FarmSystem";
import { DEFAULT_FARM_SOIL_VISUAL } from "../entities/FarmPlot";
import { plotCropStageNumber, plotCropTextureKey } from "@/src/game/render/farming/cropPresentation";
import { createGatherTask } from "./JobSystem";
import { FarmingVisualState } from "@/src/world/tileTypes";

const FARM_X = 2;
const FARM_Y = 12;

function activeFarmTasks(state: GameState) {
  const nodeId = farmNodeId(FARM_X, FARM_Y);
  return state.activeTasks().filter((task) => task.nodeId === nodeId);
}

function tickUntil(sim: Simulation, predicate: () => boolean, maxTicks = 400): number {
  for (let i = 0; i < maxTicks; i += 1) {
    if (predicate()) {
      return i;
    }
    sim.tick();
  }
  return maxTicks;
}

describe("farm loop", () => {
  it("designates only valid grass tiles", () => {
    const state = new GameState();
    expect(isValidFarmTerrain(state, FARM_X, FARM_Y)).toBe(true);
    expect(designateFarmTile(state, FARM_X, FARM_Y)).toBe(true);
    expect(state.farmAt(FARM_X, FARM_Y)?.state).toBe("designated");
    expect(state.farmAt(FARM_X, FARM_Y)?.soilVisual).toBe(DEFAULT_FARM_SOIL_VISUAL);
    expect(state.grid.getTile(FARM_X, FARM_Y)?.farming).toBe(FarmingVisualState.NONE);
    expect(designateFarmTile(state, FARM_X, FARM_Y)).toBe(false);

    expect(isValidFarmTerrain(state, 15, 9)).toBe(false);
    expect(designateFarmTile(state, 15, 9)).toBe(false);
    expect(isValidFarmTerrain(state, 0, 0)).toBe(false);
    expect(isValidFarmTerrain(state, state.storage.x, state.storage.y)).toBe(false);
  });

  it("generates a till task for a designated plot and does not duplicate it", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    sim.tick();
    const first = activeFarmTasks(sim.state);
    expect(first).toHaveLength(1);
    expect(first[0].type).toBe("till_soil");
    expect(first[0].target).toEqual({ x: FARM_X, y: FARM_Y });
    expect(first[0].workTile).toEqual({ x: FARM_X + 1, y: FARM_Y });
    sim.tick();
    expect(activeFarmTasks(sim.state)).toHaveLength(1);
    expect(activeFarmTasks(sim.state)[0].id).toBe(first[0].id);
  });

  it("completes till then generates a plant task", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    tickUntil(sim, () => {
      const momo = sim.state.slimes[SLIME_IDS.MOMO];
      const task = momo.currentTaskId ? sim.state.tasks[momo.currentTaskId] : undefined;
      return momo.state === "working" && task?.type === "till_soil";
    });
    expect(sim.state.farmAt(FARM_X, FARM_Y)?.state).toBe("designated");
    expect(sim.state.grid.getTile(FARM_X, FARM_Y)?.farming).toBe(FarmingVisualState.NONE);
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "tilled");
    expect(sim.state.farmAt(FARM_X, FARM_Y)?.state).toBe("tilled");
    expect(sim.state.grid.getTile(FARM_X, FARM_Y)?.farming).toBe(FarmingVisualState.TILLED);
    const momo = sim.state.slimes[SLIME_IDS.MOMO];
    expect(momo.tileX).toBe(FARM_X + 1);
    expect(momo.tileY).toBe(FARM_Y);
    expect(momo.faceTile).toEqual({ x: FARM_X, y: FARM_Y });
    expect(momo.tillRecoverPlot).toEqual({ x: FARM_X, y: FARM_Y });
    expect(momo.hopFrom).toEqual({ x: FARM_X + 1, y: FARM_Y });
    expect(momo.hopTo).toEqual({ x: FARM_X + 1, y: FARM_Y });
    sim.tick();
    const plant = activeFarmTasks(sim.state).find((task) => task.type === "plant_crop");
    expect(plant?.workTile).toEqual({ x: FARM_X, y: FARM_Y });
  });

  it("plants forest_carrot and grows by simulation ticks, not render frames", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "growing");
    const plot = sim.state.farmAt(FARM_X, FARM_Y);
    expect(plot?.cropId).toBe(DEFAULT_CROP_ID);
    expect(plotCropStageNumber(plot!)).toBe(1);
    expect(plotCropTextureKey(plot!)).toBe(CROPS[DEFAULT_CROP_ID].visuals.growthFrames[0].key);
    const before = plot!.growthMs;
    sim.tick();
    expect(sim.state.farmAt(FARM_X, FARM_Y)!.growthMs).toBe(before + SIMULATION_TICK_MS);
  });

  it("becomes ready, generates harvest, and adds food only after delivery", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "growing");
    const plot = sim.state.farmAt(FARM_X, FARM_Y)!;
    plot.growthMs = CROPS.forest_carrot.growthTimeMs - SIMULATION_TICK_MS;
    sim.tick();
    expect(sim.state.farmAt(FARM_X, FARM_Y)?.state).toBe("ready");
    expect(plotCropStageNumber(sim.state.farmAt(FARM_X, FARM_Y)!)).toBe(6);
    sim.tick();
    expect(activeFarmTasks(sim.state).some((task) => task.type === "harvest_crop")).toBe(true);

    let sawCarry = false;
    tickUntil(sim, () => {
      const carrying = Object.values(sim.state.slimes).some(
        (slime) => slime.carriedResource?.type === "food",
      );
      if (carrying) {
        sawCarry = true;
        expect(sim.state.resources.food).toBe(0);
      }
      return sim.state.resources.food >= CROPS.forest_carrot.foodYield;
    });
    expect(sawCarry).toBe(true);
    expect(sim.state.resources.food).toBe(CROPS.forest_carrot.foodYield);
  });

  it("replants after harvest without redesignation", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "growing");
    const plot = sim.state.farmAt(FARM_X, FARM_Y)!;
    plot.growthMs = CROPS.forest_carrot.growthTimeMs;
    sim.tick();
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "tilled");
    const afterHarvest = sim.state.farmAt(FARM_X, FARM_Y);
    expect(afterHarvest?.cropId).toBeUndefined();
    expect(plotCropTextureKey(afterHarvest!)).toBeUndefined();
    expect(afterHarvest?.soilVisual).toBe(DEFAULT_FARM_SOIL_VISUAL);
    sim.tick();
    expect(sim.state.farms[farmKey(FARM_X, FARM_Y)]).toBeDefined();
    expect(activeFarmTasks(sim.state).some((task) => task.type === "plant_crop")).toBe(true);
    tickUntil(sim, () => sim.state.farmAt(FARM_X, FARM_Y)?.state === "growing");
    const replanted = sim.state.farmAt(FARM_X, FARM_Y)!;
    expect(replanted.growthMs).toBe(0);
    expect(plotCropStageNumber(replanted)).toBe(1);
  });

  it("removing a farm cancels that tile's jobs and leaves gather jobs", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    const gather = createGatherTask(sim.state, "gather_wood");
    sim.tick();
    expect(activeFarmTasks(sim.state).length).toBeGreaterThan(0);
    removeFarmTile(sim.state, FARM_X, FARM_Y);
    expect(sim.state.farmAt(FARM_X, FARM_Y)).toBeUndefined();
    expect(activeFarmTasks(sim.state)).toHaveLength(0);
    expect(gather?.state === "available" || gather?.state === "assigned" || gather?.state === "in_progress").toBe(
      true,
    );
  });

  it("does not assign two slimes to the same farm tile", () => {
    const sim = new Simulation();
    designateFarmTile(sim.state, FARM_X, FARM_Y);
    sim.tick();
    const assigned = activeFarmTasks(sim.state);
    expect(assigned).toHaveLength(1);
    const worker = assigned[0].assignedSlimeId;
    expect(worker).toBe(SLIME_IDS.MOMO);
    expect(sim.state.slimes[SLIME_IDS.PINGO].currentTaskId).not.toBe(assigned[0].id);
    expect(sim.state.slimes[SLIME_IDS.TITO].currentTaskId).not.toBe(assigned[0].id);
  });
});
