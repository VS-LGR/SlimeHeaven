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
  /** Independent of Top Left / Top Right. Toolbar default is 1.0, not 1.25. */
  toolbarScale: 1,
  toolbarMultiplier: 1,
  /** Independent of Top Left / Top Right / toolbar. Native 368×586 is already tall. */
  slimeScale: 1,
  slimeMultiplier: 1,
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
  toolbarRequested: number;
  toolbarApplied: number;
  slimeRequested: number;
  slimeApplied: number;
  slimeStacksAboveToolbar: boolean;
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

export type ToolbarSlotRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ActionIconPresentation = {
  /** Rendered size of the authored 75×75 canvas in toolbar-local pixels. */
  canvasSize: number;
  /** Extra nudge after centering the canvas on the painted slot. */
  offsetX: number;
  offsetY: number;
};

export type ActionToolLayoutId = "plant" | "chop" | "mine" | "fish" | "build";

/**
 * Card-local pixels match the source PNG (243×155 / 730×159).
 * Cream regions were measured from the artwork:
 *   Top Left day  123,42 91×22
 *   Top Left time  123,66 91×23
 *   Top Left season 49,122 151×22
 *   Top Right cream 49,48 544×58
 *   Top Right settings gear 618,40 73×74
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
        lineHeight: 20,
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
      slot: { x: 52, y: 48, width: 128, height: 58, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 54, y: 53, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 104,
        y: 48,
        width: 72,
        height: 58,
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
      slot: { x: 184, y: 48, width: 128, height: 58, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 186, y: 53, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 236,
        y: 48,
        width: 72,
        height: 58,
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
      slot: { x: 316, y: 48, width: 128, height: 58, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 318, y: 53, width: 48, height: 48, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 368,
        y: 48,
        width: 72,
        height: 58,
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
      slot: { x: 452, y: 48, width: 100, height: 58, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 454, y: 53, width: 22, height: 22, scale: 1 } satisfies HudImageConfig,
      value: {
        x: 478,
        y: 49,
        width: 70,
        height: 18,
        fontSize: 13,
        lineHeight: 14,
        letterSpacing: 0,
        fontWeight: 800,
        align: "center",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
      label: {
        x: 454,
        y: 88,
        width: 96,
        height: 16,
        fontSize: 11,
        lineHeight: 14,
        letterSpacing: 0.15,
        fontWeight: 700,
        align: "center",
        color: "#3a2416",
        scale: 1,
      } satisfies HudTextConfig,
    },
    settings: {
      slot: { x: 618, y: 40, width: 73, height: 74, overflow: "hidden" } satisfies HudSlotConfig,
      icon: { x: 618, y: 40, width: 73, height: 74, scale: 1 } satisfies HudImageConfig,
    },
    /**
     * Compact still is Minimize47's opaque 316×128 plus the same 19px right pad as
     * UI_Top_Right.png so the gear stays on the expanded card's right edge.
     */
    collapsedCard: { width: 335, height: 159 },
    collapseButton: { x: 560, y: 56, width: 28, height: 42, iconSize: 18 },
    collapsedExpandButton: { x: 498, y: 63, width: 28, height: 28, iconSize: 16 },
  },
  /**
   * Official 626×126 toolbar card. Slot rects are toolbar-local pixels measured
   * from the painted recesses (centers 122.5 / 218.5 / 314.5 / 410.5 / 506.5,
   * y 70.5) with the 71×71 selected artwork registered on those centers.
   * Icon canvas sizes fit opaque bounds inside the selected frame; do not crop PNGs.
   */
  actionToolbar: {
    primaryCount: 5,
    card: {
      width: HUD_ASSET_SIZES.toolbar.width,
      height: HUD_ASSET_SIZES.toolbar.height,
    },
    selected: {
      width: HUD_ASSET_SIZES.toolbarSelected.width,
      height: HUD_ASSET_SIZES.toolbarSelected.height,
      layer: "behind" as const,
    },
    slots: [
      { x: 87, y: 35, width: 71, height: 71 },
      { x: 183, y: 35, width: 71, height: 71 },
      { x: 279, y: 35, width: 71, height: 71 },
      { x: 375, y: 35, width: 71, height: 71 },
      { x: 471, y: 35, width: 71, height: 71 },
    ] as const satisfies readonly ToolbarSlotRect[],
    icons: {
      plant: { canvasSize: 63, offsetX: 0, offsetY: 1 },
      chop: { canvasSize: 61, offsetX: -1, offsetY: 0 },
      mine: { canvasSize: 68, offsetX: 0, offsetY: 1 },
      fish: { canvasSize: 59, offsetX: 1, offsetY: -2 },
      build: { canvasSize: 62, offsetX: 0, offsetY: -1 },
    } as const satisfies Record<ActionToolLayoutId, ActionIconPresentation>,
    secondary: {
      height: 32,
      gap: 6,
      minWidth: 88,
    },
    tooltipOffset: 8,
    cursorSize: 32,
    cursorHotspotX: 16,
    cursorHotspotY: 30,
    chrome: {
      cream: "#FBDDAF",
      creamHover: "#F7D39A",
      creamSelected: "#E8C48A",
      wood: "#6E3E2E",
      ink: "#3a2416",
    },
  },
  /**
   * Official 368×586 wooden frame with floral corners. Cream parchment measured
   * from the PNG: gold trim ~36/56; strict cream 44,68 264×472 (to 308,540).
   * Header is portrait-left + identity-right, matching the player-facing mock.
   */
  slimeCard: {
    card: {
      width: HUD_ASSET_SIZES.slimeCard.width,
      height: HUD_ASSET_SIZES.slimeCard.height,
    },
    cream: { x: 44, y: 68, width: 264, height: 472, overflow: "hidden" } satisfies HudSlotConfig,
    close: { x: 278, y: 74, width: 24, height: 24, overflow: "visible" } satisfies HudSlotConfig,
    portrait: { x: 50, y: 80, width: 92, height: 92, overflow: "hidden" } satisfies HudSlotConfig,
    portraitRadius: 12,
    /** Longest opaque idle-body edge, in card-local px. All slimes share this. */
    portraitBody: 62,
    identity: { x: 150, y: 80, width: 120, height: 92, overflow: "hidden" } satisfies HudSlotConfig,
    name: {
      x: 142,
      y: 84,
      width: 128,
      height: 26,
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: 800,
      align: "left" as const,
      color: "#3a2416",
      scale: 1,
    } satisfies HudTextConfig,
    status: {
      x: 142,
      y: 110,
      width: 128,
      height: 16,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.2,
      fontWeight: 700,
      align: "left" as const,
      color: "#6E3E2E",
      scale: 1,
    } satisfies HudTextConfig,
    role: {
      x: 142,
      y: 126,
      width: 128,
      height: 36,
      fontSize: 13,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: 700,
      align: "left" as const,
      color: "#8B5A3C",
      scale: 1,
    } satisfies HudTextConfig,
    hunger: {
      x: 50,
      y: 180,
      width: 252,
      height: 28,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0,
      fontWeight: 800,
      align: "left" as const,
      color: "#3a2416",
      scale: 1,
    } satisfies HudTextConfig,
    attributes: { x: 50, y: 214, width: 252, height: 216, overflow: "visible" } satisfies HudSlotConfig,
    attributeRow: { height: 52, iconCanvas: 40, starCanvas: 30, starGap: 2 },
    tooltipOffset: 6,
    footer: { x: 50, y: 436, width: 252, height: 100, overflow: "hidden" } satisfies HudSlotConfig,
    activityLabel: {
      x: 50,
      y: 442,
      width: 250,
      height: 16,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.4,
      fontWeight: 700,
      align: "center" as const,
      color: "#6E3E2E",
      scale: 1,
    } satisfies HudTextConfig,
    activity: {
      x: 50,
      y: 458,
      width: 250,
      height: 22,
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: 800,
      align: "center" as const,
      color: "#3a2416",
      scale: 1,
    } satisfies HudTextConfig,
    homeLabel: {
      x: 50,
      y: 484,
      width: 250,
      height: 16,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.4,
      fontWeight: 700,
      align: "center" as const,
      color: "#6E3E2E",
      scale: 1,
    } satisfies HudTextConfig,
    home: {
      x: 50,
      y: 500,
      width: 250,
      height: 20,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      fontWeight: 700,
      align: "center" as const,
      color: "#3a2416",
      scale: 1,
    } satisfies HudTextConfig,
    invite: { x: 50, y: 0, width: 252, height: 28, overflow: "visible" } satisfies HudSlotConfig,
    chrome: {
      cream: "#FBDDAF",
      wood: "#6E3E2E",
      ink: "#3a2416",
      portraitWell: "#4A2C20",
      portraitWellEdge: "#2C1810",
    },
  },
} as const;

