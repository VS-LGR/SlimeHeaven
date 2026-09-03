import { FarmingVisualState, TileType } from "@/src/world/tileTypes";
import { SIMULATION_TICK_MS, STORAGE_TILE } from "../constants";
import { cropById, DEFAULT_CROP_ID, type CropId } from "../data/crops";
import type { GameState } from "../GameState";
import {
  DEFAULT_FARM_SOIL_VISUAL,
  farmKey,
  farmNodeId,
  type FarmPlot,
  type FarmPlotState,
} from "../entities/FarmPlot";
import type { FarmTaskType, Task } from "../entities/Task";
import { createFarmTask, cancelTask } from "./JobSystem";
import { rebuildInterestPoints } from "./InterestPointSystem";

export function isValidFarmTerrain(state: GameState, x: number, y: number): boolean {
  if (!state.grid.inBounds(x, y)) {
    return false;
  }
  if (x === STORAGE_TILE.x && y === STORAGE_TILE.y) {
    return false;
  }
  const tile = state.grid.getTile(x, y);
  if (!tile || tile.terrain !== TileType.GRASS) {
    return false;
  }
  if (state.grid.objectAt(x, y)) {
    return false;
  }
  return true;
}

export function farmingVisualForPlot(plot: FarmPlot): FarmingVisualState {
  if (plot.state === "designated") {
    return FarmingVisualState.NONE;
  }
  if (plot.state === "tilled") {
    return FarmingVisualState.TILLED;
  }
  const crop = plot.cropId ? cropById(plot.cropId) : undefined;
  if (plot.state === "ready") {
    return crop?.visuals.ready ?? FarmingVisualState.PLANTED;
  }
  return crop?.visuals.growing ?? FarmingVisualState.PLANTED;
}

function syncFarmVisual(state: GameState, plot: FarmPlot): void {
  state.grid.setFarmingVisual(plot.tile.x, plot.tile.y, farmingVisualForPlot(plot));
  state.markFarmDirty(plot.tile.x, plot.tile.y);
}

function setPlotState(state: GameState, plot: FarmPlot, next: FarmPlotState, cropId?: CropId): void {
  plot.state = next;
  if (cropId !== undefined) {
    plot.cropId = cropId;
  }
  if (next === "tilled" || next === "designated") {
    plot.cropId = undefined;
    plot.growthMs = 0;
  }
  syncFarmVisual(state, plot);
}

export function designateFarmTile(state: GameState, x: number, y: number): boolean {
  if (!isValidFarmTerrain(state, x, y)) {
    return false;
  }
  const key = farmKey(x, y);
  if (state.farms[key]) {
    return false;
  }
  const plot: FarmPlot = {
    tile: { x, y },
    state: "designated",
    growthMs: 0,
    soilVisual: DEFAULT_FARM_SOIL_VISUAL,
  };
  state.farms[key] = plot;
  syncFarmVisual(state, plot);
  rebuildInterestPoints(state);
  return true;
}

export function designateFarmRect(
  state: GameState,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const x0 = Math.min(ax, bx);
  const y0 = Math.min(ay, by);
  const x1 = Math.max(ax, bx);
  const y1 = Math.max(ay, by);
  let count = 0;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      if (designateFarmTile(state, x, y)) {
        count += 1;
      }
    }
  }
  return count;
}

export function removeFarmTile(state: GameState, x: number, y: number): boolean {
  const key = farmKey(x, y);
  const plot = state.farms[key];
  if (!plot) {
    return false;
  }
  cancelFarmTasksForTile(state, x, y);
  delete state.farms[key];
  state.grid.setFarmingVisual(x, y, FarmingVisualState.NONE);
  state.markFarmDirty(x, y);
  rebuildInterestPoints(state);
  return true;
}

export function removeFarmRect(
  state: GameState,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const x0 = Math.min(ax, bx);
  const y0 = Math.min(ay, by);
  const x1 = Math.max(ax, bx);
  const y1 = Math.max(ay, by);
  let count = 0;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      if (removeFarmTile(state, x, y)) {
        count += 1;
      }
    }
  }
  return count;
}

export function clearFarms(state: GameState): void {
  for (const plot of Object.values(state.farms)) {
    removeFarmTile(state, plot.tile.x, plot.tile.y);
  }
}

function cancelFarmTasksForTile(state: GameState, x: number, y: number): void {
  const nodeId = farmNodeId(x, y);
  for (const task of state.activeTasks()) {
    if (task.nodeId !== nodeId) {
      continue;
    }
    const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
    if (slime?.state === "carrying_to_storage" || slime?.carriedResource) {
      continue;
    }
    cancelTask(state, task, slime, `Farm removed at ${x},${y}; task ${task.id} cancelled.`);
  }
}

export function tickFarms(state: GameState): void {
  for (const plot of Object.values(state.farms)) {
    growPlot(state, plot);
    ensureFarmJob(state, plot);
  }
}

function growPlot(state: GameState, plot: FarmPlot): void {
  if (plot.state === "planted") {
    plot.state = "growing";
    syncFarmVisual(state, plot);
  }
  if (plot.state !== "growing" || !plot.cropId) {
    return;
  }
  plot.growthMs += SIMULATION_TICK_MS;
  const crop = cropById(plot.cropId);
  if (plot.growthMs >= crop.growthTimeMs) {
    setPlotState(state, plot, "ready", plot.cropId);
  }
}

function ensureFarmJob(state: GameState, plot: FarmPlot): void {
  const needed = neededFarmTask(plot);
  if (!needed) {
    return;
  }
  createFarmTask(state, needed, plot);
}

function neededFarmTask(plot: FarmPlot): FarmTaskType | undefined {
  if (plot.state === "designated") {
    return "till_soil";
  }
  if (plot.state === "tilled") {
    return "plant_crop";
  }
  if (plot.state === "ready") {
    return "harvest_crop";
  }
  return undefined;
}

export function completeTill(state: GameState, task: Task): void {
  const plot = state.farmAt(task.target.x, task.target.y);
  if (!plot) {
    return;
  }
  setPlotState(state, plot, "tilled");
}

export function completePlant(state: GameState, task: Task): void {
  const plot = state.farmAt(task.target.x, task.target.y);
  if (!plot) {
    return;
  }
  plot.growthMs = 0;
  setPlotState(state, plot, "growing", DEFAULT_CROP_ID);
}

export function completeHarvest(state: GameState, task: Task): number {
  const plot = state.farmAt(task.target.x, task.target.y);
  const cropId = plot?.cropId ?? DEFAULT_CROP_ID;
  const yieldAmount = cropById(cropId).foodYield;
  if (plot) {
    setPlotState(state, plot, "tilled");
  }
  return yieldAmount;
}

export function instantGrowCrops(state: GameState): void {
  for (const plot of Object.values(state.farms)) {
    if (plot.state === "planted" || plot.state === "growing") {
      const cropId = plot.cropId ?? DEFAULT_CROP_ID;
      plot.growthMs = cropById(cropId).growthTimeMs;
      setPlotState(state, plot, "ready", cropId);
    }
  }
}

export function farmGrowthPercent(plot: FarmPlot): number {
  if (plot.state === "ready") {
    return 100;
  }
  if ((plot.state === "growing" || plot.state === "planted") && plot.cropId) {
    const time = cropById(plot.cropId).growthTimeMs;
    return Math.min(100, Math.round((plot.growthMs / time) * 100));
  }
  return 0;
}
