import { describe, expect, it } from "vitest";
import { TIME, minutesFromTimeOfDay } from "@/src/simulation/timeConfig";
import { BUILDINGS, SMALL_BLUE_HOUSE_CANVAS, BROWN_HOUSE_CANVAS, buildingVisualLayout } from "@/src/simulation/data/buildings";
import { STARTING_HOMES } from "@/src/simulation/data/startingHomes";
import type { PlacedBuilding } from "@/src/simulation/entities/PlacedBuilding";
import {
  BUILDING_NIGHT_LIGHTS,
  STANDALONE_NIGHT_LIGHTS,
  collectNightLightSources,
  nightLightIntensity,
  nightLightsForBuilding,
  spriteLocalToWorld,
} from "./nightLightsPresentation";

function intensityAt(hour: number, minute: number): number {
  return nightLightIntensity(minutesFromTimeOfDay(hour, minute));
}

function home(id: string, typeId: PlacedBuilding["typeId"], tileX: number, tileY: number): PlacedBuilding {
  return { id, typeId, tileX, tileY };
}

describe("night light intensity 05.5C", () => {
  it("is off during day and full at night", () => {
    expect(intensityAt(12, 0)).toBe(0);
    expect(intensityAt(7, 0)).toBe(0);
    expect(intensityAt(16, 59)).toBe(0);
    expect(intensityAt(19, 0)).toBe(1);
    expect(intensityAt(0, 0)).toBe(1);
    expect(intensityAt(4, 59)).toBe(1);
  });

  it("ramps through dusk and dawn using the shared clock periods", () => {
    const duskStart = nightLightIntensity(TIME.periods.dusk.startMinute);
    const duskMid = nightLightIntensity((TIME.periods.dusk.startMinute + TIME.periods.dusk.endMinute) / 2);
    const duskEnd = nightLightIntensity(TIME.periods.night.startMinute);
    expect(duskStart).toBe(0);
    expect(duskMid).toBeGreaterThan(0.3);
    expect(duskMid).toBeLessThan(0.7);
    expect(duskEnd).toBe(1);

    const dawnStart = nightLightIntensity(TIME.periods.dawn.startMinute);
    const dawnMid = nightLightIntensity((TIME.periods.dawn.startMinute + TIME.periods.dawn.endMinute) / 2);
    const dawnEnd = nightLightIntensity(TIME.periods.day.startMinute);
    expect(dawnStart).toBe(1);
    expect(dawnMid).toBeGreaterThan(0.3);
    expect(dawnMid).toBeLessThan(0.7);
    expect(dawnEnd).toBe(0);
  });

  it("stays continuous through midnight and 24:00 wrap", () => {
    const before = nightLightIntensity(TIME.minutesPerDay - 1);
    const atMidnight = nightLightIntensity(0);
    const wrapped = nightLightIntensity(TIME.minutesPerDay);
    expect(before).toBe(1);
    expect(atMidnight).toBe(1);
    expect(wrapped).toBe(atMidnight);
  });
});

describe("night light sources 05.5C", () => {
  it("places house lights from completed-canvas metadata, not a shared offset", () => {
    const pingo = STARTING_HOMES[0];
    const momo = STARTING_HOMES[1];
    const tito = STARTING_HOMES[2];
    expect(pingo?.buildingTypeId).toBe("small_blue_house");
    expect(momo?.buildingTypeId).toBe("green_house");
    expect(tito?.buildingTypeId).toBe("brown_house");

    expect(BUILDING_NIGHT_LIGHTS.small_blue_house.map((d) => d.id)).toEqual(["window"]);
    expect(BUILDING_NIGHT_LIGHTS.brown_house.map((d) => d.id)).toEqual(["lantern"]);
    expect(BUILDING_NIGHT_LIGHTS.green_house.map((d) => d.id)).toEqual(["window"]);

    const pingoWindow = BUILDING_NIGHT_LIGHTS.small_blue_house[0];
    expect(pingoWindow?.localX).toBe(56.5);
    expect(pingoWindow?.localY).toBe(42.5);
    expect(pingoWindow?.localX).toBeGreaterThan(SMALL_BLUE_HOUSE_CANVAS.width / 2 - 4);
    expect(pingoWindow?.localX).toBeLessThan(SMALL_BLUE_HOUSE_CANVAS.width / 2 + 4);

    const titoLantern = BUILDING_NIGHT_LIGHTS.brown_house[0];
    expect(titoLantern?.localX).toBe(33.5);
    expect(titoLantern?.localY).toBe(86.5);
    expect(titoLantern?.localX).toBeLessThan(BROWN_HOUSE_CANVAS.width / 2);

    const momoWindow = BUILDING_NIGHT_LIGHTS.green_house[0];
    expect(momoWindow?.localX).toBe(27.5);
    expect(momoWindow?.localY).toBe(61.5);
    expect(momoWindow?.localX).toBeLessThan(BUILDINGS.green_house.visual.completedCanvas.width / 2);
  });

  it("converts canvas pixels through the building sprite origin", () => {
    const origin = { x: 5, y: 4 };
    const layout = buildingVisualLayout(origin, "small_blue_house", "completed");
    const world = spriteLocalToWorld(layout, 56.5, 42.5);
    expect(world.x).toBe(layout.x + 56.5 - layout.originX * layout.displayWidth);
    expect(world.y).toBe(layout.y + 42.5 - layout.originY * layout.displayHeight);
    const building = home("home_pingo", "small_blue_house", origin.x, origin.y);
    const window = nightLightsForBuilding(building).find((source) => source.id.endsWith(":window"));
    expect(window?.worldX).toBe(world.x);
    expect(window?.worldY).toBe(world.y);
  });

  it("emits lights only for completed buildings and skips construction sites", () => {
    const buildings = {
      home_pingo: home("home_pingo", "small_blue_house", 5, 4),
      home_tito: home("home_tito", "brown_house", 11, 4),
    };
    const sources = collectNightLightSources(buildings);
    expect(sources.map((source) => source.id).sort()).toEqual(
      ["home_pingo:window", "home_tito:lantern"].sort(),
    );
    expect(sources.every((source) => !source.id.includes("site"))).toBe(true);
    expect(STANDALONE_NIGHT_LIGHTS).toEqual([]);
  });

  it("drops sources when a building is removed and never duplicates ids", () => {
    const withThree = {
      home_pingo: home("home_pingo", "small_blue_house", 5, 4),
      home_momo: home("home_momo", "green_house", 8, 4),
      home_tito: home("home_tito", "brown_house", 11, 4),
    };
    const all = collectNightLightSources(withThree);
    const ids = all.map((source) => source.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(all).toHaveLength(3);

    const afterRemoval = collectNightLightSources({
      home_pingo: withThree.home_pingo,
      home_tito: withThree.home_tito,
    });
    expect(afterRemoval.some((source) => source.id.startsWith("home_momo:"))).toBe(false);
    expect(afterRemoval).toHaveLength(2);
  });

  it("includes player-completed houses that are not starting homes", () => {
    const built = home("house_extra", "small_blue_house", 5, 11);
    const sources = collectNightLightSources({ house_extra: built });
    expect(sources).toHaveLength(1);
    expect(sources.every((source) => source.id.startsWith("house_extra:"))).toBe(true);
  });
});
