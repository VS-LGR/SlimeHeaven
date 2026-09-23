import { TILE_SIZE } from "@/src/world/constants";
import { CORAL_DISPLAY_SIZE, type DetailType, aquaticDetailDisplay } from "@/src/world/tileTypes";
import { WATER_VFX } from "./waterVisualConfig";

export interface AquaticSpriteLike {
  setDisplaySize(width: number, height: number): unknown;
  setDepth(value: number): unknown;
  setAlpha(value: number): unknown;
  setTint(color: number): unknown;
  setMask?(mask: unknown): unknown;
}

export function aquaticSitsUnderSurface(): boolean {
  return WATER_VFX.vegetationDepth < 0.22 && WATER_VFX.vegetationDepth > 0.15;
}

export function aquaticTileCenter(tileX: number, tileY: number): { x: number; y: number } {
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

export function coralDisplaySize(): { width: number; height: number } {
  return { width: CORAL_DISPLAY_SIZE, height: CORAL_DISPLAY_SIZE };
}

export function detailDisplaySize(type: DetailType): { width: number; height: number } | null {
  return aquaticDetailDisplay(type);
}

export function applyAquaticUnderwaterLook(
  sprite: AquaticSpriteLike,
  size: { width: number; height: number },
  mask?: unknown,
): void {
  sprite.setDisplaySize(size.width, size.height);
  sprite.setDepth(WATER_VFX.vegetationDepth);
  sprite.setAlpha(WATER_VFX.vegetationAlpha);
  sprite.setTint(WATER_VFX.vegetationTint);
  if (mask !== undefined) {
    sprite.setMask?.(mask);
  }
}
