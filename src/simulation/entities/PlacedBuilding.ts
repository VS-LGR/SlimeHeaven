import type { BuildingTypeId } from "../data/buildings";

export interface PlacedBuilding {
  id: string;
  typeId: BuildingTypeId;
  tileX: number;
  tileY: number;
  createdAtTick?: number;
}
