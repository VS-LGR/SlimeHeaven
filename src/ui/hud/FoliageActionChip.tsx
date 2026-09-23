"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";

function stopHudPointer(event: MouseEvent | PointerEvent): void {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation?.();
}

const REASON_COPY = {
  regenerating: "Foliage is regenerating",
  reserved: "Tree is reserved",
} as const;

/**
 * Contextual Collect foliage action. Hidden while any world tool is active.
 * Does not add a toolbar slot.
 */
export function FoliageActionChip() {
  const worldTool = useGameUiStore((state) => state.worldTool);
  const selectedX = useGameUiStore((state) => state.selectedX);
  const selectedY = useGameUiStore((state) => state.selectedY);
  const foliageInspect = useGameUiStore((state) => state.foliageSelectedInspect);
  const coralInspect = useGameUiStore((state) => state.coralSelectedInspect);
  const hudActions = useGameUiStore((state) => state.hudActions);
  const [closedKey, setClosedKey] = useState<string | null>(null);

  const selectionKey =
    selectedX === null || selectedY === null ? null : `${selectedX},${selectedY}`;
  if (worldTool !== "off" || selectionKey === null || closedKey === selectionKey) {
    return null;
  }
  if (coralInspect) {
    return null;
  }
  if (!foliageInspect) {
    return null;
  }

  const ready = foliageInspect.startsWith("Foliage: ready");
  const regenerating = foliageInspect.startsWith("Foliage: regen");
  const reserved = foliageInspect.startsWith("Foliage: reserved");
  if (!ready && !regenerating && !reserved) {
    return null;
  }

  const reason = regenerating ? "regenerating" : reserved ? "reserved" : null;

  const onCollect = (event: MouseEvent<HTMLButtonElement>) => {
    stopHudPointer(event);
    if (selectedX === null || selectedY === null) {
      return;
    }
    const result = hudActions?.designateFoliageAt(selectedX, selectedY) ?? "none";
    if (result === "ok") {
      setClosedKey(selectionKey);
      return;
    }
    if (result === "regenerating" || result === "reserved") {
      useGameUiStore.getState().setRuntime({
        jobToast: {
          message: REASON_COPY[result],
          hideAt: Date.now() + 2200,
        },
      });
    }
  };

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
        onClick={onCollect}
        className="rounded border border-white/30 bg-black/80 px-3 py-1.5 font-mono text-[11px] text-lime-100 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Collect foliage"
      >
        {ready ? "Collect foliage" : (reason ? REASON_COPY[reason] : "Collect foliage")}
      </button>
    </div>
  );
}
