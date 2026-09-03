import Phaser from "phaser";
import { cropGrowthFrameLoads } from "@/src/simulation/data/crops";
import { MOMO_TILL_BODY, MOMO_TILL_BODY_ANIM_REPEAT, MOMO_TILL_DIRT, MOMO_TILL_FRAME_RATE, MOMO_TILL_HOE } from "./momoTillVisualConfig";
import { MOMO_PLANT_BODY, MOMO_PLANT_BODY_ANIM_REPEAT, MOMO_PLANT_FRAME_RATE } from "./momoPlantVisualConfig";
import { MOMO_HARVEST_BODY, MOMO_HARVEST_BODY_ANIM_REPEAT, MOMO_HARVEST_FRAME_RATE } from "./momoHarvestVisualConfig";
import { FARM_SOIL_FRAME, FARM_SOIL_PATH, FARM_SOIL_TEXTURE_KEY } from "./farmSoilVisualConfig";
import {
  setMomoHarvestReady,
  setMomoPlantReady,
  setMomoTillDirtReady,
  setMomoTillHoeReady,
  setMomoTillReady,
} from "./resolveFarmingAnim";

export function preloadFarmingVisuals(scene: Phaser.Scene): void {
  scene.load.spritesheet(FARM_SOIL_TEXTURE_KEY, FARM_SOIL_PATH, {
    frameWidth: FARM_SOIL_FRAME.width,
    frameHeight: FARM_SOIL_FRAME.height,
  });
  for (const { key, path } of cropGrowthFrameLoads()) {
    scene.load.image(key, path);
  }
  for (let i = 0; i < MOMO_TILL_BODY.keys.length; i += 1) {
    scene.load.image(MOMO_TILL_BODY.keys[i], MOMO_TILL_BODY.paths[i]);
  }
  for (let i = 0; i < MOMO_TILL_HOE.keys.length; i += 1) {
    scene.load.image(MOMO_TILL_HOE.keys[i], MOMO_TILL_HOE.paths[i]);
  }
  for (let i = 0; i < MOMO_TILL_DIRT.keys.length; i += 1) {
    scene.load.image(MOMO_TILL_DIRT.keys[i], MOMO_TILL_DIRT.paths[i]);
  }
  for (let i = 0; i < MOMO_PLANT_BODY.keys.length; i += 1) {
    scene.load.image(MOMO_PLANT_BODY.keys[i], MOMO_PLANT_BODY.paths[i]);
  }
  for (let i = 0; i < MOMO_HARVEST_BODY.keys.length; i += 1) {
    scene.load.image(MOMO_HARVEST_BODY.keys[i], MOMO_HARVEST_BODY.paths[i]);
  }
}

export function createFarmingAnimations(scene: Phaser.Scene): void {
  const missing: string[] = [];
  const ready = (key: string): boolean => {
    if (scene.textures.exists(key)) {
      scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      return true;
    }
    missing.push(key);
    return false;
  };

  if (scene.textures.exists(FARM_SOIL_TEXTURE_KEY)) {
    scene.textures.get(FARM_SOIL_TEXTURE_KEY).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  for (const { key } of cropGrowthFrameLoads()) {
    ready(key);
  }

  const bodyFrames = MOMO_TILL_BODY.keys.filter((key) => ready(key));
  const bodyOk = bodyFrames.length === MOMO_TILL_BODY.keys.length;
  setMomoTillReady(bodyOk);
  if (bodyOk) {
    replaceAnim(scene, MOMO_TILL_BODY.animKey, bodyFrames, MOMO_TILL_FRAME_RATE, MOMO_TILL_BODY_ANIM_REPEAT);
  } else {
    console.warn("Momo farm_till body frames incomplete; using Idle/Hop/Work fallback.", missing);
  }

  const hoeFrames = MOMO_TILL_HOE.keys.filter((key) => ready(key));
  const hoeOk = hoeFrames.length === MOMO_TILL_HOE.keys.length;
  setMomoTillHoeReady(hoeOk);
  if (!hoeOk) {
    console.warn("Momo hoe frames incomplete; farm_till will play without a hoe.");
  }

  const dirtFrames = MOMO_TILL_DIRT.keys.filter((key) => ready(key));
  const dirtOk = dirtFrames.length === MOMO_TILL_DIRT.keys.length;
  setMomoTillDirtReady(dirtOk);
  if (dirtOk) {
    replaceAnim(scene, MOMO_TILL_DIRT.animKey, dirtFrames, MOMO_TILL_FRAME_RATE, 0);
  } else {
    console.warn("Momo till dirt VFX missing; farm_till continues without impact dust.");
  }

  const plantFrames = MOMO_PLANT_BODY.keys.filter((key) => ready(key));
  const plantOk = plantFrames.length === MOMO_PLANT_BODY.keys.length;
  setMomoPlantReady(plantOk);
  if (plantOk) {
    replaceAnim(scene, MOMO_PLANT_BODY.animKey, plantFrames, MOMO_PLANT_FRAME_RATE, MOMO_PLANT_BODY_ANIM_REPEAT);
  } else {
    console.warn("Momo farm_plant body frames incomplete; using Idle/Hop/Work fallback.");
  }

  const harvestFrames = MOMO_HARVEST_BODY.keys.filter((key) => ready(key));
  const harvestOk = harvestFrames.length === MOMO_HARVEST_BODY.keys.length;
  setMomoHarvestReady(harvestOk);
  if (harvestOk) {
    replaceAnim(
      scene,
      MOMO_HARVEST_BODY.animKey,
      harvestFrames,
      MOMO_HARVEST_FRAME_RATE,
      MOMO_HARVEST_BODY_ANIM_REPEAT,
    );
  } else {
    console.warn("Momo farm_harvest body frames incomplete; using Idle/Hop/Work fallback.");
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
