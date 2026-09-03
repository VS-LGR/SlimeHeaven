import { FarmingVisualState } from "@/src/world/tileTypes";

export const CROP_IDS = {
  FOREST_CARROT: "forest_carrot",
} as const;

export type CropId = (typeof CROP_IDS)[keyof typeof CROP_IDS];

export const CROP_STAGE_COUNT = 6;

export interface CropGrowthFrame {
  key: string;
  path: string;
}

export interface CropDefinition {
  id: CropId;
  name: string;
  growthTimeMs: number;
  foodYield: number;
  visuals: {
    growing: FarmingVisualState;
    ready: FarmingVisualState;
    growthFrames: readonly CropGrowthFrame[];
  };
}

const FOREST_CARROT_DIR = "/assets/tiles/crops/Carrot";

function numberedGrowthFrames(dir: string, stem: string, keyPrefix: string, count: number): CropGrowthFrame[] {
  const frames: CropGrowthFrame[] = [];
  for (let i = 1; i <= count; i += 1) {
    frames.push({
      key: `${keyPrefix}-${i}`,
      path: `${dir}/${stem}${i}.png`,
    });
  }
  return frames;
}

/** Temporary testing values. Not final game balance. ~25s growth, 2 food. */
export const CROPS: Record<CropId, CropDefinition> = {
  forest_carrot: {
    id: "forest_carrot",
    name: "Forest Carrot",
    growthTimeMs: 25_000,
    foodYield: 2,
    visuals: {
      growing: FarmingVisualState.PLANTED,
      ready: FarmingVisualState.PLANTED,
      growthFrames: numberedGrowthFrames(FOREST_CARROT_DIR, "Farm_Soil_Tileset", "crop-forest-carrot", CROP_STAGE_COUNT),
    },
  },
};

export const DEFAULT_CROP_ID: CropId = CROP_IDS.FOREST_CARROT;

export function cropById(id: CropId): CropDefinition {
  return CROPS[id];
}

export function cropGrowthFrameLoads(): ReadonlyArray<{ key: string; path: string }> {
  return Object.values(CROPS).flatMap((crop) => [...crop.visuals.growthFrames]);
}
