import { describe, expect, it } from "vitest";
import { CHARACTERS, startingResidentTypeIds } from "./characters";
import { RESIDENT_TYPE_IDS } from "./residents";
import { SLIME_IDS, SLIME_SPAWNS } from "../entities/SlimeState";
import { STARTING_HOMES } from "./startingHomes";
import { GameState } from "../GameState";
import { residentHomeStatus } from "../residentHomes";

describe("character catalog 05.3B.1", () => {
  it("registers Lily as a non-starting visitor character", () => {
    expect(RESIDENT_TYPE_IDS).toContain("lily");
    expect(CHARACTERS.lily.residentTypeId).toBe("lily");
    expect(CHARACTERS.lily.instanceId).toBe(SLIME_IDS.LILY);
    expect(CHARACTERS.lily.displayName).toBe("Lily");
    expect(CHARACTERS.lily.visualIdentity).toBe("pink slime with flower on her head");
    expect(CHARACTERS.lily.startingResident).toBe(false);
    expect(CHARACTERS.lily.startingHome).toBe(false);
    expect(CHARACTERS.lily.initialResidency).toBe("visitor");
    expect(CHARACTERS.lily.specialistTheme).toBe("flowers_harmony");
    expect(CHARACTERS.lily.visitorInterestLabel).toBe("Interested in flowers");
  });

  it("keeps Pingo, Momo, and Tito as the only starting residents", () => {
    expect(startingResidentTypeIds().sort()).toEqual(["momo", "pingo", "tito"]);
    expect(SLIME_SPAWNS.map((entry) => entry.id).sort()).toEqual([
      SLIME_IDS.MOMO,
      SLIME_IDS.PINGO,
      SLIME_IDS.TITO,
    ].sort());
    expect(SLIME_SPAWNS.some((entry) => entry.id === SLIME_IDS.LILY)).toBe(false);
    expect(STARTING_HOMES.some((home) => home.residentTypeId === "lily")).toBe(false);
  });

  it("reports Lily home status as not_defined", () => {
    const state = new GameState();
    expect(residentHomeStatus(state, "lily")).toBe("not_defined");
    expect(Object.keys(state.slimes)).not.toContain(SLIME_IDS.LILY);
  });
});
