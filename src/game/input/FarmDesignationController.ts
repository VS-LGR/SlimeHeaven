import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import type { Simulation } from "@/src/simulation/Simulation";
import { isValidFarmTerrain } from "@/src/simulation/systems/FarmSystem";
import { useGameUiStore } from "@/src/store/gameUiStore";

const VALID_FILL = 0x7ecb6a;
const INVALID_FILL = 0xe07070;

type FarmWorldTool = "designate" | "remove";

export class FarmDesignationController {
  private readonly overlay: Phaser.GameObjects.Graphics;

  private dragStart: { x: number; y: number } | null = null;
  private hoverX: number | null = null;
  private hoverY: number | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly simulation: Simulation,
  ) {
    this.overlay = scene.add.graphics().setDepth(DEPTH.SELECTION + 2);

    scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        return;
      }
      this.onMove(pointer);
    });

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown() || !this.farmMode()) {
        return;
      }
      const tile = this.tileFrom(pointer);
      if (!tile) {
        return;
      }
      this.dragStart = tile;
      this.hoverX = tile.x;
      this.hoverY = tile.y;
      this.redraw();
    });

    scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.farmMode() || !this.dragStart) {
        return;
      }
      const tile = this.tileFrom(pointer) ?? this.dragStart;
      this.commit(this.dragStart.x, this.dragStart.y, tile.x, tile.y);
      this.dragStart = null;
      this.redraw();
    });
  }

  sync(): void {
    if (!this.farmMode()) {
      this.dragStart = null;
      this.overlay.clear();
      return;
    }
    this.redraw();
  }

  isToolActive(): boolean {
    return this.farmMode() !== null;
  }

  private farmMode(): FarmWorldTool | null {
    const tool = useGameUiStore.getState().worldTool;
    if (tool === "designate" || tool === "remove") {
      return tool;
    }
    return null;
  }

  private tileFrom(pointer: Phaser.Input.Pointer): { x: number; y: number } | null {
    const { x, y } = worldToTile(pointer.worldX, pointer.worldY);
    if (!this.simulation.state.grid.inBounds(x, y)) {
      return null;
    }
    return { x, y };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.farmMode()) {
      this.overlay.clear();
      return;
    }
    const tile = this.tileFrom(pointer);
    this.hoverX = tile?.x ?? null;
    this.hoverY = tile?.y ?? null;
    this.redraw();
  }

  private commit(ax: number, ay: number, bx: number, by: number): void {
    if (this.farmMode() === "remove") {
      this.simulation.removeFarm(ax, ay, bx, by);
      return;
    }
    this.simulation.designateFarm(ax, ay, bx, by);
  }

  private redraw(): void {
    this.overlay.clear();
    if (!this.farmMode()) {
      return;
    }
    const endX = this.hoverX;
    const endY = this.hoverY;
    if (endX === null || endY === null) {
      return;
    }
    const start = this.dragStart ?? { x: endX, y: endY };
    const x0 = Math.min(start.x, endX);
    const y0 = Math.min(start.y, endY);
    const x1 = Math.max(start.x, endX);
    const y1 = Math.max(start.y, endY);
    const removing = this.farmMode() === "remove";
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        const valid = removing
          ? Boolean(this.simulation.state.farmAt(x, y)) ||
            Boolean(this.simulation.state.constructionSiteAt(x, y))
          : isValidFarmTerrain(this.simulation.state, x, y) &&
            !this.simulation.state.farmAt(x, y);
        this.drawTile(x, y, valid ? VALID_FILL : INVALID_FILL);
      }
    }
  }

  private drawTile(tileX: number, tileY: number, color: number): void {
    const { x, y } = tileToWorld(tileX, tileY);
    this.overlay.fillStyle(color, 0.28);
    this.overlay.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    this.overlay.lineStyle(1, color, 0.9);
    this.overlay.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  }
}
