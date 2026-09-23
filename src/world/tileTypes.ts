import { TILE_SIZE } from "./constants";

/** Logical terrain IDs: grass | high_grass | sandy_soil | water */
export enum TileType {
  GRASS = "grass",
  HIGH_GRASS = "high_grass",
  SANDY_SOIL = "sandy_soil",
  WATER = "water",
}

/** Walk/build unchanged; only used when terrain is grass. */
export enum GrassVariant {
  PLAIN = "plain",
  FLOWERS = "flowers",
  STONES = "stones",
  PEBBLES = "pebbles",
  DIRT = "dirt",
  NATURAL = "natural",
}

export enum FarmingVisualState {
  NONE = "none",
  TILLED = "tilled",
  PLANTED = "planted",
}

/** Decorative overlays. Never blocking. */
export enum DetailType {
  GRASS_FLOWER = "grass_flower",
  SINGLE_GRASS = "single_grass",
  TALL_GRASS_DETAIL = "tall_grass_detail",
  SMALL_ROCK = "small_rock",
  GRASS_FRUIT = "grass_fruit",
  ALGAE = "algae",
  SEA_MUSHROOM = "sea_mushroom",
  SMALL_CORAL_BLUE = "small_coral_blue",
  SMALL_CORAL_YELLOW = "small_coral_yellow",
}

export const AQUATIC_DETAIL_TYPES: ReadonlySet<DetailType> = new Set([
  DetailType.ALGAE,
  DetailType.SEA_MUSHROOM,
  DetailType.SMALL_CORAL_BLUE,
  DetailType.SMALL_CORAL_YELLOW,
]);

export function isAquaticDetail(type: DetailType | null | undefined): boolean {
  return Boolean(type && AQUATIC_DETAIL_TYPES.has(type));
}

export enum ObjectType {
  TREE = "tree",
  PINE_TREE = "pine_tree",
  BUSH = "bush",
  ROCK = "rock",
  COPPER_ORE = "copper_ore",
  CORAL = "coral",
}

export interface TileDefinition {
  type: TileType;
  walkable: boolean;
  buildable: boolean;
}

export interface DetailDefinition {
  type: DetailType;
  textureKey: string;
  texturePath: string;
  visualWidth?: number;
  visualHeight?: number;
}

export interface ObjectDefinition {
  type: ObjectType;
  textureKey: string;
  texturePath: string;
  visualWidth: number;
  visualHeight: number;
  footprintWidth: number;
  footprintHeight: number;
  originX: number;
  originY: number;
}

export const CORAL_VARIANT_IDS = ["blue", "pink", "purple", "red", "yellow"] as const;
export type CoralVariant = (typeof CORAL_VARIANT_IDS)[number];
export const CANONICAL_CORAL_VARIANT: CoralVariant = "red";

export function isCoralVariant(value: string | undefined): value is CoralVariant {
  return value !== undefined && (CORAL_VARIANT_IDS as readonly string[]).includes(value);
}

export function resolveCoralVariant(variant: string | undefined): CoralVariant {
  return isCoralVariant(variant) ? variant : CANONICAL_CORAL_VARIANT;
}

/**
 * Drawn size in world pixels for large corals. Source PNGs stay 65×65; do not edit the files.
 * Smaller than a tile so the deposit sits inside the water cell.
 */
export const CORAL_DISPLAY_SIZE = 18;

export const CORAL_VARIANT_DEFS: Record<
  CoralVariant,
  { textureKey: string; texturePath: string; visualWidth: number; visualHeight: number }
> = {
  blue: {
    textureKey: "world-object-coral-blue",
    texturePath: "/assets/world/objects/Coral_Blue.png",
    visualWidth: CORAL_DISPLAY_SIZE,
    visualHeight: CORAL_DISPLAY_SIZE,
  },
  pink: {
    textureKey: "world-object-coral-pink",
    texturePath: "/assets/world/objects/Coral_Pink.png",
    visualWidth: CORAL_DISPLAY_SIZE,
    visualHeight: CORAL_DISPLAY_SIZE,
  },
  purple: {
    textureKey: "world-object-coral-purple",
    texturePath: "/assets/world/objects/Coral_Purple.png",
    visualWidth: CORAL_DISPLAY_SIZE,
    visualHeight: CORAL_DISPLAY_SIZE,
  },
  red: {
    textureKey: "world-object-coral-red",
    texturePath: "/assets/world/objects/Coral_Red.png",
    visualWidth: CORAL_DISPLAY_SIZE,
    visualHeight: CORAL_DISPLAY_SIZE,
  },
  yellow: {
    textureKey: "world-object-coral-yellow",
    texturePath: "/assets/world/objects/Coral_Yellow.png",
    visualWidth: CORAL_DISPLAY_SIZE,
    visualHeight: CORAL_DISPLAY_SIZE,
  },
};

