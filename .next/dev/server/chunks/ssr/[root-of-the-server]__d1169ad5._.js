module.exports = [
"[project]/src/components/Map/Map.module.scss [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "closeButton": "Map-module-scss-module__KetCVG__closeButton",
  "customPin": "Map-module-scss-module__KetCVG__customPin",
  "map": "Map-module-scss-module__KetCVG__map",
  "mapWrapper": "Map-module-scss-module__KetCVG__mapWrapper",
  "modalCaption": "Map-module-scss-module__KetCVG__modalCaption",
  "modalContent": "Map-module-scss-module__KetCVG__modalContent",
  "modalOverlay": "Map-module-scss-module__KetCVG__modalOverlay",
  "popupImage": "Map-module-scss-module__KetCVG__popupImage",
});
}),
"[project]/src/components/Map/DynamicMap.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)"); // Added useState
var __TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$leaflet$29$__ = __turbopack_context__.i("[externals]/leaflet [external] (leaflet, cjs, [project]/node_modules/leaflet)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$29$__ = __turbopack_context__.i("[externals]/react-leaflet [external] (react-leaflet, esm_import, [project]/node_modules/react-leaflet)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet$2d$cluster__$5b$external$5d$__$28$react$2d$leaflet$2d$cluster$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$29$__ = __turbopack_context__.i("[externals]/react-leaflet-cluster [external] (react-leaflet-cluster, esm_import, [project]/node_modules/react-leaflet-cluster)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Map/Map.module.scss [ssr] (css module)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet$2d$cluster__$5b$external$5d$__$28$react$2d$leaflet$2d$cluster$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet$2d$cluster__$5b$external$5d$__$28$react$2d$leaflet$2d$cluster$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const { MapContainer, TileLayer, Marker, Popup } = __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$29$__;
const Map = ({ className, snacks = [], ...rest })=>{
    const [activeSnack, setActiveSnack] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // State for modal
    let mapClassName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].map;
    if (className) mapClassName = `${mapClassName} ${className}`;
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        delete __TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$leaflet$29$__["default"].Icon.Default.prototype._getIconUrl;
        __TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$leaflet$29$__["default"].Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].mapWrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(MapContainer, {
                className: mapClassName,
                ...rest,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TileLayer, {
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        attribution: "© OpenStreetMap contributors"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Map/DynamicMap.js",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet$2d$cluster__$5b$external$5d$__$28$react$2d$leaflet$2d$cluster$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$29$__["default"], {
                        chunkedLoading: true,
                        children: snacks.map((snack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Marker, {
                                position: snack.position,
                                icon: new __TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$leaflet$29$__["default"].divIcon({
                                    className: 'custom-pin-wrapper',
                                    html: `<div class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].customPin}"><img src="${snack.image}" /></div>`,
                                    iconSize: [
                                        45,
                                        45
                                    ],
                                    iconAnchor: [
                                        22,
                                        45
                                    ],
                                    popupAnchor: [
                                        0,
                                        -45
                                    ]
                                }),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Popup, {
                                    maxWidth: 'auto',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '325px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                src: snack.image,
                                                alt: snack.name,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].popupImage,
                                                onClick: ()=>setActiveSnack(snack)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 50,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    margin: '8px 0 5px'
                                                },
                                                children: snack.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 56,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: '12px',
                                                    color: '#666'
                                                },
                                                children: snack.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 57,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: '8px 0 0',
                                                    fontSize: '14px'
                                                },
                                                children: snack.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 58,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Map/DynamicMap.js",
                                        lineNumber: 48,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, snack.id, false, {
                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                lineNumber: 36,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Map/DynamicMap.js",
                        lineNumber: 34,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Map/DynamicMap.js",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            activeSnack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].modalOverlay,
                onClick: ()=>setActiveSnack(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].closeButton,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 70,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: activeSnack.image,
                            alt: activeSnack.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 71,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$ssr$5d$__$28$css__module$29$__["default"].modalCaption,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: activeSnack.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: activeSnack.date
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 72,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Map/DynamicMap.js",
                    lineNumber: 69,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Map/DynamicMap.js",
                lineNumber: 68,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Map/DynamicMap.js",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Map;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/Map/DynamicMap.js [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Map/DynamicMap.js [ssr] (ecmascript)"));
}),
"[externals]/leaflet [external] (leaflet, cjs, [project]/node_modules/leaflet)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("leaflet-dd35bdd58107d823", () => require("leaflet-dd35bdd58107d823"));

module.exports = mod;
}),
"[externals]/react-leaflet [external] (react-leaflet, esm_import, [project]/node_modules/react-leaflet)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-leaflet-0d15a688ff7d710a");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/react-leaflet-cluster [external] (react-leaflet-cluster, esm_import, [project]/node_modules/react-leaflet-cluster)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-leaflet-cluster-cfca955996bb52db");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d1169ad5._.js.map