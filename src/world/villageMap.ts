import { Grid } from "./Grid";
import {
  DetailType,
  FarmingVisualState,
  GrassVariant,
  ObjectType,
  TileType,
} from "./tileTypes";
import type { WorldObject } from "./Tile";

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 15;

function createFilledTerrain(type: TileType): TileType[][] {
  return Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => type),
  );
}

function createFilledDetails(): Array<Array<DetailType | null>> {
  return Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => null),
  );
}

function createFilledVariants(): Array<Array<GrassVariant | null>> {
  return Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => null),
  );
}

function createFilledFarming(): FarmingVisualState[][] {
  return Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => FarmingVisualState.NONE),
  );
}

function fillRect<T>(
  layer: T[][],
  x: number,
  y: number,
  width: number,
  height: number,
  value: T,
): void {
  const x1 = Math.max(0, x);
  const y1 = Math.max(0, y);
  const x2 = Math.min(MAP_WIDTH, x + width);
  const y2 = Math.min(MAP_HEIGHT, y + height);
  for (let ty = y1; ty < y2; ty += 1) {
    for (let tx = x1; tx < x2; tx += 1) {
      layer[ty][tx] = value;
    }
  }
}

function setCell<T>(layer: T[][], x: number, y: number, value: T): void {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
    return;
  }
  layer[y][x] = value;
}

/**
 * Manually authored 20×15 prototype village.
 * NW high grass + trees, center clearing, SE lake with visual shoreline, SW grass for player farms.
 * Lake water meets grass on the west/north; sandy_soil is a small east beach, not the shoreline system.
 */
export function createVillageMap(): Grid {
  const terrain = createFilledTerrain(TileType.GRASS);
  const details = createFilledDetails();
  const grassVariants = createFilledVariants();
  const farming = createFilledFarming();

  fillRect(terrain, 0, 0, 5, 4, TileType.HIGH_GRASS);

  const variants: Array<[number, number, GrassVariant]> = [
    [6, 2, GrassVariant.FLOWERS],
    [9, 4, GrassVariant.NATURAL],
    [11, 3, GrassVariant.STONES],
    [5, 7, GrassVariant.DIRT],
    [7, 9, GrassVariant.PEBBLES],
    [13, 4, GrassVariant.FLOWERS],
    [18, 6, GrassVariant.PEBBLES],
    [5, 13, GrassVariant.DIRT],
    [11, 10, GrassVariant.NATURAL],
    [2, 8, GrassVariant.FLOWERS],
  ];
  for (const [x, y, variant] of variants) {
    setCell(grassVariants, x, y, variant);
  }

  const sandyCells: Array<[number, number]> = [
    [18, 8],
    [19, 8],
    [18, 9],
    [19, 9],
    [19, 10],
    [19, 11],
    [18, 12],
    [19, 12],
    [18, 13],
    [19, 13],
    [18, 14],
  ];
  for (const [x, y] of sandyCells) {
    setCell(terrain, x, y, TileType.SANDY_SOIL);
  }

  const waterCells: Array<[number, number]> = [
    [14, 8],
    [15, 8],
    [13, 9],
    [14, 9],
    [15, 9],
    [16, 9],
    [17, 9],
    [13, 10],
    [14, 10],
    [15, 10],
    [16, 10],
    [17, 10],
    [18, 10],
    [13, 11],
    [14, 11],
    [15, 11],
    [16, 11],
    [17, 11],
    [18, 11],
    [13, 12],
    [14, 12],
    [16, 12],
    [17, 12],
    [13, 13],
    [14, 13],
    [15, 13],
    [16, 13],
    [17, 13],
    [14, 14],
    [15, 14],
    [16, 14],
    [17, 14],
    [13, 14],
  ];
  for (const [x, y] of waterCells) {
    setCell(terrain, x, y, TileType.WATER);
  }

  const detailPlacements: Array<[number, number, DetailType]> = [
    [6, 8, DetailType.GRASS_FLOWER],
    [11, 4, DetailType.GRASS_FLOWER],
    [3, 5, DetailType.SINGLE_GRASS],
    [14, 5, DetailType.SINGLE_GRASS],
    [0, 8, DetailType.TALL_GRASS_DETAIL],
    [8, 3, DetailType.TALL_GRASS_DETAIL],
    [14, 7, DetailType.SMALL_ROCK],
    [19, 4, DetailType.SMALL_ROCK],
    [5, 5, DetailType.GRASS_FRUIT],
    [11, 9, DetailType.GRASS_FRUIT],
  ];
  for (const [x, y, detail] of detailPlacements) {
    setCell(details, x, y, detail);
  }

  const objects: WorldObject[] = [
    { type: ObjectType.TREE, x: 1, y: 0 },
    { type: ObjectType.TREE, x: 4, y: 0 },
    { type: ObjectType.TREE, x: 7, y: 0 },
    { type: ObjectType.TREE, x: 2, y: 3 },
    { type: ObjectType.TREE, x: 0, y: 6 },
    { type: ObjectType.TREE, x: 12, y: 7 },
    { type: ObjectType.PINE_TREE, x: 18, y: 1 },
    { type: ObjectType.BUSH, x: 15, y: 3 },
    { type: ObjectType.BUSH, x: 3, y: 9 },
    { type: ObjectType.ROCK, x: 10, y: 2 },
    { type: ObjectType.ROCK, x: 4, y: 7 },
    { type: ObjectType.ROCK, x: 9, y: 12 },
    { type: ObjectType.ROCK, x: 12, y: 6 },
    { type: ObjectType.ROCK, x: 8, y: 9 },
  ];

  return new Grid(
    MAP_WIDTH,
    MAP_HEIGHT,
    terrain,
    details,
    objects,
    grassVariants,
    farming,
  );
}
