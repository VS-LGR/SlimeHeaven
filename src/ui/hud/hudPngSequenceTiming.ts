export function hudPngSequenceFrameIndex(
  elapsedMs: number,
  frameDurationMs: number,
  frameCount: number,
): number {
  const last = Math.max(0, frameCount - 1);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return 0;
  }
  return Math.min(last, Math.floor(elapsedMs / frameDurationMs));
}

export function hudPngSequenceCompleted(elapsedMs: number, durationMs: number): boolean {
  return Number.isFinite(elapsedMs) && elapsedMs >= durationMs;
}

export function preloadHudImages(urls: readonly string[]): void {
  if (typeof Image === "undefined") {
    return;
  }
  for (const url of urls) {
    const image = new Image();
    image.src = url;
  }
}
