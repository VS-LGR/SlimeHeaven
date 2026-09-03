import { TILE_SIZE, worldToTile } from "@/src/world/constants";
import { FISHING } from "@/src/simulation/fishingConfig";
import type { CastDirection, FishingAccessPoint } from "@/src/simulation/entities/WaterBody";
import type { FishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import { TileType } from "@/src/world/tileTypes";
import type { FishingRodPose } from "./fishingVisualConfig";
import { quantizedArc } from "./fishingVisualConfig";

export type FishingVisualSide = "left" | "right";

export type FishingVisualPhase =
  | "approach"
  | "cast_air"
  | "bobber_land"
  | "wait_surface"
  | "bite_submerge"
  | "fight_underwater"
  | "success"
  | "escape"
  | "cleanup";

export type BobberVisual = "cast_air" | "surface" | "submerge" | "hidden";
export type BubbleVisual = "off" | "loop";

export interface FishingVisualContext {
  landTile: { x: number; y: number };
  waterTile: { x: number; y: number };
  castDirection: CastDirection;
  slimeGround: { x: number; y: number };
  activityWorld: { x: number; y: number };
  sessionWorld: { x: number; y: number };
  isWaterWorld: (worldX: number, worldY: number) => boolean;
  hasBlockerTile: (tileX: number, tileY: number) => boolean;
}

export interface FishingVisualLayout {
  visualSide: FishingVisualSide;
  bodyFacing: 1 | -1;
  rodFlipX: boolean;
  waterTarget: { x: number; y: number };
  rodNudgeX: number;
  inFront: boolean;
}

export function fishingVisualPhase(presentation: FishingPresentationPhase): FishingVisualPhase {
  if (presentation === "approach") {
    return "approach";
  }
  if (presentation === "arrive" || presentation === "cast") {
    return "cast_air";
  }
  if (presentation === "wait") {
    return "wait_surface";
  }
  if (presentation === "bite") {
    return "bite_submerge";
  }
  if (presentation === "hook" || presentation === "pull") {
    return "fight_underwater";
  }
  if (presentation === "success") {
    return "success";
  }
  if (presentation === "escape") {
    return "escape";
  }
  return "cleanup";
}

export function fishingBobberVisual(phase: FishingVisualPhase): {
  bobber: BobberVisual;
  bubbles: BubbleVisual;
  rodPose: FishingRodPose | null;
  line: "hidden" | "slack" | "normal" | "tension";
} {
  if (phase === "cast_air") {
    return { bobber: "cast_air", bubbles: "off", rodPose: "cast", line: "normal" };
  }
  if (phase === "bobber_land" || phase === "wait_surface") {
    return { bobber: "surface", bubbles: "off", rodPose: "wait", line: "slack" };
  }
  if (phase === "bite_submerge") {
    return { bobber: "submerge", bubbles: "off", rodPose: "bite", line: "tension" };
  }
  if (phase === "fight_underwater") {
    return { bobber: "hidden", bubbles: "loop", rodPose: "pull", line: "tension" };
  }
  if (phase === "success") {
    return { bobber: "hidden", bubbles: "off", rodPose: null, line: "hidden" };
  }
  if (phase === "escape") {
    return { bobber: "hidden", bubbles: "off", rodPose: "wait", line: "slack" };
  }
  return { bobber: "hidden", bubbles: "off", rodPose: null, line: "hidden" };
}

/** Surface bobber never returns once the fight is underwater. */
export function surfaceBobberAllowed(phase: FishingVisualPhase): boolean {
  return fishingBobberVisual(phase).bobber === "surface" || fishingBobberVisual(phase).bobber === "submerge";
}

export function bubblesActive(phase: FishingVisualPhase): boolean {
  return fishingBobberVisual(phase).bubbles === "loop";
}

export function fishingVisualObjectIds(sessionId: string): string[] {
  return [
    `rod:${sessionId}`,
    `castBobber:${sessionId}`,
    `bobber:${sessionId}`,
    `splash:${sessionId}`,
    `bubbles:${sessionId}`,
    `line:${sessionId}`,
  ];
}

/**
 * Fishing clips face right (idle/hop face left). Phaser flipX when facing < 0.
 * Rod art points right unflipped, so body and rod share the same shore flip.
 */
export function fishingFlips(side: FishingVisualSide): { bodyFacing: 1 | -1; rodFlipX: boolean } {
  if (side === "right") {
    return { bodyFacing: 1, rodFlipX: false };
  }
  return { bodyFacing: -1, rodFlipX: true };
}

/** Catch clip is authored unflipped. Do not inherit shore mirroring from wait/cast/pull. */
export function bodyFacingForPresentation(
  presentation: FishingPresentationPhase,
  layoutFacing: 1 | -1,
): 1 | -1 {
  if (presentation === "success") {
    return 1;
  }
  return layoutFacing;
}

/** Phaser flipX with origin (0,1) keeps the AABB to the right of the grip. Origin (1,1)+flipX keeps the grip at the attach point and extends the tip left. */
export function rodPhaserOrigin(flipX: boolean): { x: number; y: number } {
  return { x: flipX ? 1 : 0, y: 1 };
}

export interface FishingWorldQueryGrid {
  getTile(x: number, y: number): { terrain: string } | undefined;
  objectAt(x: number, y: number): unknown;
}

export function fishingWorldQueries(
  grid: FishingWorldQueryGrid | undefined,
): Pick<FishingVisualContext, "isWaterWorld" | "hasBlockerTile"> {
  return {
    isWaterWorld: (worldX, worldY) => {
      if (!grid) {
        return true;
      }
      const tile = worldToTile(worldX, worldY);
      return grid.getTile(tile.x, tile.y)?.terrain === TileType.WATER;
    },
    hasBlockerTile: (tileX, tileY) => Boolean(grid?.objectAt(tileX, tileY)),
  };
}

export function layoutFromFishingWorld(
  sessionWorld: { x: number; y: number },
  slimeGround: { x: number; y: number },
  slimeTile: { x: number; y: number },
  access: FishingAccessPoint | undefined,
  activityWorld: { x: number; y: number } | undefined,
  grid: FishingWorldQueryGrid | undefined,
): FishingVisualLayout {
  const queries = fishingWorldQueries(grid);
  return chooseFishingVisualLayout({
    landTile: access?.landTile ?? slimeTile,
    waterTile: access?.waterTile ?? slimeTile,
    castDirection: access?.castDirection ?? "east",
    slimeGround,
    activityWorld: activityWorld ?? sessionWorld,
    sessionWorld,
    isWaterWorld: queries.isWaterWorld,
    hasBlockerTile: queries.hasBlockerTile,
  });
}

export function visualSideFromCast(castDirection: CastDirection): FishingVisualSide | null {
  if (castDirection === "east") {
    return "right";
  }
  if (castDirection === "west") {
    return "left";
  }
  return null;
}

export function proposeNsWaterTarget(
  waterTile: { x: number; y: number },
  castDirection: "north" | "south",
  side: FishingVisualSide,
): { x: number; y: number } {
  const waterCx = waterTile.x * TILE_SIZE + TILE_SIZE / 2;
  const waterCy = waterTile.y * TILE_SIZE + TILE_SIZE / 2;
  const sideSign = side === "right" ? 1 : -1;
  const nsSign = castDirection === "south" ? 1 : -1;
  return {
    x: Math.floor(waterCx + sideSign * 10),
    y: Math.floor(waterCy + nsSign * 10),
  };
}

export function scoreVisualSide(side: FishingVisualSide, ctx: FishingVisualContext): number {
  let score = 0;
  const proposed =
    ctx.castDirection === "north" || ctx.castDirection === "south"
      ? proposeNsWaterTarget(ctx.waterTile, ctx.castDirection, side)
      : { x: Math.floor(ctx.sessionWorld.x), y: Math.floor(ctx.sessionWorld.y) };
  if (ctx.isWaterWorld(proposed.x, proposed.y)) {
    score += 5;
  }
  const towardActivity = ctx.activityWorld.x - ctx.slimeGround.x;
  if (side === "right" && towardActivity >= 0) {
    score += 3;
  }
  if (side === "left" && towardActivity <= 0) {
    score += 3;
  }
  if (side === "right" && towardActivity < -4) {
    score -= 3;
  }
  if (side === "left" && towardActivity > 4) {
    score -= 3;
  }
  const frontTx = ctx.landTile.x + (side === "right" ? 1 : -1);
  if (ctx.hasBlockerTile(frontTx, ctx.landTile.y)) {
    score -= 2;
  }
  if ((proposed.x - ctx.slimeGround.x) * (side === "right" ? 1 : -1) > 0) {
    score += 1;
  }
  return score;
}

export function chooseFishingVisualSide(ctx: FishingVisualContext): FishingVisualSide {
  const mapped = visualSideFromCast(ctx.castDirection);
  if (mapped) {
    return mapped;
  }
  const left = scoreVisualSide("left", ctx);
  const right = scoreVisualSide("right", ctx);
  if (right > left) {
    return "right";
  }
  if (left > right) {
    return "left";
  }
  return ctx.activityWorld.x >= ctx.slimeGround.x ? "right" : "left";
}

export function choosePresentationWaterTarget(
  ctx: FishingVisualContext,
  side: FishingVisualSide,
): { x: number; y: number } {
  if (ctx.castDirection === "east" || ctx.castDirection === "west") {
    return { x: Math.floor(ctx.sessionWorld.x), y: Math.floor(ctx.sessionWorld.y) };
  }
  if (ctx.castDirection !== "north" && ctx.castDirection !== "south") {
    return { x: Math.floor(ctx.sessionWorld.x), y: Math.floor(ctx.sessionWorld.y) };
  }
  let target = proposeNsWaterTarget(ctx.waterTile, ctx.castDirection, side);
  const waterCx = ctx.waterTile.x * TILE_SIZE + TILE_SIZE / 2;
  const waterCy = ctx.waterTile.y * TILE_SIZE + TILE_SIZE / 2;
  const dx = ctx.activityWorld.x - waterCx;
  const dy = ctx.activityWorld.y - waterCy;
  if (
    ctx.isWaterWorld(ctx.activityWorld.x, ctx.activityWorld.y) &&
    dx * dx + dy * dy <= FISHING.castRadiusPx * FISHING.castRadiusPx
  ) {
    target = {
      x: Math.floor((target.x + ctx.activityWorld.x) / 2),
      y: Math.floor((target.y + ctx.activityWorld.y) / 2),
    };
  }
  if (!ctx.isWaterWorld(target.x, target.y)) {
    target = { x: Math.floor(waterCx), y: Math.floor(waterCy) };
  }
  return target;
}

export function chooseFishingVisualLayout(ctx: FishingVisualContext): FishingVisualLayout {
  const visualSide = chooseFishingVisualSide(ctx);
  const flips = fishingFlips(visualSide);
  const waterTarget = choosePresentationWaterTarget(ctx, visualSide);
  const frontTx = ctx.landTile.x + (visualSide === "right" ? 1 : -1);
  const blocked = ctx.hasBlockerTile(frontTx, ctx.landTile.y);
  return {
    visualSide,
    bodyFacing: flips.bodyFacing,
    rodFlipX: flips.rodFlipX,
    waterTarget,
    rodNudgeX: blocked ? (visualSide === "right" ? -1 : 1) : 0,
    inFront: ctx.castDirection !== "north",
  };
}

export function rodTipWorld(
  handleX: number,
  handleY: number,
  tipLocalX: number,
  tipLocalY: number,
  flipX: boolean,
): { x: number; y: number } {
  const localX = flipX ? -tipLocalX : tipLocalX;
  return {
    x: Math.floor(handleX + localX),
    y: Math.floor(handleY + tipLocalY),
  };
}

export function lineOriginFromRodTip(tip: { x: number; y: number }): { x: number; y: number } {
  return { x: tip.x, y: tip.y };
}

export function surfaceBobberFromCastEnd(airEnd: { x: number; y: number }): { x: number; y: number } {
  return { x: airEnd.x, y: airEnd.y };
}

export function castAirEndEqualsTarget(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  heightPx: number,
): boolean {
  const end = quantizedArc(fromX, fromY, toX, toY, 1, heightPx);
  const surface = surfaceBobberFromCastEnd(end);
  return surface.x === Math.floor(toX) && surface.y === Math.floor(toY);
}
