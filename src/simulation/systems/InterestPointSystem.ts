import type { GameState } from "../GameState";
import type { GridPosition } from "@/src/world/GridPosition";
import { DetailType, ObjectType } from "@/src/world/tileTypes";
import { cardinalNeighbors } from "@/src/world/pathfinding";
import type { InterestPoint, InterestTag } from "../entities/InterestPoint";

export function rebuildInterestPoints(state: GameState): void {
  const previous = new Map(state.interestPoints.map((point) => [point.id, point.reservedBy]));
  const next: InterestPoint[] = [];

  for (const access of state.fishingAccessPoints) {
    if (!access.enabled) {
      continue;
    }
    next.push({
      id: `water:${access.id}`,
      type: "water_edge",
      tile: { ...access.landTile },
      tags: ["water_edge"],
      sourceId: access.id,
      reservedBy: null,
    });
  }

  for (const plot of Object.values(state.farms)) {
    next.push({
      id: `farm:${plot.tile.x},${plot.tile.y}`,
      type: "farm",
      tile: { ...plot.tile },
      tags: ["farm"],
      sourceId: `farm:${plot.tile.x},${plot.tile.y}`,
      reservedBy: null,
    });
  }

  for (const object of state.grid.objects) {
    if (object.type === ObjectType.TREE || object.type === ObjectType.PINE_TREE) {
      next.push({
        id: `tree:${object.x},${object.y}`,
        type: "tree",
        tile: { x: object.x, y: object.y },
        tags: ["tree", "nature"],
        sourceId: `obj:${object.x},${object.y}`,
        reservedBy: null,
      });
    }
    if (object.type === ObjectType.ROCK) {
      next.push({
        id: `rock:${object.x},${object.y}`,
        type: "rock",
        tile: { x: object.x, y: object.y },
        tags: ["rock", "nature"],
        sourceId: `obj:${object.x},${object.y}`,
        reservedBy: null,
      });
    }
  }

  for (let y = 0; y < state.grid.height; y += 1) {
    for (let x = 0; x < state.grid.width; x += 1) {
      const tile = state.grid.getTile(x, y);
      if (tile?.detail === DetailType.GRASS_FLOWER) {
        next.push({
          id: `flower:${x},${y}`,
          type: "flower",
          tile: { x, y },
          tags: ["flower", "nature"],
          sourceId: `detail:${x},${y}`,
          reservedBy: null,
        });
      }
    }
  }

  next.push({
    id: "storage",
    type: "storage",
    tile: { ...state.storage },
    tags: ["storage"],
    sourceId: "storage",
    reservedBy: null,
  });

  for (const point of next) {
    const owner = previous.get(point.id);
    if (owner && state.slimes[owner]) {
      point.reservedBy = owner;
    }
  }

  state.interestPoints = next;
  const byTag: Record<string, string[]> = {};
  for (const point of next) {
    for (const tag of point.tags) {
      if (!byTag[tag]) {
        byTag[tag] = [];
      }
      byTag[tag].push(point.id);
    }
  }
  state.interestPointsByTag = byTag as Record<InterestTag, string[]>;
}

export function interestPointById(state: GameState, id: string | undefined | null): InterestPoint | undefined {
  if (!id) {
    return undefined;
  }
  return state.interestPoints.find((point) => point.id === id);
}

export function releaseInterestReservation(state: GameState, slimeId: string): void {
  for (const point of state.interestPoints) {
    if (point.reservedBy === slimeId) {
      point.reservedBy = null;
    }
  }
}

export function isFishingReservedLand(state: GameState, tile: GridPosition): boolean {
  return state.fishingAccessPoints.some(
    (point) => point.reservedBy && point.landTile.x === tile.x && point.landTile.y === tile.y,
  );
}

export function standTileFor(state: GameState, point: InterestPoint): GridPosition | null {
  if (state.grid.isWalkable(point.tile.x, point.tile.y) && !isFishingReservedLand(state, point.tile)) {
    return { ...point.tile };
  }
  for (const neighbor of cardinalNeighbors(point.tile.x, point.tile.y)) {
    if (state.grid.isWalkable(neighbor.x, neighbor.y) && !isFishingReservedLand(state, neighbor)) {
      return neighbor;
    }
  }
  return null;
}

export function chebyshev(a: GridPosition, b: GridPosition): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}
