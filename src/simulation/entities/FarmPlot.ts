import type { GridPosition } from "@/src/world/GridPosition";
import type { CropId } from "../data/crops";

export type FarmPlotState = "designated" | "tilled" | "planted" | "growing" | "ready";

/** Presentation-only soil look. Not moisture, drought, or crop death. */
export type FarmSoilVisualState = "dry" | "watered" | "dead";

export const DEFAULT_FARM_SOIL_VISUAL: FarmSoilVisualState = "dry";

export interface FarmPlot {
  tile: GridPosition;
  state: FarmPlotState;
  cropId?: CropId;
  growthMs: number;
  soilVisual: FarmSoilVisualState;
}

export function farmKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function farmNodeId(x: number, y: number): string {
  return `farm_${x}_${y}`;
}

export function parseFarmKey(key: string): GridPosition {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}
