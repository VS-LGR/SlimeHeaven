import { afterEach, describe, expect, it, vi } from "vitest";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import { getFishingAnimation, setPingoFishingReady } from "./resolveFishingAnim";
import { fishingFallbackAnim, fishingSemanticAnim } from "./fishingVisualConfig";
import { PINGO_FISHING_CLIPS } from "./pingoFishingVisualConfig";
import { SLIME_ANIM } from "../slimeVisualConfig";
import type { FishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";

afterEach(() => {
  setPingoFishingReady(false);
  vi.restoreAllMocks();
});

describe("getFishingAnimation", () => {
  it("resolves Pingo to final fishing keys when art is ready", () => {
    setPingoFishingReady(true);
    const resolved = getFishingAnimation(SLIME_IDS.PINGO, "cast", () => true);
    expect(resolved).toEqual({
      kind: "final",
      key: PINGO_FISHING_CLIPS.fish_cast.animKey,
      semantic: SLIME_ANIM.FISH_CAST,
    });
    expect(getFishingAnimation(SLIME_IDS.PINGO, "wait", () => true).kind).toBe("final");
    expect(getFishingAnimation(SLIME_IDS.PINGO, "bite", () => true).kind).toBe("final");
    expect(getFishingAnimation(SLIME_IDS.PINGO, "pull", () => true).kind).toBe("final");
    expect(getFishingAnimation(SLIME_IDS.PINGO, "success", () => true).kind).toBe("final");
  });

  it("falls back to Idle/Hop/Work for Momo and Tito", () => {
    setPingoFishingReady(true);
    expect(getFishingAnimation(SLIME_IDS.MOMO, "cast", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.FISH_CAST,
    });
    expect(getFishingAnimation(SLIME_IDS.TITO, "wait", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.IDLE,
      semantic: SLIME_ANIM.FISH_WAIT,
    });
  });

  it("falls back and warns once when Pingo textures are missing", () => {
    setPingoFishingReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const resolved = getFishingAnimation(SLIME_IDS.PINGO, "cast", () => false);
    expect(resolved.kind).toBe("fallback");
    expect(resolved.semantic).toBe(SLIME_ANIM.FISH_CAST);
    getFishingAnimation(SLIME_IDS.PINGO, "cast", () => false);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("fishing phase map", () => {
  const cases: Array<[FishingPresentationPhase, string, "idle" | "hop" | "work"]> = [
    ["cast", SLIME_ANIM.FISH_CAST, SLIME_ANIM.WORK],
    ["arrive", SLIME_ANIM.FISH_CAST, SLIME_ANIM.WORK],
    ["wait", SLIME_ANIM.FISH_WAIT, SLIME_ANIM.IDLE],
    ["bite", SLIME_ANIM.FISH_BITE, SLIME_ANIM.WORK],
    ["hook", SLIME_ANIM.FISH_PULL, SLIME_ANIM.WORK],
    ["pull", SLIME_ANIM.FISH_PULL, SLIME_ANIM.WORK],
    ["success", SLIME_ANIM.FISH_SUCCESS, SLIME_ANIM.HOP],
    ["escape", SLIME_ANIM.IDLE, SLIME_ANIM.IDLE],
  ];

  it("maps presentation phases to fish_* keys and safe Idle on escape", () => {
    for (const [phase, semantic, fallback] of cases) {
      expect(fishingSemanticAnim(phase)).toBe(semantic);
      expect(fishingFallbackAnim(phase)).toBe(fallback);
    }
  });
});
