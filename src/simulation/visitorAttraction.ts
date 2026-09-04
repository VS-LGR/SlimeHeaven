/**
 * Future visitor appearance contract (05.3A documents this; no scheduler).
 *
 * visitorFinalWeight = baseVisitorWeight × product(applicable village modifiers)
 *
 * Example: inventor baseWeight 1, irrigator multiplier 4 → finalWeight 4.
 * A higher weight increases chance among currently eligible visitors. It never
 * guarantees that visitor. Zero-weight visitors cannot appear.
 *
 * Duplicate copies of one structure type do not stack unless a modifier
 * explicitly says they do. Existing residents and invited/waiting slimes stay
 * excluded regardless of attraction. Random draws must be seedable.
 */
export function visitorFinalWeight(
  baseWeight: number,
  multipliers: readonly number[] = [],
): number {
  if (baseWeight <= 0) {
    return 0;
  }
  return multipliers.reduce((weight, multiplier) => weight * multiplier, baseWeight);
}
