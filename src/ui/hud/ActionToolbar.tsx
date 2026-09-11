/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
"use client";

import type { MouseEvent, PointerEvent } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { BUILDINGS, type BuildingTypeId } from "@/src/simulation/data/buildings";
import { HUD_ASSETS } from "./hudAssets";
import {
  HUD_LAYOUT,
  actionToolbarBaseSize,
  toolbarHitboxStyle,
  toolbarIconStyle,
  toolbarSelectedStyle,
  type ActionToolLayoutId,
} from "./hudLayout";
import { ACTION_TOOLS, isActionToolSelected, toggleWorldTool, type ActionToolDef } from "./actionTools";

const toolbar = HUD_LAYOUT.actionToolbar;
const chrome = toolbar.chrome;
const PIXEL = { imageRendering: "pixelated" as const };

function stopHudPointer(event: MouseEvent | PointerEvent): void {
  event.stopPropagation();
}

export function ActionToolbar() {
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const worldTool = useGameUiStore((state) => state.worldTool);
  const setWorldTool = useGameUiStore((state) => state.setWorldTool);
  const selectedBuildingTypeId = useGameUiStore((state) => state.selectedBuildingTypeId);
  const setSelectedBuildingTypeId = useGameUiStore((state) => state.setSelectedBuildingTypeId);
  const availableBuildingTypeIds = useGameUiStore((state) => state.availableBuildingTypeIds);
  const collectionOpen = useGameUiStore((state) => state.collectionOpen);
  const toggleCollection = useGameUiStore((state) => state.toggleCollection);

  const farmFamily = worldTool === "designate" || worldTool === "remove";
  const buildOpen = worldTool === "build";
  const stack = actionToolbarBaseSize();

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-10"
      data-hud-panel="world-tools"
      data-hud-toolbar="true"
      style={{
        bottom: "max(env(safe-area-inset-bottom, 0px), var(--hud-safe-y))",
        width: `calc(${stack.width}px * var(--hud-toolbar-scale))`,
        height: `calc(${stack.height}px * var(--hud-toolbar-scale))`,
        transform: "translateX(-50%)",
      }}
    >
      <div
        data-hud-toolbar-inner="true"
        data-hud-inner-width={stack.width}
        data-hud-inner-height={stack.height}
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: 0,
          width: stack.width,
          height: stack.height,
          marginLeft: -stack.width / 2,
          transform: "scale(var(--hud-toolbar-scale))",
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 flex items-center"
          data-hud-toolbar-secondary="true"
          style={{
            top: 0,
            width: toolbar.card.width,
            height: toolbar.secondary.height,
            gap: 6,
          }}
        >
          {farmFamily ? (
            <SecondaryChip
              label="Remove Farm"
              selected={worldTool === "remove"}
              onActivate={() => setWorldTool(toggleWorldTool(worldTool, "remove"))}
            />
          ) : null}
          {buildOpen && availableBuildingTypeIds.length === 0 ? (
            <span
              className="font-mono whitespace-nowrap"
              style={{
                color: chrome.ink,
                fontSize: 11,
                opacity: 0.8,
                textShadow: "0 1px 0 rgba(251,221,175,0.85)",
              }}
            >
              No building plans available
            </span>
          ) : null}
          {buildOpen
            ? availableBuildingTypeIds.map((typeId) => {
                const def = BUILDINGS[typeId];
                const affordable = wood >= def.cost.wood && stone >= def.cost.stone;
                return (
                  <SecondaryChip
                    key={typeId}
                    label={def.name}
                    subtitle={`${def.cost.wood} Wood · ${def.cost.stone} Stone`}
                    selected={selectedBuildingTypeId === typeId}
                    muted={!affordable}
                    onActivate={() => setSelectedBuildingTypeId(typeId)}
                  />
                );
              })
            : null}
          {buildOpen && availableBuildingTypeIds.length > 0 ? (
            <BuildAffordHint typeId={selectedBuildingTypeId} wood={wood} stone={stone} />
          ) : null}
          <div className="ml-auto">
            <SecondaryChip label="Collection" selected={collectionOpen} onActivate={toggleCollection} />
          </div>
        </div>

        <div
          className="pointer-events-auto absolute left-0"
          data-hud-toolbar-card="true"
          data-hud-interactive="true"
          style={{
            top: toolbar.secondary.height + toolbar.secondary.gap,
            width: toolbar.card.width,
            height: toolbar.card.height,
          }}
          onPointerDown={stopHudPointer}
          onClick={stopHudPointer}
        >
          <img
            src={HUD_ASSETS.toolbar}
            alt=""
            draggable={false}
            aria-hidden="true"
            data-hud-toolbar-art="true"
            className="pointer-events-none absolute inset-0 block h-full w-full max-w-none"
            style={PIXEL}
          />
          {ACTION_TOOLS.map((tool, index) => (
            <ActionToolSlot
              key={tool.id}
              tool={tool}
              index={index}
              selected={isActionToolSelected(worldTool, tool)}
              unavailable={tool.id === "build" && availableBuildingTypeIds.length === 0 && buildOpen}
              onActivate={() => setWorldTool(toggleWorldTool(worldTool, tool.worldTool))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionToolSlot({
  tool,
  index,
  selected,
  unavailable,
  onActivate,
}: {
  tool: ActionToolDef;
  index: number;
  selected: boolean;
  unavailable?: boolean;
  onActivate: () => void;
}) {
  const slot = toolbar.slots[index]!;
  const presentation = toolbar.icons[tool.id as ActionToolLayoutId];
  const iconStyle = toolbarIconStyle(slot, presentation);
  const selectedStyle = toolbarSelectedStyle(slot);

  return (
    <button
      type="button"
      aria-label={tool.label}
      aria-pressed={selected}
      title={tool.tooltip}
      data-hud-action={tool.id}
      data-hud-toolbar-slot={index + 1}
      data-hud-tool-selected={selected ? "true" : "false"}
      data-hud-interactive="true"
      className="group absolute cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E3E2E]/70"
      style={{
        ...toolbarHitboxStyle(slot),
        zIndex: 2,
        opacity: unavailable ? 0.7 : 1,
      }}
      onPointerDown={stopHudPointer}
      onClick={(event) => {
        stopHudPointer(event);
        onActivate();
      }}
    >
      {selected ? (
        <img
          src={HUD_ASSETS.toolbarSelected}
          alt=""
          draggable={false}
          aria-hidden="true"
          data-hud-selected-overlay="true"
          data-hud-selected-slot={index + 1}
          className="pointer-events-none absolute block max-w-none"
          style={{
            ...PIXEL,
            left: 0,
            top: 0,
            width: selectedStyle.width,
            height: selectedStyle.height,
            zIndex: 0,
          }}
        />
      ) : null}
      <img
        src={tool.icon}
        alt=""
        data-hud-action-icon={tool.id}
        draggable={false}
        className="pointer-events-none absolute max-w-none group-hover:brightness-110 group-focus-visible:brightness-110"
        style={{
          ...PIXEL,
          left: iconStyle.left - slot.x,
          top: iconStyle.top - slot.y,
          width: iconStyle.width,
          height: iconStyle.height,
          zIndex: 1,
        }}
      />
      <span
        className="pointer-events-none absolute z-20 whitespace-nowrap font-mono opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          ...(index === ACTION_TOOLS.length - 1
            ? {
                right: `calc(100% + ${toolbar.tooltipOffset}px)`,
                top: "50%",
                transform: "translateY(-50%)",
              }
            : {
                left: "50%",
                bottom: `calc(100% + ${toolbar.tooltipOffset}px)`,
                transform: "translateX(-50%)",
              }),
          background: chrome.cream,
          color: chrome.ink,
          boxShadow: `inset 0 0 0 1px ${chrome.wood}`,
          borderRadius: 3,
          fontSize: 11,
          fontWeight: 700,
          padding: "3px 6px",
        }}
      >
        {tool.tooltip}
      </span>
    </button>
  );
}

function SecondaryChip({
  label,
  subtitle,
  selected,
  muted,
  onActivate,
}: {
  label: string;
  subtitle?: string;
  selected: boolean;
  muted?: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-hud-interactive="true"
      className="pointer-events-auto cursor-pointer border-0 px-2 py-0.5 font-mono leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E3E2E]"
      style={{
        minWidth: toolbar.secondary.minWidth,
        minHeight: toolbar.secondary.height,
        background: selected ? chrome.creamSelected : chrome.cream,
        color: chrome.ink,
        boxShadow: selected ? `inset 0 0 0 2px ${chrome.wood}` : `inset 0 0 0 1px ${chrome.wood}`,
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 700,
        opacity: muted ? 0.6 : 1,
      }}
      onPointerDown={stopHudPointer}
      onClick={(event) => {
        stopHudPointer(event);
        onActivate();
      }}
    >
      <span className="block">{label}</span>
      {subtitle ? <span className="block text-[10px] opacity-80">{subtitle}</span> : null}
    </button>
  );
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
    <span className="font-mono whitespace-nowrap" style={{ color: "#8a2f2f", fontSize: 11, fontWeight: 700 }}>
      Need {missing.join(" and ")}
    </span>
  );
}
