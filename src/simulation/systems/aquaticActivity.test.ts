import { describe, expect, it } from "vitest";
import { createVillageMap } from "@/src/world/villageMap";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { createRng } from "../rng";
import { FISHING } from "../fishingConfig";
import {
  findActivityInRadius,
  liveActivities,
  reserveActivity,
  spawnAquaticAt,
} from "./AquaticActivitySystem";

function freezeSpawns(state: GameState): void {
  state.nextAquaticSpawnTick = 999_999;
}

function shallowSpot(state: GameState) {
  const spot = state.fishingSpots.find((entry) => entry.depth === "shallow");
  if (!spot) {
    throw new Error("Expected a shallow fishing spot.");
  }
  return spot;
}

function deepSpot(state: GameState) {
  const spot = state.fishingSpots.find((entry) => entry.depth === "deep");
  if (!spot) {
    throw new Error("Expected a deep fishing spot.");
  }
  return spot;
}

describe("aquatic activity", () => {
  it("spawns only on cached water points and never on land", () => {
    const sim = new Simulation(new GameState(createVillageMap(), createRng(1)));
    freezeSpawns(sim.state);
    const shallow = shallowSpot(sim.state);
    const spawned = spawnAquaticAt(sim.state, "blue_darter", shallow.tileX, shallow.tileY);
    expect(spawned).not.toBeNull();
    expect(spawned?.depth).toBe("shallow");
    expect(spawnAquaticAt(sim.state, "blue_darter", 2, 12)).toBeNull();
  });

  it("rejects species that do not match the tile depth", () => {
    const state = new GameState(createVillageMap(), createRng(1));
    const shallow = shallowSpot(state);
    const deep = deepSpot(state);
    expect(spawnAquaticAt(state, "moon_glimmer", shallow.tileX, shallow.tileY)).toBeNull();
    expect(spawnAquaticAt(state, "blue_darter", deep.tileX, deep.tileY)).toBeNull();
    expect(spawnAquaticAt(state, "moon_glimmer", deep.tileX, deep.tileY)?.speciesId).toBe("moon_glimmer");
    expect(spawnAquaticAt(state, "pond_carp", shallow.tileX, shallow.tileY)?.speciesId).toBe("pond_carp");
  });

  it("expires active activities and respects the max count", () => {
    const sim = new Simulation(new GameState(createVillageMap(), createRng(3)));
    freezeSpawns(sim.state);
    const spots = sim.state.fishingSpots.filter((spot) => spot.depth === "shallow").slice(0, 4);
    for (const spot of spots.slice(0, 3)) {
      spawnAquaticAt(sim.state, "blue_darter", spot.tileX, spot.tileY);
    }
    expect(liveActivities(sim.state)).toHaveLength(3);
    sim.state.nextAquaticSpawnTick = sim.state.tickIndex;
    sim.tick();
    expect(liveActivities(sim.state).length).toBeLessThanOrEqual(FISHING.maxActivities);

    const [first] = liveActivities(sim.state);
    first.expiresAtTick = sim.state.tickIndex;
    first.state = "active";
    sim.tick();
    expect(liveActivities(sim.state).some((activity) => activity.id === first.id)).toBe(false);
  });

  it("skips reserved activities for a new cast radius search", () => {
    const state = new GameState(createVillageMap(), createRng(1));
    freezeSpawns(state);
    const shallow = shallowSpot(state);
    const activity = spawnAquaticAt(state, "blue_darter", shallow.tileX, shallow.tileY)!;
    reserveActivity(activity, "fish_1");
    expect(findActivityInRadius(state, activity.worldX, activity.worldY)).toBeUndefined();
  });

  it("uses the injected seed for spawn order", () => {
    const a = new Simulation(new GameState(createVillageMap(), createRng(11)));
    const b = new Simulation(new GameState(createVillageMap(), createRng(11)));
    const c = new Simulation(new GameState(createVillageMap(), createRng(99)));
    for (let i = 0; i < 24; i += 1) {
      a.tick();
      b.tick();
      c.tick();
    }
    const firstA = liveActivities(a.state)[0];
    const firstB = liveActivities(b.state)[0];
    expect(firstA).toBeDefined();
    expect(firstB).toBeDefined();
    expect(firstA.speciesId).toBe(firstB.speciesId);
    expect(firstA.tileX).toBe(firstB.tileX);
    expect(firstA.tileY).toBe(firstB.tileY);
    expect(liveActivities(c.state)[0]).toBeDefined();
  });
});