export const TOP_RIGHT_TRANSITION = {
  collapseFrameCount: 47,
  expandFrameCount: 47,
  /** ~42 fps. The old 13×100ms slideshow felt stepped; 47 frames need a short hold. */
  frameDurationMs: 24,
  durationMs: 1128,
} as const;

export function topRightTransitionDurationMs(frameCount: number): number {
  return Math.max(0, frameCount) * TOP_RIGHT_TRANSITION.frameDurationMs;
}

export const TOP_RIGHT_HUD_STORAGE_KEY = "slime-haven:top-right-hud-collapsed";

/**
 * Sequence canvases are 795×237; static Top Right is 730×159. Frames share
 * opaque-right 744; the static PNG's opaque-right is 711. Right-edge register
 * so the gear does not jump: CSS right = (730-711) - (795-744) = -32.
 * Opaque tops 4 vs 54: CSS top = 4-54 = -50 (opaque height 128 on both).
 * Minimize opaque widths 1/24/47: 732 → 500 → 316 (collapse). Return: 316 → 531 → 732 (expand).
 */
export const TOP_RIGHT_ANIMATION = {
  canvasWidth: 795,
  canvasHeight: 237,
  frameOpaqueRight: 744,
  frameOpaqueTop: 54,
  staticOpaqueRight: 711,
  staticOpaqueTop: 4,
  collapsedOpaque: { x: 428, y: 54, width: 316, height: 128 },
  collapseSequence: "minimize" as const,
  expandSequence: "return" as const,
  minimizeOpaqueWidths: [732, 500, 316],
  returnOpaqueWidths: [316, 531, 732],
  anchorRight: -32,
  anchorTop: -50,
} as const;

