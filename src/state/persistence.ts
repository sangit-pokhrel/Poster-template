import { ASPECT_RATIO_KEYS, SOCIAL_NETWORKS, isTemplateId } from '../engine';
import type { Brand, Post } from '../engine';
import { DEFAULT_BRAND, MAX_EXTRA_PHOTOS, createInitialState, createPost } from './defaults';
import type { AppState } from './defaults';

export const STORAGE_KEY = 'poster-studio:v2';

export type SaveStatus = 'saved' | 'partial' | 'error';

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
const num = (v: unknown, fallback: number, min: number, max: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;

/** Defensive parse of a stored post: unknown/invalid fields fall back to defaults. */
function sanitizePost(raw: unknown): Post | null {
  if (!isObj(raw)) return null;
  const d = createPost();
  return {
    id: str(raw.id, d.id),
    templateId: isTemplateId(str(raw.templateId, '')) ? (raw.templateId as string) : d.templateId,
    headline: str(raw.headline, ''),
    highlighted: Array.isArray(raw.highlighted) ? raw.highlighted.filter((n): n is number => Number.isInteger(n) && n >= 0) : [],
    speaker: str(raw.speaker, ''),
    badgeText: str(raw.badgeText, ''),
    date: str(raw.date, d.date),
    photoSrc: str(raw.photoSrc, ''),
    extraPhotoSrcs: Array.isArray(raw.extraPhotoSrcs)
      ? raw.extraPhotoSrcs.filter((s): s is string => typeof s === 'string' && s.length > 0).slice(0, MAX_EXTRA_PHOTOS)
      : [],
    photoFit: raw.photoFit === 'contain' ? 'contain' : 'cover',
    zoom: num(raw.zoom, d.zoom, 50, 250),
    panX: num(raw.panX, 0, -2000, 2000),
    panY: num(raw.panY, 0, -2000, 2000),
    gradientHeight: num(raw.gradientHeight, d.gradientHeight, 30, 80),
    fontSize: num(raw.fontSize, d.fontSize, 30, 70),
    lineHeight: num(raw.lineHeight, d.lineHeight, 1.1, 1.8),
    headlineX: num(raw.headlineX, 0, -2000, 2000),
    headlineY: num(raw.headlineY, 0, -2000, 2000),
  };
}

function sanitizeBrand(raw: unknown): Brand {
  if (!isObj(raw)) return DEFAULT_BRAND;
  const hex = (v: unknown, fallback: string) => (typeof v === 'string' && /^#[\da-f]{6}$/i.test(v) ? v : fallback);
  return {
    name: str(raw.name, DEFAULT_BRAND.name),
    logoSrc: str(raw.logoSrc, ''),
    websiteUrl: str(raw.websiteUrl, DEFAULT_BRAND.websiteUrl),
    commentTag: str(raw.commentTag, DEFAULT_BRAND.commentTag),
    primary: hex(raw.primary, DEFAULT_BRAND.primary),
    secondary: hex(raw.secondary, DEFAULT_BRAND.secondary),
    socials: Array.isArray(raw.socials)
      ? SOCIAL_NETWORKS.filter((n) => (raw.socials as unknown[]).includes(n))
      : DEFAULT_BRAND.socials,
    showMap: typeof raw.showMap === 'boolean' ? raw.showMap : DEFAULT_BRAND.showMap,
  };
}

export function sanitizeState(raw: unknown): AppState | null {
  if (!isObj(raw) || raw.version !== 2) return null;
  const posts = Array.isArray(raw.posts) ? raw.posts.map(sanitizePost).filter((p): p is Post => p !== null) : [];
  if (posts.length === 0) return null;
  const activeId = posts.some((p) => p.id === raw.activeId) ? (raw.activeId as string) : (posts[0] as Post).id;
  return {
    version: 2,
    lang: raw.lang === 'ne' ? 'ne' : 'en',
    ratio: ASPECT_RATIO_KEYS.includes(raw.ratio as never) ? (raw.ratio as AppState['ratio']) : '1:1',
    brand: sanitizeBrand(raw.brand),
    posts,
    activeId,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitizeState(JSON.parse(raw)) ?? createInitialState();
  } catch {
    /* corrupted or blocked storage: start fresh */
  }
  return createInitialState();
}

const stripDataUrl = (src: string) => (src.startsWith('data:') ? '' : src);

/**
 * Saves the full state; if uploads push it past the ~5 MB quota, retries
 * without embedded images so text and settings still survive a reload.
 */
export function saveState(state: AppState): SaveStatus {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return 'saved';
  } catch {
    try {
      const lite: AppState = {
        ...state,
        brand: { ...state.brand, logoSrc: stripDataUrl(state.brand.logoSrc) },
        posts: state.posts.map((p) => ({
          ...p,
          photoSrc: stripDataUrl(p.photoSrc),
          extraPhotoSrcs: p.extraPhotoSrcs.map(stripDataUrl).filter(Boolean),
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
      return 'partial';
    } catch {
      return 'error';
    }
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
