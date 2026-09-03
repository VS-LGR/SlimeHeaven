# Implementation Status

Fora de escopo BPx: cozy web game prototype with no quality, patient, or regulatory data.

## Milestone 01 — World Prototype

**Closed.** 32×32 grid, terrain / details / world objects, camera, tile selection, F3, pixel-art render. See git history and `docs/TECHNICAL_DESIGN.md`.

## Milestone 02 — Village Alive

**Closed after validation.**

### Completed

- Simulation tick at 4 Hz (`src/simulation/Simulation.ts`); Phaser does not own gameplay time
- Three slimes: Pingo, Momo, Tito (`slime_pingo` / `slime_momo` / `slime_tito`)
- FSM: idle → moving_to_task → working → carrying_to_storage → delivering → idle
- Placeholder 32×32 slimes (blue / green / orange), bottom-center anchor, separate ground shadow
- Hop locomotion with interpolated ground motion, visual arc, subtle squash/stretch
- 4-directional A* using walkable terrain and tree footprints
- JobSystem: gather wood (trees) and gather stone (stone tiles); auto-assign first idle slime
- Carry visual; stock increases only at storage tile (10, 8)
- Idle micro-motion and occasional 1-tile wander with staggered timing
- Click a slime for a name/state/task/position panel
- F3: sim TPS, slime count, tasks, wood/stone, gather/clear/reset/add-resource buttons, path overlay
- Tests: `npm test` (A*, assignment, delivery, unreachable cancel, village wood loop)
- Code health: `tsc`, `eslint`, `vitest`, `next build` passed
- Browser: three slimes idle, 3 parallel tasks, wood 4 + stone 2 after delivery, tile selection and camera still work

### In Progress

- None

### Not Started (intentionally out of scope)

- Weather, day/night, Harmony
- Energy, happiness, professions, personality
- Building placement, construction, final storage art
- Save/load, audio, combat, tutorial
- Crowd avoidance, diagonal movement, canopy-split trees

### Known Issues

- Carry / storage art is still placeholder
- Tree is a single 64×64 sprite; canopy occlusion is not split
- Slimes may overlap on the same tile

### Technical Decisions

- Simulation owns slimes, tasks, and resources. Phaser sprites are created in `SlimeRenderer` only
- Hop duration / height / work time / wander delay live in `src/simulation/constants.ts`
- Visual hop offset is renderer-only; logical position is tile + hop from/to
- `Grid.isWalkable` added as the shared walkable query (needed for A* and wander)
- Vitest for deterministic simulation tests; no Phaser in tests

## Milestone 03 — Farming & Needs

**Closed after implementation.** Player designates grass as farmland; slimes autonomously till, plant `forest_carrot`, grow on the simulation clock, harvest, and deliver food to storage. Satiety/hunger + eating at storage. See `docs/FARMING_AND_NEEDS.md`.

### Completed

- Food resource on `ResourceStock`; stock still increases only in `deliver()`
- `NeedsSystem`: satiety decay, derived hunger states, eat FSM (`moving_to_food` / `eating`), atomic food consume
- `FarmSystem` + `FarmPlot` on `GameState` (not a terrain ID)
- Farm tool click-drag designation / remove; valid/invalid overlays
- Jobs: `till_soil`, `plant_crop`, `harvest_crop`; unique per tile; automatic replant
- JobSystem suitability seam (`jobAffinity`) without a Momo bonus
- HUD: Wood / Stone / Food + farm tool; slime panel satiety/condition; F3 farm/hunger debug
- Tests: `farmLoop.test.ts`, `needsSystem.test.ts`; gather wood/stone still pass

### In Progress

- None

### Not Started (intentionally out of scope)

- Multiple crops, seeds, watering, fertilizer, crop quality/disease
- Sleep, happiness, social, housing, professions, skill levels
- Save/load, cooking, combat, construction

### Known Issues

- Designated and tilled share frame 0; growing and ready share frame 8 (no extra crop-stage art)
- Carry / storage art is still placeholder (food carry is a small placeholder too)
- Tree is a single 64×64 sprite; canopy occlusion is not split
- Slimes may overlap on the same tile

### Technical Decisions

