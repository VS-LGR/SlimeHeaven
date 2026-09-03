import Phaser from "phaser";
import { DEPTH } from "../../config";
import type { Simulation } from "@/src/simulation/Simulation";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import { SLIME_ANIM } from "../slimeVisualConfig";
import {
  MOMO_TILL_DIRT,
  MOMO_TILL_DIRT_ORIGIN,
  MOMO_TILL_HOE,
  MOMO_TILL_ORIGIN,
} from "../farming/momoTillVisualConfig";
import {
  hoeFrameForBodyFrame,
  hoeWorldPosition,
  impactWorldPosition,
  isTillToolActive,
  shouldSpawnTillImpact,
  visualSideFromFacing,
  type TillVisualSide,
} from "../farming/tillPresentation";
import { isMomoTillDirtReady, isMomoTillHoeReady, usesMomoHarvestClip, usesMomoPlantClip, usesMomoTillClip } from "../farming/resolveFarmingAnim";
import { TITO_CHOP_AXE, TITO_CHOP_ORIGIN, TITO_PICKAXE } from "../gathering/titoChopVisualConfig";
import {
  axeFrameForBodyFrame,
  axeWorldPosition,
  chopVisualSideFromFacing,
  gatherSwingPresentationCycle,
  isChopToolActive,
  isPickaxeToolActive,
  pickaxeFrameForBodyFrame,
  pickaxeWorldPosition,
} from "../gathering/chopPresentation";
import { isTitoChopAxeReady, isTitoPickaxeReady, usesTitoGatherSwingClip } from "../gathering/resolveGatheringAnim";
import type { SpecialistAnchor } from "./specialistTypes";

interface ToolGear {
  hoe: Phaser.GameObjects.Image;
  axe: Phaser.GameObjects.Image;
  pickaxe: Phaser.GameObjects.Image;
  dirt: Phaser.GameObjects.Sprite;
  previousFrame: number | null;
  dirtPlaying: boolean;
  dirtX: number;
  dirtY: number;
  visualSide: TillVisualSide;
}

export interface FarmPresentationDebug {
  task: string;
  anim: string;
  specialist: string;
  frame: number;
  visualSide: TillVisualSide;
  tool: string | null;
  toolFrame: number | null;
  impact: boolean;
  groundX: number;
  groundY: number;
  hoeX: number;
  hoeY: number;
  impactX: number;
  impactY: number;
  presentationCycle: 1 | 2 | null;
}

export class SpecialistToolRenderer {
  private readonly gear = new Map<string, ToolGear>();
  private readonly overlay: Phaser.GameObjects.Graphics;
  private lastDebug: FarmPresentationDebug | null = null;

  constructor(private readonly scene: Phaser.Scene) {
    this.overlay = scene.add.graphics().setDepth(DEPTH.SELECTION + 3);
  }

  lastFarmPresentation(): FarmPresentationDebug | null {
    return this.lastDebug;
  }

