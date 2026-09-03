import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import type { TaskType } from "@/src/simulation/entities/Task";
import { SLIME_ANIM, type CoreSlimeAnim, type SlimeAnimName } from "../slimeVisualConfig";
import { MOMO_TILL_BODY } from "./momoTillVisualConfig";
import { MOMO_PLANT_BODY } from "./momoPlantVisualConfig";
import { MOMO_HARVEST_BODY } from "./momoHarvestVisualConfig";

const warned = new Set<string>();
let momoTillReady = false;
let hoeReady = false;
let dirtReady = false;
let momoPlantReady = false;
let momoHarvestReady = false;

export function setMomoTillReady(ready: boolean): void {
  momoTillReady = ready;
}

export function isMomoTillReady(): boolean {
  return momoTillReady;
}

export function setMomoTillHoeReady(ready: boolean): void {
  hoeReady = ready;
}

export function isMomoTillHoeReady(): boolean {
  return hoeReady;
}

export function setMomoTillDirtReady(ready: boolean): void {
  dirtReady = ready;
}

export function isMomoTillDirtReady(): boolean {
  return dirtReady;
}

export function setMomoPlantReady(ready: boolean): void {
  momoPlantReady = ready;
}

export function isMomoPlantReady(): boolean {
  return momoPlantReady;
}

export function setMomoHarvestReady(ready: boolean): void {
  momoHarvestReady = ready;
}

export function isMomoHarvestReady(): boolean {
  return momoHarvestReady;
}

export type FarmingSemantic =
  | typeof SLIME_ANIM.FARM_TILL
  | typeof SLIME_ANIM.FARM_PLANT
  | typeof SLIME_ANIM.FARM_HARVEST
  | typeof SLIME_ANIM.WORK;

export type ResolvedFarmingAnim =
  | { kind: "final"; key: string; semantic: FarmingSemantic }
  | { kind: "fallback"; anim: CoreSlimeAnim; semantic: SlimeAnimName };

const WORK_FALLBACK: ResolvedFarmingAnim = {
  kind: "fallback",
  anim: SLIME_ANIM.WORK,
  semantic: SLIME_ANIM.WORK,
};

export function getFarmingAnimation(
  slimeId: string,
  slimeState: string,
  taskType: TaskType | string | undefined,
  hasTexture: (key: string) => boolean = () => true,
): ResolvedFarmingAnim {
  if (slimeState !== "working" || slimeId !== SLIME_IDS.MOMO) {
    return WORK_FALLBACK;
  }

  if (taskType === "till_soil") {
    const key = MOMO_TILL_BODY.animKey;
    if (momoTillReady && MOMO_TILL_BODY.keys.every((frameKey) => hasTexture(frameKey))) {
      return { kind: "final", key, semantic: SLIME_ANIM.FARM_TILL };
    }
    warnOnce("Momo farm_till art missing; using generic Work fallback.");
    return { kind: "fallback", anim: SLIME_ANIM.WORK, semantic: SLIME_ANIM.FARM_TILL };
  }

  if (taskType === "plant_crop") {
    const key = MOMO_PLANT_BODY.animKey;
    if (momoPlantReady && MOMO_PLANT_BODY.keys.every((frameKey) => hasTexture(frameKey))) {
      return { kind: "final", key, semantic: SLIME_ANIM.FARM_PLANT };
    }
    warnOnce("Momo farm_plant art missing; using generic Work fallback.");
    return { kind: "fallback", anim: SLIME_ANIM.WORK, semantic: SLIME_ANIM.FARM_PLANT };
  }

  if (taskType === "harvest_crop") {
    const key = MOMO_HARVEST_BODY.animKey;
    if (momoHarvestReady && MOMO_HARVEST_BODY.keys.every((frameKey) => hasTexture(frameKey))) {
      return { kind: "final", key, semantic: SLIME_ANIM.FARM_HARVEST };
    }
    warnOnce("Momo farm_harvest art missing; using generic Work fallback.");
    return { kind: "fallback", anim: SLIME_ANIM.WORK, semantic: SLIME_ANIM.FARM_HARVEST };
  }

  return WORK_FALLBACK;
}

export function usesMomoTillClip(slimeId: string, anim: SlimeAnimName): boolean {
  return slimeId === SLIME_IDS.MOMO && momoTillReady && anim === SLIME_ANIM.FARM_TILL;
}

export function usesMomoPlantClip(slimeId: string, anim: SlimeAnimName): boolean {
  return slimeId === SLIME_IDS.MOMO && momoPlantReady && anim === SLIME_ANIM.FARM_PLANT;
}

export function usesMomoHarvestClip(slimeId: string, anim: SlimeAnimName): boolean {
  return slimeId === SLIME_IDS.MOMO && momoHarvestReady && anim === SLIME_ANIM.FARM_HARVEST;
}

export function usesMomoFarmClip(slimeId: string, anim: SlimeAnimName): boolean {
  return usesMomoTillClip(slimeId, anim) || usesMomoPlantClip(slimeId, anim) || usesMomoHarvestClip(slimeId, anim);
}

function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  console.warn(message);
}
