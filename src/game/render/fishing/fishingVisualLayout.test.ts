import { describe, expect, it } from "vitest";
import { TILE_SIZE } from "@/src/world/constants";
import { SLIME_ANIM } from "../slimeVisualConfig";
import { fishingGearObjectIds, quantizedArc } from "./fishingVisualConfig";
import { fishingRodPlacement, ROD_POSE, rodNudge, FISHING_FX_ORIGIN } from "./pingoFishingVisualConfig";
import {
  bodyFacingForPresentation,
  bubblesActive,
  castAirEndEqualsTarget,
  chooseFishingVisualLayout,
  chooseFishingVisualSide,
  fishingBobberVisual,
  fishingFlips,
  fishingVisualObjectIds,
  fishingVisualPhase,
  lineOriginFromRodTip,
  proposeNsWaterTarget,
  rodPhaserOrigin,
  rodTipWorld,
  surfaceBobberAllowed,
  surfaceBobberFromCastEnd,
  type FishingVisualContext,
  type FishingVisualPhase,
} from "./fishingVisualLayout";

function ctx(partial: Partial<FishingVisualContext> = {}): FishingVisualContext {
  return {
    landTile: { x: 5, y: 5 },
    waterTile: { x: 6, y: 5 },
    castDirection: "east",
    slimeGround: { x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE },
    activityWorld: { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
    sessionWorld: { x: 6 * TILE_SIZE + 10, y: 5 * TILE_SIZE + TILE_SIZE / 2 },
    isWaterWorld: () => true,
    hasBlockerTile: () => false,
    ...partial,
  };
}

describe("cast bobber endpoint", () => {
  it("reuses the airborne endpoint as the surface bobber origin", () => {
    expect(castAirEndEqualsTarget(12, 40, 80, 48, 10)).toBe(true);
    const end = quantizedArc(12, 40, 80, 48, 1, 10);
    expect(surfaceBobberFromCastEnd(end)).toEqual(end);
    expect(end).toEqual({ x: 80, y: 48 });
  });
});

describe("bobber lifecycle presentation", () => {
  it("does not put the surface bobber out before the cast leaves the rod", () => {
    expect(fishingVisualPhase("arrive")).toBe("cast_air");
    expect(fishingBobberVisual("cast_air").bobber).toBe("cast_air");
    expect(fishingBobberVisual("wait_surface").bobber).toBe("surface");
  });

  it("keeps idle on the surface, submerges once, then hides during the fight", () => {
    expect(fishingBobberVisual("wait_surface")).toMatchObject({
      bobber: "surface",
      bubbles: "off",
      rodPose: "wait",
    });
    expect(fishingBobberVisual("bite_submerge")).toMatchObject({
      bobber: "submerge",
      bubbles: "off",
      rodPose: "bite",
    });
    expect(fishingBobberVisual("fight_underwater")).toMatchObject({
      bobber: "hidden",
      bubbles: "loop",
      rodPose: "pull",
    });
    expect(surfaceBobberAllowed("fight_underwater")).toBe(false);
    expect(fishingBobberVisual("fight_underwater").bobber).not.toBe("surface");
  });

  it("anchors bite bubbles on the same origin as the surface floater", () => {
    expect(FISHING_FX_ORIGIN).toEqual({ x: 0.5, y: 0.5 });
  });

  it("loops bubbles for the whole fight and stops on success, escape, or cleanup", () => {
    expect(bubblesActive("fight_underwater")).toBe(true);
    expect(bubblesActive("wait_surface")).toBe(false);
    expect(bubblesActive("success")).toBe(false);
    expect(bubblesActive("escape")).toBe(false);
    expect(bubblesActive("cleanup")).toBe(false);
    expect(fishingBobberVisual("success").bobber).toBe("hidden");
    expect(fishingBobberVisual("escape").bobber).toBe("hidden");
  });

  it("maps gameplay presentation without driving the FSM", () => {
    expect(fishingVisualPhase("arrive")).toBe("cast_air");
    expect(fishingVisualPhase("cast")).toBe("cast_air");
    expect(fishingVisualPhase("wait")).toBe("wait_surface");
    expect(fishingVisualPhase("bite")).toBe("bite_submerge");
    expect(fishingVisualPhase("pull")).toBe("fight_underwater");
    expect(fishingVisualPhase("hook")).toBe("fight_underwater");
    expect(fishingVisualPhase("success")).toBe("success");
    expect(fishingVisualPhase("escape")).toBe("escape");
  });
});

describe("rod tip and line origin", () => {
  it("keeps the line origin identical to the pose tip", () => {
    const tip = rodTipWorld(100, 200, ROD_POSE.pull.tipX, ROD_POSE.pull.tipY, false);
    expect(lineOriginFromRodTip(tip)).toEqual(tip);
  });

  it("mirrors local X when the rod is flipped", () => {
    const handleX = 100;
    const handleY = 200;
    const unflipped = rodTipWorld(handleX, handleY, ROD_POSE.cast.tipX, ROD_POSE.cast.tipY, false);
    const flipped = rodTipWorld(handleX, handleY, ROD_POSE.cast.tipX, ROD_POSE.cast.tipY, true);
    expect(unflipped.x).toBe(handleX + ROD_POSE.cast.tipX);
    expect(flipped.x).toBe(handleX - ROD_POSE.cast.tipX);
    expect(flipped.y).toBe(unflipped.y);
    expect(rodPhaserOrigin(false)).toEqual({ x: 0, y: 1 });
    expect(rodPhaserOrigin(true)).toEqual({ x: 1, y: 1 });
  });

  it("orients right-side presentation unflipped and left-side mirrored", () => {
    rodNudge.x = 0;
    rodNudge.y = 0;
    const right = fishingRodPlacement(176, 192, "wait", "right", SLIME_ANIM.FISH_WAIT, 0);
    const left = fishingRodPlacement(176, 192, "wait", "left", SLIME_ANIM.FISH_WAIT, 0);
    expect(right.flipX).toBe(false);
    expect(right.originX).toBe(0);
    expect(right.tipX).toBeGreaterThan(right.handleX);
    expect(left.flipX).toBe(true);
    expect(left.originX).toBe(1);
    expect(left.tipX).toBeLessThan(left.handleX);
    expect(fishingFlips("right").bodyFacing).toBe(1);
    expect(fishingFlips("left").bodyFacing).toBe(-1);
  });

  it("keeps the catch clip in authored orientation on both shores", () => {
    expect(bodyFacingForPresentation("success", -1)).toBe(1);
    expect(bodyFacingForPresentation("success", 1)).toBe(1);
    expect(bodyFacingForPresentation("wait", -1)).toBe(-1);
    expect(bodyFacingForPresentation("cast", 1)).toBe(1);
  });
});

describe("visual side selection", () => {
  it("uses right for east water and left for west water", () => {
    expect(chooseFishingVisualSide(ctx({ castDirection: "east" }))).toBe("right");
    expect(chooseFishingVisualSide(ctx({
      castDirection: "west",
      waterTile: { x: 4, y: 5 },
      activityWorld: { x: 4 * TILE_SIZE, y: 5 * TILE_SIZE + 16 },
    }))).toBe("left");
  });

  it("picks the north side that faces the activity without rotating art", () => {
    const northRight = ctx({
      castDirection: "north",
      waterTile: { x: 5, y: 4 },
      activityWorld: { x: 6 * TILE_SIZE + 16, y: 4 * TILE_SIZE + 8 },
    });
    const northLeft = ctx({
      castDirection: "north",
      waterTile: { x: 5, y: 4 },
      activityWorld: { x: 4 * TILE_SIZE, y: 4 * TILE_SIZE + 8 },
    });
    expect(chooseFishingVisualSide(northRight)).toBe("right");
    expect(chooseFishingVisualSide(northLeft)).toBe("left");
    const layout = chooseFishingVisualLayout(northRight);
    const proposed = proposeNsWaterTarget({ x: 5, y: 4 }, "north", "right");
    expect(layout.waterTarget.y).toBeLessThan(5 * TILE_SIZE + TILE_SIZE / 2);
    expect(proposed.x).toBeGreaterThan(5 * TILE_SIZE + TILE_SIZE / 2);
  });

  it("picks the south side that faces the activity and keeps the target on water", () => {
    const southLeft = ctx({
      castDirection: "south",
      waterTile: { x: 5, y: 6 },
      activityWorld: { x: 4 * TILE_SIZE, y: 6 * TILE_SIZE + 20 },
      isWaterWorld: (x, y) => y >= 6 * TILE_SIZE,
    });
    expect(chooseFishingVisualSide(southLeft)).toBe("left");
    const layout = chooseFishingVisualLayout(southLeft);
    expect(layout.waterTarget.y).toBeGreaterThanOrEqual(6 * TILE_SIZE);
    expect(southLeft.isWaterWorld(layout.waterTarget.x, layout.waterTarget.y)).toBe(true);
  });
});

describe("fishing visual cleanup ids", () => {
  it("tracks every fishing visual including the cast bobber", () => {
    expect(fishingVisualObjectIds("s1")).toEqual(fishingGearObjectIds("s1"));
    expect(fishingVisualObjectIds("s1")).toEqual([
      "rod:s1",
      "castBobber:s1",
      "bobber:s1",
      "splash:s1",
      "bubbles:s1",
      "line:s1",
    ]);
  });
});

describe("presentation phase coverage", () => {
  const phases: FishingVisualPhase[] = [
    "approach",
    "cast_air",
    "bobber_land",
    "wait_surface",
    "bite_submerge",
    "fight_underwater",
    "success",
    "escape",
    "cleanup",
  ];

  it("defines bobber/bubble state for every visual phase", () => {
    for (const phase of phases) {
      const visual = fishingBobberVisual(phase);
      expect(visual.bobber === "cast_air" || visual.bobber === "surface" || visual.bobber === "submerge" || visual.bobber === "hidden").toBe(true);
    }
  });
});
