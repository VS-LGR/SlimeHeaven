import Phaser from "phaser";
import { DEPTH, TILE_SIZE } from "../../config";
import type { WaterCell } from "./waterCoverage";
import { waterBoundsPx } from "./waterCoverage";
import { depthToneAt, type DepthTone } from "./waterDepthTransition";
import { canvasContext, commit } from "./createWaterTextures";
import { WATER_TEXTURE, WATER_VFX } from "./waterVisualConfig";

interface ToneRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const TONE_RGBA: Record<Exclude<DepthTone, "shallow">, ToneRgba> = {
  shallowDark: hexRgba(WATER_VFX.depthShallowDark, WATER_VFX.depthTransitionAlpha),
  deepLight: hexRgba(WATER_VFX.depthDeepLight, WATER_VFX.depthTransitionAlpha),
  deep: hexRgba(WATER_VFX.depthInteriorColor, WATER_VFX.depthInteriorAlpha),
  sediment: hexRgba(WATER_VFX.depthSediment, WATER_VFX.depthSedimentAlpha),
};

export function bakeWaterDepthTexture(
  scene: Phaser.Scene,
  cells: readonly WaterCell[],
): Phaser.GameObjects.Image | undefined {
  const bounds = waterBoundsPx(cells);
  if (!bounds) {
    return undefined;
  }
  const ctx = canvasContext(scene, WATER_TEXTURE.depth, bounds.width, bounds.height);
  ctx.clearRect(0, 0, bounds.width, bounds.height);
  ctx.imageSmoothingEnabled = false;
  for (const cell of cells) {
    for (let ly = 0; ly < TILE_SIZE; ly += 1) {
      for (let lx = 0; lx < TILE_SIZE; lx += 1) {
        const wx = cell.x * TILE_SIZE + lx;
        const wy = cell.y * TILE_SIZE + ly;
        const tone = depthToneAt(cell, wx, wy);
        if (tone === "shallow") {
          continue;
        }
        const rgba = TONE_RGBA[tone];
        ctx.fillStyle = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255})`;
        ctx.fillRect(wx - bounds.x, wy - bounds.y, 1, 1);
      }
    }
  }
  commit(scene, WATER_TEXTURE.depth);
  return scene.add
    .image(bounds.x, bounds.y, WATER_TEXTURE.depth)
    .setOrigin(0, 0)
    .setDepth(DEPTH.WATER_DEPTH);
}

function hexRgba(hex: number, alpha: number): ToneRgba {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
    a: Math.max(0, Math.min(255, Math.round(alpha * 255))),
  };
}
