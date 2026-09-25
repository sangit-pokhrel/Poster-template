import { getTemplate } from '../data/templateRegistry';
import type { BrandId } from '../types/brand';
import type { ElementRole, PosterElement } from '../types/element';
import type { Poster, PosterMeta } from '../types/poster';
import { todayIso } from '../utils/date';
import { newId } from '../utils/id';

export const DEFAULT_META: PosterMeta = { dateMode: 'nepali', date: todayIso(), customDate: '' };

/** Fresh, deep-copied element list for a template (template data is never mutated). */
export function instantiateElements(templateId: string): PosterElement[] {
  return structuredClone(getTemplate(templateId).elements).map((spec) => ({ ...spec, userFrames: {} }) as PosterElement);
}

/** Template loading logic (proposal §30): definition → elements → defaults. */
export function createPoster(templateId: string, brandId: BrandId, meta: PosterMeta = DEFAULT_META): Poster {
  const t = getTemplate(templateId);
  return {
    id: newId(),
    templateId: t.id,
    brandId,
    ratio: t.defaultRatio,
    background: t.background,
    elements: instantiateElements(t.id),
    meta: { ...meta },
    updatedAt: Date.now(),
  };
}

/** Roles whose content the user typed/uploaded and that should survive a template switch. */
const CARRY_ROLES: ReadonlySet<ElementRole> = new Set([
  'heading',
  'subheading',
  'body',
  'name',
  'quote',
  'photo',
  'photo2',
  'photo3',
  'photo4',
  'number',
  'cta',
  'badge',
]);

/**
 * Switches a poster to another template (proposal §30). Structure and styling
 * come from the new template; the user's content (text, highlights, photos
 * and photo framing) is carried over by semantic role so nothing typed is lost.
 */
export function applyTemplate(poster: Poster, templateId: string): Poster {
  const t = getTemplate(templateId);
  const sourceDefaults = new Map(getTemplate(poster.templateId).elements.map((e) => [e.id, e]));

  // Only content the user actually changed travels; the old template's sample text/photos don't.
  const isUserContent = (el: PosterElement): boolean => {
    const d = sourceDefaults.get(el.id);
    if (!d || d.type !== el.type) return true;
    if (el.type === 'text' && d.type === 'text') return el.data.text !== d.data.text || el.data.highlights.join() !== d.data.highlights.join();
    if (el.type === 'badge' && d.type === 'badge') return el.data.text !== d.data.text;
    if (el.type === 'image' && d.type === 'image') return el.data.src !== d.data.src;
    return false;
  };

  const byRole = new Map<ElementRole, PosterElement>();
  for (const el of poster.elements) if (!byRole.has(el.role) && isUserContent(el)) byRole.set(el.role, el);

  const elements = instantiateElements(t.id).map((el) => {
    const prev = CARRY_ROLES.has(el.role) ? byRole.get(el.role) : undefined;
    if (!prev) return el;
    if (el.type === 'text' && prev.type === 'text') {
      return { ...el, data: { ...el.data, text: prev.data.text, highlights: [...prev.data.highlights] } };
    }
    if (el.type === 'badge' && prev.type === 'badge') {
      return { ...el, data: { ...el.data, text: prev.data.text } };
    }
    if (el.type === 'image' && prev.type === 'image' && prev.data.src) {
      const { src, fit, zoom, panX, panY } = prev.data;
      return { ...el, visible: true, data: { ...el.data, src, fit, zoom, panX, panY } };
    }
    return el;
  });

  return { ...poster, templateId: t.id, ratio: t.defaultRatio, background: t.background, elements, updatedAt: Date.now() };
}

/** Whether the user has customised positions or styles (so switching templates would lose work). */
export function hasLayoutEdits(poster: Poster): boolean {
  return poster.elements.some((el) => Object.keys(el.userFrames).length > 0);
}
