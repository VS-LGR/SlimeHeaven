import { describe, expect, it } from "vitest";
import { findPath } from "@/src/world/pathfinding";
import { TILE_SIZE } from "@/src/world/constants";
import { GameState, createBareGameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { STORAGE_TILE } from "../constants";
import { designateFarmTile, isValidFarmTerrain } from "./FarmSystem";
import { assignAvailableTasks, createGatherTask } from "./JobSystem";
import {
  cancelConstructionSite,
  evaluateBuildingPlacement,
  placeBuilding,
  syncBuildingPreview,
} from "./BuildingSystem";
import { BUILDING_NATIVE_TEXTURE_SIZE, buildingById, footprintTiles } from "../data/buildings";
import { FISH } from "../data/fish";

const GRASS_ORIGIN = { x: 5, y: 11 };
const SECOND_ORIGIN = { x: 7, y: 11 };
const FARM_X = 2;
const FARM_Y = 12;

function stockForHouses(state: GameState): void {
  state.resources.wood = 40;
  state.resources.stone = 40;
}

function siteCount(state: GameState): number {
  return Object.keys(state.constructionSites).length;
}

function placedCount(state: GameState): number {
  return Object.keys(state.buildings).length;
}

describe("building placement", () => {
  it("creates unique construction-site IDs and rejects a second site for the same resident", () => {
    const state = createBareGameState();
    stockForHouses(state);
    const first = placeBuilding(state, "brown_house", GRASS_ORIGIN);
    const secondSame = placeBuilding(state, "brown_house", SECOND_ORIGIN);
    const other = placeBuilding(state, "small_blue_house", SECOND_ORIGIN);
    expect(first).toBeDefined();
    expect(first?.buildingTypeId).toBe("brown_house");
    expect(secondSame).toBeNull();
    expect(other).toBeDefined();
    expect(other?.buildingTypeId).toBe("small_blue_house");
    expect(first?.id).not.toBe(other?.id);
    expect(siteCount(state)).toBe(2);
    expect(placedCount(state)).toBe(0);
  });

  it("accepts valid grass placement and rejects out of bounds, water, storage, nodes, farms, and blocked entrances", () => {
    const state = createBareGameState();
    stockForHouses(state);
    const valid = evaluateBuildingPlacement(state, "small_blue_house", GRASS_ORIGIN);
    expect(valid.valid).toBe(true);
    expect(valid.reasons).toEqual([]);

    const oob = evaluateBuildingPlacement(state, "small_blue_house", { x: 19, y: 14 });
    expect(oob.valid).toBe(false);
    expect(oob.reasons).toContain("out_of_bounds");

    const water = evaluateBuildingPlacement(state, "small_blue_house", { x: 14, y: 8 });
    expect(water.valid).toBe(false);
    expect(water.reasons).toContain("water");

    const storage = evaluateBuildingPlacement(state, "small_blue_house", {
      x: STORAGE_TILE.x - 1,
      y: STORAGE_TILE.y - 1,
    });
    expect(storage.valid).toBe(false);
    expect(storage.reasons).toContain("storage");

    const node = evaluateBuildingPlacement(state, "small_blue_house", { x: 1, y: 0 });
    expect(node.valid).toBe(false);
    expect(node.reasons).toContain("resource_node");
    expect(node.reasons).toContain("object");

    expect(designateFarmTile(state, FARM_X, FARM_Y)).toBe(true);
    const farm = evaluateBuildingPlacement(state, "small_blue_house", { x: 1, y: 11 });
    expect(farm.valid).toBe(false);
    expect(farm.reasons).toContain("farm");

    const blockedEntrance = evaluateBuildingPlacement(state, "small_blue_house", { x: 9, y: 10 });
    expect(blockedEntrance.valid).toBe(false);
    expect(
      blockedEntrance.reasons.some(
        (reason) => reason === "entrance_occupied" || reason === "entrance_blocked",
      ),
    ).toBe(true);
  });

  it("rejects overlap with an existing construction site", () => {
    const state = createBareGameState();
    stockForHouses(state);
    expect(placeBuilding(state, "small_blue_house", GRASS_ORIGIN)?.buildingTypeId).toBe("small_blue_house");
    const overlap = evaluateBuildingPlacement(state, "brown_house", { x: 6, y: 11 });
    expect(overlap.valid).toBe(false);
    expect(overlap.reasons).toContain("construction_site");
  });

  it("does not create a site or building from preview or invalid confirmation", () => {
    const state = createBareGameState();
    stockForHouses(state);
    const preview = syncBuildingPreview(state, "build", "small_blue_house", GRASS_ORIGIN);
    expect(preview?.valid).toBe(true);
    expect(placedCount(state)).toBe(0);
    expect(siteCount(state)).toBe(0);
    expect(evaluateBuildingPlacement(state, "small_blue_house", GRASS_ORIGIN).valid).toBe(true);
    expect(placedCount(state)).toBe(0);
    expect(siteCount(state)).toBe(0);

    expect(placeBuilding(state, "small_blue_house", { x: 14, y: 8 })).toBeNull();
    expect(placedCount(state)).toBe(0);
    expect(siteCount(state)).toBe(0);
    expect(state.resources.wood).toBe(40);
    expect(state.resources.stone).toBe(40);

    const created = placeBuilding(state, "small_blue_house", GRASS_ORIGIN);
    expect(created).not.toBeNull();
    expect(siteCount(state)).toBe(1);
    expect(placedCount(state)).toBe(0);
    expect(state.resources.wood).toBe(32);
    expect(state.resources.stone).toBe(38);
  });

  it("blocks only footprint tiles, keeps the entrance walkable, and leaves roof overhang unblocked", () => {
    const state = createBareGameState();
    stockForHouses(state);
    const def = buildingById("small_blue_house");
    const native = BUILDING_NATIVE_TEXTURE_SIZE.small_blue_house;
    expect(native.width).toBeGreaterThan(def.footprint.width * TILE_SIZE);
    expect(placeBuilding(state, "small_blue_house", GRASS_ORIGIN)).not.toBeNull();

    const occupied = footprintTiles(GRASS_ORIGIN, def);
    for (const tile of occupied) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(false);
      expect(state.constructionSiteAt(tile.x, tile.y)?.buildingTypeId).toBe("small_blue_house");
      expect(state.buildingAt(tile.x, tile.y)).toBeUndefined();
    }
    expect(state.grid.isWalkable(5, 13)).toBe(true);
    expect(state.constructionSiteAt(5, 13)).toBeUndefined();
    expect(state.buildingAt(5, 13)).toBeUndefined();
    expect(state.grid.isWalkable(4, 11)).toBe(true);
    expect(state.grid.isWalkable(7, 11)).toBe(true);
    expect(state.grid.isWalkable(5, 10)).toBe(true);
  });

  it("routes pathfinding around the construction-site footprint", () => {
    const state = createBareGameState();
    stockForHouses(state);
    expect(placeBuilding(state, "brown_house", GRASS_ORIGIN)).not.toBeNull();
    const throughHouse = findPath(state.grid, { x: 4, y: 11 }, { x: 7, y: 11 });
    expect(throughHouse).not.toBeNull();
    for (const step of throughHouse ?? []) {
      expect(state.constructionSiteAt(step.x, step.y)).toBeUndefined();
      expect(state.buildingAt(step.x, step.y)).toBeUndefined();
      expect(state.grid.isWalkable(step.x, step.y)).toBe(true);
    }
    expect(findPath(state.grid, { x: 4, y: 11 }, { x: 5, y: 11 })).toBeNull();
    expect(findPath(state.grid, { x: 10, y: 8 }, { x: 5, y: 13 })).not.toBeNull();
  });

  it("clears preview evaluation when the tool is cancelled or switched", () => {
    const state = createBareGameState();
    stockForHouses(state);
    expect(syncBuildingPreview(state, "build", "small_blue_house", GRASS_ORIGIN)?.valid).toBe(true);
    expect(syncBuildingPreview(state, "off", "small_blue_house", GRASS_ORIGIN)).toBeNull();
    expect(syncBuildingPreview(state, "designate", "small_blue_house", GRASS_ORIGIN)).toBeNull();
    expect(syncBuildingPreview(state, "fish", "brown_house", GRASS_ORIGIN)).toBeNull();
    expect(placedCount(state)).toBe(0);
    expect(siteCount(state)).toBe(0);
  });

  it("leaves farm, fish, gathering, and slime assignment unchanged after a site is cleared", () => {
    const sim = new Simulation(createBareGameState());
    stockForHouses(sim.state);
    const beforeAccess = sim.state.fishingAccessPoints.length;
    const site = placeBuilding(sim.state, "brown_house", GRASS_ORIGIN);
    expect(site).not.toBeNull();
    expect(cancelConstructionSite(sim.state, site!.id)).toBe(true);

    expect(isValidFarmTerrain(sim.state, FARM_X, FARM_Y)).toBe(true);
    expect(designateFarmTile(sim.state, FARM_X, FARM_Y)).toBe(true);
    expect(isValidFarmTerrain(sim.state, GRASS_ORIGIN.x, GRASS_ORIGIN.y)).toBe(true);

    expect(sim.state.fishingAccessPoints.length).toBe(beforeAccess);
    expect(
      sim.state.fishingAccessPoints.every((point) =>
        sim.state.grid.isWalkable(point.landTile.x, point.landTile.y),
      ),
    ).toBe(true);
    expect(FISH.blue_darter.clueType).toBe("small_bubbles");
    expect(sim.commitFishing(GRASS_ORIGIN.x * TILE_SIZE, GRASS_ORIGIN.y * TILE_SIZE)).toBe(false);

    const first = createGatherTask(sim.state, "gather_wood");
    const extra = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(first?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(extra?.state).toBe("available");
    expect(sim.state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(sim.state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
  });
});
