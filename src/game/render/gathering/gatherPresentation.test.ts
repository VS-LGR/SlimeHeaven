import { describe, expect, it } from "vitest";
import type { Task } from "@/src/simulation/entities/Task";
import { TILE_SIZE, tileToAnchor } from "@/src/world/constants";
import { slimeGroundWorld } from "../farming/tillPresentation";
import {
  gatherStanceGround,
  stoneStrikeFeetWorld,
  woodStrikeFeetWorld,
} from "./gatherPresentation";

function gatherTask(
  type: "gather_wood" | "gather_stone",
  target: { x: number; y: number },
  workTile: { x: number; y: number },
): Task {
  return {
    id: "t",
    type,
    target,
    nodeId: "n",
    workTile,
    state: "in_progress",
  };
}

describe("wood strike feet", () => {
  const origin = { x: 2, y: 2 };

  it("hugs the east lip of the south-east trunk cell", () => {
    const east = { x: 4, y: 3 };
    const feet = woodStrikeFeetWorld(origin, east);
    expect(feet).toEqual({ x: east.x * TILE_SIZE + 8, y: tileToAnchor(east.x, east.y).y });
    expect(slimeGroundWorld(gatherTask("gather_wood", origin, east), east.x, east.y)).toEqual(feet);
  });

  it("hugs the west lip of the south-west trunk cell", () => {
    const west = { x: 1, y: 3 };
    const feet = woodStrikeFeetWorld(origin, west);
    expect(feet).toEqual({
      x: (west.x + 1) * TILE_SIZE - 8,
      y: tileToAnchor(west.x, west.y).y,
    });
  });

  it("leaves south/north fallbacks on the tile anchor", () => {
    const south = { x: 3, y: 4 };
    expect(woodStrikeFeetWorld(origin, south)).toBeUndefined();
    expect(slimeGroundWorld(gatherTask("gather_wood", origin, south), south.x, south.y)).toEqual(
      tileToAnchor(south.x, south.y),
    );
  });
});

describe("stone strike feet", () => {
  const origin = { x: 5, y: 6 };

  it("hugs the east lip of the rock", () => {
    const east = { x: 6, y: 6 };
    const feet = stoneStrikeFeetWorld(origin, east);
    expect(feet).toEqual({ x: east.x * TILE_SIZE + 8, y: tileToAnchor(east.x, east.y).y });
    expect(slimeGroundWorld(gatherTask("gather_stone", origin, east), east.x, east.y)).toEqual(feet);
  });

  it("hugs the west lip of the rock", () => {
    const west = { x: 4, y: 6 };
    expect(stoneStrikeFeetWorld(origin, west)).toEqual({
      x: (west.x + 1) * TILE_SIZE - 8,
      y: tileToAnchor(west.x, west.y).y,
    });
  });

  it("does not apply the hug on a different tile than workTile", () => {
    const east = { x: 6, y: 6 };
    expect(gatherStanceGround(gatherTask("gather_stone", origin, east), 7, 6)).toBeUndefined();
  });
});
