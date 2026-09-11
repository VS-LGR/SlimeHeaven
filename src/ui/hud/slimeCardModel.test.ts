import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CHARACTERS } from "@/src/simulation/data/characters";
import { BUILDINGS } from "@/src/simulation/data/buildings";
import { SLIME_IDS, SLIME_SPAWNS } from "@/src/simulation/entities/SlimeState";
import { knownSpecialtyLabels } from "@/src/simulation/slimeCapabilities";
import type { SlimeInfo } from "@/src/store/gameUiStore";
import {
  catalogHomeName,
  fabricatedLilyHome,
  idlePortraitSpec,
  portraitDrawScale,
  residentHomePresentation,
  resolveSelectedSlimeProjection,
  selectSlimeCardModel,
  slimeCardProjectionEquals,
} from "./slimeCardModel";
import { HUD_LAYOUT } from "./hudLayout";

function slimeInfo(overrides: Partial<SlimeInfo> & Pick<SlimeInfo, "id" | "name">): SlimeInfo {
  return {
    state: "idle",
    taskLabel: "none",
    tileX: 0,
    tileY: 0,
    destX: null,
    destY: null,
    carrying: "Nothing",
    satiety: 100,
    hungerState: "fed",
    visual: "FINAL",
    anim: "idle",
    frame: 0,
    technique: 3,
    strength: 3,
    instinct: 3,
    luck: 3,
    specialties: [],
    capabilitiesDebug: "CAP: —",
    constructionActivity: null,
    constructionSiteId: null,
    constructionCapabilityEligible: null,
    constructionPresentation: null,
    constructionTool: null,
    residencyStatus: "resident",
    homeBuildingType: null,
    homeBuildingId: null,
    homeStatus: null,
    homeEntranceTile: null,
    visitorInterestLabel: null,
    visitorIntent: null,
    eligibleForJobs: true,
    needsActive: true,
    consumesFood: true,
    currentAnimation: "idle",
    activeSpecialistAnimation: null,
    ...overrides,
  };
}

