import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { GameState } from "@/src/simulation/GameState";
import { designateGatherAt, inspectCoralTarget, inspectShoreTarget } from "@/src/simulation/systems/JobSystem";
import { spawnAquaticAt } from "@/src/simulation/systems/AquaticActivitySystem";
import { RESOURCE_IDS } from "@/src/simulation/resources";
import { MATERIALS } from "@/src/simulation/data/materials";
import { aquaticDetailDebugLine, coralDebugLine } from "@/src/game/inspectWorld";
import { INVENTORY_ITEM_IDS, INVENTORY_ITEMS } from "@/src/ui/hud/inventoryCatalog";
import { HUD_ASSETS } from "@/src/ui/hud/hudAssets";
import { findPath } from "./pathfinding";
import { TILE_SIZE } from "./constants";
import { STORAGE_TILE } from "@/src/simulation/constants";
import {
  CANONICAL_CORAL_VARIANT,
  CORAL_VARIANT_DEFS,
  CORAL_VARIANT_IDS,
  coralTextureKey,
  DETAIL_DEFS,
  DetailType,
  isAquaticDetail,
  OBJECT_DEFS,
  ObjectType,
  resolveCoralVariant,
  TileType,
  worldImageLoads,
} from "./tileTypes";
import { AQUATIC_DETAIL_SEEDS, CORAL_SEEDS, createVillageMap } from "./villageMap";

function publicFile(url: string): string {
  return `public${url}`;
}

function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const SUPPLIED_ASSETS = [
  { name: "Algae.png", width: 55, height: 72 },
  { name: "Coral_Blue.png", width: 65, height: 65 },
  { name: "Coral_Pink.png", width: 65, height: 65 },
  { name: "Coral_Purple.png", width: 65, height: 65 },
  { name: "Coral_Red.png", width: 65, height: 65 },
  { name: "Coral_Yellow.png", width: 65, height: 65 },
  { name: "Sea_Mushroom.png", width: 57, height: 48 },
  { name: "Small_Coral_Blue.png", width: 21, height: 22 },
  { name: "Small_Coral_Yellow.png", width: 21, height: 22 },
] as const;

