import { describe, expect, it } from "vitest";
import { createVillageMap } from "@/src/world/villageMap";
import { GameState } from "./GameState";
import { createRng } from "./rng";
import { SLIME_IDS } from "./entities/SlimeState";
import {
  ATTR_MAX,
  ATTR_MIN,
  JOB_ATTRIBUTE_WEIGHTS,
  clampAttribute,
  clampAttributes,
  getAttributeContribution,
  starString,
} from "./slimeAttributes";
import { taskSuitability } from "./systems/JobSystem";

describe("slime attributes", () => {
  it("clamps values to 1–5", () => {
    expect(clampAttribute(0)).toBe(ATTR_MIN);
    expect(clampAttribute(9)).toBe(ATTR_MAX);
    expect(clampAttributes({ technique: -2, strength: 3.4, instinct: 99, luck: 1 }).luck).toBe(1);
  });

  it("loads Pingo, Momo, and Tito spawn values", () => {
    const state = new GameState(createVillageMap(), createRng(1));
    expect(state.slimes[SLIME_IDS.PINGO].attributes).toEqual({
      technique: 4,
      strength: 2,
      instinct: 5,
      luck: 3,
    });
    expect(state.slimes[SLIME_IDS.MOMO].attributes).toEqual({
      technique: 4,
      strength: 2,
      instinct: 4,
      luck: 3,
    });
    expect(state.slimes[SLIME_IDS.TITO].attributes).toEqual({
      technique: 3,
      strength: 5,
      instinct: 2,
      luck: 2,
    });
  });

  it("scores fishing from the shared contribution helper", () => {
    const pingo = { technique: 4, strength: 2, instinct: 5, luck: 3 };
    const fishing = getAttributeContribution(pingo, JOB_ATTRIBUTE_WEIGHTS.fishing);
    expect(fishing).toBeCloseTo(4 * 0.4 + 2 * 0.2 + 5 * 0.35 + 3 * 0.05);
    expect(starString(4)).toBe("★★★★☆");
  });

  it("does not apply fishing weights to gather or farm tasks", () => {
    const state = new GameState(createVillageMap(), createRng(1));
    const pingo = state.slimes[SLIME_IDS.PINGO];
    const tito = state.slimes[SLIME_IDS.TITO];
    const gather = {
      id: "g",
      type: "gather_wood" as const,
      target: { x: 0, y: 0 },
      nodeId: "n",
      workTile: { x: 0, y: 0 },
      state: "available" as const,
    };
    const till = { ...gather, id: "t", type: "till_soil" as const };
    expect(taskSuitability(pingo, gather)).toBe(taskSuitability(tito, gather));
    expect(taskSuitability(pingo, till)).toBe(taskSuitability(tito, till));
    expect(taskSuitability(pingo, { ...gather, type: "fish_activity" })).toBeGreaterThan(
      taskSuitability(tito, { ...gather, type: "fish_activity" }),
    );
  });
});
