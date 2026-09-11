"use client";

/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties } from "react";
import { hudPngSequenceCompleted, hudPngSequenceFrameIndex } from "./hudPngSequenceTiming";

const PIXEL: CSSProperties = {
  imageRendering: "pixelated",
};

export function HudPngSequence({
  frames,
  frameDurationMs,
  durationMs,
  onComplete,
  style,
}: {
  frames: readonly string[];
  frameDurationMs: number;
  durationMs: number;
  onComplete: () => void;
  style?: CSSProperties;
}) {
  const lastIndex = Math.max(0, frames.length - 1);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let raf = 0;
    let completed = false;

    const finish = () => {
      if (completed) {
        return;
      }
      completed = true;
      setFrameIndex(lastIndex);
      onComplete();
    };

    const loop = (now: number) => {
      const elapsed = now - startedAt;
      setFrameIndex(hudPngSequenceFrameIndex(elapsed, frameDurationMs, frames.length));
      if (hudPngSequenceCompleted(elapsed, durationMs)) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    const timeout = window.setTimeout(finish, durationMs);

    return () => {
      completed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [frames, frameDurationMs, durationMs, lastIndex, onComplete]);

  const src = frames[frameIndex] ?? frames[0];

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      aria-hidden="true"
      data-hud-sequence="true"
      data-hud-sequence-frame={frameIndex}
      className="pointer-events-none absolute block max-w-none"
      style={{ ...PIXEL, ...style }}
    />
  );
}
