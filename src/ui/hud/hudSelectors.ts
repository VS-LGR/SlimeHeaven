import type { GameUiSnapshot } from "@/src/store/gameUiStore";
import { UNAVAILABLE_HUD_VALUE } from "./hudAssets";

export interface WorldStatusHudModel {
  day?: number;
  timeLabel?: string;
  season?: string;
  weather?: string;
  dayPhase?: string;
}

export interface ResourceHudModel {
  wood: number;
  stone: number;
  food: number;
}

export const PROTOTYPE_WORLD_STATUS = {
  source: "prototype_placeholder" as const,
  dayLabel: "Dia 1",
  timeLabel: "09:30",
  season: "Primavera",
};

const EMPTY_WORLD_STATUS: WorldStatusHudModel = {};

export function selectWorldStatusHudModel(snapshot: GameUiSnapshot): WorldStatusHudModel {
  void snapshot;
  return EMPTY_WORLD_STATUS;
}

export function selectResourceHudModel(
  snapshot: Pick<GameUiSnapshot, "wood" | "stone" | "food">,
): ResourceHudModel {
  return {
    wood: snapshot.wood,
    stone: snapshot.stone,
    food: snapshot.food,
  };
}

export function worldStatusSlotLabel(value: string | number | undefined): string {
  if (value === undefined || value === "") {
    return UNAVAILABLE_HUD_VALUE;
  }
  return String(value);
}
