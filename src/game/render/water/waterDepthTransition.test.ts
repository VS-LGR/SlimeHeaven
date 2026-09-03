import { describe, expect, it } from "vitest";
import { Grid } from "@/src/world/Grid";
import { TileType } from "@/src/world/tileTypes";
import { TILE_SIZE } from "@/src/world/constants";
import { collectWaterCells } from "./waterCoverage";
import {
  bandWidth,
  depthToneAt,
  hash2,
  seamWobble,
  signedInsideDeep,
  transitionDirs,
} from "./waterDepthTransition";

function gridWithWater(paint: Array<[number, number]>, width = 5, height = 5): Grid {
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = terrain.map((row) => row.map(() => null));
  for (const [x, y] of paint) {
    terrain[y][x] = TileType.WATER;
  }
  return new Grid(width, height, terrain, details, []);
}

function lake3x3() {
  const cells: Array<[number, number]> = [];
  for (let y = 1; y <= 3; y += 1) {
    for (let x = 1; x <= 3; x += 1) {
      cells.push([x, y]);
    }
  }
  return collectWaterCells(gridWithWater(cells));
}

describe("waterDepthTransition", () => {
  it("marks shallow/deep facing in all four cardinals on a 3×3 lake", () => {
    const water = lake3x3();
    const deep = water.find((cell) => cell.x === 2 && cell.y === 2);
    const north = water.find((cell) => cell.x === 2 && cell.y === 1);
    const south = water.find((cell) => cell.x === 2 && cell.y === 3);
    const west = water.find((cell) => cell.x === 1 && cell.y === 2);
    const east = water.find((cell) => cell.x === 3 && cell.y === 2);
    expect(deep?.interior).toBe(true);
    expect(deep?.facesShallow).toEqual({ n: true, e: true, s: true, w: true });
    expect(north?.facesDeep.s).toBe(true);
    expect(south?.facesDeep.n).toBe(true);
    expect(west?.facesDeep.e).toBe(true);
    expect(east?.facesDeep.w).toBe(true);
    expect(transitionDirs(west!).map((item) => item.dir)).toEqual(["e"]);
    expect(transitionDirs(deep!).map((item) => item.fromShallow)).toEqual([
      false,
      false,
      false,
      false,
    ]);
  });

  it("does not treat two adjacent deep tiles as a depth seam", () => {
    const cells: Array<[number, number]> = [];
    for (let y = 1; y <= 4; y += 1) {
      for (let x = 1; x <= 4; x += 1) {
        cells.push([x, y]);
      }
    }
    const water = collectWaterCells(gridWithWater(cells, 6, 6));
    const inner = water.find((cell) => cell.x === 2 && cell.y === 2);
    expect(inner?.interior).toBe(true);
    expect(inner?.facesShallow.e).toBe(false);
    expect(transitionDirs(inner!).some((item) => item.dir === "e")).toBe(false);
  });

  it("uses world-axis wobble so adjacent tiles do not share the same strip", () => {
    const a = Array.from({ length: 32 }, (_, i) => seamWobble(i));
    const b = Array.from({ length: 32 }, (_, i) => seamWobble(32 + i));
    expect(new Set(a).size).toBeGreaterThan(1);
    expect(a.join(",")).not.toBe(b.join(","));
    expect(seamWobble(40)).toBe(seamWobble(40));
    expect(bandWidth(12)).toBeGreaterThanOrEqual(4);
    expect(bandWidth(12)).toBeLessThanOrEqual(10);
  });

  it("keeps signed depth continuous across a shared vertical seam", () => {
    const water = lake3x3();
    const shallow = water.find((cell) => cell.x === 1 && cell.y === 2)!;
    const deep = water.find((cell) => cell.x === 2 && cell.y === 2)!;
    const wy = 2 * TILE_SIZE + 10;
    const left = signedInsideDeep(shallow, 2 * TILE_SIZE - 1, wy);
    const right = signedInsideDeep(deep, 2 * TILE_SIZE, wy);
    expect(right - left).toBe(1);
  });

  it("moves the visual deep boundary off the tile grid", () => {
    const water = lake3x3();
    const shallow = water.find((cell) => cell.x === 1 && cell.y === 2)!;
    const deep = water.find((cell) => cell.x === 2 && cell.y === 2)!;
    const crossings: number[] = [];
    for (let y = 0; y < TILE_SIZE; y += 1) {
      const wy = 2 * TILE_SIZE + y;
      let x = TILE_SIZE;
      while (x < 3 * TILE_SIZE) {
        const cell = x < 2 * TILE_SIZE ? shallow : deep;
        if (signedInsideDeep(cell, x, wy) >= 0) {
          crossings.push(x);
          break;
        }
        x += 1;
      }
    }
    expect(crossings).toHaveLength(TILE_SIZE);
    expect(new Set(crossings).size).toBeGreaterThan(1);
    expect(crossings.every((x) => x === 2 * TILE_SIZE)).toBe(false);
    const runStarts = Array.from({ length: 8 }, (_, i) => crossings[i * 4]);
    expect(runStarts.some((x, i) => i > 0 && x !== runStarts[0])).toBe(true);
  });

  it("returns deterministic tones from the existing palette", () => {
    const water = lake3x3();
    const deep = water.find((cell) => cell.x === 2 && cell.y === 2)!;
    const wx = 2 * TILE_SIZE + 16;
    const wy = 2 * TILE_SIZE + 16;
    expect(depthToneAt(deep, wx, wy)).toBe("deep");
    expect(depthToneAt(deep, wx, wy)).toBe(depthToneAt(deep, wx, wy));
    expect(hash2(3, 7)).toBe(hash2(3, 7));
  });
});
