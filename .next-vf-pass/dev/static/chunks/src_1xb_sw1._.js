(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/Game.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGame",
    ()=>createGame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$scenes$2f$BootScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/scenes/BootScene.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$scenes$2f$VillageScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/scenes/VillageScene.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$GameState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/GameState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$Simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/Simulation.ts [app-client] (ecmascript)");
;
;
;
;
;
;
function applyIntegerScale(game, parent) {
    const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["integerCanvasScale"])(parent.clientWidth, parent.clientHeight);
    const canvas = game.canvas;
    canvas.style.width = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GAME_WIDTH"] * scale}px`;
    canvas.style.height = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GAME_HEIGHT"] * scale}px`;
    canvas.style.imageRendering = "pixelated";
}
function createGame(parent) {
    const simulation = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$Simulation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Simulation"](new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$GameState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GameState"]());
    const game = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Game({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPhaserConfig"])(parent),
        scene: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$scenes$2f$BootScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BootScene"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$scenes$2f$VillageScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VillageScene"]
        ],
        callbacks: {
            preBoot: (bootGame)=>{
                bootGame.registry.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["REGISTRY_KEYS"].GAME_STATE, simulation.state);
                bootGame.registry.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["REGISTRY_KEYS"].SIMULATION, simulation);
            }
        }
    });
    const resize = ()=>applyIntegerScale(game, parent);
    window.addEventListener("resize", resize);
    game.events.once(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Core.Events.READY, resize);
    game.events.once(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Core.Events.DESTROY, ()=>{
        window.removeEventListener("resize", resize);
    });
    return game;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/config.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAMERA_PAN_SPEED",
    ()=>CAMERA_PAN_SPEED,
    "DEFAULT_ZOOM",
    ()=>DEFAULT_ZOOM,
    "DEPTH",
    ()=>DEPTH,
    "GAME_HEIGHT",
    ()=>GAME_HEIGHT,
    "GAME_WIDTH",
    ()=>GAME_WIDTH,
    "REGISTRY_KEYS",
    ()=>REGISTRY_KEYS,
    "SCENE_KEYS",
    ()=>SCENE_KEYS,
    "TILESET_KEY",
    ()=>TILESET_KEY,
    "TILESET_PATH",
    ()=>TILESET_PATH,
    "TILESET_SOURCE_HEIGHT",
    ()=>TILESET_SOURCE_HEIGHT,
    "TILESET_SOURCE_WIDTH",
    ()=>TILESET_SOURCE_WIDTH,
    "ZOOM_LEVELS",
    ()=>ZOOM_LEVELS,
    "createPhaserConfig",
    ()=>createPhaserConfig,
    "integerCanvasScale",
    ()=>integerCanvasScale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
;
;
;
const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const ZOOM_LEVELS = [
    1,
    2,
    3,
    4
];
const DEFAULT_ZOOM = 2;
const CAMERA_PAN_SPEED = 180;
const TILESET_KEY = "terrain";
const TILESET_PATH = "/assets/tiles/Terrain.png";
const TILESET_SOURCE_WIDTH = 256;
const TILESET_SOURCE_HEIGHT = 192;
const SCENE_KEYS = {
    BOOT: "BootScene",
    VILLAGE: "VillageScene"
};
const DEPTH = {
    GROUND: 0,
    WATER_DEPTH: 0.15,
    WATER_FISH: 0.18,
    WATER_SURFACE: 0.22,
    WATER_SHORE: 0.26,
    WATER_CLUE: 0.3,
    WATER_RIPPLE: 0.32,
    FISHING_BOBBER: 0.4,
    FARMING: 0.5,
    GROUND_DETAIL: 1,
    OBJECTS: 10,
    SELECTION: 1000
};
const REGISTRY_KEYS = {
    GAME_STATE: "gameState",
    SIMULATION: "simulation"
};
function createPhaserConfig(parent) {
    return {
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].AUTO,
        parent,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#1a1f18",
        pixelArt: true,
        antialias: false,
        roundPixels: true,
        banner: false,
        scale: {
            mode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Scale.NONE,
            width: GAME_WIDTH,
            height: GAME_HEIGHT
        },
        render: {
            pixelArt: true,
            antialias: false,
            roundPixels: true,
            powerPreference: "low-power"
        }
    };
}
function integerCanvasScale(parentWidth, parentHeight) {
    return Math.max(1, Math.floor(Math.min(parentWidth / GAME_WIDTH, parentHeight / GAME_HEIGHT)));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/input/CameraController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CameraController",
    ()=>CameraController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
;
;
class CameraController {
    scene;
    cursors;
    wasd;
    zoomIndex;
    dragLastX;
    dragLastY;
    dragging;
    userPanned;
    constructor(scene, bounds){
        this.scene = scene;
        this.dragLastX = 0;
        this.dragLastY = 0;
        this.dragging = false;
        this.userPanned = false;
        this.zoomIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ZOOM_LEVELS"].indexOf(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_ZOOM"]);
        const camera = scene.cameras.main;
        camera.setBounds(0, 0, bounds.width, bounds.height);
        camera.setZoom(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_ZOOM"]);
        camera.roundPixels = true;
        camera.centerOn(bounds.width / 2, bounds.height / 2);
        scene.input.mouse?.disableContextMenu();
        this.cursors = scene.input.keyboard?.createCursorKeys();
        const keyboard = scene.input.keyboard;
        if (keyboard) {
            this.wasd = {
                up: keyboard.addKey(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Input.Keyboard.KeyCodes.W),
                down: keyboard.addKey(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Input.Keyboard.KeyCodes.S),
                left: keyboard.addKey(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Input.Keyboard.KeyCodes.A),
                right: keyboard.addKey(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Input.Keyboard.KeyCodes.D)
            };
        }
        scene.input.on("wheel", (_pointer, _over, _dx, dy)=>{
            if (dy > 0) {
                this.nudgeZoom(-1);
            } else if (dy < 0) {
                this.nudgeZoom(1);
            }
        });
        scene.input.on("pointerdown", (pointer)=>{
            if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
                this.dragging = true;
                this.dragLastX = pointer.x;
                this.dragLastY = pointer.y;
            }
        });
        scene.input.on("pointerup", (pointer)=>{
            if (!pointer.rightButtonDown() && !pointer.middleButtonDown()) {
                this.dragging = false;
            }
        });
        scene.input.on("pointermove", (pointer)=>{
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
    update(deltaMs) {
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
        const step = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CAMERA_PAN_SPEED"] * deltaMs / 1000 / camera.zoom;
        camera.scrollX += dx * step;
        camera.scrollY += dy * step;
    }
    followFishingIfNeeded(slimeX, slimeY, bobberX, bobberY, lerp, marginPx) {
        if (this.dragging || this.userPanned) {
            return;
        }
        const camera = this.scene.cameras.main;
        const view = camera.worldView;
        const inside = (x, y)=>x >= view.x + marginPx && x <= view.right - marginPx && y >= view.y + marginPx && y <= view.bottom - marginPx;
        if (inside(slimeX, slimeY) && inside(bobberX, bobberY)) {
            return;
        }
        const midX = (slimeX + bobberX) / 2;
        const midY = (slimeY + bobberY) / 2;
        camera.centerOn(camera.midPoint.x + (midX - camera.midPoint.x) * lerp, camera.midPoint.y + (midY - camera.midPoint.y) * lerp);
    }
    nudgeZoom(direction) {
        const nextIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Math.Clamp(this.zoomIndex + direction, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ZOOM_LEVELS"].length - 1);
        if (nextIndex === this.zoomIndex) {
            return;
        }
        const camera = this.scene.cameras.main;
        const center = camera.midPoint.clone();
        this.zoomIndex = nextIndex;
        const zoom = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ZOOM_LEVELS"][this.zoomIndex];
        camera.setZoom(zoom);
        camera.centerOn(center.x, center.y);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/input/FarmDesignationController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FarmDesignationController",
    ()=>FarmDesignationController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FarmSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
;
;
;
const VALID_FILL = 0x7ecb6a;
const INVALID_FILL = 0xe07070;
class FarmDesignationController {
    scene;
    simulation;
    overlay;
    dragStart;
    hoverX;
    hoverY;
    constructor(scene, simulation){
        this.scene = scene;
        this.simulation = simulation;
        this.dragStart = null;
        this.hoverX = null;
        this.hoverY = null;
        this.overlay = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION + 2);
        scene.input.on("pointermove", (pointer)=>{
            if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
                return;
            }
            this.onMove(pointer);
        });
        scene.input.on("pointerdown", (pointer)=>{
            if (!pointer.leftButtonDown() || !this.farmMode()) {
                return;
            }
            const tile = this.tileFrom(pointer);
            if (!tile) {
                return;
            }
            this.dragStart = tile;
            this.hoverX = tile.x;
            this.hoverY = tile.y;
            this.redraw();
        });
        scene.input.on("pointerup", (pointer)=>{
            if (!this.farmMode() || !this.dragStart) {
                return;
            }
            const tile = this.tileFrom(pointer) ?? this.dragStart;
            this.commit(this.dragStart.x, this.dragStart.y, tile.x, tile.y);
            this.dragStart = null;
            this.redraw();
        });
    }
    sync() {
        if (!this.farmMode()) {
            this.dragStart = null;
            this.overlay.clear();
            return;
        }
        this.redraw();
    }
    isToolActive() {
        return this.farmMode() !== null;
    }
    farmMode() {
        const tool = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().worldTool;
        if (tool === "designate" || tool === "remove") {
            return tool;
        }
        return null;
    }
    tileFrom(pointer) {
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(pointer.worldX, pointer.worldY);
        if (!this.simulation.state.grid.inBounds(x, y)) {
            return null;
        }
        return {
            x,
            y
        };
    }
    onMove(pointer) {
        if (!this.farmMode()) {
            this.overlay.clear();
            return;
        }
        const tile = this.tileFrom(pointer);
        this.hoverX = tile?.x ?? null;
        this.hoverY = tile?.y ?? null;
        this.redraw();
    }
    commit(ax, ay, bx, by) {
        if (this.farmMode() === "remove") {
            this.simulation.removeFarm(ax, ay, bx, by);
            return;
        }
        this.simulation.designateFarm(ax, ay, bx, by);
    }
    redraw() {
        this.overlay.clear();
        if (!this.farmMode()) {
            return;
        }
        const endX = this.hoverX;
        const endY = this.hoverY;
        if (endX === null || endY === null) {
            return;
        }
        const start = this.dragStart ?? {
            x: endX,
            y: endY
        };
        const x0 = Math.min(start.x, endX);
        const y0 = Math.min(start.y, endY);
        const x1 = Math.max(start.x, endX);
        const y1 = Math.max(start.y, endY);
        const removing = this.farmMode() === "remove";
        for(let y = y0; y <= y1; y += 1){
            for(let x = x0; x <= x1; x += 1){
                const valid = removing ? Boolean(this.simulation.state.farmAt(x, y)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidFarmTerrain"])(this.simulation.state, x, y) && !this.simulation.state.farmAt(x, y);
                this.drawTile(x, y, valid ? VALID_FILL : INVALID_FILL);
            }
        }
    }
    drawTile(tileX, tileY, color) {
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(tileX, tileY);
        this.overlay.fillStyle(color, 0.28);
        this.overlay.fillRect(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
        this.overlay.lineStyle(1, color, 0.9);
        this.overlay.strokeRect(x + 0.5, y + 0.5, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/input/FishingController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FishingController",
    ()=>FishingController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AquaticActivitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const VALID_FILL = 0x6ec8e0;
const INVALID_FILL = 0xe07070;
class FishingController {
    scene;
    simulation;
    overlay;
    hoverWorldX;
    hoverWorldY;
    constructor(scene, simulation){
        this.scene = scene;
        this.simulation = simulation;
        this.hoverWorldX = null;
        this.hoverWorldY = null;
        this.overlay = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION + 2);
        scene.input.on("pointermove", (pointer)=>{
            if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
                return;
            }
            this.onMove(pointer);
        });
        scene.input.on("pointerdown", (pointer)=>{
            if (!pointer.leftButtonDown()) {
                return;
            }
            if (this.simulation.state.fishing.phase === "fighting") {
                this.simulation.resolveFishingStrike(this.scene.time.now);
                return;
            }
            if (!this.isToolActive()) {
                return;
            }
            this.simulation.commitFishing(pointer.worldX, pointer.worldY);
        });
        scene.input.keyboard?.on("keydown-SPACE", (event)=>{
            if (this.simulation.state.fishing.phase !== "fighting") {
                return;
            }
            event.preventDefault();
            this.simulation.resolveFishingStrike(this.scene.time.now);
        });
        scene.input.keyboard?.on("keydown-ESC", ()=>{
            this.simulation.cancelFishing();
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().worldTool === "fish") {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setWorldTool("off");
            }
        });
    }
    sync() {
        if (!this.isToolActive()) {
            this.overlay.clear();
            return;
        }
        this.redraw();
    }
    isToolActive() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().worldTool === "fish";
    }
    ownsPointer() {
        return this.isToolActive() || this.simulation.state.fishing.phase === "fighting";
    }
    onMove(pointer) {
        if (!this.isToolActive()) {
            this.overlay.clear();
            return;
        }
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(pointer.worldX, pointer.worldY);
        if (!this.simulation.state.grid.inBounds(x, y)) {
            this.hoverWorldX = null;
            this.hoverWorldY = null;
            this.overlay.clear();
            return;
        }
        this.hoverWorldX = pointer.worldX;
        this.hoverWorldY = pointer.worldY;
        this.redraw();
    }
    redraw() {
        this.overlay.clear();
        if (!this.isToolActive() || this.hoverWorldX === null || this.hoverWorldY === null) {
            return;
        }
        const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findActivityInRadius"])(this.simulation.state, this.hoverWorldX, this.hoverWorldY, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].clueHitRadiusPx);
        if (activity) {
            this.paintTile(activity.tileX, activity.tileY, VALID_FILL);
            return;
        }
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(this.hoverWorldX, this.hoverWorldY);
        const { x: wx, y: wy } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(x, y);
        const valid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWaterWorld"])(this.simulation.state.grid, wx + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2, wy + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2);
        this.paintTile(x, y, valid ? VALID_FILL : INVALID_FILL);
    }
    paintTile(tileX, tileY, color) {
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(tileX, tileY);
        this.overlay.fillStyle(color, 0.28);
        this.overlay.fillRect(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
        this.overlay.lineStyle(1, color, 0.9);
        this.overlay.strokeRect(x + 0.5, y + 0.5, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/input/SelectionController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SelectionController",
    ()=>SelectionController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
;
;
const HOVER_FILL = 0xffffff;
const SELECT_FILL = 0xfff1a8;
class SelectionController {
    scene;
    grid;
    inspectTile;
    onLeftClick;
    hover;
    selection;
    hoveredX;
    hoveredY;
    selectedX;
    selectedY;
    constructor(scene, grid, inspectTile, onLeftClick){
        this.scene = scene;
        this.grid = grid;
        this.inspectTile = inspectTile;
        this.onLeftClick = onLeftClick;
        this.hoveredX = null;
        this.hoveredY = null;
        this.selectedX = null;
        this.selectedY = null;
        this.hover = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION);
        this.selection = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION + 1);
        scene.input.on("pointermove", (pointer)=>{
            if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
                return;
            }
            this.setHoverFromPointer(pointer);
        });
        scene.input.on("pointerdown", (pointer)=>{
            if (!pointer.leftButtonDown()) {
                return;
            }
            if (this.onLeftClick?.(pointer)) {
                return;
            }
            this.setHoverFromPointer(pointer);
            if (this.hoveredX === null || this.hoveredY === null) {
                return;
            }
            this.selectedX = this.hoveredX;
            this.selectedY = this.hoveredY;
            this.drawSelection();
            this.pushStore();
        });
    }
    refreshInspect() {
        this.pushStore();
    }
    setHoverFromPointer(pointer) {
        const { x: tileX, y: tileY } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(pointer.worldX, pointer.worldY);
        if (!this.grid.inBounds(tileX, tileY)) {
            if (this.hoveredX !== null || this.hoveredY !== null) {
                this.hoveredX = null;
                this.hoveredY = null;
                this.hover.clear();
                this.pushStore();
            }
            return;
        }
        if (tileX === this.hoveredX && tileY === this.hoveredY) {
            return;
        }
        this.hoveredX = tileX;
        this.hoveredY = tileY;
        this.drawHover();
        this.pushStore();
    }
    drawHover() {
        this.hover.clear();
        if (this.hoveredX === null || this.hoveredY === null) {
            return;
        }
        this.drawTileRect(this.hover, this.hoveredX, this.hoveredY, HOVER_FILL, 0.18, 0.55);
    }
    drawSelection() {
        this.selection.clear();
        if (this.selectedX === null || this.selectedY === null) {
            return;
        }
        this.drawTileRect(this.selection, this.selectedX, this.selectedY, SELECT_FILL, 0.22, 0.95);
    }
    drawTileRect(graphics, tileX, tileY, color, fillAlpha, strokeAlpha) {
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(tileX, tileY);
        graphics.fillStyle(color, fillAlpha);
        graphics.fillRect(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
        graphics.lineStyle(1, color, strokeAlpha);
        graphics.strokeRect(x + 0.5, y + 0.5, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1);
    }
    pushStore() {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
            hoveredX: this.hoveredX,
            hoveredY: this.hoveredY,
            selectedX: this.selectedX,
            selectedY: this.selectedY,
            hoveredTile: this.inspectAt(this.hoveredX, this.hoveredY),
            selectedTile: this.inspectAt(this.selectedX, this.selectedY)
        });
    }
    inspectAt(x, y) {
        if (x === null || y === null) {
            return null;
        }
        return this.inspectTile(x, y);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/inspectWorld.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inspectWorldTile",
    ()=>inspectWorldTile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/crops.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FarmSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$resolveShoreline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/autotile/resolveShoreline.ts [app-client] (ecmascript)");
;
;
;
;
;
function inspectWorldTile(grid, state, x, y) {
    const tile = grid.getTile(x, y);
    if (!tile) {
        return null;
    }
    const object = grid.objectAt(x, y);
    const def = object ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][object.type] : undefined;
    const plot = state.farmAt(x, y);
    const farmTask = plot ? state.activeTasks().find((task)=>task.nodeId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmNodeId"])(x, y)) : undefined;
    const crop = plot?.cropId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(plot.cropId) : undefined;
    const water = tile.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER;
    const isWater = (dx, dy)=>grid.getTile(x + dx, y + dy)?.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER;
    const shore = grid.shoreVisualAt(x, y);
    const interior = water && isWater(0, -1) && isWater(1, 0) && isWater(0, 1) && isWater(-1, 0) && isWater(1, -1) && isWater(1, 1) && isWater(-1, 1) && isWater(-1, -1);
    return {
        terrain: tile.terrain,
        grassVariant: tile.grassVariant,
        detail: tile.detail,
        farming: tile.farming,
        farm: Boolean(plot),
        farmState: plot?.state ?? null,
        crop: crop?.name ?? null,
        growthPercent: plot ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmGrowthPercent"])(plot) : null,
        farmTask: farmTask ? farmTask.type.replaceAll("_", " ") : plot ? "None" : null,
        object: object && def ? `${object.type} ${def.footprintWidth}×${def.footprintHeight}${tile.walkable ? "" : " blocking"}` : null,
        walkable: tile.walkable,
        buildable: tile.buildable,
        shoreMask: water ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$resolveShoreline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shoreMaskLabel"])(isWater) : null,
        shoreVisual: shore?.id ?? null,
        waterDepth: water ? interior ? "deep" : "shallow" : null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/SlimeRenderer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlimeRenderer",
    ()=>SlimeRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeView.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$resolveFishingAnim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/resolveFishingAnim.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualLayout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
class SlimeRenderer {
    scene;
    simulation;
    sprites;
    facingById;
    pathGraphics;
    selectGraphics;
    tickAlpha;
    timeMs;
    constructor(scene, simulation){
        this.scene = scene;
        this.simulation = simulation;
        this.sprites = new Map();
        this.facingById = new Map();
        this.tickAlpha = 0;
        this.timeMs = 0;
        const storage = simulation.state.storage;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(storage.x, storage.y);
        scene.add.image(x + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2, y + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TEXTURE_KEY"]).setOrigin(0.5, 1).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].GROUND_DETAIL + 1);
        this.pathGraphics = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION - 2);
        this.selectGraphics = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION - 1);
        for (const slime of Object.values(simulation.state.slimes)){
            this.sprites.set(slime.id, this.createSprites(slime));
        }
    }
    sync(tickAlpha, timeMs) {
        this.tickAlpha = tickAlpha;
        this.timeMs = timeMs;
        const selectedId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().selectedSlimeId;
        for (const slime of Object.values(this.simulation.state.slimes)){
            const sprites = this.sprites.get(slime.id);
            if (!sprites) {
                continue;
            }
            const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSessionForSlime"])(this.simulation.state.fishingSessions, slime.id);
            const view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeView"])(slime, tickAlpha, timeMs, session, this.simulation.state.tickIndex);
            const depth = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS + view.groundY / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
            const facing = this.facingFor(slime, view);
            const shadowStyle = this.shadowStyle(slime.id);
            sprites.shadow.setPosition(view.groundX, this.shadowY(slime, view));
            sprites.shadow.setScale(view.shadowScale * shadowStyle.scale, shadowStyle.scale);
            sprites.shadow.setDepth(depth - 0.2);
            sprites.body.setPosition(view.groundX, view.spriteY);
            sprites.body.setDepth(depth);
            this.applyBodyAnim(slime, sprites.body, view);
            sprites.body.setOrigin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ORIGIN_X"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ORIGIN_Y"]);
            sprites.body.setScale(view.scaleX, view.scaleY);
            sprites.body.setFlipX(facing < 0);
            const carryType = slime.carriedResource?.type;
            if (carryType) {
                sprites.carry.setTexture(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"][carryType]);
                sprites.carry.setPosition(view.groundX + 6 * facing, view.groundY - 22 - view.hopLift);
                sprites.carry.setFlipX(facing < 0);
                sprites.carry.setVisible(true);
                sprites.carry.setDepth(depth + 0.1);
            } else {
                sprites.carry.setVisible(false);
            }
            const showEmote = Boolean(slime.ambientEmote) && this.simulation.state.tickIndex < slime.ambientEmoteUntilTick;
            sprites.emote.setText(slime.ambientEmote ?? "");
            sprites.emote.setVisible(showEmote);
            sprites.emote.setPosition(view.groundX, view.spriteY - 18);
            sprites.emote.setDepth(depth + 0.2);
        }
        this.drawSelection(selectedId);
        this.drawPath(selectedId);
    }
    visualDebug(slime) {
        const view = this.viewFor(slime);
        const sprites = this.sprites.get(slime.id);
        return {
            visual: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usesFinalArt"])(slime.id) ? "FINAL" : "PLACEHOLDER",
            anim: view.anim,
            frame: this.currentFrameIndex(slime, sprites?.body, view)
        };
    }
    hitTest(worldX, worldY) {
        let best;
        for (const slime of Object.values(this.simulation.state.slimes)){
            const view = this.viewFor(slime);
            const dx = worldX - view.groundX;
            const dy = worldY - (view.groundY - 10);
            const dist = dx * dx + dy * dy;
            if (dist > 16 * 16) {
                continue;
            }
            if (!best || dist < best.dist) {
                best = {
                    id: slime.id,
                    dist
                };
            }
        }
        return best?.id;
    }
    facingFor(slime, view) {
        const fishingFacing = this.fishingBodyFacing(slime, view);
        if (fishingFacing !== undefined) {
            this.facingById.set(slime.id, fishingFacing);
            return fishingFacing;
        }
        const hopping = Boolean(slime.hopTo && slime.hopFrom);
        const fromX = slime.hopFrom?.x ?? slime.tileX;
        const toX = slime.hopTo?.x ?? slime.tileX;
        if (hopping && toX !== fromX) {
            this.facingById.set(slime.id, view.facing);
            return view.facing;
        }
        if (slime.faceTile && slime.faceTile.x !== slime.tileX) {
            this.facingById.set(slime.id, view.facing);
            return view.facing;
        }
        return this.facingById.get(slime.id) ?? view.facing;
    }
    fishingBodyFacing(slime, view) {
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSessionForSlime"])(this.simulation.state.fishingSessions, slime.id);
        if (!session || session.phase === "idle") {
            return undefined;
        }
        const access = this.simulation.state.fishingAccessPoints.find((point)=>point.id === session.accessPointId);
        const activity = this.simulation.state.activities.find((entry)=>entry.id === session.activityId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["layoutFromFishingWorld"])({
            x: session.worldX,
            y: session.worldY
        }, {
            x: view.groundX,
            y: view.groundY
        }, {
            x: slime.tileX,
            y: slime.tileY
        }, access, activity ? {
            x: activity.worldX,
            y: activity.worldY
        } : undefined, this.simulation.state.grid).bodyFacing;
    }
    shadowStyle(id) {
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][id];
        if (visual.kind !== "final") {
            return {
                pad: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLACEHOLDER_SHADOW_OFFSET_Y"],
                scale: 1
            };
        }
        return {
            pad: visual.shadowFeetPadPx,
            scale: visual.shadowScale
        };
    }
    shadowY(slime, view) {
        return view.groundY - this.shadowStyle(slime.id).pad;
    }
    applyBodyAnim(slime, body, view) {
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][slime.id];
        if (visual.kind !== "final") {
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$resolveFishingAnim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usesPingoFishingClip"])(slime.id, view.anim)) {
            const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pingoFishingAnimKey"])(view.anim);
            if (!key) {
                return;
            }
            if (body.anims.currentAnim?.key !== key) {
                body.play(key);
            } else if (!body.anims.isPlaying && body.anims.currentAnim?.repeat === -1) {
                body.play(key);
            }
            return;
        }
        const clip = visual.anims[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playableSlimeAnim"])(view.anim)];
        if (clip.syncToHopT) {
            const frames = clip.textureKeys;
            const idx = Math.min(frames.length - 1, Math.floor(view.hopT * frames.length));
            if (body.anims.isPlaying) {
                body.anims.stop();
            }
            if (body.texture.key !== frames[idx]) {
                body.setTexture(frames[idx]);
            }
            return;
        }
        const animKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeAnimKey"])(slime.id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playableSlimeAnim"])(view.anim));
        if (body.anims.currentAnim?.key !== animKey || !body.anims.isPlaying) {
            body.play({
                key: animKey,
                frameRate: clip.frameRate,
                repeat: clip.repeat
            });
        }
        body.anims.msPerFrame = 1000 / clip.frameRate;
    }
    currentFrameIndex(slime, body, view) {
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][slime.id];
        if (visual.kind !== "final" || !body) {
            return 0;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$resolveFishingAnim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usesPingoFishingClip"])(slime.id, view.anim)) {
            return body.anims.currentFrame?.index ?? 0;
        }
        const clip = visual.anims[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playableSlimeAnim"])(view.anim)];
        if (clip.syncToHopT) {
            return Math.min(clip.textureKeys.length - 1, Math.floor(view.hopT * clip.textureKeys.length));
        }
        return body.anims.currentFrame?.index ?? 0;
    }
    initialBodyTexture(slime) {
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][slime.id];
        if (visual.kind === "final") {
            return visual.anims.idle.textureKeys[0];
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeBodyKey"])(slime.id);
    }
    createSprites(slime) {
        const view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeView"])(slime, 0, 0);
        const shadow = this.scene.add.image(view.groundX, view.groundY - 1, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeShadowKey"])()).setOrigin(0.5, 0.5).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS);
        const body = this.scene.add.sprite(view.groundX, view.spriteY, this.initialBodyTexture(slime)).setOrigin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ORIGIN_X"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ORIGIN_Y"]).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS);
        const carry = this.scene.add.image(view.groundX, view.spriteY, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].wood).setOrigin(0.5, 1).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS);
        const emote = this.scene.add.text(view.groundX, view.spriteY - 18, "", {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#fff8d0",
            stroke: "#1a2430",
            strokeThickness: 3
        }).setOrigin(0.5, 1).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS);
        return {
            shadow,
            body,
            carry,
            emote
        };
    }
    viewFor(slime) {
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSessionForSlime"])(this.simulation.state.fishingSessions, slime.id);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeView"])(slime, this.tickAlpha, this.timeMs, session, this.simulation.state.tickIndex);
    }
    drawSelection(selectedId) {
        this.selectGraphics.clear();
        if (!selectedId) {
            return;
        }
        const slime = this.simulation.state.slimes[selectedId];
        if (!slime) {
            return;
        }
        const view = this.viewFor(slime);
        this.selectGraphics.lineStyle(1, 0xfff1a8, 0.9);
        this.selectGraphics.strokeCircle(view.groundX, view.groundY - 8, 10);
    }
    drawPath(selectedId) {
        this.pathGraphics.clear();
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().debugVisible || !selectedId) {
            return;
        }
        const slime = this.simulation.state.slimes[selectedId];
        if (!slime) {
            return;
        }
        this.fillTile(this.pathGraphics, slime.tileX, slime.tileY, 0x7ec8ff, 0.22);
        if (slime.destination) {
            this.fillTile(this.pathGraphics, slime.destination.x, slime.destination.y, 0xffb347, 0.28);
        }
        for (const step of slime.path){
            this.fillTile(this.pathGraphics, step.x, step.y, 0x9ae6b4, 0.2);
        }
        if (slime.hopTo) {
            this.fillTile(this.pathGraphics, slime.hopTo.x, slime.hopTo.y, 0x9ae6b4, 0.28);
        }
    }
    fillTile(graphics, tileX, tileY, color, alpha) {
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(tileX, tileY);
        graphics.fillStyle(color, alpha);
        graphics.fillRect(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/createPlaceholderTextures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPlaceholderTextures",
    ()=>createPlaceholderTextures
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$FishingRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/FishingRenderer.ts [app-client] (ecmascript)");
;
;
;
;
function canvasContext(scene, key, width, height) {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const texture = scene.textures.createCanvas(key, width, height);
    if (!texture) {
        throw new Error(`Failed to create texture ${key}`);
    }
    const context = texture.getContext();
    context.imageSmoothingEnabled = false;
    return context;
}
function commit(scene, key) {
    const texture = scene.textures.get(key);
    texture.refresh();
    texture.setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
}
function paintSlime(ctx, fill, eye) {
    ctx.clearRect(0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_FRAME_WIDTH"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_FRAME_HEIGHT"]);
    ctx.fillStyle = fill;
    const rows = [
        [
            10,
            11,
            10
        ],
        [
            11,
            9,
            14
        ],
        [
            12,
            8,
            16
        ],
        [
            13,
            7,
            18
        ],
        [
            14,
            6,
            20
        ],
        [
            15,
            6,
            20
        ],
        [
            16,
            6,
            20
        ],
        [
            17,
            6,
            20
        ],
        [
            18,
            6,
            20
        ],
        [
            19,
            6,
            20
        ],
        [
            20,
            6,
            20
        ],
        [
            21,
            6,
            20
        ],
        [
            22,
            7,
            18
        ],
        [
            23,
            7,
            18
        ],
        [
            24,
            8,
            16
        ],
        [
            25,
            8,
            16
        ],
        [
            26,
            9,
            14
        ],
        [
            27,
            10,
            12
        ],
        [
            28,
            11,
            10
        ],
        [
            29,
            12,
            8
        ],
        [
            30,
            13,
            6
        ]
    ];
    for (const [y, x, w] of rows){
        ctx.fillRect(x, y, w, 1);
    }
    ctx.fillStyle = eye;
    ctx.fillRect(11, 17, 2, 2);
    ctx.fillRect(19, 17, 2, 2);
    ctx.fillStyle = "#f4f7fb";
    ctx.fillRect(11, 17, 1, 1);
    ctx.fillRect(19, 17, 1, 1);
}
function paintShadow(ctx) {
    ctx.clearRect(0, 0, 16, 6);
    ctx.fillStyle = "rgba(20, 16, 12, 0.38)";
    ctx.fillRect(3, 2, 10, 2);
    ctx.fillRect(4, 1, 8, 1);
    ctx.fillRect(4, 4, 8, 1);
}
function paintWood(ctx) {
    ctx.clearRect(0, 0, 8, 8);
    ctx.fillStyle = "#6b3f1f";
    ctx.fillRect(1, 3, 6, 3);
    ctx.fillStyle = "#8a5428";
    ctx.fillRect(1, 3, 6, 1);
    ctx.fillStyle = "#4a2a12";
    ctx.fillRect(2, 5, 4, 1);
}
function paintStone(ctx) {
    ctx.clearRect(0, 0, 8, 8);
    ctx.fillStyle = "#8b8f96";
    ctx.fillRect(2, 3, 4, 3);
    ctx.fillRect(1, 4, 6, 2);
    ctx.fillStyle = "#c5c7cc";
    ctx.fillRect(2, 3, 2, 1);
}
function paintFood(ctx) {
    ctx.clearRect(0, 0, 8, 8);
    ctx.fillStyle = "#d9772c";
    ctx.fillRect(3, 2, 2, 5);
    ctx.fillStyle = "#f0a04b";
    ctx.fillRect(3, 2, 2, 2);
    ctx.fillStyle = "#4a7c3a";
    ctx.fillRect(2, 1, 1, 2);
    ctx.fillRect(5, 1, 1, 2);
}
function paintStorage(ctx) {
    ctx.clearRect(0, 0, 16, 16);
    ctx.fillStyle = "#7a4e28";
    ctx.fillRect(3, 6, 10, 8);
    ctx.fillStyle = "#c4a15a";
    ctx.fillRect(3, 6, 10, 2);
    ctx.fillStyle = "#5a3518";
    ctx.fillRect(3, 10, 10, 1);
    ctx.fillRect(7, 8, 2, 4);
}
function paintBobber(ctx) {
    ctx.clearRect(0, 0, 8, 8);
    ctx.fillStyle = "#e8e4dc";
    ctx.fillRect(2, 3, 4, 4);
    ctx.fillStyle = "#c43c3c";
    ctx.fillRect(2, 3, 4, 2);
    ctx.fillStyle = "#3a2a22";
    ctx.fillRect(3, 1, 2, 2);
}
function createPlaceholderTextures(scene) {
    for (const def of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_SPAWNS"]){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usesFinalArt"])(def.id)) {
            continue;
        }
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeBodyKey"])(def.id);
        const ctx = canvasContext(scene, key, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_FRAME_WIDTH"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_FRAME_HEIGHT"]);
        const colors = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_COLORS"][def.id];
        paintSlime(ctx, colors.fill, colors.eye);
        commit(scene, key);
    }
    paintShadow(canvasContext(scene, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeShadowKey"])(), 16, 6));
    commit(scene, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeShadowKey"])());
    paintWood(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].wood, 8, 8));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].wood);
    paintStone(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].stone, 8, 8));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].stone);
    paintFood(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].food, 8, 8));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRY_TEXTURE"].food);
    paintStorage(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TEXTURE_KEY"], 16, 16));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TEXTURE_KEY"]);
    paintBobber(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$FishingRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_BOBBER_KEY"], 8, 8));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$FishingRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_BOBBER_KEY"]);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/FishingRenderer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISHING_BOBBER_KEY",
    ()=>FISHING_BOBBER_KEY,
    "FishingRenderer",
    ()=>FishingRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeView.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualLayout.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
