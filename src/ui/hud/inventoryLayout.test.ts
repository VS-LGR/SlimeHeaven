import { describe, expect, it } from "vitest";
import { HUD_ASSET_SIZES } from "./hudAssets";
import {
  COMPACT_ICON_OPTICS,
  inventoryButtonWidth,
  inventoryIconDrawSize,
  inventoryPanelDisplaySize,
  inventoryPanelFitScale,
  INVENTORY_LAYOUT,
  LARGE_CARD_SLOTS,
} from "./inventoryLayout";

describe("inventory layout measurements 05.6B.UI backpack hub", () => {
  it("locks Backpack_UI panel metrics and cream content slots", () => {
    expect(INVENTORY_LAYOUT.panel.width).toBe(655);
    expect(INVENTORY_LAYOUT.panel.height).toBe(561);
    expect(INVENTORY_LAYOUT.panel).toMatchObject({
      cream: { x: 62, y: 157, width: 510, height: 352 },
    });
    expect(HUD_ASSET_SIZES.inventoryBackpackPanel).toEqual({ width: 655, height: 561 });
    expect(inventoryButtonWidth()).toBe(121);
    const cream = INVENTORY_LAYOUT.panel.cream;
    const title = INVENTORY_LAYOUT.panel.title;
    const chrome = INVENTORY_LAYOUT.panel.chrome;
    const grid = INVENTORY_LAYOUT.panel.grid;
    const details = INVENTORY_LAYOUT.panel.details;
    expect(title.x).toBeGreaterThanOrEqual(cream.x);
    expect(chrome.y).toBeGreaterThan(title.y);
    expect(grid.height).toBeGreaterThanOrEqual(160);
    expect(details.y + details.height).toBeLessThanOrEqual(cream.y + cream.height);
    expect(LARGE_CARD_SLOTS.name.y).toBeGreaterThan(LARGE_CARD_SLOTS.qty.y);
    expect(LARGE_CARD_SLOTS.icon.width).toBeGreaterThan(60);
    expect("favorite" in LARGE_CARD_SLOTS).toBe(false);
    expect(COMPACT_ICON_OPTICS.vine.boxScale).toBeLessThan(1);
    expect(inventoryIconDrawSize("food").width).toBeLessThan(INVENTORY_LAYOUT.iconBox);
    expect(inventoryIconDrawSize("foliage").width).toBeLessThan(INVENTORY_LAYOUT.iconBox);
  });

  it("fits the full hanging artwork above the toolbar at 1920×1080 and 1280×720", () => {
    const toolbarReserve = 164 + 8;
    expect(inventoryPanelFitScale(1920, 1080)).toBeGreaterThan(1);
    expect(inventoryPanelFitScale(1920, 1080)).toBeLessThanOrEqual(1.28);
    const at1280 = inventoryPanelDisplaySize(1280, 720);
    expect(at1280.scale).toBeLessThan(1);
    expect(at1280.height).toBeLessThanOrEqual(720 - 32 - toolbarReserve);
    expect(at1280.width).toBeLessThanOrEqual(1280 - 32);
    expect(at1280.width / at1280.height).toBeCloseTo(655 / 561, 2);
  });
});
