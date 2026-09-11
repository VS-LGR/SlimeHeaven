import {
  SLIME_CARD_ATTRIBUTE_KEYS,
  SLIME_CARD_ICON_ASSETS,
  type SlimeCardAttributeKey,
} from "./hudAssets";
import { ATTR_MAX, ATTR_MIN, clampAttribute } from "@/src/simulation/slimeAttributes";

export const SLIME_CARD_ACTIVITY_FALLBACK = "Em atividade";

export const SLIME_CARD_ATTRIBUTE_LABELS: Record<SlimeCardAttributeKey, string> = {
  technique: "Técnica",
  strength: "Força",
  instinct: "Instinto",
  luck: "Sorte",
};

export const SLIME_CARD_ATTRIBUTE_ICON_ASSETS: Record<SlimeCardAttributeKey, string> = {
  technique: SLIME_CARD_ICON_ASSETS.technique,
  strength: SLIME_CARD_ICON_ASSETS.strength,
  instinct: SLIME_CARD_ICON_ASSETS.instinct,
  luck: SLIME_CARD_ICON_ASSETS.luck,
};

const SPECIALTY_LABELS: Record<string, string> = {
  Fishing: "Pescador",
  fishing: "Pescador",
  Farming: "Agricultora",
  farming: "Agricultora",
  Gathering: "Coletor",
  gathering: "Coletor",
  Construction: "Construtor",
  construction: "Construtor",
  Build: "Construtor",
  build: "Construtor",
  Exploration: "Exploração",
  exploration: "Exploração",
};

const BUILDING_NAME_LABELS: Record<string, string> = {
  "Pingo's House": "Casa do Pingo",
  "Momo's House": "Casa da Momo",
  "Tito's House": "Casa do Tito",
};

const VISITOR_INTEREST_LABELS: Record<string, string> = {
  "Interested in flowers": "Interessada em flores",
};

const HUNGER_LABELS: Record<string, string> = {
  fed: "Satisfeito",
  normal: "Normal",
  hungry: "Com fome",
  starving: "Faminto",
};

const FSM_ACTIVITY_LABELS: Record<string, string> = {
  idle: "Descansando",
  moving_to_task: "Indo trabalhar",
  working: "Trabalhando",
  carrying_to_storage: "Levando recursos",
  delivering: "Entregando recursos",
  moving_to_food: "Indo comer",
  eating: "Comendo",
  moving_to_fishing: "Indo pescar",
  fishing_wait: "Pescando",
  fishing_bite: "Pescando",
  moving_to_ambient: "Passeando",
  wandering: "Visitando a vila",
  ambient: "Passeando",
};

export type SlimeCardVariant = "resident" | "visitor" | "invited_visitor";

export function slimeCardAttributeKeys(): readonly SlimeCardAttributeKey[] {
  return SLIME_CARD_ATTRIBUTE_KEYS;
}

export function attributeIconFor(key: SlimeCardAttributeKey): string {
  return SLIME_CARD_ATTRIBUTE_ICON_ASSETS[key];
}

export function attributeLabelFor(key: SlimeCardAttributeKey): string {
  return SLIME_CARD_ATTRIBUTE_LABELS[key];
}

export function filledStarCount(value: number): number {
  return clampAttribute(value);
}

export function emptyStarCount(value: number): number {
  return ATTR_MAX - filledStarCount(value);
}

export function isAttributeRating(value: number): boolean {
  return Number.isInteger(value) && value >= ATTR_MIN && value <= ATTR_MAX;
}

export function slimeCardVariant(residencyStatus: string | null | undefined): SlimeCardVariant {
  if (residencyStatus === "invited_waiting_for_house") {
    return "invited_visitor";
  }
  if (residencyStatus === "visitor") {
    return "visitor";
  }
  return "resident";
}

export function residencyStatusLabel(variant: SlimeCardVariant): string {
  if (variant === "invited_visitor") {
    return "Visitante convidada";
  }
  if (variant === "visitor") {
    return "Visitante";
  }
  return "Residente";
}

export function playerSpecialtyLabel(raw: string): string | null {
  return SPECIALTY_LABELS[raw] ?? null;
}

export function playerSpecialties(specialties: readonly string[]): string[] {
  const labels: string[] = [];
  const seen = new Set<string>();
  for (const raw of specialties) {
    const label = playerSpecialtyLabel(raw);
    if (!label || seen.has(label)) {
      continue;
    }
    seen.add(label);
    labels.push(label);
  }
  return labels;
}

export function specialtiesLine(specialties: readonly string[]): string | null {
  const labels = playerSpecialties(specialties);
  if (labels.length === 0) {
    return null;
  }
  return labels.join(" · ");
}

export function playerBuildingName(catalogName: string | null | undefined): string | null {
  if (!catalogName) {
    return null;
  }
  return BUILDING_NAME_LABELS[catalogName] ?? catalogName;
}

export function playerVisitorInterest(label: string | null | undefined): string | null {
  if (!label) {
    return null;
  }
  return VISITOR_INTEREST_LABELS[label] ?? label;
}

export function hungerStatusLabel(hungerState: string | null | undefined): string | null {
  if (!hungerState) {
    return null;
  }
  return HUNGER_LABELS[hungerState] ?? null;
}

/** Presentation-only meter from existing hunger labels. 4 = Satisfeito. */
export function hungerPipCount(hungerState: string | null | undefined): number {
  switch (hungerState) {
    case "fed":
      return 4;
    case "normal":
      return 3;
    case "hungry":
      return 2;
    case "starving":
      return 1;
    default:
      return 0;
  }
}

function workingActivityLabel(taskLabel: string, constructionActivity: string | null): string {
  if (constructionActivity) {
    return "Construindo";
  }
  const task = taskLabel.toLowerCase();
  if (task.includes("fish")) {
    return "Pescando";
  }
  if (task.includes("till") || task.includes("plant") || task.includes("harvest") || task.includes("farm")) {
    return "Cuidando da plantação";
  }
  if (task.includes("gather") || task.includes("wood") || task.includes("stone")) {
    return "Coletando";
  }
  if (task.includes("construct") || task.includes("build")) {
    return "Construindo";
  }
  return "Trabalhando";
}

export function activityLabel(input: {
  state: string;
  taskLabel: string;
  constructionActivity: string | null;
  variant: SlimeCardVariant;
}): string {
  if (input.variant !== "resident") {
    if (input.state === "idle" || input.state === "wandering" || input.state === "ambient") {
      return "Visitando a vila";
    }
    if (input.state === "moving_to_ambient") {
      return "Visitando a vila";
    }
  }
  if (input.state === "working") {
    return workingActivityLabel(input.taskLabel, input.constructionActivity);
  }
  const mapped = FSM_ACTIVITY_LABELS[input.state];
  if (mapped) {
    return mapped;
  }
  return SLIME_CARD_ACTIVITY_FALLBACK;
}

export function looksLikeInternalStateKey(label: string): boolean {
  return /_|^(idle|working|moving_to_|fishing_|carrying_to_|delivering|ambient|wandering|eating)/.test(
    label,
  );
}