export type TopRightHudVisualState = "expanded" | "collapsing" | "collapsed" | "expanding";

export type HudControlRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  iconSize: number;
};

export type HudScaleVar = "--hud-left-scale" | "--hud-right-scale" | "--hud-toolbar-scale" | "--hud-slime-scale";

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

export function requestedToolbarScale(config: HudScaleConfig = HUD_SCALE_CONFIG): number {
  const base =
    typeof config.toolbarScale === "number" && Number.isFinite(config.toolbarScale) && config.toolbarScale > 0
      ? config.toolbarScale
      : 1;
  return base * Math.max(0, config.toolbarMultiplier);
}

export function requestedSlimeScale(config: HudScaleConfig = HUD_SCALE_CONFIG): number {
  const base =
    typeof config.slimeScale === "number" && Number.isFinite(config.slimeScale) && config.slimeScale > 0
      ? config.slimeScale
      : 1;
  return base * Math.max(0, config.slimeMultiplier);
}

export function actionToolbarBaseSize(): { width: number; height: number } {
  const toolbar = HUD_LAYOUT.actionToolbar;
  return {
    width: toolbar.card.width,
    height: toolbar.card.height + toolbar.secondary.gap + toolbar.secondary.height,
  };
}

export function actionToolbarCardSize(): { width: number; height: number } {
  return {
    width: HUD_LAYOUT.actionToolbar.card.width,
    height: HUD_LAYOUT.actionToolbar.card.height,
  };
}

export function toolbarSlotRect(index: number): ToolbarSlotRect {
  const slot = HUD_LAYOUT.actionToolbar.slots[index];
  if (!slot) {
    throw new Error(`Unknown toolbar slot index: ${index}`);
  }
  return slot;
}

