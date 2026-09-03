import {
  CONNECTED_TERRAIN,
  FARMING_VISUAL_FRAMES,
  FarmingVisualState,
  GRASS_VARIANT_FRAMES,
  GrassVariant,
  OBJECT_DEFS,
  TILE_DEFS,
  TileType,
  type DetailType,
} from "./tileTypes";
import type { WorldObject, WorldTile } from "./Tile";
import { TILE_SIZE } from "./constants";
import { connectedTerrainFrame, neighborMask } from "./connectedTerrain";
import { resolveShoreline } from "./autotile/resolveShoreline";
import { WATER_FRAMES, type ShoreRotationDeg, type ShoreVisual } from "./autotile/shorelineDefinitions";

const EMPTY_FARM_FRAME = -1;

export class Grid {
  readonly width: number;
  readonly height: number;
  readonly objects: readonly WorldObject[];
  private readonly tiles: WorldTile[][];

  constructor(
    width: number,
    height: number,
    terrain: TileType[][],
    details: Array<Array<DetailType | null>>,
    objects: readonly WorldObject[],
    grassVariants: Array<Array<GrassVariant | null>> = emptyLayer(width, height, null),
    farming: Array<Array<FarmingVisualState>> = emptyLayer(
      width,
      height,
      FarmingVisualState.NONE,
    ),
  ) {
    if (terrain.length !== height || terrain.some((row) => row.length !== width)) {
      throw new Error("Terrain array does not match grid dimensions.");
    }
    if (details.length !== height || details.some((row) => row.length !== width)) {
      throw new Error("Detail array does not match grid dimensions.");
    }
    if (
      grassVariants.length !== height ||
      grassVariants.some((row) => row.length !== width)
    ) {
      throw new Error("Grass variant array does not match grid dimensions.");
    }
    if (farming.length !== height || farming.some((row) => row.length !== width)) {
      throw new Error("Farming array does not match grid dimensions.");
    }

    this.width = width;
    this.height = height;
    this.objects = objects;
    this.tiles = terrain.map((row, y) =>
      row.map((terrainType, x) => {
        const def = TILE_DEFS[terrainType];
        const variant =
          terrainType === TileType.GRASS
            ? (grassVariants[y][x] ?? GrassVariant.PLAIN)
            : null;
        return {
          terrain: terrainType,
          grassVariant: variant,
          detail: details[y][x],
          farming: farming[y][x],
          walkable: def.walkable,
          buildable: def.buildable,
        };
      }),
    );

    for (const object of objects) {
      const def = OBJECT_DEFS[object.type];
      for (let dy = 0; dy < def.footprintHeight; dy += 1) {
        for (let dx = 0; dx < def.footprintWidth; dx += 1) {
          const tile = this.getTile(object.x + dx, object.y + dy);
          if (!tile) {
            continue;
          }
          tile.walkable = false;
          tile.buildable = false;
        }
      }
    }
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  getTile(x: number, y: number): WorldTile | undefined {
    if (!this.inBounds(x, y)) {
      return undefined;
    }
    return this.tiles[y][x];
  }

  isWalkable(x: number, y: number): boolean {
    return this.getTile(x, y)?.walkable === true;
  }

  objectAt(x: number, y: number): WorldObject | undefined {
    return this.objects.find((object) => {
      const def = OBJECT_DEFS[object.type];
      return (
        x >= object.x &&
        x < object.x + def.footprintWidth &&
        y >= object.y &&
        y < object.y + def.footprintHeight
      );
    });
  }

  terrainFrameGrid(): number[][] {
    return this.tiles.map((row, y) => row.map((_, x) => this.terrainFrameAt(x, y)));
  }

  terrainRotationAt(x: number, y: number): ShoreRotationDeg {
    return this.shoreVisualAt(x, y)?.rotationDeg ?? 0;
  }

  shoreVisualAt(x: number, y: number): ShoreVisual | null {
    const tile = this.getTile(x, y);
    if (!tile || tile.terrain !== TileType.WATER) {
      return null;
    }
    return resolveShoreline(
      (dx, dy) => this.getTile(x + dx, y + dy)?.terrain === TileType.WATER,
      x,
      y,
    );
  }

  farmingFrameGrid(): number[][] {
    return this.tiles.map((row) =>
      row.map((tile) =>
        tile.farming === FarmingVisualState.NONE
          ? EMPTY_FARM_FRAME
          : FARMING_VISUAL_FRAMES[tile.farming],
      ),
    );
  }

  setFarmingVisual(x: number, y: number, farming: FarmingVisualState): void {
    const tile = this.getTile(x, y);
    if (!tile) {
      return;
    }
    tile.farming = farming;
  }

  farmingFrameAt(x: number, y: number): number {
    const tile = this.getTile(x, y);
    if (!tile || tile.farming === FarmingVisualState.NONE) {
      return EMPTY_FARM_FRAME;
    }
    return FARMING_VISUAL_FRAMES[tile.farming];
  }

  worldWidthPx(): number {
    return this.width * TILE_SIZE;
  }

  worldHeightPx(): number {
    return this.height * TILE_SIZE;
  }

  private terrainFrameAt(x: number, y: number): number {
    const tile = this.tiles[y][x];
    if (tile.terrain === TileType.GRASS) {
      return GRASS_VARIANT_FRAMES[tile.grassVariant ?? GrassVariant.PLAIN];
    }
    if (tile.terrain === TileType.WATER) {
      return this.shoreVisualAt(x, y)?.frame ?? WATER_FRAMES.center;
    }
    if (CONNECTED_TERRAIN.has(tile.terrain)) {
      const family = tile.terrain;
      const mask = neighborMask((dx, dy) => this.getTile(x + dx, y + dy)?.terrain === family);
      return connectedTerrainFrame(family, mask);
    }
    return GRASS_VARIANT_FRAMES[GrassVariant.PLAIN];
  }
}

function emptyLayer<T>(width: number, height: number, fill: T): T[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}
