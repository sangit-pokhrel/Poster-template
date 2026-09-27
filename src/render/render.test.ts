import { describe, expect, it } from 'vitest';
import { BRANDS } from '../data/brands';
import { effectiveFrame, elementRect, pxToFrame, frameToPx } from '../utils/aspectRatio';
import { buildLayout } from '../design/registry';
import { luminance, resolveColor } from './color';
import { drawElementContent } from './drawPoster';
import type { Drawable } from './drawPoster';
import { resolveTokens } from './env';
import { placeImage } from './image';
import { buildParagraphs, layoutText, tokenizeWords } from './text';

const brand = BRANDS['nepal-scholar'];
const env = { brand: { ...brand, phone: '', website: 'nepalscholar.test' }, dateText: '९ आश्विन २०८३' };

/** Fake monospace font: every character is 0.5 × size wide. */
const measure = (t: string, size: number) => t.length * size * 0.5;
const para = (s: string) => [s.split(' ').map((text) => ({ text, highlighted: false }))];

describe('tokenizeWords', () => {
  it('indexes words across paragraphs', () => {
    expect(tokenizeWords('a b\n\nc').map((w) => [w.index, w.text, w.paragraph])).toEqual([
      [0, 'a', 0],
      [1, 'b', 0],
      [2, 'c', 2],
    ]);
  });
});

describe('layoutText', () => {
  it('wraps greedily at the box width', () => {
    const l = layoutText({ paragraphs: para('aaaa bbbb cccc'), boxWidth: 100, boxHeight: 1000, fontSize: 20, lineHeight: 1, autoFit: false, measure });
    expect(l.lines.map((x) => x.words.map((w) => w.text).join(' '))).toEqual(['aaaa bbbb', 'cccc']);
  });

  it('auto-fit shrinks the font until the text fits the box height', () => {
    const input = { paragraphs: para('aaaa bbbb cccc dddd'), boxWidth: 100, boxHeight: 30, fontSize: 20, lineHeight: 1, autoFit: true, measure };
    const l = layoutText(input);
    expect(l.fontSize).toBeLessThan(20);
    expect(l.height).toBeLessThanOrEqual(30.5);
  });

  it('never shrinks below 50 %', () => {
    const l = layoutText({ paragraphs: para('x'.repeat(200)), boxWidth: 10, boxHeight: 10, fontSize: 40, lineHeight: 1, autoFit: true, measure });
    expect(l.fontSize).toBeGreaterThanOrEqual(20);
  });
});

describe('resolveTokens', () => {
  it('substitutes brand and date tokens', () => {
    expect(resolveTokens('{brand} — {date}', env)).toBe('Nepal Scholar — ९ आश्विन २०८३');
  });
  it('drops empty fields together with their separator', () => {
    expect(resolveTokens('{handle}  •  {phone}  •  {website}', env)).toBe('Nepal Scholar · Kathmandu  •  nepalscholar.test');
  });
  it('leaves lines without tokens untouched', () => {
    expect(resolveTokens('A | B • C', env)).toBe('A | B • C');
  });
});

describe('resolveColor', () => {
  it('maps brand tokens and alpha', () => {
    expect(resolveColor('brand.accent', brand)).toBe(brand.palette.accent);
    expect(resolveColor('brand.primary/50', brand)).toBe('rgba(31, 42, 60, 0.5)');
    expect(resolveColor('#123456', brand)).toBe('#123456');
  });
});

describe('placeImage', () => {
  it('cover fills the frame; contain fits inside it', () => {
    const cover = placeImage(2000, 1000, 500, 500, { fit: 'cover', zoom: 1, panX: 0, panY: 0 });
    expect([cover.w, cover.h]).toEqual([1000, 500]);
    expect(cover.x).toBe(-250);
    const contain = placeImage(2000, 1000, 500, 500, { fit: 'contain', zoom: 1, panX: 0, panY: 0 });
    expect([contain.w, contain.h]).toEqual([500, 250]);
  });
  it('applies zoom and pan', () => {
    const p = placeImage(1000, 1000, 500, 500, { fit: 'cover', zoom: 2, panX: 1, panY: 0 });
    expect(p.w).toBe(1000);
    expect(p.x).toBe(-250 + 250);
  });
});

