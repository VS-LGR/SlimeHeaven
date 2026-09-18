import { HUD_ASSET_SIZES } from "./hudAssets";
import { inventoryItemOptics, type InventoryItemId, INVENTORY_ITEMS } from "./inventoryCatalog";

/** Cream/wood HUD ink matching the rest of the village chrome. */
export const INVENTORY_INK = "#3a2416";
export const INVENTORY_CREAM = "#FBDDAF";
export const INVENTORY_WOOD = "#6E3E2E";

export const INVENTORY_MOTION_MS = 260;
export const INVENTORY_REDUCED_MOTION_MS = 80;
export const INVENTORY_SETTLE_Y_PX = 14;

/** @deprecated Prefer inventoryItemOptics from catalog; kept for tests. */
export const COMPACT_ICON_OPTICS = {
  get wood() {
    return inventoryItemOptics("wood");
  },
  get stone() {
    return inventoryItemOptics("stone");
  },
  get vine() {
    return inventoryItemOptics("vine");
  },
  get food() {
    return inventoryItemOptics("food");
  },
} as const;

/** Expanded Large_Card content slots (card-local). Icon/name/qty centered; no favorite. */
export const LARGE_CARD_SLOTS = {
  icon: { x: 4, y: 2, width: 76, height: 42 },
  qty: { x: 24, y: 42, width: 36, height: 12 },
  name: { x: 4, y: 54, width: 76, height: 18 },
} as const;

/**
 * Backpack_UI.png 655×561.
 * Cream flood: x:62 y:157 w:510 h:352.
 * Title + discovery stacked; details are plain centered text (no plate).
 */
export const INVENTORY_LAYOUT = {
  button: {
    width: HUD_ASSET_SIZES.inventoryMinimized.width,
    height: HUD_ASSET_SIZES.inventoryMinimized.height,
  },
  panel: {
    width: HUD_ASSET_SIZES.inventoryBackpackPanel.width,
    height: HUD_ASSET_SIZES.inventoryBackpackPanel.height,
    cream: { x: 62, y: 157, width: 510, height: 352 },
    title: { x: 86, y: 160, width: 462, height: 28 },
    discovery: { x: 86, y: 186, width: 462, height: 20 },
    close: { x: 548, y: 162, width: 28, height: 28 },
    chrome: { x: 86, y: 210, width: 462, height: 34 },
    grid: { x: 86, y: 248, width: 462, height: 168 },
    details: { x: 86, y: 422, width: 462, height: 82 },
  },
  largeCard: HUD_ASSET_SIZES.inventoryLargeCard,
  wideCard: HUD_ASSET_SIZES.inventoryWideCard,
  short: HUD_ASSET_SIZES.inventoryShort,
  shortConfig: HUD_ASSET_SIZES.inventoryShortConfig,
  iconBox: 52,
} as const;

const FIT_MARGIN = 16;
const FIT_TOP_EXTRA = 8;
/** Native action-toolbar stack (card + secondary + gap) + cardGap — keep in sync with hudLayout. */
const FIT_TOOLBAR_RESERVE = 164 + 8;
/** Upscale the backpack when the viewport has spare room (readability). */
export const INVENTORY_FIT_MAX_SCALE = 1.28;

/**
 * Uniform scale so the full hanging artwork (cord included) fits the game viewport
 * above the toolbar, with safe insets. May exceed 1.0 on large displays.
 */
export function inventoryPanelFitScale(viewportWidth: number, viewportHeight: number): number {
  const { width, height } = INVENTORY_LAYOUT.panel;
  const availW = Math.max(160, viewportWidth - FIT_MARGIN * 2);
  const availH = Math.max(
    160,
    viewportHeight - FIT_MARGIN * 2 - FIT_TOP_EXTRA - FIT_TOOLBAR_RESERVE,
  );
  return Math.min(INVENTORY_FIT_MAX_SCALE, availW / width, availH / height);
}

export function inventoryPanelDisplaySize(
  viewportWidth: number,
  viewportHeight: number,
): { width: number; height: number; scale: number } {
  const scale = inventoryPanelFitScale(viewportWidth, viewportHeight);
  return {
    scale,
    width: Math.round(INVENTORY_LAYOUT.panel.width * scale),
    height: Math.round(INVENTORY_LAYOUT.panel.height * scale),
  };
}

export function scaleInventorySlot(
  slot: { x: number; y: number; width: number; height: number },
  scale: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.round(slot.x * scale),
    y: Math.round(slot.y * scale),
    width: Math.round(slot.width * scale),
    height: Math.round(slot.height * scale),
  };
}

/**
 * Draw size for a material icon inside a shared box. Preserves aspect ratio.
 */
export function inventoryIconDrawSize(
  id: InventoryItemId,
  box = INVENTORY_LAYOUT.iconBox,
): { width: number; height: number } {
  const optics = inventoryItemOptics(id);
  const target = Math.round(box * optics.boxScale);
  const def = INVENTORY_ITEMS[id];
  if (!def.iconNative) {
    return { width: target, height: target };
  }
  const native = def.iconNative;
  const scale = target / Math.max(native.width, native.height, 1);
  return {
    width: Math.round(native.width * scale),
    height: Math.round(native.height * scale),
  };
}

export function inventoryButtonWidth(): number {
  return INVENTORY_LAYOUT.button.width;
}

/** @deprecated Alias kept for older tests during migration. */
export const compactIconDrawSize = inventoryIconDrawSize;
