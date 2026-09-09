import { HUD_ASSET_SIZES } from "./hudAssets";

/** Developer-only slot outlines. Keep false in production UI. */
export const HUD_LAYOUT_DEBUG = false;

export const HUD_REFERENCE_WIDTH = 1920;
export const HUD_REFERENCE_HEIGHT = 1080;
export const HUD_SAFE_INSET = 12;

export const HUD_SCALE_PRESETS = {
  compact: 0.85,
  normal: 1,
  large: 1.25,
  extraLarge: 1.5,
  double: 2,
} as const;

export type HudScalePreset = keyof typeof HUD_SCALE_PRESETS;

export type HudScaleFitReason = "requested" | "viewport safe-fit";

/**
 * Developer-facing HUD size. Change `defaultScale`, `preset`, `scale`, or the
 * multipliers here instead of editing React/CSS. Not an in-game player setting.
 * `double` is an optional development/accessibility preset, not the default.
 */
export const HUD_SCALE_CONFIG = {
  defaultScale: 1.25,
  preset: "large" as HudScalePreset,
  presets: HUD_SCALE_PRESETS,
  /** When set to a positive number, overrides `defaultScale` and `preset`. */
  scale: undefined as number | undefined,
  topLeftMultiplier: 1,
  topRightMultiplier: 1,
  minimumViewportMargin: 16,
  cardGap: 8,
};

export type HudScaleConfig = typeof HUD_SCALE_CONFIG;

export type HudScaleResolution = {
  preset: HudScalePreset | string;
  requestedGlobal: number;
  leftRequested: number;
  rightRequested: number;
  leftApplied: number;
  rightApplied: number;
  fitFactor: number;
  limited: boolean;
  reason: HudScaleFitReason;
};

export type HudAnchor = "top-left" | "top-right";
export type HudAlign = "left" | "center" | "right";

export type HudCardConfig = {
  anchor: HudAnchor;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  /** Extra multiplier on top of viewportScale. */
  scale: number;
  scaleMin: number;
  scaleMax: number;
};

export type HudSlotConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  overflow: "hidden" | "visible";
};

export type HudImageConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

export type HudTextConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  align: HudAlign;
  color: string;
  scale: number;
  shadow?: string;
};

export type HudResourceGroupConfig = {
  slot: HudSlotConfig;
  icon: HudImageConfig;
  value: HudTextConfig;
};

/**
 * Card-local pixels match the source PNG (243×155 / 720×145).
 * Cream regions were measured from the artwork:
 *   Top Left day  123,42 91×22
 *   Top Left time  123,66 91×23
 *   Top Left season 49,122 151×22
 *   Top Right cream 46,45 544×61
 *   Top Right settings tab ~600,22 108×110
 */
