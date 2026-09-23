import { HUD_ASSETS } from "./hudAssets";
import type { ResourceType } from "@/src/simulation/resources";

/**
 * Add-material checklist:
 * 1. Add a definition to INVENTORY_ITEMS (+ icon path in hudAssets if new).
 * 2. If collectable: add ResourceType + store/simulation wiring, set stockKey.
 * 3. Optional optics — defaults boxScale 1, offset 0.
 */

export type InventoryCategoryId = "all" | "natural" | "mineral" | "marine";
export type InventorySortId = "name" | "category";
export type InventoryHubMode = "stock" | "catalog";

export type InventoryItemOptics = {
  boxScale: number;
  offsetX: number;
  offsetY: number;
};

export interface InventoryItemDefinition {
  id: InventoryItemId;
  name: string;
  category: Exclude<InventoryCategoryId, "all">;
  iconSrc: string;
  description: string;
  acquired: string;
  usedIn: string[];
  /** Live stock key; null = catalog-only (not collectable yet). */
  stockKey: ResourceType | null;
  optics?: InventoryItemOptics;
  /** Native icon pixel size for aspect-fit draw (optional; wood/stone use square). */
  iconNative?: { width: number; height: number };
}

export const INVENTORY_ITEM_IDS = [
  "wood",
  "stone",
  "vine",
  "food",
  "copper_ore",
  "copper_ingot",
  "shell",
  "coral",
  "foliage",
] as const;

export type InventoryItemId = (typeof INVENTORY_ITEM_IDS)[number];

export const INVENTORY_CATEGORY_IDS: readonly InventoryCategoryId[] = [
  "all",
  "natural",
  "mineral",
  "marine",
];

export const INVENTORY_HUB_MODES: readonly InventoryHubMode[] = ["stock", "catalog"];

export const INVENTORY_ITEMS: Record<InventoryItemId, InventoryItemDefinition> = {
  wood: {
    id: "wood",
    name: "Madeira",
    category: "natural",
    iconSrc: HUD_ASSETS.iconWood,
    description: "Material básico obtido de árvores.",
    acquired: "Cortar madeira nas árvores da vila.",
    usedIn: ["Construções"],
    stockKey: "wood",
    optics: { boxScale: 1, offsetX: 0, offsetY: 0 },
  },
  stone: {
    id: "stone",
    name: "Pedra",
    category: "mineral",
    iconSrc: HUD_ASSETS.iconStone,
    description: "Material básico obtido de pedras.",
    acquired: "Minerar pedra nos rochedos da vila.",
    usedIn: ["Construções"],
    stockKey: "stone",
    optics: { boxScale: 1, offsetX: 0, offsetY: 0 },
  },
  vine: {
    id: "vine",
    name: "Videira",
    category: "natural",
    iconSrc: HUD_ASSETS.inventoryVine,
    description: "Cipó que às vezes cai ao cortar madeira.",
    acquired: "Bônus ocasional ao coletar madeira.",
    usedIn: [],
    stockKey: "vine",
    optics: { boxScale: 0.82, offsetX: 0, offsetY: 2 },
    iconNative: { width: 47, height: 31 },
  },
  food: {
    id: "food",
    name: "Alimento",
    category: "natural",
    iconSrc: HUD_ASSETS.inventoryFood,
    description: "Estoque de alimento da vila. O ícone de cenoura é só visual, não um item de cenoura.",
    acquired: "Colheita nas hortas, entregue no depósito.",
    usedIn: ["Alimentar slimes"],
    stockKey: "food",
    optics: { boxScale: 0.88, offsetX: 0, offsetY: 1 },
    iconNative: { width: 28, height: 27 },
  },
  copper_ore: {
    id: "copper_ore",
    name: "Minério de cobre",
    category: "mineral",
    iconSrc: HUD_ASSETS.inventoryCopperOre,
    description: "Pedra bruta com veios de cobre, minerada em depósitos da vila.",
    acquired: "Minerar depósitos de cobre com a ação Mining.",
    usedIn: [],
    stockKey: "copperOre",
    optics: { boxScale: 0.9, offsetX: 0, offsetY: 1 },
    iconNative: { width: 33, height: 22 },
  },
  copper_ingot: {
    id: "copper_ingot",
    name: "Lingote de cobre",
    category: "mineral",
    iconSrc: HUD_ASSETS.inventoryCopperIngot,
    description: "Cobre fundido em barra. Ainda não é obtível na vila.",
    acquired: "Ainda não obtível. Sem fundição nesta versão.",
    usedIn: [],
    stockKey: null,
    optics: { boxScale: 0.9, offsetX: 0, offsetY: 1 },
    iconNative: { width: 27, height: 20 },
  },
  shell: {
    id: "shell",
    name: "Concha",
    category: "marine",
    iconSrc: HUD_ASSETS.inventoryShell,
    description: "Concha encontrada ao inspecionar a margem da água.",
    acquired: "Inspecionar a margem com a ação Inspect shore.",
    usedIn: [],
    stockKey: "shell",
    optics: { boxScale: 0.88, offsetX: 0, offsetY: 1 },
    iconNative: { width: 28, height: 26 },
  },
  coral: {
    id: "coral",
    name: "Coral",
    category: "marine",
    iconSrc: HUD_ASSETS.inventoryCoral,
    description: "Coral visível em água rasa, coletado da margem. Ainda sem uso definido.",
    acquired: "Coletar coral visível na água rasa a partir da margem.",
    usedIn: [],
    stockKey: "coral",
    optics: { boxScale: 0.72, offsetX: 0, offsetY: 1 },
    iconNative: { width: 65, height: 65 },
  },
  foliage: {
    id: "foliage",
    name: "Folhagem",
    category: "natural",
    iconSrc: HUD_ASSETS.inventoryFoliage,
    description: "Folhas e ramos leves coletados sem derrubar a árvore.",
    acquired: "Coletar folhagem nas árvores da vila.",
    usedIn: [],
    stockKey: "foliage",
    optics: { boxScale: 0.78, offsetX: 0, offsetY: 1 },
    iconNative: { width: 60, height: 39 },
  },
};

export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategoryId, string> = {
  all: "Todos",
  natural: "Natural",
  mineral: "Mineral",
  marine: "Marinho",
};

export const INVENTORY_MODE_LABELS: Record<InventoryHubMode, string> = {
  stock: "Estoque",
  catalog: "Catálogo",
};

/** Default stars: live stock materials only. */
export const DEFAULT_INVENTORY_FAVORITES: readonly InventoryItemId[] = [
  "wood",
  "stone",
  "vine",
  "food",
];

export const STOCKABLE_INVENTORY_ITEM_IDS: readonly InventoryItemId[] = INVENTORY_ITEM_IDS.filter(
  (id) => INVENTORY_ITEMS[id].stockKey !== null,
);

export function isInventoryItemId(value: string): value is InventoryItemId {
  return (INVENTORY_ITEM_IDS as readonly string[]).includes(value);
}

export function isStockableInventoryItem(id: InventoryItemId): boolean {
  return INVENTORY_ITEMS[id].stockKey !== null;
}

export function inventoryItemOptics(id: InventoryItemId): InventoryItemOptics {
  return INVENTORY_ITEMS[id].optics ?? { boxScale: 1, offsetX: 0, offsetY: 0 };
}
