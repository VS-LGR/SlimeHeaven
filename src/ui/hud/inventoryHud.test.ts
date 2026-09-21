import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  creditStoredResources,
  emptyDiscovery,
  emptyStock,
  tryConsumeBundle,
} from "@/src/simulation/resources";
import { selectInventoryStockModel } from "./hudSelectors";
import {
  DEFAULT_INVENTORY_FAVORITES,
  INVENTORY_ITEMS,
  INVENTORY_ITEM_IDS,
  STOCKABLE_INVENTORY_ITEM_IDS,
  isInventoryItemId,
} from "./inventoryCatalog";
import {
  filterInventoryItems,
  stockableDiscoveryCount,
  toggleFavorite,
} from "./inventoryHudModel";
import {
  parseInventoryHudPrefs,
  INVENTORY_HUD_STORAGE_KEY,
  readInventoryHudPrefs,
  writeInventoryHudPrefs,
} from "./inventoryHudPrefs";
import {
  advanceInventoryHud,
  createInventoryHudMachine,
  handleInventoryEscape,
} from "./inventoryHudState";
import { INVENTORY_LAYOUT } from "./inventoryLayout";

describe("inventory HUD catalog 05.6B.UI", () => {
  it("maps store stock without cargo and registers live plus catalog stubs", () => {
    const model = selectInventoryStockModel({
      wood: 3,
      stone: 1,
      vine: 2,
      food: 8,
      cargoBundles: ["wood ×9"],
    } as never);
    expect(model).toEqual({ wood: 3, stone: 1, vine: 2, food: 8 });
    expect(model).not.toHaveProperty("cargoBundles");
    expect(INVENTORY_ITEMS.food.iconSrc).toBe("/assets/world/materials/Carrot.png");
    expect(INVENTORY_ITEMS.food.name).toBe("Alimento");
    expect(INVENTORY_ITEMS.food.stockKey).toBe("food");
    expect(INVENTORY_ITEMS.copper_ore.stockKey).toBe("copperOre");
    expect(INVENTORY_ITEMS.foliage.stockKey).toBe("foliage");
    expect(INVENTORY_ITEMS.copper_ingot.stockKey).toBeNull();
    expect(INVENTORY_ITEMS.shell.stockKey).toBeNull();
    expect(STOCKABLE_INVENTORY_ITEM_IDS).toEqual([
      "wood",
      "stone",
      "vine",
      "food",
      "copper_ore",
      "foliage",
    ]);
    expect(INVENTORY_ITEM_IDS).toContain("foliage");
    expect(INVENTORY_ITEMS.wood.usedIn).toEqual(["Construções"]);
  });

  it("pins favorite defaults to live materials and toggles favorites", () => {
    expect(DEFAULT_INVENTORY_FAVORITES).toEqual(["wood", "stone", "vine", "food"]);
    expect(toggleFavorite(["wood", "stone"], "wood")).toEqual(["stone"]);
    expect(toggleFavorite(["wood"], "vine")).toEqual(["wood", "vine"]);
    expect(toggleFavorite(["wood"], "copper_ore")).toEqual(["wood", "copper_ore"]);
  });

  it("filters stock mode vs catalog mode and keeps undiscovered qty 0", () => {
    const stock = { wood: 4, stone: 0, vine: 1, food: 0, foliage: 0, copperOre: 0 };
    const discovered = {
      wood: true,
      stone: false,
      vine: true,
      food: false,
      foliage: false,
      copperOre: false,
    };
    const stockMode = filterInventoryItems({
      stock,
      discovered,
      favorites: DEFAULT_INVENTORY_FAVORITES,
      category: "all",
      sort: "name",
      discoveredOnly: false,
      mode: "stock",
    });
    expect(stockMode.map((item) => item.id)).toEqual([
      "food",
      "foliage",
      "wood",
      "copper_ore",
      "stone",
      "vine",
    ]);
    expect(stockMode.find((item) => item.id === "stone")?.quantity).toBe(0);

    const catalog = filterInventoryItems({
      stock,
      discovered,
      favorites: DEFAULT_INVENTORY_FAVORITES,
      category: "all",
      sort: "name",
      discoveredOnly: false,
      mode: "catalog",
    });
    expect(catalog.map((item) => item.id)).toEqual([
      "food",
      "shell",
      "foliage",
      "copper_ingot",
      "wood",
      "copper_ore",
      "stone",
      "vine",
    ]);
    expect(catalog.find((item) => item.id === "copper_ore")?.collectable).toBe(true);
    expect(catalog.find((item) => item.id === "copper_ingot")?.collectable).toBe(false);
    expect(catalog.find((item) => item.id === "copper_ingot")?.discovered).toBe(false);
    expect(catalog.find((item) => item.id === "copper_ore")?.quantity).toBe(0);

    const mineralStock = filterInventoryItems({
      stock,
      discovered,
      favorites: DEFAULT_INVENTORY_FAVORITES,
      category: "mineral",
      sort: "name",
      discoveredOnly: false,
      mode: "stock",
    });
    expect(mineralStock.map((item) => item.id)).toEqual(["copper_ore", "stone"]);

    const mineralCatalog = filterInventoryItems({
      stock,
      discovered,
      favorites: DEFAULT_INVENTORY_FAVORITES,
      category: "mineral",
      sort: "name",
      discoveredOnly: false,
      mode: "catalog",
    });
    expect(mineralCatalog.map((item) => item.id)).toEqual([
      "copper_ingot",
      "copper_ore",
      "stone",
    ]);

    const found = filterInventoryItems({
      stock,
      discovered,
      favorites: DEFAULT_INVENTORY_FAVORITES,
      category: "all",
      sort: "category",
      discoveredOnly: true,
      mode: "stock",
    });
    expect(found.map((item) => item.id)).toEqual(["wood", "vine"]);
    const starred = filterInventoryItems({
      stock,
      discovered,
      favorites: ["vine"],
      category: "all",
      sort: "name",
      discoveredOnly: false,
      favoritesOnly: true,
      mode: "stock",
    });
    expect(starred.map((item) => item.id)).toEqual(["vine"]);
    expect(stockableDiscoveryCount(discovered)).toEqual({ count: 2, total: 6 });
  });

  it("marks discovery on stored credit and keeps it after spending to zero", () => {
    const stock = emptyStock();
    const discovered = emptyDiscovery();
    creditStoredResources(stock, discovered, { wood: 2, food: 1 });
    expect(discovered.wood).toBe(true);
    expect(discovered.food).toBe(true);
    expect(discovered.vine).toBe(false);
    expect(tryConsumeBundle(stock, { wood: 2, food: 1 })).toBe(true);
    expect(stock.wood).toBe(0);
    expect(discovered.wood).toBe(true);
    expect(discovered.food).toBe(true);
  });

  it("rejects unknown preference ids and defaults mode to stock", () => {
    const parsed = parseInventoryHudPrefs(
      JSON.stringify({
        settled: "teleport",
        favorites: ["wood", "coral", "stone"],
        category: "marinho",
        sort: "rarity",
        discoveredOnly: "yes",
        mode: "wardrobe",
      }),
    );
    expect(parsed.favorites).toEqual(["wood", "stone"]);
    expect(parsed.category).toBe("all");
    expect(parsed.sort).toBe("name");
    expect(parsed.discoveredOnly).toBe(false);
    expect(parsed.favoritesOnly).toBe(false);
    expect(parsed.mode).toBe("stock");
    expect(isInventoryItemId("coral")).toBe(false);
    expect(parseInventoryHudPrefs("{")).toEqual(parseInventoryHudPrefs(null));
  });

  it("persists prefs v3 with hub mode", () => {
    const mem: Record<string, string> = {};
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value;
      },
      removeItem: (key: string) => {
        delete mem[key];
      },
    };
    writeInventoryHudPrefs(
      {
        favorites: ["vine"],
        category: "natural",
        sort: "category",
        discoveredOnly: true,
        favoritesOnly: true,
        mode: "catalog",
      },
      storage,
    );
    expect(INVENTORY_HUD_STORAGE_KEY).toBe("slime-haven:inventory-hud.v3");
    expect(mem[INVENTORY_HUD_STORAGE_KEY]).not.toMatch(/discoveredResources|wood":true|settled/);
    expect(readInventoryHudPrefs(storage)).toMatchObject({
      favorites: ["vine"],
      category: "natural",
      sort: "category",
      discoveredOnly: true,
      favoritesOnly: true,
      mode: "catalog",
    });
  });
});

