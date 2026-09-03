/** Authoritative logical terrain cell size for the prototype tileset. */
export const TILE_SIZE = 32;

export function worldToTile(
  worldX: number,
  worldY: number,
): { x: number; y: number } {
  return {
    x: Math.floor(worldX / TILE_SIZE),
    y: Math.floor(worldY / TILE_SIZE),
  };
}

export function tileToWorld(
  tileX: number,
  tileY: number,
): { x: number; y: number } {
  return {
    x: tileX * TILE_SIZE,
    y: tileY * TILE_SIZE,
  };
}

/** Bottom-center of a logical cell — slime ground contact / Y-sort point. */
export function tileToAnchor(
  tileX: number,
  tileY: number,
): { x: number; y: number } {
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE,
  };
}
