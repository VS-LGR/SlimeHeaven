import { describe, expect, it } from "vitest";
import { Grid } from "./Grid";
import { ObjectType, TileType } from "./tileTypes";
import { stoneGatherWorkTile, woodGatherWorkTile } from "./gatherStance";

function grassGrid(
  width: number,
  height: number,
  objects: ConstructorParameters<typeof Grid>[4] = [],
  paint: (set: (x: number, y: number, type: TileType) => void) => void = () => undefined,
): Grid {
  const terrain = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => TileType.GRASS),
  );
  const details = terrain.map((row) => row.map(() => null));
  paint((x, y, type) => {
    terrain[y][x] = type;
  });
  return new Grid(width, height, terrain, details, objects);
}

describe("woodGatherWorkTile", () => {
  it("stands east of the south-east trunk cell when that tile is open", () => {
    const origin = { x: 2, y: 2 };
    const grid = grassGrid(8, 8, [{ type: ObjectType.TREE, x: origin.x, y: origin.y }]);
    expect(woodGatherWorkTile(grid, origin)).toEqual({ x: 4, y: 3 });
  });

  it("falls back west of the south-west trunk cell when east of SE is blocked", () => {
    const origin = { x: 2, y: 2 };
    const grid = grassGrid(8, 8, [{ type: ObjectType.TREE, x: origin.x, y: origin.y }], (set) => {
      set(4, 3, TileType.WATER);
    });
    expect(woodGatherWorkTile(grid, origin)).toEqual({ x: 1, y: 3 });
  });

  it("does not pick the north canopy neighbor when the south row is open", () => {
    const origin = { x: 2, y: 2 };
    const grid = grassGrid(8, 8, [{ type: ObjectType.TREE, x: origin.x, y: origin.y }]);
    const work = woodGatherWorkTile(grid, origin);
    expect(work).not.toEqual({ x: 2, y: 1 });
    expect(work).not.toEqual({ x: 1, y: 2 });
  });
});

describe("stoneGatherWorkTile", () => {
  it("stands east of the rock when that tile is open", () => {
    const origin = { x: 3, y: 3 };
    const grid = grassGrid(8, 8, [{ type: ObjectType.ROCK, x: origin.x, y: origin.y }]);
    expect(stoneGatherWorkTile(grid, origin)).toEqual({ x: 4, y: 3 });
  });

  it("falls back west then south then north", () => {
    const origin = { x: 3, y: 3 };
    const eastBlocked = grassGrid(8, 8, [{ type: ObjectType.ROCK, x: origin.x, y: origin.y }], (set) => {
      set(4, 3, TileType.WATER);
    });
    expect(stoneGatherWorkTile(eastBlocked, origin)).toEqual({ x: 2, y: 3 });

    const eastWestBlocked = grassGrid(
      8,
      8,
      [{ type: ObjectType.ROCK, x: origin.x, y: origin.y }],
      (set) => {
        set(4, 3, TileType.WATER);
        set(2, 3, TileType.WATER);
      },
    );
    expect(stoneGatherWorkTile(eastWestBlocked, origin)).toEqual({ x: 3, y: 4 });

    const onlyNorth = grassGrid(8, 8, [{ type: ObjectType.ROCK, x: origin.x, y: origin.y }], (set) => {
      set(4, 3, TileType.WATER);
      set(2, 3, TileType.WATER);
      set(3, 4, TileType.WATER);
    });
    expect(stoneGatherWorkTile(onlyNorth, origin)).toEqual({ x: 3, y: 2 });
  });
});
