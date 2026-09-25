import { useEffect, useState } from 'react';
import { drawPoster, posterFontFamilies, posterImageSources } from '../render/drawPoster';
import type { DrawablePoster } from '../render/drawPoster';
import type { RenderEnv } from '../render/env';
import { ensureFonts } from '../services/fontService';
import { preloadImages } from '../services/imageService';
import type { Ratio } from '../types/element';
import { canvasSize } from '../utils/aspectRatio';

const MAX_CACHED = 200;
const cache = new Map<string, string>();
let queue: Promise<unknown> = Promise.resolve();

async function renderThumbnail(poster: DrawablePoster, ratio: Ratio, env: RenderEnv, width: number): Promise<string | null> {
  await Promise.all([ensureFonts(posterFontFamilies(poster, env)), preloadImages(posterImageSources(poster, env))]);
  const { width: W, height: H } = canvasSize(ratio);
  const scale = width / W;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(scale, scale);
  drawPoster(ctx, poster, ratio, { ...env, mode: 'export' });
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Small JPEG preview drawn by the export renderer, so thumbnails match the real
 * output. Jobs run one at a time to keep the UI responsive; results are cached
 * by `key`, which must change whenever any input changes.
 */
export function useThumbnail(key: string, poster: DrawablePoster, ratio: Ratio, env: RenderEnv, width = 240): string | null {
  const [result, setResult] = useState<{ key: string; url: string } | null>(null);

  useEffect(() => {
    if (cache.has(key)) return;
    let alive = true;
    queue = queue.then(async () => {
      if (!alive) return;
      const url = await renderThumbnail(poster, ratio, env, width);
      if (!url) return;
      cache.set(key, url);
      if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value as string);
      if (alive) setResult({ key, url });
    });
    return () => {
      alive = false;
    };
    // `key` encodes every render input; the other values are read at render time.
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return cache.get(key) ?? (result?.key === key ? result.url : null);
}
