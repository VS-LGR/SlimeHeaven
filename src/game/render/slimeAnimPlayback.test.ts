import { describe, expect, it } from "vitest";
import { bodyClipRepeatsForever, nextBodyPlaybackAction } from "./slimeAnimPlayback";

describe("slime body anim playback", () => {
  it("applies immediately when the sprite is idle or already on the requested clip", () => {
    expect(nextBodyPlaybackAction(false, false, false)).toBe("apply");
    expect(nextBodyPlaybackAction(false, false, true)).toBe("apply");
    expect(nextBodyPlaybackAction(true, true, true)).toBe("apply");
  });

  it("holds a one-shot clip until it finishes before switching", () => {
    expect(nextBodyPlaybackAction(true, false, false)).toBe("hold");
  });

  it("closes a looping clip at the end of the current cycle", () => {
    expect(bodyClipRepeatsForever(-1)).toBe(true);
    expect(bodyClipRepeatsForever(0)).toBe(false);
    expect(nextBodyPlaybackAction(true, false, true)).toBe("finish-loop");
  });
});