- Simulation owns farms, growth, food, satiety, and job generation. Phaser syncs dirty farm cells and overlays
- Tick order: needs → farms → aquatic → fishing → assign → slimes
- Harvest field work completes before haul so the tile can replant while food is carried
- Authored SW visual farm overlay was cleared; the player designates farmland

Do not start the next milestone until asked.

## World Art V3

**Closed after implementation.** Replaced the 256×64 mixed tileset with `Terrain.png` (now 256×192) plus independent detail/object PNGs. Semantic terrain IDs: `grass`, `high_grass`, `sandy_soil`, `water`. 4-dir autotile for high grass and sandy soil. Water shoreline is visual-only (see Water Shoreline V2). Stone gather nodes come from `ROCK` objects. Farming overlay frames (0 / 8) are now driven by FarmSystem gameplay. See `docs/TILESET_MAPPING.md`.

Do not start the next milestone until asked.

## Water VFX V1

**Closed after implementation.** Visual-only water polish: masked surface scroll, click/ambient/fish ripples, rare fish shadows, shoreline dots, interior/edge depth tint. No fishing, weather, or simulation changes. See `src/game/render/water/`.

## Water VFX V1.1

**Closed after implementation.** Shallow-to-deep water uses a baked pixel dither band along a wobble-shifted seam (4–10px, world-axis offset) instead of a hard tile fill. Ripples, fish shadows, clicks, and gameplay depth are unchanged.

## Water Shoreline V2

**Closed after implementation.** Terrain.png is 256×192 (8×6 of 32×32). Logical terrain stays `water`; shoreline frames are render-only autotiles (`src/world/autotile/`). Interior lake cells use clean water fills. East/west edges reuse north/south art at 90°. Water VFX still masks from logical water. No fishing. See `docs/TILESET_MAPPING.md`.

Do not start the next milestone until asked.

## Milestone 04 — Fishing V1 & Ecosystem Foundation

**Closed after implementation.** Player-only fishing: observe a water clue, cast on that location, short timing capture. Simulation owns species / activity / session / collection / `fishInventory`. Phaser/React present clues, bobber, and HUD. Village sim does not pause. Fish never enter `resources.food`. Ambient fish shadows stay decorative. See [`docs/FISHING_SYSTEM.md`](./FISHING_SYSTEM.md).

### Completed

- Three species: Blue Darter (shallow, bubbles), Pond Carp (both depths, large ripple), Moon Glimmer (deep, cyan glimmer)
- Seeded RNG (`mulberry32`) on `GameState`; activity spawn does not use `Math.random`
- `AquaticActivitySystem` caches shallow/deep water points (same 7px inset as VFX); spawn / expire / pulse / reserve
- `FishingSystem` FSM: land reject, nearby vs empty cast, bite delay, wall-clock fight, success/fail/cancel
- HUD: unified `worldTool` (Farm / Remove Farm / Fish), Collection panel, catch toast, pixel timing bar
- `WaterClueSystem` + `FishingRenderer` reuse `WaterRippleSystem` (`clue_large` / `clue_glimmer`)
- F3: activity/session counts, debug species, spawn/force/auto-catch/reset, optional radius overlay
- Tests: species depth, activity, session, collection, inventory vs food; existing farm/needs/gather/water tests kept

### In Progress

- None

### Not Started (intentionally out of scope)

- Rods, bait, nets, boats, aquarium, cooking, selling
- Slime fishing jobs, legendary, weather / day / night, ecosystem sim
- Fish-as-food consumption, `specialEffectId` bonuses

Do not start the next milestone until asked.

## Milestone 04.1 — Slime Attributes & Fishing Integration

**Closed after implementation.** Fishing is a village job: player commits a clue, a slime walks to shore land, then the V1 timing bar is the hook. Attributes 1–5 live on slime spawn data. Water bodies and access points are derived from terrain (no hardcoded lake). Catches still require the hook and still do not enter `resources.food`. See [`docs/FISHING_SYSTEM.md`](./FISHING_SYSTEM.md).

### Completed

- Universal attributes (Technique / Strength / Instinct / Luck) with shared `getAttributeContribution`; slime panel stars; F3 TECH/STR/INST/LUCK
- Derived `WaterBody` + `FishingAccessPoint` (land destination, both river banks, deep reachable from shore)
- `FishingOpportunity` + `fish_activity`; Fish tool designates; reserved activities pause expiry
- Job scoring: affinity + fishing weights + species challenge − distance; starving+food skipped; Tito can fish
- FSM `moving_to_fishing` / `fishing_wait` / `fishing_bite`; needs finish the session first
- Session owned by slime; shore bobber; Technique/Strength/Instinct/Luck formulas; catch toast names the slime
- Tests for attributes, bodies, access, opportunity, assignment, modifiers, success/fail loops; farm/needs/gather/water stay green