const FISHING_BOBBER_KEY = "fishing-bobber";
class FishingRenderer {
    scene;
    spawnRipple;
    gear;
    overlay;
    line;
    lastPhaseById;
    anchors;
    constructor(scene, spawnRipple){
        this.scene = scene;
        this.spawnRipple = spawnRipple;
        this.gear = new Map();
        this.lastPhaseById = new Map();
        this.anchors = [];
        this.overlay = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].SELECTION + 3);
        this.line = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER + 0.02);
    }
    sync(sessions, activities, slimes, accessPoints, tickAlpha, tickIndex, timeMs, showRadius, showInterestPoints, showVisualDebug, interestPoints, grid) {
        this.drawSessions(sessions, activities, slimes, accessPoints, tickAlpha, tickIndex, timeMs, grid);
        this.emitRipples(sessions);
        this.drawDebugOverlay(sessions, activities, showRadius, showInterestPoints, showVisualDebug, interestPoints);
    }
    visualAnchors() {
        return this.anchors;
    }
    destroy() {
        for (const gear of this.gear.values()){
            destroyGear(gear);
        }
        this.gear.clear();
        this.overlay.destroy();
        this.line.destroy();
    }
    drawSessions(sessions, activities, slimes, accessPoints, tickAlpha, tickIndex, timeMs, grid) {
        this.line.clear();
        this.anchors.length = 0;
        const liveIds = new Set(sessions.filter((session)=>session.phase !== "idle").map((session)=>session.sessionId));
        for (const [id, gear] of this.gear){
            if (!liveIds.has(id)) {
                destroyGear(gear);
                this.gear.delete(id);
            }
        }
        for (const session of sessions){
            if (session.phase === "idle" || !session.assignedSlimeId) {
                continue;
            }
            const slime = slimes[session.assignedSlimeId];
            if (!slime) {
                continue;
            }
            const access = accessPoints.find((point)=>point.id === session.accessPointId);
            const activity = activities.find((entry)=>entry.id === session.activityId);
            const view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeView"])(slime, tickAlpha, timeMs, session, tickIndex);
            const layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["layoutFromFishingWorld"])({
                x: session.worldX,
                y: session.worldY
            }, {
                x: view.groundX,
                y: view.groundY
            }, {
                x: slime.tileX,
                y: slime.tileY
            }, access, activity ? {
                x: activity.worldX,
                y: activity.worldY
            } : undefined, grid);
            const presentation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingPresentationPhase"])(slime, session, tickIndex);
            const visualPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingVisualPhase"])(presentation);
            const visual = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingBobberVisual"])(visualPhase);
            const semantic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSemanticAnim"])(presentation);
            const elapsedMs = clipElapsedMs(session, tickIndex, tickAlpha, timeMs, presentation);
            const frameIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingClipFrame"])(semantic, elapsedMs);
            const pose = visual.rodPose;
            const placement = pose ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingRodPlacement"])(view.groundX, view.groundY, pose, layout.visualSide, semantic, frameIndex, layout.rodNudgeX) : null;
            const rodDepth = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS + slime.tileY + (layout.inFront ? 0.15 : -0.12);
            const gear = this.ensureGear(session.sessionId);
            this.syncRod(gear, pose, placement, rodDepth);
            const bobberPos = this.syncBobbers(gear, session, visual.bobber, placement, layout, tickIndex, tickAlpha);
            this.syncSplash(gear, visualPhase, bobberPos);
            const bubblePos = this.syncBubbles(gear, visual.bubbles, visualPhase, bobberPos);
            const lineEnd = lineEndForPhase(visualPhase, bobberPos, bubblePos, layout.waterTarget);
            this.drawLine(visual.line, placement, lineEnd, rodDepth);
            const lineStart = placement ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineOriginFromRodTip"])({
                x: placement.tipX,
                y: placement.tipY
            }) : {
                x: view.groundX,
                y: view.groundY
            };
            this.anchors.push({
                sessionId: session.sessionId,
                feetX: view.groundX,
                feetY: view.groundY,
                rodOriginX: placement?.handleX ?? view.groundX,
                rodOriginY: placement?.handleY ?? view.groundY,
                rodTipX: placement?.tipX ?? view.groundX,
                rodTipY: placement?.tipY ?? view.groundY,
                lineStartX: lineStart.x,
                lineStartY: lineStart.y,
                lineEndX: lineEnd.x,
                lineEndY: lineEnd.y,
                bobberX: layout.waterTarget.x,
                bobberY: layout.waterTarget.y,
                bubbleX: bubblePos.x,
                bubbleY: bubblePos.y,
                castDirection: access?.castDirection ?? "east",
                visualSide: layout.visualSide,
                waterTargetX: layout.waterTarget.x,
                waterTargetY: layout.waterTarget.y,
                phase: presentation,
                visualPhase,
                animFrame: frameIndex,
                rodPose: pose ?? "none"
            });
            gear.lastPhase = visualPhase;
        }
    }
    ensureGear(sessionId) {
        const existing = this.gear.get(sessionId);
        if (existing) {
            return existing;
        }
        const rod = this.scene.add.image(0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_KEYS"].rodWait).setOrigin(0, 1).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS);
        const castBobber = this.scene.add.image(0, 0, this.castAirTexture()).setOrigin(0.5, 0.5).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER + 0.03);
        const bobber = this.scene.add.sprite(0, 0, this.bobberTexture()).setOrigin(0.5, 0.5).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER);
        const splash = this.scene.add.sprite(0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].splash.keys[0] ?? this.bobberTexture()).setOrigin(0.5, 0.7).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER + 0.04);
        const bubbles = this.scene.add.sprite(0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bubbles.keys[0] ?? this.bobberTexture()).setOrigin(0.5, 1).setVisible(false).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER + 0.05);
        const gear = {
            rod,
            castBobber,
            bobber,
            splash,
            bubbles,
            lastPhase: "",
            lastBobberMode: "",
            landingX: null,
            landingY: null,
            submergeX: null,
            submergeY: null
        };
        this.gear.set(sessionId, gear);
        return gear;
    }
    syncRod(gear, pose, placement, rodDepth) {
        if (!pose || !placement || !this.scene.textures.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROD_POSE"][pose].textureKey)) {
            gear.rod.setVisible(false);
            return;
        }
        const poseDef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROD_POSE"][pose];
        gear.rod.setTexture(poseDef.textureKey);
        gear.rod.setOrigin(placement.originX, placement.originY);
        gear.rod.setPosition(placement.handleX, placement.handleY);
        gear.rod.setFlipX(placement.flipX);
        gear.rod.setDepth(rodDepth);
        gear.rod.setVisible(true);
    }
    syncBobbers(gear, session, mode, placement, layout, tickIndex, tickAlpha) {
        const target = layout.waterTarget;
        if (mode === "cast_air") {
            let pos = target;
            if (placement) {
                const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["castArcProgress"])(session.arriveUntilTick, session.castUntilTick, tickIndex, tickAlpha);
                pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantizedArc"])(placement.tipX, placement.tipY, target.x, target.y, t >= 1 ? 1 : t, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].bobberArcHeightPx);
            }
            gear.landingX = pos.x;
            gear.landingY = pos.y;
            gear.castBobber.setTexture(this.castAirTexture());
            gear.castBobber.setPosition(pos.x, pos.y);
            gear.castBobber.setVisible(true);
            gear.bobber.setVisible(false);
            if (gear.bobber.anims.isPlaying) {
                gear.bobber.anims.stop();
            }
            gear.lastBobberMode = mode;
            return pos;
        }
        gear.castBobber.setVisible(false);
        const landing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["surfaceBobberFromCastEnd"])({
            x: gear.landingX ?? target.x,
            y: gear.landingY ?? target.y
        });
        gear.landingX = landing.x;
        gear.landingY = landing.y;
        if (mode === "hidden") {
            if (gear.bobber.anims.isPlaying) {
                gear.bobber.anims.stop();
            }
            gear.bobber.setVisible(false);
            gear.lastBobberMode = mode;
            return landing;
        }
        gear.bobber.setPosition(landing.x, landing.y);
        gear.bobber.setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FISHING_BOBBER);
        if (mode === "surface") {
            gear.bobber.setVisible(true);
            if (this.scene.anims.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bobberIdle) && gear.bobber.anims.currentAnim?.key !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bobberIdle) {
                gear.bobber.play(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bobberIdle);
            }
        } else if (mode === "submerge") {
            gear.bobber.setVisible(true);
            gear.submergeX = landing.x;
            gear.submergeY = landing.y;
            if (gear.lastBobberMode !== "submerge" && this.scene.anims.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].submerge)) {
                gear.bobber.play(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].submerge);
                gear.bobber.once("animationcomplete", ()=>{
                    gear.bobber.setVisible(false);
                });
            }
        }
        gear.lastBobberMode = mode;
        return landing;
    }
    syncSplash(gear, visualPhase, bobberPos) {
        const justEntered = gear.lastPhase !== visualPhase;
        if (!this.scene.anims.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].splash)) {
            gear.splash.setVisible(false);
            return;
        }
        let play = false;
        let scale = 1;
        if (justEntered && visualPhase === "wait_surface") {
            play = true;
            scale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].landingSplashScale;
        } else if (justEntered && visualPhase === "bite_submerge") {
            play = true;
            scale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].biteSplashScale;
        } else if (justEntered && visualPhase === "success") {
            play = true;
            scale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].successSplashScale;
        } else if (justEntered && visualPhase === "escape") {
            play = true;
            scale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].landingSplashScale;
        }
        if (!play) {
            if (!gear.splash.anims.isPlaying) {
                gear.splash.setVisible(false);
            }
            return;
        }
        gear.splash.setPosition(bobberPos.x, bobberPos.y);
        gear.splash.setScale(scale);
        gear.splash.setVisible(true);
        gear.splash.play(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].splash);
        gear.splash.once("animationcomplete", ()=>{
            gear.splash.setVisible(false);
        });
    }
    syncBubbles(gear, mode, visualPhase, bobberPos) {
        const anchor = {
            x: gear.submergeX ?? gear.landingX ?? bobberPos.x,
            y: gear.submergeY ?? gear.landingY ?? bobberPos.y
        };
        const looping = mode === "loop" || visualPhase === "bite_submerge" && !gear.bobber.visible && gear.lastBobberMode === "submerge";
        if (!looping || !this.scene.anims.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bubbles)) {
            if (gear.bubbles.anims.isPlaying) {
                gear.bubbles.anims.stop();
            }
            gear.bubbles.setVisible(false);
            return anchor;
        }
        if (gear.submergeX === null || gear.submergeY === null) {
            gear.submergeX = anchor.x;
            gear.submergeY = anchor.y;
        }
        const x = gear.submergeX ?? anchor.x;
        const y = gear.submergeY ?? anchor.y;
        gear.bubbles.setPosition(x, y);
        gear.bubbles.setVisible(true);
        if (gear.bubbles.anims.currentAnim?.key !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bubbles || !gear.bubbles.anims.isPlaying) {
            gear.bubbles.play({
                key: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bubbles,
                repeat: -1
            });
        }
        return {
            x,
            y
        };
    }
    drawLine(tension, placement, bobberPos, rodDepth) {
        if (tension === "hidden" || !placement) {
            return;
        }
        this.line.setDepth(rodDepth - 0.05);
        const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineOriginFromRodTip"])({
            x: placement.tipX,
            y: placement.tipY
        });
        const x0 = origin.x;
        const y0 = origin.y;
        const x1 = bobberPos.x;
        const y1 = bobberPos.y;
        this.line.lineStyle(1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].lineColor, 1);
        if (tension === "slack") {
            const midX = Math.floor((x0 + x1) / 2);
            const midY = Math.floor((y0 + y1) / 2 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].lineSlackDropPx);
            this.line.beginPath();
            this.line.moveTo(x0, y0);
            this.line.lineTo(midX, midY);
            this.line.lineTo(x1, y1);
            this.line.strokePath();
            return;
        }
        this.line.lineBetween(x0, y0, x1, y1);
    }
    bobberTexture() {
        if (this.scene.textures.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bobberIdle.keys[0])) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bobberIdle.keys[0];
        }
        return FISHING_BOBBER_KEY;
    }
    castAirTexture() {
        if (this.scene.textures.exists(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_KEYS"].bobberCastAir)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_KEYS"].bobberCastAir;
        }
        return this.bobberTexture();
    }
    emitRipples(sessions) {
        const seen = new Set();
        for (const session of sessions){
            seen.add(session.sessionId);
            const last = this.lastPhaseById.get(session.sessionId);
            if (last === session.phase) {
                continue;
            }
            this.lastPhaseById.set(session.sessionId, session.phase);
            if (session.phase === "bite") {
                this.spawnRipple(session.worldX, session.worldY, "bite");
            }
            if (session.phase === "escaped") {
                this.spawnRipple(session.worldX, session.worldY, "fish");
            }
        }
        for (const id of this.lastPhaseById.keys()){
            if (!seen.has(id)) {
                this.lastPhaseById.delete(id);
            }
        }
    }
    drawDebugOverlay(sessions, activities, showRadius, showInterestPoints, showVisualDebug, interestPoints) {
        this.overlay.clear();
        if (showRadius) {
            const radius = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx;
            for (const activity of activities){
                if (activity.state === "consumed") {
                    continue;
                }
                this.overlay.lineStyle(1, activity.state === "reserved" ? 0xf0c070 : 0x7adcf2, 0.8);
                this.overlay.strokeCircle(activity.worldX, activity.worldY, radius);
                this.overlay.fillStyle(0x7adcf2, 0.35);
                this.overlay.fillRect(Math.floor(activity.worldX), Math.floor(activity.worldY), 1, 1);
            }
            for (const session of sessions){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLiveFishingPhase"])(session.phase)) {
                    continue;
                }
                this.overlay.lineStyle(1, 0xe8fbff, 0.55);
                this.overlay.strokeCircle(session.worldX, session.worldY, radius);
            }
        }
        if (showVisualDebug) {
            for (const anchor of this.anchors){
                this.overlay.fillStyle(0xc43c3c, 1);
                this.overlay.fillRect(Math.floor(anchor.rodOriginX) - 1, Math.floor(anchor.rodOriginY) - 1, 3, 3);
                this.overlay.fillStyle(0xfff44a, 1);
                this.overlay.fillRect(Math.floor(anchor.rodTipX) - 1, Math.floor(anchor.rodTipY) - 1, 3, 3);
                this.overlay.fillStyle(0x62c46a, 1);
                this.overlay.fillRect(Math.floor(anchor.lineStartX) - 1, Math.floor(anchor.lineStartY) - 1, 3, 3);
                this.overlay.fillStyle(0x7adcf2, 1);
                this.overlay.fillRect(Math.floor(anchor.waterTargetX) - 1, Math.floor(anchor.waterTargetY) - 1, 3, 3);
                this.overlay.fillStyle(0xe879f9, 1);
                this.overlay.fillRect(Math.floor(anchor.bubbleX) - 1, Math.floor(anchor.bubbleY) - 1, 3, 3);
            }
        }
        if (!showInterestPoints) {
            return;
        }
        for (const point of interestPoints){
            const x = point.tile.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + 4;
            const y = point.tile.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + 4;
            const color = interestDebugColor(point.tags);
            this.overlay.fillStyle(color, 0.7);
            this.overlay.fillRect(x, y, 8, 8);
        }
    }
}
function destroyGear(gear) {
    gear.rod.destroy();
    gear.castBobber.destroy();
    gear.bobber.destroy();
    gear.splash.destroy();
    gear.bubbles.destroy();
}
function lineEndForPhase(visualPhase, bobberPos, bubblePos, waterTarget) {
    if (visualPhase === "fight_underwater") {
        return bubblePos;
    }
    if (visualPhase === "cast_air" || visualPhase === "wait_surface" || visualPhase === "bite_submerge") {
        return bobberPos;
    }
    return waterTarget;
}
function clipElapsedMs(session, tickIndex, tickAlpha, timeMs, presentation) {
    const now = (tickIndex + tickAlpha) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
    if (presentation === "cast") {
        return Math.max(0, now - session.arriveUntilTick * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]);
    }
    if (presentation === "wait") {
        return Math.max(0, now - session.castUntilTick * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]);
    }
    if (presentation === "bite") {
        return Math.max(0, now - (session.biteUntilTick - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].biteDisplayTicks) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]);
    }
    if (presentation === "hook" || presentation === "pull") {
        return session.fightStartedAtMs > 0 ? Math.max(0, timeMs - session.fightStartedAtMs) : 0;
    }
    if (presentation === "success" && session.resultAtMs > 0) {
        return Math.max(0, timeMs - session.resultAtMs);
    }
    return now;
}
function interestDebugColor(tags) {
    if (tags.includes("water_edge")) {
        return 0x4ea3e0;
    }
    if (tags.includes("farm")) {
        return 0x62c46a;
    }
    if (tags.includes("storage")) {
        return 0xe8d48a;
    }
    return 0x9ae6b4;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISHING_PRESENTATION",
    ()=>FISHING_PRESENTATION,
    "FISHING_PRESENTATION_SUCCESS_HOLD_TICKS",
    ()=>FISHING_PRESENTATION_SUCCESS_HOLD_TICKS,
    "castArcProgress",
    ()=>castArcProgress,
    "clamp01",
    ()=>clamp01,
    "fishingFallbackAnim",
    ()=>fishingFallbackAnim,
    "fishingGearObjectIds",
    ()=>fishingGearObjectIds,
    "fishingGearState",
    ()=>fishingGearState,
    "fishingSemanticAnim",
    ()=>fishingSemanticAnim,
    "nextFishingGearIds",
    ()=>nextFishingGearIds,
    "quantizedArc",
    ()=>quantizedArc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
;
;
const FISHING_PRESENTATION = {
    castFrameMs: 125,
    waitFrameMs: 200,
    biteFrameMs: [
        150,
        150,
        200
    ],
    pullFrameMs: 120,
    successFrameMs: [
        90,
        90,
        90,
        90,
        90,
        90,
        140,
        320
    ],
    bobberIdleFrameMs: 220,
    submergeFrameMs: 80,
    bubbleFrameMs: 90,
    splashFrameMs: 70,
    bobberArcHeightPx: 10,
    landingSplashScale: 0.85,
    biteSplashScale: 0.7,
    successSplashScale: 1.15,
    bubbleBurstMs: 540,
    pullBubbleGapMs: 900,
    lineColor: 0x4a5a58,
    lineSlackDropPx: 3,
    successHoldMs: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_SUCCESS_HOLD_MS"],
    cameraLerp: 0.08,
    cameraMarginPx: 28
};
const FISHING_PRESENTATION_SUCCESS_HOLD_TICKS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_SUCCESS_PRESENTATION_HOLD_TICKS"];
function fishingSemanticAnim(phase) {
    if (phase === "approach") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].HOP;
    }
    if (phase === "arrive" || phase === "wait") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_WAIT;
    }
    if (phase === "cast") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST;
    }
    if (phase === "bite") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_BITE;
    }
    if (phase === "hook" || phase === "pull") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL;
    }
    if (phase === "success") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_SUCCESS;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE;
}
function fishingFallbackAnim(phase) {
    const semantic = fishingSemanticAnim(phase);
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_WAIT || semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE;
    }
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_SUCCESS || semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].HOP) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].HOP;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].WORK;
}
function fishingGearState(phase) {
    if (phase === "cast") {
        return {
            rodPose: "cast",
            bobber: "arc",
            line: "normal",
            showSplash: "none",
            showBubbles: false
        };
    }
    if (phase === "wait") {
        return {
            rodPose: "wait",
            bobber: "idle",
            line: "slack",
            showSplash: "none",
            showBubbles: false
        };
    }
    if (phase === "bite") {
        return {
            rodPose: "bite",
            bobber: "submerge",
            line: "tension",
            showSplash: "none",
            showBubbles: true
        };
    }
    if (phase === "hook" || phase === "pull") {
        return {
            rodPose: "pull",
            bobber: "hidden",
            line: "tension",
            showSplash: "none",
            showBubbles: true
        };
    }
    if (phase === "success") {
        return {
            rodPose: null,
            bobber: "hidden",
            line: "hidden",
            showSplash: "success",
            showBubbles: false
        };
    }
    if (phase === "escape") {
        return {
            rodPose: "wait",
            bobber: "hidden",
            line: "slack",
            showSplash: "escape",
            showBubbles: false
        };
    }
    return {
        rodPose: null,
        bobber: "hidden",
        line: "hidden",
        showSplash: "none",
        showBubbles: false
    };
}
function clamp01(value) {
    if (value <= 0) {
        return 0;
    }
    if (value >= 1) {
        return 1;
    }
    return value;
}
function quantizedArc(fromX, fromY, toX, toY, t, heightPx) {
    const k = clamp01(t);
    const x = fromX + (toX - fromX) * k;
    const y = fromY + (toY - fromY) * k - Math.sin(k * Math.PI) * heightPx;
    return {
        x: Math.floor(x),
        y: Math.floor(y)
    };
}
function castArcProgress(arriveUntilTick, castUntilTick, tickIndex, tickAlpha) {
    if (tickIndex + tickAlpha < arriveUntilTick) {
        return 0;
    }
    const span = Math.max(1, castUntilTick - arriveUntilTick);
    return clamp01((tickIndex + tickAlpha - arriveUntilTick) / span);
}
function fishingGearObjectIds(sessionId) {
    return [
        `rod:${sessionId}`,
        `castBobber:${sessionId}`,
        `bobber:${sessionId}`,
        `splash:${sessionId}`,
        `bubbles:${sessionId}`,
        `line:${sessionId}`
    ];
}
function nextFishingGearIds(previousSessionId, nextSessionId) {
    const prev = previousSessionId ? fishingGearObjectIds(previousSessionId) : [];
    const next = nextSessionId ? fishingGearObjectIds(nextSessionId) : [];
    const nextSet = new Set(next);
    const prevSet = new Set(prev);
    return {
        created: next.filter((id)=>!prevSet.has(id)),
        destroyed: prev.filter((id)=>!nextSet.has(id))
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/fishingVisualLayout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bubblesActive",
    ()=>bubblesActive,
    "castAirEndEqualsTarget",
    ()=>castAirEndEqualsTarget,
    "chooseFishingVisualLayout",
    ()=>chooseFishingVisualLayout,
    "chooseFishingVisualSide",
    ()=>chooseFishingVisualSide,
    "choosePresentationWaterTarget",
    ()=>choosePresentationWaterTarget,
    "fishingBobberVisual",
    ()=>fishingBobberVisual,
    "fishingFlips",
    ()=>fishingFlips,
    "fishingVisualObjectIds",
    ()=>fishingVisualObjectIds,
    "fishingVisualPhase",
    ()=>fishingVisualPhase,
    "fishingWorldQueries",
    ()=>fishingWorldQueries,
    "layoutFromFishingWorld",
    ()=>layoutFromFishingWorld,
    "lineOriginFromRodTip",
    ()=>lineOriginFromRodTip,
    "proposeNsWaterTarget",
    ()=>proposeNsWaterTarget,
    "rodPhaserOrigin",
    ()=>rodPhaserOrigin,
    "rodTipWorld",
    ()=>rodTipWorld,
    "scoreVisualSide",
    ()=>scoreVisualSide,
    "surfaceBobberAllowed",
    ()=>surfaceBobberAllowed,
    "surfaceBobberFromCastEnd",
    ()=>surfaceBobberFromCastEnd,
    "visualSideFromCast",
    ()=>visualSideFromCast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
;
;
;
;
function fishingVisualPhase(presentation) {
    if (presentation === "approach") {
        return "approach";
    }
    if (presentation === "cast") {
        return "cast_air";
    }
    if (presentation === "arrive" || presentation === "wait") {
        return "wait_surface";
    }
    if (presentation === "bite") {
        return "bite_submerge";
    }
    if (presentation === "hook" || presentation === "pull") {
        return "fight_underwater";
    }
    if (presentation === "success") {
        return "success";
    }
    if (presentation === "escape") {
        return "escape";
    }
    return "cleanup";
}
function fishingBobberVisual(phase) {
    if (phase === "cast_air") {
        return {
            bobber: "cast_air",
            bubbles: "off",
            rodPose: "cast",
            line: "normal"
        };
    }
    if (phase === "bobber_land" || phase === "wait_surface") {
        return {
            bobber: "surface",
            bubbles: "off",
            rodPose: "wait",
            line: "slack"
        };
    }
    if (phase === "bite_submerge") {
        return {
            bobber: "submerge",
            bubbles: "off",
            rodPose: "bite",
            line: "tension"
        };
    }
    if (phase === "fight_underwater") {
        return {
            bobber: "hidden",
            bubbles: "loop",
            rodPose: "pull",
            line: "tension"
        };
    }
    if (phase === "success") {
        return {
            bobber: "hidden",
            bubbles: "off",
            rodPose: null,
            line: "hidden"
        };
    }
    if (phase === "escape") {
        return {
            bobber: "hidden",
            bubbles: "off",
            rodPose: "wait",
            line: "slack"
        };
    }
    return {
        bobber: "hidden",
        bubbles: "off",
        rodPose: null,
        line: "hidden"
    };
}
function surfaceBobberAllowed(phase) {
    return fishingBobberVisual(phase).bobber === "surface" || fishingBobberVisual(phase).bobber === "submerge";
}
function bubblesActive(phase) {
    return fishingBobberVisual(phase).bubbles === "loop";
}
function fishingVisualObjectIds(sessionId) {
    return [
        `rod:${sessionId}`,
        `castBobber:${sessionId}`,
        `bobber:${sessionId}`,
        `splash:${sessionId}`,
        `bubbles:${sessionId}`,
        `line:${sessionId}`
    ];
}
function fishingFlips(side) {
    if (side === "right") {
        return {
            bodyFacing: -1,
            rodFlipX: false
        };
    }
    return {
        bodyFacing: 1,
        rodFlipX: true
    };
}
function rodPhaserOrigin(flipX) {
    return {
        x: flipX ? 1 : 0,
        y: 1
    };
}
function fishingWorldQueries(grid) {
    return {
        isWaterWorld: (worldX, worldY)=>{
            if (!grid) {
                return true;
            }
            const tile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(worldX, worldY);
            return grid.getTile(tile.x, tile.y)?.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER;
        },
        hasBlockerTile: (tileX, tileY)=>Boolean(grid?.objectAt(tileX, tileY))
    };
}
function layoutFromFishingWorld(sessionWorld, slimeGround, slimeTile, access, activityWorld, grid) {
    const queries = fishingWorldQueries(grid);
    return chooseFishingVisualLayout({
        landTile: access?.landTile ?? slimeTile,
        waterTile: access?.waterTile ?? slimeTile,
        castDirection: access?.castDirection ?? "east",
        slimeGround,
        activityWorld: activityWorld ?? sessionWorld,
        sessionWorld,
        isWaterWorld: queries.isWaterWorld,
        hasBlockerTile: queries.hasBlockerTile
    });
}
function visualSideFromCast(castDirection) {
    if (castDirection === "east") {
        return "right";
    }
    if (castDirection === "west") {
        return "left";
    }
    return null;
}
function proposeNsWaterTarget(waterTile, castDirection, side) {
    const waterCx = waterTile.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const waterCy = waterTile.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const sideSign = side === "right" ? 1 : -1;
    const nsSign = castDirection === "south" ? 1 : -1;
    return {
        x: Math.floor(waterCx + sideSign * 10),
        y: Math.floor(waterCy + nsSign * 10)
    };
}
function scoreVisualSide(side, ctx) {
    let score = 0;
    const proposed = ctx.castDirection === "north" || ctx.castDirection === "south" ? proposeNsWaterTarget(ctx.waterTile, ctx.castDirection, side) : {
        x: Math.floor(ctx.sessionWorld.x),
        y: Math.floor(ctx.sessionWorld.y)
    };
    if (ctx.isWaterWorld(proposed.x, proposed.y)) {
        score += 5;
    }
    const towardActivity = ctx.activityWorld.x - ctx.slimeGround.x;
    if (side === "right" && towardActivity >= 0) {
        score += 3;
    }
    if (side === "left" && towardActivity <= 0) {
        score += 3;
    }
    if (side === "right" && towardActivity < -4) {
        score -= 3;
    }
    if (side === "left" && towardActivity > 4) {
        score -= 3;
    }
    const frontTx = ctx.landTile.x + (side === "right" ? 1 : -1);
    if (ctx.hasBlockerTile(frontTx, ctx.landTile.y)) {
        score -= 2;
    }
    if ((proposed.x - ctx.slimeGround.x) * (side === "right" ? 1 : -1) > 0) {
        score += 1;
    }
    return score;
}
function chooseFishingVisualSide(ctx) {
    const mapped = visualSideFromCast(ctx.castDirection);
    if (mapped) {
        return mapped;
    }
    const left = scoreVisualSide("left", ctx);
    const right = scoreVisualSide("right", ctx);
    if (right > left) {
        return "right";
    }
    if (left > right) {
        return "left";
    }
    return ctx.activityWorld.x >= ctx.slimeGround.x ? "right" : "left";
}
function choosePresentationWaterTarget(ctx, side) {
    if (ctx.castDirection === "east" || ctx.castDirection === "west") {
        return {
            x: Math.floor(ctx.sessionWorld.x),
            y: Math.floor(ctx.sessionWorld.y)
        };
    }
    if (ctx.castDirection !== "north" && ctx.castDirection !== "south") {
        return {
            x: Math.floor(ctx.sessionWorld.x),
            y: Math.floor(ctx.sessionWorld.y)
        };
    }
    let target = proposeNsWaterTarget(ctx.waterTile, ctx.castDirection, side);
    const waterCx = ctx.waterTile.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const waterCy = ctx.waterTile.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const dx = ctx.activityWorld.x - waterCx;
    const dy = ctx.activityWorld.y - waterCy;
    if (ctx.isWaterWorld(ctx.activityWorld.x, ctx.activityWorld.y) && dx * dx + dy * dy <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx) {
        target = {
            x: Math.floor((target.x + ctx.activityWorld.x) / 2),
            y: Math.floor((target.y + ctx.activityWorld.y) / 2)
        };
    }
    if (!ctx.isWaterWorld(target.x, target.y)) {
        target = {
            x: Math.floor(waterCx),
            y: Math.floor(waterCy)
        };
    }
    return target;
}
function chooseFishingVisualLayout(ctx) {
    const visualSide = chooseFishingVisualSide(ctx);
    const flips = fishingFlips(visualSide);
    const waterTarget = choosePresentationWaterTarget(ctx, visualSide);
    const frontTx = ctx.landTile.x + (visualSide === "right" ? 1 : -1);
    const blocked = ctx.hasBlockerTile(frontTx, ctx.landTile.y);
    return {
        visualSide,
        bodyFacing: flips.bodyFacing,
        rodFlipX: flips.rodFlipX,
        waterTarget,
        rodNudgeX: blocked ? visualSide === "right" ? -1 : 1 : 0,
        inFront: ctx.castDirection !== "north"
    };
}
function rodTipWorld(handleX, handleY, tipLocalX, tipLocalY, flipX) {
    const localX = flipX ? -tipLocalX : tipLocalX;
    return {
        x: Math.floor(handleX + localX),
        y: Math.floor(handleY + tipLocalY)
    };
}
function lineOriginFromRodTip(tip) {
    return {
        x: tip.x,
        y: tip.y
    };
}
function surfaceBobberFromCastEnd(airEnd) {
    return {
        x: airEnd.x,
        y: airEnd.y
    };
}
function castAirEndEqualsTarget(fromX, fromY, toX, toY, heightPx) {
    const end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantizedArc"])(fromX, fromY, toX, toY, 1, heightPx);
    const surface = surfaceBobberFromCastEnd(end);
    return surface.x === Math.floor(toX) && surface.y === Math.floor(toY);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/loadFishingVisuals.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFishingAnimations",
    ()=>createFishingAnimations,
    "preloadFishingVisuals",
    ()=>preloadFishingVisuals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$resolveFishingAnim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/resolveFishingAnim.ts [app-client] (ecmascript)");
;
;
;
;
function preloadFishingVisuals(scene) {
    for (const clip of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"])){
        for(let i = 0; i < clip.keys.length; i += 1){
            scene.load.image(clip.keys[i], clip.paths[i]);
        }
    }
    for (const [id, path] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_PATHS"])){
        scene.load.image(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_KEYS"][id], path);
    }
    for (const pack of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"])){
        for(let i = 0; i < pack.keys.length; i += 1){
            scene.load.image(pack.keys[i], pack.paths[i]);
        }
    }
}
function createFishingAnimations(scene) {
    const missing = [];
    const ready = (key)=>{
        if (scene.textures.exists(key)) {
            scene.textures.get(key).setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
            return true;
        }
        missing.push(key);
        return false;
    };
    let pingoOk = true;
    for (const clip of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"])){
        const frames = clip.keys.filter((key)=>ready(key));
        if (frames.length !== clip.keys.length) {
            pingoOk = false;
            continue;
        }
        replaceAnim(scene, clip.animKey, frames, clip.animKey);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$resolveFishingAnim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setPingoFishingReady"])(pingoOk);
    if (!pingoOk) {
        console.warn("Pingo fishing body frames incomplete; using Idle/Hop/Work fallback.", missing);
    }
    for (const key of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PROP_KEYS"])){
        ready(key);
    }
    const idle = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bobberIdle.keys.filter((key)=>ready(key));
    if (idle.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bobberIdle.keys.length) {
        replaceFxAnim(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bobberIdle, idle, 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].bobberIdleFrameMs, -1);
    }
    const submerge = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].submerge.keys.filter((key)=>ready(key));
    if (submerge.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].submerge.keys.length) {
        replaceFxAnim(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].submerge, submerge, 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].submergeFrameMs, 0);
    }
    const bubbles = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bubbles.keys.filter((key)=>ready(key));
    if (bubbles.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].bubbles.keys.length) {
        replaceFxAnim(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].bubbles, bubbles, 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].bubbleFrameMs, -1);
    }
    const splash = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].splash.keys.filter((key)=>ready(key));
    if (splash.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX"].splash.keys.length) {
        replaceFxAnim(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_FX_ANIM"].splash, splash, 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].splashFrameMs, 0);
    }
    if (missing.length > 0 && pingoOk) {
        console.warn("Some fishing props failed to load; those clips will stay hidden.", missing);
    }
}
function replaceAnim(scene, animKey, frames, kind) {
    if (scene.anims.exists(animKey)) {
        scene.anims.remove(animKey);
    }
    const durations = kind === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"].fish_bite.animKey ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].biteFrameMs : kind === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"].fish_success.animKey ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].successFrameMs : undefined;
    const extras = {};
    if (kind === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"].fish_cast.animKey) {
        extras.frameRate = 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].castFrameMs;
        extras.repeat = 0;
    } else if (kind === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"].fish_wait.animKey) {
        extras.frameRate = 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].waitFrameMs;
        extras.repeat = -1;
    } else if (kind === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_FISHING_CLIPS"].fish_pull.animKey) {
        extras.frameRate = 1000 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].pullFrameMs;
        extras.repeat = -1;
        extras.yoyo = true;
    } else {
        extras.repeat = 0;
    }
    scene.anims.create({
        key: animKey,
        frames: frames.map((frameKey, index)=>({
                key: frameKey,
                duration: durations ? durations[index] : undefined
            })),
        ...extras
    });
}
function replaceFxAnim(scene, animKey, frames, frameRate, repeat) {
    if (scene.anims.exists(animKey)) {
        scene.anims.remove(animKey);
    }
    scene.anims.create({
        key: animKey,
        frames: frames.map((frameKey)=>({
                key: frameKey
            })),
        frameRate,
        repeat
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISHING_FX",
    ()=>FISHING_FX,
    "FISHING_FX_ANIM",
    ()=>FISHING_FX_ANIM,
    "FISHING_PROP_KEYS",
    ()=>FISHING_PROP_KEYS,
    "FISHING_PROP_PATHS",
    ()=>FISHING_PROP_PATHS,
    "PINGO_FISHING_CLIPS",
    ()=>PINGO_FISHING_CLIPS,
    "PINGO_FISHING_FRAME",
    ()=>PINGO_FISHING_FRAME,
    "PINGO_ROD_FRAME_OFFSETS",
    ()=>PINGO_ROD_FRAME_OFFSETS,
    "PINGO_ROD_ORIGIN",
    ()=>PINGO_ROD_ORIGIN,
    "ROD_POSE",
    ()=>ROD_POSE,
    "fishingClipFrame",
    ()=>fishingClipFrame,
    "fishingRodPlacement",
    ()=>fishingRodPlacement,
    "isPingo",
    ()=>isPingo,
    "nudgePingoRod",
    ()=>nudgePingoRod,
    "pingoFishingAnimKey",
    ()=>pingoFishingAnimKey,
    "rodFrameOffset",
    ()=>rodFrameOffset,
    "rodNudge",
    ()=>rodNudge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualLayout.ts [app-client] (ecmascript)");
;
;
;
;
const PINGO_FISHING_FRAME = {
    width: 50,
    height: 65
};
const PINGO = "/assets/slimes/pingo";
const ROD = "/assets/world/itens/fishing_rod";
const FX = `${ROD}/animations`;
function pingoFrames(folder, fileStem, count) {
    const keys = [];
    const paths = [];
    for(let i = 1; i <= count; i += 1){
        keys.push(`pingo-${folder}-${i}`);
        paths.push(`${PINGO}/${folder}/${fileStem}${i}.png`);
    }
    return {
        keys,
        paths
    };
}
function numberedFx(folder, stem, count, paren) {
    const keys = [];
    const paths = [];
    for(let i = 1; i <= count; i += 1){
        keys.push(`${stem}-${i}`);
        const name = paren ? `${stem} (${i}).png` : `${stem}${i}.png`;
        paths.push(encodeURI(`${FX}/${folder}/${name}`));
    }
    return {
        keys,
        paths
    };
}
const PINGO_FISHING_CLIPS = {
    fish_cast: {
        ...pingoFrames("fishing_cast", "Pingo_fishing_cast", 4),
        animKey: "pingo_fish_cast"
    },
    fish_wait: {
        ...pingoFrames("fishing_wait", "Pingo_fishing_wait", 4),
        animKey: "pingo_fish_wait"
    },
    fish_bite: {
        ...pingoFrames("fishing_bite", "Pingo_fishing_bite", 3),
        animKey: "pingo_fish_bite"
    },
    fish_pull: {
        ...pingoFrames("fishing_push", "Pingo_fishing_push", 7),
        animKey: "pingo_fish_pull"
    },
    fish_success: {
        ...pingoFrames("fishing_catch", "Pingo_fishing_catch", 8),
        animKey: "pingo_fish_success"
    }
};
const FISHING_PROP_KEYS = {
    rodCast: "fishing-rod-cast",
    rodWait: "fishing-rod-wait",
    rodBite: "fishing-rod-bite",
    rodPull: "fishing-rod-pull",
    bobberCastAir: "fishing-bobber-cast-air"
};
const FISHING_PROP_PATHS = {
    rodCast: `${ROD}/Cast_Rod.png`,
    rodWait: `${ROD}/Loose_Rod.png`,
    rodBite: `${ROD}/Fightingt_Rod.png`,
    rodPull: `${ROD}/Pull_Rod.png`,
    bobberCastAir: `${ROD}/cast_air.png`
};
const FISHING_FX = {
    bobberIdle: numberedFx("Fishing_Bloat_Idle", "Fishing_Bloat_Idle", 4, false),
    submerge: numberedFx("FishBite_PréBoubble", "FishBite_Pré", 6, true),
    bubbles: numberedFx("FishBite_Boubbles", "FishBite_Boubbles", 6, true),
    splash: numberedFx("Water_Splash", "Water_Splash", 8, false)
};
const FISHING_FX_ANIM = {
    bobberIdle: "fishing-bobber-idle",
    submerge: "fishing-bobber-submerge",
    bubbles: "fishing-bubbles",
    splash: "fishing-splash"
};
const ROD_POSE = {
    cast: {
        textureKey: FISHING_PROP_KEYS.rodCast,
        originX: 0,
        originY: 1,
        tipX: 33,
        tipY: -29,
        width: 34,
        height: 30
    },
    wait: {
        textureKey: FISHING_PROP_KEYS.rodWait,
        originX: 0,
        originY: 1,
        tipX: 23,
        tipY: -39,
        width: 24,
        height: 39
    },
    bite: {
        textureKey: FISHING_PROP_KEYS.rodBite,
        originX: 0,
        originY: 1,
        tipX: 33,
        tipY: -22,
        width: 34,
        height: 28
    },
    pull: {
        textureKey: FISHING_PROP_KEYS.rodPull,
        originX: 0,
        originY: 1,
        tipX: 28,
        tipY: -23,
        width: 29,
        height: 26
    }
};
const PINGO_ROD_ORIGIN = {
    x: 8,
    y: -16
};
const PINGO_ROD_FRAME_OFFSETS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST]: [
        {
            frameIndex: 0,
            rodOffsetX: 0,
            rodOffsetY: 0
        },
        {
            frameIndex: 1,
            rodOffsetX: 1,
            rodOffsetY: -1
        },
        {
            frameIndex: 2,
            rodOffsetX: 2,
            rodOffsetY: -2
        },
        {
            frameIndex: 3,
            rodOffsetX: 1,
            rodOffsetY: 0
        }
    ],
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL]: [
        {
            frameIndex: 0,
            rodOffsetX: 0,
            rodOffsetY: 0
        },
        {
            frameIndex: 2,
            rodOffsetX: 1,
            rodOffsetY: 1
        },
        {
            frameIndex: 4,
            rodOffsetX: 0,
            rodOffsetY: 2
        },
        {
            frameIndex: 6,
            rodOffsetX: -1,
            rodOffsetY: 1
        }
    ]
};
const rodNudge = {
    x: 0,
    y: 0
};
function nudgePingoRod(dx, dy) {
    rodNudge.x += dx;
    rodNudge.y += dy;
    return {
        ...rodNudge
    };
}
function pingoFishingAnimKey(semantic) {
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST) {
        return PINGO_FISHING_CLIPS.fish_cast.animKey;
    }
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_WAIT) {
        return PINGO_FISHING_CLIPS.fish_wait.animKey;
    }
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_BITE) {
        return PINGO_FISHING_CLIPS.fish_bite.animKey;
    }
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL) {
        return PINGO_FISHING_CLIPS.fish_pull.animKey;
    }
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_SUCCESS) {
        return PINGO_FISHING_CLIPS.fish_success.animKey;
    }
    return undefined;
}
function isPingo(slimeId) {
    return slimeId === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO;
}
function rodFrameOffset(anim, frameIndex) {
    const entries = PINGO_ROD_FRAME_OFFSETS[anim];
    if (!entries || entries.length === 0) {
        return {
            x: 0,
            y: 0
        };
    }
    let best = entries[0];
    for (const entry of entries){
        if (entry.frameIndex <= frameIndex) {
            best = entry;
        }
    }
    return {
        x: best.rodOffsetX,
        y: best.rodOffsetY
    };
}
function fishingRodPlacement(groundX, groundY, pose, visualSide, anim, frameIndex, extraNudgeX = 0) {
    const { rodFlipX } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingFlips"])(visualSide);
    const sign = rodFlipX ? -1 : 1;
    const frame = rodFrameOffset(anim, frameIndex);
    const handleX = Math.floor(groundX + (PINGO_ROD_ORIGIN.x + frame.x + rodNudge.x) * sign + extraNudgeX);
    const handleY = Math.floor(groundY + PINGO_ROD_ORIGIN.y + frame.y + rodNudge.y);
    const poseDef = ROD_POSE[pose];
    const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rodPhaserOrigin"])(rodFlipX);
    const tip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rodTipWorld"])(handleX, handleY, poseDef.tipX, poseDef.tipY, rodFlipX);
    return {
        handleX,
        handleY,
        tipX: tip.x,
        tipY: tip.y,
        flipX: rodFlipX,
        originX: origin.x,
        originY: origin.y
    };
}
function fishingClipFrame(anim, elapsedMs) {
    if (anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST) {
        return Math.min(3, Math.floor(elapsedMs / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].castFrameMs));
    }
    if (anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_WAIT) {
        return Math.floor(elapsedMs / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].waitFrameMs) % 4;
    }
    if (anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_BITE) {
        let acc = 0;
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].biteFrameMs.length; i += 1){
            acc += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].biteFrameMs[i];
            if (elapsedMs < acc) {
                return i;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].biteFrameMs.length - 1;
    }
    if (anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL) {
        const n = 7;
        const cycle = n * 2 - 2;
        const step = Math.floor(elapsedMs / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].pullFrameMs) % cycle;
        return step < n ? step : cycle - step;
    }
    if (anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_SUCCESS) {
        let acc = 0;
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].successFrameMs.length; i += 1){
            acc += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].successFrameMs[i];
            if (elapsedMs < acc) {
                return i;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].successFrameMs.length - 1;
    }
    return 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/fishing/resolveFishingAnim.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFishingAnimation",
    ()=>getFishingAnimation,
    "isPingoFishingReady",
    ()=>isPingoFishingReady,
    "setPingoFishingReady",
    ()=>setPingoFishingReady,
    "slimeHasFinalFishingArt",
    ()=>slimeHasFinalFishingArt,
    "usesPingoFishingClip",
    ()=>usesPingoFishingClip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)");
