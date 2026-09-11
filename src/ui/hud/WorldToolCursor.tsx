/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { HUD_LAYOUT } from "./hudLayout";
import { cursorIconForWorldTool } from "./actionTools";

const toolbar = HUD_LAYOUT.actionToolbar;

function isInteractiveHud(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest("[data-hud-interactive], [data-hud-toggle], [data-hud-action]"));
}

export function WorldToolCursor() {
  const worldTool = useGameUiStore((state) => state.worldTool);
  const icon = cursorIconForWorldTool(worldTool);
  const [pointer, setPointer] = useState({ x: 0, y: 0, overHud: false, inside: false });

  useEffect(() => {
    if (!icon) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      setPointer({
        x: event.clientX,
        y: event.clientY,
        overHud: isInteractiveHud(event.target),
        inside: true,
      });
    };
    const onLeave = () => {
      setPointer((current) => ({ ...current, inside: false }));
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [icon]);

  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>("[data-game-canvas]");
    if (!canvas) {
      return;
    }
    const hideNative = Boolean(icon) && pointer.inside && !pointer.overHud;
    canvas.style.cursor = hideNative ? "none" : "";
    return () => {
      canvas.style.cursor = "";
    };
  }, [icon, pointer.inside, pointer.overHud]);

  if (!icon || !pointer.inside || pointer.overHud) {
    return null;
  }

  return (
    <img
      src={icon}
      alt=""
      data-hud-world-cursor="true"
      draggable={false}
      className="pointer-events-none fixed z-[15]"
      style={{
        left: pointer.x - toolbar.cursorHotspotX,
        top: pointer.y - toolbar.cursorHotspotY,
        width: toolbar.cursorSize,
        height: toolbar.cursorSize,
        imageRendering: "pixelated",
      }}
    />
  );
}
