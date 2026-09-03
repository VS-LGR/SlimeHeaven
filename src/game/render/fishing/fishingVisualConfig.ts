import {
  FISHING_SUCCESS_HOLD_MS,
  FISHING_SUCCESS_PRESENTATION_HOLD_TICKS,
  type FishingPresentationPhase,
} from "@/src/simulation/entities/FishingPresentation";
import { SLIME_ANIM, type CoreSlimeAnim, type SlimeAnimName } from "../slimeVisualConfig";

/** Presentation-only timings. Does not change gameplay bite delay or formulas. */
export const FISHING_PRESENTATION = {
  castFrameMs: 125,
  waitFrameMs: 200,
  biteFrameMs: [150, 150, 200] as const,
  pullFrameMs: 120,
  successFrameMs: [90, 90, 90, 90, 90, 90, 140, 320] as const,
  bobberIdleFrameMs: 220,
  submergeFrameMs: 80,
  bubbleFrameMs: 90,
  splashFrameMs: 70,
  bobberArcHeightPx: 10,
  landingSplashScale: 0.85,
  biteSplashScale: 0.7,
  successSplashScale: 1.15,
  bubbleBurstMs: 540,
  pullBubbleGapMs: 900,
  lineColor: 0x4a5a58,
  lineSlackDropPx: 3,
  successHoldMs: FISHING_SUCCESS_HOLD_MS,
  cameraLerp: 0.08,
  cameraMarginPx: 28,
} as const;

export const FISHING_PRESENTATION_SUCCESS_HOLD_TICKS = FISHING_SUCCESS_PRESENTATION_HOLD_TICKS;

export type FishingRodPose = "cast" | "wait" | "bite" | "pull";
export type FishingLineTension = "hidden" | "slack" | "normal" | "tension";
export type FishingBobberMode = "hidden" | "arc" | "idle" | "submerge";

export interface FishingGearState {
  rodPose: FishingRodPose | null;
  bobber: FishingBobberMode;
  line: FishingLineTension;
  showSplash: "none" | "land" | "bite" | "success" | "escape";
  showBubbles: boolean;
}

export function fishingSemanticAnim(phase: FishingPresentationPhase): SlimeAnimName {
  if (phase === "approach") {
    return SLIME_ANIM.HOP;
  }
  if (phase === "arrive" || phase === "cast") {
    return SLIME_ANIM.FISH_CAST;
  }
  if (phase === "wait") {
    return SLIME_ANIM.FISH_WAIT;
  }
  if (phase === "bite") {
    return SLIME_ANIM.FISH_BITE;
  }
  if (phase === "hook" || phase === "pull") {
    return SLIME_ANIM.FISH_PULL;
  }
  if (phase === "success") {
    return SLIME_ANIM.FISH_SUCCESS;
  }
  return SLIME_ANIM.IDLE;
}

export function fishingFallbackAnim(phase: FishingPresentationPhase): CoreSlimeAnim {
  const semantic = fishingSemanticAnim(phase);
  if (semantic === SLIME_ANIM.FISH_WAIT || semantic === SLIME_ANIM.IDLE) {
    return SLIME_ANIM.IDLE;
  }
  if (semantic === SLIME_ANIM.FISH_SUCCESS || semantic === SLIME_ANIM.HOP) {
    return SLIME_ANIM.HOP;
  }
  return SLIME_ANIM.WORK;
}

export function fishingGearState(phase: FishingPresentationPhase): FishingGearState {
  if (phase === "cast") {
    return { rodPose: "cast", bobber: "arc", line: "normal", showSplash: "none", showBubbles: false };
  }
  if (phase === "wait") {
    return { rodPose: "wait", bobber: "idle", line: "slack", showSplash: "none", showBubbles: false };
  }
  if (phase === "bite") {
    return { rodPose: "bite", bobber: "submerge", line: "tension", showSplash: "none", showBubbles: true };
  }
  if (phase === "hook" || phase === "pull") {
    return { rodPose: "pull", bobber: "hidden", line: "tension", showSplash: "none", showBubbles: true };
  }
  if (phase === "success") {
    return { rodPose: null, bobber: "hidden", line: "hidden", showSplash: "success", showBubbles: false };
  }
  if (phase === "escape") {
    return { rodPose: "wait", bobber: "hidden", line: "slack", showSplash: "escape", showBubbles: false };
  }
  return { rodPose: null, bobber: "hidden", line: "hidden", showSplash: "none", showBubbles: false };
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

export function quantizedArc(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  t: number,
  heightPx: number,
): { x: number; y: number } {
  const k = clamp01(t);
  const x = fromX + (toX - fromX) * k;
  const y = fromY + (toY - fromY) * k - Math.sin(k * Math.PI) * heightPx;
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function castArcProgress(
  arriveUntilTick: number,
  castUntilTick: number,
  tickIndex: number,
  tickAlpha: number,
): number {
  if (tickIndex + tickAlpha < arriveUntilTick) {
    return 0;
  }
  const span = Math.max(1, castUntilTick - arriveUntilTick);
  return clamp01((tickIndex + tickAlpha - arriveUntilTick) / span);
}

export function fishingGearObjectIds(sessionId: string): string[] {
  return [
    `rod:${sessionId}`,
    `castBobber:${sessionId}`,
    `bobber:${sessionId}`,
    `splash:${sessionId}`,
    `bubbles:${sessionId}`,
    `line:${sessionId}`,
  ];
}

export function nextFishingGearIds(
  previousSessionId: string | null,
  nextSessionId: string | null,
): { created: string[]; destroyed: string[] } {
  const prev = previousSessionId ? fishingGearObjectIds(previousSessionId) : [];
  const next = nextSessionId ? fishingGearObjectIds(nextSessionId) : [];
  const nextSet = new Set(next);
  const prevSet = new Set(prev);
  return {
    created: next.filter((id) => !prevSet.has(id)),
    destroyed: prev.filter((id) => !nextSet.has(id)),
  };
}
