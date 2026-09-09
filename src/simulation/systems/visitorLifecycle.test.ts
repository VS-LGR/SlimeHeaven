import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { findPath } from "@/src/world/pathfinding";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { SLIME_IDS } from "../entities/SlimeState";
import { SIMULATION_TICKS_PER_SECOND, SLIME_HOP_DURATION_MS, SIMULATION_TICK_MS } from "../constants";
import { SATIETY_INITIAL } from "../needsConfig";
import { VISITOR_ARRIVAL, isValidVisitorTile, visitorWanderTiles } from "../data/visitorArrival";
import { inviteVisitor, spawnLilyVisitor, visitorIntent } from "./VisitorSystem";
import { assignAvailableTasks, createGatherTask } from "./JobSystem";
import { designateFarmTile } from "./FarmSystem";
import { isJobAssignable } from "./slimeAvailability";
import { residentHomeStatus } from "../residentHomes";
import { STARTING_HOMES } from "../data/startingHomes";
import { slimeView } from "../../game/render/slimeView";

function snapshot(state: GameState) {
  return {
    wood: state.resources.wood,
    stone: state.resources.stone,
    food: state.resources.food,
    buildings: Object.keys(state.buildings).sort(),
    sites: Object.keys(state.constructionSites).sort(),
    farms: Object.keys(state.farms).sort(),
  };
}

