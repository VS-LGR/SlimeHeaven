/* Pixel HUD assets must stay nearest-neighbor; next/image would resample them. */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from "react";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { HUD_ASSETS } from "./hudAssets";
import { selectInventoryStockModel } from "./hudSelectors";
import {
  INVENTORY_CATEGORY_LABELS,
  INVENTORY_MODE_LABELS,
  inventoryItemOptics,
  type InventoryHubMode,
  type InventoryItemId,
} from "./inventoryCatalog";
import {
  INVENTORY_CREAM,
  INVENTORY_INK,
  INVENTORY_LAYOUT,
  INVENTORY_MOTION_MS,
  INVENTORY_REDUCED_MOTION_MS,
  INVENTORY_SETTLE_Y_PX,
  inventoryIconDrawSize,
  inventoryPanelDisplaySize,
  LARGE_CARD_SLOTS,
  scaleInventorySlot,
} from "./inventoryLayout";
import {
  filterInventoryItems,
  stockableDiscoveryCount,
  type InventoryHudViewItem,
} from "./inventoryHudModel";
import { prefersHudReducedMotion } from "./useTopRightHud";
import {
  readInventoryHudPrefs,
  writeInventoryHudPrefs,
  type InventoryHudPrefs,
} from "./inventoryHudPrefs";

const PIXEL: CSSProperties = { imageRendering: "pixelated" };
const FOCUS_RING =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FBDDAF]";
const EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

function stopHudPointer(event: MouseEvent | PointerEvent | WheelEvent): void {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation?.();
}

