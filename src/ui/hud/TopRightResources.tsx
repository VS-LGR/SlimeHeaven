"use client";

import { useEffect, type MouseEvent, type PointerEvent } from "react";
import {
  HUD_ASSETS,
  TOP_RIGHT_COLLAPSE_FRAMES,
  TOP_RIGHT_COLLAPSE_STILL,
  TOP_RIGHT_EXPAND_FRAMES,
  UNAVAILABLE_HUD_VALUE,
} from "./hudAssets";
import {
  HUD_LAYOUT,
  TOP_RIGHT_TRANSITION,
  controlStyle,
  topRightHudInnerSize,
  topRightSequenceArtStyle,
  topRightTransitionDurationMs,
  type HudControlRect,
  type HudResourceGroupConfig,
} from "./hudLayout";
import { HudCard, HudSlot, HudSlotIcon, HudSlotLabel } from "./HudCard";
import { HudPngSequence } from "./HudPngSequence";
import { preloadHudImages } from "./hudPngSequenceTiming";
import { useGameUiStore } from "@/src/store/gameUiStore";
import {
  topRightHudIsTransitioning,
  topRightHudShowsResources,
  useTopRightHud,
} from "./useTopRightHud";

export function TopRightResources() {
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const food = useGameUiStore((state) => state.food);
  const layout = HUD_LAYOUT.topRight;
  const { state, minimize, expand, completeTransition } = useTopRightHud();
  const inner = topRightHudInnerSize(state);
  const transitioning = topRightHudIsTransitioning(state);
  const showResources = topRightHudShowsResources(state);
  const artStyle = topRightSequenceArtStyle();

  useEffect(() => {
    preloadHudImages([...TOP_RIGHT_COLLAPSE_FRAMES, ...TOP_RIGHT_EXPAND_FRAMES]);
  }, []);

  const sequenceFrames = state === "collapsing" ? TOP_RIGHT_COLLAPSE_FRAMES : TOP_RIGHT_EXPAND_FRAMES;
  const artworkNode = transitioning ? (
    <HudPngSequence
      key={state}
      frames={sequenceFrames}
      frameDurationMs={TOP_RIGHT_TRANSITION.frameDurationMs}
      durationMs={topRightTransitionDurationMs(sequenceFrames.length)}
      onComplete={completeTransition}
      style={artStyle}
    />
  ) : undefined;
  const artwork = transitioning
    ? undefined
    : state === "collapsed"
      ? TOP_RIGHT_COLLAPSE_STILL
      : HUD_ASSETS.topRight;

  return (
    <HudCard
      card={layout.card}
      scaleVar="--hud-right-scale"
      artwork={artwork}
      artworkNode={artworkNode}
      artworkStyle={state === "collapsed" ? artStyle : undefined}
      innerWidth={inner.width}
      innerHeight={inner.height}
      contentWidth={layout.card.width}
      contentHeight={layout.card.height}
      overflow={inner.overflow}
      visualState={state}
      panel="top-right"
      label="Resources"
    >
      {showResources ? (
        <>
          <ResourceGroup config={layout.wood} src={HUD_ASSETS.iconWood} label="Wood" value={String(wood)} />
          <ResourceGroup
            config={layout.stone}
            src={HUD_ASSETS.iconStone}
            label="Stone"
            value={String(stone)}
          />
          <ResourceGroup config={layout.food} src={HUD_ASSETS.iconFood} label="Food" value={String(food)} />
          <HarmonyIndicator />
          <CollapseControl rect={layout.collapseButton} onActivate={minimize} />
        </>
      ) : null}
      {state === "collapsed" ? (
        <ExpandControl rect={layout.collapsedExpandButton} onActivate={expand} />
      ) : null}
      {state === "expanded" || state === "collapsed" ? <SettingsGear /> : null}
    </HudCard>
  );
}

function HarmonyIndicator() {
  const layout = HUD_LAYOUT.topRight.harmony;
  return (
    <HudSlot
      name="harmony"
      slot={layout.slot}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        opacity: 0.78,
      }}
    >
      <div
        className="flex min-h-0 w-full min-w-0 items-center gap-1"
        data-harmony-indicator="true"
        aria-label="Harmony: unavailable"
      >
        <HudSlotIcon
          src={HUD_ASSETS.iconHarmony}
          image={layout.icon}
          name="harmony"
          opacity={0.85}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
          <HudSlotLabel text={layout.value} fill={false} opacity={0.9}>
            {UNAVAILABLE_HUD_VALUE}%
          </HudSlotLabel>
          <div
            data-harmony-bar="true"
            aria-hidden="true"
            className="w-full"
            style={{
              height: 7,
              borderRadius: 2,
              background: "#E8C48A",
              boxShadow: "inset 0 0 0 1px #6E3E2E",
            }}
          />
        </div>
      </div>
      <HudSlotLabel text={layout.label} fill={false}>
        Harmonia
      </HudSlotLabel>
    </HudSlot>
  );
}

function SettingsGear() {
  const layout = HUD_LAYOUT.topRight.settings;
  return (
    <HudSlot name="settings" slot={layout.slot} style={{ justifyContent: "center" }}>
      <button
        type="button"
        disabled
        aria-label="Configurações indisponíveis"
        className="pointer-events-none flex h-full w-full cursor-default items-center justify-center border-0 bg-transparent p-0"
      />
    </HudSlot>
  );
}

function CollapseControl({ rect, onActivate }: { rect: HudControlRect; onActivate: () => void }) {
  return (
    <HudToggleControl
      rect={rect}
      onActivate={onActivate}
      ariaLabel="Recolher barra de recursos"
      ariaExpanded="true"
      mark="collapse"
    >
      ‹
    </HudToggleControl>
  );
}

function ExpandControl({ rect, onActivate }: { rect: HudControlRect; onActivate: () => void }) {
  return (
    <HudToggleControl
      rect={rect}
      onActivate={onActivate}
      ariaLabel="Expandir barra de recursos"
      ariaExpanded="false"
      mark="expand"
    >
      ›
    </HudToggleControl>
  );
}

function HudToggleControl({
  rect,
  onActivate,
  ariaLabel,
  ariaExpanded,
  mark,
  children,
}: {
  rect: HudControlRect;
  onActivate: () => void;
  ariaLabel: string;
  ariaExpanded: "true" | "false";
  mark: "collapse" | "expand";
  children: string;
}) {
  const stop = (event: MouseEvent | PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      data-hud-toggle={mark}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      className="pointer-events-auto absolute flex cursor-pointer items-center justify-center border-0 p-0 font-mono"
      data-hud-interactive="true"
      style={{
        ...controlStyle(rect),
        fontSize: rect.iconSize,
        lineHeight: 1,
        color: "#3a2416",
        background: "#FBDDAF",
        boxShadow: "inset 0 0 0 1px #6E3E2E",
        borderRadius: 3,
      }}
      onPointerDown={stop}
      onClick={(event) => {
        stop(event);
        onActivate();
      }}
    >
      {children}
    </button>
  );
}

function ResourceGroup({
  config,
  src,
  label,
  value,
}: {
  config: HudResourceGroupConfig;
  src: string;
  label: string;
  value: string;
}) {
  return (
    <HudSlot name={label.toLowerCase()} slot={config.slot} style={{ gap: 4, paddingLeft: 2 }}>
      <HudSlotIcon src={src} image={config.icon} name={label.toLowerCase()} />
      <HudSlotLabel
        text={config.value}
        valueKey={label.toLowerCase()}
        ariaLabel={`${label}: ${value}`}
      >
        {value}
      </HudSlotLabel>
    </HudSlot>
  );
}
