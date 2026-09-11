import Phaser from "phaser";
import { DEPTH, TILE_SIZE } from "../config";
import { tileToWorld } from "@/src/world/constants";
import type { Simulation } from "@/src/simulation/Simulation";
import type { SlimeId, SlimeState } from "@/src/simulation/entities/SlimeState";
import { slimeView, type SlimeView } from "./slimeView";
import {
  CARRY_TEXTURE,
  PLACEHOLDER_SHADOW_OFFSET_Y,
  SLIME_ORIGIN_X,
  SLIME_ORIGIN_Y,
  SLIME_VISUALS,
  STORAGE_TEXTURE_KEY,
  SLIME_ANIM,
  slimeAnimKey,
  slimeBodyKey,
  slimeShadowKey,
  usesFinalArt,
  playableSlimeAnim,
  resolveCoreClip,
  type SlimeAnimName,
} from "./slimeVisualConfig";
import { usesPingoFishingClip } from "./fishing/resolveFishingAnim";
import { pingoFishingAnimKey } from "./fishing/pingoFishingVisualConfig";
import { MOMO_TILL_BODY, MOMO_TILL_ORIGIN } from "./farming/momoTillVisualConfig";
import { MOMO_FARM_PLANT_OFFSET, MOMO_PLANT_BODY, MOMO_PLANT_ORIGIN } from "./farming/momoPlantVisualConfig";
import {
  MOMO_FARM_HARVEST_OFFSET,
  MOMO_HARVEST_BODY,
  MOMO_HARVEST_ORIGIN,
} from "./farming/momoHarvestVisualConfig";
import {
  usesMomoHarvestClip,
  usesMomoPlantClip,
  usesMomoTillClip,
} from "./farming/resolveFarmingAnim";
import { TITO_CHOP_BODY, TITO_CHOP_ORIGIN, titoGatherSwingFrameRate } from "./gathering/titoChopVisualConfig";
import { usesTitoGatherSwingClip } from "./gathering/resolveGatheringAnim";
import type { SpecialistAnchor } from "./specialist/specialistTypes";
import { layoutFromFishingWorld, bodyFacingForPresentation } from "./fishing/fishingVisualLayout";
import { fishingSessionForSlime } from "@/src/simulation/entities/FishingSession";
import { fishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import type { ResourceType } from "@/src/simulation/resources";
import { workSpeedMultiplier } from "@/src/simulation/needsConfig";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { pickSlimeAtWorldPoint, slimeHitBoxForId } from "./slimeHitTest";

interface SlimeSprites {
  shadow: Phaser.GameObjects.Image;
  body: Phaser.GameObjects.Sprite;
  carry: Phaser.GameObjects.Image;
  emote: Phaser.GameObjects.Text;
}

export interface SlimeVisualDebug {
  visual: "FINAL" | "PLACEHOLDER";
  anim: SlimeAnimName;
  frame: number;
}

export class SlimeRenderer {
  private readonly sprites = new Map<string, SlimeSprites>();
  private readonly facingById = new Map<string, 1 | -1>();
  private readonly pathGraphics: Phaser.GameObjects.Graphics;
  private readonly selectGraphics: Phaser.GameObjects.Graphics;
  private tickAlpha = 0;
  private timeMs = 0;
  private readonly specialistAnchors: SpecialistAnchor[] = [];

  private readonly missingVisualWarned = new Set<string>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly simulation: Simulation,
  ) {
    const storage = simulation.state.storage;
    const { x, y } = tileToWorld(storage.x, storage.y);
    scene.add
      .image(x + TILE_SIZE / 2, y + TILE_SIZE, STORAGE_TEXTURE_KEY)
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.GROUND_DETAIL + 1);

    this.pathGraphics = scene.add.graphics().setDepth(DEPTH.SELECTION - 2);
    this.selectGraphics = scene.add.graphics().setDepth(DEPTH.SELECTION - 1);

    for (const slime of Object.values(simulation.state.slimes)) {
      this.sprites.set(slime.id, this.createSprites(slime));
    }
  }

  specialistPresentation(): SpecialistAnchor[] {
    return this.specialistAnchors;
  }

  sync(tickAlpha: number, timeMs: number): void {
    this.tickAlpha = tickAlpha;
    this.timeMs = timeMs;
    this.specialistAnchors.length = 0;
    const selectedId = useGameUiStore.getState().selectedSlimeId;

    const liveIds = new Set(Object.keys(this.simulation.state.slimes));
    for (const id of [...this.sprites.keys()]) {
      if (!liveIds.has(id)) {
        const leftover = this.sprites.get(id);
        leftover?.shadow.destroy();
        leftover?.body.destroy();
        leftover?.carry.destroy();
        leftover?.emote.destroy();
        this.sprites.delete(id);
        this.facingById.delete(id);
      }
    }

    for (const slime of Object.values(this.simulation.state.slimes)) {
      if (!this.sprites.has(slime.id)) {
        this.sprites.set(slime.id, this.createSprites(slime));
      }
      const sprites = this.sprites.get(slime.id);
      if (!sprites) {
        continue;
      }
      const session = fishingSessionForSlime(this.simulation.state.fishingSessions, slime.id);
      const task = slime.currentTaskId ? this.simulation.state.tasks[slime.currentTaskId] : undefined;
      const view = slimeView(slime, tickAlpha, timeMs, session, this.simulation.state.tickIndex, task);
      const depth = DEPTH.OBJECTS + view.groundY / TILE_SIZE;
      const facing = this.facingFor(slime, view);

      const shadowStyle = this.shadowStyle(slime.id);
      sprites.shadow.setPosition(view.groundX, view.groundY - shadowStyle.pad);
      sprites.shadow.setScale(
        view.shadowScale * shadowStyle.scale,
        shadowStyle.scale,
      );
      sprites.shadow.setDepth(depth - 0.2);

      const farmOffset = usesMomoPlantClip(slime.id, view.anim)
        ? MOMO_FARM_PLANT_OFFSET
        : usesMomoHarvestClip(slime.id, view.anim)
          ? MOMO_FARM_HARVEST_OFFSET
          : { x: 0, y: 0 };
      sprites.body.setPosition(view.groundX + farmOffset.x * facing, view.spriteY + farmOffset.y);
      sprites.body.setDepth(depth);
      this.applyBodyAnim(slime, sprites.body, view);
      if (usesMomoTillClip(slime.id, view.anim)) {
        sprites.body.setOrigin(MOMO_TILL_ORIGIN.x, MOMO_TILL_ORIGIN.y);
      } else if (usesMomoPlantClip(slime.id, view.anim)) {
        sprites.body.setOrigin(MOMO_PLANT_ORIGIN.x, MOMO_PLANT_ORIGIN.y);
      } else if (usesMomoHarvestClip(slime.id, view.anim)) {
        sprites.body.setOrigin(MOMO_HARVEST_ORIGIN.x, MOMO_HARVEST_ORIGIN.y);
      } else if (usesTitoGatherSwingClip(slime.id, view.anim)) {
        sprites.body.setOrigin(TITO_CHOP_ORIGIN.x, TITO_CHOP_ORIGIN.y);
      } else {
        sprites.body.setOrigin(SLIME_ORIGIN_X, SLIME_ORIGIN_Y);
      }
      sprites.body.setScale(view.scaleX, view.scaleY);
      sprites.body.setFlipX(facing < 0);

      this.specialistAnchors.push({
        slimeId: slime.id,
        groundX: view.groundX,
        groundY: view.groundY,
        depth,
        facing,
        anim: view.anim,
        frame: this.currentFrameIndex(slime, sprites.body, view),
      });

      const carryType = slime.carriedResource?.type;
      if (carryType) {
        sprites.carry.setTexture(CARRY_TEXTURE[carryType as ResourceType]);
        sprites.carry.setPosition(view.groundX + 6 * facing, view.groundY - 22 - view.hopLift);
        sprites.carry.setFlipX(facing < 0);
        sprites.carry.setVisible(true);
        sprites.carry.setDepth(depth + 0.1);
      } else {
        sprites.carry.setVisible(false);
      }

      const showEmote =
        Boolean(slime.ambientEmote) && this.simulation.state.tickIndex < slime.ambientEmoteUntilTick;
      sprites.emote.setText(slime.ambientEmote ?? "");
      sprites.emote.setVisible(showEmote);
      sprites.emote.setPosition(view.groundX, view.spriteY - 18);
      sprites.emote.setDepth(depth + 0.2);
    }

    this.drawSelection(selectedId);
    this.drawPath(selectedId);
  }

  visualDebug(slime: SlimeState): SlimeVisualDebug {
    const view = this.viewFor(slime);
    const sprites = this.sprites.get(slime.id);
    return {
      visual: usesFinalArt(slime.id) ? "FINAL" : "PLACEHOLDER",
      anim: view.anim,
      frame: this.currentFrameIndex(slime, sprites?.body, view),
    };
  }

  hitTest(worldX: number, worldY: number): SlimeId | undefined {
    const candidates = Object.values(this.simulation.state.slimes).map((slime) => {
      const view = this.viewFor(slime);
      const box = slimeHitBoxForId(slime.id);
      return {
        id: slime.id,
        groundX: view.groundX,
        groundY: view.groundY,
        halfW: box.halfW,
        hitH: box.hitH,
      };
    });
    return pickSlimeAtWorldPoint(worldX, worldY, candidates);
  }

  private facingFor(slime: SlimeState, view: SlimeView): 1 | -1 {
    if (view.anim === SLIME_ANIM.FISH_SUCCESS) {
      return 1;
    }
    if (
      view.anim === SLIME_ANIM.FARM_TILL ||
      view.anim === SLIME_ANIM.FARM_PLANT ||
      view.anim === SLIME_ANIM.FARM_HARVEST ||
      view.anim === SLIME_ANIM.TITO_GATHER_SWING
    ) {
      if (slime.faceTile && slime.faceTile.x !== slime.tileX) {
        this.facingById.set(slime.id, view.facing);
        return view.facing;
      }
      const locked = this.facingById.get(slime.id) ?? view.facing;
      this.facingById.set(slime.id, locked);
      return locked;
    }
    const fishingFacing = this.fishingBodyFacing(slime, view);
    if (fishingFacing !== undefined) {
      this.facingById.set(slime.id, fishingFacing);
      return fishingFacing;
    }
    const hopping = Boolean(slime.hopTo && slime.hopFrom);
    const fromX = slime.hopFrom?.x ?? slime.tileX;
    const toX = slime.hopTo?.x ?? slime.tileX;
    if (hopping && toX !== fromX) {
      this.facingById.set(slime.id, view.facing);
      return view.facing;
    }
    if (slime.faceTile && slime.faceTile.x !== slime.tileX) {
      this.facingById.set(slime.id, view.facing);
      return view.facing;
    }
    return this.facingById.get(slime.id) ?? view.facing;
  }

  private fishingBodyFacing(slime: SlimeState, view: SlimeView): 1 | -1 | undefined {
    const session = fishingSessionForSlime(this.simulation.state.fishingSessions, slime.id);
    if (!session || session.phase === "idle") {
      return undefined;
    }
    const access = this.simulation.state.fishingAccessPoints.find(
      (point) => point.id === session.accessPointId,
    );
    const activity = this.simulation.state.activities.find((entry) => entry.id === session.activityId);
    return bodyFacingForPresentation(
      fishingPresentationPhase(slime, session, this.simulation.state.tickIndex),
      layoutFromFishingWorld(
        { x: session.worldX, y: session.worldY },
        { x: view.groundX, y: view.groundY },
        { x: slime.tileX, y: slime.tileY },
        access,
        activity ? { x: activity.worldX, y: activity.worldY } : undefined,
        this.simulation.state.grid,
      ).bodyFacing,
    );
  }

  private shadowStyle(id: SlimeId): { pad: number; scale: number } {
    const visual = SLIME_VISUALS[id];
    if (visual.kind !== "final") {
      return { pad: PLACEHOLDER_SHADOW_OFFSET_Y, scale: 1 };
    }
    return { pad: visual.shadowFeetPadPx, scale: visual.shadowScale };
  }

  private playLoopingOrHold(body: Phaser.GameObjects.Sprite, key: string): void {
    if (body.anims.currentAnim?.key !== key) {
      body.play(key);
    } else if (!body.anims.isPlaying && body.anims.currentAnim?.repeat === -1) {
      body.play(key);
    }
  }

  private applyBodyAnim(
    slime: SlimeState,
    body: Phaser.GameObjects.Sprite,
    view: SlimeView,
  ): void {
    const visual = SLIME_VISUALS[slime.id];
    if (visual.kind !== "final") {
      return;
    }
    if (usesPingoFishingClip(slime.id, view.anim)) {
      const key = pingoFishingAnimKey(view.anim);
      if (!key) {
        return;
      }
      if (body.anims.currentAnim?.key !== key) {
        body.play(key);
      } else if (!body.anims.isPlaying && body.anims.currentAnim?.repeat === -1) {
        body.play(key);
      }
      return;
    }
    if (usesMomoTillClip(slime.id, view.anim)) {
      this.playLoopingOrHold(body, MOMO_TILL_BODY.animKey);
      return;
    }
    if (usesMomoPlantClip(slime.id, view.anim)) {
      this.playLoopingOrHold(body, MOMO_PLANT_BODY.animKey);
      return;
    }
    if (usesMomoHarvestClip(slime.id, view.anim)) {
      this.playLoopingOrHold(body, MOMO_HARVEST_BODY.animKey);
      return;
    }
    if (usesTitoGatherSwingClip(slime.id, view.anim)) {
      this.playLoopingOrHold(body, TITO_CHOP_BODY.animKey);
      body.anims.msPerFrame = 1000 / titoGatherSwingFrameRate(workSpeedMultiplier(slime.satiety));
      return;
    }
    const clip = resolveCoreClip(visual, playableSlimeAnim(view.anim));
    if (clip.syncToHopT) {
      const frames = clip.textureKeys;
      const idx = Math.min(frames.length - 1, Math.floor(view.hopT * frames.length));
      if (body.anims.isPlaying) {
        body.anims.stop();
      }
      if (body.texture.key !== frames[idx]) {
        body.setTexture(frames[idx]);
      }
      return;
    }
    const animKey = slimeAnimKey(slime.id, playableSlimeAnim(view.anim));
    if (body.anims.currentAnim?.key !== animKey || !body.anims.isPlaying) {
      body.play({ key: animKey, frameRate: clip.frameRate, repeat: clip.repeat });
    }
    body.anims.msPerFrame = 1000 / clip.frameRate;
  }

  private currentFrameIndex(
    slime: SlimeState,
    body: Phaser.GameObjects.Sprite | undefined,
    view: SlimeView,
  ): number {
    const visual = SLIME_VISUALS[slime.id];
    if (visual.kind !== "final" || !body) {
      return 0;
    }
    if (usesPingoFishingClip(slime.id, view.anim)) {
      return body.anims.currentFrame?.index ?? 0;
    }
    if (
      usesMomoTillClip(slime.id, view.anim) ||
      usesMomoPlantClip(slime.id, view.anim) ||
      usesMomoHarvestClip(slime.id, view.anim) ||
      usesTitoGatherSwingClip(slime.id, view.anim)
    ) {
      return body.anims.currentFrame?.index ?? 0;
    }
    const clip = resolveCoreClip(visual, playableSlimeAnim(view.anim));
    if (clip.syncToHopT) {
      return Math.min(clip.textureKeys.length - 1, Math.floor(view.hopT * clip.textureKeys.length));
    }
    return body.anims.currentFrame?.index ?? 0;
  }

  private initialBodyTexture(slime: SlimeState): string {
    const visual = SLIME_VISUALS[slime.id];
    if (visual.kind === "final") {
      const key = visual.anims.idle.textureKeys[0];
      if (this.scene.textures.exists(key)) {
        return key;
      }
      if (!this.missingVisualWarned.has(slime.id)) {
        this.missingVisualWarned.add(slime.id);
        console.warn(`Missing slime texture ${key}; using placeholder for ${slime.id}.`);
      }
    }
    return slimeBodyKey(slime.id);
  }

  private createSprites(slime: SlimeState): SlimeSprites {
    const view = slimeView(slime, 0, 0);
    const shadow = this.scene.add
      .image(view.groundX, view.groundY - 1, slimeShadowKey())
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH.OBJECTS);
    const body = this.scene.add
      .sprite(view.groundX, view.spriteY, this.initialBodyTexture(slime))
      .setOrigin(SLIME_ORIGIN_X, SLIME_ORIGIN_Y)
      .setDepth(DEPTH.OBJECTS);
    const carry = this.scene.add
      .image(view.groundX, view.spriteY, CARRY_TEXTURE.wood)
      .setOrigin(0.5, 1)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    const emote = this.scene.add
      .text(view.groundX, view.spriteY - 18, "", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#fff8d0",
        stroke: "#1a2430",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 1)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    return { shadow, body, carry, emote };
  }

  private viewFor(slime: SlimeState): SlimeView {
    const session = fishingSessionForSlime(this.simulation.state.fishingSessions, slime.id);
    const task = slime.currentTaskId ? this.simulation.state.tasks[slime.currentTaskId] : undefined;
    return slimeView(slime, this.tickAlpha, this.timeMs, session, this.simulation.state.tickIndex, task);
  }

  private drawSelection(selectedId: string | null): void {
    this.selectGraphics.clear();
    if (!selectedId) {
      return;
    }
    const slime = this.simulation.state.slimes[selectedId];
    if (!slime) {
      return;
    }
    const view = this.viewFor(slime);
    this.selectGraphics.lineStyle(1, 0xfff1a8, 0.9);
    this.selectGraphics.strokeCircle(view.groundX, view.groundY - 8, 10);
  }

  private drawPath(selectedId: string | null): void {
    this.pathGraphics.clear();
    if (!useGameUiStore.getState().debugVisible || !selectedId) {
      return;
    }
    const slime = this.simulation.state.slimes[selectedId];
    if (!slime) {
      return;
    }

    this.fillTile(this.pathGraphics, slime.tileX, slime.tileY, 0x7ec8ff, 0.22);
    if (slime.destination) {
      this.fillTile(this.pathGraphics, slime.destination.x, slime.destination.y, 0xffb347, 0.28);
    }
    for (const step of slime.path) {
      this.fillTile(this.pathGraphics, step.x, step.y, 0x9ae6b4, 0.2);
    }
    if (slime.hopTo) {
      this.fillTile(this.pathGraphics, slime.hopTo.x, slime.hopTo.y, 0x9ae6b4, 0.28);
    }
  }

  private fillTile(
    graphics: Phaser.GameObjects.Graphics,
    tileX: number,
    tileY: number,
    color: number,
    alpha: number,
  ): void {
    const { x, y } = tileToWorld(tileX, tileY);
    graphics.fillStyle(color, alpha);
    graphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }
}
