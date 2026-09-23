"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";

function stopHudPointer(event: MouseEvent | PointerEvent): void {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation?.();
}

const SHORE_REASON_COPY = {
  regenerating: "Shore is regenerating",
  reserved: "Shore is reserved",
  unreachable: "No free shore access",
} as const;

const CORAL_REASON_COPY = {
  reserved: "Coral is reserved",
  unreachable: "No free shore access",
  depleted: "Coral is gone",
} as const;

type ShoreReason = keyof typeof SHORE_REASON_COPY;
type CoralReason = keyof typeof CORAL_REASON_COPY;

function shoreStatus(line: string | null): { ready: boolean; reason: ShoreReason | null } | null {
  if (!line || !line.startsWith("Shore:")) {
    return null;
  }
  if (line.startsWith("Shore: ready")) {
    return { ready: true, reason: null };
  }
  if (line.startsWith("Shore: regen")) {
    return { ready: false, reason: "regenerating" };
  }
  if (line.startsWith("Shore: reserved")) {
    return { ready: false, reason: "reserved" };
  }
  if (line.startsWith("Shore: unreachable")) {
    return { ready: false, reason: "unreachable" };
  }
  return null;
}

function coralStatus(line: string | null): { ready: boolean; reason: CoralReason | null } | null {
  if (!line || !line.startsWith("Coral:")) {
    return null;
  }
  if (line.startsWith("Coral: depleted")) {
    return { ready: false, reason: "depleted" };
  }
  if (line.startsWith("Coral: present reserved") || line.startsWith("Coral: reserved")) {
    return { ready: false, reason: "reserved" };
  }
  if (line.startsWith("Coral: unreachable")) {
    return { ready: false, reason: "unreachable" };
  }
  if (line.startsWith("Coral: present") || line.startsWith("Coral: ready")) {
    return { ready: true, reason: null };
  }
  return null;
}

/**
 * Contextual Inspect shore / Collect coral. Hidden while any world tool is active.
 * Coral wins over foliage and shore. Does not add a toolbar slot.
 */
export function AquaticActionChip() {
  const worldTool = useGameUiStore((state) => state.worldTool);
  const selectedX = useGameUiStore((state) => state.selectedX);
  const selectedY = useGameUiStore((state) => state.selectedY);
  const coralInspect = useGameUiStore((state) => state.coralSelectedInspect);
  const foliageInspect = useGameUiStore((state) => state.foliageSelectedInspect);
  const shoreInspect = useGameUiStore((state) => state.shoreSelectedInspect);
  const hudActions = useGameUiStore((state) => state.hudActions);
  const [closedKey, setClosedKey] = useState<string | null>(null);

  const selectionKey =
    selectedX === null || selectedY === null ? null : `${selectedX},${selectedY}`;
  if (worldTool !== "off" || selectionKey === null || closedKey === selectionKey) {
    return null;
  }

  const coral = coralStatus(coralInspect);
  const shore = coral ? null : foliageInspect ? null : shoreStatus(shoreInspect);
  if (!coral && !shore) {
    return null;
  }

  const onAct = (event: MouseEvent<HTMLButtonElement>) => {
    stopHudPointer(event);
    if (selectedX === null || selectedY === null) {
      return;
    }
    if (coral) {
      const result = hudActions?.designateCoralAt(selectedX, selectedY) ?? "none";
      if (result === "ok") {
        setClosedKey(selectionKey);
        return;
      }
      if (result === "reserved" || result === "unreachable") {
        useGameUiStore.getState().setRuntime({
          jobToast: {
            message: CORAL_REASON_COPY[result],
            hideAt: Date.now() + 2200,
          },
        });
      }
      return;
    }
    const result = hudActions?.designateShoreAt(selectedX, selectedY) ?? "none";
    if (result === "ok") {
      setClosedKey(selectionKey);
      return;
    }
    if (result === "regenerating" || result === "reserved" || result === "unreachable") {
      useGameUiStore.getState().setRuntime({
        jobToast: {
          message: SHORE_REASON_COPY[result],
          hideAt: Date.now() + 2200,
        },
      });
    }
  };

  const ready = Boolean(coral?.ready || shore?.ready);
  const label = coral
    ? coral.ready
      ? "Collect coral"
      : coral.reason
        ? CORAL_REASON_COPY[coral.reason]
        : "Collect coral"
    : shore?.ready
      ? "Inspect shore"
      : shore?.reason
        ? SHORE_REASON_COPY[shore.reason]
        : "Inspect shore";

  return (
    <div
      className="pointer-events-auto absolute left-1/2 z-20 -translate-x-1/2"
      style={{
        bottom:
          "calc(max(env(safe-area-inset-bottom, 0px), var(--hud-safe-y)) + var(--hud-toolbar-height) + var(--hud-gap))",
      }}
      onMouseDown={stopHudPointer}
      onPointerDown={stopHudPointer}
    >
      <button
        type="button"
        disabled={!ready}
        onClick={onAct}
        className="rounded border border-white/30 bg-black/80 px-3 py-1.5 font-mono text-[11px] text-lime-100 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={coral ? "Collect coral" : "Inspect shore"}
      >
        {label}
      </button>
    </div>
  );
}
