import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { findPath } from "@/src/world/pathfinding";
import { GameState, createBareGameState } from "./GameState";
import { Simulation } from "./Simulation";
import { SLIME_IDS } from "./entities/SlimeState";
import { STORAGE_TILE, SIMULATION_TICKS_PER_SECOND, BASE_CONSTRUCTION_WORK_MS } from "./constants";
import { SATIETY_INITIAL } from "./needsConfig";
import {
  BUILDINGS,
  buildingById,
  entranceTile,
  footprintTiles,
} from "./data/buildings";
import { residentTypeIdForSlime } from "./data/residents";
import { STARTING_HOMES } from "./data/startingHomes";
import {
  constructionSiteForResident,
  homeDefinitionForResident,
  placedHomeForResident,
  playerBuildableBuildingTypes,
  residentHomeStatus,
} from "./residentHomes";
import {
  cancelConstructionSite,
  completeConstruction,
  evaluateBuildingPlacement,
  initializeStartingHomes,
  placeConstructionSite,
} from "./systems/BuildingSystem";
import { assignAvailableTasks, createGatherTask, startWorking } from "./systems/JobSystem";
import { designateFarmTile } from "./systems/FarmSystem";
import { isConstructionTask } from "./entities/Task";

function stock(state: GameState, wood = 40, stone = 40): void {
  state.resources.wood = wood;
  state.resources.stone = stone;
}

