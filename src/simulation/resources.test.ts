import { describe, expect, it } from "vitest";
import {
  canConsumeBundle,
  creditBundle,
  creditStoredResources,
  emptyDiscovery,
  emptyStock,
  hasCargo,
  normalizeBundle,
  RESOURCE_IDS,
  tryConsumeBundle,
} from "./resources";

describe("material inventory 05.6A.1", () => {
  it("starts wood, stone, food, and vine at zero on one stockpile", () => {
    const stock = emptyStock();
    expect(stock).toEqual({ wood: 0, stone: 0, food: 0, vine: 0 });
    expect(RESOURCE_IDS.WOOD).toBe("wood");
    expect(RESOURCE_IDS.STONE).toBe("stone");
    expect(RESOURCE_IDS.FOOD).toBe("food");
    expect(RESOURCE_IDS.VINE).toBe("vine");
  });

  it("credits a bundle onto the same wood and stone fields HUD and construction use", () => {
    const stock = emptyStock();
    creditBundle(stock, { wood: 3, stone: 1, vine: 2 });
    expect(stock.wood).toBe(3);
    expect(stock.stone).toBe(1);
    expect(stock.vine).toBe(2);
    expect(stock.food).toBe(0);
  });

  it("drops non-positive and non-integer quantities", () => {
    expect(normalizeBundle({ wood: 2.9, stone: 0, vine: -4, food: Number.NaN })).toEqual({ wood: 2 });
    expect(hasCargo({ vine: 0 })).toBe(false);
    expect(hasCargo({ wood: 1 })).toBe(true);
  });

  it("consumes a full bundle or none", () => {
    const stock = emptyStock();
    creditBundle(stock, { wood: 5, stone: 1, vine: 1 });
    expect(tryConsumeBundle(stock, { wood: 3, stone: 1 })).toBe(true);
    expect(stock).toEqual({ wood: 2, stone: 0, food: 0, vine: 1 });

    expect(canConsumeBundle(stock, { wood: 2, vine: 2 })).toBe(false);
    expect(tryConsumeBundle(stock, { wood: 2, vine: 2 })).toBe(false);
    expect(stock).toEqual({ wood: 2, stone: 0, food: 0, vine: 1 });
  });

  it("never stores a negative balance", () => {
    const stock = emptyStock();
    creditBundle(stock, { wood: -8, vine: 1.2 });
    expect(stock.wood).toBe(0);
    expect(stock.vine).toBe(1);
    expect(tryConsumeBundle(stock, { vine: 4 })).toBe(false);
    expect(stock.vine).toBe(1);
    expect(Object.values(stock).every((value) => value >= 0)).toBe(true);
  });

  it("leaves food unchanged when crediting or spending materials", () => {
    const stock = emptyStock();
    stock.food = 6;
    creditBundle(stock, { wood: 1, vine: 1 });
    expect(tryConsumeBundle(stock, { wood: 1, vine: 1 })).toBe(true);
    expect(stock.food).toBe(6);
  });

  it("marks session discovery when stored stock actually increases", () => {
    const stock = emptyStock();
    const discovered = emptyDiscovery();
    creditStoredResources(stock, discovered, { vine: 1 });
    expect(stock.vine).toBe(1);
    expect(discovered.vine).toBe(true);
    expect(tryConsumeBundle(stock, { vine: 1 })).toBe(true);
    expect(stock.vine).toBe(0);
    expect(discovered.vine).toBe(true);
    creditBundle(stock, { stone: 2 });
    expect(discovered.stone).toBe(false);
  });
});
