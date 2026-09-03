import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import type { Grid } from "@/src/world/Grid";
import { useGameUiStore, type TileInspect } from "@/src/store/gameUiStore";

const HOVER_FILL = 0xffffff;
const SELECT_FILL = 0xfff1a8;

export class SelectionController {
  private readonly hover: Phaser.GameObjects.Graphics;
  private readonly selection: Phaser.GameObjects.Graphics;
  private hoveredX: number | null = null;
  private hoveredY: number | null = null;
  private selectedX: number | null = null;
  private selectedY: number | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly grid: Grid,
    private readonly inspectTile: (x: number, y: number) => TileInspect | null,
    private readonly onLeftClick?: (pointer: Phaser.Input.Pointer) => boolean,
  ) {
    this.hover = scene.add.graphics().setDepth(DEPTH.SELECTION);
    this.selection = scene.add.graphics().setDepth(DEPTH.SELECTION + 1);

    scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        return;
      }
      this.setHoverFromPointer(pointer);
    });

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) {
        return;
      }
      if (this.onLeftClick?.(pointer)) {
        return;
      }
      this.setHoverFromPointer(pointer);
      if (this.hoveredX === null || this.hoveredY === null) {
        return;
      }
      this.selectedX = this.hoveredX;
      this.selectedY = this.hoveredY;
      this.drawSelection();
      this.pushStore();
    });
  }

  refreshInspect(): void {
    this.pushStore();
  }

  private setHoverFromPointer(pointer: Phaser.Input.Pointer): void {
    const { x: tileX, y: tileY } = worldToTile(pointer.worldX, pointer.worldY);

    if (!this.grid.inBounds(tileX, tileY)) {
      if (this.hoveredX !== null || this.hoveredY !== null) {
        this.hoveredX = null;
        this.hoveredY = null;
        this.hover.clear();
        this.pushStore();
      }
      return;
    }

    if (tileX === this.hoveredX && tileY === this.hoveredY) {
      return;
    }

    this.hoveredX = tileX;
    this.hoveredY = tileY;
    this.drawHover();
    this.pushStore();
  }

  private drawHover(): void {
    this.hover.clear();
    if (this.hoveredX === null || this.hoveredY === null) {
      return;
    }
    this.drawTileRect(this.hover, this.hoveredX, this.hoveredY, HOVER_FILL, 0.18, 0.55);
  }

  private drawSelection(): void {
    this.selection.clear();
    if (this.selectedX === null || this.selectedY === null) {
      return;
    }
    this.drawTileRect(this.selection, this.selectedX, this.selectedY, SELECT_FILL, 0.22, 0.95);
  }

  private drawTileRect(
    graphics: Phaser.GameObjects.Graphics,
    tileX: number,
    tileY: number,
    color: number,
    fillAlpha: number,
    strokeAlpha: number,
  ): void {
    const { x, y } = tileToWorld(tileX, tileY);
    graphics.fillStyle(color, fillAlpha);
    graphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    graphics.lineStyle(1, color, strokeAlpha);
    graphics.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  }

  private pushStore(): void {
    useGameUiStore.getState().setRuntime({
      hoveredX: this.hoveredX,
      hoveredY: this.hoveredY,
      selectedX: this.selectedX,
      selectedY: this.selectedY,
      hoveredTile: this.inspectAt(this.hoveredX, this.hoveredY),
      selectedTile: this.inspectAt(this.selectedX, this.selectedY),
    });
  }

  private inspectAt(x: number | null, y: number | null): TileInspect | null {
    if (x === null || y === null) {
      return null;
    }
    return this.inspectTile(x, y);
  }
}
