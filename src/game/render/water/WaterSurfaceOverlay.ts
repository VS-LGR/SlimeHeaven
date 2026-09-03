import Phaser from "phaser";
import { DEPTH, TILE_SIZE } from "../../config";
import { bakeWaterDepthTexture } from "./bakeWaterDepthTexture";
import type { WaterCell } from "./waterCoverage";
import { waterBoundsPx } from "./waterCoverage";
import { transitionDirs } from "./waterDepthTransition";
import { WATER_PATTERN_SIZE, WATER_TEXTURE, WATER_VFX } from "./waterVisualConfig";

export class WaterSurfaceOverlay {
  private readonly depthImage: Phaser.GameObjects.Image | undefined;
  private readonly debugGfx: Phaser.GameObjects.Graphics;
  private readonly surface: Phaser.GameObjects.TileSprite | undefined;
  private offset = 0;
  private nextSurfaceAt = 0;
  private enabled = true;
  private depthBoundsVisible = false;

  constructor(
    scene: Phaser.Scene,
    private readonly cells: readonly WaterCell[],
    private readonly waterMask: Phaser.Display.Masks.GeometryMask,
  ) {
    this.depthImage = bakeWaterDepthTexture(scene, cells);
    this.debugGfx = scene.add.graphics().setDepth(DEPTH.WATER_SHORE + 0.02).setVisible(false);

    const bounds = waterBoundsPx(cells);
    if (bounds) {
      this.surface = scene.add
        .tileSprite(bounds.x, bounds.y, bounds.width, bounds.height, WATER_TEXTURE.surface)
        .setOrigin(0, 0)
        .setDepth(DEPTH.WATER_SURFACE)
        .setAlpha(WATER_VFX.surfaceAlpha)
        .setMask(this.waterMask);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.depthImage?.setVisible(enabled);
    this.surface?.setVisible(enabled);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setDepthBoundsVisible(visible: boolean): void {
    this.depthBoundsVisible = visible;
    this.debugGfx.setVisible(visible);
    if (visible) {
      this.drawDepthBounds();
    } else {
      this.debugGfx.clear();
    }
  }

  isDepthBoundsVisible(): boolean {
    return this.depthBoundsVisible;
  }

  update(time: number): void {
    if (!this.enabled) {
      return;
    }
    if (time >= this.nextSurfaceAt) {
      this.offset = (this.offset + WATER_VFX.surfaceStepPx) % WATER_PATTERN_SIZE;
      if (this.surface) {
        this.surface.tilePositionX = this.offset;
        this.surface.tilePositionY = Math.floor(this.offset / 2);
      }
      this.nextSurfaceAt = time + WATER_VFX.surfaceStepMs;
    }
  }

  destroy(): void {
    this.depthImage?.destroy();
    this.debugGfx.destroy();
    this.surface?.destroy();
  }

  private drawDepthBounds(): void {
    this.debugGfx.clear();
    for (const cell of this.cells) {
      const x = cell.x * TILE_SIZE;
      const y = cell.y * TILE_SIZE;
      if (cell.interior) {
        this.debugGfx.fillStyle(0x1a3a80, 0.28);
      } else {
        this.debugGfx.fillStyle(0x4ec8e8, 0.22);
      }
      this.debugGfx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      this.debugGfx.lineStyle(1, 0xffe066, 0.9);
      const dirs = new Set(transitionDirs(cell).map((item) => item.dir));
      if (dirs.has("n")) {
        this.debugGfx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, 1);
      }
      if (dirs.has("s")) {
        this.debugGfx.strokeRect(x + 0.5, y + TILE_SIZE - 1.5, TILE_SIZE - 1, 1);
      }
      if (dirs.has("w")) {
        this.debugGfx.strokeRect(x + 0.5, y + 0.5, 1, TILE_SIZE - 1);
      }
      if (dirs.has("e")) {
        this.debugGfx.strokeRect(x + TILE_SIZE - 1.5, y + 0.5, 1, TILE_SIZE - 1);
      }
    }
  }
}
