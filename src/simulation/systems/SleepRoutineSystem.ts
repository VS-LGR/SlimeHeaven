import { findPath, cardinalNeighbors } from "@/src/world/pathfinding";
import { type GridPosition } from "@/src/world/GridPosition";
import type { GameState } from "../GameState";
import type { SlimeState } from "../entities/SlimeState";
import { isVillageResident, residentTypeIdForSlime } from "../data/residents";
import {
  formatScheduleClock,
  isSleepMinute,
  sleepScheduleFor,
  type RoutineBlockReason,
  type RoutinePhase,
  type SleepSchedule,
} from "../data/sleepRoutines";
import { buildingById, entranceTile } from "../data/buildings";
import { placedHomeForResident, residentHomeStatus } from "../residentHomes";
import { SIMULATION_TICKS_PER_SECOND } from "../constants";
import { readClock } from "../worldTime";
import { cancelAmbientBehavior } from "./AmbientBehaviorSystem";
import { cancelTask, slimeAtDestination } from "./JobSystem";
import { cancelFishingOpportunity } from "./FishingOpportunitySystem";
import { fishingSessionForSlime } from "../entities/FishingSession";
import { isFishingBusy } from "./slimeAvailability";

export type { RoutineBlockReason, RoutinePhase } from "../data/sleepRoutines";

/**
 * Interruption policy (05.5D):
 * - Gathering / till / plant / harvest-in-progress: cancelTask. Plot/node stays;
 *   no resource credit. Construction progress and paid costs are kept; the site
 *   returns to awaiting_builder with a fresh construct task.
 * - Cargo (carrying / delivering): do not cancel. Finish the existing delivery
 *   handoff, then walk home. Never drop or double-credit cargo.
 * - Eating: if food was already consumed, let the eat action finish, then home.
 * - moving_to_food: cancel without consuming food.
 * - Fishing: cancelFishingOpportunity — releases access, expires the session,
 *   no catch reward.
 * - Ambient: cancelAmbientBehavior.
 * - Construction: cancelTask keeps workCompletedMs and does not refund.
 */
export const HOME_RETRY_TICKS = SIMULATION_TICKS_PER_SECOND * 4;

export function isWorldHiddenBySleep(slime: Pick<SlimeState, "state">): boolean {
  return slime.state === "sleeping";
}

export function scheduledSleepNow(state: GameState, slime: SlimeState): boolean {
  const schedule = scheduleForSlime(slime);
  if (!schedule || !isVillageResident(slime)) {
    return false;
  }
  return isSleepMinute(readClock(state.worldTime).minuteOfDay, schedule);
}

export function scheduleForSlime(slime: Pick<SlimeState, "id">): SleepSchedule | undefined {
  const typeId = residentTypeIdForSlime(slime.id);
  return typeId ? sleepScheduleFor(typeId) : undefined;
}

export function resolveHomeEntrance(state: GameState, slime: SlimeState): GridPosition | null {
  const typeId = residentTypeIdForSlime(slime.id);
  if (!typeId) {
    return null;
  }
  const home = placedHomeForResident(state, typeId);
  if (!home) {
    return null;
  }
  const def = buildingById(home.typeId);
  return entranceTile({ x: home.tileX, y: home.tileY }, def);
}

export function routineDebug(state: GameState, slime: SlimeState): {
  wake: string | null;
  bedtime: string | null;
  phase: RoutinePhase;
  jobs: boolean;
  destination: string | null;
  block: RoutineBlockReason | null;
} {
  const schedule = scheduleForSlime(slime);
  const entrance = resolveHomeEntrance(state, slime);
  return {
    wake: schedule ? formatScheduleClock(schedule.wakeMinute) : null,
    bedtime: schedule ? formatScheduleClock(schedule.bedtimeMinute) : null,
    phase: slime.routinePhase,
    jobs: !scheduledSleepNow(state, slime) && slime.routinePhase === "awake",
    destination: entrance ? `${entrance.x},${entrance.y}` : null,
    block: slime.routineBlockReason ?? null,
  };
}

export function reconcileSleepRoutines(state: GameState): void {
  for (const slime of Object.values(state.slimes)) {
    tickResidentRoutine(state, slime);
  }
}