;
;
;
;
const warned = new Set();
let pingoFishingReady = false;
function setPingoFishingReady(ready) {
    pingoFishingReady = ready;
}
function isPingoFishingReady() {
    return pingoFishingReady;
}
function getFishingAnimation(slimeId, phase, hasTexture = ()=>pingoFishingReady) {
    const semantic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSemanticAnim"])(phase);
    if (semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].HOP || semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE || semantic === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].WORK) {
        return {
            kind: "fallback",
            anim: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingFallbackAnim"])(phase),
            semantic
        };
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPingo"])(slimeId)) {
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pingoFishingAnimKey"])(semantic);
        if (key && hasTexture(key) && pingoFishingReady) {
            return {
                kind: "final",
                key,
                semantic
            };
        }
        warnOnce(`Pingo fishing art missing for ${semantic}; using Idle/Hop/Work fallback.`);
    }
    return {
        kind: "fallback",
        anim: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingFallbackAnim"])(phase),
        semantic
    };
}
function usesPingoFishingClip(slimeId, anim) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPingo"])(slimeId) || !pingoFishingReady) {
        return false;
    }
    return anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_WAIT || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_BITE || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_SUCCESS;
}
function slimeHasFinalFishingArt(slimeId) {
    return slimeId === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO && pingoFishingReady;
}
function warnOnce(message) {
    if (warned.has(message)) {
        return;
    }
    warned.add(message);
    console.warn(message);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/loadSlimeVisuals.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSlimeAnimations",
    ()=>createSlimeAnimations,
    "preloadSlimeVisuals",
    ()=>preloadSlimeVisuals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
;
;
;
function preloadSlimeVisuals(scene) {
    for (const id of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"])){
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][id];
        if (visual.kind !== "final") {
            continue;
        }
        for (const clip of Object.values(visual.anims)){
            for(let i = 0; i < clip.textureKeys.length; i += 1){
                scene.load.image(clip.textureKeys[i], clip.paths[i]);
            }
        }
    }
}
function createSlimeAnimations(scene) {
    for (const id of Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"])){
        const visual = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_VISUALS"][id];
        if (visual.kind !== "final") {
            continue;
        }
        for (const [animName, clip] of Object.entries(visual.anims)){
            for (const key of clip.textureKeys){
                scene.textures.get(key).setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
            }
            const animKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeAnimKey"])(id, animName);
            if (scene.anims.exists(animKey)) {
                scene.anims.remove(animKey);
            }
            scene.anims.create({
                key: animKey,
                frames: clip.textureKeys.map((key)=>({
                        key
                    })),
                frameRate: clip.frameRate,
                repeat: clip.repeat
            });
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/slimeView.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "slimeView",
    ()=>slimeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
;
;
;
;
;
function clamp01(value) {
    if (value <= 0) {
        return 0;
    }
    if (value >= 1) {
        return 1;
    }
    return value;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function hopScale(t) {
    if (t < 0.12) {
        const k = t / 0.12;
        return {
            x: lerp(1.12, 1, k),
            y: lerp(0.88, 1, k)
        };
    }
    if (t < 0.28) {
        const k = (t - 0.12) / 0.16;
        return {
            x: lerp(1, 0.9, k),
            y: lerp(1, 1.1, k)
        };
    }
    if (t < 0.72) {
        return {
            x: 0.94,
            y: 1.06
        };
    }
    if (t < 0.88) {
        const k = (t - 0.72) / 0.16;
        return {
            x: lerp(0.94, 1.1, k),
            y: lerp(1.06, 0.9, k)
        };
    }
    const k = (t - 0.88) / 0.12;
    return {
        x: lerp(1.1, 1, k),
        y: lerp(0.9, 1, k)
    };
}
function idleScale(slime, timeMs) {
    const offset = slime.id.length * 173 + slime.spawnX * 19;
    const period = 2600 + offset * 3;
    const local = (timeMs + offset * 50) % period / period;
    if (local < 0.62) {
        return {
            x: 1,
            y: 1
        };
    }
    if (local < 0.72) {
        const k = (local - 0.62) / 0.1;
        return {
            x: lerp(1, 1.08, k),
            y: lerp(1, 0.92, k)
        };
    }
    if (local < 0.82) {
        return {
            x: 1,
            y: 1
        };
    }
    if (local < 0.92) {
        const k = (local - 0.82) / 0.1;
        return {
            x: lerp(1, 0.94, k),
            y: lerp(1, 1.06, k)
        };
    }
    return {
        x: 1,
        y: 1
    };
}
function workScale(slime) {
    const wave = Math.sin(slime.workElapsedMs / 180 * Math.PI);
    return {
        x: 1 + wave * 0.05,
        y: 1 - wave * 0.05
    };
}
function animForState(slime, hopping, session, tickIndex) {
    const presentation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingPresentationPhase"])(slime, session, tickIndex);
    if (presentation !== "idle") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSemanticAnim"])(presentation);
    }
    if (slime.state === "working" || slime.state === "eating") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].WORK;
    }
    if (slime.state === "ambient") {
        return slime.ambientBehaviorId === "social_greet" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].WORK : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE;
    }
    if (hopping || slime.state === "moving_to_task" || slime.state === "moving_to_fishing" || slime.state === "moving_to_ambient" || slime.state === "carrying_to_storage" || slime.state === "moving_to_food") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].HOP;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].IDLE;
}
function slimeView(slime, tickAlpha, timeMs, session, tickIndex = 0) {
    const hopping = Boolean(slime.hopTo && slime.hopFrom);
    const elapsed = hopping ? slime.hopElapsedMs + tickAlpha * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"] : 0;
    const hopT = hopping ? clamp01(elapsed / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_HOP_DURATION_MS"]) : 0;
    const travelT = hopping ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hopTravelT"])(slime.id, hopT) : 0;
    const fromX = slime.hopFrom?.x ?? slime.tileX;
    const fromY = slime.hopFrom?.y ?? slime.tileY;
    const toX = slime.hopTo?.x ?? slime.tileX;
    const toY = slime.hopTo?.y ?? slime.tileY;
    const tileX = hopping ? lerp(fromX, toX, travelT) : slime.tileX;
    const tileY = hopping ? lerp(fromY, toY, travelT) : slime.tileY;
    const groundX = tileX * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const groundY = tileY * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
    const hopLift = hopping ? Math.sin(travelT * Math.PI) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_HOP_HEIGHT_PX"] : 0;
    const finalArt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usesFinalArt"])(slime.id);
    const anim = animForState(slime, hopping, session, tickIndex);
    let scale = {
        x: 1,
        y: 1
    };
    if (!finalArt) {
        if (slime.state === "working" || slime.state === "eating" || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_CAST || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_BITE || anim === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$slimeVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_ANIM"].FISH_PULL) {
            scale = workScale(slime);
        } else if (hopping) {
            scale = hopScale(hopT);
        } else {
            scale = idleScale(slime, timeMs);
        }
    }
    let facing = 1;
    if (hopping && toX < fromX) {
        facing = 1;
    } else if (hopping && toX > fromX) {
        facing = -1;
    } else if (slime.faceTile && slime.faceTile.x < slime.tileX) {
        facing = 1;
    } else if (slime.faceTile && slime.faceTile.x > slime.tileX) {
        facing = -1;
    }
    return {
        groundX,
        groundY,
        spriteY: groundY - (finalArt ? 0 : hopLift),
        hopLift,
        scaleX: scale.x,
        scaleY: scale.y,
        shadowScale: hopping ? lerp(1, 0.72, Math.sin(travelT * Math.PI)) : 1,
        anim,
        hopT,
        facing
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/slimeVisualConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CARRY_TEXTURE",
    ()=>CARRY_TEXTURE,
    "PLACEHOLDER_SHADOW_OFFSET_Y",
    ()=>PLACEHOLDER_SHADOW_OFFSET_Y,
    "SLIME_ANIM",
    ()=>SLIME_ANIM,
    "SLIME_COLORS",
    ()=>SLIME_COLORS,
    "SLIME_FRAME_HEIGHT",
    ()=>SLIME_FRAME_HEIGHT,
    "SLIME_FRAME_WIDTH",
    ()=>SLIME_FRAME_WIDTH,
    "SLIME_ORIGIN_X",
    ()=>SLIME_ORIGIN_X,
    "SLIME_ORIGIN_Y",
    ()=>SLIME_ORIGIN_Y,
    "SLIME_VISUALS",
    ()=>SLIME_VISUALS,
    "STORAGE_TEXTURE_KEY",
    ()=>STORAGE_TEXTURE_KEY,
    "hopTravelT",
    ()=>hopTravelT,
    "playableSlimeAnim",
    ()=>playableSlimeAnim,
    "slimeAnimKey",
    ()=>slimeAnimKey,
    "slimeBodyKey",
    ()=>slimeBodyKey,
    "slimeShadowKey",
    ()=>slimeShadowKey,
    "usesFinalArt",
    ()=>usesFinalArt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
;
;
const SLIME_FRAME_WIDTH = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
const SLIME_FRAME_HEIGHT = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
const SLIME_ORIGIN_X = 0.5;
const SLIME_ORIGIN_Y = 1;
const SLIME_ANIM = {
    IDLE: "idle",
    HOP: "hop",
    WORK: "work",
    FISH_CAST: "fish_cast",
    FISH_WAIT: "fish_wait",
    FISH_BITE: "fish_bite",
    FISH_PULL: "fish_pull",
    FISH_SUCCESS: "fish_success"
};
function playableSlimeAnim(anim) {
    if (anim === SLIME_ANIM.FISH_WAIT || anim === SLIME_ANIM.IDLE) {
        return SLIME_ANIM.IDLE;
    }
    if (anim === SLIME_ANIM.FISH_SUCCESS || anim === SLIME_ANIM.HOP) {
        return SLIME_ANIM.HOP;
    }
    if (anim === SLIME_ANIM.WORK) {
        return SLIME_ANIM.WORK;
    }
    return SLIME_ANIM.WORK;
}
const SLIME_COLORS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO]: {
        fill: "#4ea3e0",
        eye: "#1a2430"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO]: {
        fill: "#62c46a",
        eye: "#1a2430"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO]: {
        fill: "#e89a45",
        eye: "#1a2430"
    }
};
function pingoClip(anim, count, frameRate, repeat, extras = {}) {
    const textureKeys = [];
    const paths = [];
    for(let i = 1; i <= count; i += 1){
        const name = `pingo-${anim}-${String(i).padStart(2, "0")}`;
        textureKeys.push(name);
        paths.push(`/assets/slimes/pingo/${anim}/${name}.png`);
    }
    return {
        textureKeys,
        paths,
        frameRate,
        repeat,
        ...extras
    };
}
function folderClip(slime, folder, anim, count, frameRate, repeat, extras = {}) {
    const textureKeys = [];
    const paths = [];
    const filePrefix = slime === "tito" ? "Tito" : "Momo";
    const dir = slime === "tito" ? "Tito" : "Momo";
    for(let i = 1; i <= count; i += 1){
        textureKeys.push(`${slime}-${anim}-${i}`);
        paths.push(`/assets/slimes/${dir}/${folder}/${filePrefix}_${folder}${i}.png`);
    }
    return {
        textureKeys,
        paths,
        frameRate,
        repeat,
        ...extras
    };
}
const SLIME_VISUALS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO]: {
        kind: "final",
        frameWidth: 42,
        frameHeight: 65,
        originX: SLIME_ORIGIN_X,
        originY: SLIME_ORIGIN_Y,
        shadowFeetPadPx: 3,
        shadowScale: 0.8,
        anims: {
            idle: pingoClip(SLIME_ANIM.IDLE, 5, 6, -1),
            hop: pingoClip(SLIME_ANIM.HOP, 7, 9, 0, {
                syncToHopT: true,
                buildupFrames: 1
            }),
            work: pingoClip(SLIME_ANIM.WORK, 7, 8, -1)
        }
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO]: {
        kind: "final",
        frameWidth: 38,
        frameHeight: 57,
        originX: SLIME_ORIGIN_X,
        originY: SLIME_ORIGIN_Y,
        shadowFeetPadPx: 1,
        shadowScale: 0.8,
        anims: {
            idle: folderClip("momo", "Idle", SLIME_ANIM.IDLE, 4, 6, -1),
            hop: folderClip("momo", "Hop", SLIME_ANIM.HOP, 7, 9, 0, {
                syncToHopT: true,
                buildupFrames: 1
            }),
            work: folderClip("momo", "Work", SLIME_ANIM.WORK, 7, 8, -1)
        }
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO]: {
        kind: "final",
        frameWidth: 39,
        frameHeight: 38,
        originX: SLIME_ORIGIN_X,
        originY: SLIME_ORIGIN_Y,
        shadowFeetPadPx: 1,
        shadowScale: 0.8,
        anims: {
            idle: folderClip("tito", "Idle", SLIME_ANIM.IDLE, 4, 6, -1),
            hop: folderClip("tito", "Hop", SLIME_ANIM.HOP, 6, 9, 0, {
                syncToHopT: true,
                buildupFrames: 1
            }),
            work: folderClip("tito", "Work", SLIME_ANIM.WORK, 6, 8, -1)
        }
    }
};
function usesFinalArt(id) {
    return SLIME_VISUALS[id].kind === "final";
}
function hopTravelT(id, hopT) {
    const visual = SLIME_VISUALS[id];
    if (visual.kind !== "final") {
        return hopT;
    }
    const clip = visual.anims.hop;
    const frames = clip.textureKeys.length;
    const buildup = clip.buildupFrames ?? 0;
    if (buildup <= 0 || frames <= buildup) {
        return hopT;
    }
    const hold = buildup / frames;
    if (hopT <= hold) {
        return 0;
    }
    return (hopT - hold) / (1 - hold);
}
function slimeAnimKey(id, anim) {
    return `${id}-${anim}`;
}
function slimeBodyKey(id) {
    return `slime-body-${id}`;
}
function slimeShadowKey() {
    return "slime-shadow";
}
const PLACEHOLDER_SHADOW_OFFSET_Y = 1;
const CARRY_TEXTURE = {
    wood: "carry-wood",
    stone: "carry-stone",
    food: "carry-food"
};
const STORAGE_TEXTURE_KEY = "storage-marker";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/WaterAmbientSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WaterAmbientSystem",
    ()=>WaterAmbientSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
