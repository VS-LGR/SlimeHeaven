import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import type { Simulation } from "@/src/simulation/Simulation";
import { findActivityInRadius } from "@/src/simulation/systems/AquaticActivitySystem";
import { FISHING } from "@/src/simulation/fishingConfig";
import { isWaterWorld } from "../render/water/waterCoverage";
import { useGameUiStore } from "@/src/store/gameUiStore";

const VALID_FILL = 0x6ec8e0;
const INVALID_FILL = 0xe07070;

export class FishingController {
  private readonly overlay: Phaser.GameObjects.Graphics;
  private hoverWorldX: number | null = null;
  private hoverWorldY: number | null = null;

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
      if (!pointer.leftButtonDown()) {
        return;
      }
      if (this.simulation.state.fishing.phase === "fighting") {
        this.simulation.resolveFishingStrike(this.scene.time.now);
        return;
      }
      if (!this.isToolActive()) {
        return;
      }
      this.simulation.commitFishing(pointer.worldX, pointer.worldY);
      const feedback = this.simulation.state.lastJobFeedback;
      if (
        feedback &&
        (feedback.reason === "no_capable" || feedback.reason === "capable_busy") &&
        feedback.message
      ) {
        useGameUiStore.getState().setRuntime({
          jobToast: { message: feedback.message, hideAt: Date.now() + 2800 },
        });
      }
    });

    scene.input.keyboard?.on("keydown-SPACE", (event: KeyboardEvent) => {
      if (this.simulation.state.fishing.phase !== "fighting") {
        return;
      }
      event.preventDefault();
      this.simulation.resolveFishingStrike(this.scene.time.now);
    });

    scene.input.keyboard?.on("keydown-ESC", () => {
      this.simulation.cancelFishing();
      if (useGameUiStore.getState().worldTool === "fish") {
        useGameUiStore.getState().setWorldTool("off");
      }
    });
  }

  sync(): void {
    if (!this.isToolActive()) {
      this.overlay.clear();
      return;
    }
    this.redraw();
  }

  isToolActive(): boolean {
    return useGameUiStore.getState().worldTool === "fish";
  }

  ownsPointer(): boolean {
    return this.isToolActive() || this.simulation.state.fishing.phase === "fighting";
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isToolActive()) {
      this.overlay.clear();
      return;
    }
    const { x, y } = worldToTile(pointer.worldX, pointer.worldY);
    if (!this.simulation.state.grid.inBounds(x, y)) {
      this.hoverWorldX = null;
      this.hoverWorldY = null;
      this.overlay.clear();
      return;
    }
    this.hoverWorldX = pointer.worldX;
    this.hoverWorldY = pointer.worldY;
    this.redraw();
  }

  private redraw(): void {
    this.overlay.clear();
    if (!this.isToolActive() || this.hoverWorldX === null || this.hoverWorldY === null) {
      return;
    }
    const activity = findActivityInRadius(
      this.simulation.state,
      this.hoverWorldX,
      this.hoverWorldY,
      FISHING.clueHitRadiusPx,
    );
    if (activity) {
      this.paintTile(activity.tileX, activity.tileY, VALID_FILL);
      return;
    }
    const { x, y } = worldToTile(this.hoverWorldX, this.hoverWorldY);
    const { x: wx, y: wy } = tileToWorld(x, y);
    const valid = isWaterWorld(this.simulation.state.grid, wx + TILE_SIZE / 2, wy + TILE_SIZE / 2);
    this.paintTile(x, y, valid ? VALID_FILL : INVALID_FILL);
  }

  private paintTile(tileX: number, tileY: number, color: number): void {
    const { x, y } = tileToWorld(tileX, tileY);
    this.overlay.fillStyle(color, 0.28);
    this.overlay.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    this.overlay.lineStyle(1, color, 0.9);
    this.overlay.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  }
}
