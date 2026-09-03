export interface Rng {
  next(): number;
  range(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  pickWeighted<T>(items: ReadonlyArray<{ item: T; weight: number }>): T;
}

/** Deterministic [0, 1) generator. Tests inject a fixed seed. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  if (state === 0) {
    state = 0x9e3779b9;
  }
  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range(min: number, max: number) {
      if (max < min) {
        return min;
      }
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(items) {
      if (items.length === 0) {
        throw new Error("Rng.pick requires at least one item.");
      }
      return items[Math.floor(next() * items.length)];
    },
    pickWeighted(items) {
      const total = items.reduce((sum, entry) => sum + entry.weight, 0);
      if (total <= 0) {
        throw new Error("Rng.pickWeighted requires a positive weight sum.");
      }
      let roll = next() * total;
      for (const entry of items) {
        roll -= entry.weight;
        if (roll <= 0) {
          return entry.item;
        }
      }
      return items[items.length - 1].item;
    },
  };
}

export const PLAY_RNG_SEED = 0x51a7e;
