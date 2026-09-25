import type { ImageSource } from '../render/env';
import { assetUrl, isAssetRef, putAsset } from './assetService';

/* ------------------------------------------------------------------ */
/* Decoded image cache                                                 */
/* ------------------------------------------------------------------ */

type Entry = { state: 'loading'; promise: Promise<HTMLImageElement | null> } | { state: 'ready'; img: HTMLImageElement } | { state: 'error' };

const cache = new Map<string, Entry>();
const listeners = new Set<() => void>();

/** Subscribe to "an image finished loading" so canvases can repaint. */
export function onImageLoaded(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function decode(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (/^https?:/i.test(url) && !url.startsWith(location.origin)) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image ${url.slice(0, 60)}`));
    img.src = url;
  });
}

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  const hit = cache.get(src);
  if (hit?.state === 'ready') return Promise.resolve(hit.img);
  if (hit?.state === 'loading') return hit.promise;
  if (hit?.state === 'error') return Promise.resolve(null);

  const promise = (isAssetRef(src) ? assetUrl(src) : Promise.resolve(src))
    .then(decode)
    .then((img) => {
      cache.set(src, { state: 'ready', img });
      listeners.forEach((fn) => fn());
      return img;
    })
    .catch(() => {
      cache.set(src, { state: 'error' });
      return null;
    });
  cache.set(src, { state: 'loading', promise });
  return promise;
}

/** Synchronous lookup used while painting; kicks off loading on a miss. */
export const imageSource: ImageSource = {
  get(src) {
    const hit = cache.get(src);
    if (hit?.state === 'ready') return hit.img;
    if (!hit) void loadImage(src);
    return null;
  },
};

export function preloadImages(srcs: readonly string[]): Promise<unknown> {
  return Promise.all(srcs.map(loadImage));
}

/* ------------------------------------------------------------------ */
/* Upload validation & processing (proposal §12, §43)                  */
/* ------------------------------------------------------------------ */

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Uploads are downscaled to this long edge: 2× the poster width keeps zoomed photos sharp. */
const MAX_EDGE = 2560;

export class UploadError extends Error {
  constructor(
    public readonly kind: 'type' | 'size' | 'decode',
    message: string,
  ) {
    super(message);
  }
}

export function validateUpload(file: File): void {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadError('type', 'This image format is not supported. Please upload JPG, PNG, or WebP.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError('size', 'This image is too large. Please choose an image below 10 MB.');
  }
}

/** Validates, downscales if huge, stores in IndexedDB and returns an `asset:` reference. */
export async function importImageFile(file: File): Promise<string> {
  validateUpload(file);
  let blob: Blob = file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale < 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('resize failed'))), type, 0.92),
      );
    }
    bitmap.close();
  } catch {
    throw new UploadError('decode', 'This image could not be read. Please try a different file.');
  }
  return putAsset(blob);
}
