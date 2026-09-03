import type { SlimeState } from "./SlimeState";
import type { FishingSession } from "./FishingSession";
import { SIMULATION_TICK_MS } from "../constants";

export type FishingPresentationPhase =
  | "idle"
  | "approach"
  | "arrive"
  | "cast"
  | "wait"
  | "bite"
  | "hook"
  | "pull"
  | "success"
  | "escape";

/** Presentation leftover after catch so fish_success can finish. Does not block jobs. */
export const FISHING_SUCCESS_HOLD_MS = 1100;
export const FISHING_SUCCESS_PRESENTATION_HOLD_TICKS = Math.max(
  1,
  Math.ceil(FISHING_SUCCESS_HOLD_MS / SIMULATION_TICK_MS),
);

export function fishingPresentationPhase(
  slime: SlimeState | undefined,
  session: FishingSession | undefined,
  tickIndex: number,
): FishingPresentationPhase {
  if (slime?.state === "moving_to_fishing") {
    return "approach";
  }
  if (slime && slime.state === "idle" && slime.fishingCelebrateUntilTick > tickIndex) {
    return "success";
  }
  if (!session || session.phase === "idle") {
    return "idle";
  }
  if (session.phase === "casting") {
    if (tickIndex < session.arriveUntilTick) {
      return "arrive";
    }
    return "cast";
  }
  if (session.phase === "waiting") {
    return "wait";
  }
  if (session.phase === "bite") {
    return "bite";
  }
  if (session.phase === "fighting") {
    return session.lastStrike ? "pull" : "hook";
  }
  if (session.phase === "caught") {
    return "success";
  }
  if (session.phase === "escaped") {
    return "escape";
  }
  return "idle";
}

export function fishingPhaseLabel(phase: FishingPresentationPhase): string {
  if (phase === "approach" || phase === "arrive" || phase === "cast" || phase === "wait") {
    return "Fishing...";
  }
  if (phase === "bite") {
    return "BITE!";
  }
  if (phase === "hook" || phase === "pull") {
    return "Hook!";
  }
  if (phase === "success") {
    return "Caught!";
  }
  if (phase === "escape") {
    return "Escaped";
  }
  return "";
}
