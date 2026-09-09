import Phaser from "phaser";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import {
  CARRY_TEXTURE,
  SLIME_COLORS,
  SLIME_FRAME_HEIGHT,
  SLIME_FRAME_WIDTH,
  STORAGE_TEXTURE_KEY,
  slimeBodyKey,
  slimeShadowKey,
} from "./slimeVisualConfig";
import { FISHING_BOBBER_KEY } from "./fishing/FishingRenderer";

function canvasContext(
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

function commit(scene: Phaser.Scene, key: string): void {
  const texture = scene.textures.get(key) as Phaser.Textures.CanvasTexture;
  texture.refresh();
  texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
}

function paintSlime(
  ctx: CanvasRenderingContext2D,
  fill: string,
  eye: string,
): void {
  ctx.clearRect(0, 0, SLIME_FRAME_WIDTH, SLIME_FRAME_HEIGHT);
  ctx.fillStyle = fill;
  const rows: Array<[number, number, number]> = [
    [10, 11, 10],
    [11, 9, 14],
    [12, 8, 16],
    [13, 7, 18],
    [14, 6, 20],
    [15, 6, 20],
    [16, 6, 20],
    [17, 6, 20],
    [18, 6, 20],
    [19, 6, 20],
    [20, 6, 20],
    [21, 6, 20],
    [22, 7, 18],
    [23, 7, 18],
    [24, 8, 16],
    [25, 8, 16],
    [26, 9, 14],
    [27, 10, 12],
    [28, 11, 10],
    [29, 12, 8],
    [30, 13, 6],
  ];
  for (const [y, x, w] of rows) {
    ctx.fillRect(x, y, w, 1);
  }
  ctx.fillStyle = eye;
  ctx.fillRect(11, 17, 2, 2);
  ctx.fillRect(19, 17, 2, 2);
  ctx.fillStyle = "#f4f7fb";
  ctx.fillRect(11, 17, 1, 1);
  ctx.fillRect(19, 17, 1, 1);
}

function paintShadow(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 16, 6);
  ctx.fillStyle = "rgba(20, 16, 12, 0.38)";
  ctx.fillRect(3, 2, 10, 2);
  ctx.fillRect(4, 1, 8, 1);
  ctx.fillRect(4, 4, 8, 1);
}

function paintWood(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 8, 8);
  ctx.fillStyle = "#6b3f1f";
  ctx.fillRect(1, 3, 6, 3);
  ctx.fillStyle = "#8a5428";
  ctx.fillRect(1, 3, 6, 1);
  ctx.fillStyle = "#4a2a12";
  ctx.fillRect(2, 5, 4, 1);
}

function paintStone(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 8, 8);
  ctx.fillStyle = "#8b8f96";
  ctx.fillRect(2, 3, 4, 3);
  ctx.fillRect(1, 4, 6, 2);
  ctx.fillStyle = "#c5c7cc";
  ctx.fillRect(2, 3, 2, 1);
}

function paintFood(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 8, 8);
  ctx.fillStyle = "#d9772c";
  ctx.fillRect(3, 2, 2, 5);
  ctx.fillStyle = "#f0a04b";
  ctx.fillRect(3, 2, 2, 2);
  ctx.fillStyle = "#4a7c3a";
  ctx.fillRect(2, 1, 1, 2);
  ctx.fillRect(5, 1, 1, 2);
}

function paintStorage(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 16, 16);
  ctx.fillStyle = "#7a4e28";
  ctx.fillRect(3, 6, 10, 8);
  ctx.fillStyle = "#c4a15a";
  ctx.fillRect(3, 6, 10, 2);
  ctx.fillStyle = "#5a3518";
  ctx.fillRect(3, 10, 10, 1);
  ctx.fillRect(7, 8, 2, 4);
}

function paintBobber(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 8, 8);
  ctx.fillStyle = "#e8e4dc";
  ctx.fillRect(2, 3, 4, 4);
  ctx.fillStyle = "#c43c3c";
  ctx.fillRect(2, 3, 4, 2);
  ctx.fillStyle = "#3a2a22";
  ctx.fillRect(3, 1, 2, 2);
}

export function createPlaceholderTextures(scene: Phaser.Scene): void {
  for (const id of Object.values(SLIME_IDS)) {
    const key = slimeBodyKey(id);
    const ctx = canvasContext(scene, key, SLIME_FRAME_WIDTH, SLIME_FRAME_HEIGHT);
    const colors = SLIME_COLORS[id];
    paintSlime(ctx, colors.fill, colors.eye);
    commit(scene, key);
  }

  paintShadow(canvasContext(scene, slimeShadowKey(), 16, 6));
  commit(scene, slimeShadowKey());
  paintWood(canvasContext(scene, CARRY_TEXTURE.wood, 8, 8));
  commit(scene, CARRY_TEXTURE.wood);
  paintStone(canvasContext(scene, CARRY_TEXTURE.stone, 8, 8));
  commit(scene, CARRY_TEXTURE.stone);
  paintFood(canvasContext(scene, CARRY_TEXTURE.food, 8, 8));
  commit(scene, CARRY_TEXTURE.food);
  paintStorage(canvasContext(scene, STORAGE_TEXTURE_KEY, 16, 16));
  commit(scene, STORAGE_TEXTURE_KEY);
  paintBobber(canvasContext(scene, FISHING_BOBBER_KEY, 8, 8));
  commit(scene, FISHING_BOBBER_KEY);
}
