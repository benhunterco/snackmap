(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Map/Map.module.scss [client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/Map/DynamicMap.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet-cluster/dist/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Map/Map.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dayjs/dayjs.min.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/context/MapContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__;
const getDate = (dateStr)=>{
    const dateobj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(dateStr);
    if (dateobj.isValid()) {
        return dateobj.year();
    } else {
        return 'Timeless';
    }
};
// New component to track map events
function MapStateManager() {
    _s();
    const { setCenter, setZoom } = useMapContext();
    useMapEvents({
        moveend: {
            "MapStateManager.useMapEvents": (e)=>{
                const map = e.target;
                const center = map.getCenter();
                setCenter([
                    center.lat,
                    center.lng
                ]);
            }
        }["MapStateManager.useMapEvents"],
        zoomend: {
            "MapStateManager.useMapEvents": (e)=>{
                const map = e.target;
                setZoom(map.getZoom());
            }
        }["MapStateManager.useMapEvents"]
    });
    return null;
}
_s(MapStateManager, "N3uIMMdkxTx6TIU+e6th+iPGnYY=", false, function() {
    return [
        useMapContext,
        useMapEvents
    ];
});
_c = MapStateManager;
const Map = ({ className, snacks = [], ...rest })=>{
    _s1();
    const [activeSnack, setActiveSnack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { center, zoom } = useMapContext(); // Get state from context
    let mapClassName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].map;
    if (className) mapClassName = `${mapClassName} ${className}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Map.useEffect": ()=>{
            delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
            });
        }
    }["Map.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].mapWrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapContainer, {
                className: mapClassName,
                center: center,
                zoom: zoom,
                ...rest,
                tap: false,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapStateManager, {}, void 0, false, {
                        fileName: "[project]/src/components/Map/DynamicMap.js",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TileLayer, {
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        attribution: "© OpenStreetMap contributors"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Map/DynamicMap.js",
                        lineNumber: 66,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2d$cluster$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        chunkedLoading: true,
                        children: snacks.map((snack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Marker, {
                                position: snack.position,
                                icon: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].divIcon({
                                    className: 'custom-pin-wrapper',
                                    html: `<div class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].customPin}"><img src="${snack.image}" /></div>`,
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
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Popup, {
                                    maxWidth: 'auto',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '70dvw',
                                            maxWidth: '325px',
                                            maxHeight: '60dvh'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: snack.image,
                                                alt: snack.name,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].popupImage,
                                                onClick: ()=>setActiveSnack(snack)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    margin: '8px 0 5px'
                                                },
                                                children: snack.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: '12px',
                                                    color: '#666'
                                                },
                                                children: getDate(snack.date)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: '8px 0 0',
                                                    fontSize: '14px'
                                                },
                                                children: snack.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                                lineNumber: 93,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Map/DynamicMap.js",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, snack.id, false, {
                                fileName: "[project]/src/components/Map/DynamicMap.js",
                                lineNumber: 72,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Map/DynamicMap.js",
                        lineNumber: 70,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Map/DynamicMap.js",
                lineNumber: 58,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            activeSnack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].modalOverlay,
                onClick: ()=>setActiveSnack(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].closeButton,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 104,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: activeSnack.image,
                            alt: activeSnack.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 105,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].modalCaption,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: activeSnack.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: activeSnack.date
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Map/DynamicMap.js",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Map/DynamicMap.js",
                            lineNumber: 106,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Map/DynamicMap.js",
                    lineNumber: 103,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Map/DynamicMap.js",
                lineNumber: 102,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Map/DynamicMap.js",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(Map, "nl++tgU+mcQW6cmpgKeAod5oyJY=", false, function() {
    return [
        useMapContext
    ];
});
_c1 = Map;
const __TURBOPACK__default__export__ = Map;
var _c, _c1;
__turbopack_context__.k.register(_c, "MapStateManager");
__turbopack_context__.k.register(_c1, "Map");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Map/DynamicMap.js [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Map/DynamicMap.js [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_Map_7a8cdaa6._.js.map