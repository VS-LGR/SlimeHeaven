import { create } from "zustand";
import type { FishCollectionEntry, FishId } from "@/src/simulation/data/fish";
import { emptyFishCollection } from "@/src/simulation/data/fish";
import type { FishingPhase } from "@/src/simulation/entities/FishingSession";
import type { FishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import type { BuildingTypeId } from "@/src/simulation/data/buildings";
import { DEFAULT_BUILDING_TYPE_ID } from "@/src/simulation/data/buildings";
import type { BuildingPlacementReason } from "@/src/simulation/systems/BuildingSystem";

export type WorldToolMode = "off" | "designate" | "remove" | "fish" | "build";

export interface TileInspect {
  terrain: string;
  grassVariant: string | null;
  detail: string | null;
  farming: string;
  farm: boolean;
  farmState: string | null;
  crop: string | null;
  cropId: string | null;
  soilVisual: string | null;
  cropStage: number | null;
  growthPercent: number | null;
  growthProgress: number | null;
  farmTask: string | null;
  object: string | null;
  walkable: boolean;
  buildable: boolean;
  shoreMask: string | null;
  shoreVisual: string | null;
  waterDepth: "shallow" | "deep" | null;
  buildingId: string | null;
  buildingType: string | null;
  buildingFootprintOrigin: string | null;
  buildingFootprint: string | null;
  buildingEntranceTile: string | null;
  residentTypeId: string | null;
  uniqueHome: boolean | null;
  startingHome: boolean | null;
  homeStatus: string | null;
  constructionSiteId: string | null;
  constructionBuildingType: string | null;
  constructionStatus: string | null;
  constructionWorkCompletedMs: number | null;
  constructionWorkRequiredMs: number | null;
  constructionProgressPercent: number | null;
  constructionAssignedSlimeId: string | null;
  constructionTaskId: string | null;
  constructionFootprintOrigin: string | null;
  constructionEntranceTile: string | null;
}

export interface SlimeInfo {
  id: string;
  name: string;
  state: string;
  taskLabel: string;
  tileX: number;
  tileY: number;
  destX: number | null;
  destY: number | null;
  carrying: string;
  satiety: number;
  hungerState: string;
  visual: "FINAL" | "PLACEHOLDER";
  anim: string;
  frame: number;
  technique: number;
  strength: number;
  instinct: number;
  luck: number;
  specialties: string[];
  capabilitiesDebug: string;
  constructionActivity: string | null;
  constructionSiteId: string | null;
  constructionCapabilityEligible: boolean | null;
  constructionPresentation: string | null;
  constructionTool: string | null;
  residencyStatus: string | null;
  homeBuildingType: string | null;
  homeBuildingId: string | null;
  homeStatus: string | null;
  homeEntranceTile: string | null;
}

export interface BuildingPlacementDebug {
  buildMode: boolean;
  buildingType: string;
  costWood: number;
  costStone: number;
  affordable: boolean;
  footprintOrigin: string;
  footprint: string;
  entranceTile: string;
  placementValid: boolean;
  invalidReasons: BuildingPlacementReason[];
}

export interface CatchToast {
  speciesId: FishId;
  name: string;
  slimeName: string | null;
  isNew: boolean;
  hideAt: number;
  kind: "catch" | "bite";
}

export interface JobToast {
  message: string;
  hideAt: number;
}

export interface FishingHudState {
  phase: FishingPhase;
  presentation: FishingPresentationPhase;
  marker: number;
  zoneStart: number;
  zoneWidth: number;
  slimeName: string | null;
  technique: number;
  strength: number;
  instinct: number;
  lastStrike: "hit" | "miss" | "perfect" | null;
}

export interface DebugActions {
  spawnGatherWood: () => void;
  spawnGatherStone: () => void;
  clearTasks: () => void;
  resetSlimes: () => void;
  addTestResource: () => void;
  addFood: () => void;
  setAllSlimesHungry: () => void;
  instantGrowCrops: () => void;
  clearFarms: () => void;
  spawnWaterRipple: () => void;
  spawnFishShadow: () => void;
  toggleWaterSurface: () => void;
  toggleAmbientWaterFx: () => void;
  toggleWaterDepthBounds: () => void;
  spawnBlueDarter: () => void;
  spawnPondCarp: () => void;
  spawnMoonGlimmer: () => void;
  clearAquaticActivities: () => void;
  forceFishingBite: () => void;
  autoSucceedFishing: () => void;
  resetFishCollection: () => void;
  toggleFishingRadiusOverlay: () => void;
  toggleInterestPointOverlay: () => void;
  forcePingoObserveWater: () => void;
  forceMomoInspectFarm: () => void;
  forceTitoInspectNature: () => void;
  forceSocialGreet: () => void;
  clearAmbientBehaviors: () => void;
}

export interface GameUiSnapshot {
  debugVisible: boolean;
  worldTool: WorldToolMode;
  selectedBuildingTypeId: BuildingTypeId;
  availableBuildingTypeIds: BuildingTypeId[];
  collectionOpen: boolean;
  fps: number;
  cameraX: number;
  cameraY: number;
  zoom: number;
  hoveredX: number | null;
  hoveredY: number | null;
  selectedX: number | null;
  selectedY: number | null;
  hoveredTile: TileInspect | null;
  selectedTile: TileInspect | null;
  mapWidth: number;
  mapHeight: number;
  simTps: number;
  slimeCount: number;
  availableTasks: number;
  assignedTasks: number;
  wood: number;
  stone: number;
  food: number;
  farmTiles: number;
  growingCrops: number;
  readyCrops: number;
  hungrySlimes: number;
  starvingSlimes: number;
  selectedSlimeId: string | null;
  selectedSlime: SlimeInfo | null;
  activeRipples: number;
  activeFishShadows: number;
  waterSurfaceOn: boolean;
  waterAmbientOn: boolean;
  waterDepthBoundsOn: boolean;
  fishingRadiusOverlayOn: boolean;
  interestPointOverlayOn: boolean;
  aquaticActivities: number;
  shallowSpots: number;
  deepSpots: number;
  fishingPhase: FishingPhase;
  fishingPresentation: string | null;
  fishingVisualDebug: string | null;
  fishingTargetId: string | null;
  fishingDebugSpecies: string | null;
  fishingAssignedSlime: string | null;
  fishingAccessPoint: string | null;
  fishingReservationOwner: string | null;
  fishingHookOwner: string | null;
  fishingScores: string[];
  fishingEligibility: string[];
  fishingOpportunity: string | null;
  farmPresentation: string | null;
  buildingPlacementDebug: BuildingPlacementDebug | null;
  ambientDebug: string[];
  waterBodyCount: number;
  accessPointCount: number;
  fishCollection: Record<FishId, FishCollectionEntry>;
  fishingHud: FishingHudState | null;
  catchToast: CatchToast | null;
  jobToast: JobToast | null;
}

interface GameUiStore extends GameUiSnapshot {
  debugActions: DebugActions | null;
  toggleDebug: () => void;
  setWorldTool: (tool: WorldToolMode) => void;
  setSelectedBuildingTypeId: (typeId: BuildingTypeId) => void;
  toggleCollection: () => void;
  setRuntime: (patch: Partial<Omit<GameUiSnapshot, "debugVisible">>) => void;
  setDebugActions: (actions: DebugActions) => void;
}

const EMPTY_SNAPSHOT: GameUiSnapshot = {
  debugVisible: false,
  worldTool: "off",
  selectedBuildingTypeId: DEFAULT_BUILDING_TYPE_ID,
  availableBuildingTypeIds: [],
  collectionOpen: false,
  fps: 0,
  cameraX: 0,
  cameraY: 0,
  zoom: 1,
  hoveredX: null,
  hoveredY: null,
  selectedX: null,
  selectedY: null,
  hoveredTile: null,
  selectedTile: null,
  mapWidth: 0,
  mapHeight: 0,
  simTps: 0,
  slimeCount: 0,
  availableTasks: 0,
  assignedTasks: 0,
  wood: 0,
  stone: 0,
  food: 0,
  farmTiles: 0,
  growingCrops: 0,
  readyCrops: 0,
  hungrySlimes: 0,
  starvingSlimes: 0,
  selectedSlimeId: null,
  selectedSlime: null,
  activeRipples: 0,
  activeFishShadows: 0,
  waterSurfaceOn: true,
  waterAmbientOn: true,
  waterDepthBoundsOn: false,
  fishingRadiusOverlayOn: false,
  interestPointOverlayOn: false,
  aquaticActivities: 0,
  shallowSpots: 0,
  deepSpots: 0,
  fishingPhase: "idle",
  fishingPresentation: null,
  fishingVisualDebug: null,
  fishingTargetId: null,
  fishingDebugSpecies: null,
  fishingAssignedSlime: null,
  fishingAccessPoint: null,
  fishingReservationOwner: null,
  fishingHookOwner: null,
  fishingScores: [],
  fishingEligibility: [],
  fishingOpportunity: null,
  farmPresentation: null,
  buildingPlacementDebug: null,
  ambientDebug: [],
  waterBodyCount: 0,
  accessPointCount: 0,
  fishCollection: emptyFishCollection(),
  fishingHud: null,
  catchToast: null,
  jobToast: null,
};

export const useGameUiStore = create<GameUiStore>((set) => ({
  ...EMPTY_SNAPSHOT,
  debugActions: null,
  toggleDebug: () => set((state) => ({ debugVisible: !state.debugVisible })),
  setWorldTool: (worldTool) => set({ worldTool }),
  setSelectedBuildingTypeId: (selectedBuildingTypeId) => set({ selectedBuildingTypeId }),
  toggleCollection: () => set((state) => ({ collectionOpen: !state.collectionOpen })),
  setRuntime: (patch) => set(patch),
  setDebugActions: (actions) => set({ debugActions: actions }),
}));
