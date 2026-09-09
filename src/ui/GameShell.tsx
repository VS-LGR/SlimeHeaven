"use client";

import dynamic from "next/dynamic";
import { DebugOverlay } from "./DebugOverlay";

const GameCanvas = dynamic(() => import("./GameCanvas").then((mod) => mod.GameCanvas), {
  ssr: false,
  loading: () => (
    <p className="font-mono text-sm text-lime-100/80">Loading Slime Haven…</p>
  ),
});

const GameHud = dynamic(() => import("./GameHud").then((mod) => mod.GameHud), {
  ssr: false,
});

export function GameShell() {
  return (
    <div
      className="relative m-0 h-dvh w-screen max-w-none overflow-hidden p-0"
      data-game-shell="true"
    >
      <GameCanvas />
      <GameHud />
      <DebugOverlay />
    </div>
  );
}
