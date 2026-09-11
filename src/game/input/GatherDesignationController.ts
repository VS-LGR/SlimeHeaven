import Phaser from "phaser";
import { DEPTH } from "../config";
import { TILE_SIZE, tileToWorld, worldToTile } from "@/src/world/constants";
import { OBJECT_DEFS, ObjectType } from "@/src/world/tileTypes";
import type { Simulation } from "@/src/simulation/Simulation";
import type { GatherTaskType } from "@/src/simulation/entities/Task";
import type { ResourceNode } from "@/src/simulation/entities/ResourceNode";
import { inspectGatherTarget } from "@/src/simulation/systems/JobSystem";
import { useGameUiStore, type WorldToolMode } from "@/src/store/gameUiStore";

const VALID_FILL = 0x7ecb6a;
const INVALID_FILL = 0xe07070;

function gatherTypeForTool(tool: WorldToolMode): GatherTaskType | null {
  if (tool === "gather_wood") {
    return "gather_wood";
  }
  if (tool === "gather_stone") {
    return "gather_stone";
  }
  return null;
}

function nodeFootprint(node: ResourceNode): { x: number; y: number; width: number; height: number } {
  if (node.type === "wood") {
    const def = OBJECT_DEFS[ObjectType.TREE];
    return { x: node.tile.x, y: node.tile.y, width: def.footprintWidth, height: def.footprintHeight };
  }
  return { x: node.tile.x, y: node.tile.y, width: 1, height: 1 };
}

export class GatherDesignationController {
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

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown() || !this.gatherType()) {
        return;
      }
      const tile = this.tileFrom(pointer);
      if (!tile) {
        return;
      }
      this.hoverX = tile.x;
      this.hoverY = tile.y;
      this.commit(tile.x, tile.y);
      this.redraw();
    });

    scene.input.keyboard?.on("keydown-ESC", () => {
      if (!this.isToolActive()) {
        return;
      }
      useGameUiStore.getState().setWorldTool("off");
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
    return this.gatherType() !== null;
  }

  private gatherType(): GatherTaskType | null {
    return gatherTypeForTool(useGameUiStore.getState().worldTool);
  }

  private tileFrom(pointer: Phaser.Input.Pointer): { x: number; y: number } | null {
    const { x, y } = worldToTile(pointer.worldX, pointer.worldY);
    if (!this.simulation.state.grid.inBounds(x, y)) {
      return null;
    }
    return { x, y };
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (!this.gatherType()) {
      this.overlay.clear();
      return;
    }
    const tile = this.tileFrom(pointer);
    this.hoverX = tile?.x ?? null;
    this.hoverY = tile?.y ?? null;
    this.redraw();
  }

  private commit(x: number, y: number): void {
    const type = this.gatherType();
    if (!type) {
      return;
    }
    this.simulation.designateGatherAt(type, { x, y });
  }

  private redraw(): void {
    this.overlay.clear();
    const type = this.gatherType();
    if (!type || this.hoverX === null || this.hoverY === null) {
      return;
    }
    const inspected = inspectGatherTarget(this.simulation.state, type, {
      x: this.hoverX,
      y: this.hoverY,
    });
    if (!inspected) {
      this.drawTile(this.hoverX, this.hoverY, INVALID_FILL);
      return;
    }
    const fill = inspected.valid ? VALID_FILL : INVALID_FILL;
    const footprint = nodeFootprint(inspected.node);
    for (let dy = 0; dy < footprint.height; dy += 1) {
      for (let dx = 0; dx < footprint.width; dx += 1) {
        this.drawTile(footprint.x + dx, footprint.y + dy, fill);
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
