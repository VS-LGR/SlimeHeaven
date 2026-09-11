import { ObjectType } from "./tileTypes";
import type { Grid } from "./Grid";
import type { ResourceNode } from "@/src/simulation/entities/ResourceNode";
import { RESOURCE_IDS } from "@/src/simulation/resources";
import { stoneGatherWorkTile, woodGatherWorkTile } from "./gatherStance";

export function createResourceNodes(grid: Grid): ResourceNode[] {
  const nodes: ResourceNode[] = [];

  for (const object of grid.objects) {
    if (object.type !== ObjectType.TREE) {
      continue;
    }
    const origin = { x: object.x, y: object.y };
    const workTile = woodGatherWorkTile(grid, origin);
    if (!workTile) {
      continue;
    }
    nodes.push({
      id: `wood_${object.x}_${object.y}`,
      type: RESOURCE_IDS.WOOD,
      tile: origin,
      workTile,
    });
  }

  for (const object of grid.objects) {
    if (object.type !== ObjectType.ROCK) {
      continue;
    }
    const origin = { x: object.x, y: object.y };
    const workTile = stoneGatherWorkTile(grid, origin);
    if (!workTile) {
      continue;
    }
    nodes.push({
      id: `stone_${object.x}_${object.y}`,
      type: RESOURCE_IDS.STONE,
      tile: origin,
      workTile,
    });
  }

  return nodes;
}
