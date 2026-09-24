import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TILE_SIZE } from "@/src/world/constants";
import {
  CORAL_DISPLAY_SIZE,
  DETAIL_DEFS,
  DetailType,
  OBJECT_DEFS,
  ObjectType,
  aquaticDetailDisplay,
} from "@/src/world/tileTypes";
import { WATER_VFX } from "./waterVisualConfig";
import {
  applyAquaticUnderwaterLook,
  aquaticSitsUnderSurface,
  aquaticTileCenter,
  coralDisplaySize,
  detailDisplaySize,
} from "./aquaticPresentation";

describe("aquatic underwater presentation", () => {
  it("draws lake-bed sprites under the water surface and above the depth wash", () => {
    const config = readFileSync(resolve("src/game/config.ts"), "utf8");
    expect(config).toMatch(/WATER_VEGETATION:\s*0\.16/);
    expect(config).toMatch(/WATER_SURFACE:\s*0\.22/);
    expect(config).toMatch(/WATER_DEPTH:\s*0\.15/);
    expect(WATER_VFX.vegetationDepth).toBe(0.16);
    expect(aquaticSitsUnderSurface()).toBe(true);
  });

  it("renders authored large corals at one tile and keeps decorations smaller", () => {
    expect(CORAL_DISPLAY_SIZE).toBe(TILE_SIZE);
    expect(OBJECT_DEFS[ObjectType.CORAL].visualWidth).toBe(TILE_SIZE);
    expect(OBJECT_DEFS[ObjectType.CORAL].visualHeight).toBe(TILE_SIZE);
    expect(coralDisplaySize()).toEqual({ width: TILE_SIZE, height: TILE_SIZE });
    for (const type of [
      DetailType.ALGAE,
      DetailType.SEA_MUSHROOM,
      DetailType.SMALL_CORAL_BLUE,
      DetailType.SMALL_CORAL_YELLOW,
    ]) {
      const size = aquaticDetailDisplay(type);
      expect(size).not.toBeNull();
      expect(size!.width).toBeLessThanOrEqual(TILE_SIZE);
      expect(size!.height).toBeLessThanOrEqual(TILE_SIZE);
      expect(size!.width).toBe(DETAIL_DEFS[type].visualWidth);
      expect(size!.height).toBe(DETAIL_DEFS[type].visualHeight);
      expect(detailDisplaySize(type)).toEqual(size);
    }
    expect(aquaticDetailDisplay(DetailType.GRASS_FLOWER)).toBeNull();
  });

  it("centers sprites in the tile and applies the submerged wash", () => {
    expect(aquaticTileCenter(13, 9)).toEqual({
      x: 13 * TILE_SIZE + TILE_SIZE / 2,
      y: 9 * TILE_SIZE + TILE_SIZE / 2,
    });
    const calls: string[] = [];
    const sprite = {
      setDisplaySize(width: number, height: number) {
        calls.push(`size:${width}x${height}`);
      },
      setDepth(value: number) {
        calls.push(`depth:${value}`);
      },
      setAlpha(value: number) {
        calls.push(`alpha:${value}`);
      },
      setTint(color: number) {
        calls.push(`tint:${color}`);
      },
      setMask(mask: unknown) {
        calls.push(`mask:${String(mask)}`);
      },
    };
    applyAquaticUnderwaterLook(sprite, { width: 14, height: 18 }, "water-mask");
    expect(calls).toEqual([
      "size:14x18",
      `depth:${WATER_VFX.vegetationDepth}`,
      `alpha:${WATER_VFX.vegetationAlpha}`,
      `tint:${WATER_VFX.vegetationTint}`,
      "mask:water-mask",
    ]);
  });

  it("clips lake-bed sprites to the water mask in VillageScene", () => {
    const scene = readFileSync(resolve("src/game/scenes/VillageScene.ts"), "utf8");
    expect(scene).toMatch(/applyAquaticUnderwaterLook/);
    expect(scene).toMatch(/aquaticSprites/);
    expect(scene).toMatch(/setMask\(waterMask\)/);
    expect(scene).toMatch(/aquaticTileCenter/);
    expect(scene).not.toMatch(/DEPTH\.OBJECTS \+ object\.y.*CORAL/);
  });
});
