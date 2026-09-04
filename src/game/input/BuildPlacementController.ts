import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import type { Simulation } from "@/src/simulation/Simulation";
import {
  type BuildingTypeId,
} from "@/src/simulation/data/buildings";
import {
  syncBuildingPreview,
  type BuildingPlacementEvaluation,
} from "@/src/simulation/systems/BuildingSystem";
import {
  applyBuildingSpriteLayout,
  buildingSpriteLayout,
} from "../render/buildings/buildingPresentation";
import { useGameUiStore } from "@/src/store/gameUiStore";

const VALID_FILL = 0x7ecb6a;
const INVALID_FILL = 0xe07070;
const ENTRANCE_FILL = 0xf0d060;
const PREVIEW_ALPHA = 0.7;

export class BuildPlacementController {
  private readonly overlay: Phaser.GameObjects.Graphics;
  private preview: Phaser.GameObjects.Image | null = null;
  private hoverX: number | null = null;
  private hoverY: number | null = null;
  private lastEvaluation: BuildingPlacementEvaluation | null = null;

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
      if (!pointer.leftButtonDown() || !this.isToolActive()) {
        return;
      }
      const tile = this.tileFrom(pointer);
      if (!tile) {
        return;
      }
      this.hoverX = tile.x;
      this.hoverY = tile.y;
      const typeId = this.selectedType();
      if (!typeId) {
        return;
      }
      this.simulation.placeBuilding(typeId, tile.x, tile.y);
      this.redraw();
    });

    scene.input.keyboard?.on("keydown-ESC", () => {
      if (!this.isToolActive()) {
        return;
      }
      useGameUiStore.getState().setWorldTool("off");
      this.clearPreview();
    });
  }

  sync(): void {
    if (!this.isToolActive()) {
      this.clearPreview();
      return;
    }
    this.redraw();
  }

  isToolActive(): boolean {
    return useGameUiStore.getState().worldTool === "build";
  }

  debugSnapshot(): BuildingPlacementEvaluation | null {
    return this.isToolActive() ? this.lastEvaluation : null;
  }

  private selectedType(): BuildingTypeId | null {
    const available = useGameUiStore.getState().availableBuildingTypeIds;
    if (available.length === 0) {
      return null;
    }
    const selected = useGameUiStore.getState().selectedBuildingTypeId;
    return available.includes(selected) ? selected : available[0];
  }

  private tileFrom(pointer: Phaser.Input.Pointer): { x: number; y: number } | null {
    const { x, y } = worldToTile(pointer.worldX, pointer.worldY);
    if (!this.simulation.state.grid.inBounds(x, y)) {
      return null;
    }
    return { x, y };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isToolActive()) {
      this.clearPreview();
      return;
    }
    const tile = this.tileFrom(pointer);
    this.hoverX = tile?.x ?? null;
    this.hoverY = tile?.y ?? null;
    this.redraw();
  }

  private clearPreview(): void {
    this.overlay.clear();
    this.lastEvaluation = null;
    this.hoverX = null;
    this.hoverY = null;
    if (this.preview) {
      this.preview.destroy();
      this.preview = null;
    }
  }

  private redraw(): void {
    this.overlay.clear();
    if (!this.isToolActive()) {
      this.clearPreview();
      return;
    }
    if (this.hoverX === null || this.hoverY === null) {
      this.lastEvaluation = null;
      this.preview?.setVisible(false);
      return;
    }
    const typeId = this.selectedType();
    if (!typeId) {
      this.lastEvaluation = null;
      this.preview?.setVisible(false);
      return;
    }
    const origin = { x: this.hoverX, y: this.hoverY };
    const evaluation = syncBuildingPreview(this.simulation.state, "build", typeId, origin);
    this.lastEvaluation = evaluation;
    if (!evaluation) {
      this.preview?.setVisible(false);
      return;
    }

    const fill = evaluation.valid ? VALID_FILL : INVALID_FILL;
    for (const tile of evaluation.footprint) {
      if (!this.simulation.state.grid.inBounds(tile.x, tile.y)) {
        continue;
      }
      this.drawTile(tile.x, tile.y, fill);
    }
    if (this.simulation.state.grid.inBounds(evaluation.entrance.x, evaluation.entrance.y)) {
      const entranceColor = evaluation.valid ? ENTRANCE_FILL : INVALID_FILL;
      this.drawTile(evaluation.entrance.x, evaluation.entrance.y, entranceColor);
    }

    this.syncPreviewSprite(typeId, origin);
  }

  private syncPreviewSprite(typeId: BuildingTypeId, origin: { x: number; y: number }): void {
    const layout = buildingSpriteLayout(origin, typeId, "preview");
    if (!this.preview) {
      this.preview = this.scene.add.image(layout.x, layout.y, layout.textureKey);
    }
    applyBuildingSpriteLayout(this.preview, layout);
    this.preview.setAlpha(PREVIEW_ALPHA).clearTint().setVisible(true);
  }

  private drawTile(tileX: number, tileY: number, color: number): void {
    const { x, y } = tileToWorld(tileX, tileY);
    this.overlay.fillStyle(color, 0.28);
    this.overlay.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    this.overlay.lineStyle(1, color, 0.9);
    this.overlay.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  }
}
