import Phaser from "phaser";
import {
  CAMERA_PAN_SPEED,
  DEFAULT_ZOOM,
  ZOOM_LEVELS,
  type ZoomLevel,
} from "../config";

export class CameraController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private readonly wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  } | undefined;
  private zoomIndex: number;
  private dragLastX = 0;
  private dragLastY = 0;
  private dragging = false;
  private userPanned = false;

  constructor(
    private readonly scene: Phaser.Scene,
    bounds: { width: number; height: number },
  ) {
    this.zoomIndex = ZOOM_LEVELS.indexOf(DEFAULT_ZOOM);

    const camera = scene.cameras.main;
    camera.setBounds(0, 0, bounds.width, bounds.height);
    camera.setZoom(DEFAULT_ZOOM);
    camera.roundPixels = true;
    camera.centerOn(bounds.width / 2, bounds.height / 2);

    scene.input.mouse?.disableContextMenu();

    this.cursors = scene.input.keyboard?.createCursorKeys();
    const keyboard = scene.input.keyboard;
    if (keyboard) {
      this.wasd = {
        up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    scene.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _over: unknown,
        _dx: number,
        dy: number,
      ) => {
        if (dy > 0) {
          this.nudgeZoom(-1);
        } else if (dy < 0) {
          this.nudgeZoom(1);
        }
      },
    );

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        this.dragging = true;
        this.dragLastX = pointer.x;
        this.dragLastY = pointer.y;
      }
    });

    scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.rightButtonDown() && !pointer.middleButtonDown()) {
        this.dragging = false;
      }
    });

    scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.dragging) {
        return;
      }
      const camera = this.scene.cameras.main;
      const zoom = camera.zoom;
      camera.scrollX -= (pointer.x - this.dragLastX) / zoom;
      camera.scrollY -= (pointer.y - this.dragLastY) / zoom;
      this.dragLastX = pointer.x;
      this.dragLastY = pointer.y;
    });
  }

  update(deltaMs: number): void {
    this.userPanned = false;
    const camera = this.scene.cameras.main;
    let dx = 0;
    let dy = 0;

    if (this.cursors?.left.isDown || this.wasd?.left.isDown) {
      dx -= 1;
    }
    if (this.cursors?.right.isDown || this.wasd?.right.isDown) {
      dx += 1;
    }
    if (this.cursors?.up.isDown || this.wasd?.up.isDown) {
      dy -= 1;
    }
    if (this.cursors?.down.isDown || this.wasd?.down.isDown) {
      dy += 1;
    }

    if (dx === 0 && dy === 0) {
      return;
    }

    this.userPanned = true;

    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    const step = (CAMERA_PAN_SPEED * deltaMs) / 1000 / camera.zoom;
    camera.scrollX += dx * step;
    camera.scrollY += dy * step;
  }

  followFishingIfNeeded(
    slimeX: number,
    slimeY: number,
    bobberX: number,
    bobberY: number,
    lerp: number,
    marginPx: number,
  ): void {
    if (this.dragging || this.userPanned) {
      return;
    }
    const camera = this.scene.cameras.main;
    const view = camera.worldView;
    const inside = (x: number, y: number): boolean =>
      x >= view.x + marginPx &&
      x <= view.right - marginPx &&
      y >= view.y + marginPx &&
      y <= view.bottom - marginPx;
    if (inside(slimeX, slimeY) && inside(bobberX, bobberY)) {
      return;
    }
    const midX = (slimeX + bobberX) / 2;
    const midY = (slimeY + bobberY) / 2;
    camera.centerOn(
      camera.midPoint.x + (midX - camera.midPoint.x) * lerp,
      camera.midPoint.y + (midY - camera.midPoint.y) * lerp,
    );
  }

  private nudgeZoom(direction: number): void {
    const nextIndex = Phaser.Math.Clamp(
      this.zoomIndex + direction,
      0,
      ZOOM_LEVELS.length - 1,
    );
    if (nextIndex === this.zoomIndex) {
      return;
    }

    const camera = this.scene.cameras.main;
    const center = camera.midPoint.clone();
    this.zoomIndex = nextIndex;
    const zoom = ZOOM_LEVELS[this.zoomIndex] as ZoomLevel;
    camera.setZoom(zoom);
    camera.centerOn(center.x, center.y);
  }
}
