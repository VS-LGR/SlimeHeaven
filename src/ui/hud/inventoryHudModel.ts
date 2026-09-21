import type { ResourceStock, ResourceType } from "@/src/simulation/resources";
import {
  DEFAULT_INVENTORY_FAVORITES,
  INVENTORY_CATEGORY_IDS,
  INVENTORY_ITEM_IDS,
  INVENTORY_ITEMS,
  STOCKABLE_INVENTORY_ITEM_IDS,
  type InventoryCategoryId,
  type InventoryHubMode,
  type InventoryItemId,
  type InventorySortId,
} from "./inventoryCatalog";

export interface InventoryStockModel {
  wood: number;
  stone: number;
  vine: number;
  food: number;
  foliage: number;
  copperOre: number;
}

export interface InventoryDiscoveryModel {
  wood: boolean;
  stone: boolean;
  vine: boolean;
  food: boolean;
  foliage: boolean;
  copperOre: boolean;
}

export interface InventoryHudViewItem {
  id: InventoryItemId;
  name: string;
  iconSrc: string;
  quantity: number;
  favorite: boolean;
  discovered: boolean;
  collectable: boolean;
  locked: boolean;
  description: string;
  acquired: string;
  usedIn: string[];
  category: Exclude<InventoryCategoryId, "all">;
}

export function selectInventoryStockModel(
  snapshot: Pick<InventoryStockModel, "wood" | "stone" | "vine" | "food" | "foliage" | "copperOre">,
): InventoryStockModel {
  return {
    wood: snapshot.wood,
    stone: snapshot.stone,
    vine: snapshot.vine,
    food: snapshot.food,
    foliage: snapshot.foliage,
    copperOre: snapshot.copperOre,
  };
}

export function stockQuantity(stock: InventoryStockModel, id: InventoryItemId): number {
  const key = INVENTORY_ITEMS[id].stockKey;
  if (!key) {
    return 0;
  }
  return stock[key];
}

export function itemDiscovered(
  discovered: InventoryDiscoveryModel,
  id: InventoryItemId,
): boolean {
  const key = INVENTORY_ITEMS[id].stockKey;
  if (!key) {
    return false;
  }
  return discovered[key] === true;
}

export function toggleFavorite(
  favorites: readonly InventoryItemId[],
  id: InventoryItemId,
): InventoryItemId[] {
  if (favorites.includes(id)) {
    return favorites.filter((item) => item !== id);
  }
  return [...favorites, id];
}

export function compactFavoriteIds(
  favorites: readonly InventoryItemId[],
): InventoryItemId[] {
  const seen = new Set<InventoryItemId>();
  const ordered: InventoryItemId[] = [];
  for (const id of favorites) {
    if (!INVENTORY_ITEM_IDS.includes(id) || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ordered.push(id);
  }
  return ordered;
}

export function filterInventoryItems(options: {
  stock: InventoryStockModel;
  discovered: InventoryDiscoveryModel;
  favorites: readonly InventoryItemId[];
  category: InventoryCategoryId;
  sort: InventorySortId;
  discoveredOnly: boolean;
  favoritesOnly?: boolean;
  mode?: InventoryHubMode;
}): InventoryHudViewItem[] {
  const favoriteSet = new Set(compactFavoriteIds(options.favorites));
  const mode = options.mode ?? "stock";
  let ids = INVENTORY_ITEM_IDS.filter((id) => {
    const def = INVENTORY_ITEMS[id];
    if (mode === "stock" && def.stockKey === null) {
      return false;
    }
    if (options.favoritesOnly && !favoriteSet.has(id)) {
      return false;
    }
    if (options.category !== "all" && def.category !== options.category) {
      return false;
    }
    if (options.discoveredOnly && !itemDiscovered(options.discovered, id)) {
      return false;
    }
    return true;
  });
  ids = [...ids].sort((a, b) => {
    if (options.sort === "category") {
      const category = INVENTORY_ITEMS[a].category.localeCompare(INVENTORY_ITEMS[b].category);
      if (category !== 0) {
        return category;
      }
    }
    return INVENTORY_ITEMS[a].name.localeCompare(INVENTORY_ITEMS[b].name, "pt");
  });
  return ids.map((id) => viewItem(id, options.stock, options.discovered, favoriteSet));
}

function viewItem(
  id: InventoryItemId,
  stock: InventoryStockModel,
  discovered: InventoryDiscoveryModel,
  favoriteSet: Set<InventoryItemId>,
): InventoryHudViewItem {
  const def = INVENTORY_ITEMS[id];
  const collectable = def.stockKey !== null;
  const discoveredFlag = itemDiscovered(discovered, id);
  return {
    id,
    name: def.name,
    iconSrc: def.iconSrc,
    quantity: collectable ? stockQuantity(stock, id) : 0,
    favorite: favoriteSet.has(id),
    discovered: discoveredFlag,
    collectable,
    locked: !collectable || !discoveredFlag,
    description: def.description,
    acquired: def.acquired,
    usedIn: [...def.usedIn],
    category: def.category,
  };
}

export function stockableDiscoveryCount(discovered: InventoryDiscoveryModel): {
  count: number;
  total: number;
} {
  const total = STOCKABLE_INVENTORY_ITEM_IDS.length;
  const count = STOCKABLE_INVENTORY_ITEM_IDS.filter((id) => itemDiscovered(discovered, id)).length;
  return { count, total };
}

export function defaultDiscovery(): InventoryDiscoveryModel {
  return {
    wood: false,
    stone: false,
    vine: false,
    food: false,
    foliage: false,
    copperOre: false,
  };
}

export function discoveryFromStock(stock: ResourceStock): InventoryDiscoveryModel {
  return {
    wood: stock.wood > 0,
    stone: stock.stone > 0,
    vine: stock.vine > 0,
    food: stock.food > 0,
    foliage: stock.foliage > 0,
    copperOre: stock.copperOre > 0,
  };
}

export type { ResourceType };
export { DEFAULT_INVENTORY_FAVORITES, INVENTORY_CATEGORY_IDS, STOCKABLE_INVENTORY_ITEM_IDS };
