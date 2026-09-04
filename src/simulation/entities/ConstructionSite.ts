import type { BuildingTypeId } from "../data/buildings";

export type ConstructionSiteStatus = "awaiting_builder" | "building" | "completed" | "cancelled";

export interface ConstructionSite {
  id: string;
  buildingTypeId: BuildingTypeId;
  tileX: number;
  tileY: number;
  workRequiredMs: number;
  workCompletedMs: number;
  status: ConstructionSiteStatus;
  assignedSlimeId?: string;
  createdAtTick?: number;
  refunded: boolean;
}

export function constructionProgress(site: ConstructionSite): number {
  if (site.workRequiredMs <= 0) {
    return 1;
  }
  return Math.max(0, Math.min(1, site.workCompletedMs / site.workRequiredMs));
}
