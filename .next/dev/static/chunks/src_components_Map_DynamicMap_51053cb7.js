(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Map/DynamicMap.js [client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_600a8325._.js",
  "static/chunks/src_7541cb13._.js",
  {
    "path": "static/chunks/_b6bd4d4e._.css",
    "included": [
      "[project]/node_modules/leaflet/dist/leaflet.css [client] (css)",
      "[project]/src/components/Map/Map.module.scss.module.css [client] (css)"
    ],
    "moduleChunks": [
      "static/chunks/node_modules_leaflet_dist_leaflet_css_65f1660e._.single.css",
      "static/chunks/src_components_Map_Map_module_scss_module_css_65f1660e._.single.css"
    ]
  },
  "static/chunks/src_components_Map_DynamicMap_0a48d390.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/components/Map/DynamicMap.js [client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);