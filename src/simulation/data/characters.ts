import { SLIME_IDS, type SlimeId } from "../entities/SlimeState";
import { DEFAULT_AMBIENT_INTEREST, type AmbientInterestProfile } from "../ambientPersonality";
import type { SlimeAttributes } from "../slimeAttributes";
import type { ResidentTypeId, ResidencyStatus } from "./residents";

/** Catalog identity. Never infer behavior from color, filename, sprite key, or display name. */
export interface CharacterDefinition {
  residentTypeId: ResidentTypeId;
  instanceId: SlimeId;
  displayName: string;
  visualIdentity: string;
  startingResident: boolean;
  startingHome: false;
  initialResidency: ResidencyStatus;
  specialistTheme: string | null;
  visitorInterestLabel: string | null;
  attributes: SlimeAttributes;
  interest: AmbientInterestProfile;
}

export const CHARACTERS: Record<ResidentTypeId, CharacterDefinition> = {
  pingo: {
    residentTypeId: "pingo",
    instanceId: SLIME_IDS.PINGO,
    displayName: "Pingo",
    visualIdentity: "blue slime",
    startingResident: true,
    startingHome: false,
    initialResidency: "resident",
    specialistTheme: null,
    visitorInterestLabel: null,
    attributes: { technique: 4, strength: 2, instinct: 5, luck: 3 },
    interest: DEFAULT_AMBIENT_INTEREST,
  },
  momo: {
    residentTypeId: "momo",
    instanceId: SLIME_IDS.MOMO,
    displayName: "Momo",
    visualIdentity: "green slime",
    startingResident: true,
    startingHome: false,
    initialResidency: "resident",
    specialistTheme: null,
    visitorInterestLabel: null,
    attributes: { technique: 4, strength: 2, instinct: 4, luck: 3 },
    interest: DEFAULT_AMBIENT_INTEREST,
  },
  tito: {
    residentTypeId: "tito",
    instanceId: SLIME_IDS.TITO,
    displayName: "Tito",
    visualIdentity: "orange slime",
    startingResident: true,
    startingHome: false,
    initialResidency: "resident",
    specialistTheme: null,
    visitorInterestLabel: null,
    attributes: { technique: 3, strength: 5, instinct: 2, luck: 2 },
    interest: DEFAULT_AMBIENT_INTEREST,
  },
  lily: {
    residentTypeId: "lily",
    instanceId: SLIME_IDS.LILY,
    displayName: "Lily",
    visualIdentity: "pink slime with flower on her head",
    startingResident: false,
    startingHome: false,
    initialResidency: "visitor",
    specialistTheme: "flowers_harmony",
    visitorInterestLabel: "Interested in flowers",
    attributes: { technique: 3, strength: 2, instinct: 3, luck: 3 },
    interest: DEFAULT_AMBIENT_INTEREST,
  },
};

export function characterDefinition(residentTypeId: ResidentTypeId): CharacterDefinition {
  return CHARACTERS[residentTypeId];
}

export function startingResidentTypeIds(): ResidentTypeId[] {
  return (Object.values(CHARACTERS) as CharacterDefinition[])
    .filter((entry) => entry.startingResident)
    .map((entry) => entry.residentTypeId);
}