describe("slime card model 05.4D", () => {
  it("reads authoritative catalog attributes instead of duplicating numbers", () => {
    const pingoSpawn = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.PINGO);
    const momoSpawn = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.MOMO);
    const titoSpawn = SLIME_SPAWNS.find((entry) => entry.id === SLIME_IDS.TITO);
    expect(pingoSpawn?.attributes).toEqual(CHARACTERS.pingo.attributes);
    expect(momoSpawn?.attributes).toEqual(CHARACTERS.momo.attributes);
    expect(titoSpawn?.attributes).toEqual(CHARACTERS.tito.attributes);

    const pingo = selectSlimeCardModel(
      slimeInfo({
        id: SLIME_IDS.PINGO,
        name: CHARACTERS.pingo.displayName,
        ...CHARACTERS.pingo.attributes,
        specialties: knownSpecialtyLabels(pingoSpawn?.capabilities),
        homeBuildingType: "small_blue_house",
        homeStatus: "completed",
      }),
    );
    expect(pingo.attributes.map((row) => row.value)).toEqual([
      CHARACTERS.pingo.attributes.technique,
      CHARACTERS.pingo.attributes.strength,
      CHARACTERS.pingo.attributes.instinct,
      CHARACTERS.pingo.attributes.luck,
    ]);
    expect(pingo.specialtyLine).toBe("Pescador · Exploração");
    expect(pingo.home).toBe("Casa do Pingo");
    expect(pingo.hunger).toBe("Satisfeito");
    expect(catalogHomeName("small_blue_house")).toBe(BUILDINGS.small_blue_house.name);

    const cardSource = [
      readFileSync("src/ui/hud/SlimeCard.tsx", "utf8"),
      readFileSync("src/ui/hud/slimeCardPresentation.ts", "utf8"),
    ].join("\n");
    expect(cardSource).not.toMatch(/technique:\s*4/);
    expect(cardSource).not.toMatch(/Pingo.*Technique 4/);
  });

  it("presents Momo and Tito from catalog homes and capabilities", () => {
    const momo = selectSlimeCardModel(
      slimeInfo({
        id: SLIME_IDS.MOMO,
        name: CHARACTERS.momo.displayName,
        ...CHARACTERS.momo.attributes,
        specialties: knownSpecialtyLabels(["farming"]),
        homeBuildingType: "green_house",
        homeStatus: "completed",
      }),
    );
    const tito = selectSlimeCardModel(
      slimeInfo({
        id: SLIME_IDS.TITO,
        name: CHARACTERS.tito.displayName,
        ...CHARACTERS.tito.attributes,
        specialties: knownSpecialtyLabels(["gathering", "construction", "build"]),
        homeBuildingType: "brown_house",
        homeStatus: "completed",
        state: "working",
        taskLabel: "gather wood",
      }),
    );
    expect(momo.specialtyLine).toBe("Agricultora");
    expect(momo.home).toBe("Casa da Momo");
    expect(tito.specialtyLine).toBe("Coletor · Construtor");
    expect(tito.home).toBe("Casa do Tito");
    expect(tito.activity).toBe("Coletando");
  });

  it("does not fabricate a home for Lily as a visitor or invited visitor", () => {
    const visitor = selectSlimeCardModel(
      slimeInfo({
        id: SLIME_IDS.LILY,
        name: CHARACTERS.lily.displayName,
        ...CHARACTERS.lily.attributes,
        residencyStatus: "visitor",
        homeBuildingType: null,
        homeStatus: "not_defined",
        needsActive: false,
        consumesFood: false,
        eligibleForJobs: false,
        visitorInterestLabel: CHARACTERS.lily.visitorInterestLabel,
        specialties: [],
      }),
    );
    const invited = selectSlimeCardModel(
      slimeInfo({
        id: SLIME_IDS.LILY,
        name: CHARACTERS.lily.displayName,
        ...CHARACTERS.lily.attributes,
        residencyStatus: "invited_waiting_for_house",
        homeBuildingType: null,
        homeStatus: "not_defined",
        needsActive: false,
        consumesFood: false,
        eligibleForJobs: false,
        visitorInterestLabel: CHARACTERS.lily.visitorInterestLabel,
        specialties: [],
      }),
    );
    expect(visitor.variant).toBe("visitor");
    expect(visitor.showInvite).toBe(true);
    expect(visitor.hunger).toBeNull();
    expect(visitor.specialtyLine).toBeNull();
    expect(visitor.home).toBe("Sem residência");
    expect(visitor.homeDetail).toBeNull();
    expect(visitor.visitorInterest).toBe("Interessada em flores");
    expect(fabricatedLilyHome(visitor)).toBe(false);

    expect(invited.variant).toBe("invited_visitor");
    expect(invited.showInvite).toBe(false);
    expect(invited.home).toBe("Sem residência");
    expect(invited.homeDetail).toBe("Aguardando o projeto da casa");
    expect(invited.hunger).toBeNull();
    expect(fabricatedLilyHome(invited)).toBe(false);
    expect(residentHomePresentation({
      residencyStatus: "invited_waiting_for_house",
      homeBuildingType: "small_blue_house",
      homeStatus: "not_defined",
    }).home).toBe("Sem residência");
  });

  it("clears selection when the selected slime disappears and replaces on a new id", () => {
    const pingo = slimeInfo({ id: SLIME_IDS.PINGO, name: "Pingo" });
    const momo = slimeInfo({ id: SLIME_IDS.MOMO, name: "Momo" });
    expect(resolveSelectedSlimeProjection(SLIME_IDS.PINGO, pingo)).toEqual({
      selectedSlimeId: SLIME_IDS.PINGO,
      selectedSlime: pingo,
    });
    expect(resolveSelectedSlimeProjection(SLIME_IDS.MOMO, pingo)).toEqual({
      selectedSlimeId: null,
      selectedSlime: null,
    });
    expect(resolveSelectedSlimeProjection(SLIME_IDS.PINGO, null)).toEqual({
      selectedSlimeId: null,
      selectedSlime: null,
    });
    expect(resolveSelectedSlimeProjection(SLIME_IDS.MOMO, momo).selectedSlimeId).toBe(SLIME_IDS.MOMO);
  });

  it("ignores high-frequency pose fields when comparing card projections", () => {
    const a = slimeInfo({ id: SLIME_IDS.PINGO, name: "Pingo", tileX: 1, frame: 0 });
    const b = slimeInfo({ id: SLIME_IDS.PINGO, name: "Pingo", tileX: 8, frame: 3 });
    expect(slimeCardProjectionEquals(a, b)).toBe(true);
    expect(slimeCardProjectionEquals(a, { ...b, hungerState: "hungry" })).toBe(false);
  });

  it("draws every slime portrait to the same card body size", () => {
    const target = HUD_LAYOUT.slimeCard.portraitBody;
    const sizes = [SLIME_IDS.PINGO, SLIME_IDS.MOMO, SLIME_IDS.TITO, SLIME_IDS.LILY].map((id) => {
      const spec = idlePortraitSpec(id);
      expect(spec).not.toBeNull();
      const scale = portraitDrawScale(spec!.opaque, target);
      return Math.max(spec!.opaque.width, spec!.opaque.height) * scale;
    });
    expect(sizes.every((size) => Math.abs(size - target) < 0.01)).toBe(true);
  });
});
