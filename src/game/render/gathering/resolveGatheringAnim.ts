import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import type { TaskType } from "@/src/simulation/entities/Task";
import { SLIME_ANIM, type CoreSlimeAnim, type SlimeAnimName } from "../slimeVisualConfig";
import { TITO_CHOP_AXE, TITO_CHOP_BODY, TITO_PICKAXE } from "./titoChopVisualConfig";

const warned = new Set<string>();
let titoGatherSwingBodyReady = false;
let titoGatherSwingAxeReady = false;
let titoPickaxeReady = false;

export function setTitoChopBodyReady(ready: boolean): void {
  titoGatherSwingBodyReady = ready;
}

export function isTitoChopBodyReady(): boolean {
  return titoGatherSwingBodyReady;
}

export function setTitoChopAxeReady(ready: boolean): void {
  titoGatherSwingAxeReady = ready;
}

export function isTitoChopAxeReady(): boolean {
  return titoGatherSwingAxeReady;
}

export function setTitoPickaxeReady(ready: boolean): void {
  titoPickaxeReady = ready;
}

export function isTitoPickaxeReady(): boolean {
  return titoPickaxeReady;
}

export type GatheringSemantic = typeof SLIME_ANIM.TITO_GATHER_SWING | typeof SLIME_ANIM.WORK;

export type ResolvedGatheringAnim =
  | { kind: "final"; key: string; semantic: GatheringSemantic }
  | { kind: "fallback"; anim: CoreSlimeAnim; semantic: SlimeAnimName };

const WORK_FALLBACK: ResolvedGatheringAnim = {
  kind: "fallback",
  anim: SLIME_ANIM.WORK,
  semantic: SLIME_ANIM.WORK,
};

/**
 * Body clip is registered once as `tito_gather_swing`. Wood and stone share it.
 * Tool choice is the live task type; missing body or matching tool falls back to
 * generic work without delaying simulation completion.
 */
export function getGatheringAnimation(
  slimeId: string,
  slimeState: string,
  taskType: TaskType | string | undefined,
  hasTexture: (key: string) => boolean = () => true,
): ResolvedGatheringAnim {
  if (slimeState !== "working" || slimeId !== SLIME_IDS.TITO) {
    return WORK_FALLBACK;
  }

  if (taskType !== "gather_wood" && taskType !== "gather_stone") {
    return WORK_FALLBACK;
  }

  const bodyOk =
    titoGatherSwingBodyReady && TITO_CHOP_BODY.keys.every((frameKey) => hasTexture(frameKey));

  if (taskType === "gather_wood") {
    const axeOk = titoGatherSwingAxeReady && TITO_CHOP_AXE.keys.every((frameKey) => hasTexture(frameKey));
    if (bodyOk && axeOk) {
      return { kind: "final", key: TITO_CHOP_BODY.animKey, semantic: SLIME_ANIM.TITO_GATHER_SWING };
    }
    if (!bodyOk) {
      warnOnce("Tito tito_gather_swing body art missing; using generic Work fallback.");
    } else {
      warnOnce("Tito tito_gather_swing axe art missing; using generic Work fallback.");
    }
    return { kind: "fallback", anim: SLIME_ANIM.WORK, semantic: SLIME_ANIM.TITO_GATHER_SWING };
  }

  const pickOk = titoPickaxeReady && TITO_PICKAXE.keys.every((frameKey) => hasTexture(frameKey));
  if (bodyOk && pickOk) {
    return { kind: "final", key: TITO_CHOP_BODY.animKey, semantic: SLIME_ANIM.TITO_GATHER_SWING };
  }
  if (!bodyOk) {
    warnOnce("Tito tito_gather_swing body art missing; using generic Work fallback.");
  } else {
    warnOnce("Tito tito_gather_swing pickaxe art missing; using generic Work fallback.");
  }
  return { kind: "fallback", anim: SLIME_ANIM.WORK, semantic: SLIME_ANIM.TITO_GATHER_SWING };
}

export function usesTitoGatherSwingClip(slimeId: string, anim: SlimeAnimName): boolean {
  return (
    slimeId === SLIME_IDS.TITO &&
    titoGatherSwingBodyReady &&
    (titoGatherSwingAxeReady || titoPickaxeReady) &&
    anim === SLIME_ANIM.TITO_GATHER_SWING
  );
}

function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  console.warn(message);
}
