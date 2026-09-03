import { describe, expect, it } from "vitest";
import { Grid } from "../Grid";
import { TileType } from "../tileTypes";
import { createVillageMap } from "../villageMap";
import { resolveShoreline } from "./resolveShoreline";
import { WATER_FRAMES, type ShoreVisualId } from "./shorelineDefinitions";

const KNOWN_IDS: ReadonlySet<ShoreVisualId> = new Set([
  "water_center",
  "shore_north",
  "shore_south",
  "shore_east",
  "shore_west",
  "shore_outer_corner_nw",
  "shore_outer_corner_ne",
  "shore_outer_corner_sw",
  "shore_outer_corner_se",
  "shore_inner_corner_nw",
  "shore_inner_corner_ne",
  "shore_inner_corner_sw",
  "shore_inner_corner_se",
]);

function resolveAt(map: string[], x: number, y: number) {
  const height = map.length;
  const width = map[0].length;
  return resolveShoreline((dx, dy) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
      return false;
    }
    return map[ny][nx] === "W";
  }, x, y);
}

function waterCoords(map: string[]): Array<[number, number]> {
  const coords: Array<[number, number]> = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === "W") {
        coords.push([x, y]);
      }
    }
  }
  return coords;
}

function gridFromMap(map: string[]): Grid {
  const height = map.length;
  const width = map[0].length;
  const terrain = map.map((row) =>
    [...row].map((cell) => (cell === "W" ? TileType.WATER : TileType.GRASS)),
  );
  const details = terrain.map((row) => row.map(() => null));
  return new Grid(width, height, terrain, details, []);
}

