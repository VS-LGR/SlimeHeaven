import type { Task, TaskType } from "./entities/Task";
import { isFarmTask, isFishingTask, isGatherTask } from "./entities/Task";

/** Known productive tags. New tags may be added without rewriting JobSystem. */
export const SLIME_CAPABILITIES = [
  "fishing",
  "farming",
  "gathering",
  "construction",
  "exploration",
] as const;

export type KnownSlimeCapability = (typeof SLIME_CAPABILITIES)[number];

/** Open tag: production uses known values; tests/future slimes may add others. */
export type SlimeCapability = KnownSlimeCapability | (string & {});

const KNOWN_CAPABILITY_SET = new Set<string>(SLIME_CAPABILITIES);

export const CAPABILITY_LABELS: Record<KnownSlimeCapability, string> = {
  fishing: "Fishing",
  farming: "Farming",
  gathering: "Gathering",
  construction: "Construction",
  exploration: "Exploration",
};

export type JobFeedbackReason = "no_capable" | "capable_busy" | "no_access" | "no_activity";

export interface JobFeedback {
  reason: JobFeedbackReason;
  message: string;
}

export interface JobEligibilityLine {
  slimeId: string;
  name: string;
  eligible: boolean;
  debugLine: string;
}

export function uniqueCapabilities(tags: readonly string[] | undefined): SlimeCapability[] {
  if (!tags || tags.length === 0) {
    return [];
  }
  const seen = new Set<string>();
  const out: SlimeCapability[] = [];
  for (const tag of tags) {
    if (!tag || seen.has(tag)) {
      continue;
    }
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

export function hasRequiredCapabilities(
  slime: { capabilities?: readonly string[] },
  required?: readonly string[],
): boolean {
  if (!required || required.length === 0) {
    return true;
  }
  const caps = slime.capabilities ?? [];
  return required.every((cap) => caps.includes(cap));
}

export function requiredCapabilitiesForTask(task: {
  type: TaskType;
  requiredCapabilities?: readonly string[];
}): readonly string[] {
  if (task.requiredCapabilities !== undefined) {
    return task.requiredCapabilities;
  }
  return requiredCapabilitiesForTaskType(task.type);
}

export function requiredCapabilitiesForTaskType(type: TaskType): readonly string[] {
  if (isFishingTask(type)) {
    return ["fishing"];
  }
  if (isFarmTask(type)) {
    return ["farming"];
  }
  if (isGatherTask(type)) {
    return ["gathering"];
  }
  return [];
}

export function isSlimeEligibleForJob(
  slime: { capabilities?: readonly string[] },
  job: { type?: TaskType; requiredCapabilities?: readonly string[] },
): boolean {
  if (job.requiredCapabilities !== undefined) {
    return hasRequiredCapabilities(slime, job.requiredCapabilities);
  }
  if (job.type) {
    return hasRequiredCapabilities(slime, requiredCapabilitiesForTaskType(job.type));
  }
  return true;
}

export function canPerformTaskCapabilities(
  slime: { capabilities?: readonly string[] },
  task: Pick<Task, "type" | "requiredCapabilities">,
): boolean {
  return hasRequiredCapabilities(slime, requiredCapabilitiesForTask(task));
}

export function knownSpecialtyLabels(capabilities: readonly string[] | undefined): string[] {
  const labels: string[] = [];
  for (const tag of uniqueCapabilities(capabilities)) {
    if (KNOWN_CAPABILITY_SET.has(tag)) {
      labels.push(CAPABILITY_LABELS[tag as KnownSlimeCapability]);
    }
  }
  return labels;
}

export function formatCapabilitiesDebug(capabilities: readonly string[] | undefined): string {
  const tags = uniqueCapabilities(capabilities);
  if (tags.length === 0) {
    return "CAP: —";
  }
  return `CAP: ${tags.join(", ")}`;
}

export function explainCapabilityEligibility(
  slime: { id: string; name: string; capabilities?: readonly string[] },
  required: readonly string[] | undefined,
  available: boolean,
  reachable: boolean,
): JobEligibilityLine {
  if (!hasRequiredCapabilities(slime, required)) {
    const missing = (required ?? []).find((cap) => !(slime.capabilities ?? []).includes(cap)) ?? "capability";
    return {
      slimeId: slime.id,
      name: slime.name,
      eligible: false,
      debugLine: `${slime.name}: REJECTED — missing ${missing}`,
    };
  }
  if (!available) {
    return {
      slimeId: slime.id,
      name: slime.name,
      eligible: false,
      debugLine: `${slime.name}: REJECTED — busy`,
    };
  }
  if (!reachable) {
    return {
      slimeId: slime.id,
      name: slime.name,
      eligible: false,
      debugLine: `${slime.name}: REJECTED — unreachable`,
    };
  }
  return {
    slimeId: slime.id,
    name: slime.name,
    eligible: true,
    debugLine: `${slime.name}: ELIGIBLE`,
  };
}

export function playerCapabilityRequiredMessage(capability: string): string {
  const label =
    KNOWN_CAPABILITY_SET.has(capability)
      ? CAPABILITY_LABELS[capability as KnownSlimeCapability]
      : capability;
  return `Requires a slime with ${label}.`;
}

export function playerCapableBusyMessage(slimeNames: readonly string[]): string {
  if (slimeNames.length === 1) {
    return `${slimeNames[0]} is busy.`;
  }
  return "No fishing slime available right now.";
}
