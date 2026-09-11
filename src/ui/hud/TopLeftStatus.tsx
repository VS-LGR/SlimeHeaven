import { HUD_ASSETS } from "./hudAssets";
import { HUD_LAYOUT } from "./hudLayout";
import { HudCard, HudSlot, HudSlotIcon, HudSlotLabel } from "./HudCard";
import { PROTOTYPE_WORLD_STATUS } from "./hudSelectors";

export function TopLeftStatus() {
  const status = PROTOTYPE_WORLD_STATUS;
  const layout = HUD_LAYOUT.topLeft;

  return (
    <HudCard
      card={layout.card}
      scaleVar="--hud-left-scale"
      artwork={HUD_ASSETS.topLeft}
      panel="top-left"
      label="World status"
    >
      <div data-world-status-source={status.source} className="contents">
        <HudSlot name="weather" slot={layout.weather.slot} style={{ justifyContent: "center" }}>
          <HudSlotIcon src={HUD_ASSETS.iconSun} image={layout.weather.icon} name="sun" />
        </HudSlot>
        <HudSlot name="day" slot={layout.day.slot} style={{ paddingLeft: 4, paddingRight: 4 }}>
          <HudSlotLabel text={layout.day.text} ariaLabel={`Day: ${status.dayLabel}`}>
            {status.dayLabel}
          </HudSlotLabel>
        </HudSlot>
        <HudSlot
          name="time"
          slot={layout.time.slot}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <HudSlotLabel text={layout.time.text} ariaLabel={`Time: ${status.timeLabel}`}>
            {status.timeLabel}
          </HudSlotLabel>
        </HudSlot>
        <HudSlot name="season" slot={layout.season.slot} style={{ justifyContent: "center" }}>
          <div
            data-season-group="true"
            className="flex min-h-0 min-w-0 items-center justify-center gap-1"
          >
            <HudSlotIcon
              src={HUD_ASSETS.iconHarmony}
              image={layout.season.flower}
              name="season-flower"
            />
            <HudSlotLabel text={layout.season.text} fill={false} ariaLabel={`Season: ${status.season}`}>
              {status.season}
            </HudSlotLabel>
          </div>
        </HudSlot>
      </div>
    </HudCard>
  );
}