export function toolbarSelectedStyle(slot: ToolbarSlotRect): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const selected = HUD_LAYOUT.actionToolbar.selected;
  return {
    position: "absolute",
    left: slot.x,
    top: slot.y,
    width: selected.width,
    height: selected.height,
  };
}

export function toolbarIconStyle(
  slot: ToolbarSlotRect,
  presentation: ActionIconPresentation,
): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    position: "absolute",
    left: slot.x + (slot.width - presentation.canvasSize) / 2 + presentation.offsetX,
    top: slot.y + (slot.height - presentation.canvasSize) / 2 + presentation.offsetY,
    width: presentation.canvasSize,
    height: presentation.canvasSize,
  };
}

export function toolbarHitboxStyle(slot: ToolbarSlotRect): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    position: "absolute",
    left: slot.x,
    top: slot.y,
    width: slot.width,
    height: slot.height,
  };
}

export function toolbarUsesNativeArtworkSize(): boolean {
  return (
    HUD_LAYOUT.actionToolbar.card.width === HUD_ASSET_SIZES.toolbar.width &&
    HUD_LAYOUT.actionToolbar.card.height === HUD_ASSET_SIZES.toolbar.height &&
    HUD_LAYOUT.actionToolbar.selected.width === HUD_ASSET_SIZES.toolbarSelected.width &&
    HUD_LAYOUT.actionToolbar.selected.height === HUD_ASSET_SIZES.toolbarSelected.height
  );
}

export function selectedOverlayMatchesSlot(slot: ToolbarSlotRect): boolean {
  const selected = toolbarSelectedStyle(slot);
  return (
    selected.left === slot.x &&
    selected.top === slot.y &&
    selected.width === slot.width &&
    selected.height === slot.height
  );
}

