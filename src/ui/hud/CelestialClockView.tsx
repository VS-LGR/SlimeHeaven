/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
import { HUD_ASSETS } from "./hudAssets";
import { HUD_LAYOUT } from "./hudLayout";
import {
  CELESTIAL_CLOCK,
  celestialClockPose,
  celestialRingMaskImage,
  type CelestialBodyPose,
} from "./celestialClock";
import { minutesFromTimeOfDay } from "@/src/simulation/timeConfig";

const PIXEL = { imageRendering: "pixelated" as const };

function FaceBody({ body, src, name }: { body: CelestialBodyPose; src: string; name: "sun" | "moon" }) {
  const { face } = CELESTIAL_CLOCK;
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      data-hud-icon={name}
      data-celestial-body={name}
      className="pointer-events-none absolute block max-w-none object-contain"
      style={{
        ...PIXEL,
        left: body.left - (face.centerX - face.radius),
        top: body.top - (face.centerY - face.radius),
        width: body.width,
        height: body.height,
      }}
    />
  );
}

export function CelestialClock({ hour, minute }: { hour: number; minute: number }) {
  const pose = celestialClockPose(minutesFromTimeOfDay(hour, minute));
  const { window: view, face } = CELESTIAL_CLOCK;
  const slot = HUD_LAYOUT.topLeft.weather.slot;
  const ringMask = celestialRingMaskImage();

  return (
    <div
      data-celestial-clock="true"
      aria-hidden="true"
      className="relative shrink-0 overflow-visible"
      style={{
        width: slot.width,
        height: slot.height,
      }}
    >
      <img
        src={HUD_ASSETS.clock}
        alt=""
        draggable={false}
        data-hud-clock-face="background"
        className="pointer-events-none absolute left-0 top-0 block max-w-none"
        style={{
          ...PIXEL,
          width: view.width,
          height: view.height,
        }}
      />
      <div
        data-celestial-face-clip="true"
        className="pointer-events-none absolute"
        style={{
          left: face.centerX - face.radius,
          top: face.centerY - face.radius,
          width: face.radius * 2,
          height: face.radius * 2,
          overflow: "hidden",
          borderRadius: "50%",
          clipPath: "circle(50%)",
        }}
      >
        {(pose.sun.y >= pose.moon.y
          ? [
              { body: pose.sun, src: HUD_ASSETS.iconSun, name: "sun" as const },
              { body: pose.moon, src: HUD_ASSETS.iconMoon, name: "moon" as const },
            ]
          : [
              { body: pose.moon, src: HUD_ASSETS.iconMoon, name: "moon" as const },
              { body: pose.sun, src: HUD_ASSETS.iconSun, name: "sun" as const },
            ]
        ).map((layer) => (
          <FaceBody key={layer.name} body={layer.body} src={layer.src} name={layer.name} />
        ))}
      </div>
      <img
        src={HUD_ASSETS.clock}
        alt=""
        draggable={false}
        data-hud-clock-face="ring"
        className="pointer-events-none absolute left-0 top-0 block max-w-none"
        style={{
          ...PIXEL,
          width: view.width,
          height: view.height,
          maskImage: ringMask,
          WebkitMaskImage: ringMask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: `${view.width}px ${view.height}px`,
          WebkitMaskSize: `${view.width}px ${view.height}px`,
        }}
      />
    </div>
  );
}
