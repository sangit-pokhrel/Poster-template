import type { Brand, BrandPalette } from '../types/brand';
import type { ColorValue, Fill } from '../types/element';

const PALETTE_KEYS = new Set<keyof BrandPalette>(['primary', 'secondary', 'accent', 'ink', 'paper']);

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m?.[1] ? parseInt(m[1], 16) : 0;
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const lig = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + (((h % 360) + 360) % 360) / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${[f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`;
}

/** WCAG contrast ratio of a colour against white. */
const contrastOnWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

const popCache = new Map<string, string>();

/** The accent, darkened just enough to read as text on white (e.g. gold → deep gold). */
export function readableOnLight(hex: string): string {
  const hit = popCache.get(hex);
  if (hit) return hit;
  const c = hexToHsl(hex);
  let out = hex;
  for (let l = c.l; l > 10 && contrastOnWhite(out) < 3.4; l -= 3) out = hslToHex({ ...c, l });
  popCache.set(hex, out);
  return out;
}

/**
 * Resolves brand tokens: `brand.accent` → palette colour, `brand.primary/40` → 40 % alpha.
 * `brand.pop` is the accent made readable on light backgrounds.
 * Literal colours pass through untouched.
 */
export function resolveColor(value: ColorValue, brand: Brand): string {
  const m = /^brand\.(\w+)(?:\/(\d{1,3}))?$/.exec(value);
  if (!m) return value;
  const key = m[1] as keyof BrandPalette | 'pop';
  if (key !== 'pop' && !PALETTE_KEYS.has(key)) return value;
  const base = key === 'pop' ? readableOnLight(brand.palette.accent) : brand.palette[key];
  return m[2] ? hexToRgba(base, Math.min(100, Number(m[2])) / 100) : base;
}

/** Canvas fill style for a box of the given size (gradients are box-relative). */
export function resolveFill(
  ctx: CanvasRenderingContext2D,
  fill: Fill,
  brand: Brand,
  w: number,
  h: number,
): string | CanvasGradient {
  if (typeof fill === 'string') return resolveColor(fill, brand);
  if (fill.type === 'radial') {
    const g = ctx.createRadialGradient(fill.cx * w, fill.cy * h, 0, fill.cx * w, fill.cy * h, Math.max(1, fill.r * Math.max(w, h)));
    for (const [offset, color] of fill.stops) g.addColorStop(offset, resolveColor(color, brand));
    return g;
  }
  const rad = (fill.angle * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const half = (Math.abs(Math.cos(rad)) * w + Math.abs(Math.sin(rad)) * h) / 2;
  const g = ctx.createLinearGradient(cx - Math.cos(rad) * half, cy - Math.sin(rad) * half, cx + Math.cos(rad) * half, cy + Math.sin(rad) * half);
  for (const [offset, color] of fill.stops) g.addColorStop(offset, resolveColor(color, brand));
  return g;
}

/** Relative luminance (0 = black, 1 = white) of a resolved hex colour; used to pick logo tone. */
export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(h)) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
