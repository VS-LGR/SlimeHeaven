import type { Task } from "@/src/simulation/entities/Task";
import { TILE_SIZE, tileToAnchor } from "@/src/world/constants";
import type { GridPosition } from "@/src/world/GridPosition";

/** Feet inset from the shared edge so the west-authored swing overlaps the object. */
const GATHER_STRIKE_INSET = 8;

function quantizedWorld(value: number): number {
  return Math.round(value);
}

function eastLipFeet(stance: GridPosition): { x: number; y: number } {
  const ground = tileToAnchor(stance.x, stance.y);
  return {
    x: quantizedWorld(stance.x * TILE_SIZE + GATHER_STRIKE_INSET),
    y: quantizedWorld(ground.y),
  };
}

function westLipFeet(stance: GridPosition): { x: number; y: number } {
  const ground = tileToAnchor(stance.x, stance.y);
  return {
    x: quantizedWorld((stance.x + 1) * TILE_SIZE - GATHER_STRIKE_INSET),
    y: quantizedWorld(ground.y),
  };
}

/**
 * Feet so a side swing from the south trunk row hits the bole, not the canopy.
 * Only east/west of that row; south/north fallbacks keep tile anchors.
 */
export function woodStrikeFeetWorld(
  origin: GridPosition,
  stance: GridPosition,
): { x: number; y: number } | undefined {
  if (stance.y !== origin.y + 1) {
    return undefined;
  }
  if (stance.x === origin.x + 2) {
    return eastLipFeet(stance);
  }
  if (stance.x === origin.x - 1) {
    return westLipFeet(stance);
  }
  return undefined;
}

/**
 * Feet so a side swing hits the rock cell. Only east/west of the rock.
 */
export function stoneStrikeFeetWorld(
  origin: GridPosition,
  stance: GridPosition,
): { x: number; y: number } | undefined {
  if (stance.y !== origin.y) {
    return undefined;
  }
  if (stance.x === origin.x + 1) {
    return eastLipFeet(stance);
  }
  if (stance.x === origin.x - 1) {
    return westLipFeet(stance);
  }
  return undefined;
}

export function gatherStanceGround(
  task: Task | undefined,
  tileX: number,
  tileY: number,
): { x: number; y: number } | undefined {
  if (!task || (task.type !== "gather_wood" && task.type !== "gather_stone")) {
    return undefined;
  }
  if (tileX !== task.workTile.x || tileY !== task.workTile.y) {
    return undefined;
  }
  if (task.type === "gather_wood") {
    return woodStrikeFeetWorld(task.target, task.workTile);
  }
  return stoneStrikeFeetWorld(task.target, task.workTile);
}
