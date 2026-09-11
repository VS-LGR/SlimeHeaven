import type { Grid } from "./Grid";
import type { GridPosition } from "./GridPosition";

/**
 * Chop/pickaxe art is west of the body. Prefer the east neighbor so the slime
 * faces west into the object. Wood uses the south 2×2 row (trunk), not the
 * canopy. Stone uses the rock cell itself.
 */
const WOOD_STANCE_OFFSETS: ReadonlyArray<GridPosition> = [
  { x: 2, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: 2 },
  { x: 0, y: 2 },
  { x: 2, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: -1 },
];

const STONE_STANCE_OFFSETS: ReadonlyArray<GridPosition> = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function firstWalkableOffset(
  grid: Grid,
  origin: GridPosition,
  offsets: ReadonlyArray<GridPosition>,
): GridPosition | undefined {
  for (const offset of offsets) {
    const x = origin.x + offset.x;
    const y = origin.y + offset.y;
    if (grid.isWalkable(x, y)) {
      return { x, y };
    }
  }
  return undefined;
}

export function woodGatherWorkTile(grid: Grid, origin: GridPosition): GridPosition | undefined {
  return firstWalkableOffset(grid, origin, WOOD_STANCE_OFFSETS);
}

export function stoneGatherWorkTile(grid: Grid, origin: GridPosition): GridPosition | undefined {
  return firstWalkableOffset(grid, origin, STONE_STANCE_OFFSETS);
}
