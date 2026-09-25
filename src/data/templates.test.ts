import { describe, expect, it } from 'vitest';
import { applyTemplate, createPoster, hasLayoutEdits } from '../services/templateService';
import type { TemplateCategory } from '../types/template';
import { CATEGORIES, TEMPLATES, getTemplate } from './templateRegistry';

describe('template registry', () => {
  it('ships 20 templates with unique ids', () => {
    expect(TEMPLATES).toHaveLength(20);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(20);
  });

  it('covers every filter category', () => {
    const cats = CATEGORIES.map((c) => c.id).filter((c): c is TemplateCategory => c !== 'all');
    for (const c of cats) expect(TEMPLATES.some((t) => t.category === c), c).toBe(true);
  });

  it.each(TEMPLATES.map((t) => [t.id, t] as const))('%s is well-formed', (_id, t) => {
    const ids = t.elements.map((e) => e.id);
    expect(new Set(ids).size, 'unique element ids').toBe(ids.length);
    expect(t.elements.some((e) => e.type === 'logo'), 'has a brand logo').toBe(true);
    for (const e of t.elements) {
      const { x, y, w, h } = e.frame;
      expect(w, `${e.id} width`).toBeGreaterThan(0);
      expect(h, `${e.id} height`).toBeGreaterThan(0);
      // decorative shapes may bleed off-canvas; content must stay on it
      if (e.type !== 'shape') {
        expect(x, `${e.id} x`).toBeGreaterThanOrEqual(-0.001);
        expect(y, `${e.id} y`).toBeGreaterThanOrEqual(-0.001);
        expect(x + w, `${e.id} right`).toBeLessThanOrEqual(1.001);
        expect(y + h, `${e.id} bottom`).toBeLessThanOrEqual(1.001);
      }
    }
  });

  it('falls back to the default template for unknown ids', () => {
    expect(getTemplate('nope').id).toBe('academic-scholarship');
  });
});

describe('template service', () => {
  it('creates posters with independent element copies', () => {
    const a = createPoster('news-classic', 'nepal-scholar');
    const b = createPoster('news-classic', 'nepal-scholar');
    const ta = a.elements.find((e) => e.type === 'text');
    if (ta?.type === 'text') ta.data.text = 'changed';
    const tb = b.elements.find((e) => e.id === ta?.id);
    expect(tb?.type === 'text' && tb.data.text).not.toBe('changed');
    expect(a.ratio).toBe('4:5');
  });

  it('carries text, highlights and photos over when switching templates', () => {
    const p = createPoster('news-classic', 'thesis-companion');
    const heading = p.elements.find((e) => e.role === 'heading');
    const photo = p.elements.find((e) => e.role === 'photo');
    if (heading?.type !== 'text' || photo?.type !== 'image') throw new Error('fixture');
    heading.data.text = 'My own headline';
    heading.data.highlights = [1];
    photo.data.src = 'asset:abc';

    const next = applyTemplate(p, 'trending-viral');
    const h2 = next.elements.find((e) => e.role === 'heading');
    const p2 = next.elements.find((e) => e.role === 'photo');
    expect(next.templateId).toBe('trending-viral');
    expect(next.brandId).toBe('thesis-companion');
    expect(h2?.type === 'text' && h2.data.text).toBe('My own headline');
    expect(h2?.type === 'text' && h2.data.highlights).toEqual([1]);
    expect(p2?.type === 'image' && p2.data.src).toBe('asset:abc');
  });

  it('detects user layout edits', () => {
    const p = createPoster('photo-full', 'nepal-scholar');
    expect(hasLayoutEdits(p)).toBe(false);
    p.elements[0]!.userFrames['4:5'] = { x: 0, y: 0, w: 1, h: 1 };
    expect(hasLayoutEdits(p)).toBe(true);
  });
});

describe('template switching', () => {
  it('does not carry the previous template’s sample content', () => {
    const p = createPoster('academic-scholarship', 'nepal-scholar');
    const next = applyTemplate(p, 'event-webinar');
    const h = next.elements.find((e) => e.role === 'heading');
    const def = getTemplate('event-webinar').elements.find((e) => e.role === 'heading');
    expect(h?.type === 'text' && def?.type === 'text' && h.data.text === def.data.text).toBe(true);
  });
});
