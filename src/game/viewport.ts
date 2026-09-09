import { TILE_SIZE } from "@/src/world/constants";

/** 480×270 is the authored logical composition reference, not a fixed render buffer. */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

/** 20×15 tiles. Kept here so viewport cover math does not import map data. */
export const WORLD_PIXEL_WIDTH = 20 * TILE_SIZE;
export const WORLD_PIXEL_HEIGHT = 15 * TILE_SIZE;

export function readParentSize(parent: {
  clientWidth: number;
  clientHeight: number;
}): { width: number; height: number } {
  return {
    width: Math.max(1, Math.round(parent.clientWidth || GAME_WIDTH)),
    height: Math.max(1, Math.round(parent.clientHeight || GAME_HEIGHT)),
  };
}

/** Previous contain zoom: fit the 480×270 composition inside the viewport (pillarboxes on widescreen). */
export function computeFitZoom(viewportWidth: number, viewportHeight: number): number {
  return Math.max(
    1,
    Math.floor(Math.min(viewportWidth / GAME_WIDTH, viewportHeight / GAME_HEIGHT)),
  );
}

export function rawCoverZoom(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth = WORLD_PIXEL_WIDTH,
  worldHeight = WORLD_PIXEL_HEIGHT,
): number {
  return Math.max(viewportWidth / worldWidth, viewportHeight / worldHeight);
}

/**
 * Smallest integer zoom that covers the viewport with the world (no stretching).
 * Uses ceil, not floor: floor is contain and can leave uncovered strips.
 */
export function computeCoverZoom(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth = WORLD_PIXEL_WIDTH,
  worldHeight = WORLD_PIXEL_HEIGHT,
): number {
  const raw = rawCoverZoom(viewportWidth, viewportHeight, worldWidth, worldHeight);
  let zoom = Math.max(1, Math.ceil(raw));
  while (
    (viewportWidth / zoom > worldWidth || viewportHeight / zoom > worldHeight) &&
    zoom < 64
  ) {
    zoom += 1;
  }
  return zoom;
}

export function visibleLogicalSize(
  viewportWidth: number,
  viewportHeight: number,
  zoom: number,
): { width: number; height: number } {
  return {
    width: viewportWidth / zoom,
    height: viewportHeight / zoom,
  };
}

export function coverCameraScroll(
  worldWidth: number,
  worldHeight: number,
  viewWidth: number,
  viewHeight: number,
): { x: number; y: number } {
  return {
    x: Math.max(0, (worldWidth - viewWidth) / 2),
    y: Math.max(0, (worldHeight - viewHeight) / 2),
  };
}

export function visibleWorldBounds(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth = WORLD_PIXEL_WIDTH,
  worldHeight = WORLD_PIXEL_HEIGHT,
): {
  zoom: number;
  rawCoverZoom: number;
  view: { width: number; height: number };
  scroll: { x: number; y: number };
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const zoom = computeCoverZoom(viewportWidth, viewportHeight, worldWidth, worldHeight);
  const view = visibleLogicalSize(viewportWidth, viewportHeight, zoom);
  const scroll = coverCameraScroll(worldWidth, worldHeight, view.width, view.height);
  return {
    zoom,
    rawCoverZoom: rawCoverZoom(viewportWidth, viewportHeight, worldWidth, worldHeight),
    view,
    scroll,
    left: scroll.x,
    top: scroll.y,
    right: scroll.x + view.width,
    bottom: scroll.y + view.height,
  };
}

export function canvasPointerToWorld(
  canvasX: number,
  canvasY: number,
  viewX: number,
  viewY: number,
  zoom: number,
): { x: number; y: number } {
  return {
    x: viewX + canvasX / zoom,
    y: viewY + canvasY / zoom,
  };
}

export function integerZoomLevels(fitZoom: number): number[] {
  const max = Math.max(4, fitZoom);
  return Array.from({ length: max }, (_, index) => index + 1);
}

/**
 * Cover mode never reveals space outside the map. Bounds stay on the world.
 * `overflows` is true only if the view is still larger than the world (a zoom bug).
 */
export function cameraBoundsForView(
  worldWidth: number,
  worldHeight: number,
  viewWidth: number,
  viewHeight: number,
): {
  x: number;
  y: number;
  width: number;
  height: number;
  overflows: boolean;
} {
  return {
    x: 0,
    y: 0,
    width: worldWidth,
    height: worldHeight,
    overflows: viewWidth > worldWidth + 1e-6 || viewHeight > worldHeight + 1e-6,
  };
}

export function applyGameViewport(
  game: {
    canvas: HTMLCanvasElement | null;
      scale: { width: number; height: number; resize: (width: number, height: number) => void };
  },
  parent: HTMLElement,
): { width: number; height: number; zoom: number } {
  const { width, height } = readParentSize(parent);
  const zoom = computeCoverZoom(width, height);
  if (!game.canvas) {
    return { width, height, zoom };
  }
  game.scale.resize(width, height);
  const canvas = game.canvas;
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.imageRendering = "pixelated";
  canvas.style.display = "block";
  canvas.style.margin = "0";
  return { width, height, zoom };
}
