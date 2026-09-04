import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TILE_SIZE } from "@/src/world/constants";
import {
  BUILDING_TYPE_IDS,
  buildingById,
  buildingVisualLayout,
  buildingWorldPosition,
} from "@/src/simulation/data/buildings";

const ORIGIN = { x: 5, y: 11 };

describe("building sprite layout", () => {
  it("shares origin, offset, and bottom-center world position across preview, site, and completed", () => {
    for (const typeId of BUILDING_TYPE_IDS) {
      const preview = buildingVisualLayout(ORIGIN, typeId, "preview");
      const site = buildingVisualLayout(ORIGIN, typeId, "construction");
      const completed = buildingVisualLayout(ORIGIN, typeId, "completed");
      const def = buildingById(typeId);
      const world = buildingWorldPosition(ORIGIN, def);

      for (const layout of [preview, site, completed]) {
        expect(layout.x).toBe(world.x);
        expect(layout.y).toBe(world.y);
        expect(layout.originX).toBe(0.5);
        expect(layout.originY).toBe(1);
        expect(layout.offsetX).toBe(0);
        expect(layout.offsetY).toBe(0);
        expect(layout.x).toBe((ORIGIN.x + def.footprint.width / 2) * TILE_SIZE);
        expect(layout.y).toBe((ORIGIN.y + def.footprint.height) * TILE_SIZE);
      }

      expect(preview.textureKey).toBe(completed.textureKey);
      expect(site.textureKey).toBe(def.blueprintKey);
      expect(completed.textureKey).toBe(def.assetKey);
      expect(site.textureKey).not.toBe(completed.textureKey);
    }
  });

  it("does not compensate for the retired 78×86 / 66×65 canvases", () => {
    const catalog = readFileSync(resolve("src/simulation/data/buildings.ts"), "utf8");
    const presentation = readFileSync(resolve("src/game/render/buildings/buildingPresentation.ts"), "utf8");
    const preview = readFileSync(resolve("src/game/input/BuildPlacementController.ts"), "utf8");
    const site = readFileSync(resolve("src/game/render/buildings/ConstructionSiteRenderer.ts"), "utf8");
    const completed = readFileSync(resolve("src/game/render/buildings/BuildingRenderer.ts"), "utf8");
    for (const source of [catalog, presentation, preview, site, completed]) {
      expect(source).not.toMatch(/width:\s*78/);
      expect(source).not.toMatch(/height:\s*86/);
      expect(source).not.toMatch(/width:\s*66/);
      expect(source).not.toMatch(/height:\s*65/);
    }
    expect(site).toMatch(/"construction"/);
    expect(completed).toMatch(/"completed"/);
    expect(preview).toMatch(/"preview"/);
    expect(presentation).toMatch(/buildingVisualLayout/);
  });

  it("applies a cyan blueprint wash without moving the shared layout", () => {
    const presentation = readFileSync(resolve("src/game/render/buildings/buildingPresentation.ts"), "utf8");
    const site = readFileSync(resolve("src/game/render/buildings/ConstructionSiteRenderer.ts"), "utf8");
    expect(presentation).toMatch(/export function applyBuildingSpriteLayout/);
    expect(presentation).toMatch(/tint:\s*0x7ec8ff/);
    expect(presentation).toMatch(/alpha:\s*0\.78/);
    expect(site).toMatch(/applyBuildingBlueprintFilter/);
    expect(site).not.toMatch(/sprite\.setAlpha\(1\)/);
  });
});
