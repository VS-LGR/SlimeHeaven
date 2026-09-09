"use client";

import { useGameUiStore, type WorldToolMode } from "@/src/store/gameUiStore";
import { SATIETY_MAX } from "@/src/simulation/needsConfig";
import { FISH, FISH_ID_LIST } from "@/src/simulation/data/fish";
import { starString } from "@/src/simulation/slimeAttributes";
import { fishingPhaseLabel } from "@/src/simulation/entities/FishingPresentation";
import { BUILDINGS, type BuildingTypeId } from "@/src/simulation/data/buildings";
import { TopLeftStatus } from "./hud/TopLeftStatus";
import { TopRightResources } from "./hud/TopRightResources";
import { useHudScale } from "./hud/useHudScale";

function conditionLabel(hunger: string): string {
  if (hunger === "fed") {
    return "Fed";
  }
  if (hunger === "normal") {
    return "Normal";
  }
  if (hunger === "hungry") {
    return "Hungry";
  }
  if (hunger === "starving") {
    return "Starving";
  }
  return hunger;
}

export function GameHud() {
  const { layerRef, scale } = useHudScale();

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-10 m-0 h-full w-full overflow-hidden p-0"
      data-hud-root="true"
      data-hud-screen-layer="true"
      data-hud-requested-scale={scale.requestedGlobal}
      data-hud-left-applied={scale.leftApplied}
      data-hud-right-applied={scale.rightApplied}
      data-hud-scale-reason={scale.reason}
    >
      <TopLeftStatus />
      <TopRightResources />
      <WorldTools />
      <CollectionPanel />
      <SelectedSlimePanel />
      <ToastStack />
    </div>
  );
}

function WorldTools() {
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const worldTool = useGameUiStore((state) => state.worldTool);
  const setWorldTool = useGameUiStore((state) => state.setWorldTool);
  const selectedBuildingTypeId = useGameUiStore((state) => state.selectedBuildingTypeId);
  const setSelectedBuildingTypeId = useGameUiStore((state) => state.setSelectedBuildingTypeId);
  const availableBuildingTypeIds = useGameUiStore((state) => state.availableBuildingTypeIds);
  const collectionOpen = useGameUiStore((state) => state.collectionOpen);
  const toggleCollection = useGameUiStore((state) => state.toggleCollection);

  return (
    <div
      className="pointer-events-auto absolute left-1/2 z-10 flex max-w-[calc(100dvw-1.5rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-[11px] text-lime-100 shadow-lg"
      style={{ bottom: "max(16px, var(--hud-safe-y))" }}
      data-hud-panel="world-tools"
    >
      <ToolButton
        label="Farm"
        active={worldTool === "designate"}
        onClick={() => setWorldTool(toggleTool(worldTool, "designate"))}
      />
      <ToolButton
        label="Remove Farm"
        active={worldTool === "remove"}
        onClick={() => setWorldTool(toggleTool(worldTool, "remove"))}
      />
      <ToolButton
        label="Fish"
        active={worldTool === "fish"}
        onClick={() => setWorldTool(toggleTool(worldTool, "fish"))}
      />
      <ToolButton
        label="Build"
        active={worldTool === "build"}
        onClick={() => setWorldTool(toggleTool(worldTool, "build"))}
      />
      {worldTool === "build" && availableBuildingTypeIds.length === 0 ? (
        <span className="text-lime-100/80">No building plans available</span>
      ) : null}
      {worldTool === "build"
        ? availableBuildingTypeIds.map((typeId) => {
            const def = BUILDINGS[typeId];
            const affordable = wood >= def.cost.wood && stone >= def.cost.stone;
            return (
              <ToolButton
                key={typeId}
                label={def.name}
                subtitle={`${def.cost.wood} Wood · ${def.cost.stone} Stone`}
                active={selectedBuildingTypeId === typeId}
                muted={!affordable}
                onClick={() => setSelectedBuildingTypeId(typeId)}
              />
            );
          })
        : null}
      {worldTool === "build" && availableBuildingTypeIds.length > 0 ? (
        <BuildAffordHint typeId={selectedBuildingTypeId} wood={wood} stone={stone} />
      ) : null}
      <ToolButton label="Collection" active={collectionOpen} onClick={toggleCollection} />
    </div>
  );
}

