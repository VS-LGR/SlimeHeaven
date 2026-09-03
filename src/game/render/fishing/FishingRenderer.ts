import Phaser from "phaser";
import { DEPTH } from "../../config";
import { TILE_SIZE } from "@/src/world/constants";
import { FISHING } from "@/src/simulation/fishingConfig";
import { isLiveFishingPhase, type FishingSession } from "@/src/simulation/entities/FishingSession";
import { fishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import type { AquaticActivity } from "@/src/simulation/entities/AquaticActivity";
import type { SlimeState } from "@/src/simulation/entities/SlimeState";
import type { InterestPoint } from "@/src/simulation/entities/InterestPoint";
import type { FishingAccessPoint } from "@/src/simulation/entities/WaterBody";
import { SIMULATION_TICK_MS } from "@/src/simulation/constants";
import type { Grid } from "@/src/world/Grid";
import type { RippleType } from "../water/waterVisualConfig";
import { slimeView } from "../slimeView";
import { fishingSemanticAnim } from "./fishingVisualConfig";
import { FISHING_PRESENTATION, castArcProgress, quantizedArc } from "./fishingVisualConfig";
import {
  FISHING_FX,
  FISHING_FX_ANIM,
  FISHING_FX_ORIGIN,
  FISHING_PROP_KEYS,
  ROD_POSE,
  fishingClipFrame,
  fishingRodPlacement,
} from "./pingoFishingVisualConfig";
import {
  fishingBobberVisual,
  fishingVisualPhase,
  layoutFromFishingWorld,
  lineOriginFromRodTip,
  surfaceBobberFromCastEnd,
  type FishingVisualLayout,
} from "./fishingVisualLayout";

export const FISHING_BOBBER_KEY = "fishing-bobber";

interface SessionGear {
  rod: Phaser.GameObjects.Image;
  castBobber: Phaser.GameObjects.Image;
  bobber: Phaser.GameObjects.Sprite;
  splash: Phaser.GameObjects.Sprite;
  bubbles: Phaser.GameObjects.Sprite;
  lastPhase: string;
  lastBobberMode: string;
  landingX: number | null;
  landingY: number | null;
  submergeX: number | null;
  submergeY: number | null;
}

export interface FishingVisualAnchor {
  sessionId: string;
  feetX: number;
  feetY: number;
  rodOriginX: number;
  rodOriginY: number;
  rodTipX: number;
  rodTipY: number;
  lineStartX: number;
  lineStartY: number;
  lineEndX: number;
  lineEndY: number;
  bobberX: number;
  bobberY: number;
  bubbleX: number;
  bubbleY: number;
  castDirection: string;
  visualSide: string;
  waterTargetX: number;
  waterTargetY: number;
  phase: string;
  visualPhase: string;
  animFrame: number;
  rodPose: string;
}

export class FishingRenderer {
  private readonly gear = new Map<string, SessionGear>();
  private readonly overlay: Phaser.GameObjects.Graphics;
  private readonly line: Phaser.GameObjects.Graphics;
  private readonly lastPhaseById = new Map<string, FishingSession["phase"]>();
  private readonly anchors: FishingVisualAnchor[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly spawnRipple: (worldX: number, worldY: number, type: RippleType) => void,
  ) {
    this.overlay = scene.add.graphics().setDepth(DEPTH.SELECTION + 3);
    this.line = scene.add.graphics().setDepth(DEPTH.FISHING_BOBBER + 0.02);
  }

  sync(
    sessions: readonly FishingSession[],
    activities: readonly AquaticActivity[],
    slimes: Record<string, SlimeState>,
    accessPoints: readonly FishingAccessPoint[],
    tickAlpha: number,
    tickIndex: number,
    timeMs: number,
    showRadius: boolean,
    showInterestPoints: boolean,
    showVisualDebug: boolean,
    interestPoints: readonly InterestPoint[],
    grid?: Grid,
  ): void {
    this.drawSessions(sessions, activities, slimes, accessPoints, tickAlpha, tickIndex, timeMs, grid);
    this.emitRipples(sessions);
    this.drawDebugOverlay(
      sessions,
      activities,
      showRadius,
      showInterestPoints,
      showVisualDebug,
      interestPoints,
    );
  }

  visualAnchors(): readonly FishingVisualAnchor[] {
    return this.anchors;
  }

  destroy(): void {
    for (const gear of this.gear.values()) {
      destroyGear(gear);
    }
    this.gear.clear();
    this.overlay.destroy();
    this.line.destroy();
  }

  private drawSessions(
    sessions: readonly FishingSession[],
    activities: readonly AquaticActivity[],
    slimes: Record<string, SlimeState>,
    accessPoints: readonly FishingAccessPoint[],
    tickAlpha: number,
    tickIndex: number,
    timeMs: number,
    grid: Grid | undefined,
  ): void {
    this.line.clear();
    this.anchors.length = 0;
    const liveIds = new Set(
      sessions.filter((session) => session.phase !== "idle").map((session) => session.sessionId),
    );
    for (const [id, gear] of this.gear) {
      if (!liveIds.has(id)) {
        destroyGear(gear);
        this.gear.delete(id);
      }
    }

    for (const session of sessions) {
      if (session.phase === "idle" || !session.assignedSlimeId) {
        continue;
      }
      const slime = slimes[session.assignedSlimeId];
      if (!slime) {
        continue;
      }
      const access = accessPoints.find((point) => point.id === session.accessPointId);
      const activity = activities.find((entry) => entry.id === session.activityId);
      const view = slimeView(slime, tickAlpha, timeMs, session, tickIndex);
      const layout = layoutFromFishingWorld(
        { x: session.worldX, y: session.worldY },
        { x: view.groundX, y: view.groundY },
        { x: slime.tileX, y: slime.tileY },
        access,
        activity ? { x: activity.worldX, y: activity.worldY } : undefined,
        grid,
      );
      const presentation = fishingPresentationPhase(slime, session, tickIndex);
      const visualPhase = fishingVisualPhase(presentation);
      const visual = fishingBobberVisual(visualPhase);
      const semantic = fishingSemanticAnim(presentation);
      const elapsedMs = clipElapsedMs(session, tickIndex, tickAlpha, timeMs, presentation);
      const frameIndex = fishingClipFrame(semantic, elapsedMs);
      const pose = visual.rodPose;
      const placement = pose
        ? fishingRodPlacement(
            view.groundX,
            view.groundY,
            pose,
            layout.visualSide,
            semantic,
            frameIndex,
            layout.rodNudgeX,
          )
        : null;
      const rodDepth = DEPTH.OBJECTS + slime.tileY + (layout.inFront ? 0.15 : -0.12);
      const gear = this.ensureGear(session.sessionId);
      this.syncRod(gear, pose, placement, rodDepth);
      const bobberPos = this.syncBobbers(
        gear,
        session,
        visual.bobber,
        placement,
        layout,
        tickIndex,
        tickAlpha,
      );
      this.syncSplash(gear, visualPhase, bobberPos);
      const bubblePos = this.syncBubbles(gear, visual.bubbles, visualPhase, bobberPos);
      const lineEnd = lineEndForPhase(visualPhase, bobberPos, bubblePos, layout.waterTarget);
      this.drawLine(visual.line, placement, lineEnd, rodDepth);

      const lineStart = placement
        ? lineOriginFromRodTip({ x: placement.tipX, y: placement.tipY })
        : { x: view.groundX, y: view.groundY };
      this.anchors.push({
        sessionId: session.sessionId,
        feetX: view.groundX,
        feetY: view.groundY,
        rodOriginX: placement?.handleX ?? view.groundX,
        rodOriginY: placement?.handleY ?? view.groundY,
        rodTipX: placement?.tipX ?? view.groundX,
        rodTipY: placement?.tipY ?? view.groundY,
        lineStartX: lineStart.x,
        lineStartY: lineStart.y,
        lineEndX: lineEnd.x,
        lineEndY: lineEnd.y,
        bobberX: layout.waterTarget.x,
        bobberY: layout.waterTarget.y,
        bubbleX: bubblePos.x,
        bubbleY: bubblePos.y,
        castDirection: access?.castDirection ?? "east",
        visualSide: layout.visualSide,
        waterTargetX: layout.waterTarget.x,
        waterTargetY: layout.waterTarget.y,
        phase: presentation,
        visualPhase,
        animFrame: frameIndex,
        rodPose: pose ?? "none",
      });
      gear.lastPhase = visualPhase;
    }
  }

  private ensureGear(sessionId: string): SessionGear {
    const existing = this.gear.get(sessionId);
    if (existing) {
      return existing;
    }
    const rod = this.scene.add
      .image(0, 0, FISHING_PROP_KEYS.rodWait)
      .setOrigin(0, 1)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    const castBobber = this.scene.add
      .image(0, 0, this.castAirTexture())
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(DEPTH.FISHING_BOBBER + 0.03);
    const bobber = this.scene.add
      .sprite(0, 0, this.bobberTexture())
      .setOrigin(FISHING_FX_ORIGIN.x, FISHING_FX_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.FISHING_BOBBER);
    const splash = this.scene.add
      .sprite(0, 0, FISHING_FX.splash.keys[0] ?? this.bobberTexture())
      .setOrigin(FISHING_FX_ORIGIN.x, FISHING_FX_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.FISHING_BOBBER + 0.04);
    const bubbles = this.scene.add
      .sprite(0, 0, FISHING_FX.bubbles.keys[0] ?? this.bobberTexture())
      .setOrigin(FISHING_FX_ORIGIN.x, FISHING_FX_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.FISHING_BOBBER + 0.05);
    const gear: SessionGear = {
      rod,
      castBobber,
      bobber,
      splash,
      bubbles,
      lastPhase: "",
      lastBobberMode: "",
      landingX: null,
      landingY: null,
      submergeX: null,
      submergeY: null,
    };
    this.gear.set(sessionId, gear);
    return gear;
  }

  private syncRod(
    gear: SessionGear,
    pose: ReturnType<typeof fishingBobberVisual>["rodPose"],
    placement: ReturnType<typeof fishingRodPlacement> | null,
    rodDepth: number,
  ): void {
    if (!pose || !placement || !this.scene.textures.exists(ROD_POSE[pose].textureKey)) {
      gear.rod.setVisible(false);
      return;
    }
    const poseDef = ROD_POSE[pose];
    gear.rod.setTexture(poseDef.textureKey);
    gear.rod.setOrigin(placement.originX, placement.originY);
    gear.rod.setPosition(placement.handleX, placement.handleY);
    gear.rod.setFlipX(placement.flipX);
    gear.rod.setDepth(rodDepth);
    gear.rod.setVisible(true);
  }

  private syncBobbers(
    gear: SessionGear,
    session: FishingSession,
    mode: ReturnType<typeof fishingBobberVisual>["bobber"],
    placement: ReturnType<typeof fishingRodPlacement> | null,
    layout: FishingVisualLayout,
    tickIndex: number,
    tickAlpha: number,
  ): { x: number; y: number } {
    const target = layout.waterTarget;
    if (mode === "cast_air") {
      let pos = target;
      if (placement) {
        const t = castArcProgress(session.arriveUntilTick, session.castUntilTick, tickIndex, tickAlpha);
        pos = quantizedArc(
          placement.tipX,
          placement.tipY,
          target.x,
          target.y,
          t >= 1 ? 1 : t,
          FISHING_PRESENTATION.bobberArcHeightPx,
        );
        if (t >= 1) {
          gear.landingX = pos.x;
          gear.landingY = pos.y;
        }
      }
      gear.castBobber.setTexture(this.castAirTexture());
      gear.castBobber.setPosition(pos.x, pos.y);
      gear.castBobber.setVisible(true);
      gear.bobber.setVisible(false);
      if (gear.bobber.anims.isPlaying) {
        gear.bobber.anims.stop();
      }
      gear.lastBobberMode = mode;
      return pos;
    }

    gear.castBobber.setVisible(false);
    const landing = surfaceBobberFromCastEnd({
      x: gear.landingX ?? target.x,
      y: gear.landingY ?? target.y,
    });
    gear.landingX = landing.x;
    gear.landingY = landing.y;

    if (mode === "hidden") {
      if (gear.bobber.anims.isPlaying) {
        gear.bobber.anims.stop();
      }
      gear.bobber.setVisible(false);
      gear.lastBobberMode = mode;
      return landing;
    }

    gear.bobber.setPosition(landing.x, landing.y);
    gear.bobber.setDepth(DEPTH.FISHING_BOBBER);
    if (mode === "surface") {
      gear.bobber.setVisible(true);
      if (
        this.scene.anims.exists(FISHING_FX_ANIM.bobberIdle) &&
        gear.bobber.anims.currentAnim?.key !== FISHING_FX_ANIM.bobberIdle
      ) {
        gear.bobber.play(FISHING_FX_ANIM.bobberIdle);
      }
    } else if (mode === "submerge") {
      gear.bobber.setVisible(true);
      gear.submergeX = landing.x;
      gear.submergeY = landing.y;
      if (gear.lastBobberMode !== "submerge" && this.scene.anims.exists(FISHING_FX_ANIM.submerge)) {
        gear.bobber.play(FISHING_FX_ANIM.submerge);
        gear.bobber.once("animationcomplete", () => {
          gear.bobber.setVisible(false);
        });
      }
    }
    gear.lastBobberMode = mode;
    return landing;
  }

  private syncSplash(
    gear: SessionGear,
    visualPhase: string,
    bobberPos: { x: number; y: number },
  ): void {
    const justEntered = gear.lastPhase !== visualPhase;
    if (!this.scene.anims.exists(FISHING_FX_ANIM.splash)) {
      gear.splash.setVisible(false);
      return;
    }
    let play = false;
    let scale = 1;
    if (justEntered && visualPhase === "wait_surface") {
      play = true;
      scale = FISHING_PRESENTATION.landingSplashScale;
    } else if (justEntered && visualPhase === "bite_submerge") {
      play = true;
      scale = FISHING_PRESENTATION.biteSplashScale;
    } else if (justEntered && visualPhase === "success") {
      play = true;
      scale = FISHING_PRESENTATION.successSplashScale;
    } else if (justEntered && visualPhase === "escape") {
      play = true;
      scale = FISHING_PRESENTATION.landingSplashScale;
    }
    if (!play) {
      if (!gear.splash.anims.isPlaying) {
        gear.splash.setVisible(false);
      }
      return;
    }
    gear.splash.setPosition(bobberPos.x, bobberPos.y);
    gear.splash.setScale(scale);
    gear.splash.setVisible(true);
    gear.splash.play(FISHING_FX_ANIM.splash);
    gear.splash.once("animationcomplete", () => {
      gear.splash.setVisible(false);
    });
  }

  private syncBubbles(
    gear: SessionGear,
    mode: ReturnType<typeof fishingBobberVisual>["bubbles"],
    visualPhase: string,
    bobberPos: { x: number; y: number },
  ): { x: number; y: number } {
    const looping =
      mode === "loop" ||
      (visualPhase === "bite_submerge" && !gear.bobber.visible && gear.lastBobberMode === "submerge");
    const x = gear.landingX ?? bobberPos.x;
    const y = gear.landingY ?? bobberPos.y;
    gear.submergeX = x;
    gear.submergeY = y;
    if (!looping || !this.scene.anims.exists(FISHING_FX_ANIM.bubbles)) {
      if (gear.bubbles.anims.isPlaying) {
        gear.bubbles.anims.stop();
      }
      gear.bubbles.setVisible(false);
      return { x, y };
    }
    gear.bubbles.setPosition(x, y);
    gear.bubbles.setOrigin(FISHING_FX_ORIGIN.x, FISHING_FX_ORIGIN.y);
    gear.bubbles.setVisible(true);
    if (gear.bubbles.anims.currentAnim?.key !== FISHING_FX_ANIM.bubbles || !gear.bubbles.anims.isPlaying) {
      gear.bubbles.play({ key: FISHING_FX_ANIM.bubbles, repeat: -1 });
    }
    return { x, y };
  }

  private drawLine(
    tension: ReturnType<typeof fishingBobberVisual>["line"],
    placement: ReturnType<typeof fishingRodPlacement> | null,
    bobberPos: { x: number; y: number },
    rodDepth: number,
  ): void {
    if (tension === "hidden" || !placement) {
      return;
    }
    this.line.setDepth(rodDepth - 0.05);
    const origin = lineOriginFromRodTip({ x: placement.tipX, y: placement.tipY });
    const x0 = origin.x;
    const y0 = origin.y;
    const x1 = bobberPos.x;
    const y1 = bobberPos.y;
    this.line.lineStyle(1, FISHING_PRESENTATION.lineColor, 1);
    if (tension === "slack") {
      const midX = Math.floor((x0 + x1) / 2);
      const midY = Math.floor((y0 + y1) / 2 + FISHING_PRESENTATION.lineSlackDropPx);
      this.line.beginPath();
      this.line.moveTo(x0, y0);
      this.line.lineTo(midX, midY);
      this.line.lineTo(x1, y1);
      this.line.strokePath();
      return;
    }
    this.line.lineBetween(x0, y0, x1, y1);
  }

  private bobberTexture(): string {
    if (this.scene.textures.exists(FISHING_FX.bobberIdle.keys[0])) {
      return FISHING_FX.bobberIdle.keys[0];
    }
    return FISHING_BOBBER_KEY;
  }

  private castAirTexture(): string {
    if (this.scene.textures.exists(FISHING_PROP_KEYS.bobberCastAir)) {
      return FISHING_PROP_KEYS.bobberCastAir;
    }
    return this.bobberTexture();
  }

  private emitRipples(sessions: readonly FishingSession[]): void {
    const seen = new Set<string>();
    for (const session of sessions) {
      seen.add(session.sessionId);
      const last = this.lastPhaseById.get(session.sessionId);
      if (last === session.phase) {
        continue;
      }
      this.lastPhaseById.set(session.sessionId, session.phase);
      if (session.phase === "bite") {
        this.spawnRipple(session.worldX, session.worldY, "bite");
      }
      if (session.phase === "escaped") {
        this.spawnRipple(session.worldX, session.worldY, "fish");
      }
    }
    for (const id of this.lastPhaseById.keys()) {
      if (!seen.has(id)) {
        this.lastPhaseById.delete(id);
      }
    }
  }

  private drawDebugOverlay(
    sessions: readonly FishingSession[],
    activities: readonly AquaticActivity[],
    showRadius: boolean,
    showInterestPoints: boolean,
    showVisualDebug: boolean,
    interestPoints: readonly InterestPoint[],
  ): void {
    this.overlay.clear();
    if (showRadius) {
      const radius = FISHING.castRadiusPx;
      for (const activity of activities) {
        if (activity.state === "consumed") {
          continue;
        }
        this.overlay.lineStyle(1, activity.state === "reserved" ? 0xf0c070 : 0x7adcf2, 0.8);
        this.overlay.strokeCircle(activity.worldX, activity.worldY, radius);
        this.overlay.fillStyle(0x7adcf2, 0.35);
        this.overlay.fillRect(Math.floor(activity.worldX), Math.floor(activity.worldY), 1, 1);
      }
      for (const session of sessions) {
        if (!isLiveFishingPhase(session.phase)) {
          continue;
        }
        this.overlay.lineStyle(1, 0xe8fbff, 0.55);
        this.overlay.strokeCircle(session.worldX, session.worldY, radius);
      }
    }
    if (showVisualDebug) {
      for (const anchor of this.anchors) {
        this.overlay.fillStyle(0xc43c3c, 1);
        this.overlay.fillRect(Math.floor(anchor.rodOriginX) - 1, Math.floor(anchor.rodOriginY) - 1, 3, 3);
        this.overlay.fillStyle(0xfff44a, 1);
        this.overlay.fillRect(Math.floor(anchor.rodTipX) - 1, Math.floor(anchor.rodTipY) - 1, 3, 3);
        this.overlay.fillStyle(0x62c46a, 1);
        this.overlay.fillRect(Math.floor(anchor.lineStartX) - 1, Math.floor(anchor.lineStartY) - 1, 3, 3);
        this.overlay.fillStyle(0x7adcf2, 1);
        this.overlay.fillRect(Math.floor(anchor.waterTargetX) - 1, Math.floor(anchor.waterTargetY) - 1, 3, 3);
        this.overlay.fillStyle(0xe879f9, 1);
        this.overlay.fillRect(Math.floor(anchor.bubbleX) - 1, Math.floor(anchor.bubbleY) - 1, 3, 3);
      }
    }
    if (!showInterestPoints) {
      return;
    }
    for (const point of interestPoints) {
      const x = point.tile.x * TILE_SIZE + 4;
      const y = point.tile.y * TILE_SIZE + 4;
      const color = interestDebugColor(point.tags);
      this.overlay.fillStyle(color, 0.7);
      this.overlay.fillRect(x, y, 8, 8);
    }
  }
}

function destroyGear(gear: SessionGear): void {
  gear.rod.destroy();
  gear.castBobber.destroy();
  gear.bobber.destroy();
  gear.splash.destroy();
  gear.bubbles.destroy();
}

function lineEndForPhase(
  visualPhase: string,
  bobberPos: { x: number; y: number },
  bubblePos: { x: number; y: number },
  waterTarget: { x: number; y: number },
): { x: number; y: number } {
  if (visualPhase === "fight_underwater") {
    return bubblePos;
  }
  if (visualPhase === "cast_air" || visualPhase === "wait_surface" || visualPhase === "bite_submerge") {
    return bobberPos;
  }
  return waterTarget;
}

function clipElapsedMs(
  session: FishingSession,
  tickIndex: number,
  tickAlpha: number,
  timeMs: number,
  presentation: string,
): number {
  const now = (tickIndex + tickAlpha) * SIMULATION_TICK_MS;
  if (presentation === "arrive" || presentation === "cast") {
    const startTick = session.arriveUntilTick - FISHING.arriveTicks;
    return Math.max(0, now - startTick * SIMULATION_TICK_MS);
  }
  if (presentation === "wait") {
    return Math.max(0, now - session.castUntilTick * SIMULATION_TICK_MS);
  }
  if (presentation === "bite") {
    return Math.max(0, now - (session.biteUntilTick - FISHING.biteDisplayTicks) * SIMULATION_TICK_MS);
  }
  if (presentation === "hook" || presentation === "pull") {
    return session.fightStartedAtMs > 0 ? Math.max(0, timeMs - session.fightStartedAtMs) : 0;
  }
  if (presentation === "success" && session.resultAtMs > 0) {
    return Math.max(0, timeMs - session.resultAtMs);
  }
  return now;
}

function interestDebugColor(tags: readonly string[]): number {
  if (tags.includes("water_edge")) {
    return 0x4ea3e0;
  }
  if (tags.includes("farm")) {
    return 0x62c46a;
  }
  if (tags.includes("storage")) {
    return 0xe8d48a;
  }
  return 0x9ae6b4;
}
