import Phaser from "phaser";
import { TILE_SIZE } from "../../config";
import type { Grid } from "@/src/world/Grid";
import type { WaterCell } from "./waterCoverage";
import { collectWaterCells, waterCellCenter, waterEffectPoint } from "./waterCoverage";
import { createWaterTextures } from "./createWaterTextures";
import { WaterAmbientSystem } from "./WaterAmbientSystem";
import { WaterRippleSystem } from "./WaterRippleSystem";
import { WaterSurfaceOverlay } from "./WaterSurfaceOverlay";
import type { RippleType } from "./waterVisualConfig";

/**
 * Visual-only water polish. Does not own gameplay state.
 * Future systems may call spawnRipple(worldX, worldY, type).
 */
export class WaterRenderer {
  private readonly cells: readonly WaterCell[];
  private readonly maskGfx: Phaser.GameObjects.Graphics;
  private readonly waterMask: Phaser.Display.Masks.GeometryMask;
  private readonly surface: WaterSurfaceOverlay;
  private readonly ripples: WaterRippleSystem;
  private readonly ambient: WaterAmbientSystem;
  private readonly pointerHandler: (pointer: Phaser.Input.Pointer) => void;
  private destroyed = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly grid: Grid,
    private readonly ignoreClick?: () => boolean,
  ) {
    createWaterTextures(scene);
    this.cells = collectWaterCells(grid);

    this.maskGfx = scene.add.graphics().setVisible(false);
    for (const cell of this.cells) {
      this.maskGfx.fillStyle(0xffffff, 1);
      this.maskGfx.fillRect(cell.x * TILE_SIZE, cell.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    this.waterMask = this.maskGfx.createGeometryMask();

    this.surface = new WaterSurfaceOverlay(scene, this.cells, this.waterMask);
    this.ripples = new WaterRippleSystem(scene, grid, this.waterMask);
    this.ambient = new WaterAmbientSystem(scene, grid, this.cells, this.ripples, this.waterMask);

    this.pointerHandler = (pointer) => {
      if (!pointer.leftButtonDown() || pointer.rightButtonDown() || pointer.middleButtonDown()) {
        return;
      }
      if (this.ignoreClick?.()) {
        return;
      }
      this.spawnRipple(pointer.worldX, pointer.worldY, "click");
    };
    scene.input.on("pointerdown", this.pointerHandler);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  spawnRipple(worldX: number, worldY: number, type: RippleType): void {
    this.ripples.spawnRipple(worldX, worldY, type);
  }

  getWaterMask(): Phaser.Display.Masks.GeometryMask {
    return this.waterMask;
  }

  spawnFishShadow(worldX?: number, worldY?: number): void {
    this.ambient.spawnFishShadow(worldX, worldY);
  }

  spawnDebugRipple(tileX: number | null, tileY: number | null): void {
    if (tileX !== null && tileY !== null && this.grid.getTile(tileX, tileY)) {
      const cell = this.cells.find((entry) => entry.x === tileX && entry.y === tileY);
      if (cell) {
        const { x, y } = waterEffectPoint(cell);
        this.spawnRipple(x, y, "click");
        return;
      }
    }
    const cells = this.cells;
    if (cells.length === 0) {
      return;
    }
    const { x, y } = waterCellCenter(cells[Math.floor(cells.length / 2)]);
    this.spawnRipple(x, y, "click");
  }

  setSurfaceEnabled(enabled: boolean): void {
    this.surface.setEnabled(enabled);
  }

  setAmbientEnabled(enabled: boolean): void {
    this.ambient.setEnabled(enabled);
  }

  toggleSurface(): boolean {
    const next = !this.surface.isEnabled();
    this.surface.setEnabled(next);
    return next;
  }

  toggleAmbient(): boolean {
    const next = !this.ambient.isEnabled();
    this.ambient.setEnabled(next);
    return next;
  }

  toggleDepthBounds(): boolean {
    const next = !this.surface.isDepthBoundsVisible();
    this.surface.setDepthBoundsVisible(next);
    return next;
  }

  update(time: number, delta: number): void {
    this.surface.update(time);
    this.ripples.update(time);
    this.ambient.update(time, delta);
  }

  debugSnapshot(): {
    activeRipples: number;
    activeFishShadows: number;
    waterSurfaceOn: boolean;
    waterAmbientOn: boolean;
    waterDepthBoundsOn: boolean;
  } {
    return {
      activeRipples: this.ripples.count(),
      activeFishShadows: this.ambient.fishCount(),
      waterSurfaceOn: this.surface.isEnabled(),
      waterAmbientOn: this.ambient.isEnabled(),
      waterDepthBoundsOn: this.surface.isDepthBoundsVisible(),
    };
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.scene.input.off("pointerdown", this.pointerHandler);
    this.surface.destroy();
    this.ripples.destroy();
    this.ambient.destroy();
    this.waterMask.destroy();
    this.maskGfx.destroy();
  }
}
