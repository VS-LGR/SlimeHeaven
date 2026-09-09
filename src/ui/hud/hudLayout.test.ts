import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  cardsUseNativeArtworkSize,
  childrenAreCardLocal,
  computeLeftHudScale,
  computeRightHudScale,
  computeViewportScale,
  HUD_LAYOUT,
  HUD_LAYOUT_DEBUG,
  HUD_SCALE_CONFIG,
  HUD_SCALE_PRESETS,
  hudSafeInset,
  hudScaleDiagnostics,
  panelsInsideViewport,
  rectsOverlap,
  requestedCardScale,
  requestedHudScale,
  resolveHudScale,
  resourceValueFitsSlot,
  slotStyle,
  topPanelRects,
} from "./hudLayout";
import { HUD_ASSET_SIZES } from "./hudAssets";

const VIEWPORTS = [
  { width: 2048, height: 1150 },
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
] as const;

describe("HUD layout 05.4A.4 scale and cards", () => {
  it("keeps Top Left and Top Right independently scalable through config multipliers", () => {
    expect(HUD_SCALE_CONFIG.topLeftMultiplier).toBe(1);
    expect(HUD_SCALE_CONFIG.topRightMultiplier).toBe(1);
    expect(requestedCardScale("left")).toBe(requestedHudScale() * HUD_SCALE_CONFIG.topLeftMultiplier);
    expect(requestedCardScale("right")).toBe(requestedHudScale() * HUD_SCALE_CONFIG.topRightMultiplier);
    const split = {
      ...HUD_SCALE_CONFIG,
      topLeftMultiplier: 1.05,
      topRightMultiplier: 1,
    };
    expect(requestedCardScale("left", split)).not.toBe(requestedCardScale("right", split));
    expect(resolveHudScale(1920, 1080, split).leftApplied).not.toBe(
      resolveHudScale(1920, 1080, split).rightApplied,
    );
    expect(computeViewportScale(1920, 1080)).toBe(1);
  });

  it("positions internals in card-local pixels, not viewport percentages", () => {
    expect(childrenAreCardLocal()).toBe(true);
    const sunSlot = slotStyle(HUD_LAYOUT.topLeft.weather.slot);
    expect(sunSlot.left).toBe(HUD_LAYOUT.topLeft.weather.slot.x);
    expect(sunSlot.overflow).toBe("hidden");
    expect(typeof sunSlot.left).toBe("number");
    const source = [
      readFileSync("src/ui/hud/TopLeftStatus.tsx", "utf8"),
      readFileSync("src/ui/hud/TopRightResources.tsx", "utf8"),
      readFileSync("src/ui/hud/HudCard.tsx", "utf8"),
    ].join("\n");
    expect(source).not.toMatch(/position:\s*["']fixed["']/);
    expect(source).toMatch(/data-hud-card-content/);
    expect(source).toMatch(/transform:\s*`scale\(var\(\$\{scaleVar\}\)\)`/);
  });

  it("declares clipped safe slots for every required HUD region", () => {
    const leftSlots = [
      HUD_LAYOUT.topLeft.weather.slot,
      HUD_LAYOUT.topLeft.day.slot,
      HUD_LAYOUT.topLeft.time.slot,
      HUD_LAYOUT.topLeft.season.slot,
    ];
    const rightSlots = [
      HUD_LAYOUT.topRight.wood.slot,
      HUD_LAYOUT.topRight.stone.slot,
      HUD_LAYOUT.topRight.food.slot,
      HUD_LAYOUT.topRight.harmony.slot,
      HUD_LAYOUT.topRight.settings.slot,
    ];
    for (const slot of [...leftSlots, ...rightSlots]) {
      expect(slot.overflow).toBe("hidden");
      expect(slot.width).toBeGreaterThan(0);
      expect(slot.height).toBeGreaterThan(0);
    }
    expect(HUD_LAYOUT.topLeft.weather.icon.width).not.toBe(HUD_LAYOUT.topRight.wood.icon.width);
    expect(HUD_LAYOUT.topLeft.time.text.fontSize).not.toBe(HUD_LAYOUT.topLeft.day.text.fontSize);
    expect(HUD_LAYOUT.topLeft.time.text.lineHeight).not.toBe(HUD_LAYOUT.topLeft.season.text.lineHeight);
    expect(HUD_LAYOUT.topRight.wood.icon.width).not.toBe(HUD_LAYOUT.topRight.harmony.icon.width);
    expect(HUD_LAYOUT.topRight.settings.icon.width).not.toBe(HUD_LAYOUT.topRight.wood.icon.width);
  });

  it("keeps resource values inside their slots through 999", () => {
    for (const value of ["0", "9", "99", "999"]) {
      expect(resourceValueFitsSlot(value, HUD_LAYOUT.topRight.wood.value)).toBe(true);
      expect(resourceValueFitsSlot(value, HUD_LAYOUT.topRight.stone.value)).toBe(true);
      expect(resourceValueFitsSlot(value, HUD_LAYOUT.topRight.food.value)).toBe(true);
    }
    expect(HUD_LAYOUT.topRight.wood.slot.x + HUD_LAYOUT.topRight.wood.slot.width).toBeLessThanOrEqual(
      HUD_LAYOUT.topRight.stone.slot.x,
    );
    expect(HUD_LAYOUT.topRight.stone.slot.x + HUD_LAYOUT.topRight.stone.slot.width).toBeLessThanOrEqual(
      HUD_LAYOUT.topRight.food.slot.x,
    );
    expect(HUD_LAYOUT.topRight.food.slot.x + HUD_LAYOUT.topRight.food.slot.width).toBeLessThanOrEqual(
      HUD_LAYOUT.topRight.harmony.slot.x,
    );
  });

  it("anchors scaled cards to opposite corners without overlap", () => {
    for (const viewport of VIEWPORTS) {
      const { left, right, safeX, safeY } = topPanelRects(viewport.width, viewport.height);
      expect(left.x).toBe(safeX);
      expect(left.y).toBe(safeY);
      expect(right.y).toBe(safeY);
      expect(right.x + right.width).toBeCloseTo(viewport.width - safeX, 5);
      expect(rectsOverlap(left, right)).toBe(false);
      expect(panelsInsideViewport(viewport.width, viewport.height, left, right)).toBe(true);
    }
    expect(hudSafeInset(1920, 1080)).toBe(HUD_SCALE_CONFIG.minimumViewportMargin);
  });

  it("uses PNG native size as the card-local reference, not as a CSS stretch of children", () => {
    expect(HUD_LAYOUT_DEBUG).toBe(false);
    expect(cardsUseNativeArtworkSize()).toBe(true);
    expect(HUD_LAYOUT.topLeft.card.width).toBe(HUD_ASSET_SIZES.topLeft.width);
    expect(HUD_LAYOUT.topRight.card.width).toBe(HUD_ASSET_SIZES.topRight.width);
    expect(HUD_LAYOUT.topLeft.weather.icon.width).not.toBe(HUD_ASSET_SIZES.sun.width);
    expect(HUD_LAYOUT.topRight.wood.icon.width).not.toBe(HUD_ASSET_SIZES.icon.width);
  });
});

describe("HUD scale configuration 05.4A.4.1", () => {
  it("defaults to 1.25 and keeps 2x only as an optional preset", () => {
    expect(HUD_SCALE_PRESETS).toEqual({
      compact: 0.85,
      normal: 1,
      large: 1.25,
      extraLarge: 1.5,
      double: 2,
    });
    expect(HUD_SCALE_CONFIG.defaultScale).toBe(1.25);
    expect(HUD_SCALE_CONFIG.preset).toBe("large");
    expect(HUD_SCALE_CONFIG.presets.large).toBe(1.25);
    expect(HUD_SCALE_CONFIG.presets.double).toBe(2);
    expect(HUD_SCALE_CONFIG.defaultScale).not.toBe(HUD_SCALE_CONFIG.presets.double);
    expect(requestedHudScale()).toBe(1.25);
    expect("quadruple" in HUD_SCALE_PRESETS).toBe(false);
  });

  it("renders the 1.25 desktop targets without occupying most of the width", () => {
    const resolved = resolveHudScale(1920, 1080);
    expect(resolved.requestedGlobal).toBe(1.25);
    expect(resolved.leftApplied).toBe(1.25);
    expect(resolved.rightApplied).toBe(1.25);
    expect(resolved.limited).toBe(false);
    expect(computeLeftHudScale(1920, 1080)).toBe(1.25);
    expect(computeRightHudScale(1920, 1080)).toBe(1.25);
    const { left, right } = topPanelRects(1920, 1080);
    expect(left.width).toBeCloseTo(303.75);
    expect(left.height).toBeCloseTo(193.75);
    expect(right.width).toBeCloseTo(900);
    expect(right.height).toBeCloseTo(181.25);
    expect(right.width / 1920).toBeGreaterThanOrEqual(0.44);
    expect(right.width / 1920).toBeLessThanOrEqual(0.48);
    for (const viewport of VIEWPORTS) {
      const atViewport = resolveHudScale(viewport.width, viewport.height);
      expect(atViewport.requestedGlobal).toBe(1.25);
      expect(atViewport.leftApplied).toBeLessThanOrEqual(1.25 + 1e-9);
      expect(atViewport.rightApplied).toBeLessThanOrEqual(1.25 + 1e-9);
    }
  });

  it("accepts an arbitrary positive numeric scale override", () => {
    const resolved = resolveHudScale(1920, 1080, { ...HUD_SCALE_CONFIG, scale: 1.7 });
    expect(resolved.requestedGlobal).toBe(1.7);
    expect(resolved.leftApplied).toBeCloseTo(1.7);
    expect(resolved.rightApplied).toBeCloseTo(1.7);
  });

  it("applies safe-fit instead of overlap when 2x cannot fit a narrow viewport", () => {
    const config = { ...HUD_SCALE_CONFIG, defaultScale: 2, preset: "double" as const, scale: 2 };
    const resolved = resolveHudScale(1280, 720, config);
    expect(resolved.requestedGlobal).toBe(2);
    expect(resolved.leftApplied).toBeLessThan(2);
    expect(resolved.limited).toBe(true);
    expect(resolved.reason).toBe("viewport safe-fit");
    expect(hudScaleDiagnostics(resolved)).toMatch(/HUD requested scale: 2/);
    expect(hudScaleDiagnostics(resolved)).toMatch(/viewport safe-fit/);
    const { left, right } = topPanelRects(1280, 720, config);
    expect(rectsOverlap(left, right)).toBe(false);
    expect(panelsInsideViewport(1280, 720, left, right)).toBe(true);
  });

  it("does not silently shrink the requested scale when it already fits", () => {
    const compact = resolveHudScale(1920, 1080, { ...HUD_SCALE_CONFIG, preset: "normal", scale: 1 });
    expect(compact.leftApplied).toBe(1);
    expect(compact.limited).toBe(false);
    const large = resolveHudScale(1920, 1080, { ...HUD_SCALE_CONFIG, preset: "large", scale: 1.25 });
    expect(large.leftApplied).toBe(1.25);
    expect(large.limited).toBe(false);
  });

  it("does not derive HUD scale from camera zoom", () => {
    const hudLayout = readFileSync("src/ui/hud/hudLayout.ts", "utf8");
    const useHudScale = readFileSync("src/ui/hud/useHudScale.ts", "utf8");
    expect(hudLayout).not.toMatch(/camera\.zoom/);
    expect(useHudScale).not.toMatch(/camera\.zoom/);
    expect(useHudScale).not.toMatch(/wheel/);
    expect(useHudScale).toMatch(/ResizeObserver/);
  });
});