export function coralTextureKey(variant: string | undefined): string {
  return CORAL_VARIANT_DEFS[resolveCoralVariant(variant)].textureKey;
}

/**
 * Spritesheet frames are 32×32, 8 per row on Terrain.png (256×224, 8×7).
 * Row 4 (frames 32–39) is empty. Lake shoreline art is rows 5–6. See docs/TILESET_MAPPING.md.
 */
export const TILE_DEFS: Record<TileType, TileDefinition> = {
  [TileType.GRASS]: { type: TileType.GRASS, walkable: true, buildable: true },
  [TileType.HIGH_GRASS]: { type: TileType.HIGH_GRASS, walkable: true, buildable: true },
  [TileType.SANDY_SOIL]: { type: TileType.SANDY_SOIL, walkable: true, buildable: true },
  [TileType.WATER]: { type: TileType.WATER, walkable: false, buildable: false },
};

/** Legacy row-0 solid fill. Lakes use `WATER_FRAMES` via the shoreline resolver. */
export const WATER_FRAME = 5;

export const GRASS_VARIANT_FRAMES: Record<GrassVariant, number> = {
  [GrassVariant.PLAIN]: 1,
  [GrassVariant.FLOWERS]: 2,
  [GrassVariant.STONES]: 3,
  [GrassVariant.PEBBLES]: 4,
  [GrassVariant.DIRT]: 6,
  [GrassVariant.NATURAL]: 7,
};

/** Coarse grid cache only. Soil/crop sprites no longer use these terrain frames. */
export const FARMING_VISUAL_FRAMES: Record<
  Exclude<FarmingVisualState, FarmingVisualState.NONE>,
  number
> = {
  [FarmingVisualState.TILLED]: 0,
  [FarmingVisualState.PLANTED]: 8,
};

export const CONNECTED_TERRAIN = new Set<TileType>([
  TileType.HIGH_GRASS,
  TileType.SANDY_SOIL,
]);

export const DETAIL_DEFS: Record<DetailType, DetailDefinition> = {
  [DetailType.GRASS_FLOWER]: {
    type: DetailType.GRASS_FLOWER,
    textureKey: "world-detail-grass-flower",
    texturePath: "/assets/world/details/GrassFlower.png",
  },
  [DetailType.SINGLE_GRASS]: {
    type: DetailType.SINGLE_GRASS,
    textureKey: "world-detail-single-grass",
    texturePath: "/assets/world/details/SingleGrass.png",
  },
  [DetailType.TALL_GRASS_DETAIL]: {
    type: DetailType.TALL_GRASS_DETAIL,
    textureKey: "world-detail-tall-grass",
    texturePath: "/assets/world/details/TallGrass.png",
  },
  [DetailType.SMALL_ROCK]: {
    type: DetailType.SMALL_ROCK,
    textureKey: "world-detail-small-rock",
    texturePath: "/assets/world/details/SmallRock.png",
  },
  [DetailType.GRASS_FRUIT]: {
    type: DetailType.GRASS_FRUIT,
    textureKey: "world-detail-grass-fruit",
    texturePath: "/assets/world/details/GrassFruit.png",
  },
  [DetailType.ALGAE]: {
    type: DetailType.ALGAE,
    textureKey: "world-detail-algae",
    texturePath: "/assets/world/objects/Algae.png",
    visualWidth: 14,
    visualHeight: 18,
  },
  [DetailType.SEA_MUSHROOM]: {
    type: DetailType.SEA_MUSHROOM,
    textureKey: "world-detail-sea-mushroom",
    texturePath: "/assets/world/objects/Sea_Mushroom.png",
    visualWidth: 14,
    visualHeight: 12,
  },
  [DetailType.SMALL_CORAL_BLUE]: {
    type: DetailType.SMALL_CORAL_BLUE,
    textureKey: "world-detail-small-coral-blue",
    texturePath: "/assets/world/objects/Small_Coral_Blue.png",
    visualWidth: 10,
    visualHeight: 10,
  },
  [DetailType.SMALL_CORAL_YELLOW]: {
    type: DetailType.SMALL_CORAL_YELLOW,
    textureKey: "world-detail-small-coral-yellow",
    texturePath: "/assets/world/objects/Small_Coral_Yellow.png",
    visualWidth: 10,
    visualHeight: 10,
  },
};

