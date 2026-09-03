import Phaser from "phaser";
import { DEPTH } from "../../config";
import type { ClueType } from "@/src/simulation/data/fish";
import type { RippleType } from "./waterVisualConfig";

export interface WaterClueView {
  id: string;
  worldX: number;
  worldY: number;
  clueType: ClueType;
  clueVisible: boolean;
}

interface ClueVisual {
  view: WaterClueView;
  graphics: Phaser.GameObjects.Graphics;
  lastRippleAt: number;
}

const BUBBLE_COLOR = 0xe8f7ff;
const GLIMMER_COLOR = 0x7ef0ff;

export class WaterClueSystem {
  private readonly visuals = new Map<string, ClueVisual>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly waterMask: Phaser.Display.Masks.GeometryMask,
    private readonly spawnRipple: (worldX: number, worldY: number, type: RippleType) => void,
  ) {}

  sync(clues: readonly WaterClueView[], time: number): void {
    const seen = new Set<string>();
    for (const clue of clues) {
      seen.add(clue.id);
      let visual = this.visuals.get(clue.id);
      if (!visual) {
        visual = {
          view: clue,
          graphics: this.scene.add.graphics().setDepth(DEPTH.WATER_CLUE).setMask(this.waterMask),
          lastRippleAt: 0,
        };
        this.visuals.set(clue.id, visual);
      }
      visual.view = clue;
      this.drawClue(visual, time);
    }
    for (const [id, visual] of this.visuals) {
      if (seen.has(id)) {
        continue;
      }
      visual.graphics.destroy();
      this.visuals.delete(id);
    }
  }

  destroy(): void {
    for (const visual of this.visuals.values()) {
      visual.graphics.destroy();
    }
    this.visuals.clear();
  }

  private drawClue(visual: ClueVisual, time: number): void {
    const { view, graphics } = visual;
    graphics.clear();
    if (!view.clueVisible) {
      return;
    }
    const x = Math.floor(view.worldX);
    const y = Math.floor(view.worldY);
    if (view.clueType === "small_bubbles") {
      this.drawBubbles(graphics, x, y, time);
      return;
    }
    if (view.clueType === "large_ripple") {
      this.maybeRipple(visual, time, 900, "clue_large");
      return;
    }
    this.drawGlimmer(graphics, x, y, time);
    this.maybeRipple(visual, time, 1300, "clue_glimmer");
  }

  private maybeRipple(visual: ClueVisual, time: number, intervalMs: number, type: RippleType): void {
    if (time - visual.lastRippleAt < intervalMs) {
      return;
    }
    visual.lastRippleAt = time;
    this.spawnRipple(visual.view.worldX, visual.view.worldY, type);
  }

  private drawBubbles(graphics: Phaser.GameObjects.Graphics, x: number, y: number, time: number): void {
    const phase = Math.floor(time / 180);
    graphics.fillStyle(BUBBLE_COLOR, 0.85);
    const offsets: Array<[number, number]> = [
      [0, -1 - (phase % 3)],
      [2, 1 - (phase % 2)],
      [-2, 0],
    ];
    for (const [dx, dy] of offsets) {
      if ((phase + dx + dy) % 4 === 0) {
        continue;
      }
      graphics.fillRect(x + dx, y + dy, 1, 1);
    }
  }

  private drawGlimmer(graphics: Phaser.GameObjects.Graphics, x: number, y: number, time: number): void {
    const pulse = Math.floor(time / 140) % 2 === 0;
    graphics.fillStyle(GLIMMER_COLOR, pulse ? 0.9 : 0.45);
    graphics.fillRect(x, y, 1, 1);
    graphics.fillRect(x + 2, y - 1, 1, 1);
    graphics.fillRect(x - 2, y + 1, 1, 1);
    if (pulse) {
      graphics.fillRect(x + 1, y + 2, 1, 1);
    }
  }
}
