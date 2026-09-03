export interface GridPosition {
  x: number;
  y: number;
}

export function positionsEqual(a: GridPosition, b: GridPosition): boolean {
  return a.x === b.x && a.y === b.y;
}
