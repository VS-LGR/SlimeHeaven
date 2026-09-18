import { HUD_ASSET_SIZES } from "./hudAssets";
import { HUD_LAYOUT } from "./hudLayout";
import { MINUTES_PER_DAY, wrapMinuteOfDay } from "@/src/simulation/timeConfig";

export interface CelestialClockOrbit {
  /** Slot-local X of the shared orbit center. Matches the face center. */
  centerX: number;
  /**
   * Slot-local Y of the shared orbit center. Placed one orbit-radius below the
   * face center so 00:00 / 12:00 sit in the middle of the disk.
   */
  centerY: number;
  radius: number;
  /**
   * Added to the sun’s progress angle. 90° puts 00:00 at the bottom in screen
   * space (0° = +X / right, clockwise as time advances).
   */
  sunAngleOffsetDeg: number;
}

export interface CelestialBodySize {
  width: number;
  height: number;
}

export interface CelestialFace {
  /** Slot-local center of the authored inner disk. */
  centerX: number;
  centerY: number;
  /** Radius to the inside edge of the black/gold ring. */
  radius: number;
}

export interface CelestialClockConfig {
  window: { width: number; height: number };
  face: CelestialFace;
  orbit: CelestialClockOrbit;
  sun: CelestialBodySize;
  moon: CelestialBodySize;
  /** Slot-local Y of the orbit equator. Matches the pair’s pivot. */
  horizonY: number;
}

/** Card-local scale that fits native 122×119 into the left wood well. */
export function celestialClockLayoutScale(): number {
  return HUD_LAYOUT.topLeft.weather.slot.width / HUD_ASSET_SIZES.clock.width;
}

function fromNativeClock(native: number): number {
  return native * celestialClockLayoutScale();
}

const FACE_CENTER_X = fromNativeClock(61);
const FACE_CENTER_Y = fromNativeClock(59);
const FACE_RADIUS = fromNativeClock(47);
/**
 * Max icon side as a fraction of the inner disk. Keeps rays and stars inside
 * the ring instead of clipping them into a cropped blob.
 */
const CELESTIAL_ICON_FACE_FIT = 0.94;
/** Extra gap so the opposite icon’s stars/rays stay below the inner disk. */
const OPPOSITE_CLEARANCE = 4;

function sizeIconToFace(native: { width: number; height: number }): CelestialBodySize {
  const maxSide = Math.round(FACE_RADIUS * 2 * CELESTIAL_ICON_FACE_FIT);
  const scale = maxSide / Math.max(native.width, native.height);
  return {
    width: Math.round(native.width * scale),
    height: Math.round(native.height * scale),
  };
}

const SUN_SIZE = sizeIconToFace(HUD_ASSET_SIZES.sun);
const MOON_SIZE = sizeIconToFace(HUD_ASSET_SIZES.moon);
/**
 * Occupant stays on the face center (pivot = center + radius). Radius is large
 * enough that the opposite icon, including its box, sits below the inner disk.
 */
const ORBIT_RADIUS =
  (FACE_RADIUS + Math.max(SUN_SIZE.height, MOON_SIZE.height) / 2 + OPPOSITE_CLEARANCE) / 2;

/**
 * Developer-facing celestial-clock layout. Card-local pixels inside the
 * Top Left weather slot. Not a player setting.
 *
 * UI_Clock.png is 122×119, fitted into the weather slot. The brown fill is
 * opaque, so icons sit on the fill and the same asset paints the ring above.
 *
 * Sun and Moon are a rigid 180° pair. The orbit pivot sits one radius below
 * the face center so 12:00 (Sun) and 00:00 (Moon) stay centered in the disk.
 * The opposite icon is pushed just below the inner rim so it does not peek
 * through at midday or midnight. At 06:00 / 18:00 both rest on the lower half.
 */
export const CELESTIAL_CLOCK: CelestialClockConfig = {
  window: {
    width: HUD_LAYOUT.topLeft.weather.slot.width,
    height: HUD_LAYOUT.topLeft.weather.slot.height,
  },
  face: {
    centerX: FACE_CENTER_X,
    centerY: FACE_CENTER_Y,
    radius: FACE_RADIUS,
  },
  orbit: {
    centerX: FACE_CENTER_X,
    centerY: FACE_CENTER_Y + ORBIT_RADIUS,
    radius: ORBIT_RADIUS,
    sunAngleOffsetDeg: 90,
  },
  sun: SUN_SIZE,
  moon: MOON_SIZE,
  horizonY: FACE_CENTER_Y + ORBIT_RADIUS,
};

export interface CelestialBodyPose {
  angleDeg: number;
  x: number;
  y: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CelestialClockPose {
  minuteOfDay: number;
  sun: CelestialBodyPose;
  moon: CelestialBodyPose;
}

export function wrapDegrees(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    return 0;
  }
  return ((degrees % 360) + 360) % 360;
}

/** Signed shortest turn in (-180, 180]. */
export function shortestDeltaDeg(fromDeg: number, toDeg: number): number {
  const delta = wrapDegrees(toDeg) - wrapDegrees(fromDeg);
  if (delta > 180) {
    return delta - 360;
  }
  if (delta <= -180) {
    return delta + 360;
  }
  return delta;
}

