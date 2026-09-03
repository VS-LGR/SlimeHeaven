import { afterEach, describe, expect, it, vi } from "vitest";
import { createSlimeState, SLIME_IDS, SLIME_SPAWNS } from "@/src/simulation/entities/SlimeState";
import { WORK_DURATION_MS } from "@/src/simulation/constants";
import { WORK_SPEED_HUNGRY } from "@/src/simulation/needsConfig";
import type { Task } from "@/src/simulation/entities/Task";
import { SLIME_ANIM } from "../slimeVisualConfig";
import { slimeView } from "../slimeView";
import { getFarmingAnimation } from "../farming/resolveFarmingAnim";
import { TITO_CHOP_BODY, TITO_GATHER_SWING_BODY_ANIM_REPEAT, TITO_PICKAXE } from "./titoChopVisualConfig";
import { isChopToolActive, isPickaxeToolActive } from "./chopPresentation";
import {
  getGatheringAnimation,
  setTitoChopAxeReady,
  setTitoChopBodyReady,
  setTitoPickaxeReady,
  usesTitoGatherSwingClip,
} from "./resolveGatheringAnim";

afterEach(() => {
  setTitoChopBodyReady(false);
  setTitoChopAxeReady(false);
  setTitoPickaxeReady(false);
  vi.restoreAllMocks();
});

function slimeOf(id: string) {
  const def = SLIME_SPAWNS.find((entry) => entry.id === id);
  if (!def) {
    throw new Error(`spawn missing for ${id}`);
  }
  return createSlimeState(def, 0);
}

function task(type: Task["type"]): Task {
  return {
    id: "task_test",
    type,
    target: { x: 4, y: 4 },
    nodeId: "node_test",
    workTile: { x: 4, y: 5 },
    state: "in_progress",
  };
}

describe("getGatheringAnimation", () => {
  it("plays tito_gather_swing only for Tito working gather_wood with body and axe ready", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    expect(getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true)).toEqual({
      kind: "final",
      key: TITO_CHOP_BODY.animKey,
      semantic: SLIME_ANIM.TITO_GATHER_SWING,
    });
    expect(usesTitoGatherSwingClip(SLIME_IDS.TITO, SLIME_ANIM.TITO_GATHER_SWING)).toBe(true);
    expect(usesTitoGatherSwingClip(SLIME_IDS.TITO, SLIME_ANIM.WORK)).toBe(false);
  });

  it("falls back to work for walk, carry, idle, and other slimes", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    setTitoPickaxeReady(true);
    expect(getGatheringAnimation(SLIME_IDS.TITO, "moving_to_task", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.TITO, "carrying_to_storage", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.TITO, "idle", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.MOMO, "working", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.PINGO, "working", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.MOMO, "working", "gather_stone", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
    expect(getGatheringAnimation(SLIME_IDS.PINGO, "working", "gather_stone", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
  });

  it("falls back and warns once when Tito chop body textures are missing", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const resolved = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => false);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.TITO_GATHER_SWING,
    });
    getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => false);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("Tito tito_gather_swing body art missing; using generic Work fallback.");
  });

  it("falls back and warns once when Tito axe textures are missing", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const hasTexture = (key: string) => TITO_CHOP_BODY.keys.includes(key);
    const resolved = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", hasTexture);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.TITO_GATHER_SWING,
    });
    getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", hasTexture);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("Tito tito_gather_swing axe art missing; using generic Work fallback.");
  });
});

describe("slimeView gathering wiring", () => {
  it("plays tito_gather_swing while working wood and generic clips otherwise", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    setTitoPickaxeReady(true);
    const tito = slimeOf(SLIME_IDS.TITO);
    tito.state = "working";
    expect(slimeView(tito, 0, 0, undefined, 0, task("gather_wood")).anim).toBe(SLIME_ANIM.TITO_GATHER_SWING);
    expect(isChopToolActive(tito, task("gather_wood"))).toBe(true);
    expect(isPickaxeToolActive(tito, task("gather_wood"))).toBe(false);
    expect(slimeView(tito, 0, 0, undefined, 0, task("gather_stone")).anim).toBe(SLIME_ANIM.TITO_GATHER_SWING);
    expect(isChopToolActive(tito, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive(tito, task("gather_stone"))).toBe(true);
    tito.state = "moving_to_task";
    expect(slimeView(tito, 0, 0, undefined, 0, task("gather_wood")).anim).toBe(SLIME_ANIM.HOP);
    tito.state = "carrying_to_storage";
    expect(slimeView(tito, 0, 0, undefined, 0, task("gather_wood")).anim).toBe(SLIME_ANIM.HOP);
    tito.state = "idle";
    expect(slimeView(tito, 0, 0, undefined, 0, undefined).anim).toBe(SLIME_ANIM.IDLE);

    const momo = slimeOf(SLIME_IDS.MOMO);
    momo.state = "working";
    expect(slimeView(momo, 0, 0, undefined, 0, task("gather_wood")).anim).toBe(SLIME_ANIM.WORK);
    expect(slimeView(momo, 0, 0, undefined, 0, task("gather_stone")).anim).toBe(SLIME_ANIM.WORK);
    const pingo = slimeOf(SLIME_IDS.PINGO);
    pingo.state = "working";
    expect(slimeView(pingo, 0, 0, undefined, 0, task("gather_wood")).anim).toBe(SLIME_ANIM.WORK);
    expect(slimeView(pingo, 0, 0, undefined, 0, task("gather_stone")).anim).toBe(SLIME_ANIM.WORK);
  });

  it("keeps the farming resolver on generic work for Tito gather_wood", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    expect(getFarmingAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true)).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.WORK,
    });
  });
});

