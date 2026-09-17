import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TIME, minutesFromTimeOfDay } from "@/src/simulation/timeConfig";
import { HUD_ASSET_SIZES } from "./hudAssets";
import { HUD_LAYOUT, rectsOverlap } from "./hudLayout";
import {
  CELESTIAL_CLOCK,
  apexBodyFullyVisible,
  bodiesAreOpposite,
  celestialBodyIsShown,
  celestialClockPose,
  celestialFaceClipPath,
  celestialRingMaskImage,
  celestialUsesNativeAssetSizes,
  moonAngleDeg,
  pointInCelestialFace,
  pointInVisibleCelestial,
  shortestDeltaDeg,
  sunAngleDeg,
  visibleBodyRect,
  wrapDegrees,
} from "./celestialClock";

function poseAt(hour: number, minute: number) {
  return celestialClockPose(minutesFromTimeOfDay(hour, minute));
}

function slotOverlaps(localX: number, localY: number, slot: { x: number; y: number; width: number; height: number }) {
  const weather = HUD_LAYOUT.topLeft.weather.slot;
  return rectsOverlap(
    { x: weather.x + localX, y: weather.y + localY, width: 1, height: 1 },
    { x: slot.x, y: slot.y, width: slot.width, height: slot.height },
  );
}

describe("celestial clock 05.5B", () => {
  it("keeps layout in one config inside the authored clock frame", () => {
    expect(CELESTIAL_CLOCK.window).toEqual({
      width: HUD_LAYOUT.topLeft.weather.slot.width,
      height: HUD_LAYOUT.topLeft.weather.slot.height,
    });
    expect(CELESTIAL_CLOCK.orbit.centerX).toBeCloseTo(CELESTIAL_CLOCK.face.centerX, 6);
    expect(CELESTIAL_CLOCK.orbit.centerY).toBeCloseTo(
      CELESTIAL_CLOCK.face.centerY + CELESTIAL_CLOCK.face.radius,
      6,
    );
    expect(CELESTIAL_CLOCK.horizonY).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY, 6);
    expect(CELESTIAL_CLOCK.orbit.radius).toBeGreaterThan(CELESTIAL_CLOCK.face.radius * 0.5);
    expect(CELESTIAL_CLOCK.orbit.radius).toBeLessThan(CELESTIAL_CLOCK.face.radius);
    expect(CELESTIAL_CLOCK.orbit.sunAngleOffsetDeg).toBe(90);
    expect(celestialUsesNativeAssetSizes()).toBe(true);
    expect(CELESTIAL_CLOCK.sun).toEqual({
      width: HUD_LAYOUT.topLeft.weather.icon.width,
      height: HUD_LAYOUT.topLeft.weather.icon.height,
    });
    expect(CELESTIAL_CLOCK.sun).toEqual({ width: 82, height: 78 });
    expect(CELESTIAL_CLOCK.moon).toEqual({ width: 80, height: 82 });
    expect(CELESTIAL_CLOCK.sun.width).not.toBe(HUD_ASSET_SIZES.sun.width);
    expect(CELESTIAL_CLOCK.moon.width).not.toBe(HUD_ASSET_SIZES.moon.width);
    expect(HUD_LAYOUT.topLeft.weather.slot.x + HUD_LAYOUT.topLeft.weather.slot.width).toBeLessThan(
      HUD_LAYOUT.topLeft.day.slot.x,
    );
    expect(HUD_LAYOUT.topLeft.weather.slot.y + HUD_LAYOUT.topLeft.weather.slot.height).toBeLessThan(
      HUD_LAYOUT.topLeft.season.slot.y,
    );
  });

  it("maps the four reference times onto a shared clockwise orbit", () => {
    const midnight = poseAt(0, 0);
    const sunrise = poseAt(6, 0);
    const noon = poseAt(12, 0);
    const sunset = poseAt(18, 0);

    expect(midnight.moon.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY - CELESTIAL_CLOCK.orbit.radius, 6);
    expect(midnight.sun.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY + CELESTIAL_CLOCK.orbit.radius, 6);
    expect(midnight.moon.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX, 6);
    expect(midnight.sun.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX, 6);

    expect(noon.sun.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY - CELESTIAL_CLOCK.orbit.radius, 6);
    expect(noon.moon.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY + CELESTIAL_CLOCK.orbit.radius, 6);
    expect(noon.sun.y).toBeCloseTo(
      CELESTIAL_CLOCK.face.centerY + CELESTIAL_CLOCK.face.radius - CELESTIAL_CLOCK.orbit.radius,
      6,
    );
    expect(pointInCelestialFace(noon.sun.x, noon.sun.y)).toBe(true);
    expect(pointInCelestialFace(noon.moon.x, noon.moon.y)).toBe(false);
    expect(pointInCelestialFace(midnight.moon.x, midnight.moon.y)).toBe(true);
    expect(pointInCelestialFace(midnight.sun.x, midnight.sun.y)).toBe(false);

    expect(sunrise.sun.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX - CELESTIAL_CLOCK.orbit.radius, 6);
    expect(sunrise.moon.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX + CELESTIAL_CLOCK.orbit.radius, 6);
    expect(sunrise.sun.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY, 6);

    expect(sunset.sun.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX + CELESTIAL_CLOCK.orbit.radius, 6);
    expect(sunset.moon.x).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerX - CELESTIAL_CLOCK.orbit.radius, 6);
    expect(sunset.sun.y).toBeCloseTo(CELESTIAL_CLOCK.orbit.centerY, 6);

    for (const pose of [midnight, sunrise, noon, sunset]) {
      expect(bodiesAreOpposite(pose)).toBe(true);
    }
  });

  it("shows only the Sun at 12:00 and only the Moon at 00:00", () => {
    const midnight = poseAt(0, 0);
    const noon = poseAt(12, 0);
    expect(pointInCelestialFace(midnight.moon.x, midnight.moon.y)).toBe(true);
    expect(pointInCelestialFace(midnight.sun.x, midnight.sun.y)).toBe(false);
    expect(pointInCelestialFace(noon.sun.x, noon.sun.y)).toBe(true);
    expect(pointInCelestialFace(noon.moon.x, noon.moon.y)).toBe(false);
    expect(apexBodyFullyVisible(midnight.moon)).toBe(true);
    expect(apexBodyFullyVisible(midnight.sun)).toBe(false);
    expect(apexBodyFullyVisible(noon.sun)).toBe(true);
    expect(apexBodyFullyVisible(noon.moon)).toBe(false);

    const sunrise = poseAt(6, 0);
    const sunset = poseAt(18, 0);
    expect(celestialBodyIsShown(sunrise.sun)).toBe(true);
    expect(celestialBodyIsShown(sunrise.moon)).toBe(true);
    expect(celestialBodyIsShown(sunset.sun)).toBe(true);
    expect(celestialBodyIsShown(sunset.moon)).toBe(true);
    expect(visibleBodyRect(sunrise.sun).height).toBeGreaterThan(0);
    expect(visibleBodyRect(sunrise.moon).height).toBeGreaterThan(0);
  });

  it("keeps Sun and Moon opposite and normalizes wraparound without a backward spin", () => {
    expect(wrapDegrees(-90)).toBe(270);
    expect(wrapDegrees(450)).toBe(90);
    expect(Math.abs(shortestDeltaDeg(sunAngleDeg(0), moonAngleDeg(0)))).toBe(180);

    const late = poseAt(23, 59);
    const next = poseAt(0, 0);
    expect(Math.abs(shortestDeltaDeg(late.sun.angleDeg, next.sun.angleDeg))).toBeLessThan(0.3);
    expect(Math.abs(shortestDeltaDeg(late.moon.angleDeg, next.moon.angleDeg))).toBeLessThan(0.3);
    expect(Math.hypot(next.sun.x - late.sun.x, next.sun.y - late.sun.y)).toBeLessThan(1);

    const noon = poseAt(12, 0);
    const debugJump = shortestDeltaDeg(noon.sun.angleDeg, next.sun.angleDeg);
    expect(Math.abs(debugJump)).toBeGreaterThan(90);
    expect(Math.abs(debugJump)).toBeLessThanOrEqual(180);
  });

  it("derives the orbit from simulation minutes, not lighting periods", () => {
    expect(TIME.periods.dawn.startMinute).not.toBe(6 * 60);
    expect(sunAngleDeg(minutesFromTimeOfDay(6, 0))).toBeCloseTo(180, 6);
    expect(sunAngleDeg(minutesFromTimeOfDay(18, 0))).toBeCloseTo(0, 6);
    const morning = poseAt(TIME.newGame.hour, TIME.newGame.minute);
    expect(morning.sun.x).toBeLessThan(CELESTIAL_CLOCK.orbit.centerX);
    expect(morning.sun.y).toBeLessThan(CELESTIAL_CLOCK.horizonY);
    expect(morning.moon.y).toBeGreaterThan(CELESTIAL_CLOCK.horizonY - 1);
  });

  it("replaces the crossfade and stays presentation-only", () => {
    const clock = readFileSync("src/ui/hud/celestialClock.ts", "utf8");
    const view = readFileSync("src/ui/hud/CelestialClockView.tsx", "utf8");
    const topLeft = readFileSync("src/ui/hud/TopLeftStatus.tsx", "utf8");
    const selectors = readFileSync("src/ui/hud/hudSelectors.ts", "utf8");
    expect(clock).not.toMatch(/Date\.now|performance\.now|requestAnimationFrame/);
    expect(view).not.toMatch(/transition|animation|requestAnimationFrame|Date\.now/);
    expect(view).toMatch(/aria-hidden/);
    expect(topLeft).toMatch(/CelestialClock/);
    expect(topLeft).not.toMatch(/sunOpacity|moonOpacity|celestialOpacities/);
    expect(selectors).not.toMatch(/sunOpacity|moonOpacity|celestialOpacities/);
    expect(view).toMatch(/HUD_ASSETS\.iconSun/);
    expect(view).toMatch(/HUD_ASSETS\.iconMoon/);
    expect(view).toMatch(/HUD_ASSETS\.clock/);
    expect(view).toMatch(/object-contain/);
    expect(view).toMatch(/clipPath|clip-path/);
    expect(view).toMatch(/data-celestial-face-clip/);
    expect(view).not.toMatch(/celestialBodyIsShown/);
    expect(view).toMatch(/borderRadius:\s*["']50%["']/);
    expect(view).toMatch(/circle\(50%\)/);
    expect(view).toMatch(/overflow:\s*["']hidden["']/);
    expect(view).not.toMatch(/clipPath:\s*["']inset\(0\)["']/);
    expect(view).not.toMatch(/celestialHorizonInset/);
    expect(celestialFaceClipPath()).toMatch(/^circle\(/);
    expect(celestialRingMaskImage()).toMatch(/radial-gradient/);
  });

  it("keeps the apex icon in the face and clips the opposite body out of the circular interior", () => {
    expect(apexBodyFullyVisible(poseAt(12, 0).sun)).toBe(true);
    expect(apexBodyFullyVisible(poseAt(0, 0).moon)).toBe(true);
    expect(pointInVisibleCelestial(poseAt(0, 0).sun.x, poseAt(0, 0).sun.y)).toBe(false);
    expect(pointInVisibleCelestial(poseAt(12, 0).moon.x, poseAt(12, 0).moon.y)).toBe(false);

    const season = HUD_LAYOUT.topLeft.season.slot;
    const day = HUD_LAYOUT.topLeft.day.slot;
    const time = HUD_LAYOUT.topLeft.time.slot;
    const card = HUD_LAYOUT.topLeft.card;
    const samples = [
      poseAt(0, 0),
      poseAt(6, 0),
      poseAt(12, 0),
      poseAt(18, 0),
      poseAt(18, 35),
      poseAt(5, 30),
    ];
    for (const pose of samples) {
      for (const body of [pose.sun, pose.moon]) {
        const visible = visibleBodyRect(body);
        if (visible.width === 0 || visible.height === 0) {
          continue;
        }
        const weather = HUD_LAYOUT.topLeft.weather.slot;
        const cardBottom = weather.y + visible.top + visible.height;
        const cardRight = weather.x + visible.left + visible.width;
        const cardLeft = weather.x + visible.left;
        expect(cardBottom).toBeLessThanOrEqual(season.y);
        expect(cardRight).toBeLessThanOrEqual(day.x);
        expect(cardLeft).toBeGreaterThanOrEqual(0);
        expect(visible.left + visible.width).toBeLessThanOrEqual(CELESTIAL_CLOCK.window.width);
        expect(visible.top + visible.height).toBeLessThanOrEqual(
          CELESTIAL_CLOCK.face.centerY + CELESTIAL_CLOCK.face.radius,
        );

        for (let y = visible.top; y <= visible.top + visible.height; y += 4) {
          for (let x = visible.left; x <= visible.left + visible.width; x += 4) {
            if (!pointInVisibleCelestial(x, y)) {
              continue;
            }
            expect(slotOverlaps(x, y, day)).toBe(false);
            expect(slotOverlaps(x, y, time)).toBe(false);
            expect(slotOverlaps(x, y, season)).toBe(false);
            expect(weather.x + x).toBeGreaterThanOrEqual(0);
            expect(weather.y + y).toBeGreaterThanOrEqual(0);
            expect(weather.x + x).toBeLessThan(card.width);
            expect(weather.y + y).toBeLessThan(card.height);
          }
        }
      }
    }
  });
});
