import { SLIME_IDS, type SlimeId } from "@/src/simulation/entities/SlimeState";
import type { FishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import { SLIME_ANIM, type CoreSlimeAnim, type SlimeAnimName } from "../slimeVisualConfig";
import { fishingFallbackAnim, fishingSemanticAnim } from "./fishingVisualConfig";
import { isPingo, pingoFishingAnimKey } from "./pingoFishingVisualConfig";

const warned = new Set<string>();
let pingoFishingReady = false;

export function setPingoFishingReady(ready: boolean): void {
  pingoFishingReady = ready;
}

export function isPingoFishingReady(): boolean {
  return pingoFishingReady;
}

export type ResolvedFishingAnim =
  | { kind: "final"; key: string; semantic: SlimeAnimName }
  | { kind: "fallback"; anim: CoreSlimeAnim; semantic: SlimeAnimName };

export function getFishingAnimation(
  slimeId: string,
  phase: FishingPresentationPhase,
  hasTexture: (key: string) => boolean = () => pingoFishingReady,
): ResolvedFishingAnim {
  const semantic = fishingSemanticAnim(phase);
  if (semantic === SLIME_ANIM.HOP || semantic === SLIME_ANIM.IDLE || semantic === SLIME_ANIM.WORK) {
    return { kind: "fallback", anim: fishingFallbackAnim(phase), semantic };
  }
  if (isPingo(slimeId)) {
    const key = pingoFishingAnimKey(semantic);
    if (key && hasTexture(key) && pingoFishingReady) {
      return { kind: "final", key, semantic };
    }
    warnOnce(`Pingo fishing art missing for ${semantic}; using Idle/Hop/Work fallback.`);
  }
  return { kind: "fallback", anim: fishingFallbackAnim(phase), semantic };
}

export function usesPingoFishingClip(slimeId: string, anim: SlimeAnimName): boolean {
  if (!isPingo(slimeId) || !pingoFishingReady) {
    return false;
  }
  return (
    anim === SLIME_ANIM.FISH_CAST ||
    anim === SLIME_ANIM.FISH_WAIT ||
    anim === SLIME_ANIM.FISH_BITE ||
    anim === SLIME_ANIM.FISH_PULL ||
    anim === SLIME_ANIM.FISH_SUCCESS
  );
}

export function slimeHasFinalFishingArt(slimeId: SlimeId | string): boolean {
  return slimeId === SLIME_IDS.PINGO && pingoFishingReady;
}

function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  console.warn(message);
}