;
const CARDINALS = [
    {
        x: 1,
        y: 0
    },
    {
        x: -1,
        y: 0
    },
    {
        x: 0,
        y: 1
    },
    {
        x: 0,
        y: -1
    }
];
class WaterAmbientSystem {
    scene;
    grid;
    cells;
    ripples;
    waterMask;
    fish;
    nextRippleAt;
    nextFishAt;
    enabled;
    constructor(scene, grid, cells, ripples, waterMask){
        this.scene = scene;
        this.grid = grid;
        this.cells = cells;
        this.ripples = ripples;
        this.waterMask = waterMask;
        this.fish = [];
        this.nextRippleAt = 0;
        this.nextFishAt = 0;
        this.enabled = true;
        const now = scene.time.now;
        this.nextRippleAt = now + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomIntervalMs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].ambientRippleIntervalMs);
        this.nextFishAt = now + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomIntervalMs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowIntervalMs);
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    isEnabled() {
        return this.enabled;
    }
    fishCount() {
        return this.fish.length;
    }
    spawnFishShadow(worldX, worldY) {
        if (this.fish.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].maxFishShadows) {
            return;
        }
        let x;
        let y;
        if (worldX !== undefined && worldY !== undefined && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWaterWorld"])(this.grid, worldX, worldY)) {
            x = Math.floor(worldX);
            y = Math.floor(worldY);
        } else {
            const cell = this.pickCell(true);
            if (!cell) {
                return;
            }
            const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterEffectPoint"])(cell);
            x = point.x;
            y = point.y;
        }
        const dir = CARDINALS[Math.floor(Math.random() * CARDINALS.length)];
        const image = this.scene.add.image(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].fish).setOrigin(0.5, 0.5).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_FISH).setAlpha((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantizeAlpha"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowAlpha)).setMask(this.waterMask);
        image.setFlipX(dir.x < 0);
        this.fish.push({
            image,
            dirX: dir.x,
            dirY: dir.y,
            pixelAccum: 0,
            bornAt: this.scene.time.now,
            fading: false
        });
    }
    update(time, delta) {
        this.updateFish(time, delta);
        if (!this.enabled) {
            return;
        }
        if (time >= this.nextRippleAt) {
            this.nextRippleAt = time + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomIntervalMs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].ambientRippleIntervalMs);
            if (this.ripples.ambientCount() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].maxAmbientRipples) {
                const cell = this.pickCell(true);
                if (cell) {
                    const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterEffectPoint"])(cell);
                    this.ripples.spawnRipple(x, y, "ambient");
                }
            }
        }
        if (time >= this.nextFishAt) {
            this.nextFishAt = time + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomIntervalMs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowIntervalMs);
            this.spawnFishShadow();
        }
    }
    destroy() {
        for (const fish of this.fish){
            fish.image.destroy();
        }
        this.fish.length = 0;
    }
    updateFish(time, delta) {
        const step = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowSpeedPxPerSec * (delta / 1000);
        for(let i = this.fish.length - 1; i >= 0; i -= 1){
            const fish = this.fish[i];
            const age = time - fish.bornAt;
            if (age >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowDurationMs - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowFadeMs) {
                fish.fading = true;
            }
            if (age >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowDurationMs) {
                fish.image.destroy();
                this.fish.splice(i, 1);
                continue;
            }
            if (fish.fading) {
                const fadeLeft = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowDurationMs - age;
                const fade = fadeLeft / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowFadeMs;
                fish.image.setAlpha((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantizeAlpha"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].fishShadowAlpha * fade));
            }
            fish.pixelAccum += step;
            while(fish.pixelAccum >= 1){
                fish.pixelAccum -= 1;
                const nextX = Math.floor(fish.image.x) + fish.dirX;
                const nextY = Math.floor(fish.image.y) + fish.dirY;
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWaterWorld"])(this.grid, nextX, nextY)) {
                    fish.fading = true;
                    break;
                }
                fish.image.setPosition(nextX, nextY);
            }
        }
    }
    pickCell(visibleOnly) {
        if (this.cells.length === 0) {
            return undefined;
        }
        const pool = visibleOnly ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibleWaterCells"])(this.cells, this.scene.cameras.main.worldView) : [
            ...this.cells
        ];
        const source = pool.length > 0 ? pool : this.cells;
        return source[Math.floor(Math.random() * source.length)];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/WaterClueSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WaterClueSystem",
    ()=>WaterClueSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
;
const BUBBLE_COLOR = 0xe8f7ff;
const GLIMMER_COLOR = 0x7ef0ff;
class WaterClueSystem {
    scene;
    waterMask;
    spawnRipple;
    visuals;
    constructor(scene, waterMask, spawnRipple){
        this.scene = scene;
        this.waterMask = waterMask;
        this.spawnRipple = spawnRipple;
        this.visuals = new Map();
    }
    sync(clues, time) {
        const seen = new Set();
        for (const clue of clues){
            seen.add(clue.id);
            let visual = this.visuals.get(clue.id);
            if (!visual) {
                visual = {
                    view: clue,
                    graphics: this.scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_CLUE).setMask(this.waterMask),
                    lastRippleAt: 0
                };
                this.visuals.set(clue.id, visual);
            }
            visual.view = clue;
            this.drawClue(visual, time);
        }
        for (const [id, visual] of this.visuals){
            if (seen.has(id)) {
                continue;
            }
            visual.graphics.destroy();
            this.visuals.delete(id);
        }
    }
    destroy() {
        for (const visual of this.visuals.values()){
            visual.graphics.destroy();
        }
        this.visuals.clear();
    }
    drawClue(visual, time) {
        const { view, graphics } = visual;
        graphics.clear();
        if (!view.clueVisible) {
            return;
        }
        const x = Math.floor(view.worldX);
        const y = Math.floor(view.worldY);
        if (view.clueType === "small_bubbles") {
            this.drawBubbles(graphics, x, y, time);
            return;
        }
        if (view.clueType === "large_ripple") {
            this.maybeRipple(visual, time, 900, "clue_large");
            return;
        }
        this.drawGlimmer(graphics, x, y, time);
        this.maybeRipple(visual, time, 1300, "clue_glimmer");
    }
    maybeRipple(visual, time, intervalMs, type) {
        if (time - visual.lastRippleAt < intervalMs) {
            return;
        }
        visual.lastRippleAt = time;
        this.spawnRipple(visual.view.worldX, visual.view.worldY, type);
    }
    drawBubbles(graphics, x, y, time) {
        const phase = Math.floor(time / 180);
        graphics.fillStyle(BUBBLE_COLOR, 0.85);
        const offsets = [
            [
                0,
                -1 - phase % 3
            ],
            [
                2,
                1 - phase % 2
            ],
            [
                -2,
                0
            ]
        ];
        for (const [dx, dy] of offsets){
            if ((phase + dx + dy) % 4 === 0) {
                continue;
            }
            graphics.fillRect(x + dx, y + dy, 1, 1);
        }
    }
    drawGlimmer(graphics, x, y, time) {
        const pulse = Math.floor(time / 140) % 2 === 0;
        graphics.fillStyle(GLIMMER_COLOR, pulse ? 0.9 : 0.45);
        graphics.fillRect(x, y, 1, 1);
        graphics.fillRect(x + 2, y - 1, 1, 1);
        graphics.fillRect(x - 2, y + 1, 1, 1);
        if (pulse) {
            graphics.fillRect(x + 1, y + 2, 1, 1);
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/WaterRenderer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WaterRenderer",
    ()=>WaterRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$createWaterTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/createWaterTextures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterAmbientSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/WaterAmbientSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterRippleSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/WaterRippleSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterSurfaceOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/WaterSurfaceOverlay.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
class WaterRenderer {
    scene;
    grid;
    ignoreClick;
    cells;
    maskGfx;
    waterMask;
    surface;
    ripples;
    ambient;
    pointerHandler;
    destroyed;
    constructor(scene, grid, ignoreClick){
        this.scene = scene;
        this.grid = grid;
        this.ignoreClick = ignoreClick;
        this.destroyed = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$createWaterTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWaterTextures"])(scene);
        this.cells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectWaterCells"])(grid);
        this.maskGfx = scene.add.graphics().setVisible(false);
        for (const cell of this.cells){
            this.maskGfx.fillStyle(0xffffff, 1);
            this.maskGfx.fillRect(cell.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], cell.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
        }
        this.waterMask = this.maskGfx.createGeometryMask();
        this.surface = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterSurfaceOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WaterSurfaceOverlay"](scene, this.cells, this.waterMask);
        this.ripples = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterRippleSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WaterRippleSystem"](scene, grid, this.waterMask);
        this.ambient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterAmbientSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WaterAmbientSystem"](scene, grid, this.cells, this.ripples, this.waterMask);
        this.pointerHandler = (pointer)=>{
            if (!pointer.leftButtonDown() || pointer.rightButtonDown() || pointer.middleButtonDown()) {
                return;
            }
            if (this.ignoreClick?.()) {
                return;
            }
            this.spawnRipple(pointer.worldX, pointer.worldY, "click");
        };
        scene.input.on("pointerdown", this.pointerHandler);
        scene.events.once(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Scenes.Events.SHUTDOWN, ()=>this.destroy());
    }
    spawnRipple(worldX, worldY, type) {
        this.ripples.spawnRipple(worldX, worldY, type);
    }
    getWaterMask() {
        return this.waterMask;
    }
    spawnFishShadow(worldX, worldY) {
        this.ambient.spawnFishShadow(worldX, worldY);
    }
    spawnDebugRipple(tileX, tileY) {
        if (tileX !== null && tileY !== null && this.grid.getTile(tileX, tileY)) {
            const cell = this.cells.find((entry)=>entry.x === tileX && entry.y === tileY);
            if (cell) {
                const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterEffectPoint"])(cell);
                this.spawnRipple(x, y, "click");
                return;
            }
        }
        const cells = this.cells;
        if (cells.length === 0) {
            return;
        }
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterCellCenter"])(cells[Math.floor(cells.length / 2)]);
        this.spawnRipple(x, y, "click");
    }
    setSurfaceEnabled(enabled) {
        this.surface.setEnabled(enabled);
    }
    setAmbientEnabled(enabled) {
        this.ambient.setEnabled(enabled);
    }
    toggleSurface() {
        const next = !this.surface.isEnabled();
        this.surface.setEnabled(next);
        return next;
    }
    toggleAmbient() {
        const next = !this.ambient.isEnabled();
        this.ambient.setEnabled(next);
        return next;
    }
    toggleDepthBounds() {
        const next = !this.surface.isDepthBoundsVisible();
        this.surface.setDepthBoundsVisible(next);
        return next;
    }
    update(time, delta) {
        this.surface.update(time);
        this.ripples.update(time);
        this.ambient.update(time, delta);
    }
    debugSnapshot() {
        return {
            activeRipples: this.ripples.count(),
            activeFishShadows: this.ambient.fishCount(),
            waterSurfaceOn: this.surface.isEnabled(),
            waterAmbientOn: this.ambient.isEnabled(),
            waterDepthBoundsOn: this.surface.isDepthBoundsVisible()
        };
    }
    destroy() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.scene.input.off("pointerdown", this.pointerHandler);
        this.surface.destroy();
        this.ripples.destroy();
        this.ambient.destroy();
        this.waterMask.destroy();
        this.maskGfx.destroy();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/WaterRippleSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WaterRippleSystem",
    ()=>WaterRippleSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
;
class WaterRippleSystem {
    scene;
    grid;
    waterMask;
    ripples;
    constructor(scene, grid, waterMask){
        this.scene = scene;
        this.grid = grid;
        this.waterMask = waterMask;
        this.ripples = [];
    }
    spawnRipple(worldX, worldY, type) {
        const x = Math.floor(worldX);
        const y = Math.floor(worldY);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWaterWorld"])(this.grid, x, y)) {
            return;
        }
        if (this.ripples.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].maxRipples) {
            const oldest = this.ripples.shift();
            oldest?.graphics.destroy();
        }
        const graphics = this.scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_RIPPLE).setMask(this.waterMask);
        this.ripples.push({
            graphics,
            x,
            y,
            type,
            bornAt: this.scene.time.now,
            lastRadius: -1,
            lastAlpha: -1
        });
        this.drawRipple(this.ripples[this.ripples.length - 1], 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIPPLE_PRESETS"][type].startAlpha);
    }
    count() {
        return this.ripples.length;
    }
    ambientCount() {
        return this.ripples.filter((ripple)=>ripple.type === "ambient").length;
    }
    update(time) {
        for(let i = this.ripples.length - 1; i >= 0; i -= 1){
            const ripple = this.ripples[i];
            const preset = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIPPLE_PRESETS"][ripple.type];
            const elapsed = time - ripple.bornAt;
            if (elapsed >= preset.durationMs) {
                ripple.graphics.destroy();
                this.ripples.splice(i, 1);
                continue;
            }
            const radius = Math.min(preset.maxRadius, Math.floor(elapsed / preset.stepMs));
            const life = 1 - elapsed / preset.durationMs;
            const alpha = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantizeAlpha"])(preset.startAlpha * life);
            if (radius === ripple.lastRadius && alpha === ripple.lastAlpha) {
                continue;
            }
            ripple.lastRadius = radius;
            ripple.lastAlpha = alpha;
            this.drawRipple(ripple, radius, alpha);
        }
    }
    destroy() {
        for (const ripple of this.ripples){
            ripple.graphics.destroy();
        }
        this.ripples.length = 0;
    }
    drawRipple(ripple, radius, alpha) {
        const { graphics, x, y, type } = ripple;
        graphics.clear();
        if (alpha <= 0) {
            return;
        }
        graphics.fillStyle(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIPPLE_PRESETS"][type].color, alpha);
        if (radius <= 0) {
            graphics.fillRect(x, y, 1, 1);
            graphics.fillRect(x - 1, y, 1, 1);
            graphics.fillRect(x + 1, y, 1, 1);
            return;
        }
        for(let dx = -radius; dx <= radius; dx += 1){
            const dy = radius - Math.abs(dx);
            graphics.fillRect(x + dx, y + dy, 1, 1);
            if (dy !== 0) {
                graphics.fillRect(x + dx, y - dy, 1, 1);
            }
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/WaterSurfaceOverlay.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WaterSurfaceOverlay",
    ()=>WaterSurfaceOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$bakeWaterDepthTexture$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/bakeWaterDepthTexture.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterDepthTransition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterDepthTransition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
;
;
;
class WaterSurfaceOverlay {
    cells;
    waterMask;
    depthImage;
    debugGfx;
    surface;
    offset;
    nextSurfaceAt;
    enabled;
    depthBoundsVisible;
    constructor(scene, cells, waterMask){
        this.cells = cells;
        this.waterMask = waterMask;
        this.offset = 0;
        this.nextSurfaceAt = 0;
        this.enabled = true;
        this.depthBoundsVisible = false;
        this.depthImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$bakeWaterDepthTexture$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bakeWaterDepthTexture"])(scene, cells);
        this.debugGfx = scene.add.graphics().setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_SHORE + 0.02).setVisible(false);
        const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterBoundsPx"])(cells);
        if (bounds) {
            this.surface = scene.add.tileSprite(bounds.x, bounds.y, bounds.width, bounds.height, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].surface).setOrigin(0, 0).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_SURFACE).setAlpha(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].surfaceAlpha).setMask(this.waterMask);
        }
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        this.depthImage?.setVisible(enabled);
        this.surface?.setVisible(enabled);
    }
    isEnabled() {
        return this.enabled;
    }
    setDepthBoundsVisible(visible) {
        this.depthBoundsVisible = visible;
        this.debugGfx.setVisible(visible);
        if (visible) {
            this.drawDepthBounds();
        } else {
            this.debugGfx.clear();
        }
    }
    isDepthBoundsVisible() {
        return this.depthBoundsVisible;
    }
    update(time) {
        if (!this.enabled) {
            return;
        }
        if (time >= this.nextSurfaceAt) {
            this.offset = (this.offset + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].surfaceStepPx) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_PATTERN_SIZE"];
            if (this.surface) {
                this.surface.tilePositionX = this.offset;
                this.surface.tilePositionY = Math.floor(this.offset / 2);
            }
            this.nextSurfaceAt = time + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].surfaceStepMs;
        }
    }
    destroy() {
        this.depthImage?.destroy();
        this.debugGfx.destroy();
        this.surface?.destroy();
    }
    drawDepthBounds() {
        this.debugGfx.clear();
        for (const cell of this.cells){
            const x = cell.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
            const y = cell.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
            if (cell.interior) {
                this.debugGfx.fillStyle(0x1a3a80, 0.28);
            } else {
                this.debugGfx.fillStyle(0x4ec8e8, 0.22);
            }
            this.debugGfx.fillRect(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
            this.debugGfx.lineStyle(1, 0xffe066, 0.9);
            const dirs = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterDepthTransition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionDirs"])(cell).map((item)=>item.dir));
            if (dirs.has("n")) {
                this.debugGfx.strokeRect(x + 0.5, y + 0.5, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1, 1);
            }
            if (dirs.has("s")) {
                this.debugGfx.strokeRect(x + 0.5, y + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1.5, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1, 1);
            }
            if (dirs.has("w")) {
                this.debugGfx.strokeRect(x + 0.5, y + 0.5, 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1);
            }
            if (dirs.has("e")) {
                this.debugGfx.strokeRect(x + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1.5, y + 0.5, 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] - 1);
            }
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/bakeWaterDepthTexture.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bakeWaterDepthTexture",
    ()=>bakeWaterDepthTexture
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterDepthTransition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterDepthTransition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$createWaterTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/createWaterTextures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
;
;
;
const TONE_RGBA = {
    shallowDark: hexRgba(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthShallowDark, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionAlpha),
    deepLight: hexRgba(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthDeepLight, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionAlpha),
    deep: hexRgba(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthInteriorColor, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthInteriorAlpha),
    sediment: hexRgba(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthSediment, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthSedimentAlpha)
};
function bakeWaterDepthTexture(scene, cells) {
    const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterBoundsPx"])(cells);
    if (!bounds) {
        return undefined;
    }
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$createWaterTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canvasContext"])(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].depth, bounds.width, bounds.height);
    ctx.clearRect(0, 0, bounds.width, bounds.height);
    ctx.imageSmoothingEnabled = false;
    for (const cell of cells){
        for(let ly = 0; ly < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]; ly += 1){
            for(let lx = 0; lx < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]; lx += 1){
                const wx = cell.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + lx;
                const wy = cell.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + ly;
                const tone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterDepthTransition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["depthToneAt"])(cell, wx, wy);
                if (tone === "shallow") {
                    continue;
                }
                const rgba = TONE_RGBA[tone];
                ctx.fillStyle = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255})`;
                ctx.fillRect(wx - bounds.x, wy - bounds.y, 1, 1);
            }
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$createWaterTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commit"])(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].depth);
    return scene.add.image(bounds.x, bounds.y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].depth).setOrigin(0, 0).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].WATER_DEPTH);
}
function hexRgba(hex, alpha) {
    return {
        r: hex >> 16 & 0xff,
        g: hex >> 8 & 0xff,
        b: hex & 0xff,
        a: Math.max(0, Math.min(255, Math.round(alpha * 255)))
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/createWaterTextures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canvasContext",
    ()=>canvasContext,
    "commit",
    ()=>commit,
    "createWaterTextures",
    ()=>createWaterTextures
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
function canvasContext(scene, key, width, height) {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const texture = scene.textures.createCanvas(key, width, height);
    if (!texture) {
        throw new Error(`Failed to create texture ${key}`);
    }
    const context = texture.getContext();
    context.imageSmoothingEnabled = false;
    return context;
}
function commit(scene, key) {
    const texture = scene.textures.get(key);
    texture.refresh();
    texture.setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
}
function paintSurface(ctx) {
    ctx.clearRect(0, 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_PATTERN_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_PATTERN_SIZE"]);
    ctx.fillStyle = "rgba(18, 58, 92, 0.55)";
    ctx.fillRect(3, 7, 5, 1);
    ctx.fillRect(18, 21, 6, 1);
    ctx.fillRect(10, 28, 4, 1);
    ctx.fillStyle = "rgba(168, 232, 248, 0.7)";
    ctx.fillRect(8, 6, 2, 1);
    ctx.fillRect(22, 14, 1, 1);
    ctx.fillRect(4, 19, 1, 1);
    ctx.fillRect(27, 3, 2, 1);
    ctx.fillRect(15, 11, 1, 1);
    ctx.fillStyle = "rgba(12, 40, 70, 0.45)";
    ctx.fillRect(20, 8, 3, 1);
    ctx.fillRect(6, 24, 2, 1);
}
function paintFish(ctx) {
    ctx.clearRect(0, 0, 8, 4);
    ctx.fillStyle = "rgba(8, 22, 40, 1)";
    ctx.fillRect(2, 0, 4, 1);
    ctx.fillRect(1, 1, 6, 1);
    ctx.fillRect(1, 2, 6, 1);
    ctx.fillRect(2, 3, 1, 1);
    ctx.fillRect(5, 3, 1, 1);
}
function createWaterTextures(scene) {
    paintSurface(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].surface, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_PATTERN_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_PATTERN_SIZE"]));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].surface);
    paintFish(canvasContext(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].fish, 8, 4));
    commit(scene, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_TEXTURE"].fish);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SHORE_EFFECT_INSET_PX",
    ()=>SHORE_EFFECT_INSET_PX,
    "collectWaterCells",
    ()=>collectWaterCells,
    "isWaterTile",
    ()=>isWaterTile,
    "isWaterWorld",
    ()=>isWaterWorld,
    "visibleWaterCells",
    ()=>visibleWaterCells,
    "waterBoundsPx",
    ()=>waterBoundsPx,
    "waterCellCenter",
    ()=>waterCellCenter,
    "waterEffectPoint",
    ()=>waterEffectPoint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
;
;
function isWaterTile(grid, x, y) {
    return grid.getTile(x, y)?.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER;
}
function isWaterWorld(grid, worldX, worldY) {
    const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldToTile"])(worldX, worldY);
    return isWaterTile(grid, x, y);
}
function collectWaterCells(grid) {
    const cells = [];
    const emptyFaces = {
        n: false,
        e: false,
        s: false,
        w: false
    };
    for(let y = 0; y < grid.height; y += 1){
        for(let x = 0; x < grid.width; x += 1){
            if (!isWaterTile(grid, x, y)) {
                continue;
            }
            const n = isWaterTile(grid, x, y - 1);
            const e = isWaterTile(grid, x + 1, y);
            const s = isWaterTile(grid, x, y + 1);
            const w = isWaterTile(grid, x - 1, y);
            const ne = isWaterTile(grid, x + 1, y - 1);
            const se = isWaterTile(grid, x + 1, y + 1);
            const sw = isWaterTile(grid, x - 1, y + 1);
            const nw = isWaterTile(grid, x - 1, y - 1);
            cells.push({
                x,
                y,
                // Deep water only when land does not touch this cell, even diagonally.
                // Inner-corner shoreline art lives on 4-way water with one land diagonal.
                interior: n && e && s && w && ne && se && sw && nw,
                openEdges: {
                    n: !n,
                    e: !e,
                    s: !s,
                    w: !w
                },
                facesDeep: {
                    ...emptyFaces
                },
                facesShallow: {
                    ...emptyFaces
                }
            });
        }
    }
    const byKey = new Map(cells.map((cell)=>[
            `${cell.x},${cell.y}`,
            cell
        ]));
    for (const cell of cells){
        const neighbor = (dx, dy)=>byKey.get(`${cell.x + dx},${cell.y + dy}`);
        const n = neighbor(0, -1);
        const e = neighbor(1, 0);
        const s = neighbor(0, 1);
        const w = neighbor(-1, 0);
        cell.facesDeep = {
            n: n?.interior === true,
            e: e?.interior === true,
            s: s?.interior === true,
            w: w?.interior === true
        };
        cell.facesShallow = {
            n: n != null && !n.interior,
            e: e != null && !e.interior,
            s: s != null && !s.interior,
            w: w != null && !w.interior
        };
    }
    return cells;
}
function waterCellCenter(cell) {
    return {
        x: cell.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2,
        y: cell.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2
    };
}
const SHORE_EFFECT_INSET_PX = 7;
function waterEffectPoint(cell) {
    const center = waterCellCenter(cell);
    if (cell.interior) {
        return center;
    }
    const inset = SHORE_EFFECT_INSET_PX;
    let { x, y } = center;
    if (cell.openEdges.n) {
        y += inset;
    }
    if (cell.openEdges.s) {
        y -= inset;
    }
    if (cell.openEdges.w) {
        x += inset;
    }
    if (cell.openEdges.e) {
        x -= inset;
    }
    return {
        x,
        y
    };
}
function waterBoundsPx(cells) {
    if (cells.length === 0) {
        return null;
    }
    let minX = cells[0].x;
    let minY = cells[0].y;
    let maxX = cells[0].x;
    let maxY = cells[0].y;
    for (const cell of cells){
        minX = Math.min(minX, cell.x);
        minY = Math.min(minY, cell.y);
        maxX = Math.max(maxX, cell.x);
        maxY = Math.max(maxY, cell.y);
    }
    return {
        x: minX * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        y: minY * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        width: (maxX - minX + 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        height: (maxY - minY + 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]
    };
}
function visibleWaterCells(cells, view) {
    const x1 = view.x;
    const y1 = view.y;
    const x2 = view.x + view.width;
    const y2 = view.y + view.height;
    return cells.filter((cell)=>{
        const left = cell.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
        const top = cell.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
        return left < x2 && left + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] > x1 && top < y2 && top + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] > y1;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/waterDepthTransition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bandWidth",
    ()=>bandWidth,
    "depthToneAt",
    ()=>depthToneAt,
    "depthToneFromSigned",
    ()=>depthToneFromSigned,
    "hash2",
    ()=>hash2,
    "seamWobble",
    ()=>seamWobble,
    "signedInsideDeep",
    ()=>signedInsideDeep,
    "transitionDirs",
    ()=>transitionDirs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)");
;
;
const SIDES = [
    "n",
    "e",
    "s",
    "w"
];
const OPPOSITE = {
    n: "s",
    e: "w",
    s: "n",
    w: "e"
};
const DEEP_DELTA = {
    n: {
        dx: 0,
        dy: -1
    },
    e: {
        dx: 1,
        dy: 0
    },
    s: {
        dx: 0,
        dy: 1
    },
    w: {
        dx: -1,
        dy: 0
    }
};
function hash2(x, y) {
    let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    n = Math.imul(n ^ n >>> 13, 1274126177);
    return n >>> 0;
}
function seamWobble(along) {
    const run = Math.floor(along / 4);
    const span = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionWobblePx * 2 + 1;
    const coarse = hash2(run, 901) % span - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionWobblePx;
    const nick = hash2(along, 407) % 13 === 0 ? hash2(along, 19) % 3 - 1 : 0;
    return coarse + nick;
}
function bandWidth(along) {
    const width = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionBandPx + Math.min(1, Math.abs(seamWobble(along)) - 1);
    return Math.max(4, Math.min(10, width));
}
function signedInsideDeep(cell, wx, wy) {
    if (cell.interior) {
        let min = 64;
        let facing = false;
        for (const dir of SIDES){
            if (!cell.facesShallow[dir]) {
                continue;
            }
            facing = true;
            min = Math.min(min, signedFromDeepEdge(cell.x, cell.y, dir, wx, wy));
        }
        return facing ? min : 64;
    }
    let max = -64;
    let facing = false;
    for (const dir of SIDES){
        if (!cell.facesDeep[dir]) {
            continue;
        }
        facing = true;
        const { dx, dy } = DEEP_DELTA[dir];
        max = Math.max(max, signedFromDeepEdge(cell.x + dx, cell.y + dy, OPPOSITE[dir], wx, wy));
    }
    return facing ? max : -64;
}
function depthToneFromSigned(signed, wx, wy) {
    const band = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_VFX"].depthTransitionBandPx;
    const cluster = hash2(wx >> 1, wy >> 1);
    const speck = hash2(wx, wy);
    if (signed > band) {
        if (signed <= band + 4 && speck % 16 === 0) {
            return "sediment";
        }
        return "deep";
    }
    if (signed < -band) {
        if (signed >= -band - 3 && speck % 18 === 0) {
            return "deepLight";
        }
        return "shallow";
    }
    if (Math.abs(signed) <= 1 && speck % 12 === 0) {
        return "sediment";
    }
    if (signed >= 2) {
        return cluster % 4 === 0 ? "shallowDark" : "deepLight";
    }
    if (signed <= -2) {
        return cluster % 4 === 0 ? "deepLight" : "shallowDark";
    }
    return cluster % 2 === 0 ? "deepLight" : "shallowDark";
}
function depthToneAt(cell, wx, wy) {
    return depthToneFromSigned(signedInsideDeep(cell, wx, wy), wx, wy);
}
function transitionDirs(cell) {
    const dirs = [];
    for (const dir of SIDES){
        if (cell.interior) {
            if (cell.facesShallow[dir]) {
                dirs.push({
                    dir,
                    fromShallow: false
                });
            }
        } else if (cell.facesDeep[dir]) {
            dirs.push({
                dir,
                fromShallow: true
            });
        }
    }
    return dirs;
}
function signedFromDeepEdge(deepX, deepY, dirTowardShallow, wx, wy) {
    const ox = deepX * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
    const oy = deepY * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
    if (dirTowardShallow === "w") {
        return wx - (ox + seamWobble(wy));
    }
    if (dirTowardShallow === "e") {
        return ox + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + seamWobble(wy) - wx;
    }
    if (dirTowardShallow === "n") {
        return wy - (oy + seamWobble(wx));
    }
    return oy + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + seamWobble(wx) - wy;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/render/water/waterVisualConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RIPPLE_PRESETS",
    ()=>RIPPLE_PRESETS,
    "WATER_PATTERN_SIZE",
    ()=>WATER_PATTERN_SIZE,
    "WATER_TEXTURE",
    ()=>WATER_TEXTURE,
    "WATER_VFX",
    ()=>WATER_VFX,
    "quantizeAlpha",
    ()=>quantizeAlpha,
    "randomIntervalMs",
    ()=>randomIntervalMs
]);
const WATER_TEXTURE = {
    surface: "water-surface-pattern",
    fish: "water-fish-shadow",
    depth: "water-depth-transition"
};
const WATER_PATTERN_SIZE = 32;
const RIPPLE_PRESETS = {
    ambient: {
        durationMs: 1100,
        stepMs: 90,
        maxRadius: 5,
        color: 0xc8eef8,
        startAlpha: 0.45
    },
    click: {
        durationMs: 780,
        stepMs: 70,
        maxRadius: 7,
        color: 0xd8f6ff,
        startAlpha: 0.7
    },
    fish: {
        durationMs: 900,
        stepMs: 80,
        maxRadius: 4,
        color: 0xb8dce8,
        startAlpha: 0.4
    },
    rain: {
        durationMs: 520,
        stepMs: 60,
        maxRadius: 3,
        color: 0xc8eef8,
        startAlpha: 0.35
    },
    cast: {
        durationMs: 860,
        stepMs: 70,
        maxRadius: 8,
        color: 0xd8f6ff,
        startAlpha: 0.65
    },
    bite: {
        durationMs: 720,
        stepMs: 65,
        maxRadius: 6,
        color: 0xe8fbff,
        startAlpha: 0.75
    },
    rare: {
        durationMs: 1200,
        stepMs: 85,
        maxRadius: 9,
        color: 0xf0fdff,
        startAlpha: 0.8
    },
    slime: {
        durationMs: 800,
        stepMs: 70,
        maxRadius: 6,
        color: 0xd8f6ff,
        startAlpha: 0.6
    },
    clue_large: {
        durationMs: 1100,
        stepMs: 80,
        maxRadius: 10,
        color: 0xd0f0ff,
        startAlpha: 0.72
    },
    clue_glimmer: {
        durationMs: 1400,
        stepMs: 90,
        maxRadius: 8,
        color: 0x9ef6ff,
        startAlpha: 0.85
    }
};
const WATER_VFX = {
    surfaceStepMs: 280,
    surfaceStepPx: 1,
    surfaceAlpha: 0.42,
    depthInteriorColor: 0x071c32,
    depthInteriorAlpha: 0.48,
    depthEdgeColor: 0x7adcf2,
    depthEdgeAlpha: 0.14,
    depthShallowDark: 0x247090,
    depthDeepLight: 0x4a9cbc,
    depthSediment: 0x1a3c58,
    depthSedimentAlpha: 0.32,
    depthTransitionAlpha: 0.4,
    depthTransitionBandPx: 6,
    depthTransitionWobblePx: 4,
    shorelineStepMs: 420,
    shorelineColor: 0xd4f4ff,
    shorelineAlpha: 0.55,
    maxRipples: 8,
    ambientRippleIntervalMs: {
        min: 3200,
        max: 5800
    },
    fishShadowIntervalMs: {
        min: 9000,
        max: 16000
    },
    fishShadowSpeedPxPerSec: 7,
    fishShadowDurationMs: 3800,
    fishShadowFadeMs: 700,
    fishShadowAlpha: 0.38,
    maxFishShadows: 2,
    maxAmbientRipples: 2
};
function randomIntervalMs(range) {
    return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}
function quantizeAlpha(alpha) {
    return Math.max(0, Math.min(1, Math.round(alpha * 4) / 4));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/scenes/BootScene.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BootScene",
    ()=>BootScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$createPlaceholderTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/createPlaceholderTextures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$loadSlimeVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/loadSlimeVisuals.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$loadFishingVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/loadFishingVisuals.ts [app-client] (ecmascript)");
;
;
;
;
;
;
class BootScene extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Scene {
    constructor(){
        super(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SCENE_KEYS"].BOOT);
    }
    preload() {
        this.load.spritesheet(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_KEY"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_PATH"], {
            frameWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
            frameHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]
        });
        for (const { key, path } of (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldImageLoads"])()){
            this.load.image(key, path);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$loadSlimeVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preloadSlimeVisuals"])(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$loadFishingVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preloadFishingVisuals"])(this);
    }
    create() {
        const source = this.textures.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_KEY"]).getSourceImage();
        const width = source.width;
        const height = source.height;
        if (width !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_SOURCE_WIDTH"] || height !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_SOURCE_HEIGHT"]) {
            const message = `Tileset size mismatch: expected ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_SOURCE_WIDTH"]}x${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_SOURCE_HEIGHT"]}, got ${width}x${height}`;
            console.error(message);
            this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
                fontFamily: "monospace",
                fontSize: "8px",
                color: "#ffb4b4",
                align: "center",
                wordWrap: {
                    width: this.scale.width - 24
                }
            }).setOrigin(0.5);
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$createPlaceholderTextures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPlaceholderTextures"])(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$loadSlimeVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlimeAnimations"])(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$loadFishingVisuals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFishingAnimations"])(this);
        this.textures.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_KEY"]).setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
        for (const { key } of (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldImageLoads"])()){
            if (this.textures.exists(key)) {
                this.textures.get(key).setFilter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Textures.FilterMode.NEAREST);
            }
        }
        this.scene.start(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SCENE_KEYS"].VILLAGE);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/scenes/VillageScene.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VillageScene",
    ()=>VillageScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/phaser/dist/phaser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/config.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$CameraController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/input/CameraController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$SelectionController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/input/SelectionController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$FarmDesignationController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/input/FarmDesignationController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$FishingController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/input/FishingController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$inspectWorld$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/inspectWorld.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$SlimeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/SlimeRenderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/WaterRenderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterClueSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/WaterClueSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$FishingRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/FishingRenderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/fishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/fishing/pingoFishingVisualConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const UI_PUSH_MS = 100;
class VillageScene extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Scene {
    cameraController;
    simulation;
    slimeRenderer;
    waterRenderer;
    farmLayer;
    farmTool;
    fishingTool;
    fishingRenderer;
    waterClues;
    selection;
    detailSprites = new Map();
    lastUiPush = 0;
    toastedBiteIds = new Set();
    toastedCatchIds = new Set();
    constructor(){
        super(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SCENE_KEYS"].VILLAGE);
    }
    create() {
        const simulation = this.registry.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["REGISTRY_KEYS"].SIMULATION);
        if (!simulation) {
            throw new Error("VillageScene requires Simulation in the Phaser registry.");
        }
        this.simulation = simulation;
        const { grid } = simulation.state;
        const worldWidth = grid.worldWidthPx();
        const worldHeight = grid.worldHeightPx();
        const map = this.make.tilemap({
            data: grid.terrainFrameGrid(),
            tileWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
            tileHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]
        });
        const tileset = map.addTilesetImage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_KEY"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TILESET_KEY"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]);
        if (!tileset) {
            throw new Error("Failed to create tileset from loaded texture.");
        }
        const ground = map.createLayer(0, tileset, 0, 0);
        ground?.setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].GROUND);
        if (ground) {
            for(let y = 0; y < grid.height; y += 1){
                for(let x = 0; x < grid.width; x += 1){
                    const rotationDeg = grid.terrainRotationAt(x, y);
                    if (rotationDeg === 0) {
                        continue;
                    }
                    const tile = ground.getTileAt(x, y);
                    if (tile) {
                        tile.rotation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Math.DegToRad(rotationDeg);
                    }
                }
            }
        }
        const farm = map.createBlankLayer("farming", tileset, 0, 0);
        farm?.setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].FARMING);
        this.farmLayer = farm ?? undefined;
        if (farm) {
            const farmFrames = grid.farmingFrameGrid();
            for(let y = 0; y < grid.height; y += 1){
                for(let x = 0; x < grid.width; x += 1){
                    const frame = farmFrames[y][x];
                    if (frame >= 0) {
                        farm.putTileAt(frame, x, y);
                    }
                }
            }
        }
        for(let y = 0; y < grid.height; y += 1){
            for(let x = 0; x < grid.width; x += 1){
                const detail = grid.getTile(x, y)?.detail;
                if (!detail) {
                    continue;
                }
                const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DETAIL_DEFS"][detail];
                const pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(x, y);
                const sprite = this.add.image(pos.x, pos.y, def.textureKey).setOrigin(0, 0).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].GROUND_DETAIL);
                this.detailSprites.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(x, y), sprite);
            }
        }
        for (const object of grid.objects){
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][object.type];
            const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tileToWorld"])(object.x, object.y);
            this.add.image(x + def.originX * def.footprintWidth * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], y + def.originY * def.footprintHeight * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"], def.textureKey).setOrigin(def.originX, def.originY).setDepth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEPTH"].OBJECTS + object.y + def.footprintHeight - 1);
        }
        this.cameras.main.setRoundPixels(true);
        this.cameraController = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$CameraController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CameraController"](this, {
            width: worldWidth,
            height: worldHeight
        });
        this.slimeRenderer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$SlimeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlimeRenderer"](this, simulation);
        this.waterRenderer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WaterRenderer"](this, grid, ()=>this.fishingTool?.ownsPointer() ?? false);
        this.waterClues = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$WaterClueSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WaterClueSystem"](this, this.waterRenderer.getWaterMask(), (x, y, type)=>{
            this.waterRenderer?.spawnRipple(x, y, type);
        });
        this.fishingRenderer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$FishingRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FishingRenderer"](this, (x, y, type)=>{
            this.waterRenderer?.spawnRipple(x, y, type);
        });
        this.farmTool = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$FarmDesignationController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmDesignationController"](this, simulation);
        this.fishingTool = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$FishingController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FishingController"](this, simulation);
        this.selection = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$input$2f$SelectionController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectionController"](this, grid, (x, y)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$inspectWorld$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspectWorldTile"])(grid, simulation.state, x, y), (pointer)=>this.handleSlimeClick(pointer));
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setDebugActions({
            spawnGatherWood: ()=>this.spawnTask("gather_wood"),
            spawnGatherStone: ()=>this.spawnTask("gather_stone"),
            clearTasks: ()=>simulation.clearTasks(),
            resetSlimes: ()=>simulation.resetSlimes(),
            addTestResource: ()=>simulation.addTestResource(),
            addFood: ()=>simulation.addFood(),
            setAllSlimesHungry: ()=>simulation.setAllSlimesHungry(),
            instantGrowCrops: ()=>simulation.instantGrowCrops(),
            clearFarms: ()=>simulation.clearFarms(),
            spawnWaterRipple: ()=>{
                const { selectedX, selectedY } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState();
                this.waterRenderer?.spawnDebugRipple(selectedX, selectedY);
            },
            spawnFishShadow: ()=>this.waterRenderer?.spawnFishShadow(),
            toggleWaterSurface: ()=>{
                const on = this.waterRenderer?.toggleSurface();
                if (on !== undefined) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                        waterSurfaceOn: on
                    });
                }
            },
            toggleAmbientWaterFx: ()=>{
                const on = this.waterRenderer?.toggleAmbient();
                if (on !== undefined) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                        waterAmbientOn: on
                    });
                }
            },
            toggleWaterDepthBounds: ()=>{
                const on = this.waterRenderer?.toggleDepthBounds();
                if (on !== undefined) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                        waterDepthBoundsOn: on
                    });
                }
            },
            spawnBlueDarter: ()=>this.spawnDebugFish("blue_darter"),
            spawnPondCarp: ()=>this.spawnDebugFish("pond_carp"),
            spawnMoonGlimmer: ()=>this.spawnDebugFish("moon_glimmer"),
            clearAquaticActivities: ()=>simulation.clearAquaticActivities(),
            forceFishingBite: ()=>simulation.forceFishingBite(),
            autoSucceedFishing: ()=>simulation.autoSucceedFishing(this.time.now),
            resetFishCollection: ()=>simulation.resetFishCollection(),
            toggleFishingRadiusOverlay: ()=>{
                const on = !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().fishingRadiusOverlayOn;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                    fishingRadiusOverlayOn: on
                });
            },
            toggleInterestPointOverlay: ()=>{
                const on = !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().interestPointOverlayOn;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                    interestPointOverlayOn: on
                });
            },
            forcePingoObserveWater: ()=>simulation.forceAmbient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO, "observe_water"),
            forceMomoInspectFarm: ()=>simulation.forceAmbient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO, "inspect_farm"),
            forceTitoInspectNature: ()=>simulation.forceAmbient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO, "inspect_nature"),
            forceSocialGreet: ()=>simulation.forceSocialGreet(),
            clearAmbientBehaviors: ()=>simulation.clearAmbientBehaviors()
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
            mapWidth: grid.width,
            mapHeight: grid.height,
            selectedX: null,
            selectedY: null,
            hoveredX: null,
            hoveredY: null,
            hoveredTile: null,
            selectedTile: null,
            selectedSlimeId: null,
            selectedSlime: null,
            activeRipples: 0,
            activeFishShadows: 0,
            waterSurfaceOn: true,
            waterAmbientOn: true,
            waterDepthBoundsOn: false,
            fishingRadiusOverlayOn: false,
            fishingHud: null,
            catchToast: null
        });
        this.game.canvas.tabIndex = 0;
        this.game.canvas.focus();
        this.input.keyboard?.addCapture(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$phaser$2f$dist$2f$phaser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard?.on("keydown", (event)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().debugVisible) {
                return;
            }
            if (event.key !== "[" && event.key !== "]") {
                return;
            }
            const dir = event.key === "]" ? 1 : -1;
            const next = event.shiftKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nudgePingoRod"])(0, dir) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$pingoFishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nudgePingoRod"])(dir, 0);
            console.log("pingo rod nudge", next);
        });
        this.input.on("pointerdown", ()=>{
            this.game.canvas.focus();
        });
    }
    update(_time, delta) {
        this.cameraController?.update(delta);
        const simulation = this.simulation;
        if (!simulation) {
            return;
        }
        const alpha = simulation.update(delta);
        simulation.advanceFishingClock(this.time.now);
        this.syncFarmVisuals();
        this.farmTool?.sync();
        this.fishingTool?.sync();
        this.slimeRenderer?.sync(alpha, this.time.now);
        this.waterRenderer?.update(this.time.now, delta);
        this.waterClues?.sync(simulation.clueSnapshot(), this.time.now);
        const showRadius = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().fishingRadiusOverlayOn;
        const showInterest = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().interestPointOverlayOn;
        const showVisualDebug = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().debugVisible;
        this.fishingRenderer?.sync(simulation.state.fishingSessions, simulation.state.activities, simulation.state.slimes, simulation.state.fishingAccessPoints, alpha, simulation.state.tickIndex, this.time.now, showRadius, showInterest, showVisualDebug, simulation.state.interestPoints, simulation.state.grid);
        const follow = this.fishingRenderer?.visualAnchors()[0];
        if (follow) {
            this.cameraController?.followFishingIfNeeded(follow.feetX, follow.feetY, follow.bobberX, follow.bobberY, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].cameraLerp, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$fishing$2f$fishingVisualConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_PRESENTATION"].cameraMarginPx);
        }
        this.syncFishingHud(simulation);
        const now = this.time.now;
        if (now - this.lastUiPush < UI_PUSH_MS) {
            return;
        }
        this.lastUiPush = now;
        const camera = this.cameras.main;
        const { state } = simulation;
        const tasks = Object.values(state.tasks);
        const farms = Object.values(state.farms);
        const selectedId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().selectedSlimeId;
        const water = this.waterRenderer?.debugSnapshot();
        const hungers = Object.values(state.slimes).map((slime)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hungerState"])(slime.satiety));
        this.selection?.refreshInspect();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
            fps: Math.round(this.game.loop.actualFps),
            cameraX: Math.round(camera.midPoint.x),
            cameraY: Math.round(camera.midPoint.y),
            zoom: camera.zoom,
            simTps: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICKS_PER_SECOND"],
            slimeCount: Object.keys(state.slimes).length,
            availableTasks: tasks.filter((task)=>task.state === "available").length,
            assignedTasks: tasks.filter((task)=>task.state === "assigned" || task.state === "in_progress").length,
            wood: state.resources.wood,
            stone: state.resources.stone,
            food: state.resources.food,
            farmTiles: farms.length,
            growingCrops: farms.filter((plot)=>plot.state === "growing" || plot.state === "planted").length,
            readyCrops: farms.filter((plot)=>plot.state === "ready").length,
            hungrySlimes: hungers.filter((value)=>value === "hungry").length,
            starvingSlimes: hungers.filter((value)=>value === "starving").length,
            selectedSlime: selectedId ? this.selectedSlimeInfo(selectedId) : null,
            activeRipples: water?.activeRipples ?? 0,
            activeFishShadows: water?.activeFishShadows ?? 0,
            waterSurfaceOn: water?.waterSurfaceOn ?? true,
            waterAmbientOn: water?.waterAmbientOn ?? true,
            waterDepthBoundsOn: water?.waterDepthBoundsOn ?? false,
            aquaticActivities: state.activities.filter((activity)=>activity.state !== "consumed").length,
            shallowSpots: state.fishingSpots.filter((spot)=>spot.depth === "shallow").length,
            deepSpots: state.fishingSpots.filter((spot)=>spot.depth === "deep").length,
            fishingPhase: state.fishing.phase,
            fishingPresentation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingPresentationPhase"])(state.fishing.assignedSlimeId ? state.slimes[state.fishing.assignedSlimeId] : undefined, state.fishing.phase === "idle" ? undefined : state.fishing, state.tickIndex),
            fishingVisualDebug: fishingVisualDebugLine(this.fishingRenderer?.visualAnchors()[0]),
            fishingTargetId: state.fishing.activityId,
            fishingDebugSpecies: state.fishing.speciesId,
            fishingAssignedSlime: state.fishingSessions.filter((session)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLiveFishingPhase"])(session.phase)).map((session)=>state.slimes[session.assignedSlimeId ?? ""]?.name ?? session.assignedSlimeId).filter((name)=>Boolean(name)).join(", ") || null,
            fishingAccessPoint: state.fishing.accessPointId,
            fishingReservationOwner: state.fishingAccessPoints.find((point)=>point.id === state.fishing.accessPointId)?.reservedBy ?? null,
            fishingHookOwner: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions)?.assignedSlimeId ?? null,
            fishingScores: state.lastFishingScores.map((entry)=>`${entry.name} ${entry.score.toFixed(1)}`),
            fishingOpportunity: state.opportunities.find((entry)=>entry.state !== "caught" && entry.state !== "escaped" && entry.state !== "expired")?.state ?? null,
            ambientDebug: Object.values(state.slimes).map((slime)=>{
                const reserved = state.interestPoints.find((point)=>point.reservedBy === slime.id);
                return `${slime.name} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slimeMode"])(slime)} ${slime.ambientBehaviorId ?? "—"} ${slime.ambientTargetId ?? "—"} cd:${Math.max(0, slime.ambientCooldownUntilTick - state.tickIndex)} r:${reserved?.id ?? "—"}`;
            }),
            waterBodyCount: state.waterBodies.length,
            accessPointCount: state.fishingAccessPoints.length,
            fishCollection: state.fishCollection
        });
    }
    syncFarmVisuals() {
        const simulation = this.simulation;
        const farmLayer = this.farmLayer;
        if (!simulation || !farmLayer) {
            return;
        }
        for (const pos of simulation.state.consumeFarmDirty()){
            const frame = simulation.state.grid.farmingFrameAt(pos.x, pos.y);
            if (frame < 0) {
                farmLayer.removeTileAt(pos.x, pos.y);
            } else {
                farmLayer.putTileAt(frame, pos.x, pos.y);
            }
            const detail = this.detailSprites.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(pos.x, pos.y));
            if (detail) {
                detail.setVisible(!simulation.state.farmAt(pos.x, pos.y));
            }
        }
    }
    spawnTask(type) {
        const simulation = this.simulation;
        if (!simulation) {
            return;
        }
        const { selectedX, selectedY } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState();
        const preferred = selectedX !== null && selectedY !== null ? {
            x: selectedX,
            y: selectedY
        } : undefined;
        simulation.spawnGatherTask(type, preferred);
    }
    handleSlimeClick(pointer) {
        if (this.farmTool?.isToolActive() || this.fishingTool?.ownsPointer()) {
            return true;
        }
        if (this.simulation && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionOwnsInput"])(this.simulation.state.fishing)) {
            return true;
        }
        const id = this.slimeRenderer?.hitTest(pointer.worldX, pointer.worldY);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
            selectedSlimeId: id ?? null,
            selectedSlime: id ? this.selectedSlimeInfo(id) : null
        });
        return Boolean(id);
    }
    spawnDebugFish(speciesId) {
        const simulation = this.simulation;
        if (!simulation) {
            return;
        }
        const { selectedX, selectedY, hoveredX, hoveredY } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState();
        const tileX = selectedX ?? hoveredX;
        const tileY = selectedY ?? hoveredY;
        if (tileX === null || tileY === null) {
            return;
        }
        simulation.spawnAquatic(speciesId, tileX, tileY);
    }
    syncFishingHud(simulation) {
        const sessions = simulation.state.fishingSessions;
        const nowMs = this.time.now;
        const fighting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(sessions);
        const focus = fighting ?? simulation.state.fishing;
        const slime = focus.assignedSlimeId ? simulation.state.slimes[focus.assignedSlimeId] : undefined;
        if (focus.phase !== "idle") {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                fishingHud: {
                    phase: focus.phase,
                    presentation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingPresentationPhase"])(slime, focus, simulation.state.tickIndex),
                    marker: fighting ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightMarkerT"])(fighting, nowMs) : 0,
                    zoneStart: focus.zoneStart,
                    zoneWidth: focus.zoneWidth,
                    slimeName: slime?.name ?? null,
                    technique: slime?.attributes.technique ?? 3,
                    strength: slime?.attributes.strength ?? 3,
                    instinct: slime?.attributes.instinct ?? 3,
                    lastStrike: focus.lastStrike
                }
            });
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().fishingHud) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                fishingHud: null
            });
        }
        for (const session of sessions){
            if (session.phase === "bite" && !this.toastedBiteIds.has(session.sessionId)) {
                this.toastedBiteIds.add(session.sessionId);
                const slimeName = session.assignedSlimeId ? simulation.state.slimes[session.assignedSlimeId]?.name ?? null : null;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                    catchToast: {
                        speciesId: session.speciesId ?? "blue_darter",
                        name: session.speciesId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][session.speciesId].name : "Fish",
                        slimeName,
                        isNew: false,
                        kind: "bite",
                        hideAt: Date.now() + 900
                    }
                });
            }
            if (session.phase === "caught" && session.caughtSpeciesId && !this.toastedCatchIds.has(session.sessionId)) {
                this.toastedCatchIds.add(session.sessionId);
                const speciesId = session.caughtSpeciesId;
                const duration = session.isNewDiscovery ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].newCatchRevealMs : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].caughtRevealMs;
                const slimeName = session.assignedSlimeId ? simulation.state.slimes[session.assignedSlimeId]?.name ?? null : null;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                    catchToast: {
                        speciesId,
                        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][speciesId].name,
                        slimeName,
                        isNew: session.isNewDiscovery,
                        kind: "catch",
                        hideAt: Date.now() + duration
                    }
                });
            }
        }
        const liveIds = new Set(sessions.map((session)=>session.sessionId));
        for (const id of this.toastedBiteIds){
            if (!liveIds.has(id)) {
                this.toastedBiteIds.delete(id);
            }
        }
        for (const id of this.toastedCatchIds){
            if (!liveIds.has(id)) {
                this.toastedCatchIds.delete(id);
            }
        }
        const toast = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().catchToast;
        if (toast && Date.now() >= toast.hideAt) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().setRuntime({
                catchToast: null
            });
        }
    }
    selectedSlimeInfo(id) {
        const simulation = this.simulation;
        if (!simulation) {
            return null;
        }
        const slime = simulation.state.slimes[id];
        if (!slime) {
            return null;
        }
        const debug = this.slimeRenderer?.visualDebug(slime);
        return slimeInfo(slime, simulation.state.tasks, debug);
    }
}
function slimeInfo(slime, tasks, debug) {
    if (!slime) {
        return null;
    }
    const task = slime.currentTaskId ? tasks[slime.currentTaskId] : undefined;
    let taskLabel = "none";
    if (slime.state === "moving_to_food" || slime.state === "eating") {
        taskLabel = "Eat";
    } else if (task) {
        taskLabel = task.type.replaceAll("_", " ");
    }
    return {
        id: slime.id,
        name: slime.name,
        state: slime.state,
        taskLabel,
        tileX: slime.tileX,
        tileY: slime.tileY,
        destX: slime.destination?.x ?? null,
        destY: slime.destination?.y ?? null,
        carrying: slime.carriedResource ? `${slime.carriedResource.type} ×${slime.carriedResource.amount}` : "Nothing",
        satiety: Math.round(slime.satiety),
        hungerState: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hungerState"])(slime.satiety),
        visual: debug?.visual ?? "PLACEHOLDER",
        anim: debug?.anim ?? "idle",
        frame: debug?.frame ?? 0,
        technique: slime.attributes.technique,
        strength: slime.attributes.strength,
        instinct: slime.attributes.instinct,
        luck: slime.attributes.luck
    };
}
function fishingVisualDebugLine(anchor) {
    if (!anchor) {
        return null;
    }
    return [
        `${anchor.visualPhase}/${anchor.phase}`,
        `side:${anchor.visualSide}`,
        `dir:${anchor.castDirection}`,
        `origin:${anchor.rodOriginX},${anchor.rodOriginY}`,
        `tip:${anchor.rodTipX},${anchor.rodTipY}`,
        `line:${anchor.lineStartX},${anchor.lineStartY}->${anchor.lineEndX},${anchor.lineEndY}`,
        `water:${anchor.waterTargetX},${anchor.waterTargetY}`,
        `pose:${anchor.rodPose}`,
        `frame:${anchor.animFrame}`
    ].join(" ");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/GameState.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameState",
    ()=>GameState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$villageMap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/villageMap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$resourceNodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/resourceNodes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/resources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$rng$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/rng.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/waterBodies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/InterestPointSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
function initialWanderTicks(offset) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IDLE_WANDER_DELAY_TICKS"].min + offset;
}
class GameState {
    grid;
    storage;
    nodes;
    rng;
    fishingSpots;
    waterBodies;
    fishingAccessPoints;
    slimes;
    tasks;
    resources;
    farms;
    activities;
    opportunities;
    fishingSessions;
    fishCollection;
    fishInventory;
    lastFishingScores;
    interestPoints;
    interestPointsByTag;
    tickIndex = 0;
    nextAquaticSpawnTick = 0;
    nextTaskSeq = 1;
    nextActivitySeq = 1;
    nextSessionSeq = 1;
    nextOpportunitySeq = 1;
    warnedKeys = new Set();
    farmDirty = new Set();
    constructor(grid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$villageMap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createVillageMap"])(), rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$rng$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRng"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$rng$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAY_RNG_SEED"])){
        this.grid = grid;
        this.rng = rng;
        this.storage = {
            x: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TILE"].x,
            y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TILE"].y
        };
        this.nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$resourceNodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceNodes"])(grid);
        const water = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildWaterWorld"])(grid, this.storage);
        this.fishingSpots = water.spots;
        this.waterBodies = water.bodies;
        this.fishingAccessPoints = water.accessPoints;
        this.slimes = {};
        this.tasks = {};
        this.resources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyStock"])();
        this.farms = {};
        this.activities = [];
        this.opportunities = [];
        this.fishingSessions = [];
        this.fishCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyFishCollection"])();
        this.fishInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyFishInventory"])();
        this.lastFishingScores = [];
        this.interestPoints = [];
        this.interestPointsByTag = {};
        this.spawnSlimes();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rebuildInterestPoints"])(this);
    }
    spawnSlimes() {
        this.slimes = {};
        for (const def of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_SPAWNS"]){
            this.slimes[def.id] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlimeState"])(def, initialWanderTicks(def.wanderOffsetTicks));
        }
    }
    /** Player-facing session: fighting, else oldest bite/wait. Mutations apply to that live object. */ get fishing() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryFishingSession"])(this.fishingSessions) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["idleFishingSession"])();
    }
    set fishing(session) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertFishingSession"])(this, session);
    }
    resetSlimes() {
        this.spawnSlimes();
        this.fishingSessions = [];
        for (const point of this.interestPoints){
            point.reservedBy = null;
        }
    }
    nextTaskId(prefix) {
        const id = `${prefix}_${this.nextTaskSeq}`;
        this.nextTaskSeq += 1;
        return id;
    }
    nextActivityId() {
        const id = `act_${this.nextActivitySeq}`;
        this.nextActivitySeq += 1;
        return id;
    }
    nextSessionId() {
        const id = `fish_${this.nextSessionSeq}`;
        this.nextSessionSeq += 1;
        return id;
    }
    nextOpportunityId() {
        const id = `opp_${this.nextOpportunitySeq}`;
        this.nextOpportunitySeq += 1;
        return id;
    }
    warnOnce(key, message) {
        if (this.warnedKeys.has(key)) {
            return;
        }
        this.warnedKeys.add(key);
        console.warn(message);
    }
    activeTasks() {
        return Object.values(this.tasks).filter((task)=>task.state === "available" || task.state === "assigned" || task.state === "in_progress");
    }
    farmAt(x, y) {
        return this.farms[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(x, y)];
    }
    markFarmDirty(x, y) {
        this.farmDirty.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(x, y));
    }
    consumeFarmDirty() {
        const positions = [];
        for (const key of this.farmDirty){
            positions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFarmKey"])(key));
        }
        this.farmDirty.clear();
        return positions;
    }
    nodeById(id) {
        return this.nodes.find((node)=>node.id === id);
    }
    nodeAtTile(x, y) {
        return this.nodes.find((node)=>{
            if (node.type === "wood") {
                const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE];
                return x >= node.tile.x && x < node.tile.x + def.footprintWidth && y >= node.tile.y && y < node.tile.y + def.footprintHeight;
            }
            return node.tile.x === x && node.tile.y === y;
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/Simulation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Simulation",
    ()=>Simulation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$GameState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/GameState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/simulation/systems/JobSystem.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$SlimeSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/SlimeSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$NeedsSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/NeedsSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FarmSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/resources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AquaticActivitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingOpportunitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
class Simulation {
    state;
    accumulatorMs = 0;
    ticksRun = 0;
    constructor(state = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$GameState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GameState"]()){
        this.state = state;
    }
    get ticksPerSecond() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICKS_PER_SECOND"];
    }
    get tickCount() {
        return this.ticksRun;
    }
    /** Advance with render delta; returns interpolation alpha in [0, 1). */ update(deltaMs) {
        this.accumulatorMs += Math.max(0, deltaMs);
        const maxCatchUp = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"] * 8;
        if (this.accumulatorMs > maxCatchUp) {
            this.accumulatorMs = maxCatchUp;
        }
        while(this.accumulatorMs >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]){
            this.tick();
            this.accumulatorMs -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
        }
        return this.accumulatorMs / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
    }
    tick() {
        this.ticksRun += 1;
        this.state.tickIndex = this.ticksRun;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$NeedsSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickNeeds"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickFarms"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickAquatic"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickFishingOpportunities"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickFishing"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assignAvailableTasks"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickAmbientBehaviors"])(this.state);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$SlimeSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickSlimes"])(this.state);
    }
    commitFishing(worldX, worldY) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitFishingAtWorld"])(this.state, worldX, worldY);
    }
    commitFishingActivity(activityId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitFishingOpportunity"])(this.state, activityId);
    }
    cancelFishing() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishing"])(this.state);
    }
    resolveFishingStrike(nowMs) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveStrike"])(this.state, nowMs);
    }
    advanceFishingClock(nowMs) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceFishingClock"])(this.state, nowMs);
    }
    spawnAquatic(speciesId, tileX, tileY) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spawnAquaticAt"])(this.state, speciesId, tileX, tileY);
    }
    clearAquaticActivities() {
        for (const opportunity of this.state.opportunities){
            if (opportunity.state !== "caught" && opportunity.state !== "escaped" && opportunity.state !== "expired") {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishingOpportunity"])(this.state, opportunity.id);
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAquaticActivities"])(this.state);
    }
    forceFishingBite() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forceBite"])(this.state);
    }
    autoSucceedFishing(nowMs) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoSucceedCatch"])(this.state, nowMs);
    }
    resetFishCollection() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetFishCollection"])(this.state);
    }
    forceAmbient(slimeId, behaviorId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forceAmbientBehavior"])(this.state, slimeId, behaviorId);
    }
    forceSocialGreet() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forceSocialGreet"])(this.state);
    }
    clearAmbientBehaviors() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAllAmbientBehaviors"])(this.state);
    }
    clueSnapshot() {
        return this.state.activities.filter((activity)=>activity.state === "active").map((activity)=>({
                id: activity.id,
                worldX: activity.worldX,
                worldY: activity.worldY,
                clueType: activity.clueType,
                clueVisible: activity.clueVisible
            }));
    }
    spawnGatherTask(type, preferredTile) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createGatherTask"])(this.state, type, preferredTile);
    }
    designateFarm(ax, ay, bx, by) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["designateFarmRect"])(this.state, ax, ay, bx, by);
    }
    removeFarm(ax, ay, bx, by) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFarmRect"])(this.state, ax, ay, bx, by);
    }
    clearFarms() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearFarms"])(this.state);
    }
    instantGrowCrops() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instantGrowCrops"])(this.state);
    }
    addFood(amount = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEBUG_ADD_FOOD_AMOUNT"]) {
        this.state.resources.food += amount;
    }
    setAllSlimesHungry(satiety = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEBUG_HUNGRY_SATIETY"]) {
        for (const slime of Object.values(this.state.slimes)){
            slime.satiety = satiety;
        }
    }
    clearTasks() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["clearActiveTasks"])(this.state);
    }
    resetSlimes() {
        this.state.resetSlimes();
    }
    addTestResource() {
        this.state.resources.wood += 2;
        this.state.resources.stone += 2;
    }
    clearStock() {
        this.state.resources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyStock"])();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/ambientConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AMBIENT",
    ()=>AMBIENT,
    "AMBIENT_BEHAVIORS",
    ()=>AMBIENT_BEHAVIORS,
    "considerDelayTicksPerSecond",
    ()=>considerDelayTicksPerSecond
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
;
const AMBIENT = {
    considerDelayTicks: {
        min: 8,
        max: 32
    },
    idleStayChance: 0.32,
    maxInterestDistance: 10,
    distanceCostPerTile: 0.18,
    wanderRadius: {
        min: 2,
        max: 5
    },
    socialRadius: 3,
    socialCooldownTicks: 80,
    behaviorCooldownTicks: 12,
    observeDurationTicks: {
        min: 12,
        max: 24
    },
    inspectDurationTicks: {
        min: 8,
        max: 16
    },
    restDurationTicks: {
        min: 16,
        max: 32
    },
    greetDurationTicks: {
        min: 6,
        max: 10
    },
    emoteTicks: 5
};
const AMBIENT_BEHAVIORS = [
    {
        id: "wander",
        validInterestTags: [],
        profileKey: "exploration",
        baseWeight: 1.1,
        durationRange: {
            min: 1,
            max: 1
        },
        movementRequired: true,
        interruptible: true
    },
    {
        id: "observe_water",
        validInterestTags: [
            "water_edge"
        ],
        profileKey: "water",
        baseWeight: 1,
        durationRange: AMBIENT.observeDurationTicks,
        movementRequired: true,
        interruptible: true
    },
    {
        id: "inspect_farm",
        validInterestTags: [
            "farm"
        ],
        profileKey: "farming",
        baseWeight: 0.9,
        durationRange: AMBIENT.inspectDurationTicks,
        movementRequired: true,
        interruptible: true
    },
    {
        id: "inspect_nature",
        validInterestTags: [
            "flower",
            "tree",
            "rock",
            "nature"
        ],
        profileKey: "nature",
        baseWeight: 0.95,
        durationRange: AMBIENT.inspectDurationTicks,
        movementRequired: true,
        interruptible: true
    },
    {
        id: "rest",
        validInterestTags: [],
        profileKey: "rest",
        baseWeight: 0.85,
        durationRange: AMBIENT.restDurationTicks,
        movementRequired: false,
        interruptible: true
    },
    {
        id: "social_greet",
        validInterestTags: [
            "social"
        ],
        profileKey: "social",
        baseWeight: 0.45,
        durationRange: AMBIENT.greetDurationTicks,
        movementRequired: true,
        interruptible: true
    }
];
function considerDelayTicksPerSecond() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICKS_PER_SECOND"];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/ambientPersonality.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_AMBIENT_INTEREST",
    ()=>DEFAULT_AMBIENT_INTEREST,
    "MOMO_AMBIENT_INTEREST",
    ()=>MOMO_AMBIENT_INTEREST,
    "PINGO_AMBIENT_INTEREST",
    ()=>PINGO_AMBIENT_INTEREST,
    "TITO_AMBIENT_INTEREST",
    ()=>TITO_AMBIENT_INTEREST
]);
const DEFAULT_AMBIENT_INTEREST = {
    water: 3,
    farming: 3,
    nature: 3,
    social: 3,
    exploration: 3,
    rest: 3
};
const PINGO_AMBIENT_INTEREST = {
    water: 5,
    farming: 2,
    nature: 4,
    social: 2,
    exploration: 5,
    rest: 2
};
const MOMO_AMBIENT_INTEREST = {
    water: 2,
    farming: 5,
    nature: 5,
    social: 3,
    exploration: 2,
    rest: 5
};
const TITO_AMBIENT_INTEREST = {
    water: 2,
    farming: 2,
    nature: 4,
    social: 5,
    exploration: 5,
    rest: 1
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/data/crops.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CROPS",
    ()=>CROPS,
    "CROP_IDS",
    ()=>CROP_IDS,
    "DEFAULT_CROP_ID",
    ()=>DEFAULT_CROP_ID,
    "cropById",
    ()=>cropById
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
;
const CROP_IDS = {
    FOREST_CARROT: "forest_carrot"
};
const CROPS = {
    forest_carrot: {
        id: "forest_carrot",
        name: "Forest Carrot",
        growthTimeMs: 25_000,
        foodYield: 2,
        visuals: {
            growing: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].PLANTED,
            ready: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].PLANTED
        }
    }
};
const DEFAULT_CROP_ID = CROP_IDS.FOREST_CARROT;
function cropById(id) {
    return CROPS[id];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "farmKey",
    ()=>farmKey,
    "farmNodeId",
    ()=>farmNodeId,
    "parseFarmKey",
    ()=>parseFarmKey
]);
function farmKey(x, y) {
    return `${x},${y}`;
}
function farmNodeId(x, y) {
    return `farm_${x}_${y}`;
}
function parseFarmKey(key) {
    const [x, y] = key.split(",").map(Number);
    return {
        x,
        y
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fightingSession",
    ()=>fightingSession,
    "fishingSessionForSlime",
    ()=>fishingSessionForSlime,
    "idleFishingSession",
    ()=>idleFishingSession,
    "isLiveFishingPhase",
    ()=>isLiveFishingPhase,
    "primaryFishingSession",
    ()=>primaryFishingSession,
    "removeFishingSession",
    ()=>removeFishingSession,
    "sessionOwnsInput",
    ()=>sessionOwnsInput,
    "upsertFishingSession",
    ()=>upsertFishingSession
]);
function idleFishingSession() {
    return {
        phase: "idle",
        sessionId: "",
        tileX: 0,
        tileY: 0,
        worldX: 0,
        worldY: 0,
        activityId: null,
        speciesId: null,
        assignedSlimeId: null,
        opportunityId: null,
        accessPointId: null,
        waitUntilTick: 0,
        biteUntilTick: 0,
        arriveUntilTick: 0,
        castUntilTick: 0,
        lastStrike: null,
        fightStartedAtMs: 0,
        markerPeriodMs: 0,
        zoneStart: 0,
        zoneWidth: 0,
        caughtSpeciesId: null,
        isNewDiscovery: false,
        resultAtMs: 0
    };
}
function sessionOwnsInput(session) {
    return session.phase === "fighting";
}
function isLiveFishingPhase(phase) {
    return phase === "waiting" || phase === "casting" || phase === "bite" || phase === "fighting";
}
const PRIMARY_ORDER = [
    "fighting",
    "bite",
    "waiting",
    "casting",
    "caught",
    "escaped"
];
function primaryFishingSession(sessions) {
    for (const phase of PRIMARY_ORDER){
        const found = sessions.find((session)=>session.phase === phase);
        if (found) {
            return found;
        }
    }
    return undefined;
}
function fishingSessionForSlime(sessions, slimeId) {
    if (!slimeId) {
        return undefined;
    }
    return sessions.find((session)=>session.assignedSlimeId === slimeId);
}
function fightingSession(sessions) {
    return sessions.find((session)=>session.phase === "fighting");
}
function upsertFishingSession(state, session) {
    if (session.phase === "idle") {
        const primary = primaryFishingSession(state.fishingSessions);
        if (primary) {
            state.fishingSessions = state.fishingSessions.filter((entry)=>entry !== primary);
        }
        return;
    }
    const idx = state.fishingSessions.findIndex((entry)=>{
        if (session.sessionId && entry.sessionId === session.sessionId) {
            return true;
        }
        return Boolean(session.assignedSlimeId) && entry.assignedSlimeId === session.assignedSlimeId;
    });
    if (idx >= 0) {
        state.fishingSessions[idx] = session;
    } else {
        state.fishingSessions.push(session);
    }
}
function removeFishingSession(state, match) {
    state.fishingSessions = state.fishingSessions.filter((entry)=>{
        if (match.sessionId && entry.sessionId === match.sessionId) {
            return false;
        }
        if (match.opportunityId && entry.opportunityId === match.opportunityId) {
            return false;
        }
        if (match.slimeId && entry.assignedSlimeId === match.slimeId) {
            return false;
        }
        return true;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLIME_IDS",
    ()=>SLIME_IDS,
    "SLIME_SPAWNS",
    ()=>SLIME_SPAWNS,
    "createSlimeState",
    ()=>createSlimeState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientPersonality$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/ambientPersonality.ts [app-client] (ecmascript)");
;
;
;
const SLIME_IDS = {
    PINGO: "slime_pingo",
    MOMO: "slime_momo",
    TITO: "slime_tito"
};
const SLIME_SPAWNS = [
    {
        id: SLIME_IDS.PINGO,
        name: "Pingo",
        x: 8,
        y: 6,
        wanderOffsetTicks: 0,
        attributes: {
            technique: 4,
            strength: 2,
            instinct: 5,
            luck: 3
        },
        interest: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientPersonality$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PINGO_AMBIENT_INTEREST"]
    },
    {
        id: SLIME_IDS.MOMO,
        name: "Momo",
        x: 9,
        y: 6,
        wanderOffsetTicks: 4,
        attributes: {
            technique: 4,
            strength: 2,
            instinct: 4,
            luck: 3
        },
        interest: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientPersonality$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOMO_AMBIENT_INTEREST"]
    },
    {
        id: SLIME_IDS.TITO,
        name: "Tito",
        x: 10,
        y: 5,
        wanderOffsetTicks: 8,
        attributes: {
            technique: 3,
            strength: 5,
            instinct: 2,
            luck: 2
        },
        interest: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientPersonality$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TITO_AMBIENT_INTEREST"]
    }
];
function createSlimeState(def, wanderTicks) {
    return {
        id: def.id,
        name: def.name,
        tileX: def.x,
        tileY: def.y,
        spawnX: def.x,
        spawnY: def.y,
        state: "idle",
        path: [],
        hopElapsedMs: 0,
        workElapsedMs: 0,
        idleWanderTicks: wanderTicks,
        satiety: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SATIETY_INITIAL"],
        attributes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampAttributes"])(def.attributes),
        interest: def.interest ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientPersonality$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AMBIENT_INTEREST"],
        ambientUntilTick: 0,
        ambientCooldownUntilTick: 0,
        ambientEmote: null,
        ambientEmoteUntilTick: 0,
        fishingCelebrateUntilTick: 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/entities/Task.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FARM_TASK_TYPES",
    ()=>FARM_TASK_TYPES,
    "FISHING_TASK_TYPES",
    ()=>FISHING_TASK_TYPES,
    "GATHER_TASK_TYPES",
    ()=>GATHER_TASK_TYPES,
    "isFarmTask",
    ()=>isFarmTask,
    "isFishingTask",
    ()=>isFishingTask,
    "isGatherTask",
    ()=>isGatherTask,
    "jobCategory",
    ()=>jobCategory,
    "resourceTypeForTask",
    ()=>resourceTypeForTask
]);
const GATHER_TASK_TYPES = [
    "gather_wood",
    "gather_stone"
];
const FARM_TASK_TYPES = [
    "till_soil",
    "plant_crop",
    "harvest_crop"
];
const FISHING_TASK_TYPES = [
    "fish_activity"
];
function isFarmTask(type) {
    return FARM_TASK_TYPES.includes(type);
}
function isGatherTask(type) {
    return GATHER_TASK_TYPES.includes(type);
}
function isFishingTask(type) {
    return FISHING_TASK_TYPES.includes(type);
}
function jobCategory(type) {
    if (isFarmTask(type)) {
        return "farming";
    }
    if (isFishingTask(type)) {
        return "fishing";
    }
    return "gathering";
}
function resourceTypeForTask(type) {
    if (type === "gather_wood") {
        return "wood";
    }
    if (type === "gather_stone") {
        return "stone";
    }
    if (type === "harvest_crop") {
        return "food";
    }
    return undefined;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISHING",
    ()=>FISHING,
    "instinctScaledClueOnTicks",
    ()=>instinctScaledClueOnTicks,
    "msToTicks",
    ()=>msToTicks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
;
const FISHING = {
    maxActivities: 3,
    spawnIntervalTicks: {
        min: 8,
        max: 16
    },
    activityLifetimeTicks: {
        min: 32,
        max: 80
    },
    clueOnTicks: {
        min: 3,
        max: 6
    },
    clueOffTicks: {
        min: 4,
        max: 8
    },
    castRadiusPx: 64,
    clueHitRadiusPx: 48,
    emptyWaitTicks: 8,
    arriveTicks: 1,
    castTicks: 2,
    biteDisplayTicks: 2,
    perfectZoneFactor: 0.2,
    perfectZoneMin: 0.04,
    fightPassesBeforeTimeout: 2,
    caughtRevealMs: 1400,
    newCatchRevealMs: 2200,
    pondMaxTiles: 12,
    techniqueZoneBonusPerPoint: 0.06,
    strengthPeriodBonusPerPoint: 0.07,
    instinctClueOnBonusPerPoint: 0.08,
    luckWidenChanceFactor: 0.15,
    luckWidenAmount: 0.12,
    distancePenaltyPerTile: 0.12,
    challengeMatchWeight: 0.15
};
function msToTicks(ms) {
    return Math.max(1, Math.ceil(ms / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]));
}
function instinctScaledClueOnTicks(instinct) {
    const onBonus = 1 + FISHING.instinctClueOnBonusPerPoint * (instinct - 1);
    const min = Math.max(1, Math.round(FISHING.clueOnTicks.min * onBonus));
    const max = Math.max(min, Math.round(FISHING.clueOnTicks.max * onBonus));
    return {
        min,
        max
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/resources.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RESOURCE_IDS",
    ()=>RESOURCE_IDS,
    "emptyStock",
    ()=>emptyStock
]);
const RESOURCE_IDS = {
    WOOD: "wood",
    STONE: "stone",
    FOOD: "food"
};
function emptyStock() {
    return {
        wood: 0,
        stone: 0,
        food: 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/rng.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PLAY_RNG_SEED",
    ()=>PLAY_RNG_SEED,
    "createRng",
    ()=>createRng
]);
function createRng(seed) {
    let state = seed >>> 0;
    if (state === 0) {
        state = 0x9e3779b9;
    }
    const next = ()=>{
        state += 0x6d2b79f5;
        let t = state;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    return {
        next,
        range (min, max) {
            if (max < min) {
                return min;
            }
            return min + Math.floor(next() * (max - min + 1));
        },
        pick (items) {
            if (items.length === 0) {
                throw new Error("Rng.pick requires at least one item.");
            }
            return items[Math.floor(next() * items.length)];
        },
        pickWeighted (items) {
            const total = items.reduce((sum, entry)=>sum + entry.weight, 0);
            if (total <= 0) {
                throw new Error("Rng.pickWeighted requires a positive weight sum.");
            }
            let roll = next() * total;
            for (const entry of items){
                roll -= entry.weight;
                if (roll <= 0) {
                    return entry.item;
                }
            }
            return items[items.length - 1].item;
        }
    };
}
const PLAY_RNG_SEED = 0x51a7e;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "behaviorScore",
    ()=>behaviorScore,
    "cancelAmbientBehavior",
    ()=>cancelAmbientBehavior,
    "clearAllAmbientBehaviors",
    ()=>clearAllAmbientBehaviors,
    "finishAmbientArrival",
    ()=>finishAmbientArrival,
    "forceAmbientBehavior",
    ()=>forceAmbientBehavior,
    "forceSocialGreet",
    ()=>forceSocialGreet,
    "tickAmbientActing",
    ()=>tickAmbientActing,
    "tickAmbientBehaviors",
    ()=>tickAmbientBehaviors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/ambientConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/InterestPointSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
const SLIME_ORDER = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO
];
function behaviorScore(def, profile, distance) {
    const affinity = profile[def.profileKey] / 5;
    return def.baseWeight * (0.35 + 0.65 * affinity) / (1 + distance * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].distanceCostPerTile);
}
function cancelAmbientBehavior(state, slime) {
    if (slime.state !== "moving_to_ambient" && slime.state !== "ambient") {
        return;
    }
    const partnerId = slime.ambientPartnerId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseInterestReservation"])(state, slime.id);
    clearAmbient(slime);
    if (partnerId) {
        const partner = state.slimes[partnerId];
        if (partner && partner.ambientPartnerId === slime.id) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseInterestReservation"])(state, partner.id);
            clearAmbient(partner);
        }
    }
}
function clearAllAmbientBehaviors(state) {
    for (const slime of Object.values(state.slimes)){
        if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
            cancelAmbientBehavior(state, slime);
        }
    }
}
function tickAmbientBehaviors(state) {
    for (const id of SLIME_ORDER){
        const slime = state.slimes[id];
        if (slime.ambientEmote && state.tickIndex >= slime.ambientEmoteUntilTick) {
            slime.ambientEmote = null;
        }
        if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
            if (slime.ambientTargetId) {
                const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interestPointById"])(state, slime.ambientTargetId);
                if (!point) {
                    cancelAmbientBehavior(state, slime);
                }
            }
            continue;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAmbientEligible"])(state, slime)) {
            continue;
        }
        if (slime.idleWanderTicks > 0) {
            continue;
        }
        considerAmbient(state, slime);
    }
}
function finishAmbientArrival(state, slime) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT_BEHAVIORS"].find((entry)=>entry.id === slime.ambientBehaviorId);
    const duration = def ? state.rng.range(def.durationRange.min, def.durationRange.max) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].inspectDurationTicks.min;
    slime.state = "ambient";
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.ambientUntilTick = state.tickIndex + duration;
    if (slime.ambientBehaviorId === "observe_water") {
        const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interestPointById"])(state, slime.ambientTargetId);
        const access = point?.sourceId ? state.fishingAccessPoints.find((entry)=>entry.id === point.sourceId) : undefined;
        slime.faceTile = access ? {
            ...access.waterTile
        } : slime.faceTile;
    }
}
function tickAmbientActing(state, slime) {
    if (slime.ambientTargetId) {
        const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interestPointById"])(state, slime.ambientTargetId);
        if (!point || point.reservedBy && point.reservedBy !== slime.id) {
            cancelAmbientBehavior(state, slime);
            return;
        }
    }
    if (slime.ambientBehaviorId === "observe_water") {
        maybeWaterReaction(state, slime);
    }
    if (state.tickIndex >= slime.ambientUntilTick) {
        completeAmbient(state, slime);
    }
}
function forceAmbientBehavior(state, slimeId, behaviorId) {
    const slime = state.slimes[slimeId];
    if (!slime) {
        return false;
    }
    cancelAmbientBehavior(state, slime);
    if (slime.currentTaskId) {
        return false;
    }
    if (behaviorId === "social_greet") {
        return startSocialGreet(state, slime, true);
    }
    return startBehavior(state, slime, behaviorId, true);
}
function forceSocialGreet(state) {
    const pingo = state.slimes[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO];
    if (!pingo) {
        return false;
    }
    cancelAmbientBehavior(state, pingo);
    return startSocialGreet(state, pingo, true);
}
function considerAmbient(state, slime) {
    slime.idleWanderTicks = nextConsiderDelay(state);
    if (state.tickIndex < slime.ambientCooldownUntilTick) {
        return;
    }
    if (state.rng.next() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].idleStayChance) {
        return;
    }
    const weighted = [];
    for (const def of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT_BEHAVIORS"]){
        const distance = previewDistance(state, slime, def);
        if (distance === null) {
            continue;
        }
        const score = behaviorScore(def, slime.interest, distance);
        if (score > 0) {
            weighted.push({
                item: def.id,
                weight: score
            });
        }
    }
    if (weighted.length === 0) {
        return;
    }
    const picked = state.rng.pickWeighted(weighted);
    startBehavior(state, slime, picked, false);
}
function startBehavior(state, slime, behaviorId, forced) {
    if (behaviorId === "social_greet") {
        return startSocialGreet(state, slime, forced);
    }
    if (behaviorId === "wander") {
        return startWander(state, slime);
    }
    if (behaviorId === "rest") {
        beginAmbientStay(slime, "rest", undefined, state.tickIndex + durationFor(state, "rest"));
        return true;
    }
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT_BEHAVIORS"].find((entry)=>entry.id === behaviorId);
    if (!def) {
        return false;
    }
    const chosen = pickInterest(state, slime, def, forced);
    if (!chosen) {
        return false;
    }
    const stand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["standTileFor"])(state, chosen.point);
    if (!stand) {
        return false;
    }
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, stand);
    if (path === null) {
        return false;
    }
    chosen.point.reservedBy = slime.id;
    slime.ambientBehaviorId = behaviorId;
    slime.ambientTargetId = chosen.point.id;
    slime.ambientPartnerId = undefined;
    slime.destination = stand;
    slime.path = path;
    slime.faceTile = {
        ...chosen.point.tile
    };
    if (path.length === 0) {
        finishAmbientArrival(state, slime);
        return true;
    }
    slime.state = "moving_to_ambient";
    return true;
}
function startWander(state, slime) {
    const dest = pickWanderTile(state, slime);
    if (!dest) {
        return false;
    }
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, dest);
    if (path === null || path.length === 0) {
        return false;
    }
    slime.ambientBehaviorId = "wander";
    slime.ambientTargetId = undefined;
    slime.destination = dest;
    slime.path = path;
    slime.state = "moving_to_ambient";
    slime.ambientUntilTick = state.tickIndex + path.length + 1;
    return true;
}
function startSocialGreet(state, slime, forced) {
    const partner = pickGreetPartner(state, slime, forced);
    if (!partner) {
        return false;
    }
    const dest = adjacentStand(state, slime, partner);
    if (!dest) {
        return false;
    }
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, dest);
    if (path === null) {
        return false;
    }
    const until = state.tickIndex + durationFor(state, "social_greet") + path.length;
    slime.ambientBehaviorId = "social_greet";
    slime.ambientPartnerId = partner.id;
    slime.destination = dest;
    slime.path = path;
    slime.faceTile = {
        x: partner.tileX,
        y: partner.tileY
    };
    slime.state = path.length === 0 ? "ambient" : "moving_to_ambient";
    slime.ambientUntilTick = until;
    partner.ambientBehaviorId = "social_greet";
    partner.ambientPartnerId = slime.id;
    partner.faceTile = {
        x: slime.tileX,
        y: slime.tileY
    };
    partner.state = "ambient";
    partner.ambientUntilTick = until;
    partner.ambientEmote = "!";
    partner.ambientEmoteUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].emoteTicks;
    if (path.length === 0) {
        slime.state = "ambient";
        slime.ambientEmote = "!";
        slime.ambientEmoteUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].emoteTicks;
    }
    return true;
}
function completeAmbient(state, slime) {
    if (slime.ambientBehaviorId === "social_greet") {
        slime.ambientCooldownUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].socialCooldownTicks;
        const partner = slime.ambientPartnerId ? state.slimes[slime.ambientPartnerId] : undefined;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseInterestReservation"])(state, slime.id);
        clearAmbient(slime);
        if (partner && partner.ambientPartnerId === slime.id) {
            partner.ambientCooldownUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].socialCooldownTicks;
            clearAmbient(partner);
        }
        return;
    }
    slime.ambientCooldownUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].behaviorCooldownTicks;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseInterestReservation"])(state, slime.id);
    clearAmbient(slime);
}
function clearAmbient(slime) {
    if (slime.state === "moving_to_ambient" || slime.state === "ambient") {
        slime.state = "idle";
    }
    slime.ambientBehaviorId = undefined;
    slime.ambientTargetId = undefined;
    slime.ambientPartnerId = undefined;
    slime.ambientUntilTick = 0;
    slime.destination = undefined;
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.faceTile = undefined;
}
function beginAmbientStay(slime, behaviorId, targetId, untilTick) {
    slime.state = "ambient";
    slime.ambientBehaviorId = behaviorId;
    slime.ambientTargetId = targetId;
    slime.ambientUntilTick = untilTick;
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
}
function previewDistance(state, slime, def) {
    if (def.id === "rest") {
        return 0;
    }
    if (def.id === "wander") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].wanderRadius.min;
    }
    if (def.id === "social_greet") {
        const partner = pickGreetPartner(state, slime, false);
        if (!partner) {
            return null;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chebyshev"])({
            x: slime.tileX,
            y: slime.tileY
        }, {
            x: partner.tileX,
            y: partner.tileY
        });
    }
    const chosen = pickInterest(state, slime, def, false);
    return chosen ? chosen.distance : null;
}
function pickInterest(state, slime, def, forced = false) {
    let best;
    for (const point of state.interestPoints){
        if (def.validInterestTags.length > 0 && !def.validInterestTags.some((tag)=>point.tags.includes(tag))) {
            continue;
        }
        if (point.reservedBy && point.reservedBy !== slime.id) {
            continue;
        }
        if (def.id === "observe_water" && point.sourceId) {
            const access = state.fishingAccessPoints.find((entry)=>entry.id === point.sourceId);
            if (access?.reservedBy) {
                continue;
            }
        }
        const stand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["standTileFor"])(state, point);
        if (!stand) {
            continue;
        }
        const distance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chebyshev"])({
            x: slime.tileX,
            y: slime.tileY
        }, stand);
        if (!forced && distance > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].maxInterestDistance) {
            continue;
        }
        const score = behaviorScore(def, slime.interest, distance);
        if (!best || score > best.score) {
            best = {
                point,
                distance,
                score
            };
        }
    }
    return best;
}
function pickWanderTile(state, slime) {
    const options = [];
    const min = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].wanderRadius.min;
    const max = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].wanderRadius.max;
    for(let dy = -max; dy <= max; dy += 1){
        for(let dx = -max; dx <= max; dx += 1){
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            if (dist < min || dist > max) {
                continue;
            }
            const tile = {
                x: slime.tileX + dx,
                y: slime.tileY + dy
            };
            if (!state.grid.isWalkable(tile.x, tile.y) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFishingReservedLand"])(state, tile)) {
                continue;
            }
            options.push(tile);
        }
    }
    if (options.length === 0) {
        return undefined;
    }
    return state.rng.pick(options);
}
function pickGreetPartner(state, slime, forced) {
    let best;
    let bestDist = Infinity;
    for (const other of Object.values(state.slimes)){
        if (other.id === slime.id) {
            continue;
        }
        if (!forced && state.tickIndex < other.ambientCooldownUntilTick) {
            continue;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAmbientEligible"])(state, other) && other.state !== "idle") {
            continue;
        }
        if (other.state !== "idle" && other.state !== "ambient") {
            continue;
        }
        if (other.currentTaskId) {
            continue;
        }
        const dist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chebyshev"])({
            x: slime.tileX,
            y: slime.tileY
        }, {
            x: other.tileX,
            y: other.tileY
        });
        if (!forced && dist > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].socialRadius) {
            continue;
        }
        if (dist < bestDist) {
            best = other;
            bestDist = dist;
        }
    }
    return best;
}
function adjacentStand(state, from, to) {
    const here = {
        x: from.tileX,
        y: from.tileY
    };
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chebyshev"])(here, {
        x: to.tileX,
        y: to.tileY
    }) <= 1) {
        return here;
    }
    for (const neighbor of (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cardinalNeighbors"])(to.tileX, to.tileY)){
        if (state.grid.isWalkable(neighbor.x, neighbor.y) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFishingReservedLand"])(state, neighbor)) {
            return neighbor;
        }
    }
    return undefined;
}
function maybeWaterReaction(state, slime) {
    if (slime.ambientEmote && state.tickIndex < slime.ambientEmoteUntilTick) {
        return;
    }
    const nearby = state.activities.some((activity)=>{
        if (activity.state === "consumed") {
            return false;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chebyshev"])({
            x: slime.tileX,
            y: slime.tileY
        }, {
            x: activity.tileX,
            y: activity.tileY
        }) <= 4;
    });
    if (!nearby) {
        return;
    }
    if (state.rng.next() > 0.2) {
        return;
    }
    slime.ambientEmote = state.rng.next() < 0.5 ? "?" : "!";
    slime.ambientEmoteUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].emoteTicks;
}
function durationFor(state, id) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT_BEHAVIORS"].find((entry)=>entry.id === id);
    if (!def) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].inspectDurationTicks.min;
    }
    return state.rng.range(def.durationRange.min, def.durationRange.max);
}
function nextConsiderDelay(state) {
    return state.rng.range(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].considerDelayTicks.min, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$ambientConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AMBIENT"].considerDelayTicks.max);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/AquaticActivitySystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityById",
    ()=>activityById,
    "clearAquaticActivities",
    ()=>clearAquaticActivities,
    "consumeActivity",
    ()=>consumeActivity,
    "findActivityInRadius",
    ()=>findActivityInRadius,
    "liveActivities",
    ()=>liveActivities,
    "releaseReservation",
    ()=>releaseReservation,
    "reserveActivity",
    ()=>reserveActivity,
    "spawnAquaticAt",
    ()=>spawnAquaticAt,
    "tickAquatic",
    ()=>tickAquatic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)");
