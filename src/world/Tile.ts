import type {
  CoralVariant,
  DetailType,
  FarmingVisualState,
  GrassVariant,
  ObjectType,
  TileType,
} from "./tileTypes";

export interface WorldTile {
  terrain: TileType;
  grassVariant: GrassVariant | null;
  detail: DetailType | null;
  farming: FarmingVisualState;
  walkable: boolean;
  buildable: boolean;
}

export interface WorldObject {
  type: ObjectType;
  x: number;
  y: number;
  /** Authored visual only. Large coral colors share the `coral` stock. */
  variant?: CoralVariant;
}
