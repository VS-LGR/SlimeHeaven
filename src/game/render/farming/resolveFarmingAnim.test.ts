import { afterEach, describe, expect, it, vi } from "vitest";
import { createSlimeState, SLIME_IDS, SLIME_SPAWNS } from "@/src/simulation/entities/SlimeState";
import { WORK_DURATION_MS } from "@/src/simulation/constants";
import { WORK_SPEED_HUNGRY } from "@/src/simulation/needsConfig";
import type { Task } from "@/src/simulation/entities/Task";
import { SLIME_ANIM } from "../slimeVisualConfig";
import { slimeView } from "../slimeView";
import { MOMO_TILL_BODY, MOMO_TILL_BODY_ANIM_REPEAT } from "./momoTillVisualConfig";
import { MOMO_FARM_PLANT_OFFSET, MOMO_PLANT_BODY, MOMO_PLANT_BODY_ANIM_REPEAT, MOMO_PLANT_FRAME } from "./momoPlantVisualConfig";
import {
  MOMO_FARM_HARVEST_OFFSET,
  MOMO_HARVEST_BODY,
  MOMO_HARVEST_BODY_ANIM_REPEAT,
  MOMO_HARVEST_FRAME,
} from "./momoHarvestVisualConfig";
import { isTillToolActive } from "./tillPresentation";
import {
  getFarmingAnimation,
  setMomoHarvestReady,
  setMomoPlantReady,
  setMomoTillDirtReady,
  setMomoTillHoeReady,
  setMomoTillReady,
} from "./resolveFarmingAnim";

afterEach(() => {
  setMomoTillReady(false);
  setMomoTillHoeReady(false);
  setMomoTillDirtReady(false);
  setMomoPlantReady(false);
  setMomoHarvestReady(false);
  vi.restoreAllMocks();
});

function momoSlime() {
  const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
  if (!def) {
    throw new Error("Momo spawn missing");
  }
  return createSlimeState(def, 0);
}

function task(type: Task["type"]): Task {
  return {
    id: "task_test",
    type,
    target: { x: 2, y: 12 },
    nodeId: "farm_2_12",
    workTile: { x: 2, y: 12 },
    state: "in_progress",
    assignedSlimeId: SLIME_IDS.MOMO,
  };
}

