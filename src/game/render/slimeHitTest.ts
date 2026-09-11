import type { SlimeId } from "@/src/simulation/entities/SlimeState";
import { SLIME_VISUALS, type SlimeVisual } from "./slimeVisualConfig";
import type { WorldToolMode } from "@/src/store/gameUiStore";

export interface SlimeHitCandidate {
  id: SlimeId;
  groundX: number;
  groundY: number;
  halfW: number;
  hitH: number;
}

export function slimeVisibleHitBox(visual: SlimeVisual | undefined): { halfW: number; hitH: number } {
  if (!visual || visual.kind !== "final") {
    return { halfW: 16, hitH: 20 };
  }
  return { halfW: visual.hitHalfWidth, hitH: visual.hitHeight };
}

export function slimeHitBoxForId(id: string): { halfW: number; hitH: number } {
  return slimeVisibleHitBox(SLIME_VISUALS[id as SlimeId]);
}

/**
 * Among visible-body hits, pick the front-most slime (largest groundY / render
 * depth), then the nearest feet, then a stable id order.
 */
export function pickSlimeAtWorldPoint(
  worldX: number,
  worldY: number,
  candidates: readonly SlimeHitCandidate[],
): SlimeId | undefined {
  const hits: Array<{ id: SlimeId; groundY: number; dist: number }> = [];
  for (const candidate of candidates) {
    const dx = worldX - candidate.groundX;
    const dy = worldY - (candidate.groundY - candidate.hitH / 2);
    if (Math.abs(dx) > candidate.halfW || Math.abs(dy) > candidate.hitH / 2) {
      continue;
    }
    hits.push({
      id: candidate.id,
      groundY: candidate.groundY,
      dist: dx * dx + dy * dy,
    });
  }
  if (hits.length === 0) {
    return undefined;
  }
  hits.sort((a, b) => b.groundY - a.groundY || a.dist - b.dist || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return hits[0]?.id;
}

export function worldToolBlocksSlimeSelection(worldTool: WorldToolMode): boolean {
  return worldTool !== "off";
}
