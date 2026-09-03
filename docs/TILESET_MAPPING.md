# Tileset Mapping — World Art V3

Source of truth for Terrain.png, grass variants, connected terrain, details, and world objects.

Do not assume frame indices without checking this file. Scenes and `villageMap` never hardcode atlas frames.

Fora de escopo BPx: cozy game world art only.

## Source image

| Property | Value |
| --- | --- |
| Runtime filename | `public/assets/tiles/Terrain.png` |
| Texture key | `terrain` |
| Dimensions | 256 × 224 px |
| Color mode | RGBA |
| Authoritative tile size | **32 × 32 px** |
| 32×32 tile grid | 8 columns × 7 rows |
| Frame formula | `row * 8 + col` |

Logical world grid: `TILE_SIZE = 32` in `src/world/constants.ts`. Do not slice this atlas as 16×16. Do not rescale source pixels.

## 32×32 vs large sprites

- **Terrain and details** are 32×32 cells (one logical tile). Farm soil is a separate 32×32 spritesheet. Crop overlays are 32×46, bottom-aligned to the farm tile.
- **World objects** may be larger than one cell:
  - Tree PNG: 64×64, footprint 2×2
  - Pine tree PNG: 32×64, footprint 1×1 (origin bottom-center of the base tile)
  - Bush / rock PNGs: 32×32, footprint 1×1
- Visual size ≠ collision footprint. Object quadrants are never independently placeable.

## Base terrain

Gameplay terrain is only:

| Semantic ID | `TileType` | Walkable | Buildable |
| --- | --- | --- | --- |
| `grass` | `GRASS` | yes | yes |
| `high_grass` | `HIGH_GRASS` | yes | yes |
| `sandy_soil` | `SANDY_SOIL` | yes | yes |
| `water` | `WATER` | no | no |

Removed as gameplay terrain: `STONE`, `SOIL`, `SAND`, `FARM_SOIL`, `FARM_SOIL_WET`. Stone gathering uses `ROCK` objects. Farm plots stay `grass` plus a farming overlay.

## Row 0 static cells

| Cell | Frame | Role |
| --- | --- | --- |
| (0, 0) | 0 | leftover atlas cell (farm soil is a separate sheet) |
| (1, 0) | 1 | `grass` plain |
| (2, 0) | 2 | grass variant flowers |
| (3, 0) | 3 | grass variant stones |
| (4, 0) | 4 | grass variant pebbles (atlas cluster — not `SmallRock.png`) |
| (5, 0) | 5 | legacy solid water fill (not used for lakes) |
| (6, 0) | 6 | grass variant dirt |
| (7, 0) | 7 | grass variant natural |
| (0, 1) | 8 | leftover atlas cell (crop stages are separate 32×46 overlays) |
| (1, 1) | 9 | unused |
| (0–1, 2–3) | 16, 17, 24, 25 | unused |
| (0–7, 4) | 32–39 | empty row (do not sample for lakes) |

## Grass variations

Used only when terrain is `grass`. Walk/build stay the same.

| `GrassVariant` | Frame |
| --- | --- |
| `plain` | 1 |
| `flowers` | 2 |
| `stones` | 3 |
| `pebbles` | 4 |
| `dirt` | 6 |
| `natural` | 7 |

Frames live in `GRASS_VARIANT_FRAMES`.

## Farming

Farming is not terrain. Dry/watered/dead soil comes from `Farm_Soil_Tileset-Sheet.png` (not Terrain.png frames 0 / 8). Crop stages are 32×46 overlays owned by the plot. `FARMING_VISUAL_FRAMES` remains a coarse grid cache (`none` / `tilled` / `planted`) for detail hiding.

| `FarmPlot.state` | Soil sprite | Crop overlay |
| --- | --- | --- |
| designated | none (grass + designation Graphics) | none |
| tilled | dry (default) | none |
| growing | dry | stage from `growthMs / growthTimeMs` (1–6) |
| ready | dry | stage 6 |
| after harvest | dry tilled | none, then auto-replant stage 1 |

`watered` and `dead` frames are registered. The current loop never selects them.

## Connected terrain (4-dir autotile)

`high_grass` and `sandy_soil` use a 4-directional mask `N=1 E=2 S=4 W=8`. A neighbor counts as connected only if it is the same terrain family. Grass, water, other types, and out of bounds are not connected.

Incomplete masks (isolated tile, opposite edges) fall back to center or nearest edge. Resolver: `src/world/connectedTerrain.ts`.

### High grass 3×3 blob — columns 2–4, rows 1–3

| | W | C | E |
| --- | --- | --- | --- |
| N | 10 | 11 | 12 |
| C | 18 | 19 | 20 |
| S | 26 | 27 | 28 |

### Sandy soil 3×3 blob — columns 5–7, rows 1–3

| | W | C | E |
| --- | --- | --- | --- |
| N | 13 | 14 | 15 |
| C | 21 | 22 | 23 |
| S | 29 | 30 | 31 |

`TallGrass.png` is a **detail**. `high_grass` is **connected terrain**. Do not merge them.

`sandy_soil` is **logical land terrain**. It is not the water shoreline. Shoreline dirt/sand is a render-only overlay chosen by `resolveShoreline`.

## Water center

Logical gameplay terrain is still only `water` (`TileType.WATER`). Walkable = false. Buildable = false. Farming never reads shoreline pixels.

