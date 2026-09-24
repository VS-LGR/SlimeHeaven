import { findPath } from "@/src/world/pathfinding";
import { positionsEqual } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import { IDLE_WANDER_DELAY_TICKS } from "../constants";
import { CHARACTERS } from "../data/characters";
import { isVisitorLifecycle, isVillageResident, residentTypeIdForSlime } from "../data/residents";
import { isValidVisitorTile, visitorWanderTiles, VISITOR_ARRIVAL } from "../data/visitorArrival";
import { buildingById, buildingCostBundle } from "../data/buildings";
import { createSlimeState, SLIME_IDS, type SlimeState } from "../entities/SlimeState";
import {
  constructionSiteForResident,
  homeDefinitionForResident,
  isResidentReadyForMoveIn,
  placedHomeForResident,
} from "../residentHomes";
import { creditStoredResources } from "../resources";
import {
  completeConstruction,
  evaluateBuildingPlacement,
  placeConstructionSite,
} from "./BuildingSystem";
import { reconcileSleepRoutines } from "./SleepRoutineSystem";

export type VisitorIntent = "idle" | "wandering";

export interface VisitorCommandResult {
  ok: boolean;
  message: string;
  alreadyComplete?: boolean;
}

export const MOVE_IN_TOAST_MESSAGE = "Lily moved into the village!";

function nextVisitorWait(state: GameState): number {
  return state.rng.range(IDLE_WANDER_DELAY_TICKS.min, IDLE_WANDER_DELAY_TICKS.max);
}

export function visitorIntent(slime: SlimeState): VisitorIntent {
  return slime.state === "wandering" ? "wandering" : "idle";
}

export function cancelVisitorWander(slime: SlimeState): void {
  slime.state = "idle";
  slime.destination = undefined;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
}

export function finishVisitorWander(state: GameState, slime: SlimeState): void {
  slime.state = "idle";
  slime.destination = undefined;
  slime.path = [];
  slime.idleWanderTicks = nextVisitorWait(state);
}

export function spawnLilyVisitor(state: GameState): VisitorCommandResult {
  const existing = state.slimes[SLIME_IDS.LILY];
  if (existing) {
    if (existing.residencyStatus === "visitor") {
      return { ok: false, message: "Lily is already visiting." };
    }
    if (existing.residencyStatus === "invited_waiting_for_house") {
      return { ok: false, message: "Lily is already invited." };
    }
    if (existing.residencyStatus === "resident") {
      return { ok: false, message: "Lily is already a resident." };
    }
    return { ok: false, message: "Lily already exists." };
  }

  const arrival = VISITOR_ARRIVAL.arrivalTile;
  if (!isValidVisitorTile(state, arrival)) {
    return { ok: false, message: "Visitor arrival tile is not valid." };
  }

  const lily = CHARACTERS.lily;
  state.slimes[SLIME_IDS.LILY] = createSlimeState(
    {
      id: lily.instanceId,
      name: lily.displayName,
      x: arrival.x,
      y: arrival.y,
      wanderOffsetTicks: 0,
      attributes: lily.attributes,
      interest: lily.interest,
      capabilities: [],
      participatesInWork: lily.participatesInWork,
    },
    nextVisitorWait(state),
    "visitor",
  );
  return { ok: true, message: "Spawned Lily visitor." };
}

export function inviteVisitor(state: GameState, slimeId: string): VisitorCommandResult {
  const slime = state.slimes[slimeId];
  if (!slime || slime.residencyStatus !== "visitor") {
    return { ok: false, message: "Invite is not available." };
  }
  slime.residencyStatus = "invited_waiting_for_house";
  return {
    ok: true,
    message: "Lily accepted the invitation. Her house plan is now available.",
  };
}

export function canMoveInResident(state: GameState, slimeId: string): boolean {
  const slime = state.slimes[slimeId];
  const typeId = residentTypeIdForSlime(slimeId);
  if (!slime || !typeId) {
    return false;
  }
  if (slime.residencyStatus !== "invited_waiting_for_house") {
    return false;
  }
  if (!isResidentReadyForMoveIn(state, typeId)) {
    return false;
  }
  const def = homeDefinitionForResident(typeId);
  const home = placedHomeForResident(state, typeId);
  if (!def || !home || home.typeId !== def.id) {
    return false;
  }
  if (constructionSiteForResident(state, typeId)) {
    return false;
  }
  return true;
}

export function moveInInvitedResident(state: GameState, slimeId: string): VisitorCommandResult {
  const slime = state.slimes[slimeId];
  if (slime && isVillageResident(slime)) {
    return {
      ok: false,
      alreadyComplete: true,
      message: `${slime.name} is already a resident.`,
    };
  }
  if (!canMoveInResident(state, slimeId) || !slime) {
    return { ok: false, message: "Move-in is not available." };
  }

  const typeId = residentTypeIdForSlime(slimeId);
  const character = typeId ? CHARACTERS[typeId] : undefined;
  cancelVisitorWander(slime);
  slime.idleWanderTicks = nextVisitorWait(state);
  slime.residencyStatus = "resident";
  slime.participatesInWork = character?.participatesInWork ?? false;
  slime.capabilities = [];
  slime.currentTaskId = undefined;
  slime.routinePhase = "awake";
  slime.routineBlockReason = undefined;
  slime.routineRetryAtTick = 0;

  if (!state.grid.isWalkable(slime.tileX, slime.tileY) && typeId) {
    const home = placedHomeForResident(state, typeId);
    const def = homeDefinitionForResident(typeId);
    if (home && def) {
      const entrance = {
        x: home.tileX + def.entrance.localTileX,
        y: home.tileY + def.entrance.localTileY,
      };
      if (state.grid.isWalkable(entrance.x, entrance.y)) {
        slime.tileX = entrance.x;
        slime.tileY = entrance.y;
        slime.spawnX = entrance.x;
        slime.spawnY = entrance.y;
      }
    }
  }

  reconcileSleepRoutines(state);
  return { ok: true, message: MOVE_IN_TOAST_MESSAGE };
}

