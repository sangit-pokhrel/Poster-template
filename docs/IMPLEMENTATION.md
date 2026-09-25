# Implementation notes: proposal → code

How each section of [`proposal.md`](../proposal.md) is implemented, and where the build deliberately differs.

## Section map

| Proposal § | Requirement | Implementation |
|---|---|---|
| 2, 3 | Header: identity, auto-save indicator, reset, download | `components/layout/AppHeader.tsx` (plus the brand switcher and undo/redo) |
| 4, 34 | 50 / 50 editor + preview, responsive | `components/layout/Workspace.tsx`: two columns from `lg`, tabs below it |
| 5 | Live rendering surface | `components/canvas/PosterCanvas.tsx` re-syncs the Fabric stage on every store change |
| 6, 34 | Full-screen + minimize, no state loss | `uiStore.fullscreen` hides the editor; `view: 'minimized'` shows a floating dock. Poster state lives in the store, so nothing is lost |
| 7, 8 | Categories + thumbnails + template library | `data/templateRegistry.ts` (10 categories, **20 templates**); `components/templates/TemplateBrowser.tsx` |
| 9 | Data-driven templates | `data/templates/*.ts` via the `builders.ts` DSL; no per-template code |
| 10, 21 | Text properties, Quick vs Advanced | `editor/ContentEditor.tsx` (Quick) · `editor/DesignEditor.tsx` (Advanced: font, size, weight, colour, align, line/letter spacing, x/y/w/h, rotation, opacity) |
| 11 | Word-level highlight | `render/text.ts` (`tokenizeWords`, `layoutText`, colour or marker style) · `editor/TextEditor.tsx` word picker |
| 12, 13, 31 | Upload, drag & drop, samples, multi-photo, cover/contain, zoom, pan | `services/imageService.ts` (validation, downscale) · `render/image.ts` (`placeImage`) · `editor/PhotoEditor.tsx` |
| 12 | Unused photo slots disappear from output | `render/image.ts`: empty photos are skipped in `export` mode |
| 14, 32, 33 | Four ratios, normalized coordinates, display scaling | `utils/aspectRatio.ts` (`effectiveFrame`, `elementRect` with aspect lock) · Fabric viewport zoom |
| 15 | Date element: today/custom, Nepali/English, show/hide | `utils/date.ts` (exact BS via `nepali-date-converter`) · `ContentEditor` → Date section · `{date}` token |
| 16 | Badges: text, style, show | `render/graphics.ts` `drawBadge` (pill, tag, outline, ribbon, circle, underline) |
| 17 | Footer: website, handle, contact, show | `{handle} • {phone} • {website}` tokens resolved from the brand kit; empty fields drop out with their separators |
| 18 | Select, drag, resize, rotate; no handles in export | `services/canvasRenderer.ts` (custom Fabric objects, live reflow while resizing, centre snapping, locked outline) |
| 19, 20 | Layers + locked elements | `editorStore.moveLayer` (forward/backward/front/back) · `DesignEditor` layer list with lock/visibility; logos and decorations are locked by default |
| 22, 35, 36 | Dedicated export canvas, PNG/JPG, 1×/2×/3× | `services/exportService.ts` (`renderPosterCanvas` → `toBlob`) |
| 23 | Copy to clipboard | `exportService.copyPoster` |
| 24, 38 | Auto-save, IndexedDB for images, "Saving…/Saved" | `services/storageService.ts` (debounced localStorage, validated restore) · `services/assetService.ts` (IndexedDB blobs as `asset:` refs, orphan cleanup) |
| 25 | Reset with confirmation, keeps the template | `AppHeader` → `confirm()` modal → `editorStore.resetPoster` |
| 26 | React, TS, Vite, Tailwind, Fabric.js, Zustand | As specified (React 19, TS strict, Vite 8, Tailwind 4, Fabric 7, Zustand 5 + immer) |
| 29, 30 | Single source of truth; template loading | `store/editorStore.ts` · `services/templateService.ts` (`createPoster`, `applyTemplate`) |
| 37 | Performance | Serialized thumbnail queue + cache, coalesced undo history, lazy JSZip, object URLs, downscaled uploads |
| 41 | Client-side privacy | No backend; images never leave the browser |
| 42 | Accessibility | Labelled controls, ARIA tabs/radios/switches, keyboard tab navigation, Esc, focus-visible, reduced motion |
| 43 | Error messages | Upload, export and clipboard errors use the proposal's wording (toasts) |
| 52 | Definition of Done 1–17 | Checked in an automated headless-Chrome run (see below) |

## Deliberate differences

| Proposal | Built | Why |
|---|---|---|
| ~15 initial templates | **20** templates across all 10 categories | Requested by the team |
| Generic brand | Two fixed brands (Nepal Scholar, Thesis Companion) with a switcher per poster, brand colour/font tokens in every template, and an editable brand kit | The studio serves these two pages; one template set renders in either identity |
| Fabric.js does all rendering | Fabric hosts the **interactive** canvas; its objects call the same pure Canvas 2D functions (`render/`) that the export canvas and thumbnails use | One drawing implementation means preview and export match pixel for pixel, and the drawing code is unit-testable without a DOM |
| Bulk export (Phase 3) | Several posters per session + "Download all (ZIP)" | The original request was "fill data and download all" |
| Brand kit (Phase 2) | Included | Needed so each page's contact details and colours stay consistent |
| Switching template replaces the poster | Replaces the layout but **keeps what the user typed or uploaded** (by semantic role); asks first if positions were customised | Nothing the user typed is lost |

## Verification

- **Unit (Vitest, 52 tests):** text wrapping and auto-fit, token and separator cleanup, colour tokens, cover/contain maths, frame and aspect maths, geometry of every template, template switching (keeps user content, drops sample content), store actions (highlights, undo/redo coalescing, per-ratio frames, layers, brand, reset), persisted-state sanitising.
- **Browser (headless Chrome, scripted):**
  - Contact sheets of all 20 templates × 2 brands × 3 ratios render without errors.
  - Picking a template, editing the heading and highlighting a word all work.
  - Dragging on the canvas stores a per-ratio frame.
  - Layer reorder and undo work; minimize and full screen work.
  - PNG exports at 1080×1350 and JPG at 2×.
  - An uploaded photo survives a reload (IndexedDB), and an unsupported file shows the correct error.
  - Brand switch and the ZIP of all posters work.
  - At 390 px mobile width there is no horizontal overflow, and there are zero console errors.