### In Progress

- None

### Not Started (intentionally out of scope)

- Pier, equipment, leveling, new species, auto-catch, procedural maps
- Rods, bait, nets, boats, aquarium, cooking, selling
- Legendary, weather / day / night, ecosystem sim
- Fish-as-food consumption, `specialEffectId` bonuses

### Technical Decisions

- Tick order: needs → farms → aquatic → fishing opportunities → fishing → assign → **ambient** → slimes
- Access points are not buildings; a future pier must not create the water body
- Fighting marker uses `scene.time.now`, not 4 Hz ticks
- Species name is debug-only until catch

## Milestone 04.2A — Living Village & Fishing Presentation Foundation

**Closed after implementation.** Ambient village life + fishing presentation. See `docs/AMBIENT_BEHAVIOR.md`.

### Completed

- Fishing concurrency hardened (one activity / opportunity / access / slime session / hook UI); bite queues behind an active fight
- Presentation phases: approach / arrive / cast / wait / bite / hook / pull / success / escape with Idle/Hop/Work fallbacks (`fish_*` keys)
- Temporary rod + line as separate Graphics from the assigned slime to the bobber
- InterestPoints derived from access / farms / flowers / trees / rocks / storage
- AmbientBehaviorSystem: wander, observe_water, inspect_farm, inspect_nature, rest, social_greet (no casual_fishing)
- Ambient interests (not economic bonuses): Pingo water, Momo farm/nature, Tito movement/social
- Satiety decay 0.14/s (~10 min full → starving); hungry no longer auto-eats; starving+food still interrupts
- Compact fishing HUD (who / phase / TECH STR INST / bar / SUCCESS-FAILURE-PERFECT visual)
- F3 ambient mode, interest overlay, force behaviors, fishing ownership
- Tests: eligibility, interests, personality scores, interrupt, ambient→fishing, reservations, ownership, satiety, long idle

### Not Started (intentionally out of scope)

- Casual fishing, friendship, buildings, wildlife, day/night, procedural maps

## Milestone 04.2B — Pingo Fishing Art Integration

**Closed after implementation.** Presentation-only. Gameplay FSM, assignment, formulas, rarity, and 04.2A ambient are unchanged. Fora de escopo BPx.

### Completed

- Pingo `fish_cast` / `fish_wait` / `fish_bite` / `fish_pull` (push folder, ping-pong) / `fish_success` (8 frames) with origin `0.5, 1` and NEAREST
- Momo/Tito keep Idle/Hop/Work fallbacks; missing Pingo textures fall back + warn once
- Rod pose sprites (Cast / Loose / Fightingt / Pull), pixel-quantized desaturated line, bobber arc, splash / submerge / bubbles
- `castDirection` facing (west `flipX`); north/south reuse side-view rod art
- Success leftover on Pingo only (`fishingCelebrateUntilTick`); ambient blocked, jobs still assignable
- Compact fishing HUD + toast bottom-left (off the pond); modest camera lerp if slime+bobber leave the view
- F3 visual anchors (feet, rod origin/tip, line end, bobber) and `[` / `]` rod nudge
- Presentation tests: resolver, phase map, gear lifecycle; ownership tests still green

### Not Started (intentionally out of scope)

- Momo/Tito fishing art, species catch sprites, fish-reveal arc, Milestone 05
- Casual fishing, friendship, buildings, wildlife, day/night, procedural maps

Do not start Momo/Tito fishing art or Milestone 05 until asked.

## Milestone 04.3 — Slime Roles & Capabilities

**Closed after implementation.** Productive jobs require capability tags. Universal life and ambient personality stay ungated. See [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md).

### Completed

