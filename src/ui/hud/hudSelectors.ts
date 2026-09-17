import type { GameUiSnapshot } from "@/src/store/gameUiStore";
import { TIME, dayPeriodAtMinute, minutesFromTimeOfDay } from "@/src/simulation/timeConfig";
import { formatClock, formatDayLabel } from "@/src/simulation/worldTime";
import { UNAVAILABLE_HUD_VALUE } from "./hudAssets";

export interface WorldStatusHudModel {
  source: "simulation";
  dayLabel: string;
  timeLabel: string;
  season: string;
  seasonSource: "static_placeholder";
  period: string;
}

export interface ResourceHudModel {
  wood: number;
  stone: number;
  food: number;
}

/** Season progression is not part of 05.5A. Keep the plaque static. */
export const STATIC_SEASON = {
  id: "spring",
  label: "Primavera",
  progression: "inactive" as const,
  source: "static_placeholder" as const,
};

export type WorldStatusClockFields = Pick<GameUiSnapshot, "dayNumber" | "clockHour" | "clockMinute">;

export function selectWorldStatusHudModel(snapshot: WorldStatusClockFields): WorldStatusHudModel {
  const dayNumber = snapshot.dayNumber >= 1 ? snapshot.dayNumber : TIME.newGame.day;
  const hour = Number.isFinite(snapshot.clockHour) ? snapshot.clockHour : TIME.newGame.hour;
  const minute = Number.isFinite(snapshot.clockMinute) ? snapshot.clockMinute : TIME.newGame.minute;
  const minuteOfDay = minutesFromTimeOfDay(hour, minute);
  return {
    source: "simulation",
    dayLabel: formatDayLabel(dayNumber),
    timeLabel: formatClock(hour, minute),
    season: STATIC_SEASON.label,
    seasonSource: STATIC_SEASON.source,
    period: dayPeriodAtMinute(minuteOfDay),
  };
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
