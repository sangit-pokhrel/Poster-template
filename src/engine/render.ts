import { CANVAS_WIDTH, canvasSize } from './constants';
import { getTemplate } from './templates';
import type { AspectRatio, Brand, Post, PosterAssets, RenderMode, RenderResult } from './types';

export interface RenderInput {
  post: Post;
  brand: Brand;
  ratio: AspectRatio;
  assets: PosterAssets;
  mode: RenderMode;
}

/**
 * Paints one poster in poster coordinates (1080 × H). The caller owns the
 * canvas size and any scale transform (thumbnails draw into a small canvas
 * with `ctx.scale`). Template router = the reference's `renderCanvas` switch.
 */
export function renderPoster(ctx: CanvasRenderingContext2D, input: RenderInput): RenderResult {
  const { width, height } = canvasSize(input.ratio);
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const headlineBounds = getTemplate(input.post.templateId).render({
    ctx,
    width,
    height,
    isCompact: height <= 700,
    post: input.post,
    brand: input.brand,
    assets: input.assets,
    mode: input.mode,
  });
  ctx.restore();
  return { headlineBounds };
}

/** Sizes a canvas for a ratio at a given CSS width, accounting for device pixel ratio. */
export function prepareScaledCanvas(canvas: HTMLCanvasElement, ratio: AspectRatio, cssWidth: number): CanvasRenderingContext2D | null {
  const { height } = canvasSize(ratio);
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const scale = (cssWidth * dpr) / CANVAS_WIDTH;
  const w = Math.round(CANVAS_WIDTH * scale);
  const h = Math.round(height * scale);
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  return ctx;
}
