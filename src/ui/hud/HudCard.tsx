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
  artworkNode,
  artworkStyle,
  innerWidth,
  innerHeight,
  contentWidth,
  contentHeight,
  overflow = "visible",
  visualState,
  panel,
  label,
  children,
}: {
  card: HudCardConfig;
  scaleVar: "--hud-left-scale" | "--hud-right-scale";
  artwork?: string;
  artworkNode?: ReactNode;
  artworkStyle?: CSSProperties;
  innerWidth?: number;
  innerHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
  overflow?: "hidden" | "visible";
  visualState?: string;
  panel: "top-left" | "top-right";
  label: string;
  children: ReactNode;
}) {
  const origin = card.anchor === "top-left" ? "top left" : "top right";
  const edge = card.anchor === "top-left" ? "left" : "right";
  const width = innerWidth ?? card.width;
  const height = innerHeight ?? card.height;
  const contentW = contentWidth ?? width;
  const contentH = contentHeight ?? height;

  return (
    <section
      className="pointer-events-none absolute"
      data-hud-card={panel}
      data-hud-panel={panel}
      data-hud-visual-state={visualState}
      aria-label={label}
      style={{
        top: "max(env(safe-area-inset-top, 0px), var(--hud-safe-y))",
        [edge]: `max(env(safe-area-inset-${edge}, 0px), var(--hud-safe-x))`,
        width: `calc(${width}px * var(${scaleVar}))`,
        height: `calc(${height}px * var(${scaleVar}))`,
      }}
    >
      <div
        data-hud-card-inner="true"
        data-hud-inner-width={width}
        data-hud-inner-height={height}
        className="pointer-events-none absolute"
        style={{
          top: 0,
          [edge]: 0,
          width,
          height,
          overflow,
          transform: `scale(var(${scaleVar}))`,
          transformOrigin: origin,
        }}
      >
        {artworkNode ? (
          artworkNode
        ) : artwork ? (
          <img
            src={artwork}
            alt=""
            draggable={false}
            aria-hidden="true"
            data-hud-panel-art={panel}
            className={
              artworkStyle
                ? "pointer-events-none absolute block max-w-none"
                : "pointer-events-none absolute inset-0 block h-full w-full max-w-none"
            }
            style={{ ...PIXEL, ...artworkStyle }}
          />
        ) : null}
        <div
          data-hud-card-content="true"
          className="pointer-events-none absolute"
          style={{
            top: 0,
            [edge]: 0,
            width: contentW,
            height: contentH,
          }}
        >
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
  fill = true,
}: {
  name?: string;
  text: HudTextConfig;
  children: ReactNode;
  ariaLabel?: string;
  valueKey?: string;
  opacity?: number;
  fill?: boolean;
}) {
  const justify =
    text.align === "center" ? "center" : text.align === "right" ? "flex-end" : "flex-start";

  return (
    <span
      className="pointer-events-none m-0 flex min-w-0 font-mono"
      data-hud-value={valueKey}
      aria-label={ariaLabel}
      style={{
        flex: fill ? "1 1 0%" : "0 0 auto",
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
