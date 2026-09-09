/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import {
  HUD_LAYOUT_DEBUG,
  slotStyle,
  type HudCardConfig,
  type HudImageConfig,
  type HudSlotConfig,
  type HudTextConfig,
} from "./hudLayout";

const PIXEL: CSSProperties = {
  imageRendering: "pixelated",
};

export function HudCard({
  card,
  scaleVar,
  artwork,
  panel,
  label,
  children,
}: {
  card: HudCardConfig;
  scaleVar: "--hud-left-scale" | "--hud-right-scale";
  artwork: string;
  panel: "top-left" | "top-right";
  label: string;
  children: ReactNode;
}) {
  const origin = card.anchor === "top-left" ? "top left" : "top right";
  const edge = card.anchor === "top-left" ? "left" : "right";

  return (
    <section
      className="pointer-events-none absolute"
      data-hud-card={panel}
      data-hud-panel={panel}
      aria-label={label}
      style={{
        top: "max(env(safe-area-inset-top, 0px), var(--hud-safe-y))",
        [edge]: `max(env(safe-area-inset-${edge}, 0px), var(--hud-safe-x))`,
        width: `calc(${card.width}px * var(${scaleVar}))`,
        height: `calc(${card.height}px * var(${scaleVar}))`,
      }}
    >
      <div
        data-hud-card-inner="true"
        className="pointer-events-none absolute"
        style={{
          top: 0,
          [edge]: 0,
          width: card.width,
          height: card.height,
          transform: `scale(var(${scaleVar}))`,
          transformOrigin: origin,
        }}
      >
        <img
          src={artwork}
          alt=""
          draggable={false}
          aria-hidden="true"
          data-hud-panel-art={panel}
          className="pointer-events-none absolute inset-0 block h-full w-full max-w-none"
          style={PIXEL}
        />
        <div data-hud-card-content="true" className="pointer-events-none absolute inset-0">
          {children}
        </div>
        {HUD_LAYOUT_DEBUG ? <HudLayoutDebugOverlay card={card} scaleVar={scaleVar} /> : null}
      </div>
    </section>
  );
}

export function HudSlot({
  name,
  slot,
  children,
  style,
}: {
  name: string;
  slot: HudSlotConfig;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      data-hud-slot={name}
      style={{
        ...slotStyle(slot),
        ...(HUD_LAYOUT_DEBUG
          ? { outline: "1px solid rgba(250, 204, 21, 0.85)", outlineOffset: -1 }
          : {}),
        ...style,
      }}
    >
      {HUD_LAYOUT_DEBUG ? (
        <span className="pointer-events-none absolute left-0 top-0 z-10 bg-black/70 px-0.5 text-[8px] text-yellow-200">
          {name}
        </span>
      ) : null}
      {children}
    </div>
  );
}

export function HudSlotIcon({
  src,
  image,
  name,
  opacity,
}: {
  src: string;
  image: HudImageConfig;
  name?: string;
  opacity?: number;
}) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      aria-hidden="true"
      data-hud-icon={name}
      className="pointer-events-none block max-w-none shrink-0 object-contain"
      style={{
        ...PIXEL,
        width: image.width * image.scale,
        height: image.height * image.scale,
        opacity,
      }}
    />
  );
}

export function HudSlotLabel({
  text,
  children,
  ariaLabel,
  valueKey,
  opacity,
}: {
  name?: string;
  text: HudTextConfig;
  children: ReactNode;
  ariaLabel?: string;
  valueKey?: string;
  opacity?: number;
}) {
  const justify =
    text.align === "center" ? "center" : text.align === "right" ? "flex-end" : "flex-start";

  return (
    <span
      className="pointer-events-none m-0 flex min-w-0 font-mono"
      data-hud-value={valueKey}
      aria-label={ariaLabel}
      style={{
        flex: "1 1 0%",
        minWidth: 0,
        maxWidth: "100%",
        height: `${text.lineHeight * text.scale}px`,
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        fontSize: text.fontSize * text.scale,
        lineHeight: `${text.lineHeight * text.scale}px`,
        letterSpacing: `${text.letterSpacing}px`,
        fontWeight: text.fontWeight,
        color: text.color,
        textAlign: text.align,
        textShadow: text.shadow,
        opacity,
        boxSizing: "border-box",
        paddingLeft: text.align === "center" ? 2 : 2,
        paddingRight: text.align === "center" ? 2 : 2,
      }}
    >
      {children}
    </span>
  );
}

function HudLayoutDebugOverlay({
  card,
  scaleVar,
}: {
  card: HudCardConfig;
  scaleVar: "--hud-left-scale" | "--hud-right-scale";
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 font-mono text-[9px] leading-none text-lime-300"
      data-hud-layout-debug="true"
      style={{ boxShadow: "inset 0 0 0 1px rgba(163,230,53,0.85)" }}
    >
      <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5">
        {card.anchor} {card.width}×{card.height} {scaleVar}
      </span>
    </div>
  );
}
