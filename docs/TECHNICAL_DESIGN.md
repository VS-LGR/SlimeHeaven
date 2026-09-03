# Technical Design — World Prototype

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

## Architecture

```
React UI
  → Zustand (HUD / debug overlay)
  → GameState (world + simulation)
  → World grid + authored map
  → Phaser rendering / camera / world input
```

Phaser does not own simulation rules (AI, farming, fishing, economy, weather). Farming gameplay lives under `src/simulation/` (`FarmSystem`, `NeedsSystem`). Fishing gameplay lives under `src/simulation/` (`waterBodies`, `FishingOpportunitySystem`, `AquaticActivitySystem`, `FishingSystem`, `slimeAttributes`, `data/fish.ts`). Productive roles use capability tags in `slimeCapabilities.ts` (see [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md)). Ambient village life lives in `AmbientBehaviorSystem` + `InterestPoint` (see [`docs/AMBIENT_BEHAVIOR.md`](./AMBIENT_BEHAVIOR.md)). Overlay frames are a render cache. See [`docs/FARMING_AND_NEEDS.md`](./FARMING_AND_NEEDS.md), [`docs/FISHING_SYSTEM.md`](./FISHING_SYSTEM.md), and [`docs/SLIME_ARCHITECTURE.md`](./SLIME_ARCHITECTURE.md).

## Grid

Authoritative unit, defined once in [`src/world/constants.ts`](../src/world/constants.ts):

```ts
export const TILE_SIZE = 32;
```

Hover / selection:

```ts
gridX = floor(worldX / TILE_SIZE)
gridY = floor(worldY / TILE_SIZE)
```

via `worldToTile`. Do not hardcode `32` at call sites.

Each terrain cell is 32×32 source pixels and one logical cell.

**32×32 vs large sprites:** terrain, farming overlay, and details occupy one 32×32 cell. World objects may be larger PNGs (tree 64×64, pine 32×64) with a separate collision footprint. See [`docs/TILESET_MAPPING.md`](./TILESET_MAPPING.md).

## Map layers

The authored map (`villageMap.ts`) keeps these concepts separate:

1. **Terrain** — `TileType` (`grass`, `high_grass`, `sandy_soil`, `water`). Owns walkable / buildable. `high_grass` and `sandy_soil` autotile from 4-neighbor masks. Water shoreline art is a visual variant on logical `water`, not extra terrain IDs.
2. **Grass variants** — optional skins on `grass` only (plain / flowers / stones / pebbles / dirt / natural).
3. **Farming overlay** — visual cache (`none` | `tilled` | `planted`) written from `FarmPlot` gameplay state. Not a terrain type. Player designates plots; see [`docs/FARMING_AND_NEEDS.md`](./FARMING_AND_NEEDS.md).
4. **Details** — independent 32×32 PNGs. Never change walkable / buildable.
5. **World objects** — `tree`, `pine_tree`, `bush`, `rock`. Rendered as whole-image sprites above ground.

Prototype map: **20 × 15** tiles → **640 × 480** world pixels. TypeScript arrays only. No Tiled, no procedural generation.

Atlas frames are centralized in `TILE_DEFS` / `GRASS_VARIANT_FRAMES` / `FARMING_VISUAL_FRAMES` / `connectedTerrain` / `WATER_FRAMES`. Farm soil and crop stages are separate textures (`farm-soil` spritesheet + crop PNGs). Shoreline selection lives in `src/world/autotile/`. Object and detail PNG paths live in `OBJECT_DEFS` / `DETAIL_DEFS`. Scenes do not duplicate raw sprite indices. Terrain.png is 256×224 (8×7 of 32×32); lake shoreline art is rows 5–6.

Phaser 3.90 `addTilesetImage` uses `firstgid = 0` by default. Frame numbers in those defs are spritesheet indices, not Tiled-style 1-based GIDs.

## Multi-tile world objects

Objects load from `public/assets/world/objects/` (no atlas cropping):

| Object | Visual | Footprint |
| --- | --- | --- |
| Tree | 64×64 | 2×2 |
| Pine tree | 32×64, origin (0.5, 1) | 1×1 |
| Bush | 32×32 | 1×1 |
| Rock | 32×32 | 1×1 |

Visual size ≠ collision footprint. Quadrants are never independently placeable. Stone gathering uses rocks, not a stone terrain tile.

## Rendering

Depth: ground → water VFX (depth / fish shadow / surface / shoreline / clues / ripples, water tiles only) → fishing bobber → farming overlay → ground-detail images → objects → slimes → selection overlay.

Water VFX is visual-only (`src/game/render/water/`) except fishing clues, which are driven by the simulation activity list. Coverage comes from logical `water` cells, not from blue pixels on shoreline art. It does not change walkable/buildable or pathfinding. `WaterRenderer.spawnRipple(worldX, worldY, type)` is shared by ambient VFX, click ripples, and fishing. Visual stack: shoreline tileset → shallow/deep dither → animated surface → clues / ripples / fish shadows / bobber. Shallow water keeps the tileset color; deep water is a baked overlay whose edge follows a wobble-shifted dither band (not the 32px tile edge). Surface highlights scroll as one masked tile sprite across the whole lake. Ambient fish shadows are decorative and are not fishing gameplay.

Selection is a Graphics overlay. It does not tint or replace terrain textures.

Phaser:

- `pixelArt: true`
- `antialias: false`
- `roundPixels: true`
- object textures use `FilterMode.NEAREST`
- CSS `image-rendering: pixelated`
- Internal buffer 480×270, integer canvas scale
- Camera: WASD / arrows, discrete zoom 1 / 2 / 3 / 4, map bounds, right/middle drag pan

Do not rescale the tileset. Do not slice it as 16×16.

## Debug

F3 toggles a React overlay: FPS, camera, zoom, hovered / selected tile, map dimensions, `TILE_SIZE`, food, farm/hunger counts, water VFX, fishing ownership (phase / presentation / assigned / access reservation / hook UI owner), fishing candidate eligibility, slime `CAP:` tags, ambient mode per slime, optional InterestPoint overlay. Always-on HUD shows Wood / Stone / Food, Farm / Remove Farm / Fish tools, Collection, slime specialties + attribute stars, and a compact fishing context panel while a session is live.
