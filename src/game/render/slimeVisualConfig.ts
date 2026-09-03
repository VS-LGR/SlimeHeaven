import { TILE_SIZE } from "@/src/world/constants";
import { SLIME_IDS, type SlimeId } from "@/src/simulation/entities/SlimeState";

/** Placeholder frame size. Final sheets use per-slime sizes in SLIME_VISUALS. */
export const SLIME_FRAME_WIDTH = TILE_SIZE;
export const SLIME_FRAME_HEIGHT = TILE_SIZE;
export const SLIME_ORIGIN_X = 0.5;
export const SLIME_ORIGIN_Y = 1;

export const SLIME_ANIM = {
  IDLE: "idle",
  HOP: "hop",
  WORK: "work",
  FISH_CAST: "fish_cast",
  FISH_WAIT: "fish_wait",
  FISH_BITE: "fish_bite",
  FISH_PULL: "fish_pull",
  FISH_SUCCESS: "fish_success",
  FARM_TILL: "farm_till",
  FARM_PLANT: "farm_plant",
  FARM_HARVEST: "farm_harvest",
  TITO_GATHER_SWING: "tito_gather_swing",
} as const;

export type CoreSlimeAnim = "idle" | "hop" | "work";
export type SlimeAnimName = (typeof SLIME_ANIM)[keyof typeof SLIME_ANIM];

export function playableSlimeAnim(anim: SlimeAnimName): CoreSlimeAnim {
  if (anim === SLIME_ANIM.FISH_WAIT || anim === SLIME_ANIM.IDLE) {
    return SLIME_ANIM.IDLE;
  }
  if (anim === SLIME_ANIM.FISH_SUCCESS || anim === SLIME_ANIM.HOP) {
    return SLIME_ANIM.HOP;
  }
  if (
    anim === SLIME_ANIM.WORK ||
    anim === SLIME_ANIM.FARM_TILL ||
    anim === SLIME_ANIM.FARM_PLANT ||
    anim === SLIME_ANIM.FARM_HARVEST ||
    anim === SLIME_ANIM.TITO_GATHER_SWING
  ) {
    return SLIME_ANIM.WORK;
  }
  return SLIME_ANIM.WORK;
}

export const SLIME_COLORS: Record<SlimeId, { fill: string; eye: string }> = {
  [SLIME_IDS.PINGO]: { fill: "#4ea3e0", eye: "#1a2430" },
  [SLIME_IDS.MOMO]: { fill: "#62c46a", eye: "#1a2430" },
  [SLIME_IDS.TITO]: { fill: "#e89a45", eye: "#1a2430" },
};

export type SlimeVisualKind = "final" | "placeholder";

export interface SlimeAnimClip {
  textureKeys: string[];
  paths: string[];
  frameRate: number;
  repeat: number;
  syncToHopT?: boolean;
  /** Frames that play in place before world travel starts (anticipation). */
  buildupFrames?: number;
}

export interface FinalSlimeVisual {
  kind: "final";
  frameWidth: number;
  frameHeight: number;
  originX: number;
  originY: number;
  shadowFeetPadPx: number;
  shadowScale: number;
  anims: Record<CoreSlimeAnim, SlimeAnimClip>;
}

export interface PlaceholderSlimeVisual {
  kind: "placeholder";
}

export type SlimeVisual = FinalSlimeVisual | PlaceholderSlimeVisual;

function pingoClip(
  anim: SlimeAnimName,
  count: number,
  frameRate: number,
  repeat: number,
  extras: { syncToHopT?: boolean; buildupFrames?: number } = {},
): SlimeAnimClip {
  const textureKeys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    const name = `pingo-${anim}-${String(i).padStart(2, "0")}`;
    textureKeys.push(name);
    paths.push(`/assets/slimes/pingo/${anim}/${name}.png`);
  }
  return { textureKeys, paths, frameRate, repeat, ...extras };
}

