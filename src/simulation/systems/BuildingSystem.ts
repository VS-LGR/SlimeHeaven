import { findPath } from "@/src/world/pathfinding";
import type { Grid } from "@/src/world/Grid";
import type { GridPosition } from "@/src/world/GridPosition";
import { positionsEqual } from "@/src/world/GridPosition";
import { TileType } from "@/src/world/tileTypes";
import { BASE_CONSTRUCTION_WORK_MS, STORAGE_TILE } from "../constants";
import type { GameState } from "../GameState";
import {
  buildingById,
  entranceTile,
  footprintTiles,
  type BuildingTypeId,
} from "../data/buildings";
import type { PlacedBuilding } from "../entities/PlacedBuilding";
import type { ConstructionSite } from "../entities/ConstructionSite";
import { cancelTask, createConstructTask, releaseSlime } from "./JobSystem";
import { isConstructionTask } from "../entities/Task";
import { constructionSiteForResident, placedHomeForResident } from "../residentHomes";
import { STARTING_HOMES } from "../data/startingHomes";

export type BuildingPlacementReason =
  | "out_of_bounds"
  | "not_buildable"
  | "water"
  | "storage"
  | "object"
  | "resource_node"
  | "building"
  | "construction_site"
  | "farm"
  | "fishing_access"
  | "entrance_out_of_bounds"
  | "entrance_occupied"
  | "entrance_blocked"
  | "entrance_unreachable"
  | "insufficient_wood"
  | "insufficient_stone"
  | "unique_home_completed"
  | "unique_home_site";

export interface BuildingPlacementEvaluation {
  valid: boolean;
  reasons: BuildingPlacementReason[];
  typeId: BuildingTypeId;
  origin: GridPosition;
  footprint: GridPosition[];
  entrance: GridPosition;
  cost: { wood: number; stone: number };
  affordable: boolean;
}

function uniqueReasons(reasons: BuildingPlacementReason[]): BuildingPlacementReason[] {
  return [...new Set(reasons)];
}

function isStorageTile(x: number, y: number): boolean {
  return x === STORAGE_TILE.x && y === STORAGE_TILE.y;
}

function isFishingAccessLand(state: GameState, x: number, y: number): boolean {
  return state.fishingAccessPoints.some(
    (point) => point.landTile.x === x && point.landTile.y === y,
  );
}

function tileOccupied(state: GameState, x: number, y: number, ignoreBuildingId?: string): boolean {
  if (isStorageTile(x, y)) {
    return true;
  }
  if (state.grid.objectAt(x, y)) {
    return true;
  }
  if (state.nodeAtTile(x, y)) {
    return true;
  }
  const building = state.buildingAt(x, y);
  if (building && building.id !== ignoreBuildingId) {
    return true;
  }
  if (state.constructionSiteAt(x, y)) {
    return true;
  }
  if (state.farmAt(x, y)) {
    return true;
  }
  return false;
}

function collectFootprintReasons(state: GameState, tile: GridPosition): BuildingPlacementReason[] {
  const reasons: BuildingPlacementReason[] = [];
  if (!state.grid.inBounds(tile.x, tile.y)) {
    reasons.push("out_of_bounds");
    return reasons;
  }
  const cell = state.grid.getTile(tile.x, tile.y);
  if (!cell) {
    reasons.push("out_of_bounds");
    return reasons;
  }
  if (cell.terrain === TileType.WATER) {
    reasons.push("water");
  } else if (
    !cell.buildable &&
    !state.grid.objectAt(tile.x, tile.y) &&
    !state.buildingAt(tile.x, tile.y) &&
    !state.constructionSiteAt(tile.x, tile.y)
  ) {
    reasons.push("not_buildable");
  }
  if (isStorageTile(tile.x, tile.y)) {
    reasons.push("storage");
  }
  if (state.grid.objectAt(tile.x, tile.y)) {
    reasons.push("object");
  }
  if (state.nodeAtTile(tile.x, tile.y)) {
    reasons.push("resource_node");
  }
  if (state.buildingAt(tile.x, tile.y)) {
    reasons.push("building");
  }
  if (state.constructionSiteAt(tile.x, tile.y)) {
    reasons.push("construction_site");
  }
  if (state.farmAt(tile.x, tile.y)) {
    reasons.push("farm");
  }
  if (isFishingAccessLand(state, tile.x, tile.y)) {
    reasons.push("fishing_access");
  }
  return reasons;
}

function withFootprintBlocked<T>(grid: Grid, tiles: GridPosition[], fn: () => T): T {
  const snapshots = tiles
    .map((tile) => grid.captureOccupancy(tile.x, tile.y))
    .filter((snapshot): snapshot is NonNullable<typeof snapshot> => Boolean(snapshot));
  for (const tile of tiles) {
    grid.blockTile(tile.x, tile.y);
  }
  try {
    return fn();
  } finally {
    for (const snapshot of snapshots) {
      grid.restoreOccupancy(snapshot);
    }
  }
}

