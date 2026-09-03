export const FISH_IDS = {
  BLUE_DARTER: "blue_darter",
  POND_CARP: "pond_carp",
  MOON_GLIMMER: "moon_glimmer",
} as const;

export type FishId = (typeof FISH_IDS)[keyof typeof FISH_IDS];
export type FishRarity = "common" | "uncommon" | "rare";
export type WaterDepth = "shallow" | "deep";
export type ClueType = "small_bubbles" | "large_ripple" | "cyan_glimmer";

export interface FishingChallengeProfile {
  techniqueDemand: number;
  strengthDemand: number;
  instinctDemand: number;
}

export interface FishDefinition {
  id: FishId;
  name: string;
  rarity: FishRarity;
  validDepths: readonly WaterDepth[];
  activityWeight: number;
  biteDelayRangeMs: { min: number; max: number };
  reactionWindowMs: number;
  markerPeriodMs: number;
  targetZoneWidth: number;
  clueType: ClueType;
  challenge: FishingChallengeProfile;
  foodValue: number;
  tags?: readonly string[];
  specialEffectId?: string;
}

export const FISH: Record<FishId, FishDefinition> = {
  blue_darter: {
    id: "blue_darter",
    name: "Blue Darter",
    rarity: "common",
    validDepths: ["shallow"],
    activityWeight: 6,
    biteDelayRangeMs: { min: 1000, max: 2000 },
    reactionWindowMs: 2500,
    markerPeriodMs: 2500,
    targetZoneWidth: 0.38,
    clueType: "small_bubbles",
    challenge: { techniqueDemand: 2, strengthDemand: 1, instinctDemand: 2 },
    foodValue: 1,
    tags: ["small"],
  },
  pond_carp: {
    id: "pond_carp",
    name: "Pond Carp",
    rarity: "uncommon",
    validDepths: ["shallow", "deep"],
    activityWeight: 3,
    biteDelayRangeMs: { min: 1500, max: 3000 },
    reactionWindowMs: 1800,
    markerPeriodMs: 1800,
    targetZoneWidth: 0.24,
    clueType: "large_ripple",
    challenge: { techniqueDemand: 3, strengthDemand: 3, instinctDemand: 2 },
    foodValue: 2,
    tags: ["heavy"],
  },
  moon_glimmer: {
    id: "moon_glimmer",
    name: "Moon Glimmer",
    rarity: "rare",
    validDepths: ["deep"],
    activityWeight: 1,
    biteDelayRangeMs: { min: 1000, max: 4000 },
    reactionWindowMs: 1100,
    markerPeriodMs: 1100,
    targetZoneWidth: 0.14,
    clueType: "cyan_glimmer",
    challenge: { techniqueDemand: 4, strengthDemand: 2, instinctDemand: 5 },
    foodValue: 3,
    tags: ["unusual"],
    specialEffectId: "village_glimmer",
  },
};

export const FISH_ID_LIST = Object.values(FISH_IDS);

export function fishById(id: FishId): FishDefinition {
  return FISH[id];
}

export function speciesAtDepth(depth: WaterDepth): FishDefinition[] {
  return FISH_ID_LIST.map((id) => FISH[id]).filter((def) => def.validDepths.includes(depth));
}

export function isSpeciesValidAtDepth(id: FishId, depth: WaterDepth): boolean {
  return FISH[id].validDepths.includes(depth);
}

export function emptyFishInventory(): Record<FishId, number> {
  return {
    blue_darter: 0,
    pond_carp: 0,
    moon_glimmer: 0,
  };
}

export function emptyFishCollection(): Record<FishId, FishCollectionEntry> {
  return {
    blue_darter: { speciesId: "blue_darter", discovered: false, caughtCount: 0 },
    pond_carp: { speciesId: "pond_carp", discovered: false, caughtCount: 0 },
    moon_glimmer: { speciesId: "moon_glimmer", discovered: false, caughtCount: 0 },
  };
}

export interface FishCollectionEntry {
  speciesId: FishId;
  discovered: boolean;
  caughtCount: number;
}
