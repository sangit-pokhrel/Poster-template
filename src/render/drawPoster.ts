import type { PosterElement, Ratio } from '../types/element';
import type { Poster } from '../types/poster';
import { canvasSize, elementRect } from '../utils/aspectRatio';
import { resolveFill } from './color';
import type { RenderEnv } from './env';
import { drawBadge, drawLogo, drawShape } from './graphics';
import { drawImageElement } from './image';
import { drawText } from './text';

/**
 * Draws one element into its own local box (0,0)–(w,h). Opacity and rotation
 * are applied by the caller: `drawPoster` for export, Fabric for the live canvas.
 */
export function drawElementContent(ctx: CanvasRenderingContext2D, el: PosterElement, w: number, h: number, env: RenderEnv): void {
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
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, poster: Pick<Poster, 'background'>, width: number, height: number, env: RenderEnv): void {
  ctx.fillStyle = resolveFill(ctx, poster.background, env.brand, width, height);
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders a whole poster in logical coordinates (1080 × H). Used by the
 * export canvas and the template thumbnails — never draws editor UI.
 * The live Fabric canvas calls the very same `drawElementContent`, so the
 * preview and the downloaded file match.
 */
export function drawPoster(ctx: CanvasRenderingContext2D, poster: Pick<Poster, 'background' | 'elements'>, ratio: Ratio, env: RenderEnv): void {
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
export function posterImageSources(poster: Pick<Poster, 'elements'>, env: Pick<RenderEnv, 'brand'>): string[] {
  const a = env.brand.assets;
  const srcs = new Set<string>();
  for (const el of poster.elements) {
    if (!el.visible) continue;
    if (el.type === 'image' && el.data.src) srcs.add(el.data.src);
    if (el.type === 'logo') {
      const light = el.data.tone === 'light' ? (el.data.variant === 'mark' ? a.markLight : a.logoLight) : undefined;
      srcs.add(light ?? (el.data.variant === 'mark' ? a.mark : a.logo));
    }
  }
  return [...srcs];
}

/** Every font family a poster needs, for preloading. */
export function posterFontFamilies(poster: Pick<Poster, 'elements'>, env: Pick<RenderEnv, 'brand'>): string[] {
  const fonts = new Set<string>([env.brand.fonts.heading, env.brand.fonts.body]);
  for (const el of poster.elements) {
    if (el.type === 'text' || el.type === 'badge') {
      const f = el.data.fontFamily;
      fonts.add(f === 'brand.heading' ? env.brand.fonts.heading : f === 'brand.body' ? env.brand.fonts.body : f);
    }
  }
  return [...fonts];
}