describe("aquatic environment assets 05.6A.3", () => {
  it("registers every supplied production asset through the world image loads", () => {
    const loads = worldImageLoads();
    for (const asset of SUPPLIED_ASSETS) {
      const file = `public/assets/world/objects/${asset.name}`;
      expect(existsSync(file)).toBe(true);
      expect(pngSize(file)).toEqual({ width: asset.width, height: asset.height });
      expect(loads.some((entry) => entry.path === `/assets/world/objects/${asset.name}`)).toBe(true);
      const load = loads.find((entry) => entry.path === `/assets/world/objects/${asset.name}`);
      expect(load).toBeDefined();
      expect(existsSync(publicFile(load!.path))).toBe(true);
    }
    expect(loads.filter((entry) => entry.path.includes("Coral_Red.png"))).toHaveLength(1);
    expect(OBJECT_DEFS[ObjectType.CORAL].texturePath).toBe(CORAL_VARIANT_DEFS.red.texturePath);
    expect(DETAIL_DEFS[DetailType.ALGAE].texturePath).toBe("/assets/world/objects/Algae.png");
    expect(DETAIL_DEFS[DetailType.SEA_MUSHROOM].texturePath).toBe("/assets/world/objects/Sea_Mushroom.png");
  });

  it("maps every large coral color to the single coral resource and inventory entry", () => {
    const state = new GameState();
    expect(CORAL_VARIANT_IDS).toEqual(["blue", "pink", "purple", "red", "yellow"]);
    expect(resolveCoralVariant(undefined)).toBe(CANONICAL_CORAL_VARIANT);
    const nodes = state.nodes.filter((node) => node.type === RESOURCE_IDS.CORAL);
    expect(nodes).toHaveLength(CORAL_SEEDS.length);
    expect(new Set(CORAL_SEEDS.map((seed) => seed.variant)).size).toBe(CORAL_SEEDS.length);
    expect(CORAL_SEEDS).toHaveLength(2);
    expect(OBJECT_DEFS[ObjectType.CORAL].visualWidth).toBe(18);
    expect(OBJECT_DEFS[ObjectType.CORAL].visualHeight).toBe(18);
    expect(OBJECT_DEFS[ObjectType.CORAL].visualWidth).toBeLessThan(TILE_SIZE);
    for (const seed of CORAL_SEEDS) {
      const object = state.grid.objectAt(seed.x, seed.y);
      expect(object?.type).toBe(ObjectType.CORAL);
      expect(object?.variant).toBe(seed.variant);
      expect(coralTextureKey(object?.variant)).toBe(CORAL_VARIANT_DEFS[seed.variant].textureKey);
      const node = nodes.find((entry) => entry.tile.x === seed.x && entry.tile.y === seed.y);
      expect(node?.type).toBe(RESOURCE_IDS.CORAL);
      expect(inspectCoralTarget(state, seed)?.valid).toBe(true);
    }
    expect(MATERIALS.coral.iconSrc).toBe("/assets/world/objects/Coral_Red.png");
    expect(HUD_ASSETS.inventoryCoral).toBe("/assets/world/objects/Coral_Red.png");
    expect(INVENTORY_ITEMS.coral.stockKey).toBe("coral");
    expect(INVENTORY_ITEMS.coral.category).toBe("marine");
    expect(INVENTORY_ITEM_IDS.filter((id) => id.includes("coral"))).toEqual(["coral"]);
    expect(INVENTORY_ITEM_IDS).not.toContain("algae");
    expect(INVENTORY_ITEM_IDS).not.toContain("sea_mushroom");
  });

  it("keeps decorative aquatic objects non-collectable and non-blocking", () => {
    const state = new GameState();
    const grid = state.grid;
    expect(AQUATIC_DETAIL_SEEDS).toHaveLength(3);
    for (const seed of AQUATIC_DETAIL_SEEDS) {
      const tile = grid.getTile(seed.x, seed.y);
      expect(tile?.terrain).toBe(TileType.WATER);
      expect(tile?.detail).toBe(seed.type);
      expect(isAquaticDetail(seed.type)).toBe(true);
      expect(DETAIL_DEFS[seed.type].visualWidth).toBeLessThan(TILE_SIZE);
      expect(DETAIL_DEFS[seed.type].visualHeight).toBeLessThan(TILE_SIZE);
      expect(grid.objectAt(seed.x, seed.y)).toBeUndefined();
      expect(inspectCoralTarget(state, seed)).toBeNull();
      expect(designateGatherAt(state, "collect_coral", seed)).toBeUndefined();
      expect(designateGatherAt(state, "gather_wood", seed)).toBeUndefined();
      expect(designateGatherAt(state, "gather_stone", seed)).toBeUndefined();
      expect(state.nodesAtTile(seed.x, seed.y).some((node) => node.type === RESOURCE_IDS.CORAL)).toBe(
        false,
      );
      expect(aquaticDetailDebugLine(state, seed.x, seed.y)).toMatch(/decorative/);
      expect(aquaticDetailDebugLine(state, seed.x, seed.y)).toMatch(/stock=none/);
      expect(aquaticDetailDebugLine(state, seed.x, seed.y)).toMatch(/collect=no/);
      expect(aquaticDetailDebugLine(state, seed.x, seed.y)).toMatch(/reservedAP=none/);
    }
    expect(CORAL_SEEDS.some((coral) => AQUATIC_DETAIL_SEEDS.some((seed) => seed.x === coral.x && seed.y === coral.y))).toBe(
      false,
    );
    expect(state.interestPoints.some((point) => point.type === "flower" && isAquaticDetail(grid.getTile(point.tile.x, point.tile.y)?.detail ?? null))).toBe(
      false,
    );
    expect(state.fishingAccessPoints.every((point) => point.reservedBy === null)).toBe(true);
    expect(grid.isWalkable(12, 10)).toBe(true);
    expect(findPath(grid, STORAGE_TILE, { x: 12, y: 10 })).not.toBeNull();
    expect(findPath(grid, STORAGE_TILE, { x: 12, y: 13 })).not.toBeNull();
  });

  it("does not block fishing on decorated water and prefers explicit coral over ordinary water", () => {
    const state = new GameState();
    const algae = AQUATIC_DETAIL_SEEDS.find((seed) => seed.type === DetailType.ALGAE);
    expect(algae).toBeDefined();
    const spawned = spawnAquaticAt(state, "blue_darter", algae!.x, algae!.y);
    expect(spawned).not.toBeNull();
    expect(spawned?.tileX).toBe(algae!.x);
    expect(spawned?.tileY).toBe(algae!.y);
    expect(coralDebugLine(state, algae!.x, algae!.y)).toBeNull();

    const coral = CORAL_SEEDS[0];
    expect(inspectCoralTarget(state, coral)?.valid).toBe(true);
    expect(inspectShoreTarget(state, coral)?.valid).toBe(true);
    expect(coralDebugLine(state, coral.x, coral.y)).toMatch(/^Coral: present variant=/);
    expect(designateGatherAt(state, "collect_coral", coral)?.type).toBe("collect_coral");
    expect(designateGatherAt(state, "gather_wood", coral)).toBeUndefined();
  });

  it("keeps authored coral variants stable across map reconstruction", () => {
    const first = createVillageMap();
    const second = createVillageMap();
    const snapshot = (grid: ReturnType<typeof createVillageMap>) =>
      grid.objects
        .filter((object) => object.type === ObjectType.CORAL)
        .map((object) => ({
          x: object.x,
          y: object.y,
          variant: object.variant,
          texture: coralTextureKey(object.variant),
        }));
    expect(snapshot(first)).toEqual(snapshot(second));
    expect(snapshot(first)).toEqual(
      CORAL_SEEDS.map((seed) => ({
        x: seed.x,
        y: seed.y,
        variant: seed.variant,
        texture: coralTextureKey(seed.variant),
      })),
    );
    const rebuilt = new GameState(createVillageMap());
    expect(
      rebuilt.grid.objects
        .filter((object) => object.type === ObjectType.CORAL)
        .map((object) => object.variant),
    ).toEqual(CORAL_SEEDS.map((seed) => seed.variant));
  });

  it("leaves wood, stone, foliage, copper, farm, and construction occupancy unchanged", () => {
    const state = new GameState();
    const trees = state.grid.objects.filter((object) => object.type === ObjectType.TREE);
    const rocks = state.grid.objects.filter((object) => object.type === ObjectType.ROCK);
    const copper = state.grid.objects.filter((object) => object.type === ObjectType.COPPER_ORE);
    expect(trees.length).toBeGreaterThan(0);
    expect(rocks.length).toBeGreaterThan(0);
    expect(copper).toHaveLength(3);
    expect(designateGatherAt(state, "gather_wood", { x: trees[0].x, y: trees[0].y })?.type).toBe(
      "gather_wood",
    );
    expect(designateGatherAt(state, "gather_stone", { x: rocks[0].x, y: rocks[0].y })?.type).toBe(
      "gather_stone",
    );
    expect(designateGatherAt(state, "gather_foliage", { x: trees[1].x, y: trees[1].y })?.type).toBe(
      "gather_foliage",
    );
    expect(designateGatherAt(state, "gather_copper", { x: copper[0].x, y: copper[0].y })?.type).toBe(
      "gather_copper",
    );
    expect(state.grid.isWalkable(2, 12)).toBe(true);
    expect(state.grid.isWalkable(3, 12)).toBe(true);
  });
});