describe("getFarmingAnimation", () => {
  it("resolves Momo till_soil working to farm_till when art is ready", () => {
    setMomoTillReady(true);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "till_soil", () => true)).toEqual({
      kind: "final",
      key: MOMO_TILL_BODY.animKey,
      semantic: SLIME_ANIM.FARM_TILL,
    });
  });

  it("resolves Momo plant_crop working to farm_plant when art is ready", () => {
    setMomoPlantReady(true);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "plant_crop", () => true)).toEqual({
      kind: "final",
      key: MOMO_PLANT_BODY.animKey,
      semantic: SLIME_ANIM.FARM_PLANT,
    });
  });

  it("resolves Momo harvest_crop working to farm_harvest without crop identity", () => {
    setMomoHarvestReady(true);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "harvest_crop", () => true)).toEqual({
      kind: "final",
      key: MOMO_HARVEST_BODY.animKey,
      semantic: SLIME_ANIM.FARM_HARVEST,
    });
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "harvest_crop", () => true).kind).toBe("final");
  });

  it("falls back to work for eating, Tito gather, and Pingo", () => {
    setMomoTillReady(true);
    setMomoPlantReady(true);
    setMomoHarvestReady(true);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "eating", "till_soil", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getFarmingAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getFarmingAnimation(SLIME_IDS.PINGO, "working", "till_soil", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
  });

  it("falls back and warns once when Momo till body textures are missing", () => {
    setMomoTillReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const resolved = getFarmingAnimation(SLIME_IDS.MOMO, "working", "till_soil", () => false);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.FARM_TILL,
    });
    getFarmingAnimation(SLIME_IDS.MOMO, "working", "till_soil", () => false);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("falls back and warns once when Momo plant body textures are missing", () => {
    setMomoPlantReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const resolved = getFarmingAnimation(SLIME_IDS.MOMO, "working", "plant_crop", () => false);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.FARM_PLANT,
    });
    getFarmingAnimation(SLIME_IDS.MOMO, "working", "plant_crop", () => false);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("falls back and warns once when Momo harvest body textures are missing", () => {
    setMomoHarvestReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const resolved = getFarmingAnimation(SLIME_IDS.MOMO, "working", "harvest_crop", () => false);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.FARM_HARVEST,
    });
    getFarmingAnimation(SLIME_IDS.MOMO, "working", "harvest_crop", () => false);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("slimeView farming wiring", () => {
  it("plays specialist clips by task semantic", () => {
    setMomoTillReady(true);
    setMomoPlantReady(true);
    setMomoHarvestReady(true);
    const momo = momoSlime();
    momo.state = "working";
    expect(slimeView(momo, 0, 0, undefined, 0, task("till_soil")).anim).toBe(SLIME_ANIM.FARM_TILL);
    expect(slimeView(momo, 0, 0, undefined, 0, task("plant_crop")).anim).toBe(SLIME_ANIM.FARM_PLANT);
    expect(slimeView(momo, 0, 0, undefined, 0, task("harvest_crop")).anim).toBe(SLIME_ANIM.FARM_HARVEST);
    momo.state = "eating";
    expect(slimeView(momo, 0, 0, undefined, 0, undefined).anim).toBe(SLIME_ANIM.WORK);
    momo.state = "idle";
    expect(slimeView(momo, 0, 0, undefined, 0, undefined).anim).toBe(SLIME_ANIM.IDLE);
    momo.state = "moving_to_task";
    expect(slimeView(momo, 0, 0, undefined, 0, task("plant_crop")).anim).toBe(SLIME_ANIM.HOP);
  });
});

describe("hoe lifecycle helpers", () => {
  it("is active only while till_soil working and inactive after complete or cancel", () => {
    setMomoTillReady(true);
    const slime = { state: "working" as const };
    expect(isTillToolActive(slime, task("till_soil"))).toBe(true);
    expect(isTillToolActive(slime, task("plant_crop"))).toBe(false);
    expect(isTillToolActive(slime, task("harvest_crop"))).toBe(false);
    expect(isTillToolActive({ state: "idle" }, task("till_soil"))).toBe(false);
    expect(isTillToolActive({ state: "eating" }, task("till_soil"))).toBe(false);
    expect(isTillToolActive({ state: "working" }, undefined)).toBe(false);
    expect(
      getFarmingAnimation(SLIME_IDS.MOMO, "idle", "till_soil", () => true).kind === "final" &&
        isTillToolActive({ state: "idle" }, task("till_soil")),
    ).toBe(false);
  });

  it("keeps the hoe while working even if the work window is longer (hungry)", () => {
    expect(WORK_DURATION_MS).toBe(1250);
    expect(WORK_SPEED_HUNGRY).toBe(0.8);
    const slime = { state: "working" as const, workElapsedMs: 2000 };
    expect(isTillToolActive(slime, task("till_soil"))).toBe(true);
    setMomoTillReady(true);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "till_soil", () => true).kind).toBe("final");
  });
});

describe("plant and harvest clip contract", () => {
  it("loops plant and harvest while till stays a single swing", () => {
    expect(MOMO_TILL_BODY_ANIM_REPEAT).toBe(0);
    expect(MOMO_PLANT_BODY_ANIM_REPEAT).toBe(-1);
    expect(MOMO_HARVEST_BODY_ANIM_REPEAT).toBe(-1);
    expect(MOMO_PLANT_BODY.keys).toHaveLength(5);
    expect(MOMO_HARVEST_BODY.keys).toHaveLength(12);
    expect(MOMO_PLANT_FRAME).toEqual({ width: 83, height: 75 });
    expect(MOMO_HARVEST_FRAME).toEqual({ width: 83, height: 75 });
    expect(MOMO_FARM_PLANT_OFFSET).toEqual({ x: 0, y: 0 });
    expect(MOMO_FARM_HARVEST_OFFSET).toEqual({ x: 0, y: 0 });
  });

  it("keeps plant and harvest looping through a hungry work window", () => {
    setMomoPlantReady(true);
    setMomoHarvestReady(true);
    const slime = { state: "working" as const, workElapsedMs: 2000 };
    expect(isTillToolActive(slime, task("plant_crop"))).toBe(false);
    expect(isTillToolActive(slime, task("harvest_crop"))).toBe(false);
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "plant_crop", () => true).kind).toBe("final");
    expect(getFarmingAnimation(SLIME_IDS.MOMO, "working", "harvest_crop", () => true).kind).toBe("final");
  });
});
