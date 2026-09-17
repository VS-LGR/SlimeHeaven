/** Central time-balance values. Change day length here, not in the clock. */
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;

export type DayPeriod = "dawn" | "day" | "dusk" | "night";

export interface TimeOfDay {
  hour: number;
  minute: number;
}

export interface TimeInterval {
  /** Inclusive start, minutes from 00:00. */
  startMinute: number;
  /** Exclusive end, minutes from 00:00. Night may wrap past midnight. */
  endMinute: number;
}

export interface TimeConfig {
  minutesPerDay: number;
  /** Real-world duration of one complete game day. */
  dayDurationRealMs: number;
  newGame: { day: number } & TimeOfDay;
  periods: Record<DayPeriod, TimeInterval>;
}

/**
 * Starting balance: 1 game day = 24 real minutes, 1 game hour = 1 real minute,
 * 1 game minute = 1 real second. Not a permanent hardcoded rule.
 */
export const TIME: TimeConfig = {
  minutesPerDay: MINUTES_PER_DAY,
  dayDurationRealMs: 24 * 60 * 1000,
  newGame: { day: 1, hour: 9, minute: 30 },
  periods: {
    night: { startMinute: 19 * MINUTES_PER_HOUR, endMinute: 5 * MINUTES_PER_HOUR },
    dawn: { startMinute: 5 * MINUTES_PER_HOUR, endMinute: 7 * MINUTES_PER_HOUR },
    day: { startMinute: 7 * MINUTES_PER_HOUR, endMinute: 17 * MINUTES_PER_HOUR },
    dusk: { startMinute: 17 * MINUTES_PER_HOUR, endMinute: 19 * MINUTES_PER_HOUR },
  },
};

/** F3 / debug jumps. Uses the same clock APIs as normal advancement. */
export const DEBUG_CLOCK_PRESETS = {
  dawn: { hour: 6, minute: 0 },
  midday: { hour: 12, minute: 0 },
  dusk: { hour: 18, minute: 0 },
  midnight: { hour: 0, minute: 0 },
} as const;

export function millisecondsPerGameMinute(config: TimeConfig = TIME): number {
  return config.dayDurationRealMs / config.minutesPerDay;
}

export function minutesFromTimeOfDay(hour: number, minute: number): number {
  return hour * MINUTES_PER_HOUR + minute;
}

export function timeOfDayFromMinutes(minuteOfDay: number): TimeOfDay {
  const wrapped = wrapMinuteOfDay(minuteOfDay);
  return {
    hour: Math.floor(wrapped / MINUTES_PER_HOUR),
    minute: wrapped % MINUTES_PER_HOUR,
  };
}

export function wrapMinuteOfDay(minuteOfDay: number, minutesPerDay: number = MINUTES_PER_DAY): number {
  const period = minutesPerDay;
  return ((minuteOfDay % period) + period) % period;
}

export function isWrappedInterval(interval: TimeInterval): boolean {
  return interval.endMinute <= interval.startMinute;
}

export function minuteInInterval(minuteOfDay: number, interval: TimeInterval, minutesPerDay: number = MINUTES_PER_DAY): boolean {
  const minute = wrapMinuteOfDay(minuteOfDay, minutesPerDay);
  if (isWrappedInterval(interval)) {
    return minute >= interval.startMinute || minute < interval.endMinute;
  }
  return minute >= interval.startMinute && minute < interval.endMinute;
}

export function dayPeriodAtMinute(minuteOfDay: number, config: TimeConfig = TIME): DayPeriod {
  const { dawn, day, dusk } = config.periods;
  if (minuteInInterval(minuteOfDay, dawn, config.minutesPerDay)) {
    return "dawn";
  }
  if (minuteInInterval(minuteOfDay, day, config.minutesPerDay)) {
    return "day";
  }
  if (minuteInInterval(minuteOfDay, dusk, config.minutesPerDay)) {
    return "dusk";
  }
  return "night";
}

export function intervalProgress(minuteOfDay: number, interval: TimeInterval, minutesPerDay: number = MINUTES_PER_DAY): number {
  const minute = wrapMinuteOfDay(minuteOfDay, minutesPerDay);
  const length = isWrappedInterval(interval)
    ? minutesPerDay - interval.startMinute + interval.endMinute
    : interval.endMinute - interval.startMinute;
  if (length <= 0) {
    return 0;
  }
  const elapsed = isWrappedInterval(interval)
    ? minute >= interval.startMinute
      ? minute - interval.startMinute
      : minutesPerDay - interval.startMinute + minute
    : minute - interval.startMinute;
  return Math.min(1, Math.max(0, elapsed / length));
}
