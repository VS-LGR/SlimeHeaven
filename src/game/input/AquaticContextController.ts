import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import type { Simulation } from "@/src/simulation/Simulation";
import { inspectCoralTarget } from "@/src/simulation/systems/JobSystem";
import { useGameUiStore } from "@/src/store/gameUiStore";

const VALID_FILL = 0x7ecb6a;
const INVALID_FILL = 0xe07070;

/**
 * Tool-off coral hover overlay. Reuses gather highlight colors.
 * Does not designate; Collect coral lives on the HUD chip.
 */
export class AquaticContextController {
  private readonly overlay: Phaser.GameObjects.Graphics;
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
  }

  sync(): void {
    if (!this.isOverlayActive()) {
      this.overlay.clear();
      return;
    }
    this.redraw();
  }

  private isOverlayActive(): boolean {
    return useGameUiStore.getState().worldTool === "off";
  }

  private tileFrom(pointer: Phaser.Input.Pointer): { x: number; y: number } | null {
    const { x, y } = worldToTile(pointer.worldX, pointer.worldY);
    if (!this.simulation.state.grid.inBounds(x, y)) {
      return null;
    }
    return { x, y };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isOverlayActive()) {
      this.overlay.clear();
      return;
    }
    const tile = this.tileFrom(pointer);
    this.hoverX = tile?.x ?? null;
    this.hoverY = tile?.y ?? null;
    this.redraw();
  }

  private redraw(): void {
    this.overlay.clear();
    if (!this.isOverlayActive() || this.hoverX === null || this.hoverY === null) {
      return;
    }
    const inspected = inspectCoralTarget(this.simulation.state, {
      x: this.hoverX,
      y: this.hoverY,
    });
    if (!inspected || inspected.reason === "depleted") {
      return;
    }
    this.drawTile(this.hoverX, this.hoverY, inspected.valid ? VALID_FILL : INVALID_FILL);
  }

  private drawTile(tileX: number, tileY: number, color: number): void {
    const { x, y } = tileToWorld(tileX, tileY);
    this.overlay.fillStyle(color, 0.28);
    this.overlay.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }
}
