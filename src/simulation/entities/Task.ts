import type { GridPosition } from "@/src/world/GridPosition";
import type { ResourceType } from "../resources";

export const GATHER_TASK_TYPES = ["gather_wood", "gather_stone"] as const;
export type GatherTaskType = (typeof GATHER_TASK_TYPES)[number];

export const FARM_TASK_TYPES = ["till_soil", "plant_crop", "harvest_crop"] as const;
export type FarmTaskType = (typeof FARM_TASK_TYPES)[number];

export const FISHING_TASK_TYPES = ["fish_activity"] as const;
export type FishingTaskType = (typeof FISHING_TASK_TYPES)[number];

export type TaskType = GatherTaskType | FarmTaskType | FishingTaskType;

export type JobCategory = "gathering" | "farming" | "fishing" | "construction";

export type TaskState =
  | "available"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Task {
  id: string;
  type: TaskType;
  target: GridPosition;
  nodeId: string;
  workTile: GridPosition;
  resourceType?: ResourceType;
  state: TaskState;
  assignedSlimeId?: string;
  /** Override type-default requirements. Empty array = universal job. */
  requiredCapabilities?: readonly string[];
}

export function isFarmTask(type: TaskType): boolean {
  return (FARM_TASK_TYPES as readonly string[]).includes(type);
}

export function isGatherTask(type: TaskType): boolean {
  return (GATHER_TASK_TYPES as readonly string[]).includes(type);
}

export function isFishingTask(type: TaskType): boolean {
  return (FISHING_TASK_TYPES as readonly string[]).includes(type);
}

export function jobCategory(type: TaskType): JobCategory {
  if (isFarmTask(type)) {
    return "farming";
  }
  if (isFishingTask(type)) {
    return "fishing";
  }
  return "gathering";
}

export function resourceTypeForTask(type: TaskType): ResourceType | undefined {
  if (type === "gather_wood") {
    return "wood";
  }
  if (type === "gather_stone") {
    return "stone";
  }
  if (type === "harvest_crop") {
    return "food";
  }
  return undefined;
}
