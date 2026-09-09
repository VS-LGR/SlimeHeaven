"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { resolveHudScale, type HudScaleResolution } from "./hudLayout";

export function applyHudScaleToDocument(resolution: HudScaleResolution): void {
  const root = document.documentElement;
  root.style.setProperty("--hud-left-scale", String(resolution.leftApplied));
  root.style.setProperty("--hud-right-scale", String(resolution.rightApplied));
  root.dataset.hudRequestedScale = String(resolution.requestedGlobal);
  root.dataset.hudLeftApplied = String(resolution.leftApplied);
  root.dataset.hudRightApplied = String(resolution.rightApplied);
  root.dataset.hudScaleReason = resolution.reason;
}

function readViewportSize(target: HTMLElement | null): { width: number; height: number } {
  if (target) {
    const rect = target.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
    };
  }
  return {
    width: typeof window === "undefined" ? 1920 : window.innerWidth,
    height: typeof window === "undefined" ? 1080 : window.innerHeight,
  };
}

export function useHudScale(): {
  layerRef: RefObject<HTMLDivElement | null>;
  scale: HudScaleResolution;
} {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<HudScaleResolution>(() =>
    resolveHudScale(
      typeof window === "undefined" ? 1920 : window.innerWidth,
      typeof window === "undefined" ? 1080 : window.innerHeight,
    ),
  );

  useLayoutEffect(() => {
    const update = () => {
      const { width, height } = readViewportSize(layerRef.current);
      const next = resolveHudScale(width, height);
      applyHudScaleToDocument(next);
      setScale(next);
    };

    update();
    window.addEventListener("resize", update);
    const target = layerRef.current;
    const observer = target ? new ResizeObserver(update) : null;
    if (target && observer) {
      observer.observe(target);
    }

    return () => {
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);

  return { layerRef, scale };
}
