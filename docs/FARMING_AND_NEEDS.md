# Farming and Needs

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

Milestone 03. Player designates intent. Slimes execute. Simulation owns rules; Phaser only renders.

## Food need

The only biological need in this milestone is **food**.

Slimes have `satiety` in `0–100` (`src/simulation/needsConfig.ts`). It decays each simulation tick (`SATIETY_DECAY_PER_SECOND = 0.14`, about 10 minutes from full to starving). Hunger is **derived**, not stored as four booleans:

| Satiety | HungerState |
| --- | --- |
| 75–100 | fed |
| 40–74 | normal |
| 15–39 | hungry |
| 0–14 | starving |

Effects:

- **fed / normal** — no work penalty
- **hungry** — work timer accrues at `WORK_SPEED_HUNGRY` (0.8); may still perform ambient behavior
- **starving** — if food exists, do not take new jobs, cancel ambient, and go eat (finish a haul or fishing session first); if food is 0, keep working so the village can bootstrap a farm. No death.

## Eating

FSM: `moving_to_food` → `eating` → `idle`. Not a JobSystem task.

Storage is the food source. No physical food items. When eating **starts**, `tryConsumeFood` decrements stock atomically (Pingo → Momo → Tito). Two slimes cannot eat the last unit. Eat duration `EAT_DURATION_MS`; restore `EAT_SATIETY_RESTORE` (50). Cost `EAT_FOOD_COST` (1). Work animation is reused.

## Farm designation

Farm tool (HUD): Designate / Remove Farm. Click or drag an axis-aligned rectangle.

Valid tiles: `grass`, no blocking object, not water / sandy_soil / high_grass, not the storage tile.

`GameState.farms` is the source of truth (`FarmPlot`). Terrain IDs do not change. Authored SW overlay from World Art V3 was cleared so the player designates farmland.

Remove farm cancels pending till/plant/harvest for that tile (delivery in progress is left alone) and restores the grass visual. Details are hidden while a plot exists and shown again on remove. Blocking objects are never auto-removed.

## Farm state machine

```
designated → (till_soil) → tilled → (plant_crop) → growing → ready → (harvest_crop) → tilled → …
```

`planted` exists on the type; plant completion enters `growing` with `growthMs = 0`. Growth uses simulation time (`growthMs += SIMULATION_TICK_MS`), not render FPS. When `growthMs >= crop.growthTimeMs`, state becomes `ready`. After harvest the tile returns to `tilled` and a new plant job is created. The player does not redesignate.

Job generation iterates `GameState.farms` only. One active task per farm tile (`nodeId = farm_x_y`).

## Crop

One crop: `forest_carrot` in `src/simulation/data/crops.ts`.

- `growthTimeMs = 25000` (~25s at 4 Hz)
- `foodYield = 2`
- Seeds are free (no seed inventory)

## Jobs and delivery

Task types: `till_soil`, `plant_crop`, `harvest_crop`, plus existing `gather_wood` / `gather_stone`.

Till completes on the plot (`task.target`); Momo walks to a stance beside it (`task.workTile`, east neighbor first) so the hoe can hit the tile center. Plant still works on the plot tile. Harvest picks the crop, completes the field task, carries `food`, and deposits only in `deliver()` at storage — same physical-delivery rule as wood/stone.

Farm jobs require the `farming` capability (Momo among the current three). `taskSuitability` still reads optional `slime.jobAffinity?.[jobCategory]`; Momo has no farming bonus yet. Capability is eligibility; affinity is preference. See [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md).

## Visual mapping

Soil is a dedicated 32×32 spritesheet (`dry` / `watered` / `dead`). Crops are 32×46 plot overlays from `CropDefinition.visuals.growthFrames`. Terrain.png frames 0 / 8 are no longer the farm overlay.

| Plot state | Soil | Crop |
| --- | --- | --- |
| designated | none (grass) until the hoe hit finishes | none |
| tilled | dry soil clump | none |
| growing | dry soil | stages 1–6 from `growthMs / growthTimeMs` |
| ready | dry soil | stage 6 |
| after harvest | dry soil | none; auto-replant starts at stage 1 |

`watered` and `dead` load but do not activate. Sprites are never fractionally scaled. Farm tool overlays are Graphics (green valid / red invalid). Crop origin `(0.5, 1)` at tile bottom; 14px may overlap the tile above. Crop sprites sit above soil/details and below slime Y-sort so they never draw in front of a slime.

Momo specialist clips (presentation only):

| Task | Animation | Extra layers |
| --- | --- | --- |
| till_soil | farm_till | hoe + dirt impact |
| plant_crop | farm_plant | none (pouch/seed baked in) |
| harvest_crop | farm_harvest | none (crop stays on the tile) |

## Temporary balance (not final)

- Initial satiety 100, initial food 0
- Decay 0.14 satiety/s → starving in ~10 minutes from full (cozy observation pacing)
- Eat 1 food → +50 satiety
- Small designated field (~25s growth, 2 food/tile) can feed three slimes during testing

Till presentation (Milestone 04.4A): Momo `till_soil` hops to a walkable stance beside the plot (prefer east, face west) so the hoe blade meets the tile center. The plot stays grass until that strike’s dirt puff ends (`completeTill` at `WORK_DURATION_MS`). One swing (`repeat: 0`). After the hit he hops from the strike pose back to the stance tile feet instead of teleporting.

Plant and harvest (Milestone 04.4B) work **on the plot**. The last hop lands on the plot’s geometric center so `farm_plant` / `farm_harvest` play on the crop instead of the south tile lip. After plant, a same-tile hop walks back to tile feet; harvest carry starts from that center pose. `farm_plant` is body-only (pouch and seed are authored into the 5 frames). `farm_harvest` is a generic 12-frame pull/recoil with no crop baked in; the farm tile keeps the crop overlay until `completeHarvest`, then carry-food takes over.

Water VFX is still visual only. Farms do not require water adjacency. No save/load.
