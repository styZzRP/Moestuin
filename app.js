"use strict";
const { useState, useEffect, useCallback, useRef } = React;
// ── Iconen (Lucide, MIT) als inline SVG ───────────────────────────────
const ICON_PATHS = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 4.8 7 3.6c-.29 1.2-1.15 2.49-2.29 3.46S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    apple: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    notebook: '<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    move: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/>',
    grid: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
};
function Icon({ name, size = 18, color = "currentColor", style }) {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: style, dangerouslySetInnerHTML: { __html: ICON_PATHS[name] || "" } }));
}
// Aliassen zodat de bestaande JSX (<Plus/>, icon: Sprout, ...) blijft werken
const mk = (n) => (props) => React.createElement(Icon, { name: n, ...props });
const Plus = mk("plus"), X = mk("x"), Trash2 = mk("trash"), Sprout = mk("sprout"), Scissors = mk("scissors"), Droplets = mk("droplets"), Apple = mk("apple"), NotebookPen = mk("notebook"), Pencil = mk("pencil"), Move = mk("move"), Grid3x3 = mk("grid"), ChevronLeft = mk("chevronLeft"), Eye = mk("eye"), Bug = mk("bug"), Camera = mk("camera"), Search = mk("search"), Archive = mk("archive"), Info = mk("info");
// ── Persistente opslag ────────────────────────────────────────────────
// Primair: localStorage (blijft in de browser bewaard tussen sessies).
// Terugval: window.storage (binnen de Claude-omgeving).
const STORE_KEY = "moestuin:state:v1";
async function loadState() {
    var _a;
    // 1) localStorage
    try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch (_b) { }
    // 2) window.storage als die er is
    try {
        if (typeof window !== "undefined" && ((_a = window.storage) === null || _a === void 0 ? void 0 : _a.get)) {
            const r = await window.storage.get(STORE_KEY);
            if (r)
                return JSON.parse(r.value);
        }
    }
    catch (_c) { }
    return null;
}
async function saveState(state) {
    var _a;
    const json = JSON.stringify(state);
    let ok = false;
    try {
        localStorage.setItem(STORE_KEY, json);
        ok = true;
    }
    catch (e) {
        // localStorage kan vol zitten (bijv. veel foto's) — meld dat duidelijk
        console.error("localStorage opslaan mislukt", e);
    }
    try {
        if (typeof window !== "undefined" && ((_a = window.storage) === null || _a === void 0 ? void 0 : _a.set)) {
            await window.storage.set(STORE_KEY, json);
            ok = true;
        }
    }
    catch (e) {
        console.error("window.storage opslaan mislukt", e);
    }
    return ok;
}
// ── Helpers ───────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
// Foto comprimeren naar kleine JPEG-dataURL zodat het binnen de opslag past
function compressImage(file, maxDim = 800, quality = 0.62) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > height && width > maxDim) {
                    height = (height * maxDim) / width;
                    width = maxDim;
                }
                else if (height > maxDim) {
                    width = (width * maxDim) / height;
                    height = maxDim;
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
const LOG_TYPES = [
    { key: "zaai", label: "Zaaien", icon: Sprout, color: "#6b8e3d" },
    { key: "snoei", label: "Snoeien", icon: Scissors, color: "#b5832e" },
    { key: "mest", label: "Bemesten", icon: Droplets, color: "#7a6a4f" },
    { key: "vrucht", label: "Oogst", icon: Apple, color: "#a13d2d" },
    { key: "bevinding", label: "Bevinding", icon: Eye, color: "#4a6d7c" },
    { key: "ziekte", label: "Ziekte", icon: Bug, color: "#8a4b8c" },
];
// Veelvoorkomende moestuinziektes & plagen
const DISEASES = [
    "Bladluis", "Witte vlieg", "Spint", "Slakken", "Rups / koolwitje",
    "Meeldauw (echte)", "Valse meeldauw", "Phytophthora (aardappelziekte)",
    "Botrytis (grauwe schimmel)", "Roest", "Bladvlekkenziekte",
    "Wortelvlieg", "Aaltjes", "Voetrot", "Neusrot (tomaat)", "Anders…",
];
const BED_TINTS = ["#7cb342", "#26a69a", "#ef9a3d", "#ec6b5e", "#ab7df0", "#5c9ce0", "#e0577f", "#9ccc4f"];
const emptyState = { beds: [], crops: {}, archive: [] }; // crops keyed by bedId; archive = verwijderde groenten
// Klikbare vakken op de achtergrondfoto (in % van de afbeelding: x, y, breedte, hoogte).
const PHOTO_ZONES = [
    { name: "Aardbeibed 1", x: 12.5, y: 13, w: 7.5, h: 20 },
    { name: "Aardbeibed 2", x: 20.5, y: 13, w: 7.5, h: 20 },
    { name: "Kruidenbed", x: 13, y: 37, w: 23, h: 6.5 },
    { name: "Bed 1", x: 44, y: 12, w: 7, h: 28 },
    { name: "Bed 2", x: 51.5, y: 12, w: 6.5, h: 28 },
    { name: "Bed 3", x: 60, y: 12, w: 6.5, h: 28 },
    { name: "Bed 4", x: 67.5, y: 12, w: 6.5, h: 28 },
    { name: "Bed 5", x: 75, y: 12, w: 6.5, h: 28 },
    { name: "Bed 6", x: 82.5, y: 12, w: 7, h: 28 },
    { name: "Fruithaag", x: 90.5, y: 7, w: 8, h: 82 },
    { name: "Kas", x: 8, y: 45, w: 27, h: 26 },
    { name: "Verhoogde bak 1", x: 58, y: 46, w: 27, h: 12 },
    { name: "Verhoogde bak 2", x: 60, y: 63, w: 27, h: 15 },
];

// Indeling op basis van de achtergrondfoto: elk vak wordt een klikbare bak.
function buildPhotoGarden() {
    const beds = [];
    const crops = {};
    PHOTO_ZONES.forEach((z) => {
        const id = uid();
        beds.push({ id, name: z.name, photo: true, px: z.x, py: z.y, pw: z.w, ph: z.h });
        crops[id] = [];
    });
    return { beds, crops, archive: [] };
}

// Startindeling op basis van de luchtfoto van de tuin:
// rechtsboven 6 lange grondbedden, links daarvan een groter vak,
// linksonder de kas met daarboven (aansluitend, even breed) een druivenbak,
// rechtsonder twee verhoogde bakken.
function buildInitialGarden() {
    const beds = [];
    const crops = {};
    const add = (b) => { const id = uid(); beds.push({ id, ...b }); crops[id] = []; };
    const topY = 30, stripH = 220;
    // Groter vak links van de bedden
    const bigW = 150;
    add({ name: "Groot bed", x: 50, y: topY, w: bigW, h: stripH, tint: "#9ccc4f" });
    // 6 lange grondbedden naast elkaar, rechts van het grote vak
    const stripCount = 6;
    const stripW = 46, gap = 16;
    const stripStartX = 50 + bigW + 24;
    for (let i = 0; i < stripCount; i++) {
        add({
            name: `Bed ${i + 1}`,
            x: stripStartX + i * (stripW + gap),
            y: topY,
            w: stripW,
            h: stripH,
            tint: BED_TINTS[i % BED_TINTS.length],
        });
    }
    // Kas linksonder + druivenbak er direct boven (zelfde breedte)
    const kasX = 60, kasW = 150;
    const druifH = 60, druifY = 290, gapKas = 8;
    add({ name: "Druivenbak", x: kasX, y: druifY, w: kasW, h: druifH, tint: "#ab7df0" });
    add({ name: "Kas", x: kasX, y: druifY + druifH + gapKas, w: kasW, h: 170, tint: "#26a69a" });
    // Twee verhoogde houten bakken rechtsonder
    add({ name: "Verhoogde bak 1", x: 470, y: 300, w: 200, h: 80, tint: "#ef9a3d" });
    add({ name: "Verhoogde bak 2", x: 470, y: 400, w: 200, h: 80, tint: "#ec6b5e" });
    return { beds, crops, archive: [] };
}
// ── App ───────────────────────────────────────────────────────────────
function MoestuinApp() {
    const [state, setState] = useState(emptyState);
    const [loaded, setLoaded] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [editLayout, setEditLayout] = useState(false);
    const [query, setQuery] = useState("");
    const [archiveCropView, setArchiveCropView] = useState(null);
    const [saveError, setSaveError] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const forceUpdate = async () => {
        try {
            if ("serviceWorker" in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map((r) => r.unregister()));
            }
            if (window.caches) {
                const keys = await caches.keys();
                await Promise.all(keys.map((k) => caches.delete(k)));
            }
        } catch (e) { /* negeren */ }
        // herlaad zonder cache
        location.reload(true);
    };
    useEffect(() => {
        loadState().then((s) => {
            if (s) {
                const next = { archive: [], ...s };
                // Werk posities van foto-bakken bij naar de nieuwste coördinaten (op naam),
                // zonder de bakken of hun logboek te vervangen.
                if (next.beds && next.beds.some((b) => b.photo)) {
                    const byName = {};
                    PHOTO_ZONES.forEach((z) => { byName[z.name] = z; });
                    next.beds = next.beds.map((b) => {
                        if (b.photo && byName[b.name]) {
                            const z = byName[b.name];
                            return Object.assign({}, b, { px: z.x, py: z.y, pw: z.w, ph: z.h });
                        }
                        return b;
                    });
                }
                setState(next);
            }
            setLoaded(true);
        });
    }, []);
    const persist = useCallback((next) => {
        setState(next);
        saveState(next).then((ok) => setSaveError(!ok));
    }, []);
    // ── Bak-acties ──
    const addBed = () => {
        const n = state.beds.length;
        const bed = {
            id: uid(),
            name: `Bak ${n + 1}`,
            x: 24 + (n % 3) * 150,
            y: 24 + Math.floor(n / 3) * 130,
            w: 130,
            h: 110,
            tint: BED_TINTS[n % BED_TINTS.length],
        };
        persist({ ...state, beds: [...state.beds, bed], crops: { ...state.crops, [bed.id]: [] } });
    };
    const updateBed = (id, patch) => persist({ ...state, beds: state.beds.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
    const removeBed = (id) => {
        const bed = state.beds.find((b) => b.id === id);
        const toArchive = (state.crops[id] || []).map((c) => ({
            ...c, bedName: (bed === null || bed === void 0 ? void 0 : bed.name) || "Onbekende bak", removedAt: today(),
        }));
        const { [id]: _, ...rest } = state.crops;
        persist({
            ...state,
            beds: state.beds.filter((b) => b.id !== id),
            crops: rest,
            archive: [...toArchive, ...state.archive],
        });
        if (selectedBed === id)
            setSelectedBed(null);
    };
    // ── Groente-acties ──
    const cropsFor = (bedId) => state.crops[bedId] || [];
    const setCrops = (bedId, crops) => persist({ ...state, crops: { ...state.crops, [bedId]: crops } });
    // Groente uit bak halen -> naar archief (logboek blijft bewaard)
    const archiveCrop = (bedId, cropId) => {
        const bed = state.beds.find((b) => b.id === bedId);
        const crop = cropsFor(bedId).find((c) => c.id === cropId);
        if (!crop)
            return;
        const archived = { ...crop, bedName: (bed === null || bed === void 0 ? void 0 : bed.name) || "Onbekende bak", removedAt: today() };
        persist({
            ...state,
            crops: { ...state.crops, [bedId]: cropsFor(bedId).filter((c) => c.id !== cropId) },
            archive: [archived, ...state.archive],
        });
    };
    const deleteArchived = (cropId) => persist({ ...state, archive: state.archive.filter((c) => c.id !== cropId) });
    if (!loaded) {
        return (React.createElement("div", { style: S.loading },
            React.createElement(Sprout, { size: 28, color: "#6b8e3d" }),
            React.createElement("span", { style: { marginLeft: 10 } }, "Moestuin laden\u2026")));
    }
    const bed = state.beds.find((b) => b.id === selectedBed);
    // Zoeken: huidige groenten (in een bak) + gearchiveerde groenten
    const q = query.trim().toLowerCase();
    const currentMatches = q
        ? state.beds.flatMap((b) => (state.crops[b.id] || [])
            .filter((c) => c.name.toLowerCase().includes(q))
            .map((c) => ({ crop: c, bedId: b.id, bedName: b.name, active: true })))
        : [];
    const archiveMatches = q
        ? state.archive
            .filter((c) => c.name.toLowerCase().includes(q))
            .map((c) => ({ crop: c, bedName: c.bedName, active: false, removedAt: c.removedAt }))
        : [];
    return (React.createElement("div", { style: S.root },
        React.createElement("style", null, globalCss),
        React.createElement("header", { style: S.header, className: "app-header" },
            React.createElement("div", { style: S.brand },
                React.createElement("span", { style: S.brandMark }, "\u2726"),
                React.createElement("div", null,
                    React.createElement("div", { style: S.brandName }, "De Moestuin"),
                    React.createElement("div", { style: S.brandSub },
                        state.beds.length,
                        " bak",
                        state.beds.length === 1 ? "" : "ken",
                        " · v19 ",
                        React.createElement("button", { style: S.infoBtn, onClick: () => setShowInfo(true), "aria-label": "Over opslag" },
                            React.createElement(Info, { size: 14 }),
                            " opslag"),
                        React.createElement("button", { style: S.infoBtn, onClick: forceUpdate, "aria-label": "App bijwerken" },
                            React.createElement(Grid3x3, { size: 14 }),
                            " update")))),
            React.createElement("div", { style: S.headerActions, className: "app-header-actions" },
                !state.beds.some((b) => b.photo) && React.createElement("button", { style: { ...S.btnGhost, ...(editLayout ? S.btnGhostActive : {}) }, onClick: () => setEditLayout((v) => !v) },
                    editLayout ? React.createElement(Grid3x3, { size: 16 }) : React.createElement(Move, { size: 16 }),
                    React.createElement("span", { className: "btn-label" }, editLayout ? "Klaar met indelen" : "Indeling wijzigen")),
                !state.beds.some((b) => b.photo) && React.createElement("button", { style: S.btnPrimary, onClick: addBed },
                    React.createElement(Plus, { size: 16 }),
                    " ",
                    React.createElement("span", { className: "btn-label" }, "Bak toevoegen")))),
        saveError && (React.createElement("div", { style: S.saveWarn }, "\u26A0\uFE0F Opslaan lukt niet \u2014 de opslagruimte zit waarschijnlijk vol (vaak door veel foto's). Verwijder een paar foto's of gearchiveerde groenten om weer te kunnen opslaan.")),
        React.createElement("div", { style: S.searchWrap, className: "app-search" },
            React.createElement(Search, { size: 17, style: { color: "#9a8c66", flexShrink: 0 } }),
            React.createElement("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Zoek een groente\u2026", style: S.searchInput }),
            query && (React.createElement("button", { style: S.iconBtn, onClick: () => setQuery(""), "aria-label": "Wissen" },
                React.createElement(X, { size: 18 })))),
        React.createElement("main", { style: S.main, className: "app-main" }, q ? (React.createElement(SearchResults, { current: currentMatches, archived: archiveMatches, onOpenBed: (id) => { setQuery(""); setSelectedBed(id); }, onViewArchived: (crop) => setArchiveCropView(crop) })) : state.beds.length === 0 ? (React.createElement(EmptyGarden, { onAdd: addBed, onLoadTemplate: () => persist(buildInitialGarden()), onLoadPhoto: () => persist(buildPhotoGarden()) })) : state.beds.some((b) => b.photo) ? (React.createElement(ErrorBoundary, null, React.createElement(PhotoGarden, { beds: state.beds, onSelect: setSelectedBed, onReload: () => persist(buildPhotoGarden()) }))) : (React.createElement(GardenCanvas, { beds: state.beds, cropsFor: cropsFor, editLayout: editLayout, onSelect: setSelectedBed, onUpdateBed: updateBed }))),
        showInfo && React.createElement(InfoModal, { onClose: () => setShowInfo(false) }),
        archiveCropView && (React.createElement(ArchivedCropPanel, { item: archiveCropView, onClose: () => setArchiveCropView(null), onDelete: () => { deleteArchived(archiveCropView.id); setArchiveCropView(null); } })),
        bed && (React.createElement(BedPanel, { bed: bed, crops: cropsFor(bed.id), editLayout: editLayout, onClose: () => setSelectedBed(null), onSetCrops: (c) => setCrops(bed.id, c), onArchiveCrop: (cropId) => archiveCrop(bed.id, cropId), onRenameBed: (name) => updateBed(bed.id, { name }), onRemoveBed: () => removeBed(bed.id) }))));
}
// ── Leeg-staat ────────────────────────────────────────────────────────
// ── Info: hoe en waar je gegevens worden bewaard ──────────────────────
function InfoModal({ onClose }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: S.scrim, onClick: onClose }),
        React.createElement("div", { style: S.infoModal, className: "panel-in", role: "dialog", "aria-label": "Over je gegevens" },
            React.createElement("div", { style: S.infoHead },
                React.createElement("div", { style: S.infoTitle },
                    React.createElement(Info, { size: 18 }),
                    " Waar staan mijn gegevens?"),
                React.createElement("button", { style: S.iconBtn, onClick: onClose, "aria-label": "Sluiten" },
                    React.createElement(X, { size: 20 }))),
            React.createElement("div", { style: S.infoBody },
                React.createElement("p", { style: S.infoP },
                    "Alles wat je hier invult \u2014 je bakken, groenten, logboek en foto's \u2014 wordt",
                    React.createElement("strong", null, " alleen lokaal op dit apparaat opgeslagen"),
                    ", in de opslag van deze app. Er gaat niets naar een server of naar internet; je gegevens blijven van jou en verlaten je telefoon niet."),
                React.createElement("p", { style: S.infoP }, "Het opslaan gebeurt automatisch. Je hoeft niets te bewaren of op te slaan \u2014 sluit je de app en open je hem later opnieuw, dan staat je tuin er gewoon weer."),
                React.createElement("div", { style: S.infoNote },
                    React.createElement("strong", null, "Goed om te weten:"),
                    " dit staat los van je browsegeschiedenis \u2014 die wissen heeft g\u00E9\u00E9n effect op je tuin. De gegevens worden alleen verwijderd als je zelf de sitegegevens van deze app wist (bijvoorbeeld via \"cookies en sitegegevens wissen\" in je browserinstellingen), of in een priv\u00E9/incognitovenster werkt."),
                React.createElement("p", { style: S.infoP }, "Omdat de gegevens op dit apparaat staan, zie je je tuin alleen hier terug \u2014 niet automatisch op een ander apparaat.")),
            React.createElement("button", { style: { ...S.btnPrimary, width: "100%", justifyContent: "center", marginTop: 4 }, onClick: onClose }, "Begrepen"))));
}
function EmptyGarden({ onAdd, onLoadTemplate, onLoadPhoto }) {
    return (React.createElement("div", { style: S.empty },
        React.createElement("div", { style: S.emptyArt }, "\uD83C\uDF31"),
        React.createElement("h2", { style: S.emptyTitle }, "Je tuin is nog leeg"),
        React.createElement("p", { style: S.emptyText }, "Open je tuin als plattegrond met klikbare vakken, laad een schematische indeling, of begin met \u00E9\u00E9n lege bak."),
        React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } },
            React.createElement("button", { style: S.btnPrimary, onClick: onLoadPhoto },
                React.createElement(Grid3x3, { size: 16 }),
                " Mijn tuin (plattegrond)"),
            React.createElement("button", { style: S.btnGhost, onClick: onLoadTemplate },
                React.createElement(Grid3x3, { size: 16 }),
                " Schematische indeling"),
            React.createElement("button", { style: S.btnGhost, onClick: onAdd },
                React.createElement(Plus, { size: 16 }),
                " Lege bak"))));
}
// ── Error boundary: vangt crashes en toont de fout op het scherm ──────
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { err: null }; }
    static getDerivedStateFromError(err) { return { err: err }; }
    componentDidCatch(err, info) { /* opgevangen */ }
    render() {
        if (this.state.err) {
            return React.createElement("div", {
                style: { margin: 16, padding: 16, background: "#fbe6df", border: "2px solid #a13d2d",
                    borderRadius: 12, color: "#a13d2d", fontFamily: "system-ui, sans-serif", fontSize: 13, lineHeight: 1.5 },
            },
                React.createElement("strong", null, "Er ging iets mis bij het tekenen van de tuin:"),
                React.createElement("div", { style: { marginTop: 8, wordBreak: "break-word" } },
                    String(this.state.err && this.state.err.message || this.state.err)));
        }
        return this.props.children;
    }
}
// ── Foto-achtergrond met klikbare vakken ──────────────────────────────
function PhotoGarden({ beds, onSelect, onReload }) {
    const [hover, setHover] = useState(null);
    const [srcIdx, setSrcIdx] = useState(0);
    const candidates = ["garden-bg.jpeg", "garden-bg.jpg", "garden-bg.png", "garden-bg.JPEG", "garden-bg.JPG"];
    const photoBeds = beds.filter((b) => b.photo);
    const withCoords = photoBeds.filter((b) => b.pw != null);

    const zoneButton = (b) => React.createElement("button", {
        key: b.id,
        onClick: () => onSelect(b.id),
        onPointerEnter: () => setHover(b.id),
        onPointerLeave: () => setHover((h) => (h === b.id ? null : h)),
        title: b.name,
        "aria-label": b.name,
        style: {
            position: "absolute", border: "none", padding: 0, cursor: "pointer", borderRadius: 8,
            left: b.px + "%", top: b.py + "%", width: b.pw + "%", height: b.ph + "%",
            background: hover === b.id ? "rgba(255,255,255,.22)" : "transparent",
            boxShadow: hover === b.id ? "inset 0 0 0 3px rgba(255,255,255,.9)" : "inset 0 0 0 2px rgba(255,255,255,.45)",
            transition: "background .12s ease, box-shadow .12s ease",
        },
    });

    const img = React.createElement("img", {
        src: candidates[srcIdx],
        alt: "Plattegrond van de moestuin",
        style: { display: "block", width: "100%", height: "auto" },
        draggable: false,
        onError: () => setSrcIdx((i) => i + 1),
    });

    const overlay = React.createElement("div",
        { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } },
        withCoords.map(zoneButton)
    );

    const container = React.createElement("div",
        { style: { position: "relative", width: "100%", maxWidth: 760, margin: "0 auto",
            borderRadius: 16, overflow: "hidden", border: "1px solid #d8c9a0",
            boxShadow: "0 6px 20px rgba(60,45,20,.15)", backgroundColor: "#cdd6a3", fontSize: 0 } },
        img,
        overlay
    );

    const reloadBtn = withCoords.length === 0
        ? React.createElement("button",
            { style: Object.assign({}, S.btnPrimary, { margin: "0 auto 12px", display: "flex" }),
              onClick: () => onReload && onReload() },
            "Plattegrond opnieuw laden")
        : null;

    const hint = React.createElement("div", { style: S.photoHint },
        "Tik op een vak in de tuin om de groenten en het logboek te openen");

    return React.createElement("div", { style: S.photoWrap }, reloadBtn, container, hint);
}
// ── Tuin-canvas met pan/zoom + sleepbare bakken ───────────────────────
const WORLD_W = 760, WORLD_H = 560; // logische tuinafmetingen
function GardenCanvas({ beds, cropsFor, editLayout, onSelect, onUpdateBed }) {
    const [drag, setDrag] = useState(null);
    const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
    const viewRef = React.useRef(view);
    viewRef.current = view;
    const wrapRef = React.useRef(null);
    const pinch = React.useRef(null);
    // Begin: pas de tuin in beeld op basis van de viewport-breedte
    React.useEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const fit = () => {
            const w = el.clientWidth, h = el.clientHeight;
            const scale = Math.min(w / WORLD_W, h / WORLD_H, 1);
            setView({ scale, tx: (w - WORLD_W * scale) / 2, ty: 16 });
        };
        fit();
    }, []);
    const clampScale = (s) => Math.max(0.35, Math.min(2.5, s));
    const zoomBy = (factor, cx, cy) => {
        const el = wrapRef.current;
        const rect = el.getBoundingClientRect();
        const px = (cx !== null && cx !== void 0 ? cx : rect.width / 2);
        const py = (cy !== null && cy !== void 0 ? cy : rect.height / 2);
        setView((v) => {
            const scale = clampScale(v.scale * factor);
            const k = scale / v.scale;
            return { scale, tx: px - (px - v.tx) * k, ty: py - (py - v.ty) * k };
        });
    };
    // Bak verplaatsen / resizen (in wereld-coördinaten, gecorrigeerd voor schaal)
    const onBedDown = (e, bed) => {
        var _a, _b;
        if (!editLayout)
            return;
        e.preventDefault();
        e.stopPropagation();
        (_b = (_a = e.currentTarget).setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, e.pointerId);
        const s = viewRef.current.scale;
        setDrag({ mode: "move", id: bed.id, sx: e.clientX, sy: e.clientY, x0: bed.x, y0: bed.y, scale: s });
    };
    const onResizeDown = (e, bed) => {
        var _a, _b;
        if (!editLayout)
            return;
        e.preventDefault();
        e.stopPropagation();
        (_b = (_a = e.currentTarget).setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, e.pointerId);
        const s = viewRef.current.scale;
        setDrag({ mode: "resize", id: bed.id, sx: e.clientX, sy: e.clientY, w0: bed.w, h0: bed.h, scale: s });
    };
    // Pannen op lege ruimte (altijd toegestaan)
    const onCanvasDown = (e) => {
        var _a, _b;
        if (e.target.closest("[data-bed]"))
            return;
        if (e.pointerType === "touch" && pinch.current)
            return;
        (_b = (_a = e.currentTarget).setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, e.pointerId);
        setDrag({ mode: "pan", sx: e.clientX, sy: e.clientY, tx0: view.tx, ty0: view.ty });
    };
    const onMove = (e) => {
        var _a;
        // pinch-zoom
        if (pinch.current && ((_a = e.touches) === null || _a === void 0 ? void 0 : _a.length) === 2)
            return;
        if (!drag)
            return;
        const dxScreen = e.clientX - drag.sx, dyScreen = e.clientY - drag.sy;
        if (drag.mode === "pan") {
            setView((v) => ({ ...v, tx: drag.tx0 + dxScreen, ty: drag.ty0 + dyScreen }));
        }
        else if (drag.mode === "move") {
            const x = Math.max(0, Math.min(WORLD_W - 40, drag.x0 + dxScreen / drag.scale));
            const y = Math.max(0, Math.min(WORLD_H - 40, drag.y0 + dyScreen / drag.scale));
            onUpdateBed(drag.id, { x, y });
        }
        else {
            const w = Math.max(70, drag.w0 + dxScreen / drag.scale);
            const h = Math.max(60, drag.h0 + dyScreen / drag.scale);
            onUpdateBed(drag.id, { w, h });
        }
    };
    const onUp = () => setDrag(null);
    // Touch pinch-zoom
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const onTouchStart = (e) => {
        if (e.touches.length === 2) {
            setDrag(null);
            pinch.current = { d: dist(e.touches) };
        }
    };
    const onTouchMove = (e) => {
        if (e.touches.length === 2 && pinch.current) {
            e.preventDefault();
            const rect = wrapRef.current.getBoundingClientRect();
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
            const d = dist(e.touches);
            zoomBy(d / pinch.current.d, cx, cy);
            pinch.current.d = d;
        }
    };
    const onTouchEnd = (e) => { if (e.touches.length < 2)
        pinch.current = null; };
    const onWheel = (e) => {
        if (!e.ctrlKey && !e.metaKey)
            return; // alleen met ctrl/cmd zoomen, anders normaal scrollen
        e.preventDefault();
        const rect = wrapRef.current.getBoundingClientRect();
        zoomBy(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - rect.left, e.clientY - rect.top);
    };
    return (React.createElement("div", { style: S.canvasOuter },
        React.createElement("div", { ref: wrapRef, "data-canvas": true, style: { ...S.viewport, cursor: (drag === null || drag === void 0 ? void 0 : drag.mode) === "pan" ? "grabbing" : "default" }, onPointerDown: onCanvasDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp, onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onWheel: onWheel },
            React.createElement("div", { style: { ...S.world, width: WORLD_W, height: WORLD_H,
                    transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})` } }, beds.map((bed) => {
                const crops = cropsFor(bed.id);
                return (React.createElement("div", { key: bed.id, "data-bed": true, onPointerDown: (e) => onBedDown(e, bed), onClick: () => !editLayout && !drag && onSelect(bed.id), className: "bed-tile", style: {
                        ...S.bed, left: bed.x, top: bed.y, width: bed.w, height: bed.h,
                        background: `linear-gradient(160deg, ${shade(bed.tint, 14)}, ${shade(bed.tint, -10)})`,
                        cursor: editLayout ? "grab" : "pointer",
                        boxShadow: (drag === null || drag === void 0 ? void 0 : drag.id) === bed.id ? "0 14px 32px rgba(40,30,15,.35)" : S.bed.boxShadow,
                    } },
                    React.createElement("div", { style: S.soilTexture }),
                    React.createElement("div", { style: S.bedName }, bed.name),
                    React.createElement("div", { style: S.bedCrops },
                        crops.length === 0 ? (React.createElement("span", { style: S.bedEmpty }, "leeg")) : (crops.slice(0, 4).map((c) => React.createElement("span", { key: c.id, style: S.cropChip }, c.name))),
                        crops.length > 4 && React.createElement("span", { style: S.cropChip },
                            "+",
                            crops.length - 4)),
                    editLayout && React.createElement("div", { style: S.moveBadge },
                        React.createElement(Move, { size: 13 })),
                    editLayout && (React.createElement("div", { style: S.resizeHandle, onPointerDown: (e) => onResizeDown(e, bed), onClick: (e) => e.stopPropagation(), "aria-label": "Formaat aanpassen" }))));
            }))),
        React.createElement("div", { style: S.zoomBar },
            React.createElement("button", { style: S.zoomBtn, onClick: () => zoomBy(1.2), "aria-label": "Inzoomen" }, "+"),
            React.createElement("button", { style: S.zoomBtn, onClick: () => zoomBy(0.83), "aria-label": "Uitzoomen" }, "\u2212"),
            React.createElement("button", { style: S.zoomReset, onClick: () => {
                    const el = wrapRef.current;
                    const w = el.clientWidth, h = el.clientHeight;
                    const scale = Math.min(w / WORLD_W, h / WORLD_H, 1);
                    setView({ scale, tx: (w - WORLD_W * scale) / 2, ty: 16 });
                }, "aria-label": "Passend" }, "\u2922")),
        React.createElement("div", { style: S.canvasHint }, editLayout
            ? "Sleep bakken om te verplaatsen · hoek rechtsonder voor formaat · sleep de achtergrond om te pannen"
            : "Tik op een bak · sleep de achtergrond om te bewegen · knijp of gebruik +/− om te zoomen")));
}
// ── Detail-paneel van een bak ─────────────────────────────────────────
function BedPanel({ bed, crops, editLayout, onClose, onSetCrops, onArchiveCrop, onRenameBed, onRemoveBed }) {
    const [newCrop, setNewCrop] = useState("");
    const [openCrop, setOpenCrop] = useState(null);
    const [editName, setEditName] = useState(false);
    const [nameDraft, setNameDraft] = useState(bed.name);
    const [confirmDelBed, setConfirmDelBed] = useState(false);
    useEffect(() => { setNameDraft(bed.name); }, [bed.name]);
    const addCrop = () => {
        const name = newCrop.trim();
        if (!name)
            return;
        const crop = { id: uid(), name, logs: [] };
        onSetCrops([...crops, crop]);
        setNewCrop("");
        setOpenCrop(crop.id);
    };
    const updateCrop = (id, patch) => onSetCrops(crops.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const removeCrop = (id) => {
        onArchiveCrop(id);
        if (openCrop === id)
            setOpenCrop(null);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: S.scrim, onClick: onClose }),
        React.createElement("aside", { style: S.panel, className: "panel-in" },
            React.createElement("div", { style: S.panelHead },
                React.createElement("button", { style: S.iconBtn, onClick: onClose, "aria-label": "Sluiten" },
                    React.createElement(ChevronLeft, { size: 20 })),
                editName ? (React.createElement("input", { autoFocus: true, value: nameDraft, onChange: (e) => setNameDraft(e.target.value), onBlur: () => { onRenameBed(nameDraft.trim() || bed.name); setEditName(false); }, onKeyDown: (e) => e.key === "Enter" && e.currentTarget.blur(), style: S.nameInput })) : (React.createElement("button", { style: S.panelTitle, onClick: () => setEditName(true) },
                    bed.name,
                    " ",
                    React.createElement(Pencil, { size: 14, style: { opacity: 0.5 } }))),
                React.createElement("button", { style: S.iconBtn, onClick: onClose, "aria-label": "Sluiten" },
                    React.createElement(X, { size: 20 }))),
            React.createElement("div", { style: S.panelBody },
                React.createElement("div", { style: S.addRow },
                    React.createElement("input", { value: newCrop, onChange: (e) => setNewCrop(e.target.value), onKeyDown: (e) => e.key === "Enter" && addCrop(), placeholder: "Groente toevoegen, bijv. Tomaat", style: S.input }),
                    React.createElement("button", { style: S.btnPrimary, onClick: addCrop },
                        React.createElement(Plus, { size: 16 }))),
                crops.length === 0 ? (React.createElement("p", { style: S.panelEmpty }, "Nog geen groenten in deze bak. Voeg er hierboven een toe.")) : (crops.map((crop) => (React.createElement(CropCard, { key: crop.id, crop: crop, open: openCrop === crop.id, onToggle: () => setOpenCrop(openCrop === crop.id ? null : crop.id), onUpdate: (patch) => updateCrop(crop.id, patch), onRemove: () => removeCrop(crop.id) })))),
                React.createElement("div", { style: S.dangerZone }, confirmDelBed ? (React.createElement("div", { style: S.confirmRow },
                    React.createElement("span", { style: S.confirmText },
                        "\"",
                        bed.name,
                        "\" verwijderen? Groenten gaan naar het archief."),
                    React.createElement("div", { style: S.confirmBtns },
                        React.createElement("button", { style: S.btnGhostSmall, onClick: () => setConfirmDelBed(false) }, "Annuleren"),
                        React.createElement("button", { style: { ...S.btnConfirm, background: "#a13d2d" }, onClick: () => { setConfirmDelBed(false); onRemoveBed(); } },
                            React.createElement(Trash2, { size: 13 }),
                            " Verwijderen")))) : (React.createElement("button", { style: S.btnDanger, onClick: () => setConfirmDelBed(true) },
                    React.createElement(Trash2, { size: 15 }),
                    " Deze bak verwijderen")))))));
}
// ── Groente-kaart met logboek + notities ──────────────────────────────
function CropCard({ crop, open, onToggle, onUpdate, onRemove }) {
    const [logType, setLogType] = useState("zaai");
    const [logDate, setLogDate] = useState(today());
    const [logNote, setLogNote] = useState("");
    const [logPhotos, setLogPhotos] = useState([]);
    const [disease, setDisease] = useState(DISEASES[0]);
    const [diseaseOther, setDiseaseOther] = useState("");
    const [busy, setBusy] = useState(false);
    const [viewPhoto, setViewPhoto] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const onPickPhotos = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length)
            return;
        setBusy(true);
        try {
            const imgs = await Promise.all(files.map((f) => compressImage(f)));
            setLogPhotos((p) => [...p, ...imgs]);
        }
        catch (_a) {
            alert("Foto kon niet worden verwerkt.");
        }
        finally {
            setBusy(false);
            e.target.value = "";
        }
    };
    const addLog = () => {
        const entry = {
            id: uid(), type: logType, date: logDate, note: logNote.trim(), photos: logPhotos,
        };
        if (logType === "ziekte") {
            entry.disease = disease === "Anders…" ? (diseaseOther.trim() || "Onbekend") : disease;
        }
        onUpdate({ logs: [...crop.logs, entry].sort((a, b) => a.date.localeCompare(b.date)) });
        setLogNote("");
        setLogPhotos([]);
        setDiseaseOther("");
    };
    const removeLog = (id) => onUpdate({ logs: crop.logs.filter((l) => l.id !== id) });
    const lastByType = (k) => {
        const items = crop.logs.filter((l) => l.type === k);
        return items.length ? items[items.length - 1].date : null;
    };
    return (React.createElement("div", { style: S.cropCard },
        React.createElement("button", { style: S.cropHead, onClick: onToggle },
            React.createElement("div", { style: S.cropHeadLeft },
                React.createElement(Sprout, { size: 17, color: "#6b8e3d" }),
                React.createElement("span", { style: S.cropName }, crop.name)),
            React.createElement("div", { style: S.cropMeta }, LOG_TYPES.map(({ key, icon: Icon, color }) => {
                const d = lastByType(key);
                return d ? (React.createElement("span", { key: key, style: { ...S.miniStat, color } },
                    React.createElement(Icon, { size: 12 }),
                    " ",
                    fmtShort(d))) : null;
            }))),
        open && (React.createElement("div", { style: S.cropDetail },
            React.createElement("div", { style: S.sectionLabel }, "Logboek"),
            crop.logs.length === 0 && React.createElement("p", { style: S.tinyEmpty }, "Nog geen gebeurtenissen."),
            React.createElement("div", { style: S.timeline }, crop.logs.map((l) => {
                const t = LOG_TYPES.find((x) => x.key === l.type);
                const Icon = t.icon;
                return (React.createElement("div", { key: l.id, style: S.logRow },
                    React.createElement("span", { style: { ...S.logDot, background: t.color } },
                        React.createElement(Icon, { size: 12, color: "#fff" })),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: S.logTop },
                            React.createElement("strong", { style: { color: t.color } },
                                t.label,
                                l.type === "ziekte" && l.disease ? `: ${l.disease}` : ""),
                            React.createElement("span", { style: S.logDate }, fmtLong(l.date))),
                        l.note && React.createElement("div", { style: S.logNote }, l.note),
                        l.photos && l.photos.length > 0 && (React.createElement("div", { style: S.photoStrip }, l.photos.map((src, i) => (React.createElement("img", { key: i, src: src, alt: "", style: S.photoThumb, onClick: () => setViewPhoto(src) })))))),
                    React.createElement("button", { style: S.logDel, onClick: () => removeLog(l.id), "aria-label": "Verwijderen" },
                        React.createElement(X, { size: 14 }))));
            })),
            React.createElement("div", { style: S.logForm },
                React.createElement("div", { style: S.typeRow }, LOG_TYPES.map(({ key, label, icon: Icon, color }) => (React.createElement("button", { key: key, onClick: () => setLogType(key), style: {
                        ...S.typeBtn,
                        ...(logType === key ? { background: color, color: "#fff", borderColor: color } : {}),
                    } },
                    React.createElement(Icon, { size: 14 }),
                    " ",
                    label)))),
                logType === "ziekte" && (React.createElement("div", { style: S.diseaseRow },
                    React.createElement("select", { value: disease, onChange: (e) => setDisease(e.target.value), style: S.select }, DISEASES.map((d) => React.createElement("option", { key: d, value: d }, d))),
                    disease === "Anders…" && (React.createElement("input", { value: diseaseOther, onChange: (e) => setDiseaseOther(e.target.value), placeholder: "Welke ziekte of plaag?", style: S.input })))),
                React.createElement("div", { style: S.logFormBottom },
                    React.createElement("input", { type: "date", value: logDate, onChange: (e) => setLogDate(e.target.value), style: S.dateInput }),
                    React.createElement("button", { style: S.btnPrimary, onClick: addLog },
                        React.createElement(Plus, { size: 16 }),
                        " Toevoegen")),
                React.createElement("textarea", { value: logNote, onChange: (e) => setLogNote(e.target.value), onKeyDown: (e) => (e.key === "Enter" && (e.metaKey || e.ctrlKey)) && addLog(), placeholder: "Notitie of bevinding\u2026", style: S.logTextarea, rows: 3 }),
                logPhotos.length > 0 && (React.createElement("div", { style: S.photoStrip }, logPhotos.map((src, i) => (React.createElement("div", { key: i, style: S.previewWrap },
                    React.createElement("img", { src: src, alt: "", style: S.photoThumb }),
                    React.createElement("button", { style: S.photoRemove, onClick: () => setLogPhotos((p) => p.filter((_, j) => j !== i)) },
                        React.createElement(X, { size: 11 }))))))),
                React.createElement("label", { style: S.photoBtn },
                    React.createElement(Camera, { size: 15 }),
                    " ",
                    busy ? "Bezig…" : "Foto toevoegen",
                    React.createElement("input", { type: "file", accept: "image/*", multiple: true, onChange: onPickPhotos, style: { display: "none" }, disabled: busy }))),
            confirmRemove ? (React.createElement("div", { style: S.confirmRow },
                React.createElement("span", { style: S.confirmText }, "Uit bak halen? Logboek blijft bewaard in archief."),
                React.createElement("div", { style: S.confirmBtns },
                    React.createElement("button", { style: S.btnGhostSmall, onClick: () => setConfirmRemove(false) }, "Annuleren"),
                    React.createElement("button", { style: S.btnConfirm, onClick: () => { setConfirmRemove(false); onRemove(); } },
                        React.createElement(Archive, { size: 13 }),
                        " Uit bak halen")))) : (React.createElement("button", { style: S.btnDangerSmall, onClick: () => setConfirmRemove(true) },
                React.createElement(Archive, { size: 13 }),
                " Uit bak halen (logboek bewaren)")),
            viewPhoto && (React.createElement("div", { style: S.lightbox, onClick: () => setViewPhoto(null) },
                React.createElement("img", { src: viewPhoto, alt: "", style: S.lightboxImg })))))));
}
// ── Zoekresultaten ────────────────────────────────────────────────────
function SearchResults({ current, archived, onOpenBed, onViewArchived }) {
    const total = current.length + archived.length;
    if (total === 0) {
        return (React.createElement("div", { style: S.searchEmpty },
            React.createElement(Search, { size: 32, color: "#bcae88" }),
            React.createElement("p", { style: { margin: "12px 0 0", color: "#8a7d5c" } }, "Geen groente gevonden \u2014 niet in een bak en niet in het archief.")));
    }
    return (React.createElement("div", { style: S.results },
        current.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: S.resultsHead },
                React.createElement(Sprout, { size: 15, color: "#6b8e3d" }),
                " Nu in de tuin"),
            current.map(({ crop, bedId, bedName }) => (React.createElement("button", { key: crop.id, style: S.resultCard, onClick: () => onOpenBed(bedId) },
                React.createElement("div", { style: S.resultMain },
                    React.createElement("span", { style: S.resultName }, crop.name),
                    React.createElement("span", { style: S.resultBed }, bedName)),
                React.createElement("span", { style: S.resultMeta },
                    crop.logs.length,
                    " logboek-item",
                    crop.logs.length === 1 ? "" : "s")))))),
        archived.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { ...S.resultsHead, marginTop: current.length ? 22 : 0 } },
                React.createElement(Archive, { size: 15, color: "#9a7b3d" }),
                " Eerder geteeld (archief)"),
            archived.map(({ crop, bedName, removedAt }) => (React.createElement("button", { key: crop.id, style: { ...S.resultCard, ...S.resultCardArchived }, onClick: () => onViewArchived(crop) },
                React.createElement("div", { style: S.resultMain },
                    React.createElement("span", { style: S.resultName }, crop.name),
                    React.createElement("span", { style: S.resultBed },
                        "was in ",
                        bedName)),
                React.createElement("span", { style: S.resultMeta },
                    crop.logs.length,
                    " item",
                    crop.logs.length === 1 ? "" : "s",
                    " \u00B7 gestopt ",
                    fmtShort(removedAt)))))))));
}
// ── Archief-paneel (alleen-lezen logboek van een verwijderde groente) ──
function ArchivedCropPanel({ item, onClose, onDelete }) {
    const [viewPhoto, setViewPhoto] = useState(null);
    const [confirmDel, setConfirmDel] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: S.scrim, onClick: onClose }),
        React.createElement("aside", { style: S.panel, className: "panel-in" },
            React.createElement("div", { style: S.panelHead },
                React.createElement("button", { style: S.iconBtn, onClick: onClose, "aria-label": "Sluiten" },
                    React.createElement(ChevronLeft, { size: 20 })),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: S.panelTitle }, item.name),
                    React.createElement("div", { style: S.archivedSub },
                        React.createElement(Archive, { size: 12 }),
                        " was in ",
                        item.bedName,
                        " \u00B7 gestopt ",
                        fmtLong(item.removedAt))),
                React.createElement("button", { style: S.iconBtn, onClick: onClose, "aria-label": "Sluiten" },
                    React.createElement(X, { size: 20 }))),
            React.createElement("div", { style: S.panelBody },
                React.createElement("div", { style: S.archivedBanner }, "Deze groente staat niet meer in een bak. Het logboek is bewaard en alleen-lezen."),
                React.createElement("div", { style: S.sectionLabel }, "Logboek"),
                React.createElement(LogTimeline, { logs: item.logs, onPhoto: setViewPhoto }),
                React.createElement("div", { style: S.dangerZone }, confirmDel ? (React.createElement("div", { style: S.confirmRow },
                    React.createElement("span", { style: S.confirmText },
                        "Logboek van \"",
                        item.name,
                        "\" definitief verwijderen? Dit kan niet ongedaan worden."),
                    React.createElement("div", { style: S.confirmBtns },
                        React.createElement("button", { style: S.btnGhostSmall, onClick: () => setConfirmDel(false) }, "Annuleren"),
                        React.createElement("button", { style: { ...S.btnConfirm, background: "#a13d2d" }, onClick: onDelete },
                            React.createElement(Trash2, { size: 13 }),
                            " Definitief verwijderen")))) : (React.createElement("button", { style: S.btnDanger, onClick: () => setConfirmDel(true) },
                    React.createElement(Trash2, { size: 15 }),
                    " Definitief verwijderen uit archief")))),
            viewPhoto && (React.createElement("div", { style: S.lightbox, onClick: () => setViewPhoto(null) },
                React.createElement("img", { src: viewPhoto, alt: "", style: S.lightboxImg }))))));
}
// ── Herbruikbare alleen-lezen tijdlijn ────────────────────────────────
function LogTimeline({ logs, onPhoto }) {
    if (!logs || logs.length === 0)
        return React.createElement("p", { style: S.tinyEmpty }, "Geen logboek-items.");
    return (React.createElement("div", { style: S.timeline }, logs.map((l) => {
        const t = LOG_TYPES.find((x) => x.key === l.type) || LOG_TYPES[0];
        const Icon = t.icon;
        return (React.createElement("div", { key: l.id, style: S.logRow },
            React.createElement("span", { style: { ...S.logDot, background: t.color } },
                React.createElement(Icon, { size: 12, color: "#fff" })),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: S.logTop },
                    React.createElement("strong", { style: { color: t.color } },
                        t.label,
                        l.type === "ziekte" && l.disease ? `: ${l.disease}` : ""),
                    React.createElement("span", { style: S.logDate }, fmtLong(l.date))),
                l.note && React.createElement("div", { style: S.logNote }, l.note),
                l.photos && l.photos.length > 0 && (React.createElement("div", { style: S.photoStrip }, l.photos.map((src, i) => (React.createElement("img", { key: i, src: src, alt: "", style: S.photoThumb, onClick: () => onPhoto(src) }))))))));
    })));
}
// ── Datum-format & kleur ──────────────────────────────────────────────
const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function fmtShort(d) { const [y, m, day] = d.split("-"); return `${+day} ${MONTHS[+m - 1]}`; }
function fmtLong(d) { const [y, m, day] = d.split("-"); return `${+day} ${MONTHS[+m - 1]} ${y}`; }
function shade(hex, p) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + p));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + p));
    const b = Math.max(0, Math.min(255, (n & 255) + p));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
// ── Stijl ─────────────────────────────────────────────────────────────
const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const INK = "#34301f";
const PAPER = "#f3eddd";
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Inter:wght@400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  .bed-tile { transition: transform .12s ease, box-shadow .15s ease; }
  .bed-tile:hover { transform: translateY(-2px); }
  .panel-in { animation: slideIn .26s cubic-bezier(.2,.8,.2,1); }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  input:focus, textarea:focus { outline: 2px solid #6b8e3d; outline-offset: 1px; }
  ::-webkit-scrollbar { width: 9px; }
  ::-webkit-scrollbar-thumb { background: #c4b896; border-radius: 9px; }
  @media (prefers-reduced-motion: reduce) { .panel-in, .bed-tile { animation: none; transition: none; } }
  @media (hover: none) { .bed-tile:hover { transform: none; } }
  @media (max-width: 600px) {
    .app-header { padding: 14px 16px !important; gap: 10px !important; }
    .app-header-actions { width: 100%; }
    .app-header-actions button { flex: 1; justify-content: center; }
    .app-search { margin: 12px 16px 0 !important; }
    .app-main { padding: 14px 16px !important; }
  }
  @media (max-width: 380px) {
    .btn-label { display: none; }
  }
`;
const S = {
    root: { minHeight: "100vh", background: PAPER, color: INK, fontFamily: FONT_BODY,
        backgroundImage: "radial-gradient(circle at 20% 0%, #ece3cc 0%, transparent 55%), radial-gradient(circle at 90% 100%, #e6dcc0 0%, transparent 50%)" },
    loading: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT_BODY, color: INK, background: PAPER, fontSize: 16 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
        padding: "18px 24px", borderBottom: "1px solid #ddd0ad", flexWrap: "wrap" },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: { width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12,
        background: "#6b8e3d", color: "#f3eddd", fontSize: 20 },
    brandName: { fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: "-.01em" },
    brandSub: { fontSize: 12.5, color: "#8a7d5c", marginTop: 3, display: "flex", alignItems: "center", gap: 8 },
    infoBtn: { display: "inline-flex", alignItems: "center", gap: 3, background: "transparent",
        border: "none", color: "#8a7d5c", cursor: "pointer", fontSize: 12, fontFamily: FONT_BODY,
        padding: "1px 4px", borderRadius: 6, textDecoration: "underline", textUnderlineOffset: 2 },
    infoModal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "min(440px, calc(100vw - 32px))", maxHeight: "calc(100vh - 64px)", overflowY: "auto",
        background: PAPER, borderRadius: 16, zIndex: 70, padding: 20,
        boxShadow: "0 20px 60px rgba(40,32,14,.35)", border: "1px solid #d8c9a0" },
    infoHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    infoTitle: { display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_DISPLAY, fontWeight: 900,
        fontSize: 19, color: INK },
    infoBody: { marginBottom: 8 },
    infoP: { fontSize: 14, color: "#5d5238", lineHeight: 1.55, margin: "10px 0" },
    infoNote: { fontSize: 13.5, color: "#6b5f42", lineHeight: 1.55, background: "#f0ead6",
        border: "1px solid #e2d6b6", borderRadius: 10, padding: "11px 13px", margin: "12px 0" },
    headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },
    main: { padding: 24 },
    saveWarn: { margin: "12px 24px 0", padding: "11px 14px", background: "#fbe6df",
        border: "1px solid #e8b6a8", borderRadius: 10, fontSize: 13, color: "#a13d2d", lineHeight: 1.5 },
    searchWrap: { display: "flex", alignItems: "center", gap: 10, margin: "16px 24px 0",
        padding: "10px 14px", background: "#fffdf6", border: "1px solid #d8c9a0", borderRadius: 12,
        boxShadow: "0 2px 8px rgba(60,45,20,.06)" },
    searchInput: { flex: 1, border: "none", background: "transparent", fontSize: 15, color: INK,
        fontFamily: FONT_BODY, minWidth: 0 },
    searchEmpty: { textAlign: "center", padding: "10vh 0", fontFamily: FONT_BODY },
    results: { maxWidth: 640, margin: "0 auto" },
    resultsHead: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: ".06em", color: "#8a7d5c", marginBottom: 10 },
    resultCard: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 12, padding: "13px 16px", marginBottom: 8, background: "#fffdf6", border: "1px solid #ddd0ad",
        borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: FONT_BODY },
    resultCardArchived: { background: "#f5f0e2", borderStyle: "dashed" },
    resultMain: { display: "flex", flexDirection: "column", gap: 2 },
    resultName: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17, color: INK },
    resultBed: { fontSize: 12.5, color: "#8a7d5c" },
    resultMeta: { fontSize: 12, color: "#9a8c66", flexShrink: 0, textAlign: "right" },
    archivedSub: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#9a7b3d", marginTop: 3 },
    archivedBanner: { background: "#f0ead6", border: "1px solid #e2d6b6", borderRadius: 10,
        padding: "10px 13px", fontSize: 13, color: "#7d6f4a", lineHeight: 1.5, marginBottom: 16 },
    canvasOuter: { position: "relative", width: "100%", height: "calc(100vh - 200px)", minHeight: 340,
        borderRadius: 18, border: "1px solid #d8c9a0", overflow: "hidden", touchAction: "none",
        backgroundColor: "#ece3c9",
        background: "repeating-linear-gradient(0deg,#e9dfc4,#e9dfc4 1px,#ece3c9 1px,#ece3c9 26px), repeating-linear-gradient(90deg,#e9dfc4,#e9dfc4 1px,transparent 1px,transparent 26px)" },
    viewport: { position: "absolute", inset: 0, overflow: "hidden", touchAction: "none" },
    world: { position: "absolute", top: 0, left: 0, transformOrigin: "0 0" },
    photoWrap: { position: "relative", width: "100%" },
    diagBar: { background: "#fff8e6", border: "1px solid #e2d6b6", borderRadius: 10,
        padding: "10px 12px", fontSize: 12, color: "#6b5f42", lineHeight: 1.4, marginBottom: 12,
        fontFamily: FONT_BODY, wordBreak: "break-word" },
    photoInner: { position: "relative", width: "100%", maxWidth: 760, margin: "0 auto",
        borderRadius: 16, overflow: "hidden", border: "1px solid #d8c9a0", boxShadow: "0 6px 20px rgba(60,45,20,.15)",
        backgroundColor: "#cdd6a3" },
    photoSpacer: { display: "block", width: "100%", paddingTop: "100%" },
    photoImg: { position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", objectFit: "cover", userSelect: "none" },
    photoFallback: { display: "block", width: "100%", paddingTop: "100%" },
    photoLayer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
    photoErr: { position: "absolute", top: 10, left: 10, right: 10, zIndex: 5, padding: "10px 12px",
        background: "rgba(251,230,223,.96)", border: "1px solid #e8b6a8", borderRadius: 10,
        fontSize: 12.5, color: "#a13d2d", lineHeight: 1.45, fontFamily: FONT_BODY },
    photoZone: { position: "absolute", border: "none", padding: 0, cursor: "pointer",
        borderRadius: 8, transition: "background .12s ease, box-shadow .12s ease",
        display: "flex", alignItems: "flex-start", justifyContent: "center" },
    photoZoneLabel: { marginTop: 4, fontSize: 11, fontWeight: 700, color: "#2c2410",
        background: "rgba(255,255,255,.9)", padding: "2px 7px", borderRadius: 20,
        whiteSpace: "nowrap", transition: "opacity .12s ease", fontFamily: FONT_BODY, pointerEvents: "none", lineHeight: 1.3 },
    photoHint: { textAlign: "center", fontSize: 12.5, color: "#9a8c66", fontStyle: "italic",
        fontFamily: FONT_DISPLAY, margin: "12px auto 0", maxWidth: 760 },
    canvasHint: { position: "absolute", bottom: 12, left: 14, right: 14, fontSize: 11.5, color: "#9a8c66",
        fontStyle: "italic", pointerEvents: "none", fontFamily: FONT_DISPLAY, lineHeight: 1.4 },
    zoomBar: { position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6 },
    zoomBtn: { width: 38, height: 38, borderRadius: 10, border: "1px solid #d8c9a0", background: "#fffdf6",
        color: "#5d5238", fontSize: 22, fontWeight: 600, cursor: "pointer", display: "grid", placeItems: "center",
        boxShadow: "0 2px 6px rgba(60,45,20,.12)", fontFamily: FONT_BODY, lineHeight: 1, padding: 0 },
    zoomReset: { width: 38, height: 38, borderRadius: 10, border: "1px solid #d8c9a0", background: "#fffdf6",
        color: "#5d5238", fontSize: 17, cursor: "pointer", display: "grid", placeItems: "center",
        boxShadow: "0 2px 6px rgba(60,45,20,.12)", fontFamily: FONT_BODY, padding: 0 },
    bed: { position: "absolute", borderRadius: 14, border: "2px solid rgba(255,255,255,.35)",
        boxShadow: "0 6px 16px rgba(40,60,30,.22)", padding: "12px 12px 10px", overflow: "hidden",
        display: "flex", flexDirection: "column", userSelect: "none" },
    soilTexture: { position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(0,0,0,.5) 1px, transparent 1.4px)", backgroundSize: "7px 7px" },
    bedName: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15, color: "#fff",
        textShadow: "0 1px 3px rgba(0,0,0,.35)", position: "relative", zIndex: 1 },
    bedCrops: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, position: "relative", zIndex: 1, alignContent: "flex-start" },
    bedEmpty: { fontSize: 12, color: "rgba(255,255,255,.8)", fontStyle: "italic" },
    cropChip: { fontSize: 11, background: "rgba(255,255,255,.92)", color: "#3a3015",
        padding: "2px 7px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap" },
    moveBadge: { position: "absolute", top: 8, right: 8, color: "rgba(255,255,255,.7)", zIndex: 1 },
    resizeHandle: { position: "absolute", right: 0, bottom: 0, width: 22, height: 22, zIndex: 2,
        cursor: "nwse-resize", touchAction: "none",
        background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,.7) 50%)",
        borderBottomRightRadius: 12 },
    empty: { maxWidth: 460, margin: "8vh auto", textAlign: "center" },
    emptyArt: { fontSize: 60, marginBottom: 8 },
    emptyTitle: { fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 28, margin: "0 0 8px" },
    emptyText: { color: "#7d7053", lineHeight: 1.6, margin: "0 0 22px" },
    // Buttons
    btnPrimary: { display: "inline-flex", alignItems: "center", gap: 6, background: "#6b8e3d",
        color: "#f5f1e3", border: "none", padding: "9px 14px", borderRadius: 10, fontWeight: 600,
        fontSize: 13.5, cursor: "pointer", fontFamily: FONT_BODY },
    btnGhost: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
        color: "#5d5238", border: "1px solid #c9ba93", padding: "9px 14px", borderRadius: 10,
        fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: FONT_BODY },
    btnGhostActive: { background: "#3d3a26", color: "#f3eddd", borderColor: "#3d3a26" },
    iconBtn: { background: "transparent", border: "none", color: "#6b5f42", cursor: "pointer",
        padding: 6, borderRadius: 8, display: "grid", placeItems: "center" },
    // Panel
    scrim: { position: "fixed", inset: 0, background: "rgba(40,32,14,.32)", backdropFilter: "blur(2px)", zIndex: 40 },
    panel: { position: "fixed", top: 0, right: 0, height: "100vh", width: "min(440px, 100vw)",
        background: PAPER, zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "-12px 0 40px rgba(40,32,14,.25)", borderLeft: "1px solid #d8c9a0" },
    panelHead: { display: "flex", alignItems: "center", gap: 8, padding: "14px 14px",
        borderBottom: "1px solid #ddd0ad" },
    panelTitle: { flex: 1, textAlign: "left", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 22,
        background: "transparent", border: "none", cursor: "pointer", color: INK, display: "flex",
        alignItems: "center", gap: 8 },
    nameInput: { flex: 1, fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 22, color: INK,
        border: "1px solid #c9ba93", borderRadius: 8, padding: "4px 8px", background: "#fff" },
    panelBody: { flex: 1, overflowY: "auto", padding: 16 },
    panelEmpty: { color: "#8a7d5c", fontStyle: "italic", textAlign: "center", padding: "24px 0" },
    addRow: { display: "flex", gap: 8, marginBottom: 16 },
    input: { flex: 1, padding: "9px 12px", borderRadius: 9, border: "1px solid #ccbd95",
        background: "#fffdf6", fontSize: 14, fontFamily: FONT_BODY, color: INK, minWidth: 0 },
    // Crop card
    cropCard: { border: "1px solid #ddd0ad", borderRadius: 13, marginBottom: 10, background: "#fffdf6", overflow: "hidden" },
    cropHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 10, padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" },
    cropHeadLeft: { display: "flex", alignItems: "center", gap: 9 },
    cropName: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16.5, color: INK },
    cropMeta: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
    miniStat: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600 },
    cropDetail: { padding: "4px 14px 14px", borderTop: "1px solid #eee2c4" },
    sectionLabel: { display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: ".06em", color: "#9a8a62", margin: "14px 0 8px" },
    tinyEmpty: { fontSize: 13, color: "#9a8d68", fontStyle: "italic", margin: "4px 0" },
    timeline: { display: "flex", flexDirection: "column", gap: 2 },
    logRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0" },
    logDot: { width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 },
    logTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, fontSize: 13.5 },
    logDate: { fontSize: 12, color: "#8a7d5c" },
    logNote: { fontSize: 13, color: "#5d5238", marginTop: 2, lineHeight: 1.45 },
    logDel: { background: "transparent", border: "none", color: "#bcae88", cursor: "pointer", padding: 4, flexShrink: 0 },
    logForm: { marginTop: 10, padding: 10, borderRadius: 10, border: "1px solid #e6dabb", background: "#f5efdd" },
    typeRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },
    typeBtn: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, padding: "6px 10px",
        borderRadius: 8, border: "1px solid #ccbd95", background: "#fffdf6", color: "#5d5238", cursor: "pointer",
        fontWeight: 500, fontFamily: FONT_BODY },
    logFormBottom: { display: "flex", gap: 6, alignItems: "center", marginBottom: 8 },
    logTextarea: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #ccbd95",
        background: "#fffdf6", fontSize: 14, fontFamily: FONT_BODY, color: INK, resize: "vertical", lineHeight: 1.5 },
    diseaseRow: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 },
    select: { padding: "9px 12px", borderRadius: 9, border: "1px solid #ccbd95", background: "#fffdf6",
        fontSize: 14, fontFamily: FONT_BODY, color: INK },
    photoBtn: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 13px",
        borderRadius: 9, border: "1px dashed #b3a376", background: "#fffdf6", color: "#5d5238",
        fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY },
    photoStrip: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 },
    photoThumb: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, cursor: "pointer",
        border: "1px solid #d8c9a0" },
    previewWrap: { position: "relative" },
    photoRemove: { position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%",
        background: "#a13d2d", color: "#fff", border: "2px solid #fffdf6", cursor: "pointer", display: "grid",
        placeItems: "center", padding: 0 },
    lightbox: { position: "fixed", inset: 0, background: "rgba(20,16,8,.85)", zIndex: 60, display: "grid",
        placeItems: "center", padding: 24, cursor: "zoom-out" },
    lightboxImg: { maxWidth: "100%", maxHeight: "100%", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,.5)" },
    dateInput: { padding: "8px 9px", borderRadius: 9, border: "1px solid #ccbd95", background: "#fffdf6",
        fontSize: 13, color: INK, fontFamily: FONT_BODY },
    textarea: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ccbd95",
        background: "#fffdf6", fontSize: 14, fontFamily: FONT_BODY, color: INK, resize: "vertical", lineHeight: 1.5 },
    btnDanger: { display: "inline-flex", alignItems: "center", gap: 7, background: "transparent",
        color: "#a13d2d", border: "1px solid #d8b3aa", padding: "9px 14px", borderRadius: 10,
        fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: FONT_BODY },
    btnDangerSmall: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
        color: "#a13d2d", border: "none", padding: "10px 0 2px", fontWeight: 600, fontSize: 12.5,
        cursor: "pointer", fontFamily: FONT_BODY },
    dangerZone: { marginTop: 22, paddingTop: 16, borderTop: "1px solid #ddd0ad" },
    confirmRow: { display: "flex", flexDirection: "column", gap: 10, padding: "12px 14px",
        background: "#f7f0df", border: "1px solid #e2d6b6", borderRadius: 11 },
    confirmText: { fontSize: 13, color: "#5d5238", lineHeight: 1.45 },
    confirmBtns: { display: "flex", gap: 8, justifyContent: "flex-end" },
    btnGhostSmall: { background: "transparent", color: "#6b5f42", border: "1px solid #c9ba93",
        padding: "7px 13px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY },
    btnConfirm: { display: "inline-flex", alignItems: "center", gap: 5, background: "#6b8e3d", color: "#f5f1e3",
        border: "none", padding: "7px 13px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
        fontFamily: FONT_BODY },
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(MoestuinApp, null));
if (window.__bootTimer)
    clearTimeout(window.__bootTimer);
if (window.__appReady)
    window.__appReady();