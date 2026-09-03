import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CROP_STAGE_COUNT, CROPS, DEFAULT_CROP_ID, cropById } from "@/src/simulation/data/crops";
import { farmKey } from "@/src/simulation/entities/FarmPlot";
import {
  cropGrowthFrameKey,
  cropGrowthProgress,
  cropStageIndex,
  cropStageNumber,
  plotCropStageNumber,
  plotCropTextureKey,
  plotShowsCrop,
} from "./cropPresentation";

describe("crop stage resolution", () => {
  it("maps progress 0 to stage 1 and ready/near-1 to stage 6", () => {
    expect(cropStageIndex(0)).toBe(0);
    expect(cropStageNumber(0)).toBe(1);
    expect(cropStageIndex(0.16)).toBe(0);
    expect(cropStageIndex(1 / CROP_STAGE_COUNT)).toBe(1);
    expect(cropStageNumber(0.5)).toBe(4);
    expect(cropStageIndex(0.99)).toBe(5);
    expect(cropStageNumber(1)).toBe(6);
  });

  it("clamps below 0 and above 1", () => {
    expect(cropStageNumber(-2)).toBe(1);
    expect(cropStageNumber(4)).toBe(6);
  });

  it("uses authoritative growthMs and ready = 1", () => {
    const crop = cropById(DEFAULT_CROP_ID);
    expect(cropGrowthProgress({ state: "growing", cropId: crop.id, growthMs: 0 })).toBe(0);
    expect(cropGrowthProgress({ state: "growing", cropId: crop.id, growthMs: crop.growthTimeMs / 2 })).toBe(0.5);
    expect(cropGrowthProgress({ state: "ready", cropId: crop.id, growthMs: 0 })).toBe(1);
    expect(cropStageNumber(cropGrowthProgress({ state: "ready", cropId: crop.id, growthMs: 0 }))).toBe(6);
    expect(cropGrowthProgress({ state: "tilled", growthMs: 999, cropId: crop.id })).toBe(0);
  });

  it("resolves frames from crop presentation data, not a renderer species branch", () => {
    const crop = cropById(DEFAULT_CROP_ID);
    expect(crop.visuals.growthFrames).toHaveLength(CROP_STAGE_COUNT);
    expect(cropGrowthFrameKey(crop.id, 0)).toBe(crop.visuals.growthFrames[0].key);
    expect(cropGrowthFrameKey(crop.id, 5)).toBe(crop.visuals.growthFrames[5].key);
    const renderer = readFileSync(resolve("src/game/render/farming/FarmPlotRenderer.ts"), "utf8");
    expect(renderer).not.toMatch(/forest_carrot/);
    expect(renderer).not.toMatch(/DEPTH\.OBJECTS \+ feet\.y/);
    expect(renderer).toMatch(/GROUND_DETAIL/);
  });

  it("keys the overlay to the plot tile, not a slime", () => {
    expect(farmKey(2, 12)).toBe("2,12");
    const planted = { state: "growing" as const, cropId: DEFAULT_CROP_ID, growthMs: 0 };
    expect(plotShowsCrop(planted)).toBe(true);
    expect(plotCropTextureKey(planted)).toBe(CROPS[DEFAULT_CROP_ID].visuals.growthFrames[0].key);
    expect(plotCropStageNumber({ state: "tilled", growthMs: 0 })).toBeNull();
    expect(plotCropTextureKey({ state: "tilled", growthMs: 0 })).toBeUndefined();
  });
});
