import type { Brand, Post, PosterAssets } from '../engine';

/**
 * Decoded-image cache shared by the preview, thumbnails and exporter.
 * Keys can be data: URLs (uploads) or http(s) URLs (samples / CSV). Bounded so
 * long sessions with many uploads don't hold every image forever.
 */
const MAX_ENTRIES = 80;
const cache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = cache.get(src);
  if (hit) {
    cache.delete(src);
    cache.set(src, hit); // LRU bump
    return hit;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // Remote images must be CORS-enabled or the canvas becomes tainted and cannot be exported.
    if (!src.startsWith('data:') && !src.startsWith('blob:')) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => {
      cache.delete(src);
      reject(new Error(`Could not load image: ${src.slice(0, 80)}`));
    };
    img.src = src;
  });

  cache.set(src, promise);
  if (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return promise;
}

export async function tryLoadImage(src: string): Promise<HTMLImageElement | null> {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch {
    return null;
  }
}

export async function loadPosterAssets(post: Post, brand: Brand): Promise<PosterAssets> {
  const [photo, logo, ...extras] = await Promise.all([
    tryLoadImage(post.photoSrc),
    tryLoadImage(brand.logoSrc),
    ...post.extraPhotoSrcs.map(tryLoadImage),
  ]);
  return {
    photo: photo ?? null,
    logo: logo ?? null,
    extras: extras.filter((x): x is HTMLImageElement => x !== null),
  };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Downscales large uploads before they enter app state. Phone photos are often
 * 4000px+ and several MB as data URLs, which bloats memory and localStorage.
 * Posters are 1080px wide, so 2160px on the long edge keeps full quality even when zoomed.
 */
export async function fileToOptimizedDataUrl(file: File, maxEdge = 2160): Promise<string> {
  const original = await readFileAsDataUrl(file);
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return original;
  const img = await loadImage(original);
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  if (scale === 1 && file.size < 1_500_000) return original;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const keepAlpha = file.type === 'image/png' || file.type === 'image/webp';
  return canvas.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', 0.9);
}
