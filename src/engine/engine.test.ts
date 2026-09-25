import { describe, expect, it } from 'vitest';
import { canvasSize } from './constants';
import { tokenizeHeadline, wrapWords } from './primitives/headline';
import { containSize, coverSize } from './primitives/photo';
import { collageCells } from './templates/framed';
import { TEMPLATES, getTemplate, isTemplateId } from './templates';

/** Fake monospace measure: 10px per character, space = 10px. */
const measure = (t: string) => t.length * 10;
const words = (s: string) => tokenizeHeadline(s).map((text) => ({ text, highlighted: false }));

describe('tokenizeHeadline', () => {
  it('splits on any whitespace and ignores padding', () => {
    expect(tokenizeHeadline('  एआई   विकास\nसुस्त ')).toEqual(['एआई', 'विकास', 'सुस्त']);
  });
  it('returns [] for blank input', () => {
    expect(tokenizeHeadline('   ')).toEqual([]);
  });
});

describe('wrapWords', () => {
  it('keeps words on one line while they fit', () => {
    const lines = wrapWords(words('aa bb cc'), measure, 80);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.width).toBe(80);
  });
  it('breaks before the word that would overflow', () => {
    const lines = wrapWords(words('aaaa bbbb cccc'), measure, 90);
    expect(lines.map((l) => l.words.map((w) => w.text).join(' '))).toEqual(['aaaa bbbb', 'cccc']);
  });
  it('never splits a single over-long word', () => {
    const lines = wrapWords(words('supercalifragilistic ok'), measure, 50);
    expect(lines[0]?.words[0]?.text).toBe('supercalifragilistic');
    expect(lines).toHaveLength(2);
  });
  it('preserves highlight flags', () => {
    const input = [
      { text: 'a', highlighted: true },
      { text: 'b', highlighted: false },
    ];
    expect(wrapWords(input, measure, 1000)[0]?.words).toEqual(input);
  });
});

describe('photo fitting', () => {
  it('cover fills the box and overflows on one axis', () => {
    expect(coverSize(100, 100, 2)).toEqual({ w: 200, h: 100 });
    expect(coverSize(100, 100, 0.5)).toEqual({ w: 100, h: 200 });
  });
  it('contain fits inside the box', () => {
    expect(containSize(100, 100, 2)).toEqual({ w: 100, h: 50 });
    expect(containSize(100, 100, 0.5)).toEqual({ w: 50, h: 100 });
  });
});

describe('collageCells', () => {
  const area = { x: 40, y: 120, width: 1000, height: 460 };
  it('uses the full area for one photo', () => {
    expect(collageCells(area, 1)).toEqual([area]);
  });
  it('splits 3 photos 58/42 with a stacked right column', () => {
    const [left, topRight, bottomRight] = collageCells(area, 3);
    expect(left?.width).toBeCloseTo(994 * 0.58);
    expect(topRight?.height).toBe(227);
    expect(bottomRight?.y).toBe(120 + 227 + 6);
  });
  it('returns a 2×2 grid for 4 photos', () => {
    expect(collageCells(area, 4)).toHaveLength(4);
  });
});

describe('template registry', () => {
  it('has exactly 20 templates with unique ids', () => {
    expect(TEMPLATES).toHaveLength(20);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(20);
  });
  it('falls back to classic for unknown ids', () => {
    expect(getTemplate('nope').id).toBe('classic');
    expect(isTemplateId('nope')).toBe(false);
    expect(isTemplateId('factcheck')).toBe(true);
  });
});

describe('canvas sizes', () => {
  it('matches the reference export sizes', () => {
    expect(canvasSize('1:1')).toEqual({ width: 1080, height: 1080 });
    expect(canvasSize('4:5')).toEqual({ width: 1080, height: 1350 });
    expect(canvasSize('16:9')).toEqual({ width: 1080, height: 608 });
    expect(canvasSize('9:16')).toEqual({ width: 1080, height: 1920 });
  });
});
