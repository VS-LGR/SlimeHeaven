import { SIMULATION_TICK_MS, SLIME_HOP_DURATION_MS, SLIME_HOP_HEIGHT_PX } from "@/src/simulation/constants";
import type { SlimeState } from "@/src/simulation/entities/SlimeState";
import { SLIME_ANIM, hopTravelT, usesFinalArt, type SlimeAnimName } from "./slimeVisualConfig";
import type { FishingSession } from "@/src/simulation/entities/FishingSession";
import { fishingPresentationPhase } from "@/src/simulation/entities/FishingPresentation";
import { fishingSemanticAnim } from "./fishing/fishingVisualConfig";
import { getFarmingAnimation } from "./farming/resolveFarmingAnim";
import { getGatheringAnimation } from "./gathering/resolveGatheringAnim";
import { slimeGroundWorld, tillRecoverHopGrounds } from "./farming/tillPresentation";
import type { Task } from "@/src/simulation/entities/Task";

function clamp01(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface SlimeView {
  groundX: number;
  groundY: number;
  spriteY: number;
  hopLift: number;
  scaleX: number;
  scaleY: number;
  shadowScale: number;
  anim: SlimeAnimName;
  hopT: number;
  facing: 1 | -1;
}

function hopScale(t: number): { x: number; y: number } {
  if (t < 0.12) {
    const k = t / 0.12;
    return { x: lerp(1.12, 1, k), y: lerp(0.88, 1, k) };
  }
  if (t < 0.28) {
    const k = (t - 0.12) / 0.16;
    return { x: lerp(1, 0.9, k), y: lerp(1, 1.1, k) };
  }
  if (t < 0.72) {
    return { x: 0.94, y: 1.06 };
  }
  if (t < 0.88) {
    const k = (t - 0.72) / 0.16;
    return { x: lerp(0.94, 1.1, k), y: lerp(1.06, 0.9, k) };
  }
  const k = (t - 0.88) / 0.12;
  return { x: lerp(1.1, 1, k), y: lerp(0.9, 1, k) };
}

function idleScale(slime: SlimeState, timeMs: number): { x: number; y: number } {
  const offset = slime.id.length * 173 + slime.spawnX * 19;
  const period = 2600 + offset * 3;
  const local = ((timeMs + offset * 50) % period) / period;
  if (local < 0.62) {
    return { x: 1, y: 1 };
  }
  if (local < 0.72) {
    const k = (local - 0.62) / 0.1;
    return { x: lerp(1, 1.08, k), y: lerp(1, 0.92, k) };
  }
  if (local < 0.82) {
    return { x: 1, y: 1 };
  }
  if (local < 0.92) {
    const k = (local - 0.82) / 0.1;
    return { x: lerp(1, 0.94, k), y: lerp(1, 1.06, k) };
  }
  return { x: 1, y: 1 };
}

function workScale(slime: SlimeState): { x: number; y: number } {
  const wave = Math.sin((slime.workElapsedMs / 180) * Math.PI);
  return { x: 1 + wave * 0.05, y: 1 - wave * 0.05 };
}

function animForState(
  slime: SlimeState,
  hopping: boolean,
  session: FishingSession | undefined,
  tickIndex: number,
  task: Task | undefined,
): SlimeAnimName {
  const presentation = fishingPresentationPhase(slime, session, tickIndex);
  if (presentation !== "idle") {
    return fishingSemanticAnim(presentation);
  }
  if (slime.state === "working") {
    const farming = getFarmingAnimation(slime.id, slime.state, task?.type);
    if (farming.kind === "final") {
      return farming.semantic;
    }
    const gathering = getGatheringAnimation(slime.id, slime.state, task?.type);
    if (gathering.kind === "final") {
      return gathering.semantic;
    }
    return SLIME_ANIM.WORK;
  }
  if (slime.state === "eating") {
    return SLIME_ANIM.WORK;
  }
  if (slime.state === "ambient") {
    return slime.ambientBehaviorId === "social_greet" ? SLIME_ANIM.WORK : SLIME_ANIM.IDLE;
  }
  if (
    hopping ||
    slime.state === "moving_to_task" ||
    slime.state === "moving_to_fishing" ||
    slime.state === "moving_to_ambient" ||
    slime.state === "wandering" ||
    slime.state === "carrying_to_storage" ||
    slime.state === "moving_to_food"
  ) {
    return SLIME_ANIM.HOP;
  }
  return SLIME_ANIM.IDLE;
}

export function slimeView(
  slime: SlimeState,
  tickAlpha: number,
  timeMs: number,
  session?: FishingSession,
  tickIndex = 0,
  task?: Task,
): SlimeView {
  const hopping = Boolean(slime.hopTo && slime.hopFrom);
  const elapsed = hopping ? slime.hopElapsedMs + tickAlpha * SIMULATION_TICK_MS : 0;
  const hopT = hopping ? clamp01(elapsed / SLIME_HOP_DURATION_MS) : 0;
  const travelT = hopping ? hopTravelT(slime.id, hopT) : 0;
  const fromX = slime.hopFrom?.x ?? slime.tileX;
  const fromY = slime.hopFrom?.y ?? slime.tileY;
  const toX = slime.hopTo?.x ?? slime.tileX;
  const toY = slime.hopTo?.y ?? slime.tileY;
  const fromGround = slimeGroundWorld(task, fromX, fromY);
  const toGround = slimeGroundWorld(task, toX, toY);
  const recover =
    hopping &&
    slime.tillRecoverPlot &&
    slime.hopFrom &&
    slime.hopTo &&
    slime.hopFrom.x === slime.hopTo.x &&
    slime.hopFrom.y === slime.hopTo.y
      ? tillRecoverHopGrounds(slime.tillRecoverPlot, slime.hopFrom)
      : undefined;
  const groundX = hopping
    ? lerp((recover?.from ?? fromGround).x, (recover?.to ?? toGround).x, travelT)
    : toGround.x;
  const groundY = hopping
    ? lerp((recover?.from ?? fromGround).y, (recover?.to ?? toGround).y, travelT)
    : toGround.y;
  const hopLift = hopping ? Math.sin(travelT * Math.PI) * SLIME_HOP_HEIGHT_PX : 0;
  const finalArt = usesFinalArt(slime.id);

  const anim = animForState(slime, hopping, session, tickIndex, task);
  let scale = { x: 1, y: 1 };
  if (!finalArt) {
    if (
      slime.state === "working" ||
      slime.state === "eating" ||
      anim === SLIME_ANIM.FISH_CAST ||
      anim === SLIME_ANIM.FISH_BITE ||
      anim === SLIME_ANIM.FISH_PULL
    ) {
      scale = workScale(slime);
    } else if (hopping) {
      scale = hopScale(hopT);
    } else {
      scale = idleScale(slime, timeMs);
    }
  }

  let facing: 1 | -1 = 1;
  if (hopping && toX < fromX) {
    facing = 1;
  } else if (hopping && toX > fromX) {
    facing = -1;
  } else if (slime.faceTile && slime.faceTile.x < slime.tileX) {
    facing = 1;
  } else if (slime.faceTile && slime.faceTile.x > slime.tileX) {
    facing = -1;
  }

  return {
    groundX,
    groundY,
    spriteY: groundY - (finalArt ? 0 : hopLift),
    hopLift,
    scaleX: scale.x,
    scaleY: scale.y,
    shadowScale: hopping ? lerp(1, 0.72, Math.sin(travelT * Math.PI)) : 1,
    anim,
    hopT,
    facing,
  };
}
