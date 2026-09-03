import { describe, expect, it } from "vitest";
import { resolveStrike } from "./FishingSystem";
import { commitUntilWaiting, enterFight, spawnShallow, villageSim } from "./fishingTestUtils";

function catchAt(hit: boolean) {
  const sim = villageSim();
  const { activity } = spawnShallow(sim.state);
  const foodBefore = sim.state.resources.food;
  commitUntilWaiting(sim, activity);
  enterFight(sim.state);
  sim.state.fishing.fightStartedAtMs = 1;
  if (hit) {
    sim.state.fishing.zoneStart = 0;
    sim.state.fishing.zoneWidth = 1;
  } else {
    sim.state.fishing.zoneStart = 0.9;
    sim.state.fishing.zoneWidth = 0.05;
  }
  resolveStrike(sim.state, 1);
  expect(sim.state.resources.food).toBe(foodBefore);
  return sim;
}

describe("fish inventory", () => {
  it("adds one inventory fish on success and does not grant food", () => {
    const sim = catchAt(true);
    expect(sim.state.fishInventory.blue_darter).toBe(1);
    expect(sim.state.resources.food).toBe(0);
  });

  it("leaves inventory at zero on a failed strike and does not change food", () => {
    const sim = catchAt(false);
    expect(sim.state.fishInventory.blue_darter).toBe(0);
    expect(sim.state.resources.food).toBe(0);
  });
});
