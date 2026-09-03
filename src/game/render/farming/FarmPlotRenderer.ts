import Phaser from "phaser";
import { DEPTH } from "../../config";
import { tileToAnchor, tileToWorld } from "@/src/world/constants";
import { farmKey, type FarmPlot } from "@/src/simulation/entities/FarmPlot";
import type { Simulation } from "@/src/simulation/Simulation";
import { cropGrowthFrameLoads } from "@/src/simulation/data/crops";
import { plotCropTextureKey } from "./cropPresentation";
import { FARM_SOIL_FRAMES, FARM_SOIL_TEXTURE_KEY } from "./farmSoilVisualConfig";

interface PlotSprites {
  soil: Phaser.GameObjects.Image;
  crop: Phaser.GameObjects.Image;
}

export class FarmPlotRenderer {
  private readonly sprites = new Map<string, PlotSprites>();

  constructor(private readonly scene: Phaser.Scene) {}

  sync(simulation: Simulation): void {
    const seen = new Set<string>();
    for (const plot of Object.values(simulation.state.farms)) {
      const key = farmKey(plot.tile.x, plot.tile.y);
      seen.add(key);
      this.syncPlot(key, plot);
    }
    for (const [key, pair] of this.sprites) {
      if (seen.has(key)) {
        continue;
      }
      pair.soil.destroy();
      pair.crop.destroy();
      this.sprites.delete(key);
    }
  }

  private syncPlot(key: string, plot: FarmPlot): void {
    const pair = this.sprites.get(key) ?? this.createSprites(plot);
    this.sprites.set(key, pair);
    const showSoil = plot.state !== "designated";
    const cropKey = plotCropTextureKey(plot);
    const { x, y } = tileToWorld(plot.tile.x, plot.tile.y);
    const feet = tileToAnchor(plot.tile.x, plot.tile.y);

    pair.soil.setPosition(x, y);
    pair.soil.setFrame(FARM_SOIL_FRAMES[plot.soilVisual]);
    pair.soil.setVisible(showSoil);
    pair.soil.setDepth(DEPTH.FARMING);

    pair.crop.setPosition(feet.x, feet.y);
    if (cropKey && this.scene.textures.exists(cropKey)) {
      pair.crop.setTexture(cropKey);
      pair.crop.setVisible(true);
    } else {
      pair.crop.setVisible(false);
    }
    // Above soil/details, below slime Y-sort — growing crops must not cover slimes.
    pair.crop.setDepth(DEPTH.GROUND_DETAIL + 0.5);
  }

  private createSprites(plot: FarmPlot): PlotSprites {
    const { x, y } = tileToWorld(plot.tile.x, plot.tile.y);
    const feet = tileToAnchor(plot.tile.x, plot.tile.y);
    const soil = this.scene.add
      .image(x, y, FARM_SOIL_TEXTURE_KEY, FARM_SOIL_FRAMES.dry)
      .setOrigin(0, 0)
      .setDepth(DEPTH.FARMING)
      .setVisible(false);
    const cropKey = cropGrowthFrameLoads()[0]?.key ?? FARM_SOIL_TEXTURE_KEY;
    const crop = this.scene.add
      .image(feet.x, feet.y, cropKey)
      .setOrigin(0.5, 1)
      .setVisible(false);
    return { soil, crop };
  }
}
