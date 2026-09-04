"use client";

import { useGameUiStore, type WorldToolMode } from "@/src/store/gameUiStore";
import { SATIETY_MAX } from "@/src/simulation/needsConfig";
import { FISH, FISH_ID_LIST } from "@/src/simulation/data/fish";
import { starString } from "@/src/simulation/slimeAttributes";
import { fishingPhaseLabel } from "@/src/simulation/entities/FishingPresentation";
import { BUILDINGS, type BuildingTypeId } from "@/src/simulation/data/buildings";

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
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const food = useGameUiStore((state) => state.food);
  const worldTool = useGameUiStore((state) => state.worldTool);
  const setWorldTool = useGameUiStore((state) => state.setWorldTool);
  const selectedBuildingTypeId = useGameUiStore((state) => state.selectedBuildingTypeId);
  const setSelectedBuildingTypeId = useGameUiStore((state) => state.setSelectedBuildingTypeId);
  const availableBuildingTypeIds = useGameUiStore((state) => state.availableBuildingTypeIds);
  const selectedSlime = useGameUiStore((state) => state.selectedSlime);
  const collectionOpen = useGameUiStore((state) => state.collectionOpen);
  const toggleCollection = useGameUiStore((state) => state.toggleCollection);
  const fishCollection = useGameUiStore((state) => state.fishCollection);
  const fishingHud = useGameUiStore((state) => state.fishingHud);
  const catchToast = useGameUiStore((state) => state.catchToast);
  const jobToast = useGameUiStore((state) => state.jobToast);

  return (
    <>
      <div className="pointer-events-auto absolute left-1/2 top-3 z-10 flex max-w-[calc(100dvw-1.5rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-[11px] text-lime-100 shadow-lg">
        <span>Wood {wood}</span>
        <span className="text-white/30">·</span>
        <span>Stone {stone}</span>
        <span className="text-white/30">·</span>
        <span>Food {food}</span>
        <span className="mx-1 text-white/30">|</span>
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

      {collectionOpen ? (
        <aside className="pointer-events-none absolute left-1/2 top-12 z-10 min-w-44 -translate-x-1/2 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg">
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
      ) : null}

      {selectedSlime ? (
        <aside className="pointer-events-none absolute right-3 top-3 z-10 min-w-40 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg">
          <p className="mb-1 tracking-widest text-lime-300">{selectedSlime.name.toUpperCase()}</p>
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
        </aside>
      ) : null}

      {(fishingHud && fishingHud.phase !== "idle") || catchToast || jobToast ? (
        <div className="pointer-events-none absolute bottom-8 left-3 z-10 flex w-44 flex-col-reverse gap-2">
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
      ) : null}
    </>
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
