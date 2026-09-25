import type { BadgeData, LogoData, ShapeData } from '../types/element';
import { resolveColor, resolveFill } from './color';
import type { RenderEnv } from './env';
import { fontStack, resolveTokens } from './env';

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

export function drawShape(ctx: CanvasRenderingContext2D, d: ShapeData, w: number, h: number, env: RenderEnv): void {
  ctx.save();
  const fill = resolveFill(ctx, d.fill, env.brand, w, h);
  ctx.fillStyle = fill;
  ctx.beginPath();
  switch (d.kind) {
    case 'rect':
      ctx.roundRect(0, 0, w, h, Math.min(d.radius, w / 2, h / 2));
      break;
    case 'ellipse':
      ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'line':
      ctx.roundRect(0, 0, w, h, h / 2);
      break;
    case 'triangle':
      ctx.moveTo(0, h);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.closePath();
      break;
    case 'dots': {
      const step = Math.max(14, d.radius || 22);
      const r = step * 0.16;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      break;
    }
    case 'stripes': {
      const step = Math.max(12, d.radius || 28);
      ctx.save();
      ctx.rect(0, 0, w, h);
      ctx.clip();
      ctx.beginPath();
      ctx.lineWidth = step * 0.35;
      ctx.strokeStyle = fill;
      for (let x = -h; x < w + h; x += step) {
        ctx.moveTo(x, h);
        ctx.lineTo(x + h, 0);
      }
      ctx.stroke();
      ctx.restore();
      ctx.restore();
      return;
    }
    case 'quote':
      ctx.font = `700 ${h * 1.35}px "Playfair Display", Georgia, serif`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText('“', 0, -h * 0.12);
      ctx.restore();
      return;
  }
  ctx.fill();
  if (d.stroke && d.strokeWidth > 0) {
    ctx.lineWidth = d.strokeWidth;
    ctx.strokeStyle = resolveColor(d.stroke, env.brand);
    ctx.stroke();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Badges (proposal §16)                                               */
/* ------------------------------------------------------------------ */

export function drawBadge(ctx: CanvasRenderingContext2D, d: BadgeData, w: number, h: number, env: RenderEnv): void {
  const raw = resolveTokens(d.text, env);
  const text = d.uppercase ? raw.toLocaleUpperCase() : raw;
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return;

  const fill = resolveColor(d.fill, env.brand);
  const color = resolveColor(d.color, env.brand);

  ctx.save();
  ctx.beginPath();
  switch (d.style) {
    case 'pill':
      ctx.roundRect(0, 0, w, h, h / 2);
      ctx.fillStyle = fill;
      ctx.fill();
      break;
    case 'tag':
      ctx.roundRect(0, 0, w, h, Math.min(10, h / 4));
      ctx.fillStyle = fill;
      ctx.fill();
      break;
    case 'outline': {
      const lw = Math.max(3, h * 0.06);
      ctx.roundRect(lw / 2, lw / 2, w - lw, h - lw, (h - lw) / 2);
      ctx.lineWidth = lw;
      ctx.strokeStyle = fill;
      ctx.stroke();
      break;
    }
    case 'ribbon': {
      const notch = h * 0.35;
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - notch, h / 2);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      break;
    }
    case 'circle':
      ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      break;
    case 'underline':
      ctx.fillStyle = fill;
      ctx.fillRect(0, h - Math.max(4, h * 0.1), w, Math.max(4, h * 0.1));
      break;
  }

  // Fit text into the badge's inner box
  const padX = d.style === 'circle' ? w * 0.16 : d.style === 'underline' ? 0 : h * 0.45;
  const innerW = w - padX * 2 - (d.style === 'ribbon' ? h * 0.35 : 0);
  const innerH = (d.style === 'underline' ? h * 0.85 : h * 0.72) - 0;
  ctx.letterSpacing = `${d.letterSpacing}px`;
  let size = Math.min(d.fontSize, innerH / (lines.length * 1.1));
  const font = (s: number) => `${d.fontWeight} ${s}px ${fontStack(d.fontFamily, env.brand)}`;
  ctx.font = font(size);
  const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width));
  while (size > 8 && widest() > innerW) {
    size *= 0.94;
    ctx.font = font(size);
  }
  ctx.fillStyle = color;
  ctx.textAlign = d.style === 'underline' ? 'left' : 'center';
  ctx.textBaseline = 'middle';
  const lh = size * 1.1;
  const cx = d.style === 'underline' ? 0 : (d.style === 'ribbon' ? (w - h * 0.35) / 2 : w / 2);
  const cy0 = (d.style === 'underline' ? (h - Math.max(4, h * 0.1)) / 2 : h / 2) - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, cx, cy0 + i * lh));
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

/** Picks the right artwork for the background; falls back to a card when no light version exists. */
export function logoSource(d: LogoData, env: RenderEnv): { src: string; forceCard: boolean } {
  const a = env.brand.assets;
  if (d.tone === 'light') {
    const light = d.variant === 'mark' ? a.markLight : a.logoLight;
    if (light) return { src: light, forceCard: false };
  }
  return { src: d.variant === 'mark' ? a.mark : a.logo, forceCard: d.tone === 'light' };
}

export function drawLogo(ctx: CanvasRenderingContext2D, d: LogoData, w: number, h: number, env: RenderEnv): void {
  const { src, forceCard } = logoSource(d, env);
  const img = env.images.get(src);
  const card = d.card || forceCard;
  const pad = card ? Math.min(w, h) * 0.12 : 0;
  const boxW = w - pad * 2;
  const boxH = h - pad * 2;

  let dw = boxW;
  let dh = boxH;
  if (img) {
    const s = Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight);
    dw = img.naturalWidth * s;
    dh = img.naturalHeight * s;
  }
  const x = d.align === 'left' ? pad : d.align === 'right' ? w - pad - dw : (w - dw) / 2;
  const y = (h - dh) / 2;

  ctx.save();
  if (card) {
    const cw = dw + pad * 2;
    const cx = d.align === 'left' ? 0 : d.align === 'right' ? w - cw : (w - cw) / 2;
    ctx.fillStyle = resolveColor(d.cardColor || '#ffffff', env.brand);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(cx, y - pad, cw, dh + pad * 2, Math.min(24, pad * 1.4));
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }
  if (img) {
    if (d.tone === 'light' && !card) {
      // Light artwork sits on photos: a soft shadow keeps it legible on bright skies
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = Math.max(6, dh * 0.12);
    }
    ctx.drawImage(img, x, y, dw, dh);
  } else {
    ctx.fillStyle = resolveColor(d.tone === 'light' && !card ? '#ffffff' : 'brand.primary', env.brand);
    ctx.font = `700 ${Math.min(boxH * 0.5, 40)}px ${fontStack('brand.heading', env.brand)}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = d.align === 'left' ? 'left' : d.align === 'right' ? 'right' : 'center';
    ctx.fillText(env.brand.name, d.align === 'left' ? pad : d.align === 'right' ? w - pad : w / 2, h / 2);
  }
  ctx.restore();
}
