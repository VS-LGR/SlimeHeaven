import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createBareGameState } from "@/src/simulation/GameState";
import { RESOURCE_IDS } from "@/src/simulation/resources";
import {
  PROTOTYPE_WORLD_STATUS,
  selectResourceHudModel,
  selectWorldStatusHudModel,
} from "./hudSelectors";
import type { GameUiSnapshot } from "@/src/store/gameUiStore";

function snapshot(overrides: Partial<GameUiSnapshot> = {}): GameUiSnapshot {
  return { fps: 60, wood: 4, stone: 2, food: 8, ...overrides } as GameUiSnapshot;
}

describe("HUD selectors 05.4A.1", () => {
  it("maps wood, stone, and food from the HUD snapshot only", () => {
    const state = createBareGameState();
    state.resources.wood = 12;
    state.resources.stone = 6;
    state.resources.food = 8;
    const model = selectResourceHudModel({
      wood: state.resources.wood,
      stone: state.resources.stone,
      food: state.resources.food,
    });
    expect(model).toEqual({ wood: 12, stone: 6, food: 8 });
    expect(RESOURCE_IDS.WOOD).toBe("wood");
    expect(RESOURCE_IDS.STONE).toBe("stone");
    expect(RESOURCE_IDS.FOOD).toBe("food");
    expect("harmony" in state.resources).toBe(false);
  });

  it("does not keep a second resource wallet", () => {
    const source = readFileSync("src/ui/hud/TopRightResources.tsx", "utf8");
    expect(source).toMatch(/state\.wood/);
    expect(source).toMatch(/state\.stone/);
    expect(source).toMatch(/state\.food/);
    expect(source).not.toMatch(/useState\(/);
    expect(source).not.toMatch(/resources\.harmony/);
  });

  it("keeps simulation world-status empty and uses prototype placeholders in the HUD", () => {
    const model = selectWorldStatusHudModel(snapshot({ fps: 99, wood: 99 }));
    expect(model.day).toBeUndefined();
    expect(model.timeLabel).toBeUndefined();
    expect(model.season).toBeUndefined();
    expect(PROTOTYPE_WORLD_STATUS.source).toBe("prototype_placeholder");
    expect(PROTOTYPE_WORLD_STATUS.dayLabel).toBe("Dia 1");
    expect(PROTOTYPE_WORLD_STATUS.timeLabel).toBe("09:30");
    expect(PROTOTYPE_WORLD_STATUS.season).toBe("Primavera");
    const sim = createBareGameState();
    expect(sim as unknown as { day?: number }).not.toHaveProperty("day");
    expect(sim as unknown as { season?: string }).not.toHaveProperty("season");
  });

  it("does not advance world time from React", () => {
    const source = readFileSync("src/ui/hud/TopLeftStatus.tsx", "utf8");
    expect(source).not.toMatch(/Date\.now|setInterval|setTimeout/);
    expect(source).not.toMatch(/UI_Icon_Moon/);
    expect(source).toMatch(/HUD_ASSETS\.topLeft/);
    expect(source).toMatch(/HUD_ASSETS\.iconSun/);
    expect(source).toMatch(/Dia 1|dayLabel/);
    expect(source).toMatch(/PROTOTYPE_WORLD_STATUS/);
  });
});
