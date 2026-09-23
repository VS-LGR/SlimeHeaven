import type { Grid } from "@/src/world/Grid";
import { isAquaticDetail, ObjectType, OBJECT_DEFS, resolveCoralVariant, TileType } from "@/src/world/tileTypes";
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
import {
  inspectCoralTarget,
  inspectFoliageTarget,
  inspectMiningTarget,
  inspectShoreTarget,
} from "@/src/simulation/systems/JobSystem";
import { formatCargo, RESOURCE_IDS } from "@/src/simulation/resources";
import { dayNumberFromTotal, formatClock, minuteOfDayFromTotal } from "@/src/simulation/worldTime";
import { timeOfDayFromMinutes } from "@/src/simulation/timeConfig";
import { isAquaticForageTask } from "@/src/simulation/entities/Task";
import { accessPointById, resolveShoreWaterBodyId } from "@/src/simulation/waterBodies";

export function foliageDebugLine(state: GameState, x: number, y: number): string | null {
  const inspected = inspectFoliageTarget(state, { x, y });
  if (!inspected) {
    return null;
  }
  if (inspected.reason === "ready") {
    return "Foliage: ready";
  }
  if (inspected.reason === "reserved") {
    return "Foliage: reserved";
  }
  const readyAt = inspected.node.foliageReadyAtMinute ?? 0;
  const { hour, minute } = timeOfDayFromMinutes(minuteOfDayFromTotal(readyAt));
  return `Foliage: regen until ${formatClock(hour, minute)} D${dayNumberFromTotal(readyAt)}`;
}

export function copperDebugLine(state: GameState, x: number, y: number): string | null {
  const node = state.nodesAtTile(x, y).find((entry) => entry.type === RESOURCE_IDS.COPPER_ORE);
  if (!node) {
    return null;
  }
  if (node.depleted) {
    return "Copper: depleted";
  }
  const reserved = inspectMiningTarget(state, { x, y });
  const task = state
    .activeTasks()
    .find((entry) => state.nodeById(entry.nodeId)?.occupancyKey === node.occupancyKey);
  if (reserved && !reserved.valid) {
    return `Copper: present reserved ${task?.type ?? "job"}`;
  }
  return "Copper: present";
}

export function shoreDebugLine(state: GameState, x: number, y: number): string | null {
  const inspected = inspectShoreTarget(state, { x, y });
  if (!inspected) {
    return null;
  }
  const bodyId = resolveShoreWaterBodyId(state.waterBodies, { x, y }) ?? "?";
  const access = inspected.valid
    ? state.fishingAccessPoints.find(
        (point) =>
          point.waterBodyId === bodyId &&
          point.enabled &&
          point.reservedBy === null,
      )
    : state.fishingAccessPoints.find(
        (point) =>
          point.waterBodyId === bodyId && point.reservedBy !== null,
      );
  const reservedBy = access?.reservedBy ?? "none";
  const accessId = access?.id ?? "none";
  if (inspected.reason === "ready") {
    return `Shore: ready body=${bodyId} AP=${accessId} reservedBy=${reservedBy}`;
  }
  if (inspected.reason === "reserved") {
    return `Shore: reserved body=${bodyId} AP=${accessId} reservedBy=${reservedBy}`;
  }
  if (inspected.reason === "unreachable") {
    return `Shore: unreachable body=${bodyId} AP=${accessId} reservedBy=${reservedBy}`;
  }
  const readyAt = inspected.node.shellReadyAtMinute ?? 0;
  const { hour, minute } = timeOfDayFromMinutes(minuteOfDayFromTotal(readyAt));
  return `Shore: regen until ${formatClock(hour, minute)} D${dayNumberFromTotal(readyAt)} body=${bodyId} AP=${accessId}`;
}

export function coralDebugLine(state: GameState, x: number, y: number): string | null {
  const inspected = inspectCoralTarget(state, { x, y });
  if (!inspected) {
    return null;
  }
  const object = state.grid.objectAt(x, y);
  const variant =
    object?.type === ObjectType.CORAL ? resolveCoralVariant(object.variant) : resolveCoralVariant(undefined);
  const fishingSpot = state.fishingSpots.some((spot) => spot.tileX === x && spot.tileY === y);
  const water = state.grid.getTile(x, y)?.terrain === TileType.WATER;
  const overlap = `fishingSpot=${fishingSpot ? "yes" : "no"} water=${water ? "yes" : "INVALID"}`;
  const task = state
    .activeTasks()
    .find((entry) => state.nodeById(entry.nodeId)?.occupancyKey === inspected.node.occupancyKey);
  const access = task?.accessPointId
    ? accessPointById(state.fishingAccessPoints, task.accessPointId)
    : undefined;
  const reservation = access?.reservedBy ?? task?.id ?? "none";
  if (inspected.reason === "depleted") {
    return `Coral: depleted variant=${variant} collectable ${overlap}`;
  }
  if (inspected.reason === "reserved") {
    return `Coral: present reserved variant=${variant} collectable ${task?.type ?? "job"} AP=${access?.id ?? "none"} reservedBy=${reservation} ${overlap}`;
  }
  if (inspected.reason === "unreachable") {
    return `Coral: unreachable variant=${variant} collectable AP=${access?.id ?? "none"} reservedBy=${reservation} ${overlap}`;
  }
  return `Coral: present variant=${variant} collectable AP=${access?.id ?? "none"} reservedBy=${reservation} ${overlap}`;
}

export function aquaticDetailDebugLine(state: GameState, x: number, y: number): string | null {
  const tile = state.grid.getTile(x, y);
  if (!tile || !isAquaticDetail(tile.detail)) {
    return null;
  }
  const fishingSpot = state.fishingSpots.some((spot) => spot.tileX === x && spot.tileY === y);
  const water = tile.terrain === TileType.WATER;
  return `Aquatic: decorative ${tile.detail} stock=none collect=no walkable=${String(tile.walkable)} reservedAP=none fishingSpot=${fishingSpot ? "yes" : "no"} water=${water ? "yes" : "INVALID"}`;
}

export function aquaticJobDebugLine(state: GameState): string | null {
  const lines = state.activeTasks()
    .filter((task) => isAquaticForageTask(task.type))
    .map((task) => {
      const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
      const cargo = slime ? formatCargo(slime.carriedResource) : "Nothing";
      return `${task.type} ${task.state} AP=${task.accessPointId ?? "none"} cargo=${cargo}`;
    });
  return lines.length > 0 ? lines.join(" | ") : null;
}

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
      ? `${object.type}${object.variant ? `:${object.variant}` : ""} ${def.footprintWidth}×${def.footprintHeight}${tile.walkable ? "" : " blocking"}`
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