export function selectedOverlayStaysRegistered(scale: number): boolean {
  return HUD_LAYOUT.actionToolbar.slots.every((slot) => {
    const selected = toolbarSelectedStyle(slot);
    return (
      selected.left * scale === slot.x * scale &&
      selected.top * scale === slot.y * scale &&
      selected.width * scale === slot.width * scale &&
      selected.height * scale === slot.height * scale
    );
  });
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

  const toolbarRequested = requestedToolbarScale(config);
  const toolbarBase = actionToolbarBaseSize();
  const toolbarAvailable = Math.max(1, viewportWidth - 2 * margin);
  const toolbarFit =
    toolbarBase.width * toolbarRequested > toolbarAvailable
      ? toolbarAvailable / (toolbarBase.width * toolbarRequested)
      : 1;
  const toolbarApplied = toolbarRequested * toolbarFit;

  const slimeRequested = requestedSlimeScale(config);
  const slimeBaseW = HUD_LAYOUT.slimeCard.card.width;
  const slimeBaseH = HUD_LAYOUT.slimeCard.card.height;
  const toolbarRenderedW = HUD_LAYOUT.actionToolbar.card.width * toolbarApplied;
  const toolbarLeft = (viewportWidth - toolbarRenderedW) / 2;
  const leftApplied = leftRequested * fitFactor;
  const leftHeight = HUD_LAYOUT.topLeft.card.height * leftApplied;
  const rawGutter = toolbarLeft - margin - gap;
  const slimeStacksAboveToolbar = rawGutter < slimeBaseW * slimeRequested * 0.72;
  const slimeAvailableW = slimeStacksAboveToolbar
    ? Math.max(1, viewportWidth - 2 * margin)
    : Math.max(1, rawGutter);
  const slimeAvailableH = slimeStacksAboveToolbar
    ? Math.max(
        1,
        viewportHeight - 2 * margin - leftHeight - 2 * gap - toolbarBase.height * toolbarApplied,
      )
    : Math.max(1, viewportHeight - 2 * margin - leftHeight - gap);
  const slimeWidthFit = slimeAvailableW / (slimeBaseW * slimeRequested);
  const slimeHeightFit = slimeAvailableH / (slimeBaseH * slimeRequested);
  const slimeFit = Math.min(1, slimeWidthFit, slimeHeightFit);

  return {
    preset: config.preset,
    requestedGlobal,
    leftRequested,
    rightRequested,
    leftApplied,
    rightApplied: rightRequested * fitFactor,
    toolbarRequested,
    toolbarApplied,
    slimeRequested,
    slimeApplied: slimeRequested * slimeFit,
    slimeStacksAboveToolbar,
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

export function computeSlimeHudScale(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): number {
  return resolveHudScale(viewportWidth, viewportHeight, config).slimeApplied;
}

export function slimeCardScreenRect(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): HudRect {
  const resolved = resolveHudScale(viewportWidth, viewportHeight, config);
  const safe = hudSafeInset(viewportWidth, viewportHeight, 0, config);
  const height = HUD_LAYOUT.slimeCard.card.height * resolved.slimeApplied;
  const bottom = resolved.slimeStacksAboveToolbar
    ? safe + actionToolbarBaseSize().height * resolved.toolbarApplied + Math.max(0, config.cardGap)
    : safe;
  return {
    x: safe,
    y: viewportHeight - bottom - height,
    width: HUD_LAYOUT.slimeCard.card.width * resolved.slimeApplied,
    height,
  };
}

export function slimeCardFitsViewport(
  viewportWidth: number,
  viewportHeight: number,
  config: HudScaleConfig = HUD_SCALE_CONFIG,
): boolean {
  const card = slimeCardScreenRect(viewportWidth, viewportHeight, config);
  const { left, right } = topPanelRects(viewportWidth, viewportHeight, config);
  const toolbar = actionToolbarBaseSize();
  const resolved = resolveHudScale(viewportWidth, viewportHeight, config);
  const toolbarWidth = toolbar.width * resolved.toolbarApplied;
  const toolbarLeft = (viewportWidth - toolbarWidth) / 2;
  const toolbarRect: HudRect = {
    x: toolbarLeft,
    y: viewportHeight - hudSafeInset(viewportWidth, viewportHeight, 0, config) - toolbar.height * resolved.toolbarApplied,
    width: toolbarWidth,
    height: toolbar.height * resolved.toolbarApplied,
  };
  const inside =
    card.x >= 0 &&
    card.y >= 0 &&
    card.x + card.width <= viewportWidth + 1 &&
    card.y + card.height <= viewportHeight + 1;
  const missesToolbar = resolved.slimeStacksAboveToolbar
    ? !rectsOverlap(card, toolbarRect)
    : card.x + card.width <= toolbarLeft + 1;
  const missesTopLeft = !rectsOverlap(card, left);
  void right;
  return inside && missesToolbar && missesTopLeft;
}

export function slimeCardUsesNativeArtworkSize(): boolean {
  return (
    HUD_LAYOUT.slimeCard.card.width === HUD_ASSET_SIZES.slimeCard.width &&
    HUD_LAYOUT.slimeCard.card.height === HUD_ASSET_SIZES.slimeCard.height
  );
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

export function topRightHudInnerSize(state: TopRightHudVisualState): {
  width: number;
  height: number;
  overflow: "hidden" | "visible";
} {
  if (state === "collapsed") {
    return {
      width: HUD_LAYOUT.topRight.collapsedCard.width,
      height: HUD_LAYOUT.topRight.collapsedCard.height,
      overflow: "hidden",
    };
  }
  return {
    width: HUD_LAYOUT.topRight.card.width,
    height: HUD_LAYOUT.topRight.card.height,
    overflow: state === "expanded" ? "hidden" : "visible",
  };
}

export function topRightSequenceArtStyle(): {
  position: "absolute";
  right: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    position: "absolute",
    right: TOP_RIGHT_ANIMATION.anchorRight,
    top: TOP_RIGHT_ANIMATION.anchorTop,
    width: TOP_RIGHT_ANIMATION.canvasWidth,
    height: TOP_RIGHT_ANIMATION.canvasHeight,
  };
}

export function controlStyle(rect: HudControlRect): {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    position: "absolute",
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
  };
}