;
;
;
function liveActivities(state) {
    return state.activities.filter((activity)=>activity.state !== "consumed");
}
function activityById(state, id) {
    if (!id) {
        return undefined;
    }
    return state.activities.find((activity)=>activity.id === id);
}
function findActivityInRadius(state, worldX, worldY, radiusPx = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx) {
    const radiusSq = radiusPx * radiusPx;
    let best;
    let bestDist = radiusSq;
    for (const activity of state.activities){
        if (activity.state !== "active") {
            continue;
        }
        const dx = activity.worldX - worldX;
        const dy = activity.worldY - worldY;
        const dist = dx * dx + dy * dy;
        if (dist <= bestDist) {
            best = activity;
            bestDist = dist;
        }
    }
    return best;
}
function reserveActivity(activity, sessionId) {
    activity.state = "reserved";
    activity.ownerSessionId = sessionId;
    activity.clueVisible = false;
}
function releaseReservation(activity, sessionId) {
    if (!activity || activity.ownerSessionId !== sessionId || activity.state !== "reserved") {
        return;
    }
    activity.state = "active";
    activity.ownerSessionId = null;
}
function consumeActivity(activity) {
    if (!activity) {
        return;
    }
    activity.state = "consumed";
    activity.clueVisible = false;
}
function clearAquaticActivities(state) {
    state.activities = [];
}
function spawnAquaticAt(state, speciesId, tileX, tileY) {
    const spot = state.fishingSpots.find((entry)=>entry.tileX === tileX && entry.tileY === tileY);
    if (!spot) {
        return null;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSpeciesValidAtDepth"])(speciesId, spot.depth)) {
        return null;
    }
    if (occupiedTiles(state).has(`${tileX},${tileY}`)) {
        const existing = liveActivities(state).find((activity)=>activity.tileX === tileX && activity.tileY === tileY);
        return existing ?? null;
    }
    const activity = createActivity(state, speciesId, spot);
    state.activities.push(activity);
    return activity;
}
function tickAquatic(state) {
    expireActivities(state);
    pulseClues(state);
    maybeSpawn(state);
}
function expireActivities(state) {
    const tick = state.tickIndex;
    state.activities = state.activities.filter((activity)=>{
        if (activity.state === "consumed") {
            return false;
        }
        if (activity.state === "reserved") {
            return true;
        }
        return activity.expiresAtTick > tick;
    });
}
function pulseClues(state) {
    const tick = state.tickIndex;
    for (const activity of state.activities){
        if (activity.state !== "active") {
            continue;
        }
        if (tick < activity.nextClueToggleTick) {
            continue;
        }
        activity.clueVisible = !activity.clueVisible;
        const range = activity.clueVisible ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["instinctScaledClueOnTicks"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maxIdleInstinct"])(state)) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].clueOffTicks;
        activity.nextClueToggleTick = tick + state.rng.range(range.min, range.max);
    }
}
function maybeSpawn(state) {
    if (liveActivities(state).length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].maxActivities) {
        return;
    }
    if (state.tickIndex < state.nextAquaticSpawnTick) {
        return;
    }
    const spawned = trySpawnRandom(state);
    const interval = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].spawnIntervalTicks;
    state.nextAquaticSpawnTick = state.tickIndex + state.rng.range(interval.min, interval.max);
    if (!spawned && liveActivities(state).length < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].maxActivities) {
        state.nextAquaticSpawnTick = state.tickIndex + 1;
    }
}
function trySpawnRandom(state) {
    const occupied = occupiedTiles(state);
    const shallow = availableSpots(state.fishingSpots, occupied, "shallow");
    const deep = availableSpots(state.fishingSpots, occupied, "deep");
    const buckets = [];
    if (shallow.length > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["speciesAtDepth"])("shallow").length > 0) {
        buckets.push({
            depth: "shallow",
            spots: shallow
        });
    }
    if (deep.length > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["speciesAtDepth"])("deep").length > 0) {
        buckets.push({
            depth: "deep",
            spots: deep
        });
    }
    if (buckets.length === 0) {
        return false;
    }
    const bucket = state.rng.pick(buckets);
    const compatible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["speciesAtDepth"])(bucket.depth);
    if (compatible.length === 0) {
        return false;
    }
    const species = state.rng.pickWeighted(compatible.map((def)=>({
            item: def,
            weight: def.activityWeight
        })));
    const spot = state.rng.pick(bucket.spots);
    state.activities.push(createActivity(state, species.id, spot));
    return true;
}
function createActivity(state, speciesId, spot) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][speciesId];
    const lifetime = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].activityLifetimeTicks;
    const onRange = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].clueOnTicks;
    const visible = true;
    return {
        id: state.nextActivityId(),
        speciesId,
        tileX: spot.tileX,
        tileY: spot.tileY,
        worldX: spot.worldX,
        worldY: spot.worldY,
        depth: spot.depth,
        clueType: def.clueType,
        waterBodyId: spot.waterBodyId,
        state: "active",
        ownerSessionId: null,
        expiresAtTick: state.tickIndex + state.rng.range(lifetime.min, lifetime.max),
        clueVisible: visible,
        nextClueToggleTick: state.tickIndex + state.rng.range(onRange.min, onRange.max)
    };
}
function occupiedTiles(state) {
    const tiles = new Set();
    for (const activity of liveActivities(state)){
        tiles.add(`${activity.tileX},${activity.tileY}`);
    }
    return tiles;
}
function availableSpots(spots, occupied, depth) {
    return spots.filter((spot)=>spot.depth === depth && !occupied.has(`${spot.tileX},${spot.tileY}`));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/FarmSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearFarms",
    ()=>clearFarms,
    "completeHarvest",
    ()=>completeHarvest,
    "completePlant",
    ()=>completePlant,
    "completeTill",
    ()=>completeTill,
    "designateFarmRect",
    ()=>designateFarmRect,
    "designateFarmTile",
    ()=>designateFarmTile,
    "farmGrowthPercent",
    ()=>farmGrowthPercent,
    "farmingVisualForPlot",
    ()=>farmingVisualForPlot,
    "instantGrowCrops",
    ()=>instantGrowCrops,
    "isValidFarmTerrain",
    ()=>isValidFarmTerrain,
    "removeFarmRect",
    ()=>removeFarmRect,
    "removeFarmTile",
    ()=>removeFarmTile,
    "tickFarms",
    ()=>tickFarms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/crops.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/simulation/systems/JobSystem.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/InterestPointSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
;
function isValidFarmTerrain(state, x, y) {
    if (!state.grid.inBounds(x, y)) {
        return false;
    }
    if (x === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TILE"].x && y === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORAGE_TILE"].y) {
        return false;
    }
    const tile = state.grid.getTile(x, y);
    if (!tile || tile.terrain !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].GRASS) {
        return false;
    }
    if (state.grid.objectAt(x, y)) {
        return false;
    }
    return true;
}
function farmingVisualForPlot(plot) {
    if (plot.state === "designated" || plot.state === "tilled") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].TILLED;
    }
    const crop = plot.cropId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(plot.cropId) : undefined;
    if (plot.state === "ready") {
        return crop?.visuals.ready ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].PLANTED;
    }
    return crop?.visuals.growing ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].PLANTED;
}
function syncFarmVisual(state, plot) {
    state.grid.setFarmingVisual(plot.tile.x, plot.tile.y, farmingVisualForPlot(plot));
    state.markFarmDirty(plot.tile.x, plot.tile.y);
}
function setPlotState(state, plot, next, cropId) {
    plot.state = next;
    if (cropId !== undefined) {
        plot.cropId = cropId;
    }
    if (next === "tilled" || next === "designated") {
        plot.cropId = undefined;
        plot.growthMs = 0;
    }
    syncFarmVisual(state, plot);
}
function designateFarmTile(state, x, y) {
    if (!isValidFarmTerrain(state, x, y)) {
        return false;
    }
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(x, y);
    if (state.farms[key]) {
        return false;
    }
    const plot = {
        tile: {
            x,
            y
        },
        state: "designated",
        growthMs: 0
    };
    state.farms[key] = plot;
    syncFarmVisual(state, plot);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rebuildInterestPoints"])(state);
    return true;
}
function designateFarmRect(state, ax, ay, bx, by) {
    const x0 = Math.min(ax, bx);
    const y0 = Math.min(ay, by);
    const x1 = Math.max(ax, bx);
    const y1 = Math.max(ay, by);
    let count = 0;
    for(let y = y0; y <= y1; y += 1){
        for(let x = x0; x <= x1; x += 1){
            if (designateFarmTile(state, x, y)) {
                count += 1;
            }
        }
    }
    return count;
}
function removeFarmTile(state, x, y) {
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmKey"])(x, y);
    const plot = state.farms[key];
    if (!plot) {
        return false;
    }
    cancelFarmTasksForTile(state, x, y);
    delete state.farms[key];
    state.grid.setFarmingVisual(x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].NONE);
    state.markFarmDirty(x, y);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$InterestPointSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rebuildInterestPoints"])(state);
    return true;
}
function removeFarmRect(state, ax, ay, bx, by) {
    const x0 = Math.min(ax, bx);
    const y0 = Math.min(ay, by);
    const x1 = Math.max(ax, bx);
    const y1 = Math.max(ay, by);
    let count = 0;
    for(let y = y0; y <= y1; y += 1){
        for(let x = x0; x <= x1; x += 1){
            if (removeFarmTile(state, x, y)) {
                count += 1;
            }
        }
    }
    return count;
}
function clearFarms(state) {
    for (const plot of Object.values(state.farms)){
        removeFarmTile(state, plot.tile.x, plot.tile.y);
    }
}
function cancelFarmTasksForTile(state, x, y) {
    const nodeId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmNodeId"])(x, y);
    for (const task of state.activeTasks()){
        if (task.nodeId !== nodeId) {
            continue;
        }
        const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
        if (slime?.state === "carrying_to_storage" || slime?.carriedResource) {
            continue;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cancelTask"])(state, task, slime, `Farm removed at ${x},${y}; task ${task.id} cancelled.`);
    }
}
function tickFarms(state) {
    for (const plot of Object.values(state.farms)){
        growPlot(state, plot);
        ensureFarmJob(state, plot);
    }
}
function growPlot(state, plot) {
    if (plot.state === "planted") {
        plot.state = "growing";
        syncFarmVisual(state, plot);
    }
    if (plot.state !== "growing" || !plot.cropId) {
        return;
    }
    plot.growthMs += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
    const crop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(plot.cropId);
    if (plot.growthMs >= crop.growthTimeMs) {
        setPlotState(state, plot, "ready", plot.cropId);
    }
}
function ensureFarmJob(state, plot) {
    const needed = neededFarmTask(plot);
    if (!needed) {
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createFarmTask"])(state, needed, plot);
}
function neededFarmTask(plot) {
    if (plot.state === "designated") {
        return "till_soil";
    }
    if (plot.state === "tilled") {
        return "plant_crop";
    }
    if (plot.state === "ready") {
        return "harvest_crop";
    }
    return undefined;
}
function completeTill(state, task) {
    const plot = state.farmAt(task.target.x, task.target.y);
    if (!plot) {
        return;
    }
    setPlotState(state, plot, "tilled");
}
function completePlant(state, task) {
    const plot = state.farmAt(task.target.x, task.target.y);
    if (!plot) {
        return;
    }
    plot.growthMs = 0;
    setPlotState(state, plot, "growing", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CROP_ID"]);
}
function completeHarvest(state, task) {
    const plot = state.farmAt(task.target.x, task.target.y);
    const cropId = plot?.cropId ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CROP_ID"];
    const yieldAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(cropId).foodYield;
    if (plot) {
        setPlotState(state, plot, "tilled");
    }
    return yieldAmount;
}
function instantGrowCrops(state) {
    for (const plot of Object.values(state.farms)){
        if (plot.state === "planted" || plot.state === "growing") {
            const cropId = plot.cropId ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CROP_ID"];
            plot.growthMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(cropId).growthTimeMs;
            setPlotState(state, plot, "ready", cropId);
        }
    }
}
function farmGrowthPercent(plot) {
    if (plot.state === "ready") {
        return 100;
    }
    if ((plot.state === "growing" || plot.state === "planted") && plot.cropId) {
        const time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$crops$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cropById"])(plot.cropId).growthTimeMs;
        return Math.min(100, Math.round(plot.growthMs / time * 100));
    }
    return 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/FishingOpportunitySystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelFishingOpportunity",
    ()=>cancelFishingOpportunity,
    "commitFishingAtWorld",
    ()=>commitFishingAtWorld,
    "commitFishingOpportunity",
    ()=>commitFishingOpportunity,
    "completeFishingOpportunity",
    ()=>completeFishingOpportunity,
    "opportunityById",
    ()=>opportunityById,
    "scoreFishingCandidates",
    ()=>scoreFishingCandidates,
    "syncOpportunityFromSlime",
    ()=>syncOpportunityFromSlime,
    "tickFishingOpportunities",
    ()=>tickFishingOpportunities,
    "validAccessPointsFor",
    ()=>validAccessPointsFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AquaticActivitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/waterBodies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
function opportunityById(state, id) {
    if (!id) {
        return undefined;
    }
    return state.opportunities.find((entry)=>entry.id === id);
}
function commitFishingOpportunity(state, activityId) {
    const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, activityId);
    if (!activity || activity.state !== "active") {
        return false;
    }
    const points = validAccessPointsFor(state, activity);
    if (points.length === 0) {
        return false;
    }
    const scored = scoreFishingCandidates(state, activity, points);
    state.lastFishingScores = scored;
    const best = scored[0];
    if (!best) {
        return false;
    }
    const slime = state.slimes[best.slimeId];
    const access = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessPointById"])(state.fishingAccessPoints, best.accessPointId);
    if (!slime || !access || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIdleAvailable"])(state, slime)) {
        return false;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelAmbientBehavior"])(state, slime);
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, access.landTile);
    if (path === null) {
        return false;
    }
    const opportunity = {
        id: state.nextOpportunityId(),
        activityId: activity.id,
        speciesId: activity.speciesId,
        waterBodyId: activity.waterBodyId,
        activityPosition: {
            x: activity.tileX,
            y: activity.tileY
        },
        validAccessPointIds: points.map((point)=>point.id),
        state: "assigned",
        assignedSlimeId: slime.id,
        accessPointId: access.id,
        taskId: null
    };
    const task = {
        id: state.nextTaskId("fish_activity"),
        type: "fish_activity",
        target: {
            x: activity.tileX,
            y: activity.tileY
        },
        nodeId: opportunity.id,
        workTile: {
            ...access.landTile
        },
        state: "assigned",
        assignedSlimeId: slime.id
    };
    opportunity.taskId = task.id;
    state.tasks[task.id] = task;
    slime.currentTaskId = task.id;
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.state = "moving_to_fishing";
    slime.destination = {
        ...access.landTile
    };
    slime.path = path;
    task.state = "in_progress";
    opportunity.state = "slime_traveling";
    access.reservedBy = opportunity.id;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reserveActivity"])(activity, opportunity.id);
    state.opportunities.push(opportunity);
    return true;
}
function commitFishingAtWorld(state, worldX, worldY) {
    const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findActivityInRadius"])(state, worldX, worldY, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].clueHitRadiusPx);
    if (!activity) {
        return false;
    }
    return commitFishingOpportunity(state, activity.id);
}
function scoreFishingCandidates(state, activity, points) {
    const results = [];
    const challenge = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][activity.speciesId].challenge;
    for (const slime of Object.values(state.slimes)){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIdleAvailable"])(state, slime)) {
            continue;
        }
        let best;
        for (const point of points){
            if (point.reservedBy || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLandTileReserved"])(state.fishingAccessPoints, point.landTile)) {
                continue;
            }
            if (!point.reachableDepths.includes(activity.depth)) {
                continue;
            }
            const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
                x: slime.tileX,
                y: slime.tileY
            }, point.landTile);
            if (path === null) {
                continue;
            }
            const pathLength = path.length;
            if (!best || pathLength < best.pathLength) {
                best = {
                    point,
                    pathLength
                };
            }
        }
        if (!best) {
            continue;
        }
        const affinity = slime.jobAffinity?.fishing ?? 1;
        const contribution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAttributeContribution"])(slime.attributes, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOB_ATTRIBUTE_WEIGHTS"].fishing);
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].challengeMatchWeight * (slime.attributes.technique - challenge.techniqueDemand + slime.attributes.strength - challenge.strengthDemand + slime.attributes.instinct - challenge.instinctDemand);
        const score = affinity + contribution + match - best.pathLength * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].distancePenaltyPerTile;
        results.push({
            slimeId: slime.id,
            name: slime.name,
            score,
            accessPointId: best.point.id,
            pathLength: best.pathLength
        });
    }
    return results.sort((a, b)=>b.score - a.score);
}
function validAccessPointsFor(state, activity) {
    return state.fishingAccessPoints.filter((point)=>{
        if (!point.enabled || point.waterBodyId !== activity.waterBodyId) {
            return false;
        }
        if (point.reservedBy || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLandTileReserved"])(state.fishingAccessPoints, point.landTile)) {
            return false;
        }
        if (!point.reachableDepths.includes(activity.depth)) {
            return false;
        }
        const water = state.fishingSpots.find((spot)=>spot.tileX === point.waterTile.x && spot.tileY === point.waterTile.y);
        const originX = water?.worldX ?? point.waterTile.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
        const originY = water?.worldY ?? point.waterTile.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
        const dx = activity.worldX - originX;
        const dy = activity.worldY - originY;
        return dx * dx + dy * dy <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx;
    });
}
function syncOpportunityFromSlime(state, slime) {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (!task || task.type !== "fish_activity") {
        return;
    }
    const opportunity = state.opportunities.find((entry)=>entry.taskId === task.id);
    if (!opportunity) {
        return;
    }
    if (slime.state === "moving_to_fishing") {
        opportunity.state = "slime_traveling";
    }
    if (slime.state === "fishing_wait") {
        opportunity.state = "fishing";
    }
    if (slime.state === "fishing_bite") {
        opportunity.state = "bite";
    }
}
function cancelFishingOpportunity(state, opportunityId) {
    const opportunity = opportunityById(state, opportunityId);
    if (!opportunity) {
        return;
    }
    if (opportunity.state === "caught" || opportunity.state === "escaped" || opportunity.state === "expired") {
        return;
    }
    const access = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessPointById"])(state.fishingAccessPoints, opportunity.accessPointId);
    if (access && access.reservedBy === opportunity.id) {
        access.reservedBy = null;
    }
    const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, opportunity.activityId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseReservation"])(activity, opportunity.id);
    const task = opportunity.taskId ? state.tasks[opportunity.taskId] : undefined;
    const slime = opportunity.assignedSlimeId ? state.slimes[opportunity.assignedSlimeId] : undefined;
    if (task && task.state !== "completed" && task.state !== "cancelled") {
        task.state = "cancelled";
        task.assignedSlimeId = undefined;
    }
    if (slime && slime.currentTaskId === opportunity.taskId) {
        slime.currentTaskId = undefined;
        if (slime.state === "moving_to_fishing" || slime.state === "fishing_wait" || slime.state === "fishing_bite") {
            slime.state = "idle";
            slime.path = [];
            slime.destination = undefined;
            slime.hopFrom = undefined;
            slime.hopTo = undefined;
        }
    }
    opportunity.state = "expired";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFishingSession"])(state, {
        opportunityId: opportunity.id,
        slimeId: opportunity.assignedSlimeId
    });
}
function completeFishingOpportunity(state, result, opportunityId = primaryOpportunityId(state)) {
    const opportunity = opportunityById(state, opportunityId);
    if (!opportunity) {
        return;
    }
    opportunity.state = result;
    const access = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessPointById"])(state.fishingAccessPoints, opportunity.accessPointId);
    if (access && access.reservedBy === opportunity.id) {
        access.reservedBy = null;
    }
    const task = opportunity.taskId ? state.tasks[opportunity.taskId] : undefined;
    if (task && task.state !== "cancelled") {
        task.state = "completed";
    }
    const slime = opportunity.assignedSlimeId ? state.slimes[opportunity.assignedSlimeId] : undefined;
    if (slime) {
        slime.currentTaskId = undefined;
        slime.state = "idle";
        slime.path = [];
        slime.destination = undefined;
        slime.hopFrom = undefined;
        slime.hopTo = undefined;
        slime.hopElapsedMs = 0;
        slime.workElapsedMs = 0;
    }
}
function primaryOpportunityId(state) {
    return state.fishing.opportunityId;
}
function tickFishingOpportunities(state) {
    for (const opportunity of state.opportunities){
        if (opportunity.state === "caught" || opportunity.state === "escaped" || opportunity.state === "expired") {
            continue;
        }
        const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, opportunity.activityId);
        if (!activity || activity.state === "consumed") {
            if (opportunity.state === "slime_traveling" || opportunity.state === "assigned") {
                cancelFishingOpportunity(state, opportunity.id);
            }
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/FishingSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "advanceFishingClock",
    ()=>advanceFishingClock,
    "autoSucceedCatch",
    ()=>autoSucceedCatch,
    "beginFishingOnArrival",
    ()=>beginFishingOnArrival,
    "cancelFishing",
    ()=>cancelFishing,
    "fightMarkerT",
    ()=>fightMarkerT,
    "forceBite",
    ()=>forceBite,
    "hookFightStats",
    ()=>hookFightStats,
    "isPerfectStrike",
    ()=>isPerfectStrike,
    "releaseOrphanedFishingSlime",
    ()=>releaseOrphanedFishingSlime,
    "resetFishCollection",
    ()=>resetFishCollection,
    "resolveStrike",
    ()=>resolveStrike,
    "startSlimeFishingSession",
    ()=>startSlimeFishingSession,
    "tickFishing",
    ()=>tickFishing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AquaticActivitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingOpportunitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/waterBodies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const DEFAULT_ATTRS = {
    technique: 3,
    strength: 3,
    instinct: 3,
    luck: 3
};
function startSlimeFishingSession(state, slime, opportunity, activity, access) {
    const bobber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$waterBodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bobberWorldFromAccess"])(access, activity);
    const delay = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][activity.speciesId].biteDelayRangeMs;
    const arriveUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].arriveTicks;
    const castUntilTick = arriveUntilTick + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castTicks;
    slime.faceTile = {
        ...access.waterTile
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertFishingSession"])(state, {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["idleFishingSession"])(),
        phase: "casting",
        sessionId: state.nextSessionId(),
        tileX: bobber.tileX,
        tileY: bobber.tileY,
        worldX: bobber.x,
        worldY: bobber.y,
        activityId: activity.id,
        speciesId: activity.speciesId,
        assignedSlimeId: slime.id,
        opportunityId: opportunity.id,
        accessPointId: access.id,
        arriveUntilTick,
        castUntilTick,
        waitUntilTick: castUntilTick + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["msToTicks"])(state.rng.range(delay.min, delay.max))
    });
}
function beginFishingOnArrival(state, slime) {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (!task || task.type !== "fish_activity") {
        return;
    }
    const opportunity = state.opportunities.find((entry)=>entry.taskId === task.id);
    const activity = opportunity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, opportunity.activityId) : undefined;
    const access = opportunity ? state.fishingAccessPoints.find((point)=>point.id === opportunity.accessPointId) : undefined;
    if (!opportunity || !activity || activity.state === "consumed" || !access) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishingOpportunity"])(state, opportunity?.id ?? null);
        return;
    }
    slime.state = "fishing_wait";
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.destination = undefined;
    opportunity.state = "fishing";
    startSlimeFishingSession(state, slime, opportunity, activity, access);
}
function releaseOrphanedFishingSlime(state, slime) {
    if (slime.state !== "fishing_wait" && slime.state !== "fishing_bite") {
        return false;
    }
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSessionForSlime"])(state.fishingSessions, slime.id);
    if (session && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLiveFishingPhase"])(session.phase)) {
        return false;
    }
    slime.state = "idle";
    slime.currentTaskId = undefined;
    slime.path = [];
    slime.destination = undefined;
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.workElapsedMs = 0;
    return true;
}
function cancelFishing(state) {
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryFishingSession"])(state.fishingSessions);
    if (session?.opportunityId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishingOpportunity"])(state, session.opportunityId);
        return;
    }
    const inFlight = state.opportunities.find((entry)=>entry.state === "assigned" || entry.state === "slime_traveling" || entry.state === "fishing" || entry.state === "bite" || entry.state === "player_interaction");
    if (inFlight) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishingOpportunity"])(state, inFlight.id);
        return;
    }
    if (!session || session.phase === "idle") {
        return;
    }
    if (session.phase !== "caught" && session.phase !== "escaped") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseReservation"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, session.activityId), session.sessionId);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFishingSession"])(state, {
        sessionId: session.sessionId
    });
}
function tickFishing(state) {
    const tick = state.tickIndex;
    for (const session of [
        ...state.fishingSessions
    ]){
        tickOneSession(state, session, tick);
    }
}
function tickOneSession(state, session, tick) {
    const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
    if (session.phase === "casting" && tick >= session.castUntilTick) {
        session.phase = "waiting";
    }
    if (session.phase === "waiting" && tick >= session.waitUntilTick) {
        if (!session.activityId || !session.speciesId) {
            beginResult(session, "escaped");
            return;
        }
        const activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, session.activityId);
        if (!activity || activity.state === "consumed") {
            beginResult(session, "escaped");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeFishingOpportunity"])(state, "escaped", session.opportunityId);
            return;
        }
        session.phase = "bite";
        session.biteUntilTick = tick + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].biteDisplayTicks;
        if (slime) {
            slime.state = "fishing_bite";
            slime.ambientEmote = "!";
            slime.ambientEmoteUntilTick = tick + 6;
        }
        const opportunity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["opportunityById"])(state, session.opportunityId);
        if (opportunity) {
            opportunity.state = "bite";
        }
        return;
    }
    if (session.phase === "bite" && tick >= session.biteUntilTick) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions) !== session) {
            session.biteUntilTick = tick;
            return;
        }
        beginFight(state, session);
    }
}
function advanceFishingClock(state, nowMs) {
    for (const session of [
        ...state.fishingSessions
    ]){
        if (session.phase === "fighting") {
            if (session.fightStartedAtMs <= 0) {
                session.fightStartedAtMs = nowMs;
            }
            const elapsed = nowMs - session.fightStartedAtMs;
            const timeout = session.markerPeriodMs * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].fightPassesBeforeTimeout;
            if (elapsed >= timeout) {
                failCatch(state, session, nowMs);
            }
            continue;
        }
        if (session.phase === "caught" || session.phase === "escaped") {
            if (session.resultAtMs <= 0) {
                session.resultAtMs = nowMs;
            }
            if (session.resultAtMs > 0 && nowMs - session.resultAtMs >= 400) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFishingSession"])(state, {
                    sessionId: session.sessionId
                });
            }
        }
    }
}
function resolveStrike(state, nowMs) {
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions);
    if (!session) {
        return "ignored";
    }
    if (session.fightStartedAtMs <= 0) {
        session.fightStartedAtMs = nowMs;
    }
    const t = fightMarkerT(session, nowMs);
    const inZone = t >= session.zoneStart && t <= session.zoneStart + session.zoneWidth;
    if (inZone) {
        session.lastStrike = isPerfectStrike(session, t) ? "perfect" : "hit";
        succeedCatch(state, session, nowMs);
        return "hit";
    }
    session.lastStrike = "miss";
    failCatch(state, session, nowMs);
    return "miss";
}
function isPerfectStrike(session, t) {
    const center = session.zoneStart + session.zoneWidth / 2;
    const window = Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].perfectZoneMin, session.zoneWidth * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].perfectZoneFactor);
    return Math.abs(t - center) <= window;
}
function fightMarkerT(session, nowMs) {
    if (session.phase !== "fighting" || session.markerPeriodMs <= 0 || session.fightStartedAtMs <= 0) {
        return 0;
    }
    const elapsed = Math.max(0, nowMs - session.fightStartedAtMs);
    const period = session.markerPeriodMs;
    const cycle = elapsed % (period * 2);
    if (cycle <= period) {
        return cycle / period;
    }
    return 2 - cycle / period;
}
function forceBite(state, slimeId) {
    const session = slimeId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingSessionForSlime"])(state.fishingSessions, slimeId) : state.fishingSessions.find((entry)=>(entry.phase === "waiting" || entry.phase === "casting") && entry.activityId);
    if (!session || !session.activityId) {
        return false;
    }
    if (session.phase === "casting") {
        session.phase = "waiting";
    }
    if (session.phase !== "waiting") {
        return false;
    }
    session.waitUntilTick = state.tickIndex;
    tickFishing(state);
    return sessionIsBiteOrFight(session);
}
function autoSucceedCatch(state, nowMs) {
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions) ?? state.fishingSessions.find((entry)=>entry.phase === "bite") ?? state.fishingSessions.find((entry)=>entry.phase === "waiting" && entry.activityId && entry.speciesId) ?? state.fishingSessions.find((entry)=>entry.phase === "casting" && entry.activityId && entry.speciesId);
    if (!session) {
        return false;
    }
    if (session.phase === "casting") {
        session.phase = "waiting";
    }
    if (session.phase === "bite" || session.phase === "waiting") {
        beginFight(state, session);
    }
    if (session.phase !== "fighting") {
        return false;
    }
    succeedCatch(state, session, nowMs);
    return true;
}
function resetFishCollection(state) {
    state.fishCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyFishCollection"])();
}
function hookFightStats(speciesId, attrs, rngNext) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][speciesId];
    const technique = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampAttributes"])(attrs).technique;
    const strength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampAttributes"])(attrs).strength;
    const luck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampAttributes"])(attrs).luck;
    let zoneWidth = def.targetZoneWidth * (1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].techniqueZoneBonusPerPoint * (technique - 1));
    const luckRoll = rngNext();
    if (luckRoll < luck / 5 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].luckWidenChanceFactor) {
        zoneWidth += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].luckWidenAmount;
    }
    zoneWidth = Math.min(0.9, zoneWidth);
    const demand = def.challenge.strengthDemand;
    const markerPeriodMs = def.markerPeriodMs * (1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].strengthPeriodBonusPerPoint * Math.max(0, strength - demand));
    const zoneStart = rngNext() * (1 - zoneWidth);
    return {
        markerPeriodMs,
        zoneWidth,
        zoneStart
    };
}
function sessionAttrs(state, session) {
    const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
    return slime?.attributes ?? DEFAULT_ATTRS;
}
function beginFight(state, session) {
    const busy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fightingSession"])(state.fishingSessions);
    if (busy && busy !== session) {
        return;
    }
    const speciesId = session.speciesId;
    if (!speciesId) {
        beginResult(session, "escaped");
        return;
    }
    const stats = hookFightStats(speciesId, sessionAttrs(state, session), ()=>state.rng.next());
    session.phase = "fighting";
    session.fightStartedAtMs = 0;
    session.markerPeriodMs = stats.markerPeriodMs;
    session.zoneWidth = stats.zoneWidth;
    session.zoneStart = stats.zoneStart;
    const opportunity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["opportunityById"])(state, session.opportunityId);
    if (opportunity) {
        opportunity.state = "player_interaction";
    }
}
function succeedCatch(state, session, nowMs) {
    const speciesId = session.speciesId;
    if (!speciesId) {
        beginResult(session, "escaped", nowMs);
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["consumeActivity"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, session.activityId));
    grantCatch(state, session, speciesId);
    session.phase = "caught";
    session.caughtSpeciesId = speciesId;
    session.resultAtMs = nowMs;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeFishingOpportunity"])(state, "caught", session.opportunityId);
    const slime = session.assignedSlimeId ? state.slimes[session.assignedSlimeId] : undefined;
    if (slime) {
        slime.fishingCelebrateUntilTick = state.tickIndex + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING_SUCCESS_PRESENTATION_HOLD_TICKS"];
    }
}
function failCatch(state, session, nowMs) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["consumeActivity"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AquaticActivitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityById"])(state, session.activityId));
    beginResult(session, "escaped", nowMs);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeFishingOpportunity"])(state, "escaped", session.opportunityId);
}
function grantCatch(state, session, speciesId) {
    const entry = state.fishCollection[speciesId];
    session.isNewDiscovery = !entry.discovered;
    state.fishCollection = {
        ...state.fishCollection,
        [speciesId]: {
            speciesId,
            discovered: true,
            caughtCount: entry.caughtCount + 1
        }
    };
    state.fishInventory = {
        ...state.fishInventory,
        [speciesId]: state.fishInventory[speciesId] + 1
    };
}
function beginResult(session, phase, nowMs = 0) {
    session.phase = phase;
    session.resultAtMs = nowMs;
}
function sessionIsBiteOrFight(session) {
    return session.phase === "bite" || session.phase === "fighting";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/InterestPointSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chebyshev",
    ()=>chebyshev,
    "interestPointById",
    ()=>interestPointById,
    "isFishingReservedLand",
    ()=>isFishingReservedLand,
    "rebuildInterestPoints",
    ()=>rebuildInterestPoints,
    "releaseInterestReservation",
    ()=>releaseInterestReservation,
    "standTileFor",
    ()=>standTileFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
;
;
function rebuildInterestPoints(state) {
    const previous = new Map(state.interestPoints.map((point)=>[
            point.id,
            point.reservedBy
        ]));
    const next = [];
    for (const access of state.fishingAccessPoints){
        if (!access.enabled) {
            continue;
        }
        next.push({
            id: `water:${access.id}`,
            type: "water_edge",
            tile: {
                ...access.landTile
            },
            tags: [
                "water_edge"
            ],
            sourceId: access.id,
            reservedBy: null
        });
    }
    for (const plot of Object.values(state.farms)){
        next.push({
            id: `farm:${plot.tile.x},${plot.tile.y}`,
            type: "farm",
            tile: {
                ...plot.tile
            },
            tags: [
                "farm"
            ],
            sourceId: `farm:${plot.tile.x},${plot.tile.y}`,
            reservedBy: null
        });
    }
    for (const object of state.grid.objects){
        if (object.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE || object.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].PINE_TREE) {
            next.push({
                id: `tree:${object.x},${object.y}`,
                type: "tree",
                tile: {
                    x: object.x,
                    y: object.y
                },
                tags: [
                    "tree",
                    "nature"
                ],
                sourceId: `obj:${object.x},${object.y}`,
                reservedBy: null
            });
        }
        if (object.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK) {
            next.push({
                id: `rock:${object.x},${object.y}`,
                type: "rock",
                tile: {
                    x: object.x,
                    y: object.y
                },
                tags: [
                    "rock",
                    "nature"
                ],
                sourceId: `obj:${object.x},${object.y}`,
                reservedBy: null
            });
        }
    }
    for(let y = 0; y < state.grid.height; y += 1){
        for(let x = 0; x < state.grid.width; x += 1){
            const tile = state.grid.getTile(x, y);
            if (tile?.detail === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].GRASS_FLOWER) {
                next.push({
                    id: `flower:${x},${y}`,
                    type: "flower",
                    tile: {
                        x,
                        y
                    },
                    tags: [
                        "flower",
                        "nature"
                    ],
                    sourceId: `detail:${x},${y}`,
                    reservedBy: null
                });
            }
        }
    }
    next.push({
        id: "storage",
        type: "storage",
        tile: {
            ...state.storage
        },
        tags: [
            "storage"
        ],
        sourceId: "storage",
        reservedBy: null
    });
    for (const point of next){
        const owner = previous.get(point.id);
        if (owner && state.slimes[owner]) {
            point.reservedBy = owner;
        }
    }
    state.interestPoints = next;
    const byTag = {};
    for (const point of next){
        for (const tag of point.tags){
            if (!byTag[tag]) {
                byTag[tag] = [];
            }
            byTag[tag].push(point.id);
        }
    }
    state.interestPointsByTag = byTag;
}
function interestPointById(state, id) {
    if (!id) {
        return undefined;
    }
    return state.interestPoints.find((point)=>point.id === id);
}
function releaseInterestReservation(state, slimeId) {
    for (const point of state.interestPoints){
        if (point.reservedBy === slimeId) {
            point.reservedBy = null;
        }
    }
}
function isFishingReservedLand(state, tile) {
    return state.fishingAccessPoints.some((point)=>point.reservedBy && point.landTile.x === tile.x && point.landTile.y === tile.y);
}
function standTileFor(state, point) {
    if (state.grid.isWalkable(point.tile.x, point.tile.y) && !isFishingReservedLand(state, point.tile)) {
        return {
            ...point.tile
        };
    }
    for (const neighbor of (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cardinalNeighbors"])(point.tile.x, point.tile.y)){
        if (state.grid.isWalkable(neighbor.x, neighbor.y) && !isFishingReservedLand(state, neighbor)) {
            return neighbor;
        }
    }
    return null;
}
function chebyshev(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/JobSystem.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignAvailableTasks",
    ()=>assignAvailableTasks,
    "beginAssignedTask",
    ()=>beginAssignedTask,
    "beginCarryToStorage",
    ()=>beginCarryToStorage,
    "canPerformTask",
    ()=>canPerformTask,
    "cancelTask",
    ()=>cancelTask,
    "clearActiveTasks",
    ()=>clearActiveTasks,
    "createFarmTask",
    ()=>createFarmTask,
    "createGatherTask",
    ()=>createGatherTask,
    "deliver",
    ()=>deliver,
    "releaseSlime",
    ()=>releaseSlime,
    "slimeAtDestination",
    ()=>slimeAtDestination,
    "startWorking",
    ()=>startWorking,
    "taskSuitability",
    ()=>taskSuitability
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$GridPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/GridPosition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FarmPlot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/Task.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/resources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingOpportunitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
const SLIME_ASSIGN_ORDER = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO
];
;
function nodeMatches(type, node) {
    if (type === "gather_wood") {
        return node.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESOURCE_IDS"].WOOD;
    }
    return node.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESOURCE_IDS"].STONE;
}
function nodeHasActiveTask(state, nodeId) {
    return state.activeTasks().some((task)=>task.nodeId === nodeId);
}
function canPerformTask(slime, task) {
    void slime;
    void task;
    return true;
}
function taskSuitability(slime, task, pathLength = 0) {
    const affinity = slime.jobAffinity?.[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jobCategory"])(task.type)] ?? 1;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFishingTask"])(task.type)) {
        return affinity;
    }
    return affinity + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAttributeContribution"])(slime.attributes, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOB_ATTRIBUTE_WEIGHTS"].fishing) - pathLength * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].distancePenaltyPerTile;
}
function pickWorker(state, task) {
    let best;
    let bestScore = -Infinity;
    for (const id of SLIME_ASSIGN_ORDER){
        const slime = state.slimes[id];
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$slimeAvailability$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIdleAvailable"])(state, slime) || !canPerformTask(slime, task)) {
            continue;
        }
        const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
            x: slime.tileX,
            y: slime.tileY
        }, task.workTile);
        if (path === null) {
            continue;
        }
        const score = taskSuitability(slime, task, path.length);
        if (!best || score > bestScore) {
            best = slime;
            bestScore = score;
        }
    }
    return best;
}
function createGatherTask(state, type, preferredTile) {
    let node;
    if (preferredTile) {
        const atTile = state.nodeAtTile(preferredTile.x, preferredTile.y);
        if (atTile && nodeMatches(type, atTile) && !nodeHasActiveTask(state, atTile.id)) {
            node = atTile;
        }
    }
    if (!node) {
        node = state.nodes.find((candidate)=>nodeMatches(type, candidate) && !nodeHasActiveTask(state, candidate.id));
    }
    if (!node) {
        return undefined;
    }
    const resourceType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceTypeForTask"])(type);
    const task = {
        id: state.nextTaskId(type),
        type,
        target: node.tile,
        nodeId: node.id,
        workTile: node.workTile,
        resourceType,
        state: "available"
    };
    state.tasks[task.id] = task;
    return task;
}
function createFarmTask(state, type, plot) {
    const nodeId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FarmPlot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["farmNodeId"])(plot.tile.x, plot.tile.y);
    if (nodeHasActiveTask(state, nodeId)) {
        return undefined;
    }
    const task = {
        id: state.nextTaskId(type),
        type,
        target: {
            x: plot.tile.x,
            y: plot.tile.y
        },
        nodeId,
        workTile: {
            x: plot.tile.x,
            y: plot.tile.y
        },
        resourceType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceTypeForTask"])(type),
        state: "available"
    };
    state.tasks[task.id] = task;
    return task;
}
function assignAvailableTasks(state) {
    const openTasks = Object.values(state.tasks).filter((task)=>task.state === "available").sort((a, b)=>a.id.localeCompare(b.id));
    for (const task of openTasks){
        const slime = pickWorker(state, task);
        if (!slime) {
            continue;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelAmbientBehavior"])(state, slime);
        task.state = "assigned";
        task.assignedSlimeId = slime.id;
        slime.currentTaskId = task.id;
    }
}
function beginAssignedTask(state, slime) {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (!task || task.state !== "assigned" && task.state !== "in_progress") {
        return;
    }
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, task.workTile);
    if (path === null) {
        cancelTask(state, task, slime, `Task ${task.id} unreachable from ${slime.id}; cancelled.`);
        return;
    }
    task.state = "in_progress";
    slime.state = task.type === "fish_activity" ? "moving_to_fishing" : "moving_to_task";
    slime.destination = task.workTile;
    slime.path = path;
    if (path.length === 0) {
        if (task.type === "fish_activity") {
            return;
        }
        startWorking(slime);
    }
}
function startWorking(slime) {
    slime.state = "working";
    slime.workElapsedMs = 0;
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.destination = undefined;
}
function beginCarryToStorage(state, slime) {
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, state.storage);
    if (path === null) {
        const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
        if (task && (task.state === "assigned" || task.state === "in_progress")) {
            cancelTask(state, task, slime, `Storage unreachable for ${slime.id}; task ${task.id} cancelled.`);
        } else {
            slime.carriedResource = undefined;
            releaseSlime(slime);
        }
        return;
    }
    slime.state = "carrying_to_storage";
    slime.destination = state.storage;
    slime.path = path;
    if (path.length === 0) {
        deliver(state, slime);
    }
}
function deliver(state, slime) {
    slime.state = "delivering";
    const carried = slime.carriedResource;
    if (carried) {
        state.resources[carried.type] += carried.amount;
        slime.carriedResource = undefined;
    }
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (task && task.state !== "completed" && task.state !== "cancelled") {
        task.state = "completed";
    }
    releaseSlime(slime);
}
function cancelTask(state, task, slime, message) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$Task$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFishingTask"])(task.type)) {
        const opportunity = state.opportunities.find((entry)=>entry.taskId === task.id);
        if (opportunity) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFishingOpportunity"])(state, opportunity.id);
            return;
        }
    }
    task.state = "cancelled";
    task.assignedSlimeId = undefined;
    state.warnOnce(`task:${task.id}`, message);
    if (slime) {
        slime.carriedResource = undefined;
        releaseSlime(slime);
    }
}
function clearActiveTasks(state) {
    for (const task of state.activeTasks()){
        const slime = task.assignedSlimeId ? state.slimes[task.assignedSlimeId] : undefined;
        cancelTask(state, task, slime, `Task ${task.id} cleared.`);
    }
}
function releaseSlime(slime) {
    slime.state = "idle";
    slime.currentTaskId = undefined;
    slime.destination = undefined;
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.workElapsedMs = 0;
}
function slimeAtDestination(slime, dest) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$GridPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionsEqual"])({
        x: slime.tileX,
        y: slime.tileY
    }, dest) && slime.path.length === 0 && !slime.hopTo;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/NeedsSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "beginMovingToFood",
    ()=>beginMovingToFood,
    "isSeekingFood",
    ()=>isSeekingFood,
    "startEating",
    ()=>startEating,
    "tickNeeds",
    ()=>tickNeeds,
    "tryConsumeFood",
    ()=>tryConsumeFood
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/SlimeState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/simulation/systems/JobSystem.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
const SLIME_ORDER = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].PINGO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].MOMO,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$SlimeState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_IDS"].TITO
];
function tryConsumeFood(state, amount) {
    if (state.resources.food < amount) {
        return false;
    }
    state.resources.food -= amount;
    return true;
}
function isSeekingFood(slime) {
    return slime.state === "moving_to_food" || slime.state === "eating";
}
function tickNeeds(state) {
    for (const id of SLIME_ORDER){
        const slime = state.slimes[id];
        slime.satiety = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clampSatiety"])(slime.satiety - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SATIETY_DECAY_PER_TICK"]);
        maybeSeekFood(state, slime);
    }
}
function maybeSeekFood(state, slime) {
    if (isSeekingFood(slime)) {
        return;
    }
    const hunger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hungerState"])(slime.satiety);
    const foodReady = state.resources.food >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_FOOD_COST"];
    if (hunger === "starving") {
        if (slime.state === "carrying_to_storage" || slime.state === "delivering" || slime.state === "moving_to_fishing" || slime.state === "fishing_wait" || slime.state === "fishing_bite") {
            return;
        }
        if (foodReady) {
            interruptForFood(state, slime);
        }
        return;
    }
}
function interruptForFood(state, slime) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelAmbientBehavior"])(state, slime);
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (task && (task.state === "assigned" || task.state === "in_progress" || task.state === "available")) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cancelTask"])(state, task, slime, `${slime.id} interrupted work to eat; task ${task.id} cancelled.`);
    }
    beginMovingToFood(state, slime);
}
function beginMovingToFood(state, slime) {
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(state.grid, {
        x: slime.tileX,
        y: slime.tileY
    }, state.storage);
    if (path === null) {
        state.warnOnce(`eat:${slime.id}`, `Storage unreachable for ${slime.id}; cannot eat.`);
        if (slime.state !== "idle") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
        }
        return;
    }
    slime.state = "moving_to_food";
    slime.destination = state.storage;
    slime.path = path;
    slime.currentTaskId = undefined;
    if (path.length === 0) {
        startEating(state, slime);
    }
}
function startEating(state, slime) {
    if (!tryConsumeFood(state, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_FOOD_COST"])) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
        return;
    }
    slime.state = "eating";
    slime.workElapsedMs = 0;
    slime.path = [];
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
    slime.destination = undefined;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/SlimeSystem.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tickSlimes",
    ()=>tickSlimes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/simulation/systems/JobSystem.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FarmSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$NeedsSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/NeedsSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingSystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/FishingOpportunitySystem.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/systems/AmbientBehaviorSystem.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function startHop(slime, nextX, nextY) {
    slime.hopFrom = {
        x: slime.tileX,
        y: slime.tileY
    };
    slime.hopTo = {
        x: nextX,
        y: nextY
    };
    slime.hopElapsedMs = 0;
}
function finishHop(slime) {
    if (!slime.hopTo) {
        return;
    }
    slime.tileX = slime.hopTo.x;
    slime.tileY = slime.hopTo.y;
    slime.hopFrom = undefined;
    slime.hopTo = undefined;
    slime.hopElapsedMs = 0;
}
function dequeueHop(slime) {
    const next = slime.path.shift();
    if (!next) {
        return true;
    }
    startHop(slime, next.x, next.y);
    return false;
}
function advanceHop(slime) {
    if (!slime.hopTo) {
        return dequeueHop(slime);
    }
    slime.hopElapsedMs += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
    if (slime.hopElapsedMs < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_HOP_DURATION_MS"]) {
        return false;
    }
    finishHop(slime);
    if (slime.path.length === 0) {
        return true;
    }
    return dequeueHop(slime);
}
function tickIdle(state, slime) {
    if (slime.currentTaskId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["beginAssignedTask"])(state, slime);
        if (slime.state === "moving_to_fishing") {
            const task = state.tasks[slime.currentTaskId];
            if (task && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["slimeAtDestination"])(slime, task.workTile)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["beginFishingOnArrival"])(state, slime);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncOpportunityFromSlime"])(state, slime);
            }
        }
        return;
    }
    slime.idleWanderTicks -= 1;
}
function tickHoppingIdle(slime) {
    slime.hopElapsedMs += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
    if (slime.hopElapsedMs >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLIME_HOP_DURATION_MS"]) {
        finishHop(slime);
    }
}
function finishWork(state, slime) {
    const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
    if (!task) {
        slime.state = "idle";
        return;
    }
    if (task.type === "till_soil") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeTill"])(state, task);
        task.state = "completed";
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
        return;
    }
    if (task.type === "plant_crop") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completePlant"])(state, task);
        task.state = "completed";
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
        return;
    }
    if (task.type === "harvest_crop") {
        const amount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FarmSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeHarvest"])(state, task);
        slime.carriedResource = {
            type: "food",
            amount
        };
        task.state = "completed";
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["beginCarryToStorage"])(state, slime);
        return;
    }
    if (!task.resourceType) {
        task.state = "completed";
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
        return;
    }
    slime.carriedResource = {
        type: task.resourceType,
        amount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GATHER_AMOUNT"]
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["beginCarryToStorage"])(state, slime);
}
function tickSlimes(state) {
    for (const slime of Object.values(state.slimes)){
        tickSlime(state, slime);
    }
}
function tickSlime(state, slime) {
    if (slime.state === "idle") {
        if (slime.hopTo) {
            tickHoppingIdle(slime);
            return;
        }
        tickIdle(state, slime);
        return;
    }
    if (slime.state === "moving_to_task" || slime.state === "moving_to_fishing") {
        const task = slime.currentTaskId ? state.tasks[slime.currentTaskId] : undefined;
        if (!task || task.state === "cancelled") {
            slime.carriedResource = undefined;
            slime.state = "idle";
            slime.currentTaskId = undefined;
            slime.path = [];
            slime.hopFrom = undefined;
            slime.hopTo = undefined;
            return;
        }
        const arrived = advanceHop(slime);
        if (arrived && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["slimeAtDestination"])(slime, task.workTile)) {
            if (slime.state === "moving_to_fishing" || task.type === "fish_activity") {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["beginFishingOnArrival"])(state, slime);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["startWorking"])(slime);
            }
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncOpportunityFromSlime"])(state, slime);
        return;
    }
    if (slime.state === "moving_to_ambient") {
        const dest = slime.destination;
        const arrived = advanceHop(slime);
        if (arrived && dest && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["slimeAtDestination"])(slime, dest)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finishAmbientArrival"])(state, slime);
        }
        return;
    }
    if (slime.state === "ambient") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$AmbientBehaviorSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickAmbientActing"])(state, slime);
        return;
    }
    if (slime.state === "fishing_wait" || slime.state === "fishing_bite") {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["releaseOrphanedFishingSlime"])(state, slime)) {
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$FishingOpportunitySystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncOpportunityFromSlime"])(state, slime);
        return;
    }
    if (slime.state === "working") {
        slime.workElapsedMs += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"] * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workSpeedMultiplier"])(slime.satiety);
        if (slime.workElapsedMs < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK_DURATION_MS"]) {
            return;
        }
        finishWork(state, slime);
        return;
    }
    if (slime.state === "carrying_to_storage") {
        const arrived = advanceHop(slime);
        if (arrived && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["slimeAtDestination"])(slime, state.storage)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deliver"])(state, slime);
        }
        return;
    }
    if (slime.state === "delivering") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deliver"])(state, slime);
        return;
    }
    if (slime.state === "moving_to_food") {
        const arrived = advanceHop(slime);
        if (arrived && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["slimeAtDestination"])(slime, state.storage)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$NeedsSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startEating"])(state, slime);
        }
        return;
    }
    if (slime.state === "eating") {
        slime.workElapsedMs += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"];
        if (slime.workElapsedMs < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_DURATION_MS"]) {
            return;
        }
        slime.satiety = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SATIETY_MAX"], slime.satiety + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_SATIETY_RESTORE"]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$systems$2f$JobSystem$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["releaseSlime"])(slime);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/systems/slimeAvailability.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAmbientEligible",
    ()=>isAmbientEligible,
    "isAmbientState",
    ()=>isAmbientState,
    "isFishingBusy",
    ()=>isFishingBusy,
    "isIdleAvailable",
    ()=>isIdleAvailable,
    "isJobAssignable",
    ()=>isJobAssignable,
    "isProductiveBusy",
    ()=>isProductiveBusy,
    "maxIdleInstinct",
    ()=>maxIdleInstinct,
    "slimeMode",
    ()=>slimeMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
