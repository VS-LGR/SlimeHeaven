import { buildingVisualLayout, type BuildingTypeId } from "@/src/simulation/data/buildings";
import type { PlacedBuilding } from "@/src/simulation/entities/PlacedBuilding";
import { TIME, wrapMinuteOfDay } from "@/src/simulation/timeConfig";
import { clamp01, lerp, smoothstep } from "./dayNightPresentation";

/**
 * Presentation-only night lights. Offsets are completed-canvas pixel centers
 * measured from the authored PNGs (top-left origin).
 *
 * No standalone lamp/lantern PNG exists under public/assets (world objects are
 * tree, pine, bush, rock). House lanterns/windows are the only sources.
 */
export const NIGHT_LIGHT_FALLOFF_KEY = "night-light-falloff";

export const NIGHT_LIGHT = {
  falloffTextureSize: 256,
  /** Hide lights below this so daytime stays the authored colors. */
  visibleMin: 0.001,
} as const;

export interface NightLightDef {
  id: string;
  /** Pixel center on the completed house canvas. */
  localX: number;
  localY: number;
  color: number;
  /** Surrounding glow radius in world pixels. */
  radius: number;
  /** Darkness-hole radius in world pixels. */
  eraseRadius: number;
  glowAlpha: number;
}

export interface NightLightWorldSource {
  id: string;
  worldX: number;
  worldY: number;
  color: number;
  radius: number;
  eraseRadius: number;
  glowAlpha: number;
}

export interface NightLightIntensityKey {
  minute: number;
  intensity: number;
}

/**
 * Lights follow the simulation clock periods: off by day, full at night,
 * smoothstep through dusk/dawn. Instant with debug jumps and restored saves.
 */
export const NIGHT_LIGHT_INTENSITY_KEYS: readonly NightLightIntensityKey[] = [
  { minute: 0, intensity: 1 },
  { minute: TIME.periods.dawn.startMinute, intensity: 1 },
  { minute: TIME.periods.day.startMinute, intensity: 0 },
  { minute: TIME.periods.dusk.startMinute, intensity: 0 },
  { minute: TIME.periods.night.startMinute, intensity: 1 },
  { minute: TIME.minutesPerDay, intensity: 1 },
];

/** Pingo: round window above the door. The right-eave lantern is not a source. */
const PINGO_HOUSE_LIGHTS: readonly NightLightDef[] = [
  {
    id: "window",
    localX: 56.5,
    localY: 42.5,
    color: 0xffc56a,
    radius: 44,
    eraseRadius: 54,
    glowAlpha: 0.5,
  },
];

/** Tito: hanging lantern on the left wall. The gable window is not a source. */
const TITO_HOUSE_LIGHTS: readonly NightLightDef[] = [
  {
    id: "lantern",
    localX: 33.5,
    localY: 86.5,
    color: 0xffc070,
    radius: 52,
    eraseRadius: 64,
    glowAlpha: 0.58,
  },
];

/** Momo: arched window left of the door. The right hanging lamp is not a source. */
const MOMO_HOUSE_LIGHTS: readonly NightLightDef[] = [
  {
    id: "window",
    localX: 27.5,
    localY: 61.5,
    color: 0xffb45a,
    radius: 48,
    eraseRadius: 58,
    glowAlpha: 0.55,
  },
];

export const BUILDING_NIGHT_LIGHTS: Record<BuildingTypeId, readonly NightLightDef[]> = {
  small_blue_house: PINGO_HOUSE_LIGHTS,
  brown_house: TITO_HOUSE_LIGHTS,
  green_house: MOMO_HOUSE_LIGHTS,
};

/**
 * Would hold plaza/path lamps. Empty: no authored standalone lamp asset, and
 * this milestone must not fabricate one.
 */
export const STANDALONE_NIGHT_LIGHTS: readonly NightLightWorldSource[] = [];

export function nightLightIntensity(
  minuteOfDay: number,
  keys: readonly NightLightIntensityKey[] = NIGHT_LIGHT_INTENSITY_KEYS,
): number {
  const minute = wrapMinuteOfDay(minuteOfDay);
  const spanKeys = keys.length >= 2 ? keys : NIGHT_LIGHT_INTENSITY_KEYS;
  let endIndex = spanKeys.findIndex((key) => key.minute > minute);
  if (endIndex <= 0) {
    endIndex = spanKeys.length - 1;
  }
  const start = spanKeys[endIndex - 1] ?? spanKeys[0];
  const end = spanKeys[endIndex] ?? start;
  const span = end.minute - start.minute;
  const t = span <= 0 ? 0 : (minute - start.minute) / span;
  return lerp(start.intensity, end.intensity, smoothstep(clamp01(t)));
}

export function spriteLocalToWorld(
  layout: {
    x: number;
    y: number;
    originX: number;
    originY: number;
    displayWidth: number;
    displayHeight: number;
  },
  localX: number,
  localY: number,
): { x: number; y: number } {
  return {
    x: layout.x + localX - layout.originX * layout.displayWidth,
    y: layout.y + localY - layout.originY * layout.displayHeight,
  };
}

export function nightLightsForBuilding(building: PlacedBuilding): NightLightWorldSource[] {
  const defs = BUILDING_NIGHT_LIGHTS[building.typeId];
  if (!defs || defs.length === 0) {
    return [];
  }
  const layout = buildingVisualLayout({ x: building.tileX, y: building.tileY }, building.typeId, "completed");
  return defs.map((def) => {
    const world = spriteLocalToWorld(layout, def.localX, def.localY);
    return {
      id: `${building.id}:${def.id}`,
      worldX: world.x,
      worldY: world.y,
      color: def.color,
      radius: def.radius,
      eraseRadius: def.eraseRadius,
      glowAlpha: def.glowAlpha,
    };
  });
}

/** Completed buildings only. Construction sites and blueprints never emit light. */
export function collectNightLightSources(
  buildings: Record<string, PlacedBuilding>,
): NightLightWorldSource[] {
  const sources: NightLightWorldSource[] = [];
  const seen = new Set<string>();
  for (const building of Object.values(buildings)) {
    for (const source of nightLightsForBuilding(building)) {
      if (seen.has(source.id)) {
        continue;
      }
      seen.add(source.id);
      sources.push(source);
    }
  }
  for (const lamp of STANDALONE_NIGHT_LIGHTS) {
    if (seen.has(lamp.id)) {
      continue;
    }
    seen.add(lamp.id);
    sources.push(lamp);
  }
  return sources;
}
