/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { HUD_LAYOUT, slimeCardAttributeClusterWidth, slimeCardStarStripWidth, slotStyle } from "./hudLayout";
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
              justifyContent: "flex-start",
              gap: 4,
              paddingTop: 2,
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
                display: "inline-block",
                maxWidth: "100%",
                padding: "1px 7px",
                borderRadius: 8,
                background: "rgba(110, 62, 46, 0.12)",
                color: chrome.wood,
                fontSize: 12,
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
            <HudSlot
              name="slime-hunger"
              slot={slotFromText(layout.hunger)}
              style={{ justifyContent: "center", paddingLeft: 0, paddingRight: 0 }}
            >
              <div
                data-hud-hunger-columns="true"
                className="grid min-w-0 w-full"
                style={{ gridTemplateColumns: "1fr 1fr", alignItems: "center", justifyItems: "center" }}
              >
                <span className="flex min-w-0 w-full items-center justify-center gap-2">
                  <HudSlotLabel
                    text={{ ...layout.hunger, fontSize: 15, fontWeight: 700, color: chrome.wood }}
                    fill={false}
                  >
                    Fome
                  </HudSlotLabel>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: HUNGER_PIP_TOTAL }, (_, index) => (
                      <span
                        key={index}
                        style={{
                          width: 14,
                          height: 10,
                          borderRadius: 2,
                          background: index < model.hungerPips ? "#C4A35A" : "rgba(110, 62, 46, 0.18)",
                          boxShadow: `inset 0 0 0 1px ${chrome.wood}`,
                        }}
                      />
                    ))}
                  </span>
                </span>
                <span className="flex min-w-0 w-full items-center justify-center">
                  <HudSlotLabel
                    text={layout.hunger}
                    ariaLabel={`Fome: ${model.hunger}`}
                    valueKey="slime-hunger"
                    fill={false}
                  >
                    {model.hunger}
                  </HudSlotLabel>
                </span>
              </div>
            </HudSlot>
          ) : model.homeDetail ? (
            <HudSlot name="slime-home-detail" slot={slotFromText(layout.hunger)} style={{ justifyContent: "center" }}>
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
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 700,
                  color: chrome.wood,
                  textAlign: "center",
                  maxWidth: "100%",
                }}
              >
                {model.homeDetail}
              </span>
            </HudSlot>
          ) : null}
          <AttributeGrid rows={model.attributes} />
          <HudSlot
            name="slime-footer"
            slot={layout.footer}
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-end",
              gap: 4,
              overflow: "hidden",
            }}
          >
              <div
                data-hud-footer-columns="true"
                className="grid min-w-0 w-full"
                style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start", justifyItems: "center" }}
              >
              <FooterLine label="Atividade" value={model.activity} valueKey="slime-activity" />
              <FooterLine label="Moradia" value={model.home ?? "—"} valueKey="slime-home" />
            </div>
            {model.showInvite ? (
              <button
                type="button"
                data-hud-interactive="true"
                data-hud-slime-invite="true"
                className="pointer-events-auto w-full shrink-0 cursor-pointer border-0 font-mono hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6E3E2E]"
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

function FooterLine({
  label,
  value,
  valueKey,
}: {
  label: string;
  value: string;
  valueKey: string;
}) {
  return (
    <div
      className="flex min-w-0 w-full flex-col items-center"
      style={{ gap: 2, textAlign: "center" }}
    >
      <span
        className="pointer-events-none font-mono"
        style={{
          color: chrome.wood,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.6,
          lineHeight: "14px",
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
          fontSize: 15,
          fontWeight: 800,
          lineHeight: "18px",
          textAlign: "center",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const STAR_SLOTS = 5;

function AttributeGrid({
  rows,
}: {
  rows: ReturnType<typeof selectSlimeCardModel>["attributes"];
}) {
  const { iconCanvas, iconStarGap, starCanvas, starStride, height: rowHeight } = layout.attributeRow;
  const starStripWidth = slimeCardStarStripWidth(STAR_SLOTS);
  const clusterWidth = slimeCardAttributeClusterWidth(STAR_SLOTS);
  return (
    <div
      data-hud-slot="slime-attributes"
      style={{
        ...slotStyle(layout.attributes),
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "visible",
      }}
    >
      <div
        data-hud-attribute-grid="true"
        style={{
          display: "grid",
          width: clusterWidth,
          height: rowHeight * rows.length,
          gridTemplateColumns: `${iconCanvas}px ${starStripWidth}px`,
          columnGap: iconStarGap,
          gridTemplateRows: `repeat(${rows.length}, ${rowHeight}px)`,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {rows.map((row, rowIndex) => (
          <AttributeCells
            key={row.key}
            row={row}
            rowIndex={rowIndex}
            iconCanvas={iconCanvasFor(row.key)}
            starCanvas={starCanvas}
            starStride={starStride}
            starStripWidth={starStripWidth}
          />
        ))}
      </div>
    </div>
  );
}

function iconCanvasFor(key: string): number {
  const { iconCanvas, iconCanvasByKey } = layout.attributeRow;
  return iconCanvasByKey[key as keyof typeof iconCanvasByKey] ?? iconCanvas;
}

function AttributeCells({
  row,
  rowIndex,
  iconCanvas,
  starCanvas,
  starStride,
  starStripWidth,
}: {
  row: ReturnType<typeof selectSlimeCardModel>["attributes"][number];
  rowIndex: number;
  iconCanvas: number;
  starCanvas: number;
  starStride: number;
  starStripWidth: number;
}) {
  const gridRow = rowIndex + 1;
  return (
    <>
      <div
        className="group relative flex cursor-default flex-col items-center justify-center"
        data-hud-attribute={row.key}
        data-hud-attribute-value={row.key}
        data-hud-attribute-stars={row.filled}
        data-hud-interactive="true"
        tabIndex={0}
        aria-label={`${row.label}: ${row.value} de 5`}
        style={{
          gridColumn: 1,
          gridRow,
          width: layout.attributeRow.iconCanvas,
          gap: 1,
        }}
      >
        <span
          className="pointer-events-none absolute z-20 whitespace-nowrap font-mono opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          data-hud-attribute-tooltip={row.key}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: `calc(100% + ${layout.tooltipOffset}px)`,
            background: chrome.cream,
            color: chrome.ink,
            boxShadow: `inset 0 0 0 1px ${chrome.wood}`,
            borderRadius: 3,
            fontSize: 13,
            fontWeight: 800,
            padding: "3px 8px",
          }}
        >
          {row.label}
        </span>
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
          className="pointer-events-none font-mono"
          data-hud-attribute-label={row.key}
          style={{
            color: chrome.wood,
            fontSize: 11,
            fontWeight: 800,
            lineHeight: "12px",
            letterSpacing: 0,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {row.label}
        </span>
      </div>
      <div
        data-hud-star-strip={row.key}
        style={{
          gridColumn: 2,
          gridRow,
          position: "relative",
          width: starStripWidth,
          height: starCanvas,
        }}
      >
        {Array.from({ length: STAR_SLOTS }, (_, starIndex) => {
          const filled = starIndex < row.filled;
          return (
            <img
              key={`${row.key}-star-${starIndex}`}
              src={filled ? SLIME_CARD_ICON_ASSETS.star : SLIME_CARD_ICON_ASSETS.starEmpty}
              alt=""
              draggable={false}
              aria-hidden="true"
              data-hud-star-row={row.key}
              data-hud-star-col={starIndex}
              className="absolute block max-w-none"
              style={{
                ...PIXEL,
                left: starIndex * starStride,
                top: 0,
                width: starCanvas,
                height: starCanvas,
              }}
            />
          );
        })}
      </div>
    </>
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
