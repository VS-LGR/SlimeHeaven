import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CHARACTERS } from "@/src/simulation/data/characters";
import {
  SLIME_CARD_ATTRIBUTE_ICON_ASSETS,
  SLIME_CARD_ATTRIBUTE_LABELS,
  SLIME_CARD_ACTIVITY_FALLBACK,
  activityLabel,
  attributeIconFor,
  emptyStarCount,
  filledStarCount,
  hungerStatusLabel,
  hungerPipCount,
  looksLikeInternalStateKey,
  playerBuildingName,
  playerSpecialties,
  playerVisitorInterest,
  residencyStatusLabel,
  slimeCardVariant,
  specialtiesLine,
} from "./slimeCardPresentation";
import { HUD_ASSETS, SLIME_CARD_ICON_ASSETS } from "./hudAssets";

describe("slime card presentation 05.4D", () => {
  it("maps the four attributes to the official icons and Portuguese labels", () => {
    expect(attributeIconFor("technique")).toBe(HUD_ASSETS.iconTechnique);
    expect(attributeIconFor("strength")).toBe(HUD_ASSETS.iconStrength);
    expect(attributeIconFor("instinct")).toBe(HUD_ASSETS.iconInstinct);
    expect(attributeIconFor("luck")).toBe(HUD_ASSETS.iconLuck);
    expect(SLIME_CARD_ATTRIBUTE_ICON_ASSETS.instinct).toBe("/assets/UI/UI_Icon_Instintic.png");
    expect(SLIME_CARD_ATTRIBUTE_LABELS).toEqual({
      technique: "Técnica",
      strength: "Força",
      instinct: "Instinto",
      luck: "Sorte",
    });
    expect(SLIME_CARD_ICON_ASSETS.speak).toBe(HUD_ASSETS.iconSpeak);
  });

  it("does not wire attribute icons to the action toolbar", () => {
    const tools = readFileSync("src/ui/hud/actionTools.ts", "utf8");
    const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
    expect(tools).not.toMatch(/UI_Icon_Technique|UI_Icon_Strength|UI_Icon_Instintic|UI_Icon_Luck/);
    expect(toolbar).not.toMatch(/UI_Icon_Technique|UI_Icon_Luck/);
  });

  it("keeps the 1–5 star rating language", () => {
    expect(filledStarCount(4)).toBe(4);
    expect(emptyStarCount(4)).toBe(1);
    expect(filledStarCount(1)).toBe(1);
    expect(emptyStarCount(5)).toBe(0);
  });

  it("translates specialties without exposing capability tags", () => {
    expect(playerSpecialties(["Fishing", "Exploration"])).toEqual(["Pescador", "Exploração"]);
    expect(playerSpecialties(["Gathering", "Construction", "Build"])).toEqual(["Coletor", "Construtor"]);
    expect(playerSpecialties(["Farming"])).toEqual(["Agricultora"]);
    expect(specialtiesLine(["Farming"])).toBe("Agricultora");
    expect(playerSpecialties(["test_special", "gather"])).toEqual([]);
  });

  it("maps runtime activity without exposing FSM keys", () => {
    expect(
      activityLabel({
        state: "idle",
        taskLabel: "none",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe("Descansando");
    expect(
      activityLabel({
        state: "moving_to_task",
        taskLabel: "till soil",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe("Indo trabalhar");
    expect(
      activityLabel({
        state: "working",
        taskLabel: "till soil",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe("Cuidando da plantação");
    expect(
      activityLabel({
        state: "working",
        taskLabel: "fish activity",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe("Pescando");
    expect(
      activityLabel({
        state: "working",
        taskLabel: "construct building",
        constructionActivity: "construct_building",
        variant: "resident",
      }),
    ).toBe("Construindo");
    expect(
      activityLabel({
        state: "carrying_to_storage",
        taskLabel: "gather wood",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe("Levando recursos");
    expect(
      activityLabel({
        state: "idle",
        taskLabel: "none",
        constructionActivity: null,
        variant: "visitor",
      }),
    ).toBe("Visitando a vila");
    expect(
      activityLabel({
        state: "future_dance",
        taskLabel: "none",
        constructionActivity: null,
        variant: "resident",
      }),
    ).toBe(SLIME_CARD_ACTIVITY_FALLBACK);
    expect(looksLikeInternalStateKey("moving_to_task")).toBe(true);
    expect(looksLikeInternalStateKey("Descansando")).toBe(false);
  });

  it("translates hunger, homes, and visitor interest in Portuguese", () => {
    expect(hungerStatusLabel("hungry")).toBe("Com fome");
    expect(hungerPipCount("fed")).toBe(4);
    expect(hungerPipCount("normal")).toBe(3);
    expect(hungerPipCount("hungry")).toBe(2);
    expect(hungerPipCount("starving")).toBe(1);
    expect(hungerStatusLabel("energy")).toBeNull();
    expect(playerBuildingName("Pingo's House")).toBe("Casa do Pingo");
    expect(playerBuildingName("Momo's House")).toBe("Casa da Momo");
    expect(playerBuildingName("Tito's House")).toBe("Casa do Tito");
    expect(playerVisitorInterest(CHARACTERS.lily.visitorInterestLabel)).toBe("Interessada em flores");
    expect(residencyStatusLabel(slimeCardVariant("visitor"))).toBe("Visitante");
    expect(residencyStatusLabel(slimeCardVariant("invited_waiting_for_house"))).toBe("Visitante convidada");
  });
});
