import { SLIME_IDS, type SlimeId } from "../entities/SlimeState";

/** Catalog/type identity. Distinct from slime instance IDs (`slime_pingo`). */
export const RESIDENT_TYPE_IDS = ["pingo", "momo", "tito", "lily"] as const;

export type ResidentTypeId = (typeof RESIDENT_TYPE_IDS)[number];

/**
 * Occupancy kinds. Starting slimes are `resident`. Lily may be `visitor` then
 * `invited_waiting_for_house`. `moving_in` is unused in 05.3B.1.
 */
export type ResidencyStatus = "resident" | "visitor" | "invited_waiting_for_house" | "moving_in";

export const RESIDENT_SLIME_ID: Record<ResidentTypeId, SlimeId> = {
  pingo: SLIME_IDS.PINGO,
  momo: SLIME_IDS.MOMO,
  tito: SLIME_IDS.TITO,
  lily: SLIME_IDS.LILY,
};

export function residentTypeIdForSlime(slimeId: string): ResidentTypeId | undefined {
  const entry = (Object.entries(RESIDENT_SLIME_ID) as Array<[ResidentTypeId, SlimeId]>).find(
    ([, id]) => id === slimeId,
  );
  return entry?.[0];
}

export function isVillageResident(slime: { residencyStatus: ResidencyStatus }): boolean {
  return slime.residencyStatus === "resident";
}

export function isVisitorLifecycle(slime: { residencyStatus: ResidencyStatus }): boolean {
  return slime.residencyStatus === "visitor" || slime.residencyStatus === "invited_waiting_for_house";
}
