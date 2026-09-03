import { describe, expect, it } from "vitest";
import { FARMING_VISUAL_FRAMES, FarmingVisualState, GRASS_VARIANT_FRAMES, GrassVariant } from "@/src/world/tileTypes";
import { WATER_FRAMES } from "@/src/world/autotile/shorelineDefinitions";
import { DEFAULT_FARM_SOIL_VISUAL } from "@/src/simulation/entities/FarmPlot";
import { FARM_SOIL_FRAMES, farmSoilFrameIndex } from "./farmSoilVisualConfig";

describe("farm soil frames", () => {
  it("maps dry, watered, and dead to sheet indices", () => {
    expect(FARM_SOIL_FRAMES.dry).toBe(0);
    expect(FARM_SOIL_FRAMES.watered).toBe(1);
    expect(FARM_SOIL_FRAMES.dead).toBe(2);
    expect(farmSoilFrameIndex("dry")).toBe(0);
    expect(farmSoilFrameIndex("watered")).toBe(1);
    expect(farmSoilFrameIndex("dead")).toBe(2);
  });

  it("defaults existing plots to dry", () => {
    expect(DEFAULT_FARM_SOIL_VISUAL).toBe("dry");
  });
});

describe("terrain semantic frames after 256×224 sheet", () => {
  it("keeps grass, shoreline, and coarse farm-cache indices", () => {
    expect(GRASS_VARIANT_FRAMES[GrassVariant.PLAIN]).toBe(1);
    expect(WATER_FRAMES.center).toBe(40);
    expect(WATER_FRAMES.innerCornerNW).toBe(52);
    expect(WATER_FRAMES.shoreNorth).toBe(46);
    expect(WATER_FRAMES.outerCornerNW).toBe(45);
    expect(FARMING_VISUAL_FRAMES[FarmingVisualState.TILLED]).toBe(0);
    expect(FARMING_VISUAL_FRAMES[FarmingVisualState.PLANTED]).toBe(8);
  });
});
