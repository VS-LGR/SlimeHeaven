import type { WorldToolMode } from "@/src/store/gameUiStore";
import { HUD_ASSETS } from "./hudAssets";

export type ActionToolId = "plant" | "chop" | "mine" | "fish" | "build";

export type PrimaryWorldTool = Exclude<WorldToolMode, "off" | "remove">;

export interface ActionToolDef {
  id: ActionToolId;
  worldTool: PrimaryWorldTool;
  label: string;
  tooltip: string;
  icon: string;
}

export const ACTION_TOOLS: readonly ActionToolDef[] = [
  {
    id: "plant",
    worldTool: "designate",
    label: "Plant",
    tooltip: "Designate farmland",
    icon: HUD_ASSETS.iconPlanting,
  },
  {
    id: "chop",
    worldTool: "gather_wood",
    label: "Chop Wood",
    tooltip: "Mark a tree to chop",
    icon: HUD_ASSETS.iconWoodCutting,
  },
  {
    id: "mine",
    worldTool: "gather_stone",
    label: "Mine Stone",
    tooltip: "Mark a rock to mine",
    icon: HUD_ASSETS.iconMining,
  },
  {
    id: "fish",
    worldTool: "fish",
    label: "Fish",
    tooltip: "Choose a fishing spot",
    icon: HUD_ASSETS.iconFishing,
  },
  {
    id: "build",
    worldTool: "build",
    label: "Build",
    tooltip: "Place a building",
    icon: HUD_ASSETS.iconBuild,
  },
] as const;

export const ACTION_TOOL_ORDER: readonly ActionToolId[] = ACTION_TOOLS.map((tool) => tool.id);

export function toggleWorldTool(current: WorldToolMode, next: WorldToolMode): WorldToolMode {
  return current === next ? "off" : next;
}

export function isActionToolSelected(tool: WorldToolMode, def: ActionToolDef): boolean {
  if (def.worldTool === "designate") {
    return tool === "designate" || tool === "remove";
  }
  return tool === def.worldTool;
}

export function cursorIconForWorldTool(tool: WorldToolMode): string | null {
  switch (tool) {
    case "designate":
    case "remove":
      return HUD_ASSETS.iconPlanting;
    case "gather_wood":
      return HUD_ASSETS.iconWoodCutting;
    case "gather_stone":
      return HUD_ASSETS.iconMining;
    case "fish":
      return HUD_ASSETS.iconFishing;
    case "build":
      return HUD_ASSETS.iconBuild;
    default:
      return null;
  }
}

export function isWorldDesignationTool(tool: WorldToolMode): boolean {
  return tool !== "off";
}
