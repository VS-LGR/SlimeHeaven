import type { ClueType, FishId, WaterDepth } from "../data/fish";

export type AquaticActivityState = "active" | "reserved" | "consumed";

export interface AquaticActivity {
  id: string;
  speciesId: FishId;
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
  waterBodyId: string;
  depth: WaterDepth;
  clueType: ClueType;
  state: AquaticActivityState;
  ownerSessionId: string | null;
  expiresAtTick: number;
  clueVisible: boolean;
  nextClueToggleTick: number;
}

export interface FishingWaterSpot {
  tileX: number;
  tileY: number;
  worldX: number;
  worldY: number;
  waterBodyId: string;
  depth: WaterDepth;
}
