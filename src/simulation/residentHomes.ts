import type { GameState } from "./GameState";
import { BUILDINGS, type BuildingDefinition, type BuildingTypeId } from "./data/buildings";
import type { ResidentTypeId } from "./data/residents";
import type { PlacedBuilding } from "./entities/PlacedBuilding";
import type { ConstructionSite } from "./entities/ConstructionSite";

export type ResidentHomeStatus =
  | "not_defined"
  | "locked"
  | "available"
  | "under_construction"
  | "completed";

export function homeDefinitionForResident(residentTypeId: ResidentTypeId): BuildingDefinition | undefined {
  return Object.values(BUILDINGS).find((def) => def.residentHome?.residentTypeId === residentTypeId);
}

export function placedHomeForResident(
  state: GameState,
  residentTypeId: ResidentTypeId,
): PlacedBuilding | undefined {
  const def = homeDefinitionForResident(residentTypeId);
  if (!def) {
    return undefined;
  }
  return Object.values(state.buildings).find((building) => building.typeId === def.id);
}

export function constructionSiteForResident(
  state: GameState,
  residentTypeId: ResidentTypeId,
): ConstructionSite | undefined {
  const def = homeDefinitionForResident(residentTypeId);
  if (!def) {
    return undefined;
  }
  return Object.values(state.constructionSites).find(
    (site) =>
      site.buildingTypeId === def.id && site.status !== "completed" && site.status !== "cancelled",
  );
}

export function residentHomeStatus(state: GameState, residentTypeId: ResidentTypeId): ResidentHomeStatus {
  const def = homeDefinitionForResident(residentTypeId);
  if (!def?.residentHome) {
    return "not_defined";
  }
  if (placedHomeForResident(state, residentTypeId)) {
    return "completed";
  }
  if (constructionSiteForResident(state, residentTypeId)) {
    return "under_construction";
  }
  if (!def.residentHome.recipeUnlocked) {
    return "locked";
  }
  return "available";
}

export function playerBuildableBuildingTypes(state: GameState): BuildingTypeId[] {
  return Object.values(BUILDINGS)
    .filter((def) => {
      if (!def.enabled) {
        return false;
      }
      if (!def.residentHome) {
        return true;
      }
      return residentHomeStatus(state, def.residentHome.residentTypeId) === "available";
    })
    .map((def) => def.id);
}