describe('frames', () => {
  const el = { frame: { x: 0.1, y: 0.2, w: 0.5, h: 0.3 }, ratioFrames: { '16:9': { y: 0.5 } }, userFrames: {} };
  it('applies template ratio adjustments, then user placement', () => {
    expect(effectiveFrame(el, '4:5')).toEqual(el.frame);
    expect(effectiveFrame(el, '16:9')).toEqual({ ...el.frame, y: 0.5 });
    const moved = { ...el, userFrames: { '4:5': { x: 0, y: 0, w: 1, h: 1 } } };
    expect(effectiveFrame(moved, '4:5')).toEqual({ x: 0, y: 0, w: 1, h: 1 });
  });
  it('keeps circles circular across ratios', () => {
    const circle = { frame: { x: 0.3, y: 0.3, w: 0.4, h: 0.32 }, ratioFrames: {}, userFrames: {}, aspect: 1 };
    const r = elementRect(circle, '16:9');
    expect(r.w).toBeCloseTo(r.h);
  });
  it('round-trips px ↔ normalized', () => {
    const f = pxToFrame({ x: 108, y: 135, w: 540, h: 270 }, 1080, 1350);
    expect(frameToPx(f, 1080, 1350)).toEqual({ x: 108, y: 135, w: 540, h: 270 });
  });
});

describe('buildParagraphs', () => {
  const base = { highlights: [1], uppercase: false } as const;
  const fullEnv = { ...env, images: { get: () => null }, mode: 'export' as const };
  it('drops empty token fields with their separators in footer lines', () => {
    const d = { ...base, text: '{handle}  •  {phone}  •  {website}' } as unknown as Parameters<typeof buildParagraphs>[0];
    expect(buildParagraphs(d, fullEnv)[0]?.map((w) => w.text).join(' ')).toBe('Nepal Scholar · Kathmandu • nepalscholar.test');
  });
  it('keeps highlight flags on plain lines', () => {
    const d = { ...base, text: 'one two\nthree' } as unknown as Parameters<typeof buildParagraphs>[0];
    expect(buildParagraphs(d, fullEnv).map((p) => p.map((w) => w.highlighted))).toEqual([[false, true], [false]]);
  });
});

describe('tokens in prose', () => {
  const fullEnv = { ...env, images: { get: () => null }, mode: 'export' as const };
  it('highlights every word a highlighted {brand} token becomes', () => {
    const d = { highlights: [2], uppercase: false, text: 'Why choose {brand}?' } as unknown as Parameters<typeof buildParagraphs>[0];
    expect(buildParagraphs(d, fullEnv)[0]).toEqual([
      { text: 'Why', highlighted: false },
      { text: 'choose', highlighted: false },
      { text: 'Nepal', highlighted: true },
      { text: 'Scholar?', highlighted: true },
    ]);
  });
});

describe('brand.pop', () => {
  it('darkens a light accent until it reads on white, and leaves a dark one alone', () => {
    const gold = { ...brand, palette: { ...brand.palette, accent: '#f2c94c' } };
    expect(luminance(resolveColor('brand.pop', gold))).toBeLessThan(luminance('#f2c94c'));
    expect(1.05 / (luminance(resolveColor('brand.pop', gold)) + 0.05)).toBeGreaterThanOrEqual(3.4);
    const navy = { ...brand, palette: { ...brand.palette, accent: '#1f2a3c' } };
    expect(resolveColor('brand.pop', navy)).toBe('#1f2a3c');
  });
});

describe('showIf', () => {
  it('skips elements whose brand contact field is empty', () => {
    const calls: string[] = [];
    const ctx = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? () => { calls.push(k); } : undefined) }) as unknown as CanvasRenderingContext2D;
    const el = { ...buildLayout('studio-why-choose', 'nepal-scholar').elements.find((e) => e.id === 'contact-phone-icon') } as Drawable;
    drawElementContent(ctx, el, 40, 40, { ...env, images: { get: () => null }, mode: 'export' });
    expect(calls).toHaveLength(0);
  });
});
