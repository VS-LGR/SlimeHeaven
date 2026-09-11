import { DEPTH } from "../../config";
import {
  buildingById,
  buildingVisualLayout,
  buildingWorldPosition,
  type BuildingTypeId,
  type BuildingVisualPhase,
} from "@/src/simulation/data/buildings";
import type { GridPosition } from "@/src/world/GridPosition";

export interface BuildingSpriteLayout {
  x: number;
  y: number;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  displayWidth: number;
  displayHeight: number;
  depth: number;
  textureKey: string;
}

export function buildingDepth(origin: GridPosition, typeId: BuildingTypeId): number {
  const def = buildingById(typeId);
  return DEPTH.OBJECTS + origin.y + def.footprint.height - 1;
}

export function placedBuildingWorldPosition(origin: GridPosition, typeId: BuildingTypeId) {
  return buildingWorldPosition(origin, buildingById(typeId));
}

/** Shared transform for preview, construction site, and completed house. Texture is the only phase difference. */
export function buildingSpriteLayout(
  origin: GridPosition,
  typeId: BuildingTypeId,
  phase: BuildingVisualPhase,
): BuildingSpriteLayout {
  return {
    ...buildingVisualLayout(origin, typeId, phase),
    depth: buildingDepth(origin, typeId),
  };
}

export interface BuildingSpriteTarget {
  setTexture(key: string): unknown;
  setOrigin(x: number, y: number): unknown;
  setPosition(x: number, y: number): unknown;
  setDisplaySize(width: number, height: number): unknown;
  setDepth(depth: number): unknown;
}

export function applyBuildingSpriteLayout(
  sprite: BuildingSpriteTarget,
  layout: BuildingSpriteLayout,
): void {
  sprite.setTexture(layout.textureKey);
  sprite.setOrigin(layout.originX, layout.originY);
  sprite.setPosition(layout.x, layout.y);
  sprite.setDisplaySize(layout.displayWidth, layout.displayHeight);
  sprite.setDepth(layout.depth);
}

/** Presentation-only cyan wash. Does not change origin, offset, or canvas size. */
export const BUILDING_BLUEPRINT_FILTER = {
  tint: 0x7ec8ff,
  alpha: 0.78,
} as const;

export interface BuildingBlueprintSprite {
  setTint(color: number): unknown;
  setAlpha(alpha: number): unknown;
}

export function applyBuildingBlueprintFilter(sprite: BuildingBlueprintSprite): void {
  sprite.setTint(BUILDING_BLUEPRINT_FILTER.tint);
  sprite.setAlpha(BUILDING_BLUEPRINT_FILTER.alpha);
}
