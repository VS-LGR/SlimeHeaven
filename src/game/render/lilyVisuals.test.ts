import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { inflateSync } from "node:zlib";
import { sequentialClip, SLIME_VISUALS } from "./slimeVisualConfig";
import { SLIME_IDS } from "@/src/simulation/entities/SlimeState";

function pngHeader(publicPath: string): { width: number; height: number; bit: number; color: number } {
  const buf = readFileSync(resolve("public", publicPath.replace(/^\//, "")));
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bit: buf[24],
    color: buf[25],
  };
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) {
    return a;
  }
  if (pb <= pc) {
    return b;
  }
  return c;
}

function decodeRgba(publicPath: string): { width: number; height: number; pixels: Buffer } {
  const buf = readFileSync(resolve("public", publicPath.replace(/^\//, "")));
  let offset = 8;
  const idats: Buffer[] = [];
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IDAT") {
      idats.push(data);
    }
    offset += 12 + length;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const inflated = inflateSync(Buffer.concat(idats));
  const stride = width * 4;
  const pixels = Buffer.alloc(height * stride);
  let src = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[src];
    src += 1;
    const row = inflated.subarray(src, src + stride);
    src += stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= 4 ? pixels[(y - 1) * stride + x - 4] : 0;
      let recon = row[x];
      if (filter === 1) {
        recon = (row[x] + left) & 255;
      } else if (filter === 2) {
        recon = (row[x] + up) & 255;
      } else if (filter === 3) {
        recon = (row[x] + Math.floor((left + up) / 2)) & 255;
      } else if (filter === 4) {
        recon = (row[x] + paeth(left, up, upLeft)) & 255;
      }
      pixels[y * stride + x] = recon;
    }
  }
  return { width, height, pixels };
}

function opaqueBounds(publicPath: string): { minX: number; maxX: number; minY: number; maxY: number } {
  const { width, height, pixels } = decodeRgba(publicPath);
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] === 0) {
        continue;
      }
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, maxX, minY, maxY };
}

describe("Lily clip metadata 05.3B.1", () => {
  const lily = SLIME_VISUALS[SLIME_IDS.LILY];

  it("declares current Idle 6, Hop 10, FlowerGrown 10 as per-clip facts", () => {
    expect(lily.kind).toBe("final");
    if (lily.kind !== "final") {
      return;
    }
    expect(lily.anims.idle.textureKeys).toHaveLength(6);
    expect(lily.anims.hop.textureKeys).toHaveLength(10);
    expect(lily.specialistClips?.flowerGrown.textureKeys).toHaveLength(10);
    expect(lily.anims.work).toBeUndefined();
    expect(lily.frameWidth).toBe(90);
    expect(lily.frameHeight).toBe(69);
    expect(lily.originX).toBe(0.5);
    expect(lily.originY).toBe(1);
  });

  it("resolves contiguous 1..frameCount paths for each Lily body clip", () => {
    if (lily.kind !== "final") {
      return;
    }
    const clips = [lily.anims.idle, lily.anims.hop, lily.specialistClips!.flowerGrown];
    for (const clip of clips) {
      expect(clip.paths).toHaveLength(clip.textureKeys.length);
      clip.paths.forEach((path, index) => {
        expect(path.endsWith(`${index + 1}.png`)).toBe(true);
        expect(readFileSync(resolve("public", path.replace(/^\//, ""))).length).toBeGreaterThan(32);
      });
    }
  });

  it("verifies current Lily body frames are 90x69 8-bit RGBA", () => {
    if (lily.kind !== "final") {
      return;
    }
    for (const clip of [lily.anims.idle, lily.anims.hop, lily.specialistClips!.flowerGrown]) {
      for (const path of clip.paths) {
        const header = pngHeader(path);
        expect(header).toEqual({ width: 90, height: 69, bit: 8, color: 6 });
      }
    }
  });

  it("keeps clip counts independent and accepts a different test count", () => {
    const other = sequentialClip({
      textureKeyPrefix: "test-clip",
      directory: "/tmp",
      fileStem: "Test_",
      frameCount: 3,
      frameRate: 12,
      repeat: -1,
    });
    expect(other.textureKeys).toHaveLength(3);
    expect(other.paths).toEqual(["/tmp/Test_1.png", "/tmp/Test_2.png", "/tmp/Test_3.png"]);
    if (lily.kind === "final") {
      expect(lily.anims.idle.textureKeys.length).not.toBe(lily.anims.hop.textureKeys.length);
    }
  });

  it("does not introduce a global slime or lily frame-count constant", () => {
    const source = readFileSync(resolve("src/game/render/slimeVisualConfig.ts"), "utf8");
    expect(source).not.toMatch(/SLIME_FRAME_COUNT/);
    expect(source).not.toMatch(/LILY_FRAME_COUNT/);
    expect(source).not.toMatch(/SPECIALIST_FRAME_COUNT/);
  });

  it("shares a bottom-center baseline and does not apply per-frame hop offsets", () => {
    if (lily.kind !== "final") {
      return;
    }
    const idleBounds = lily.anims.idle.paths.map(opaqueBounds);
    const hopBounds = lily.anims.hop.paths.map(opaqueBounds);
    const idleMaxY = idleBounds.map((bounds) => bounds.maxY);
    const hopMaxY = hopBounds.map((bounds) => bounds.maxY);
    const hopMinY = hopBounds.map((bounds) => bounds.minY);
    const idleSpread = Math.max(...idleMaxY) - Math.min(...idleMaxY);
    expect(idleSpread).toBeLessThanOrEqual(2);
    expect(Math.abs(hopMaxY[0] - idleMaxY[0])).toBeLessThanOrEqual(2);
    expect(Math.max(...hopMinY) - Math.min(...hopMinY)).toBeGreaterThan(0);
    expect(Math.max(...hopMaxY) - Math.min(...hopMaxY)).toBeGreaterThan(0);
    const source = readFileSync(resolve("src/game/render/slimeVisualConfig.ts"), "utf8");
    expect(source).not.toMatch(/perFrame|frameOffset|offsetY:\s*\[/);
    expect(lily.originX).toBe(0.5);
    expect(lily.originY).toBe(1);
  });

  it("does not register world-flower variation paths on Lily visuals", () => {
    if (lily.kind !== "final") {
      return;
    }
    const paths = [
      ...lily.anims.idle.paths,
      ...lily.anims.hop.paths,
      ...Object.values(lily.specialistClips ?? {}).flatMap((clip) => clip.paths),
    ].join("\n");
    expect(paths).not.toMatch(/Flowers\//);
    expect(paths).not.toMatch(/Lily_Pink_Flower/);
    expect(paths).not.toMatch(/Lily_Yellow_Flower/);
    expect(paths).not.toMatch(/Lily_Silver_Flower/);
    expect(paths).not.toMatch(/Lily_Bright_Pink_Flower/);
  });
});
