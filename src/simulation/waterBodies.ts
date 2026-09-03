import { collectWaterCells, waterEffectPoint } from "@/src/game/render/water/waterCoverage";
import { TILE_SIZE } from "@/src/world/constants";
import { findPath } from "@/src/world/pathfinding";
import type { Grid } from "@/src/world/Grid";
import type { GridPosition } from "@/src/world/GridPosition";
import { TileType } from "@/src/world/tileTypes";
import { FISHING } from "./fishingConfig";
import type { WaterDepth } from "./data/fish";
import type { FishingWaterSpot } from "./entities/AquaticActivity";
import type {
  CastDirection,
  FishingAccessPoint,
  WaterBody,
  WaterBodyType,
} from "./entities/WaterBody";

const CARDINALS: ReadonlyArray<{ dx: number; dy: number; dir: CastDirection; opposite: CastDirection }> = [
  { dx: 0, dy: -1, dir: "north", opposite: "south" },
  { dx: 1, dy: 0, dir: "east", opposite: "west" },
  { dx: 0, dy: 1, dir: "south", opposite: "north" },
  { dx: -1, dy: 0, dir: "west", opposite: "east" },
];

export interface WaterWorldCache {
  bodies: WaterBody[];
  accessPoints: FishingAccessPoint[];
  spots: FishingWaterSpot[];
}

export function buildWaterWorld(grid: Grid, pathOrigin: GridPosition): WaterWorldCache {
  const cells = collectWaterCells(grid);
  const cellKey = (x: number, y: number) => `${x},${y}`;
  const cellByKey = new Map(cells.map((cell) => [cellKey(cell.x, cell.y), cell]));
  const visited = new Set<string>();
  const bodies: WaterBody[] = [];
  let bodySeq = 1;

  for (const cell of cells) {
    const start = cellKey(cell.x, cell.y);
    if (visited.has(start)) {
      continue;
    }
    const tiles: GridPosition[] = [];
    const queue = [cell];
    visited.add(start);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        break;
      }
      tiles.push({ x: current.x, y: current.y });
      for (const step of CARDINALS) {
        const nx = current.x + step.dx;
        const ny = current.y + step.dy;
        const neighborKey = cellKey(nx, ny);
        if (visited.has(neighborKey) || !cellByKey.has(neighborKey)) {
          continue;
        }
        visited.add(neighborKey);
        const neighbor = cellByKey.get(neighborKey);
        if (neighbor) {
          queue.push(neighbor);
        }
      }
    }
    const id = `water_${bodySeq}`;
    bodySeq += 1;
    const shallowTiles: GridPosition[] = [];
    const deepTiles: GridPosition[] = [];
    for (const tile of tiles) {
      const entry = cellByKey.get(cellKey(tile.x, tile.y));
      if (entry?.interior) {
        deepTiles.push(tile);
      } else {
        shallowTiles.push(tile);
      }
    }
    bodies.push({
      id,
      type: classifyBody(tiles.length),
      tiles,
      shallowTiles,
      deepTiles,
    });
  }

  const tileToBody = new Map<string, string>();
  for (const body of bodies) {
    for (const tile of body.tiles) {
      tileToBody.set(cellKey(tile.x, tile.y), body.id);
    }
  }

  const spots: FishingWaterSpot[] = cells.map((cell) => {
    const point = waterEffectPoint(cell);
    return {
      tileX: cell.x,
      tileY: cell.y,
      worldX: point.x,
      worldY: point.y,
      waterBodyId: tileToBody.get(cellKey(cell.x, cell.y)) ?? "",
      depth: cell.interior ? "deep" : "shallow",
    };
  });

  const accessPoints: FishingAccessPoint[] = [];
  for (const cell of cells) {
    const waterBodyId = tileToBody.get(cellKey(cell.x, cell.y));
    if (!waterBodyId) {
      continue;
    }
    for (const step of CARDINALS) {
      const landX = cell.x + step.dx;
      const landY = cell.y + step.dy;
      if (!grid.inBounds(landX, landY) || !grid.isWalkable(landX, landY)) {
        continue;
      }
      if (grid.getTile(landX, landY)?.terrain === TileType.WATER) {
        continue;
      }
      const path = findPath(grid, pathOrigin, { x: landX, y: landY });
      if (path === null) {
        continue;
      }
      const waterWorld = waterEffectPoint(cell);
      const reachableDepths = depthsInCastRange(spots, waterWorld.x, waterWorld.y, waterBodyId);
      accessPoints.push({
        id: `ap_${waterBodyId}_${landX}_${landY}_${step.opposite}`,
        waterBodyId,
        landTile: { x: landX, y: landY },
        waterTile: { x: cell.x, y: cell.y },
        castDirection: step.opposite,
        reachableDepths,
        enabled: true,
        reservedBy: null,
      });
    }
  }

  return { bodies, accessPoints, spots };
}

export function accessPointById(
  points: readonly FishingAccessPoint[],
  id: string | null,
): FishingAccessPoint | undefined {
  if (!id) {
    return undefined;
  }
  return points.find((point) => point.id === id);
}

export function isLandTileReserved(
  points: readonly FishingAccessPoint[],
  land: GridPosition,
  exceptPointId?: string | null,
): boolean {
  return points.some(
    (point) =>
      point.reservedBy !== null &&
      point.id !== exceptPointId &&
      point.landTile.x === land.x &&
      point.landTile.y === land.y,
  );
}

export function bobberWorldFromAccess(
  point: FishingAccessPoint,
  activity: { worldX: number; worldY: number },
): { x: number; y: number; tileX: number; tileY: number } {
  const waterX = point.waterTile.x * TILE_SIZE + TILE_SIZE / 2;
  const waterY = point.waterTile.y * TILE_SIZE + TILE_SIZE / 2;
  const dx = activity.worldX - waterX;
  const dy = activity.worldY - waterY;
  const dist = Math.hypot(dx, dy);
  if (dist <= FISHING.castRadiusPx && dist > 0) {
    return { x: activity.worldX, y: activity.worldY, tileX: point.waterTile.x, tileY: point.waterTile.y };
  }
  const offset = 10;
  let x = waterX;
  let y = waterY;
  if (point.castDirection === "east") {
    x += offset;
  } else if (point.castDirection === "west") {
    x -= offset;
  } else if (point.castDirection === "south") {
    y += offset;
  } else {
    y -= offset;
  }
  return { x, y, tileX: point.waterTile.x, tileY: point.waterTile.y };
}

function classifyBody(tileCount: number): WaterBodyType {
  return tileCount <= FISHING.pondMaxTiles ? "pond" : "lake";
}

function depthsInCastRange(
  spots: readonly FishingWaterSpot[],
  worldX: number,
  worldY: number,
  waterBodyId: string,
): WaterDepth[] {
  const radiusSq = FISHING.castRadiusPx * FISHING.castRadiusPx;
  const depths = new Set<WaterDepth>();
  for (const spot of spots) {
    if (spot.waterBodyId !== waterBodyId) {
      continue;
    }
    const dx = spot.worldX - worldX;
    const dy = spot.worldY - worldY;
    if (dx * dx + dy * dy <= radiusSq) {
      depths.add(spot.depth);
    }
  }
  if (depths.size === 0) {
    depths.add("shallow");
  }
  return [...depths];
}
