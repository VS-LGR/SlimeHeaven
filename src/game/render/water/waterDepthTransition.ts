import { TILE_SIZE } from "@/src/world/constants";
import type { WaterCell } from "./waterCoverage";
import { WATER_VFX } from "./waterVisualConfig";

export type Cardinal = "n" | "e" | "s" | "w";
export type DepthTone = "shallow" | "shallowDark" | "deepLight" | "deep" | "sediment";

const SIDES: Cardinal[] = ["n", "e", "s", "w"];
const OPPOSITE: Record<Cardinal, Cardinal> = { n: "s", e: "w", s: "n", w: "e" };
const DEEP_DELTA: Record<Cardinal, { dx: number; dy: number }> = {
  n: { dx: 0, dy: -1 },
  e: { dx: 1, dy: 0 },
  s: { dx: 0, dy: 1 },
  w: { dx: -1, dy: 0 },
};

export function hash2(x: number, y: number): number {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return n >>> 0;
}

/** Coherent 4px runs so the seam reads as a broken edge, not per-pixel noise. */
export function seamWobble(along: number): number {
  const run = Math.floor(along / 4);
  const span = WATER_VFX.depthTransitionWobblePx * 2 + 1;
  const coarse = (hash2(run, 901) % span) - WATER_VFX.depthTransitionWobblePx;
  const nick = hash2(along, 407) % 13 === 0 ? (hash2(along, 19) % 3) - 1 : 0;
  return coarse + nick;
}

export function bandWidth(along: number): number {
  const width = WATER_VFX.depthTransitionBandPx + Math.min(1, Math.abs(seamWobble(along)) - 1);
  return Math.max(4, Math.min(10, width));
}

/**
 * Signed distance to the wobble-shifted shallow/deep seam.
 * Positive = visually inside deep water. Shared world-axis wobble keeps adjacent tiles connected.
 */
export function signedInsideDeep(cell: WaterCell, wx: number, wy: number): number {
  if (cell.interior) {
    let min = 64;
    let facing = false;
    for (const dir of SIDES) {
      if (!cell.facesShallow[dir]) {
        continue;
      }
      facing = true;
      min = Math.min(min, signedFromDeepEdge(cell.x, cell.y, dir, wx, wy));
    }
    return facing ? min : 64;
  }
  let max = -64;
  let facing = false;
  for (const dir of SIDES) {
    if (!cell.facesDeep[dir]) {
      continue;
    }
    facing = true;
    const { dx, dy } = DEEP_DELTA[dir];
    max = Math.max(max, signedFromDeepEdge(cell.x + dx, cell.y + dy, OPPOSITE[dir], wx, wy));
  }
  return facing ? max : -64;
}

export function depthToneFromSigned(signed: number, wx: number, wy: number): DepthTone {
  const band = WATER_VFX.depthTransitionBandPx;
  const cluster = hash2(wx >> 1, wy >> 1);
  const speck = hash2(wx, wy);
  if (signed > band) {
    if (signed <= band + 4 && speck % 16 === 0) {
      return "sediment";
    }
    return "deep";
  }
  if (signed < -band) {
    if (signed >= -band - 3 && speck % 18 === 0) {
      return "deepLight";
    }
    return "shallow";
  }
  if (Math.abs(signed) <= 1 && speck % 12 === 0) {
    return "sediment";
  }
  if (signed >= 2) {
    return cluster % 4 === 0 ? "shallowDark" : "deepLight";
  }
  if (signed <= -2) {
    return cluster % 4 === 0 ? "deepLight" : "shallowDark";
  }
  return cluster % 2 === 0 ? "deepLight" : "shallowDark";
}

export function depthToneAt(cell: WaterCell, wx: number, wy: number): DepthTone {
  return depthToneFromSigned(signedInsideDeep(cell, wx, wy), wx, wy);
}

export function transitionDirs(cell: WaterCell): Array<{ dir: Cardinal; fromShallow: boolean }> {
  const dirs: Array<{ dir: Cardinal; fromShallow: boolean }> = [];
  for (const dir of SIDES) {
    if (cell.interior) {
      if (cell.facesShallow[dir]) {
        dirs.push({ dir, fromShallow: false });
      }
    } else if (cell.facesDeep[dir]) {
      dirs.push({ dir, fromShallow: true });
    }
  }
  return dirs;
}

function signedFromDeepEdge(
  deepX: number,
  deepY: number,
  dirTowardShallow: Cardinal,
  wx: number,
  wy: number,
): number {
  const ox = deepX * TILE_SIZE;
  const oy = deepY * TILE_SIZE;
  if (dirTowardShallow === "w") {
    return wx - (ox + seamWobble(wy));
  }
  if (dirTowardShallow === "e") {
    return ox + TILE_SIZE + seamWobble(wy) - wx;
  }
  if (dirTowardShallow === "n") {
    return wy - (oy + seamWobble(wx));
  }
  return oy + TILE_SIZE + seamWobble(wx) - wy;
}
