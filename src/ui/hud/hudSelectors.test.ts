import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createBareGameState } from "@/src/simulation/GameState";
import { RESOURCE_IDS } from "@/src/simulation/resources";
import { TIME } from "@/src/simulation/timeConfig";
import { createDefaultWorldTime, readClock } from "@/src/simulation/worldTime";
import {
  STATIC_SEASON,
  selectInventoryStockModel,
  selectMaterialSummaryModel,
  selectResourceHudModel,
  selectWorldStatusHudModel,
} from "./hudSelectors";
import type { GameUiSnapshot } from "@/src/store/gameUiStore";

function snapshot(overrides: Partial<GameUiSnapshot> = {}): GameUiSnapshot {
  return { fps: 60, wood: 4, stone: 2, food: 8, ...overrides } as GameUiSnapshot;
}

describe("HUD selectors 05.5A", () => {
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
    expect(RESOURCE_IDS.VINE).toBe("vine");
    expect("harmony" in state.resources).toBe(false);
  });

  it("maps the inventory stock including vine and food without double-counting cargo", () => {
    const model = selectMaterialSummaryModel({
      wood: 4,
      stone: 2,
      vine: 7,
      foliage: 0,
      copperOre: 0,
      shell: 0,
      coral: 0,
    });
    expect(model).toEqual({
      wood: 4,
      stone: 2,
      vine: 7,
      foliage: 0,
      copperOre: 0,
      shell: 0,
      coral: 0,
    });
    expect(
      selectInventoryStockModel({
        wood: 4,
        stone: 2,
        vine: 7,
        food: 8,
        foliage: 1,
        copperOre: 2,
        shell: 0,
        coral: 0,
      }),
    ).toEqual({
      wood: 4,
      stone: 2,
      vine: 7,
      food: 8,
      foliage: 1,
      copperOre: 2,
      shell: 0,
      coral: 0,
    });
    const inventory = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
    expect(inventory).toMatch(/vine/);
    expect(inventory).toMatch(/foliage/);
    expect(inventory).toMatch(/copperOre/);
    expect(inventory).toMatch(/shell/);
    expect(inventory).toMatch(/coral/);
    expect(inventory).toMatch(/selectInventoryStockModel/);
    const hud = readFileSync("src/ui/GameHud.tsx", "utf8");
    expect(hud).toMatch(/InventoryHud/);
    expect(hud).not.toMatch(/MATERIALS/);
    expect(readFileSync("src/simulation/data/materials.ts", "utf8")).toMatch(
      /\/assets\/world\/materials\/Vine\.png/,
    );
    expect(hud).not.toMatch(/Copper_Ore|Copper_Ingot|Foliage\.png|Shell\.png/);
  });

  it("does not keep a second resource wallet", () => {
    const source = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
    expect(source).toMatch(/state\.wood/);
    expect(source).toMatch(/state\.stone/);
    expect(source).toMatch(/state\.food/);
    expect(source).toMatch(/state\.vine/);
    expect(source).not.toMatch(/resources\.harmony/);
  });

  it("maps day and time from the simulation clock fields only", () => {
    const model = selectWorldStatusHudModel(
      snapshot({ fps: 99, wood: 99, dayNumber: 2, clockHour: 0, clockMinute: 0 }),
    );
    expect(model.source).toBe("simulation");
    expect(model.dayLabel).toBe("Dia 2");
    expect(model.timeLabel).toBe("00:00");
    expect(model.season).toBe("Primavera");
    expect(model.seasonSource).toBe("static_placeholder");
    expect(model.period).toBe("night");
    expect(model).not.toHaveProperty("sunOpacity");
    expect(model).not.toHaveProperty("moonOpacity");
    const sameMinute = selectWorldStatusHudModel({
      dayNumber: 2,
      clockHour: 0,
      clockMinute: 0,
    });
    expect(sameMinute.timeLabel).toBe(model.timeLabel);
    expect(sameMinute.dayLabel).toBe(model.dayLabel);
    const newGame = selectWorldStatusHudModel({
      dayNumber: TIME.newGame.day,
      clockHour: TIME.newGame.hour,
      clockMinute: TIME.newGame.minute,
    });
    expect(newGame.dayLabel).toBe("Dia 1");
    expect(newGame.timeLabel).toBe("09:30");
    expect(newGame.period).toBe("day");
    expect(STATIC_SEASON.progression).toBe("inactive");
    const sim = createBareGameState();
    expect(readClock(sim.worldTime)).toMatchObject({
      dayNumber: 1,
      hour: 9,
      minute: 30,
    });
    expect(sim).not.toHaveProperty("season");
    expect(createDefaultWorldTime().totalGameMinutes).toBe(9 * 60 + 30);
  });

  it("does not advance world time from React and keeps the Top Left composition", () => {
    const source = readFileSync("src/ui/hud/TopLeftStatus.tsx", "utf8");
    expect(source).not.toMatch(/Date\.now|setInterval|setTimeout/);
    expect(source).toMatch(/HUD_ASSETS\.topLeft/);
    expect(source).toMatch(/CelestialClock/);
    expect(source).not.toMatch(/sunOpacity|moonOpacity/);
    expect(source).toMatch(/dayNumber/);
    expect(source).toMatch(/clockHour/);
    expect(source).toMatch(/clockMinute/);
    expect(source).toMatch(/selectWorldStatusHudModel/);
    expect(source).not.toMatch(/totalGameMinutes/);
    expect(source).not.toMatch(/PROTOTYPE_WORLD_STATUS/);
  });
});