export function sunAngleDeg(minuteOfDay: number, config: CelestialClockConfig = CELESTIAL_CLOCK): number {
  const minute = wrapMinuteOfDay(minuteOfDay);
  const progress = minute / MINUTES_PER_DAY;
  return wrapDegrees(config.orbit.sunAngleOffsetDeg + progress * 360);
}

export function moonAngleDeg(minuteOfDay: number, config: CelestialClockConfig = CELESTIAL_CLOCK): number {
  return wrapDegrees(sunAngleDeg(minuteOfDay, config) + 180);
}

export function polarToSlot(
  angleDeg: number,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
): { x: number; y: number } {
  const rad = (wrapDegrees(angleDeg) * Math.PI) / 180;
  return {
    x: config.orbit.centerX + config.orbit.radius * Math.cos(rad),
    y: config.orbit.centerY + config.orbit.radius * Math.sin(rad),
  };
}

function bodyPose(
  angleDeg: number,
  size: CelestialBodySize,
  config: CelestialClockConfig,
): CelestialBodyPose {
  const { x, y } = polarToSlot(angleDeg, config);
  return {
    angleDeg,
    x,
    y,
    left: x - size.width / 2,
    top: y - size.height / 2,
    width: size.width,
    height: size.height,
  };
}

export function celestialClockPose(
  minuteOfDay: number,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
): CelestialClockPose {
  const minute = wrapMinuteOfDay(minuteOfDay);
  return {
    minuteOfDay: minute,
    sun: bodyPose(sunAngleDeg(minute, config), config.sun, config),
    moon: bodyPose(moonAngleDeg(minute, config), config.moon, config),
  };
}

export function bodiesAreOpposite(
  pose: CelestialClockPose,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
  epsilon = 0.75,
): boolean {
  const dx = pose.moon.x - pose.sun.x;
  const dy = pose.moon.y - pose.sun.y;
  const distance = Math.hypot(dx, dy);
  const angleDelta = Math.abs(shortestDeltaDeg(pose.sun.angleDeg, pose.moon.angleDeg));
  return Math.abs(distance - config.orbit.radius * 2) <= epsilon && Math.abs(angleDelta - 180) <= 0.001;
}

export function celestialAspectMatchesNative(
  size: CelestialBodySize,
  native: { width: number; height: number },
  tolerance = 0.03,
): boolean {
  const rendered = size.width / size.height;
  const source = native.width / native.height;
  return Math.abs(rendered - source) / source <= tolerance;
}

export function celestialUsesNativeAssetSizes(): boolean {
  return (
    celestialAspectMatchesNative(CELESTIAL_CLOCK.sun, HUD_ASSET_SIZES.sun) &&
    celestialAspectMatchesNative(CELESTIAL_CLOCK.moon, HUD_ASSET_SIZES.moon)
  );
}

export interface CelestialRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function pointInCelestialFace(
  x: number,
  y: number,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
): boolean {
  const dx = x - config.face.centerX;
  const dy = y - config.face.centerY;
  return dx * dx + dy * dy <= config.face.radius * config.face.radius;
}

/** True when this body’s box still overlaps the circular face. */
export function celestialBodyIsShown(
  body: CelestialBodyPose,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
): boolean {
  const visible = visibleBodyRect(body, config);
  return visible.width > 0 && visible.height > 0;
}

export function pointInVisibleCelestial(
  x: number,
  y: number,
  config: CelestialClockConfig = CELESTIAL_CLOCK,
): boolean {
  return pointInCelestialFace(x, y, config);
}

export function celestialFaceClipPath(config: CelestialClockConfig = CELESTIAL_CLOCK): string {
  return `circle(${config.face.radius}px at ${config.face.centerX}px ${config.face.centerY}px)`;
}

export function celestialRingMaskImage(config: CelestialClockConfig = CELESTIAL_CLOCK): string {
  const { centerX, centerY, radius } = config.face;
  return `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent ${radius}px, #000 ${radius}px)`;
}

/** Pose box clipped to the circular face. Used to prove containment. */
export function visibleBodyRect(body: CelestialBodyPose, config: CelestialClockConfig = CELESTIAL_CLOCK): CelestialRect {
  const faceLeft = config.face.centerX - config.face.radius;
  const faceRight = config.face.centerX + config.face.radius;
  const faceTop = config.face.centerY - config.face.radius;
  const faceBottom = config.face.centerY + config.face.radius;
  const left = Math.max(0, faceLeft, body.left);
  const top = Math.max(0, faceTop, body.top);
  const right = Math.min(config.window.width, faceRight, body.left + body.width);
  const bottom = Math.min(config.window.height, faceBottom, body.top + body.height);
  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

export function apexBodyFullyVisible(body: CelestialBodyPose, config: CelestialClockConfig = CELESTIAL_CLOCK): boolean {
  return pointInCelestialFace(body.x, body.y, config);
}
