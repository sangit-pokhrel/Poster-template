/**
 * Colour themes. Every brand gets 15 palettes generated from its logo colours
 * (palette + `themeSeeds` + colours read from a dropped logo file). Shared
 * designs only use palette tokens, so one layout reads as a different poster
 * in each theme. One theme is picked per day (`dailyThemeIndex`); a poster can
 * pin a theme instead.
 */
import { hexToHsl, hslToHex, luminance } from '../render/color';
import type { Hsl } from '../render/color';
import type { Brand, BrandId, BrandPalette } from '../types/brand';

export const THEME_COUNT = 15;

export interface ColorTheme {
  index: number;
  name: string;
  palette: BrandPalette;
}

/* ------------------------------------------------------------------ */
/* HSL helpers                                                         */
/* ------------------------------------------------------------------ */

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** Role-safe versions of a colour, so every theme stays readable. */
/** Dark enough for white text, whatever the hue (cyan and yellow need a lower lightness than blue). */
function asDark(c: Hsl): string {
  const s = c.s < 8 ? c.s : clamp(c.s, 45, 80);
  let l = clamp(c.l, 13, 24);
  let out = hslToHex({ h: c.h, s, l });
  while (luminance(out) >= 0.06 && l > 8) {
    l -= 2;
    out = hslToHex({ h: c.h, s, l });
  }
  return out;
}
const asMid = (c: Hsl): string => hslToHex({ h: c.h, s: c.s < 8 ? c.s : clamp(c.s, 50, 80), l: clamp(c.l, 34, 46) });
/** Bright enough to read as text on the dark base (lightened until it is). */
function asPop(c: Hsl): string {
  const s = clamp(c.s, 60, 85);
  let l = clamp(c.l, 50, 68);
  let out = hslToHex({ h: c.h, s, l });
  while (luminance(out) < 0.2 && l < 74) {
    l += 3;
    out = hslToHex({ h: c.h, s, l });
  }
  return out;
}
const asInk = (c: Hsl): string => hslToHex({ h: c.h, s: c.s < 8 ? 0 : clamp(c.s * 0.6, 20, 45), l: 11 });
const asPaper = (c: Hsl): string => hslToHex({ h: c.h, s: c.s < 8 ? 0 : clamp(c.s * 0.5, 25, 60), l: 97 });

/** Yellow/olive hues turn muddy when darkened, so they only ever act as the pop colour. */
const muddyAsDark = (c: Hsl) => c.s >= 8 && c.h >= 35 && c.h <= 80;
const distinct = (a: Hsl, b: Hsl) => (a.s < 8 || b.s < 8 ? a.s < 8 !== b.s < 8 : hueGap(a.h, b.h) > 30 || Math.abs(a.l - b.l) >= 25);

/* ------------------------------------------------------------------ */
/* Names                                                               */
/* ------------------------------------------------------------------ */

function colorName(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  if (s < 10) return l < 30 ? 'Charcoal' : l > 80 ? 'Silver' : 'Slate';
  const dark = l < 30;
  if (h < 12 || h >= 345) return dark ? 'Maroon' : 'Crimson';
  if (h < 30) return dark ? 'Rust' : 'Coral';
  if (h < 48) return dark ? 'Bronze' : 'Gold';
  if (h < 68) return dark ? 'Olive' : 'Sunflower';
  if (h < 150) return dark ? 'Forest' : 'Emerald';
  if (h < 185) return dark ? 'Deep Teal' : 'Teal';
  if (h < 205) return dark ? 'Ocean' : 'Cyan';
  if (h < 232) return dark ? 'Navy' : 'Azure';
  if (h < 255) return dark ? 'Midnight' : 'Royal Blue';
  if (h < 285) return dark ? 'Indigo' : 'Violet';
  if (h < 320) return dark ? 'Plum' : 'Orchid';
  return dark ? 'Wine' : 'Rose';
}

/* ------------------------------------------------------------------ */
/* Generation                                                          */
/* ------------------------------------------------------------------ */

/** Distinct seed colours (most important first); light and dark tones of one hue both count. */
function seedColors(colors: string[]): Hsl[] {
  const out: Hsl[] = [];
  for (const c of colors) {
    const hsl = hexToHsl(c);
    const dup = out.some((o) => (hsl.s < 8 ? o.s < 8 : o.s >= 8 && hueGap(o.h, hsl.h) < 14 && Math.abs(o.l - hsl.l) < 25));
    if (!dup) out.push(hsl);
  }
  return out;
}

