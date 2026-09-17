import Phaser from "phaser";
import { DEPTH } from "../../config";
import { lightingAtMinute } from "./dayNightPresentation";
import {
  NIGHT_LIGHT,
  NIGHT_LIGHT_FALLOFF_KEY,
  nightLightIntensity,
  type NightLightWorldSource,
} from "./nightLightsPresentation";

interface GlowPair {
  halo: Phaser.GameObjects.Image;
  core: Phaser.GameObjects.Image;
}

/**
 * Camera-view night wash plus local warm lights.
 *
 * Camera postFX is a no-op in this pixel-art Phaser 3.90 config, and a
 * RenderTexture fill did not composite as a translucent wash. The existing
 * view-sized Rectangle keeps the 05.5A darkness. Lights sit above it
 * (still below selection) as SCREEN halos and ADD cores so nearby grass and
 * walls actually brighten instead of sitting under an unbroken navy sheet.
 *
 * Trade-off: no occlusion. Overlap is kept in check with modest halo alpha;
 * ADD is limited to a small core so stacked lights do not blow out to white.
 */
export class DayNightOverlay {
  private readonly rect: Phaser.GameObjects.Rectangle;
  private readonly glows = new Map<string, GlowPair>();
  private lastColor = -1;
  private lastAlphaBucket = -1;

  constructor(private readonly scene: Phaser.Scene) {
    ensureNightLightFalloffTexture(scene);
    const view = scene.cameras.main.worldView;
    this.rect = scene.add.rectangle(
      view.centerX,
      view.centerY,
      Math.max(1, view.width),
      Math.max(1, view.height),
      0x152038,
      0.001,
    );
    this.rect.setDepth(DEPTH.DAY_NIGHT);
    this.rect.setScrollFactor(1, 1);
    this.rect.setName("day-night-overlay");
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  sync(minuteOfDay: number, lights: readonly NightLightWorldSource[] = []): void {
    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    this.rect.setPosition(view.centerX, view.centerY);
    this.rect.setSize(view.width + 4, view.height + 4);

    const sample = lightingAtMinute(minuteOfDay);
    const intensity = nightLightIntensity(minuteOfDay);
    const alphaBucket = Math.round(sample.alpha * 1000);
    if (sample.color !== this.lastColor || alphaBucket !== this.lastAlphaBucket) {
      this.lastColor = sample.color;
      this.lastAlphaBucket = alphaBucket;
      if (sample.alpha <= NIGHT_LIGHT.visibleMin) {
        this.rect.setFillStyle(sample.color, 0);
        this.rect.setVisible(false);
      } else {
        this.rect.setVisible(true);
        this.rect.setFillStyle(sample.color, sample.alpha);
      }
    }

    this.syncGlows(lights, intensity);
  }

  destroy(): void {
    for (const pair of this.glows.values()) {
      pair.halo.destroy();
      pair.core.destroy();
    }
    this.glows.clear();
    this.rect.destroy();
  }

  private syncGlows(lights: readonly NightLightWorldSource[], intensity: number): void {
    const seen = new Set<string>();
    const visible = intensity > NIGHT_LIGHT.visibleMin;
    for (const light of lights) {
      seen.add(light.id);
      const pair = this.glows.get(light.id) ?? this.createGlow(light);
      pair.halo.setPosition(light.worldX, light.worldY);
      pair.halo.setTint(light.color);
      pair.halo.setDisplaySize(light.eraseRadius * 2, light.eraseRadius * 2);
      pair.halo.setAlpha(visible ? intensity * light.glowAlpha : 0);
      pair.halo.setVisible(visible);
      pair.core.setPosition(light.worldX, light.worldY);
      pair.core.setTint(light.color);
      pair.core.setDisplaySize(light.radius * 0.55, light.radius * 0.55);
      pair.core.setAlpha(visible ? intensity * 0.42 : 0);
      pair.core.setVisible(visible);
      this.glows.set(light.id, pair);
    }
    for (const [id, pair] of this.glows) {
      if (seen.has(id)) {
        continue;
      }
      pair.halo.destroy();
      pair.core.destroy();
      this.glows.delete(id);
    }
  }

  private createGlow(light: NightLightWorldSource): GlowPair {
    const halo = this.scene.add
      .image(light.worldX, light.worldY, NIGHT_LIGHT_FALLOFF_KEY)
      .setOrigin(0.5, 0.5)
      .setBlendMode(Phaser.BlendModes.SCREEN)
      .setDepth(DEPTH.DAY_NIGHT + 0.4)
      .setScrollFactor(1, 1);
    const core = this.scene.add
      .image(light.worldX, light.worldY, NIGHT_LIGHT_FALLOFF_KEY)
      .setOrigin(0.5, 0.5)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(DEPTH.DAY_NIGHT + 0.5)
      .setScrollFactor(1, 1);
    return { halo, core };
  }
}

function ensureNightLightFalloffTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(NIGHT_LIGHT_FALLOFF_KEY)) {
    return;
  }
  const size = NIGHT_LIGHT.falloffTextureSize;
  const texture = scene.textures.createCanvas(NIGHT_LIGHT_FALLOFF_KEY, size, size);
  if (!texture) {
    return;
  }
  const ctx = texture.getContext();
  ctx.imageSmoothingEnabled = true;
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.78)");
  gradient.addColorStop(0.42, "rgba(255,255,255,0.32)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  texture.refresh();
  texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
}
