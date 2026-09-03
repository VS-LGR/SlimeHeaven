# Slime Architecture — Village Alive

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

Simulation is authoritative. Phaser only renders.

```
Simulation (4 Hz)
  → tickNeeds → tickFarms → tickAquatic → tickFishingOpportunities → tickFishing → assignAvailableTasks → tickAmbientBehaviors → tickSlimes
  → GameState (slimes, tasks, resources, farms, grid, water bodies, fishing)
  → SlimeRenderer / farm overlay / fishing bobber (sprites only)
```

No `Phaser.Scene`, sprites, or textures live in simulation state.

## Tick

`SIMULATION_TICKS_PER_SECOND = 4` in `src/simulation/constants.ts`.

`VillageScene.update` feeds render delta into `Simulation.update`. Gameplay advances only inside `tick()`. Render interpolates hop progress with the leftover accumulator (`tickAlpha`). Farm growth and satiety use this clock, not render FPS.

## Slime FSM

`idle → moving_to_task → working → carrying_to_storage → delivering → idle`

Fishing: `idle → moving_to_fishing → fishing_wait → fishing_bite → idle` (player hook is a session, not a slime work clip). Destination is always a shore **land** tile.

Need interrupt: `idle → moving_to_food → eating → idle` (starving with food available may cancel non-carry work first; starving with empty stock still works). `fishing_wait` / `fishing_bite` finish the short session before eating, like haul.

One explicit `state` field. Idle slimes wait, then may pick **ambient** behavior (local wander, observe water, inspect farm/nature, rest, greet). Productive jobs and player fishing interrupt ambient cleanly. Fishing wait uses Idle fallback for Momo/Tito; Pingo plays `fish_wait`. Bite/cast/hook use Work fallback or Pingo `fish_*` clips. See [`docs/AMBIENT_BEHAVIOR.md`](./AMBIENT_BEHAVIOR.md).

## Attributes

Universal 1–5 stats on spawn (`technique`, `strength`, `instinct`, `luck`). Temporary: Pingo 4/2/5/3, Momo 4/2/4/3, Tito 3/5/2/2. Fishing job scoring uses `getAttributeContribution` + distance **after** capability eligibility. Farm/gather ignore attributes this milestone. Capabilities are separate tags (see [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md)); they are not class locks and not derived from attributes.

## Pathfinding

4-directional A* in `src/world/pathfinding.ts`. Uses `Grid.isWalkable` (terrain + tree footprints). Water and trees are never stepped on. Paths are computed when a task is claimed, when carrying starts, when walking to food, or when a fishing opportunity is committed — not every frame.

Work stands on an adjacent walkable tile for trees (footprint is blocked). Farm plots stay walkable; the slime works standing on the farm cell. Stone gathering uses rock objects.

## Tasks and delivery

`gather_wood` / `gather_stone` / `till_soil` / `plant_crop` / `harvest_crop` / `fish_activity`. Capability tags filter candidates first (`fishing` / `farming` / `gathering`). Idle non-starving **eligible** slimes are assigned by oldest available task (fishing is committed immediately by the player). Suitability is `jobAffinity` plus, for fishing only, attribute contribution minus path distance. Tie-break among eligible slimes: Pingo → Momo → Tito. Current village: Pingo fishes, Momo farms, Tito gathers.

Carried resources are not added to stock until the slime occupies the storage tile (`STORAGE_TILE` = 10, 8). Harvest completes the field task when the crop is picked so the tile can replant while food is hauled. Unreachable targets cancel the task, drop the carry, and return the slime to idle (one `console.warn` per task id).

## Needs

Satiety 0–100 decays each tick (`SATIETY_DECAY_PER_SECOND = 0.14`, about 10 minutes full → starving). Hunger is derived (`fed` / `normal` / `hungry` / `starving`). Hungry slimes may still ambient; starving with food interrupts ambient and eats. See [`docs/FARMING_AND_NEEDS.md`](./FARMING_AND_NEEDS.md).

## Visuals

Pingo core Idle/Hop/Work is 42×65; fishing clips are 50×65. Momo/Tito keep their core sizes. Origin bottom-center (`0.5, 1`). Shadow is a separate sprite glued to the ground anchor; hop arc is a visual Y offset only.

Renderer plays `idle` / `hop` / `work`. Pingo fishing uses `pingo_fish_*` when those textures loaded; otherwise (and for Momo/Tito) `fish_*` maps onto Idle/Hop/Work. Momo farming uses `farm_till` / `farm_plant` / `farm_harvest` while working those tasks. Tito wood work uses reusable `tito_gather_swing` plus a synced axe prop (two 625 ms cycles inside `WORK_DURATION_MS`); stone gathering stays generic Work. Escape has no fail clip (Idle). A short success leftover can keep Pingo on `fish_success` after the session ends; it does not block job assignment.

## Known visual limits

Trees are one 64×64 sprite. Y-sort uses ground Y, so a slime can sit in front of or behind the whole tree, not under the canopy only.

Slimes may overlap; there is no crowd avoidance.

## Small World Prototype change

`Grid.isWalkable` was added so pathfinding and idle wander share the same walkable query. Tile hover/selection and the 32×32 map are unchanged.