;
function isFishingBusy(slime) {
    return slime.state === "moving_to_fishing" || slime.state === "fishing_wait" || slime.state === "fishing_bite";
}
function isAmbientState(slime) {
    return slime.state === "moving_to_ambient" || slime.state === "ambient";
}
function isProductiveBusy(slime) {
    return Boolean(slime.currentTaskId) || slime.state === "moving_to_task" || slime.state === "working" || slime.state === "carrying_to_storage" || slime.state === "delivering" || slime.state === "moving_to_food" || slime.state === "eating" || isFishingBusy(slime);
}
function isIdleAvailable(state, slime) {
    return isJobAssignable(state, slime);
}
function isJobAssignable(state, slime) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hungerState"])(slime.satiety) === "starving" && state.resources.food >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_FOOD_COST"]) {
        return false;
    }
    if (isFishingBusy(slime) || slime.state === "moving_to_food" || slime.state === "eating") {
        return false;
    }
    if (slime.state === "working" || slime.state === "carrying_to_storage" || slime.state === "delivering") {
        return false;
    }
    if (slime.state === "moving_to_task" && slime.currentTaskId) {
        return false;
    }
    if (slime.currentTaskId && !isAmbientState(slime)) {
        return false;
    }
    if (slime.state === "idle" || isAmbientState(slime)) {
        return true;
    }
    return false;
}
function isAmbientEligible(state, slime) {
    if (isProductiveBusy(slime) || isAmbientState(slime)) {
        return false;
    }
    if (slime.state !== "idle" || slime.hopTo) {
        return false;
    }
    if (slime.fishingCelebrateUntilTick > state.tickIndex) {
        return false;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hungerState"])(slime.satiety) === "starving" && state.resources.food >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EAT_FOOD_COST"]) {
        return false;
    }
    return true;
}
function slimeMode(slime) {
    if (slime.state === "moving_to_food" || slime.state === "eating") {
        return "NEED";
    }
    if (isAmbientState(slime)) {
        return "AMBIENT";
    }
    if (isProductiveBusy(slime) || slime.state === "moving_to_task") {
        return "JOB";
    }
    return "IDLE";
}
function maxIdleInstinct(state) {
    let best = ATTR_FALLBACK;
    let found = false;
    for (const slime of Object.values(state.slimes)){
        if (!isJobAssignable(state, slime)) {
            continue;
        }
        found = true;
        best = Math.max(best, slime.attributes.instinct);
    }
    if (found) {
        return best;
    }
    for (const slime of Object.values(state.slimes)){
        best = Math.max(best, slime.attributes.instinct);
    }
    return best;
}
const ATTR_FALLBACK = 3;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/waterBodies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accessPointById",
    ()=>accessPointById,
    "bobberWorldFromAccess",
    ()=>bobberWorldFromAccess,
    "buildWaterWorld",
    ()=>buildWaterWorld,
    "isLandTileReserved",
    ()=>isLandTileReserved
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/render/water/waterCoverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/fishingConfig.ts [app-client] (ecmascript)");
;
;
;
;
;
const CARDINALS = [
    {
        dx: 0,
        dy: -1,
        dir: "north",
        opposite: "south"
    },
    {
        dx: 1,
        dy: 0,
        dir: "east",
        opposite: "west"
    },
    {
        dx: 0,
        dy: 1,
        dir: "south",
        opposite: "north"
    },
    {
        dx: -1,
        dy: 0,
        dir: "west",
        opposite: "east"
    }
];
function buildWaterWorld(grid, pathOrigin) {
    const cells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectWaterCells"])(grid);
    const cellKey = (x, y)=>`${x},${y}`;
    const cellByKey = new Map(cells.map((cell)=>[
            cellKey(cell.x, cell.y),
            cell
        ]));
    const visited = new Set();
    const bodies = [];
    let bodySeq = 1;
    for (const cell of cells){
        const start = cellKey(cell.x, cell.y);
        if (visited.has(start)) {
            continue;
        }
        const tiles = [];
        const queue = [
            cell
        ];
        visited.add(start);
        while(queue.length > 0){
            const current = queue.shift();
            if (!current) {
                break;
            }
            tiles.push({
                x: current.x,
                y: current.y
            });
            for (const step of CARDINALS){
                const nx = current.x + step.dx;
                const ny = current.y + step.dy;
                const neighborKey = cellKey(nx, ny);
                if (visited.has(neighborKey) || !cellByKey.has(neighborKey)) {
                    continue;
                }
                visited.add(neighborKey);
                const neighbor = cellByKey.get(neighborKey);
                if (neighbor) {
                    queue.push(neighbor);
                }
            }
        }
        const id = `water_${bodySeq}`;
        bodySeq += 1;
        const shallowTiles = [];
        const deepTiles = [];
        for (const tile of tiles){
            const entry = cellByKey.get(cellKey(tile.x, tile.y));
            if (entry?.interior) {
                deepTiles.push(tile);
            } else {
                shallowTiles.push(tile);
            }
        }
        bodies.push({
            id,
            type: classifyBody(tiles.length),
            tiles,
            shallowTiles,
            deepTiles
        });
    }
    const tileToBody = new Map();
    for (const body of bodies){
        for (const tile of body.tiles){
            tileToBody.set(cellKey(tile.x, tile.y), body.id);
        }
    }
    const spots = cells.map((cell)=>{
        const point = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterEffectPoint"])(cell);
        return {
            tileX: cell.x,
            tileY: cell.y,
            worldX: point.x,
            worldY: point.y,
            waterBodyId: tileToBody.get(cellKey(cell.x, cell.y)) ?? "",
            depth: cell.interior ? "deep" : "shallow"
        };
    });
    const accessPoints = [];
    for (const cell of cells){
        const waterBodyId = tileToBody.get(cellKey(cell.x, cell.y));
        if (!waterBodyId) {
            continue;
        }
        for (const step of CARDINALS){
            const landX = cell.x + step.dx;
            const landY = cell.y + step.dy;
            if (!grid.inBounds(landX, landY) || !grid.isWalkable(landX, landY)) {
                continue;
            }
            if (grid.getTile(landX, landY)?.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER) {
                continue;
            }
            const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findPath"])(grid, pathOrigin, {
                x: landX,
                y: landY
            });
            if (path === null) {
                continue;
            }
            const waterWorld = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$render$2f$water$2f$waterCoverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterEffectPoint"])(cell);
            const reachableDepths = depthsInCastRange(spots, waterWorld.x, waterWorld.y, waterBodyId);
            accessPoints.push({
                id: `ap_${waterBodyId}_${landX}_${landY}_${step.opposite}`,
                waterBodyId,
                landTile: {
                    x: landX,
                    y: landY
                },
                waterTile: {
                    x: cell.x,
                    y: cell.y
                },
                castDirection: step.opposite,
                reachableDepths,
                enabled: true,
                reservedBy: null
            });
        }
    }
    return {
        bodies,
        accessPoints,
        spots
    };
}
function accessPointById(points, id) {
    if (!id) {
        return undefined;
    }
    return points.find((point)=>point.id === id);
}
function isLandTileReserved(points, land, exceptPointId) {
    return points.some((point)=>point.reservedBy !== null && point.id !== exceptPointId && point.landTile.x === land.x && point.landTile.y === land.y);
}
function bobberWorldFromAccess(point, activity) {
    const waterX = point.waterTile.x * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const waterY = point.waterTile.y * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] / 2;
    const dx = activity.worldX - waterX;
    const dy = activity.worldY - waterY;
    const dist = Math.hypot(dx, dy);
    if (dist <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx && dist > 0) {
        return {
            x: activity.worldX,
            y: activity.worldY,
            tileX: point.waterTile.x,
            tileY: point.waterTile.y
        };
    }
    const offset = 10;
    let x = waterX;
    let y = waterY;
    if (point.castDirection === "east") {
        x += offset;
    } else if (point.castDirection === "west") {
        x -= offset;
    } else if (point.castDirection === "south") {
        y += offset;
    } else {
        y -= offset;
    }
    return {
        x,
        y,
        tileX: point.waterTile.x,
        tileY: point.waterTile.y
    };
}
function classifyBody(tileCount) {
    return tileCount <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].pondMaxTiles ? "pond" : "lake";
}
function depthsInCastRange(spots, worldX, worldY, waterBodyId) {
    const radiusSq = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$fishingConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISHING"].castRadiusPx;
    const depths = new Set();
    for (const spot of spots){
        if (spot.waterBodyId !== waterBodyId) {
            continue;
        }
        const dx = spot.worldX - worldX;
        const dy = spot.worldY - worldY;
        if (dx * dx + dy * dy <= radiusSq) {
            depths.add(spot.depth);
        }
    }
    if (depths.size === 0) {
        depths.add("shallow");
    }
    return [
        ...depths
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/Grid.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Grid",
    ()=>Grid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$connectedTerrain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/connectedTerrain.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$resolveShoreline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/autotile/resolveShoreline.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/autotile/shorelineDefinitions.ts [app-client] (ecmascript)");
;
;
;
;
;
const EMPTY_FARM_FRAME = -1;
class Grid {
    width;
    height;
    objects;
    tiles;
    constructor(width, height, terrain, details, objects, grassVariants = emptyLayer(width, height, null), farming = emptyLayer(width, height, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].NONE)){
        if (terrain.length !== height || terrain.some((row)=>row.length !== width)) {
            throw new Error("Terrain array does not match grid dimensions.");
        }
        if (details.length !== height || details.some((row)=>row.length !== width)) {
            throw new Error("Detail array does not match grid dimensions.");
        }
        if (grassVariants.length !== height || grassVariants.some((row)=>row.length !== width)) {
            throw new Error("Grass variant array does not match grid dimensions.");
        }
        if (farming.length !== height || farming.some((row)=>row.length !== width)) {
            throw new Error("Farming array does not match grid dimensions.");
        }
        this.width = width;
        this.height = height;
        this.objects = objects;
        this.tiles = terrain.map((row, y)=>row.map((terrainType, x)=>{
                const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_DEFS"][terrainType];
                const variant = terrainType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].GRASS ? grassVariants[y][x] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].PLAIN : null;
                return {
                    terrain: terrainType,
                    grassVariant: variant,
                    detail: details[y][x],
                    farming: farming[y][x],
                    walkable: def.walkable,
                    buildable: def.buildable
                };
            }));
        for (const object of objects){
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][object.type];
            for(let dy = 0; dy < def.footprintHeight; dy += 1){
                for(let dx = 0; dx < def.footprintWidth; dx += 1){
                    const tile = this.getTile(object.x + dx, object.y + dy);
                    if (!tile) {
                        continue;
                    }
                    tile.walkable = false;
                    tile.buildable = false;
                }
            }
        }
    }
    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    getTile(x, y) {
        if (!this.inBounds(x, y)) {
            return undefined;
        }
        return this.tiles[y][x];
    }
    isWalkable(x, y) {
        return this.getTile(x, y)?.walkable === true;
    }
    objectAt(x, y) {
        return this.objects.find((object)=>{
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][object.type];
            return x >= object.x && x < object.x + def.footprintWidth && y >= object.y && y < object.y + def.footprintHeight;
        });
    }
    terrainFrameGrid() {
        return this.tiles.map((row, y)=>row.map((_, x)=>this.terrainFrameAt(x, y)));
    }
    terrainRotationAt(x, y) {
        return this.shoreVisualAt(x, y)?.rotationDeg ?? 0;
    }
    shoreVisualAt(x, y) {
        const tile = this.getTile(x, y);
        if (!tile || tile.terrain !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER) {
            return null;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$resolveShoreline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveShoreline"])((dx, dy)=>this.getTile(x + dx, y + dy)?.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER, x, y);
    }
    farmingFrameGrid() {
        return this.tiles.map((row)=>row.map((tile)=>tile.farming === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].NONE ? EMPTY_FARM_FRAME : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FARMING_VISUAL_FRAMES"][tile.farming]));
    }
    setFarmingVisual(x, y, farming) {
        const tile = this.getTile(x, y);
        if (!tile) {
            return;
        }
        tile.farming = farming;
    }
    farmingFrameAt(x, y) {
        const tile = this.getTile(x, y);
        if (!tile || tile.farming === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].NONE) {
            return EMPTY_FARM_FRAME;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FARMING_VISUAL_FRAMES"][tile.farming];
    }
    worldWidthPx() {
        return this.width * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
    }
    worldHeightPx() {
        return this.height * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"];
    }
    terrainFrameAt(x, y) {
        const tile = this.tiles[y][x];
        if (tile.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].GRASS) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRASS_VARIANT_FRAMES"][tile.grassVariant ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].PLAIN];
        }
        if (tile.terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER) {
            return this.shoreVisualAt(x, y)?.frame ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].center;
        }
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONNECTED_TERRAIN"].has(tile.terrain)) {
            const family = tile.terrain;
            const mask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$connectedTerrain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["neighborMask"])((dx, dy)=>this.getTile(x + dx, y + dy)?.terrain === family);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$connectedTerrain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectedTerrainFrame"])(family, mask);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRASS_VARIANT_FRAMES"][__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].PLAIN];
    }
}
function emptyLayer(width, height, fill) {
    return Array.from({
        length: height
    }, ()=>Array.from({
            length: width
        }, ()=>fill));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/GridPosition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "positionsEqual",
    ()=>positionsEqual
]);
function positionsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/autotile/resolveShoreline.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SHORE_E",
    ()=>SHORE_E,
    "SHORE_N",
    ()=>SHORE_N,
    "SHORE_S",
    ()=>SHORE_S,
    "SHORE_W",
    ()=>SHORE_W,
    "resolveShoreline",
    ()=>resolveShoreline,
    "shoreMaskLabel",
    ()=>shoreMaskLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/autotile/shorelineDefinitions.ts [app-client] (ecmascript)");
