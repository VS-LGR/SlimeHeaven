"use client";

import { useGameUiStore } from "@/src/store/gameUiStore";
import { FISH, FISH_ID_LIST } from "@/src/simulation/data/fish";
import { starString } from "@/src/simulation/slimeAttributes";
import { fishingPhaseLabel } from "@/src/simulation/entities/FishingPresentation";
import { TopLeftStatus } from "./hud/TopLeftStatus";
import { TopRightResources } from "./hud/TopRightResources";
import { ActionToolbar } from "./hud/ActionToolbar";
import { WorldToolCursor } from "./hud/WorldToolCursor";
import { SlimeCard } from "./hud/SlimeCard";
import { useHudScale } from "./hud/useHudScale";
import { HUD_LAYOUT } from "./hud/hudLayout";

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
      data-hud-toolbar-applied={scale.toolbarApplied}
      data-hud-slime-applied={scale.slimeApplied}
      data-hud-scale-reason={scale.reason}
    >
      <TopLeftStatus />
      <TopRightResources />
      <ActionToolbar />
      <WorldToolCursor />
      <CollectionPanel />
      <SlimeCard />
      <ToastStack />
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
      style={{
        bottom:
          "calc(max(env(safe-area-inset-bottom, 0px), var(--hud-safe-y)) + var(--hud-toolbar-height) + var(--hud-gap))",
      }}
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

function ToastStack() {
  const fishingHud = useGameUiStore((state) => state.fishingHud);
  const catchToast = useGameUiStore((state) => state.catchToast);
  const jobToast = useGameUiStore((state) => state.jobToast);
  const slimeCardOpen = useGameUiStore((state) => Boolean(state.selectedSlimeId));
  if (!((fishingHud && fishingHud.phase !== "idle") || catchToast || jobToast)) {
    return null;
  }

  const cardShift = slimeCardOpen
    ? ` + (${HUD_LAYOUT.slimeCard.card.width}px * var(--hud-slime-scale)) + var(--hud-gap)`
    : "";

  return (
    <div
      className="pointer-events-none absolute z-10 flex w-44 flex-col-reverse gap-2"
      style={{
        left: `calc(max(env(safe-area-inset-left, 0px), var(--hud-safe-x))${cardShift})`,
        bottom:
          "calc(max(env(safe-area-inset-bottom, 0px), var(--hud-safe-y)) + var(--hud-toolbar-height) + var(--hud-gap))",
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

function catchHeadline(toast: { kind: "catch" | "bite"; isNew: boolean; slimeName: string | null }): string {
  if (toast.kind === "bite") {
    return `${(toast.slimeName ?? "SLIME").toUpperCase()} GOT A BITE!`;
  }
  if (toast.isNew) {
    return "NEW SPECIES!";
  }
  return `${(toast.slimeName ?? "SLIME").toUpperCase()} CAUGHT`;
}
