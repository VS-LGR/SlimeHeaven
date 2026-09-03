import { SLIME_ORIGIN_X } from "../slimeVisualConfig";

export const MOMO_PLANT_FRAME = { width: 83, height: 75 } as const;
export const MOMO_PLANT_FRAME_COUNT = 5;
export const MOMO_PLANT_FRAME_RATE = 8;
export const MOMO_PLANT_BODY_ANIM_REPEAT = -1;
export const MOMO_PLANT_BODY_ANIM_KEY = "momo_farm_plant";

/** Same idle feet row as till: 57px body on a 75px canvas, 18px pad below. */
export const MOMO_PLANT_FEET_Y = 57;
export const MOMO_PLANT_ORIGIN = {
  x: SLIME_ORIGIN_X,
  y: MOMO_PLANT_FEET_Y / MOMO_PLANT_FRAME.height,
} as const;

/**
 * Extra body nudge on top of plot-center feet (`plotWorkFeetWorld`).
 * Keep {0,0}; the last hop already lands on the tile center.
 */
export const MOMO_FARM_PLANT_OFFSET = { x: 0, y: 0 } as const;

const BODY = "/assets/slimes/Momo/Farm_Plant";

function numberedClip(dir: string, stem: string, count: number, keyPrefix: string): { keys: string[]; paths: string[] } {
  const keys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    keys.push(`${keyPrefix}-${i}`);
    paths.push(`${dir}/${stem}${i}.png`);
  }
  return { keys, paths };
}

export const MOMO_PLANT_BODY = {
  ...numberedClip(BODY, "Farm_Plant", MOMO_PLANT_FRAME_COUNT, "momo-farm_plant"),
  animKey: MOMO_PLANT_BODY_ANIM_KEY,
} as const;
