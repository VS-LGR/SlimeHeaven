import { describe, expect, it } from "vitest";
import { GameState, createBareGameState } from "./GameState";
import { Simulation } from "./Simulation";
import { SLIME_IDS } from "./entities/SlimeState";
import { BASE_CONSTRUCTION_WORK_MS, SIMULATION_TICK_MS } from "./constants";
import { buildingById, entranceTile } from "./data/buildings";
import { placeConstructionSite } from "./systems/BuildingSystem";
import { assignAvailableTasks, startWorking } from "./systems/JobSystem";
import { isConstructionTask } from "./entities/Task";

const BLUE_ORIGIN = { x: 5, y: 11 };
const FRAME_MS = 1000 / 60;

function stock(state: GameState, wood = 40, stone = 40): void {
  state.resources.wood = wood;
  state.resources.stone = stone;
}

function forceWorkingOnSite(state: GameState, siteId: string): void {
  assignAvailableTasks(state);
  const site = state.constructionSites[siteId];
  const tito = state.slimes[SLIME_IDS.TITO];
  const entrance = entranceTile(
    { x: site.tileX, y: site.tileY },
    buildingById(site.buildingTypeId),
  );
  tito.tileX = entrance.x;
  tito.tileY = entrance.y;
  tito.path = [];
  tito.hopFrom = undefined;
  tito.hopTo = undefined;
  const task = tito.currentTaskId ? state.tasks[tito.currentTaskId] : undefined;
  if (!task || !isConstructionTask(task.type)) {
    throw new Error("expected a construction assignment before forcing work");
  }
  task.state = "in_progress";
  task.assignedSlimeId = tito.id;
  site.assignedSlimeId = tito.id;
  site.status = "building";
  startWorking(tito, { x: site.tileX, y: site.tileY });
}

describe("simulation update 05.2A", () => {
  it("advances tickCount from repeated Simulation.update without calling tick()", () => {
    const sim = new Simulation();
    expect(sim.tickCount).toBe(0);

    for (let frame = 0; frame < 60; frame += 1) {
      sim.update(FRAME_MS);
    }
    expect(sim.tickCount).toBeGreaterThan(0);

    const exact = new Simulation();
    for (let tick = 0; tick < 8; tick += 1) {
      exact.update(SIMULATION_TICK_MS);
    }
    expect(exact.tickCount).toBe(8);
  });

  it("completes construction work through update() only", () => {
    const state = createBareGameState();
    stock(state);
    const site = placeConstructionSite(state, "small_blue_house", BLUE_ORIGIN)!;
    forceWorkingOnSite(state, site.id);
    const sim = new Simulation(state);
    const tito = state.slimes[SLIME_IDS.TITO];

    const framesNeeded = Math.ceil(BASE_CONSTRUCTION_WORK_MS / FRAME_MS) + 8;
    for (let frame = 0; frame < framesNeeded; frame += 1) {
      sim.update(FRAME_MS);
    }

    expect(sim.tickCount).toBeGreaterThan(0);
    expect(Object.keys(state.constructionSites)).toHaveLength(0);
    const buildings = Object.values(state.buildings);
    expect(buildings).toHaveLength(1);
    expect(buildings[0]?.typeId).toBe("small_blue_house");
    expect(buildings[0]?.tileX).toBe(BLUE_ORIGIN.x);
    expect(buildings[0]?.tileY).toBe(BLUE_ORIGIN.y);
    expect(tito.currentTaskId).toBeUndefined();
    expect(["idle", "ambient", "moving_to_ambient"]).toContain(tito.state);
  });

  it("does not consume ticks when every frame delta is 0", () => {
    const sim = new Simulation();
    for (let frame = 0; frame < 120; frame += 1) {
      sim.update(0);
    }
    expect(sim.tickCount).toBe(0);
    sim.update(SIMULATION_TICK_MS);
    expect(sim.tickCount).toBe(1);
  });
});
