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
}

export enum ObjectType {
  TREE = "tree",
  PINE_TREE = "pine_tree",
  BUSH = "bush",
  ROCK = "rock",
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
};

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
};

export function worldImageLoads(): ReadonlyArray<{ key: string; path: string }> {
  return [
    ...Object.values(OBJECT_DEFS).map((def) => ({
      key: def.textureKey,
      path: def.texturePath,
    })),
    ...Object.values(DETAIL_DEFS).map((def) => ({
      key: def.textureKey,
      path: def.texturePath,
    })),
  ];
}
