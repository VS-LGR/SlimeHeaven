import { describe, expect, it } from "vitest";
import {
  fishingGearObjectIds,
  nextFishingGearIds,
  quantizedArc,
  castArcProgress,
} from "./fishingVisualConfig";

describe("fishing gear lifecycle", () => {
  it("creates gear objects when a session begins", () => {
    const { created, destroyed } = nextFishingGearIds(null, "fish_1");
    expect(created).toEqual(fishingGearObjectIds("fish_1"));
    expect(destroyed).toEqual([]);
  });

  it("destroys gear on end or cancel and leaves no stale ids", () => {
    const ended = nextFishingGearIds("fish_1", null);
    expect(ended.created).toEqual([]);
    expect(ended.destroyed).toEqual(fishingGearObjectIds("fish_1"));
    const swapped = nextFishingGearIds("fish_1", "fish_2");
    expect(swapped.created).toEqual(fishingGearObjectIds("fish_2"));
    expect(swapped.destroyed).toEqual(fishingGearObjectIds("fish_1"));
    expect(nextFishingGearIds("fish_1", "fish_1")).toEqual({ created: [], destroyed: [] });
  });
});

describe("quantized bobber arc", () => {
  it("starts at the rod tip, ends on the water, and floors pixels", () => {
    expect(castArcProgress(2, 4, 1, 0)).toBe(0);
    expect(castArcProgress(2, 4, 4, 0)).toBe(1);
    const mid = quantizedArc(10, 20, 30, 40, 0.5, 10);
    expect(mid.x).toBe(20);
    expect(Number.isInteger(mid.x)).toBe(true);
    expect(Number.isInteger(mid.y)).toBe(true);
    expect(mid.y).toBeLessThan(30);
    const end = quantizedArc(10, 20, 30, 40, 1, 10);
    expect(end).toEqual({ x: 30, y: 40 });
  });
});