  sync(simulation: Simulation, anchors: SpecialistAnchor[], debugVisible: boolean): void {
    const live = new Set<string>();
    this.lastDebug = null;
    this.overlay.clear();

    for (const anchor of anchors) {
      const slime = simulation.state.slimes[anchor.slimeId];
      if (!slime) {
        continue;
      }
      const task = slime.currentTaskId ? simulation.state.tasks[slime.currentTaskId] : undefined;
      const chopping =
        usesTitoGatherSwingClip(anchor.slimeId, anchor.anim) && isChopToolActive(slime, task);
      const mining =
        usesTitoGatherSwingClip(anchor.slimeId, anchor.anim) && isPickaxeToolActive(slime, task);
      const tilling =
        usesMomoTillClip(anchor.slimeId, anchor.anim) && isTillToolActive(slime, task);

      if (chopping) {
        live.add(anchor.slimeId);
        this.hideHoe(anchor.slimeId);
        this.hidePickaxe(anchor.slimeId);
        this.tickDirt(this.gear.get(anchor.slimeId));
        this.showAxe(anchor);
        this.lastDebug = this.gatherDebug(task?.type ?? "gather_wood", "axe", anchor, slime.workElapsedMs);
        if (debugVisible) {
          const axePos = axeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
          this.drawDot(anchor.groundX, anchor.groundY, 0x44cc66);
          this.drawDot(axePos.x, axePos.y, 0xffee55);
        }
        continue;
      }

      if (mining) {
        live.add(anchor.slimeId);
        this.hideHoe(anchor.slimeId);
        this.hideAxe(anchor.slimeId);
        this.tickDirt(this.gear.get(anchor.slimeId));
        this.showPickaxe(anchor);
        this.lastDebug = this.gatherDebug(task?.type ?? "gather_stone", "pickaxe", anchor, slime.workElapsedMs);
        if (debugVisible) {
          const pickPos = pickaxeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
          this.drawDot(anchor.groundX, anchor.groundY, 0x44cc66);
          this.drawDot(pickPos.x, pickPos.y, 0xffee55);
        }
        continue;
      }

      if (!tilling) {
        this.hideHoe(anchor.slimeId);
        this.hideAxe(anchor.slimeId);
        this.hidePickaxe(anchor.slimeId);
        this.tickDirt(this.gear.get(anchor.slimeId));
        if (usesMomoPlantClip(anchor.slimeId, anchor.anim) || usesMomoHarvestClip(anchor.slimeId, anchor.anim)) {
          this.lastDebug = this.bodyOnlyDebug(task?.type ?? anchor.anim, anchor);
          if (debugVisible) {
            this.drawDot(anchor.groundX, anchor.groundY, 0x44cc66);
          }
        }
        continue;
      }
      live.add(anchor.slimeId);
      this.hideAxe(anchor.slimeId);
      this.hidePickaxe(anchor.slimeId);
      const gear = this.ensureGear(anchor.slimeId);
      const hoeFrame = hoeFrameForBodyFrame(anchor.frame);
      const hoePos = hoeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
      const impactPos = impactWorldPosition(anchor.groundX, anchor.groundY, anchor.facing);
      const visualSide = visualSideFromFacing(anchor.facing);
      gear.visualSide = visualSide;

      if (isMomoTillHoeReady()) {
        const hoeKey = MOMO_TILL_HOE.keys[hoeFrame] ?? MOMO_TILL_HOE.keys[0];
        if (hoeKey && gear.hoe.texture.key !== hoeKey) {
          gear.hoe.setTexture(hoeKey);
        }
        gear.hoe.setOrigin(MOMO_TILL_ORIGIN.x, MOMO_TILL_ORIGIN.y);
        gear.hoe.setPosition(hoePos.x, hoePos.y);
        gear.hoe.setFlipX(anchor.facing < 0);
        gear.hoe.setDepth(anchor.depth + 0.12);
        gear.hoe.setVisible(true);
      } else {
        gear.hoe.setVisible(false);
      }

      const spawnImpact = shouldSpawnTillImpact(gear.previousFrame, anchor.frame, true);
      if (spawnImpact && isMomoTillDirtReady()) {
        gear.dirtX = impactPos.x;
        gear.dirtY = impactPos.y;
        gear.dirt.setOrigin(MOMO_TILL_DIRT_ORIGIN.x, MOMO_TILL_DIRT_ORIGIN.y);
        gear.dirt.setPosition(gear.dirtX, gear.dirtY);
        gear.dirt.setFlipX(anchor.facing < 0);
        gear.dirt.setDepth(anchor.depth + 0.02);
        gear.dirt.setVisible(true);
        gear.dirt.play(MOMO_TILL_DIRT.animKey);
        gear.dirtPlaying = true;
      }
      this.tickDirt(gear);
      gear.previousFrame = anchor.frame;

      this.lastDebug = {
        task: task?.type ?? "till_soil",
        anim: SLIME_ANIM.FARM_TILL,
        specialist: SLIME_ANIM.FARM_TILL,
        frame: anchor.frame,
        visualSide,
        tool: isMomoTillHoeReady() ? "hoe" : null,
        toolFrame: isMomoTillHoeReady() ? hoeFrame : null,
        impact: spawnImpact,
        groundX: anchor.groundX,
        groundY: anchor.groundY,
        hoeX: hoePos.x,
        hoeY: hoePos.y,
        impactX: impactPos.x,
        impactY: impactPos.y,
        presentationCycle: null,
      };

      if (debugVisible) {
        this.drawDot(anchor.groundX, anchor.groundY, 0x44cc66);
        this.drawDot(hoePos.x, hoePos.y, 0xffee55);
        this.drawDot(impactPos.x, impactPos.y, 0xff8800);
      }
    }

    for (const id of this.gear.keys()) {
      if (!live.has(id)) {
        this.hideHoe(id);
        this.hideAxe(id);
        this.hidePickaxe(id);
        this.tickDirt(this.gear.get(id));
      }
    }

    if (!this.lastDebug && debugVisible) {
      const momo = simulation.state.slimes[SLIME_IDS.MOMO];
      if (momo) {
        const task = momo.currentTaskId ? simulation.state.tasks[momo.currentTaskId] : undefined;
        if (task?.type === "till_soil" || task?.type === "plant_crop" || task?.type === "harvest_crop") {
          this.lastDebug = {
            task: task.type,
            anim: "work",
            specialist: task.type === "till_soil" ? "farm_till" : task.type === "plant_crop" ? "farm_plant" : "farm_harvest",
            frame: 0,
            visualSide: "west",
            tool: null,
            toolFrame: null,
            impact: false,
            groundX: 0,
            groundY: 0,
            hoeX: 0,
            hoeY: 0,
            impactX: 0,
            impactY: 0,
            presentationCycle: null,
          };
        }
      }
    }
  }

