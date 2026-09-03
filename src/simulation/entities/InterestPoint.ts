import type { GridPosition } from "@/src/world/GridPosition";

export type InterestTag =
  | "water_edge"
  | "farm"
  | "flower"
  | "tree"
  | "rock"
  | "storage"
  | "nature"
  | "social";

export interface InterestPoint {
  id: string;
  type: string;
  tile: GridPosition;
  tags: InterestTag[];
  interactionRadius?: number;
  sourceId?: string;
  reservedBy: string | null;
}

export function interestPointsWithTag(
  points: readonly InterestPoint[],
  tag: InterestTag,
): InterestPoint[] {
  return points.filter((point) => point.tags.includes(tag));
}
