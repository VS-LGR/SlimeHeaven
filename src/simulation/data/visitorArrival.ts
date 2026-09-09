import type { GridPosition } from "@/src/world/GridPosition";
import { TileType } from "@/src/world/tileTypes";
import { buildingById, entranceTile } from "./buildings";
import type { GameState } from "../GameState";

/**
 * Compact public visitor area. Reusable for future visitor types.
 * Not Lily-specific. Not renderer-owned.
 */
export interface VisitorArrivalDefinition {
  arrivalTile: GridPosition;
  wanderTiles: readonly GridPosition[];
}

export const VISITOR_ARRIVAL: VisitorArrivalDefinition = {
  arrivalTile: { x: 7, y: 7 },
  wanderTiles: [
    { x: 6, y: 7 },
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 6, y: 8 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 9, y: 7 },
  ],
};

export function isValidVisitorTile(state: GameState, tile: GridPosition): boolean {
  if (!state.grid.inBounds(tile.x, tile.y)) {
    return false;
  }
  if (!state.grid.isWalkable(tile.x, tile.y)) {
    return false;
  }
  const cell = state.grid.getTile(tile.x, tile.y);
  if (!cell || cell.terrain === TileType.WATER) {
    return false;
  }
  if (state.buildingAt(tile.x, tile.y)) {
    return false;
  }
  if (state.constructionSiteAt(tile.x, tile.y)) {
    return false;
  }
  if (state.farmAt(tile.x, tile.y)) {
    return false;
  }
  if (state.nodeAtTile(tile.x, tile.y)) {
    return false;
  }
  if (tile.x === state.storage.x && tile.y === state.storage.y) {
    return false;
  }
  for (const building of Object.values(state.buildings)) {
    const def = buildingById(building.typeId);
    const entrance = entranceTile({ x: building.tileX, y: building.tileY }, def);
    if (entrance.x === tile.x && entrance.y === tile.y) {
      return false;
    }
  }
  for (const site of Object.values(state.constructionSites)) {
    if (site.status === "completed" || site.status === "cancelled") {
      continue;
    }
    const def = buildingById(site.buildingTypeId);
    const entrance = entranceTile({ x: site.tileX, y: site.tileY }, def);
    if (entrance.x === tile.x && entrance.y === tile.y) {
      return false;
    }
  }
  return true;
}

export function visitorWanderTiles(state: GameState): GridPosition[] {
  return VISITOR_ARRIVAL.wanderTiles.filter((tile) => isValidVisitorTile(state, tile));
}
