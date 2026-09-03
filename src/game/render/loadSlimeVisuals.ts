import Phaser from "phaser";
import { SLIME_IDS, type SlimeId } from "@/src/simulation/entities/SlimeState";
import {
  SLIME_VISUALS,
  slimeAnimKey,
  type CoreSlimeAnim,
} from "./slimeVisualConfig";

export function preloadSlimeVisuals(scene: Phaser.Scene): void {
  for (const id of Object.values(SLIME_IDS)) {
    const visual = SLIME_VISUALS[id];
    if (visual.kind !== "final") {
      continue;
    }
    for (const clip of Object.values(visual.anims)) {
      for (let i = 0; i < clip.textureKeys.length; i += 1) {
        scene.load.image(clip.textureKeys[i], clip.paths[i]);
      }
    }
  }
}

export function createSlimeAnimations(scene: Phaser.Scene): void {
  for (const id of Object.values(SLIME_IDS) as SlimeId[]) {
    const visual = SLIME_VISUALS[id];
    if (visual.kind !== "final") {
      continue;
    }
    for (const [animName, clip] of Object.entries(visual.anims) as Array<
      [CoreSlimeAnim, (typeof visual.anims)[CoreSlimeAnim]]
    >) {
      for (const key of clip.textureKeys) {
        scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      const animKey = slimeAnimKey(id, animName);
      if (scene.anims.exists(animKey)) {
        scene.anims.remove(animKey);
      }
      scene.anims.create({
        key: animKey,
        frames: clip.textureKeys.map((key) => ({ key })),
        frameRate: clip.frameRate,
        repeat: clip.repeat,
      });
    }
  }
}
