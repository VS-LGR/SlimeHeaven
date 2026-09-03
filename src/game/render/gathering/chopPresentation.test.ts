import { describe, expect, it } from "vitest";
import {
  TITO_CHOP_AXE,
  TITO_CHOP_AXE_FRAME_MAP,
  TITO_CHOP_BODY,
  TITO_CHOP_FEET_Y,
  TITO_CHOP_FRAME,
  TITO_CHOP_FRAME_COUNT,
  TITO_CHOP_ORIGIN,
  TITO_CHOP_TOOL_OFFSETS,
  TITO_GATHER_SWING_BODY_ANIM_KEY,
  TITO_GATHER_SWING_BODY_ANIM_REPEAT,
  TITO_GATHER_SWING_CYCLE_MS,
  TITO_GATHER_SWING_FRAME_RATE,
  TITO_GATHER_SWING_HIT_COUNT,
  titoGatherSwingFrameRate,
} from "./titoChopVisualConfig";
import { WORK_DURATION_MS } from "@/src/simulation/constants";
import { WORK_SPEED_HUNGRY } from "@/src/simulation/needsConfig";
import {
  TITO_PICKAXE,
  TITO_PICKAXE_FRAME_MAP,
} from "./titoChopVisualConfig";
import {
  axeFrameForBodyFrame,
  axeWorldPosition,
  chopMirroredOffsetX,
  chopVisualSideFromFacing,
  gatherSwingPresentationCycle,
  isChopToolActive,
  isPickaxeToolActive,
  pickaxeFrameForBodyFrame,
  pickaxeWorldPosition,
} from "./chopPresentation";

describe("gather swing clip contract", () => {
  it("fits two 9-frame cycles in the 1250 ms work window at 14.4 fps", () => {
    expect(TITO_CHOP_AXE_FRAME_MAP).toHaveLength(TITO_CHOP_FRAME_COUNT);
    expect(TITO_CHOP_BODY.keys).toHaveLength(9);
    expect(TITO_CHOP_AXE.keys).toHaveLength(9);
    expect(TITO_CHOP_BODY.animKey).toBe(TITO_GATHER_SWING_BODY_ANIM_KEY);
    expect(TITO_GATHER_SWING_BODY_ANIM_KEY).toBe("tito_gather_swing");
    expect(TITO_GATHER_SWING_BODY_ANIM_REPEAT).toBe(-1);
    expect(TITO_GATHER_SWING_HIT_COUNT).toBe(2);
    expect(TITO_GATHER_SWING_CYCLE_MS).toBe(625);
    expect(TITO_GATHER_SWING_FRAME_RATE).toBeCloseTo(14.4, 10);
    expect(
      (TITO_CHOP_FRAME_COUNT / TITO_GATHER_SWING_FRAME_RATE) * TITO_GATHER_SWING_HIT_COUNT * 1000,
    ).toBeCloseTo(WORK_DURATION_MS, 10);
    expect(TITO_CHOP_FRAME).toEqual({ width: 76, height: 89 });
    expect(TITO_CHOP_ORIGIN).toEqual({
      x: 0.5,
      y: TITO_CHOP_FEET_Y / TITO_CHOP_FRAME.height,
    });
    expect(TITO_CHOP_FEET_Y).toBe(77);
    expect(TITO_CHOP_BODY.paths[0]).toBe("/assets/slimes/Tito/Chop/tito_chop1.png");
    for (let i = 0; i < TITO_CHOP_FRAME_COUNT; i += 1) {
      expect(TITO_CHOP_AXE_FRAME_MAP[i]).toBe(i);
      expect(axeFrameForBodyFrame(i)).toBe(i);
      expect(TITO_CHOP_TOOL_OFFSETS[i]).toEqual({ x: 0, y: 0 });
    }
  });

  it("slows the same two cycles with the existing hungry work multiplier", () => {
    expect(WORK_SPEED_HUNGRY).toBe(0.8);
    expect(titoGatherSwingFrameRate(WORK_SPEED_HUNGRY)).toBe(TITO_GATHER_SWING_FRAME_RATE * WORK_SPEED_HUNGRY);
    expect(
      (TITO_CHOP_FRAME_COUNT / titoGatherSwingFrameRate(WORK_SPEED_HUNGRY)) *
        TITO_GATHER_SWING_HIT_COUNT *
        1000,
    ).toBeCloseTo(WORK_DURATION_MS / WORK_SPEED_HUNGRY, 10);
  });
});

