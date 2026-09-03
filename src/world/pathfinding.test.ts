import { describe, expect, it } from "vitest";
import { Grid } from "./Grid";
import { DetailType, ObjectType, TileType } from "./tileTypes";
import { findPath } from "./pathfinding";

function grassGrid(
  width: number,
  height: number,
  paint: (set: (x: number, y: number, type: TileType) => void) => void = () => undefined,
): Grid {
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => null),
  );
  paint((x, y, type) => {
    terrain[y][x] = type;
  });
  return new Grid(width, height, terrain, details, []);
}

describe("findPath", () => {
  it("returns an empty path when start equals goal", () => {
    const grid = grassGrid(4, 4);
    expect(findPath(grid, { x: 1, y: 1 }, { x: 1, y: 1 })).toEqual([]);
  });

  it("finds a 4-directional path on open grass", () => {
    const grid = grassGrid(5, 5);
    const path = findPath(grid, { x: 0, y: 0 }, { x: 2, y: 0 });
    expect(path).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
  });

  it("never steps on water", () => {
    const grid = grassGrid(5, 3, (set) => {
      set(1, 1, TileType.WATER);
      set(2, 1, TileType.WATER);
      set(3, 1, TileType.WATER);
    });
    const path = findPath(grid, { x: 0, y: 1 }, { x: 4, y: 1 });
    expect(path).not.toBeNull();
    for (const step of path ?? []) {
      expect(grid.getTile(step.x, step.y)?.terrain).not.toBe(TileType.WATER);
      expect(grid.isWalkable(step.x, step.y)).toBe(true);
    }
  });

  it("returns null for a water goal", () => {
    const grid = grassGrid(3, 3, (set) => set(2, 1, TileType.WATER));
    expect(findPath(grid, { x: 0, y: 1 }, { x: 2, y: 1 })).toBeNull();
  });

  it("avoids tree footprints", () => {
    const terrain = Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, () => TileType.GRASS),
    );
    const details = terrain.map((row) => row.map(() => null));
    const grid = new Grid(6, 6, terrain, details, [{ type: ObjectType.TREE, x: 2, y: 2 }]);
    expect(grid.isWalkable(2, 2)).toBe(false);
    expect(grid.isWalkable(3, 3)).toBe(false);

    const path = findPath(grid, { x: 0, y: 2 }, { x: 5, y: 2 });
    expect(path).not.toBeNull();
    for (const step of path ?? []) {
      expect(grid.isWalkable(step.x, step.y)).toBe(true);
    }
  });

  it("treats pine, bush, and rock as 1×1 blockers", () => {
    const terrain = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => TileType.GRASS),
    );
    const details = terrain.map((row) => row.map(() => null));
    const grid = new Grid(5, 5, terrain, details, [
      { type: ObjectType.PINE_TREE, x: 1, y: 2 },
      { type: ObjectType.BUSH, x: 2, y: 2 },
      { type: ObjectType.ROCK, x: 3, y: 2 },
    ]);
    expect(grid.isWalkable(1, 2)).toBe(false);
    expect(grid.isWalkable(2, 2)).toBe(false);
    expect(grid.isWalkable(3, 2)).toBe(false);
    expect(grid.isWalkable(1, 1)).toBe(true);
    expect(grid.isWalkable(2, 3)).toBe(true);

    const path = findPath(grid, { x: 0, y: 2 }, { x: 4, y: 2 });
    expect(path).not.toBeNull();
    for (const step of path ?? []) {
      expect(grid.isWalkable(step.x, step.y)).toBe(true);
    }
  });

  it("does not block on details including small_rock", () => {
    const terrain = Array.from({ length: 3 }, () =>
      Array.from({ length: 4 }, () => TileType.GRASS),
    );
    const details = terrain.map((row) => row.map(() => null as DetailType | null));
    details[1][1] = DetailType.SMALL_ROCK;
    details[1][2] = DetailType.TALL_GRASS_DETAIL;
    const grid = new Grid(4, 3, terrain, details, []);
    expect(grid.isWalkable(1, 1)).toBe(true);
    expect(grid.isWalkable(2, 1)).toBe(true);
    const path = findPath(grid, { x: 0, y: 1 }, { x: 3, y: 1 });
    expect(path).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it("returns null when the goal is boxed in by water", () => {
    const grid = grassGrid(5, 5, (set) => {
      set(2, 1, TileType.WATER);
      set(1, 2, TileType.WATER);
      set(3, 2, TileType.WATER);
      set(2, 3, TileType.WATER);
    });
    expect(findPath(grid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
  });
});
