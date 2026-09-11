"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TOP_RIGHT_HUD_STORAGE_KEY,
  type TopRightHudVisualState,
} from "./hudLayout";

export type TopRightHudEvent =
  | { type: "minimize"; reducedMotion?: boolean }
  | { type: "expand"; reducedMotion?: boolean }
  | { type: "transitionComplete" };

export function advanceTopRightHud(
  state: TopRightHudVisualState,
  event: TopRightHudEvent,
): TopRightHudVisualState {
  switch (event.type) {
    case "minimize":
      if (state !== "expanded") {
        return state;
      }
      return event.reducedMotion ? "collapsed" : "collapsing";
    case "expand":
      if (state !== "collapsed") {
        return state;
      }
      return event.reducedMotion ? "expanded" : "expanding";
    case "transitionComplete":
      if (state === "collapsing") {
        return "collapsed";
      }
      if (state === "expanding") {
        return "expanded";
      }
      return state;
    default:
      return state;
  }
}

export function parseTopRightHudCollapsed(raw: string | null | undefined): boolean {
  return raw === "1";
}

export function readTopRightHudCollapsed(storage?: Pick<Storage, "getItem"> | null): boolean {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    return parseTopRightHudCollapsed(store?.getItem(TOP_RIGHT_HUD_STORAGE_KEY) ?? null);
  } catch {
    return false;
  }
}

export function writeTopRightHudCollapsed(
  collapsed: boolean,
  storage?: Pick<Storage, "setItem"> | null,
): void {
  try {
    const store = storage ?? (typeof localStorage === "undefined" ? null : localStorage);
    store?.setItem(TOP_RIGHT_HUD_STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    /* private mode / quota: keep session state only */
  }
}

export function prefersHudReducedMotion(media?: Pick<MediaQueryList, "matches"> | null): boolean {
  try {
    if (media) {
      return media.matches;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function topRightHudShowsResources(state: TopRightHudVisualState): boolean {
  return state === "expanded";
}

export function topRightHudIsTransitioning(state: TopRightHudVisualState): boolean {
  return state === "collapsing" || state === "expanding";
}

export function useTopRightHud(): {
  state: TopRightHudVisualState;
  minimize: () => void;
  expand: () => void;
  completeTransition: () => void;
} {
  const [state, setState] = useState<TopRightHudVisualState>(() =>
    readTopRightHudCollapsed() ? "collapsed" : "expanded",
  );

  useEffect(() => {
    if (state === "collapsed") {
      writeTopRightHudCollapsed(true);
    }
    if (state === "expanded") {
      writeTopRightHudCollapsed(false);
    }
  }, [state]);

  const minimize = useCallback(() => {
    const reducedMotion = prefersHudReducedMotion();
    setState((current) => advanceTopRightHud(current, { type: "minimize", reducedMotion }));
  }, []);

  const expand = useCallback(() => {
    const reducedMotion = prefersHudReducedMotion();
    setState((current) => advanceTopRightHud(current, { type: "expand", reducedMotion }));
  }, []);

  const completeTransition = useCallback(() => {
    setState((current) => advanceTopRightHud(current, { type: "transitionComplete" }));
  }, []);

  return { state, minimize, expand, completeTransition };
}
