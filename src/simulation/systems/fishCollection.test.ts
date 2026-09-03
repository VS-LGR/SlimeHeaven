import { describe, expect, it } from "vitest";
import { resolveStrike } from "./FishingSystem";
import { commitUntilWaiting, enterFight, spawnShallow, villageSim } from "./fishingTestUtils";

function catchAt(hit: boolean): ReturnType<typeof villageSim> {
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

describe("fish collection", () => {
  it("discovers a species on the first catch and increments later", () => {
    const first = catchAt(true);
    expect(first.state.fishCollection.blue_darter.discovered).toBe(true);
    expect(first.state.fishCollection.blue_darter.caughtCount).toBe(1);
    expect(first.state.fishing.isNewDiscovery).toBe(true);

    const { activity } = spawnShallow(first.state);
    commitUntilWaiting(first, activity);
    enterFight(first.state);
    first.state.fishing.fightStartedAtMs = 1;
    first.state.fishing.zoneStart = 0;
    first.state.fishing.zoneWidth = 1;
    resolveStrike(first.state, 1);
    expect(first.state.fishCollection.blue_darter.caughtCount).toBe(2);
    expect(first.state.fishing.isNewDiscovery).toBe(false);
  });

  it("does not update collection on a missed strike", () => {
    const sim = catchAt(false);
    expect(sim.state.fishCollection.blue_darter.discovered).toBe(false);
    expect(sim.state.fishCollection.blue_darter.caughtCount).toBe(0);
  });
});
