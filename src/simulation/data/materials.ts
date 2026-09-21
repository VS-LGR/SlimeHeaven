import {
  COPPER_ORE_GATHER_AMOUNT,
  FOLIAGE_GATHER_AMOUNT,
  GATHER_AMOUNT,
} from "../constants";
import type { GatherTaskType } from "../entities/Task";
import { RESOURCE_IDS, bundleAmount, type ResourceBundle, type ResourceType } from "../resources";
import type { Rng } from "../rng";

/**
 * Village material catalog (05.6A.2).
 *
 * Material inventory is session-lifetime, matching wood/stone/food, jobs, and cargo.
 * Only world time persists (`slimeheaven.world-time.v1`). Do not persist foliage or copper alone.
 * Food stays a village staple and is not a catalog material.
 * Copper ingot is a future processed material and is never awarded from mining.
 */
export const MATERIAL_IDS = {
  WOOD: "wood",
  STONE: "stone",
  VINE: "vine",
  FOLIAGE: "foliage",
  COPPER_ORE: "copperOre",
} as const;

export type MaterialId = (typeof MATERIAL_IDS)[keyof typeof MATERIAL_IDS];

export const MATERIAL_ID_LIST = [
  MATERIAL_IDS.WOOD,
  MATERIAL_IDS.STONE,
  MATERIAL_IDS.VINE,
  MATERIAL_IDS.FOLIAGE,
  MATERIAL_IDS.COPPER_ORE,
] as const;

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
  foliage: {
    id: "foliage",
    name: "Foliage",
    iconSrc: "/assets/world/materials/Foliage.png",
  },
  copperOre: {
    id: "copperOre",
    name: "Copper ore",
    iconSrc: "/assets/world/materials/Copper_Ore.png",
  },
};

export const MATERIAL_ICON_FILES = {
  wood: "public/assets/UI/UI_Icon_Wood.png",
  stone: "public/assets/UI/UI_Icon_Rock.png",
  vine: "public/assets/world/materials/Vine.png",
  foliage: "public/assets/world/materials/Foliage.png",
  copperOre: "public/assets/world/materials/Copper_Ore.png",
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

export interface MaterialDeliveryLine {
  type: ResourceType;
  amount: number;
}

export interface MaterialDeliveryNotice {
  slimeName: string;
  lines: MaterialDeliveryLine[];
}

const TOASTABLE_MATERIALS: readonly ResourceType[] = [
  RESOURCE_IDS.VINE,
  RESOURCE_IDS.FOLIAGE,
  RESOURCE_IDS.COPPER_ORE,
];

const TOAST_LABELS: Record<string, string> = {
  vine: "Vine",
  foliage: "Foliage",
  copperOre: "Copper ore",
};

/**
 * Resolve a gather cargo bundle exactly once per completed collection.
 * Stone never produces vines. Wood always yields GATHER_AMOUNT.
 * Foliage and copper never award ingots or wood.
 */
export function resolveGatherBundle(
  taskType: GatherTaskType,
  rng: Pick<Rng, "next">,
  options?: ResolveGatherOptions,
): ResourceBundle {
  if (taskType === "gather_stone") {
    return { stone: GATHER_AMOUNT };
  }
  if (taskType === "gather_foliage") {
    return { foliage: FOLIAGE_GATHER_AMOUNT };
  }
  if (taskType === "gather_copper") {
    return { copperOre: COPPER_ORE_GATHER_AMOUNT };
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

export function deliveryNoticeFromBundle(
  slimeName: string,
  bundle: ResourceBundle,
): MaterialDeliveryNotice | undefined {
  const lines: MaterialDeliveryLine[] = [];
  for (const type of TOASTABLE_MATERIALS) {
    const amount = bundleAmount(bundle, type);
    if (amount > 0) {
      lines.push({ type, amount });
    }
  }
  if (lines.length === 0) {
    return undefined;
  }
  return { slimeName, lines };
}

export function formatMaterialDeliveryToast(notice: MaterialDeliveryNotice): string {
  const parts = notice.lines.map((line) => `${TOAST_LABELS[line.type] ?? line.type} ×${line.amount}`);
  return `${notice.slimeName} delivered ${parts.join(", ")}`;
}

export function materialById(id: MaterialId): MaterialDefinition {
  return MATERIALS[id];
}