- Open `SlimeCapability` tags + `hasRequiredCapabilities` / `isSlimeEligibleForJob`; AND semantics; empty requirements = universal job
- Identities: Pingo fishing+exploration, Momo farming, Tito gathering+construction
- Job requirements on task type (fishing / farming / gathering); eligibility before suitability scoring
- Fishing: Pingo-only among current slimes; busy Pingo does not fall back to Momo/Tito; activity stays retryable; player toast for busy vs incapable
- Farm pipeline stays one `farming` tag; wood and stone stay one `gathering` tag
- Carry/delivery continuation is not re-filtered; ambient observe_water still allowed without fishing
- Slime panel specialties (text); F3 `CAP:` lines and fishing candidate rejection reasons
- Tests: spawn tags, synthetic `test_special`, fishing/farm/gather eligibility, continuation, ambient water, fishing regression with test-only second fisher

### In Progress

- None

### Not Started (intentionally out of scope)

- Construction / exploration gameplay, new slimes, XP / classes / respec
- Momo/Tito fishing art, Milestone 05

### Technical Decisions

- Tags, not mutually exclusive class objects
- Fishing unavailable uses Option B (fail commit + retry). Farm/gather keep waiting `available` tasks
- Attributes and `jobAffinity` still score only after capability eligibility

Do not start Milestone 05 until asked.

## Milestone 04.4A — Momo farm_till presentation

**Closed after implementation.** Momo `till_soil` uses composed specialist art (body + hoe + dirt). Simulation, plant/harvest, Tito, and fishing stay unchanged. Presentation never owns `completeTill`.

### Completed

- Resolver `getFarmingAnimation`: Momo + `working` + `till_soil` + body art ready → semantic `farm_till`; else generic `work` (warn once if till art missing)
- Body: 7× 83×75 at 8 fps, one swing `repeat: 0`, origin feet row 57/75; fallback to Momo Work
- Hoe: 7 frames, identity map to body Phaser frame; flipX + mirrored offset x; hide when till ends/interrupts
- Dirt: 5-frame one-shot on impact edge (frame index 5); world-quantized, may finish after hoe hides
- F3 farm presentation line + optional green/yellow/orange anchor dots
- Tests: resolver, hoe lifecycle, identity map, flip, impact edge, hunger state-driven cleanup; farm/capability suites unchanged in behavior
- Till stance: `till_soil` `workTile` is a walkable neighbor (east first); last hop lands so the blade hits the plot center; after the swing a same-tile hop walks back to tile feet; plant/harvest still work on the plot; `completeTill` still uses `task.target`
- Designated plots stay grass; tilled overlay applies when the strike finishes (`completeTill` at work end, timed to the dirt puff)

### In Progress

- None

### Not Started (intentionally out of scope)

- watering, Tito tools, designated-vs-tilled overlay redesign, Milestone 05

### Technical Decisions

- Identity hoe map (body and hoe both 7 frames); offsets start at `{ x: 0, y: 0 }` for the shared composition canvas
- One till swing; `WORK_DURATION_MS` (1250) matches impact + dirt so the tile changes when the hit ends
- `SpecialistToolRenderer` is farming-only now, keyed by slime id, ready for Tito axe/pick later
- Use `SLIME_IDS.MOMO`, never `slime.name === "Momo"`

## Milestone 04.4B — Momo farm_plant + farm_harvest presentation

**Closed after implementation.** Momo `plant_crop` and `harvest_crop` use body-only specialist clips. Simulation, till hoe/dirt, plant/harvest `workTile` (on the plot), carry-food, Tito, and fishing stay unchanged. Presentation never owns `completePlant` or `completeHarvest`.

### Completed

- Resolver maps Momo + `working` + task type: `till_soil` → `farm_till`, `plant_crop` → `farm_plant`, `harvest_crop` → `farm_harvest`; missing art → generic `work` (warn once)
- Plant: 5× 83×75 `Farm_PlantN.png`, 8 fps, `repeat: -1`, origin feet row 57/75; pouch and seed baked into body frames (no extra prop)
- Harvest: 12× 83×75 `Farm_harvestN.png`, 8 fps, `repeat: -1`, same origin; crop-agnostic body; tile overlay owns the crop until `completeHarvest`
- Hoe stays till-only; F3 adds `specialist` and `tool: none` for plant/harvest
- Tests: resolver plant/harvest, warn-once fallbacks, hoe inactive, loop vs till one-shot, farm/capability suites unchanged
- Plant and harvest last hop lands on the plot center (feet at geometric center); after plant a same-tile hop walks back to tile feet; harvest carry starts from that pose so nothing teleports

