import type { GridPosition } from "@/src/world/GridPosition";
import type { ResourceType } from "../resources";

export const GATHER_TASK_TYPES = [
  "gather_wood",
  "gather_stone",
  "gather_foliage",
  "gather_copper",
] as const;
export type GatherTaskType = (typeof GATHER_TASK_TYPES)[number];

export const FARM_TASK_TYPES = ["till_soil", "plant_crop", "harvest_crop"] as const;
export type FarmTaskType = (typeof FARM_TASK_TYPES)[number];

export const FISHING_TASK_TYPES = ["fish_activity"] as const;
export type FishingTaskType = (typeof FISHING_TASK_TYPES)[number];

export const CONSTRUCTION_TASK_TYPES = ["construct_building"] as const;
export type ConstructionTaskType = (typeof CONSTRUCTION_TASK_TYPES)[number];

export type TaskType = GatherTaskType | FarmTaskType | FishingTaskType | ConstructionTaskType;

export type JobCategory = "gathering" | "farming" | "fishing" | "construction" | "foraging";

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
  constructionSiteId?: string;
}

export function isFarmTask(type: TaskType): type is FarmTaskType {
  return (FARM_TASK_TYPES as readonly string[]).includes(type);
}

export function isGatherTask(type: TaskType): type is GatherTaskType {
  return (GATHER_TASK_TYPES as readonly string[]).includes(type);
}

export function isFishingTask(type: TaskType): type is FishingTaskType {
  return (FISHING_TASK_TYPES as readonly string[]).includes(type);
}

export function isConstructionTask(type: TaskType): type is ConstructionTaskType {
  return (CONSTRUCTION_TASK_TYPES as readonly string[]).includes(type);
}

export function jobCategory(type: TaskType): JobCategory {
  if (isFarmTask(type)) {
    return "farming";
  }
  if (isFishingTask(type)) {
    return "fishing";
  }
  if (isConstructionTask(type)) {
    return "construction";
  }
  if (type === "gather_foliage") {
    return "foraging";
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
  if (type === "gather_foliage") {
    return "foliage";
  }
  if (type === "gather_copper") {
    return "copperOre";
  }
  if (type === "harvest_crop") {
    return "food";
  }
  return undefined;
}
