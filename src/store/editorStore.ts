import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DEFAULT_BRAND_ID } from '../data/brands';
import { DEFAULT_TEMPLATE_ID, getTemplate } from '../data/templateRegistry';
import { applyTemplate, createPoster } from '../services/templateService';
import type { BrandId, BrandOverrides } from '../types/brand';
import type { DataOf, ElementType, Fill, Frame, PosterElement, Ratio } from '../types/element';
import type { Poster, PosterMeta } from '../types/poster';
import { newId } from '../utils/id';

export type LayerMove = 'forward' | 'backward' | 'front' | 'back';

/** Element fields editable outside `data` (proposal §10, §19, §20). */
export type ElementPatch = Partial<Pick<PosterElement, 'name' | 'rotation' | 'opacity' | 'visible' | 'locked'>>;

interface Snapshot {
  posters: Poster[];
  activeId: string;
}

export interface PersistedEditor {
  posters: Poster[];
  activeId: string;
  brandOverrides: Partial<Record<BrandId, BrandOverrides>>;
}

export interface EditorState extends PersistedEditor {
  selectedId: string | null;
  past: Snapshot[];
  future: Snapshot[];

  select(id: string | null): void;
  setActivePoster(id: string): void;
  addPoster(templateId?: string): void;
  duplicatePoster(id: string): void;
  removePoster(id: string): void;

  chooseTemplate(templateId: string): void;
  setBrand(brandId: BrandId): void;
  setRatio(ratio: Ratio): void;
  setMeta(patch: Partial<PosterMeta>): void;
  setBackground(fill: Fill): void;
  resetPoster(): void;

  updateElement(id: string, patch: ElementPatch): void;
  updateData<T extends ElementType>(id: string, patch: Partial<DataOf<T>>): void;
  setFrame(id: string, frame: Frame, rotation?: number): void;
  resetFrame(id: string): void;
  toggleHighlight(id: string, wordIndex: number): void;
  moveLayer(id: string, move: LayerMove): void;

  updateBrand(brandId: BrandId, patch: BrandOverrides): void;

  undo(): void;
  redo(): void;
  hydrate(state: PersistedEditor): void;
}

const HISTORY_LIMIT = 80;
const COALESCE_MS = 800;

function initialState(): PersistedEditor {
  const poster = createPoster(DEFAULT_TEMPLATE_ID, DEFAULT_BRAND_ID);
  return { posters: [poster], activeId: poster.id, brandOverrides: {} };
}

export const selectActivePoster = (s: Pick<EditorState, 'posters' | 'activeId'>): Poster =>
  s.posters.find((p) => p.id === s.activeId) ?? (s.posters[0] as Poster);

