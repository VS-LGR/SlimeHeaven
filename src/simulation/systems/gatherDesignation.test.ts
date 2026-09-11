import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GameState } from "../GameState";
import { ObjectType } from "@/src/world/tileTypes";
import { createGatherTask, designateGatherAt, inspectGatherTarget } from "./JobSystem";

describe("gather designation 05.4C", () => {
  it("creates the existing gather job only for the clicked harvestable node", () => {
    const state = new GameState();
    const tree = state.grid.objects.find((object) => object.type === ObjectType.TREE);
    const rock = state.grid.objects.find((object) => object.type === ObjectType.ROCK);
    expect(tree).toBeDefined();
    expect(rock).toBeDefined();

    const wood = designateGatherAt(state, "gather_wood", { x: tree!.x, y: tree!.y });
    expect(wood?.type).toBe("gather_wood");
    expect(wood?.nodeId).toBe(`wood_${tree!.x}_${tree!.y}`);
    expect(wood?.target).toEqual({ x: tree!.x, y: tree!.y });

    const stone = designateGatherAt(state, "gather_stone", { x: rock!.x, y: rock!.y });
    expect(stone?.type).toBe("gather_stone");
    expect(stone?.nodeId).toBe(`stone_${rock!.x}_${rock!.y}`);
  });

  it("rejects pine, wrong resource type, empty tiles, and busy nodes", () => {
    const state = new GameState();
    const tree = state.grid.objects.find((object) => object.type === ObjectType.TREE);
    const pine = state.grid.objects.find((object) => object.type === ObjectType.PINE_TREE);
    expect(tree).toBeDefined();
    expect(pine).toBeDefined();

    expect(designateGatherAt(state, "gather_wood", { x: pine!.x, y: pine!.y })).toBeUndefined();
    expect(inspectGatherTarget(state, "gather_wood", { x: pine!.x, y: pine!.y })).toBeNull();
    expect(designateGatherAt(state, "gather_stone", { x: tree!.x, y: tree!.y })).toBeUndefined();
    expect(designateGatherAt(state, "gather_wood", { x: 10, y: 8 })).toBeUndefined();

    const first = designateGatherAt(state, "gather_wood", { x: tree!.x, y: tree!.y });
    expect(first).toBeDefined();
    expect(designateGatherAt(state, "gather_wood", { x: tree!.x + 1, y: tree!.y + 1 })).toBeUndefined();
    expect(inspectGatherTarget(state, "gather_wood", { x: tree!.x, y: tree!.y })?.valid).toBe(false);
    expect(Object.keys(state.tasks)).toHaveLength(1);
  });

  it("does not use debug fallback, while createGatherTask still can", () => {
    const state = new GameState();
    const before = Object.keys(state.tasks).length;
    expect(designateGatherAt(state, "gather_wood", { x: 10, y: 8 })).toBeUndefined();
    expect(Object.keys(state.tasks)).toHaveLength(before);

    const fallback = createGatherTask(state, "gather_wood", { x: 10, y: 8 });
    expect(fallback).toBeDefined();
    expect(fallback?.type).toBe("gather_wood");
  });

  it("does not hardcode Tito in the designation path", () => {
    const controller = readFileSync("src/game/input/GatherDesignationController.ts", "utf8");
    const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
    expect(controller).not.toMatch(/slime_tito|SLIME_IDS\.TITO/);
    expect(toolbar).not.toMatch(/slime_tito|SLIME_IDS\.TITO/);
    expect(controller).toMatch(/designateGatherAt/);
    expect(controller).toMatch(/inspectGatherTarget/);
    const scene = readFileSync("src/game/scenes/VillageScene.ts", "utf8");
    expect(scene).toMatch(/FarmDesignationController/);
    expect(scene).toMatch(/GatherDesignationController/);
    expect(scene).toMatch(/FishingController/);
    expect(scene).toMatch(/BuildPlacementController/);
  });
});
