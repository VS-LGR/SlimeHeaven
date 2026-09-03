import { describe, expect, it } from "vitest";
import { GameState } from "../GameState";
import { createSlimeState, SLIME_IDS, SLIME_SPAWNS } from "../entities/SlimeState";
import {
  canPlotWorkRecoverHop,
  canTillRecoverHop,
  startPlotWorkRecoverHop,
  startTillRecoverHop,
  tillStanceWorkTile,
} from "./tillStance";

describe("tillStanceWorkTile", () => {
  it("prefers the east neighbor so the west-facing hoe hits the plot", () => {
    const grid = new GameState().grid;
    expect(tillStanceWorkTile(grid, { x: 2, y: 12 })).toEqual({ x: 3, y: 12 });
  });

  it("falls back to west when the east neighbor is a rock", () => {
    const grid = new GameState().grid;
    expect(grid.isWalkable(9, 12)).toBe(false);
    expect(tillStanceWorkTile(grid, { x: 8, y: 12 })).toEqual({ x: 7, y: 12 });
  });
});

describe("till recover hop", () => {
  it("starts a same-tile hop from an east or west stance", () => {
    const plot = { x: 2, y: 12 };
    expect(canTillRecoverHop(plot, { x: 3, y: 12 })).toBe(true);
    expect(canTillRecoverHop(plot, { x: 1, y: 12 })).toBe(true);
    expect(canTillRecoverHop(plot, { x: 2, y: 13 })).toBe(false);

    const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    if (!def) {
      throw new Error("Momo spawn missing");
    }
    const momo = createSlimeState(def, 0);
    momo.tileX = 3;
    momo.tileY = 12;
    startTillRecoverHop(momo, plot);
    expect(momo.tillRecoverPlot).toEqual(plot);
    expect(momo.hopFrom).toEqual({ x: 3, y: 12 });
    expect(momo.hopTo).toEqual({ x: 3, y: 12 });
  });
});

describe("plot work recover hop", () => {
  it("starts a same-tile hop only when standing on the plot", () => {
    const plot = { x: 2, y: 12 };
    expect(canPlotWorkRecoverHop(plot, plot)).toBe(true);
    expect(canPlotWorkRecoverHop(plot, { x: 3, y: 12 })).toBe(false);

    const def = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    if (!def) {
      throw new Error("Momo spawn missing");
    }
    const momo = createSlimeState(def, 0);
    momo.tileX = plot.x;
    momo.tileY = plot.y;
    startPlotWorkRecoverHop(momo, plot);
    expect(momo.tillRecoverPlot).toEqual(plot);
    expect(momo.hopFrom).toEqual(plot);
    expect(momo.hopTo).toEqual(plot);
  });
});

describe("tillStanceWorkTile", () => {
  it("prefers the east neighbor so the west-facing hoe hits the plot", () => {
    const grid = new GameState().grid;
    expect(tillStanceWorkTile(grid, { x: 2, y: 12 })).toEqual({ x: 3, y: 12 });
  });

  it("falls back to west when the east neighbor is a rock", () => {
    const grid = new GameState().grid;
    expect(grid.isWalkable(9, 12)).toBe(false);
    expect(tillStanceWorkTile(grid, { x: 8, y: 12 })).toEqual({ x: 7, y: 12 });
  });
});
