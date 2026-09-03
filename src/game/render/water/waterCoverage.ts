import { TILE_SIZE, worldToTile } from "@/src/world/constants";
import type { Grid } from "@/src/world/Grid";
import { TileType } from "@/src/world/tileTypes";

export interface WaterOpenEdges {
  n: boolean;
  e: boolean;
  s: boolean;
  w: boolean;
}

export interface WaterDepthFaces {
  n: boolean;
  e: boolean;
  s: boolean;
  w: boolean;
}

export interface WaterCell {
  x: number;
  y: number;
  interior: boolean;
  openEdges: WaterOpenEdges;
  facesDeep: WaterDepthFaces;
  facesShallow: WaterDepthFaces;
}

export function isWaterTile(grid: Grid, x: number, y: number): boolean {
  return grid.getTile(x, y)?.terrain === TileType.WATER;
}

export function isWaterWorld(grid: Grid, worldX: number, worldY: number): boolean {
  const { x, y } = worldToTile(worldX, worldY);
  return isWaterTile(grid, x, y);
}

export function collectWaterCells(grid: Grid): WaterCell[] {
  const cells: WaterCell[] = [];
  const emptyFaces: WaterDepthFaces = { n: false, e: false, s: false, w: false };
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (!isWaterTile(grid, x, y)) {
        continue;
      }
      const n = isWaterTile(grid, x, y - 1);
      const e = isWaterTile(grid, x + 1, y);
      const s = isWaterTile(grid, x, y + 1);
      const w = isWaterTile(grid, x - 1, y);
      const ne = isWaterTile(grid, x + 1, y - 1);
      const se = isWaterTile(grid, x + 1, y + 1);
      const sw = isWaterTile(grid, x - 1, y + 1);
      const nw = isWaterTile(grid, x - 1, y - 1);
      cells.push({
        x,
        y,
        // Deep water only when land does not touch this cell, even diagonally.
        // Inner-corner shoreline art lives on 4-way water with one land diagonal.
        interior: n && e && s && w && ne && se && sw && nw,
        openEdges: { n: !n, e: !e, s: !s, w: !w },
        facesDeep: { ...emptyFaces },
        facesShallow: { ...emptyFaces },
      });
    }
  }

  const byKey = new Map(cells.map((cell) => [`${cell.x},${cell.y}`, cell]));
  for (const cell of cells) {
    const neighbor = (dx: number, dy: number) => byKey.get(`${cell.x + dx},${cell.y + dy}`);
    const n = neighbor(0, -1);
    const e = neighbor(1, 0);
    const s = neighbor(0, 1);
    const w = neighbor(-1, 0);
    cell.facesDeep = {
      n: n?.interior === true,
      e: e?.interior === true,
      s: s?.interior === true,
      w: w?.interior === true,
    };
    cell.facesShallow = {
      n: n != null && !n.interior,
      e: e != null && !e.interior,
      s: s != null && !s.interior,
      w: w != null && !w.interior,
    };
  }
  return cells;
}

export function waterCellCenter(cell: WaterCell): { x: number; y: number } {
  return {
    x: cell.x * TILE_SIZE + TILE_SIZE / 2,
    y: cell.y * TILE_SIZE + TILE_SIZE / 2,
  };
}

/** Keep ambient VFX off the land pixels of shoreline tiles. Interior water uses the full cell. */
export const SHORE_EFFECT_INSET_PX = 7;

export function waterEffectPoint(cell: WaterCell): { x: number; y: number } {
  const center = waterCellCenter(cell);
  if (cell.interior) {
    return center;
  }
  const inset = SHORE_EFFECT_INSET_PX;
  let { x, y } = center;
  if (cell.openEdges.n) {
    y += inset;
  }
  if (cell.openEdges.s) {
    y -= inset;
  }
  if (cell.openEdges.w) {
    x += inset;
  }
  if (cell.openEdges.e) {
    x -= inset;
  }
  return { x, y };
}

export function waterBoundsPx(cells: readonly WaterCell[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  if (cells.length === 0) {
    return null;
  }
  let minX = cells[0].x;
  let minY = cells[0].y;
  let maxX = cells[0].x;
  let maxY = cells[0].y;
  for (const cell of cells) {
    minX = Math.min(minX, cell.x);
    minY = Math.min(minY, cell.y);
    maxX = Math.max(maxX, cell.x);
    maxY = Math.max(maxY, cell.y);
  }
  return {
    x: minX * TILE_SIZE,
    y: minY * TILE_SIZE,
    width: (maxX - minX + 1) * TILE_SIZE,
    height: (maxY - minY + 1) * TILE_SIZE,
  };
}

export function visibleWaterCells(
  cells: readonly WaterCell[],
  view: { x: number; y: number; width: number; height: number },
): WaterCell[] {
  const x1 = view.x;
  const y1 = view.y;
  const x2 = view.x + view.width;
  const y2 = view.y + view.height;
  return cells.filter((cell) => {
    const left = cell.x * TILE_SIZE;
    const top = cell.y * TILE_SIZE;
    return left < x2 && left + TILE_SIZE > x1 && top < y2 && top + TILE_SIZE > y1;
  });
}