function collectCostReasons(state: GameState, typeId: BuildingTypeId): BuildingPlacementReason[] {
  const cost = buildingById(typeId).cost;
  const reasons: BuildingPlacementReason[] = [];
  if (state.resources.wood < cost.wood) {
    reasons.push("insufficient_wood");
  }
  if (state.resources.stone < cost.stone) {
    reasons.push("insufficient_stone");
  }
  return reasons;
}

function collectUniqueHomeReasons(state: GameState, typeId: BuildingTypeId): BuildingPlacementReason[] {
  const home = buildingById(typeId).residentHome;
  if (!home?.unique) {
    return [];
  }
  const reasons: BuildingPlacementReason[] = [];
  if (placedHomeForResident(state, home.residentTypeId)) {
    reasons.push("unique_home_completed");
  }
  if (constructionSiteForResident(state, home.residentTypeId)) {
    reasons.push("unique_home_site");
  }
  return reasons;
}

export interface PlacementEvalOptions {
  ignoreCost?: boolean;
}

export function evaluateBuildingPlacement(
  state: GameState,
  typeId: BuildingTypeId,
  origin: GridPosition,
  options: PlacementEvalOptions = {},
): BuildingPlacementEvaluation {
  const def = buildingById(typeId);
  const footprint = footprintTiles(origin, def);
  const entrance = entranceTile(origin, def);
  const reasons: BuildingPlacementReason[] = [];

  for (const tile of footprint) {
    reasons.push(...collectFootprintReasons(state, tile));
  }

  if (!state.grid.inBounds(entrance.x, entrance.y)) {
    reasons.push("entrance_out_of_bounds");
  } else if (footprint.some((tile) => positionsEqual(tile, entrance))) {
    reasons.push("entrance_blocked");
  } else {
    if (tileOccupied(state, entrance.x, entrance.y)) {
      reasons.push("entrance_occupied");
    }
    const inBoundsFootprint = footprint.filter((tile) => state.grid.inBounds(tile.x, tile.y));
    const entranceIssues = withFootprintBlocked(state.grid, inBoundsFootprint, () => {
      const blocked: BuildingPlacementReason[] = [];
      if (!state.grid.isWalkable(entrance.x, entrance.y)) {
        blocked.push("entrance_blocked");
      }
      const path = findPath(state.grid, state.storage, entrance);
      if (path === null) {
        blocked.push("entrance_unreachable");
      }
      return blocked;
    });
    reasons.push(...entranceIssues);
  }

  if (!options.ignoreCost) {
    reasons.push(...collectCostReasons(state, typeId));
  }
  reasons.push(...collectUniqueHomeReasons(state, typeId));

  const unique = uniqueReasons(reasons);
  const affordable = !unique.includes("insufficient_wood") && !unique.includes("insufficient_stone");
  return {
    valid: unique.length === 0,
    reasons: unique,
    typeId,
    origin: { x: origin.x, y: origin.y },
    footprint,
    entrance,
    cost: { wood: def.cost.wood, stone: def.cost.stone },
    affordable,
  };
}

function refreshFootprint(state: GameState, tiles: GridPosition[]): void {
  for (const tile of tiles) {
    state.refreshTileBlocking(tile.x, tile.y);
  }
}

function activeConstructionTask(state: GameState, siteId: string) {
  return state.activeTasks().find(
    (task) =>
      isConstructionTask(task.type) && (task.constructionSiteId === siteId || task.nodeId === siteId),
  );
}

function closeConstructionTask(state: GameState, site: ConstructionSite, recreate: boolean): void {
  const task = activeConstructionTask(state, site.id);
  if (!task) {
    return;
  }
  const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
  cancelTask(state, task, slime, `Construction task ${task.id} closed.`, { recreateConstruction: recreate });
}

function consumeConstructionCost(state: GameState, typeId: BuildingTypeId): boolean {
  const cost = buildingById(typeId).cost;
  if (state.resources.wood < cost.wood || state.resources.stone < cost.stone) {
    return false;
  }
  state.resources.wood -= cost.wood;
  state.resources.stone -= cost.stone;
  if (state.resources.wood < 0 || state.resources.stone < 0) {
    state.resources.wood += cost.wood;
    state.resources.stone += cost.stone;
    return false;
  }
  return true;
}

function refundConstructionCost(state: GameState, site: ConstructionSite): void {
  if (site.refunded) {
    return;
  }
  const cost = buildingById(site.buildingTypeId).cost;
  state.resources.wood += cost.wood;
  state.resources.stone += cost.stone;
  site.refunded = true;
}

