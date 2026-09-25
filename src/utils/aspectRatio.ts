import type { Frame, PosterElement, Ratio } from '../types/element';

/** Logical canvas width for every ratio (proposal §32, §36). */
export const CANVAS_WIDTH = 1080;

export const RATIOS: Record<Ratio, { width: number; height: number; label: string; hint: string }> = {
  '1:1': { width: 1080, height: 1080, label: '1:1', hint: 'Square · Feed' },
  '4:5': { width: 1080, height: 1350, label: '4:5', hint: 'Portrait · Feed' },
  '16:9': { width: 1080, height: 608, label: '16:9', hint: 'Landscape · Cover' },
  '9:16': { width: 1080, height: 1920, label: '9:16', hint: 'Story · Reel' },
};

export const RATIO_KEYS = Object.keys(RATIOS) as Ratio[];

export const isRatio = (v: unknown): v is Ratio => typeof v === 'string' && v in RATIOS;

export function canvasSize(ratio: Ratio): { width: number; height: number } {
  const { width, height } = RATIOS[ratio];
  return { width, height };
}

/**
 * Where an element sits for a given ratio:
 * the user's own placement for that ratio, else the template's frame with its
 * ratio-specific adjustments.
 */
type Placed = Pick<PosterElement, 'frame' | 'ratioFrames'> & { userFrames?: PosterElement['userFrames']; aspect?: number };

export function effectiveFrame(el: Placed, ratio: Ratio): Frame {
  return el.userFrames?.[ratio] ?? { ...el.frame, ...el.ratioFrames[ratio] };
}

export interface PxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function frameToPx(f: Frame, width: number, height: number): PxRect {
  return { x: f.x * width, y: f.y * height, w: f.w * width, h: f.h * height };
}

/**
 * Pixel box of an element for a ratio. Elements with a fixed `aspect` are
 * shrunk around their centre so they keep their proportions.
 */
export function elementRect(el: Placed, ratio: Ratio): PxRect {
  const { width, height } = canvasSize(ratio);
  const r = frameToPx(effectiveFrame(el, ratio), width, height);
  if (!el.aspect || el.userFrames?.[ratio]) return r;
  const w = Math.min(r.w, r.h * el.aspect);
  const h = w / el.aspect;
  return { x: r.x + (r.w - w) / 2, y: r.y + (r.h - h) / 2, w, h };
}

export function pxToFrame(r: PxRect, width: number, height: number): Frame {
  const round = (v: number) => Math.round(v * 10_000) / 10_000;
  return { x: round(r.x / width), y: round(r.y / height), w: round(r.w / width), h: round(r.h / height) };
}