export function tickSleepRoutines(state: GameState): void {
  reconcileSleepRoutines(state);
}

function tickResidentRoutine(state: GameState, slime: SlimeState): void {
  const schedule = scheduleForSlime(slime);
  if (!schedule || !isVillageResident(slime)) {
    if (slime.routinePhase !== "awake") {
      wakeResident(state, slime);
    }
    return;
  }

  const shouldSleep = isSleepMinute(readClock(state.worldTime).minuteOfDay, schedule);
  if (!shouldSleep) {
    if (slime.routinePhase !== "awake" || slime.state === "sleeping" || slime.state === "moving_to_home") {
      wakeResident(state, slime);
    }
    return;
  }

  if (slime.state === "sleeping") {
    slime.routinePhase = "sleeping";
    return;
  }

  if (isFinishingAtomicBeforeSleep(slime)) {
    slime.routinePhase = "returning_home";
    return;
  }

  const entrance = resolveHomeEntrance(state, slime);
  const block = homeBlockReason(state, slime, entrance);
  if (
    slime.routinePhase === "home_blocked" &&
    state.tickIndex < slime.routineRetryAtTick &&
    (block || slime.routineBlockReason === "unreachable")
  ) {
    if (block) {
      slime.routineBlockReason = block;
    }
    return;
  }
  if (block) {
    markHomeBlocked(state, slime, block);
    return;
  }

  if (!entrance) {
    markHomeBlocked(state, slime, "missing_home");
    return;
  }

  if (slimeAtDestination(slime, entrance)) {
    enterSleep(slime, entrance);
    return;
  }

  if (slime.state === "moving_to_home" && slime.routinePhase === "returning_home") {
    if (slime.path.length === 0 && !slime.hopTo) {
      const retryPath = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, entrance);
      if (retryPath === null) {
        markHomeBlocked(state, slime, "unreachable");
        return;
      }
      slime.path = retryPath;
      slime.destination = { ...entrance };
      if (retryPath.length === 0) {
        enterSleep(slime, entrance);
      }
    }
    return;
  }

  beginReturnHome(state, slime, entrance);
}

function isFinishingAtomicBeforeSleep(slime: SlimeState): boolean {
  return (
    Boolean(slime.carriedResource) ||
    slime.state === "carrying_to_storage" ||
    slime.state === "delivering" ||
    slime.state === "eating"
  );
}

function homeBlockReason(
  state: GameState,
  slime: SlimeState,
  entrance: GridPosition | null,
): RoutineBlockReason | null {
  const typeId = residentTypeIdForSlime(slime.id);
  if (!typeId) {
    return "missing_home";
  }
  const status = residentHomeStatus(state, typeId);
  if (status === "not_defined" || status === "locked" || status === "available") {
    return "missing_home";
  }
  if (status === "under_construction") {
    return "incomplete_home";
  }
  if (!entrance) {
    return "missing_home";
  }
  if (!state.grid.isWalkable(entrance.x, entrance.y)) {
    return "entrance_blocked";
  }
  return null;
}

function markHomeBlocked(state: GameState, slime: SlimeState, reason: RoutineBlockReason): void {
  if (slime.routinePhase === "home_blocked" && slime.routineBlockReason === reason) {
    if (state.tickIndex < slime.routineRetryAtTick) {
      return;
    }
  }
  interruptForSleep(state, slime);
  slime.routinePhase = "home_blocked";
  slime.routineBlockReason = reason;
  slime.routineRetryAtTick = state.tickIndex + HOME_RETRY_TICKS;
  if (slime.state === "moving_to_home") {
    slime.state = "idle";
    slime.path = [];
    slime.destination = undefined;
    completeCurrentHop(slime);
  }
}

function beginReturnHome(state: GameState, slime: SlimeState, entrance: GridPosition): void {
  interruptForSleep(state, slime);
  if (isFinishingAtomicBeforeSleep(slime)) {
    slime.routinePhase = "returning_home";
    slime.routineBlockReason = undefined;
    return;
  }
  completeCurrentHop(slime);
  const path = findPath(state.grid, { x: slime.tileX, y: slime.tileY }, entrance);
  if (path === null) {
    markHomeBlocked(state, slime, "unreachable");
    return;
  }
  slime.routinePhase = "returning_home";
  slime.routineBlockReason = undefined;
  slime.currentTaskId = undefined;
  slime.state = "moving_to_home";
  slime.destination = { ...entrance };
  slime.path = path;
  if (path.length === 0) {
    enterSleep(slime, entrance);
  }
}

