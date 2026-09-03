import type { Grid } from "./Grid";
import type { GridPosition } from "./GridPosition";
import { positionsEqual } from "./GridPosition";

const CARDINALS: ReadonlyArray<GridPosition> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

interface Node {
  x: number;
  y: number;
  g: number;
  f: number;
  parent: Node | undefined;
}

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function heuristic(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/**
 * 4-directional A*. Returns tiles from the first step through the goal (start excluded).
 * Empty array means already at the goal. Null means unreachable.
 */
export function findPath(
  grid: Grid,
  start: GridPosition,
  goal: GridPosition,
): GridPosition[] | null {
  if (!grid.inBounds(start.x, start.y) || !grid.inBounds(goal.x, goal.y)) {
    return null;
  }
  if (positionsEqual(start, goal)) {
    return [];
  }
  if (!grid.isWalkable(goal.x, goal.y)) {
    return null;
  }

  const open: Node[] = [
    {
      x: start.x,
      y: start.y,
      g: 0,
      f: heuristic(start.x, start.y, goal.x, goal.y),
      parent: undefined,
    },
  ];
  const bestG = new Map<string, number>([[key(start.x, start.y), 0]]);
  const closed = new Set<string>();

  while (open.length > 0) {
    let bestIndex = 0;
    for (let i = 1; i < open.length; i += 1) {
      if (open[i].f < open[bestIndex].f) {
        bestIndex = i;
      }
    }
    const current = open.splice(bestIndex, 1)[0];
    const currentKey = key(current.x, current.y);
    if (closed.has(currentKey)) {
      continue;
    }
    closed.add(currentKey);

    if (current.x === goal.x && current.y === goal.y) {
      return reconstruct(current);
    }

    for (const dir of CARDINALS) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;
      const neighborKey = key(nx, ny);
      if (closed.has(neighborKey) || !grid.inBounds(nx, ny)) {
        continue;
      }
      const isGoal = nx === goal.x && ny === goal.y;
      const isStart = nx === start.x && ny === start.y;
      if (!isGoal && !isStart && !grid.isWalkable(nx, ny)) {
        continue;
      }
      if (isGoal && !grid.isWalkable(nx, ny)) {
        continue;
      }

      const g = current.g + 1;
      const known = bestG.get(neighborKey);
      if (known !== undefined && g >= known) {
        continue;
      }
      bestG.set(neighborKey, g);
      open.push({
        x: nx,
        y: ny,
        g,
        f: g + heuristic(nx, ny, goal.x, goal.y),
        parent: current,
      });
    }
  }

  return null;
}

function reconstruct(node: Node): GridPosition[] {
  const path: GridPosition[] = [];
  let cursor: Node | undefined = node;
  while (cursor?.parent) {
    path.push({ x: cursor.x, y: cursor.y });
    cursor = cursor.parent;
  }
  path.reverse();
  return path;
}

export function cardinalNeighbors(x: number, y: number): GridPosition[] {
  return CARDINALS.map((dir) => ({ x: x + dir.x, y: y + dir.y }));
}
