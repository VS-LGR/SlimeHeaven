import { SIMULATION_TICKS_PER_SECOND } from "./constants";

/** Ambient life tunables. Not a second JobSystem. */
export const AMBIENT = {
  considerDelayTicks: { min: 8, max: 32 },
  idleStayChance: 0.32,
  maxInterestDistance: 10,
  distanceCostPerTile: 0.18,
  wanderRadius: { min: 2, max: 5 },
  socialRadius: 3,
  socialCooldownTicks: 80,
  behaviorCooldownTicks: 12,
  observeDurationTicks: { min: 12, max: 24 },
  inspectDurationTicks: { min: 8, max: 16 },
  restDurationTicks: { min: 16, max: 32 },
  greetDurationTicks: { min: 6, max: 10 },
  emoteTicks: 5,
} as const;

export type AmbientBehaviorId =
  | "wander"
  | "observe_water"
  | "inspect_farm"
  | "inspect_nature"
  | "rest"
  | "social_greet";

export interface AmbientBehaviorDefinition {
  id: AmbientBehaviorId;
  validInterestTags: ReadonlyArray<"water_edge" | "farm" | "flower" | "tree" | "rock" | "storage" | "nature" | "social">;
  profileKey: "water" | "farming" | "nature" | "social" | "exploration" | "rest";
  baseWeight: number;
  durationRange: { min: number; max: number };
  movementRequired: boolean;
  interruptible: boolean;
}

export const AMBIENT_BEHAVIORS: readonly AmbientBehaviorDefinition[] = [
  {
    id: "wander",
    validInterestTags: [],
    profileKey: "exploration",
    baseWeight: 1.1,
    durationRange: { min: 1, max: 1 },
    movementRequired: true,
    interruptible: true,
  },
  {
    id: "observe_water",
    validInterestTags: ["water_edge"],
    profileKey: "water",
    baseWeight: 1,
    durationRange: AMBIENT.observeDurationTicks,
    movementRequired: true,
    interruptible: true,
  },
  {
    id: "inspect_farm",
    validInterestTags: ["farm"],
    profileKey: "farming",
    baseWeight: 0.9,
    durationRange: AMBIENT.inspectDurationTicks,
    movementRequired: true,
    interruptible: true,
  },
  {
    id: "inspect_nature",
    validInterestTags: ["flower", "tree", "rock", "nature"],
    profileKey: "nature",
    baseWeight: 0.95,
    durationRange: AMBIENT.inspectDurationTicks,
    movementRequired: true,
    interruptible: true,
  },
  {
    id: "rest",
    validInterestTags: [],
    profileKey: "rest",
    baseWeight: 0.85,
    durationRange: AMBIENT.restDurationTicks,
    movementRequired: false,
    interruptible: true,
  },
  {
    id: "social_greet",
    validInterestTags: ["social"],
    profileKey: "social",
    baseWeight: 0.45,
    durationRange: AMBIENT.greetDurationTicks,
    movementRequired: true,
    interruptible: true,
  },
];

export function considerDelayTicksPerSecond(): number {
  return SIMULATION_TICKS_PER_SECOND;
}
