import { describe, expect, it } from "vitest";
import { Grid } from "./Grid";
import { TileType } from "./tileTypes";
import { blobCellForMask, connectedTerrainFrame, DIR_E, DIR_N, DIR_S, DIR_W } from "./connectedTerrain";

describe("connectedTerrain", () => {
  it("maps a full 4-neighbor mask to the blob center", () => {
    const mask = DIR_N | DIR_E | DIR_S | DIR_W;
    expect(blobCellForMask(mask)).toBe("center");
    expect(connectedTerrainFrame(TileType.HIGH_GRASS, mask)).toBe(19);
    expect(connectedTerrainFrame(TileType.SANDY_SOIL, mask)).toBe(22);
  });

  it("maps missing-north to the north edge cell", () => {
    const mask = DIR_E | DIR_S | DIR_W;
    expect(blobCellForMask(mask)).toBe("n");
    expect(connectedTerrainFrame(TileType.HIGH_GRASS, mask)).toBe(11);
    expect(connectedTerrainFrame(TileType.SANDY_SOIL, mask)).toBe(14);
  });

  it("maps an isolated tile to center", () => {
    expect(blobCellForMask(0)).toBe("center");
    expect(connectedTerrainFrame(TileType.HIGH_GRASS, 0)).toBe(19);
  });

  it("maps a south-only neighbor to the north edge (1-tile protrusion)", () => {
    expect(blobCellForMask(DIR_S)).toBe("n");
    expect(connectedTerrainFrame(TileType.HIGH_GRASS, DIR_S)).toBe(11);
  });

  it("maps adjacent N+E neighbors to the southwest corner", () => {
    const mask = DIR_N | DIR_E;
    expect(blobCellForMask(mask)).toBe("sw");
    expect(connectedTerrainFrame(TileType.HIGH_GRASS, mask)).toBe(26);
    expect(connectedTerrainFrame(TileType.SANDY_SOIL, mask)).toBe(29);
  });

  it("maps opposite-edge N+S to center fallback", () => {
    const mask = DIR_N | DIR_S;
    expect(blobCellForMask(mask)).toBe("center");
    expect(connectedTerrainFrame(TileType.SANDY_SOIL, mask)).toBe(22);
  });

  it("resolves a 3×3 high_grass blob to the 9 atlas cells", () => {
    const terrain = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => TileType.HIGH_GRASS),
    );
    const details = terrain.map((row) => row.map(() => null));
    const frames = new Grid(3, 3, terrain, details, []).terrainFrameGrid();
    expect(frames).toEqual([
      [10, 11, 12],
      [18, 19, 20],
      [26, 27, 28],
    ]);
  });
});
