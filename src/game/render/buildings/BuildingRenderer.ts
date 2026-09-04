import Phaser from "phaser";
import type { Simulation } from "@/src/simulation/Simulation";
import type { PlacedBuilding } from "@/src/simulation/entities/PlacedBuilding";
import {
  applyBuildingSpriteLayout,
  buildingSpriteLayout,
  type BuildingSpriteLayout,
} from "./buildingPresentation";

export class BuildingRenderer {
  private readonly sprites = new Map<string, Phaser.GameObjects.Image>();

  constructor(private readonly scene: Phaser.Scene) {}

  sync(simulation: Simulation): void {
    const seen = new Set<string>();
    for (const building of Object.values(simulation.state.buildings)) {
      seen.add(building.id);
      this.syncBuilding(building, simulation);
    }
    for (const [id, sprite] of this.sprites) {
      if (seen.has(id)) {
        continue;
      }
      sprite.destroy();
      this.sprites.delete(id);
    }
  }

  private syncBuilding(building: PlacedBuilding, simulation: Simulation): void {
    const origin = { x: building.tileX, y: building.tileY };
    const layout = buildingSpriteLayout(origin, building.typeId, "completed");
    if (!this.scene.textures.exists(layout.textureKey)) {
      simulation.state.warnOnce(
        `missing-building-texture-${building.typeId}`,
        `Missing building texture ${layout.textureKey} for ${building.typeId}`,
      );
      return;
    }
    const sprite = this.sprites.get(building.id) ?? this.createSprite(layout);
    applyBuildingSpriteLayout(sprite, layout);
    sprite.setAlpha(1);
    this.sprites.set(building.id, sprite);
  }

  private createSprite(layout: BuildingSpriteLayout): Phaser.GameObjects.Image {
    return this.scene.add
      .image(layout.x, layout.y, layout.textureKey)
      .setOrigin(layout.originX, layout.originY)
      .setDepth(layout.depth);
  }
}
