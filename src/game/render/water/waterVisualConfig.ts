export const WATER_TEXTURE = {
  surface: "water-surface-pattern",
  fish: "water-fish-shadow",
  depth: "water-depth-transition",
} as const;

export const WATER_PATTERN_SIZE = 32;

/** Future systems may pass these; visuals reuse V1 presets. */
export type RippleType =
  | "ambient"
  | "click"
  | "fish"
  | "rain"
  | "cast"
  | "bite"
  | "rare"
  | "slime"
  | "clue_large"
  | "clue_glimmer";

export interface RipplePreset {
  durationMs: number;
  stepMs: number;
  maxRadius: number;
  color: number;
  startAlpha: number;
}

export const RIPPLE_PRESETS: Record<RippleType, RipplePreset> = {
  ambient: { durationMs: 1100, stepMs: 90, maxRadius: 5, color: 0xc8eef8, startAlpha: 0.45 },
  click: { durationMs: 780, stepMs: 70, maxRadius: 7, color: 0xd8f6ff, startAlpha: 0.7 },
  fish: { durationMs: 900, stepMs: 80, maxRadius: 4, color: 0xb8dce8, startAlpha: 0.4 },
  rain: { durationMs: 520, stepMs: 60, maxRadius: 3, color: 0xc8eef8, startAlpha: 0.35 },
  cast: { durationMs: 860, stepMs: 70, maxRadius: 8, color: 0xd8f6ff, startAlpha: 0.65 },
  bite: { durationMs: 720, stepMs: 65, maxRadius: 6, color: 0xe8fbff, startAlpha: 0.75 },
  rare: { durationMs: 1200, stepMs: 85, maxRadius: 9, color: 0xf0fdff, startAlpha: 0.8 },
  slime: { durationMs: 800, stepMs: 70, maxRadius: 6, color: 0xd8f6ff, startAlpha: 0.6 },
  clue_large: { durationMs: 1100, stepMs: 80, maxRadius: 10, color: 0xd0f0ff, startAlpha: 0.72 },
  clue_glimmer: { durationMs: 1400, stepMs: 90, maxRadius: 8, color: 0x9ef6ff, startAlpha: 0.85 },
};

export const WATER_VFX = {
  surfaceStepMs: 280,
  surfaceStepPx: 1,
  surfaceAlpha: 0.42,
  depthInteriorColor: 0x071c32,
  depthInteriorAlpha: 0.48,
  depthEdgeColor: 0x7adcf2,
  depthEdgeAlpha: 0.14,
  depthShallowDark: 0x247090,
  depthDeepLight: 0x4a9cbc,
  depthSediment: 0x1a3c58,
  depthSedimentAlpha: 0.32,
  depthTransitionAlpha: 0.4,
  depthTransitionBandPx: 6,
  depthTransitionWobblePx: 4,
  shorelineStepMs: 420,
  shorelineColor: 0xd4f4ff,
  shorelineAlpha: 0.55,
  maxRipples: 8,
  ambientRippleIntervalMs: { min: 3200, max: 5800 },
  fishShadowIntervalMs: { min: 9000, max: 16000 },
  fishShadowSpeedPxPerSec: 7,
  fishShadowDurationMs: 3800,
  fishShadowFadeMs: 700,
  fishShadowAlpha: 0.38,
  maxFishShadows: 2,
  maxAmbientRipples: 2,
} as const;

export function randomIntervalMs(range: { min: number; max: number }): number {
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}

export function quantizeAlpha(alpha: number): number {
  return Math.max(0, Math.min(1, Math.round(alpha * 4) / 4));
}
