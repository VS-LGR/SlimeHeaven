# Ambient Behavior

Fora de escopo BPx: cozy web game, no quality / patient / regulatory data.

Milestone 04.2A. Ambient behavior makes the village feel alive. It is **not** a second JobSystem and it **does not** generate resources.

## Productive vs ambient

**Productive:** jobs, farming, gathering, hauling, eating, player-committed fishing.

**Ambient:** wander, observe water, inspect farm/nature, rest, social greet.

Priority:

```
starving + food
> active job / player fishing
> available productive job
> ambient
> idle
```

Ambient is always interruptible. `pickWorker` and `commitFishingOpportunity` call `cancelAmbientBehavior`, release the InterestPoint reservation, and path from the slime's **current** tile.

## InterestPoint

Cached semantic locations (`src/simulation/entities/InterestPoint.ts`), rebuilt from world state (not hardcoded XY):

- FishingAccessPoint land → `water_edge`
- FarmPlot → `farm`
- GrassFlower details → `flower` / `nature`
- Tree / pine → `tree` / `nature`
- Rock → `rock` / `nature`
- Storage → `storage`

Index by tag. Query nearby points (max 10 tiles) with a distance cost. F3 force-behaviors skip that radius so a slime can still be sent across this map. Rebuild on farm designate/remove. Ambient `reservedBy` is separate from fishing `access.reservedBy`.

## Personality

`AmbientInterestProfile` (water / farming / nature / social / exploration / rest) is separate from Technique / Strength / Instinct / Luck **and** from productive capability tags. It only changes **where** and **how often** ambient actions happen, never yields, fish rarity, or job eligibility. Momo may still observe water; she cannot receive `fish_activity`. See [`docs/SLIME_CAPABILITIES.md`](./SLIME_CAPABILITIES.md).

Temporary: Pingo water/exploration/nature; Momo farming/nature/rest; Tito exploration/social/nature, low rest.

## AmbientBehaviorSystem

`src/simulation/systems/AmbientBehaviorSystem.ts`. Data-driven defs in `ambientConfig.ts`. Seeded `state.rng` only.

Idle slimes wait 2–8 seconds (`considerDelayTicks`), sometimes stay idle, then pick a weighted behavior. FSM: `moving_to_ambient` / `ambient`.

`casual_fishing` is **not** implemented (would collide with productive sessions). `observe_water` is the shoreline showcase.

## Procedural-world notes

Do not scan the whole map per slime per tick. Rebuild the point list when world sources change; select by tag + distance. Future larger maps should keep this index rather than a full-grid scan.
