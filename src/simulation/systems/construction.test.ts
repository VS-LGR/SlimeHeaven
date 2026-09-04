import { describe, expect, it } from "vitest";
import { findPath } from "@/src/world/pathfinding";
import { TILE_SIZE } from "@/src/world/constants";
import { GameState, createBareGameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS, createSlimeState, type SlimeState } from "../entities/SlimeState";
import {
  BASE_CONSTRUCTION_WORK_MS,
  SIMULATION_TICK_MS,
  WORK_DURATION_MS,
} from "../constants";
import { DEBUG_HUNGRY_SATIETY, workSpeedMultiplier } from "../needsConfig";
import { buildingById, entranceTile, footprintTiles } from "../data/buildings";
import { constructionProgress } from "../entities/ConstructionSite";
import {
  cancelConstructionSite,
  completeConstruction,
  evaluateBuildingPlacement,
  placeConstructionSite,
} from "./BuildingSystem";
import {
  assignAvailableTasks,
  canPerformTask,
  createConstructTask,
  createGatherTask,
  startWorking,
} from "./JobSystem";
import { designateFarmTile } from "./FarmSystem";
import { requiredCapabilitiesForTask } from "../slimeCapabilities";
import { isConstructionTask } from "../entities/Task";
import { TITO_AMBIENT_INTEREST } from "../ambientPersonality";

const BLUE_ORIGIN = { x: 5, y: 11 };
const BROWN_ORIGIN = { x: 7, y: 11 };

function stock(state: GameState, wood = 40, stone = 40): void {
  state.resources.wood = wood;
  state.resources.stone = stone;
}

function siteList(state: GameState) {
  return Object.values(state.constructionSites);
}

function buildingList(state: GameState) {
  return Object.values(state.buildings);
}

function constructTasks(state: GameState) {
  return Object.values(state.tasks).filter(
    (task) => isConstructionTask(task.type) && task.state !== "cancelled" && task.state !== "completed",
  );
}

function forceWorkingOnSite(state: GameState, siteId: string, slime: SlimeState): void {
  assignAvailableTasks(state);
  const site = state.constructionSites[siteId];
  const def = buildingById(site.buildingTypeId);
  const entrance = entranceTile({ x: site.tileX, y: site.tileY }, def);
  slime.tileX = entrance.x;
  slime.tileY = entrance.y;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (!task || !isConstructionTask(task.type)) {
    throw new Error("expected a construction assignment before forcing work");
  }
  task.state = "in_progress";
  task.assignedSlimeId = slime.id;
  site.assignedSlimeId = slime.id;
  site.status = "building";
  startWorking(slime, { x: site.tileX, y: site.tileY });
}

