import { buildWaterWorld } from "./waterBodies";
import type { Grid } from "@/src/world/Grid";
import type { GridPosition } from "@/src/world/GridPosition";
import type { FishingWaterSpot } from "./entities/AquaticActivity";
import { STORAGE_TILE } from "./constants";

/** @deprecated Prefer buildWaterWorld; kept for call sites that only need spots. */
export function buildFishingSpots(
  grid: Grid,
  pathOrigin: GridPosition = { x: STORAGE_TILE.x, y: STORAGE_TILE.y },
): FishingWaterSpot[] {
  return buildWaterWorld(grid, pathOrigin).spots;
}
