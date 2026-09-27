import type { Fill, Ratio } from '../types/element';
import type { ElementSpec } from '../types/template';
import { canvasSize, elementRect } from '../utils/aspectRatio';
import { resolveFill } from './color';
import type { RenderEnv } from './env';
import { drawBadge, drawIcon, drawLogo, drawShape } from './graphics';
import { drawImageElement } from './image';
import { drawText } from './text';

/** Anything drawable: a template layout element or a poster element (which adds user frames). */
export type Drawable = ElementSpec & { userFrames?: Partial<Record<Ratio, { x: number; y: number; w: number; h: number }>> };

export interface DrawablePoster {
  background: Fill;
  elements: readonly Drawable[];
}

/**
 * Draws one element into its own local box (0,0)–(w,h). Opacity and rotation
 * are applied by the caller: `drawPoster` for export, Fabric for the live canvas.
 */
export function drawElementContent(ctx: CanvasRenderingContext2D, el: Drawable, w: number, h: number, env: RenderEnv): void {
  if (el.showIf && !env.brand[el.showIf].trim()) return;
  switch (el.type) {
    case 'text':
      return drawText(ctx, el.data, w, h, env);
    case 'image':
      return drawImageElement(ctx, el.data, w, h, env);
    case 'logo':
      return drawLogo(ctx, el.data, w, h, env);
    case 'shape':
      return drawShape(ctx, el.data, w, h, env);
    case 'badge':
      return drawBadge(ctx, el.data, w, h, env);
    case 'icon':
      return drawIcon(ctx, el.data, w, h, env);
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, poster: Pick<DrawablePoster, 'background'>, width: number, height: number, env: RenderEnv): void {
  ctx.fillStyle = resolveFill(ctx, poster.background, env.brand, width, height);
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders a whole poster in logical coordinates (1080 × H). Used by the
 * export canvas and the template thumbnails — never draws editor UI.
 * The live Fabric canvas calls the very same `drawElementContent`, so the
 * preview and the downloaded file match.
 */
export function drawPoster(ctx: CanvasRenderingContext2D, poster: DrawablePoster, ratio: Ratio, env: RenderEnv): void {
  const { width, height } = canvasSize(ratio);
  ctx.save();
  drawBackground(ctx, poster, width, height, env);
  for (const el of poster.elements) {
    if (!el.visible || el.opacity <= 0) continue;
    const r = elementRect(el, ratio);
    ctx.save();
    ctx.globalAlpha = el.opacity;
    ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
    if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-r.w / 2, -r.h / 2);
    drawElementContent(ctx, el, r.w, r.h, env);
    ctx.restore();
  }
  ctx.restore();
}

/** Every image URL a poster needs, for preloading before export. */
export function posterImageSources(poster: Pick<DrawablePoster, 'elements'>, env: Pick<RenderEnv, 'brand'>): string[] {
  const a = env.brand.assets;
  const srcs = new Set<string>();
  for (const el of poster.elements) {
    if (!el.visible) continue;
    if (el.type === 'image' && el.data.src) srcs.add(el.data.src);
    if (el.type === 'logo') {
      const light = el.data.tone === 'light';
      if (el.data.variant !== 'mark') srcs.add((light ? a.logoLight : undefined) ?? a.logo);
      if (el.data.variant !== 'full') srcs.add((light ? a.markLight : undefined) ?? a.mark);
    }
  }
  return [...srcs];
}

/** Every font family a poster needs, for preloading. */
export function posterFontFamilies(poster: Pick<DrawablePoster, 'elements'>, env: Pick<RenderEnv, 'brand'>): string[] {
  const fonts = new Set<string>([env.brand.fonts.heading, env.brand.fonts.body]);
  for (const el of poster.elements) {
    if (el.type === 'text' || el.type === 'badge') {
      const f = el.data.fontFamily;
      fonts.add(f === 'brand.heading' ? env.brand.fonts.heading : f === 'brand.body' ? env.brand.fonts.body : f);
    }
  }
  return [...fonts];
}
