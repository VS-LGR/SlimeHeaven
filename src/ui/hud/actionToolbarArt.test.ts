import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ACTION_TOOLS } from "./actionTools";
import {
  ACTION_TOOLBAR_ART_FILES,
  ACTION_TOOLBAR_ICON_FILES,
  HUD_ASSET_FILES,
  HUD_ASSET_SIZES,
  HUD_ASSETS,
} from "./hudAssets";
import {
  HUD_LAYOUT,
  actionToolbarBaseSize,
  selectedOverlayMatchesSlot,
  selectedOverlayStaysRegistered,
  toolbarHitboxStyle,
  toolbarIconStyle,
  toolbarSelectedStyle,
  toolbarSlotRect,
  toolbarUsesNativeArtworkSize,
} from "./hudLayout";

function pngSize(path: string): { width: number; height: number } {
  const buffer = readFileSync(path);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("official action toolbar artwork 05.4C addendum", () => {
  const toolbarSource = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
  const toolbar = HUD_LAYOUT.actionToolbar;

  it("preserves official toolbar and selected-state asset dimensions", () => {
    expect(HUD_ASSETS.toolbar).toBe("/assets/UI/UI_Icon_ToolBar.png");
    expect(HUD_ASSETS.toolbarSelected).toBe("/assets/UI/UI_Icon_ToolBar_Selected.png");
    expect(pngSize(HUD_ASSET_FILES.toolbar)).toEqual({ width: 626, height: 126 });
    expect(pngSize(HUD_ASSET_FILES.toolbarSelected)).toEqual({ width: 71, height: 71 });
    expect(pngSize(ACTION_TOOLBAR_ART_FILES.toolbar)).toEqual(HUD_ASSET_SIZES.toolbar);
    expect(pngSize(ACTION_TOOLBAR_ART_FILES.selected)).toEqual(HUD_ASSET_SIZES.toolbarSelected);
    expect(toolbarUsesNativeArtworkSize()).toBe(true);
  });

  it("does not modify the official toolbar PNG bytes", () => {
    expect(sha256(HUD_ASSET_FILES.toolbar)).toBe(
      "05e28932080c6b27e2fcf8550b5d72369f06749836f898e2255eac6b0e30dbbe",
    );
    expect(sha256(HUD_ASSET_FILES.toolbarSelected)).toBe(
      "dd16bc4a1311c856dcb2337deadb96eae00aed9847bb7b6d3dd1ed09a670422d",
    );
    expect(sha256(ACTION_TOOLBAR_ICON_FILES.planting)).toBe(
      "173c1d4b1597f3a5ff9c7f3f8798f68c9c482471a3d6e5608cf0c1ae2fe6010e",
    );
  });

  it("maps the five painted slots to Plant, Chop, Mine, Fish, and Build", () => {
    expect(toolbar.primaryCount).toBe(5);
    expect(toolbar.slots).toHaveLength(5);
    expect(ACTION_TOOLS).toHaveLength(5);
    expect(ACTION_TOOLS.map((tool) => tool.id)).toEqual(["plant", "chop", "mine", "fish", "build"]);
    expect(toolbar.slots.map((_, index) => toolbarSlotRect(index))).toEqual([
      { x: 87, y: 35, width: 71, height: 71 },
      { x: 183, y: 35, width: 71, height: 71 },
      { x: 279, y: 35, width: 71, height: 71 },
      { x: 375, y: 35, width: 71, height: 71 },
      { x: 471, y: 35, width: 71, height: 71 },
    ]);
    expect(toolbarSource).toMatch(/data-hud-toolbar-slot=\{index \+ 1\}/);
    expect(toolbarSource).not.toMatch(/UI_Icon_Technique|UI_Icon_Strength|UI_Icon_Instintic|UI_Icon_Luck|UI_Icon_Speak/);
  });

  it("keeps action icons in toolbar-local coordinates with configurable sizing", () => {
    const presentations = Object.values(toolbar.icons);
    expect(presentations).toHaveLength(5);
    ACTION_TOOLS.forEach((tool, index) => {
      const slot = toolbarSlotRect(index);
      const icon = toolbarIconStyle(slot, toolbar.icons[tool.id]);
      expect(icon.left).toBeGreaterThanOrEqual(slot.x);
      expect(icon.top).toBeGreaterThanOrEqual(slot.y - 2);
      expect(icon.left + icon.width).toBeLessThanOrEqual(slot.x + slot.width + 2);
      expect(icon.top + icon.height).toBeLessThanOrEqual(slot.y + slot.height + 2);
      expect(icon.width).toBeLessThan(75);
      expect(icon.width).toBeGreaterThan(50);
    });
    expect(toolbar.icons.mine.canvasSize).not.toBe(toolbar.icons.fish.canvasSize);
    expect(toolbarSource).toMatch(/toolbarIconStyle\(slot, presentation\)/);
  });

  it("registers the selected overlay to the painted slot before and after scale", () => {
    expect(toolbar.selected.layer).toBe("behind");
    for (const slot of toolbar.slots) {
      expect(selectedOverlayMatchesSlot(slot)).toBe(true);
      const hitbox = toolbarHitboxStyle(slot);
      const selected = toolbarSelectedStyle(slot);
      expect(hitbox).toEqual({
        position: "absolute",
        left: selected.left,
        top: selected.top,
        width: selected.width,
        height: selected.height,
      });
    }
    expect(selectedOverlayStaysRegistered(1)).toBe(true);
    expect(selectedOverlayStaysRegistered(0.85)).toBe(true);
    expect(selectedOverlayStaysRegistered(1.4)).toBe(true);
    expect(toolbarSource).toMatch(/toolbarSelectedStyle\(slot\)/);
    expect(toolbarSource).toMatch(/toolbarHitboxStyle\(slot\)/);
    expect(toolbarSource).toMatch(/data-hud-selected-overlay/);
    expect(toolbarSource).not.toMatch(/inset 0 0 0 3px/);
  });

  it("renders at most one selected overlay and none when idle", () => {
    expect(toolbarSource).toMatch(/\{selected \? \(/);
    expect(toolbarSource).toMatch(/isActionToolSelected\(worldTool, tool\)/);
    expect(toolbarSource.match(/data-hud-selected-overlay/g)?.length).toBe(1);
  });

  it("uses slot hitboxes rather than icon opaque pixels", () => {
    for (const slot of toolbar.slots) {
      const hitbox = toolbarHitboxStyle(slot);
      expect(hitbox.width).toBe(71);
      expect(hitbox.height).toBe(71);
    }
    expect(toolbarSource).toMatch(/toolbarHitboxStyle\(slot\)/);
    expect(toolbarSource).toMatch(/pointer-events-auto absolute left-0/);
    expect(toolbarSource).toMatch(/data-hud-toolbar-card="true"/);
    expect(toolbarSource).toMatch(/onPointerDown=\{stopHudPointer\}/);
  });

  it("keeps Remove Farm and Collection accessible outside the five official slots", () => {
    expect(toolbarSource).toMatch(/Remove Farm/);
    expect(toolbarSource).toMatch(/Collection/);
    expect(toolbarSource).toMatch(/data-hud-toolbar-secondary="true"/);
    expect(toolbarSource).toMatch(/farmFamily/);
    expect(toolbarSource).not.toMatch(/slots\.length > 5|primaryCount:\s*7/);
    expect(actionToolbarBaseSize()).toEqual({
      width: 626,
      height: 126 + toolbar.secondary.gap + toolbar.secondary.height,
    });
  });

  it("does not recreate the toolbar with generic CSS boxes or leftover lime chrome", () => {
    expect(toolbarSource).toMatch(/HUD_ASSETS\.toolbar/);
    expect(toolbarSource).toMatch(/transform: "scale\(var\(--hud-toolbar-scale\)\)"/);
    expect(toolbarSource).toMatch(/transformOrigin: "bottom center"/);
    expect(toolbarSource).toMatch(/bottom: 0/);
    expect(toolbarSource).not.toMatch(/boxShadow: `inset 0 0 0 2px \$\{chrome\.wood\}, 0 2px 0/);
    expect(toolbarSource).not.toMatch(/#84cc16|#65a30d|bg-lime/);
    expect(toolbarSource).not.toMatch(/buttonSize|iconSize: 48/);
  });
});
