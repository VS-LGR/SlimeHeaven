import { CROP_STAGE_COUNT, cropById, type CropId } from "@/src/simulation/data/crops";
import type { FarmPlot } from "@/src/simulation/entities/FarmPlot";

function clamp01(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

export function cropGrowthProgress(plot: Pick<FarmPlot, "state" | "growthMs" | "cropId">): number {
  if (plot.state === "ready") {
    return 1;
  }
  if ((plot.state !== "growing" && plot.state !== "planted") || !plot.cropId) {
    return 0;
  }
  const time = cropById(plot.cropId).growthTimeMs;
  if (time <= 0) {
    return 1;
  }
  return clamp01(plot.growthMs / time);
}

/** 0-based index into `visuals.growthFrames` (stage 1 art = 0). */
export function cropStageIndex(progress: number): number {
  const clamped = clamp01(progress);
  return Math.min(CROP_STAGE_COUNT - 1, Math.floor(clamped * CROP_STAGE_COUNT));
}

/** 1-based stage for F3 / docs. */
export function cropStageNumber(progress: number): number {
  return cropStageIndex(progress) + 1;
}

export function plotShowsCrop(plot: Pick<FarmPlot, "state" | "cropId">): boolean {
  return Boolean(plot.cropId) && (plot.state === "planted" || plot.state === "growing" || plot.state === "ready");
}

export function cropGrowthFrameKey(cropId: CropId, stageIndex: number): string | undefined {
  return cropById(cropId).visuals.growthFrames[stageIndex]?.key;
}

export function plotCropTextureKey(plot: Pick<FarmPlot, "state" | "growthMs" | "cropId">): string | undefined {
  if (!plotShowsCrop(plot) || !plot.cropId) {
    return undefined;
  }
  return cropGrowthFrameKey(plot.cropId, cropStageIndex(cropGrowthProgress(plot)));
}

export function plotCropStageNumber(plot: Pick<FarmPlot, "state" | "growthMs" | "cropId">): number | null {
  if (!plotShowsCrop(plot)) {
    return null;
  }
  return cropStageNumber(cropGrowthProgress(plot));
}