function useViewportSize(): { width: number; height: number } {
  const [size, setSize] = useState(() => ({
    width: typeof window === "undefined" ? 1920 : window.innerWidth,
    height: typeof window === "undefined" ? 1080 : window.innerHeight,
  }));
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

export function InventoryHud() {
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const vine = useGameUiStore((state) => state.vine);
  const food = useGameUiStore((state) => state.food);
  const foliage = useGameUiStore((state) => state.foliage);
  const copperOre = useGameUiStore((state) => state.copperOre);
  const discovered = useGameUiStore((state) => state.discoveredResources);
  const inventoryPanelOpen = useGameUiStore((state) => state.inventoryPanelOpen);
  const setInventoryPanelOpen = useGameUiStore((state) => state.setInventoryPanelOpen);

  const [prefs, setPrefs] = useState<InventoryHudPrefs>(() => readInventoryHudPrefs());
  const [selectedId, setSelectedId] = useState<InventoryItemId>("wood");
  const [layerVisible, setLayerVisible] = useState(false);
  const [panelShown, setPanelShown] = useState(false);
  const backpackRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const skipPersist = useRef(true);
  const viewport = useViewportSize();

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    writeInventoryHudPrefs(prefs);
  }, [prefs]);

  if (inventoryPanelOpen && !layerVisible) {
    setLayerVisible(true);
  }

  useEffect(() => {
    if (inventoryPanelOpen || !layerVisible) {
      return;
    }
    const delay = prefersHudReducedMotion() ? INVENTORY_REDUCED_MOTION_MS : INVENTORY_MOTION_MS;
    const timer = window.setTimeout(() => setLayerVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [inventoryPanelOpen, layerVisible]);

  useLayoutEffect(() => {
    if (!inventoryPanelOpen || !layerVisible) {
      const id = window.requestAnimationFrame(() => setPanelShown(false));
      return () => window.cancelAnimationFrame(id);
    }
    if (prefersHudReducedMotion()) {
      const id = window.requestAnimationFrame(() => setPanelShown(true));
      return () => window.cancelAnimationFrame(id);
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPanelShown(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [inventoryPanelOpen, layerVisible]);

  useEffect(() => {
    if (!inventoryPanelOpen) {
      return;
    }
    const focusTarget = closeRef.current ?? dialogRef.current;
    const backpack = backpackRef.current;
    focusTarget?.focus();
    return () => {
      backpack?.focus();
    };
  }, [inventoryPanelOpen]);

  const stock = selectInventoryStockModel({ wood, stone, vine, food, foliage, copperOre });
  const items = filterInventoryItems({
    stock,
    discovered,
    favorites: prefs.favorites,
    category: prefs.category,
    sort: "name",
    discoveredOnly: false,
    favoritesOnly: false,
    mode: prefs.mode,
  });
  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const { count: discoveredCount, total: discoveryTotal } = stockableDiscoveryCount(discovered);
  const display = inventoryPanelDisplaySize(viewport.width, viewport.height);
  const duration = prefersHudReducedMotion() ? INVENTORY_REDUCED_MOTION_MS : INVENTORY_MOTION_MS;
  const button = INVENTORY_LAYOUT.button;

  const toggleInventory = () => {
    setInventoryPanelOpen(!inventoryPanelOpen);
  };

  const closeInventory = () => {
    setInventoryPanelOpen(false);
  };

  return (
    <>
      <section
        className="pointer-events-none absolute"
        data-hud-card="top-right"
        data-hud-panel="inventory-launcher"
        aria-label="Inventário da vila"
        style={{
          top: "max(env(safe-area-inset-top, 0px), var(--hud-safe-y))",
          right: "max(env(safe-area-inset-right, 0px), var(--hud-safe-x))",
          width: `calc(${button.width}px * var(--hud-right-scale))`,
          height: `calc(${button.height}px * var(--hud-right-scale))`,
        }}
      >
        <div
          data-hud-card-inner="true"
          data-hud-card-content="true"
          className="pointer-events-none absolute"
          style={{
            top: 0,
            right: 0,
            width: button.width,
            height: button.height,
            transform: "scale(var(--hud-right-scale))",
            transformOrigin: "top right",
          }}
        >
          <button
            ref={backpackRef}
            type="button"
            data-hud-interactive="true"
            data-inventory-backpack="true"
            className={`pointer-events-auto absolute inset-0 cursor-pointer border-0 bg-transparent p-0 ${FOCUS_RING}`}
            aria-label={inventoryPanelOpen ? "Fechar inventário" : "Abrir inventário"}
            aria-expanded={inventoryPanelOpen}
            aria-haspopup="dialog"
            aria-controls="inventory-backpack-dialog"
            onPointerDown={stopHudPointer}
            onClick={(event) => {
              stopHudPointer(event);
              toggleInventory();
            }}
          >
            <img
              src={HUD_ASSETS.inventoryMinimized}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-0 top-0 block max-w-none"
              style={{
                ...PIXEL,
                width: button.width,
                height: button.height,
              }}
            />
          </button>
        </div>
      </section>

      {layerVisible ? (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          data-inventory-modal-root="true"
          data-inventory-panel-open={inventoryPanelOpen ? "true" : "false"}
          data-inventory-mode={prefs.mode}
        >
          <button
            type="button"
            data-hud-interactive="true"
            data-inventory-backdrop="true"
            aria-label="Fechar inventário"
            className="pointer-events-auto absolute inset-0 cursor-default border-0 p-0"
            style={{
              background: "rgba(20, 12, 8, 0.35)",
              opacity: panelShown && inventoryPanelOpen ? 1 : 0,
              transition: `opacity ${duration}ms ${EASE}`,
            }}
            onPointerDown={stopHudPointer}
            onWheel={stopHudPointer}
            onClick={(event) => {
              stopHudPointer(event);
              closeInventory();
            }}
          />

          <div
            ref={dialogRef}
            id="inventory-backpack-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Materiais da vila"
            data-inventory-dialog="true"
            tabIndex={-1}
            className="pointer-events-auto absolute left-1/2 outline-none"
            style={{
              width: display.width,
              height: display.height,
              top: "calc((100% - var(--hud-toolbar-height, 164px)) / 2)",
              transform: `translate(-50%, calc(-50% + ${panelShown && inventoryPanelOpen ? 0 : INVENTORY_SETTLE_Y_PX}px))`,
              opacity: panelShown && inventoryPanelOpen ? 1 : 0,
              transition: `opacity ${duration}ms ${EASE}, transform ${duration}ms ${EASE}`,
              zIndex: 1,
            }}
            onPointerDown={stopHudPointer}
            onWheel={stopHudPointer}
            inert={!inventoryPanelOpen ? true : undefined}
          >
            <img
              src={HUD_ASSETS.inventoryBackpackPanel}
              alt=""
              draggable={false}
              aria-hidden="true"
              data-inventory-panel-art="true"
              className="pointer-events-none absolute left-0 top-0 block max-w-none"
              style={{
                ...PIXEL,
                width: display.width,
                height: display.height,
              }}
            />
            <InventoryDialogContents
              scale={display.scale}
              items={items}
              selected={selected}
              prefs={prefs}
              discoveredCount={discoveredCount}
              discoveryTotal={discoveryTotal}
              closeRef={closeRef}
              onClose={closeInventory}
              onSelect={setSelectedId}
              onPrefs={setPrefs}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function InventoryDialogContents({
  scale,
  items,
  selected,
  prefs,
  discoveredCount,
  discoveryTotal,
  closeRef,
  onClose,
  onSelect,
  onPrefs,
}: {
  scale: number;
  items: InventoryHudViewItem[];
  selected: InventoryHudViewItem | null;
  prefs: InventoryHudPrefs;
  discoveredCount: number;
  discoveryTotal: number;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSelect: (id: InventoryItemId) => void;
  onPrefs: (prefs: InventoryHudPrefs | ((current: InventoryHudPrefs) => InventoryHudPrefs)) => void;
}) {
  const panel = INVENTORY_LAYOUT.panel;
  const title = scaleInventorySlot(panel.title, scale);
  const discovery = scaleInventorySlot(panel.discovery, scale);
  const close = scaleInventorySlot(panel.close, scale);
  const chrome = scaleInventorySlot(panel.chrome, scale);
  const grid = scaleInventorySlot(panel.grid, scale);
  const details = scaleInventorySlot(panel.details, scale);
  const tabW = Math.round(INVENTORY_LAYOUT.wideCard.width * scale);
  const tabH = Math.round(INVENTORY_LAYOUT.wideCard.height * scale);
  const shortW = Math.round(INVENTORY_LAYOUT.short.width * scale);
  const shortH = Math.round(INVENTORY_LAYOUT.short.height * scale);
  const cardW = Math.round(INVENTORY_LAYOUT.largeCard.width * scale);
  const cardH = Math.round(INVENTORY_LAYOUT.largeCard.height * scale);
  const fontScale = Math.min(1.1, Math.max(0.82, scale));
  const chromeGap = Math.round(8 * scale);

  const setMode = (mode: InventoryHubMode) => {
    onPrefs((current) => ({ ...current, mode }));
  };

  return (
    <div
      className="pointer-events-none absolute inset-0"
      data-inventory-page="true"
      data-inventory-hub-mode={prefs.mode}
      style={{ width: Math.round(panel.width * scale), height: Math.round(panel.height * scale) }}
    >
      <h2
        className="pointer-events-none absolute m-0 text-center font-mono font-extrabold tracking-wide"
        style={{
          left: title.x,
          top: title.y,
          width: title.width,
          height: title.height,
          color: INVENTORY_INK,
          fontSize: Math.round(22 * fontScale),
          lineHeight: `${title.height}px`,
        }}
      >
        Materiais da vila
      </h2>

      <p
        className="pointer-events-none absolute m-0 text-center font-mono font-bold"
        data-inventory-discovery="true"
        style={{
          left: discovery.x,
          top: discovery.y,
          width: discovery.width,
          height: discovery.height,
          color: INVENTORY_INK,
          fontSize: Math.round(13 * fontScale),
          lineHeight: `${discovery.height}px`,
        }}
      >
        Descobertos {discoveredCount}/{discoveryTotal}
      </p>

      <button
        ref={closeRef}
        type="button"
        data-hud-interactive="true"
        data-inventory-control="close-inventory"
        className={`pointer-events-auto absolute cursor-pointer border-0 bg-transparent p-0 font-mono text-[14px] font-bold ${FOCUS_RING}`}
        style={{
          left: close.x,
          top: close.y,
          width: close.width,
          height: close.height,
          color: INVENTORY_INK,
        }}
        aria-label="Fechar inventário"
        onPointerDown={stopHudPointer}
        onClick={(event) => {
          stopHudPointer(event);
          onClose();
        }}
      >
        ✕
      </button>

      <div
        className="pointer-events-none absolute flex items-center"
        data-inventory-chrome="true"
        data-inventory-modes="true"
        data-inventory-tabs="true"
        style={{
          left: chrome.x,
          top: chrome.y,
          width: chrome.width,
          height: chrome.height,
          gap: chromeGap,
        }}
      >
        <ToolIconButton
          src={HUD_ASSETS.inventoryShortList}
          width={shortW}
          height={shortH}
          pressed={prefs.mode === "stock"}
          label={`Modo ${INVENTORY_MODE_LABELS.stock}`}
          control="mode-stock"
          onActivate={() => setMode("stock")}
        />
        <ToolIconButton
          src={HUD_ASSETS.inventoryShortShowHide}
          width={shortW}
          height={shortH}
          pressed={prefs.mode === "catalog"}
          label={`Modo ${INVENTORY_MODE_LABELS.catalog}`}
          control="mode-catalog"
          onActivate={() => setMode("catalog")}
        />
        <span
          className="pointer-events-none block"
          aria-hidden="true"
          style={{
            width: Math.round(2 * scale),
            height: Math.round(22 * scale),
            marginLeft: Math.round(2 * scale),
            marginRight: Math.round(2 * scale),
            background: INVENTORY_INK,
            opacity: 0.22,
            borderRadius: 1,
          }}
        />
        {(["all", "natural", "mineral"] as const).map((category) => {
          const selectedTab = prefs.category === category;
          return (
            <button
              key={category}
              type="button"
              data-hud-interactive="true"
              aria-pressed={selectedTab}
              className={`pointer-events-auto cursor-pointer border-0 font-mono font-bold ${FOCUS_RING}`}
              style={{
                width: tabW,
                height: tabH,
                backgroundImage: `url(${HUD_ASSETS.inventoryWideCard})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                color: INVENTORY_INK,
                fontSize: Math.round(12 * fontScale),
                opacity: selectedTab ? 1 : 0.72,
                filter: selectedTab ? "brightness(1.05)" : "brightness(0.92)",
              }}
              onPointerDown={stopHudPointer}
              onClick={(event) => {
                stopHudPointer(event);
                onPrefs((current) => ({ ...current, category }));
              }}
            >
              {INVENTORY_CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>

      <div
        className="absolute overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        data-inventory-grid="true"
        style={{
          left: grid.x,
          top: grid.y,
          width: grid.width,
          height: grid.height,
          overscrollBehavior: "contain",
        }}
      >
        <div className="flex flex-wrap justify-start" style={{ gap: Math.round(10 * scale) }}>
          {items.length === 0 ? (
            <p className="font-mono text-[12px] font-bold" style={{ color: INVENTORY_INK }}>
              Nenhum material neste filtro
            </p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                selected={selected?.id === item.id}
                scale={scale}
                cardW={cardW}
                cardH={cardH}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </div>

      {selected ? (
        <div
          className="absolute overflow-hidden font-mono"
          data-inventory-details="true"
          style={{
            left: details.x,
            top: details.y,
            width: details.width,
            height: details.height,
            color: INVENTORY_INK,
            boxSizing: "border-box",
            padding: `${Math.round(4 * scale)}px ${Math.round(8 * scale)}px`,
          }}
        >
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2">
              <img
                src={selected.iconSrc}
                alt=""
                draggable={false}
                className="pointer-events-none block max-w-none object-contain"
                style={{
                  ...PIXEL,
                  width: Math.round(36 * scale),
                  height: Math.round(32 * scale),
                  flexShrink: 0,
                  opacity: selected.collectable ? 1 : 0.55,
                  filter: selected.collectable ? undefined : "grayscale(0.35)",
                }}
              />
              <p className="m-0 font-extrabold leading-tight" style={{ fontSize: Math.round(15 * fontScale) }}>
                {selected.collectable
                  ? `${selected.name} ×${selected.quantity}`
                  : selected.name}
              </p>
            </div>
            <p className="m-0 leading-snug" style={{ fontSize: Math.round(11 * fontScale), maxWidth: "92%" }}>
              {selected.description}
            </p>
            <p
              className="m-0 leading-snug"
              style={{ fontSize: Math.round(10 * fontScale), opacity: 0.9, maxWidth: "92%" }}
            >
              {selected.acquired}
            </p>
            <p
              className="m-0 leading-snug"
              style={{ fontSize: Math.round(10 * fontScale), opacity: 0.9, maxWidth: "92%" }}
            >
              {selected.usedIn.length > 0
                ? `Usado em: ${selected.usedIn.join(", ")}`
                : "Sem usos registrados"}
              {" · "}
              {selected.collectable
                ? selected.discovered
                  ? "Descoberto nesta sessão"
                  : "Ainda não descoberto nesta sessão"
                : "Somente catálogo"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolIconButton({
  src,
  width,
  height,
  label,
  pressed,
  control,
  onActivate,
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  pressed: boolean;
  control?: string;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      data-hud-interactive="true"
      data-inventory-control={control}
      aria-label={label}
      aria-pressed={pressed}
      className={`pointer-events-auto cursor-pointer border-0 bg-transparent p-0 ${FOCUS_RING}`}
      style={{
        width,
        height,
        opacity: pressed ? 1 : 0.68,
        filter: pressed ? "brightness(1.08)" : "brightness(0.94)",
      }}
      onPointerDown={stopHudPointer}
      onClick={(event) => {
        stopHudPointer(event);
        onActivate();
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none block max-w-none"
        style={{ ...PIXEL, width, height, objectFit: "contain" }}
      />
    </button>
  );
}

function ItemCard({
  item,
  selected,
  scale,
  cardW,
  cardH,
  onSelect,
}: {
  item: InventoryHudViewItem;
  selected: boolean;
  scale: number;
  cardW: number;
  cardH: number;
  onSelect: (id: InventoryItemId) => void;
}) {
  const slots = LARGE_CARD_SLOTS;
  const iconDraw = inventoryIconDrawSize(item.id);
  const optics = inventoryItemOptics(item.id);
  const iconW = Math.min(
    Math.round((slots.icon.width - 4) * scale),
    Math.round(iconDraw.width * scale),
  );
  const iconH = Math.min(
    Math.round((slots.icon.height - 4) * scale),
    Math.round(iconDraw.height * scale),
  );
  const dimmed = !item.collectable || (item.collectable && !item.discovered && !item.quantity);
  const nameSize = Math.round(10 * Math.min(1.1, Math.max(0.82, scale)));
  const qtySize = Math.round(12 * Math.min(1.1, Math.max(0.82, scale)));

  return (
    <div className="relative" style={{ width: cardW, height: cardH, flexShrink: 0 }}>
      <button
        type="button"
        data-hud-interactive="true"
        data-inventory-item={item.id}
        data-inventory-locked={item.collectable ? "false" : "true"}
        aria-pressed={selected}
        aria-label={
          item.collectable
            ? `${item.name}, ${item.quantity} em estoque`
            : `${item.name}, somente catálogo`
        }
        className={`pointer-events-auto absolute inset-0 cursor-pointer border-0 bg-transparent p-0 ${FOCUS_RING}`}
        style={{
          backgroundImage: `url(${HUD_ASSETS.inventoryLargeCard})`,
          backgroundSize: `${cardW}px ${cardH}px`,
          backgroundRepeat: "no-repeat",
          opacity: selected ? 1 : dimmed ? 0.72 : 0.92,
          filter: selected
            ? "brightness(1.08)"
            : dimmed
              ? "brightness(0.88) saturate(0.75)"
              : undefined,
          boxShadow: selected ? `inset 0 0 0 ${Math.max(2, Math.round(2 * scale))}px ${INVENTORY_INK}` : undefined,
        }}
        onPointerDown={stopHudPointer}
        onClick={(event) => {
          stopHudPointer(event);
          onSelect(item.id);
        }}
      >
        <span
          className="pointer-events-none absolute flex items-center justify-center"
          style={{
            left: Math.round(slots.icon.x * scale),
            top: Math.round(slots.icon.y * scale),
            width: Math.round(slots.icon.width * scale),
            height: Math.round(slots.icon.height * scale),
          }}
        >
          <img
            src={item.iconSrc}
            alt=""
            draggable={false}
            className="pointer-events-none block max-w-none object-contain"
            style={{
              ...PIXEL,
              width: iconW,
              height: iconH,
              transform: `translate(${Math.round(optics.offsetX * scale)}px, ${Math.round(optics.offsetY * scale)}px)`,
              opacity: item.collectable ? 1 : 0.55,
            }}
          />
        </span>
        {item.collectable ? (
          <span
            className="pointer-events-none absolute text-center font-mono font-extrabold leading-none"
            data-inventory-card-qty={item.id}
            style={{
              left: Math.round(slots.qty.x * scale),
              top: Math.round(slots.qty.y * scale),
              width: Math.round(slots.qty.width * scale),
              height: Math.round(slots.qty.height * scale),
              color: INVENTORY_INK,
              fontSize: qtySize,
              lineHeight: `${Math.round(slots.qty.height * scale)}px`,
              textShadow: `0 1px 0 ${INVENTORY_CREAM}`,
            }}
          >
            {item.quantity}
          </span>
        ) : (
          <span
            className="pointer-events-none absolute text-center font-mono font-bold leading-none"
            style={{
              left: Math.round(slots.qty.x * scale),
              top: Math.round(slots.qty.y * scale),
              width: Math.round(slots.qty.width * scale),
              height: Math.round(slots.qty.height * scale),
              color: INVENTORY_INK,
              fontSize: Math.round(9 * Math.min(1.1, Math.max(0.82, scale))),
              lineHeight: `${Math.round(slots.qty.height * scale)}px`,
              opacity: 0.7,
            }}
          >
            —
          </span>
        )}
        <span
          className="pointer-events-none absolute flex items-center justify-center overflow-hidden text-center font-mono font-bold leading-tight"
          style={{
            left: Math.round(slots.name.x * scale),
            top: Math.round(slots.name.y * scale),
            width: Math.round(slots.name.width * scale),
            height: Math.round(slots.name.height * scale),
            color: INVENTORY_INK,
            fontSize: nameSize,
            paddingLeft: Math.round(2 * scale),
            paddingRight: Math.round(2 * scale),
          }}
        >
          {item.name}
        </span>
      </button>
    </div>
  );
}
