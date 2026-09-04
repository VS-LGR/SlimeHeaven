import { SLIME_IDS, type SlimeId } from "../entities/SlimeState";

/** Catalog/type identity. Distinct from slime instance IDs (`slime_pingo`). */
export const RESIDENT_TYPE_IDS = ["pingo", "momo", "tito"] as const;

export type ResidentTypeId = (typeof RESIDENT_TYPE_IDS)[number];

/**
 * Future occupancy kinds. 05.3A only stores `resident` on starting slimes.
 * `visitor` / `invited_waiting_for_house` / `moving_in` are not assigned yet.
 */
export type ResidencyStatus = "resident" | "visitor" | "invited_waiting_for_house" | "moving_in";

export const RESIDENT_SLIME_ID: Record<ResidentTypeId, SlimeId> = {
  pingo: SLIME_IDS.PINGO,
  momo: SLIME_IDS.MOMO,
  tito: SLIME_IDS.TITO,
};

export function residentTypeIdForSlime(slimeId: string): ResidentTypeId | undefined {
  const entry = (Object.entries(RESIDENT_SLIME_ID) as Array<[ResidentTypeId, SlimeId]>).find(
    ([, id]) => id === slimeId,
  );
  return entry?.[0];
}
