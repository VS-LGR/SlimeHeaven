import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SIMULATION_TICKS_PER_SECOND } from "@/src/simulation/constants";

describe("HUD shell contracts 05.4A", () => {
  const hud = readFileSync("src/ui/GameHud.tsx", "utf8");
  const shell = readFileSync("src/ui/GameShell.tsx", "utf8");
  const canvas = readFileSync("src/ui/GameCanvas.tsx", "utf8");
  const game = readFileSync("src/game/Game.ts", "utf8");
  const config = readFileSync("src/game/config.ts", "utf8");
  const viewport = readFileSync("src/game/viewport.ts", "utf8");
  const camera = readFileSync("src/game/input/CameraController.ts", "utf8");
  const globals = readFileSync("app/globals.css", "utf8");
  const resources = readFileSync("src/simulation/resources.ts", "utf8");

  it("keeps GameCanvas and GameHud behind client-only dynamic boundaries", () => {
    expect(shell).toMatch(/dynamic\(/);
    expect(shell).toMatch(/ssr:\s*false/);
    expect(shell).toMatch(/GameCanvas/);
    expect(shell).toMatch(/GameHud/);
  });

  it("fills the viewport without a centered letterbox frame", () => {
    expect(canvas).toMatch(/absolute inset-0|h-full w-full/);
    expect(canvas).not.toMatch(/items-center justify-center/);
    expect(globals).toMatch(/overflow:\s*hidden/);
    expect(globals).toMatch(/100dvh/);
    expect(globals).toMatch(/100vw/);
    expect(globals).toMatch(/margin:\s*0/);
    expect(globals).toMatch(/padding:\s*0/);
    expect(shell).toMatch(/h-dvh w-screen/);
    expect(shell).toMatch(/overflow-hidden/);
    expect(shell).not.toMatch(/max-w-\d/);
    expect(canvas).toMatch(/max-w-none/);
  });

  it("keeps the HUD in screen space above the canvas", () => {
    expect(hud).toMatch(/data-hud-root="true"/);
    expect(hud).toMatch(/data-hud-screen-layer="true"/);
    expect(hud).toMatch(/pointer-events-none absolute inset-0/);
    expect(hud).toMatch(/TopLeftStatus/);
    expect(hud).toMatch(/TopRightResources/);
    expect(hud).toMatch(/useHudScale/);
    expect(hud).toMatch(/data-hud-requested-scale/);
    expect(hud).not.toMatch(/from ["']@\/src\/simulation\/Simulation/);
  });

  it("does not stretch a fixed 480×270 canvas with CSS integer scale", () => {
    expect(game).toMatch(/applyGameViewport/);
    expect(game).toMatch(/ResizeObserver/);
    expect(game).toMatch(/removeEventListener\("resize"/);
    expect(game).toMatch(/observer\.disconnect/);
    expect(game).not.toMatch(/integerCanvasScale/);
    expect(viewport).toMatch(/game\.scale\.resize/);
    expect(camera).toMatch(/computeCoverZoom/);
    expect(camera).not.toMatch(/computeFitZoom/);
    expect(camera).toMatch(/scale\.off\("resize"/);
    expect(camera).not.toMatch(/["']wheel["']/);
    expect(camera).not.toMatch(/nudgeZoom/);
    expect(camera.match(/setZoom/g)?.length).toBe(1);
  });

  it("preserves pixel-art rendering flags", () => {
    expect(config).toMatch(/pixelArt:\s*true/);
    expect(config).toMatch(/antialias:\s*false/);
    expect(config).toMatch(/roundPixels:\s*true/);
    expect(config).toMatch(/Phaser\.Scale\.NONE/);
    expect(config).not.toMatch(/devicePixelRatio/);
    expect(globals).toMatch(/image-rendering:\s*pixelated/);
  });

  it("creates Simulation once at boot and never from HUD or resize", () => {
    expect(game.match(/new Simulation/g)?.length).toBe(1);
    expect(viewport).not.toMatch(/new Simulation/);
    expect(hud).not.toMatch(/new Simulation/);
  });

  it("removes duplicate always-on resource counters from the tool bar", () => {
    expect(hud).not.toMatch(/Wood \{wood\}/);
    expect(hud).not.toMatch(/Stone \{stone\}/);
    expect(hud).not.toMatch(/Food \{food\}/);
    expect(hud).toMatch(/label="Farm"/);
    expect(hud).toMatch(/label="Remove Farm"/);
    expect(hud).toMatch(/label="Fish"/);
    expect(hud).toMatch(/label="Build"/);
    expect(hud).toMatch(/data-hud-panel="slime"/);
    expect(hud).toMatch(/data-hud-panel="world-tools"/);
  });

  it("does not add Harmony to simulation resources", () => {
    expect(resources).not.toMatch(/harmony/i);
    expect(SIMULATION_TICKS_PER_SECOND).toBe(4);
  });

  it("keeps Top Right on the HUD snapshot rather than Phaser private fields", () => {
    const topRight = readFileSync("src/ui/hud/TopRightResources.tsx", "utf8");
    expect(topRight).toMatch(/useGameUiStore/);
    expect(topRight).not.toMatch(/this\.game|registry\.get|cameras\.main/);
    expect(topRight).toMatch(/Harmony: unavailable/);
    expect(topRight).toMatch(/Harmonia/);
    expect(topRight).toMatch(/Settings \(unavailable\)/);
    expect(topRight).toMatch(/disabled/);
  });

  it("does not let wheel input change HUD scale", () => {
    expect(globals).toMatch(/--hud-left-scale/);
    expect(globals).toMatch(/--hud-right-scale/);
    expect(globals).not.toMatch(/clamp\(/);
    expect(globals).not.toMatch(/wheel/);
    expect(readFileSync("src/ui/hud/TopLeftStatus.tsx", "utf8")).not.toMatch(/wheel/);
    expect(readFileSync("src/ui/hud/TopRightResources.tsx", "utf8")).not.toMatch(/wheel/);
    expect(readFileSync("src/ui/hud/HudCard.tsx", "utf8")).not.toMatch(/wheel/);
    expect(readFileSync("src/ui/hud/useHudScale.ts", "utf8")).not.toMatch(/wheel/);
    expect(readFileSync("src/ui/hud/hudLayout.ts", "utf8")).toMatch(/HUD_SCALE_CONFIG/);
  });

  it("keeps decorative HUD regions click-through and settings presentation-only", () => {
    const card = readFileSync("src/ui/hud/HudCard.tsx", "utf8");
    const topRight = readFileSync("src/ui/hud/TopRightResources.tsx", "utf8");
    expect(card).toMatch(/pointer-events-none absolute/);
    expect(topRight).toMatch(/pointer-events-none flex h-full w-full cursor-default/);
    expect(topRight).not.toMatch(/onClick/);
    expect(hud).toMatch(/pointer-events-auto absolute left-1\/2/);
  });

  it("does not import gameplay systems into the HUD overlay", () => {
    expect(hud).not.toMatch(/VisitorSystem|FarmSystem|FishingOpportunitySystem|NeedsSystem/);
    expect(hud).toMatch(/label="Farm"/);
    expect(readFileSync("src/ui/DebugOverlay.tsx", "utf8")).toMatch(/debugVisible/);
    expect(readFileSync("src/ui/GameCanvas.tsx", "utf8")).toMatch(/F3/);
    expect(readFileSync("src/game/Game.ts", "utf8")).toMatch(/ResizeObserver/);
    expect(readFileSync("src/game/config.ts", "utf8")).not.toMatch(/input\.on\(\s*["']wheel["']/);
  });
});
