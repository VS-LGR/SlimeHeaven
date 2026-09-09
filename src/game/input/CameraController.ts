import Phaser from "phaser";
import { CAMERA_PAN_SPEED } from "../config";
import { cameraBoundsForView, computeCoverZoom } from "../viewport";

export class CameraController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private readonly wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  } | undefined;
  private dragLastX = 0;
  private dragLastY = 0;
  private dragging = false;
  private userPanned = false;
  private readonly onResize: () => void;
  private readonly worldWidth: number;
  private readonly worldHeight: number;

  constructor(
    private readonly scene: Phaser.Scene,
    bounds: { width: number; height: number },
  ) {
    this.worldWidth = bounds.width;
    this.worldHeight = bounds.height;
    const camera = scene.cameras.main;
    camera.roundPixels = true;
    this.applyCoverZoom(false);

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
      const dragCamera = this.scene.cameras.main;
      const zoom = dragCamera.zoom;
      dragCamera.scrollX -= (pointer.x - this.dragLastX) / zoom;
      dragCamera.scrollY -= (pointer.y - this.dragLastY) / zoom;
      this.dragLastX = pointer.x;
      this.dragLastY = pointer.y;
    });

    this.onResize = () => this.handleResize();
    scene.scale.on("resize", this.onResize);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.scale.off("resize", this.onResize);
    });
  }

  handleResize(): void {
    this.applyCoverZoom(true);
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

  private applyCoverZoom(preserveCenter: boolean): void {
    const camera = this.scene.cameras.main;
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    if (camera.width !== width || camera.height !== height) {
      camera.setSize(width, height);
    }
    const center = preserveCenter ? { x: camera.midPoint.x, y: camera.midPoint.y } : null;
    camera.setZoom(computeCoverZoom(width, height, this.worldWidth, this.worldHeight));
    const view = visibleView(camera);
    const bounds = cameraBoundsForView(this.worldWidth, this.worldHeight, view.width, view.height);
    camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    if (!center) {
      camera.centerOn(this.worldWidth / 2, this.worldHeight / 2);
    } else {
      camera.centerOn(center.x, center.y);
    }
  }
}

function visibleView(camera: Phaser.Cameras.Scene2D.Camera): { width: number; height: number } {
  return {
    width: camera.width / camera.zoom,
    height: camera.height / camera.zoom,
  };
}
