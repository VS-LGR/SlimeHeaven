import { TILE_SIZE } from "@/src/world/constants";
import type { GridPosition } from "@/src/world/GridPosition";
import {
  bundleAmount,
  canConsumeBundle,
  normalizeBundle,
  RESOURCE_TYPE_LIST,
  type ResourceBundle,
  type ResourceStock,
  type ResourceType,
} from "../resources";
import type { ResidentTypeId } from "./residents";

export const BUILDING_TYPE_IDS = ["small_blue_house", "brown_house", "green_house", "lily_house"] as const;

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

/** Pingo's house PNG is a larger authored frame; last opaque row sits above the canvas lip. */
export const SMALL_BLUE_HOUSE_CANVAS = { width: 111, height: 104 } satisfies BuildingCanvasSize;
export const SMALL_BLUE_HOUSE_FEET_Y = 96;
export const SMALL_BLUE_HOUSE_BLUEPRINT_FEET_Y = 93;

/** Tito's house PNG is a larger authored frame; last opaque row sits two pixels above the lip. */
export const BROWN_HOUSE_CANVAS = { width: 121, height: 114 } satisfies BuildingCanvasSize;
export const BROWN_HOUSE_FEET_Y = 112;

/** Lily's house PNG is a 121×114 authored frame; last opaque row is 108, so feet sit at 109. */
export const LILY_HOUSE_CANVAS = { width: 121, height: 114 } satisfies BuildingCanvasSize;
export const LILY_HOUSE_FEET_Y = 109;

export const BUILDING_RESOURCE_LABELS: Record<ResourceType, string> = {
  wood: "Wood",
  stone: "Stone",
  food: "Food",
  vine: "Vine",
  foliage: "Foliage",
  copperOre: "Copper",
  shell: "Shell",
  coral: "Coral",
};

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
    /** Construction-site origin. Defaults to originY when omitted. */
    blueprintOriginY?: number;
    offsetX: number;
    offsetY: number;
    completedCanvas: BuildingCanvasSize;
    blueprintCanvas: BuildingCanvasSize;
  };
  cost: ResourceBundle;
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

function uniqueResidentHome(
  residentTypeId: ResidentTypeId,
  options: { startingHome: boolean; recipeUnlocked: boolean },
): ResidentHomeMeta {
  return {
    residentTypeId,
    unique: true,
    startingHome: options.startingHome,
    recipeUnlocked: options.recipeUnlocked,
  };
}

function uniqueStartingHome(residentTypeId: ResidentTypeId): ResidentHomeMeta {
  return uniqueResidentHome(residentTypeId, { startingHome: true, recipeUnlocked: true });
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
    visual: {
      ...SMALL_HOUSE_VISUAL,
      completedCanvas: { ...SMALL_BLUE_HOUSE_CANVAS },
      blueprintCanvas: { ...SMALL_BLUE_HOUSE_CANVAS },
      originY: SMALL_BLUE_HOUSE_FEET_Y / SMALL_BLUE_HOUSE_CANVAS.height,
      blueprintOriginY: SMALL_BLUE_HOUSE_BLUEPRINT_FEET_Y / SMALL_BLUE_HOUSE_CANVAS.height,
    },
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
    visual: {
      ...SMALL_HOUSE_VISUAL,
      completedCanvas: { ...BROWN_HOUSE_CANVAS },
      blueprintCanvas: { ...BROWN_HOUSE_CANVAS },
      originY: BROWN_HOUSE_FEET_Y / BROWN_HOUSE_CANVAS.height,
      blueprintOriginY: BROWN_HOUSE_FEET_Y / BROWN_HOUSE_CANVAS.height,
    },
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
  lily_house: {
    id: "lily_house",
    name: "Lily's House",
    category: "residential",
    enabled: true,
    assetKey: "world-building-lily-house",
    assetPath: "/assets/world/houses/Lily_House.png",
    blueprintKey: "world-building-lily-house-blueprint",
    blueprintPath: "/assets/world/houses/Lily_House_BP.png",
    footprint: { ...SMALL_HOUSE_VISUAL_CLASS.footprint },
    entrance: { ...SHARED_ENTRANCE },
    visual: {
      ...SMALL_HOUSE_VISUAL,
      completedCanvas: { ...LILY_HOUSE_CANVAS },
      blueprintCanvas: { ...LILY_HOUSE_CANVAS },
      originY: LILY_HOUSE_FEET_Y / LILY_HOUSE_CANVAS.height,
      blueprintOriginY: LILY_HOUSE_FEET_Y / LILY_HOUSE_CANVAS.height,
    },
    cost: { wood: 10, stone: 4, vine: 3, foliage: 4, shell: 1 },
    residentHome: uniqueResidentHome("lily", { startingHome: false, recipeUnlocked: false }),
  },
};

/** Completed-texture pixel size from catalog metadata. Not occupancy. */
export const BUILDING_NATIVE_TEXTURE_SIZE: Record<BuildingTypeId, BuildingCanvasSize> = {
  small_blue_house: BUILDINGS.small_blue_house.visual.completedCanvas,
  brown_house: BUILDINGS.brown_house.visual.completedCanvas,
  green_house: BUILDINGS.green_house.visual.completedCanvas,
  lily_house: BUILDINGS.lily_house.visual.completedCanvas,
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
  displayWidth: number;
  displayHeight: number;
  textureKey: string;
} {
  const def = buildingById(typeId);
  const pos = buildingWorldPosition(origin, def);
  const canvas = phase === "construction" ? def.visual.blueprintCanvas : def.visual.completedCanvas;
  return {
    x: pos.x,
    y: pos.y,
    originX: def.visual.originX,
    originY:
      phase === "construction" ? (def.visual.blueprintOriginY ?? def.visual.originY) : def.visual.originY,
    offsetX: def.visual.offsetX,
    offsetY: def.visual.offsetY,
    displayWidth: canvas.width,
    displayHeight: canvas.height,
    textureKey: buildingTextureKey(typeId, phase),
  };
}

export function buildingCostBundle(def: BuildingDefinition): ResourceBundle {
  return normalizeBundle(def.cost);
}

export function isBuildingCostAffordable(def: BuildingDefinition, stock: ResourceStock): boolean {
  return canConsumeBundle(stock, def.cost);
}

export function missingBuildingResources(def: BuildingDefinition, stock: ResourceStock): ResourceType[] {
  const cost = buildingCostBundle(def);
  return RESOURCE_TYPE_LIST.filter(
    (type) => bundleAmount(cost, type) > 0 && stock[type] < bundleAmount(cost, type),
  );
}

export function formatBuildingCost(def: BuildingDefinition, stock?: ResourceStock): string {
  const cost = buildingCostBundle(def);
  return RESOURCE_TYPE_LIST.filter((type) => bundleAmount(cost, type) > 0)
    .map((type) => {
      const need = bundleAmount(cost, type);
      const label = BUILDING_RESOURCE_LABELS[type];
      if (stock) {
        return `${label} ${stock[type]}/${need}`;
      }
      return `${need} ${label}`;
    })
    .join(" · ");
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