export const useEditorStore = create<EditorState>()(
  immer((set, get) => {
    let lastKey: string | null = null;
    let lastTime = 0;

    /**
     * Applies an undoable change. Rapid changes with the same `key` (typing,
     * dragging a slider) collapse into one history step.
     */
    const commit = (key: string | null, recipe: (s: EditorState) => void) => {
      const now = Date.now();
      const coalesce = key !== null && key === lastKey && now - lastTime < COALESCE_MS;
      const before = get();
      set((s) => {
        if (!coalesce) {
          s.past.push({ posters: before.posters, activeId: before.activeId });
          if (s.past.length > HISTORY_LIMIT) s.past.shift();
        }
        s.future = [];
        recipe(s as EditorState);
      });
      lastKey = key;
      lastTime = now;
    };

    /** Mutates the active poster and stamps it. */
    const onPoster = (key: string | null, fn: (p: Poster, s: EditorState) => void) =>
      commit(key, (s) => {
        const p = s.posters.find((x) => x.id === s.activeId);
        if (!p) return;
        fn(p, s);
        p.updatedAt = Date.now();
      });

    const onElement = (id: string, key: string | null, fn: (el: PosterElement, p: Poster) => void) =>
      onPoster(key, (p) => {
        const el = p.elements.find((e) => e.id === id);
        if (el) fn(el, p);
      });

    return {
      ...initialState(),
      selectedId: null,
      past: [],
      future: [],

      select: (id) => set((s) => void (s.selectedId = id)),

      setActivePoster: (id) =>
        set((s) => {
          if (s.posters.some((p) => p.id === id)) {
            s.activeId = id;
            s.selectedId = null;
          }
        }),

      addPoster: (templateId) =>
        commit(null, (s) => {
          const current = selectActivePoster(s);
          const poster = createPoster(templateId ?? current.templateId, current.brandId, current.meta);
          s.posters.push(poster);
          s.activeId = poster.id;
          s.selectedId = null;
        }),

      duplicatePoster: (id) =>
        commit(null, (s) => {
          const i = s.posters.findIndex((p) => p.id === id);
          const src = s.posters[i];
          if (!src) return;
          const copy: Poster = { ...structuredClone(src), id: newId(), updatedAt: Date.now() };
          s.posters.splice(i + 1, 0, copy);
          s.activeId = copy.id;
          s.selectedId = null;
        }),

      removePoster: (id) =>
        commit(null, (s) => {
          if (s.posters.length <= 1) return;
          const i = s.posters.findIndex((p) => p.id === id);
          if (i < 0) return;
          s.posters.splice(i, 1);
          if (s.activeId === id) s.activeId = (s.posters[Math.min(i, s.posters.length - 1)] as Poster).id;
          s.selectedId = null;
        }),

      chooseTemplate: (templateId) =>
        commit(null, (s) => {
          const i = s.posters.findIndex((p) => p.id === s.activeId);
          const p = s.posters[i];
          if (!p) return;
          s.posters[i] = applyTemplate(p, getTemplate(templateId).id);
          s.selectedId = null;
        }),

      setBrand: (brandId) => onPoster(null, (p) => void (p.brandId = brandId)),
      setRatio: (ratio) => onPoster(null, (p) => void (p.ratio = ratio)),
      setMeta: (patch) => onPoster('meta', (p) => Object.assign(p.meta, patch)),
      setBackground: (fill) => onPoster('background', (p) => void (p.background = fill)),

      resetPoster: () =>
        commit(null, (s) => {
          const i = s.posters.findIndex((p) => p.id === s.activeId);
          const p = s.posters[i];
          if (!p) return;
          const fresh = createPoster(p.templateId, p.brandId, p.meta);
          s.posters[i] = { ...fresh, id: p.id };
          s.selectedId = null;
        }),

      updateElement: (id, patch) => onElement(id, `el:${id}:${Object.keys(patch).join(',')}`, (el) => Object.assign(el, patch)),

      updateData: (id, patch) =>
        onElement(id, `data:${id}:${Object.keys(patch).join(',')}`, (el) => {
          Object.assign(el.data, patch);
          // Editing text invalidates highlight indices past the new word count
          if (el.type === 'text' && 'text' in patch) {
            const words = el.data.text.split(/\s+/).filter(Boolean).length;
            el.data.highlights = el.data.highlights.filter((i) => i < words);
          }
        }),

      setFrame: (id, frame, rotation) =>
        onElement(id, `frame:${id}`, (el, p) => {
          el.userFrames[p.ratio] = frame;
          if (rotation !== undefined) el.rotation = rotation;
          if (el.aspect) el.aspect = undefined; // user resized → their proportions win
        }),

      resetFrame: (id) =>
        onElement(id, null, (el, p) => {
          delete el.userFrames[p.ratio];
          el.rotation = 0;
        }),

      toggleHighlight: (id, index) =>
        onElement(id, null, (el) => {
          if (el.type !== 'text') return;
          const set_ = new Set(el.data.highlights);
          if (set_.has(index)) set_.delete(index);
          else set_.add(index);
          el.data.highlights = [...set_].sort((a, b) => a - b);
        }),

      moveLayer: (id, move) =>
        onPoster(null, (p) => {
          const i = p.elements.findIndex((e) => e.id === id);
          if (i < 0) return;
          const [el] = p.elements.splice(i, 1);
          if (!el) return;
          const last = p.elements.length;
          const to = move === 'front' ? last : move === 'back' ? 0 : move === 'forward' ? Math.min(last, i + 1) : Math.max(0, i - 1);
          p.elements.splice(to, 0, el);
        }),

      updateBrand: (brandId, patch) =>
        commit(`brand:${brandId}:${Object.keys(patch).join(',')}`, (s) => {
          const cur = s.brandOverrides[brandId] ?? {};
          s.brandOverrides[brandId] = { ...cur, ...patch, palette: { ...cur.palette, ...patch.palette } };
        }),

      undo: () =>
        set((s) => {
          const prev = s.past.pop();
          if (!prev) return;
          s.future.push({ posters: s.posters, activeId: s.activeId });
          s.posters = prev.posters;
          s.activeId = prev.activeId;
          s.selectedId = null;
          lastKey = null;
        }),

      redo: () =>
        set((s) => {
          const next = s.future.pop();
          if (!next) return;
          s.past.push({ posters: s.posters, activeId: s.activeId });
          s.posters = next.posters;
          s.activeId = next.activeId;
          s.selectedId = null;
          lastKey = null;
        }),

      hydrate: (state) =>
        set((s) => {
          s.posters = state.posters;
          s.activeId = state.activeId;
          s.brandOverrides = state.brandOverrides;
          s.past = [];
          s.future = [];
          s.selectedId = null;
        }),
    };
  }),
);
