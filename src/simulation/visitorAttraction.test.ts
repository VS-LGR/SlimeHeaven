import { describe, expect, it } from "vitest";
import { visitorFinalWeight } from "./visitorAttraction";

describe("visitor attraction contract", () => {
  it("multiplies base weight and never guarantees appearance", () => {
    expect(visitorFinalWeight(1, [4])).toBe(4);
    expect(visitorFinalWeight(0, [4])).toBe(0);
    expect(visitorFinalWeight(1, [])).toBe(1);
    expect(visitorFinalWeight(2, [2, 2])).toBe(8);
  });
});