describe("construction 05.2", () => {
  it("keeps catalog costs on existing wood and stone only", () => {
    const blue = buildingById("small_blue_house");
    const brown = buildingById("brown_house");
    expect(blue.cost).toEqual({ wood: 8, stone: 2 });
    expect(brown.cost).toEqual({ wood: 6, stone: 4 });
    expect("food" in blue.cost).toBe(false);
    expect("food" in brown.cost).toBe(false);
  });

  it("gives Tito build and withholds it from Pingo and Momo", () => {
    const state = createBareGameState();
    expect(state.slimes[SLIME_IDS.TITO].capabilities).toContain("build");
    expect(state.slimes[SLIME_IDS.PINGO].capabilities).not.toContain("build");
    expect(state.slimes[SLIME_IDS.MOMO].capabilities).not.toContain("build");
  });

  it("requires the build capability on construction tasks, not slime IDs", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN);
    const task = constructTasks(state)[0];
    expect(site).toBeDefined();
    expect(task.requiredCapabilities).toEqual(["build"]);
    expect(requiredCapabilitiesForTask(task)).toEqual(["build"]);
    expect(canPerformTask(state.slimes[SLIME_IDS.TITO], task)).toBe(true);
    expect(canPerformTask(state.slimes[SLIME_IDS.PINGO], task)).toBe(false);
    expect(canPerformTask(state.slimes[SLIME_IDS.MOMO], task)).toBe(false);
    const unnamedBuilder = {
      ...state.slimes[SLIME_IDS.PINGO],
      id: "not_tito" as SlimeState["id"],
      capabilities: ["build"],
    };
    expect(unnamedBuilder.id).not.toBe(SLIME_IDS.TITO);
    expect(canPerformTask(unnamedBuilder, task)).toBe(true);
    const namedTitoWithoutBuild = {
      ...state.slimes[SLIME_IDS.TITO],
      capabilities: ["gathering", "construction"],
    };
    expect(namedTitoWithoutBuild.id).toBe(SLIME_IDS.TITO);
    expect(canPerformTask(namedTitoWithoutBuild, task)).toBe(false);
  });

  it("consumes exact catalog costs atomically and never goes negative", () => {
    const blueState = createBareGameState();
    stock(blueState, 8, 2);
    expect(placeConstructionSite(blueState, "small_blue_house", BLUE_ORIGIN)).not.toBeNull();
    expect(blueState.resources.wood).toBe(0);
    expect(blueState.resources.stone).toBe(0);
    expect(blueState.resources.wood).toBeGreaterThanOrEqual(0);
    expect(blueState.resources.stone).toBeGreaterThanOrEqual(0);

    const brownState = createBareGameState();
    stock(brownState, 6, 4);
    expect(placeConstructionSite(brownState, "brown_house", BROWN_ORIGIN)).not.toBeNull();
    expect(brownState.resources.wood).toBe(0);
    expect(brownState.resources.stone).toBe(0);
  });

  it("rejects insufficient wood or stone without consuming anything", () => {
    const noWood = createBareGameState();
    stock(noWood, 7, 10);
    const woodEval = evaluateBuildingPlacement(noWood, "small_blue_house", BLUE_ORIGIN);
    expect(woodEval.valid).toBe(false);
    expect(woodEval.reasons).toContain("insufficient_wood");
    expect(placeConstructionSite(noWood, "small_blue_house", BLUE_ORIGIN)).toBeNull();
    expect(noWood.resources.wood).toBe(7);
    expect(noWood.resources.stone).toBe(10);
    expect(siteList(noWood)).toHaveLength(0);
    expect(buildingList(noWood)).toHaveLength(0);

    const noStone = createBareGameState();
    stock(noStone, 20, 1);
    const stoneEval = evaluateBuildingPlacement(noStone, "brown_house", BROWN_ORIGIN);
    expect(stoneEval.valid).toBe(false);
    expect(stoneEval.reasons).toContain("insufficient_stone");
    expect(placeConstructionSite(noStone, "brown_house", BROWN_ORIGIN)).toBeNull();
    expect(noStone.resources.wood).toBe(20);
    expect(noStone.resources.stone).toBe(1);
  });

  it("creates one site, one task, no building, and ignores a duplicate confirmation", () => {
    const state = createBareGameState();
    stock(state, 16, 4);
    const first = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN);
    expect(first).not.toBeNull();
    expect(siteList(state)).toHaveLength(1);
    expect(buildingList(state)).toHaveLength(0);
    expect(constructTasks(state)).toHaveLength(1);
    expect(state.resources.wood).toBe(8);
    expect(state.resources.stone).toBe(2);

    const duplicate = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN);
    expect(duplicate).toBeNull();
    expect(siteList(state)).toHaveLength(1);
    expect(constructTasks(state)).toHaveLength(1);
    expect(buildingList(state)).toHaveLength(0);
    expect(state.resources.wood).toBe(8);
    expect(state.resources.stone).toBe(2);
  });

  it("blocks the 2×2 footprint immediately while keeping the entrance walkable and routing around it", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN);
    expect(site).not.toBeNull();
    const def = buildingById("small_blue_house");
    for (const tile of footprintTiles(BLUE_ORIGIN, def)) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(false);
    }
    const entrance = entranceTile(BLUE_ORIGIN, def);
    expect(entrance).toEqual({ x: 5, y: 13 });
    expect(state.grid.isWalkable(entrance.x, entrance.y)).toBe(true);
    const around = findPath(state.grid, { x: 4, y: 11 }, { x: 7, y: 11 });
    expect(around).not.toBeNull();
    for (const step of around ?? []) {
      expect(state.constructionSiteAt(step.x, step.y)).toBeUndefined();
    }
    expect(findPath(state.grid, { x: 4, y: 11 }, { x: 5, y: 11 })).toBeNull();
    expect(constructTasks(state)[0].workTile).toEqual(entrance);
  });

  it("assigns only a build-capable slime and keeps a single builder per site", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "brown_house", BROWN_ORIGIN);
    expect(site).not.toBeNull();
    const extra: SlimeState = createSlimeState(
      {
        id: "slime_extra" as SlimeState["id"],
        name: "Extra",
        x: 11,
        y: 5,
        wanderOffsetTicks: 0,
        attributes: { technique: 1, strength: 1, instinct: 1, luck: 1 },
        interest: TITO_AMBIENT_INTEREST,
        capabilities: ["build"],
      },
      0,
    );
    state.slimes[extra.id] = extra;
    assignAvailableTasks(state);
    const task = constructTasks(state)[0];
    expect(task.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
    expect(extra.currentTaskId).toBeUndefined();
    expect(createConstructTask(state, site!)).toBeUndefined();
    expect(constructTasks(state)).toHaveLength(1);
  });

  it("accumulates construction work from simulation ticks, including the hunger multiplier", () => {
    const fed = createBareGameState();
    stock(fed);
    const fedSite = placeConstructionSite(fed, "small_blue_house", BLUE_ORIGIN)!;
    const tito = fed.slimes[SLIME_IDS.TITO];
    forceWorkingOnSite(fed, fedSite.id, tito);
    const fedDelta = SIMULATION_TICK_MS * workSpeedMultiplier(tito.satiety);
    expect(fedDelta).toBe(SIMULATION_TICK_MS);
    tito.workElapsedMs = WORK_DURATION_MS * 8;
    const before = fed.constructionSites[fedSite.id].workCompletedMs;
    const simFed = new Simulation(fed);
    simFed.tick();
    const afterOne = fed.constructionSites[fedSite.id];
    expect(afterOne.workCompletedMs).toBeCloseTo(before + fedDelta);
    expect(afterOne.workCompletedMs).toBeLessThan(BASE_CONSTRUCTION_WORK_MS);
    expect(tito.state).toBe("working");
    expect(tito.carriedResource).toBeUndefined();

    const ticksNeeded = Math.ceil(BASE_CONSTRUCTION_WORK_MS / fedDelta);
    for (let i = 0; i < ticksNeeded; i += 1) {
      simFed.tick();
    }
    expect(siteList(fed)).toHaveLength(0);
    expect(buildingList(fed)).toHaveLength(1);
    expect(["idle", "ambient", "moving_to_ambient"]).toContain(tito.state);
    expect(tito.carriedResource).toBeUndefined();
    expect(tito.state).not.toBe("carrying_to_storage");
    expect(tito.state).not.toBe("delivering");

    const hungry = createBareGameState();
    stock(hungry);
    const hungrySite = placeConstructionSite(hungry, "brown_house", BROWN_ORIGIN)!;
    const hungryTito = hungry.slimes[SLIME_IDS.TITO];
    hungryTito.satiety = DEBUG_HUNGRY_SATIETY;
    forceWorkingOnSite(hungry, hungrySite.id, hungryTito);
    const hungryDelta = SIMULATION_TICK_MS * workSpeedMultiplier(hungryTito.satiety);
    expect(hungryDelta).toBeLessThan(SIMULATION_TICK_MS);
    const simHungry = new Simulation(hungry);
    simHungry.tick();
    expect(hungry.constructionSites[hungrySite.id].workCompletedMs).toBeCloseTo(hungryDelta);
    const hungryTicks = Math.ceil(BASE_CONSTRUCTION_WORK_MS / hungryDelta);
    expect(hungryTicks).toBeGreaterThan(ticksNeeded);
  });

  it("completes from simulation even if rendering is absent, without overshooting or duplicating", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN)!;
    const tito = state.slimes[SLIME_IDS.TITO];
    forceWorkingOnSite(state, site.id, tito);
    site.workCompletedMs = BASE_CONSTRUCTION_WORK_MS;
    const first = completeConstruction(state, site.id);
    expect(first).not.toBeNull();
    expect(buildingList(state)).toHaveLength(1);
    expect(siteList(state)).toHaveLength(0);
    expect(constructTasks(state)).toHaveLength(0);
    expect(tito.currentTaskId).toBeUndefined();
    expect(tito.carriedResource).toBeUndefined();
    expect(first?.typeId).toBe("small_blue_house");
    expect(first?.tileX).toBe(BLUE_ORIGIN.x);
    expect(first?.tileY).toBe(BLUE_ORIGIN.y);
    const def = buildingById("small_blue_house");
    expect(entranceTile({ x: first!.tileX, y: first!.tileY }, def)).toEqual({ x: 5, y: 13 });
    for (const tile of footprintTiles(BLUE_ORIGIN, def)) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(false);
      expect(state.buildingAt(tile.x, tile.y)?.id).toBe(first?.id);
    }
    expect(completeConstruction(state, site.id)).toBeNull();
    expect(buildingList(state)).toHaveLength(1);
    expect(constructionProgress({ ...site, workCompletedMs: 9000, workRequiredMs: 5000 })).toBe(1);
  });

  it("keeps collision continuous during site-to-building conversion", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "brown_house", BROWN_ORIGIN)!;
    const def = buildingById("brown_house");
    const blocked = footprintTiles(BROWN_ORIGIN, def).map((tile) => ({
      ...tile,
      walkable: state.grid.isWalkable(tile.x, tile.y),
    }));
    expect(blocked.every((tile) => tile.walkable === false)).toBe(true);
    site.workCompletedMs = site.workRequiredMs;
    completeConstruction(state, site.id);
    for (const tile of footprintTiles(BROWN_ORIGIN, def)) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(false);
    }
  });

  it("cancels an incomplete site once, refunds once, and never refunds a completed building", () => {
    const state = createBareGameState();
    stock(state, 8, 2);
    const site = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN)!;
    assignAvailableTasks(state);
    expect(state.slimes[SLIME_IDS.TITO].currentTaskId).toBeDefined();
    expect(cancelConstructionSite(state, site.id)).toBe(true);
    expect(siteList(state)).toHaveLength(0);
    expect(constructTasks(state)).toHaveLength(0);
    expect(buildingList(state)).toHaveLength(0);
    expect(state.slimes[SLIME_IDS.TITO].currentTaskId).toBeUndefined();
    expect(state.resources.wood).toBe(8);
    expect(state.resources.stone).toBe(2);
    for (const tile of footprintTiles(BLUE_ORIGIN, buildingById("small_blue_house"))) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(true);
    }
    expect(cancelConstructionSite(state, site.id)).toBe(false);
    expect(state.resources.wood).toBe(8);
    expect(state.resources.stone).toBe(2);

    const done = createBareGameState();
    stock(done, 8, 2);
    const built = placeConstructionSite(done, "small_blue_house", BLUE_ORIGIN)!;
    built.workCompletedMs = built.workRequiredMs;
    completeConstruction(done, built.id);
    const woodAfter = done.resources.wood;
    const stoneAfter = done.resources.stone;
    expect(cancelConstructionSite(done, built.id)).toBe(false);
    expect(done.resources.wood).toBe(woodAfter);
    expect(done.resources.stone).toBe(stoneAfter);
    expect(buildingList(done)).toHaveLength(1);
  });

  it("leaves gathering, farming, fishing, empty capability jobs, and spatial rules intact", () => {
    const sim = new Simulation(createBareGameState());
    stock(sim.state);
    expect(requiredCapabilitiesForTask({ type: "gather_wood", requiredCapabilities: [] })).toEqual([]);
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    const gather = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(gather?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    const spatial = evaluateBuildingPlacement(sim.state, "small_blue_house", { x: 14, y: 8 });
    expect(spatial.reasons).toContain("water");
    expect(sim.commitFishing(5 * TILE_SIZE, 11 * TILE_SIZE)).toBe(false);
  });
});
