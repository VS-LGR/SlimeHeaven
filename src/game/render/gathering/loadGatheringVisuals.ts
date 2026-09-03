import Phaser from "phaser";
import {
  TITO_CHOP_AXE,
  TITO_CHOP_BODY,
  TITO_GATHER_SWING_BODY_ANIM_REPEAT,
  TITO_GATHER_SWING_FRAME_RATE,
  TITO_PICKAXE,
} from "./titoChopVisualConfig";
import { setTitoChopAxeReady, setTitoChopBodyReady, setTitoPickaxeReady } from "./resolveGatheringAnim";

export function preloadGatheringVisuals(scene: Phaser.Scene): void {
  for (let i = 0; i < TITO_CHOP_BODY.keys.length; i += 1) {
    scene.load.image(TITO_CHOP_BODY.keys[i], TITO_CHOP_BODY.paths[i]);
  }
  for (let i = 0; i < TITO_CHOP_AXE.keys.length; i += 1) {
    scene.load.image(TITO_CHOP_AXE.keys[i], TITO_CHOP_AXE.paths[i]);
  }
  for (let i = 0; i < TITO_PICKAXE.keys.length; i += 1) {
    scene.load.image(TITO_PICKAXE.keys[i], TITO_PICKAXE.paths[i]);
  }
}

export function createGatheringAnimations(scene: Phaser.Scene): void {
  const missing: string[] = [];
  const ready = (key: string): boolean => {
    if (scene.textures.exists(key)) {
      scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      return true;
    }
    missing.push(key);
    return false;
  };

  const bodyFrames = TITO_CHOP_BODY.keys.filter((key) => ready(key));
  const bodyOk = bodyFrames.length === TITO_CHOP_BODY.keys.length;
  setTitoChopBodyReady(bodyOk);
  if (bodyOk) {
    replaceAnim(
      scene,
      TITO_CHOP_BODY.animKey,
      bodyFrames,
      TITO_GATHER_SWING_FRAME_RATE,
      TITO_GATHER_SWING_BODY_ANIM_REPEAT,
    );
  } else {
    console.warn("Tito tito_gather_swing body frames incomplete; using Idle/Hop/Work fallback.", missing);
  }

  const axeFrames = TITO_CHOP_AXE.keys.filter((key) => ready(key));
  const axeOk = axeFrames.length === TITO_CHOP_AXE.keys.length;
  setTitoChopAxeReady(axeOk);
  if (!axeOk) {
    console.warn("Tito axe frames incomplete; tito_gather_swing will use generic Work without an axe.");
  }

  const pickaxeFrames = TITO_PICKAXE.keys.filter((key) => ready(key));
  const pickaxeOk = pickaxeFrames.length === TITO_PICKAXE.keys.length;
  setTitoPickaxeReady(pickaxeOk);
  if (!pickaxeOk) {
    console.warn("Tito pickaxe frames incomplete; gather_stone will use generic Work without a pickaxe.");
  }
}

function replaceAnim(
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
