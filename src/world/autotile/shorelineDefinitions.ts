/**
 * Visual-only water shoreline frames from Terrain.png (256×224, 8×7 of 32×32).
 * Lake art lives on rows 5–6 (frames 40–55). Row 4 (32–39) is empty.
 * Logical terrain stays `water`. These IDs are never map data.
 *
 * Frame = row * 8 + col. Inspected from the atlas; do not invent extra pieces.
 */
export const WATER_FRAMES = {
  /** Legacy solid fill (row 0). Not used for lakes. */
  legacyFill: 5,
  /** Clean interior shallow water. */
  center: 40,
  centerAlt: [40, 42, 48, 50] as const,
  shoreNorth: 46,
  shoreSouth: 54,
  outerCornerNW: 45,
  outerCornerNE: 47,
  outerCornerSW: 53,
  outerCornerSE: 55,
  innerCornerNW: 52,
  innerCornerNE: 51,
  innerCornerSW: 44,
  innerCornerSE: 41,
} as const;

/** Duplicate inner-SE variant; not registered as a distinct role. */
export const WATER_FRAME_INNER_SE_ALT = 43;
/** Duplicate outer-SE variant; not registered as a distinct role. */
export const WATER_FRAME_OUTER_SE_ALT = 49;

export type ShoreVisualId =
  | "water_center"
  | "shore_north"
  | "shore_south"
  | "shore_east"
  | "shore_west"
  | "shore_outer_corner_nw"
  | "shore_outer_corner_ne"
  | "shore_outer_corner_sw"
  | "shore_outer_corner_se"
  | "shore_inner_corner_nw"
  | "shore_inner_corner_ne"
  | "shore_inner_corner_sw"
  | "shore_inner_corner_se";

export type ShoreRotationDeg = 0 | 90;

export interface ShoreVisual {
  id: ShoreVisualId;
  frame: number;
  rotationDeg: ShoreRotationDeg;
}

export function waterCenterFrame(x: number, y: number): number {
  const alts = WATER_FRAMES.centerAlt;
  return alts[(x * 3 + y * 7) % alts.length];
}
