import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ACTION_TOOLBAR_ICON_FILES,
  HUD_ASSET_FILES,
  HUD_ASSET_SIZES,
  HUD_ASSETS,
  SLIME_CARD_ASSET,
  SLIME_CARD_FILE,
  SLIME_CARD_ICON_FILES,
  TOP_RIGHT_COLLAPSE_FRAMES,
  TOP_RIGHT_EXPAND_FRAMES,
  TOP_RIGHT_SEQUENCE_FILES,
} from "./hudAssets";

function pngSize(path: string): { width: number; height: number } {
  const buffer = readFileSync(path);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("HUD assets 05.4A", () => {
  it("points Top Left and Top Right at the approved public files", () => {
    expect(HUD_ASSETS.topLeft).toBe("/assets/UI/UI_Top_Left.png");
    expect(HUD_ASSETS.topRight).toBe("/assets/UI/UI_Top_Right.png");
    expect(HUD_ASSETS.iconWood).toBe("/assets/UI/UI_Icon_Wood.png");
    expect(HUD_ASSETS.iconStone).toBe("/assets/UI/UI_Icon_Rock.png");
    expect(HUD_ASSETS.iconFood).toBe("/assets/UI/UI_Icon_Food.png");
    expect(HUD_ASSETS.iconHarmony).toBe("/assets/UI/UI_Icon_Harmony.png");
    expect(HUD_ASSETS.iconSun).toBe("/assets/UI/UI_Icon_Sun.png");
    expect(HUD_ASSETS.iconConfig).toBe("/assets/UI/UI_Icon_Config.png");
    expect(HUD_ASSETS.iconPlanting).toBe("/assets/UI/UI_Icon_Planting.png");
    expect(HUD_ASSETS.iconWoodCutting).toBe("/assets/UI/UI_Icon_Wood_Cutting.png");
    expect(HUD_ASSETS.iconMining).toBe("/assets/UI/UI_Icon_Mining.png");
    expect(HUD_ASSETS.iconFishing).toBe("/assets/UI/UI_Icon_Fishing.png");
    expect(HUD_ASSETS.iconBuild).toBe("/assets/UI/UI_Icon_Build.png");
    expect(HUD_ASSETS.toolbar).toBe("/assets/UI/UI_Icon_ToolBar.png");
    expect(HUD_ASSETS.toolbarSelected).toBe("/assets/UI/UI_Icon_ToolBar_Selected.png");
  });

  it("records native PNG dimensions without resizing the files", () => {
    expect(pngSize(HUD_ASSET_FILES.topLeft)).toEqual(HUD_ASSET_SIZES.topLeft);
    expect(pngSize(HUD_ASSET_FILES.topRight)).toEqual(HUD_ASSET_SIZES.topRight);
    expect(pngSize(HUD_ASSET_FILES.iconWood)).toEqual(HUD_ASSET_SIZES.icon);
    expect(pngSize(HUD_ASSET_FILES.iconStone)).toEqual(HUD_ASSET_SIZES.icon);
    expect(pngSize(HUD_ASSET_FILES.iconFood)).toEqual(HUD_ASSET_SIZES.icon);
    expect(pngSize(HUD_ASSET_FILES.iconHarmony)).toEqual(HUD_ASSET_SIZES.icon);
    expect(pngSize(HUD_ASSET_FILES.iconSun)).toEqual(HUD_ASSET_SIZES.sun);
    expect(pngSize(HUD_ASSET_FILES.iconConfig)).toEqual(HUD_ASSET_SIZES.icon);
    expect(pngSize(HUD_ASSET_FILES.iconPlanting)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(HUD_ASSET_FILES.iconWoodCutting)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(HUD_ASSET_FILES.iconMining)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(HUD_ASSET_FILES.iconFishing)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(HUD_ASSET_FILES.iconBuild)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(HUD_ASSET_FILES.toolbar)).toEqual(HUD_ASSET_SIZES.toolbar);
    expect(pngSize(HUD_ASSET_FILES.toolbarSelected)).toEqual(HUD_ASSET_SIZES.toolbarSelected);
  });

  it("does not modify the approved HUD PNGs", () => {
    expect(sha256(HUD_ASSET_FILES.topLeft)).toBe(
      "b939a26f11a85ebeff5ef14d3e13d9edd3bdcce1cea567074500b317d118ebe5",
    );
    expect(sha256(HUD_ASSET_FILES.topRight)).toBe(
      "d21426fc32882826fb9c2796eea005a509f4278c5f64e4d39d10b15e87880865",
    );
    expect(sha256(HUD_ASSET_FILES.iconWood)).toBe(
      "7803dfa863f5e1dd89c1c9d5811d44cd6256c1ec692d5f982177e6cd3234c789",
    );
    expect(sha256(HUD_ASSET_FILES.iconStone)).toBe(
      "249efe2f8ac01ff5e6b22036d34b99e438b4a5ce5b2325364b32372bef798569",
    );
    expect(sha256(HUD_ASSET_FILES.iconFood)).toBe(
      "01fe702f38da6f2d4e7d34ce12e6f37702fc43dae5a06cc75be1009f1895ecc2",
    );
    expect(sha256(HUD_ASSET_FILES.iconHarmony)).toBe(
      "4ad9c8108262e2d26e1092bfa1482b493f57cc3afdc1434ff4f8cc609ae9e0a9",
    );
    expect(sha256(HUD_ASSET_FILES.iconSun)).toBe(
      "7981750aec29b8406b80a7a3397ba598bcddbdcc406cb023d9a04e64a4942756",
    );
    expect(sha256(HUD_ASSET_FILES.iconConfig)).toBe(
      "83d69cbb323f794e0b0a3b659ddbcc9d0f52eebe62b1e894ef8aaf7e002cf753",
    );
    expect(sha256(HUD_ASSET_FILES.iconPlanting)).toBe(
      "173c1d4b1597f3a5ff9c7f3f8798f68c9c482471a3d6e5608cf0c1ae2fe6010e",
    );
    expect(sha256(HUD_ASSET_FILES.iconWoodCutting)).toBe(
      "5ae6b007fc68e6071127715a555b4426df38aa7c2b574bc0ef23b61b6a97587c",
    );
    expect(sha256(HUD_ASSET_FILES.iconMining)).toBe(
      "51e03cf773bc4de08956dfa2bf586cd71dbe1ac011af7afc2269fefbe2fa7541",
    );
    expect(sha256(HUD_ASSET_FILES.iconFishing)).toBe(
      "612840156b2e9faac6e3237f68cd32e7a5aa2a5c64f4f669f1fe3eb8b2010f6b",
    );
    expect(sha256(HUD_ASSET_FILES.iconBuild)).toBe(
      "301606f44075a6806c599cd636e3526209abbdf8e85afa0b046d9015a7d5e87c",
    );
    expect(sha256(HUD_ASSET_FILES.toolbar)).toBe(
      "05e28932080c6b27e2fcf8550b5d72369f06749836f898e2255eac6b0e30dbbe",
    );
    expect(sha256(HUD_ASSET_FILES.toolbarSelected)).toBe(
      "dd16bc4a1311c856dcb2337deadb96eae00aed9847bb7b6d3dd1ed09a670422d",
    );
  });

  it("keeps authored 47-frame sequences at native 795×237 without GIF conversion", () => {
    expect(TOP_RIGHT_COLLAPSE_FRAMES).toHaveLength(47);
    expect(TOP_RIGHT_EXPAND_FRAMES).toHaveLength(47);
    for (const path of [...TOP_RIGHT_SEQUENCE_FILES.collapse, ...TOP_RIGHT_SEQUENCE_FILES.expand]) {
      expect(pngSize(path)).toEqual(HUD_ASSET_SIZES.topRightAnimation);
    }
  });

  it("locks the official Slime Card artwork and wires it only to the Slime Card", () => {
    expect(SLIME_CARD_ASSET).toBe("/assets/UI/UI_Slime_Card.png");
    expect(pngSize(SLIME_CARD_FILE)).toEqual(HUD_ASSET_SIZES.slimeCard);
    expect(sha256(SLIME_CARD_FILE)).toBe(
      "77f3dfd270b4c5f1d83098d65acef2b40a072c7412c1c2a34f66628ebf3982e7",
    );
    const card = readFileSync("src/ui/hud/SlimeCard.tsx", "utf8");
    const hud = readFileSync("src/ui/GameHud.tsx", "utf8");
    expect(card).toMatch(/SLIME_CARD_ASSET|UI_Slime_Card/);
    expect(hud).toMatch(/SlimeCard/);
    expect(hud).not.toMatch(/SelectedSlimePanel/);
  });

  it("catalogs Slime Card attribute icons without wiring them to the toolbar", () => {
    expect(pngSize(SLIME_CARD_ICON_FILES.technique)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(SLIME_CARD_ICON_FILES.strength)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(SLIME_CARD_ICON_FILES.instinct)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(SLIME_CARD_ICON_FILES.luck)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(SLIME_CARD_ICON_FILES.speak)).toEqual(HUD_ASSET_SIZES.actionIcon);
    expect(pngSize(SLIME_CARD_ICON_FILES.star)).toEqual(HUD_ASSET_SIZES.star);
    expect(pngSize(SLIME_CARD_ICON_FILES.starEmpty)).toEqual(HUD_ASSET_SIZES.star);
    expect(sha256(SLIME_CARD_ICON_FILES.technique)).toBe(
      "c88a855d2ec094930f59a9593f45d934307a52f39b8883552b3d720c4da4228f",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.strength)).toBe(
      "5440b3ddbfaa54e027bc14babba6a21815598632558908be6b42a3d646dbd1ea",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.instinct)).toBe(
      "95c2b06f3a82ec0afdb0f5e415d741eb29ae90f4ee612d4b32f0a2c761f503a7",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.luck)).toBe(
      "0191b0d29a7f4ad361d5360a9715a73dab75f2f0a8eb548645149b7d33f4156f",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.speak)).toBe(
      "b39fdb0d969029cf88fc711841a286c5a7f4ecf33b49f8945e8c3a8894950533",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.star)).toBe(
      "cc0fe9b45c759b959a70aaeaf2211590185cef4d9fce4d58ea1d58b811486c64",
    );
    expect(sha256(SLIME_CARD_ICON_FILES.starEmpty)).toBe(
      "1d21b3ba2b7dff3078efaebc5b72d5d8eb68f070538e9e03e6f4bf9aeed9ff77",
    );
    const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
    const tools = readFileSync("src/ui/hud/actionTools.ts", "utf8");
    expect(toolbar).not.toMatch(/UI_Icon_Technique|UI_Icon_Strength|UI_Icon_Instintic|UI_Icon_Luck|UI_Icon_Speak/);
    expect(tools).not.toMatch(/UI_Icon_Technique|UI_Icon_Speak/);
    expect(Object.values(ACTION_TOOLBAR_ICON_FILES)).toHaveLength(5);
    expect(pngSize(HUD_ASSET_FILES.toolbar)).toEqual({ width: 626, height: 126 });
  });
});