function folderClip(
  slime: "tito" | "momo",
  folder: "Idle" | "Hop" | "Work",
  anim: SlimeAnimName,
  count: number,
  frameRate: number,
  repeat: number,
  extras: { syncToHopT?: boolean; buildupFrames?: number } = {},
): SlimeAnimClip {
  const textureKeys: string[] = [];
  const paths: string[] = [];
  const filePrefix = slime === "tito" ? "Tito" : "Momo";
  const dir = slime === "tito" ? "Tito" : "Momo";
  for (let i = 1; i <= count; i += 1) {
    textureKeys.push(`${slime}-${anim}-${i}`);
    paths.push(`/assets/slimes/${dir}/${folder}/${filePrefix}_${folder}${i}.png`);
  }
  return { textureKeys, paths, frameRate, repeat, ...extras };
}

export const SLIME_VISUALS: Record<SlimeId, SlimeVisual> = {
  [SLIME_IDS.PINGO]: {
    kind: "final",
    frameWidth: 42,
    frameHeight: 65,
    originX: SLIME_ORIGIN_X,
    originY: SLIME_ORIGIN_Y,
    shadowFeetPadPx: 3,
    shadowScale: 0.8,
    anims: {
      idle: pingoClip(SLIME_ANIM.IDLE, 5, 6, -1),
      hop: pingoClip(SLIME_ANIM.HOP, 7, 9, 0, { syncToHopT: true, buildupFrames: 1 }),
      work: pingoClip(SLIME_ANIM.WORK, 7, 8, -1),
    },
  },
  [SLIME_IDS.MOMO]: {
    kind: "final",
    frameWidth: 38,
    frameHeight: 57,
    originX: SLIME_ORIGIN_X,
    originY: SLIME_ORIGIN_Y,
    shadowFeetPadPx: 1,
    shadowScale: 0.8,
    anims: {
      idle: folderClip("momo", "Idle", SLIME_ANIM.IDLE, 4, 6, -1),
      hop: folderClip("momo", "Hop", SLIME_ANIM.HOP, 7, 9, 0, { syncToHopT: true, buildupFrames: 1 }),
      work: folderClip("momo", "Work", SLIME_ANIM.WORK, 7, 8, -1),
    },
  },
  [SLIME_IDS.TITO]: {
    kind: "final",
    frameWidth: 39,
    frameHeight: 38,
    originX: SLIME_ORIGIN_X,
    originY: SLIME_ORIGIN_Y,
    shadowFeetPadPx: 1,
    shadowScale: 0.8,
    anims: {
      idle: folderClip("tito", "Idle", SLIME_ANIM.IDLE, 4, 6, -1),
      hop: folderClip("tito", "Hop", SLIME_ANIM.HOP, 6, 9, 0, { syncToHopT: true, buildupFrames: 1 }),
      work: folderClip("tito", "Work", SLIME_ANIM.WORK, 6, 8, -1),
    },
  },
};

export function usesFinalArt(id: SlimeId): boolean {
  return SLIME_VISUALS[id].kind === "final";
}

/** Maps hop progress to world travel, holding still during anticipation frames. */
export function hopTravelT(id: SlimeId, hopT: number): number {
  const visual = SLIME_VISUALS[id];
  if (visual.kind !== "final") {
    return hopT;
  }
  const clip = visual.anims.hop;
  const frames = clip.textureKeys.length;
  const buildup = clip.buildupFrames ?? 0;
  if (buildup <= 0 || frames <= buildup) {
    return hopT;
  }
  const hold = buildup / frames;
  if (hopT <= hold) {
    return 0;
  }
  return (hopT - hold) / (1 - hold);
}

export function slimeAnimKey(id: SlimeId, anim: CoreSlimeAnim): string {
  return `${id}-${anim}`;
}

export function slimeBodyKey(id: SlimeId): string {
  return `slime-body-${id}`;
}

export function slimeShadowKey(): string {
  return "slime-shadow";
}

/** Placeholder shadow sits 1px above the tile bottom. */
export const PLACEHOLDER_SHADOW_OFFSET_Y = 1;

export const CARRY_TEXTURE = {
  wood: "carry-wood",
  stone: "carry-stone",
  food: "carry-food",
} as const;

export const STORAGE_TEXTURE_KEY = "storage-marker";
