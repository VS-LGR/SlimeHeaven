import type { SlimeFsmState, SlimeState } from "@/src/simulation/entities/SlimeState";
import type { Task } from "@/src/simulation/entities/Task";
import { TILE_SIZE, tileToAnchor } from "@/src/world/constants";
import type { GridPosition } from "@/src/world/GridPosition";
import { gatherStanceGround } from "../gathering/gatherPresentation";
import {
  MOMO_TILL_HOE_FRAME_MAP,
  MOMO_TILL_HOE_HEAD_LOCAL,
  MOMO_TILL_IMPACT_FRAME_INDEX,
  MOMO_TILL_IMPACT_OFFSET,
  MOMO_TILL_TOOL_OFFSETS,
  type TillToolOffset,
} from "./momoTillVisualConfig";

export type TillVisualSide = "west" | "east";

export function isTillToolActive(slime: Pick<SlimeState, "state">, task: Task | undefined): boolean {
  return slime.state === "working" && task?.type === "till_soil";
}

export function hoeFrameForBodyFrame(bodyFrame: number): number {
  const mapped = MOMO_TILL_HOE_FRAME_MAP[bodyFrame];
  if (mapped === undefined) {
    return MOMO_TILL_HOE_FRAME_MAP[MOMO_TILL_HOE_FRAME_MAP.length - 1] ?? 0;
  }
  return mapped;
}

export function tillToolOffsetForFrame(bodyFrame: number): TillToolOffset {
  return MOMO_TILL_TOOL_OFFSETS[bodyFrame] ?? MOMO_TILL_TOOL_OFFSETS[0] ?? { x: 0, y: 0 };
}

export function visualSideFromFacing(facing: 1 | -1): TillVisualSide {
  return facing < 0 ? "east" : "west";
}

export function mirroredOffsetX(localX: number, facing: 1 | -1): number {
  return localX * facing;
}

export function quantizedWorld(value: number): number {
  return Math.round(value);
}

export function hoeWorldPosition(
  groundX: number,
  groundY: number,
  bodyFrame: number,
  facing: 1 | -1,
): { x: number; y: number } {
  const offset = tillToolOffsetForFrame(bodyFrame);
  return {
    x: quantizedWorld(groundX + mirroredOffsetX(offset.x, facing)),
    y: quantizedWorld(groundY + offset.y),
  };
}

export function impactWorldPosition(
  groundX: number,
  groundY: number,
  facing: 1 | -1,
): { x: number; y: number } {
  return {
    x: quantizedWorld(
      groundX + mirroredOffsetX(MOMO_TILL_HOE_HEAD_LOCAL.x + MOMO_TILL_IMPACT_OFFSET.x, facing),
    ),
    y: quantizedWorld(groundY + MOMO_TILL_HOE_HEAD_LOCAL.y + MOMO_TILL_IMPACT_OFFSET.y),
  };
}

export function plotCenterWorld(plot: GridPosition): { x: number; y: number } {
  return {
    x: plot.x * TILE_SIZE + TILE_SIZE / 2,
    y: plot.y * TILE_SIZE + TILE_SIZE / 2,
  };
}

function isPlotWorkTask(task: Task | undefined): boolean {
  return task?.type === "plant_crop" || task?.type === "harvest_crop";
}

/**
 * Feet on the plot's geometric center so farm_plant / farm_harvest play on the
 * crop, not the south tile lip. Origin stays the authored feet row; flipX
 * mirrors the pouch around this point. Integer pixels, presentation only.
 */
export function plotWorkFeetWorld(plot: GridPosition): { x: number; y: number } {
  const center = plotCenterWorld(plot);
  return {
    x: quantizedWorld(center.x),
    y: quantizedWorld(center.y),
  };
}

export function plotWorkGround(
  task: Task | undefined,
  tileX: number,
  tileY: number,
): { x: number; y: number } | undefined {
  if (!isPlotWorkTask(task) || !task) {
    return undefined;
  }
  if (tileX !== task.workTile.x || tileY !== task.workTile.y) {
    return undefined;
  }
  return plotWorkFeetWorld(task.workTile);
}

/**
 * Feet so the west-authored hoe blade lands on the plot center.
 * Only east (face west) and west (face east) stances can reach that point.
 */
export function tillStrikeFeetWorld(
  plot: GridPosition,
  stance: GridPosition,
): { x: number; y: number } | undefined {
  if (stance.y !== plot.y) {
    return undefined;
  }
  const center = plotCenterWorld(plot);
  if (stance.x === plot.x + 1) {
    return {
      x: center.x - MOMO_TILL_HOE_HEAD_LOCAL.x,
      y: center.y - MOMO_TILL_HOE_HEAD_LOCAL.y,
    };
  }
  if (stance.x === plot.x - 1) {
    return {
      x: center.x + MOMO_TILL_HOE_HEAD_LOCAL.x,
      y: center.y - MOMO_TILL_HOE_HEAD_LOCAL.y,
    };
  }
  return undefined;
}

export function tillStanceGround(
  task: Task | undefined,
  tileX: number,
  tileY: number,
): { x: number; y: number } | undefined {
  if (task?.type !== "till_soil") {
    return undefined;
  }
  if (tileX !== task.workTile.x || tileY !== task.workTile.y) {
    return undefined;
  }
  return tillStrikeFeetWorld(task.target, task.workTile);
}

export function slimeGroundWorld(
  task: Task | undefined,
  tileX: number,
  tileY: number,
): { x: number; y: number } {
  return (
    tillStanceGround(task, tileX, tileY) ??
    plotWorkGround(task, tileX, tileY) ??
    gatherStanceGround(task, tileX, tileY) ??
    tileToAnchor(tileX, tileY)
  );
}

export function tillRecoverHopGrounds(
  plot: GridPosition,
  stance: GridPosition,
): { from: { x: number; y: number }; to: { x: number; y: number } } | undefined {
  if (stance.x === plot.x && stance.y === plot.y) {
    return { from: plotWorkFeetWorld(plot), to: tileToAnchor(stance.x, stance.y) };
  }
  const from = tillStrikeFeetWorld(plot, stance);
  if (!from) {
    return undefined;
  }
  return { from, to: tileToAnchor(stance.x, stance.y) };
}

export function shouldSpawnTillImpact(
  previousFrame: number | null,
  currentFrame: number,
  workActive: boolean,
  impactFrame: number = MOMO_TILL_IMPACT_FRAME_INDEX,
): boolean {
  if (!workActive) {
    return false;
  }
  if (currentFrame !== impactFrame) {
    return false;
  }
  return previousFrame !== impactFrame;
}

export function tillWorkActive(state: SlimeFsmState, taskType: string | undefined): boolean {
  return state === "working" && taskType === "till_soil";
}
