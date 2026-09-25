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

/**
 * Resolves brand tokens: `brand.accent` → palette colour, `brand.primary/40` → 40 % alpha.
 * Literal colours pass through untouched.
 */
export function resolveColor(value: ColorValue, brand: Brand): string {
  const m = /^brand\.(\w+)(?:\/(\d{1,3}))?$/.exec(value);
  if (!m) return value;
  const key = m[1] as keyof BrandPalette;
  if (!PALETTE_KEYS.has(key)) return value;
  const base = brand.palette[key];
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
