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
    <div className="relative h-dvh w-full overflow-hidden bg-[#14110e]">
      <GameCanvas />
      <GameHud />
      <DebugOverlay />
    </div>
  );
}