Interior lake cells (no land on N/E/S/W) render a clean water fill. Canonical center: **frame 40** (`WATER_FRAMES.center`). Optional hashed variants: 42, 48, 50.

Do not paint shoreline frames in the middle of large lakes.

| Semantic visual ID | Cell | Frame | Neighbor condition |
| --- | --- | --- | --- |
| `water_center` | (0, 5) canonical | 40 | all 4 cardinals are water, and not exactly one diagonal land |
| `water_center` | (2, 5) | 42 | same, hashed variant |
| `water_center` | (0, 6) | 48 | same, hashed variant |
| `water_center` | (2, 6) | 50 | same, hashed variant |

Resolver: `src/world/autotile/resolveShoreline.ts`. Registry: `src/world/autotile/shorelineDefinitions.ts`.

## Water shorelines

Shoreline graphics are **rendering variants**, not terrain IDs. Map data stays `water`. Grass (or sandy_soil) may sit next to `water`; the resolver draws the brown shore on the water cell.

Neighbor detection: N/E/S/W always. Diagonals (NE/NW/SE/SW) only to pick inner corners. Out of bounds counts as land.

The atlas has dedicated north/south edges and four outer + four inner corners. There is **no native east/west edge art**. East = north edge rotated 90° CW. West = south edge rotated 90° CW. Rotation is 90° only (pixel-perfect, no scale/shader).

| Semantic visual ID | Cell | Frame | Rotation | Neighbor condition |
| --- | --- | --- | --- | --- |
| `shore_north` | (6, 5) | 46 | 0° | land N only |
| `shore_south` | (6, 6) | 54 | 0° | land S only |
| `shore_east` | (6, 5) reused | 46 | 90° CW | land E only |
| `shore_west` | (6, 6) reused | 54 | 90° CW | land W only |
| `shore_outer_corner_nw` | (5, 5) | 45 | 0° | land N+W |
| `shore_outer_corner_ne` | (7, 5) | 47 | 0° | land N+E |
| `shore_outer_corner_sw` | (5, 6) | 53 | 0° | land S+W |
| `shore_outer_corner_se` | (7, 6) | 55 | 0° | land S+E |
| `shore_inner_corner_se` | (1, 5) | 41 | 0° | all cardinals water, land SE only |
| `shore_inner_corner_sw` | (4, 5) | 44 | 0° | all cardinals water, land SW only |
| `shore_inner_corner_ne` | (3, 6) | 51 | 0° | all cardinals water, land NE only |
| `shore_inner_corner_nw` | (4, 6) | 52 | 0° | all cardinals water, land NW only |

Caps (three land sides) use the remaining open edge: only N water → `shore_south`, only E water → `shore_west`, etc.

Opposite land edges (N+S or E+W) and isolated tiles fall back to `water_center`. Fallback is deterministic.

## Water special pieces

Inspected on Terrain.png rows 5–6. Row 4 is empty. Only register what exists:

| Cell | Frame | Role |
| --- | --- | --- |
| (5, 0) | 5 | Legacy solid fill from World Art V3. Not used for connected lakes. |
| (3, 5) | 43 | Duplicate of inner SE (41). Not registered. |
| (1, 6) | 49 | Duplicate of outer SE (55). Not registered. |

Not present in this atlas (do not invent IDs):

- isolated pond ring / single-tile shoreline set
- island / land-in-water ring
- dedicated east/west edge tiles
- extra end-cap pieces beyond the 3-side fallback above

Water VFX (surface, ripples, fish shadows, shallow→deep) still uses the **logical** `water` mask, not blue pixels. Ambient spawn points inset ~7px from land edges on shoreline cells.

Deep water is only applied when **all 8 neighbors** are water. Inner-corner shoreline tiles (4 cardinals water, one land diagonal) stay shallow so the corner art is not painted over.

## Details

Independent PNGs under `public/assets/world/details/`. Never blocking. Loaded as whole images, not atlas crops.

| `DetailType` | File | Size |
| --- | --- | --- |
| `grass_flower` | `GrassFlower.png` | 32×32 |
| `single_grass` | `SingleGrass.png` | 32×32 |
| `tall_grass_detail` | `TallGrass.png` | 32×32 |
| `small_rock` | `SmallRock.png` | 32×32 |
| `grass_fruit` | `GrassFruit.png` | 32×32 |

## World objects

Independent PNGs under `public/assets/world/objects/`. Loaded as whole textures. Occupied footprint cells are not walkable and not buildable.

| `ObjectType` | File | Visual | Origin | Footprint |
| --- | --- | --- | --- | --- |
| `tree` | `Tree.png` | 64×64 | (0, 0) top-left | **2×2** |
| `pine_tree` | `PineTree.png` | 32×64 | (0.5, 1) base tile bottom-center | **1×1** |
| `bush` | `Bush.png` | 32×32 | (0, 0) | **1×1** |
| `rock` | `Rock.png` | 32×32 | (0, 0) | **1×1** |

Wood nodes scan `tree` only (not pine). Stone nodes scan `rock`. Rock work tile is an adjacent walkable cell.

Phaser 3.90 `addTilesetImage` uses `firstgid = 0` by default. Frame numbers in defs are spritesheet indices, not Tiled-style 1-based GIDs.
