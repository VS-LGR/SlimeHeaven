import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { worldToTile } from "@/src/world/constants";
import {
  applyGameViewport,
  cameraBoundsForView,
  canvasPointerToWorld,
  computeCoverZoom,
  computeFitZoom,
  coverCameraScroll,
  integerZoomLevels,
  rawCoverZoom,
  readParentSize,
  visibleLogicalSize,
  visibleWorldBounds,
  WORLD_PIXEL_HEIGHT,
  WORLD_PIXEL_WIDTH,
} from "./viewport";

const VIEWPORTS = [
  { width: 2048, height: 1150 },
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
] as const;

describe("viewport cover zoom 05.4A.4", () => {
  it("keeps the previous contain calculation available for comparison", () => {
    expect(computeFitZoom(1920, 1080)).toBe(4);
    expect(computeFitZoom(1366, 768)).toBe(2);
    expect(computeFitZoom(1280, 720)).toBe(2);
  });

  it("uses integer cover zoom against the 640×480 world, not 480×270 contain", () => {
    expect(WORLD_PIXEL_WIDTH).toBe(640);
    expect(WORLD_PIXEL_HEIGHT).toBe(480);
    expect(computeCoverZoom(1920, 1080)).toBe(3);
    expect(computeCoverZoom(1600, 900)).toBe(3);
    expect(computeCoverZoom(1366, 768)).toBe(3);
    expect(computeCoverZoom(1280, 720)).toBe(2);
    expect(computeCoverZoom(2048, 1150)).toBe(4);
    expect(rawCoverZoom(1920, 1080)).toBe(3);
    expect(rawCoverZoom(1366, 768)).toBeCloseTo(1366 / 640);
  });

  it("never returns a fractional or zero cover zoom", () => {
    expect(computeCoverZoom(200, 100)).toBe(1);
    expect(Number.isInteger(computeCoverZoom(1367, 768))).toBe(true);
    expect(computeCoverZoom(200, 100)).toBeGreaterThanOrEqual(1);
  });

  it("covers widescreen viewports instead of pillarboxing", () => {
    const view = visibleLogicalSize(1920, 1080, computeCoverZoom(1920, 1080));
    expect(view.width).toBeCloseTo(640);
    expect(view.height).toBeCloseTo(360);
    expect(view.width).toBeLessThanOrEqual(WORLD_PIXEL_WIDTH);
    expect(view.height).toBeLessThanOrEqual(WORLD_PIXEL_HEIGHT);

    const wide = visibleLogicalSize(1366, 768, computeCoverZoom(1366, 768));
    expect(wide.width).toBeLessThanOrEqual(WORLD_PIXEL_WIDTH);
    expect(wide.height).toBeLessThanOrEqual(WORLD_PIXEL_HEIGHT);
  });

  it("never reveals area outside world bounds", () => {
    for (const viewport of VIEWPORTS) {
      const visible = visibleWorldBounds(viewport.width, viewport.height);
      expect(visible.left).toBeGreaterThanOrEqual(0);
      expect(visible.top).toBeGreaterThanOrEqual(0);
      expect(visible.right).toBeLessThanOrEqual(WORLD_PIXEL_WIDTH + 1e-6);
      expect(visible.bottom).toBeLessThanOrEqual(WORLD_PIXEL_HEIGHT + 1e-6);
      const bounds = cameraBoundsForView(
        WORLD_PIXEL_WIDTH,
        WORLD_PIXEL_HEIGHT,
        visible.view.width,
        visible.view.height,
      );
      expect(bounds.overflows).toBe(false);
      expect(bounds).toMatchObject({ x: 0, y: 0, width: 640, height: 480 });
    }
  });

  it("centers the cover crop on the playable world", () => {
    const visible = visibleWorldBounds(1920, 1080);
    expect(visible.scroll).toEqual(
      coverCameraScroll(WORLD_PIXEL_WIDTH, WORLD_PIXEL_HEIGHT, visible.view.width, visible.view.height),
    );
    expect(visible.scroll.x).toBe(0);
    expect(visible.scroll.y).toBeCloseTo((480 - 360) / 2);
  });

  it("maps pointer-to-world exactly after cover zoom", () => {
    const zoom = computeCoverZoom(1920, 1080);
    const scroll = coverCameraScroll(640, 480, 1920 / zoom, 1080 / zoom);
    const center = canvasPointerToWorld(960, 540, scroll.x, scroll.y, zoom);
    expect(center.x).toBeCloseTo(320);
    expect(center.y).toBeCloseTo(240);
    expect(worldToTile(center.x, center.y)).toEqual({ x: 10, y: 7 });

    const left = canvasPointerToWorld(1, 540, scroll.x, scroll.y, zoom);
    expect(worldToTile(left.x, left.y)).toEqual({ x: 0, y: 7 });

    const right = canvasPointerToWorld(1919, 540, scroll.x, scroll.y, zoom);
    expect(worldToTile(right.x, right.y)).toEqual({ x: 19, y: 7 });
  });

  it("keeps pointer-to-world mapping 1:1 with integer camera zoom", () => {
    const zoom = 2;
    const world = canvasPointerToWorld(100, 40, 10, 20, zoom);
    expect(world).toEqual({ x: 60, y: 40 });
  });

  it("builds integer zoom levels covering at least 1–4 and the cover zoom", () => {
    expect(integerZoomLevels(2)).toEqual([1, 2, 3, 4]);
    expect(integerZoomLevels(4)).toEqual([1, 2, 3, 4]);
    expect(integerZoomLevels(8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("falls back to the 480×270 reference when the parent has no size yet", () => {
    expect(readParentSize({ clientWidth: 0, clientHeight: 0 })).toEqual({
      width: 480,
      height: 270,
    });
  });

  it("does not construct Simulation while applying a viewport", () => {
    expect(applyGameViewport.toString()).not.toMatch(/new Simulation/);
    expect(applyGameViewport.toString()).not.toMatch(/scene\.start|restart/);
  });

  it("always resizes the canvas to the parent and fills it in CSS", () => {
    expect(applyGameViewport.toString()).toMatch(/scale\.resize/);
    expect(applyGameViewport.toString()).toMatch(/width = "100%"/);
    expect(applyGameViewport.toString()).toMatch(/height = "100%"/);
    expect(applyGameViewport.toString()).not.toMatch(/wheel/);
    expect(applyGameViewport.toString()).toMatch(/computeCoverZoom/);
  });

  it("does not expose a wheel path that can change canvas size or zoom", () => {
    expect(applyGameViewport.toString()).not.toMatch(/wheel/);
    const camera = readFileSync("src/game/input/CameraController.ts", "utf8");
    expect(camera).not.toMatch(/wheel/);
    expect(camera).not.toMatch(/nudgeZoom/);
    expect(camera).toMatch(/computeCoverZoom/);
    expect(camera).toMatch(/cameraBoundsForView/);
    expect(camera.match(/setZoom/g)?.length).toBe(1);
    expect(camera).toMatch(/applyCoverZoom/);
  });
});
