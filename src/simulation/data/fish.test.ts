import { describe, expect, it } from "vitest";
import { FISH, isSpeciesValidAtDepth, speciesAtDepth } from "./fish";

describe("fish definitions", () => {
  it("accepts each species only in its valid depths", () => {
    expect(isSpeciesValidAtDepth("blue_darter", "shallow")).toBe(true);
    expect(isSpeciesValidAtDepth("blue_darter", "deep")).toBe(false);
    expect(isSpeciesValidAtDepth("pond_carp", "shallow")).toBe(true);
    expect(isSpeciesValidAtDepth("pond_carp", "deep")).toBe(true);
    expect(isSpeciesValidAtDepth("moon_glimmer", "deep")).toBe(true);
    expect(isSpeciesValidAtDepth("moon_glimmer", "shallow")).toBe(false);
  });

  it("lists compatible species per depth and rejects the invalid pairings", () => {
    const shallow = speciesAtDepth("shallow").map((def) => def.id);
    const deep = speciesAtDepth("deep").map((def) => def.id);
    expect(shallow).toContain("blue_darter");
    expect(shallow).toContain("pond_carp");
    expect(shallow).not.toContain("moon_glimmer");
    expect(deep).toContain("pond_carp");
    expect(deep).toContain("moon_glimmer");
    expect(deep).not.toContain("blue_darter");
    expect(FISH.blue_darter.clueType).toBe("small_bubbles");
    expect(FISH.pond_carp.clueType).toBe("large_ripple");
    expect(FISH.moon_glimmer.clueType).toBe("cyan_glimmer");
    expect(FISH.blue_darter.challenge).toEqual({ techniqueDemand: 2, strengthDemand: 1, instinctDemand: 2 });
    expect(FISH.pond_carp.challenge).toEqual({ techniqueDemand: 3, strengthDemand: 3, instinctDemand: 2 });
    expect(FISH.moon_glimmer.challenge).toEqual({ techniqueDemand: 4, strengthDemand: 2, instinctDemand: 5 });
  });
});