const cache = new Map<string, ColorTheme[]>();

/**
 * The 15 themes for a brand. Theme 0 is the brand palette exactly as set in the
 * brand kit; the rest pair a dark base with a contrasting pop colour, using the
 * logo's own colours first (including light/dark tones of the same hue), then
 * gentle harmonies of the main logo hues (complement, analogous, split).
 */
export function brandThemes(brand: Pick<Brand, 'palette' | 'themeSeeds'>, logoColors: readonly string[] = []): ColorTheme[] {
  const key = JSON.stringify([brand.palette, brand.themeSeeds, logoColors]);
  const hit = cache.get(key);
  if (hit) return hit;

  const p = brand.palette;
  const seeds = seedColors([...logoColors, p.primary, p.accent, p.secondary, ...brand.themeSeeds]);
  const chroma = seeds.filter((s) => s.s >= 8);
  const bases = chroma.length ? chroma.slice(0, 2) : [hexToHsl(p.accent)];
  // Lime/green harmonies clash with academic brands unless the logo itself has green.
  const logoHasGreen = chroma.some((c) => c.h >= 62 && c.h <= 165);
  const harmonies = bases
    .flatMap((b) => [180, 30, -30, 150, -150, 60, -60, 120, -120, 90, -90].map((d) => ({ h: (b.h + d + 360) % 360, s: clamp(b.s, 55, 80), l: 55 })))
    .filter((h) => logoHasGreen || h.h < 62 || h.h > 165);

  const themes: ColorTheme[] = [{ index: 0, name: 'Logo colours', palette: { ...p } }];
  const seen = new Set<string>([`${p.primary}|${p.accent}`]);
  const names = new Map<string, number>([['Logo colours', 1]]);
  const push = (dark: Hsl, pop: Hsl, mid: Hsl) => {
    if (themes.length >= THEME_COUNT || muddyAsDark(dark) || pop.s < 8) return;
    const primary = asDark(dark);
    const accent = asPop(pop);
    const id = `${primary}|${accent}`;
    if (seen.has(id)) return;
    seen.add(id);
    const base = `${colorName(primary)} & ${colorName(accent)}`;
    const n = (names.get(base) ?? 0) + 1;
    names.set(base, n);
    themes.push({
      index: themes.length,
      name: n > 1 ? `${base} ${n}` : base,
      palette: { primary, secondary: asMid(muddyAsDark(mid) ? dark : mid), accent, ink: asInk(dark), paper: asPaper(dark) },
    });
  };

  // 1. Every pair of logo colours that contrast (hue or tone).
  for (const d of seeds) for (const a of seeds) if (d !== a && distinct(d, a)) push(d, a, d);
  // 2. Logo colours against gentle harmonies of the main logo hues.
  for (const d of seeds) for (const a of harmonies) if (d.s < 8 || hueGap(d.h, a.h) > 30) push(d, a, a);
  // 3. Tonal fallback: dark and bright versions of one hue (always distinct).
  for (const h of [...chroma, ...harmonies]) push(h, { ...h, h: (h.h + 12) % 360, l: 62 }, h);

  cache.set(key, themes);
  return themes;
}

/* ------------------------------------------------------------------ */
/* Daily rotation                                                      */
/* ------------------------------------------------------------------ */

const OFFSET: Record<BrandId, number> = { 'nepal-scholar': 0, 'thesis-companion': 5, 'artova-research': 10 };

/** Days since 1970-01-01 for an ISO date (local calendar day). */
export function dayNumber(iso: string): number {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Today's theme for a brand: rotates through all 15, and the three pages never share a day's theme. */
export function dailyThemeIndex(brandId: BrandId, iso: string): number {
  return (dayNumber(iso) + OFFSET[brandId]) % THEME_COUNT;
}

/** The poster's theme: pinned, or the daily one. */
export function themeIndexFor(theme: 'auto' | number, brandId: BrandId, iso: string): number {
  return theme === 'auto' ? dailyThemeIndex(brandId, iso) : clamp(Math.floor(theme), 0, THEME_COUNT - 1);
}

/** Deterministic pick of `count` items for a day (different set each day). */
export function dailyPick<T>(items: readonly T[], iso: string, count: number, salt = 0): T[] {
  let seed = (dayNumber(iso) * 2654435761 + salt * 97) >>> 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr.slice(0, count);
}
