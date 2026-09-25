import type { BadgeData, IconData, LogoData, ShapeData } from '../types/element';
import { resolveColor, resolveFill } from './color';
import type { RenderEnv } from './env';
import { fontStack, resolveTokens } from './env';
import { iconPath } from './icons';

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

/** Star/seal outline with `spikes` points, inscribed in the box. */
export function burstPath(ctx: CanvasRenderingContext2D, w: number, h: number, spikes = 16, depth = 0.12): void {
  const cx = w / 2;
  const cy = h / 2;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 1 : 1 - depth;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const x = cx + Math.cos(a) * (w / 2) * r;
    const y = cy + Math.sin(a) * (h / 2) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function archPath(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const r = Math.min(w / 2, h);
  ctx.moveTo(0, h);
  ctx.lineTo(0, r);
  ctx.ellipse(w / 2, r, w / 2, r, 0, Math.PI, 0);
  ctx.lineTo(w, h);
  ctx.closePath();
}

function applyShadow(ctx: CanvasRenderingContext2D, on: boolean, size: number): void {
  if (!on) return;
  ctx.shadowColor = 'rgba(10, 10, 30, 0.28)';
  ctx.shadowBlur = Math.max(12, size * 0.08);
  ctx.shadowOffsetY = Math.max(4, size * 0.025);
}

export function drawShape(ctx: CanvasRenderingContext2D, d: ShapeData, w: number, h: number, env: RenderEnv): void {
  ctx.save();
  const fill = resolveFill(ctx, d.fill, env.brand, w, h);
  const stroke = d.stroke && d.strokeWidth > 0 ? resolveColor(d.stroke, env.brand) : null;
  ctx.fillStyle = fill;

  // Pattern shapes paint themselves
  if (d.kind === 'dots' || d.kind === 'grid' || d.kind === 'stripes' || d.kind === 'quote') {
    drawPattern(ctx, d, w, h, fill);
    ctx.restore();
    return;
  }

  applyShadow(ctx, d.shadow, Math.min(w, h));
  ctx.beginPath();
  const sw = stroke ? d.strokeWidth : 0;
  switch (d.kind) {
    case 'rect':
      ctx.roundRect(sw / 2, sw / 2, w - sw, h - sw, Math.min(d.radius, w / 2, h / 2));
      break;
    case 'ellipse':
      ctx.ellipse(w / 2, h / 2, Math.max(0, w / 2 - sw / 2), Math.max(0, h / 2 - sw / 2), 0, 0, Math.PI * 2);
      break;
    case 'ring':
      ctx.ellipse(w / 2, h / 2, Math.max(0, w / 2 - sw / 2), Math.max(0, h / 2 - sw / 2), 0, 0, Math.PI * 2);
      break;
    case 'line':
      ctx.roundRect(0, 0, w, h, Math.min(w, h) / 2);
      break;
    case 'triangle':
      ctx.moveTo(0, h);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.closePath();
      break;
    case 'diamond':
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(w / 2, h);
      ctx.lineTo(0, h / 2);
      ctx.closePath();
      break;
    case 'arch':
      ctx.save();
      ctx.translate(sw / 2, sw / 2);
      archPath(ctx, w - sw, h - sw);
      ctx.restore();
      break;
    case 'burst':
      burstPath(ctx, w, h, Math.max(8, d.radius || 18));
      break;
    case 'polygon':
      for (let i = 0; i + 1 < d.points.length; i += 2) {
        const x = (d.points[i] ?? 0) * w;
        const y = (d.points[i + 1] ?? 0) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
  }
  if (d.kind !== 'ring') ctx.fill();
  if (stroke) {
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = d.strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
}

function drawPattern(ctx: CanvasRenderingContext2D, d: ShapeData, w: number, h: number, fill: string | CanvasGradient): void {
  ctx.beginPath();
  if (d.kind === 'dots') {
    const step = Math.max(14, d.radius || 22);
    const r = step * 0.16;
    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    return;
  }
  if (d.kind === 'quote') {
    ctx.font = `700 ${h * 1.35}px "Playfair Display", Georgia, serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('“', 0, -h * 0.12);
    return;
  }
  ctx.rect(0, 0, w, h);
  ctx.clip();
  ctx.beginPath();
  ctx.strokeStyle = fill;
  if (d.kind === 'grid') {
    const step = Math.max(20, d.radius || 60);
    ctx.lineWidth = Math.max(1, d.strokeWidth || 1.5);
    for (let x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
  } else {
    const step = Math.max(12, d.radius || 28);
    ctx.lineWidth = step * 0.35;
    for (let x = -h; x < w + h; x += step) {
      ctx.moveTo(x, h);
      ctx.lineTo(x + h, 0);
    }
  }
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export function drawIcon(ctx: CanvasRenderingContext2D, d: IconData, w: number, h: number, env: RenderEnv): void {
  const size = Math.min(w, h);
  const ox = (w - size) / 2;
  const oy = (h - size) / 2;
  ctx.save();
  let inset = 0;
  if (d.bg) {
    ctx.fillStyle = resolveFill(ctx, d.bg, env.brand, size, size);
    ctx.beginPath();
    if (d.bgShape === 'circle') ctx.ellipse(ox + size / 2, oy + size / 2, size / 2, size / 2, 0, 0, Math.PI * 2);
    else ctx.roundRect(ox, oy, size, size, d.bgShape === 'rounded' ? size * 0.28 : 0);
    ctx.fill();
    inset = size * 0.24;
  }
  const path = iconPath(d.name);
  if (path) {
    const inner = size - inset * 2;
    const k = inner / 24;
    ctx.translate(ox + inset, oy + inset);
    ctx.scale(k, k);
    ctx.lineWidth = d.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = resolveColor(d.color, env.brand);
    ctx.stroke(path);
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
      ctx.roundRect(0, 0, w, h, d.radius ?? Math.min(10, h / 4));
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
    case 'burst':
      burstPath(ctx, w, h, 18, 0.1);
      ctx.fillStyle = fill;
      ctx.fill();
      break;
    case 'underline':
      ctx.fillStyle = fill;
      ctx.fillRect(0, h - Math.max(4, h * 0.1), w, Math.max(4, h * 0.1));
      break;
  }

  // Fit text into the badge's inner box
  const padX = d.style === 'circle' || d.style === 'burst' ? w * 0.18 : d.style === 'underline' ? 0 : h * 0.45;
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
