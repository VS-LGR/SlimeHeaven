import type { GridPosition } from "@/src/world/GridPosition";
import type { ResourceType } from "../resources";

export interface ResourceNode {
  id: string;
  type: ResourceType;
  tile: GridPosition;
  workTile: GridPosition;
}
