import type { GridPosition } from "@/src/world/GridPosition";
import type { ResourceType } from "../resources";

export interface ResourceNode {
  id: string;
  type: ResourceType;
  tile: GridPosition;
  workTile: GridPosition;
  /** Shared reservation key so chop and foliage cannot occupy the same tree. */
  occupancyKey: string;
  /** Authoritative world-time minute when foliage is available again. 0 = ready. */
  foliageReadyAtMinute?: number;
  /** Authoritative world-time minute when a water-body shell inspect is available again. 0 = ready. */
  shellReadyAtMinute?: number;
  /** Copper/coral targets become true at successful work commit. */
  depleted?: boolean;
}

export function treeOccupancyKey(x: number, y: number): string {
  return `tree_${x}_${y}`;
}

export function rockOccupancyKey(x: number, y: number): string {
  return `rock_${x}_${y}`;
}

export function copperOccupancyKey(x: number, y: number): string {
  return `copper_${x}_${y}`;
}

export function foliageNodeId(x: number, y: number): string {
  return `foliage_${x}_${y}`;
}

export function woodNodeId(x: number, y: number): string {
  return `wood_${x}_${y}`;
}

export function stoneNodeId(x: number, y: number): string {
  return `stone_${x}_${y}`;
}

export function copperNodeId(x: number, y: number): string {
  return `copper_${x}_${y}`;
}

export function shellOccupancyKey(waterBodyId: string): string {
  return `shell_${waterBodyId}`;
}

export function shellNodeId(waterBodyId: string): string {
  return `shell_${waterBodyId}`;
}

export function coralOccupancyKey(x: number, y: number): string {
  return `coral_${x}_${y}`;
}

export function coralNodeId(x: number, y: number): string {
  return `coral_${x}_${y}`;
}
