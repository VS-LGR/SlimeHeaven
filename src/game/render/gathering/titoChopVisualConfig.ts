import { SLIME_ORIGIN_X } from "../slimeVisualConfig";
import { WORK_DURATION_MS } from "@/src/simulation/constants";

export const TITO_CHOP_FRAME = { width: 76, height: 89 } as const;
export const TITO_CHOP_FRAME_COUNT = 9;

/**
 * Tito idle is 39×38 with origin (0.5, 1). Chop canvases are 76×89 with a
 * transparent pad below the feet (last opaque row is 76). Origin (0.5, 1)
 * would plant that pad on the ground and lift Tito; pin Y to the feet line.
 */
export const TITO_CHOP_FEET_Y = 77;
export const TITO_CHOP_ORIGIN = {
  x: SLIME_ORIGIN_X,
  y: TITO_CHOP_FEET_Y / TITO_CHOP_FRAME.height,
} as const;

/** Presentation target only. Simulation still finishes at WORK_DURATION_MS. */
export const TITO_GATHER_SWING_HIT_COUNT = 2;
export const TITO_GATHER_SWING_CYCLE_MS = WORK_DURATION_MS / TITO_GATHER_SWING_HIT_COUNT;
export const TITO_GATHER_SWING_FRAME_RATE =
  TITO_CHOP_FRAME_COUNT / (TITO_GATHER_SWING_CYCLE_MS / 1000);

/** Loop while `working`. Work completion is never gated on this clip. */
export const TITO_GATHER_SWING_BODY_ANIM_REPEAT = -1;

export const TITO_GATHER_SWING_BODY_ANIM_KEY = "tito_gather_swing";

/** Legacy Phaser/asset-era name. Resolver and F3 use `tito_gather_swing`. */
export const TITO_CHOP_BODY_ANIM_KEY = TITO_GATHER_SWING_BODY_ANIM_KEY;

export const TITO_CHOP_AXE_FRAME_MAP: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export interface ChopToolOffset {
  x: number;
  y: number;
}

/** Presentation-only. Shared 76×89 composition canvas starts at zero. */
export const TITO_CHOP_TOOL_OFFSETS: readonly ChopToolOffset[] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

const BODY = "/assets/slimes/Tito/Chop";
const AXE = "/assets/world/itens/Axe";
const PICKAXE = "/assets/world/itens/Pickaxe";

function numberedClip(dir: string, stem: string, count: number, keyPrefix: string): { keys: string[]; paths: string[] } {
  const keys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    keys.push(`${keyPrefix}-${i}`);
    paths.push(`${dir}/${stem}${i}.png`);
  }
  return { keys, paths };
}

export const TITO_CHOP_BODY = {
  ...numberedClip(BODY, "tito_chop", TITO_CHOP_FRAME_COUNT, "tito-chop"),
  animKey: TITO_GATHER_SWING_BODY_ANIM_KEY,
} as const;

export const TITO_CHOP_AXE = numberedClip(AXE, "axe", TITO_CHOP_FRAME_COUNT, "tito-axe");

export const TITO_PICKAXE = numberedClip(PICKAXE, "pickaxe", TITO_CHOP_FRAME_COUNT, "tito-pickaxe");
export const TITO_PICKAXE_FRAME_MAP: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function titoGatherSwingFrameRate(speedMultiplier: number): number {
  return TITO_GATHER_SWING_FRAME_RATE * speedMultiplier;
}
