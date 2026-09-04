import { describe, expect, it } from "vitest";
import { GameState } from "./GameState";
import { SLIME_IDS } from "./entities/SlimeState";
import {
  formatCapabilitiesDebug,
  hasRequiredCapabilities,
  isSlimeEligibleForJob,
  knownSpecialtyLabels,
  requiredCapabilitiesForTask,
  uniqueCapabilities,
} from "./slimeCapabilities";

describe("slime capabilities", () => {
  it("loads Pingo, Momo, and Tito identities without duplicate tags", () => {
    const state = new GameState();
    expect(state.slimes[SLIME_IDS.PINGO].capabilities).toEqual(["fishing", "exploration"]);
    expect(state.slimes[SLIME_IDS.MOMO].capabilities).toEqual(["farming"]);
    expect(state.slimes[SLIME_IDS.TITO].capabilities).toEqual(["gathering", "construction", "build"]);
    for (const slime of Object.values(state.slimes)) {
      expect(slime.capabilities).toEqual(uniqueCapabilities(slime.capabilities));
    }
  });

  it("treats missing requiredCapabilities as a universal job", () => {
    const pingo = { capabilities: ["fishing"] };
    const momo = { capabilities: ["farming"] };
    expect(hasRequiredCapabilities(pingo)).toBe(true);
    expect(hasRequiredCapabilities(momo, [])).toBe(true);
    expect(isSlimeEligibleForJob(momo, {})).toBe(true);
  });

  it("requires every listed capability (AND)", () => {
    const slime = { capabilities: ["construction", "flying"] };
    expect(hasRequiredCapabilities(slime, ["construction", "flying"])).toBe(true);
    expect(hasRequiredCapabilities(slime, ["construction"])).toBe(true);
    expect(hasRequiredCapabilities(slime, ["construction", "farming"])).toBe(false);
  });

  it("maps productive task types to capability tags", () => {
    expect(requiredCapabilitiesForTask({ type: "fish_activity" })).toEqual(["fishing"]);
    expect(requiredCapabilitiesForTask({ type: "till_soil" })).toEqual(["farming"]);
    expect(requiredCapabilitiesForTask({ type: "plant_crop" })).toEqual(["farming"]);
    expect(requiredCapabilitiesForTask({ type: "harvest_crop" })).toEqual(["farming"]);
    expect(requiredCapabilitiesForTask({ type: "gather_wood" })).toEqual(["gathering"]);
    expect(requiredCapabilitiesForTask({ type: "gather_stone" })).toEqual(["gathering"]);
    expect(requiredCapabilitiesForTask({ type: "construct_building" })).toEqual(["build"]);
  });

  it("honors an explicit requiredCapabilities override including empty universal jobs", () => {
    expect(
      requiredCapabilitiesForTask({ type: "gather_wood", requiredCapabilities: ["test_special"] }),
    ).toEqual(["test_special"]);
    expect(requiredCapabilitiesForTask({ type: "gather_wood", requiredCapabilities: [] })).toEqual([]);
  });

  it("supports a future capability tag without changing JobSystem helpers", () => {
    const specialist = { capabilities: ["test_special"] };
    const farmer = { capabilities: ["farming"] };
    expect(hasRequiredCapabilities(specialist, ["test_special"])).toBe(true);
    expect(hasRequiredCapabilities(farmer, ["test_special"])).toBe(false);
    expect(isSlimeEligibleForJob(specialist, { requiredCapabilities: ["test_special"] })).toBe(true);
    expect(isSlimeEligibleForJob(farmer, { requiredCapabilities: ["test_special"] })).toBe(false);
  });

  it("hides unknown tags from production specialty labels", () => {
    expect(knownSpecialtyLabels(["fishing", "test_special"])).toEqual(["Fishing"]);
    expect(knownSpecialtyLabels(["farming"])).toEqual(["Farming"]);
    expect(formatCapabilitiesDebug(["fishing", "exploration"])).toBe("CAP: fishing, exploration");
  });

  it("defaults missing spawn capabilities to an empty list", () => {
    expect(uniqueCapabilities(undefined)).toEqual([]);
  });
});
