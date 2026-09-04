import { createVillageMap } from "@/src/world/villageMap";
import { OBJECT_DEFS, ObjectType } from "@/src/world/tileTypes";
import { createResourceNodes } from "@/src/world/resourceNodes";
import type { Grid } from "@/src/world/Grid";
import type { GridPosition } from "@/src/world/GridPosition";
import { STORAGE_TILE, IDLE_WANDER_DELAY_TICKS } from "./constants";
import { emptyStock, type ResourceStock } from "./resources";
import { createSlimeState, SLIME_SPAWNS, type SlimeState } from "./entities/SlimeState";
import type { Task } from "./entities/Task";
import type { ResourceNode } from "./entities/ResourceNode";
import { farmKey, parseFarmKey, type FarmPlot } from "./entities/FarmPlot";
import { createRng, PLAY_RNG_SEED, type Rng } from "./rng";
import {
  emptyFishCollection,
  emptyFishInventory,
  type FishCollectionEntry,
  type FishId,
} from "./data/fish";
import type { AquaticActivity, FishingWaterSpot } from "./entities/AquaticActivity";
import {
  idleFishingSession,
  primaryFishingSession,
  upsertFishingSession,
  type FishingSession,
} from "./entities/FishingSession";
import { buildWaterWorld } from "./waterBodies";
import type { WaterBody, FishingAccessPoint } from "./entities/WaterBody";
import type { FishingOpportunity, FishingCandidateScore } from "./entities/FishingOpportunity";
import type { InterestPoint, InterestTag } from "./entities/InterestPoint";
import { rebuildInterestPoints } from "./systems/InterestPointSystem";
import type { JobEligibilityLine, JobFeedback } from "./slimeCapabilities";
import { buildingById } from "./data/buildings";
import type { PlacedBuilding } from "./entities/PlacedBuilding";
import type { ConstructionSite } from "./entities/ConstructionSite";
import { initializeStartingHomes } from "./systems/BuildingSystem";

export interface GameStateOptions {
  seedStartingHomes?: boolean;
}

function initialWanderTicks(offset: number): number {
  return IDLE_WANDER_DELAY_TICKS.min + offset;
}

/**
 * Authoritative world + gameplay state.
 * Phaser reads this; it must not hold Phaser objects.
 */
export class GameState {
  readonly grid: Grid;
  readonly storage: GridPosition;
  readonly nodes: ResourceNode[];
  readonly rng: Rng;
  readonly fishingSpots: FishingWaterSpot[];
  readonly waterBodies: WaterBody[];
  fishingAccessPoints: FishingAccessPoint[];
  slimes: Record<string, SlimeState>;
  tasks: Record<string, Task>;
  resources: ResourceStock;
  farms: Record<string, FarmPlot>;
  buildings: Record<string, PlacedBuilding>;
  constructionSites: Record<string, ConstructionSite>;
  activities: AquaticActivity[];
  opportunities: FishingOpportunity[];
  fishingSessions: FishingSession[];
  fishCollection: Record<FishId, FishCollectionEntry>;
  fishInventory: Record<FishId, number>;
  lastFishingScores: FishingCandidateScore[];
  lastFishingEligibility: JobEligibilityLine[];
  lastJobFeedback: JobFeedback | null;
  interestPoints: InterestPoint[];
  interestPointsByTag: Partial<Record<InterestTag, string[]>>;
  tickIndex = 0;
  nextAquaticSpawnTick = 0;
  private nextTaskSeq = 1;
  private nextActivitySeq = 1;
  private nextSessionSeq = 1;
  private nextOpportunitySeq = 1;
  private nextBuildingSeq = 1;
  private nextSiteSeq = 1;
  private warnedKeys = new Set<string>();
  private farmDirty = new Set<string>();

  constructor(
    grid: Grid = createVillageMap(),
    rng: Rng = createRng(PLAY_RNG_SEED),
    options: GameStateOptions = {},
  ) {
    this.grid = grid;
    this.rng = rng;
    this.storage = { x: STORAGE_TILE.x, y: STORAGE_TILE.y };
    this.nodes = createResourceNodes(grid);
    const water = buildWaterWorld(grid, this.storage);
    this.fishingSpots = water.spots;
    this.waterBodies = water.bodies;
    this.fishingAccessPoints = water.accessPoints;
    this.slimes = {};
    this.tasks = {};
    this.resources = emptyStock();
    this.farms = {};
    this.buildings = {};
    this.constructionSites = {};
    this.activities = [];
    this.opportunities = [];
    this.fishingSessions = [];
    this.fishCollection = emptyFishCollection();
    this.fishInventory = emptyFishInventory();
    this.lastFishingScores = [];
    this.lastFishingEligibility = [];
    this.lastJobFeedback = null;
    this.interestPoints = [];
    this.interestPointsByTag = {};
    this.spawnSlimes();
    if (options.seedStartingHomes !== false) {
      initializeStartingHomes(this);
    }
    rebuildInterestPoints(this);
  }

