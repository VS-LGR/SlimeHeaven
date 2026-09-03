import Phaser from "phaser";
import {
  SCENE_KEYS,
  TILE_SIZE,
  TILESET_KEY,
  TILESET_PATH,
  TILESET_SOURCE_HEIGHT,
  TILESET_SOURCE_WIDTH,
} from "../config";
import { worldImageLoads } from "@/src/world/tileTypes";
import { createPlaceholderTextures } from "../render/createPlaceholderTextures";
import { createSlimeAnimations, preloadSlimeVisuals } from "../render/loadSlimeVisuals";
import { createFishingAnimations, preloadFishingVisuals } from "../render/fishing/loadFishingVisuals";
import { createFarmingAnimations, preloadFarmingVisuals } from "../render/farming/loadFarmingVisuals";
import { createGatheringAnimations, preloadGatheringVisuals } from "../render/gathering/loadGatheringVisuals";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  preload(): void {
    this.load.spritesheet(TILESET_KEY, TILESET_PATH, {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    for (const { key, path } of worldImageLoads()) {
      this.load.image(key, path);
    }
    preloadSlimeVisuals(this);
    preloadFishingVisuals(this);
    preloadFarmingVisuals(this);
    preloadGatheringVisuals(this);
  }

  create(): void {
    const source = this.textures.get(TILESET_KEY).getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement;
    const width = source.width;
    const height = source.height;

    if (width !== TILESET_SOURCE_WIDTH || height !== TILESET_SOURCE_HEIGHT) {
      const message = `Tileset size mismatch: expected ${TILESET_SOURCE_WIDTH}x${TILESET_SOURCE_HEIGHT}, got ${width}x${height}`;
      console.error(message);
      this.add
        .text(this.scale.width / 2, this.scale.height / 2, message, {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#ffb4b4",
          align: "center",
          wordWrap: { width: this.scale.width - 24 },
        })
        .setOrigin(0.5);
      return;
    }

    createPlaceholderTextures(this);
    createSlimeAnimations(this);
    createFishingAnimations(this);
    createFarmingAnimations(this);
    createGatheringAnimations(this);
    this.textures.get(TILESET_KEY).setFilter(Phaser.Textures.FilterMode.NEAREST);
    for (const { key } of worldImageLoads()) {
      if (this.textures.exists(key)) {
        this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }
    this.scene.start(SCENE_KEYS.VILLAGE);
  }
}
