import type { GridPosition } from "@/src/world/GridPosition";
import type { BuildingTypeId } from "./buildings";
import type { ResidentTypeId } from "./residents";

export interface StartingHomeSpec {
  residentTypeId: ResidentTypeId;
  buildingTypeId: BuildingTypeId;
  origin: GridPosition;
  buildingId: string;
}

/**
 * Authored starting village cluster, north of storage and west of the lake.
 * Footprint 2×2; south entrance is origin + (0, 2).
 */
export const STARTING_HOMES: readonly StartingHomeSpec[] = [
  {
    residentTypeId: "pingo",
    buildingTypeId: "small_blue_house",
    origin: { x: 5, y: 4 },
    buildingId: "home_pingo",
  },
  {
    residentTypeId: "momo",
    buildingTypeId: "green_house",
    origin: { x: 8, y: 4 },
    buildingId: "home_momo",
  },
  {
    residentTypeId: "tito",
    buildingTypeId: "brown_house",
    origin: { x: 11, y: 4 },
    buildingId: "home_tito",
  },
] as const;
