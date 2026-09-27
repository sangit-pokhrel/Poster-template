import { describe, expect, it } from 'vitest';
import { BRAND_IDS } from '../data/brands';
import { applyTemplate, createPoster } from '../services/templateService';
import type { AdKind } from '../types/template';
import { markup } from './builders';
import { ADS, CATEGORIES, CLASSIC_ADS, DESIGN_SYSTEMS, FEATURED_PER_DAY, KIND_LABEL, STUDIO_ADS, adsIn, buildLayout, featuredToday, getAd } from './registry';
import { STUDIO } from './studio';
import { POSTER_ICONS } from '../render/icons';

describe('ad library', () => {
  it('has 100 brand classics and 62 studio designs with unique ids', () => {
    expect(CLASSIC_ADS).toHaveLength(100);
    expect(STUDIO_ADS).toHaveLength(62);
    expect(new Set(ADS.map((a) => a.id)).size).toBe(ADS.length);
  });

  it('fills every category with at least 5 ads', () => {
    for (const c of CATEGORIES) expect(adsIn(c.id).length, c.id).toBeGreaterThanOrEqual(5);
  });

  it('filters by collection', () => {
    expect(adsIn('studio')).toHaveLength(62);
    expect(adsIn('classic')).toHaveLength(100);
    expect(adsIn('all')).toHaveLength(162);
    expect(adsIn('today', '', { brandId: 'nepal-scholar', iso: '2026-09-27' })).toHaveLength(FEATURED_PER_DAY);
  });

  it('uses every layout kind', () => {
    const kinds = new Set(ADS.map((a) => a.kind));
    expect([...kinds].sort()).toEqual((Object.keys(KIND_LABEL) as AdKind[]).sort());
  });

  it('only references icons that exist', () => {
    for (const a of ADS) for (const it of a.content.items ?? []) expect(it.icon in POSTER_ICONS, `${a.id}: ${it.icon}`).toBe(true);
  });

  it('searches names and headlines', () => {
    expect(adsIn('all', 'spss').some((a) => a.id === 'analysis-spss')).toBe(true);
    expect(adsIn('offers', 'dashain').map((a) => a.id)).toEqual(['offer-dashain']);
  });
});

describe('design systems', () => {
  it('each brand implements every kind', () => {
    for (const b of BRAND_IDS) expect(Object.keys(DESIGN_SYSTEMS[b]).sort()).toEqual(Object.keys(KIND_LABEL).sort());
  });

  const cases = ADS.flatMap((a) => BRAND_IDS.map((b) => [a.id, b] as const));

  it.each(cases)('%s in %s is well-formed', (adId, brandId) => {
    const layout = buildLayout(adId, brandId);
    const ad = getAd(adId);
    const ids = layout.elements.map((e) => e.id);
    expect(new Set(ids).size, 'unique ids').toBe(ids.length);
    expect(layout.elements.some((e) => e.type === 'logo'), 'has a logo').toBe(true);
    if (ad.content.cta) expect(ids, 'has CTA').toContain('cta');
    if (ad.content.heading) expect(ids, 'has heading').toContain('heading');
    for (const e of layout.elements) {
      const { x, y, w, h } = e.frame;
      expect(w, `${e.id} w`).toBeGreaterThan(0);
      expect(h, `${e.id} h`).toBeGreaterThan(0);
      // Decorations (glows, facets) may bleed off-canvas; content must not.
      if (e.type !== 'shape' && e.role !== 'decoration') {
        expect(x, `${e.id} x`).toBeGreaterThanOrEqual(-0.001);
        expect(y, `${e.id} y`).toBeGreaterThanOrEqual(-0.001);
        expect(x + w, `${e.id} right`).toBeLessThanOrEqual(1.001);
        expect(y + h, `${e.id} bottom`).toBeLessThanOrEqual(1.001);
      }
    }
  });

  it('gives each brand a genuinely different classic layout (not just colours)', () => {
    const geometry = (b: (typeof BRAND_IDS)[number]) => JSON.stringify(buildLayout('thesis-support', b).elements.map((e) => [e.id, e.frame]));
    const [a, b, c] = BRAND_IDS.map(geometry);
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    expect(a).not.toBe(c);
  });
});

