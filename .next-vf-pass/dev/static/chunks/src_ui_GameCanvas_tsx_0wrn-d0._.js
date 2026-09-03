(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/ui/GameCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameCanvas",
    ()=>GameCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameUiStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function GameCanvas() {
    _s();
    const parentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GameCanvas.useEffect": ()=>{
            const parent = parentRef.current;
            if (!parent) {
                return;
            }
            let cancelled = false;
            const onKeyDown = {
                "GameCanvas.useEffect.onKeyDown": (event)=>{
                    if (event.key !== "F3") {
                        return;
                    }
                    event.preventDefault();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameUiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameUiStore"].getState().toggleDebug();
                }
            }["GameCanvas.useEffect.onKeyDown"];
            window.addEventListener("keydown", onKeyDown, {
                capture: true
            });
            void __turbopack_context__.A("[project]/src/game/Game.ts [app-client] (ecmascript, async loader)").then({
                "GameCanvas.useEffect": ({ createGame })=>{
                    if (cancelled || !parentRef.current) {
                        return;
                    }
                    gameRef.current = createGame(parentRef.current);
                }
            }["GameCanvas.useEffect"]);
            return ({
                "GameCanvas.useEffect": ()=>{
                    cancelled = true;
                    window.removeEventListener("keydown", onKeyDown, {
                        capture: true
                    });
                    gameRef.current?.destroy(true);
                    gameRef.current = null;
                }
            })["GameCanvas.useEffect"];
        }
    }["GameCanvas.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: parentRef,
        className: "flex h-full w-full items-center justify-center"
    }, void 0, false, {
        fileName: "[project]/src/ui/GameCanvas.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(GameCanvas, "2Y2YFaZdVWPK/KuYm/fgSqIWYdI=");
_c = GameCanvas;
var _c;
__turbopack_context__.k.register(_c, "GameCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ui/GameCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/ui/GameCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_ui_GameCanvas_tsx_0wrn-d0._.js.map