function CollectionPanel() {
  const collectionOpen = useGameUiStore((state) => state.collectionOpen);
  const fishCollection = useGameUiStore((state) => state.fishCollection);
  if (!collectionOpen) {
    return null;
  }
  return (
    <aside
      className="pointer-events-none absolute left-1/2 z-10 min-w-44 -translate-x-1/2 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg"
      style={{ bottom: "calc(max(16px, var(--hud-safe-y)) + 48px)" }}
    >
      <p className="mb-1 tracking-widest text-lime-300">COLLECTION</p>
      {FISH_ID_LIST.map((id) => {
        const entry = fishCollection[id];
        if (!entry?.discovered) {
          return <p key={id}>???</p>;
        }
        return (
          <p key={id}>
            {FISH[id].name} ×{entry.caughtCount}
          </p>
        );
      })}
    </aside>
  );
}

function SelectedSlimePanel() {
  const selectedSlime = useGameUiStore((state) => state.selectedSlime);
  const hudActions = useGameUiStore((state) => state.hudActions);
  if (!selectedSlime) {
    return null;
  }

  const visitorPanel =
    selectedSlime.residencyStatus === "visitor" ||
    selectedSlime.residencyStatus === "invited_waiting_for_house";

  return (
    <aside
      className="pointer-events-none absolute z-10 min-w-40 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg"
      data-hud-panel="slime"
      style={{
        right: "max(env(safe-area-inset-right, 0px), var(--hud-safe-x))",
        top: "calc(max(env(safe-area-inset-top, 0px), var(--hud-safe-y)) + var(--hud-right-panel-height) + var(--hud-gap))",
      }}
    >
      <p className="mb-1 tracking-widest text-lime-300">{selectedSlime.name.toUpperCase()}</p>
      {visitorPanel ? (
        selectedSlime.residencyStatus === "visitor" ? (
          <>
            <p>Visitor</p>
            {selectedSlime.visitorInterestLabel ? <p>{selectedSlime.visitorInterestLabel}</p> : null}
            <button
              type="button"
              className="pointer-events-auto mt-1 w-full rounded border border-lime-300/30 bg-lime-950/80 px-2 py-0.5 text-left text-lime-100 hover:bg-lime-900"
              onClick={() => hudActions?.inviteSelectedVisitor()}
            >
              Invite
            </button>
          </>
        ) : (
          <>
            <p>Invited</p>
            <p>Waiting for her house plan</p>
          </>
        )
      ) : (
        <>
          {selectedSlime.specialties.length > 0 ? (
            <>
              <p className="tracking-widest text-lime-300">SPECIALTIES</p>
              {selectedSlime.specialties.map((label) => (
                <p key={label}>{label}</p>
              ))}
            </>
          ) : null}
          <p>State: {selectedSlime.state}</p>
          <p>Task: {selectedSlime.taskLabel}</p>
          <p>
            Satiety: {selectedSlime.satiety} / {SATIETY_MAX}
          </p>
          <p>Condition: {conditionLabel(selectedSlime.hungerState)}</p>
          <p>Technique {starString(selectedSlime.technique)}</p>
          <p>Strength {starString(selectedSlime.strength)}</p>
          <p>Instinct {starString(selectedSlime.instinct)}</p>
          <p>Luck {starString(selectedSlime.luck)}</p>
          <p>Carrying: {selectedSlime.carrying}</p>
          <p>
            Position: {selectedSlime.tileX}, {selectedSlime.tileY}
          </p>
          <p>Visual: {selectedSlime.visual}</p>
          <p>Animation: {selectedSlime.anim}</p>
        </>
      )}
    </aside>
  );
}

