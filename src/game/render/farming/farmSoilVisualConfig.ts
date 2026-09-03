import type { FarmSoilVisualState } from "@/src/simulation/entities/FarmPlot";
import { TILE_SIZE } from "@/src/world/constants";

export const FARM_SOIL_TEXTURE_KEY = "farm-soil";
export const FARM_SOIL_PATH = "/assets/tiles/Farm_Soil/Farm_Soil_Tileset-Sheet.png";
export const FARM_SOIL_FRAME = { width: TILE_SIZE, height: TILE_SIZE } as const;

/** Left to right on Farm_Soil_Tileset-Sheet.png. */
export const FARM_SOIL_FRAMES: Record<FarmSoilVisualState, number> = {
  dry: 0,
  watered: 1,
  dead: 2,
};

export function farmSoilFrameIndex(visual: FarmSoilVisualState): number {
  return FARM_SOIL_FRAMES[visual];
}