export const HUD_LAYOUT = {
  viewport: {
    referenceWidth: HUD_REFERENCE_WIDTH,
    referenceHeight: HUD_REFERENCE_HEIGHT,
    safeInset: HUD_SAFE_INSET,
  },
  topLeft: {
    card: {
      anchor: "top-left",
      offsetX: HUD_SAFE_INSET,
      offsetY: HUD_SAFE_INSET,
      width: HUD_ASSET_SIZES.topLeft.width,
      height: HUD_ASSET_SIZES.topLeft.height,
      scale: 1,
      scaleMin: 0.84,
      scaleMax: 1,
    } satisfies HudCardConfig,
    weather: {
      slot: { x: 10, y: 18, width: 108, height: 96, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 14, y: 22, width: 82, height: 78, scale: 1 } satisfies HudImageConfig,
    },
    day: {
      slot: { x: 125, y: 43, width: 87, height: 19, overflow: "hidden" } satisfies HudSlotConfig,
      text: {
        x: 125,
        y: 43,
        width: 87,
        height: 19,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
        fontWeight: 800,
        align: "center",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    },
    time: {
      slot: { x: 125, y: 66, width: 87, height: 20, overflow: "hidden" } satisfies HudSlotConfig,
      text: {
        x: 125,
        y: 66,
        width: 87,
        height: 20,
        fontSize: 13,
        lineHeight: 14,
        letterSpacing: 0,
        fontWeight: 800,
        align: "center",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    },
    season: {
      slot: { x: 52, y: 123, width: 144, height: 20, overflow: "hidden" } satisfies HudSlotConfig,
      flower: { x: 58, y: 124, width: 16, height: 16, scale: 1 } satisfies HudImageConfig,
      text: {
        x: 76,
        y: 123,
        width: 112,
        height: 20,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.25,
        fontWeight: 700,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    },
  },
  topRight: {
    card: {
      anchor: "top-right",
      offsetX: HUD_SAFE_INSET,
      offsetY: HUD_SAFE_INSET,
      width: HUD_ASSET_SIZES.topRight.width,
      height: HUD_ASSET_SIZES.topRight.height,
      scale: 1,
      scaleMin: 0.72,
      scaleMax: 1,
    } satisfies HudCardConfig,
    wood: {
      slot: { x: 52, y: 47, width: 128, height: 57, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 54, y: 50, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 104,
        y: 47,
        width: 72,
        height: 57,
        fontSize: 22,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: 800,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    } satisfies HudResourceGroupConfig,
    stone: {
      slot: { x: 184, y: 47, width: 128, height: 57, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 186, y: 50, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 236,
        y: 47,
        width: 72,
        height: 57,
        fontSize: 22,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: 800,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    } satisfies HudResourceGroupConfig,
    food: {
      slot: { x: 316, y: 47, width: 128, height: 57, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 318, y: 50, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 368,
        y: 47,
        width: 72,
        height: 57,
        fontSize: 22,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: 800,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    } satisfies HudResourceGroupConfig,
    harmony: {
      slot: { x: 452, y: 47, width: 130, height: 57, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 454, y: 52, width: 26, height: 26, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 484,
        y: 48,
        width: 92,
        height: 26,
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0,
        fontWeight: 800,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
      label: {
        x: 484,
        y: 74,
        width: 92,
        height: 22,
        fontSize: 11,
        lineHeight: 14,
        letterSpacing: 0.15,
        fontWeight: 700,
        align: "left",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    },
    settings: {
      slot: { x: 616, y: 36, width: 78, height: 78, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 627, y: 47, width: 56, height: 56, scale: 1 } satisfies HudImageConfig,
    },
  },
} as const;

export type HudScaleVar = "--hud-left-scale" | "--hud-right-scale";

export function computeViewportScale(viewportWidth: number, viewportHeight: number): number {
  return Math.min(
    viewportWidth / HUD_LAYOUT.viewport.referenceWidth,
    viewportHeight / HUD_LAYOUT.viewport.referenceHeight,
  );
}

export function requestedHudScale(config: HudScaleConfig = HUD_SCALE_CONFIG): number {
  if (typeof config.scale === "number" && Number.isFinite(config.scale) && config.scale > 0) {
    return config.scale;
  }
  if (
    typeof config.defaultScale === "number" &&
    Number.isFinite(config.defaultScale) &&
    config.defaultScale > 0
  ) {
    return config.defaultScale;
  }
  const named = config.presets[config.preset as HudScalePreset];
  if (typeof named === "number" && Number.isFinite(named) && named > 0) {
    return named;
  }
  return 1;
}

export function requestedCardScale(
  side: "left" | "right",
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): number {
  const global = requestedHudScale(config);
  const multiplier = side === "left" ? config.topLeftMultiplier : config.topRightMultiplier;
  return global * Math.max(0, multiplier);
}

export function resolveHudScale(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): HudScaleResolution {
  const requestedGlobal = requestedHudScale(config);
  const leftRequested = requestedCardScale("left", config);
  const rightRequested = requestedCardScale("right", config);
  const margin = Math.max(0, config.minimumViewportMargin);
  const gap = Math.max(0, config.cardGap);
  const leftBaseW = HUD_LAYOUT.topLeft.card.width;
  const leftBaseH = HUD_LAYOUT.topLeft.card.height;
  const rightBaseW = HUD_LAYOUT.topRight.card.width;
  const rightBaseH = HUD_LAYOUT.topRight.card.height;

  const neededWidth = leftBaseW * leftRequested + rightBaseW * rightRequested + gap;
  const availableWidth = Math.max(1, viewportWidth - 2 * margin);
  const widthFactor = neededWidth > availableWidth ? availableWidth / neededWidth : 1;

  const neededHeight = Math.max(leftBaseH * leftRequested, rightBaseH * rightRequested);
  const availableHeight = Math.max(1, viewportHeight - margin);
  const heightFactor = neededHeight > availableHeight ? availableHeight / neededHeight : 1;

  const fitFactor = Math.min(1, widthFactor, heightFactor);
  const limited = fitFactor < 1 - 1e-9;

  return {
    preset: config.preset,
    requestedGlobal,
    leftRequested,
    rightRequested,
    leftApplied: leftRequested * fitFactor,
    rightApplied: rightRequested * fitFactor,
    fitFactor,
    limited,
    reason: limited ? "viewport safe-fit" : "requested",
  };
}

export function hudScaleDiagnostics(resolution: HudScaleResolution): string {
  return [
    `HUD requested scale: ${resolution.requestedGlobal}`,
    `HUD applied scale: ${resolution.leftApplied === resolution.rightApplied ? resolution.leftApplied : `left ${resolution.leftApplied} / right ${resolution.rightApplied}`}`,
    `Reason: ${resolution.reason}`,
  ].join("\n");
}

export function computeLeftHudScale(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): number {
  return resolveHudScale(viewportWidth, viewportHeight, config).leftApplied;
}

export function computeRightHudScale(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): number {
  return resolveHudScale(viewportWidth, viewportHeight, config).rightApplied;
}

/** @deprecated Use computeLeftHudScale / computeRightHudScale. */
export function computeHudScale(viewportWidth: number, viewportHeight: number): number {
  return computeLeftHudScale(viewportWidth, viewportHeight);
}

export function hudSafeInset(
  _viewportWidth?: number,
  _viewportHeight?: number,
  insetStart = 0,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): number {
  return Math.max(insetStart, config.minimumViewportMargin);
}

export interface HudRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function topPanelRects(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): { left: HudRect; right: HudRect; safeX: number; safeY: number; leftScale: number; rightScale: number } {
  const resolved = resolveHudScale(viewportWidth, viewportHeight, config);
  const safe = hudSafeInset(viewportWidth, viewportHeight, 0, config);
  const leftWidth = HUD_LAYOUT.topLeft.card.width * resolved.leftApplied;
  const leftHeight = HUD_LAYOUT.topLeft.card.height * resolved.leftApplied;
  const rightWidth = HUD_LAYOUT.topRight.card.width * resolved.rightApplied;
  const rightHeight = HUD_LAYOUT.topRight.card.height * resolved.rightApplied;
  return {
    leftScale: resolved.leftApplied,
    rightScale: resolved.rightApplied,
    safeX: safe,
    safeY: safe,
    left: { x: safe, y: safe, width: leftWidth, height: leftHeight },
    right: {
      x: viewportWidth - safe - rightWidth,
      y: safe,
      width: rightWidth,
      height: rightHeight,
    },
  };
}

export function rectsOverlap(a: HudRect, b: HudRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function panelsInsideViewport(
  viewportWidth: number,
  viewportHeight: number,
  left: HudRect,
  right: HudRect,
): boolean {
  return (
    left.x >= 0 &&
    left.y >= 0 &&
    left.x + left.width <= viewportWidth &&
    left.y + left.height <= viewportHeight &&
    right.x >= 0 &&
    right.y >= 0 &&
    right.x + right.width <= viewportWidth &&
    right.y + right.height <= viewportHeight
  );
}

export function slotStyle(slot: HudSlotConfig): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
  overflow: "hidden" | "visible";
  display: "flex";
  alignItems: "center";
  minWidth: 0;
  maxWidth: number;
  boxSizing: "border-box";
} {
  return {
    position: "absolute",
    left: slot.x,
    top: slot.y,
    width: slot.width,
    height: slot.height,
    overflow: slot.overflow,
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    maxWidth: slot.width,
    boxSizing: "border-box",
  };
}

export function imageStyle(image: HudImageConfig): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    position: "absolute",
    left: image.x,
    top: image.y,
    width: image.width * image.scale,
    height: image.height * image.scale,
  };
}

export function textStyle(text: HudTextConfig): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: number;
  color: string;
  textAlign: HudAlign;
  overflow: "hidden";
  whiteSpace: "nowrap";
  display: "flex";
  alignItems: "center";
  justifyContent: "flex-start" | "center" | "flex-end";
  minWidth: 0;
} {
  const justify =
    text.align === "center" ? "center" : text.align === "right" ? "flex-end" : "flex-start";
  return {
    position: "absolute",
    left: text.x,
    top: text.y,
    width: text.width,
    height: text.height,
    fontSize: text.fontSize * text.scale,
    lineHeight: `${text.lineHeight * text.scale}px`,
    letterSpacing: `${text.letterSpacing}px`,
    fontWeight: text.fontWeight,
    color: text.color,
    textAlign: text.align,
    overflow: "hidden",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: justify,
    minWidth: 0,
  };
}

export function resourceValueFitsSlot(value: string, text: HudTextConfig): boolean {
  const glyph = text.fontSize * text.scale * 0.72;
  return value.length * glyph <= text.width;
}

export function cardsUseNativeArtworkSize(): boolean {
  return (
    HUD_LAYOUT.topLeft.card.width === HUD_ASSET_SIZES.topLeft.width &&
    HUD_LAYOUT.topLeft.card.height === HUD_ASSET_SIZES.topLeft.height &&
    HUD_LAYOUT.topRight.card.width === HUD_ASSET_SIZES.topRight.width &&
    HUD_LAYOUT.topRight.card.height === HUD_ASSET_SIZES.topRight.height
  );
}

export function childrenAreCardLocal(): boolean {
  const sun = imageStyle(HUD_LAYOUT.topLeft.weather.icon);
  return typeof sun.left === "number" && !Number.isNaN(sun.left);
}
