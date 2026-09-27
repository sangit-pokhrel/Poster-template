/**
 * Reads the main colours out of logos dropped into public/logo/<brand>/, so the
 * colour themes follow the real logo. Runs once per logo in the browser.
 */
import { create } from 'zustand';
import type { BrandId } from '../types/brand';
import { droppedLogos } from './logoFolder';

interface LogoColorState {
  colors: Partial<Record<BrandId, string[]>>;
}

export const useLogoColors = create<LogoColorState>(() => ({ colors: {} }));

const hex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

/** Most frequent distinct colours in RGBA pixel data (transparent and near-white pixels ignored). */
export function dominantColors(data: Uint8ClampedArray, max = 5): string[] {
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 3 < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const a = data[i + 3] ?? 0;
    if (a < 160 || (r > 235 && g > 235 && b > 235)) continue;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bucket.n++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
  const ranked = [...buckets.values()].sort((a, b) => b.n - a.n).map((c) => [c.r / c.n, c.g / c.n, c.b / c.n] as const);
  const out: Array<readonly [number, number, number]> = [];
  for (const c of ranked) {
    if (out.some((o) => Math.hypot(o[0] - c[0], o[1] - c[1], o[2] - c[2]) < 60)) continue;
    out.push(c);
    if (out.length >= max) break;
  }
  return out.map(([r, g, b]) => hex(Math.round(r), Math.round(g), Math.round(b)));
}

function extract(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 96;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve([]);
      const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
      ctx.drawImage(img, 0, 0, img.naturalWidth * scale, img.naturalHeight * scale);
      resolve(dominantColors(ctx.getImageData(0, 0, size, size).data));
    };
    img.onerror = () => resolve([]);
    img.src = src;
  });
}

/** Starts colour extraction for every dropped logo (no-op when the folders are empty). */
export function loadLogoColors(): void {
  if (typeof document === 'undefined') return;
  for (const [id, logo] of Object.entries(droppedLogos) as Array<[BrandId, NonNullable<(typeof droppedLogos)[BrandId]>]>) {
    void extract(logo.logo).then((colors) => {
      if (colors.length) useLogoColors.setState((s) => ({ colors: { ...s.colors, [id]: colors } }));
    });
  }
}