  spawnSlimes(): void {
    this.slimes = {};
    for (const def of SLIME_SPAWNS) {
      this.slimes[def.id] = createSlimeState(def, initialWanderTicks(def.wanderOffsetTicks));
    }
  }

  /** Player-facing session: fighting, else oldest bite/wait. Mutations apply to that live object. */
  get fishing(): FishingSession {
    return primaryFishingSession(this.fishingSessions) ?? idleFishingSession();
  }

  set fishing(session: FishingSession) {
    upsertFishingSession(this, session);
  }

  resetSlimes(): void {
    this.spawnSlimes();
    this.fishingSessions = [];
    for (const point of this.interestPoints) {
      point.reservedBy = null;
    }
  }

  nextTaskId(prefix: string): string {
    const id = `${prefix}_${this.nextTaskSeq}`;
    this.nextTaskSeq += 1;
    return id;
  }

  nextActivityId(): string {
    const id = `act_${this.nextActivitySeq}`;
    this.nextActivitySeq += 1;
    return id;
  }

  nextSessionId(): string {
    const id = `fish_${this.nextSessionSeq}`;
    this.nextSessionSeq += 1;
    return id;
  }

  nextOpportunityId(): string {
    const id = `opp_${this.nextOpportunitySeq}`;
    this.nextOpportunitySeq += 1;
    return id;
  }

  nextBuildingId(): string {
    const id = `building_${this.nextBuildingSeq}`;
    this.nextBuildingSeq += 1;
    return id;
  }

  nextSiteId(): string {
    const id = `site_${this.nextSiteSeq}`;
    this.nextSiteSeq += 1;
    return id;
  }

  warnOnce(key: string, message: string): void {
    if (this.warnedKeys.has(key)) {
      return;
    }
    this.warnedKeys.add(key);
    console.warn(message);
  }

  activeTasks(): Task[] {
    return Object.values(this.tasks).filter(
      (task) => task.state === "available" || task.state === "assigned" || task.state === "in_progress",
    );
  }

  farmAt(x: number, y: number): FarmPlot | undefined {
    return this.farms[farmKey(x, y)];
  }

  buildingAt(x: number, y: number): PlacedBuilding | undefined {
    return Object.values(this.buildings).find((building) => {
      const def = buildingById(building.typeId);
      return (
        x >= building.tileX &&
        x < building.tileX + def.footprint.width &&
        y >= building.tileY &&
        y < building.tileY + def.footprint.height
      );
    });
  }

  constructionSiteAt(x: number, y: number): ConstructionSite | undefined {
    return Object.values(this.constructionSites).find((site) => {
      if (site.status === "completed" || site.status === "cancelled") {
        return false;
      }
      const def = buildingById(site.buildingTypeId);
      return (
        x >= site.tileX &&
        x < site.tileX + def.footprint.width &&
        y >= site.tileY &&
        y < site.tileY + def.footprint.height
      );
    });
  }

  refreshTileBlocking(x: number, y: number): void {
    const occupied = Boolean(
      this.grid.objectAt(x, y) || this.buildingAt(x, y) || this.constructionSiteAt(x, y),
    );
    this.grid.refreshTerrainOccupancy(x, y, occupied);
  }

  markFarmDirty(x: number, y: number): void {
    this.farmDirty.add(farmKey(x, y));
  }

  consumeFarmDirty(): GridPosition[] {
    const positions: GridPosition[] = [];
    for (const key of this.farmDirty) {
      positions.push(parseFarmKey(key));
    }
    this.farmDirty.clear();
    return positions;
  }

  nodeById(id: string): ResourceNode | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  nodeAtTile(x: number, y: number): ResourceNode | undefined {
    return this.nodes.find((node) => {
      if (node.type === "wood") {
        const def = OBJECT_DEFS[ObjectType.TREE];
        return (
          x >= node.tile.x &&
          x < node.tile.x + def.footprintWidth &&
          y >= node.tile.y &&
          y < node.tile.y + def.footprintHeight
        );
      }
      return node.tile.x === x && node.tile.y === y;
    });
  }
}

/** Empty village for construction/placement tests. Production uses starting homes. */
export function createBareGameState(
  grid: Grid = createVillageMap(),
  rng: Rng = createRng(PLAY_RNG_SEED),
): GameState {
  return new GameState(grid, rng, { seedStartingHomes: false });
}