describe("axe lifecycle helpers", () => {
  it("is active only while gather_wood working and inactive after complete, cancel, or stone", () => {
    const slime = { state: "working" as const };
    expect(isChopToolActive(slime, task("gather_wood"))).toBe(true);
    expect(isChopToolActive(slime, task("gather_stone"))).toBe(false);
    expect(isChopToolActive({ state: "idle" }, task("gather_wood"))).toBe(false);
    expect(isChopToolActive({ state: "carrying_to_storage" }, task("gather_wood"))).toBe(false);
    expect(isChopToolActive({ state: "moving_to_task" }, task("gather_wood"))).toBe(false);
    expect(isChopToolActive({ state: "working" }, undefined)).toBe(false);
  });

  it("loops presentation inside the 1250 ms window without owning finishWork", () => {
    expect(WORK_DURATION_MS).toBe(1250);
    expect(WORK_SPEED_HUNGRY).toBe(0.8);
    expect(TITO_GATHER_SWING_BODY_ANIM_REPEAT).toBe(-1);
    expect(TITO_CHOP_BODY.keys).toHaveLength(9);
    const slime = { state: "working" as const, workElapsedMs: 2000 };
    expect(isChopToolActive(slime, task("gather_wood"))).toBe(true);
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    expect(getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true).kind).toBe("final");
    setTitoChopBodyReady(false);
    setTitoChopAxeReady(false);
    expect(getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true).kind).toBe("fallback");
    expect(usesTitoGatherSwingClip(SLIME_IDS.TITO, SLIME_ANIM.TITO_GATHER_SWING)).toBe(false);
  });
});

describe("gather_stone resolver", () => {
  it("plays tito_gather_swing for Tito working gather_stone with body and pickaxe ready", () => {
    setTitoChopBodyReady(true);
    setTitoPickaxeReady(true);
    expect(getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_stone", () => true)).toEqual({
      kind: "final",
      key: TITO_CHOP_BODY.animKey,
      semantic: SLIME_ANIM.TITO_GATHER_SWING,
    });
  });

  it("uses the same body clip for wood and stone", () => {
    setTitoChopBodyReady(true);
    setTitoChopAxeReady(true);
    setTitoPickaxeReady(true);
    const wood = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_wood", () => true);
    const stone = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_stone", () => true);
    expect(wood.kind).toBe("final");
    expect(stone.kind).toBe("final");
    if (wood.kind === "final" && stone.kind === "final") {
      expect(wood.key).toBe(stone.key);
    }
  });

  it("axe and pickaxe are mutually exclusive via task type", () => {
    const slime = { state: "working" as const };
    expect(isChopToolActive(slime, task("gather_wood"))).toBe(true);
    expect(isPickaxeToolActive(slime, task("gather_wood"))).toBe(false);
    expect(isChopToolActive(slime, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive(slime, task("gather_stone"))).toBe(true);
  });

  it("falls back and warns once when pickaxe art is missing", () => {
    setTitoChopBodyReady(true);
    setTitoPickaxeReady(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const hasTexture = (key: string) => TITO_CHOP_BODY.keys.includes(key);
    const resolved = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_stone", hasTexture);
    expect(resolved).toEqual({
      kind: "fallback",
      anim: SLIME_ANIM.WORK,
      semantic: SLIME_ANIM.TITO_GATHER_SWING,
    });
    getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_stone", hasTexture);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("Tito tito_gather_swing pickaxe art missing; using generic Work fallback.");
  });

  it("missing pickaxe cannot delay finishWork", () => {
    setTitoChopBodyReady(true);
    setTitoPickaxeReady(false);
    const resolved = getGatheringAnimation(SLIME_IDS.TITO, "working", "gather_stone", () => true);
    expect(resolved.kind).toBe("fallback");
    expect(WORK_DURATION_MS).toBe(1250);
  });

  it("pickaxe has exactly nine 76×89 frames", () => {
    expect(TITO_PICKAXE.keys).toHaveLength(9);
    expect(TITO_PICKAXE.paths).toHaveLength(9);
    expect(TITO_PICKAXE.paths[0]).toBe("/assets/world/itens/Pickaxe/pickaxe1.png");
  });

  it("usesTitoGatherSwingClip passes with body + pickaxe even without axe", () => {
    setTitoChopBodyReady(true);
    setTitoPickaxeReady(true);
    setTitoChopAxeReady(false);
    expect(usesTitoGatherSwingClip(SLIME_IDS.TITO, SLIME_ANIM.TITO_GATHER_SWING)).toBe(true);
  });

  it("pickaxe hidden during moving, carrying, delivering, idle", () => {
    expect(isPickaxeToolActive({ state: "moving_to_task" }, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive({ state: "carrying_to_storage" }, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive({ state: "delivering" }, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive({ state: "idle" }, task("gather_stone"))).toBe(false);
    expect(isPickaxeToolActive({ state: "idle" }, undefined)).toBe(false);
  });
});
