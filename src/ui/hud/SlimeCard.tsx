/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { HUD_LAYOUT, slotStyle } from "./hudLayout";
import { SLIME_CARD_ASSET, SLIME_CARD_ICON_ASSETS } from "./hudAssets";
import { HudSlot, HudSlotLabel } from "./HudCard";
import { selectSlimeCardModel, portraitDrawScale, type SlimeCardPortraitSpec } from "./slimeCardModel";

const PIXEL = { imageRendering: "pixelated" as const };
const layout = HUD_LAYOUT.slimeCard;
const chrome = layout.chrome;
const HUNGER_PIP_TOTAL = 4;

function stopHudPointer(event: MouseEvent | PointerEvent): void {
  event.stopPropagation();
}

export function SlimeCard() {
  const selectedSlime = useGameUiStore((state) => state.selectedSlime);
  const hudActions = useGameUiStore((state) => state.hudActions);
  const clearSelectedSlime = useGameUiStore((state) => state.clearSelectedSlime);
  if (!selectedSlime) {
    return null;
  }

  const model = selectSlimeCardModel(selectedSlime);
  const width = layout.card.width;
  const height = layout.card.height;
  const specialty = model.specialtyLine ?? model.visitorInterest;

  return (
    <section
      className="absolute z-10"
      data-hud-panel="slime"
      data-hud-card="slime"
      data-hud-slime-variant={model.variant}
      aria-label={`Ficha de ${model.name}`}
      style={{
        left: "max(env(safe-area-inset-left, 0px), var(--hud-safe-x))",
        bottom:
          "calc(max(env(safe-area-inset-bottom, 0px), var(--hud-safe-y)) + var(--hud-slime-bottom, 0px))",
        width: `calc(${width}px * var(--hud-slime-scale))`,
        height: `calc(${height}px * var(--hud-slime-scale))`,
      }}
      onPointerDown={stopHudPointer}
      onClick={stopHudPointer}
    >
      <div
        data-hud-card-inner="true"
        data-hud-inner-width={width}
        data-hud-inner-height={height}
        data-hud-interactive="true"
        className="pointer-events-auto absolute"
        style={{
          left: 0,
          bottom: 0,
          width,
          height,
          transform: "scale(var(--hud-slime-scale))",
          transformOrigin: "bottom left",
        }}
      >
        <img
          src={SLIME_CARD_ASSET}
          alt=""
          draggable={false}
          aria-hidden="true"
          data-hud-panel-art="slime"
          className="pointer-events-none absolute inset-0 block h-full w-full max-w-none"
          style={PIXEL}
        />
        <div
          data-hud-card-content="true"
          className="absolute left-0 top-0 overflow-visible"
          style={{ width, height }}
        >
          <HudSlot
            name="slime-portrait"
            slot={layout.portrait}
            style={{
              justifyContent: "center",
              alignItems: "center",
              background: chrome.portraitWell,
              borderRadius: layout.portraitRadius,
              boxShadow: `inset 0 0 0 3px ${chrome.portraitWellEdge}`,
              overflow: "hidden",
            }}
          >
            {model.portrait ? (
              <SlimeCardPortrait key={model.portrait.slimeId} spec={model.portrait} name={model.name} />
            ) : null}
          </HudSlot>
          <HudSlot
            name="slime-identity"
            slot={layout.identity}
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <HudSlotLabel text={layout.name} ariaLabel={`Nome: ${model.name}`} valueKey="slime-name" fill={false}>
              {model.name}
            </HudSlotLabel>
            <span
              className="pointer-events-none font-mono"
              data-hud-value="slime-status"
              aria-label={model.residencyLabel}
              style={{
                display: "inline-flex",
                alignItems: "center",
                maxWidth: "100%",
                padding: "1px 7px",
                borderRadius: 8,
                background: "rgba(110, 62, 46, 0.12)",
                color: chrome.wood,
                fontSize: 10,
                fontWeight: 800,
                lineHeight: "16px",
                letterSpacing: 0.2,
              }}
            >
              {model.residencyLabel}
            </span>
            {specialty ? (
              <span
                className="pointer-events-none m-0 min-w-0 font-mono"
                data-hud-value="slime-role"
                aria-label={specialty}
                title={specialty}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: layout.role.fontSize,
                  lineHeight: `${layout.role.lineHeight}px`,
                  fontWeight: layout.role.fontWeight,
                  color: layout.role.color,
                  maxWidth: "100%",
                }}
              >
                {specialty}
              </span>
            ) : null}
          </HudSlot>
          {model.hunger ? (
            <HudSlot name="slime-hunger" slot={slotFromText(layout.hunger)} style={{ justifyContent: "space-between" }}>
              <span className="flex min-w-0 items-center gap-2">
                <HudSlotLabel text={{ ...layout.hunger, fontSize: 12, fontWeight: 700, color: chrome.wood }} fill={false}>
                  Fome
                </HudSlotLabel>
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: HUNGER_PIP_TOTAL }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        width: 11,
                        height: 8,
                        borderRadius: 2,
                        background: index < model.hungerPips ? "#C4A35A" : "rgba(110, 62, 46, 0.18)",
                        boxShadow: `inset 0 0 0 1px ${chrome.wood}`,
                      }}
                    />
                  ))}
                </span>
              </span>
              <HudSlotLabel
                text={layout.hunger}
                ariaLabel={`Fome: ${model.hunger}`}
                valueKey="slime-hunger"
                fill={false}
              >
                {model.hunger}
              </HudSlotLabel>
            </HudSlot>
          ) : model.homeDetail ? (
            <HudSlot name="slime-home-detail" slot={slotFromText(layout.hunger)}>
              <span
                className="pointer-events-none m-0 min-w-0 font-mono"
                data-hud-value="slime-home-detail"
                aria-label={model.homeDetail}
                title={model.homeDetail}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 700,
                  color: chrome.wood,
                  maxWidth: "100%",
                }}
              >
                {model.homeDetail}
              </span>
            </HudSlot>
          ) : null}
          <div data-hud-slot="slime-attributes" style={slotStyle(layout.attributes)}>
            <div className="flex h-full w-full flex-col justify-between">
              {model.attributes.map((row) => (
                <AttributeRow key={row.key} row={row} />
              ))}
            </div>
          </div>
          <HudSlot
            name="slime-footer"
            slot={layout.footer}
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: 8,
              overflow: "hidden",
            }}
          >
            <FooterLine label="Atividade" value={model.activity} valueKey="slime-activity" />
            {model.home ? <FooterLine label="Moradia" value={model.home} valueKey="slime-home" /> : null}
            {model.showInvite ? (
              <button
                type="button"
                data-hud-interactive="true"
                data-hud-slime-invite="true"
                className="pointer-events-auto mt-auto w-full cursor-pointer border-0 font-mono hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6E3E2E]"
                style={{
                  height: layout.invite.height,
                  background: chrome.cream,
                  color: chrome.ink,
                  boxShadow: `inset 0 0 0 2px ${chrome.wood}`,
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 800,
                }}
                onPointerDown={stopHudPointer}
                onClick={(event) => {
                  stopHudPointer(event);
                  hudActions?.inviteSelectedVisitor();
                }}
              >
                Convidar
              </button>
            ) : null}
          </HudSlot>
          <button
            type="button"
            aria-label="Fechar ficha"
            data-hud-interactive="true"
            data-hud-slime-close="true"
            className="pointer-events-auto absolute cursor-pointer border-0 font-mono hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6E3E2E]"
            style={{
              left: layout.close.x,
              top: layout.close.y,
              width: layout.close.width,
              height: layout.close.height,
              background: chrome.cream,
              color: chrome.wood,
              boxShadow: `inset 0 0 0 2px ${chrome.wood}`,
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 800,
              lineHeight: `${layout.close.height}px`,
              padding: 0,
            }}
            onPointerDown={stopHudPointer}
            onClick={(event) => {
              stopHudPointer(event);
              clearSelectedSlime();
            }}
          >
            ×
          </button>
        </div>
      </div>
    </section>
  );
}

