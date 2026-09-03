import { describe, expect, it } from "vitest";
import { Grid } from "@/src/world/Grid";
import { TileType } from "@/src/world/tileTypes";
import { createVillageMap } from "@/src/world/villageMap";
import { buildWaterWorld } from "./waterBodies";

function grassWithWater(width: number, height: number, water: Array<[number, number]>): Grid {
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = terrain.map((row) => row.map(() => null));
  for (const [x, y] of water) {
    terrain[y][x] = TileType.WATER;
  }
  return new Grid(width, height, terrain, details, []);
}

describe("water bodies", () => {
  it("groups orthogonal water into one component", () => {
    const grid = grassWithWater(6, 4, [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
    ]);
    const world = buildWaterWorld(grid, { x: 0, y: 0 });
    expect(world.bodies).toHaveLength(1);
    expect(world.bodies[0].tiles).toHaveLength(6);
    expect(world.bodies[0].type).toBe("pond");
    expect(world.spots.every((spot) => spot.waterBodyId === world.bodies[0].id)).toBe(true);
  });

  it("keeps two disconnected water regions as separate bodies", () => {
    const grid = grassWithWater(8, 4, [
      [1, 1],
      [2, 1],
      [6, 1],
      [7, 1],
    ]);
    const world = buildWaterWorld(grid, { x: 0, y: 0 });
    expect(world.bodies).toHaveLength(2);
  });

  it("includes water on the map edge", () => {
    const grid = grassWithWater(4, 3, [
      [0, 0],
      [0, 1],
      [1, 0],
    ]);
    const world = buildWaterWorld(grid, { x: 2, y: 2 });
    expect(world.bodies).toHaveLength(1);
    expect(world.spots.some((spot) => spot.tileX === 0 && spot.tileY === 0)).toBe(true);
    expect(world.accessPoints.some((point) => point.landTile.x === 1 && point.landTile.y === 1)).toBe(
      true,
    );
  });

  it("marks interior cells deep and edge cells shallow on the village lake", () => {
    const world = buildWaterWorld(createVillageMap(), { x: 10, y: 8 });
    expect(world.bodies.length).toBeGreaterThan(0);
    expect(world.spots.some((spot) => spot.depth === "shallow")).toBe(true);
    expect(world.spots.some((spot) => spot.depth === "deep")).toBe(true);
    const lake = world.bodies.find((body) => body.deepTiles.length > 0);
    expect(lake).toBeDefined();
    expect(lake?.type).toBe("lake");
  });
});
