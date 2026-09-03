export const RESOURCE_IDS = {
  WOOD: "wood",
  STONE: "stone",
  FOOD: "food",
} as const;

export type ResourceType = (typeof RESOURCE_IDS)[keyof typeof RESOURCE_IDS];

export interface ResourceStock {
  wood: number;
  stone: number;
  food: number;
}

export interface CarriedResource {
  type: ResourceType;
  amount: number;
}

export function emptyStock(): ResourceStock {
  return { wood: 0, stone: 0, food: 0 };
}