### In Progress

- None

### Not Started (intentionally out of scope)

- crop-specific carry sprites, watering, Tito gathering art, Milestone 05

## Milestone 04.4C — Farm soil, crop stages, terrain art

**Closed after implementation.** Terrain.png is 256×224. Farm soil is a dedicated dry/watered/dead spritesheet. Forest carrot uses six plot-owned 32×46 stages from crop presentation data. Watering, moisture, drought, and crop death are not implemented. Momo specialist clips, carry, fishing, and gathering stay unchanged.

### Completed

- `TILESET_SOURCE_HEIGHT` 224; lake shoreline remapped to rows 5–6 (row 4 is empty)
- `FarmPlot.soilVisual` defaults to `dry`; watered/dead frames load but never auto-select
- Terrain frames 0/8 no longer drawn as farm overlay; `FarmPlotRenderer` owns soil + crop sprites
- Growth stages from `growthMs / growthTimeMs` (ready = stage 6); harvest removes crop; replant starts at stage 1
- Crop origin `(0.5, 1)` at tile bottom; soil at tile top-left; crop depth stays below slimes
- F3: `soilVisual`, `crop` id, `cropStage`, `growthProgress`

### In Progress

- None

### Not Started (intentionally out of scope)

- watering jobs, moisture, drought, crop death, Milestone 05

Do not start Milestone 05 until asked.

## Milestone 04.5A — Tito wood gathering presentation

**Closed after implementation.** Tito `gather_wood` uses composed specialist art (body + axe). Simulation, capabilities, JobSystem, trees, carry, delivery, farming, fishing, and stone gathering stay unchanged. Presentation never owns `finishWork`.

### Completed

- Resolver `getGatheringAnimation`: Tito + `working` + `gather_wood` + body and axe ready → semantic `tito_gather_swing`; missing body or axe → generic `work` (warn once, no incomplete specialist)
- Body: 9× 76×89 at ~14.4 fps, loop `repeat: -1`, origin feet row 77/89; idle stays 39×38 origin `(0.5, 1)`
- Axe: 9 frames, identity map to body Phaser frame; same origin/position/`flipX`; depth `anchor.depth + 0.12`; hide when chop ends/interrupts
- F3 farm presentation line: `specialist: tito_gather_swing / tool: axe / specialistFrame: 1..9 / presentationCycle: 1|2` while chopping
- Tests: gathering resolver, axe lifecycle, identity map, flip, warn-once fallbacks; farm/fish/capability suites unchanged in behavior

### In Progress

- None

### Not Started (intentionally out of scope)

- stone-mining art, durability, particles, tree health, GIF runtime, Milestone 05

### Technical Decisions

- Identity axe map (body and axe both 9 frames); offsets start at `{ x: 0, y: 0 }` for the shared composition canvas
- Two visual axe hits fit inside `WORK_DURATION_MS` (1250) at ~14.4 fps (625 ms/cycle). Hungry uses `WORK_SPEED_HUNGRY` on both the sim timer and `msPerFrame`. Presentation never extends the work deadline.
- `SpecialistToolRenderer` reuses per-`slimeId` gear; hoe hidden while chopping and axe hidden while tilling
- Use `SLIME_IDS.TITO`, never `slime.name === "Tito"`
- Numbered PNGs stay in `Tito/Chop/` and `itens/Axe/`; do not copy into `Gather_Wood/`
- Phaser anim key is `tito_gather_swing` (PNG stem remains `tito_chop`)

## Milestone 04.5A.1 — Tito gathering timing authority

**Closed after implementation.** Gathering simulation again owns `finishWork` at `WORK_DURATION_MS`. `tito_gather_swing` is a reusable body semantic (wood + axe now; stone stays generic).

### Completed

- Removed `GATHER_WOOD_WORK_DURATION_MS` / `workDurationMs` animation gate
- Body clip loops at ~14.4 fps so two 9-frame cycles fit 1250 ms; hungry playback uses `workSpeedMultiplier`
- F3 specialist is `tito_gather_swing`; `presentationCycle` is observational from `workElapsedMs`
- GameHud is client-only (`dynamic`, `ssr: false`) to avoid the ToolButton hydration overlay

### Not Started (intentionally out of scope)

- pickaxe / `gather_stone` specialist clip, Milestone 05

