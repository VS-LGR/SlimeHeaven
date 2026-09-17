import {
  TIME,
  dayPeriodAtMinute,
  intervalProgress,
  wrapMinuteOfDay,
  type DayPeriod,
} from "@/src/simulation/timeConfig";

export interface LightingKey {
  minute: number;
  color: number;
  alpha: number;
}

export interface LightingSample {
  color: number;
  alpha: number;
}

export interface CelestialOpacities {
  sun: number;
  moon: number;
}

/**
 * Lighting keys in minutes from 00:00. Day keeps authored colors (alpha 0).
 * Tune color/alpha/transition here — not in simulation.
 */
export const DAY_NIGHT_LIGHTING_KEYS: readonly LightingKey[] = [
  { minute: 0, color: 0x1c3a6e, alpha: 0.48 },
  { minute: 4 * 60 + 30, color: 0x1a345e, alpha: 0.44 },
  { minute: 5 * 60, color: 0x3a4868, alpha: 0.22 },
  { minute: 5 * 60 + 50, color: 0xc4784a, alpha: 0.12 },
  { minute: 7 * 60, color: 0x000000, alpha: 0 },
  { minute: 12 * 60, color: 0x000000, alpha: 0 },
  { minute: 17 * 60, color: 0x000000, alpha: 0 },
  { minute: 17 * 60 + 40, color: 0xd4784a, alpha: 0.16 },
  { minute: 18 * 60 + 30, color: 0x6a4060, alpha: 0.24 },
  { minute: 19 * 60, color: 0x2a446c, alpha: 0.34 },
  { minute: 21 * 60, color: 0x1c3a6e, alpha: 0.46 },
  { minute: 24 * 60, color: 0x1c3a6e, alpha: 0.48 },
];

export function lightingAtMinute(minuteOfDay: number, keys: readonly LightingKey[] = DAY_NIGHT_LIGHTING_KEYS): LightingSample {
  const minute = wrapMinuteOfDay(minuteOfDay);
  const spanKeys = keys.length >= 2 ? keys : DAY_NIGHT_LIGHTING_KEYS;
  let endIndex = spanKeys.findIndex((key) => key.minute > minute);
  if (endIndex <= 0) {
    endIndex = spanKeys.length - 1;
  }
  const start = spanKeys[endIndex - 1] ?? spanKeys[0];
  const end = spanKeys[endIndex] ?? start;
  const span = end.minute - start.minute;
  const t = span <= 0 ? 0 : (minute - start.minute) / span;
  const eased = smoothstep(clamp01(t));
  return {
    color: lerpColor(start.color, end.color, eased),
    alpha: lerp(start.alpha, end.alpha, eased),
  };
}

export function celestialOpacities(minuteOfDay: number): CelestialOpacities {
  const period = dayPeriodAtMinute(minuteOfDay);
  if (period === "day") {
    return { sun: 1, moon: 0 };
  }
  if (period === "night") {
    return { sun: 0, moon: 1 };
  }
  if (period === "dawn") {
    const t = smoothstep(intervalProgress(minuteOfDay, TIME.periods.dawn));
    return { sun: t, moon: 1 - t };
  }
  const t = smoothstep(intervalProgress(minuteOfDay, TIME.periods.dusk));
  return { sun: 1 - t, moon: t };
}

export function celestialPeriod(minuteOfDay: number): DayPeriod {
  return dayPeriodAtMinute(minuteOfDay);
}

export function clamp01(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bch = Math.round(lerp(ab, bb, t));
  return (r << 16) | (g << 8) | bch;
}
