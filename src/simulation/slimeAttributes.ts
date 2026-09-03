import type { JobCategory } from "./entities/Task";

export const ATTR_MIN = 1;
export const ATTR_MAX = 5;

export interface SlimeAttributes {
  technique: number;
  strength: number;
  instinct: number;
  luck: number;
}

export type AttributeWeights = {
  technique: number;
  strength: number;
  instinct: number;
  luck: number;
};

/** Future job profiles. Only fishing is applied this milestone. */
export const JOB_ATTRIBUTE_WEIGHTS: Record<JobCategory, AttributeWeights> = {
  gathering: { technique: 0, strength: 0.5, instinct: 0.5, luck: 0 },
  farming: { technique: 0.5, strength: 0, instinct: 0.5, luck: 0 },
  fishing: { technique: 0.4, instinct: 0.35, strength: 0.2, luck: 0.05 },
  construction: { technique: 0.5, strength: 0.5, instinct: 0, luck: 0 },
};

export function clampAttribute(value: number): number {
  return Math.max(ATTR_MIN, Math.min(ATTR_MAX, Math.round(value)));
}

export function clampAttributes(attrs: SlimeAttributes): SlimeAttributes {
  return {
    technique: clampAttribute(attrs.technique),
    strength: clampAttribute(attrs.strength),
    instinct: clampAttribute(attrs.instinct),
    luck: clampAttribute(attrs.luck),
  };
}

export function getAttributeContribution(attrs: SlimeAttributes, weights: AttributeWeights): number {
  return (
    attrs.technique * weights.technique +
    attrs.strength * weights.strength +
    attrs.instinct * weights.instinct +
    attrs.luck * weights.luck
  );
}

export function starString(value: number): string {
  const filled = clampAttribute(value);
  return "★".repeat(filled) + "☆".repeat(ATTR_MAX - filled);
}
