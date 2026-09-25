import type { ImageData, ImageShape } from '../types/element';
import { resolveColor, resolveFill } from './color';
import type { RenderEnv } from './env';

export function shapePath(ctx: CanvasRenderingContext2D, shape: ImageShape, w: number, h: number, radius: number): void {
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else if (shape === 'diamond') {
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(0, h / 2);
    ctx.closePath();
  } else if (shape === 'slant') {
    const k = w * 0.14;
    ctx.moveTo(k, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w - k, h);
    ctx.lineTo(0, h);
    ctx.closePath();
  } else if (shape === 'arch') {
    const r = Math.min(w / 2, h);
    ctx.moveTo(0, h);
    ctx.lineTo(0, r);
    ctx.ellipse(w / 2, r, w / 2, r, 0, Math.PI, 0);
    ctx.lineTo(w, h);
    ctx.closePath();
  } else {
    ctx.roundRect(0, 0, w, h, Math.min(radius, w / 2, h / 2));
  }
}

export interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Where the source image lands inside a w×h frame (proposal §31):
 * fit (cover/contain) → zoom → pan. Pan is a fraction of the frame size.
 */
export function placeImage(iw: number, ih: number, w: number, h: number, d: Pick<ImageData, 'fit' | 'zoom' | 'panX' | 'panY'>): Placement {
  const scale = (d.fit === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih)) * d.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  return { x: (w - dw) / 2 + d.panX * w * 0.5, y: (h - dh) / 2 + d.panY * h * 0.5, w: dw, h: dh };
}

export function drawImageElement(ctx: CanvasRenderingContext2D, d: ImageData, w: number, h: number, env: RenderEnv): void {
  const img = d.src ? env.images.get(d.src) : null;
  // Proposal §12: unused photo slots disappear from the final output.
  if (!img && env.mode === 'export') return;

  if (d.shadow) {
    ctx.save();
    ctx.shadowColor = 'rgba(10, 10, 30, 0.35)';
    ctx.shadowBlur = Math.max(18, Math.min(w, h) * 0.06);
    ctx.shadowOffsetY = Math.max(6, Math.min(w, h) * 0.02);
    ctx.fillStyle = '#000';
    shapePath(ctx, d.shape, w, h, d.radius);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  shapePath(ctx, d.shape, w, h, d.radius);
  ctx.clip();

  if (!img) {
    drawPlaceholder(ctx, d, w, h, env);
  } else {
    if (d.grayscale) ctx.filter = 'grayscale(1)';
    if (d.fit === 'contain') {
      // Blurred cover backdrop so contained photos never leave empty bands
      ctx.save();
      ctx.filter = `${d.grayscale ? 'grayscale(1) ' : ''}blur(${Math.round(Math.max(w, h) / 30)}px) brightness(0.7)`;
      const bg = placeImage(img.naturalWidth, img.naturalHeight, w, h, { fit: 'cover', zoom: 1.1, panX: 0, panY: 0 });
      ctx.drawImage(img, bg.x, bg.y, bg.w, bg.h);
      ctx.restore();
    }
    const p = placeImage(img.naturalWidth, img.naturalHeight, w, h, d);
    ctx.drawImage(img, p.x, p.y, p.w, p.h);
    ctx.filter = 'none';
  }

  if (d.overlay) {
    ctx.fillStyle = resolveFill(ctx, d.overlay, env.brand, w, h);
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();

  if (d.borderWidth > 0) {
    ctx.save();
    ctx.lineWidth = d.borderWidth;
    ctx.strokeStyle = resolveColor(d.borderColor, env.brand);
    // inset so the stroke stays inside the frame
    ctx.translate(d.borderWidth / 2, d.borderWidth / 2);
    shapePath(ctx, d.shape, w - d.borderWidth, h - d.borderWidth, Math.max(0, d.radius - d.borderWidth / 2));
    ctx.stroke();
    ctx.restore();
  }
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, d: ImageData, w: number, h: number, env: RenderEnv): void {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, resolveColor('brand.primary/85', env.brand));
  g.addColorStop(1, resolveColor('brand.secondary/85', env.brand));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (env.mode !== 'edit') return;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = `600 ${Math.max(16, Math.min(34, w / 14))}px "Poppins", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`📷  ${d.placeholder || 'Add photo'}`, w / 2, h / 2);
}
