import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import { SLIME_ANIM, type SlimeAnimName } from "../slimeVisualConfig";
import { FISHING_PRESENTATION, type FishingRodPose } from "./fishingVisualConfig";
import type { FishingVisualSide } from "./fishingVisualLayout";
import { fishingFlips, rodPhaserOrigin, rodTipWorld } from "./fishingVisualLayout";

export const PINGO_FISHING_FRAME = { width: 50, height: 65 } as const;

export interface FishingFrameAttachment {
  frameIndex: number;
  rodOffsetX: number;
  rodOffsetY: number;
}

const PINGO = "/assets/slimes/pingo";
const ROD = "/assets/world/itens/fishing_rod";
const FX = `${ROD}/animations`;

function pingoFrames(folder: string, fileStem: string, count: number): { keys: string[]; paths: string[] } {
  const keys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    keys.push(`pingo-${folder}-${i}`);
    paths.push(`${PINGO}/${folder}/${fileStem}${i}.png`);
  }
  return { keys, paths };
}

function numberedFx(folder: string, stem: string, count: number, paren: boolean): { keys: string[]; paths: string[] } {
  const keys: string[] = [];
  const paths: string[] = [];
  for (let i = 1; i <= count; i += 1) {
    keys.push(`${stem}-${i}`);
    const name = paren ? `${stem} (${i}).png` : `${stem}${i}.png`;
    paths.push(encodeURI(`${FX}/${folder}/${name}`));
  }
  return { keys, paths };
}

export const PINGO_FISHING_CLIPS: Record<
  "fish_cast" | "fish_wait" | "fish_bite" | "fish_pull" | "fish_success",
  { keys: string[]; paths: string[]; animKey: string }
> = {
  fish_cast: { ...pingoFrames("fishing_cast", "Pingo_fishing_cast", 4), animKey: "pingo_fish_cast" },
  fish_wait: { ...pingoFrames("fishing_wait", "Pingo_fishing_wait", 4), animKey: "pingo_fish_wait" },
  fish_bite: { ...pingoFrames("fishing_bite", "Pingo_fishing_bite", 3), animKey: "pingo_fish_bite" },
  fish_pull: { ...pingoFrames("fishing_push", "Pingo_fishing_push", 7), animKey: "pingo_fish_pull" },
  fish_success: { ...pingoFrames("fishing_catch", "Pingo_fishing_catch", 8), animKey: "pingo_fish_success" },
};

export const FISHING_PROP_KEYS = {
  rodCast: "fishing-rod-cast",
  rodWait: "fishing-rod-wait",
  rodBite: "fishing-rod-bite",
  rodPull: "fishing-rod-pull",
  bobberCastAir: "fishing-bobber-cast-air",
} as const;

export const FISHING_PROP_PATHS: Record<keyof typeof FISHING_PROP_KEYS, string> = {
  rodCast: `${ROD}/Cast_Rod.png`,
  rodWait: `${ROD}/Loose_Rod.png`,
  rodBite: `${ROD}/Fightingt_Rod.png`,
  rodPull: `${ROD}/Pull_Rod.png`,
  bobberCastAir: `${ROD}/cast_air.png`,
};

export const FISHING_FX = {
  bobberIdle: numberedFx("Fishing_Bloat_Idle", "Fishing_Bloat_Idle", 4, false),
  submerge: numberedFx("FishBite_PréBoubble", "FishBite_Pré", 6, true),
  bubbles: numberedFx("FishBite_Boubbles", "FishBite_Boubbles", 6, true),
  splash: numberedFx("Water_Splash", "Water_Splash", 8, false),
} as const;

export const FISHING_FX_ANIM = {
  bobberIdle: "fishing-bobber-idle",
  submerge: "fishing-bobber-submerge",
  bubbles: "fishing-bubbles",
  splash: "fishing-splash",
} as const;

/** Idle bobber, submerge, bubbles, and splash share the same 26×32 canvas. Keep one origin so bite FX sit on the floater pixel. */
export const FISHING_FX_ORIGIN = { x: 0.5, y: 0.5 } as const;

/** Handle is the bottom-left of each rod pose. Tip is the far opaque end in local sprite space (origin 0,1). */
export const ROD_POSE: Record<
  FishingRodPose,
  { textureKey: string; originX: number; originY: number; tipX: number; tipY: number; width: number; height: number }
> = {
  cast: {
    textureKey: FISHING_PROP_KEYS.rodCast,
    originX: 0,
    originY: 1,
    tipX: 33,
    tipY: -29,
    width: 34,
    height: 30,
  },
  wait: {
    textureKey: FISHING_PROP_KEYS.rodWait,
    originX: 0,
    originY: 1,
    tipX: 23,
    tipY: -39,
    width: 24,
    height: 39,
  },
  bite: {
    textureKey: FISHING_PROP_KEYS.rodBite,
    originX: 0,
    originY: 1,
    tipX: 33,
    tipY: -22,
    width: 34,
    height: 28,
  },
  pull: {
    textureKey: FISHING_PROP_KEYS.rodPull,
    originX: 0,
    originY: 1,
    tipX: 28,
    tipY: -23,
    width: 29,
    height: 26,
  },
};

/** Default attachment from Pingo feet (origin 0.5,1) toward the front/upper side. */
export const PINGO_ROD_ORIGIN = { x: 8, y: -16 };