const LILY_HOUSE_DEBUG_ORIGIN = { x: 5, y: 11 };

function firstLilyHouseOrigin(state: GameState) {
  if (evaluateBuildingPlacement(state, "lily_house", LILY_HOUSE_DEBUG_ORIGIN).valid) {
    return LILY_HOUSE_DEBUG_ORIGIN;
  }
  for (let y = 0; y < state.grid.height; y += 1) {
    for (let x = 0; x < state.grid.width; x += 1) {
      const origin = { x, y };
      if (evaluateBuildingPlacement(state, "lily_house", origin).valid) {
        return origin;
      }
    }
  }
  return null;
}

/** Debug-only: invite Lily and complete her house. Does not perform move-in. */
export function prepareLilyMoveInPreconditions(state: GameState): VisitorCommandResult {
  const existing = state.slimes[SLIME_IDS.LILY];
  if (existing?.residencyStatus === "resident") {
    return { ok: false, alreadyComplete: true, message: "Lily is already a resident." };
  }
  if (!existing) {
    const spawn = spawnLilyVisitor(state);
    if (!spawn.ok) {
      return spawn;
    }
  }
  const slime = state.slimes[SLIME_IDS.LILY];
  if (slime?.residencyStatus === "visitor") {
    inviteVisitor(state, SLIME_IDS.LILY);
  }
  if (placedHomeForResident(state, "lily")) {
    return { ok: true, message: "Lily is ready to move in." };
  }
  creditStoredResources(state.resources, state.discoveredResources, buildingCostBundle(buildingById("lily_house")));
  let site = constructionSiteForResident(state, "lily");
  if (!site) {
    const origin = firstLilyHouseOrigin(state);
    if (!origin) {
      return { ok: false, message: "Could not place Lily's house." };
    }
    site = placeConstructionSite(state, "lily_house", origin) ?? undefined;
  }
  if (!site) {
    return { ok: false, message: "Could not place Lily's house." };
  }
  site.workCompletedMs = site.workRequiredMs;
  const built = completeConstruction(state, site.id);
  if (!built) {
    return { ok: false, message: "Could not complete Lily's house." };
  }
  return { ok: true, message: "Lily is ready to move in." };
}

export function tickVisitors(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    if (!isVisitorLifecycle(slime)) {
      continue;
    }
    if (slime.state === "wandering") {
      continue;
    }
    if (slime.state !== "idle" || slime.hopTo) {
      continue;
    }
    if (slime.idleWanderTicks > 0) {
      continue;
    }
    beginVisitorWander(state, slime);
  }
}

function tileKey(tile: { x: number; y: number }): string {
  return `${tile.x},${tile.y}`;
}

function beginVisitorWander(state: GameState, slime: SlimeState): void {
  const allowedTiles = visitorWanderTiles(state);
  const allowed = new Set(allowedTiles.map(tileKey));
  if (!allowed.has(tileKey({ x: slime.tileX, y: slime.tileY }))) {
    slime.idleWanderTicks = nextVisitorWait(state);
    return;
  }
  const options = allowedTiles.filter((tile) => !positionsEqual(tile, { x: slime.tileX, y: slime.tileY }));
  if (options.length === 0) {
    slime.idleWanderTicks = nextVisitorWait(state);
    return;
  }
  const remaining = [...options];
  while (remaining.length > 0) {
    const pick = state.rng.pick(remaining);
    const index = remaining.findIndex((tile) => positionsEqual(tile, pick));
    remaining.splice(index, 1);
    if (!isValidVisitorTile(state, pick)) {
      continue;
    }
    const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, pick);
    if (path === null) {
      continue;
    }
    if (!path.every((step) => allowed.has(tileKey(step)))) {
      continue;
    }
    slime.state = "wandering";
    slime.destination = pick;
    slime.path = path;
    return;
  }
  slime.idleWanderTicks = nextVisitorWait(state);
}

export function visitorPathStillValid(state: GameState, slime: SlimeState): boolean {
  const allowed = new Set(visitorWanderTiles(state).map(tileKey));
  if (slime.hopTo && (!state.grid.isWalkable(slime.hopTo.x, slime.hopTo.y) || !allowed.has(tileKey(slime.hopTo)))) {
    return false;
  }
  if (slime.destination && !isValidVisitorTile(state, slime.destination)) {
    return false;
  }
  for (const step of slime.path) {
    if (!state.grid.isWalkable(step.x, step.y) || !allowed.has(tileKey(step))) {
      return false;
    }
  }
  return true;
}
