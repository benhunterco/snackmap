(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/components/Container/Container.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "Container-module-scss-module__JlzzPW__container",
});
}),
"[project]/src/components/Container/Container.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Container/Container.module.scss [client] (css module)");
;
;
const Container = ({ children, className, ...rest })=>{
    let containerClassName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].container;
    if (className) {
        containerClassName = `${containerClassName} ${className}`;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: containerClassName,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Container/Container.js",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Container;
const __TURBOPACK__default__export__ = Container;
var _c;
__turbopack_context__.k.register(_c, "Container");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Container/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Container/Container.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header/Header.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "header": "Header-module-scss-module__wS1-Va__header",
  "headerContainer": "Header-module-scss-module__wS1-Va__headerContainer",
  "headerLinks": "Header-module-scss-module__wS1-Va__headerLinks",
  "headerLogo": "Header-module-scss-module__wS1-Va__headerLogo",
  "headerTitle": "Header-module-scss-module__wS1-Va__headerTitle",
});
}),
"[project]/src/components/Header/Header.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Container/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Container/Container.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Header/Header.module.scss [client] (css module)");
;
;
;
;
;
const Header = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].header,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].headerContainer,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].headerTitle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    children: "Streetsnacks SnackMap"
                }, void 0, false, {
                    fileName: "[project]/src/components/Header/Header.js",
                    lineNumber: 13,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Header/Header.js",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/Header/Header.js",
            lineNumber: 11,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Header/Header.js",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/Header.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Footer/Footer.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer": "Footer-module-scss-module__wcgw9G__footer",
  "footerContainer": "Footer-module-scss-module__wcgw9G__footerContainer",
  "footerLegal": "Footer-module-scss-module__wcgw9G__footerLegal",
  "footerLinks": "Footer-module-scss-module__wcgw9G__footerLinks",
});
}),
"[project]/src/components/Footer/Footer.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Container/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Container/Container.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Footer/Footer.module.scss [client] (css module)");
;
;
;
const Footer = ({ ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        ...rest,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footerContainer} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].footerLegal}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    textAlign: 'center'
                },
                children: [
                    "© Streetsnacks, ",
                    new Date().getFullYear(),
                    ". The flavors of the world, at your feet."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Footer/Footer.js",
                lineNumber: 9,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/Footer/Footer.js",
            lineNumber: 8,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Footer/Footer.js",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Footer/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer/Footer.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/Layout.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "layout": "Layout-module-scss-module__rGjB5a__layout",
  "main": "Layout-module-scss-module__rGjB5a__main",
});
}),
"[project]/src/components/Layout/Layout.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Header/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/Header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Footer/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer/Footer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Layout.module.scss [client] (css module)");
;
;
;
;
;
const Layout = ({ children, className, ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].layout,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                    rel: "icon",
                    href: "/favicon.ico"
                }, void 0, false, {
                    fileName: "[project]/src/components/Layout/Layout.js",
                    lineNumber: 12,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/Layout.js",
                lineNumber: 11,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/Layout/Layout.js",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].main,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/Layout/Layout.js",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/Layout/Layout.js",
                lineNumber: 16,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Layout/Layout.js",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Layout;
const __TURBOPACK__default__export__ = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Layout/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Layout.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Section/Section.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "section": "Section-module-scss-module__PVCzVq__section",
});
}),
"[project]/src/components/Section/Section.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$Section$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Section/Section.module.scss [client] (css module)");
;
;
;
const Section = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = function Section(props, ref) {
    const { children, className, backgroundColor, ...rest } = props;
    let sectionClassName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$Section$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].section;
    if (className) {
        sectionClassName = `${sectionClassName} ${className}`;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: ref,
        className: sectionClassName,
        "data-background-color": backgroundColor,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Section/Section.js",
        lineNumber: 15,
        columnNumber: 5
    }, this);
});
_c1 = Section;
const __TURBOPACK__default__export__ = Section;
var _c, _c1;
__turbopack_context__.k.register(_c, "Section$forwardRef");
__turbopack_context__.k.register(_c1, "Section");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Section/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$Section$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Section/Section.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Button/Button.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "Button-module-scss-module__HB5Z3q__button",
});
}),
"[project]/src/components/Button/Button.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.module.scss [client] (css module)");
;
;
;
const Button = ({ children, href, className, ...rest })=>{
    let buttonClassName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].button;
    if (className) {
        buttonClassName = `${buttonClassName} ${className}`;
    }
    const buttonProps = {
        className: buttonClassName,
        ...rest
    };
    if (href) {
        if (href.startsWith('/')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                ...buttonProps,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/Button/Button.js",
                lineNumber: 19,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            ...buttonProps,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/Button/Button.js",
            lineNumber: 25,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...buttonProps,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Button/Button.js",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Button/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button/Button.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/snacks.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SNACKS",
    ()=>SNACKS
]);
const SNACKS = [
    {
        "id": "1",
        "name": "02Fb0942 99E0 492D 885B 737D3D1F8Efa",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/02fb0942-99e0-492d-885b-737d3d1f8efa.jpg"
    },
    {
        "id": "2",
        "name": "0Dd0736E 964F 4Fde Ada9 336Ccb237A35",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/0dd0736e-964f-4fde-ada9-336ccb237a35.jpg"
    },
    {
        "id": "3",
        "name": "2C0A4C01 231D 437E B1Bb E99Ca50Fc949",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/2c0a4c01-231d-437e-b1bb-e99ca50fc949.jpg"
    },
    {
        "id": "4",
        "name": "2F407Cf7 6409 4734 B4C1 2B9B71F3016F",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/2f407cf7-6409-4734-b4c1-2b9b71f3016f.jpg"
    },
    {
        "id": "5",
        "name": "333Ff485 D448 465A Ad03 1E8110D9653B",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/333ff485-d448-465a-ad03-1e8110d9653b.jpg"
    },
    {
        "id": "6",
        "name": "5D0A4A20 5Cbc 4E54 A9Fc 5B6Fd45F9B4E",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/5d0a4a20-5cbc-4e54-a9fc-5b6fd45f9b4e.jpg"
    },
    {
        "id": "7",
        "name": "5Dd80568 87E0 4876 84D5 D7Bdf55Bd62D",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/5dd80568-87e0-4876-84d5-d7bdf55bd62d.jpg"
    },
    {
        "id": "8",
        "name": "6524E3Af 332F 4F43 Ba2D Cc29D3954Cb9",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/6524e3af-332f-4f43-ba2d-cc29d3954cb9.jpg"
    },
    {
        "id": "9",
        "name": "66735A6D 6604 4056 894D B1Cd82D484Bd",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/66735a6d-6604-4056-894d-b1cd82d484bd.jpg"
    },
    {
        "id": "10",
        "name": "6Bc2Ae05 0F4F 41C9 8Cf8 38A099238D20",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/6bc2ae05-0f4f-41c9-8cf8-38a099238d20.jpg"
    },
    {
        "id": "11",
        "name": "79Fe04C3 F8D5 42B8 87E4 7A4F9Be4Ac13",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/79fe04c3-f8d5-42b8-87e4-7a4f9be4ac13.jpg"
    },
    {
        "id": "12",
        "name": "7Ad49E0A E8D5 4060 8B80 F4D9C0E40527",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/7ad49e0a-e8d5-4060-8b80-f4d9c0e40527.jpg"
    },
    {
        "id": "14",
        "name": "7Dadb421 51E9 4Ac0 8C8D 15D4E34B6625",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/7dadb421-51e9-4ac0-8c8d-15d4e34b6625.jpg"
    },
    {
        "id": "15",
        "name": "81E1762F 0D75 4Fe6 9173 Ed56Ebcc9C68",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/81e1762f-0d75-4fe6-9173-ed56ebcc9c68.jpg"
    },
    {
        "id": "16",
        "name": "8936A536 B46B 4Cd7 B7E7 91574B5B29Db",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/8936a536-b46b-4cd7-b7e7-91574b5b29db.jpg"
    },
    {
        "id": "17",
        "name": "8Af97581 E73F 46D1 8124 50667288428A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/8af97581-e73f-46d1-8124-50667288428a.jpg"
    },
    {
        "id": "19",
        "name": "9Ef23Be9 Bc39 4043 9Ac2 A94C494E9C86",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/9ef23be9-bc39-4043-9ac2-a94c494e9c86.jpg"
    },
    {
        "id": "20",
        "name": "Ben.N",
        "date": "December 13, 2024",
        "position": [
            40.58766343976597,
            -105.07806533238521
        ],
        "description": "what is it?",
        "image": "./img/snacks/BenFCPepper.jpg"
    },
    {
        "id": "21",
        "name": "Denverchicken",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverChicken.jpg"
    },
    {
        "id": "22",
        "name": "Denvercookies",
        "date": "June 18, 2021",
        "position": [
            39.741875,
            -104.98498611111111
        ],
        "description": "Found on June 18, 2021",
        "image": "./img/snacks/DenverCookies.jpg"
    },
    {
        "id": "23",
        "name": "Denvercroissant",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverCroissant.jpg"
    },
    {
        "id": "25",
        "name": "Denverdonuts",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverDonuts.jpg"
    },
    {
        "id": "26",
        "name": "Denverjalapeno",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverJalapeno.jpg"
    },
    {
        "id": "28",
        "name": "Denverlettuce",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverLettuce.jpg"
    },
    {
        "id": "29",
        "name": "Denvermango",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverMango.jpg"
    },
    {
        "id": "31",
        "name": "Denverpb",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverPB.jpg"
    },
    {
        "id": "32",
        "name": "Denverpeels",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverPeels.jpg"
    },
    {
        "id": "33",
        "name": "Denverpizza",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverPizza.jpg"
    },
    {
        "id": "34",
        "name": "Denverpringles",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverPringles.jpg"
    },
    {
        "id": "35",
        "name": "Denvershrimp",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverShrimp.jpg"
    },
    {
        "id": "36",
        "name": "Drew.T",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DenverTwizzlers.jpg"
    },
    {
        "id": "40",
        "name": "Drew.T",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DrewBreadCO.jpg"
    },
    {
        "id": "42",
        "name": "Drew.T",
        "date": "August 12, 2021",
        "position": [
            -90.0,
            0.0
        ],
        "description": "Found on August 12, 2021",
        "image": "./img/snacks/DrewCOpond.jpg"
    },
    {
        "id": "43",
        "name": "Drew.T",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/DrewMealCO.jpg"
    },
    {
        "id": "44",
        "name": "Elena.H",
        "date": "2025",
        "position": [
            40.579808787455136,
            -104.99834058170048
        ],
        "description": null,
        "image": "./img/snacks/ElenaFortCollins_9908.jpg"
    },
    {
        "id": "45",
        "name": "Elena.H",
        "date": "2025",
        "position": [
            40.56668468614316,
            -105.0783998229052
        ],
        "description": null,
        "image": "./img/snacks/ElenaLosComales_9536.jpg"
    },
    {
        "id": "46",
        "name": "Img 0021",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_0021.jpg"
    },
    {
        "id": "47",
        "name": "Img 0051",
        "date": "July 20, 2023",
        "position": [
            39.72570555555556,
            -104.95261388888889
        ],
        "description": "Found on July 20, 2023",
        "image": "./img/snacks/IMG_0051.jpg"
    },
    {
        "id": "48",
        "name": "Img 0084",
        "date": "July 30, 2023",
        "position": [
            39.72535,
            -104.98735
        ],
        "description": "Found on July 30, 2023",
        "image": "./img/snacks/IMG_0084.jpg"
    },
    {
        "id": "49",
        "name": "Img 0117",
        "date": "August 09, 2023",
        "position": [
            37.879875,
            -122.29645555555555
        ],
        "description": "Found on August 09, 2023",
        "image": "./img/snacks/IMG_0117.jpg"
    },
    {
        "id": "50",
        "name": "Img 0118",
        "date": "August 09, 2023",
        "position": [
            37.87833055555556,
            -122.30111666666666
        ],
        "description": "Found on August 09, 2023",
        "image": "./img/snacks/IMG_0118.jpg"
    },
    {
        "id": "51",
        "name": "Img 0151",
        "date": "August 18, 2023",
        "position": [
            39.73231944444445,
            -104.95459722222222
        ],
        "description": "Found on August 18, 2023",
        "image": "./img/snacks/IMG_0151.jpg"
    },
    {
        "id": "52",
        "name": "Img 0193",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_0193.jpg"
    },
    {
        "id": "53",
        "name": "Img 0206",
        "date": "September 02, 2023",
        "position": [
            39.730358333333335,
            -104.974075
        ],
        "description": "Found on September 02, 2023",
        "image": "./img/snacks/IMG_0206.jpg"
    },
    {
        "id": "54",
        "name": "Img 0275",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_0275.jpg"
    },
    {
        "id": "55",
        "name": "Img 0304",
        "date": "October 01, 2023",
        "position": [
            39.73534444444444,
            -104.97876666666667
        ],
        "description": "Found on October 01, 2023",
        "image": "./img/snacks/IMG_0304.jpg"
    },
    {
        "id": "56",
        "name": "Img 0430",
        "date": "November 02, 2023",
        "position": [
            39.78715,
            -105.02568055555555
        ],
        "description": "Found on November 02, 2023",
        "image": "./img/snacks/IMG_0430.jpg"
    },
    {
        "id": "57",
        "name": "Img 0438",
        "date": "November 05, 2023",
        "position": [
            39.77098055555555,
            -105.08005555555555
        ],
        "description": "Found on November 05, 2023",
        "image": "./img/snacks/IMG_0438.jpg"
    },
    {
        "id": "58",
        "name": "Img 0467",
        "date": "November 17, 2023",
        "position": [
            36.148602777777775,
            -95.97548611111111
        ],
        "description": "Found on November 17, 2023",
        "image": "./img/snacks/IMG_0467.jpg"
    },
    {
        "id": "59",
        "name": "Img 0469",
        "date": "November 20, 2023",
        "position": [
            40.00475,
            -105.2698361111111
        ],
        "description": "Found on November 20, 2023",
        "image": "./img/snacks/IMG_0469.jpg"
    },
    {
        "id": "60",
        "name": "Img 0526",
        "date": "December 11, 2023",
        "position": [
            40.007419444444444,
            -105.27471111111112
        ],
        "description": "Found on December 11, 2023",
        "image": "./img/snacks/IMG_0526.jpg"
    },
    {
        "id": "61",
        "name": "Img 0527",
        "date": "December 11, 2023",
        "position": [
            40.007197222222224,
            -105.27526944444445
        ],
        "description": "Found on December 11, 2023",
        "image": "./img/snacks/IMG_0527.jpg"
    },
    {
        "id": "62",
        "name": "Img 0612",
        "date": "January 28, 2024",
        "position": [
            39.73661666666667,
            -104.97990555555556
        ],
        "description": "Found on January 28, 2024",
        "image": "./img/snacks/IMG_0612.jpg"
    },
    {
        "id": "63",
        "name": "Img 0625",
        "date": "February 14, 2024",
        "position": [
            40.00291388888889,
            -105.26783055555555
        ],
        "description": "Found on February 14, 2024",
        "image": "./img/snacks/IMG_0625.jpg"
    },
    {
        "id": "64",
        "name": "Img 0663",
        "date": "March 11, 2024",
        "position": [
            40.00036111111111,
            -105.26869166666667
        ],
        "description": "Found on March 11, 2024",
        "image": "./img/snacks/IMG_0663.jpg"
    },
    {
        "id": "65",
        "name": "Img 0779",
        "date": "April 30, 2024",
        "position": [
            40.004333333333335,
            -105.27106388888889
        ],
        "description": "Found on April 30, 2024",
        "image": "./img/snacks/IMG_0779.jpg"
    },
    {
        "id": "66",
        "name": "Img 0958",
        "date": "June 22, 2024",
        "position": [
            50.84943055555556,
            5.6948944444444445
        ],
        "description": "Found on June 22, 2024",
        "image": "./img/snacks/IMG_0958.jpg"
    },
    {
        "id": "67",
        "name": "Img 1022",
        "date": "June 28, 2024",
        "position": [
            50.71302777777778,
            13.968891666666666
        ],
        "description": "Found on June 28, 2024",
        "image": "./img/snacks/IMG_1022.jpg"
    },
    {
        "id": "68",
        "name": "Img 1024",
        "date": "June 28, 2024",
        "position": [
            50.06763333333333,
            14.406783333333333
        ],
        "description": "Found on June 28, 2024",
        "image": "./img/snacks/IMG_1024.jpg"
    },
    {
        "id": "69",
        "name": "Img 1066",
        "date": "July 02, 2024",
        "position": [
            47.49817222222222,
            19.069175
        ],
        "description": "Found on July 02, 2024",
        "image": "./img/snacks/IMG_1066.jpg"
    },
    {
        "id": "70",
        "name": "Img 1067",
        "date": "July 03, 2024",
        "position": [
            50.72034722222222,
            12.495247222222222
        ],
        "description": "Found on July 03, 2024",
        "image": "./img/snacks/IMG_1067.jpg"
    },
    {
        "id": "71",
        "name": "Img 1100",
        "date": "July 07, 2024",
        "position": [
            39.740186111111115,
            -104.96984166666667
        ],
        "description": "Found on July 07, 2024",
        "image": "./img/snacks/IMG_1100.jpg"
    },
    {
        "id": "72",
        "name": "Img 1117",
        "date": "July 13, 2024",
        "position": [
            39.753505555555556,
            -104.99005
        ],
        "description": "Found on July 13, 2024",
        "image": "./img/snacks/IMG_1117.jpg"
    },
    {
        "id": "73",
        "name": "Img 1118",
        "date": "July 13, 2024",
        "position": [
            39.75338611111111,
            -104.99057777777777
        ],
        "description": "Found on July 13, 2024",
        "image": "./img/snacks/IMG_1118.jpg"
    },
    {
        "id": "74",
        "name": "Img 1186",
        "date": "August 04, 2024",
        "position": [
            37.78333611111111,
            -122.46334166666666
        ],
        "description": "Found on August 04, 2024",
        "image": "./img/snacks/IMG_1186.jpg"
    },
    {
        "id": "75",
        "name": "Img 1195",
        "date": "August 08, 2024",
        "position": [
            39.73963055555556,
            -104.97880555555555
        ],
        "description": "Found on August 08, 2024",
        "image": "./img/snacks/IMG_1195.jpg"
    },
    {
        "id": "76",
        "name": "Img 1199",
        "date": "August 13, 2024",
        "position": [
            40.00366666666667,
            -105.26854722222222
        ],
        "description": "Found on August 13, 2024",
        "image": "./img/snacks/IMG_1199.jpg"
    },
    {
        "id": "77",
        "name": "Img 1225",
        "date": "August 26, 2024",
        "position": [
            39.75286944444444,
            -105.0001
        ],
        "description": "Found on August 26, 2024",
        "image": "./img/snacks/IMG_1225.jpg"
    },
    {
        "id": "78",
        "name": "Img 1256",
        "date": "September 08, 2024",
        "position": [
            39.72557777777778,
            -104.96253888888889
        ],
        "description": "Found on September 08, 2024",
        "image": "./img/snacks/IMG_1256.jpg"
    },
    {
        "id": "79",
        "name": "Img 1294",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1294.jpg"
    },
    {
        "id": "80",
        "name": "Img 1295",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1295.jpg"
    },
    {
        "id": "81",
        "name": "Img 1296",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1296.jpg"
    },
    {
        "id": "82",
        "name": "Img 1297",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1297.jpg"
    },
    {
        "id": "83",
        "name": "Img 1298",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1298.jpg"
    },
    {
        "id": "84",
        "name": "Img 1299",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1299.jpg"
    },
    {
        "id": "85",
        "name": "Img 1300",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1300.jpg"
    },
    {
        "id": "86",
        "name": "Img 1301",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1301.jpg"
    },
    {
        "id": "87",
        "name": "Img 1302",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1302.jpg"
    },
    {
        "id": "88",
        "name": "Img 1303",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1303.jpg"
    },
    {
        "id": "89",
        "name": "Img 1304",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1304.jpg"
    },
    {
        "id": "90",
        "name": "Img 1305",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1305.jpg"
    },
    {
        "id": "91",
        "name": "Img 1306",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1306.jpg"
    },
    {
        "id": "92",
        "name": "Img 1838",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_1838.jpg"
    },
    {
        "id": "93",
        "name": "Elena.H",
        "date": "2025",
        "position": [
            39.06723199859978,
            -108.56477574525286
        ],
        "description": "bagel on the rocks",
        "image": "./img/snacks/IMG_4687.jpg"
    },
    {
        "id": "94",
        "name": "Elena.H",
        "date": "2024",
        "position": [
            40.611574866079884,
            -105.07381467596632
        ],
        "description": null,
        "image": "./img/snacks/IMG_6428.jpg"
    },
    {
        "id": "95",
        "name": "Img 7959",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_7959.jpg"
    },
    {
        "id": "96",
        "name": "Img 8008",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8008.jpg"
    },
    {
        "id": "97",
        "name": "Img 8074",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8074.jpg"
    },
    {
        "id": "98",
        "name": "Img 8107",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8107.jpg"
    },
    {
        "id": "99",
        "name": "Img 8119",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8119.jpg"
    },
    {
        "id": "100",
        "name": "Img 8122",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8122.jpg"
    },
    {
        "id": "101",
        "name": "Img 8452",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/IMG_8452.jpg"
    },
    {
        "id": "102",
        "name": "Img 8565",
        "date": "June 21, 2022",
        "position": [
            48.88067222222222,
            2.2931916666666665
        ],
        "description": "Found on June 21, 2022",
        "image": "./img/snacks/IMG_8565.jpg"
    },
    {
        "id": "103",
        "name": "Img 8616",
        "date": "June 28, 2022",
        "position": [
            48.84245277777778,
            2.335288888888889
        ],
        "description": "Found on June 28, 2022",
        "image": "./img/snacks/IMG_8616.jpg"
    },
    {
        "id": "104",
        "name": "Img 8893",
        "date": "August 10, 2022",
        "position": [
            39.72690277777778,
            -104.95765
        ],
        "description": "Found on August 10, 2022",
        "image": "./img/snacks/IMG_8893.jpg"
    },
    {
        "id": "105",
        "name": "Img 8903",
        "date": "August 11, 2022",
        "position": [
            39.72733055555556,
            -104.9804
        ],
        "description": "Found on August 11, 2022",
        "image": "./img/snacks/IMG_8903.jpg"
    },
    {
        "id": "106",
        "name": "Img 9103",
        "date": "September 15, 2022",
        "position": [
            39.726108333333336,
            -104.95775555555556
        ],
        "description": "Found on September 15, 2022",
        "image": "./img/snacks/IMG_9103.jpg"
    },
    {
        "id": "107",
        "name": "Img 9112",
        "date": "September 18, 2022",
        "position": [
            39.72549444444444,
            -104.956925
        ],
        "description": "Found on September 18, 2022",
        "image": "./img/snacks/IMG_9112.jpg"
    },
    {
        "id": "108",
        "name": "Img 9212",
        "date": "November 06, 2022",
        "position": [
            39.99811666666667,
            -105.23386388888889
        ],
        "description": "Found on November 06, 2022",
        "image": "./img/snacks/IMG_9212.jpg"
    },
    {
        "id": "109",
        "name": "Img 9395",
        "date": "January 06, 2023",
        "position": [
            38.89852777777778,
            -77.03934444444444
        ],
        "description": "Found on January 06, 2023",
        "image": "./img/snacks/IMG_9395.jpg"
    },
    {
        "id": "110",
        "name": "Img 9625",
        "date": "March 26, 2023",
        "position": [
            39.72695277777778,
            -104.97284722222223
        ],
        "description": "Found on March 26, 2023",
        "image": "./img/snacks/IMG_9625.jpg"
    },
    {
        "id": "111",
        "name": "Img 9745",
        "date": "April 29, 2023",
        "position": [
            39.72430555555556,
            -104.98154444444445
        ],
        "description": "Found on April 29, 2023",
        "image": "./img/snacks/IMG_9745.jpg"
    },
    {
        "id": "112",
        "name": "Img 9746",
        "date": "April 29, 2023",
        "position": [
            39.72564722222222,
            -104.98824444444445
        ],
        "description": "Found on April 29, 2023",
        "image": "./img/snacks/IMG_9746.jpg"
    },
    {
        "id": "113",
        "name": "Img 9758",
        "date": "May 02, 2023",
        "position": [
            40.00728333333333,
            -105.27517777777777
        ],
        "description": "Found on May 02, 2023",
        "image": "./img/snacks/IMG_9758.jpg"
    },
    {
        "id": "114",
        "name": "Img 9790",
        "date": "May 14, 2023",
        "position": [
            40.80815833333333,
            -73.96309722222223
        ],
        "description": "Found on May 14, 2023",
        "image": "./img/snacks/IMG_9790.jpg"
    },
    {
        "id": "115",
        "name": "Img 9809",
        "date": "May 16, 2023",
        "position": [
            40.76278055555556,
            -73.98908888888889
        ],
        "description": "Found on May 16, 2023",
        "image": "./img/snacks/IMG_9809.jpg"
    },
    {
        "id": "116",
        "name": "Img 9814",
        "date": "May 20, 2023",
        "position": [
            39.943797222222216,
            -75.16669444444445
        ],
        "description": "Found on May 20, 2023",
        "image": "./img/snacks/IMG_9814.jpg"
    },
    {
        "id": "117",
        "name": "Img 9815",
        "date": "May 20, 2023",
        "position": [
            39.949038888888886,
            -75.1614
        ],
        "description": "Found on May 20, 2023",
        "image": "./img/snacks/IMG_9815.jpg"
    },
    {
        "id": "118",
        "name": "Img 9877",
        "date": "June 09, 2023",
        "position": [
            39.725608333333334,
            -104.96054166666667
        ],
        "description": "Found on June 09, 2023",
        "image": "./img/snacks/IMG_9877.jpg"
    },
    {
        "id": "119",
        "name": "Img 9923",
        "date": "June 24, 2023",
        "position": [
            39.718783333333334,
            -104.98619722222222
        ],
        "description": "Found on June 24, 2023",
        "image": "./img/snacks/IMG_9923.jpg"
    },
    {
        "id": "120",
        "name": "Nadia.G",
        "date": "2025",
        "position": [
            44.991824,
            -93.186824
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/NadiaMinneapolis_195914.jpg"
    },
    {
        "id": "122",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/RaphDenverBagel.jpg"
    },
    {
        "id": "123",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/RaphDenverBanana.jpg"
    },
    {
        "id": "124",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/RaphParisBread.jpg"
    },
    {
        "id": "126",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/RaphParisPringle.jpg"
    },
    {
        "id": "127",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/RaphParisYogurt.jpg"
    },
    {
        "id": "128",
        "name": "Sherryparisboule",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/SherryParisBoule.jpg"
    },
    {
        "id": "129",
        "name": "Sherryparisboule",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/SherryParisBoule.jpg"
    },
    {
        "id": "130",
        "name": "Bab273Ca 2Edb 4854 A853 Fa7226Fbcc7E",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/bab273ca-2edb-4854-a853-fa7226fbcc7e.jpg"
    },
    {
        "id": "131",
        "name": "Bc3C8Cc8 C8Bf 49A5 B7Bb B3B9B7310216",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/bc3c8cc8-c8bf-49a5-b7bb-b3b9b7310216.jpg"
    },
    {
        "id": "132",
        "name": "Bd984045 8De1 401F 976A 2E412Fe37416",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/bd984045-8de1-401f-976a-2e412fe37416.jpg"
    },
    {
        "id": "133",
        "name": "Bea58983 F311 47D3 9A6C 9E453D0B954E",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/bea58983-f311-47d3-9a6c-9e453d0b954e.jpg"
    },
    {
        "id": "134",
        "name": "Ben.N",
        "date": "May 11, 2025",
        "position": [
            39.59481116304378,
            -104.95973686313138
        ],
        "description": "Fuel up.",
        "image": "./img/snacks/benCentennial.jpg"
    },
    {
        "id": "136",
        "name": "Bfbb0D33 Ec81 4563 9246 Eb1646C7E577",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/bfbb0d33-ec81-4563-9246-eb1646c7e577.jpg"
    },
    {
        "id": "137",
        "name": "Cdc82B46 89E0 46E3 Be46 B04D741C4096",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/cdc82b46-89e0-46e3-be46-b04d741c4096.jpg"
    },
    {
        "id": "138",
        "name": "Ddee3173 5C74 4499 9985 E8Dd3375Fa9C",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/ddee3173-5c74-4499-9985-e8dd3375fa9c.jpg"
    },
    {
        "id": "139",
        "name": "F1B641C5 5Bd2 429B Ba60 0Af2E1701C15",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/f1b641c5-5bd2-429b-ba60-0af2e1701c15.jpg"
    },
    {
        "id": "140",
        "name": "F63Bade2 E3Ed 47D8 B050 D32Ae920A6Ef",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/f63bade2-e3ed-47d8-b050-d32ae920a6ef.jpg"
    },
    {
        "id": "141",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphbridge.jpg"
    },
    {
        "id": "142",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphchicagopeanuts.jpg"
    },
    {
        "id": "143",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphchicagopidge.jpg"
    },
    {
        "id": "145",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphsomewhere.jpg"
    },
    {
        "id": "146",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphtide.jpg"
    },
    {
        "id": "147",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphtread.jpg"
    },
    {
        "id": "148",
        "name": "Raphael.A",
        "date": "Unknown Date",
        "position": [
            -90.0,
            0.0
        ],
        "description": "A tasty find!",
        "image": "./img/snacks/raphza.jpg"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Map/Map.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [client] (ecmascript)");
;
;
;
const DynamicMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/Map/DynamicMap.js [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/Map/DynamicMap.js [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = DynamicMap;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;
const Map = (props)=>{
    const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100%'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DynamicMap, {
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/Map/Map.js",
            lineNumber: 14,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Map/Map.js",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = Map;
const __TURBOPACK__default__export__ = Map;
var _c, _c1;
__turbopack_context__.k.register(_c, "DynamicMap");
__turbopack_context__.k.register(_c1, "Map");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Map/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Map/Map.js [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/Home.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "code": "Home-module-scss-module__FTgTta__code",
  "description": "Home-module-scss-module__FTgTta__description",
  "title": "Home-module-scss-module__FTgTta__title",
  "view": "Home-module-scss-module__FTgTta__view",
});
}),
"[project]/src/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Layout/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout/Layout.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Section/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$Section$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Section/Section.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Container/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Container/Container.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Button/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$snacks$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/snacks.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Map/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Map/Map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Home$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Home.module.scss [client] (css module)");
;
;
;
;
;
;
;
;
;
const DEFAULT_CENTER = [
    38.907132,
    -77.036546
];
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Streetsnacks SnackMap"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "The flavors of the world, at your feet"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2f$Section$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Map$2f$Map$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Home$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"].homeMap,
                        center: DEFAULT_CENTER,
                        zoom: 12,
                        snacks: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$snacks$2e$js__$5b$client$5d$__$28$ecmascript$29$__["SNACKS"]
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.js",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/index.js",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/index.js",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/index.js",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ffeabc54._.js.map