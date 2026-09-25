import { buildLayout, getAd } from '../design/registry';
import type { BrandId } from '../types/brand';
import type { ElementRole, PosterElement } from '../types/element';
import type { Poster, PosterMeta } from '../types/poster';
import { todayIso } from '../utils/date';
import { newId } from '../utils/id';

export const DEFAULT_META: PosterMeta = { dateMode: 'nepali', date: todayIso(), customDate: '' };
export const DEFAULT_RATIO = '4:5' as const;

/** Fresh, deep-copied elements for an ad in a brand's design (layout data is never mutated). */
export function instantiateElements(adId: string, brandId: BrandId): PosterElement[] {
  return structuredClone(buildLayout(adId, brandId).elements).map((spec) => ({ ...spec, userFrames: {} }) as PosterElement);
}

/** Template loading logic (proposal §30): ad + brand → layout → elements with defaults. */
export function createPoster(adId: string, brandId: BrandId, meta: PosterMeta = DEFAULT_META): Poster {
  const ad = getAd(adId);
  return {
    id: newId(),
    templateId: ad.id,
    brandId,
    ratio: DEFAULT_RATIO,
    background: structuredClone(buildLayout(ad.id, brandId).background),
    elements: instantiateElements(ad.id, brandId),
    meta: { ...meta },
    updatedAt: Date.now(),
  };
}

/** Roles whose content the user typed/uploaded and that should survive a switch. */
const CARRY_ROLES: ReadonlySet<ElementRole> = new Set([
  'heading',
  'subheading',
  'body',
  'name',
  'quote',
  'photo',
  'photo2',
  'number',
  'cta',
  'badge',
  'price',
  'item',
  'label',
  'contact',
]);

type Carry = { text?: string; highlights?: number[]; src?: string; fit?: 'cover' | 'contain'; zoom?: number; panX?: number; panY?: number; icon?: string };

function contentOf(el: PosterElement): Carry | null {
  switch (el.type) {
    case 'text':
      return { text: el.data.text, highlights: el.data.highlights };
    case 'badge':
      return { text: el.data.text };
    case 'image':
      return el.data.src ? { src: el.data.src, fit: el.data.fit, zoom: el.data.zoom, panX: el.data.panX, panY: el.data.panY } : null;
    case 'icon':
      return { icon: el.data.name };
    default:
      return null;
  }
}

function sameContent(a: Carry | null, b: Carry | null): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function withContent(el: PosterElement, c: Carry): PosterElement {
  if (el.type === 'text' && c.text !== undefined) return { ...el, data: { ...el.data, text: c.text, highlights: [...(c.highlights ?? [])] } };
  if (el.type === 'badge' && c.text !== undefined) return { ...el, data: { ...el.data, text: c.text } };
  if (el.type === 'image' && c.src) return { ...el, visible: true, data: { ...el.data, src: c.src, fit: c.fit ?? el.data.fit, zoom: c.zoom ?? 1, panX: c.panX ?? 0, panY: c.panY ?? 0 } };
  if (el.type === 'icon' && c.icon) return { ...el, data: { ...el.data, name: c.icon } };
  return el;
}

/**
 * Re-renders a poster as another ad and/or in another brand's design (proposal §30).
 * Layout and styling come from the target design; content the user changed
 * (text, highlights, photos, icons) is carried over — by element id when the ad
 * stays the same (brand switch), otherwise by semantic role.
 */
export function applyTemplate(poster: Poster, adId: string, brandId: BrandId = poster.brandId): Poster {
  const ad = getAd(adId);
  const sameAd = ad.id === poster.templateId;
  const defaults = new Map(buildLayout(poster.templateId, poster.brandId).elements.map((e) => [e.id, contentOf(e as PosterElement)]));

  // Only content the user actually changed travels; sample content of the old ad doesn't.
  const edited = poster.elements.filter((el) => {
    const c = contentOf(el);
    return c !== null && (!defaults.has(el.id) || !sameContent(c, defaults.get(el.id) ?? null));
  });
  const byId = new Map(edited.map((e) => [e.id, e]));
  const byRole = new Map<ElementRole, PosterElement>();
  for (const el of edited) if (CARRY_ROLES.has(el.role) && !byRole.has(el.role)) byRole.set(el.role, el);

  const elements = instantiateElements(ad.id, brandId).map((el) => {
    const source = byId.get(el.id) ?? (sameAd ? undefined : CARRY_ROLES.has(el.role) ? byRole.get(el.role) : undefined);
    const c = source ? contentOf(source) : null;
    // Visibility toggles also survive a brand switch
    const prev = sameAd ? poster.elements.find((p) => p.id === el.id) : undefined;
    const base = prev && !prev.visible ? { ...el, visible: false } : el;
    return c && source?.type === el.type ? withContent(base, c) : base;
  });

  return {
    ...poster,
    templateId: ad.id,
    brandId,
    background: structuredClone(buildLayout(ad.id, brandId).background),
    elements,
    updatedAt: Date.now(),
  };
}

/** Whether the user has customised positions (so switching would lose work). */
export function hasLayoutEdits(poster: Poster): boolean {
  return poster.elements.some((el) => Object.keys(el.userFrames).length > 0);
}
