import type { GridPosition } from "@/src/world/GridPosition";
import type { FishId } from "../data/fish";

export type FishingOpportunityState =
  | "available"
  | "assigned"
  | "slime_traveling"
  | "fishing"
  | "bite"
  | "player_interaction"
  | "caught"
  | "escaped"
  | "expired";

export interface FishingOpportunity {
  id: string;
  activityId: string;
  speciesId: FishId;
  waterBodyId: string;
  activityPosition: GridPosition;
  validAccessPointIds: string[];
  state: FishingOpportunityState;
  assignedSlimeId: string | null;
  accessPointId: string | null;
  taskId: string | null;
}

export interface FishingCandidateScore {
  slimeId: string;
  name: string;
  score: number;
  accessPointId: string;
  pathLength: number;
}
