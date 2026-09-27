import { describe, expect, it } from 'vitest';
import { BRANDS, BRAND_IDS } from '../data/brands';
import { hexToHsl, luminance } from '../render/color';
import { THEME_COUNT, brandThemes, dailyThemeIndex, dayNumber, themeIndexFor } from './themes';

describe('colour themes', () => {
  it.each(BRAND_IDS)('%s has 15 distinct themes, theme 0 = the logo palette', (id) => {
    const themes = brandThemes(BRANDS[id]);
    expect(themes).toHaveLength(THEME_COUNT);
    expect(themes[0]?.palette).toEqual(BRANDS[id].palette);
    expect(new Set(themes.map((t) => `${t.palette.primary}|${t.palette.accent}`)).size).toBe(THEME_COUNT);
    expect(new Set(themes.map((t) => t.name)).size).toBe(THEME_COUNT);
  });

  it.each(BRAND_IDS)('%s generated themes keep a dark base and a readable accent', (id) => {
    for (const t of brandThemes(BRANDS[id]).slice(1)) {
      expect(luminance(t.palette.primary), t.name).toBeLessThan(0.08);
      expect(luminance(t.palette.accent), t.name).toBeGreaterThanOrEqual(0.19);
      expect(luminance(t.palette.paper), t.name).toBeGreaterThan(0.85);
    }
  });

  it('follows colours read from a dropped logo', () => {
    const withLogo = brandThemes(BRANDS['thesis-companion'], ['#0a7d3b', '#f5c400']);
    expect(withLogo.map((t) => t.palette.accent)).not.toEqual(brandThemes(BRANDS['thesis-companion']).map((t) => t.palette.accent));
    expect(withLogo).toHaveLength(THEME_COUNT);
  });

  it('works for a monochrome palette', () => {
    const grey = { palette: { primary: '#111111', secondary: '#333333', accent: '#777777', ink: '#000000', paper: '#ffffff' }, themeSeeds: [] };
    expect(brandThemes(grey)).toHaveLength(THEME_COUNT);
  });
});

describe('daily rotation', () => {
  it('cycles through all 15 themes in 15 days', () => {
    const start = dayNumber('2026-09-27');
    const seen = new Set<number>();
    for (let d = 0; d < THEME_COUNT; d++) {
      const iso = new Date((start + d) * 86_400_000).toISOString().slice(0, 10);
      seen.add(dailyThemeIndex('thesis-companion', iso));
    }
    expect(seen.size).toBe(THEME_COUNT);
  });

  it('gives the three pages different themes on the same day', () => {
    const today = BRAND_IDS.map((b) => dailyThemeIndex(b, '2026-09-27'));
    expect(new Set(today).size).toBe(3);
  });

  it('respects a pinned theme', () => {
    expect(themeIndexFor(4, 'nepal-scholar', '2026-09-27')).toBe(4);
    expect(themeIndexFor('auto', 'nepal-scholar', '2026-09-27')).toBe(dailyThemeIndex('nepal-scholar', '2026-09-27'));
  });
});

describe('Nepal Scholar colour family', () => {
  it('keeps every theme yellow, white and black', () => {
    for (const t of brandThemes(BRANDS['nepal-scholar'])) {
      const accent = hexToHsl(t.palette.accent);
      expect(accent.h, t.name).toBeGreaterThanOrEqual(35);
      expect(accent.h, t.name).toBeLessThanOrEqual(55);
      expect(luminance(t.palette.primary), t.name).toBeLessThan(0.02);
      expect(t.palette.paper).toBe('#ffffff');
    }
  });
});