describe("chop flip offsets", () => {
  it("leaves west offsets unchanged and mirrors east x", () => {
    expect(chopVisualSideFromFacing(1)).toBe("west");
    expect(chopVisualSideFromFacing(-1)).toBe("east");
    expect(chopMirroredOffsetX(6, 1)).toBe(6);
    expect(chopMirroredOffsetX(6, -1)).toBe(-6);
    const west = axeWorldPosition(100, 200, 0, 1);
    const east = axeWorldPosition(100, 200, 0, -1);
    expect(west).toEqual({ x: 100, y: 200 });
    expect(east).toEqual({ x: 100, y: 200 });
  });
});

describe("chop tool activity", () => {
  it("hides the axe when gathering is not the live wood work clip", () => {
    const wood = {
      id: "t",
      type: "gather_wood" as const,
      target: { x: 1, y: 1 },
      nodeId: "n",
      workTile: { x: 1, y: 1 },
      state: "in_progress" as const,
    };
    const stone = { ...wood, type: "gather_stone" as const };
    expect(isChopToolActive({ state: "working" }, wood)).toBe(true);
    expect(isChopToolActive({ state: "working" }, stone)).toBe(false);
    expect(isChopToolActive({ state: "idle" }, wood)).toBe(false);
    expect(isChopToolActive({ state: "carrying_to_storage" }, wood)).toBe(false);
  });

  it("reports presentationCycle from the work timer without gating completion", () => {
    expect(gatherSwingPresentationCycle(0)).toBe(1);
    expect(gatherSwingPresentationCycle(624)).toBe(1);
    expect(gatherSwingPresentationCycle(625)).toBe(2);
    expect(gatherSwingPresentationCycle(1250)).toBe(2);
  });
});

describe("pickaxe tool activity", () => {
  it("is active only while gather_stone working", () => {
    const stone = {
      id: "t",
      type: "gather_stone" as const,
      target: { x: 1, y: 1 },
      nodeId: "n",
      workTile: { x: 1, y: 1 },
      state: "in_progress" as const,
    };
    const wood = { ...stone, type: "gather_wood" as const };
    expect(isPickaxeToolActive({ state: "working" }, stone)).toBe(true);
    expect(isPickaxeToolActive({ state: "working" }, wood)).toBe(false);
    expect(isPickaxeToolActive({ state: "idle" }, stone)).toBe(false);
    expect(isPickaxeToolActive({ state: "carrying_to_storage" }, stone)).toBe(false);
  });

  it("pickaxe frame follows body frame with identity mapping 0-8", () => {
    expect(TITO_PICKAXE_FRAME_MAP).toHaveLength(9);
    for (let i = 0; i < 9; i += 1) {
      expect(pickaxeFrameForBodyFrame(i)).toBe(i);
      expect(TITO_PICKAXE_FRAME_MAP[i]).toBe(i);
    }
  });

  it("pickaxe shares facing and flipX with body via the same offset logic", () => {
    const west = pickaxeWorldPosition(100, 200, 0, 1);
    const east = pickaxeWorldPosition(100, 200, 0, -1);
    expect(west).toEqual({ x: 100, y: 200 });
    expect(east).toEqual({ x: 100, y: 200 });
  });

  it("pickaxe has nine frames matching axe count", () => {
    expect(TITO_PICKAXE.keys).toHaveLength(9);
    expect(TITO_PICKAXE.paths[0]).toBe("/assets/world/itens/Pickaxe/pickaxe1.png");
    expect(TITO_PICKAXE.paths[8]).toBe("/assets/world/itens/Pickaxe/pickaxe9.png");
  });
});
