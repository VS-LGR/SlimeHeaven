import { describe, expect, it } from "vitest";
import { Grid } from "@/src/world/Grid";
import { ObjectType, TileType } from "@/src/world/tileTypes";
import { buildWaterWorld } from "./waterBodies";

function makeGrid(
  width: number,
  height: number,
  water: Array<[number, number]>,
  objects: Array<{ type: ObjectType; x: number; y: number }> = [],
): Grid {
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = terrain.map((row) => row.map(() => null));
  for (const [x, y] of water) {
    terrain[y][x] = TileType.WATER;
  }
  return new Grid(width, height, terrain, details, objects);
}

describe("fishing access points", () => {
  it("creates a land access point beside water with cast toward the water", () => {
    const grid = makeGrid(5, 3, [[2, 1]]);
    const world = buildWaterWorld(grid, { x: 0, y: 0 });
    const east = world.accessPoints.find(
      (point) => point.landTile.x === 3 && point.landTile.y === 1,
    );
    expect(east).toBeDefined();
    expect(east?.waterTile).toEqual({ x: 2, y: 1 });
    expect(east?.castDirection).toBe("west");
    expect(east?.waterBodyId).toBe(world.bodies[0].id);
    expect(grid.isWalkable(east!.landTile.x, east!.landTile.y)).toBe(true);
    expect(grid.getTile(east!.landTile.x, east!.landTile.y)?.terrain).not.toBe(TileType.WATER);
  });

  it("skips blocked land and never destinations a water tile", () => {
    const grid = makeGrid(5, 3, [[2, 1]], [{ type: ObjectType.ROCK, x: 3, y: 1 }]);
    const world = buildWaterWorld(grid, { x: 0, y: 0 });
    expect(
      world.accessPoints.some((point) => point.landTile.x === 3 && point.landTile.y === 1),
    ).toBe(false);
    expect(world.accessPoints.every((point) => grid.isWalkable(point.landTile.x, point.landTile.y))).toBe(
      true,
    );
    expect(
      world.accessPoints.every(
        (point) => grid.getTile(point.landTile.x, point.landTile.y)?.terrain !== TileType.WATER,
      ),
    ).toBe(true);
  });

  it("places access on both banks of a one-tile river", () => {
    const grid = makeGrid(5, 4, [
      [2, 1],
      [2, 2],
    ]);
    const world = buildWaterWorld(grid, { x: 0, y: 0 });
    expect(world.accessPoints.some((point) => point.landTile.x === 1 && point.landTile.y === 1)).toBe(
      true,
    );
    expect(world.accessPoints.some((point) => point.landTile.x === 3 && point.landTile.y === 1)).toBe(
      true,
    );
  });
});
