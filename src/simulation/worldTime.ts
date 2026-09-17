import { SIMULATION_TICK_MS } from "./constants";
import {
  TIME,
  dayPeriodAtMinute,
  millisecondsPerGameMinute,
  minutesFromTimeOfDay,
  timeOfDayFromMinutes,
  wrapMinuteOfDay,
  type DayPeriod,
  type TimeConfig,
  type TimeOfDay,
} from "./timeConfig";

/** Authoritative clock. Derived presentation values are not stored. */
export interface WorldTimeState {
  /** Integer minutes since day-1 00:00. Day number is floor(total / minutesPerDay) + 1. */
  totalGameMinutes: number;
  /** Sub-minute leftover in real simulation milliseconds. */
  remainderMs: number;
}

export interface WorldClockView {
  totalGameMinutes: number;
  remainderMs: number;
  dayNumber: number;
  minuteOfDay: number;
  hour: number;
  minute: number;
  /** Normalized progress through the current day in [0, 1). */
  dayProgress: number;
  period: DayPeriod;
}

export interface WorldTimeAdvanceResult {
  minutesAdvanced: number;
  midnightsCrossed: number;
  midnightCrossed: boolean;
}

export function createDefaultWorldTime(config: TimeConfig = TIME): WorldTimeState {
  return {
    totalGameMinutes: totalMinutesFromParts(config.newGame.day, config.newGame.hour, config.newGame.minute, config),
    remainderMs: 0,
  };
}

export function cloneWorldTime(time: WorldTimeState): WorldTimeState {
  return {
    totalGameMinutes: time.totalGameMinutes,
    remainderMs: time.remainderMs,
  };
}

export function totalMinutesFromParts(
  day: number,
  hour: number,
  minute: number,
  config: TimeConfig = TIME,
): number {
  const safeDay = Math.max(1, Math.floor(day));
  const minuteOfDay = wrapMinuteOfDay(minutesFromTimeOfDay(Math.floor(hour), Math.floor(minute)), config.minutesPerDay);
  return (safeDay - 1) * config.minutesPerDay + minuteOfDay;
}

export function dayNumberFromTotal(totalGameMinutes: number, config: TimeConfig = TIME): number {
  return Math.floor(Math.max(0, totalGameMinutes) / config.minutesPerDay) + 1;
}

export function minuteOfDayFromTotal(totalGameMinutes: number, config: TimeConfig = TIME): number {
  return wrapMinuteOfDay(Math.max(0, totalGameMinutes), config.minutesPerDay);
}

export function readClock(time: WorldTimeState, config: TimeConfig = TIME): WorldClockView {
  const total = Math.max(0, Math.floor(time.totalGameMinutes));
  const minuteOfDay = minuteOfDayFromTotal(total, config);
  const { hour, minute } = timeOfDayFromMinutes(minuteOfDay);
  return {
    totalGameMinutes: total,
    remainderMs: Math.max(0, time.remainderMs),
    dayNumber: dayNumberFromTotal(total, config),
    minuteOfDay,
    hour,
    minute,
    dayProgress: minuteOfDay / config.minutesPerDay,
    period: dayPeriodAtMinute(minuteOfDay, config),
  };
}

export function formatClock(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function formatClockFromTime(time: WorldTimeState, config: TimeConfig = TIME): string {
  const clock = readClock(time, config);
  return formatClock(clock.hour, clock.minute);
}

export function formatDayLabel(dayNumber: number): string {
  return `Dia ${Math.max(1, Math.floor(dayNumber))}`;
}

/**
 * Presentation-only fractional minute-of-day. Does not mutate the authoritative clock.
 * `extraMs` is typically leftover tick interpolation and must not be persisted.
 */
export function visualMinuteOfDay(time: WorldTimeState, extraMs = 0, config: TimeConfig = TIME): number {
  const msPer = millisecondsPerGameMinute(config);
  const fractional = msPer > 0 ? (Math.max(0, time.remainderMs) + extraMs) / msPer : 0;
  return wrapMinuteOfDay(minuteOfDayFromTotal(time.totalGameMinutes, config) + fractional, config.minutesPerDay);
}

export function visualDayProgress(time: WorldTimeState, extraMs = 0, config: TimeConfig = TIME): number {
  return visualMinuteOfDay(time, extraMs, config) / config.minutesPerDay;
}

export function advanceSimMilliseconds(
  time: WorldTimeState,
  deltaMs: number,
  config: TimeConfig = TIME,
): WorldTimeAdvanceResult {
  const ms = Math.max(0, deltaMs);
  if (ms === 0) {
    return { minutesAdvanced: 0, midnightsCrossed: 0, midnightCrossed: false };
  }
  const msPer = millisecondsPerGameMinute(config);
  if (!(msPer > 0) || !Number.isFinite(msPer)) {
    return { minutesAdvanced: 0, midnightsCrossed: 0, midnightCrossed: false };
  }
  const previousTotal = Math.max(0, Math.floor(time.totalGameMinutes));
  const previousDay = dayNumberFromTotal(previousTotal, config);
  const combined = Math.max(0, time.remainderMs) + ms;
  const minutesAdvanced = Math.floor(combined / msPer);
  time.totalGameMinutes = previousTotal + minutesAdvanced;
  time.remainderMs = combined - minutesAdvanced * msPer;
  const nextDay = dayNumberFromTotal(time.totalGameMinutes, config);
  const midnightsCrossed = Math.max(0, nextDay - previousDay);
  return {
    minutesAdvanced,
    midnightsCrossed,
    midnightCrossed: midnightsCrossed > 0,
  };
}

export function tickWorldTime(
  time: WorldTimeState,
  tickMs: number = SIMULATION_TICK_MS,
  config: TimeConfig = TIME,
): WorldTimeAdvanceResult {
  return advanceSimMilliseconds(time, tickMs, config);
}

export function advanceGameMinutes(
  time: WorldTimeState,
  minutes: number,
  config: TimeConfig = TIME,
): WorldTimeAdvanceResult {
  const delta = Math.trunc(minutes);
  if (delta === 0) {
    return { minutesAdvanced: 0, midnightsCrossed: 0, midnightCrossed: false };
  }
  const previousTotal = Math.max(0, Math.floor(time.totalGameMinutes));
  const previousDay = dayNumberFromTotal(previousTotal, config);
  time.totalGameMinutes = Math.max(0, previousTotal + delta);
  const nextDay = dayNumberFromTotal(time.totalGameMinutes, config);
  const midnightsCrossed = Math.max(0, nextDay - previousDay);
  return {
    minutesAdvanced: Math.max(0, delta),
    midnightsCrossed,
    midnightCrossed: midnightsCrossed > 0,
  };
}

export function setWorldClock(
  time: WorldTimeState,
  parts: { day?: number } & TimeOfDay,
  config: TimeConfig = TIME,
): void {
  const day = parts.day ?? dayNumberFromTotal(time.totalGameMinutes, config);
  time.totalGameMinutes = totalMinutesFromParts(day, parts.hour, parts.minute, config);
  time.remainderMs = 0;
}

export function advanceToNextDay(time: WorldTimeState, config: TimeConfig = TIME): WorldTimeAdvanceResult {
  const currentDay = dayNumberFromTotal(time.totalGameMinutes, config);
  setWorldClock(time, { day: currentDay + 1, hour: 0, minute: 0 }, config);
  return {
    minutesAdvanced: 0,
    midnightsCrossed: 1,
    midnightCrossed: true,
  };
}

function pad2(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}
