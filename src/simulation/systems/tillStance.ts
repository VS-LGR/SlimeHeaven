import type { Grid } from "@/src/world/Grid";
import type { GridPosition } from "@/src/world/GridPosition";
import type { SlimeState } from "../entities/SlimeState";

/** Stand east first so source (west-facing) hoe swings into the plot center. */
const TILL_STANCE_OFFSETS: ReadonlyArray<GridPosition> = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/**
 * Walkable tile Momo stands on to till. The hoe is authored west of the body,
 * so the east neighbor lets him hop there, face the plot, and hit its center.
 */
export function tillStanceWorkTile(grid: Grid, plot: GridPosition): GridPosition {
  for (const offset of TILL_STANCE_OFFSETS) {
    const x = plot.x + offset.x;
    const y = plot.y + offset.y;
    if (grid.isWalkable(x, y)) {
      return { x, y };
    }
  }
  return { x: plot.x, y: plot.y };
}

export function canTillRecoverHop(plot: GridPosition, stance: GridPosition): boolean {
  return stance.y === plot.y && Math.abs(stance.x - plot.x) === 1;
}

export function canPlotWorkRecoverHop(plot: GridPosition, stance: GridPosition): boolean {
  return stance.x === plot.x && stance.y === plot.y;
}

function startSameTileRecoverHop(slime: SlimeState, plot: GridPosition, stance: GridPosition): void {
  slime.tillRecoverPlot = { x: plot.x, y: plot.y };
  slime.hopFrom = { x: stance.x, y: stance.y };
  slime.hopTo = { x: stance.x, y: stance.y };
  slime.hopElapsedMs = 0;
}

/** After the strike, hop in place so presentation can walk from the hoe pose to tile feet. */
export function startTillRecoverHop(slime: SlimeState, plot: GridPosition): void {
  const stance = { x: slime.tileX, y: slime.tileY };
  if (!canTillRecoverHop(plot, stance)) {
    return;
  }
  startSameTileRecoverHop(slime, plot, stance);
}

/** After plant (or a cancelled harvest), hop from plot-center feet back to the south lip. */
export function startPlotWorkRecoverHop(slime: SlimeState, plot: GridPosition): void {
  const stance = { x: slime.tileX, y: slime.tileY };
  if (!canPlotWorkRecoverHop(plot, stance)) {
    return;
  }
  startSameTileRecoverHop(slime, plot, stance);
}
