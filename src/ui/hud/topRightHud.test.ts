import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { INVENTORY_LAYOUT } from "./inventoryLayout";
import {
  TOP_RIGHT_ANIMATION,
  TOP_RIGHT_HUD_STORAGE_KEY,
  TOP_RIGHT_TRANSITION,
  topRightTransitionDurationMs,
} from "./hudLayout";
import {
  TOP_RIGHT_COLLAPSE_FRAMES,
  TOP_RIGHT_COLLAPSE_STILL,
  TOP_RIGHT_EXPAND_FRAMES,
  TOP_RIGHT_SEQUENCE_FILES,
} from "./hudAssets";
import { hudPngSequenceCompleted, hudPngSequenceFrameIndex } from "./hudPngSequenceTiming";
import {
  advanceTopRightHud,
  parseTopRightHudCollapsed,
  prefersHudReducedMotion,
  readTopRightHudCollapsed,
  writeTopRightHudCollapsed,
} from "./useTopRightHud";

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const SEQUENCE_HASHES = {
  minimize1: "5445e83533a6150d74e875610544f40ad8ef7cb4b15a9d3b85d50f47fac8711d",
  minimize24: "5ec3f380d75432c9e30047f0b62073223b9d7a19e330519e6e0f05de1c4ea5af",
  minimize47: "9a3d96baa1dd8b0f7c28e0ce09215edfae7827e092cc39863e3581648e0bab93",
  return1: "9a3d96baa1dd8b0f7c28e0ce09215edfae7827e092cc39863e3581648e0bab93",
  return24: "853c334104aaa7c6dc69f2cf8047b4cde2315ddd1698e3355d8db7ca04c14f44",
  return47: "5445e83533a6150d74e875610544f40ad8ef7cb4b15a9d3b85d50f47fac8711d",
} as const;

