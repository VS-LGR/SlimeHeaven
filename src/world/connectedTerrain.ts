import { TileType } from "./tileTypes";

/** 4-directional neighbor mask: N=1 E=2 S=4 W=8 */
export const DIR_N = 1;
export const DIR_E = 2;
export const DIR_S = 4;
export const DIR_W = 8;

export type BlobCell = "center" | "n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw";

const HIGH_GRASS_FRAMES: Record<BlobCell, number> = {
  nw: 10,
  n: 11,
  ne: 12,
  w: 18,
  center: 19,
  e: 20,
  sw: 26,
  s: 27,
  se: 28,
};

const SANDY_SOIL_FRAMES: Record<BlobCell, number> = {
  nw: 13,
  n: 14,
  ne: 15,
  w: 21,
  center: 22,
  e: 23,
  sw: 29,
  s: 30,
  se: 31,
};

/**
 * Incomplete masks (isolated, opposite edges) fall back to center or nearest edge.
 * Single-side neighbors map to the opposite edge cell (a 1-tile protrusion).
 */
const MASK_TO_CELL: readonly BlobCell[] = [
  "center", // 0 isolated
  "s", // 1 N only
  "w", // 2 E only
  "sw", // 3 N+E
  "n", // 4 S only
  "center", // 5 N+S opposite
  "nw", // 6 E+S
  "w", // 7 N+E+S (missing W)
  "e", // 8 W only
  "se", // 9 N+W
  "center", // 10 E+W opposite
  "s", // 11 N+E+W (missing S)
  "ne", // 12 S+W
  "e", // 13 N+S+W (missing E)
  "n", // 14 E+S+W (missing N)
  "center", // 15 all four
];

export function neighborMask(isSame: (dx: number, dy: number) => boolean): number {
  let mask = 0;
  if (isSame(0, -1)) {
    mask |= DIR_N;
  }
  if (isSame(1, 0)) {
    mask |= DIR_E;
  }
  if (isSame(0, 1)) {
    mask |= DIR_S;
  }
  if (isSame(-1, 0)) {
    mask |= DIR_W;
  }
  return mask;
}

export function blobCellForMask(mask: number): BlobCell {
  return MASK_TO_CELL[mask] ?? "center";
}

export function connectedTerrainFrame(terrain: TileType, mask: number): number {
  const cell = blobCellForMask(mask);
  if (terrain === TileType.HIGH_GRASS) {
    return HIGH_GRASS_FRAMES[cell];
  }
  if (terrain === TileType.SANDY_SOIL) {
    return SANDY_SOIL_FRAMES[cell];
  }
  throw new Error(`No connected-terrain frames for ${terrain}`);
}
