import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  HUD_ASSET_FILES,
  HUD_ASSET_SIZES,
  HUD_ASSETS,
  SLIME_CARD_ASSET,
  SLIME_CARD_FILE,
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
  });

  it("does not modify the approved HUD PNGs", () => {
    expect(sha256(HUD_ASSET_FILES.topLeft)).toBe(
      "b939a26f11a85ebeff5ef14d3e13d9edd3bdcce1cea567074500b317d118ebe5",
    );
    expect(sha256(HUD_ASSET_FILES.topRight)).toBe(
      "795ba393e2e2418404db03a5d8a462d86cd20af6bcea9d4fa9a31d506cfff533",
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
  });

  it("records the Slime Card for 05.4B without integrating it", () => {
    expect(SLIME_CARD_ASSET).toBe("/assets/UI/UI_Slime_Card.png");
    expect(pngSize(SLIME_CARD_FILE)).toEqual(HUD_ASSET_SIZES.slimeCard);
    expect(sha256(SLIME_CARD_FILE)).toBe(
      "3b5e34e085090c18057eb619683f0f5faf09ec7cc96a2a2b9799be059defcc3a",
    );
    const hud = readFileSync("src/ui/GameHud.tsx", "utf8");
    expect(hud).not.toMatch(/UI_Slime_Card/);
  });
});