  private ensureGear(slimeId: string): ToolGear {
    const existing = this.gear.get(slimeId);
    if (existing) {
      return existing;
    }
    const hoe = this.scene.add
      .image(0, 0, MOMO_TILL_HOE.keys[0] ?? "")
      .setOrigin(MOMO_TILL_ORIGIN.x, MOMO_TILL_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    const axe = this.scene.add
      .image(0, 0, TITO_CHOP_AXE.keys[0] ?? "")
      .setOrigin(TITO_CHOP_ORIGIN.x, TITO_CHOP_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    const pickaxe = this.scene.add
      .image(0, 0, TITO_PICKAXE.keys[0] ?? "")
      .setOrigin(TITO_CHOP_ORIGIN.x, TITO_CHOP_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    const dirt = this.scene.add
      .sprite(0, 0, MOMO_TILL_DIRT.keys[0] ?? "")
      .setOrigin(MOMO_TILL_DIRT_ORIGIN.x, MOMO_TILL_DIRT_ORIGIN.y)
      .setVisible(false)
      .setDepth(DEPTH.OBJECTS);
    dirt.on("animationcomplete", () => {
      dirt.setVisible(false);
      const gear = this.gear.get(slimeId);
      if (gear) {
        gear.dirtPlaying = false;
      }
    });
    const created: ToolGear = {
      hoe,
      axe,
      pickaxe,
      dirt,
      previousFrame: null,
      dirtPlaying: false,
      dirtX: 0,
      dirtY: 0,
      visualSide: "west",
    };
    this.gear.set(slimeId, created);
    return created;
  }

  private bodyOnlyDebug(task: string, anchor: SpecialistAnchor): FarmPresentationDebug {
    return {
      task,
      anim: anchor.anim,
      specialist: anchor.anim,
      frame: anchor.frame,
      visualSide: visualSideFromFacing(anchor.facing),
      tool: null,
      toolFrame: null,
      impact: false,
      groundX: anchor.groundX,
      groundY: anchor.groundY,
      hoeX: 0,
      hoeY: 0,
      impactX: 0,
      impactY: 0,
      presentationCycle: null,
    };
  }

  private showAxe(anchor: SpecialistAnchor): void {
    const gear = this.ensureGear(anchor.slimeId);
    if (!isTitoChopAxeReady()) {
      gear.axe.setVisible(false);
      return;
    }
    const axeFrame = axeFrameForBodyFrame(anchor.frame);
    const axePos = axeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
    const axeKey = TITO_CHOP_AXE.keys[axeFrame] ?? TITO_CHOP_AXE.keys[0];
    if (axeKey && gear.axe.texture.key !== axeKey) {
      gear.axe.setTexture(axeKey);
    }
    gear.axe.setOrigin(TITO_CHOP_ORIGIN.x, TITO_CHOP_ORIGIN.y);
    gear.axe.setPosition(axePos.x, axePos.y);
    gear.axe.setFlipX(anchor.facing < 0);
    gear.axe.setDepth(anchor.depth + 0.12);
    gear.axe.setVisible(true);
    gear.visualSide = chopVisualSideFromFacing(anchor.facing);
  }

  private gatherDebug(task: string, toolName: "axe" | "pickaxe", anchor: SpecialistAnchor, workElapsedMs: number): FarmPresentationDebug {
    const toolReady = toolName === "axe" ? isTitoChopAxeReady() : isTitoPickaxeReady();
    const toolFrame = toolName === "axe" ? axeFrameForBodyFrame(anchor.frame) : pickaxeFrameForBodyFrame(anchor.frame);
    const toolPos = toolName === "axe"
      ? axeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing)
      : pickaxeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
    return {
      task,
      anim: SLIME_ANIM.TITO_GATHER_SWING,
      specialist: SLIME_ANIM.TITO_GATHER_SWING,
      frame: anchor.frame,
      visualSide: chopVisualSideFromFacing(anchor.facing),
      tool: toolReady ? toolName : null,
      toolFrame: toolReady ? toolFrame : null,
      impact: false,
      groundX: anchor.groundX,
      groundY: anchor.groundY,
      hoeX: toolPos.x,
      hoeY: toolPos.y,
      impactX: 0,
      impactY: 0,
      presentationCycle: gatherSwingPresentationCycle(workElapsedMs),
    };
  }

  private showPickaxe(anchor: SpecialistAnchor): void {
    const gear = this.ensureGear(anchor.slimeId);
    if (!isTitoPickaxeReady()) {
      gear.pickaxe.setVisible(false);
      return;
    }
    const pickFrame = pickaxeFrameForBodyFrame(anchor.frame);
    const pickPos = pickaxeWorldPosition(anchor.groundX, anchor.groundY, anchor.frame, anchor.facing);
    const pickKey = TITO_PICKAXE.keys[pickFrame] ?? TITO_PICKAXE.keys[0];
    if (pickKey && gear.pickaxe.texture.key !== pickKey) {
      gear.pickaxe.setTexture(pickKey);
    }
    gear.pickaxe.setOrigin(TITO_CHOP_ORIGIN.x, TITO_CHOP_ORIGIN.y);
    gear.pickaxe.setPosition(pickPos.x, pickPos.y);
    gear.pickaxe.setFlipX(anchor.facing < 0);
    gear.pickaxe.setDepth(anchor.depth + 0.12);
    gear.pickaxe.setVisible(true);
    gear.visualSide = chopVisualSideFromFacing(anchor.facing);
  }

  private hidePickaxe(slimeId: string): void {
    const gear = this.gear.get(slimeId);
    if (!gear) {
      return;
    }
    gear.pickaxe.setVisible(false);
  }

  private hideHoe(slimeId: string): void {
    const gear = this.gear.get(slimeId);
    if (!gear) {
      return;
    }
    gear.hoe.setVisible(false);
    gear.previousFrame = null;
  }

  private hideAxe(slimeId: string): void {
    const gear = this.gear.get(slimeId);
    if (!gear) {
      return;
    }
    gear.axe.setVisible(false);
  }

  private tickDirt(gear: ToolGear | undefined): void {
    if (!gear?.dirtPlaying) {
      return;
    }
    gear.dirt.setPosition(gear.dirtX, gear.dirtY);
    if (!gear.dirt.anims.isPlaying) {
      gear.dirt.setVisible(false);
      gear.dirtPlaying = false;
    }
  }

  private drawDot(x: number, y: number, color: number): void {
    this.overlay.fillStyle(color, 0.95);
    this.overlay.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
  }
}
