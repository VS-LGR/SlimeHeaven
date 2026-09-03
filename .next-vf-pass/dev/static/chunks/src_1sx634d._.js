(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/simulation/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Fixed simulation rate. Gameplay must not advance with render FPS. */ __turbopack_context__.s([
    "GATHER_AMOUNT",
    ()=>GATHER_AMOUNT,
    "IDLE_WANDER_DELAY_TICKS",
    ()=>IDLE_WANDER_DELAY_TICKS,
    "SIMULATION_TICKS_PER_SECOND",
    ()=>SIMULATION_TICKS_PER_SECOND,
    "SIMULATION_TICK_MS",
    ()=>SIMULATION_TICK_MS,
    "SLIME_HOP_DURATION_MS",
    ()=>SLIME_HOP_DURATION_MS,
    "SLIME_HOP_HEIGHT_PX",
    ()=>SLIME_HOP_HEIGHT_PX,
    "STORAGE_TILE",
    ()=>STORAGE_TILE,
    "WORK_DURATION_MS",
    ()=>WORK_DURATION_MS
]);
const SIMULATION_TICKS_PER_SECOND = 4;
const SIMULATION_TICK_MS = 1000 / SIMULATION_TICKS_PER_SECOND;
const SLIME_HOP_DURATION_MS = 800;
const SLIME_HOP_HEIGHT_PX = 7;
const WORK_DURATION_MS = 1250;
const GATHER_AMOUNT = 2;
const IDLE_WANDER_DELAY_TICKS = {
    min: 10,
    max: 22
};
const STORAGE_TILE = {
    x: 10,
    y: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/data/fish.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISH",
    ()=>FISH,
    "FISH_IDS",
    ()=>FISH_IDS,
    "FISH_ID_LIST",
    ()=>FISH_ID_LIST,
    "emptyFishCollection",
    ()=>emptyFishCollection,
    "emptyFishInventory",
    ()=>emptyFishInventory,
    "fishById",
    ()=>fishById,
    "isSpeciesValidAtDepth",
    ()=>isSpeciesValidAtDepth,
    "speciesAtDepth",
    ()=>speciesAtDepth
]);
const FISH_IDS = {
    BLUE_DARTER: "blue_darter",
    POND_CARP: "pond_carp",
    MOON_GLIMMER: "moon_glimmer"
};
const FISH = {
    blue_darter: {
        id: "blue_darter",
        name: "Blue Darter",
        rarity: "common",
        validDepths: [
            "shallow"
        ],
        activityWeight: 6,
        biteDelayRangeMs: {
            min: 1000,
            max: 2000
        },
        reactionWindowMs: 2500,
        markerPeriodMs: 2500,
        targetZoneWidth: 0.38,
        clueType: "small_bubbles",
        challenge: {
            techniqueDemand: 2,
            strengthDemand: 1,
            instinctDemand: 2
        },
        foodValue: 1,
        tags: [
            "small"
        ]
    },
    pond_carp: {
        id: "pond_carp",
        name: "Pond Carp",
        rarity: "uncommon",
        validDepths: [
            "shallow",
            "deep"
        ],
        activityWeight: 3,
        biteDelayRangeMs: {
            min: 1500,
            max: 3000
        },
        reactionWindowMs: 1800,
        markerPeriodMs: 1800,
        targetZoneWidth: 0.24,
        clueType: "large_ripple",
        challenge: {
            techniqueDemand: 3,
            strengthDemand: 3,
            instinctDemand: 2
        },
        foodValue: 2,
        tags: [
            "heavy"
        ]
    },
    moon_glimmer: {
        id: "moon_glimmer",
        name: "Moon Glimmer",
        rarity: "rare",
        validDepths: [
            "deep"
        ],
        activityWeight: 1,
        biteDelayRangeMs: {
            min: 1000,
            max: 4000
        },
        reactionWindowMs: 1100,
        markerPeriodMs: 1100,
        targetZoneWidth: 0.14,
        clueType: "cyan_glimmer",
        challenge: {
            techniqueDemand: 4,
            strengthDemand: 2,
            instinctDemand: 5
        },
        foodValue: 3,
        tags: [
            "unusual"
        ],
        specialEffectId: "village_glimmer"
    }
};
const FISH_ID_LIST = Object.values(FISH_IDS);
_c = FISH_ID_LIST;
function fishById(id) {
    return FISH[id];
}
function speciesAtDepth(depth) {
    return FISH_ID_LIST.map((id)=>FISH[id]).filter((def)=>def.validDepths.includes(depth));
}
function isSpeciesValidAtDepth(id, depth) {
    return FISH[id].validDepths.includes(depth);
}
function emptyFishInventory() {
    return {
        blue_darter: 0,
        pond_carp: 0,
        moon_glimmer: 0
    };
}
function emptyFishCollection() {
    return {
        blue_darter: {
            speciesId: "blue_darter",
            discovered: false,
            caughtCount: 0
        },
        pond_carp: {
            speciesId: "pond_carp",
            discovered: false,
            caughtCount: 0
        },
        moon_glimmer: {
            speciesId: "moon_glimmer",
            discovered: false,
            caughtCount: 0
        }
    };
}
var _c;
__turbopack_context__.k.register(_c, "FISH_ID_LIST");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FISHING_SUCCESS_HOLD_MS",
    ()=>FISHING_SUCCESS_HOLD_MS,
    "FISHING_SUCCESS_PRESENTATION_HOLD_TICKS",
    ()=>FISHING_SUCCESS_PRESENTATION_HOLD_TICKS,
    "fishingPhaseLabel",
    ()=>fishingPhaseLabel,
    "fishingPresentationPhase",
    ()=>fishingPresentationPhase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
