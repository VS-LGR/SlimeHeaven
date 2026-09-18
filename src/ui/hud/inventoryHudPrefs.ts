import {
  DEFAULT_INVENTORY_FAVORITES,
  INVENTORY_CATEGORY_IDS,
  INVENTORY_HUB_MODES,
  isInventoryItemId,
  type InventoryCategoryId,
  type InventoryHubMode,
  type InventoryItemId,
  type InventorySortId,
} from "./inventoryCatalog";
import { compactFavoriteIds } from "./inventoryHudModel";

export const INVENTORY_HUD_STORAGE_KEY = "slime-haven:inventory-hud.v3";
const LEGACY_STORAGE_KEYS = [
  "slime-haven:inventory-hud.v2",
  "slime-haven:inventory-hud.v1",
] as const;

export interface InventoryHudPrefs {
  favorites: InventoryItemId[];
  category: InventoryCategoryId;
  sort: InventorySortId;
  discoveredOnly: boolean;
  favoritesOnly: boolean;
  mode: InventoryHubMode;
}

const SORTS: InventorySortId[] = ["name", "category"];

export function defaultInventoryHudPrefs(): InventoryHudPrefs {
  return {
    favorites: [...DEFAULT_INVENTORY_FAVORITES],
    category: "all",
    sort: "name",
    discoveredOnly: false,
    favoritesOnly: false,
    mode: "stock",
  };
}

export function parseInventoryHudPrefs(raw: string | null | undefined): InventoryHudPrefs {
  const fallback = defaultInventoryHudPrefs();
  if (!raw) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(raw) as {
      favorites?: unknown;
      category?: string;
      sort?: string;
      discoveredOnly?: unknown;
      favoritesOnly?: unknown;
      mode?: string;
    };
    const favorites = compactFavoriteIds(
      Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((id): id is InventoryItemId => typeof id === "string" && isInventoryItemId(id))
        : fallback.favorites,
    );
    const category = INVENTORY_CATEGORY_IDS.includes(parsed.category as InventoryCategoryId)
      ? (parsed.category as InventoryCategoryId)
      : fallback.category;
    const sort = SORTS.includes(parsed.sort as InventorySortId)
      ? (parsed.sort as InventorySortId)
      : fallback.sort;
    const mode = INVENTORY_HUB_MODES.includes(parsed.mode as InventoryHubMode)
      ? (parsed.mode as InventoryHubMode)
      : fallback.mode;
    return {
      favorites,
      category,
      sort,
      discoveredOnly: parsed.discoveredOnly === true,
      favoritesOnly: parsed.favoritesOnly === true,
      mode,
    };
  } catch {
    return fallback;
  }
}

export function readInventoryHudPrefs(storage?: Pick<Storage, "getItem"> | null): InventoryHudPrefs {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    let raw = store?.getItem(INVENTORY_HUD_STORAGE_KEY) ?? null;
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        raw = store?.getItem(key) ?? null;
        if (raw) {
          break;
        }
      }
    }
    return parseInventoryHudPrefs(raw);
  } catch {
    return defaultInventoryHudPrefs();
  }
}

export function writeInventoryHudPrefs(
  prefs: InventoryHudPrefs,
  storage?: Pick<Storage, "setItem" | "removeItem"> | null,
): void {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    store?.setItem(INVENTORY_HUD_STORAGE_KEY, JSON.stringify(prefs));
    for (const key of LEGACY_STORAGE_KEYS) {
      store?.removeItem?.(key);
    }
  } catch {
    /* private mode / quota */
  }
}
