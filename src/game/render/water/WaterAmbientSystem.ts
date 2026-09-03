import Phaser from "phaser";
import { DEPTH } from "../../config";
import type { Grid } from "@/src/world/Grid";
import {
  type WaterCell,
  isWaterWorld,
  visibleWaterCells,
  waterEffectPoint,
} from "./waterCoverage";
import { WaterRippleSystem } from "./WaterRippleSystem";
import {
  quantizeAlpha,
  randomIntervalMs,
  WATER_TEXTURE,
  WATER_VFX,
} from "./waterVisualConfig";

const CARDINALS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

interface FishShadow {
  image: Phaser.GameObjects.Image;
  dirX: number;
  dirY: number;
  pixelAccum: number;
  bornAt: number;
  fading: boolean;
}

export class WaterAmbientSystem {
  private readonly fish: FishShadow[] = [];
  private nextRippleAt = 0;
  private nextFishAt = 0;
  private enabled = true;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly grid: Grid,
    private readonly cells: readonly WaterCell[],
    private readonly ripples: WaterRippleSystem,
    private readonly waterMask: Phaser.Display.Masks.GeometryMask,
  ) {
    const now = scene.time.now;
    this.nextRippleAt = now + randomIntervalMs(WATER_VFX.ambientRippleIntervalMs);
    this.nextFishAt = now + randomIntervalMs(WATER_VFX.fishShadowIntervalMs);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  fishCount(): number {
    return this.fish.length;
  }

  spawnFishShadow(worldX?: number, worldY?: number): void {
    if (this.fish.length >= WATER_VFX.maxFishShadows) {
      return;
    }
    let x: number;
    let y: number;
    if (worldX !== undefined && worldY !== undefined && isWaterWorld(this.grid, worldX, worldY)) {
      x = Math.floor(worldX);
      y = Math.floor(worldY);
    } else {
      const cell = this.pickCell(true);
      if (!cell) {
        return;
      }
      const point = waterEffectPoint(cell);
      x = point.x;
      y = point.y;
    }
    const dir = CARDINALS[Math.floor(Math.random() * CARDINALS.length)];
    const image = this.scene.add
      .image(x, y, WATER_TEXTURE.fish)
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH.WATER_FISH)
      .setAlpha(quantizeAlpha(WATER_VFX.fishShadowAlpha))
      .setMask(this.waterMask);
    image.setFlipX(dir.x < 0);
    this.fish.push({
      image,
      dirX: dir.x,
      dirY: dir.y,
      pixelAccum: 0,
      bornAt: this.scene.time.now,
      fading: false,
    });
  }

  update(time: number, delta: number): void {
    this.updateFish(time, delta);
    if (!this.enabled) {
      return;
    }
    if (time >= this.nextRippleAt) {
      this.nextRippleAt = time + randomIntervalMs(WATER_VFX.ambientRippleIntervalMs);
      if (this.ripples.ambientCount() < WATER_VFX.maxAmbientRipples) {
        const cell = this.pickCell(true);
        if (cell) {
          const { x, y } = waterEffectPoint(cell);
          this.ripples.spawnRipple(x, y, "ambient");
        }
      }
    }
    if (time >= this.nextFishAt) {
      this.nextFishAt = time + randomIntervalMs(WATER_VFX.fishShadowIntervalMs);
      this.spawnFishShadow();
    }
  }

  destroy(): void {
    for (const fish of this.fish) {
      fish.image.destroy();
    }
    this.fish.length = 0;
  }

  private updateFish(time: number, delta: number): void {
    const step = WATER_VFX.fishShadowSpeedPxPerSec * (delta / 1000);
    for (let i = this.fish.length - 1; i >= 0; i -= 1) {
      const fish = this.fish[i];
      const age = time - fish.bornAt;
      if (age >= WATER_VFX.fishShadowDurationMs - WATER_VFX.fishShadowFadeMs) {
        fish.fading = true;
      }
      if (age >= WATER_VFX.fishShadowDurationMs) {
        fish.image.destroy();
        this.fish.splice(i, 1);
        continue;
      }
      if (fish.fading) {
        const fadeLeft = WATER_VFX.fishShadowDurationMs - age;
        const fade = fadeLeft / WATER_VFX.fishShadowFadeMs;
        fish.image.setAlpha(quantizeAlpha(WATER_VFX.fishShadowAlpha * fade));
      }
      fish.pixelAccum += step;
      while (fish.pixelAccum >= 1) {
        fish.pixelAccum -= 1;
        const nextX = Math.floor(fish.image.x) + fish.dirX;
        const nextY = Math.floor(fish.image.y) + fish.dirY;
        if (!isWaterWorld(this.grid, nextX, nextY)) {
          fish.fading = true;
          break;
        }
        fish.image.setPosition(nextX, nextY);
      }
    }
  }

  private pickCell(visibleOnly: boolean): WaterCell | undefined {
    if (this.cells.length === 0) {
      return undefined;
    }
    const pool = visibleOnly
      ? visibleWaterCells(this.cells, this.scene.cameras.main.worldView)
      : [...this.cells];
    const source = pool.length > 0 ? pool : this.cells;
    return source[Math.floor(Math.random() * source.length)];
  }
}
