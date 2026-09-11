import type { SlimeInfo } from "@/src/store/gameUiStore";
import { BUILDINGS, type BuildingTypeId } from "@/src/simulation/data/buildings";
import { SLIME_CARD_ATTRIBUTE_KEYS, type SlimeCardAttributeKey } from "./hudAssets";
import {
  activityLabel,
  attributeIconFor,
  attributeLabelFor,
  emptyStarCount,
  filledStarCount,
  hungerStatusLabel,
  hungerPipCount,
  playerBuildingName,
  playerVisitorInterest,
  residencyStatusLabel,
  slimeCardVariant,
  specialtiesLine,
  type SlimeCardVariant,
} from "./slimeCardPresentation";
import {
  SLIME_VISUALS,
  type FinalSlimeVisual,
} from "@/src/game/render/slimeVisualConfig";
import { SLIME_IDS, type SlimeId } from "@/src/simulation/entities/SlimeState";

export interface SlimeCardAttributeRow {
  key: SlimeCardAttributeKey;
  label: string;
  icon: string;
  value: number;
  filled: number;
  empty: number;
}

export interface SlimeCardPortraitOpaque {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SlimeCardPortraitSpec {
  slimeId: string;
  frames: readonly string[];
  frameWidth: number;
  frameHeight: number;
  frameRate: number;
  opaque: SlimeCardPortraitOpaque;
}

/** Visible idle-body bounds inside each authored canvas. Used to equalize card portraits. */
export const SLIME_CARD_PORTRAIT_OPAQUE: Record<SlimeId, SlimeCardPortraitOpaque> = {
  [SLIME_IDS.PINGO]: { x: 7, y: 35, width: 27, height: 27 },
  [SLIME_IDS.MOMO]: { x: 5, y: 28, width: 28, height: 29 },
  [SLIME_IDS.TITO]: { x: 5, y: 11, width: 29, height: 26 },
  [SLIME_IDS.LILY]: { x: 26, y: 41, width: 31, height: 27 },
};

export function portraitDrawScale(opaque: SlimeCardPortraitOpaque, targetBody: number): number {
  const longest = Math.max(opaque.width, opaque.height);
  if (longest <= 0) {
    return 1;
  }
  return targetBody / longest;
}

export interface SlimeCardViewModel {
  id: string;
  name: string;
  variant: SlimeCardVariant;
  residencyLabel: string;
  specialtyLine: string | null;
  visitorInterest: string | null;
  activity: string;
  hunger: string | null;
  hungerPips: number;
  home: string | null;
  homeDetail: string | null;
  showInvite: boolean;
  attributes: SlimeCardAttributeRow[];
  portrait: SlimeCardPortraitSpec | null;
}

const HIGH_FREQUENCY_SLIME_INFO_KEYS = [
  "tileX",
  "tileY",
  "destX",
  "destY",
  "anim",
  "frame",
  "visual",
  "currentAnimation",
] as const satisfies readonly (keyof SlimeInfo)[];

export function catalogHomeName(homeBuildingType: string | null): string | null {
  if (!homeBuildingType) {
    return null;
  }
  if (!(homeBuildingType in BUILDINGS)) {
    return null;
  }
  return BUILDINGS[homeBuildingType as BuildingTypeId].name;
}

export function residentHomePresentation(info: Pick<
  SlimeInfo,
  "residencyStatus" | "homeBuildingType" | "homeStatus"
>): { home: string | null; homeDetail: string | null } {
  const variant = slimeCardVariant(info.residencyStatus);
  if (variant === "invited_visitor") {
    return { home: "Sem residência", homeDetail: "Aguardando o projeto da casa" };
  }
  if (variant === "visitor") {
    return { home: "Sem residência", homeDetail: null };
  }
  if (info.homeStatus === "not_defined" || !info.homeBuildingType) {
    return { home: "Sem residência", homeDetail: null };
  }
  return {
    home: playerBuildingName(catalogHomeName(info.homeBuildingType)),
    homeDetail: null,
  };
}

export function idlePortraitSpec(slimeId: string): SlimeCardPortraitSpec | null {
  const visual = SLIME_VISUALS[slimeId as SlimeId] as FinalSlimeVisual | undefined;
  if (!visual || visual.kind !== "final") {
    return null;
  }
  return {
    slimeId,
    frames: visual.anims.idle.paths,
    frameWidth: visual.frameWidth,
    frameHeight: visual.frameHeight,
    frameRate: visual.anims.idle.frameRate,
    opaque: SLIME_CARD_PORTRAIT_OPAQUE[slimeId as SlimeId] ?? {
      x: 0,
      y: 0,
      width: visual.frameWidth,
      height: visual.frameHeight,
    },
  };
}

export function attributeRows(info: Pick<SlimeInfo, SlimeCardAttributeKey>): SlimeCardAttributeRow[] {
  return SLIME_CARD_ATTRIBUTE_KEYS.map((key) => ({
    key,
    label: attributeLabelFor(key),
    icon: attributeIconFor(key),
    value: info[key],
    filled: filledStarCount(info[key]),
    empty: emptyStarCount(info[key]),
  }));
}

export function selectSlimeCardModel(info: SlimeInfo): SlimeCardViewModel {
  const variant = slimeCardVariant(info.residencyStatus);
  const home = residentHomePresentation(info);
  const needsHunger = Boolean(info.needsActive) && variant === "resident";
  return {
    id: info.id,
    name: info.name,
    variant,
    residencyLabel: residencyStatusLabel(variant),
    specialtyLine: variant === "resident" ? specialtiesLine(info.specialties) : null,
    visitorInterest: variant === "resident" ? null : playerVisitorInterest(info.visitorInterestLabel),
    activity: activityLabel({
      state: info.state,
      taskLabel: info.taskLabel,
      constructionActivity: info.constructionActivity,
      variant,
    }),
    hunger: needsHunger ? hungerStatusLabel(info.hungerState) : null,
    hungerPips: needsHunger ? hungerPipCount(info.hungerState) : 0,
    home: home.home,
    homeDetail: home.homeDetail,
    showInvite: variant === "visitor",
    attributes: attributeRows(info),
    portrait: idlePortraitSpec(info.id),
  };
}

export function resolveSelectedSlimeProjection(
  selectedId: string | null,
  info: SlimeInfo | null,
): { selectedSlimeId: string | null; selectedSlime: SlimeInfo | null } {
  if (!selectedId || !info || info.id !== selectedId) {
    return { selectedSlimeId: null, selectedSlime: null };
  }
  return { selectedSlimeId: selectedId, selectedSlime: info };
}

export function slimeCardProjectionEquals(a: SlimeInfo | null, b: SlimeInfo | null): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  const keys = Object.keys(a) as Array<keyof SlimeInfo>;
  for (const key of keys) {
    if ((HIGH_FREQUENCY_SLIME_INFO_KEYS as readonly string[]).includes(key)) {
      continue;
    }
    if (a[key] !== b[key]) {
      if (key === "specialties") {
        if (a.specialties.join("\0") === b.specialties.join("\0")) {
          continue;
        }
      }
      return false;
    }
  }
  return true;
}

export function fabricatedLilyHome(model: SlimeCardViewModel): boolean {
  if (model.variant === "resident") {
    return false;
  }
  return Boolean(model.home && model.home !== "Sem residência");
}
