import type { GameState } from "./GameState";
import { BUILDINGS, entranceTile, footprintTiles, type BuildingDefinition, type BuildingTypeId } from "./data/buildings";
import { residentTypeIdForSlime, type ResidentTypeId } from "./data/residents";
import type { PlacedBuilding } from "./entities/PlacedBuilding";
import { constructionProgress, type ConstructionSite } from "./entities/ConstructionSite";
import type { SlimeState } from "./entities/SlimeState";

export type ResidentHomeStatus =
  | "not_defined"
  | "locked"
  | "available"
  | "under_construction"
  | "completed";

export function homeDefinitionForResident(residentTypeId: ResidentTypeId): BuildingDefinition | undefined {
  return Object.values(BUILDINGS).find((def) => def.residentHome?.residentTypeId === residentTypeId);
}

export function slimeForResidentType(state: GameState, residentTypeId: ResidentTypeId): SlimeState | undefined {
  return Object.values(state.slimes).find(
    (slime) => residentTypeIdForSlime(slime.id) === residentTypeId,
  );
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

export function isUniqueHomePlanUnlocked(state: GameState, residentTypeId: ResidentTypeId): boolean {
  const def = homeDefinitionForResident(residentTypeId);
  if (!def?.residentHome) {
    return false;
  }
  if (def.residentHome.recipeUnlocked) {
    return true;
  }
  return slimeForResidentType(state, residentTypeId)?.residencyStatus === "invited_waiting_for_house";
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
  if (!isUniqueHomePlanUnlocked(state, residentTypeId)) {
    return "locked";
  }
  return "available";
}

export function isResidentReadyForMoveIn(state: GameState, residentTypeId: ResidentTypeId): boolean {
  const slime = slimeForResidentType(state, residentTypeId);
  if (!slime || slime.residencyStatus !== "invited_waiting_for_house") {
    return false;
  }
  if (residentHomeStatus(state, residentTypeId) !== "completed") {
    return false;
  }
  const def = homeDefinitionForResident(residentTypeId);
  const home = placedHomeForResident(state, residentTypeId);
  if (!def || !home || home.typeId !== def.id) {
    return false;
  }
  if (constructionSiteForResident(state, residentTypeId)) {
    return false;
  }
  return (slime.capabilities?.length ?? 0) === 0;
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

export function uniqueHomeConstructionDebugLines(
  state: GameState,
  residentTypeId: ResidentTypeId,
): string[] {
  const def = homeDefinitionForResident(residentTypeId);
  const slime = slimeForResidentType(state, residentTypeId);
  const site = constructionSiteForResident(state, residentTypeId);
  const home = placedHomeForResident(state, residentTypeId);
  const origin = site
    ? { x: site.tileX, y: site.tileY }
    : home
      ? { x: home.tileX, y: home.tileY }
      : null;
  const entrance = def && origin ? entranceTile(origin, def) : null;
  const footprint = def && origin ? footprintTiles(origin, def) : [];
  const lines = [
    `invitationState: ${slime?.residencyStatus ?? "absent"}`,
    `housePlan: ${!def ? "none" : isUniqueHomePlanUnlocked(state, residentTypeId) ? "unlocked" : "locked"}`,
    `homeStatus: ${residentHomeStatus(state, residentTypeId)}`,
    `uniqueSiteId: ${site?.id ?? "—"}`,
    `constructionState: ${site?.status ?? (home ? "complete" : "none")}`,
    `buildingProgress: ${site ? constructionProgress(site).toFixed(2) : home ? "1.00" : "—"}`,
    `assignedBuilder: ${site?.assignedSlimeId ?? "—"}`,
    `footprint: ${footprint.length > 0 ? footprint.map((tile) => `${tile.x},${tile.y}`).join(" ") : "—"}`,
    `entrance: ${entrance ? `${entrance.x},${entrance.y}` : "—"}`,
    `workPosition: ${entrance ? `${entrance.x},${entrance.y}` : "—"}`,
    `lilyHomeAssociation: ${home?.id ?? "—"}`,
    `readyForMoveIn: ${isResidentReadyForMoveIn(state, residentTypeId)}`,
    `moveInCompleted: ${slime?.residencyStatus === "resident"}`,
    `workParticipation: ${slime ? String(slime.participatesInWork) : "—"}`,
    `capabilities: ${slime && slime.capabilities.length > 0 ? slime.capabilities.join(",") : "[]"}`,
  ];
  if (home && constructionSiteForResident(state, residentTypeId)) {
    lines.push("invalidState: duplicate_lily_plan");
  }
  return lines;
}
