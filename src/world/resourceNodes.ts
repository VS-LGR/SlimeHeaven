import { ObjectType } from "./tileTypes";
import type { Grid } from "./Grid";
import type { ResourceNode } from "@/src/simulation/entities/ResourceNode";
import {
  copperNodeId,
  copperOccupancyKey,
  foliageNodeId,
  rockOccupancyKey,
  stoneNodeId,
  treeOccupancyKey,
  woodNodeId,
} from "@/src/simulation/entities/ResourceNode";
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
    const occupancyKey = treeOccupancyKey(object.x, object.y);
    nodes.push({
      id: woodNodeId(object.x, object.y),
      type: RESOURCE_IDS.WOOD,
      tile: origin,
      workTile,
      occupancyKey,
    });
    nodes.push({
      id: foliageNodeId(object.x, object.y),
      type: RESOURCE_IDS.FOLIAGE,
      tile: origin,
      workTile,
      occupancyKey,
      foliageReadyAtMinute: 0,
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
      id: stoneNodeId(object.x, object.y),
      type: RESOURCE_IDS.STONE,
      tile: origin,
      workTile,
      occupancyKey: rockOccupancyKey(object.x, object.y),
    });
  }

  for (const object of grid.objects) {
    if (object.type !== ObjectType.COPPER_ORE) {
      continue;
    }
    const origin = { x: object.x, y: object.y };
    const workTile = stoneGatherWorkTile(grid, origin);
    if (!workTile) {
      continue;
    }
    nodes.push({
      id: copperNodeId(object.x, object.y),
      type: RESOURCE_IDS.COPPER_ORE,
      tile: origin,
      workTile,
      occupancyKey: copperOccupancyKey(object.x, object.y),
      depleted: false,
    });
  }

  return nodes;
}