function slotFromText(text: { x: number; y: number; width: number; height: number }) {
  return { x: text.x, y: text.y, width: text.width, height: text.height, overflow: "hidden" as const };
}

function FooterLine({ label, value, valueKey }: { label: string; value: string; valueKey: string }) {
  return (
    <div className="flex min-w-0 flex-col" style={{ gap: 1 }}>
      <span
        className="pointer-events-none font-mono"
        style={{
          color: chrome.wood,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 0.6,
          lineHeight: "12px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        className="pointer-events-none min-w-0 font-mono"
        data-hud-value={valueKey}
        aria-label={`${label}: ${value}`}
        title={value}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          color: chrome.ink,
          fontSize: 14,
          fontWeight: 800,
          lineHeight: "18px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function AttributeRow({
  row,
}: {
  row: ReturnType<typeof selectSlimeCardModel>["attributes"][number];
}) {
  const { iconCanvas, starCanvas, starGap, height } = layout.attributeRow;
  return (
    <div
      className="group relative flex cursor-default items-center"
      data-hud-attribute={row.key}
      data-hud-interactive="true"
      tabIndex={0}
      style={{ height, width: "100%", minWidth: 0, gap: 8 }}
    >
      <span
        className="pointer-events-none absolute z-20 whitespace-nowrap font-mono opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        data-hud-attribute-tooltip={row.key}
        style={{
          left: 0,
          bottom: `calc(100% + ${layout.tooltipOffset}px)`,
          background: chrome.cream,
          color: chrome.ink,
          boxShadow: `inset 0 0 0 1px ${chrome.wood}`,
          borderRadius: 3,
          fontSize: 12,
          fontWeight: 800,
          padding: "3px 8px",
        }}
      >
        {row.label}
      </span>
      <span className="flex shrink-0 flex-col items-center" style={{ width: iconCanvas + 4 }}>
        <img
          src={row.icon}
          alt=""
          draggable={false}
          aria-hidden="true"
          data-hud-attribute-icon={row.key}
          className="block max-w-none"
          style={{ ...PIXEL, width: iconCanvas, height: iconCanvas }}
        />
        <span
          className="pointer-events-none w-full truncate text-center font-mono"
          data-hud-attribute-label={row.key}
          style={{
            color: chrome.wood,
            fontSize: 9,
            fontWeight: 800,
            lineHeight: "11px",
            letterSpacing: 0,
          }}
        >
          {row.label}
        </span>
      </span>
      <span
        className="ml-auto flex shrink-0 items-center"
        aria-label={`${row.label}: ${row.value} de 5`}
        data-hud-attribute-value={row.key}
        data-hud-attribute-stars={row.filled}
      >
        {Array.from({ length: row.filled }, (_, index) => (
          <img
            key={`filled-${index}`}
            src={SLIME_CARD_ICON_ASSETS.star}
            alt=""
            draggable={false}
            aria-hidden="true"
            className="block max-w-none"
            style={{ ...PIXEL, width: starCanvas, height: starCanvas, marginLeft: index === 0 ? 0 : starGap }}
          />
        ))}
        {Array.from({ length: row.empty }, (_, index) => (
          <img
            key={`empty-${index}`}
            src={SLIME_CARD_ICON_ASSETS.starEmpty}
            alt=""
            draggable={false}
            aria-hidden="true"
            className="block max-w-none"
            style={{ ...PIXEL, width: starCanvas, height: starCanvas, marginLeft: starGap }}
          />
        ))}
      </span>
    </div>
  );
}

function SlimeCardPortrait({ spec, name }: { spec: SlimeCardPortraitSpec; name: string }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frameDurationMs = Math.max(16, Math.round(1000 / Math.max(1, spec.frameRate)));

  useEffect(() => {
    if (spec.frames.length <= 1) {
      return;
    }
    const startedAt = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const elapsed = now - startedAt;
      const next = Math.floor(elapsed / frameDurationMs) % spec.frames.length;
      setFrameIndex((current) => (current === next ? current : next));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [spec.frames, frameDurationMs]);

  const src = spec.frames[frameIndex] ?? spec.frames[0];
  if (!src) {
    return null;
  }

  const well = layout.portrait;
  const body = layout.portraitBody;
  const scale = portraitDrawScale(spec.opaque, body);
  const drawnWidth = spec.frameWidth * scale;
  const drawnHeight = spec.frameHeight * scale;
  const left = (well.width - spec.opaque.width * scale) / 2 - spec.opaque.x * scale;
  const top = (well.height - spec.opaque.height * scale) / 2 - spec.opaque.y * scale;

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      <img
        src={src}
        alt=""
        draggable={false}
        aria-label={`Retrato de ${name}`}
        data-hud-slime-portrait={spec.slimeId}
        data-hud-slime-portrait-frame={frameIndex}
        className="pointer-events-none absolute block max-w-none"
        style={{
          ...PIXEL,
          left,
          top,
          width: drawnWidth,
          height: drawnHeight,
        }}
      />
    </div>
  );
}
