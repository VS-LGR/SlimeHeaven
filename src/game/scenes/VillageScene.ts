import Phaser from "phaser";
import { DEPTH, REGISTRY_KEYS, SCENE_KEYS, TILE_SIZE, TILESET_KEY } from "../config";
import { CameraController } from "../input/CameraController";
import { SelectionController } from "../input/SelectionController";
import { FarmDesignationController } from "../input/FarmDesignationController";
import { FishingController } from "../input/FishingController";
import { BuildPlacementController } from "../input/BuildPlacementController";
import { inspectWorldTile } from "../inspectWorld";
import { DETAIL_DEFS, OBJECT_DEFS } from "@/src/world/tileTypes";
import { tileToWorld } from "@/src/world/constants";
import { farmKey } from "@/src/simulation/entities/FarmPlot";
import type { Simulation } from "@/src/simulation/Simulation";
import { SIMULATION_TICKS_PER_SECOND } from "@/src/simulation/constants";
import { hungerState } from "@/src/simulation/needsConfig";
import { FISH, type FishId } from "@/src/simulation/data/fish";
import { FISHING } from "@/src/simulation/fishingConfig";
import { fightMarkerT } from "@/src/simulation/systems/FishingSystem";
import { fightingSession, isLiveFishingPhase, sessionOwnsInput } from "@/src/simulation/entities/FishingSession";
import { fishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import { slimeMode } from "@/src/simulation/systems/slimeAvailability";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import { SlimeRenderer, type SlimeVisualDebug } from "../render/SlimeRenderer";
import { WaterRenderer } from "../render/water/WaterRenderer";
import { WaterClueSystem } from "../render/water/WaterClueSystem";
import { FishingRenderer, type FishingVisualAnchor } from "../render/fishing/FishingRenderer";
import { FarmPlotRenderer } from "../render/farming/FarmPlotRenderer";
import { BuildingRenderer } from "../render/buildings/BuildingRenderer";
import { ConstructionSiteRenderer } from "../render/buildings/ConstructionSiteRenderer";
import { SpecialistToolRenderer, type FarmPresentationDebug } from "../render/specialist/SpecialistToolRenderer";
import { gatheringF3SpecialistFrameLabel, gatheringF3ToolFrameLabel } from "../render/gathering/chopPresentation";
import { FISHING_PRESENTATION } from "../render/fishing/fishingVisualConfig";
import { nudgePingoRod } from "../render/fishing/pingoFishingVisualConfig";
import { useGameUiStore, type SlimeInfo } from "@/src/store/gameUiStore";
import type { BuildingPlacementDebug } from "@/src/store/gameUiStore";
import type { BuildingPlacementEvaluation } from "@/src/simulation/systems/BuildingSystem";
import { buildingById, entranceTile } from "@/src/simulation/data/buildings";
import { residentTypeIdForSlime } from "@/src/simulation/data/residents";
import { placedHomeForResident, playerBuildableBuildingTypes, residentHomeStatus } from "@/src/simulation/residentHomes";
import type { SlimeState } from "@/src/simulation/entities/SlimeState";
import { formatCapabilitiesDebug, knownSpecialtyLabels, canPerformTaskCapabilities } from "@/src/simulation/slimeCapabilities";
import { isConstructionTask } from "@/src/simulation/entities/Task";
import { gatheringToolForTask } from "../render/gathering/chopPresentation";

const UI_PUSH_MS = 100;

export class VillageScene extends Phaser.Scene {
  private cameraController: CameraController | undefined;
  private simulation: Simulation | undefined;
  private slimeRenderer: SlimeRenderer | undefined;
  private waterRenderer: WaterRenderer | undefined;
  private farmPlots: FarmPlotRenderer | undefined;
  private buildings: BuildingRenderer | undefined;
  private constructionSites: ConstructionSiteRenderer | undefined;
  private farmTool: FarmDesignationController | undefined;
  private fishingTool: FishingController | undefined;
  private buildTool: BuildPlacementController | undefined;
  private fishingRenderer: FishingRenderer | undefined;
  private specialistTools: SpecialistToolRenderer | undefined;
  private waterClues: WaterClueSystem | undefined;
  private selection: SelectionController | undefined;
  private readonly detailSprites = new Map<string, Phaser.GameObjects.Image>();
  private lastUiPush = 0;
  private readonly toastedBiteIds = new Set<string>();
  private readonly toastedCatchIds = new Set<string>();

  constructor() {
    super(SCENE_KEYS.VILLAGE);
  }

  create(): void {
    const simulation = this.registry.get(REGISTRY_KEYS.SIMULATION) as Simulation | undefined;
    if (!simulation) {
      throw new Error("VillageScene requires Simulation in the Phaser registry.");
    }
    this.simulation = simulation;
    const { grid } = simulation.state;
    const worldWidth = grid.worldWidthPx();
    const worldHeight = grid.worldHeightPx();

    const map = this.make.tilemap({
      data: grid.terrainFrameGrid(),
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const tileset = map.addTilesetImage(TILESET_KEY, TILESET_KEY, TILE_SIZE, TILE_SIZE);
    if (!tileset) {
      throw new Error("Failed to create tileset from loaded texture.");
    }

    const ground = map.createLayer(0, tileset, 0, 0);
    ground?.setDepth(DEPTH.GROUND);
    if (ground) {
      for (let y = 0; y < grid.height; y += 1) {
        for (let x = 0; x < grid.width; x += 1) {
          const rotationDeg = grid.terrainRotationAt(x, y);
          if (rotationDeg === 0) {
            continue;
          }
          const tile = ground.getTileAt(x, y);
          if (tile) {
            tile.rotation = Phaser.Math.DegToRad(rotationDeg);
          }
        }
      }
    }

    this.farmPlots = new FarmPlotRenderer(this);
    this.constructionSites = new ConstructionSiteRenderer(this);
    this.buildings = new BuildingRenderer(this);

    for (let y = 0; y < grid.height; y += 1) {
      for (let x = 0; x < grid.width; x += 1) {
        const detail = grid.getTile(x, y)?.detail;
        if (!detail) {
          continue;
        }
        const def = DETAIL_DEFS[detail];
        const pos = tileToWorld(x, y);
        const sprite = this.add
          .image(pos.x, pos.y, def.textureKey)
          .setOrigin(0, 0)
          .setDepth(DEPTH.GROUND_DETAIL);
        this.detailSprites.set(farmKey(x, y), sprite);
      }
    }

    for (const object of grid.objects) {
      const def = OBJECT_DEFS[object.type];
      const { x, y } = tileToWorld(object.x, object.y);
      this.add
        .image(
          x + def.originX * def.footprintWidth * TILE_SIZE,
          y + def.originY * def.footprintHeight * TILE_SIZE,
          def.textureKey,
        )
        .setOrigin(def.originX, def.originY)
        .setDepth(DEPTH.OBJECTS + object.y + def.footprintHeight - 1);
    }

    this.cameras.main.setRoundPixels(true);
    this.cameraController = new CameraController(this, {
      width: worldWidth,
      height: worldHeight,
    });
    this.slimeRenderer = new SlimeRenderer(this, simulation);
    this.specialistTools = new SpecialistToolRenderer(this);
    this.waterRenderer = new WaterRenderer(this, grid, () =>
      Boolean(this.fishingTool?.ownsPointer() || this.buildTool?.isToolActive()),
    );
    this.waterClues = new WaterClueSystem(this, this.waterRenderer.getWaterMask(), (x, y, type) => {
      this.waterRenderer?.spawnRipple(x, y, type);
    });
    this.fishingRenderer = new FishingRenderer(this, (x, y, type) => {
      this.waterRenderer?.spawnRipple(x, y, type);
    });
    this.farmTool = new FarmDesignationController(this, simulation);
    this.fishingTool = new FishingController(this, simulation);
    this.buildTool = new BuildPlacementController(this, simulation);
    this.selection = new SelectionController(
      this,
      grid,
      (x, y) => inspectWorldTile(grid, simulation.state, x, y),
      (pointer) => this.handleSlimeClick(pointer),
    );

    useGameUiStore.getState().setDebugActions({
      spawnGatherWood: () => this.spawnTask("gather_wood"),
      spawnGatherStone: () => this.spawnTask("gather_stone"),
      clearTasks: () => simulation.clearTasks(),
      resetSlimes: () => simulation.resetSlimes(),
      addTestResource: () => simulation.addTestResource(),
      addFood: () => simulation.addFood(),
      setAllSlimesHungry: () => simulation.setAllSlimesHungry(),
      instantGrowCrops: () => simulation.instantGrowCrops(),
      clearFarms: () => simulation.clearFarms(),
      spawnWaterRipple: () => {
        const { selectedX, selectedY } = useGameUiStore.getState();
        this.waterRenderer?.spawnDebugRipple(selectedX, selectedY);
      },
      spawnFishShadow: () => this.waterRenderer?.spawnFishShadow(),
      toggleWaterSurface: () => {
        const on = this.waterRenderer?.toggleSurface();
        if (on !== undefined) {
          useGameUiStore.getState().setRuntime({ waterSurfaceOn: on });
        }
      },
      toggleAmbientWaterFx: () => {
        const on = this.waterRenderer?.toggleAmbient();
        if (on !== undefined) {
          useGameUiStore.getState().setRuntime({ waterAmbientOn: on });
        }
      },
      toggleWaterDepthBounds: () => {
        const on = this.waterRenderer?.toggleDepthBounds();
        if (on !== undefined) {
          useGameUiStore.getState().setRuntime({ waterDepthBoundsOn: on });
        }
      },
      spawnBlueDarter: () => this.spawnDebugFish("blue_darter"),
      spawnPondCarp: () => this.spawnDebugFish("pond_carp"),
      spawnMoonGlimmer: () => this.spawnDebugFish("moon_glimmer"),
      clearAquaticActivities: () => simulation.clearAquaticActivities(),
      forceFishingBite: () => simulation.forceFishingBite(),
      autoSucceedFishing: () => simulation.autoSucceedFishing(this.time.now),
      resetFishCollection: () => simulation.resetFishCollection(),
      toggleFishingRadiusOverlay: () => {
        const on = !useGameUiStore.getState().fishingRadiusOverlayOn;
        useGameUiStore.getState().setRuntime({ fishingRadiusOverlayOn: on });
      },
      toggleInterestPointOverlay: () => {
        const on = !useGameUiStore.getState().interestPointOverlayOn;
        useGameUiStore.getState().setRuntime({ interestPointOverlayOn: on });
      },
      forcePingoObserveWater: () => simulation.forceAmbient(SLIME_IDS.PINGO, "observe_water"),
      forceMomoInspectFarm: () => simulation.forceAmbient(SLIME_IDS.MOMO, "inspect_farm"),
      forceTitoInspectNature: () => simulation.forceAmbient(SLIME_IDS.TITO, "inspect_nature"),
      forceSocialGreet: () => simulation.forceSocialGreet(),
      clearAmbientBehaviors: () => simulation.clearAmbientBehaviors(),
    });

    useGameUiStore.getState().setRuntime({
      mapWidth: grid.width,
      mapHeight: grid.height,
      selectedX: null,
      selectedY: null,
      hoveredX: null,
      hoveredY: null,
      hoveredTile: null,
      selectedTile: null,
      selectedSlimeId: null,
      selectedSlime: null,
      activeRipples: 0,
      activeFishShadows: 0,
      waterSurfaceOn: true,
      waterAmbientOn: true,
      waterDepthBoundsOn: false,
      fishingRadiusOverlayOn: false,
      fishingHud: null,
      catchToast: null,
      jobToast: null,
    });

    this.game.canvas.tabIndex = 0;
    this.game.canvas.focus();
    this.input.keyboard?.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (!useGameUiStore.getState().debugVisible) {
        return;
      }
      if (event.key !== "[" && event.key !== "]") {
        return;
      }
      const dir = event.key === "]" ? 1 : -1;
      const next = event.shiftKey ? nudgePingoRod(0, dir) : nudgePingoRod(dir, 0);
      console.log("pingo rod nudge", next);
    });
    this.input.on("pointerdown", () => {
      this.game.canvas.focus();
    });
  }

  update(_time: number, delta: number): void {
    this.cameraController?.update(delta);
    const simulation = this.simulation;
    if (!simulation) {
      return;
    }
    const alpha = simulation.update(delta);
    simulation.advanceFishingClock(this.time.now);
    this.syncFarmVisuals();
    this.farmPlots?.sync(simulation);
    this.constructionSites?.sync(simulation);
    this.buildings?.sync(simulation);
    this.farmTool?.sync();
    this.fishingTool?.sync();
    this.buildTool?.sync();
    this.slimeRenderer?.sync(alpha, this.time.now);
    const showVisualDebug = useGameUiStore.getState().debugVisible;
    this.specialistTools?.sync(
      simulation,
      this.slimeRenderer?.specialistPresentation() ?? [],
      showVisualDebug,
    );
    this.waterRenderer?.update(this.time.now, delta);
    this.waterClues?.sync(simulation.clueSnapshot(), this.time.now);
    const showRadius = useGameUiStore.getState().fishingRadiusOverlayOn;
    const showInterest = useGameUiStore.getState().interestPointOverlayOn;
    this.fishingRenderer?.sync(
      simulation.state.fishingSessions,
      simulation.state.activities,
      simulation.state.slimes,
      simulation.state.fishingAccessPoints,
      alpha,
      simulation.state.tickIndex,
      this.time.now,
      showRadius,
      showInterest,
      showVisualDebug,
      simulation.state.interestPoints,
      simulation.state.grid,
    );
    const follow = this.fishingRenderer?.visualAnchors()[0];
    if (follow) {
      this.cameraController?.followFishingIfNeeded(
        follow.feetX,
        follow.feetY,
        follow.bobberX,
        follow.bobberY,
        FISHING_PRESENTATION.cameraLerp,
        FISHING_PRESENTATION.cameraMarginPx,
      );
    }
    this.syncFishingHud(simulation);

    const now = this.time.now;
    if (now - this.lastUiPush < UI_PUSH_MS) {
      return;
    }
    this.lastUiPush = now;

    const camera = this.cameras.main;
    const { state } = simulation;
    const tasks = Object.values(state.tasks);
    const farms = Object.values(state.farms);
    const selectedId = useGameUiStore.getState().selectedSlimeId;
    const water = this.waterRenderer?.debugSnapshot();
    const hungers = Object.values(state.slimes).map((slime) => hungerState(slime.satiety));
    this.selection?.refreshInspect();
    useGameUiStore.getState().setRuntime({
      fps: Math.round(this.game.loop.actualFps),
      cameraX: Math.round(camera.midPoint.x),
      cameraY: Math.round(camera.midPoint.y),
      zoom: camera.zoom,
      simTps: SIMULATION_TICKS_PER_SECOND,
      slimeCount: Object.keys(state.slimes).length,
      availableTasks: tasks.filter((task) => task.state === "available").length,
      assignedTasks: tasks.filter(
        (task) => task.state === "assigned" || task.state === "in_progress",
      ).length,
      wood: state.resources.wood,
      stone: state.resources.stone,
      food: state.resources.food,
      availableBuildingTypeIds: playerBuildableBuildingTypes(state),
      farmTiles: farms.length,
      growingCrops: farms.filter((plot) => plot.state === "growing" || plot.state === "planted").length,
      readyCrops: farms.filter((plot) => plot.state === "ready").length,
      hungrySlimes: hungers.filter((value) => value === "hungry").length,
      starvingSlimes: hungers.filter((value) => value === "starving").length,
      selectedSlime: selectedId ? this.selectedSlimeInfo(selectedId) : null,
      activeRipples: water?.activeRipples ?? 0,
      activeFishShadows: water?.activeFishShadows ?? 0,
      waterSurfaceOn: water?.waterSurfaceOn ?? true,
      waterAmbientOn: water?.waterAmbientOn ?? true,
      waterDepthBoundsOn: water?.waterDepthBoundsOn ?? false,
      aquaticActivities: state.activities.filter((activity) => activity.state !== "consumed").length,
      shallowSpots: state.fishingSpots.filter((spot) => spot.depth === "shallow").length,
      deepSpots: state.fishingSpots.filter((spot) => spot.depth === "deep").length,
      fishingPhase: state.fishing.phase,
      fishingPresentation: fishingPresentationPhase(
        state.fishing.assignedSlimeId ? state.slimes[state.fishing.assignedSlimeId] : undefined,
        state.fishing.phase === "idle" ? undefined : state.fishing,
        state.tickIndex,
      ),
      fishingVisualDebug: fishingVisualDebugLine(this.fishingRenderer?.visualAnchors()[0]),
      fishingTargetId: state.fishing.activityId,
      fishingDebugSpecies: state.fishing.speciesId,
      fishingAssignedSlime: state.fishingSessions
        .filter((session) => isLiveFishingPhase(session.phase))
        .map((session) => state.slimes[session.assignedSlimeId ?? ""]?.name ?? session.assignedSlimeId)
        .filter((name): name is string => Boolean(name))
        .join(", ") || null,
      fishingAccessPoint: state.fishing.accessPointId,
      fishingReservationOwner:
        state.fishingAccessPoints.find((point) => point.id === state.fishing.accessPointId)?.reservedBy ??
        null,
      fishingHookOwner: fightingSession(state.fishingSessions)?.assignedSlimeId ?? null,
      fishingScores: state.lastFishingScores.map((entry) => `${entry.name} ${entry.score.toFixed(1)}`),
      fishingEligibility: state.lastFishingEligibility.map((entry) => entry.debugLine),
      fishingOpportunity:
        state.opportunities.find(
          (entry) =>
            entry.state !== "caught" && entry.state !== "escaped" && entry.state !== "expired",
        )?.state ?? null,
      farmPresentation: farmPresentationLine(this.specialistTools?.lastFarmPresentation() ?? null),
      buildingPlacementDebug: buildingDebugFromEvaluation(this.buildTool?.debugSnapshot() ?? null),
      ambientDebug: Object.values(state.slimes).map((slime) => {
        const reserved = state.interestPoints.find((point) => point.reservedBy === slime.id);
        return `${slime.name} ${slimeMode(slime)} ${slime.ambientBehaviorId ?? "—"} ${
          slime.ambientTargetId ?? "—"
        } cd:${Math.max(0, slime.ambientCooldownUntilTick - state.tickIndex)} r:${reserved?.id ?? "—"}`;
      }),
      waterBodyCount: state.waterBodies.length,
      accessPointCount: state.fishingAccessPoints.length,
      fishCollection: state.fishCollection,
    });
  }

  private syncFarmVisuals(): void {
    const simulation = this.simulation;
    if (!simulation) {
      return;
    }
    for (const pos of simulation.state.consumeFarmDirty()) {
      const detail = this.detailSprites.get(farmKey(pos.x, pos.y));
      if (detail) {
        detail.setVisible(!simulation.state.farmAt(pos.x, pos.y));
      }
    }
  }

  private spawnTask(type: "gather_wood" | "gather_stone"): void {
    const simulation = this.simulation;
    if (!simulation) {
      return;
    }
    const { selectedX, selectedY } = useGameUiStore.getState();
    const preferred =
      selectedX !== null && selectedY !== null ? { x: selectedX, y: selectedY } : undefined;
    simulation.spawnGatherTask(type, preferred);
  }

  private handleSlimeClick(pointer: Phaser.Input.Pointer): boolean {
    if (this.farmTool?.isToolActive() || this.fishingTool?.ownsPointer() || this.buildTool?.isToolActive()) {
      return true;
    }
    if (this.simulation && sessionOwnsInput(this.simulation.state.fishing)) {
      return true;
    }
    const id = this.slimeRenderer?.hitTest(pointer.worldX, pointer.worldY);
    useGameUiStore.getState().setRuntime({
      selectedSlimeId: id ?? null,
      selectedSlime: id ? this.selectedSlimeInfo(id) : null,
    });
    return Boolean(id);
  }

  private spawnDebugFish(speciesId: FishId): void {
    const simulation = this.simulation;
    if (!simulation) {
      return;
    }
    const { selectedX, selectedY, hoveredX, hoveredY } = useGameUiStore.getState();
    const tileX = selectedX ?? hoveredX;
    const tileY = selectedY ?? hoveredY;
    if (tileX === null || tileY === null) {
      return;
    }
    simulation.spawnAquatic(speciesId, tileX, tileY);
  }

  private syncFishingHud(simulation: Simulation): void {
    const sessions = simulation.state.fishingSessions;
    const nowMs = this.time.now;
    const fighting = fightingSession(sessions);
    const focus = fighting ?? simulation.state.fishing;
    const slime = focus.assignedSlimeId ? simulation.state.slimes[focus.assignedSlimeId] : undefined;
    if (focus.phase !== "idle") {
      useGameUiStore.getState().setRuntime({
        fishingHud: {
          phase: focus.phase,
          presentation: fishingPresentationPhase(slime, focus, simulation.state.tickIndex),
          marker: fighting ? fightMarkerT(fighting, nowMs) : 0,
          zoneStart: focus.zoneStart,
          zoneWidth: focus.zoneWidth,
          slimeName: slime?.name ?? null,
          technique: slime?.attributes.technique ?? 3,
          strength: slime?.attributes.strength ?? 3,
          instinct: slime?.attributes.instinct ?? 3,
          lastStrike: focus.lastStrike,
        },
      });
    } else if (useGameUiStore.getState().fishingHud) {
      useGameUiStore.getState().setRuntime({ fishingHud: null });
    }

    for (const session of sessions) {
      if (session.phase === "bite" && !this.toastedBiteIds.has(session.sessionId)) {
        this.toastedBiteIds.add(session.sessionId);
        const slimeName = session.assignedSlimeId
          ? (simulation.state.slimes[session.assignedSlimeId]?.name ?? null)
          : null;
        useGameUiStore.getState().setRuntime({
          catchToast: {
            speciesId: session.speciesId ?? "blue_darter",
            name: session.speciesId ? FISH[session.speciesId].name : "Fish",
            slimeName,
            isNew: false,
            kind: "bite",
            hideAt: Date.now() + 900,
          },
        });
      }
      if (
        session.phase === "caught" &&
        session.caughtSpeciesId &&
        !this.toastedCatchIds.has(session.sessionId)
      ) {
        this.toastedCatchIds.add(session.sessionId);
        const speciesId = session.caughtSpeciesId;
        const duration = session.isNewDiscovery ? FISHING.newCatchRevealMs : FISHING.caughtRevealMs;
        const slimeName = session.assignedSlimeId
          ? (simulation.state.slimes[session.assignedSlimeId]?.name ?? null)
          : null;
        useGameUiStore.getState().setRuntime({
          catchToast: {
            speciesId,
            name: FISH[speciesId].name,
            slimeName,
            isNew: session.isNewDiscovery,
            kind: "catch",
            hideAt: Date.now() + duration,
          },
        });
      }
    }

    const liveIds = new Set(sessions.map((session) => session.sessionId));
    for (const id of this.toastedBiteIds) {
      if (!liveIds.has(id)) {
        this.toastedBiteIds.delete(id);
      }
    }
    for (const id of this.toastedCatchIds) {
      if (!liveIds.has(id)) {
        this.toastedCatchIds.delete(id);
      }
    }

    const toast = useGameUiStore.getState().catchToast;
    if (toast && Date.now() >= toast.hideAt) {
      useGameUiStore.getState().setRuntime({ catchToast: null });
    }
    const jobToast = useGameUiStore.getState().jobToast;
    if (jobToast && Date.now() >= jobToast.hideAt) {
      useGameUiStore.getState().setRuntime({ jobToast: null });
    }
  }

  private selectedSlimeInfo(id: string): SlimeInfo | null {
    const simulation = this.simulation;
    if (!simulation) {
      return null;
    }
    const slime = simulation.state.slimes[id];
    if (!slime) {
      return null;
    }
    const debug = this.slimeRenderer?.visualDebug(slime);
    return slimeInfo(slime, simulation.state, debug);
  }
}

function slimeInfo(
  slime: SlimeState | undefined,
  state: Simulation["state"],
  debug?: SlimeVisualDebug,
): SlimeInfo | null {
  if (!slime) {
    return null;
  }
  const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
  let taskLabel = "none";
  if (slime.state === "moving_to_food" || slime.state === "eating") {
    taskLabel = "Eat";
  } else if (task) {
    taskLabel = task.type.replaceAll("_", " ");
  }
  const constructing = Boolean(task && isConstructionTask(task.type));
  const residentTypeId = residentTypeIdForSlime(slime.id);
  const home = residentTypeId ? placedHomeForResident(state, residentTypeId) : undefined;
  const homeDef = home ? buildingById(home.typeId) : undefined;
  const homeEntrance = home && homeDef ? entranceTile({ x: home.tileX, y: home.tileY }, homeDef) : null;
  return {
    id: slime.id,
    name: slime.name,
    state: slime.state,
    taskLabel,
    tileX: slime.tileX,
    tileY: slime.tileY,
    destX: slime.destination?.x ?? null,
    destY: slime.destination?.y ?? null,
    carrying: slime.carriedResource
      ? `${slime.carriedResource.type} ×${slime.carriedResource.amount}`
      : "Nothing",
    satiety: Math.round(slime.satiety),
    hungerState: hungerState(slime.satiety),
    visual: debug?.visual ?? "PLACEHOLDER",
    anim: debug?.anim ?? "idle",
    frame: debug?.frame ?? 0,
    technique: slime.attributes.technique,
    strength: slime.attributes.strength,
    instinct: slime.attributes.instinct,
    luck: slime.attributes.luck,
    specialties: knownSpecialtyLabels(slime.capabilities),
    capabilitiesDebug: formatCapabilitiesDebug(slime.capabilities),
    constructionActivity: constructing ? "construct_building" : null,
    constructionSiteId: constructing ? (task?.constructionSiteId ?? task?.nodeId ?? null) : null,
    constructionCapabilityEligible: constructing && task ? canPerformTaskCapabilities(slime, task) : null,
    constructionPresentation: constructing && slime.state === "working" ? "generic_work" : null,
    constructionTool: constructing ? gatheringToolForTask(task?.type) ?? "none" : null,
    residencyStatus: slime.residencyStatus,
    homeBuildingType: home?.typeId ?? null,
    homeBuildingId: home?.id ?? null,
    homeStatus: residentTypeId ? residentHomeStatus(state, residentTypeId) : null,
    homeEntranceTile: homeEntrance ? `${homeEntrance.x},${homeEntrance.y}` : null,
  };
}

function farmPresentationLine(debug: FarmPresentationDebug | null): string | null {
  if (!debug) {
    return null;
  }
  return [
    `task: ${debug.task}`,
    `anim: ${debug.anim}`,
    `frame: ${debug.frame}`,
    `specialistFrame: ${gatheringF3SpecialistFrameLabel(debug.specialist, debug.frame)}`,
    `visualSide: ${debug.visualSide}`,
    `specialist: ${debug.specialist}`,
    `tool: ${debug.tool ?? "none"}`,
    `toolFrame: ${gatheringF3ToolFrameLabel(debug.tool, debug.toolFrame)}`,
    `presentationCycle: ${debug.presentationCycle ?? "—"}`,
    `impact: ${debug.impact ? "true" : "false"}`,
  ].join(" / ");
}

function fishingVisualDebugLine(anchor: FishingVisualAnchor | undefined): string | null {
  if (!anchor) {
    return null;
  }
  return [
    `${anchor.visualPhase}/${anchor.phase}`,
    `side:${anchor.visualSide}`,
    `dir:${anchor.castDirection}`,
    `origin:${anchor.rodOriginX},${anchor.rodOriginY}`,
    `tip:${anchor.rodTipX},${anchor.rodTipY}`,
    `line:${anchor.lineStartX},${anchor.lineStartY}->${anchor.lineEndX},${anchor.lineEndY}`,
    `water:${anchor.waterTargetX},${anchor.waterTargetY}`,
    `pose:${anchor.rodPose}`,
    `frame:${anchor.animFrame}`,
  ].join(" ");
}

function buildingDebugFromEvaluation(
  evaluation: BuildingPlacementEvaluation | null,
): BuildingPlacementDebug | null {
  if (!evaluation) {
    return null;
  }
    const def = buildingById(evaluation.typeId);
    return {
      buildMode: true,
      buildingType: evaluation.typeId,
      costWood: evaluation.cost.wood,
      costStone: evaluation.cost.stone,
      affordable: evaluation.affordable,
      footprintOrigin: `${evaluation.origin.x},${evaluation.origin.y}`,
      footprint: `${def.footprint.width}x${def.footprint.height}`,
      entranceTile: `${evaluation.entrance.x},${evaluation.entrance.y}`,
      placementValid: evaluation.valid,
      invalidReasons: evaluation.reasons,
    };
}