;
const SHORE_N = 1;
const SHORE_E = 2;
const SHORE_S = 4;
const SHORE_W = 8;
function bit(on, mask) {
    return on ? mask : 0;
}
function resolveShoreline(isWater, tileX = 0, tileY = 0) {
    const n = isWater(0, -1);
    const e = isWater(1, 0);
    const s = isWater(0, 1);
    const w = isWater(-1, 0);
    const ne = isWater(1, -1);
    const se = isWater(1, 1);
    const sw = isWater(-1, 1);
    const nw = isWater(-1, -1);
    if (n && e && s && w) {
        const inner = innerCorner(ne, se, sw, nw);
        if (inner) {
            return inner;
        }
        return visual("water_center", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterCenterFrame"])(tileX, tileY), 0);
    }
    const landN = !n;
    const landE = !e;
    const landS = !s;
    const landW = !w;
    const landMask = bit(landN, SHORE_N) | bit(landE, SHORE_E) | bit(landS, SHORE_S) | bit(landW, SHORE_W);
    return fromLandMask(landMask, tileX, tileY);
}
function shoreMaskLabel(isWater) {
    const parts = [];
    if (!isWater(0, -1)) {
        parts.push("N");
    }
    if (!isWater(1, 0)) {
        parts.push("E");
    }
    if (!isWater(0, 1)) {
        parts.push("S");
    }
    if (!isWater(-1, 0)) {
        parts.push("W");
    }
    if (!isWater(1, -1)) {
        parts.push("NE");
    }
    if (!isWater(1, 1)) {
        parts.push("SE");
    }
    if (!isWater(-1, 1)) {
        parts.push("SW");
    }
    if (!isWater(-1, -1)) {
        parts.push("NW");
    }
    return parts.length > 0 ? parts.join("/") : "none";
}
function innerCorner(ne, se, sw, nw) {
    const frames = {
        shore_inner_corner_nw: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].innerCornerNW,
        shore_inner_corner_ne: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].innerCornerNE,
        shore_inner_corner_sw: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].innerCornerSW,
        shore_inner_corner_se: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].innerCornerSE
    };
    const missing = Object.keys(frames).filter((id)=>{
        if (id === "shore_inner_corner_nw") {
            return !nw;
        }
        if (id === "shore_inner_corner_ne") {
            return !ne;
        }
        if (id === "shore_inner_corner_sw") {
            return !sw;
        }
        return !se;
    });
    if (missing.length !== 1) {
        return undefined;
    }
    const id = missing[0];
    return visual(id, frames[id], 0);
}
function fromLandMask(mask, tileX, tileY) {
    switch(mask){
        case SHORE_N:
            return visual("shore_north", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreNorth, 0);
        case SHORE_S:
            return visual("shore_south", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreSouth, 0);
        case SHORE_E:
            return visual("shore_east", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreNorth, 90);
        case SHORE_W:
            return visual("shore_west", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreSouth, 90);
        case SHORE_N | SHORE_E:
            return visual("shore_outer_corner_ne", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].outerCornerNE, 0);
        case SHORE_N | SHORE_W:
            return visual("shore_outer_corner_nw", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].outerCornerNW, 0);
        case SHORE_S | SHORE_E:
            return visual("shore_outer_corner_se", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].outerCornerSE, 0);
        case SHORE_S | SHORE_W:
            return visual("shore_outer_corner_sw", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].outerCornerSW, 0);
        case SHORE_N | SHORE_E | SHORE_S:
            return visual("shore_east", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreNorth, 90);
        case SHORE_N | SHORE_S | SHORE_W:
            return visual("shore_west", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreSouth, 90);
        case SHORE_E | SHORE_S | SHORE_W:
            return visual("shore_south", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreSouth, 0);
        case SHORE_N | SHORE_E | SHORE_W:
            return visual("shore_north", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WATER_FRAMES"].shoreNorth, 0);
        default:
            return visual("water_center", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$autotile$2f$shorelineDefinitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waterCenterFrame"])(tileX, tileY), 0);
    }
}
function visual(id, frame, rotationDeg) {
    return {
        id,
        frame,
        rotationDeg
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/autotile/shorelineDefinitions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Visual-only water shoreline frames from Terrain.png (256×192, 8×6 of 32×32).
 * Logical terrain stays `water`. These IDs are never map data.
 *
 * Frame = row * 8 + col. Inspected from the atlas; do not invent extra pieces.
 */ __turbopack_context__.s([
    "WATER_FRAMES",
    ()=>WATER_FRAMES,
    "WATER_FRAME_INNER_SE_ALT",
    ()=>WATER_FRAME_INNER_SE_ALT,
    "WATER_FRAME_OUTER_SE_ALT",
    ()=>WATER_FRAME_OUTER_SE_ALT,
    "waterCenterFrame",
    ()=>waterCenterFrame
]);
const WATER_FRAMES = {
    /** Legacy solid fill (row 0). Not used for lakes. */ legacyFill: 5,
    /** Clean interior shallow water (wave texture). */ center: 35,
    centerAlt: [
        35,
        37,
        43,
        45
    ],
    shoreNorth: 33,
    shoreSouth: 41,
    outerCornerNW: 32,
    outerCornerNE: 34,
    outerCornerSW: 40,
    outerCornerSE: 42,
    innerCornerNW: 47,
    innerCornerNE: 46,
    innerCornerSW: 39,
    innerCornerSE: 36
};
const WATER_FRAME_INNER_SE_ALT = 38;
const WATER_FRAME_OUTER_SE_ALT = 44;
function waterCenterFrame(x, y) {
    const alts = WATER_FRAMES.centerAlt;
    return alts[(x * 3 + y * 7) % alts.length];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/connectedTerrain.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DIR_E",
    ()=>DIR_E,
    "DIR_N",
    ()=>DIR_N,
    "DIR_S",
    ()=>DIR_S,
    "DIR_W",
    ()=>DIR_W,
    "blobCellForMask",
    ()=>blobCellForMask,
    "connectedTerrainFrame",
    ()=>connectedTerrainFrame,
    "neighborMask",
    ()=>neighborMask
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
;
const DIR_N = 1;
const DIR_E = 2;
const DIR_S = 4;
const DIR_W = 8;
const HIGH_GRASS_FRAMES = {
    nw: 10,
    n: 11,
    ne: 12,
    w: 18,
    center: 19,
    e: 20,
    sw: 26,
    s: 27,
    se: 28
};
const SANDY_SOIL_FRAMES = {
    nw: 13,
    n: 14,
    ne: 15,
    w: 21,
    center: 22,
    e: 23,
    sw: 29,
    s: 30,
    se: 31
};
/**
 * Incomplete masks (isolated, opposite edges) fall back to center or nearest edge.
 * Single-side neighbors map to the opposite edge cell (a 1-tile protrusion).
 */ const MASK_TO_CELL = [
    "center",
    "s",
    "w",
    "sw",
    "n",
    "center",
    "nw",
    "w",
    "e",
    "se",
    "center",
    "s",
    "ne",
    "e",
    "n",
    "center"
];
function neighborMask(isSame) {
    let mask = 0;
    if (isSame(0, -1)) {
        mask |= DIR_N;
    }
    if (isSame(1, 0)) {
        mask |= DIR_E;
    }
    if (isSame(0, 1)) {
        mask |= DIR_S;
    }
    if (isSame(-1, 0)) {
        mask |= DIR_W;
    }
    return mask;
}
function blobCellForMask(mask) {
    return MASK_TO_CELL[mask] ?? "center";
}
function connectedTerrainFrame(terrain, mask) {
    const cell = blobCellForMask(mask);
    if (terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].HIGH_GRASS) {
        return HIGH_GRASS_FRAMES[cell];
    }
    if (terrain === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].SANDY_SOIL) {
        return SANDY_SOIL_FRAMES[cell];
    }
    throw new Error(`No connected-terrain frames for ${terrain}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/pathfinding.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cardinalNeighbors",
    ()=>cardinalNeighbors,
    "findPath",
    ()=>findPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$GridPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/GridPosition.ts [app-client] (ecmascript)");
;
const CARDINALS = [
    {
        x: 0,
        y: -1
    },
    {
        x: 1,
        y: 0
    },
    {
        x: 0,
        y: 1
    },
    {
        x: -1,
        y: 0
    }
];
function key(x, y) {
    return `${x},${y}`;
}
function heuristic(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
}
function findPath(grid, start, goal) {
    if (!grid.inBounds(start.x, start.y) || !grid.inBounds(goal.x, goal.y)) {
        return null;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$GridPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionsEqual"])(start, goal)) {
        return [];
    }
    if (!grid.isWalkable(goal.x, goal.y)) {
        return null;
    }
    const open = [
        {
            x: start.x,
            y: start.y,
            g: 0,
            f: heuristic(start.x, start.y, goal.x, goal.y),
            parent: undefined
        }
    ];
    const bestG = new Map([
        [
            key(start.x, start.y),
            0
        ]
    ]);
    const closed = new Set();
    while(open.length > 0){
        let bestIndex = 0;
        for(let i = 1; i < open.length; i += 1){
            if (open[i].f < open[bestIndex].f) {
                bestIndex = i;
            }
        }
        const current = open.splice(bestIndex, 1)[0];
        const currentKey = key(current.x, current.y);
        if (closed.has(currentKey)) {
            continue;
        }
        closed.add(currentKey);
        if (current.x === goal.x && current.y === goal.y) {
            return reconstruct(current);
        }
        for (const dir of CARDINALS){
            const nx = current.x + dir.x;
            const ny = current.y + dir.y;
            const neighborKey = key(nx, ny);
            if (closed.has(neighborKey) || !grid.inBounds(nx, ny)) {
                continue;
            }
            const isGoal = nx === goal.x && ny === goal.y;
            const isStart = nx === start.x && ny === start.y;
            if (!isGoal && !isStart && !grid.isWalkable(nx, ny)) {
                continue;
            }
            if (isGoal && !grid.isWalkable(nx, ny)) {
                continue;
            }
            const g = current.g + 1;
            const known = bestG.get(neighborKey);
            if (known !== undefined && g >= known) {
                continue;
            }
            bestG.set(neighborKey, g);
            open.push({
                x: nx,
                y: ny,
                g,
                f: g + heuristic(nx, ny, goal.x, goal.y),
                parent: current
            });
        }
    }
    return null;
}
function reconstruct(node) {
    const path = [];
    let cursor = node;
    while(cursor?.parent){
        path.push({
            x: cursor.x,
            y: cursor.y
        });
        cursor = cursor.parent;
    }
    path.reverse();
    return path;
}
function cardinalNeighbors(x, y) {
    return CARDINALS.map((dir)=>({
            x: x + dir.x,
            y: y + dir.y
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/resourceNodes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createResourceNodes",
    ()=>createResourceNodes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/pathfinding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/resources.ts [app-client] (ecmascript)");
;
;
;
function firstWalkableNeighbor(grid, cells) {
    const seen = new Set();
    for (const cell of cells){
        for (const neighbor of (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$pathfinding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cardinalNeighbors"])(cell.x, cell.y)){
            const id = `${neighbor.x},${neighbor.y}`;
            if (seen.has(id)) {
                continue;
            }
            seen.add(id);
            if (grid.isWalkable(neighbor.x, neighbor.y)) {
                return neighbor;
            }
        }
    }
    return undefined;
}
function footprintCells(object) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OBJECT_DEFS"][object.type];
    const cells = [];
    for(let dy = 0; dy < def.footprintHeight; dy += 1){
        for(let dx = 0; dx < def.footprintWidth; dx += 1){
            cells.push({
                x: object.x + dx,
                y: object.y + dy
            });
        }
    }
    return cells;
}
function createResourceNodes(grid) {
    const nodes = [];
    for (const object of grid.objects){
        if (object.type !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE) {
            continue;
        }
        const workTile = firstWalkableNeighbor(grid, footprintCells(object));
        if (!workTile) {
            continue;
        }
        nodes.push({
            id: `wood_${object.x}_${object.y}`,
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESOURCE_IDS"].WOOD,
            tile: {
                x: object.x,
                y: object.y
            },
            workTile
        });
    }
    for (const object of grid.objects){
        if (object.type !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK) {
            continue;
        }
        const workTile = firstWalkableNeighbor(grid, footprintCells(object));
        if (!workTile) {
            continue;
        }
        nodes.push({
            id: `stone_${object.x}_${object.y}`,
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESOURCE_IDS"].STONE,
            tile: {
                x: object.x,
                y: object.y
            },
            workTile
        });
    }
    return nodes;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/tileTypes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONNECTED_TERRAIN",
    ()=>CONNECTED_TERRAIN,
    "DETAIL_DEFS",
    ()=>DETAIL_DEFS,
    "DetailType",
    ()=>DetailType,
    "FARMING_VISUAL_FRAMES",
    ()=>FARMING_VISUAL_FRAMES,
    "FarmingVisualState",
    ()=>FarmingVisualState,
    "GRASS_VARIANT_FRAMES",
    ()=>GRASS_VARIANT_FRAMES,
    "GrassVariant",
    ()=>GrassVariant,
    "OBJECT_DEFS",
    ()=>OBJECT_DEFS,
    "ObjectType",
    ()=>ObjectType,
    "TILE_DEFS",
    ()=>TILE_DEFS,
    "TileType",
    ()=>TileType,
    "WATER_FRAME",
    ()=>WATER_FRAME,
    "worldImageLoads",
    ()=>worldImageLoads
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
;
var TileType = /*#__PURE__*/ function(TileType) {
    TileType["GRASS"] = "grass";
    TileType["HIGH_GRASS"] = "high_grass";
    TileType["SANDY_SOIL"] = "sandy_soil";
    TileType["WATER"] = "water";
    return TileType;
}({});
var GrassVariant = /*#__PURE__*/ function(GrassVariant) {
    GrassVariant["PLAIN"] = "plain";
    GrassVariant["FLOWERS"] = "flowers";
    GrassVariant["STONES"] = "stones";
    GrassVariant["PEBBLES"] = "pebbles";
    GrassVariant["DIRT"] = "dirt";
    GrassVariant["NATURAL"] = "natural";
    return GrassVariant;
}({});
var FarmingVisualState = /*#__PURE__*/ function(FarmingVisualState) {
    FarmingVisualState["NONE"] = "none";
    FarmingVisualState["TILLED"] = "tilled";
    FarmingVisualState["PLANTED"] = "planted";
    return FarmingVisualState;
}({});
var DetailType = /*#__PURE__*/ function(DetailType) {
    DetailType["GRASS_FLOWER"] = "grass_flower";
    DetailType["SINGLE_GRASS"] = "single_grass";
    DetailType["TALL_GRASS_DETAIL"] = "tall_grass_detail";
    DetailType["SMALL_ROCK"] = "small_rock";
    DetailType["GRASS_FRUIT"] = "grass_fruit";
    return DetailType;
}({});
var ObjectType = /*#__PURE__*/ function(ObjectType) {
    ObjectType["TREE"] = "tree";
    ObjectType["PINE_TREE"] = "pine_tree";
    ObjectType["BUSH"] = "bush";
    ObjectType["ROCK"] = "rock";
    return ObjectType;
}({});
const TILE_DEFS = {
    ["grass"]: {
        type: "grass",
        walkable: true,
        buildable: true
    },
    ["high_grass"]: {
        type: "high_grass",
        walkable: true,
        buildable: true
    },
    ["sandy_soil"]: {
        type: "sandy_soil",
        walkable: true,
        buildable: true
    },
    ["water"]: {
        type: "water",
        walkable: false,
        buildable: false
    }
};
const WATER_FRAME = 5;
const GRASS_VARIANT_FRAMES = {
    ["plain"]: 1,
    ["flowers"]: 2,
    ["stones"]: 3,
    ["pebbles"]: 4,
    ["dirt"]: 6,
    ["natural"]: 7
};
const FARMING_VISUAL_FRAMES = {
    ["tilled"]: 0,
    ["planted"]: 8
};
const CONNECTED_TERRAIN = new Set([
    "high_grass",
    "sandy_soil"
]);
const DETAIL_DEFS = {
    ["grass_flower"]: {
        type: "grass_flower",
        textureKey: "world-detail-grass-flower",
        texturePath: "/assets/world/details/GrassFlower.png"
    },
    ["single_grass"]: {
        type: "single_grass",
        textureKey: "world-detail-single-grass",
        texturePath: "/assets/world/details/SingleGrass.png"
    },
    ["tall_grass_detail"]: {
        type: "tall_grass_detail",
        textureKey: "world-detail-tall-grass",
        texturePath: "/assets/world/details/TallGrass.png"
    },
    ["small_rock"]: {
        type: "small_rock",
        textureKey: "world-detail-small-rock",
        texturePath: "/assets/world/details/SmallRock.png"
    },
    ["grass_fruit"]: {
        type: "grass_fruit",
        textureKey: "world-detail-grass-fruit",
        texturePath: "/assets/world/details/GrassFruit.png"
    }
};
const OBJECT_DEFS = {
    ["tree"]: {
        type: "tree",
        textureKey: "world-object-tree",
        texturePath: "/assets/world/objects/Tree.png",
        visualWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] * 2,
        visualHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] * 2,
        footprintWidth: 2,
        footprintHeight: 2,
        originX: 0,
        originY: 0
    },
    ["pine_tree"]: {
        type: "pine_tree",
        textureKey: "world-object-pine-tree",
        texturePath: "/assets/world/objects/PineTree.png",
        visualWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        visualHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"] * 2,
        footprintWidth: 1,
        footprintHeight: 1,
        originX: 0.5,
        originY: 1
    },
    ["bush"]: {
        type: "bush",
        textureKey: "world-object-bush",
        texturePath: "/assets/world/objects/Bush.png",
        visualWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        visualHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        footprintWidth: 1,
        footprintHeight: 1,
        originX: 0,
        originY: 0
    },
    ["rock"]: {
        type: "rock",
        textureKey: "world-object-rock",
        texturePath: "/assets/world/objects/Rock.png",
        visualWidth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        visualHeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"],
        footprintWidth: 1,
        footprintHeight: 1,
        originX: 0,
        originY: 0
    }
};
function worldImageLoads() {
    return [
        ...Object.values(OBJECT_DEFS).map((def)=>({
                key: def.textureKey,
                path: def.texturePath
            })),
        ...Object.values(DETAIL_DEFS).map((def)=>({
                key: def.textureKey,
                path: def.texturePath
            }))
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/villageMap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAP_HEIGHT",
    ()=>MAP_HEIGHT,
    "MAP_WIDTH",
    ()=>MAP_WIDTH,
    "createVillageMap",
    ()=>createVillageMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$Grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/Grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/tileTypes.ts [app-client] (ecmascript)");
;
;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;
function createFilledTerrain(type) {
    return Array.from({
        length: MAP_HEIGHT
    }, ()=>Array.from({
            length: MAP_WIDTH
        }, ()=>type));
}
function createFilledDetails() {
    return Array.from({
        length: MAP_HEIGHT
    }, ()=>Array.from({
            length: MAP_WIDTH
        }, ()=>null));
}
function createFilledVariants() {
    return Array.from({
        length: MAP_HEIGHT
    }, ()=>Array.from({
            length: MAP_WIDTH
        }, ()=>null));
}
function createFilledFarming() {
    return Array.from({
        length: MAP_HEIGHT
    }, ()=>Array.from({
            length: MAP_WIDTH
        }, ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FarmingVisualState"].NONE));
}
function fillRect(layer, x, y, width, height, value) {
    const x1 = Math.max(0, x);
    const y1 = Math.max(0, y);
    const x2 = Math.min(MAP_WIDTH, x + width);
    const y2 = Math.min(MAP_HEIGHT, y + height);
    for(let ty = y1; ty < y2; ty += 1){
        for(let tx = x1; tx < x2; tx += 1){
            layer[ty][tx] = value;
        }
    }
}
function setCell(layer, x, y, value) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
        return;
    }
    layer[y][x] = value;
}
function createVillageMap() {
    const terrain = createFilledTerrain(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].GRASS);
    const details = createFilledDetails();
    const grassVariants = createFilledVariants();
    const farming = createFilledFarming();
    fillRect(terrain, 0, 0, 5, 4, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].HIGH_GRASS);
    const variants = [
        [
            6,
            2,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].FLOWERS
        ],
        [
            9,
            4,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].NATURAL
        ],
        [
            11,
            3,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].STONES
        ],
        [
            5,
            7,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].DIRT
        ],
        [
            7,
            9,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].PEBBLES
        ],
        [
            13,
            4,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].FLOWERS
        ],
        [
            18,
            6,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].PEBBLES
        ],
        [
            5,
            13,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].DIRT
        ],
        [
            11,
            10,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].NATURAL
        ],
        [
            2,
            8,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GrassVariant"].FLOWERS
        ]
    ];
    for (const [x, y, variant] of variants){
        setCell(grassVariants, x, y, variant);
    }
    const sandyCells = [
        [
            18,
            8
        ],
        [
            19,
            8
        ],
        [
            18,
            9
        ],
        [
            19,
            9
        ],
        [
            19,
            10
        ],
        [
            19,
            11
        ],
        [
            18,
            12
        ],
        [
            19,
            12
        ],
        [
            18,
            13
        ],
        [
            19,
            13
        ],
        [
            18,
            14
        ]
    ];
    for (const [x, y] of sandyCells){
        setCell(terrain, x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].SANDY_SOIL);
    }
    const waterCells = [
        [
            14,
            8
        ],
        [
            15,
            8
        ],
        [
            13,
            9
        ],
        [
            14,
            9
        ],
        [
            15,
            9
        ],
        [
            16,
            9
        ],
        [
            17,
            9
        ],
        [
            13,
            10
        ],
        [
            14,
            10
        ],
        [
            15,
            10
        ],
        [
            16,
            10
        ],
        [
            17,
            10
        ],
        [
            18,
            10
        ],
        [
            13,
            11
        ],
        [
            14,
            11
        ],
        [
            15,
            11
        ],
        [
            16,
            11
        ],
        [
            17,
            11
        ],
        [
            18,
            11
        ],
        [
            13,
            12
        ],
        [
            14,
            12
        ],
        [
            16,
            12
        ],
        [
            17,
            12
        ],
        [
            13,
            13
        ],
        [
            14,
            13
        ],
        [
            15,
            13
        ],
        [
            16,
            13
        ],
        [
            17,
            13
        ],
        [
            14,
            14
        ],
        [
            15,
            14
        ],
        [
            16,
            14
        ],
        [
            17,
            14
        ],
        [
            13,
            14
        ]
    ];
    for (const [x, y] of waterCells){
        setCell(terrain, x, y, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileType"].WATER);
    }
    const detailPlacements = [
        [
            6,
            8,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].GRASS_FLOWER
        ],
        [
            11,
            4,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].GRASS_FLOWER
        ],
        [
            3,
            5,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].SINGLE_GRASS
        ],
        [
            14,
            5,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].SINGLE_GRASS
        ],
        [
            0,
            8,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].TALL_GRASS_DETAIL
        ],
        [
            8,
            3,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].TALL_GRASS_DETAIL
        ],
        [
            14,
            7,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].SMALL_ROCK
        ],
        [
            19,
            4,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].SMALL_ROCK
        ],
        [
            5,
            5,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].GRASS_FRUIT
        ],
        [
            11,
            9,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailType"].GRASS_FRUIT
        ]
    ];
    for (const [x, y, detail] of detailPlacements){
        setCell(details, x, y, detail);
    }
    const objects = [
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 1,
            y: 0
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 4,
            y: 0
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 7,
            y: 0
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 2,
            y: 3
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 0,
            y: 6
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].TREE,
            x: 12,
            y: 7
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].PINE_TREE,
            x: 18,
            y: 1
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].BUSH,
            x: 15,
            y: 3
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].BUSH,
            x: 3,
            y: 9
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK,
            x: 10,
            y: 2
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK,
            x: 4,
            y: 7
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK,
            x: 9,
            y: 12
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK,
            x: 12,
            y: 6
        },
        {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$tileTypes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectType"].ROCK,
            x: 8,
            y: 9
        }
    ];
    return new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$Grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"](MAP_WIDTH, MAP_HEIGHT, terrain, details, objects, grassVariants, farming);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1xb_sw1._.js.map