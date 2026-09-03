import { OBJECT_DEFS, ObjectType } from "./tileTypes";
import type { Grid } from "./Grid";
import type { GridPosition } from "./GridPosition";
import { cardinalNeighbors } from "./pathfinding";
import type { ResourceNode } from "@/src/simulation/entities/ResourceNode";
import { RESOURCE_IDS } from "@/src/simulation/resources";

function firstWalkableNeighbor(grid: Grid, cells: GridPosition[]): GridPosition | undefined {
  const seen = new Set<string>();
  for (const cell of cells) {
    for (const neighbor of cardinalNeighbors(cell.x, cell.y)) {
      const id = `${neighbor.x},${neighbor.y}`;
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      if (grid.isWalkable(neighbor.x, neighbor.y)) {
        return neighbor;
      }
    }
  }
  return undefined;
}

function footprintCells(object: { type: ObjectType; x: number; y: number }): GridPosition[] {
  const def = OBJECT_DEFS[object.type];
  const cells: GridPosition[] = [];
  for (let dy = 0; dy < def.footprintHeight; dy += 1) {
    for (let dx = 0; dx < def.footprintWidth; dx += 1) {
      cells.push({ x: object.x + dx, y: object.y + dy });
    }
  }
  return cells;
}

export function createResourceNodes(grid: Grid): ResourceNode[] {
  const nodes: ResourceNode[] = [];

  for (const object of grid.objects) {
    if (object.type !== ObjectType.TREE) {
      continue;
    }
    const workTile = firstWalkableNeighbor(grid, footprintCells(object));
    if (!workTile) {
      continue;
    }
    nodes.push({
      id: `wood_${object.x}_${object.y}`,
      type: RESOURCE_IDS.WOOD,
      tile: { x: object.x, y: object.y },
      workTile,
    });
  }

  for (const object of grid.objects) {
    if (object.type !== ObjectType.ROCK) {
      continue;
    }
    const workTile = firstWalkableNeighbor(grid, footprintCells(object));
    if (!workTile) {
      continue;
    }
    nodes.push({
      id: `stone_${object.x}_${object.y}`,
      type: RESOURCE_IDS.STONE,
      tile: { x: object.x, y: object.y },
      workTile,
    });
  }

  return nodes;
}
