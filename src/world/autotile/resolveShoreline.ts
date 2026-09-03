import {
  waterCenterFrame,
  WATER_FRAMES,
  type ShoreVisual,
  type ShoreVisualId,
} from "./shorelineDefinitions";

/** Cardinal land-edge bits: N=1 E=2 S=4 W=8 */
export const SHORE_N = 1;
export const SHORE_E = 2;
export const SHORE_S = 4;
export const SHORE_W = 8;

function bit(on: boolean, mask: number): number {
  return on ? mask : 0;
}

/**
 * Resolve shoreline art for a logical water cell.
 * `isWater(dx, dy)` is true when the neighbor is logical water.
 * Out-of-bounds should return false (treated as land).
 */
export function resolveShoreline(
  isWater: (dx: number, dy: number) => boolean,
  tileX = 0,
  tileY = 0,
): ShoreVisual {
  const n = isWater(0, -1);
  const e = isWater(1, 0);
  const s = isWater(0, 1);
  const w = isWater(-1, 0);
  const ne = isWater(1, -1);
  const se = isWater(1, 1);
  const sw = isWater(-1, 1);
  const nw = isWater(-1, -1);

  if (n && e && s && w) {
    const inner = innerCorner(ne, se, sw, nw);
    if (inner) {
      return inner;
    }
    return visual("water_center", waterCenterFrame(tileX, tileY), 0);
  }

  const landN = !n;
  const landE = !e;
  const landS = !s;
  const landW = !w;
  const landMask =
    bit(landN, SHORE_N) | bit(landE, SHORE_E) | bit(landS, SHORE_S) | bit(landW, SHORE_W);

  return fromLandMask(landMask, tileX, tileY);
}

export function shoreMaskLabel(isWater: (dx: number, dy: number) => boolean): string {
  const parts: string[] = [];
  if (!isWater(0, -1)) {
    parts.push("N");
  }
  if (!isWater(1, 0)) {
    parts.push("E");
  }
  if (!isWater(0, 1)) {
    parts.push("S");
  }
  if (!isWater(-1, 0)) {
    parts.push("W");
  }
  if (!isWater(1, -1)) {
    parts.push("NE");
  }
  if (!isWater(1, 1)) {
    parts.push("SE");
  }
  if (!isWater(-1, 1)) {
    parts.push("SW");
  }
  if (!isWater(-1, -1)) {
    parts.push("NW");
  }
  return parts.length > 0 ? parts.join("/") : "none";
}

function innerCorner(ne: boolean, se: boolean, sw: boolean, nw: boolean): ShoreVisual | undefined {
  const frames = {
    shore_inner_corner_nw: WATER_FRAMES.innerCornerNW,
    shore_inner_corner_ne: WATER_FRAMES.innerCornerNE,
    shore_inner_corner_sw: WATER_FRAMES.innerCornerSW,
    shore_inner_corner_se: WATER_FRAMES.innerCornerSE,
  } as const;
  const missing = (Object.keys(frames) as Array<keyof typeof frames>).filter((id) => {
    if (id === "shore_inner_corner_nw") {
      return !nw;
    }
    if (id === "shore_inner_corner_ne") {
      return !ne;
    }
    if (id === "shore_inner_corner_sw") {
      return !sw;
    }
    return !se;
  });
  if (missing.length !== 1) {
    return undefined;
  }
  const id = missing[0];
  return visual(id, frames[id], 0);
}

function fromLandMask(mask: number, tileX: number, tileY: number): ShoreVisual {
  switch (mask) {
    case SHORE_N:
      return visual("shore_north", WATER_FRAMES.shoreNorth, 0);
    case SHORE_S:
      return visual("shore_south", WATER_FRAMES.shoreSouth, 0);
    case SHORE_E:
      return visual("shore_east", WATER_FRAMES.shoreNorth, 90);
    case SHORE_W:
      return visual("shore_west", WATER_FRAMES.shoreSouth, 90);
    case SHORE_N | SHORE_E:
      return visual("shore_outer_corner_ne", WATER_FRAMES.outerCornerNE, 0);
    case SHORE_N | SHORE_W:
      return visual("shore_outer_corner_nw", WATER_FRAMES.outerCornerNW, 0);
    case SHORE_S | SHORE_E:
      return visual("shore_outer_corner_se", WATER_FRAMES.outerCornerSE, 0);
    case SHORE_S | SHORE_W:
      return visual("shore_outer_corner_sw", WATER_FRAMES.outerCornerSW, 0);
    case SHORE_N | SHORE_E | SHORE_S:
      return visual("shore_east", WATER_FRAMES.shoreNorth, 90);
    case SHORE_N | SHORE_S | SHORE_W:
      return visual("shore_west", WATER_FRAMES.shoreSouth, 90);
    case SHORE_E | SHORE_S | SHORE_W:
      return visual("shore_south", WATER_FRAMES.shoreSouth, 0);
    case SHORE_N | SHORE_E | SHORE_W:
      return visual("shore_north", WATER_FRAMES.shoreNorth, 0);
    default:
      return visual("water_center", waterCenterFrame(tileX, tileY), 0);
  }
}

function visual(id: ShoreVisualId, frame: number, rotationDeg: 0 | 90): ShoreVisual {
  return { id, frame, rotationDeg };
}
