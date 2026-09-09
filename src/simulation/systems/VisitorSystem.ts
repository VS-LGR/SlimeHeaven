import { findPath } from "@/src/world/pathfinding";
import { positionsEqual } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import { IDLE_WANDER_DELAY_TICKS } from "../constants";
import { CHARACTERS } from "../data/characters";
import { isVisitorLifecycle } from "../data/residents";
import { isValidVisitorTile, visitorWanderTiles, VISITOR_ARRIVAL } from "../data/visitorArrival";
import { createSlimeState, SLIME_IDS, type SlimeState } from "../entities/SlimeState";

export type VisitorIntent = "idle" | "wandering";

export interface VisitorCommandResult {
  ok: boolean;
  message: string;
}

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
    message: "Lily accepted the invitation. Her house plan is not available yet.",
  };
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
