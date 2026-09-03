import Phaser from "phaser";
import { WATER_PATTERN_SIZE, WATER_TEXTURE } from "./waterVisualConfig";

export function canvasContext(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
): CanvasRenderingContext2D {
  if (scene.textures.exists(key)) {
    scene.textures.remove(key);
  }
  const texture = scene.textures.createCanvas(key, width, height);
  if (!texture) {
    throw new Error(`Failed to create texture ${key}`);
  }
  const context = texture.getContext();
  context.imageSmoothingEnabled = false;
  return context;
}

export function commit(scene: Phaser.Scene, key: string): void {
  const texture = scene.textures.get(key) as Phaser.Textures.CanvasTexture;
  texture.refresh();
  texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
}

function paintSurface(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, WATER_PATTERN_SIZE, WATER_PATTERN_SIZE);
  ctx.fillStyle = "rgba(18, 58, 92, 0.55)";
  ctx.fillRect(3, 7, 5, 1);
  ctx.fillRect(18, 21, 6, 1);
  ctx.fillRect(10, 28, 4, 1);
  ctx.fillStyle = "rgba(168, 232, 248, 0.7)";
  ctx.fillRect(8, 6, 2, 1);
  ctx.fillRect(22, 14, 1, 1);
  ctx.fillRect(4, 19, 1, 1);
  ctx.fillRect(27, 3, 2, 1);
  ctx.fillRect(15, 11, 1, 1);
  ctx.fillStyle = "rgba(12, 40, 70, 0.45)";
  ctx.fillRect(20, 8, 3, 1);
  ctx.fillRect(6, 24, 2, 1);
}

function paintFish(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 8, 4);
  ctx.fillStyle = "rgba(8, 22, 40, 1)";
  ctx.fillRect(2, 0, 4, 1);
  ctx.fillRect(1, 1, 6, 1);
  ctx.fillRect(1, 2, 6, 1);
  ctx.fillRect(2, 3, 1, 1);
  ctx.fillRect(5, 3, 1, 1);
}

export function createWaterTextures(scene: Phaser.Scene): void {
  paintSurface(canvasContext(scene, WATER_TEXTURE.surface, WATER_PATTERN_SIZE, WATER_PATTERN_SIZE));
  commit(scene, WATER_TEXTURE.surface);
  paintFish(canvasContext(scene, WATER_TEXTURE.fish, 8, 4));
  commit(scene, WATER_TEXTURE.fish);
}
