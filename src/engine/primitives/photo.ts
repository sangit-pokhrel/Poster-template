import type { Rect, Scene } from '../types';

interface Size {
  w: number;
  h: number;
}

/** Largest size with the image's aspect that covers the target box. */
export function coverSize(boxW: number, boxH: number, imgAspect: number): Size {
  return imgAspect > boxW / boxH ? { w: boxH * imgAspect, h: boxH } : { w: boxW, h: boxW / imgAspect };
}

/** Largest size with the image's aspect that fits inside the target box. */
export function containSize(boxW: number, boxH: number, imgAspect: number): Size {
  return imgAspect > boxW / boxH ? { w: boxW, h: boxW / imgAspect } : { w: boxH * imgAspect, h: boxH };
}

export interface PhotoLayerOptions {
  /** Height of the photo band as a fraction of the canvas (ignored when `rect` is given). */
  heightRatio?: number;
  /** Vertical centre of the photo as a fraction of the canvas (ignored when `rect` is given). */
  centerRatio?: number;
  /** Explicit target box; callers clip to it themselves. */
  rect?: Rect;
}

export const hasPhoto = (s: Scene): boolean => Boolean(s.assets.photo?.width);

/**
 * Port of the reference `drawPhotoLayer`: draws the main photo with the post's
 * zoom / pan / fit settings. `contain` paints a blurred, darkened copy behind the
 * full photo so the frame is never empty.
 */
export function drawPhotoLayer(s: Scene, o: PhotoLayerOptions = {}): void {
  const img = s.assets.photo;
  if (!img || !img.width || !img.height) return;

  const { ctx, width, height, post } = s;
  const areaW = o.rect?.width ?? width;
  const areaH = o.rect?.height ?? height * (o.heightRatio ?? 1);
  const startX = o.rect?.x ?? 0;
  const defaultCenterY = o.centerRatio !== undefined ? height * o.centerRatio : areaH / 2;
  const imgAspect = img.width / img.height;
  const zoom = post.zoom / 100;

  const topFor = (h: number) => (o.rect ? o.rect.y + (areaH - h) / 2 : defaultCenterY - h / 2);

  if (post.photoFit === 'contain') {
    ctx.save();
    ctx.filter = 'blur(28px) brightness(0.55)';
    const bg = coverSize(areaW, areaH, imgAspect);
    ctx.drawImage(img, startX + (areaW - bg.w) / 2 - 25, topFor(bg.h) - 25, bg.w + 50, bg.h + 50);
    ctx.restore();

    const fit = containSize(areaW, areaH, imgAspect);
    const w = fit.w * zoom;
    const h = fit.h * zoom;
    ctx.drawImage(img, startX + (areaW - w) / 2 + post.panX, topFor(h) + post.panY, w, h);
    return;
  }

  const cover = coverSize(areaW, areaH, imgAspect);
  const w = cover.w * zoom;
  const h = cover.h * zoom;
  ctx.drawImage(img, startX + (areaW - w) / 2 + post.panX, topFor(h) + post.panY, w, h);
}

/** Port of the reference `drawSinglePhotoFit`: one collage cell, no zoom/pan. */
export function drawPhotoInCell(s: Scene, img: HTMLImageElement, r: Rect): void {
  if (!img.width || !img.height) return;
  const { ctx } = s;
  const imgAspect = img.width / img.height;

  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.width, r.height);
  ctx.clip();

  if (s.post.photoFit === 'contain') {
    ctx.save();
    ctx.filter = 'blur(20px) brightness(0.6)';
    const bg = coverSize(r.width, r.height, imgAspect);
    ctx.drawImage(img, r.x + (r.width - bg.w) / 2 - 15, r.y + (r.height - bg.h) / 2 - 15, bg.w + 30, bg.h + 30);
    ctx.restore();
    const fit = containSize(r.width, r.height, imgAspect);
    ctx.drawImage(img, r.x + (r.width - fit.w) / 2, r.y + (r.height - fit.h) / 2, fit.w, fit.h);
  } else {
    const cover = coverSize(r.width, r.height, imgAspect);
    ctx.drawImage(img, r.x + (r.width - cover.w) / 2, r.y + (r.height - cover.h) / 2, cover.w, cover.h);
  }
  ctx.restore();
}

/** Editor-only hint where the photo will go. Never painted into exported files. */
export function drawPhotoPlaceholder(s: Scene, r: Rect, radius = 0): void {
  if (s.mode !== 'preview') return;
  const { ctx } = s;
  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.width, r.height, radius);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${Math.min(34, r.height / 6)}px "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📷  Add a photo', r.x + r.width / 2, r.y + r.height / 2);
  ctx.restore();
}

export interface FramedPhotoOptions {
  radius: number;
  stroke: string;
  lineWidth: number;
}

/** Rounded, clipped, stroked photo box — the building block of the "framed" templates. */
export function drawFramedPhoto(s: Scene, r: Rect, o: FramedPhotoOptions): void {
  const { ctx } = s;
  if (!hasPhoto(s)) {
    drawPhotoPlaceholder(s, r, o.radius);
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.width, r.height, o.radius);
  ctx.clip();
  drawPhotoLayer(s, { rect: r });
  ctx.restore();

  ctx.strokeStyle = o.stroke;
  ctx.lineWidth = o.lineWidth;
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.width, r.height, o.radius);
  ctx.stroke();
}

/** `Math.max(min, Math.min(max, value))` — the reference's photo-height clamp. */
export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
