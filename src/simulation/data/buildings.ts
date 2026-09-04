import { TILE_SIZE } from "@/src/world/constants";
import type { GridPosition } from "@/src/world/GridPosition";
import type { ResidentTypeId } from "./residents";

export const BUILDING_TYPE_IDS = ["small_blue_house", "brown_house", "green_house"] as const;

export type BuildingTypeId = (typeof BUILDING_TYPE_IDS)[number];

export type BuildingCategory = "residential";

export type BuildingEntranceFacing = "south";

/** Extensible visual class id. Future buildings declare their own class and canvas. */
export type BuildingVisualClassId = "small_house";

export interface BuildingCanvasSize {
  width: number;
  height: number;
}

export interface ResidentHomeMeta {
  residentTypeId: ResidentTypeId;
  unique: true;
  startingHome: boolean;
  recipeUnlocked: boolean;
}

/**
 * Authored Aseprite frame for the small_house visual class only.
 * Do not reuse this canvas or footprint for windmills, lighthouses, or large houses.
 */
export const SMALL_HOUSE_VISUAL_CLASS = {
  id: "small_house" as const satisfies BuildingVisualClassId,
  completedCanvas: { width: 93, height: 84 } satisfies BuildingCanvasSize,
  blueprintCanvas: { width: 93, height: 84 } satisfies BuildingCanvasSize,
  footprint: { width: 2, height: 2 },
  originX: 0.5,
  originY: 1,
  offsetX: 0,
  offsetY: 0,
} as const;

export interface BuildingDefinition {
  id: BuildingTypeId;
  name: string;
  category: BuildingCategory;
  enabled: boolean;
  assetKey: string;
  assetPath: string;
  blueprintKey: string;
  blueprintPath: string;
  footprint: {
    width: number;
    height: number;
  };
  entrance: {
    localTileX: number;
    localTileY: number;
    facing: BuildingEntranceFacing;
  };
  visual: {
    visualClass: BuildingVisualClassId;
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
    completedCanvas: BuildingCanvasSize;
    blueprintCanvas: BuildingCanvasSize;
  };
  cost: {
    wood: number;
    stone: number;
  };
  residentHome?: ResidentHomeMeta;
}

const SHARED_ENTRANCE = { localTileX: 0, localTileY: 2, facing: "south" as const };
const SMALL_HOUSE_VISUAL = {
  visualClass: SMALL_HOUSE_VISUAL_CLASS.id,
  originX: SMALL_HOUSE_VISUAL_CLASS.originX,
  originY: SMALL_HOUSE_VISUAL_CLASS.originY,
  offsetX: SMALL_HOUSE_VISUAL_CLASS.offsetX,
  offsetY: SMALL_HOUSE_VISUAL_CLASS.offsetY,
  completedCanvas: { ...SMALL_HOUSE_VISUAL_CLASS.completedCanvas },
  blueprintCanvas: { ...SMALL_HOUSE_VISUAL_CLASS.blueprintCanvas },
};

function uniqueStartingHome(residentTypeId: ResidentTypeId): ResidentHomeMeta {
  return {
    residentTypeId,
    unique: true,
    startingHome: true,
    recipeUnlocked: true,
  };
}

