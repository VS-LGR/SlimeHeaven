import Phaser from "phaser";
import { DEPTH } from "../../config";
import type { Grid } from "@/src/world/Grid";
import { isWaterWorld } from "./waterCoverage";
import {
  quantizeAlpha,
  RIPPLE_PRESETS,
  WATER_VFX,
  type RippleType,
} from "./waterVisualConfig";

interface ActiveRipple {
  graphics: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  type: RippleType;
  bornAt: number;
  lastRadius: number;
  lastAlpha: number;
}

export class WaterRippleSystem {
  private readonly ripples: ActiveRipple[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly grid: Grid,
    private readonly waterMask: Phaser.Display.Masks.GeometryMask,
  ) {}

  spawnRipple(worldX: number, worldY: number, type: RippleType): void {
    const x = Math.floor(worldX);
    const y = Math.floor(worldY);
    if (!isWaterWorld(this.grid, x, y)) {
      return;
    }
    if (this.ripples.length >= WATER_VFX.maxRipples) {
      const oldest = this.ripples.shift();
      oldest?.graphics.destroy();
    }
    const graphics = this.scene.add
      .graphics()
      .setDepth(DEPTH.WATER_RIPPLE)
      .setMask(this.waterMask);
    this.ripples.push({
      graphics,
      x,
      y,
      type,
      bornAt: this.scene.time.now,
      lastRadius: -1,
      lastAlpha: -1,
    });
    this.drawRipple(this.ripples[this.ripples.length - 1], 0, RIPPLE_PRESETS[type].startAlpha);
  }

  count(): number {
    return this.ripples.length;
  }

  ambientCount(): number {
    return this.ripples.filter((ripple) => ripple.type === "ambient").length;
  }

  update(time: number): void {
    for (let i = this.ripples.length - 1; i >= 0; i -= 1) {
      const ripple = this.ripples[i];
      const preset = RIPPLE_PRESETS[ripple.type];
      const elapsed = time - ripple.bornAt;
      if (elapsed >= preset.durationMs) {
        ripple.graphics.destroy();
        this.ripples.splice(i, 1);
        continue;
      }
      const radius = Math.min(preset.maxRadius, Math.floor(elapsed / preset.stepMs));
      const life = 1 - elapsed / preset.durationMs;
      const alpha = quantizeAlpha(preset.startAlpha * life);
      if (radius === ripple.lastRadius && alpha === ripple.lastAlpha) {
        continue;
      }
      ripple.lastRadius = radius;
      ripple.lastAlpha = alpha;
      this.drawRipple(ripple, radius, alpha);
    }
  }

  destroy(): void {
    for (const ripple of this.ripples) {
      ripple.graphics.destroy();
    }
    this.ripples.length = 0;
  }

  private drawRipple(ripple: ActiveRipple, radius: number, alpha: number): void {
    const { graphics, x, y, type } = ripple;
    graphics.clear();
    if (alpha <= 0) {
      return;
    }
    graphics.fillStyle(RIPPLE_PRESETS[type].color, alpha);
    if (radius <= 0) {
      graphics.fillRect(x, y, 1, 1);
      graphics.fillRect(x - 1, y, 1, 1);
      graphics.fillRect(x + 1, y, 1, 1);
      return;
    }
    for (let dx = -radius; dx <= radius; dx += 1) {
      const dy = radius - Math.abs(dx);
      graphics.fillRect(x + dx, y + dy, 1, 1);
      if (dy !== 0) {
        graphics.fillRect(x + dx, y - dy, 1, 1);
      }
    }
  }
}
