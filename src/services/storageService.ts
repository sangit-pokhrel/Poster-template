/**
 * Local auto-save (proposal §24, §38): poster state → localStorage (debounced),
 * uploaded images → IndexedDB (referenced as `asset:` ids).
 * Loading is defensive: every stored poster is validated and merged with its
 * template so older saves keep working when templates gain new fields.
 */
import { BRANDS, isBrandId } from '../data/brands';
import { THEME_COUNT } from '../design/themes';
import { buildLayout, isAdId } from '../design/registry';
import type { EditorState, PersistedEditor } from '../store/editorStore';
import { useEditorStore } from '../store/editorStore';
import { useUiStore } from '../store/uiStore';
import type { BrandId, BrandOverrides } from '../types/brand';
import type { PosterElement } from '../types/element';
import type { Poster, PosterMeta } from '../types/poster';
import { isRatio } from '../utils/aspectRatio';
import { todayIso } from '../utils/date';
import { collectGarbage, isAssetRef } from './assetService';

export const STORAGE_KEY = 'template-studio:v2';
const SAVE_DEBOUNCE_MS = 500;
const ELEMENT_TYPES = new Set(['text', 'image', 'logo', 'shape', 'badge', 'icon']);

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

function sanitizeElement(raw: unknown, templateId: string, brandId: BrandId): PosterElement | null {
  if (!isObj(raw) || typeof raw.id !== 'string' || !ELEMENT_TYPES.has(raw.type as string) || !isObj(raw.data)) return null;
  const spec = buildLayout(templateId, brandId).elements.find((e) => e.id === raw.id && e.type === raw.type);
  const merged = {
    ...(spec ?? {}),
    ...raw,
    data: { ...(spec?.data ?? {}), ...raw.data },
    ratioFrames: isObj(raw.ratioFrames) ? raw.ratioFrames : (spec?.ratioFrames ?? {}),
    userFrames: isObj(raw.userFrames) ? raw.userFrames : {},
  } as PosterElement;
  const f = merged.frame;
  if (!f || ![f.x, f.y, f.w, f.h].every((n) => typeof n === 'number' && Number.isFinite(n))) return null;
  return merged;
}

function sanitizeMeta(raw: unknown): PosterMeta {
  const m = isObj(raw) ? raw : {};
  return {
    dateMode: m.dateMode === 'english' || m.dateMode === 'custom' ? m.dateMode : 'nepali',
    date: typeof m.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.date) ? m.date : todayIso(),
    customDate: typeof m.customDate === 'string' ? m.customDate : '',
    theme: typeof m.theme === 'number' && Number.isInteger(m.theme) && m.theme >= 0 && m.theme < THEME_COUNT ? m.theme : 'auto',
  };
}

function sanitizePoster(raw: unknown): Poster | null {
  if (!isObj(raw) || typeof raw.id !== 'string' || !isAdId(raw.templateId)) return null;
  const templateId = raw.templateId;
  const brandId: BrandId = isBrandId(raw.brandId) ? raw.brandId : 'nepal-scholar';
  const elements = Array.isArray(raw.elements)
    ? raw.elements.map((e) => sanitizeElement(e, templateId, brandId)).filter((e): e is PosterElement => e !== null)
    : [];
  if (elements.length === 0) return null;
  return {
    id: raw.id,
    templateId,
    brandId,
    ratio: isRatio(raw.ratio) ? raw.ratio : '4:5',
    background: (raw.background as Poster['background']) ?? buildLayout(templateId, brandId).background,
    elements,
    meta: sanitizeMeta(raw.meta),
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
  };
}

export function sanitizePersisted(raw: unknown): PersistedEditor | null {
  if (!isObj(raw) || raw.version !== 1) return null;
  const posters = Array.isArray(raw.posters) ? raw.posters.map(sanitizePoster).filter((p): p is Poster => p !== null) : [];
  if (posters.length === 0) return null;
  const activeId = posters.some((p) => p.id === raw.activeId) ? (raw.activeId as string) : (posters[0] as Poster).id;
  const brandOverrides: Partial<Record<BrandId, BrandOverrides>> = {};
  if (isObj(raw.brandOverrides)) {
    for (const id of Object.keys(BRANDS) as BrandId[]) {
      const o = raw.brandOverrides[id];
      if (isObj(o)) brandOverrides[id] = o as BrandOverrides;
    }
  }
  return { posters, activeId, brandOverrides };
}

export function loadPersisted(): PersistedEditor | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizePersisted(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function serialize(s: Pick<EditorState, 'posters' | 'activeId' | 'brandOverrides'>): string {
  return JSON.stringify({ version: 1, posters: s.posters, activeId: s.activeId, brandOverrides: s.brandOverrides });
}

export function referencedAssets(s: Pick<EditorState, 'posters' | 'brandOverrides'>): Set<string> {
  const refs = new Set<string>();
  for (const p of s.posters) for (const el of p.elements) if (el.type === 'image' && isAssetRef(el.data.src)) refs.add(el.data.src);
  for (const o of Object.values(s.brandOverrides)) if (o?.logo && isAssetRef(o.logo)) refs.add(o.logo);
  // Keep assets reachable through undo history too
  for (const snap of useEditorStore.getState().past) {
    for (const p of snap.posters) for (const el of p.elements) if (el.type === 'image' && isAssetRef(el.data.src)) refs.add(el.data.src);
  }
  return refs;
}

/** Restores the last session and keeps saving on every change. Returns an unsubscribe. */
export function startPersistence(): () => void {
  const saved = loadPersisted();
  if (saved) useEditorStore.getState().hydrate(saved);
  void collectGarbage(referencedAssets(useEditorStore.getState()));

  let timer: number | undefined;
  const setStatus = (v: 'saved' | 'saving' | 'error') => useUiStore.getState().set('saveStatus', v);

  const unsubscribe = useEditorStore.subscribe((state, prev) => {
    if (state.posters === prev.posters && state.activeId === prev.activeId && state.brandOverrides === prev.brandOverrides) return;
    setStatus('saving');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, serialize(state));
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, SAVE_DEBOUNCE_MS);
  });

  const flush = () => {
    window.clearTimeout(timer);
    try {
      localStorage.setItem(STORAGE_KEY, serialize(useEditorStore.getState()));
    } catch {
      /* ignore */
    }
  };
  window.addEventListener('beforeunload', flush);
  return () => {
    unsubscribe();
    window.removeEventListener('beforeunload', flush);
  };
}
