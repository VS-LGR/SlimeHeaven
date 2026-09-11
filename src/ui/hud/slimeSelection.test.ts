import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";
import { useGameUiStore } from "@/src/store/gameUiStore";
import { pickSlimeAtWorldPoint, slimeHitBoxForId, worldToolBlocksSlimeSelection } from "@/src/game/render/slimeHitTest";
import { SLIME_VISUALS } from "@/src/game/render/slimeVisualConfig";

describe("slime selection input 05.4D", () => {
  afterEach(() => {
    useGameUiStore.getState().clearSelectedSlime();
    useGameUiStore.setState({ worldTool: "off" });
  });

  it("gives active world tools precedence over slime selection", () => {
    expect(worldToolBlocksSlimeSelection("off")).toBe(false);
    expect(worldToolBlocksSlimeSelection("designate")).toBe(true);
    expect(worldToolBlocksSlimeSelection("gather_wood")).toBe(true);
    expect(worldToolBlocksSlimeSelection("gather_stone")).toBe(true);
    expect(worldToolBlocksSlimeSelection("fish")).toBe(true);
    expect(worldToolBlocksSlimeSelection("build")).toBe(true);
    expect(worldToolBlocksSlimeSelection("remove")).toBe(true);
    const scene = readFileSync("src/game/scenes/VillageScene.ts", "utf8");
    expect(scene).toMatch(/worldToolBlocksSlimeSelection/);
    expect(scene).toMatch(/sessionOwnsInput/);
  });

  it("picks the front-most overlapping slime by groundY then nearest feet", () => {
    const pingoBox = slimeHitBoxForId(SLIME_IDS.PINGO);
    const lilyBox = slimeHitBoxForId(SLIME_IDS.LILY);
    const lilyVisual = SLIME_VISUALS[SLIME_IDS.LILY];
    expect(lilyVisual.kind).toBe("final");
    if (lilyVisual.kind === "final") {
      expect(lilyBox.halfW).toBeLessThan(lilyVisual.frameWidth / 2);
      expect(lilyBox.hitH).toBeLessThan(lilyVisual.frameHeight + 1);
    }

    const back = {
      id: SLIME_IDS.PINGO,
      groundX: 100,
      groundY: 40,
      halfW: pingoBox.halfW,
      hitH: pingoBox.hitH,
    };
    const front = {
      id: SLIME_IDS.MOMO,
      groundX: 104,
      groundY: 80,
      halfW: slimeHitBoxForId(SLIME_IDS.MOMO).halfW,
      hitH: slimeHitBoxForId(SLIME_IDS.MOMO).hitH,
    };
    expect(pickSlimeAtWorldPoint(102, 70, [back, front])).toBe(SLIME_IDS.MOMO);
    expect(pickSlimeAtWorldPoint(100, 20, [back, front])).toBe(SLIME_IDS.PINGO);
    expect(pickSlimeAtWorldPoint(400, 400, [back, front])).toBeUndefined();
  });

  it("does not let Lily's 90-wide canvas steal a nearby click", () => {
    const lily = {
      id: SLIME_IDS.LILY,
      groundX: 100,
      groundY: 80,
      ...slimeHitBoxForId(SLIME_IDS.LILY),
    };
    const tito = {
      id: SLIME_IDS.TITO,
      groundX: 130,
      groundY: 80,
      ...slimeHitBoxForId(SLIME_IDS.TITO),
    };
    expect(pickSlimeAtWorldPoint(140, 70, [lily, tito])).toBe(SLIME_IDS.TITO);
    expect(pickSlimeAtWorldPoint(100, 70, [lily, tito])).toBe(SLIME_IDS.LILY);
    expect(pickSlimeAtWorldPoint(145, 70, [lily])).toBeUndefined();
  });

  it("replaces and closes selected-slime store state from a single id", () => {
    useGameUiStore.getState().setRuntime({
      selectedSlimeId: SLIME_IDS.PINGO,
      selectedSlime: { id: SLIME_IDS.PINGO, name: "Pingo" } as never,
    });
    useGameUiStore.getState().setRuntime({
      selectedSlimeId: SLIME_IDS.MOMO,
      selectedSlime: { id: SLIME_IDS.MOMO, name: "Momo" } as never,
    });
    expect(useGameUiStore.getState().selectedSlimeId).toBe(SLIME_IDS.MOMO);
    useGameUiStore.getState().clearSelectedSlime();
    expect(useGameUiStore.getState().selectedSlimeId).toBeNull();
    expect(useGameUiStore.getState().selectedSlime).toBeNull();
  });

  it("keeps HUD and card clicks from reaching the Phaser world", () => {
    const card = readFileSync("src/ui/hud/SlimeCard.tsx", "utf8");
    const toolbar = readFileSync("src/ui/hud/ActionToolbar.tsx", "utf8");
    const canvas = readFileSync("src/ui/GameCanvas.tsx", "utf8");
    expect(card).toMatch(/data-hud-interactive/);
    expect(card).toMatch(/onPointerDown=\{stopHudPointer\}/);
    expect(card).toMatch(/data-hud-slime-close/);
    expect(card).toMatch(/pointer-events-auto/);
    expect(card).toMatch(/data-hud-attribute-tooltip/);
    expect(card).toMatch(/data-hud-attribute-label/);
    expect(card).toMatch(/group-hover:opacity-100/);
    expect(toolbar).toMatch(/onPointerDown=\{stopHudPointer\}/);
    expect(canvas).toMatch(/clearSelectedSlime/);
    expect(canvas).toMatch(/Escape/);
  });
});
