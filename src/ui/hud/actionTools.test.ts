import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { HUD_ASSETS } from "./hudAssets";
import {
  ACTION_TOOL_ORDER,
  ACTION_TOOLS,
  cursorIconForWorldTool,
  isActionToolSelected,
  isWorldDesignationTool,
  toggleWorldTool,
} from "./actionTools";

describe("action toolbar catalog 05.4C", () => {
  it("maps Plant, Chop Wood, Mine Stone, Fish, and Build to the authored icons", () => {
    expect(ACTION_TOOL_ORDER).toEqual(["plant", "chop", "mine", "fish", "build"]);
    expect(ACTION_TOOLS.map((tool) => tool.label)).toEqual([
      "Plant",
      "Chop Wood",
      "Mine Stone",
      "Fish",
      "Build",
    ]);
    expect(ACTION_TOOLS.map((tool) => tool.icon)).toEqual([
      HUD_ASSETS.iconPlanting,
      HUD_ASSETS.iconWoodCutting,
      HUD_ASSETS.iconMining,
      HUD_ASSETS.iconFishing,
      HUD_ASSETS.iconBuild,
    ]);
    expect(ACTION_TOOLS.map((tool) => tool.worldTool)).toEqual([
      "designate",
      "gather_wood",
      "gather_stone",
      "fish",
      "build",
    ]);
    expect(ACTION_TOOLS.find((tool) => tool.id === "plant")?.tooltip).toBe("Designate farmland");
  });

  it("keeps a single active tool and toggles off on a second click", () => {
    expect(toggleWorldTool("off", "gather_wood")).toBe("gather_wood");
    expect(toggleWorldTool("gather_wood", "gather_stone")).toBe("gather_stone");
    expect(toggleWorldTool("gather_stone", "gather_stone")).toBe("off");
    expect(toggleWorldTool("designate", "fish")).toBe("fish");
    expect(isActionToolSelected("designate", ACTION_TOOLS[0])).toBe(true);
    expect(isActionToolSelected("remove", ACTION_TOOLS[0])).toBe(true);
    expect(isActionToolSelected("fish", ACTION_TOOLS[0])).toBe(false);
    expect(isWorldDesignationTool("off")).toBe(false);
    expect(isWorldDesignationTool("gather_wood")).toBe(true);
  });

  it("uses the matching cursor icon and never maps Speak or attribute icons", () => {
    expect(cursorIconForWorldTool("off")).toBeNull();
    expect(cursorIconForWorldTool("designate")).toBe(HUD_ASSETS.iconPlanting);
    expect(cursorIconForWorldTool("remove")).toBe(HUD_ASSETS.iconPlanting);
    expect(cursorIconForWorldTool("gather_wood")).toBe(HUD_ASSETS.iconWoodCutting);
    expect(cursorIconForWorldTool("gather_stone")).toBe(HUD_ASSETS.iconMining);
    expect(cursorIconForWorldTool("fish")).toBe(HUD_ASSETS.iconFishing);
    expect(cursorIconForWorldTool("build")).toBe(HUD_ASSETS.iconBuild);
    const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
    const tools = readFileSync("src/ui/hud/actionTools.ts", "utf8");
    expect(toolbar).not.toMatch(/iconSpeak|UI_Icon_Speak|iconTechnique|iconStrength|iconLuck/);
    expect(tools).not.toMatch(/iconSpeak|UI_Icon_Speak/);
    expect(toolbar).not.toMatch(/slime_tito/);
    expect(tools).not.toMatch(/slime_tito/);
  });
});