export const PINGO_ROD_FRAME_OFFSETS: Partial<Record<SlimeAnimName, FishingFrameAttachment[]>> = {
  [SLIME_ANIM.FISH_CAST]: [
    { frameIndex: 0, rodOffsetX: 0, rodOffsetY: 0 },
    { frameIndex: 1, rodOffsetX: 1, rodOffsetY: -1 },
    { frameIndex: 2, rodOffsetX: 2, rodOffsetY: -2 },
    { frameIndex: 3, rodOffsetX: 1, rodOffsetY: 0 },
  ],
  [SLIME_ANIM.FISH_PULL]: [
    { frameIndex: 0, rodOffsetX: 0, rodOffsetY: 0 },
    { frameIndex: 2, rodOffsetX: 1, rodOffsetY: 1 },
    { frameIndex: 4, rodOffsetX: 0, rodOffsetY: 2 },
    { frameIndex: 6, rodOffsetX: -1, rodOffsetY: 1 },
  ],
};

export const rodNudge = { x: 0, y: 0 };

export function nudgePingoRod(dx: number, dy: number): { x: number; y: number } {
  rodNudge.x += dx;
  rodNudge.y += dy;
  return { ...rodNudge };
}

export function pingoFishingAnimKey(semantic: SlimeAnimName): string | undefined {
  if (semantic === SLIME_ANIM.FISH_CAST) {
    return PINGO_FISHING_CLIPS.fish_cast.animKey;
  }
  if (semantic === SLIME_ANIM.FISH_WAIT) {
    return PINGO_FISHING_CLIPS.fish_wait.animKey;
  }
  if (semantic === SLIME_ANIM.FISH_BITE) {
    return PINGO_FISHING_CLIPS.fish_bite.animKey;
  }
  if (semantic === SLIME_ANIM.FISH_PULL) {
    return PINGO_FISHING_CLIPS.fish_pull.animKey;
  }
  if (semantic === SLIME_ANIM.FISH_SUCCESS) {
    return PINGO_FISHING_CLIPS.fish_success.animKey;
  }
  return undefined;
}

export function isPingo(slimeId: string): boolean {
  return slimeId === SLIME_IDS.PINGO;
}

export function rodFrameOffset(anim: SlimeAnimName, frameIndex: number): { x: number; y: number } {
  const entries = PINGO_ROD_FRAME_OFFSETS[anim];
  if (!entries || entries.length === 0) {
    return { x: 0, y: 0 };
  }
  let best = entries[0];
  for (const entry of entries) {
    if (entry.frameIndex <= frameIndex) {
      best = entry;
    }
  }
  return { x: best.rodOffsetX, y: best.rodOffsetY };
}

export function fishingRodPlacement(
  groundX: number,
  groundY: number,
  pose: FishingRodPose,
  visualSide: FishingVisualSide,
  anim: SlimeAnimName,
  frameIndex: number,
  extraNudgeX = 0,
): {
  handleX: number;
  handleY: number;
  tipX: number;
  tipY: number;
  flipX: boolean;
  originX: number;
  originY: number;
} {
  const { rodFlipX } = fishingFlips(visualSide);
  const sign = rodFlipX ? -1 : 1;
  const frame = rodFrameOffset(anim, frameIndex);
  const handleX = Math.floor(
    groundX + (PINGO_ROD_ORIGIN.x + frame.x + rodNudge.x) * sign + extraNudgeX,
  );
  const handleY = Math.floor(groundY + PINGO_ROD_ORIGIN.y + frame.y + rodNudge.y);
  const poseDef = ROD_POSE[pose];
  const origin = rodPhaserOrigin(rodFlipX);
  const tip = rodTipWorld(handleX, handleY, poseDef.tipX, poseDef.tipY, rodFlipX);
  return {
    handleX,
    handleY,
    tipX: tip.x,
    tipY: tip.y,
    flipX: rodFlipX,
    originX: origin.x,
    originY: origin.y,
  };
}

export function fishingClipFrame(
  anim: SlimeAnimName,
  elapsedMs: number,
): number {
  if (anim === SLIME_ANIM.FISH_CAST) {
    return Math.min(3, Math.floor(elapsedMs / FISHING_PRESENTATION.castFrameMs));
  }
  if (anim === SLIME_ANIM.FISH_WAIT) {
    return Math.floor(elapsedMs / FISHING_PRESENTATION.waitFrameMs) % 4;
  }
  if (anim === SLIME_ANIM.FISH_BITE) {
    let acc = 0;
    for (let i = 0; i < FISHING_PRESENTATION.biteFrameMs.length; i += 1) {
      acc += FISHING_PRESENTATION.biteFrameMs[i];
      if (elapsedMs < acc) {
        return i;
      }
    }
    return FISHING_PRESENTATION.biteFrameMs.length - 1;
  }
  if (anim === SLIME_ANIM.FISH_PULL) {
    const n = 7;
    const cycle = n * 2 - 2;
    const step = Math.floor(elapsedMs / FISHING_PRESENTATION.pullFrameMs) % cycle;
    return step < n ? step : cycle - step;
  }
  if (anim === SLIME_ANIM.FISH_SUCCESS) {
    let acc = 0;
    for (let i = 0; i < FISHING_PRESENTATION.successFrameMs.length; i += 1) {
      acc += FISHING_PRESENTATION.successFrameMs[i];
      if (elapsedMs < acc) {
        return i;
      }
    }
    return FISHING_PRESENTATION.successFrameMs.length - 1;
  }
  return 0;
}