describe("Lily visitor lifecycle 05.3B.1", () => {
  it("validates the reusable arrival point and wander area", () => {
    const state = new GameState();
    expect(isValidVisitorTile(state, VISITOR_ARRIVAL.arrivalTile)).toBe(true);
    for (const tile of VISITOR_ARRIVAL.wanderTiles) {
      expect(isValidVisitorTile(state, tile)).toBe(true);
    }
    expect(findPath(state.grid, VISITOR_ARRIVAL.arrivalTile, state.storage)).not.toBeNull();
    const entrance = { x: STARTING_HOMES[0].origin.x, y: STARTING_HOMES[0].origin.y + 2 };
    expect(findPath(state.grid, VISITOR_ARRIVAL.arrivalTile, entrance)).not.toBeNull();
    expect(visitorWanderTiles(state).length).toBe(VISITOR_ARRIVAL.wanderTiles.length);
  });

  it("debug-spawns exactly one Lily visitor and refuses duplicates", () => {
    const sim = new Simulation();
    const before = snapshot(sim.state);
    const first = spawnLilyVisitor(sim.state);
    expect(first.ok).toBe(true);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    expect(lily).toBeDefined();
    expect(lily.residencyStatus).toBe("visitor");
    expect(lily.tileX).toBe(VISITOR_ARRIVAL.arrivalTile.x);
    expect(lily.tileY).toBe(VISITOR_ARRIVAL.arrivalTile.y);
    expect(lily.capabilities).toEqual([]);
    expect(Object.keys(sim.state.slimes).filter((id) => id === SLIME_IDS.LILY)).toHaveLength(1);
    const after = snapshot(sim.state);
    expect(after.wood).toBe(before.wood);
    expect(after.stone).toBe(before.stone);
    expect(after.food).toBe(before.food);
    expect(after.buildings).toEqual(before.buildings);
    expect(after.sites).toEqual(before.sites);

    const second = spawnLilyVisitor(sim.state);
    expect(second.ok).toBe(false);
    expect(second.message).toMatch(/already visiting/i);
    expect(Object.keys(sim.state.slimes).filter((id) => id === SLIME_IDS.LILY)).toHaveLength(1);
  });

  it("rejects spawn when Lily is invited or resident", () => {
    const invited = new Simulation();
    spawnLilyVisitor(invited.state);
    inviteVisitor(invited.state, SLIME_IDS.LILY);
    const invitedAgain = spawnLilyVisitor(invited.state);
    expect(invitedAgain.ok).toBe(false);
    expect(invitedAgain.message).toMatch(/already invited/i);

    const resident = new Simulation();
    spawnLilyVisitor(resident.state);
    resident.state.slimes[SLIME_IDS.LILY].residencyStatus = "resident";
    const residentAgain = spawnLilyVisitor(resident.state);
    expect(residentAgain.ok).toBe(false);
    expect(residentAgain.message).toMatch(/already a resident/i);
  });

  it("wanders only inside the visitor area and stays idle without a destination", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    lily.idleWanderTicks = 0;
    for (let i = 0; i < 80; i += 1) {
      sim.tick();
      const inArea = VISITOR_ARRIVAL.wanderTiles.some(
        (tile) => tile.x === lily.tileX && tile.y === lily.tileY,
      );
      expect(inArea).toBe(true);
      if (lily.destination) {
        const destOk = VISITOR_ARRIVAL.wanderTiles.some(
          (tile) => tile.x === lily.destination?.x && tile.y === lily.destination?.y,
        );
        expect(destOk).toBe(true);
      }
    }

    const blocked = new Simulation();
    spawnLilyVisitor(blocked.state);
    const guest = blocked.state.slimes[SLIME_IDS.LILY];
    guest.idleWanderTicks = 0;
    for (const tile of VISITOR_ARRIVAL.wanderTiles) {
      blocked.state.grid.getTile(tile.x, tile.y)!.walkable = false;
    }
    blocked.tick();
    expect(guest.state).toBe("idle");
    expect(guest.destination).toBeUndefined();
    expect(visitorIntent(guest)).toBe("idle");
  });

  it("uses hop while moving and idle while stationary; hop duration owns arrival", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    lily.idleWanderTicks = 0;
    sim.tick();
    if (lily.state !== "wandering") {
      lily.state = "wandering";
      lily.destination = VISITOR_ARRIVAL.wanderTiles.find(
        (tile) => tile.x !== lily.tileX || tile.y !== lily.tileY,
      ) ?? { x: lily.tileX + 1, y: lily.tileY };
      lily.path = findPath(sim.state.grid, { x: lily.tileX, y: lily.tileY }, lily.destination) ?? [];
    }
    expect(lily.state).toBe("wandering");
    sim.tick();
    expect(Boolean(lily.hopTo)).toBe(true);
    const moving = slimeView(lily, 0, 0);
    expect(moving.anim).toBe("hop");
    const start = { x: lily.hopFrom?.x ?? lily.tileX, y: lily.hopFrom?.y ?? lily.tileY };
    let ticks = 0;
    while (lily.tileX === start.x && lily.tileY === start.y && ticks < 8) {
      sim.tick();
      ticks += 1;
    }
    expect(ticks).toBeGreaterThan(1);
    expect(lily.tileX !== start.x || lily.tileY !== start.y).toBe(true);
    expect(SLIME_HOP_DURATION_MS).toBeGreaterThan(SIMULATION_TICK_MS);
    lily.state = "idle";
    lily.path = [];
    lily.destination = undefined;
    lily.hopFrom = undefined;
    lily.hopTo = undefined;
    const idle = slimeView(lily, 0, 0);
    expect(idle.anim).toBe("idle");
  });

  it("excludes Lily from jobs, needs, food, gather, farm, fish, and construction", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    const foodBefore = sim.state.resources.food;
    const satietyBefore = lily.satiety;
    expect(satietyBefore).toBe(SATIETY_INITIAL);
    expect(isJobAssignable(sim.state, lily)).toBe(false);

    createGatherTask(sim.state, "gather_wood");
    designateFarmTile(sim.state, 2, 12);
    assignAvailableTasks(sim.state);
    expect(lily.currentTaskId).toBeUndefined();
    expect(lily.carriedResource).toBeUndefined();

    sim.state.resources.food = 10;
    lily.satiety = 0;
    for (let i = 0; i < 8; i += 1) {
      sim.tick();
    }
    expect(lily.currentTaskId).toBeUndefined();
    expect(lily.state === "eating" || lily.state === "moving_to_food").toBe(false);
    expect(sim.state.resources.food).toBe(10);
    expect(lily.satiety).toBe(0);

    const visitorFood = new Simulation();
    spawnLilyVisitor(visitorFood.state);
    const guest = visitorFood.state.slimes[SLIME_IDS.LILY];
    const startSatiety = guest.satiety;
    visitorFood.tick();
    expect(guest.satiety).toBe(startSatiety);
    expect(visitorFood.state.resources.food).toBe(foodBefore);
  });

  it("invites only visitor → invited_waiting_for_house and is idempotent", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    const before = snapshot(sim.state);
    const first = inviteVisitor(sim.state, SLIME_IDS.LILY);
    expect(first.ok).toBe(true);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    expect(lily.residencyStatus).toBe("invited_waiting_for_house");
    expect(residentHomeStatus(sim.state, "lily")).toBe("not_defined");
    expect(isJobAssignable(sim.state, lily)).toBe(false);
    const after = snapshot(sim.state);
    expect(after.buildings).toEqual(before.buildings);
    expect(after.sites).toEqual(before.sites);
    expect(after.wood).toBe(before.wood);
    expect(after.stone).toBe(before.stone);
    expect(after.food).toBe(before.food);

    const second = inviteVisitor(sim.state, SLIME_IDS.LILY);
    expect(second.ok).toBe(false);
    expect(lily.residencyStatus).toBe("invited_waiting_for_house");
    expect(Object.keys(sim.state.slimes).filter((id) => id === SLIME_IDS.LILY)).toHaveLength(1);
  });

  it("does not activate FlowerGrown, world flowers, or harmony", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    for (let i = 0; i < 20; i += 1) {
      sim.tick();
    }
    inviteVisitor(sim.state, SLIME_IDS.LILY);
    const lily = sim.state.slimes[SLIME_IDS.LILY];
    expect(lily.state === "working").toBe(false);
    const source = readFileSync(resolve("src/simulation/systems/VisitorSystem.ts"), "utf8");
    expect(source).not.toMatch(/flowerGrown|FlowerGrown|harmony/i);
    expect(sim.state as unknown as { harmony?: number }).not.toHaveProperty("harmony");
  });

  it("leaves starting residents, homes, and 4 TPS unchanged", () => {
    const sim = new Simulation();
    spawnLilyVisitor(sim.state);
    expect(sim.state.slimes[SLIME_IDS.PINGO].residencyStatus).toBe("resident");
    expect(sim.state.slimes[SLIME_IDS.MOMO].residencyStatus).toBe("resident");
    expect(sim.state.slimes[SLIME_IDS.TITO].residencyStatus).toBe("resident");
    expect(Object.keys(sim.state.buildings)).toHaveLength(3);
    expect(sim.ticksPerSecond).toBe(SIMULATION_TICKS_PER_SECOND);
    const before = sim.tickCount;
    sim.update(1000);
    expect(sim.tickCount - before).toBe(4);
  });
});
