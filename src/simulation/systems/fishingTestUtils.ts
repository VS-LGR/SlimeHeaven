import { createVillageMap } from "@/src/world/villageMap";
import { GameState } from "../GameState";
import { Simulation } from "../Simulation";
import { createRng } from "../rng";
import type { FishId } from "../data/fish";
import type { AquaticActivity } from "../entities/AquaticActivity";
import { spawnAquaticAt } from "./AquaticActivitySystem";
import { commitFishingOpportunity } from "./FishingOpportunitySystem";
import { forceBite, tickFishing } from "./FishingSystem";
import { fishingSessionForSlime } from "../entities/FishingSession";
import { uniqueCapabilities } from "../slimeCapabilities";

export function freezeSpawns(state: GameState): void {
  state.nextAquaticSpawnTick = 999_999;
  state.activities = [];
}

export function villageSim(seed = 1): Simulation {
  const sim = new Simulation(new GameState(createVillageMap(), createRng(seed)));
  freezeSpawns(sim.state);
  for (const slime of Object.values(sim.state.slimes)) {
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.idleWanderTicks = 999;
  }
  return sim;
}

/** Test-only: let another slime fish so concurrent-session tests still have two fishers. */
export function grantFishingCapability(state: GameState, slimeId: string): void {
  const slime = state.slimes[slimeId];
  if (!slime) {
    return;
  }
  slime.capabilities = uniqueCapabilities([...slime.capabilities, "fishing"]);
}

export function spawnShallow(state: GameState, speciesId: FishId = "blue_darter") {
  const spot = state.fishingSpots.find((entry) => entry.depth === "shallow");
  if (!spot) {
    throw new Error("Expected a shallow fishing spot.");
  }
  const activity = spawnAquaticAt(state, speciesId, spot.tileX, spot.tileY);
  if (!activity) {
    throw new Error("Expected to spawn an aquatic activity.");
  }
  return { spot, activity };
}

export function tickUntilSlimeWaiting(sim: Simulation, slimeId: string, maxTicks = 400): void {
  for (let i = 0; i < maxTicks; i += 1) {
    const slime = sim.state.slimes[slimeId];
    const session = fishingSessionForSlime(sim.state.fishingSessions, slimeId);
    if (slime?.state === "fishing_wait" && session?.phase === "waiting") {
      return;
    }
    sim.tick();
  }
  const slime = sim.state.slimes[slimeId];
  const session = fishingSessionForSlime(sim.state.fishingSessions, slimeId);
  throw new Error(
    `Slime ${slimeId} did not start fishing (state=${slime?.state ?? "missing"} phase=${session?.phase ?? "none"})`,
  );
}

export function commitUntilWaiting(sim: Simulation, activity: AquaticActivity, maxTicks = 400): void {
  if (!commitFishingOpportunity(sim.state, activity.id)) {
    throw new Error("commitFishingOpportunity failed");
  }
  const slimeId = sim.state.opportunities.find((entry) => entry.activityId === activity.id)?.assignedSlimeId;
  if (slimeId) {
    tickUntilSlimeWaiting(sim, slimeId, maxTicks);
    return;
  }
  for (let i = 0; i < maxTicks; i += 1) {
    sim.tick();
    if (sim.state.fishing.phase === "waiting") {
      return;
    }
  }
  const slime = Object.values(sim.state.slimes).find((entry) => entry.currentTaskId);
  throw new Error(
    `Slime did not start fishing (phase=${sim.state.fishing.phase}, slimeState=${slime?.state ?? "none"})`,
  );
}

export function enterFight(state: GameState, slimeId?: string): void {
  const current = slimeId
    ? fishingSessionForSlime(state.fishingSessions, slimeId)
    : state.fishing;
  if (!current || current.phase === "fighting") {
    return;
  }
  if (current.phase === "waiting") {
    forceBite(state, slimeId);
  }
  const session = slimeId
    ? fishingSessionForSlime(state.fishingSessions, slimeId)
    : state.fishing;
  if (session && session.phase === "bite") {
    session.biteUntilTick = state.tickIndex;
    tickFishing(state);
  }
}
