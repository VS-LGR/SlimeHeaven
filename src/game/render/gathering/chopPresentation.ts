import type { SlimeState } from "@/src/simulation/entities/SlimeState";
import type { Task } from "@/src/simulation/entities/Task";
import { WORK_DURATION_MS } from "@/src/simulation/constants";
import {
  TITO_CHOP_AXE_FRAME_MAP,
  TITO_CHOP_TOOL_OFFSETS,
  TITO_GATHER_SWING_HIT_COUNT,
  TITO_PICKAXE_FRAME_MAP,
  type ChopToolOffset,
} from "./titoChopVisualConfig";

export type ChopVisualSide = "west" | "east";

export function isChopToolActive(slime: Pick<SlimeState, "state">, task: Task | undefined): boolean {
  return slime.state === "working" && task?.type === "gather_wood";
}

/** Observational only. Derived from the simulation work timer, never gates finishWork. */
export function gatherSwingPresentationCycle(
  workElapsedMs: number,
  workDurationMs: number = WORK_DURATION_MS,
): 1 | 2 {
  const cycleMs = workDurationMs / TITO_GATHER_SWING_HIT_COUNT;
  return workElapsedMs < cycleMs ? 1 : 2;
}

export function axeFrameForBodyFrame(bodyFrame: number): number {
  const mapped = TITO_CHOP_AXE_FRAME_MAP[bodyFrame];
  if (mapped === undefined) {
    return TITO_CHOP_AXE_FRAME_MAP[TITO_CHOP_AXE_FRAME_MAP.length - 1] ?? 0;
  }
  return mapped;
}

export function chopToolOffsetForFrame(bodyFrame: number): ChopToolOffset {
  return TITO_CHOP_TOOL_OFFSETS[bodyFrame] ?? TITO_CHOP_TOOL_OFFSETS[0] ?? { x: 0, y: 0 };
}

export function chopVisualSideFromFacing(facing: 1 | -1): ChopVisualSide {
  return facing < 0 ? "east" : "west";
}

export function chopMirroredOffsetX(localX: number, facing: 1 | -1): number {
  return localX * facing;
}

export function quantizedChopWorld(value: number): number {
  return Math.round(value);
}

export function axeWorldPosition(
  groundX: number,
  groundY: number,
  bodyFrame: number,
  facing: 1 | -1,
): { x: number; y: number } {
  const offset = chopToolOffsetForFrame(bodyFrame);
  return {
    x: quantizedChopWorld(groundX + chopMirroredOffsetX(offset.x, facing)),
    y: quantizedChopWorld(groundY + offset.y),
  };
}

export function isPickaxeToolActive(slime: Pick<SlimeState, "state">, task: Task | undefined): boolean {
  return slime.state === "working" && task?.type === "gather_stone";
}

export function pickaxeFrameForBodyFrame(bodyFrame: number): number {
  const mapped = TITO_PICKAXE_FRAME_MAP[bodyFrame];
  if (mapped === undefined) {
    return TITO_PICKAXE_FRAME_MAP[TITO_PICKAXE_FRAME_MAP.length - 1] ?? 0;
  }
  return mapped;
}

export function pickaxeWorldPosition(
  groundX: number,
  groundY: number,
  bodyFrame: number,
  facing: 1 | -1,
): { x: number; y: number } {
  const offset = chopToolOffsetForFrame(bodyFrame);
  return {
    x: quantizedChopWorld(groundX + chopMirroredOffsetX(offset.x, facing)),
    y: quantizedChopWorld(groundY + offset.y),
  };
}
