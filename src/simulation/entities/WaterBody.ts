import type { GridPosition } from "@/src/world/GridPosition";
import type { WaterDepth } from "../data/fish";

export type WaterBodyType = "pond" | "lake" | "river" | "ocean";
export type CastDirection = "north" | "south" | "east" | "west";

export interface WaterBody {
  id: string;
  type: WaterBodyType;
  tiles: GridPosition[];
  shallowTiles: GridPosition[];
  deepTiles: GridPosition[];
}

export interface FishingAccessPoint {
  id: string;
  waterBodyId: string;
  landTile: GridPosition;
  waterTile: GridPosition;
  castDirection: CastDirection;
  reachableDepths: WaterDepth[];
  enabled: boolean;
  reservedBy: string | null;
}

/**
 * Future piers/buildings may modify a water body or radius.
 * They must not create the WaterBody itself.
 */
export interface FishingModifierSource {
  id: string;
  waterBodyId: string;
}