export const BUILDINGS: Record<BuildingTypeId, BuildingDefinition> = {
  small_blue_house: {
    id: "small_blue_house",
    name: "Pingo's House",
    category: "residential",
    enabled: true,
    assetKey: "world-building-small-blue-house",
    assetPath: "/assets/world/houses/Small_Blue_House.png",
    blueprintKey: "world-building-small-blue-house-blueprint",
    blueprintPath: "/assets/world/houses/Blue_House_BP.png",
    footprint: { ...SMALL_HOUSE_VISUAL_CLASS.footprint },
    entrance: { ...SHARED_ENTRANCE },
    visual: { ...SMALL_HOUSE_VISUAL },
    cost: { wood: 8, stone: 2 },
    residentHome: uniqueStartingHome("pingo"),
  },
  brown_house: {
    id: "brown_house",
    name: "Tito's House",
    category: "residential",
    enabled: true,
    assetKey: "world-building-brown-house",
    assetPath: "/assets/world/houses/House_Brown.png",
    blueprintKey: "world-building-brown-house-blueprint",
    blueprintPath: "/assets/world/houses/Brown_House_BP.png",
    footprint: { ...SMALL_HOUSE_VISUAL_CLASS.footprint },
    entrance: { ...SHARED_ENTRANCE },
    visual: { ...SMALL_HOUSE_VISUAL },
    cost: { wood: 6, stone: 4 },
    residentHome: uniqueStartingHome("tito"),
  },
  green_house: {
    id: "green_house",
    name: "Momo's House",
    category: "residential",
    enabled: true,
    assetKey: "world-building-green-house",
    assetPath: "/assets/world/houses/Green_House.png",
    blueprintKey: "world-building-green-house-blueprint",
    blueprintPath: "/assets/world/houses/Green_House_BP.png",
    footprint: { ...SMALL_HOUSE_VISUAL_CLASS.footprint },
    entrance: { ...SHARED_ENTRANCE },
    visual: { ...SMALL_HOUSE_VISUAL },
    cost: { wood: 7, stone: 3 },
    residentHome: uniqueStartingHome("momo"),
  },
};

/** Completed-texture pixel size from catalog metadata. Not occupancy. */
export const BUILDING_NATIVE_TEXTURE_SIZE: Record<BuildingTypeId, BuildingCanvasSize> = {
  small_blue_house: BUILDINGS.small_blue_house.visual.completedCanvas,
  brown_house: BUILDINGS.brown_house.visual.completedCanvas,
  green_house: BUILDINGS.green_house.visual.completedCanvas,
};

export const DEFAULT_BUILDING_TYPE_ID: BuildingTypeId = "small_blue_house";

export function buildingById(id: BuildingTypeId): BuildingDefinition {
  return BUILDINGS[id];
}

export function buildingImageLoads(): ReadonlyArray<{ key: string; path: string }> {
  return Object.values(BUILDINGS).flatMap((def) => [
    { key: def.assetKey, path: def.assetPath },
    { key: def.blueprintKey, path: def.blueprintPath },
  ]);
}

export function footprintTiles(origin: GridPosition, def: BuildingDefinition): GridPosition[] {
  const tiles: GridPosition[] = [];
  for (let dy = 0; dy < def.footprint.height; dy += 1) {
    for (let dx = 0; dx < def.footprint.width; dx += 1) {
      tiles.push({ x: origin.x + dx, y: origin.y + dy });
    }
  }
  return tiles;
}

export function entranceTile(origin: GridPosition, def: BuildingDefinition): GridPosition {
  return {
    x: origin.x + def.entrance.localTileX,
    y: origin.y + def.entrance.localTileY,
  };
}

export function buildingWorldPosition(
  origin: GridPosition,
  def: BuildingDefinition,
): { x: number; y: number } {
  return {
    x: (origin.x + def.footprint.width / 2) * TILE_SIZE + def.visual.offsetX,
    y: (origin.y + def.footprint.height) * TILE_SIZE + def.visual.offsetY,
  };
}

export type BuildingVisualPhase = "preview" | "construction" | "completed";

export function buildingTextureKey(typeId: BuildingTypeId, phase: BuildingVisualPhase): string {
  const def = buildingById(typeId);
  return phase === "construction" ? def.blueprintKey : def.assetKey;
}

export function buildingVisualLayout(
  origin: GridPosition,
  typeId: BuildingTypeId,
  phase: BuildingVisualPhase,
): {
  x: number;
  y: number;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  textureKey: string;
} {
  const def = buildingById(typeId);
  const pos = buildingWorldPosition(origin, def);
  return {
    x: pos.x,
    y: pos.y,
    originX: def.visual.originX,
    originY: def.visual.originY,
    offsetX: def.visual.offsetX,
    offsetY: def.visual.offsetY,
    textureKey: buildingTextureKey(typeId, phase),
  };
}

export function resolveBuildingAppearance(typeId: BuildingTypeId): {
  textureKey: string;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
} {
  const def = buildingById(typeId);
  return {
    textureKey: def.assetKey,
    originX: def.visual.originX,
    originY: def.visual.originY,
    offsetX: def.visual.offsetX,
    offsetY: def.visual.offsetY,
  };
}