function ToastStack() {
  const fishingHud = useGameUiStore((state) => state.fishingHud);
  const catchToast = useGameUiStore((state) => state.catchToast);
  const jobToast = useGameUiStore((state) => state.jobToast);
  if (!((fishingHud && fishingHud.phase !== "idle") || catchToast || jobToast)) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-10 flex w-44 flex-col-reverse gap-2"
      style={{
        left: "max(env(safe-area-inset-left, 0px), var(--hud-safe-x))",
        bottom: "calc(max(16px, var(--hud-safe-y)) + 48px)",
      }}
    >
      {fishingHud && fishingHud.phase !== "idle" ? (
        <div className="rounded border border-white/20 bg-black/80 px-2 py-2 font-mono text-[11px] text-lime-100">
          <p className="text-center tracking-widest text-lime-300">
            {(fishingHud.slimeName ?? "SLIME").toUpperCase()}
          </p>
          <p className="mb-1 text-center text-lime-100">{fishingPhaseLabel(fishingHud.presentation)}</p>
          <p className="mb-1 text-center text-white/70">
            TECH {starString(fishingHud.technique)} · STR {starString(fishingHud.strength)} · INST{" "}
            {starString(fishingHud.instinct)}
          </p>
          {fishingHud.phase === "fighting" ? (
            <>
              <div className="relative h-3 w-full border border-white/40 bg-black">
                <div
                  className="absolute top-0 h-full bg-lime-700"
                  style={{
                    left: `${fishingHud.zoneStart * 100}%`,
                    width: `${fishingHud.zoneWidth * 100}%`,
                  }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${fishingHud.marker * 100}%` }}
                />
              </div>
              <p className="mt-1 text-center text-white/70">Click / Space</p>
            </>
          ) : null}
          {fishingHud.lastStrike === "perfect" ? (
            <p className="mt-1 text-center text-lime-300">PERFECT</p>
          ) : null}
          {fishingHud.lastStrike === "hit" ? (
            <p className="mt-1 text-center text-lime-200">SUCCESS</p>
          ) : null}
          {fishingHud.lastStrike === "miss" ? (
            <p className="mt-1 text-center text-rose-300">FAILURE</p>
          ) : null}
        </div>
      ) : null}
      {catchToast ? (
        <div className="rounded border border-lime-300/40 bg-black/80 px-3 py-2 font-mono text-[11px] text-lime-100">
          <p className="text-center tracking-widest text-lime-300">{catchHeadline(catchToast)}</p>
          <p className="text-center">{catchToast.name}</p>
          {catchToast.kind === "catch" && catchToast.slimeName ? (
            <p className="text-center text-white/70">Caught by {catchToast.slimeName}</p>
          ) : null}
        </div>
      ) : null}
      {jobToast ? (
        <div className="rounded border border-white/25 bg-black/80 px-3 py-2 font-mono text-[11px] text-lime-100">
          <p className="text-center">{jobToast.message}</p>
        </div>
      ) : null}
    </div>
  );
}

function toggleTool(current: WorldToolMode, next: WorldToolMode): WorldToolMode {
  return current === next ? "off" : next;
}

function catchHeadline(toast: { kind: "catch" | "bite"; isNew: boolean; slimeName: string | null }): string {
  if (toast.kind === "bite") {
    return `${(toast.slimeName ?? "SLIME").toUpperCase()} GOT A BITE!`;
  }
  if (toast.isNew) {
    return "NEW SPECIES!";
  }
  return `${(toast.slimeName ?? "SLIME").toUpperCase()} CAUGHT`;
}

function BuildAffordHint({
  typeId,
  wood,
  stone,
}: {
  typeId: BuildingTypeId;
  wood: number;
  stone: number;
}) {
  const cost = BUILDINGS[typeId].cost;
  const missing: string[] = [];
  if (wood < cost.wood) {
    missing.push("wood");
  }
  if (stone < cost.stone) {
    missing.push("stone");
  }
  if (missing.length === 0) {
    return null;
  }
  return (
    <span className="text-rose-200">
      Need {missing.join(" and ")}
    </span>
  );
}

function ToolButton({
  label,
  subtitle,
  active,
  muted,
  onClick,
}: {
  label: string;
  subtitle?: string;
  active: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded border px-2 py-0.5 leading-tight ${
        active
          ? "border-lime-300/70 bg-lime-800 text-lime-50"
          : "border-lime-300/30 bg-lime-950/80 text-lime-100 hover:bg-lime-900"
      } ${muted ? "opacity-60" : ""}`}
      onClick={onClick}
    >
      <span className="block">{label}</span>
      {subtitle ? <span className="block text-[10px] text-lime-100/80">{subtitle}</span> : null}
    </button>
  );
}
