import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TILE_SIZE } from "@/src/world/constants";
import {
  BUILDINGS,
  BUILDING_NATIVE_TEXTURE_SIZE,
  BUILDING_TYPE_IDS,
  SMALL_BLUE_HOUSE_BLUEPRINT_FEET_Y,
  SMALL_BLUE_HOUSE_CANVAS,
  SMALL_BLUE_HOUSE_FEET_Y,
  BROWN_HOUSE_CANVAS,
  BROWN_HOUSE_FEET_Y,
  SMALL_HOUSE_VISUAL_CLASS,
  buildingById,
  buildingImageLoads,
  buildingTextureKey,
  entranceTile,
  footprintTiles,
  resolveBuildingAppearance,
} from "./buildings";

function pngSize(publicPath: string): { width: number; height: number } {
  const buf = readFileSync(resolve("public", publicPath.replace(/^\//, "")));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("building catalog", () => {
  it("registers both house definitions with unique IDs", () => {
    expect(BUILDING_TYPE_IDS).toEqual(["small_blue_house", "brown_house", "green_house"]);
    expect(BUILDINGS.small_blue_house).toBeDefined();
    expect(BUILDINGS.brown_house).toBeDefined();
    expect(BUILDINGS.green_house).toBeDefined();
    const ids = Object.values(BUILDINGS).map((def) => def.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves each type to its own texture and native PNG size does not define footprint", () => {
    const blue = buildingById("small_blue_house");
    const brown = buildingById("brown_house");
    expect(blue.assetKey).toBe("world-building-small-blue-house");
    expect(blue.assetPath).toBe("/assets/world/houses/Small_Blue_House.png");
    expect(blue.blueprintKey).toBe("world-building-small-blue-house-blueprint");
    expect(blue.blueprintPath).toBe("/assets/world/houses/Blue_House_BP.png");
    expect(brown.assetKey).toBe("world-building-brown-house");
    expect(brown.assetPath).toBe("/assets/world/houses/House_Brown.png");
    expect(brown.blueprintKey).toBe("world-building-brown-house-blueprint");
    expect(brown.blueprintPath).toBe("/assets/world/houses/Brown_House_BP.png");
    const green = buildingById("green_house");
    expect(green.assetKey).toBe("world-building-green-house");
    expect(green.assetPath).toBe("/assets/world/houses/Green_House.png");
    expect(green.blueprintKey).toBe("world-building-green-house-blueprint");
    expect(green.blueprintPath).toBe("/assets/world/houses/Green_House_BP.png");
    expect(blue.assetKey).not.toBe(brown.assetKey);
    expect(blue.blueprintKey).not.toBe(brown.blueprintKey);
    expect(green.assetKey).not.toBe(blue.assetKey);

    for (const id of BUILDING_TYPE_IDS) {
      const def = buildingById(id);
      const native = BUILDING_NATIVE_TEXTURE_SIZE[id];
      expect(native).toEqual(def.visual.completedCanvas);
      expect(native.width).not.toBe(def.footprint.width);
      expect(native.height).not.toBe(def.footprint.height);
      expect(native.width).not.toBe(def.footprint.width * TILE_SIZE);
      expect(native.height).not.toBe(def.footprint.height * TILE_SIZE);
      expect(def.visual.completedCanvas.width).not.toBe(def.footprint.width * TILE_SIZE);
      expect(def.visual.blueprintCanvas.width).not.toBe(def.footprint.width * TILE_SIZE);
    }

    const loads = buildingImageLoads();
    expect(loads).toEqual(
      expect.arrayContaining([
        { key: blue.assetKey, path: blue.assetPath },
        { key: blue.blueprintKey, path: blue.blueprintPath },
        { key: brown.assetKey, path: brown.assetPath },
        { key: brown.blueprintKey, path: brown.blueprintPath },
        { key: green.assetKey, path: green.assetPath },
        { key: green.blueprintKey, path: green.blueprintPath },
      ]),
    );
    expect(loads).toHaveLength(6);
  });

  it("keeps the 2×2 small_house footprint while Pingo and Tito use their authored frames", () => {
    expect(SMALL_HOUSE_VISUAL_CLASS.completedCanvas).toEqual({ width: 93, height: 84 });
    expect(SMALL_HOUSE_VISUAL_CLASS.blueprintCanvas).toEqual({ width: 93, height: 84 });
    expect(SMALL_HOUSE_VISUAL_CLASS.footprint).toEqual({ width: 2, height: 2 });
    expect(SMALL_HOUSE_VISUAL_CLASS.originX).toBe(0.5);
    expect(SMALL_HOUSE_VISUAL_CLASS.originY).toBe(1);

    const blue = buildingById("small_blue_house");
    expect(blue.visual.completedCanvas).toEqual(SMALL_BLUE_HOUSE_CANVAS);
    expect(blue.visual.blueprintCanvas).toEqual(SMALL_BLUE_HOUSE_CANVAS);
    expect(blue.visual.originY).toBe(SMALL_BLUE_HOUSE_FEET_Y / SMALL_BLUE_HOUSE_CANVAS.height);
    expect(blue.visual.blueprintOriginY).toBe(
      SMALL_BLUE_HOUSE_BLUEPRINT_FEET_Y / SMALL_BLUE_HOUSE_CANVAS.height,
    );
    expect(pngSize(blue.assetPath)).toEqual(blue.visual.completedCanvas);
    expect(pngSize(blue.blueprintPath)).toEqual(blue.visual.blueprintCanvas);

    const brown = buildingById("brown_house");
    expect(brown.visual.completedCanvas).toEqual(BROWN_HOUSE_CANVAS);
    expect(brown.visual.blueprintCanvas).toEqual(BROWN_HOUSE_CANVAS);
    expect(brown.visual.originY).toBe(BROWN_HOUSE_FEET_Y / BROWN_HOUSE_CANVAS.height);
    expect(brown.visual.blueprintOriginY).toBe(BROWN_HOUSE_FEET_Y / BROWN_HOUSE_CANVAS.height);
    expect(pngSize(brown.assetPath)).toEqual(brown.visual.completedCanvas);
    expect(pngSize(brown.blueprintPath)).toEqual(brown.visual.blueprintCanvas);

    const green = buildingById("green_house");
    expect(green.visual.visualClass).toBe("small_house");
    expect(green.visual.completedCanvas).toEqual(SMALL_HOUSE_VISUAL_CLASS.completedCanvas);
    expect(green.visual.blueprintCanvas).toEqual(SMALL_HOUSE_VISUAL_CLASS.blueprintCanvas);
    expect(green.footprint).toEqual({ ...SMALL_HOUSE_VISUAL_CLASS.footprint });
    expect(green.visual.originX).toBe(0.5);
    expect(green.visual.originY).toBe(1);
    expect(pngSize(green.assetPath)).toEqual(green.visual.completedCanvas);
    expect(pngSize(green.blueprintPath)).toEqual(green.visual.blueprintCanvas);

    for (const def of [blue, brown, green]) {
      expect(def.footprint).toEqual({ ...SMALL_HOUSE_VISUAL_CLASS.footprint });
      const completed = readFileSync(resolve("public", def.assetPath.replace(/^\//, "")));
      const blueprint = readFileSync(resolve("public", def.blueprintPath.replace(/^\//, "")));
      expect(completed[24]).toBe(8);
      expect(completed[25]).toBe(6);
      expect(blueprint[24]).toBe(8);
      expect(blueprint[25]).toBe(6);
    }
  });

  it("swaps only the phase texture from blueprint to completed", () => {
    expect(buildingTextureKey("small_blue_house", "construction")).toBe(
      BUILDINGS.small_blue_house.blueprintKey,
    );
    expect(buildingTextureKey("small_blue_house", "completed")).toBe(
      BUILDINGS.small_blue_house.assetKey,
    );
    expect(buildingTextureKey("small_blue_house", "preview")).toBe(
      BUILDINGS.small_blue_house.assetKey,
    );
    expect(buildingTextureKey("brown_house", "construction")).toBe(BUILDINGS.brown_house.blueprintKey);
    expect(buildingTextureKey("brown_house", "completed")).toBe(BUILDINGS.brown_house.assetKey);
    expect(buildingTextureKey("small_blue_house", "construction")).not.toBe(
      buildingTextureKey("small_blue_house", "completed"),
    );
  });

  it("resolves entrance tiles from local metadata", () => {
    const origin = { x: 5, y: 11 };
    for (const id of BUILDING_TYPE_IDS) {
      const def = buildingById(id);
      expect(footprintTiles(origin, def)).toEqual([
        { x: 5, y: 11 },
        { x: 6, y: 11 },
        { x: 5, y: 12 },
        { x: 6, y: 12 },
      ]);
      expect(entranceTile(origin, def)).toEqual({ x: 5, y: 13 });
      expect(def.entrance.facing).toBe("south");
    }
  });

  it("derives renderer appearance from typeId", () => {
    const blue = resolveBuildingAppearance("small_blue_house");
    const brown = resolveBuildingAppearance("brown_house");
    const green = resolveBuildingAppearance("green_house");
    expect(blue.textureKey).toBe(BUILDINGS.small_blue_house.assetKey);
    expect(brown.textureKey).toBe(BUILDINGS.brown_house.assetKey);
    expect(green.textureKey).toBe(BUILDINGS.green_house.assetKey);
    expect(blue.originX).toBe(0.5);
    expect(blue.originY).toBe(SMALL_BLUE_HOUSE_FEET_Y / SMALL_BLUE_HOUSE_CANVAS.height);
    expect(brown.originX).toBe(0.5);
    expect(brown.originY).toBe(BROWN_HOUSE_FEET_Y / BROWN_HOUSE_CANVAS.height);
    expect(green.originX).toBe(0.5);
    expect(green.originY).toBe(1);
    expect(blue).not.toEqual(expect.objectContaining({ textureKey: brown.textureKey }));
    expect(green).not.toEqual(expect.objectContaining({ textureKey: blue.textureKey }));
  });

  it("exposes prototype wood and stone costs on both houses", () => {
    const blue = buildingById("small_blue_house");
    const brown = buildingById("brown_house");
    const green = buildingById("green_house");
    expect(blue.cost).toEqual({ wood: 8, stone: 2 });
    expect(brown.cost).toEqual({ wood: 6, stone: 4 });
    expect(green.cost).toEqual({ wood: 7, stone: 3 });
    expect(Object.keys(blue.cost).sort()).toEqual(["stone", "wood"]);
    expect(Object.keys(brown.cost).sort()).toEqual(["stone", "wood"]);
  });
});