export function aquaticDetailDisplay(type: DetailType): { width: number; height: number } | null {
  if (!isAquaticDetail(type)) {
    return null;
  }
  const def = DETAIL_DEFS[type];
  if (def.visualWidth === undefined || def.visualHeight === undefined) {
    return null;
  }
  return { width: def.visualWidth, height: def.visualHeight };
}

/**
 * World objects load as whole PNGs (no atlas crops).
 * Visual size and collision footprint are separate; both snap to TILE_SIZE.
 */
export const OBJECT_DEFS: Record<ObjectType, ObjectDefinition> = {
  [ObjectType.TREE]: {
    type: ObjectType.TREE,
    textureKey: "world-object-tree",
    texturePath: "/assets/world/objects/Tree.png",
    visualWidth: TILE_SIZE * 2,
    visualHeight: TILE_SIZE * 2,
    footprintWidth: 2,
    footprintHeight: 2,
    originX: 0,
    originY: 0,
  },
  [ObjectType.PINE_TREE]: {
    type: ObjectType.PINE_TREE,
    textureKey: "world-object-pine-tree",
    texturePath: "/assets/world/objects/PineTree.png",
    visualWidth: TILE_SIZE,
    visualHeight: TILE_SIZE * 2,
    footprintWidth: 1,
    footprintHeight: 1,
    originX: 0.5,
    originY: 1,
  },
  [ObjectType.BUSH]: {
    type: ObjectType.BUSH,
    textureKey: "world-object-bush",
    texturePath: "/assets/world/objects/Bush.png",
    visualWidth: TILE_SIZE,
    visualHeight: TILE_SIZE,
    footprintWidth: 1,
    footprintHeight: 1,
    originX: 0,
    originY: 0,
  },
  [ObjectType.ROCK]: {
    type: ObjectType.ROCK,
    textureKey: "world-object-rock",
    texturePath: "/assets/world/objects/Rock.png",
    visualWidth: TILE_SIZE,
    visualHeight: TILE_SIZE,
    footprintWidth: 1,
    footprintHeight: 1,
    originX: 0,
    originY: 0,
  },
  [ObjectType.COPPER_ORE]: {
    type: ObjectType.COPPER_ORE,
    textureKey: "world-object-copper-ore",
    texturePath: "/assets/world/objects/Copper_Ore.png",
    visualWidth: TILE_SIZE,
    visualHeight: TILE_SIZE,
    footprintWidth: 1,
    footprintHeight: 1,
    originX: 0,
    originY: 0,
  },
  /** Canonical large coral; color variants load through CORAL_VARIANT_DEFS. */
  [ObjectType.CORAL]: {
    type: ObjectType.CORAL,
    textureKey: CORAL_VARIANT_DEFS.red.textureKey,
    texturePath: CORAL_VARIANT_DEFS.red.texturePath,
    visualWidth: CORAL_VARIANT_DEFS.red.visualWidth,
    visualHeight: CORAL_VARIANT_DEFS.red.visualHeight,
    footprintWidth: 1,
    footprintHeight: 1,
    originX: 0.5,
    originY: 0.5,
  },
};

export function worldImageLoads(): ReadonlyArray<{ key: string; path: string }> {
  const loads = [
    ...Object.values(OBJECT_DEFS).map((def) => ({
      key: def.textureKey,
      path: def.texturePath,
    })),
    ...Object.values(CORAL_VARIANT_DEFS).map((def) => ({
      key: def.textureKey,
      path: def.texturePath,
    })),
    ...Object.values(DETAIL_DEFS).map((def) => ({
      key: def.textureKey,
      path: def.texturePath,
    })),
  ];
  const seen = new Set<string>();
  return loads.filter((entry) => {
    if (seen.has(entry.key)) {
      return false;
    }
    seen.add(entry.key);
    return true;
  });
}
