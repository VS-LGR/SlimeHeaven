import type { GridPosition } from "@/src/world/GridPosition";
import type { CarriedResource } from "../resources";
import { SATIETY_INITIAL } from "../needsConfig";
import type { JobCategory } from "./Task";
import { clampAttributes, type SlimeAttributes } from "../slimeAttributes";
import {
  DEFAULT_AMBIENT_INTEREST,
  MOMO_AMBIENT_INTEREST,
  PINGO_AMBIENT_INTEREST,
  TITO_AMBIENT_INTEREST,
  type AmbientInterestProfile,
} from "../ambientPersonality";
import type { AmbientBehaviorId } from "../ambientConfig";
import { uniqueCapabilities, type SlimeCapability } from "../slimeCapabilities";

export const SLIME_IDS = {
  PINGO: "slime_pingo",
  MOMO: "slime_momo",
  TITO: "slime_tito",
} as const;

export type SlimeId = (typeof SLIME_IDS)[keyof typeof SLIME_IDS];

export type SlimeFsmState =
  | "idle"
  | "moving_to_task"
  | "working"
  | "carrying_to_storage"
  | "delivering"
  | "moving_to_food"
  | "eating"
  | "moving_to_fishing"
  | "fishing_wait"
  | "fishing_bite"
  | "moving_to_ambient"
  | "ambient";

export interface SlimeState {
  id: SlimeId;
  name: string;
  tileX: number;
  tileY: number;
  spawnX: number;
  spawnY: number;
  state: SlimeFsmState;
  currentTaskId?: string;
  destination?: GridPosition;
  path: GridPosition[];
  carriedResource?: CarriedResource;
  hopFrom?: GridPosition;
  hopTo?: GridPosition;
  hopElapsedMs: number;
  workElapsedMs: number;
  idleWanderTicks: number;
  satiety: number;
  attributes: SlimeAttributes;
  capabilities: SlimeCapability[];
  interest: AmbientInterestProfile;
  faceTile?: GridPosition;
  ambientBehaviorId?: AmbientBehaviorId;
  ambientTargetId?: string;
  ambientUntilTick: number;
  ambientPartnerId?: string;
  ambientCooldownUntilTick: number;
  ambientEmote: "!" | "?" | null;
  ambientEmoteUntilTick: number;
  /** Plot whose work pose is active; same-tile hop walks from that pose back to tile feet. */
  tillRecoverPlot?: GridPosition;
  /** Presentation leftover after a catch so fish_success can finish. Does not block jobs. */
  fishingCelebrateUntilTick: number;
  /** Optional later: `{ farming: 1.25 }`. Unset means 1 for every category. */
  jobAffinity?: Partial<Record<JobCategory, number>>;
}

export const SLIME_SPAWNS: ReadonlyArray<{
  id: SlimeId;
  name: string;
  x: number;
  y: number;
  wanderOffsetTicks: number;
  attributes: SlimeAttributes;
  interest: AmbientInterestProfile;
  capabilities: readonly SlimeCapability[];
}> = [
  {
    id: SLIME_IDS.PINGO,
    name: "Pingo",
    x: 8,
    y: 6,
    wanderOffsetTicks: 0,
    attributes: { technique: 4, strength: 2, instinct: 5, luck: 3 },
    interest: PINGO_AMBIENT_INTEREST,
    capabilities: ["fishing", "exploration"],
  },
  {
    id: SLIME_IDS.MOMO,
    name: "Momo",
    x: 9,
    y: 6,
    wanderOffsetTicks: 4,
    attributes: { technique: 4, strength: 2, instinct: 4, luck: 3 },
    interest: MOMO_AMBIENT_INTEREST,
    capabilities: ["farming"],
  },
  {
    id: SLIME_IDS.TITO,
    name: "Tito",
    x: 10,
    y: 5,
    wanderOffsetTicks: 8,
    attributes: { technique: 3, strength: 5, instinct: 2, luck: 2 },
    interest: TITO_AMBIENT_INTEREST,
    capabilities: ["gathering", "construction"],
  },
];

export function createSlimeState(
  def: (typeof SLIME_SPAWNS)[number],
  wanderTicks: number,
): SlimeState {
  return {
    id: def.id,
    name: def.name,
    tileX: def.x,
    tileY: def.y,
    spawnX: def.x,
    spawnY: def.y,
    state: "idle",
    path: [],
    hopElapsedMs: 0,
    workElapsedMs: 0,
    idleWanderTicks: wanderTicks,
    satiety: SATIETY_INITIAL,
    attributes: clampAttributes(def.attributes),
    capabilities: uniqueCapabilities(def.capabilities),
    interest: def.interest ?? DEFAULT_AMBIENT_INTEREST,
    ambientUntilTick: 0,
    ambientCooldownUntilTick: 0,
    ambientEmote: null,
    ambientEmoteUntilTick: 0,
    fishingCelebrateUntilTick: 0,
  };
}
