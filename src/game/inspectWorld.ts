import type { Grid } from "@/src/world/Grid";
import { OBJECT_DEFS, TileType } from "@/src/world/tileTypes";
import type { GameState } from "@/src/simulation/GameState";
import { farmNodeId } from "@/src/simulation/entities/FarmPlot";
import { cropById } from "@/src/simulation/data/crops";
import { farmGrowthPercent } from "@/src/simulation/systems/FarmSystem";
import { cropGrowthProgress, plotCropStageNumber } from "@/src/game/render/farming/cropPresentation";
import { buildingById, entranceTile } from "@/src/simulation/data/buildings";
import { residentHomeStatus } from "@/src/simulation/residentHomes";
import { constructionProgress } from "@/src/simulation/entities/ConstructionSite";
import { isConstructionTask } from "@/src/simulation/entities/Task";
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
  const placed = state.buildingAt(x, y);
  const site = state.constructionSiteAt(x, y);
  const buildingDef = placed ? buildingById(placed.typeId) : undefined;
  const buildingEntrance = placed && buildingDef
    ? entranceTile({ x: placed.tileX, y: placed.tileY }, buildingDef)
    : null;
  const siteDef = site ? buildingById(site.buildingTypeId) : undefined;
  const siteEntrance = site && siteDef
    ? entranceTile({ x: site.tileX, y: site.tileY }, siteDef)
    : null;
  const constructionTask = site
    ? state.activeTasks().find(
        (task) =>
          isConstructionTask(task.type) &&
          (task.constructionSiteId === site.id || task.nodeId === site.id),
      )
    : undefined;
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
    buildingId: placed?.id ?? null,
    buildingType: placed?.typeId ?? null,
    buildingFootprintOrigin: placed ? `${placed.tileX},${placed.tileY}` : null,
    buildingFootprint: buildingDef
      ? `${buildingDef.footprint.width}x${buildingDef.footprint.height}`
      : null,
    buildingEntranceTile: buildingEntrance ? `${buildingEntrance.x},${buildingEntrance.y}` : null,
    residentTypeId: buildingDef?.residentHome?.residentTypeId ?? null,
    uniqueHome: buildingDef?.residentHome?.unique ?? null,
    startingHome: buildingDef?.residentHome?.startingHome ?? null,
    homeStatus: buildingDef?.residentHome
      ? residentHomeStatus(state, buildingDef.residentHome.residentTypeId)
      : null,
    constructionSiteId: site?.id ?? null,
    constructionBuildingType: site?.buildingTypeId ?? null,
    constructionStatus: site?.status ?? null,
    constructionWorkCompletedMs: site ? Math.round(site.workCompletedMs) : null,
    constructionWorkRequiredMs: site?.workRequiredMs ?? null,
    constructionProgressPercent: site ? Math.round(constructionProgress(site) * 100) : null,
    constructionAssignedSlimeId: site?.assignedSlimeId ?? null,
    constructionTaskId: constructionTask?.id ?? null,
    constructionFootprintOrigin: site ? `${site.tileX},${site.tileY}` : null,
    constructionEntranceTile: siteEntrance ? `${siteEntrance.x},${siteEntrance.y}` : null,
  };
}