function interruptForSleep(state: GameState, slime: SlimeState): void {
  cancelAmbientBehavior(state, slime);
  for (const opportunity of state.opportunities) {
    if (
      opportunity.assignedSlimeId === slime.id &&
      opportunity.state !== "caught" &&
      opportunity.state !== "escaped" &&
      opportunity.state !== "expired"
    ) {
      cancelFishingOpportunity(state, opportunity.id);
    }
  }
  if (isFishingBusy(slime)) {
    const session = fishingSessionForSlime(state.fishingSessions, slime.id);
    cancelFishingOpportunity(state, session?.opportunityId ?? null);
    slime.state = "idle";
    slime.path = [];
    slime.destination = undefined;
    slime.currentTaskId = undefined;
  }
  if (isFinishingAtomicBeforeSleep(slime)) {
    return;
  }
  if (slime.state === "moving_to_food") {
    completeCurrentHop(slime);
    slime.state = "idle";
    slime.path = [];
    slime.destination = undefined;
    slime.workElapsedMs = 0;
  }
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  if (task && (task.state === "assigned" || task.state === "in_progress" || task.state === "available")) {
    cancelTask(state, task, slime, `${slime.id} released work at bedtime; task ${task.id} cancelled.`);
  }
}

function enterSleep(slime: SlimeState, entrance: GridPosition): void {
  completeCurrentHop(slime);
  slime.tileX = entrance.x;
  slime.tileY = entrance.y;
  slime.state = "sleeping";
  slime.routinePhase = "sleeping";
  slime.routineBlockReason = undefined;
  slime.currentTaskId = undefined;
  slime.destination = undefined;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.workElapsedMs = 0;
  slime.tillRecoverPlot = undefined;
  slime.ambientEmote = null;
}

function wakeResident(state: GameState, slime: SlimeState): void {
  if (isFinishingAtomicBeforeSleep(slime) && slime.state !== "sleeping" && slime.state !== "moving_to_home") {
    slime.routinePhase = "awake";
    slime.routineBlockReason = undefined;
    slime.routineRetryAtTick = 0;
    return;
  }
  const wasSleeping = slime.state === "sleeping";
  completeCurrentHop(slime);
  if (wasSleeping) {
    placeAtEntranceOrNeighbor(state, slime);
  }
  slime.state = "idle";
  slime.routinePhase = "awake";
  slime.routineBlockReason = undefined;
  slime.routineRetryAtTick = 0;
  slime.destination = undefined;
  slime.path = [];
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  if (!isFinishingAtomicBeforeSleep(slime)) {
    slime.currentTaskId = undefined;
  }
}

function placeAtEntranceOrNeighbor(state: GameState, slime: SlimeState): void {
  const entrance = resolveHomeEntrance(state, slime);
  if (!entrance) {
    return;
  }
  if (state.grid.isWalkable(entrance.x, entrance.y)) {
    slime.tileX = entrance.x;
    slime.tileY = entrance.y;
    return;
  }
  for (const neighbor of cardinalNeighbors(entrance.x, entrance.y)) {
    if (state.grid.isWalkable(neighbor.x, neighbor.y)) {
      slime.tileX = neighbor.x;
      slime.tileY = neighbor.y;
      return;
    }
  }
}

function completeCurrentHop(slime: SlimeState): void {
  if (!slime.hopTo) {
    return;
  }
  slime.tileX = slime.hopTo.x;
  slime.tileY = slime.hopTo.y;
  slime.hopFrom = undefined;
  slime.hopTo = undefined;
  slime.hopElapsedMs = 0;
  slime.tillRecoverPlot = undefined;
}

export function formatRoutineBlockLabel(reason: RoutineBlockReason | null | undefined): string | null {
  if (reason === "missing_home" || reason === "incomplete_home") {
    return "Aguardando casa";
  }
  if (reason === "unreachable" || reason === "entrance_blocked") {
    return "Casa inacessível";
  }
  return null;
}