describe("inventory HUD state machine 05.6B.UI", () => {
  it("toggles the centered inventory dialog", () => {
    let state = createInventoryHudMachine();
    state = advanceInventoryHud(state, { type: "openInventory" });
    expect(state.inventoryOpen).toBe(true);
    state = advanceInventoryHud(state, { type: "toggleInventory" });
    expect(state.inventoryOpen).toBe(false);
    state = advanceInventoryHud(state, { type: "toggleInventory" });
    expect(state.inventoryOpen).toBe(true);
    state = advanceInventoryHud(state, { type: "closeInventory" });
    expect(state.inventoryOpen).toBe(false);
  });

  it("closes the inventory on Escape", () => {
    let state = createInventoryHudMachine();
    state = advanceInventoryHud(state, { type: "openInventory" });
    state = handleInventoryEscape(state)!;
    expect(state.inventoryOpen).toBe(false);
    expect(handleInventoryEscape(state)).toBeNull();
  });
});

describe("inventory HUD chrome contracts 05.6B.UI", () => {
  const hud = readFileSync("src/ui/hud/InventoryHud.tsx", "utf8");
  const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
  const gameHud = readFileSync("src/ui/GameHud.tsx", "utf8");
  const canvas = readFileSync("src/ui/GameCanvas.tsx", "utf8");
  const store = readFileSync("src/store/gameUiStore.ts", "utf8");

  it("uses a backpack launcher and centered Backpack_UI hub", () => {
    expect(hud).toMatch(/HUD_ASSETS\.inventoryBackpackPanel/);
    expect(hud).toMatch(/HUD_ASSETS\.inventoryMinimized/);
    expect(hud).toMatch(/data-inventory-backpack/);
    expect(hud).toMatch(/data-inventory-dialog/);
    expect(hud).toMatch(/data-inventory-backdrop/);
    expect(hud).toMatch(/data-inventory-panel-art/);
    expect(hud).toMatch(/data-inventory-modes/);
    expect(hud).toMatch(/mode-stock/);
    expect(hud).toMatch(/mode-catalog/);
    expect(hud).not.toMatch(/filter-favorites|inventoryShortFavorite|onToggleFavorite/);
    expect(hud).toMatch(/scrollbar-width:none/);
    expect(hud).toMatch(/role="dialog"/);
    expect(hud).toMatch(/aria-modal="true"/);
    expect(hud).not.toMatch(/New_UI_Top_Right|inventoryCompact|minimizeStrip|toggleAttachedMenu/);
    expect(hud).not.toMatch(/Exibir no compacto|data-inventory-strip/);
    expect(hud).toMatch(/INVENTORY_MOTION_MS/);
    expect(INVENTORY_LAYOUT.panel.width).toBe(655);
    expect(INVENTORY_LAYOUT.panel.grid.height).toBeGreaterThanOrEqual(160);
    expect(hud).toMatch(/data-inventory-details/);
    expect(hud).not.toMatch(/data-inventory-details-plate|data-inventory-details-card="wide"/);
    expect(hud).not.toMatch(/INVENTORY_WOOD/);
    const detailsBlock = hud.split('data-inventory-details="true"')[1]?.slice(0, 500) ?? "";
    expect(detailsBlock).not.toMatch(/backgroundImage|backgroundColor|borderColor/);
  });

  it("keeps hidden layers non-interactive and stops HUD pointer bubbling", () => {
    expect(hud).toMatch(/pointer-events-none absolute/);
    expect(hud).toMatch(/data-hud-interactive="true"/);
    expect(hud).toMatch(/stopPropagation/);
    expect(hud).toMatch(/inert=\{!inventoryPanelOpen/);
    expect(hud).not.toMatch(/cargoBundles/);
  });

  it("opens inventory only via backpack and closes via overlay helpers", () => {
    expect(store).toMatch(/inventoryPanelOpen/);
    expect(store).toMatch(/setInventoryPanelOpen/);
    expect(store).not.toMatch(/inventoryHudTarget/);
    expect(store).not.toMatch(/inventoryPrefsOpen/);
    expect(hud).toMatch(/setInventoryPanelOpen\(!inventoryPanelOpen\)/);
    expect(store).toMatch(/closeInventoryOverlay/);
    expect(hud).toMatch(/data-inventory-grid/);
    expect(hud).toMatch(/data-inventory-discovery/);
  });

  it("replaces Materials overlay and the old Top Right bar", () => {
    expect(gameHud).toMatch(/InventoryHud/);
    expect(gameHud).not.toMatch(/TopRightResources/);
    expect(gameHud).not.toMatch(/MaterialsPanel|MATERIALS/);
    expect(toolbar).toMatch(/Collection/);
    expect(toolbar).not.toMatch(/Materials/);
    expect(store).not.toMatch(/materialsOpen|toggleMaterials/);
    expect(store).toMatch(/closeInventoryOverlay/);
    expect(canvas).toMatch(/worldTool !== "off"/);
    expect(canvas).toMatch(/selectedSlimeId/);
    expect(canvas).toMatch(/closeInventoryOverlay\(\)/);
    const order = canvas.indexOf("worldTool");
    expect(order).toBeGreaterThan(-1);
    expect(canvas.indexOf("selectedSlimeId")).toBeGreaterThan(order);
    expect(canvas.indexOf("closeInventoryOverlay")).toBeGreaterThan(canvas.indexOf("selectedSlimeId"));
  });
});
