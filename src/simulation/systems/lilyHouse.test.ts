import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { findPath } from "@/src/world/pathfinding";
import { GameState, createBareGameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS, type SlimeState } from "../entities/SlimeState";
import { BASE_CONSTRUCTION_WORK_MS, SIMULATION_TICKS_PER_SECOND } from "../constants";
import { SATIETY_INITIAL } from "../needsConfig";
import {
  BUILDINGS,
  buildingById,
  buildingCostBundle,
  buildingTextureKey,
  buildingVisualLayout,
  entranceTile,
  footprintTiles,
} from "../data/buildings";
import { RESOURCE_IDS } from "../resources";
import { STARTING_HOMES } from "../data/startingHomes";
import {
  constructionSiteForResident,
  homeDefinitionForResident,
  isResidentReadyForMoveIn,
  isUniqueHomePlanUnlocked,
  placedHomeForResident,
  playerBuildableBuildingTypes,
  residentHomeStatus,
  uniqueHomeConstructionDebugLines,
} from "../residentHomes";
import {
  cancelConstructionSite,
  completeConstruction,
  evaluateBuildingPlacement,
  placeConstructionSite,
} from "./BuildingSystem";
import {
  assignAvailableTasks,
  canPerformTask,
  createGatherTask,
  startWorking,
} from "./JobSystem";
import { designateFarmTile } from "./FarmSystem";
import { inviteVisitor, spawnLilyVisitor } from "./VisitorSystem";
import { isJobAssignable } from "./slimeAvailability";
import { isConstructionTask } from "../entities/Task";
import { selectInventoryStockModel } from "@/src/ui/hud/hudSelectors";
import { FISH } from "../data/fish";

const LILY_ORIGIN = { x: 5, y: 11 };
const LILY_RECIPE = { wood: 10, stone: 4, vine: 3, foliage: 4, shell: 1 } as const;

function inviteLily(state: GameState): void {
  const spawn = spawnLilyVisitor(state);
  expect(spawn.ok).toBe(true);
  const invite = inviteVisitor(state, SLIME_IDS.LILY);
  expect(invite.ok).toBe(true);
}

function stockLilyRecipe(state: GameState): void {
  state.resources.wood = LILY_RECIPE.wood;
  state.resources.stone = LILY_RECIPE.stone;
  state.resources.vine = LILY_RECIPE.vine;
  state.resources.foliage = LILY_RECIPE.foliage;
  state.resources.shell = LILY_RECIPE.shell;
  state.resources.copperOre = 7;
  state.resources.coral = 5;
}