describe("Top Right 05.4B sequences and state", () => {
  it("points collapse at Minimize (Foward) and expand at Return (Backward)", () => {
    expect(TOP_RIGHT_COLLAPSE_FRAMES).toHaveLength(47);
    expect(TOP_RIGHT_EXPAND_FRAMES).toHaveLength(47);
    expect(decodeURI(TOP_RIGHT_COLLAPSE_FRAMES[0] ?? "")).toContain("Foward");
    expect(decodeURI(TOP_RIGHT_COLLAPSE_FRAMES[0] ?? "")).toContain("Minimize1.png");
    expect(decodeURI(TOP_RIGHT_COLLAPSE_FRAMES[46] ?? "")).toContain("Minimize47.png");
    expect(decodeURI(TOP_RIGHT_EXPAND_FRAMES[0] ?? "")).toContain("Backward");
    expect(decodeURI(TOP_RIGHT_EXPAND_FRAMES[0] ?? "")).toContain("Return1.png");
    expect(decodeURI(TOP_RIGHT_EXPAND_FRAMES[46] ?? "")).toContain("Return47.png");
    expect(TOP_RIGHT_COLLAPSE_STILL).toBe(TOP_RIGHT_COLLAPSE_FRAMES[46]);
    expect(TOP_RIGHT_ANIMATION.minimizeOpaqueWidths[0]).toBeGreaterThan(
      TOP_RIGHT_ANIMATION.minimizeOpaqueWidths[2] ?? 0,
    );
    expect(TOP_RIGHT_ANIMATION.returnOpaqueWidths[2] ?? 0).toBeGreaterThan(
      TOP_RIGHT_ANIMATION.returnOpaqueWidths[0] ?? 0,
    );
    expect(TOP_RIGHT_ANIMATION.collapseSequence).toBe("minimize");
    expect(TOP_RIGHT_ANIMATION.expandSequence).toBe("return");
  });

  it("plays 47 frames at 24ms then stops without looping", () => {
    const { frameDurationMs, collapseFrameCount, durationMs } = TOP_RIGHT_TRANSITION;
    expect(frameDurationMs).toBe(24);
    expect(durationMs).toBe(collapseFrameCount * frameDurationMs);
    expect(topRightTransitionDurationMs(collapseFrameCount)).toBe(1128);
    expect(topRightTransitionDurationMs(TOP_RIGHT_EXPAND_FRAMES.length)).toBe(1128);

    const last = collapseFrameCount - 1;
    expect(hudPngSequenceFrameIndex(0, frameDurationMs, collapseFrameCount)).toBe(0);
    expect(hudPngSequenceFrameIndex(23, frameDurationMs, collapseFrameCount)).toBe(0);
    expect(hudPngSequenceFrameIndex(24, frameDurationMs, collapseFrameCount)).toBe(1);
    expect(hudPngSequenceFrameIndex(1127, frameDurationMs, collapseFrameCount)).toBe(last);
    expect(hudPngSequenceFrameIndex(1128, frameDurationMs, collapseFrameCount)).toBe(last);
    expect(hudPngSequenceFrameIndex(5000, frameDurationMs, collapseFrameCount)).toBe(last);

    const seen = new Set<number>();
    for (let elapsed = 0; elapsed <= durationMs; elapsed += frameDurationMs) {
      seen.add(hudPngSequenceFrameIndex(elapsed, frameDurationMs, collapseFrameCount));
    }
    expect(seen.size).toBe(collapseFrameCount);
    expect(hudPngSequenceCompleted(1127, durationMs)).toBe(false);
    expect(hudPngSequenceCompleted(1128, durationMs)).toBe(true);
    expect(hudPngSequenceCompleted(2000, durationMs)).toBe(true);
  });

  it("lets inventory retarget during CSS transitions instead of ignoring clicks", () => {
    const inventory = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
    expect(inventory).not.toMatch(/advanceTopRightHud/);
    expect(inventory).not.toMatch(/HudPngSequence/);
    expect(inventory).toMatch(/setInventoryPanelOpen/);
    expect(inventory).toMatch(/data-inventory-dialog/);
    expect(inventory).not.toMatch(/Configurações indisponíveis/);
    expect(advanceTopRightHud("collapsing", { type: "minimize" })).toBe("collapsing");
    expect(advanceTopRightHud("collapsing", { type: "transitionComplete" })).toBe("collapsed");
  });

  it("keeps a top-right backpack launcher and centered Backpack_UI dialog", () => {
    const inventory = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
    expect(inventory).toMatch(/Abrir inventário/);
    expect(inventory).toMatch(/Fechar inventário/);
    expect(inventory).toMatch(/data-inventory-backpack/);
    expect(inventory).toMatch(/data-inventory-dialog/);
    expect(inventory).toMatch(/data-inventory-backdrop/);
    expect(inventory).toMatch(/data-inventory-panel-art/);
    expect(inventory).toMatch(/HUD_ASSETS\.inventoryMinimized/);
    expect(inventory).toMatch(/HUD_ASSETS\.inventoryBackpackPanel/);
    expect(inventory).toMatch(/setInventoryPanelOpen/);
    expect(inventory).not.toMatch(/minimizeStrip|toggleAttachedMenu|data-inventory-strip/);
    expect(inventory).toMatch(/stopPropagation/);
    expect(inventory).toMatch(/pointer-events-auto/);
    expect(inventory).not.toMatch(/HudPngSequence/);
  });

  it("animates the centered dialog with CSS instead of a frame sequence", () => {
    const inventory = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
    expect(inventory).toMatch(/INVENTORY_MOTION_MS/);
    expect(inventory).toMatch(/translate\(-50%/);
    expect(inventory).not.toMatch(/HudPngSequence/);
    expect(inventory).not.toMatch(/\.gif/i);
    expect(inventory).not.toMatch(/topRightTransitionDurationMs/);
    const sequence = readFileSync("src/ui/hud/HudPngSequence.tsx", "utf8");
    expect(sequence).toMatch(/requestAnimationFrame/);
  });

  it("does not rewrite authored animation or HUD PNG bytes", () => {
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.collapse[0] ?? "")).toBe(SEQUENCE_HASHES.minimize1);
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.collapse[23] ?? "")).toBe(SEQUENCE_HASHES.minimize24);
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.collapse[46] ?? "")).toBe(SEQUENCE_HASHES.minimize47);
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.expand[0] ?? "")).toBe(SEQUENCE_HASHES.return1);
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.expand[23] ?? "")).toBe(SEQUENCE_HASHES.return24);
    expect(sha256(TOP_RIGHT_SEQUENCE_FILES.expand[46] ?? "")).toBe(SEQUENCE_HASHES.return47);
    expect(sha256("public/assets/UI/UI_Top_Right.png")).toBe(
      "d21426fc32882826fb9c2796eea005a509f4278c5f64e4d39d10b15e87880865",
    );
  });

  it("skips the sequence when reduced motion is requested", () => {
    expect(advanceTopRightHud("expanded", { type: "minimize", reducedMotion: true })).toBe("collapsed");
    expect(advanceTopRightHud("collapsed", { type: "expand", reducedMotion: true })).toBe("expanded");
    expect(prefersHudReducedMotion({ matches: true })).toBe(true);
    expect(prefersHudReducedMotion({ matches: false })).toBe(false);
  });

  it("persists collapsed chrome and defaults to expanded", () => {
    const mem: Record<string, string> = {};
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value;
      },
    };
    expect(parseTopRightHudCollapsed(null)).toBe(false);
    expect(readTopRightHudCollapsed(storage)).toBe(false);
    writeTopRightHudCollapsed(true, storage);
    expect(mem[TOP_RIGHT_HUD_STORAGE_KEY]).toBe("1");
    expect(readTopRightHudCollapsed(storage)).toBe(true);
    writeTopRightHudCollapsed(false, storage);
    expect(readTopRightHudCollapsed(storage)).toBe(false);
    expect(() =>
      writeTopRightHudCollapsed(true, {
        setItem: () => {
          throw new Error("quota");
        },
      }),
    ).not.toThrow();
    expect(readTopRightHudCollapsed({
      getItem: () => {
        throw new Error("blocked");
      },
    })).toBe(false);
  });

  it("sizes the top-right launcher to the backpack button artwork", () => {
    expect(INVENTORY_LAYOUT.button.width).toBe(121);
    expect(INVENTORY_LAYOUT.button.height).toBe(102);
    expect(INVENTORY_LAYOUT.panel.width).toBe(655);
    expect(INVENTORY_LAYOUT.panel.height).toBe(561);
  });
});
