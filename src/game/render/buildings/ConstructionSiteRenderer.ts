import Phaser from "phaser";
import type { Simulation } from "@/src/simulation/Simulation";
import type { ConstructionSite } from "@/src/simulation/entities/ConstructionSite";
import { constructionProgress } from "@/src/simulation/entities/ConstructionSite";
import { buildingById, footprintTiles } from "@/src/simulation/data/buildings";
import { TILE_SIZE, tileToWorld } from "@/src/world/constants";
import {
  applyBuildingBlueprintFilter,
  applyBuildingSpriteLayout,
  buildingSpriteLayout,
  type BuildingSpriteLayout,
} from "./buildingPresentation";

const BAR_BG = 0x2a1a10;
const BAR_FILL = 0xe8c36a;

export class ConstructionSiteRenderer {
  private readonly sprites = new Map<string, Phaser.GameObjects.Image>();
  private readonly bars = new Map<string, Phaser.GameObjects.Graphics>();

  constructor(private readonly scene: Phaser.Scene) {}

  sync(simulation: Simulation): void {
    const seen = new Set<string>();
    for (const site of Object.values(simulation.state.constructionSites)) {
      if (site.status === "completed" || site.status === "cancelled") {
        continue;
      }
      seen.add(site.id);
      this.syncSite(site);
    }
    for (const [id, sprite] of this.sprites) {
      if (seen.has(id)) {
        continue;
      }
      sprite.destroy();
      this.sprites.delete(id);
      this.bars.get(id)?.destroy();
      this.bars.delete(id);
    }
  }

  private syncSite(site: ConstructionSite): void {
    const def = buildingById(site.buildingTypeId);
    const origin = { x: site.tileX, y: site.tileY };
    const layout = buildingSpriteLayout(origin, site.buildingTypeId, "construction");
    const sprite = this.sprites.get(site.id) ?? this.createSprite(layout);
    applyBuildingSpriteLayout(sprite, layout);
    applyBuildingBlueprintFilter(sprite);
    this.sprites.set(site.id, sprite);
    this.syncProgressBar(site, origin, def.footprint.width, layout.depth);
  }

  private createSprite(layout: BuildingSpriteLayout): Phaser.GameObjects.Image {
    return this.scene.add
      .image(layout.x, layout.y, layout.textureKey)
      .setOrigin(layout.originX, layout.originY)
      .setDepth(layout.depth);
  }

  private syncProgressBar(
    site: ConstructionSite,
    origin: { x: number; y: number },
    footprintWidth: number,
    depth: number,
  ): void {
    const tiles = footprintTiles(origin, buildingById(site.buildingTypeId));
    const graphic = this.bars.get(site.id) ?? this.scene.add.graphics();
    graphic.clear();
    graphic.setDepth(depth + 0.05);
    const south = tiles.reduce((max, tile) => (tile.y > max.y ? tile : max), tiles[0]);
    const west = tiles.reduce((min, tile) => (tile.x < min.x ? tile : min), tiles[0]);
    const barWorld = tileToWorld(west.x, south.y);
    const barWidth = footprintWidth * TILE_SIZE - 6;
    const barX = barWorld.x + 3;
    const barY = barWorld.y + TILE_SIZE - 6;
    const progress = constructionProgress(site);
    graphic.fillStyle(BAR_BG, 0.85);
    graphic.fillRect(barX, barY, barWidth, 3);
    graphic.fillStyle(BAR_FILL, 1);
    graphic.fillRect(barX, barY, Math.max(0, barWidth * progress), 3);
    this.bars.set(site.id, graphic);
  }
}