describe('studio designs (from design-references/)', () => {
  it('rebuilds every unique reference (1–31) in exactly two variations', () => {
    const perRef = new Map<number, number>();
    for (const e of STUDIO) perRef.set(e.ref, (perRef.get(e.ref) ?? 0) + 1);
    expect([...perRef.keys()].sort((a, b) => a - b)).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
    for (const [ref, n] of perRef) expect(n, `reference ${ref}`).toBe(2);
  });

  it('gives each Facebook page at least 50 designs (150+ in total)', () => {
    const perBrand = STUDIO_ADS.length + Object.keys(KIND_LABEL).length;
    expect(perBrand).toBeGreaterThanOrEqual(50);
    expect(perBrand * BRAND_IDS.length).toBeGreaterThanOrEqual(150);
  });

  it('shares one layout across brands, and the two variations of a reference differ', () => {
    for (const e of STUDIO) expect(buildLayout(e.ad.id, 'nepal-scholar')).toBe(buildLayout(e.ad.id, 'artova-research'));
    const look = (id: string) => JSON.stringify(buildLayout(id, 'nepal-scholar'));
    for (let i = 0; i < STUDIO.length; i += 2) {
      const a = STUDIO[i];
      const b = STUDIO[i + 1];
      if (!a || !b) continue;
      expect(a.ref).toBe(b.ref);
      expect(look(a.ad.id), a.ad.id).not.toBe(look(b.ad.id));
    }
  });

  it('colours studio designs only with theme tokens, white or neutral tints', () => {
    const allowed = /^(brand\.(primary|secondary|accent|pop|ink|paper)(\/\d+)?|#ffffff|rgba\((255, 255, 255|0, 0, 0), [\d.]+\))$/;
    for (const a of STUDIO_ADS) {
      const json = JSON.stringify(buildLayout(a.id, 'nepal-scholar'));
      for (const m of json.matchAll(/"(?:fill|color|highlightColor|bulletColor|borderColor|stroke|cardColor)":"([^"]+)"/g)) {
        expect(m[1], a.id).toMatch(allowed);
      }
    }
  });
});

describe('daily featured designs', () => {
  it('picks 15 different studio designs, a new set each day and per page', () => {
    const ids = (b: (typeof BRAND_IDS)[number], iso: string) => featuredToday(b, iso).map((a) => a.id);
    const today = ids('nepal-scholar', '2026-09-27');
    expect(new Set(today).size).toBe(FEATURED_PER_DAY);
    expect(featuredToday('nepal-scholar', '2026-09-27').every((a) => a.design)).toBe(true);
    expect(ids('nepal-scholar', '2026-09-27')).toEqual(today);
    expect(ids('nepal-scholar', '2026-09-28')).not.toEqual(today);
    expect(ids('artova-research', '2026-09-27')).not.toEqual(today);
  });
});

describe('markup', () => {
  it('turns *marked* words into highlight indices across lines', () => {
    expect(markup('Finish your *thesis* with *expert guidance*')).toEqual({ text: 'Finish your thesis with expert guidance', highlights: [2, 4, 5] });
    expect(markup('a *b*\nc')).toEqual({ text: 'a b\nc', highlights: [1] });
  });
});

describe('switching', () => {
  it('re-renders the same ad in another brand design and keeps edited text', () => {
    const p = createPoster('thesis-support', 'nepal-scholar');
    const h = p.elements.find((e) => e.id === 'heading');
    if (h?.type !== 'text') throw new Error('fixture');
    h.data.text = 'My own headline';
    const next = applyTemplate(p, 'thesis-support', 'artova-research');
    const h2 = next.elements.find((e) => e.id === 'heading');
    expect(next.brandId).toBe('artova-research');
    expect(h2?.type === 'text' && h2.data.text).toBe('My own headline');
    expect(JSON.stringify(next.elements.map((e) => e.frame))).not.toBe(JSON.stringify(p.elements.map((e) => e.frame)));
  });

  it('does not carry sample content into another ad', () => {
    const p = createPoster('thesis-support', 'thesis-companion');
    const next = applyTemplate(p, 'analysis-spss');
    const h = next.elements.find((e) => e.id === 'heading');
    expect(h?.type === 'text' && h.data.text).toBe(markup(getAd('analysis-spss').content.heading ?? '').text);
  });

  it('carries a user-uploaded photo into another ad', () => {
    const p = createPoster('thesis-support', 'nepal-scholar');
    const ph = p.elements.find((e) => e.role === 'photo');
    if (ph?.type !== 'image') throw new Error('fixture');
    ph.data.src = 'asset:abc';
    const next = applyTemplate(p, 'abroad-sop');
    const ph2 = next.elements.find((e) => e.role === 'photo');
    expect(ph2?.type === 'image' && ph2.data.src).toBe('asset:abc');
  });
});

describe('markup punctuation', () => {
  it('closes highlights before trailing punctuation and after opening quotes', () => {
    expect(markup('“I finally understand *which test to use and why*. Great.”')).toEqual({
      text: '“I finally understand which test to use and why. Great.”',
      highlights: [3, 4, 5, 6, 7, 8],
    });
    expect(markup('“*Great* work”')).toEqual({ text: '“Great work”', highlights: [0] });
  });

  it('leaves no stray asterisks in any ad', () => {
    for (const a of ADS) {
      for (const t of [a.content.heading, a.content.quote]) {
        if (t) expect(markup(t).text, a.id).not.toContain('*');
      }
    }
  });
});
