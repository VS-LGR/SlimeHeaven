import type { ResidentTypeId } from "./residents";
import {
  minuteInInterval,
  minutesFromTimeOfDay,
  timeOfDayFromMinutes,
  type TimeInterval,
} from "../timeConfig";

/**
 * Developer-authored daily sleep windows. Not player settings.
 * Sleep interval is [bedtime, wake) and may wrap midnight (Momo, Tito).
 * Pingo's sleep is same-calendar-day 03:00–11:00; his awake window wraps midnight.
 */
export interface SleepSchedule {
  wakeMinute: number;
  bedtimeMinute: number;
}

export type RoutinePhase = "awake" | "returning_home" | "sleeping" | "home_blocked";
export type RoutineBlockReason = "missing_home" | "incomplete_home" | "unreachable" | "entrance_blocked";

export const RESIDENT_SLEEP_SCHEDULES: Partial<Record<ResidentTypeId, SleepSchedule>> = {
  momo: {
    wakeMinute: minutesFromTimeOfDay(5, 30),
    bedtimeMinute: minutesFromTimeOfDay(21, 30),
  },
  tito: {
    wakeMinute: minutesFromTimeOfDay(7, 0),
    bedtimeMinute: minutesFromTimeOfDay(23, 0),
  },
  pingo: {
    wakeMinute: minutesFromTimeOfDay(11, 0),
    bedtimeMinute: minutesFromTimeOfDay(3, 0),
  },
  lily: {
    wakeMinute: minutesFromTimeOfDay(8, 0),
    bedtimeMinute: minutesFromTimeOfDay(22, 0),
  },
};

export function sleepScheduleFor(residentTypeId: ResidentTypeId): SleepSchedule | undefined {
  return RESIDENT_SLEEP_SCHEDULES[residentTypeId];
}

export function sleepInterval(schedule: SleepSchedule): TimeInterval {
  return { startMinute: schedule.bedtimeMinute, endMinute: schedule.wakeMinute };
}

export function isSleepMinute(minuteOfDay: number, schedule: SleepSchedule): boolean {
  return minuteInInterval(minuteOfDay, sleepInterval(schedule));
}

export function isRoutineUnavailable(slime: { routinePhase: RoutinePhase; state: string }): boolean {
  return (
    slime.routinePhase === "returning_home" ||
    slime.routinePhase === "sleeping" ||
    slime.routinePhase === "home_blocked" ||
    slime.state === "moving_to_home" ||
    slime.state === "sleeping"
  );
}

export function formatScheduleClock(minuteOfDay: number): string {
  const { hour, minute } = timeOfDayFromMinutes(minuteOfDay);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
