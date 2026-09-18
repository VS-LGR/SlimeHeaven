export const RESOURCE_IDS = {
  WOOD: "wood",
  STONE: "stone",
  FOOD: "food",
  VINE: "vine",
} as const;

export type ResourceType = (typeof RESOURCE_IDS)[keyof typeof RESOURCE_IDS];

export const RESOURCE_TYPE_LIST = [
  RESOURCE_IDS.WOOD,
  RESOURCE_IDS.STONE,
  RESOURCE_IDS.FOOD,
  RESOURCE_IDS.VINE,
] as const;

export interface ResourceStock {
  wood: number;
  stone: number;
  food: number;
  vine: number;
}

/** Sparse in-transit or spend/credit quantities. Missing keys are zero. */
export type ResourceBundle = Partial<Record<ResourceType, number>>;

export type CarriedResource = ResourceBundle;

export function emptyStock(): ResourceStock {
  return { wood: 0, stone: 0, food: 0, vine: 0 };
}

export function emptyDiscovery(): Record<ResourceType, boolean> {
  return { wood: false, stone: false, food: false, vine: false };
}

export function markStoredDiscovery(
  discovered: Record<ResourceType, boolean>,
  bundle: ResourceBundle,
): void {
  const normalized = normalizeBundle(bundle);
  for (const type of RESOURCE_TYPE_LIST) {
    if (normalized[type]) {
      discovered[type] = true;
    }
  }
}

export function creditStoredResources(
  stock: ResourceStock,
  discovered: Record<ResourceType, boolean>,
  bundle: ResourceBundle,
): void {
  creditBundle(stock, bundle);
  markStoredDiscovery(discovered, bundle);
}

export function emptyBundle(): ResourceBundle {
  return {};
}

export function bundleAmount(bundle: ResourceBundle | undefined, type: ResourceType): number {
  const raw = bundle?.[type];
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return 0;
  }
  return Math.max(0, Math.floor(raw));
}

export function hasCargo(bundle: ResourceBundle | undefined): boolean {
  if (!bundle) {
    return false;
  }
  for (const type of RESOURCE_TYPE_LIST) {
    if (bundleAmount(bundle, type) > 0) {
      return true;
    }
  }
  return false;
}

/** Drop non-finite, non-positive, and non-integer fractional parts. */
export function normalizeBundle(bundle: ResourceBundle): ResourceBundle {
  const result: ResourceBundle = {};
  for (const type of RESOURCE_TYPE_LIST) {
    const amount = bundleAmount(bundle, type);
    if (amount > 0) {
      result[type] = amount;
    }
  }
  return result;
}

export function creditBundle(stock: ResourceStock, bundle: ResourceBundle): void {
  const normalized = normalizeBundle(bundle);
  for (const type of RESOURCE_TYPE_LIST) {
    const amount = normalized[type];
    if (amount) {
      stock[type] += amount;
    }
  }
}

export function canConsumeBundle(stock: ResourceStock, bundle: ResourceBundle): boolean {
  const normalized = normalizeBundle(bundle);
  for (const type of RESOURCE_TYPE_LIST) {
    const amount = normalized[type];
    if (amount && stock[type] < amount) {
      return false;
    }
  }
  return true;
}

/** Debits the full bundle or nothing. Empty bundles succeed as a no-op. */
export function tryConsumeBundle(stock: ResourceStock, bundle: ResourceBundle): boolean {
  if (!canConsumeBundle(stock, bundle)) {
    return false;
  }
  const normalized = normalizeBundle(bundle);
  for (const type of RESOURCE_TYPE_LIST) {
    const amount = normalized[type];
    if (amount) {
      stock[type] -= amount;
    }
  }
  return true;
}

const CARRY_DISPLAY_ORDER = [
  RESOURCE_IDS.WOOD,
  RESOURCE_IDS.STONE,
  RESOURCE_IDS.FOOD,
] as const;

export function carryDisplayType(
  bundle: ResourceBundle | undefined,
): "wood" | "stone" | "food" | undefined {
  if (!bundle) {
    return undefined;
  }
  for (const type of CARRY_DISPLAY_ORDER) {
    if (bundleAmount(bundle, type) > 0) {
      return type;
    }
  }
  return undefined;
}

export function formatCargo(bundle: ResourceBundle | undefined): string {
  if (!hasCargo(bundle) || !bundle) {
    return "Nothing";
  }
  return RESOURCE_TYPE_LIST.filter((type) => bundleAmount(bundle, type) > 0)
    .map((type) => `${type} ×${bundleAmount(bundle, type)}`)
    .join(", ");
}
