import { GATHER_AMOUNT } from "../constants";
import type { GatherTaskType } from "../entities/Task";
import type { ResourceBundle } from "../resources";
import type { Rng } from "../rng";

/**
 * Village material catalog (05.6A.1).
 *
 * Material inventory is session-lifetime, matching wood/stone/food, jobs, and cargo.
 * Only world time persists (`slimeheaven.world-time.v1`). Do not persist vines alone.
 * Food stays a village staple and is not a catalog material.
 */
export const MATERIAL_IDS = {
  WOOD: "wood",
  STONE: "stone",
  VINE: "vine",
} as const;

export type MaterialId = (typeof MATERIAL_IDS)[keyof typeof MATERIAL_IDS];

export const MATERIAL_ID_LIST = [MATERIAL_IDS.WOOD, MATERIAL_IDS.STONE, MATERIAL_IDS.VINE] as const;

export interface MaterialDefinition {
  id: MaterialId;
  name: string;
  iconSrc: string;
}

export const MATERIALS: Record<MaterialId, MaterialDefinition> = {
  wood: {
    id: "wood",
    name: "Wood",
    iconSrc: "/assets/UI/UI_Icon_Wood.png",
  },
  stone: {
    id: "stone",
    name: "Stone",
    iconSrc: "/assets/UI/UI_Icon_Rock.png",
  },
  vine: {
    id: "vine",
    name: "Vine",
    iconSrc: "/assets/world/materials/Vine.png",
  },
};

export const MATERIAL_ICON_FILES = {
  wood: "public/assets/UI/UI_Icon_Wood.png",
  stone: "public/assets/UI/UI_Icon_Rock.png",
  vine: "public/assets/world/materials/Vine.png",
} as const;

/** New 05.6A.1 balance defaults. Wood quantity remains GATHER_AMOUNT. */
export const WOOD_GATHER_VINE_BONUS = {
  chance: 0.25,
  quantity: 1,
} as const;

export interface ResolveGatherOptions {
  /** When set, skip RNG and grant or deny the vine bonus. Consumed by the caller. */
  forceVineBonus?: boolean;
}

export interface MaterialDeliveryNotice {
  slimeName: string;
  vine: number;
}

/**
 * Resolve a gather cargo bundle exactly once per completed collection.
 * Stone never produces vines. Wood always yields GATHER_AMOUNT.
 */
export function resolveGatherBundle(
  taskType: GatherTaskType,
  rng: Pick<Rng, "next">,
  options?: ResolveGatherOptions,
): ResourceBundle {
  if (taskType === "gather_stone") {
    return { stone: GATHER_AMOUNT };
  }

  const bundle: ResourceBundle = { wood: GATHER_AMOUNT };
  if (options?.forceVineBonus === true) {
    bundle.vine = WOOD_GATHER_VINE_BONUS.quantity;
    return bundle;
  }
  if (options?.forceVineBonus === false) {
    return bundle;
  }
  if (rng.next() < WOOD_GATHER_VINE_BONUS.chance) {
    bundle.vine = WOOD_GATHER_VINE_BONUS.quantity;
  }
  return bundle;
}

export function materialById(id: MaterialId): MaterialDefinition {
  return MATERIALS[id];
}
