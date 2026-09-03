import { describe, expect, it } from "vitest";
import { Grid } from "@/src/world/Grid";
import { TileType } from "@/src/world/tileTypes";
import { TILE_SIZE } from "@/src/world/constants";
import { createVillageMap } from "@/src/world/villageMap";
import { collectWaterCells, isWaterWorld, SHORE_EFFECT_INSET_PX, visibleWaterCells, waterEffectPoint } from "./waterCoverage";
import { RIPPLE_PRESETS, quantizeAlpha } from "./waterVisualConfig";

function gridWithWater(paint: Array<[number, number]>): Grid {
  const width = 5;
  const height = 4;
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = terrain.map((row) => row.map(() => null));
  for (const [x, y] of paint) {
    terrain[y][x] = TileType.WATER;
  }
  return new Grid(width, height, terrain, details, []);
}

describe("waterCoverage", () => {
  it("collects only water cells and marks interior vs edge", () => {
    const grid = gridWithWater([
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
    const cells = collectWaterCells(grid);
    expect(cells).toHaveLength(9);
    expect(grid.isWalkable(2, 2)).toBe(false);
    const interior = cells.find((cell) => cell.x === 2 && cell.y === 2);
    expect(interior?.interior).toBe(true);
    const edge = cells.find((cell) => cell.x === 2 && cell.y === 1);
    expect(edge?.interior).toBe(false);
    expect(edge?.openEdges.n).toBe(true);
    expect(edge?.openEdges.s).toBe(false);
    expect(interior?.facesShallow.n).toBe(true);
    expect(edge?.facesDeep.s).toBe(true);
  });

  it("does not treat inner-corner shoreline cells as deep water", () => {
    const width = 5;
    const height = 5;
    const terrain = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => TileType.WATER),
    );
    terrain[2][2] = TileType.GRASS;
    const details = terrain.map((row) => row.map(() => null));
    const cells = collectWaterCells(new Grid(width, height, terrain, details, []));
    const inner = cells.find((cell) => cell.x === 1 && cell.y === 1);
    expect(inner?.interior).toBe(false);
    expect(cells.some((cell) => cell.x === 2 && cell.y === 2)).toBe(false);
  });

  it("keeps village water non-walkable", () => {
    const grid = createVillageMap();
    const cells = collectWaterCells(grid);
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.some((cell) => cell.interior)).toBe(true);
    expect(
      cells.some((cell) => grid.getTile(cell.x, cell.y - 1)?.terrain === TileType.GRASS),
    ).toBe(true);
    for (const cell of cells) {
      expect(grid.isWalkable(cell.x, cell.y)).toBe(false);
      expect(grid.getTile(cell.x, cell.y)?.buildable).toBe(false);
    }
  });

  it("does not treat grass as water world points", () => {
    const grid = gridWithWater([[2, 2]]);
    expect(isWaterWorld(grid, 2 * TILE_SIZE + 4, 2 * TILE_SIZE + 4)).toBe(true);
    expect(isWaterWorld(grid, 0, 0)).toBe(false);
  });

  it("filters visible water without scanning every frame's neighbors", () => {
    const grid = gridWithWater([
      [0, 0],
      [4, 3],
    ]);
    const cells = collectWaterCells(grid);
    const visible = visibleWaterCells(cells, { x: 0, y: 0, width: 40, height: 40 });
    expect(visible).toHaveLength(1);
    expect(visible[0].x).toBe(0);
  });

  it("insets ambient effect points away from shoreline land edges", () => {
    const grid = gridWithWater([
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
    const cells = collectWaterCells(grid);
    const north = cells.find((cell) => cell.x === 2 && cell.y === 1);
    const interior = cells.find((cell) => cell.x === 2 && cell.y === 2);
    expect(north).toBeDefined();
    expect(interior).toBeDefined();
    const northPoint = waterEffectPoint(north!);
    const interiorPoint = waterEffectPoint(interior!);
    expect(northPoint.y).toBe(1 * TILE_SIZE + TILE_SIZE / 2 + SHORE_EFFECT_INSET_PX);
    expect(northPoint.y).toBeLessThan(interiorPoint.y);
    expect(interiorPoint).toEqual({
      x: 2 * TILE_SIZE + TILE_SIZE / 2,
      y: 2 * TILE_SIZE + TILE_SIZE / 2,
    });
  });
});

describe("waterVisualConfig", () => {
  it("keeps reusable ripple types for future events", () => {
    expect(RIPPLE_PRESETS.click.maxRadius).toBeGreaterThan(0);
    expect(RIPPLE_PRESETS.rain).toBeDefined();
    expect(RIPPLE_PRESETS.cast).toBeDefined();
    expect(quantizeAlpha(0.37)).toBe(0.25);
    expect(quantizeAlpha(0.9)).toBe(1);
  });
});
