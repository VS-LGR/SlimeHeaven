import { HUD_ASSETS, UNAVAILABLE_HUD_VALUE } from "./hudAssets";
import { HUD_LAYOUT, type HudResourceGroupConfig } from "./hudLayout";
import { HudCard, HudSlot, HudSlotIcon, HudSlotLabel } from "./HudCard";
import { useGameUiStore } from "@/src/store/gameUiStore";

export function TopRightResources() {
  const wood = useGameUiStore((state) => state.wood);
  const stone = useGameUiStore((state) => state.stone);
  const food = useGameUiStore((state) => state.food);
  const layout = HUD_LAYOUT.topRight;

  return (
    <HudCard
      card={layout.card}
      scaleVar="--hud-right-scale"
      artwork={HUD_ASSETS.topRight}
      panel="top-right"
      label="Resources"
    >
      <ResourceGroup config={layout.wood} src={HUD_ASSETS.iconWood} label="Wood" value={String(wood)} />
      <ResourceGroup
        config={layout.stone}
        src={HUD_ASSETS.iconStone}
        label="Stone"
        value={String(stone)}
      />
      <ResourceGroup config={layout.food} src={HUD_ASSETS.iconFood} label="Food" value={String(food)} />
      <HudSlot
        name="harmony"
        slot={layout.harmony.slot}
        style={{
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          opacity: 0.72,
        }}
      >
        <div
          className="flex min-h-0 min-w-0 items-center gap-1"
          data-harmony-indicator="true"
          aria-label="Harmony: unavailable"
        >
          <HudSlotIcon
            src={HUD_ASSETS.iconHarmony}
            image={layout.harmony.icon}
            name="harmony"
            opacity={0.85}
          />
          <HudSlotLabel text={layout.harmony.value} opacity={0.9}>
            {UNAVAILABLE_HUD_VALUE}%
          </HudSlotLabel>
        </div>
        <HudSlotLabel text={layout.harmony.label}>Harmonia</HudSlotLabel>
      </HudSlot>
      <HudSlot name="settings" slot={layout.settings.slot} style={{ justifyContent: "center" }}>
        <button
          type="button"
          disabled
          aria-label="Settings (unavailable)"
          className="pointer-events-none flex h-full w-full cursor-default items-center justify-center border-0 bg-transparent p-0"
        >
          <HudSlotIcon src={HUD_ASSETS.iconConfig} image={layout.settings.icon} name="settings" />
        </button>
      </HudSlot>
    </HudCard>
  );
}

function ResourceGroup({
  config,
  src,
  label,
  value,
}: {
  config: HudResourceGroupConfig;
  src: string;
  label: string;
  value: string;
}) {
  return (
    <HudSlot name={label.toLowerCase()} slot={config.slot} style={{ gap: 4, paddingLeft: 2 }}>
      <HudSlotIcon src={src} image={config.icon} name={label.toLowerCase()} />
      <HudSlotLabel
        text={config.value}
        valueKey={label.toLowerCase()}
        ariaLabel={`${label}: ${value}`}
      >
        {value}
      </HudSlotLabel>
    </HudSlot>
  );
}
