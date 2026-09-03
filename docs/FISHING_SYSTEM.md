# Fishing System

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

Milestone 04.1. Fishing is a **village job**. The player commits a water clue; the village assigns a slime; that slime walks to a **land** shoreline access point; the existing timing bar remains the hook phase. Simulation owns species, aquatic activity, water bodies, access points, opportunities, the fishing session, collection, and `fishInventory`. Phaser and React only present clues, the shore bobber, and HUD. The village sim keeps running. Caught fish never enter `resources.food`.

## Player loop

See clue → click it (Fish tool, generous `clueHitRadiusPx`) → village assigns a slime → slime A* to a shore **land** tile → wait / bite → player hooks → catch belongs to that slime.

HUD never shows the species name before the catch. Debug/F3 may show species id.

## Universal attributes

Every slime has `technique`, `strength`, `instinct`, and `luck` clamped **1–5**, stored on spawn data (`SLIME_SPAWNS` / `createSlimeState`), not inside `FishingSystem`. Temporary values: Pingo 4/2/5/3, Momo 4/2/4/3, Tito 3/5/2/2. Productive fishing requires the `fishing` capability (Pingo among the current three). Attributes still modify fishing **after** that eligibility check. See [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md).

Shared helper: `getAttributeContribution(attrs, JOB_ATTRIBUTE_WEIGHTS.fishing)`. Farming and gathering weights exist as stubs and are **not** applied this milestone.

| Stat | V1 effect |
| --- | --- |
| Technique | Wider target zone: `base * (1 + 0.06 * (technique - 1))` |
| Strength | Slower marker vs high `strengthDemand`: `period * (1 + 0.07 * max(0, strength - demand))` |
| Instinct | Longer clue-on pulses from **max Instinct among idle-available slimes** (no species name) |
| Luck | Seeded roll: `luck/5 * 0.15` chance of `+0.12` zone width |

Species `FishingChallengeProfile`: Darter 2/1/2, Carp 3/3/2, Glimmer 4/2/5.

## WaterBody and access points

Derived at `GameState` construct from orthogonal flood-fill of logical `TileType.WATER` (`src/simulation/waterBodies.ts`). Multiple disconnected regions and map-edge water are supported. Type is a label only (`pond` if small, else `lake` on the current map). Shallow/deep still comes from `collectWaterCells` (`interior` = deep). Each `AquaticActivity` carries `waterBodyId`.

A **FishingAccessPoint** is not a building: walkable land, no blocking object, cardinal-adjacent water, reachable by `findPath` from storage. Destination is always `landTile`. `castDirection` faces the water. `reachableDepths` are water cells of that body within `castRadiusPx` of the water tile, so a shore point can reach deep Moon Glimmer without a hardcoded lake. Rivers 1–3 tiles wide get points on both banks. **One slime per access point** (including shared land tiles).

`FishingModifierSource` is a stub only. A future pier may modify a body or radius; it must **not** create the water body.

## Opportunity and job

Player click hits an activity within `clueHitRadiusPx` (~48px), not a mouse bobber and not pixel-perfect clue art. `commitFishingOpportunity`:

1. Create `FishingOpportunity` (`speciesId` debug-only)
2. Pause activity expiry while reserved / assigned / traveling / fishing (uncommitted activities still expire)
3. Filter by `fishing` capability, then pick best idle-available eligible slime × access point (`jobAffinity + attribute contribution + species match − distance`)
4. Reserve activity + access point; create `fish_activity` (`workTile` = land tile); start `moving_to_fishing` immediately

If no reachable point: cancel cleanly, no stuck session. If Pingo is busy, the activity stays active and the player may retry (`Pingo is busy.`). Momo and Tito are not fallback fishers. Empty-cast timeout is no longer a player path.

`NeedsSystem` treats `fishing_wait` / `fishing_bite` like haul: **finish the short session** before eating. A starving slime is not assigned when food exists (`isIdleAvailable`).

## Session

Each assigned slime owns its own `FishingSession` (`fishingSessions[]`). Several slimes can walk, wait, and show a shore bobber at once. The player hook bar is **one at a time**: if another session is already `fighting`, a `bite` stays in bite until the bar is free (it does not escape). ESC cancels the player-facing session (fighting, else bite, else wait). A slime left in `fishing_wait` / `fishing_bite` with no live session returns to idle.

Bobber world pos comes from land + `castDirection` toward the activity (existing ripple presets).

FSM: `casting → waiting → bite → fighting` (wall-clock) `→ caught | escaped`. Presentation maps to approach / arrive / cast / wait / bite / hook / pull / success / escape. Bite ignore / timeout → escape, except while queued behind another fight. All catches still require the hook. Rod and line are separate render primitives from the assigned slime to the bobber. Pingo uses dedicated `fish_*` clips plus rod poses, a 1px quantized line (`0x4a5a58`), and bobber / splash / bubble sprites. Momo and Tito still map `fish_*` onto Idle/Hop/Work until their fishing art exists. There is no dedicated north/south rod art; those casts reuse the side-view poses. Catch toast stays text-only (no species reveal sprites).

Gameplay session `caught` / `escaped` still last 400ms. Pingo may keep a short **success leftover** (`fishingCelebrateUntilTick`) so `fish_success` can finish after the session is removed. Ambient will not start during leftover; jobs may still assign.

Catch toast: `PINGO CAUGHT` / `NEW SPECIES!` + species + `Caught by Pingo`. Collection and inventory are unchanged.

## HUD and input

`worldTool`: `off | designate | remove | fish`. The Fish tool **designates an opportunity**. Click or Space during `fighting` only. ESC cancels the player-facing session. Compact HUD shows who is fishing, phase, TECH/STR/INST, and the timing bar (bottom-left, off the default pond view). Luck stays off that panel. F3: ownership, presentation phase, visual anchors (feet, rod, tip, bobber), `[` / `]` rod nudge, ambient debug.

## Out of scope

Pier, equipment, leveling, new species, auto-catch, procedural maps, rods, bait, nets, boats, aquarium, cooking, selling, legendary fish, weather / day / night, ecosystem simulation, fish-as-food consumption, bonuses from `specialEffectId`.
