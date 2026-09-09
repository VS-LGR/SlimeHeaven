"use client";

import { TILE_SIZE } from "@/src/world/constants";
import { useGameUiStore, type TileInspect } from "@/src/store/gameUiStore";

function coord(value: number | null): string {
  return value === null ? "—" : String(value);
}

export function DebugOverlay() {
  const debugVisible = useGameUiStore((state) => state.debugVisible);
  const fps = useGameUiStore((state) => state.fps);
  const cameraX = useGameUiStore((state) => state.cameraX);
  const cameraY = useGameUiStore((state) => state.cameraY);
  const zoom = useGameUiStore((state) => state.zoom);
  const hoveredX = useGameUiStore((state) => state.hoveredX);
  const hoveredY = useGameUiStore((state) => state.hoveredY);
  const selectedX = useGameUiStore((state) => state.selectedX);
  const selectedY = useGameUiStore((state) => state.selectedY);
  const hoveredTile = useGameUiStore((state) => state.hoveredTile);
  const selectedTile = useGameUiStore((state) => state.selectedTile);
  const mapWidth = useGameUiStore((state) => state.mapWidth);
  const mapHeight = useGameUiStore((state) => state.mapHeight);
  const simTps = useGameUiStore((state) => state.simTps);
  const slimeCount = useGameUiStore((state) => state.slimeCount);
  const availableTasks = useGameUiStore((state) => state.availableTasks);
  const assignedTasks = useGameUiStore((state) => state.assignedTasks);
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const food = useGameUiStore((state) => state.food);
  const farmTiles = useGameUiStore((state) => state.farmTiles);
  const growingCrops = useGameUiStore((state) => state.growingCrops);
  const readyCrops = useGameUiStore((state) => state.readyCrops);
  const hungrySlimes = useGameUiStore((state) => state.hungrySlimes);
  const starvingSlimes = useGameUiStore((state) => state.starvingSlimes);
  const activeRipples = useGameUiStore((state) => state.activeRipples);
  const activeFishShadows = useGameUiStore((state) => state.activeFishShadows);
  const waterSurfaceOn = useGameUiStore((state) => state.waterSurfaceOn);
  const waterAmbientOn = useGameUiStore((state) => state.waterAmbientOn);
  const waterDepthBoundsOn = useGameUiStore((state) => state.waterDepthBoundsOn);
  const fishingRadiusOverlayOn = useGameUiStore((state) => state.fishingRadiusOverlayOn);
  const interestPointOverlayOn = useGameUiStore((state) => state.interestPointOverlayOn);
  const aquaticActivities = useGameUiStore((state) => state.aquaticActivities);
  const shallowSpots = useGameUiStore((state) => state.shallowSpots);
  const deepSpots = useGameUiStore((state) => state.deepSpots);
  const fishingPhase = useGameUiStore((state) => state.fishingPhase);
  const fishingTargetId = useGameUiStore((state) => state.fishingTargetId);
  const fishingDebugSpecies = useGameUiStore((state) => state.fishingDebugSpecies);
  const fishingAssignedSlime = useGameUiStore((state) => state.fishingAssignedSlime);
  const fishingAccessPoint = useGameUiStore((state) => state.fishingAccessPoint);
  const fishingReservationOwner = useGameUiStore((state) => state.fishingReservationOwner);
  const fishingHookOwner = useGameUiStore((state) => state.fishingHookOwner);
  const fishingPresentation = useGameUiStore((state) => state.fishingPresentation);
  const fishingVisualDebug = useGameUiStore((state) => state.fishingVisualDebug);
  const ambientDebug = useGameUiStore((state) => state.ambientDebug);
  const fishingScores = useGameUiStore((state) => state.fishingScores);
  const fishingEligibility = useGameUiStore((state) => state.fishingEligibility);
  const fishingOpportunity = useGameUiStore((state) => state.fishingOpportunity);
  const farmPresentation = useGameUiStore((state) => state.farmPresentation);
  const buildingPlacementDebug = useGameUiStore((state) => state.buildingPlacementDebug);
  const waterBodyCount = useGameUiStore((state) => state.waterBodyCount);
  const accessPointCount = useGameUiStore((state) => state.accessPointCount);
  const selectedSlime = useGameUiStore((state) => state.selectedSlime);
  const visitorDebug = useGameUiStore((state) => state.visitorDebug);
  const debugActions = useGameUiStore((state) => state.debugActions);

  if (!debugVisible) {
    return null;
  }

  return (
    <aside
      className="pointer-events-auto absolute z-20 max-h-[calc(100dvh-12rem)] min-w-44 max-w-[16rem] overflow-y-auto overscroll-contain rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg"
      style={{
        left: "max(env(safe-area-inset-left, 0px), var(--hud-safe-x))",
        top: "calc(max(env(safe-area-inset-top, 0px), var(--hud-safe-y)) + var(--hud-left-panel-height) + var(--hud-gap))",
      }}
      onWheel={(event) => event.stopPropagation()}
    >
      <p className="mb-1 tracking-widest text-lime-300">DEBUG</p>
      {debugActions ? (
        <div className="mb-2 flex flex-col gap-1 border-b border-white/10 pb-2">
          <DebugButton label="Gather wood" onClick={debugActions.spawnGatherWood} />
          <DebugButton label="Gather stone" onClick={debugActions.spawnGatherStone} />
          <DebugButton label="Clear tasks" onClick={debugActions.clearTasks} />
          <DebugButton label="Reset slimes" onClick={debugActions.resetSlimes} />
          <DebugButton label="Add test resource" onClick={debugActions.addTestResource} />
          <DebugButton label="Add food" onClick={debugActions.addFood} />
          <DebugButton label="Set all slimes hungry" onClick={debugActions.setAllSlimesHungry} />
          <DebugButton label="Instant grow crops" onClick={debugActions.instantGrowCrops} />
          <DebugButton label="Clear farms" onClick={debugActions.clearFarms} />
          <DebugButton label="Spawn ripple" onClick={debugActions.spawnWaterRipple} />
          <DebugButton label="Spawn fish shadow" onClick={debugActions.spawnFishShadow} />
          <DebugButton
            label={waterSurfaceOn ? "Water surface off" : "Water surface on"}
            onClick={debugActions.toggleWaterSurface}
          />
          <DebugButton
            label={waterAmbientOn ? "Ambient water off" : "Ambient water on"}
            onClick={debugActions.toggleAmbientWaterFx}
          />
          <DebugButton
            label={waterDepthBoundsOn ? "Depth bounds off" : "Show water depth bounds"}
            onClick={debugActions.toggleWaterDepthBounds}
          />
          <DebugButton label="Spawn Blue Darter" onClick={debugActions.spawnBlueDarter} />
          <DebugButton label="Spawn Pond Carp" onClick={debugActions.spawnPondCarp} />
          <DebugButton label="Spawn Moon Glimmer" onClick={debugActions.spawnMoonGlimmer} />
          <DebugButton label="Clear activities" onClick={debugActions.clearAquaticActivities} />
          <DebugButton label="Force bite" onClick={debugActions.forceFishingBite} />
          <DebugButton label="Auto catch" onClick={debugActions.autoSucceedFishing} />
          <DebugButton label="Reset collection" onClick={debugActions.resetFishCollection} />
          <DebugButton
            label={fishingRadiusOverlayOn ? "Radius overlay off" : "Show fishing radius"}
            onClick={debugActions.toggleFishingRadiusOverlay}
          />
          <DebugButton
            label={interestPointOverlayOn ? "Interest overlay off" : "Show interest points"}
            onClick={debugActions.toggleInterestPointOverlay}
          />
          <DebugButton label="Force Pingo observe water" onClick={debugActions.forcePingoObserveWater} />
          <DebugButton label="Force Momo inspect farm" onClick={debugActions.forceMomoInspectFarm} />
          <DebugButton label="Force Tito inspect nature" onClick={debugActions.forceTitoInspectNature} />
          <DebugButton label="Force social greet" onClick={debugActions.forceSocialGreet} />
          <DebugButton label="Clear ambient" onClick={debugActions.clearAmbientBehaviors} />
          <DebugButton label="Spawn Lily visitor (debug)" onClick={debugActions.spawnLilyVisitor} />
        </div>
      ) : null}
      <div>
        <p>FPS: {fps}</p>
        <p>
          Camera: {cameraX}, {cameraY}
        </p>
        <p>Zoom: {zoom}x</p>
        <p>Sim TPS: {simTps}</p>
        <p className="mt-1 text-lime-300">Hovered:</p>
        <p>X: {coord(hoveredX)}</p>
        <p>Y: {coord(hoveredY)}</p>
        <TileInspectLines inspect={hoveredTile} />
        <p className="mt-1 text-lime-300">Selected:</p>
        <p>X: {coord(selectedX)}</p>
        <p>Y: {coord(selectedY)}</p>
        <TileInspectLines inspect={selectedTile} />
        <p className="mt-1">
          Map: {mapWidth} × {mapHeight}
        </p>
        <p>TILE_SIZE: {TILE_SIZE}</p>
        <p className="mt-1">Slimes: {slimeCount}</p>
        <p>
          Tasks avail/busy: {availableTasks}/{assignedTasks}
        </p>
        <p>
          Wood: {wood} · Stone: {stone} · Food: {food}
        </p>
        <p className="mt-1 text-lime-300">Farming</p>
        <p>Farm tiles: {farmTiles}</p>
        {farmPresentation ? (
          <>
            <p className="mt-1 text-lime-300">Farm presentation</p>
            <p>{farmPresentation}</p>
          </>
        ) : null}
        <p>Growing crops: {growingCrops}</p>
        <p>Ready crops: {readyCrops}</p>
        <p className="mt-1 text-lime-300">Buildings</p>
        {buildingPlacementDebug ? (
          <>
            <p>buildMode: {String(buildingPlacementDebug.buildMode)}</p>
            <p>buildingType: {buildingPlacementDebug.buildingType}</p>
            <p>
              cost: {buildingPlacementDebug.costWood},{buildingPlacementDebug.costStone}
            </p>
            <p>affordable: {String(buildingPlacementDebug.affordable)}</p>
            <p>footprintOrigin: {buildingPlacementDebug.footprintOrigin}</p>
            <p>footprint: {buildingPlacementDebug.footprint}</p>
            <p>entranceTile: {buildingPlacementDebug.entranceTile}</p>
            <p>placementValid: {String(buildingPlacementDebug.placementValid)}</p>
            <p>
              invalidReasons: [
              {buildingPlacementDebug.invalidReasons.join(", ")}]
            </p>
          </>
        ) : (
          <p>buildMode: false</p>
        )}
        <p>Hungry slimes: {hungrySlimes}</p>
        <p>Starving slimes: {starvingSlimes}</p>
        {selectedSlime ? (
          <>
            <p className="mt-1 text-lime-300">Selected slime</p>
            <p>{selectedSlime.name}</p>
            <p>{selectedSlime.capabilitiesDebug}</p>
            {selectedSlime.constructionActivity ? (
              <>
                <p>activity: {selectedSlime.constructionActivity}</p>
                <p>constructionSiteId: {selectedSlime.constructionSiteId ?? "—"}</p>
                <p>capabilityEligible: {String(selectedSlime.constructionCapabilityEligible)}</p>
                <p>presentation: {selectedSlime.constructionPresentation ?? "—"}</p>
                <p>tool: {selectedSlime.constructionTool ?? "none"}</p>
              </>
            ) : null}
            {selectedSlime.residencyStatus ? (
              <>
                <p>residencyStatus: {selectedSlime.residencyStatus}</p>
                <p>homeBuildingType: {selectedSlime.homeBuildingType ?? "—"}</p>
                <p>homeBuildingId: {selectedSlime.homeBuildingId ?? "—"}</p>
                <p>homeStatus: {selectedSlime.homeStatus ?? "—"}</p>
                <p>homeEntranceTile: {selectedSlime.homeEntranceTile ?? "—"}</p>
                {selectedSlime.visitorIntent ? (
                  <>
                    <p>visitorIntent: {selectedSlime.visitorIntent}</p>
                    <p>eligibleForJobs: {String(selectedSlime.eligibleForJobs)}</p>
                    <p>needsActive: {String(selectedSlime.needsActive)}</p>
                    <p>consumesFood: {String(selectedSlime.consumesFood)}</p>
                    <p>currentAnimation: {selectedSlime.currentAnimation ?? "—"}</p>
                    <p>activeSpecialistAnimation: {selectedSlime.activeSpecialistAnimation ?? "none"}</p>
                  </>
                ) : null}
              </>
            ) : null}
            <p>
              TECH {selectedSlime.technique} STR {selectedSlime.strength} INST {selectedSlime.instinct}{" "}
              LUCK {selectedSlime.luck}
            </p>
          </>
        ) : null}
        <p className="mt-1 text-lime-300">Water VFX</p>
        <p>Ripples: {activeRipples}</p>
        <p>Fish shadows: {activeFishShadows}</p>
        <p>Surface: {waterSurfaceOn ? "on" : "off"}</p>
        <p>Ambient: {waterAmbientOn ? "on" : "off"}</p>
        <p>Depth bounds: {waterDepthBoundsOn ? "on" : "off"}</p>
        <p className="mt-1 text-lime-300">Fishing</p>
        <p>Activities: {aquaticActivities}</p>
        <p>
          Spots shallow/deep: {shallowSpots}/{deepSpots}
        </p>
        <p>
          Bodies/access: {waterBodyCount}/{accessPointCount}
        </p>
        <p>Session: {fishingPhase}</p>
        <p>Presentation: {fishingPresentation ?? "—"}</p>
        <p>Visual: {fishingVisualDebug ?? "—"}</p>
        <p>Opportunity: {fishingOpportunity ?? "—"}</p>
        <p>Assigned: {fishingAssignedSlime ?? "—"}</p>
        <p>Access: {fishingAccessPoint ?? "—"}</p>
        <p>Access reserved: {fishingReservationOwner ?? "—"}</p>
        <p>Hook UI: {fishingHookOwner ?? "—"}</p>
        <p>Target: {fishingTargetId ?? "—"}</p>
        <p>Species: {fishingDebugSpecies ?? "—"}</p>
        {fishingScores.length > 0 ? <p>Scores: {fishingScores.join(" / ")}</p> : null}
        {fishingEligibility.length > 0 ? (
          <>
            <p className="mt-1 text-lime-300">Fishing candidates</p>
            {fishingEligibility.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </>
        ) : null}
        <p>Radius overlay: {fishingRadiusOverlayOn ? "on" : "off"}</p>
        <p className="mt-1 text-lime-300">Ambient</p>
        {ambientDebug.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {visitorDebug.length > 0 ? (
          <>
            <p className="mt-1 text-lime-300">Visitor (debug)</p>
            {visitorDebug.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </>
        ) : null}
      </div>
    </aside>
  );
}

function TileInspectLines({ inspect }: { inspect: TileInspect | null }) {
  if (!inspect) {
    return null;
  }
  return (
    <>
      <p>Terrain: {inspect.terrain}</p>
      <p>Variant: {inspect.grassVariant ?? "—"}</p>
      <p>Detail: {inspect.detail ?? "—"}</p>
      <p>Farming: {inspect.farming}</p>
      <p>Farm: {inspect.farm ? "YES" : "NO"}</p>
      {inspect.farm ? (
        <>
          <p>State: {inspect.farmState}</p>
          <p>soilVisual: {inspect.soilVisual ?? "—"}</p>
          <p>crop: {inspect.cropId ?? "none"}</p>
          <p>cropStage: {inspect.cropStage ?? "none"}</p>
          <p>growthProgress: {inspect.growthProgress ?? 0}</p>
          <p>Crop: {inspect.crop ?? "—"}</p>
          <p>Growth: {inspect.growthPercent ?? 0}%</p>
          <p>Task: {inspect.farmTask ?? "None"}</p>
        </>
      ) : null}
      <p>Object: {inspect.object ?? "—"}</p>
      {inspect.buildingId ? (
        <>
          <p>buildingId: {inspect.buildingId}</p>
          <p>buildingType: {inspect.buildingType}</p>
          <p>footprintOrigin: {inspect.buildingFootprintOrigin}</p>
          <p>footprint: {inspect.buildingFootprint}</p>
          <p>entranceTile: {inspect.buildingEntranceTile}</p>
          <p>residentTypeId: {inspect.residentTypeId ?? "—"}</p>
          <p>uniqueHome: {inspect.uniqueHome == null ? "—" : String(inspect.uniqueHome)}</p>
          <p>startingHome: {inspect.startingHome == null ? "—" : String(inspect.startingHome)}</p>
          <p>homeStatus: {inspect.homeStatus ?? "—"}</p>
        </>
      ) : null}
      {inspect.constructionSiteId ? (
        <>
          <p>constructionSiteId: {inspect.constructionSiteId}</p>
          <p>buildingType: {inspect.constructionBuildingType}</p>
          <p>status: {inspect.constructionStatus}</p>
          <p>workCompletedMs: {inspect.constructionWorkCompletedMs}</p>
          <p>workRequiredMs: {inspect.constructionWorkRequiredMs}</p>
          <p>progressPercent: {inspect.constructionProgressPercent}</p>
          <p>assignedSlimeId: {inspect.constructionAssignedSlimeId ?? "—"}</p>
          <p>taskId: {inspect.constructionTaskId ?? "—"}</p>
          <p>footprintOrigin: {inspect.constructionFootprintOrigin}</p>
          <p>entranceTile: {inspect.constructionEntranceTile}</p>
        </>
      ) : null}
      <p>
        Walk/build: {inspect.walkable ? "yes" : "no"} / {inspect.buildable ? "yes" : "no"}
      </p>
      {inspect.terrain === "water" ? (
        <>
          <p>Shore Mask: {inspect.shoreMask ?? "none"}</p>
          <p>Shore Visual: {inspect.shoreVisual ?? "—"}</p>
          <p>Depth: {inspect.waterDepth ?? "—"}</p>
        </>
      ) : null}
    </>
  );
}

function DebugButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="w-full rounded border border-lime-300/30 bg-lime-950/80 px-2 py-0.5 text-left text-lime-100 hover:bg-lime-900"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
