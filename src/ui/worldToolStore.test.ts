import { afterEach, describe, expect, it } from "vitest";
import { useGameUiStore } from "../store/gameUiStore";
import { toggleWorldTool } from "./hud/actionTools";

describe("world tool store 05.4C", () => {
  afterEach(() => {
    useGameUiStore.setState({ worldTool: "off" });
  });
  it("replaces the previous designation tool and can cancel to off", () => {
    useGameUiStore.setState({ worldTool: "off" });
    useGameUiStore.getState().setWorldTool("designate");
    expect(useGameUiStore.getState().worldTool).toBe("designate");
    useGameUiStore.getState().setWorldTool("gather_stone");
    expect(useGameUiStore.getState().worldTool).toBe("gather_stone");
    useGameUiStore.getState().setWorldTool(toggleWorldTool("gather_stone", "gather_stone"));
    expect(useGameUiStore.getState().worldTool).toBe("off");
    useGameUiStore.getState().setWorldTool("gather_wood");
    useGameUiStore.getState().setWorldTool("off");
    expect(useGameUiStore.getState().worldTool).toBe("off");
  });
});