describe("resolveShoreline", () => {
  it("falls back to center for a single isolated water tile", () => {
    const visual = resolveAt(["W"], 0, 0);
    expect(visual.id).toBe("water_center");
    expect(visual.rotationDeg).toBe(0);
    expect(WATER_FRAMES.centerAlt).toContain(visual.frame);
  });

  it("uses east/west caps for a horizontal water pair", () => {
    const map = ["WW"];
    expect(resolveAt(map, 0, 0)).toMatchObject({
      id: "shore_west",
      frame: WATER_FRAMES.shoreSouth,
      rotationDeg: 90,
    });
    expect(resolveAt(map, 1, 0)).toMatchObject({
      id: "shore_east",
      frame: WATER_FRAMES.shoreNorth,
      rotationDeg: 90,
    });
  });

  it("uses north/south caps for a vertical water pair", () => {
    const map = ["W", "W"];
    expect(resolveAt(map, 0, 0)).toMatchObject({
      id: "shore_north",
      frame: WATER_FRAMES.shoreNorth,
      rotationDeg: 0,
    });
    expect(resolveAt(map, 0, 1)).toMatchObject({
      id: "shore_south",
      frame: WATER_FRAMES.shoreSouth,
      rotationDeg: 0,
    });
  });

  it("uses outer corners for a 2×2 pond", () => {
    const map = ["WW", "WW"];
    expect(resolveAt(map, 0, 0).id).toBe("shore_outer_corner_nw");
    expect(resolveAt(map, 1, 0).id).toBe("shore_outer_corner_ne");
    expect(resolveAt(map, 0, 1).id).toBe("shore_outer_corner_sw");
    expect(resolveAt(map, 1, 1).id).toBe("shore_outer_corner_se");
    expect(resolveAt(map, 0, 0).frame).toBe(WATER_FRAMES.outerCornerNW);
    expect(resolveAt(map, 1, 1).frame).toBe(WATER_FRAMES.outerCornerSE);
  });

  it("uses edges, corners, and a clean center for a 3×3 pond", () => {
    const map = ["WWW", "WWW", "WWW"];
    expect(resolveAt(map, 0, 0).id).toBe("shore_outer_corner_nw");
    expect(resolveAt(map, 1, 0).id).toBe("shore_north");
    expect(resolveAt(map, 2, 0).id).toBe("shore_outer_corner_ne");
    expect(resolveAt(map, 0, 1).id).toBe("shore_west");
    expect(resolveAt(map, 1, 1).id).toBe("water_center");
    expect(resolveAt(map, 2, 1).id).toBe("shore_east");
    expect(resolveAt(map, 0, 2).id).toBe("shore_outer_corner_sw");
    expect(resolveAt(map, 1, 2).id).toBe("shore_south");
    expect(resolveAt(map, 2, 2).id).toBe("shore_outer_corner_se");
    expect(resolveAt(map, 2, 1).rotationDeg).toBe(90);
    expect(resolveAt(map, 0, 1).rotationDeg).toBe(90);
  });

  it("keeps interior cells as clean water in a large rectangle", () => {
    const map = ["WWWWW", "WWWWW", "WWWWW", "WWWWW"];
    expect(resolveAt(map, 2, 1).id).toBe("water_center");
    expect(resolveAt(map, 2, 2).id).toBe("water_center");
    expect(resolveAt(map, 1, 0).id).toBe("shore_north");
    expect(resolveAt(map, 4, 2).id).toBe("shore_east");
    expect(resolveAt(map, 0, 0).id).toBe("shore_outer_corner_nw");
    expect(resolveAt(map, 4, 3).id).toBe("shore_outer_corner_se");
  });

  it("follows an L-shaped lake silhouette", () => {
    const map = ["WWW", "W..", "W.."];
    expect(resolveAt(map, 0, 0).id).toBe("shore_outer_corner_nw");
    expect(resolveAt(map, 2, 0).id).toBe("shore_east");
    expect(resolveAt(map, 0, 2).id).toBe("shore_south");
    expect(KNOWN_IDS.has(resolveAt(map, 1, 0).id)).toBe(true);
    expect(KNOWN_IDS.has(resolveAt(map, 0, 1).id)).toBe(true);
  });

  it("uses inner corners for a concave land indentation", () => {
    const map = ["WWWWW", "WWWWW", "WWLWW", "WWWWW", "WWWWW"];
    expect(resolveAt(map, 1, 1)).toMatchObject({
      id: "shore_inner_corner_se",
      frame: WATER_FRAMES.innerCornerSE,
      rotationDeg: 0,
    });
    expect(resolveAt(map, 1, 3)).toMatchObject({
      id: "shore_inner_corner_ne",
      frame: WATER_FRAMES.innerCornerNE,
    });
    expect(resolveAt(map, 3, 1)).toMatchObject({
      id: "shore_inner_corner_sw",
      frame: WATER_FRAMES.innerCornerSW,
    });
    expect(resolveAt(map, 3, 3)).toMatchObject({
      id: "shore_inner_corner_nw",
      frame: WATER_FRAMES.innerCornerNW,
    });
    expect(map[2][2]).toBe("L");
  });

  it("uses inner corners around the village lake grass indentation", () => {
    const grid = createVillageMap();
    expect(grid.getTile(15, 12)?.terrain).toBe(TileType.GRASS);
    expect(grid.shoreVisualAt(14, 11)?.id).toBe("shore_inner_corner_se");
    expect(grid.shoreVisualAt(16, 11)?.id).toBe("shore_inner_corner_sw");
    expect(grid.shoreVisualAt(14, 13)?.id).toBe("shore_inner_corner_ne");
    expect(grid.shoreVisualAt(16, 13)?.id).toBe("shore_inner_corner_nw");
    expect(grid.shoreVisualAt(15, 13)?.id).toBe("shore_north");
    expect(grid.shoreVisualAt(15, 14)?.id).toBe("shore_south");
  });

  it("keeps a full interior tile as water_center", () => {
    const map = [".....", ".WWW.", ".WWW.", ".WWW.", "....."];
    expect(resolveAt(map, 2, 2).id).toBe("water_center");
    expect(resolveAt(map, 2, 2).rotationDeg).toBe(0);
  });

  it("resolves an irregular organic silhouette to known frames", () => {
    const map = ["..WW.", ".WWWW", "WWWWW", ".WWW.", "..W.."];
    for (const [x, y] of waterCoords(map)) {
      const visual = resolveAt(map, x, y);
      expect(KNOWN_IDS.has(visual.id)).toBe(true);
      expect(visual.rotationDeg === 0 || visual.rotationDeg === 90).toBe(true);
    }
    expect(resolveAt(map, 2, 2).id).toBe("water_center");
    expect(resolveAt(map, 2, 0).id).toBe("shore_outer_corner_nw");
  });

  it("falls back deterministically for opposite land edges", () => {
    const map = ["WWW"];
    const first = resolveAt(map, 1, 0);
    const second = resolveAt(map, 1, 0);
    expect(first).toEqual(second);
    expect(first.id).toBe("water_center");
  });

  it("writes shoreline frames onto the terrain grid without gameplay IDs", () => {
    const grid = gridFromMap(["WW", "WW"]);
    expect(grid.terrainFrameGrid()).toEqual([
      [WATER_FRAMES.outerCornerNW, WATER_FRAMES.outerCornerNE],
      [WATER_FRAMES.outerCornerSW, WATER_FRAMES.outerCornerSE],
    ]);
    expect(grid.getTile(0, 0)?.terrain).toBe(TileType.WATER);
    expect(grid.terrainRotationAt(1, 0)).toBe(0);
    expect(grid.shoreVisualAt(0, 0)?.id).toBe("shore_outer_corner_nw");
  });

  it("samples lake art from rows 5–6, not the empty row 4", () => {
    const lakeFrames = [
      WATER_FRAMES.center,
      ...WATER_FRAMES.centerAlt,
      WATER_FRAMES.shoreNorth,
      WATER_FRAMES.shoreSouth,
      WATER_FRAMES.outerCornerNW,
      WATER_FRAMES.outerCornerNE,
      WATER_FRAMES.outerCornerSW,
      WATER_FRAMES.outerCornerSE,
      WATER_FRAMES.innerCornerNW,
      WATER_FRAMES.innerCornerNE,
      WATER_FRAMES.innerCornerSW,
      WATER_FRAMES.innerCornerSE,
    ];
    for (const frame of lakeFrames) {
      expect(frame).toBeGreaterThanOrEqual(40);
      expect(frame).toBeLessThanOrEqual(55);
    }
    expect(WATER_FRAMES.legacyFill).toBe(5);
  });

  it("treats sandy_soil as land for shoreline, not as shoreline art", () => {
    const terrain = [
      [TileType.SANDY_SOIL, TileType.SANDY_SOIL, TileType.SANDY_SOIL],
      [TileType.WATER, TileType.WATER, TileType.WATER],
      [TileType.WATER, TileType.WATER, TileType.WATER],
    ];
    const details = terrain.map((row) => row.map(() => null));
    const grid = new Grid(3, 3, terrain, details, []);
    expect(grid.getTile(1, 0)?.terrain).toBe(TileType.SANDY_SOIL);
    expect(grid.getTile(1, 1)?.terrain).toBe(TileType.WATER);
    expect(grid.shoreVisualAt(1, 1)?.id).toBe("shore_north");
    expect(grid.shoreVisualAt(1, 1)?.frame).toBe(WATER_FRAMES.shoreNorth);
  });
});