;
const FISHING_SUCCESS_HOLD_MS = 1100;
const FISHING_SUCCESS_PRESENTATION_HOLD_TICKS = Math.max(1, Math.ceil(FISHING_SUCCESS_HOLD_MS / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICK_MS"]));
function fishingPresentationPhase(slime, session, tickIndex) {
    if (slime?.state === "moving_to_fishing") {
        return "approach";
    }
    if (slime && slime.state === "idle" && slime.fishingCelebrateUntilTick > tickIndex) {
        return "success";
    }
    if (!session || session.phase === "idle") {
        return "idle";
    }
    if (session.phase === "casting") {
        if (tickIndex < session.arriveUntilTick) {
            return "arrive";
        }
        return "cast";
    }
    if (session.phase === "waiting") {
        return "wait";
    }
    if (session.phase === "bite") {
        return "bite";
    }
    if (session.phase === "fighting") {
        return session.lastStrike ? "pull" : "hook";
    }
    if (session.phase === "caught") {
        return "success";
    }
    if (session.phase === "escaped") {
        return "escape";
    }
    return "idle";
}
function fishingPhaseLabel(phase) {
    if (phase === "approach" || phase === "arrive" || phase === "cast" || phase === "wait") {
        return "Fishing...";
    }
    if (phase === "bite") {
        return "BITE!";
    }
    if (phase === "hook" || phase === "pull") {
        return "Hook!";
    }
    if (phase === "success") {
        return "Caught!";
    }
    if (phase === "escape") {
        return "Escaped";
    }
    return "";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEBUG_ADD_FOOD_AMOUNT",
    ()=>DEBUG_ADD_FOOD_AMOUNT,
    "DEBUG_HUNGRY_SATIETY",
    ()=>DEBUG_HUNGRY_SATIETY,
    "EAT_DURATION_MS",
    ()=>EAT_DURATION_MS,
    "EAT_FOOD_COST",
    ()=>EAT_FOOD_COST,
    "EAT_SATIETY_RESTORE",
    ()=>EAT_SATIETY_RESTORE,
    "HUNGER_THRESHOLDS",
    ()=>HUNGER_THRESHOLDS,
    "SATIETY_DECAY_PER_SECOND",
    ()=>SATIETY_DECAY_PER_SECOND,
    "SATIETY_DECAY_PER_TICK",
    ()=>SATIETY_DECAY_PER_TICK,
    "SATIETY_INITIAL",
    ()=>SATIETY_INITIAL,
    "SATIETY_MAX",
    ()=>SATIETY_MAX,
    "WORK_SPEED_HUNGRY",
    ()=>WORK_SPEED_HUNGRY,
    "clampSatiety",
    ()=>clampSatiety,
    "hungerState",
    ()=>hungerState,
    "workSpeedMultiplier",
    ()=>workSpeedMultiplier
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/constants.ts [app-client] (ecmascript)");
;
const SATIETY_MAX = 100;
const SATIETY_INITIAL = 100;
const SATIETY_DECAY_PER_SECOND = 0.14;
const SATIETY_DECAY_PER_TICK = SATIETY_DECAY_PER_SECOND / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SIMULATION_TICKS_PER_SECOND"];
const HUNGER_THRESHOLDS = {
    fed: 75,
    normal: 40,
    hungry: 15
};
const WORK_SPEED_HUNGRY = 0.8;
const EAT_FOOD_COST = 1;
const EAT_SATIETY_RESTORE = 50;
const EAT_DURATION_MS = 1000;
const DEBUG_HUNGRY_SATIETY = 25;
const DEBUG_ADD_FOOD_AMOUNT = 5;
function hungerState(satiety) {
    if (satiety >= HUNGER_THRESHOLDS.fed) {
        return "fed";
    }
    if (satiety >= HUNGER_THRESHOLDS.normal) {
        return "normal";
    }
    if (satiety >= HUNGER_THRESHOLDS.hungry) {
        return "hungry";
    }
    return "starving";
}
function workSpeedMultiplier(satiety) {
    const hunger = hungerState(satiety);
    if (hunger === "hungry" || hunger === "starving") {
        return WORK_SPEED_HUNGRY;
    }
    return 1;
}
function clampSatiety(value) {
    if (value < 0) {
        return 0;
    }
    if (value > SATIETY_MAX) {
        return SATIETY_MAX;
    }
    return value;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ATTR_MAX",
    ()=>ATTR_MAX,
    "ATTR_MIN",
    ()=>ATTR_MIN,
    "JOB_ATTRIBUTE_WEIGHTS",
    ()=>JOB_ATTRIBUTE_WEIGHTS,
    "clampAttribute",
    ()=>clampAttribute,
    "clampAttributes",
    ()=>clampAttributes,
    "getAttributeContribution",
    ()=>getAttributeContribution,
    "starString",
    ()=>starString
]);
const ATTR_MIN = 1;
const ATTR_MAX = 5;
const JOB_ATTRIBUTE_WEIGHTS = {
    gathering: {
        technique: 0,
        strength: 0.5,
        instinct: 0.5,
        luck: 0
    },
    farming: {
        technique: 0.5,
        strength: 0,
        instinct: 0.5,
        luck: 0
    },
    fishing: {
        technique: 0.4,
        instinct: 0.35,
        strength: 0.2,
        luck: 0.05
    },
    construction: {
        technique: 0.5,
        strength: 0.5,
        instinct: 0,
        luck: 0
    }
};
function clampAttribute(value) {
    return Math.max(ATTR_MIN, Math.min(ATTR_MAX, Math.round(value)));
}
function clampAttributes(attrs) {
    return {
        technique: clampAttribute(attrs.technique),
        strength: clampAttribute(attrs.strength),
        instinct: clampAttribute(attrs.instinct),
        luck: clampAttribute(attrs.luck)
    };
}
function getAttributeContribution(attrs, weights) {
    return attrs.technique * weights.technique + attrs.strength * weights.strength + attrs.instinct * weights.instinct + attrs.luck * weights.luck;
}
function starString(value) {
    const filled = clampAttribute(value);
    return "★".repeat(filled) + "☆".repeat(ATTR_MAX - filled);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/gameUiStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGameUiStore",
    ()=>useGameUiStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
;
;
const EMPTY_SNAPSHOT = {
    debugVisible: false,
    worldTool: "off",
    collectionOpen: false,
    fps: 0,
    cameraX: 0,
    cameraY: 0,
    zoom: 1,
    hoveredX: null,
    hoveredY: null,
    selectedX: null,
    selectedY: null,
    hoveredTile: null,
    selectedTile: null,
    mapWidth: 0,
    mapHeight: 0,
    simTps: 0,
    slimeCount: 0,
    availableTasks: 0,
    assignedTasks: 0,
    wood: 0,
    stone: 0,
    food: 0,
    farmTiles: 0,
    growingCrops: 0,
    readyCrops: 0,
    hungrySlimes: 0,
    starvingSlimes: 0,
    selectedSlimeId: null,
    selectedSlime: null,
    activeRipples: 0,
    activeFishShadows: 0,
    waterSurfaceOn: true,
    waterAmbientOn: true,
    waterDepthBoundsOn: false,
    fishingRadiusOverlayOn: false,
    interestPointOverlayOn: false,
    aquaticActivities: 0,
    shallowSpots: 0,
    deepSpots: 0,
    fishingPhase: "idle",
    fishingPresentation: null,
    fishingVisualDebug: null,
    fishingTargetId: null,
    fishingDebugSpecies: null,
    fishingAssignedSlime: null,
    fishingAccessPoint: null,
    fishingReservationOwner: null,
    fishingHookOwner: null,
    fishingScores: [],
    fishingOpportunity: null,
    ambientDebug: [],
    waterBodyCount: 0,
    accessPointCount: 0,
    fishCollection: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyFishCollection"])(),
    fishingHud: null,
    catchToast: null
};
const useGameUiStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        ...EMPTY_SNAPSHOT,
        debugActions: null,
        toggleDebug: ()=>set((state)=>({
                    debugVisible: !state.debugVisible
                })),
        setWorldTool: (worldTool)=>set({
                worldTool
            }),
        toggleCollection: ()=>set((state)=>({
                    collectionOpen: !state.collectionOpen
                })),
        setRuntime: (patch)=>set(patch),
        setDebugActions: (actions)=>set({
                debugActions: actions
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ui/DebugOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DebugOverlay",
    ()=>DebugOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/world/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function coord(value) {
    return value === null ? "—" : String(value);
}
function DebugOverlay() {
    _s();
    const debugVisible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[debugVisible]": (state)=>state.debugVisible
    }["DebugOverlay.useGameUiStore[debugVisible]"]);
    const fps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fps]": (state)=>state.fps
    }["DebugOverlay.useGameUiStore[fps]"]);
    const cameraX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[cameraX]": (state)=>state.cameraX
    }["DebugOverlay.useGameUiStore[cameraX]"]);
    const cameraY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[cameraY]": (state)=>state.cameraY
    }["DebugOverlay.useGameUiStore[cameraY]"]);
    const zoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[zoom]": (state)=>state.zoom
    }["DebugOverlay.useGameUiStore[zoom]"]);
    const hoveredX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[hoveredX]": (state)=>state.hoveredX
    }["DebugOverlay.useGameUiStore[hoveredX]"]);
    const hoveredY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[hoveredY]": (state)=>state.hoveredY
    }["DebugOverlay.useGameUiStore[hoveredY]"]);
    const selectedX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[selectedX]": (state)=>state.selectedX
    }["DebugOverlay.useGameUiStore[selectedX]"]);
    const selectedY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[selectedY]": (state)=>state.selectedY
    }["DebugOverlay.useGameUiStore[selectedY]"]);
    const hoveredTile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[hoveredTile]": (state)=>state.hoveredTile
    }["DebugOverlay.useGameUiStore[hoveredTile]"]);
    const selectedTile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[selectedTile]": (state)=>state.selectedTile
    }["DebugOverlay.useGameUiStore[selectedTile]"]);
    const mapWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[mapWidth]": (state)=>state.mapWidth
    }["DebugOverlay.useGameUiStore[mapWidth]"]);
    const mapHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[mapHeight]": (state)=>state.mapHeight
    }["DebugOverlay.useGameUiStore[mapHeight]"]);
    const simTps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[simTps]": (state)=>state.simTps
    }["DebugOverlay.useGameUiStore[simTps]"]);
    const slimeCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[slimeCount]": (state)=>state.slimeCount
    }["DebugOverlay.useGameUiStore[slimeCount]"]);
    const availableTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[availableTasks]": (state)=>state.availableTasks
    }["DebugOverlay.useGameUiStore[availableTasks]"]);
    const assignedTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[assignedTasks]": (state)=>state.assignedTasks
    }["DebugOverlay.useGameUiStore[assignedTasks]"]);
    const wood = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[wood]": (state)=>state.wood
    }["DebugOverlay.useGameUiStore[wood]"]);
    const stone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[stone]": (state)=>state.stone
    }["DebugOverlay.useGameUiStore[stone]"]);
    const food = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[food]": (state)=>state.food
    }["DebugOverlay.useGameUiStore[food]"]);
    const farmTiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[farmTiles]": (state)=>state.farmTiles
    }["DebugOverlay.useGameUiStore[farmTiles]"]);
    const growingCrops = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[growingCrops]": (state)=>state.growingCrops
    }["DebugOverlay.useGameUiStore[growingCrops]"]);
    const readyCrops = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[readyCrops]": (state)=>state.readyCrops
    }["DebugOverlay.useGameUiStore[readyCrops]"]);
    const hungrySlimes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[hungrySlimes]": (state)=>state.hungrySlimes
    }["DebugOverlay.useGameUiStore[hungrySlimes]"]);
    const starvingSlimes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[starvingSlimes]": (state)=>state.starvingSlimes
    }["DebugOverlay.useGameUiStore[starvingSlimes]"]);
    const activeRipples = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[activeRipples]": (state)=>state.activeRipples
    }["DebugOverlay.useGameUiStore[activeRipples]"]);
    const activeFishShadows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[activeFishShadows]": (state)=>state.activeFishShadows
    }["DebugOverlay.useGameUiStore[activeFishShadows]"]);
    const waterSurfaceOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[waterSurfaceOn]": (state)=>state.waterSurfaceOn
    }["DebugOverlay.useGameUiStore[waterSurfaceOn]"]);
    const waterAmbientOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[waterAmbientOn]": (state)=>state.waterAmbientOn
    }["DebugOverlay.useGameUiStore[waterAmbientOn]"]);
    const waterDepthBoundsOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[waterDepthBoundsOn]": (state)=>state.waterDepthBoundsOn
    }["DebugOverlay.useGameUiStore[waterDepthBoundsOn]"]);
    const fishingRadiusOverlayOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingRadiusOverlayOn]": (state)=>state.fishingRadiusOverlayOn
    }["DebugOverlay.useGameUiStore[fishingRadiusOverlayOn]"]);
    const interestPointOverlayOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[interestPointOverlayOn]": (state)=>state.interestPointOverlayOn
    }["DebugOverlay.useGameUiStore[interestPointOverlayOn]"]);
    const aquaticActivities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[aquaticActivities]": (state)=>state.aquaticActivities
    }["DebugOverlay.useGameUiStore[aquaticActivities]"]);
    const shallowSpots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[shallowSpots]": (state)=>state.shallowSpots
    }["DebugOverlay.useGameUiStore[shallowSpots]"]);
    const deepSpots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[deepSpots]": (state)=>state.deepSpots
    }["DebugOverlay.useGameUiStore[deepSpots]"]);
    const fishingPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingPhase]": (state)=>state.fishingPhase
    }["DebugOverlay.useGameUiStore[fishingPhase]"]);
    const fishingTargetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingTargetId]": (state)=>state.fishingTargetId
    }["DebugOverlay.useGameUiStore[fishingTargetId]"]);
    const fishingDebugSpecies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingDebugSpecies]": (state)=>state.fishingDebugSpecies
    }["DebugOverlay.useGameUiStore[fishingDebugSpecies]"]);
    const fishingAssignedSlime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingAssignedSlime]": (state)=>state.fishingAssignedSlime
    }["DebugOverlay.useGameUiStore[fishingAssignedSlime]"]);
    const fishingAccessPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingAccessPoint]": (state)=>state.fishingAccessPoint
    }["DebugOverlay.useGameUiStore[fishingAccessPoint]"]);
    const fishingReservationOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingReservationOwner]": (state)=>state.fishingReservationOwner
    }["DebugOverlay.useGameUiStore[fishingReservationOwner]"]);
    const fishingHookOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingHookOwner]": (state)=>state.fishingHookOwner
    }["DebugOverlay.useGameUiStore[fishingHookOwner]"]);
    const fishingPresentation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingPresentation]": (state)=>state.fishingPresentation
    }["DebugOverlay.useGameUiStore[fishingPresentation]"]);
    const fishingVisualDebug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingVisualDebug]": (state)=>state.fishingVisualDebug
    }["DebugOverlay.useGameUiStore[fishingVisualDebug]"]);
    const ambientDebug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[ambientDebug]": (state)=>state.ambientDebug
    }["DebugOverlay.useGameUiStore[ambientDebug]"]);
    const fishingScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingScores]": (state)=>state.fishingScores
    }["DebugOverlay.useGameUiStore[fishingScores]"]);
    const fishingOpportunity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[fishingOpportunity]": (state)=>state.fishingOpportunity
    }["DebugOverlay.useGameUiStore[fishingOpportunity]"]);
    const waterBodyCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[waterBodyCount]": (state)=>state.waterBodyCount
    }["DebugOverlay.useGameUiStore[waterBodyCount]"]);
    const accessPointCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[accessPointCount]": (state)=>state.accessPointCount
    }["DebugOverlay.useGameUiStore[accessPointCount]"]);
    const selectedSlime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[selectedSlime]": (state)=>state.selectedSlime
    }["DebugOverlay.useGameUiStore[selectedSlime]"]);
    const debugActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "DebugOverlay.useGameUiStore[debugActions]": (state)=>state.debugActions
    }["DebugOverlay.useGameUiStore[debugActions]"]);
    if (!debugVisible) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "pointer-events-auto absolute left-3 top-3 z-20 max-h-[calc(100dvh-1.5rem)] min-w-44 max-w-[16rem] overflow-y-auto overscroll-contain rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg",
        onWheel: (event)=>event.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1 tracking-widest text-lime-300",
                children: "DEBUG"
            }, void 0, false, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            debugActions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex flex-col gap-1 border-b border-white/10 pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Gather wood",
                        onClick: debugActions.spawnGatherWood
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Gather stone",
                        onClick: debugActions.spawnGatherStone
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Clear tasks",
                        onClick: debugActions.clearTasks
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Reset slimes",
                        onClick: debugActions.resetSlimes
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Add test resource",
                        onClick: debugActions.addTestResource
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Add food",
                        onClick: debugActions.addFood
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Set all slimes hungry",
                        onClick: debugActions.setAllSlimesHungry
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Instant grow crops",
                        onClick: debugActions.instantGrowCrops
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Clear farms",
                        onClick: debugActions.clearFarms
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Spawn ripple",
                        onClick: debugActions.spawnWaterRipple
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Spawn fish shadow",
                        onClick: debugActions.spawnFishShadow
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: waterSurfaceOn ? "Water surface off" : "Water surface on",
                        onClick: debugActions.toggleWaterSurface
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: waterAmbientOn ? "Ambient water off" : "Ambient water on",
                        onClick: debugActions.toggleAmbientWaterFx
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: waterDepthBoundsOn ? "Depth bounds off" : "Show water depth bounds",
                        onClick: debugActions.toggleWaterDepthBounds
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Spawn Blue Darter",
                        onClick: debugActions.spawnBlueDarter
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Spawn Pond Carp",
                        onClick: debugActions.spawnPondCarp
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Spawn Moon Glimmer",
                        onClick: debugActions.spawnMoonGlimmer
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Clear activities",
                        onClick: debugActions.clearAquaticActivities
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Force bite",
                        onClick: debugActions.forceFishingBite
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Auto catch",
                        onClick: debugActions.autoSucceedFishing
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Reset collection",
                        onClick: debugActions.resetFishCollection
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: fishingRadiusOverlayOn ? "Radius overlay off" : "Show fishing radius",
                        onClick: debugActions.toggleFishingRadiusOverlay
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: interestPointOverlayOn ? "Interest overlay off" : "Show interest points",
                        onClick: debugActions.toggleInterestPointOverlay
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Force Pingo observe water",
                        onClick: debugActions.forcePingoObserveWater
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Force Momo inspect farm",
                        onClick: debugActions.forceMomoInspectFarm
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Force Tito inspect nature",
                        onClick: debugActions.forceTitoInspectNature
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Force social greet",
                        onClick: debugActions.forceSocialGreet
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DebugButton, {
                        label: "Clear ambient",
                        onClick: debugActions.clearAmbientBehaviors
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "FPS: ",
                            fps
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Camera: ",
                            cameraX,
                            ", ",
                            cameraY
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Zoom: ",
                            zoom,
                            "x"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Sim TPS: ",
                            simTps
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Hovered:"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "X: ",
                            coord(hoveredX)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Y: ",
                            coord(hoveredY)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TileInspectLines, {
                        inspect: hoveredTile
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Selected:"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "X: ",
                            coord(selectedX)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Y: ",
                            coord(selectedY)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TileInspectLines, {
                        inspect: selectedTile
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1",
                        children: [
                            "Map: ",
                            mapWidth,
                            " × ",
                            mapHeight
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "TILE_SIZE: ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$world$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TILE_SIZE"]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1",
                        children: [
                            "Slimes: ",
                            slimeCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Tasks avail/busy: ",
                            availableTasks,
                            "/",
                            assignedTasks
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Wood: ",
                            wood,
                            " · Stone: ",
                            stone,
                            " · Food: ",
                            food
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Farming"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Farm tiles: ",
                            farmTiles
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Growing crops: ",
                            growingCrops
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Ready crops: ",
                            readyCrops
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Hungry slimes: ",
                            hungrySlimes
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Starving slimes: ",
                            starvingSlimes
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    selectedSlime ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-lime-300",
                                children: "Selected slime"
                            }, void 0, false, {
                                fileName: "[project]/src/ui/DebugOverlay.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: selectedSlime.name
                            }, void 0, false, {
                                fileName: "[project]/src/ui/DebugOverlay.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "TECH ",
                                    selectedSlime.technique,
                                    " STR ",
                                    selectedSlime.strength,
                                    " INST ",
                                    selectedSlime.instinct,
                                    " ",
                                    "LUCK ",
                                    selectedSlime.luck
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/ui/DebugOverlay.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Water VFX"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Ripples: ",
                            activeRipples
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Fish shadows: ",
                            activeFishShadows
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Surface: ",
                            waterSurfaceOn ? "on" : "off"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Ambient: ",
                            waterAmbientOn ? "on" : "off"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Depth bounds: ",
                            waterDepthBoundsOn ? "on" : "off"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Fishing"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Activities: ",
                            aquaticActivities
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Spots shallow/deep: ",
                            shallowSpots,
                            "/",
                            deepSpots
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Bodies/access: ",
                            waterBodyCount,
                            "/",
                            accessPointCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Session: ",
                            fishingPhase
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Presentation: ",
                            fishingPresentation ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Visual: ",
                            fishingVisualDebug ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Opportunity: ",
                            fishingOpportunity ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Assigned: ",
                            fishingAssignedSlime ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Access: ",
                            fishingAccessPoint ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Access reserved: ",
                            fishingReservationOwner ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Hook UI: ",
                            fishingHookOwner ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Target: ",
                            fishingTargetId ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Species: ",
                            fishingDebugSpecies ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    fishingScores.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Scores: ",
                            fishingScores.join(" / ")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 186,
                        columnNumber: 37
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Radius overlay: ",
                            fishingRadiusOverlayOn ? "on" : "off"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lime-300",
                        children: "Ambient"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    ambientDebug.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: line
                        }, line, false, {
                            fileName: "[project]/src/ui/DebugOverlay.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/ui/DebugOverlay.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(DebugOverlay, "6+FeJc/RR0FAfbyWsy+Tw4q2YTk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"]
    ];
});
_c = DebugOverlay;
function TileInspectLines({ inspect }) {
    if (!inspect) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Terrain: ",
                    inspect.terrain
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Variant: ",
                    inspect.grassVariant ?? "—"
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Detail: ",
                    inspect.detail ?? "—"
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Farming: ",
                    inspect.farming
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Farm: ",
                    inspect.farm ? "YES" : "NO"
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            inspect.farm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "State: ",
                            inspect.farmState
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Crop: ",
                            inspect.crop ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Growth: ",
                            inspect.growthPercent ?? 0,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Task: ",
                            inspect.farmTask ?? "None"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Object: ",
                    inspect.object ?? "—"
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Walk/build: ",
                    inspect.walkable ? "yes" : "no",
                    " / ",
                    inspect.buildable ? "yes" : "no"
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            inspect.terrain === "water" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Shore Mask: ",
                            inspect.shoreMask ?? "none"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Shore Visual: ",
                            inspect.shoreVisual ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Depth: ",
                            inspect.waterDepth ?? "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/DebugOverlay.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/DebugOverlay.tsx",
                lineNumber: 221,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/ui/DebugOverlay.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_c1 = TileInspectLines;
function DebugButton({ label, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "w-full rounded border border-lime-300/30 bg-lime-950/80 px-2 py-0.5 text-left text-lime-100 hover:bg-lime-900",
        onClick: onClick,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/ui/DebugOverlay.tsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
}
_c2 = DebugButton;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DebugOverlay");
__turbopack_context__.k.register(_c1, "TileInspectLines");
__turbopack_context__.k.register(_c2, "DebugButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ui/GameHud.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameHud",
    ()=>GameHud
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/needsConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/data/fish.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/slimeAttributes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/simulation/entities/FishingPresentation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function conditionLabel(hunger) {
    if (hunger === "fed") {
        return "Fed";
    }
    if (hunger === "normal") {
        return "Normal";
    }
    if (hunger === "hungry") {
        return "Hungry";
    }
    if (hunger === "starving") {
        return "Starving";
    }
    return hunger;
}
function GameHud() {
    _s();
    const wood = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[wood]": (state)=>state.wood
    }["GameHud.useGameUiStore[wood]"]);
    const stone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[stone]": (state)=>state.stone
    }["GameHud.useGameUiStore[stone]"]);
    const food = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[food]": (state)=>state.food
    }["GameHud.useGameUiStore[food]"]);
    const worldTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[worldTool]": (state)=>state.worldTool
    }["GameHud.useGameUiStore[worldTool]"]);
    const setWorldTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[setWorldTool]": (state)=>state.setWorldTool
    }["GameHud.useGameUiStore[setWorldTool]"]);
    const selectedSlime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[selectedSlime]": (state)=>state.selectedSlime
    }["GameHud.useGameUiStore[selectedSlime]"]);
    const collectionOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[collectionOpen]": (state)=>state.collectionOpen
    }["GameHud.useGameUiStore[collectionOpen]"]);
    const toggleCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[toggleCollection]": (state)=>state.toggleCollection
    }["GameHud.useGameUiStore[toggleCollection]"]);
    const fishCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[fishCollection]": (state)=>state.fishCollection
    }["GameHud.useGameUiStore[fishCollection]"]);
    const fishingHud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[fishingHud]": (state)=>state.fishingHud
    }["GameHud.useGameUiStore[fishingHud]"]);
    const catchToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"])({
        "GameHud.useGameUiStore[catchToast]": (state)=>state.catchToast
    }["GameHud.useGameUiStore[catchToast]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute left-1/2 top-3 z-10 flex max-w-[calc(100dvw-1.5rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-[11px] text-lime-100 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Wood ",
                            wood
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white/30",
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Stone ",
                            stone
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white/30",
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Food ",
                            food
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mx-1 text-white/30",
                        children: "|"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolButton, {
                        label: "Farm",
                        active: worldTool === "designate",
                        onClick: ()=>setWorldTool(toggleTool(worldTool, "designate"))
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolButton, {
                        label: "Remove Farm",
                        active: worldTool === "remove",
                        onClick: ()=>setWorldTool(toggleTool(worldTool, "remove"))
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolButton, {
                        label: "Fish",
                        active: worldTool === "fish",
                        onClick: ()=>setWorldTool(toggleTool(worldTool, "fish"))
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolButton, {
                        label: "Collection",
                        active: collectionOpen,
                        onClick: toggleCollection
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/GameHud.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            collectionOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "pointer-events-none absolute left-1/2 top-12 z-10 min-w-44 -translate-x-1/2 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1 tracking-widest text-lime-300",
                        children: "COLLECTION"
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH_ID_LIST"].map((id)=>{
                        const entry = fishCollection[id];
                        if (!entry?.discovered) {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "???"
                            }, id, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 71,
                                columnNumber: 22
                            }, this);
                        }
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$data$2f$fish$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISH"][id].name,
                                " ×",
                                entry.caughtCount
                            ]
                        }, id, true, {
                            fileName: "[project]/src/ui/GameHud.tsx",
                            lineNumber: 74,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/GameHud.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this) : null,
            selectedSlime ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "pointer-events-none absolute right-3 top-3 z-10 min-w-40 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-[11px] leading-5 text-lime-100 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1 tracking-widest text-lime-300",
                        children: selectedSlime.name.toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "State: ",
                            selectedSlime.state
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Task: ",
                            selectedSlime.taskLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Satiety: ",
                            selectedSlime.satiety,
                            " / ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$needsConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SATIETY_MAX"]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Condition: ",
                            conditionLabel(selectedSlime.hungerState)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Technique ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(selectedSlime.technique)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Strength ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(selectedSlime.strength)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Instinct ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(selectedSlime.instinct)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Luck ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(selectedSlime.luck)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Carrying: ",
                            selectedSlime.carrying
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Position: ",
                            selectedSlime.tileX,
                            ", ",
                            selectedSlime.tileY
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Visual: ",
                            selectedSlime.visual
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Animation: ",
                            selectedSlime.anim
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/GameHud.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this) : null,
            fishingHud && fishingHud.phase !== "idle" || catchToast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute bottom-8 left-3 z-10 flex w-44 flex-col-reverse gap-2",
                children: [
                    fishingHud && fishingHud.phase !== "idle" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded border border-white/20 bg-black/80 px-2 py-2 font-mono text-[11px] text-lime-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center tracking-widest text-lime-300",
                                children: (fishingHud.slimeName ?? "SLIME").toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 text-center text-lime-100",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$entities$2f$FishingPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fishingPhaseLabel"])(fishingHud.presentation)
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 text-center text-white/70",
                                children: [
                                    "TECH ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(fishingHud.technique),
                                    " · STR ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(fishingHud.strength),
                                    " · INST",
                                    " ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$simulation$2f$slimeAttributes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starString"])(fishingHud.instinct)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, this),
                            fishingHud.phase === "fighting" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative h-3 w-full border border-white/40 bg-black",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 h-full bg-lime-700",
                                                style: {
                                                    left: `${fishingHud.zoneStart * 100}%`,
                                                    width: `${fishingHud.zoneWidth * 100}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/ui/GameHud.tsx",
                                                lineNumber: 119,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 h-full w-0.5 bg-white",
                                                style: {
                                                    left: `${fishingHud.marker * 100}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/ui/GameHud.tsx",
                                                lineNumber: 126,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/ui/GameHud.tsx",
                                        lineNumber: 118,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-center text-white/70",
                                        children: "Click / Space"
                                    }, void 0, false, {
                                        fileName: "[project]/src/ui/GameHud.tsx",
                                        lineNumber: 131,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 117,
                                columnNumber: 17
                            }, this) : null,
                            fishingHud.lastStrike === "perfect" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-center text-lime-300",
                                children: "PERFECT"
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 135,
                                columnNumber: 17
                            }, this) : null,
                            fishingHud.lastStrike === "hit" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-center text-lime-200",
                                children: "SUCCESS"
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 138,
                                columnNumber: 17
                            }, this) : null,
                            fishingHud.lastStrike === "miss" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-center text-rose-300",
                                children: "FAILURE"
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 141,
                                columnNumber: 17
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 107,
                        columnNumber: 13
                    }, this) : null,
                    catchToast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded border border-lime-300/40 bg-black/80 px-3 py-2 font-mono text-[11px] text-lime-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center tracking-widest text-lime-300",
                                children: catchHeadline(catchToast)
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center",
                                children: catchToast.name
                            }, void 0, false, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 148,
                                columnNumber: 15
                            }, this),
                            catchToast.kind === "catch" && catchToast.slimeName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-white/70",
                                children: [
                                    "Caught by ",
                                    catchToast.slimeName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/ui/GameHud.tsx",
                                lineNumber: 150,
                                columnNumber: 17
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/ui/GameHud.tsx",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/ui/GameHud.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/ui/GameHud.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(GameHud, "rPFMMF47cmRl5aA/fgEwBXRUvv4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"]
    ];
});
_c = GameHud;
function toggleTool(current, next) {
    return current === next ? "off" : next;
}
function catchHeadline(toast) {
    if (toast.kind === "bite") {
        return `${(toast.slimeName ?? "SLIME").toUpperCase()} GOT A BITE!`;
    }
    if (toast.isNew) {
        return "NEW SPECIES!";
    }
    return `${(toast.slimeName ?? "SLIME").toUpperCase()} CAUGHT`;
}
function ToolButton({ label, active, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `rounded border px-2 py-0.5 ${active ? "border-lime-300/70 bg-lime-800 text-lime-50" : "border-lime-300/30 bg-lime-950/80 text-lime-100 hover:bg-lime-900"}`,
        onClick: onClick,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/ui/GameHud.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c1 = ToolButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "GameHud");
__turbopack_context__.k.register(_c1, "ToolButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ui/GameShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameShell",
    ()=>GameShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$DebugOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/DebugOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$GameHud$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/GameHud.tsx [app-client] (ecmascript)");
;
"use client";
;
;
;
;
const GameCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/ui/GameCanvas.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.GameCanvas), {
    loadableGenerated: {
        modules: [
            "[project]/src/ui/GameCanvas.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-mono text-sm text-lime-100/80",
            children: "Loading Slime Haven…"
        }, void 0, false, {
            fileName: "[project]/src/ui/GameShell.tsx",
            lineNumber: 10,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = GameCanvas;
function GameShell() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-dvh w-full overflow-hidden bg-[#14110e]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GameCanvas, {}, void 0, false, {
                fileName: "[project]/src/ui/GameShell.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$GameHud$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GameHud"], {}, void 0, false, {
                fileName: "[project]/src/ui/GameShell.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$DebugOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DebugOverlay"], {}, void 0, false, {
                fileName: "[project]/src/ui/GameShell.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/ui/GameShell.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c1 = GameShell;
var _c, _c1;
__turbopack_context__.k.register(_c, "GameCanvas");
__turbopack_context__.k.register(_c1, "GameShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/world/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Authoritative logical terrain cell size for the prototype tileset. */ __turbopack_context__.s([
    "TILE_SIZE",
    ()=>TILE_SIZE,
    "tileToAnchor",
    ()=>tileToAnchor,
    "tileToWorld",
    ()=>tileToWorld,
    "worldToTile",
    ()=>worldToTile
]);
const TILE_SIZE = 32;
function worldToTile(worldX, worldY) {
    return {
        x: Math.floor(worldX / TILE_SIZE),
        y: Math.floor(worldY / TILE_SIZE)
    };
}
function tileToWorld(tileX, tileY) {
    return {
        x: tileX * TILE_SIZE,
        y: tileY * TILE_SIZE
    };
}
function tileToAnchor(tileX, tileY) {
    return {
        x: tileX * TILE_SIZE + TILE_SIZE / 2,
        y: tileY * TILE_SIZE + TILE_SIZE
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1sx634d._.js.map