describe("unique resident homes 05.3A", () => {
  it("maps each starting resident to exactly one unique home definition", () => {
    expect(homeDefinitionForResident("pingo")?.id).toBe("small_blue_house");
    expect(homeDefinitionForResident("tito")?.id).toBe("brown_house");
    expect(homeDefinitionForResident("momo")?.id).toBe("green_house");
    expect(homeDefinitionForResident("lily")).toBeUndefined();
    const claimed = Object.values(BUILDINGS)
      .map((def) => def.residentHome?.residentTypeId)
      .filter((id): id is NonNullable<typeof id> => Boolean(id));
    expect(claimed.sort()).toEqual(["momo", "pingo", "tito"]);
    expect(new Set(claimed).size).toBe(claimed.length);
    for (const def of Object.values(BUILDINGS)) {
      expect(def.residentHome?.unique).toBe(true);
      expect(def.residentHome?.startingHome).toBe(true);
    }
  });

  it("seeds three completed homes with no sites, costs, or duplicates", () => {
    const state = new GameState();
    expect(Object.keys(state.buildings)).toHaveLength(3);
    expect(Object.keys(state.constructionSites)).toHaveLength(0);
    expect(state.resources.wood).toBe(0);
    expect(state.resources.stone).toBe(0);
    expect(residentHomeStatus(state, "pingo")).toBe("completed");
    expect(residentHomeStatus(state, "momo")).toBe("completed");
    expect(residentHomeStatus(state, "tito")).toBe("completed");
    initializeStartingHomes(state);
    expect(Object.keys(state.buildings)).toHaveLength(3);
    expect(playerBuildableBuildingTypes(state)).toEqual([]);
  });

  it("validates authored starting footprints, entrances, and storage reachability", () => {
    const state = new GameState();
    for (const spec of STARTING_HOMES) {
      const def = buildingById(spec.buildingTypeId);
      const footprint = footprintTiles(spec.origin, def);
      expect(footprint).toHaveLength(4);
      for (const tile of footprint) {
        expect(state.grid.inBounds(tile.x, tile.y)).toBe(true);
        expect(state.grid.isWalkable(tile.x, tile.y)).toBe(false);
        expect(state.buildingAt(tile.x, tile.y)?.typeId).toBe(spec.buildingTypeId);
      }
      const entrance = entranceTile(spec.origin, def);
      expect(state.grid.inBounds(entrance.x, entrance.y)).toBe(true);
      expect(state.grid.isWalkable(entrance.x, entrance.y)).toBe(true);
      expect(state.buildingAt(entrance.x, entrance.y)).toBeUndefined();
      expect(findPath(state.grid, STORAGE_TILE, entrance)).not.toBeNull();
    }
  });

  it("rejects duplicate unique homes and sites in simulation", () => {
    const state = new GameState();
    stock(state);
    const pingo = STARTING_HOMES.find((spec) => spec.residentTypeId === "pingo")!;
    const tito = STARTING_HOMES.find((spec) => spec.residentTypeId === "tito")!;
    const momo = STARTING_HOMES.find((spec) => spec.residentTypeId === "momo")!;
    expect(placeConstructionSite(state, "small_blue_house", { x: 5, y: 11 })).toBeNull();
    expect(evaluateBuildingPlacement(state, "small_blue_house", { x: 5, y: 11 }).reasons).toContain(
      "unique_home_completed",
    );
    expect(placeConstructionSite(state, "brown_house", { x: 5, y: 11 })).toBeNull();
    expect(placeConstructionSite(state, "green_house", { x: 5, y: 11 })).toBeNull();
    expect(placedHomeForResident(state, "pingo")?.tileX).toBe(pingo.origin.x);
    expect(placedHomeForResident(state, "tito")?.tileX).toBe(tito.origin.x);
    expect(placedHomeForResident(state, "momo")?.tileX).toBe(momo.origin.x);
    expect(constructionSiteForResident(state, "pingo")).toBeUndefined();
  });

  it("completes a unique house through the existing construction path on a bare fixture", () => {
    const state = createBareGameState();
    stock(state);
    expect(residentHomeStatus(state, "momo")).toBe("available");
    const origin = { x: 5, y: 11 };
    const site = placeConstructionSite(state, "green_house", origin);
    expect(site).not.toBeNull();
    expect(residentHomeStatus(state, "momo")).toBe("under_construction");
    expect(placeConstructionSite(state, "green_house", { x: 7, y: 11 })).toBeNull();
    const tito = state.slimes[SLIME_IDS.TITO];
    assignAvailableTasks(state);
    const entrance = entranceTile(origin, buildingById("green_house"));
    tito.tileX = entrance.x;
    tito.tileY = entrance.y;
    tito.path = [];
    const task = tito.currentTaskId ? state.tasks[tito.currentTaskId] : undefined;
    expect(task && isConstructionTask(task.type)).toBe(true);
    if (task) {
      task.state = "in_progress";
      site!.status = "building";
      site!.assignedSlimeId = tito.id;
      startWorking(tito, origin);
    }
    site!.workCompletedMs = BASE_CONSTRUCTION_WORK_MS;
    const built = completeConstruction(state, site!.id);
    expect(built).not.toBeNull();
    expect(Object.values(state.buildings)).toHaveLength(1);
    expect(Object.keys(state.constructionSites)).toHaveLength(0);
    expect(residentHomeStatus(state, "momo")).toBe("completed");
    expect(cancelConstructionSite(state, site!.id)).toBe(false);
  });

  it("keeps cancellation available for a unique site that has not completed", () => {
    const state = createBareGameState();
    stock(state, 7, 3);
    const site = placeConstructionSite(state, "green_house", { x: 5, y: 11 });
    expect(site).not.toBeNull();
    expect(cancelConstructionSite(state, site!.id)).toBe(true);
    expect(residentHomeStatus(state, "momo")).toBe("available");
    expect(state.resources.wood).toBe(7);
    expect(state.resources.stone).toBe(3);
    expect(placeConstructionSite(state, "green_house", { x: 5, y: 11 })).not.toBeNull();
  });

  it("leaves jobs, needs, and 4 TPS update unchanged", () => {
    const sim = new Simulation();
    expect(SIMULATION_TICKS_PER_SECOND).toBe(4);
    expect(sim.state.slimes[SLIME_IDS.PINGO].capabilities).toEqual(["fishing", "exploration"]);
    expect(sim.state.slimes[SLIME_IDS.MOMO].capabilities).toEqual(["farming"]);
    expect(sim.state.slimes[SLIME_IDS.TITO].capabilities).toEqual(["gathering", "construction", "build"]);
    expect(sim.state.slimes[SLIME_IDS.PINGO].satiety).toBe(SATIETY_INITIAL);
    expect(sim.state.slimes[SLIME_IDS.PINGO].residencyStatus).toBe("resident");
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    const gather = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(gather?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    sim.update(250);
    expect(sim.tickCount).toBe(1);
    expect(residentTypeIdForSlime(SLIME_IDS.PINGO)).toBe("pingo");
  });

  it("does not hardcode Momo in the building renderer and keeps HUD empty when owned", () => {
    const renderer = readFileSync(resolve("src/game/render/buildings/BuildingRenderer.ts"), "utf8");
    expect(renderer).not.toMatch(/green_house/);
    expect(renderer).not.toMatch(/slime_momo/);
    expect(renderer).toMatch(/building\.typeId/);
    const hud = readFileSync(resolve("src/ui/hud/ActionToolbar.tsx"), "utf8");
    expect(hud).toMatch(/No building plans available/);
    expect(hud).toMatch(/availableBuildingTypeIds/);
    const state = new GameState();
    state.warnOnce("missing-building-texture-green_house", "missing");
    expect(Object.keys(state.buildings)).toHaveLength(3);
    expect(state.grid.isWalkable(8, 4)).toBe(false);
  });
});
