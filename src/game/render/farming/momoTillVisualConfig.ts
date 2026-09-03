import { SLIME_ORIGIN_X } from "../slimeVisualConfig";

export const MOMO_TILL_FRAME = { width: 83, height: 75 } as const;
export const MOMO_TILL_FRAME_COUNT = 7;
export const MOMO_TILL_DIRT_FRAME_COUNT = 5;
export const MOMO_TILL_FRAME_RATE = 8;
/**
 * Core Momo idle/work is 38×57 with feet on the last row. Till canvases keep that
 * contact row and pad 18px below for hoe/dirt. Origin (0.5, 1) would plant the
 * empty pad on the ground and lift Momo; pin Y to the idle feet line instead.
 */
export const MOMO_TILL_FEET_Y = 57;
export const MOMO_TILL_ORIGIN = {
  x: SLIME_ORIGIN_X,
  y: MOMO_TILL_FEET_Y / MOMO_TILL_FRAME.height,
} as const;

/** Dirt puff centroid in the 83×75 canvas so the splatter sits on the hoe head. */
export const MOMO_TILL_DIRT_ORIGIN = {
  x: 41 / MOMO_TILL_FRAME.width,
  y: 40 / MOMO_TILL_FRAME.height,
} as const;

/**
 * Hoe6 (index 5) is first soil contact after the downswing. Index 4 is the raised peak.
 * Blade contact on the source (west) canvas: bottom of the metal head at (14, 56).
 */
export const MOMO_TILL_IMPACT_FRAME_INDEX = 5;

/** Hoe blade contact relative to feet origin, impact frame, west source. */
export const MOMO_TILL_HOE_HEAD_LOCAL = {
  x: -28,
  y: -1,
} as const;

/** One swing. Looping would start a second strike before the dirt puff (and tile) finish. */
export const MOMO_TILL_BODY_ANIM_REPEAT = 0;

export const MOMO_TILL_BODY_ANIM_KEY = "momo_farm_till";
export const MOMO_TILL_DIRT_ANIM_KEY = "momo_till_dirt";

export const MOMO_TILL_HOE_FRAME_MAP: readonly number[] = [0, 1, 2, 3, 4, 5, 6];

export interface TillToolOffset {
  x: number;
  y: number;
}

/** Presentation-only. Shared 83×75 composition canvas starts at zero. */
export const MOMO_TILL_TOOL_OFFSETS: readonly TillToolOffset[] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

export const MOMO_TILL_IMPACT_OFFSET: TillToolOffset = { x: 0, y: 0 };

const BODY = "/assets/slimes/Momo/Farm_Till";
const HOE = "/assets/world/itens/Hoe";
const DIRT = `${HOE}/Dirt_animation`;

function numberedClip(dir: string, stem: string, count: number, keyPrefix: string): { keys: string[]; paths: string[] } {
  const keys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    keys.push(`${keyPrefix}-${i}`);
    paths.push(`${dir}/${stem}${i}.png`);
  }
  return { keys, paths };
}

export const MOMO_TILL_BODY = {
  ...numberedClip(BODY, "Momo_Farm_Till", MOMO_TILL_FRAME_COUNT, "momo-farm_till"),
  animKey: MOMO_TILL_BODY_ANIM_KEY,
} as const;

export const MOMO_TILL_HOE = numberedClip(HOE, "Hoe", MOMO_TILL_FRAME_COUNT, "hoe");

export const MOMO_TILL_DIRT = {
  ...numberedClip(DIRT, "Dirt_hit", MOMO_TILL_DIRT_FRAME_COUNT, "dirt-hit"),
  animKey: MOMO_TILL_DIRT_ANIM_KEY,
} as const;