export function placeConstructionSite(
  state: GameState,
  typeId: BuildingTypeId,
  origin: GridPosition,
): ConstructionSite | null {
  const evaluation = evaluateBuildingPlacement(state, typeId, origin);
  if (!evaluation.valid) {
    return null;
  }
  if (!consumeConstructionCost(state, typeId)) {
    return null;
  }

  const site: ConstructionSite = {
    id: state.nextSiteId(),
    buildingTypeId: typeId,
    tileX: origin.x,
    tileY: origin.y,
    workRequiredMs: BASE_CONSTRUCTION_WORK_MS,
    workCompletedMs: 0,
    status: "awaiting_builder",
    createdAtTick: state.tickIndex,
    refunded: false,
  };
  state.constructionSites[site.id] = site;
  for (const tile of evaluation.footprint) {
    state.grid.blockTile(tile.x, tile.y);
  }

  const task = createConstructTask(state, site);
  if (!task) {
    delete state.constructionSites[site.id];
    refreshFootprint(state, evaluation.footprint);
    refundConstructionCost(state, site);
    return null;
  }
  return site;
}

/** Confirmed placement now creates a construction site, not a completed house. */
export function placeBuilding(
  state: GameState,
  typeId: BuildingTypeId,
  origin: GridPosition,
): ConstructionSite | null {
  return placeConstructionSite(state, typeId, origin);
}

export function seedCompletedHome(
  state: GameState,
  typeId: BuildingTypeId,
  origin: GridPosition,
  buildingId: string,
): PlacedBuilding | null {
  if (state.buildings[buildingId]) {
    return state.buildings[buildingId];
  }
  const evaluation = evaluateBuildingPlacement(state, typeId, origin, { ignoreCost: true });
  if (!evaluation.valid) {
    return null;
  }
  const building: PlacedBuilding = {
    id: buildingId,
    typeId,
    tileX: origin.x,
    tileY: origin.y,
    createdAtTick: 0,
  };
  state.buildings[building.id] = building;
  for (const tile of evaluation.footprint) {
    state.grid.blockTile(tile.x, tile.y);
  }
  return building;
}

export function initializeStartingHomes(state: GameState): void {
  for (const spec of STARTING_HOMES) {
    if (placedHomeForResident(state, spec.residentTypeId) || state.buildings[spec.buildingId]) {
      continue;
    }
    const seeded = seedCompletedHome(state, spec.buildingTypeId, spec.origin, spec.buildingId);
    if (!seeded) {
      state.warnOnce(
        `starting-home-${spec.buildingId}`,
        `Failed to seed starting home ${spec.buildingId} at ${spec.origin.x},${spec.origin.y}`,
      );
    }
  }
}

export function completeConstruction(state: GameState, siteId: string): PlacedBuilding | null {
  const site = state.constructionSites[siteId];
  if (!site || site.status === "completed" || site.status === "cancelled") {
    return null;
  }
  if (site.workCompletedMs < site.workRequiredMs) {
    return null;
  }

  site.workCompletedMs = site.workRequiredMs;
  site.status = "completed";

  const task = activeConstructionTask(state, site.id);
  const slime = task?.assignedSlimeId
    ? state.slimes[task.assignedSlimeId]
    : site.assignedSlimeId
      ? state.slimes[site.assignedSlimeId]
      : undefined;
  if (task && task.state !== "completed" && task.state !== "cancelled") {
    task.state = "completed";
    task.assignedSlimeId = undefined;
  }
  if (slime) {
    slime.carriedResource = undefined;
    releaseSlime(slime);
  }

  const building: PlacedBuilding = {
    id: state.nextBuildingId(),
    typeId: site.buildingTypeId,
    tileX: site.tileX,
    tileY: site.tileY,
    createdAtTick: state.tickIndex,
  };
  state.buildings[building.id] = building;
  delete state.constructionSites[site.id];

  const def = buildingById(building.typeId);
  refreshFootprint(state, footprintTiles({ x: building.tileX, y: building.tileY }, def));
  return building;
}

export function cancelConstructionSite(state: GameState, siteId: string): boolean {
  const site = state.constructionSites[siteId];
  if (!site || site.status === "completed" || site.status === "cancelled") {
    return false;
  }
  site.status = "cancelled";
  closeConstructionTask(state, site, false);
  refundConstructionCost(state, site);
  const def = buildingById(site.buildingTypeId);
  const footprint = footprintTiles({ x: site.tileX, y: site.tileY }, def);
  delete state.constructionSites[site.id];
  refreshFootprint(state, footprint);
  return true;
}

export function cancelConstructionSitesInRect(
  state: GameState,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const x0 = Math.min(ax, bx);
  const y0 = Math.min(ay, by);
  const x1 = Math.max(ax, bx);
  const y1 = Math.max(ay, by);
  const seen = new Set<string>();
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const site = state.constructionSiteAt(x, y);
      if (!site || seen.has(site.id)) {
        continue;
      }
      seen.add(site.id);
      cancelConstructionSite(state, site.id);
    }
  }
  return seen.size;
}

export function syncBuildingPreview(
  state: GameState,
  worldTool: string,
  typeId: BuildingTypeId,
  origin: GridPosition | null,
): BuildingPlacementEvaluation | null {
  if (worldTool !== "build" || origin === null) {
    return null;
  }
  return evaluateBuildingPlacement(state, typeId, origin);
}