function snapshotHomes(state: GameState) {
  return STARTING_HOMES.map((spec) => {
    const home = placedHomeForResident(state, spec.residentTypeId);
    return {
      residentTypeId: spec.residentTypeId,
      buildingId: home?.id,
      typeId: home?.typeId,
      tileX: home?.tileX,
      tileY: home?.tileY,
    };
  });
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

describe("Lily unique house construction 05.6B", () => {
  it("keeps the plan unavailable before invitation and unlocks exactly one plan after invite", () => {
    const before = new GameState();
    expect(residentHomeStatus(before, "lily")).toBe("locked");
    expect(isUniqueHomePlanUnlocked(before, "lily")).toBe(false);
    expect(playerBuildableBuildingTypes(before)).toEqual([]);
    stockLilyRecipe(before);
    expect(placeConstructionSite(before, "lily_house", LILY_ORIGIN)).toBeNull();
    expect(evaluateBuildingPlacement(before, "lily_house", LILY_ORIGIN).reasons).toContain(
      "unique_home_locked",
    );
    expect(before.resources.wood).toBe(10);
    expect(Object.keys(before.constructionSites)).toHaveLength(0);

    spawnLilyVisitor(before);
    expect(playerBuildableBuildingTypes(before)).toEqual([]);
    expect(placeConstructionSite(before, "lily_house", LILY_ORIGIN)).toBeNull();

    inviteVisitor(before, SLIME_IDS.LILY);
    expect(residentHomeStatus(before, "lily")).toBe("available");
    expect(isUniqueHomePlanUnlocked(before, "lily")).toBe(true);
    expect(playerBuildableBuildingTypes(before)).toEqual(["lily_house"]);
  });

  it("uses the final Lily house assets, shared 2×2 footprint, and the exact five-resource recipe", () => {
    const def = buildingById("lily_house");
    expect(def.assetPath).toBe("/assets/world/houses/Lily_House.png");
    expect(def.blueprintPath).toBe("/assets/world/houses/Lily_House_BP.png");
    expect(def.cost).toEqual(LILY_RECIPE);
    expect(buildingCostBundle(def)).toEqual(LILY_RECIPE);
    expect(def.cost.copperOre).toBeUndefined();
    expect(def.cost.coral).toBeUndefined();
    expect(def.cost.food).toBeUndefined();
    expect(def.footprint).toEqual({ width: 2, height: 2 });
    expect(def.entrance).toEqual({ localTileX: 0, localTileY: 2, facing: "south" });
    expect(buildingTextureKey("lily_house", "construction")).toBe(def.blueprintKey);
    expect(buildingTextureKey("lily_house", "completed")).toBe(def.assetKey);
    const preview = buildingVisualLayout(LILY_ORIGIN, "lily_house", "preview");
    const site = buildingVisualLayout(LILY_ORIGIN, "lily_house", "construction");
    const completed = buildingVisualLayout(LILY_ORIGIN, "lily_house", "completed");
    expect(preview.x).toBe(site.x);
    expect(preview.y).toBe(site.y);
    expect(completed.x).toBe(site.x);
    expect(completed.y).toBe(site.y);
    expect(preview.originX).toBe(site.originX);
    expect(completed.originY).toBe(site.originY);
    expect(entranceTile(LILY_ORIGIN, def)).toEqual({ x: 5, y: 13 });
  });

  it("rejects missing any required material or invalid terrain without consuming stock", () => {
    const keys = ["wood", "stone", "vine", "foliage", "shell"] as const;
    for (const missing of keys) {
      const state = new GameState();
      inviteLily(state);
      stockLilyRecipe(state);
      state.resources[missing] = 0;
      const evaluation = evaluateBuildingPlacement(state, "lily_house", LILY_ORIGIN);
      expect(evaluation.valid).toBe(false);
      expect(evaluation.reasons.some((reason) => reason.startsWith("insufficient_"))).toBe(true);
      expect(placeConstructionSite(state, "lily_house", LILY_ORIGIN)).toBeNull();
      expect(state.resources[missing]).toBe(0);
      for (const key of keys) {
        if (key !== missing) {
          expect(state.resources[key]).toBe(LILY_RECIPE[key]);
        }
      }
      expect(state.resources.copperOre).toBe(7);
      expect(state.resources.coral).toBe(5);
      expect(Object.keys(state.constructionSites)).toHaveLength(0);
    }

    const water = new GameState();
    inviteLily(water);
    stockLilyRecipe(water);
    expect(placeConstructionSite(water, "lily_house", { x: 14, y: 8 })).toBeNull();
    expect(evaluateBuildingPlacement(water, "lily_house", { x: 14, y: 8 }).reasons).toContain("water");
    expect(water.resources.wood).toBe(10);
    expect(water.resources.shell).toBe(1);
    expect(Object.keys(water.constructionSites)).toHaveLength(0);
  });

  it("consumes the complete recipe exactly once on valid placement and never double-charges", () => {
    const state = new GameState();
    inviteLily(state);
    stockLilyRecipe(state);
    state.discoveredResources.wood = true;
    state.discoveredResources.stone = true;
    state.discoveredResources.vine = true;
    state.discoveredResources.foliage = true;
    state.discoveredResources.shell = true;
    const first = placeConstructionSite(state, "lily_house", LILY_ORIGIN);
    expect(first).not.toBeNull();
    expect(state.resources).toMatchObject({
      wood: 0,
      stone: 0,
      vine: 0,
      foliage: 0,
      shell: 0,
      copperOre: 7,
      coral: 5,
    });
    expect(selectInventoryStockModel({ ...state.resources, food: state.resources.food })).toMatchObject({
      wood: 0,
      stone: 0,
      vine: 0,
      foliage: 0,
      shell: 0,
      copperOre: 7,
      coral: 5,
    });
    expect(state.discoveredResources.wood).toBe(true);
    expect(state.discoveredResources.shell).toBe(true);
    expect(playerBuildableBuildingTypes(state)).toEqual([]);
    expect(residentHomeStatus(state, "lily")).toBe("under_construction");

    const duplicate = placeConstructionSite(state, "lily_house", { x: 7, y: 11 });
    expect(duplicate).toBeNull();
    expect(evaluateBuildingPlacement(state, "lily_house", { x: 7, y: 11 }).reasons).toContain(
      "unique_home_site",
    );
    expect(Object.keys(state.constructionSites)).toHaveLength(1);
    expect(state.resources.wood).toBe(0);
    expect(state.resources.shell).toBe(0);
  });

  it("cancels once with a full refund, releases the site, and unlocks the plan again", () => {
    const state = new GameState();
    inviteLily(state);
    stockLilyRecipe(state);
    const site = placeConstructionSite(state, "lily_house", LILY_ORIGIN);
    expect(site).not.toBeNull();
    assignAvailableTasks(state);
    expect(cancelConstructionSite(state, site!.id)).toBe(true);
    expect(Object.keys(state.constructionSites)).toHaveLength(0);
    expect(constructionSiteForResident(state, "lily")).toBeUndefined();
    expect(state.resources).toMatchObject(LILY_RECIPE);
    expect(state.slimes[SLIME_IDS.LILY].residencyStatus).toBe("invited_waiting_for_house");
    expect(residentHomeStatus(state, "lily")).toBe("available");
    expect(playerBuildableBuildingTypes(state)).toEqual(["lily_house"]);
    for (const tile of footprintTiles(LILY_ORIGIN, buildingById("lily_house"))) {
      expect(state.grid.isWalkable(tile.x, tile.y)).toBe(true);
    }
    expect(cancelConstructionSite(state, site!.id)).toBe(false);
    expect(state.resources.wood).toBe(10);
    expect(placeConstructionSite(state, "lily_house", LILY_ORIGIN)).not.toBeNull();
  });

  it("assigns a build-capable slime, keeps Lily ineligible, and lets the builder path to the work tile", () => {
    const sim = new Simulation();
    sim.setClockPreset("midday");
    inviteLily(sim.state);
    stockLilyRecipe(sim.state);
    const site = placeConstructionSite(sim.state, "lily_house", LILY_ORIGIN);
    expect(site).not.toBeNull();
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    const task = Object.values(sim.state.tasks).find(
      (entry) => isConstructionTask(entry.type) && entry.constructionSiteId === site!.id,
    );
    expect(task?.requiredCapabilities).toEqual(["build"]);
    expect(canPerformTask(tito, task!)).toBe(true);
    expect(canPerformTask(lily, task!)).toBe(false);
    expect(lily.capabilities).toEqual([]);
    expect(isJobAssignable(sim.state, lily)).toBe(false);

    const unnamed = { ...tito, id: "not_tito" as SlimeState["id"], capabilities: ["build" as const] };
    expect(unnamed.id).not.toBe(SLIME_IDS.TITO);
    expect(canPerformTask(unnamed, task!)).toBe(true);

    const def = buildingById("lily_house");
    const work = entranceTile(LILY_ORIGIN, def);
    expect(task?.workTile).toEqual(work);
    const path = findPath(sim.state.grid, { x: tito.tileX, y: tito.tileY }, work);
    expect(path).not.toBeNull();
    const footprint = new Set(
      footprintTiles(LILY_ORIGIN, def).map((tile) => `${tile.x},${tile.y}`),
    );
    for (const step of path ?? []) {
      expect(footprint.has(`${step.x},${step.y}`)).toBe(false);
      expect(sim.state.grid.isWalkable(step.x, step.y)).toBe(true);
    }

    assignAvailableTasks(sim.state);
    expect(task?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(lily.currentTaskId).toBeUndefined();
    expect(sim.state.slimes[SLIME_IDS.PINGO].currentTaskId).toBeUndefined();
    expect(sim.state.slimes[SLIME_IDS.MOMO].currentTaskId).toBeUndefined();
  });

  it("completes through the existing lifecycle, associates the house with Lily, and stays ready for move-in", () => {
    const sim = new Simulation();
    sim.setClockPreset("midday");
    inviteLily(sim.state);
    stockLilyRecipe(sim.state);
    const homesBefore = snapshotHomes(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    const satiety = lily.satiety;
    const site = placeConstructionSite(sim.state, "lily_house", LILY_ORIGIN)!;
    const tito = sim.state.slimes[SLIME_IDS.TITO];
    forceWorkingOnSite(sim.state, site.id, tito);
    expect(site.status).toBe("building");
    site.workCompletedMs = BASE_CONSTRUCTION_WORK_MS;
    const built = completeConstruction(sim.state, site.id);
    expect(built).not.toBeNull();
    expect(built?.typeId).toBe("lily_house");
    expect(Object.keys(sim.state.constructionSites)).toHaveLength(0);
    expect(placedHomeForResident(sim.state, "lily")?.id).toBe(built?.id);
    expect(residentHomeStatus(sim.state, "lily")).toBe("completed");
    expect(isResidentReadyForMoveIn(sim.state, "lily")).toBe(true);
    expect(lily.residencyStatus).toBe("invited_waiting_for_house");
    expect(lily.capabilities).toEqual([]);
    expect(isJobAssignable(sim.state, lily)).toBe(false);
    expect(lily.satiety).toBe(satiety);
    expect(playerBuildableBuildingTypes(sim.state)).toEqual([]);
    expect(placeConstructionSite(sim.state, "lily_house", { x: 7, y: 11 })).toBeNull();
    expect(evaluateBuildingPlacement(sim.state, "lily_house", { x: 7, y: 11 }).reasons).toContain(
      "unique_home_completed",
    );

    const def = buildingById("lily_house");
    expect(buildingTextureKey(built!.typeId, "completed")).toBe(def.assetKey);
    expect(entranceTile({ x: built!.tileX, y: built!.tileY }, def)).toEqual({ x: 5, y: 13 });
    for (const tile of footprintTiles(LILY_ORIGIN, def)) {
      expect(sim.state.grid.isWalkable(tile.x, tile.y)).toBe(false);
      expect(sim.state.buildingAt(tile.x, tile.y)?.id).toBe(built?.id);
    }

    sim.tick();
    expect(lily.residencyStatus).toBe("invited_waiting_for_house");
    expect(lily.satiety).toBe(satiety);
    expect(lily.currentTaskId).toBeUndefined();
    expect(snapshotHomes(sim.state)).toEqual(homesBefore);

    const debug = uniqueHomeConstructionDebugLines(sim.state, "lily");
    expect(debug).toEqual(
      expect.arrayContaining([
        "invitationState: invited_waiting_for_house",
        "housePlan: unlocked",
        "homeStatus: completed",
        "readyForMoveIn: true",
        `lilyHomeAssociation: ${built!.id}`,
      ]),
    );
    expect(debug.join("\n")).not.toMatch(/lily_already_resident/);
  });

  it("leaves generic construction, starting homes, and gathering loops unchanged", () => {
    const bare = createBareGameState();
    bare.resources.wood = 7;
    bare.resources.stone = 3;
    expect(placeConstructionSite(bare, "green_house", LILY_ORIGIN)).not.toBeNull();
    expect(bare.resources.wood).toBe(0);
    expect(bare.resources.stone).toBe(0);

    const sim = new Simulation();
    expect(SIMULATION_TICKS_PER_SECOND).toBe(4);
    expect(Object.keys(sim.state.buildings)).toHaveLength(3);
    expect(homeDefinitionForResident("pingo")?.id).toBe("small_blue_house");
    expect(placedHomeForResident(sim.state, "pingo")?.typeId).toBe("small_blue_house");
    expect(placedHomeForResident(sim.state, "momo")?.typeId).toBe("green_house");
    expect(placedHomeForResident(sim.state, "tito")?.typeId).toBe("brown_house");
    expect(designateFarmTile(sim.state, 2, 12)).toBe(true);
    const gather = createGatherTask(sim.state, "gather_wood");
    assignAvailableTasks(sim.state);
    expect(gather?.assignedSlimeId).toBe(SLIME_IDS.TITO);
    expect(sim.commitFishing(5 * 32, 11 * 32)).toBe(false);
    expect(RESOURCE_IDS.COPPER_ORE).toBe("copperOre");
    expect(RESOURCE_IDS.CORAL).toBe("coral");
    expect(FISH.blue_darter).toBeDefined();
    expect(BUILDINGS.lily_house.residentHome?.startingHome).toBe(false);

    const inventory = readFileSync(resolve("src/ui/hud/inventoryCatalog.ts"), "utf8");
    expect(inventory).not.toMatch(/lily_house|Lily_House/);
    const toolbar = readFileSync(resolve("src/ui/hud/ActionToolbar.tsx"), "utf8");
    expect(toolbar).toMatch(/formatBuildingCost/);
    expect(toolbar).toMatch(/Lily's House|availableBuildingTypeIds/);
    const renderer = readFileSync(resolve("src/game/render/buildings/BuildingRenderer.ts"), "utf8");
    expect(renderer).not.toMatch(/lily_house|slime_lily/);
  });

  it("does not convert Lily into a resident when the house is only complete", () => {
    const state = new GameState();
    inviteLily(state);
    stockLilyRecipe(state);
    const site = placeConstructionSite(state, "lily_house", LILY_ORIGIN)!;
    site.workCompletedMs = site.workRequiredMs;
    completeConstruction(state, site.id);
    const lily = state.slimes[SLIME_IDS.LILY];
    expect(lily.residencyStatus).not.toBe("resident");
    expect(lily.residencyStatus).not.toBe("moving_in");
    expect(lily.satiety).toBe(SATIETY_INITIAL);
    expect(isResidentReadyForMoveIn(state, "lily")).toBe(true);
    expect(uniqueHomeConstructionDebugLines(state, "lily")).toEqual(
      expect.arrayContaining(["constructionState: complete", "buildingProgress: 1.00"]),
    );
  });
});
