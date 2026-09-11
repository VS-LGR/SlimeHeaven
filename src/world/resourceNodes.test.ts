import { describe, expect, it } from "vitest";
import { GameState } from "@/src/simulation/GameState";
import { createVillageMap } from "./villageMap";
import { createResourceNodes } from "./resourceNodes";
import { ObjectType } from "./tileTypes";

describe("createResourceNodes", () => {
  it("makes wood nodes from trees only, not pine", () => {
    const grid = createVillageMap();
    const nodes = createResourceNodes(grid);
    const wood = nodes.filter((node) => node.type === "wood");
    const trees = grid.objects.filter((object) => object.type === ObjectType.TREE);
    const pines = grid.objects.filter((object) => object.type === ObjectType.PINE_TREE);
    expect(pines.length).toBeGreaterThanOrEqual(1);
    expect(wood).toHaveLength(trees.length);
    for (const tree of trees) {
      expect(wood.some((node) => node.tile.x === tree.x && node.tile.y === tree.y)).toBe(true);
    }
  });

  it("makes stone nodes from rock objects with an adjacent work tile", () => {
    const grid = createVillageMap();
    const nodes = createResourceNodes(grid);
    const rocks = grid.objects.filter((object) => object.type === ObjectType.ROCK);
    const stone = nodes.filter((node) => node.type === "stone");
    expect(rocks.length).toBeGreaterThanOrEqual(1);
    expect(stone).toHaveLength(rocks.length);
    for (const rock of rocks) {
      expect(grid.isWalkable(rock.x, rock.y)).toBe(false);
      const node = stone.find((entry) => entry.tile.x === rock.x && entry.tile.y === rock.y);
      expect(node).toBeDefined();
      expect(grid.isWalkable(node!.workTile.x, node!.workTile.y)).toBe(true);
      const dx = Math.abs(node!.workTile.x - rock.x);
      const dy = Math.abs(node!.workTile.y - rock.y);
      expect(dx + dy).toBe(1);
      const east = { x: rock.x + 1, y: rock.y };
      const west = { x: rock.x - 1, y: rock.y };
      if (grid.isWalkable(east.x, east.y)) {
        expect(node!.workTile).toEqual(east);
      } else if (grid.isWalkable(west.x, west.y)) {
        expect(node!.workTile).toEqual(west);
      }
    }
  });

  it("stands beside the south trunk row of each village tree", () => {
    const grid = createVillageMap();
    const nodes = createResourceNodes(grid);
    const trees = grid.objects.filter((object) => object.type === ObjectType.TREE);
    for (const tree of trees) {
      const node = nodes.find((entry) => entry.tile.x === tree.x && entry.tile.y === tree.y);
      expect(node).toBeDefined();
      const eastOfTrunk = { x: tree.x + 2, y: tree.y + 1 };
      const westOfTrunk = { x: tree.x - 1, y: tree.y + 1 };
      if (grid.isWalkable(eastOfTrunk.x, eastOfTrunk.y)) {
        expect(node!.workTile).toEqual(eastOfTrunk);
      } else if (grid.isWalkable(westOfTrunk.x, westOfTrunk.y)) {
        expect(node!.workTile).toEqual(westOfTrunk);
      } else {
        expect(node!.workTile.y).toBeGreaterThanOrEqual(tree.y + 1);
      }
    }
  });

  it("resolves village nodeAtTile for tree footprints and 1×1 rocks", () => {
    const state = new GameState();
    const tree = state.grid.objects.find((object) => object.type === ObjectType.TREE);
    const rock = state.grid.objects.find((object) => object.type === ObjectType.ROCK);
    expect(tree).toBeDefined();
    expect(rock).toBeDefined();
    expect(state.nodeAtTile(tree!.x, tree!.y)?.type).toBe("wood");
    expect(state.nodeAtTile(tree!.x + 1, tree!.y + 1)?.type).toBe("wood");
    expect(state.nodeAtTile(rock!.x, rock!.y)?.type).toBe("stone");
  });
});
