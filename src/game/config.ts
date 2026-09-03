import Phaser from "phaser";
import { TILE_SIZE } from "@/src/world/constants";

export { TILE_SIZE };

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

export const ZOOM_LEVELS = [1, 2, 3, 4] as const;
export type ZoomLevel = (typeof ZOOM_LEVELS)[number];
export const DEFAULT_ZOOM: ZoomLevel = 2;

/** Screen-space pan speed in CSS pixels per second. */
export const CAMERA_PAN_SPEED = 180;

export const TILESET_KEY = "terrain";
export const TILESET_PATH = "/assets/tiles/Terrain.png";
export const TILESET_SOURCE_WIDTH = 256;
export const TILESET_SOURCE_HEIGHT = 224;

export const SCENE_KEYS = {
  BOOT: "BootScene",
  VILLAGE: "VillageScene",
} as const;

export const DEPTH = {
  GROUND: 0,
  WATER_DEPTH: 0.15,
  WATER_FISH: 0.18,
  WATER_SURFACE: 0.22,
  WATER_SHORE: 0.26,
  WATER_CLUE: 0.3,
  WATER_RIPPLE: 0.32,
  FISHING_BOBBER: 0.4,
  FARMING: 0.5,
  GROUND_DETAIL: 1,
  OBJECTS: 10,
  SELECTION: 1000,
} as const;

export const REGISTRY_KEYS = {
  GAME_STATE: "gameState",
  SIMULATION: "simulation",
} as const;

export function createPhaserConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#1a1f18",
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    banner: false,
    scale: {
      mode: Phaser.Scale.NONE,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      powerPreference: "low-power",
    },
  };
}

export function integerCanvasScale(parentWidth: number, parentHeight: number): number {
  return Math.max(
    1,
    Math.floor(Math.min(parentWidth / GAME_WIDTH, parentHeight / GAME_HEIGHT)),
  );
}
