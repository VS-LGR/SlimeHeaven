"use client";

import { useEffect, useRef } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";

export function GameCanvas() {
  const parentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{ destroy: (removeCanvas: boolean) => void } | null>(null);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) {
      return;
    }

    let cancelled = false;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const { worldTool, setWorldTool, selectedSlimeId, clearSelectedSlime } = useGameUiStore.getState();
        if (worldTool !== "off") {
          setWorldTool("off");
          return;
        }
        if (selectedSlimeId) {
          clearSelectedSlime();
        }
        return;
      }
      if (event.key !== "F3") {
        return;
      }
      event.preventDefault();
      useGameUiStore.getState().toggleDebug();
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });

    void import("@/src/game/Game").then(({ createGame }) => {
      if (cancelled || !parentRef.current) {
        return;
      }
      gameRef.current = createGame(parentRef.current);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className="absolute inset-0 m-0 h-full w-full max-w-none overflow-hidden p-0"
      data-game-canvas="true"
    />
  );
}
