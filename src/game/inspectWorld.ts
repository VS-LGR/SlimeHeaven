import type { Grid } from "@/src/world/Grid";
import { OBJECT_DEFS, TileType } from "@/src/world/tileTypes";
import type { GameState } from "@/src/simulation/GameState";
import { farmNodeId } from "@/src/simulation/entities/FarmPlot";
import { cropById } from "@/src/simulation/data/crops";
import { farmGrowthPercent } from "@/src/simulation/systems/FarmSystem";
import { cropGrowthProgress, plotCropStageNumber } from "@/src/game/render/farming/cropPresentation";
import type { TileInspect } from "@/src/store/gameUiStore";
import { shoreMaskLabel } from "@/src/world/autotile/resolveShoreline";

export function inspectWorldTile(grid: Grid, state: GameState, x: number, y: number): TileInspect | null {
  const tile = grid.getTile(x, y);
  if (!tile) {
    return null;
  }
  const object = grid.objectAt(x, y);
  const def = object ? OBJECT_DEFS[object.type] : undefined;
  const plot = state.farmAt(x, y);
  const farmTask = plot
    ? state.activeTasks().find((task) => task.nodeId === farmNodeId(x, y))
    : undefined;
  const crop = plot?.cropId ? cropById(plot.cropId) : undefined;
  const water = tile.terrain === TileType.WATER;
  const isWater = (dx: number, dy: number) =>
    grid.getTile(x + dx, y + dy)?.terrain === TileType.WATER;
  const shore = grid.shoreVisualAt(x, y);
  const interior =
    water &&
    isWater(0, -1) &&
    isWater(1, 0) &&
    isWater(0, 1) &&
    isWater(-1, 0) &&
    isWater(1, -1) &&
    isWater(1, 1) &&
    isWater(-1, 1) &&
    isWater(-1, -1);
  return {
    terrain: tile.terrain,
    grassVariant: tile.grassVariant,
    detail: tile.detail,
    farming: tile.farming,
    farm: Boolean(plot),
    farmState: plot?.state ?? null,
    crop: crop?.name ?? null,
    cropId: plot?.cropId ?? null,
    soilVisual: plot?.soilVisual ?? null,
    cropStage: plot ? plotCropStageNumber(plot) : null,
    growthPercent: plot ? farmGrowthPercent(plot) : null,
    growthProgress: plot ? cropGrowthProgress(plot) : null,
    farmTask: farmTask ? farmTask.type.replaceAll("_", " ") : plot ? "None" : null,
    object: object && def
      ? `${object.type} ${def.footprintWidth}×${def.footprintHeight}${tile.walkable ? "" : " blocking"}`
      : null,
    walkable: tile.walkable,
    buildable: tile.buildable,
    shoreMask: water ? shoreMaskLabel(isWater) : null,
    shoreVisual: shore?.id ?? null,
    waterDepth: water ? (interior ? "deep" : "shallow") : null,
  };
}
