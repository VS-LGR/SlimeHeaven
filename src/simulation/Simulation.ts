import { SIMULATION_TICK_MS, SIMULATION_TICKS_PER_SECOND } from "./constants";
import { GameState } from "./GameState";
import { assignAvailableTasks, clearActiveTasks, createGatherTask } from "./systems/JobSystem";
import { tickSlimes } from "./systems/SlimeSystem";
import { tickNeeds } from "./systems/NeedsSystem";
import {
  clearFarms,
  designateFarmRect,
  instantGrowCrops,
  removeFarmRect,
  tickFarms,
} from "./systems/FarmSystem";
import type { GridPosition } from "@/src/world/GridPosition";
import type { GatherTaskType } from "./entities/Task";
import { emptyStock } from "./resources";
import { DEBUG_ADD_FOOD_AMOUNT, DEBUG_HUNGRY_SATIETY } from "./needsConfig";
import { tickAquatic, spawnAquaticAt, clearAquaticActivities } from "./systems/AquaticActivitySystem";
import {
  advanceFishingClock as advanceFishingClockState,
  autoSucceedCatch,
  cancelFishing as cancelFishingState,
  forceBite,
  resetFishCollection as resetFishCollectionState,
  resolveStrike,
  tickFishing,
} from "./systems/FishingSystem";
import {
  commitFishingAtWorld,
  commitFishingOpportunity,
  tickFishingOpportunities,
  cancelFishingOpportunity,
} from "./systems/FishingOpportunitySystem";
import { tickAmbientBehaviors, forceAmbientBehavior, forceSocialGreet, clearAllAmbientBehaviors } from "./systems/AmbientBehaviorSystem";
import type { AmbientBehaviorId } from "./ambientConfig";
import type { ClueType, FishId } from "./data/fish";

export class Simulation {
  readonly state: GameState;
  private accumulatorMs = 0;
  private ticksRun = 0;

  constructor(state: GameState = new GameState()) {
    this.state = state;
  }

  get ticksPerSecond(): number {
    return SIMULATION_TICKS_PER_SECOND;
  }

  get tickCount(): number {
    return this.ticksRun;
  }

  /** Advance with render delta; returns interpolation alpha in [0, 1). */
  update(deltaMs: number): number {
    this.accumulatorMs += Math.max(0, deltaMs);
    const maxCatchUp = SIMULATION_TICK_MS * 8;
    if (this.accumulatorMs > maxCatchUp) {
      this.accumulatorMs = maxCatchUp;
    }
    while (this.accumulatorMs >= SIMULATION_TICK_MS) {
      this.tick();
      this.accumulatorMs -= SIMULATION_TICK_MS;
    }
    return this.accumulatorMs / SIMULATION_TICK_MS;
  }

  tick(): void {
    this.ticksRun += 1;
    this.state.tickIndex = this.ticksRun;
    tickNeeds(this.state);
    tickFarms(this.state);
    tickAquatic(this.state);
    tickFishingOpportunities(this.state);
    tickFishing(this.state);
    assignAvailableTasks(this.state);
    tickAmbientBehaviors(this.state);
    tickSlimes(this.state);
  }

  commitFishing(worldX: number, worldY: number): boolean {
    return commitFishingAtWorld(this.state, worldX, worldY);
  }

  commitFishingActivity(activityId: string): boolean {
    return commitFishingOpportunity(this.state, activityId);
  }

  cancelFishing(): void {
    cancelFishingState(this.state);
  }

  resolveFishingStrike(nowMs: number) {
    return resolveStrike(this.state, nowMs);
  }

  advanceFishingClock(nowMs: number): void {
    advanceFishingClockState(this.state, nowMs);
  }

  spawnAquatic(speciesId: FishId, tileX: number, tileY: number) {
    return spawnAquaticAt(this.state, speciesId, tileX, tileY);
  }

  clearAquaticActivities(): void {
    for (const opportunity of this.state.opportunities) {
      if (
        opportunity.state !== "caught" &&
        opportunity.state !== "escaped" &&
        opportunity.state !== "expired"
      ) {
        cancelFishingOpportunity(this.state, opportunity.id);
      }
    }
    clearAquaticActivities(this.state);
  }

  forceFishingBite(): boolean {
    return forceBite(this.state);
  }

  autoSucceedFishing(nowMs: number): boolean {
    return autoSucceedCatch(this.state, nowMs);
  }

  resetFishCollection(): void {
    resetFishCollectionState(this.state);
  }

  forceAmbient(slimeId: string, behaviorId: AmbientBehaviorId): boolean {
    return forceAmbientBehavior(this.state, slimeId, behaviorId);
  }

  forceSocialGreet(): boolean {
    return forceSocialGreet(this.state);
  }

  clearAmbientBehaviors(): void {
    clearAllAmbientBehaviors(this.state);
  }

  clueSnapshot(): Array<{
    id: string;
    worldX: number;
    worldY: number;
    clueType: ClueType;
    clueVisible: boolean;
  }> {
    return this.state.activities
      .filter((activity) => activity.state === "active")
      .map((activity) => ({
        id: activity.id,
        worldX: activity.worldX,
        worldY: activity.worldY,
        clueType: activity.clueType,
        clueVisible: activity.clueVisible,
      }));
  }

  spawnGatherTask(type: GatherTaskType, preferredTile?: GridPosition): void {
    createGatherTask(this.state, type, preferredTile);
  }

  designateFarm(ax: number, ay: number, bx: number, by: number): void {
    designateFarmRect(this.state, ax, ay, bx, by);
  }

  removeFarm(ax: number, ay: number, bx: number, by: number): void {
    removeFarmRect(this.state, ax, ay, bx, by);
  }

  clearFarms(): void {
    clearFarms(this.state);
  }

  instantGrowCrops(): void {
    instantGrowCrops(this.state);
  }

  addFood(amount: number = DEBUG_ADD_FOOD_AMOUNT): void {
    this.state.resources.food += amount;
  }

  setAllSlimesHungry(satiety: number = DEBUG_HUNGRY_SATIETY): void {
    for (const slime of Object.values(this.state.slimes)) {
      slime.satiety = satiety;
    }
  }

  clearTasks(): void {
    clearActiveTasks(this.state);
  }

  resetSlimes(): void {
    this.state.resetSlimes();
  }

  addTestResource(): void {
    this.state.resources.wood += 2;
    this.state.resources.stone += 2;
  }

  clearStock(): void {
    this.state.resources = emptyStock();
  }
}
