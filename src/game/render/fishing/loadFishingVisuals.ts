import Phaser from "phaser";
import { FISHING_PRESENTATION } from "./fishingVisualConfig";
import {
  FISHING_FX,
  FISHING_FX_ANIM,
  FISHING_PROP_KEYS,
  FISHING_PROP_PATHS,
  PINGO_FISHING_CLIPS,
} from "./pingoFishingVisualConfig";
import { setPingoFishingReady } from "./resolveFishingAnim";

export function preloadFishingVisuals(scene: Phaser.Scene): void {
  for (const clip of Object.values(PINGO_FISHING_CLIPS)) {
    for (let i = 0; i < clip.keys.length; i += 1) {
      scene.load.image(clip.keys[i], clip.paths[i]);
    }
  }
  for (const [id, path] of Object.entries(FISHING_PROP_PATHS)) {
    scene.load.image(FISHING_PROP_KEYS[id as keyof typeof FISHING_PROP_KEYS], path);
  }
  for (const pack of Object.values(FISHING_FX)) {
    for (let i = 0; i < pack.keys.length; i += 1) {
      scene.load.image(pack.keys[i], pack.paths[i]);
    }
  }
}

export function createFishingAnimations(scene: Phaser.Scene): void {
  const missing: string[] = [];
  const ready = (key: string): boolean => {
    if (scene.textures.exists(key)) {
      scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      return true;
    }
    missing.push(key);
    return false;
  };

  let pingoOk = true;
  for (const clip of Object.values(PINGO_FISHING_CLIPS)) {
    const frames = clip.keys.filter((key) => ready(key));
    if (frames.length !== clip.keys.length) {
      pingoOk = false;
      continue;
    }
    replaceAnim(scene, clip.animKey, frames, clip.animKey);
  }
  setPingoFishingReady(pingoOk);
  if (!pingoOk) {
    console.warn("Pingo fishing body frames incomplete; using Idle/Hop/Work fallback.", missing);
  }

  for (const key of Object.values(FISHING_PROP_KEYS)) {
    ready(key);
  }

  const idle = FISHING_FX.bobberIdle.keys.filter((key) => ready(key));
  if (idle.length === FISHING_FX.bobberIdle.keys.length) {
    replaceFxAnim(scene, FISHING_FX_ANIM.bobberIdle, idle, 1000 / FISHING_PRESENTATION.bobberIdleFrameMs, -1);
  }
  const submerge = FISHING_FX.submerge.keys.filter((key) => ready(key));
  if (submerge.length === FISHING_FX.submerge.keys.length) {
    replaceFxAnim(scene, FISHING_FX_ANIM.submerge, submerge, 1000 / FISHING_PRESENTATION.submergeFrameMs, 0);
  }
  const bubbles = FISHING_FX.bubbles.keys.filter((key) => ready(key));
  if (bubbles.length === FISHING_FX.bubbles.keys.length) {
    replaceFxAnim(scene, FISHING_FX_ANIM.bubbles, bubbles, 1000 / FISHING_PRESENTATION.bubbleFrameMs, -1);
  }
  const splash = FISHING_FX.splash.keys.filter((key) => ready(key));
  if (splash.length === FISHING_FX.splash.keys.length) {
    replaceFxAnim(scene, FISHING_FX_ANIM.splash, splash, 1000 / FISHING_PRESENTATION.splashFrameMs, 0);
  }
  if (missing.length > 0 && pingoOk) {
    console.warn("Some fishing props failed to load; those clips will stay hidden.", missing);
  }
}

function replaceAnim(scene: Phaser.Scene, animKey: string, frames: string[], kind: string): void {
  if (scene.anims.exists(animKey)) {
    scene.anims.remove(animKey);
  }
  const durations =
    kind === PINGO_FISHING_CLIPS.fish_bite.animKey
      ? FISHING_PRESENTATION.biteFrameMs
      : kind === PINGO_FISHING_CLIPS.fish_success.animKey
        ? FISHING_PRESENTATION.successFrameMs
        : undefined;
  const extras: Phaser.Types.Animations.Animation = {};
  if (kind === PINGO_FISHING_CLIPS.fish_cast.animKey) {
    extras.frameRate = 1000 / FISHING_PRESENTATION.castFrameMs;
    extras.repeat = 0;
  } else if (kind === PINGO_FISHING_CLIPS.fish_wait.animKey) {
    extras.frameRate = 1000 / FISHING_PRESENTATION.waitFrameMs;
    extras.repeat = -1;
  } else if (kind === PINGO_FISHING_CLIPS.fish_pull.animKey) {
    extras.frameRate = 1000 / FISHING_PRESENTATION.pullFrameMs;
    extras.repeat = -1;
    extras.yoyo = true;
  } else {
    extras.repeat = 0;
  }
  scene.anims.create({
    key: animKey,
    frames: frames.map((frameKey, index) => ({
      key: frameKey,
      duration: durations ? durations[index] : undefined,
    })),
    ...extras,
  });
}

function replaceFxAnim(
  scene: Phaser.Scene,
  animKey: string,
  frames: string[],
  frameRate: number,
  repeat: number,
): void {
  if (scene.anims.exists(animKey)) {
    scene.anims.remove(animKey);
  }
  scene.anims.create({
    key: animKey,
    frames: frames.map((frameKey) => ({ key: frameKey })),
    frameRate,
    repeat,
  });
}
