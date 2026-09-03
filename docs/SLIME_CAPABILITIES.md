# Slime Capabilities

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

Milestone 04.3. Productive work is no longer interchangeable. Capabilities are composable tags, not RPG classes.

## Five distinct concepts

| Concept | Answers | Where |
| --- | --- | --- |
| Universal behavior | Can this slime live in the village? | FSM, needs, hop, eat, rest, wander, greet |
| Productive capability | Can this slime perform this job? | Tag list on the slime + requirements on the job |
| Attributes | How well does it perform jobs it can do? | Technique / Strength / Instinct / Luck |
| Affinity | Which eligible jobs does it prefer? | Optional `jobAffinity` |
| Ambient personality | What does it like to watch? | `AmbientInterestProfile` |

These stay independent. A slime may be interested in water and still be unable to fish.

## Universal behaviors

All normal slimes may idle, hop, eat, rest, wander, greet, react, and run ambient behaviors. There is **no** capability check on those paths.

Carrying and delivery after an eligible job are continuation states. They do not re-run capability filters.

## Productive capabilities

Open tags in `src/simulation/slimeCapabilities.ts`. Known values:

`fishing` · `farming` · `gathering` · `construction` · `exploration`

New tags (for example `"smelting"` or a test `"test_special"`) do not require rewriting JobSystem. `hasRequiredCapabilities` / `isSlimeEligibleForJob` take string lists. ALL listed requirements must be present. A job with no / empty `requiredCapabilities` stays universal.

## Current identities

| Slime | Capabilities | Productive jobs now |
| --- | --- | --- |
| Pingo | fishing, exploration | Fishing. Exploration is metadata only. |
| Momo | farming | Till, plant, harvest (whole farm pipeline). |
| Tito | gathering, construction | Wood and stone. Construction is metadata only. |

A future slime may combine tags, for example `["fishing", "farming"]`. There is no Fisher / Farmer class object.

## Job requirements

Requirements live on the job, not in slime-id conditionals:

- `fish_activity` → `fishing`
- `till_soil` / `plant_crop` / `harvest_crop` → `farming`
- `gather_wood` / `gather_stone` → `gathering`

Eligibility is checked **before** distance, attributes, affinity, or priority.

## Fishing when Pingo is busy

Fishing is player-committed. If Pingo is busy, eating, or starving with food, the commit fails cleanly. The aquatic activity stays active so the player can retry. Momo and Tito are not fallback fishers.

Player toast:

- Capable but busy: `Pingo is busy.`
- No capable slime in the village: `Requires a slime with Fishing.`
- Missed click / no clue: silent

Farm and gather tasks stay `available` until the specialist is free. One fisherman, one farmer, and one gatherer is an accepted bottleneck.

## UI and F3

The slime panel lists known specialties as text (Fishing, Farming, …). Unknown / test tags are hidden from production UI.

F3 shows `CAP: fishing, exploration` and last fishing-candidate lines (`ELIGIBLE` / `REJECTED — missing fishing` / `REJECTED — busy`).

## Out of scope

Construction gameplay, exploration missions, new slimes, XP, classes, respec, Momo/Tito fishing art, Milestone 05.
