import JSZip from 'jszip';
import { canvasSize, getTemplate, renderPoster } from '../engine';
import type { AspectRatio, Brand, Post } from '../engine';
import { canvasToBlob, downloadBlob, slugify } from './files';
import { ensureFontsLoaded } from './fonts';
import { loadPosterAssets } from './images';

export interface ExportJob {
  post: Post;
  /** Overrides the post's own template (used for "this post × every template"). */
  templateId?: string;
}

export interface ExportOptions {
  brand: Brand;
  ratio: AspectRatio;
  onProgress?: (done: number, total: number) => void;
  signal?: AbortSignal;
}

/** Renders one poster at full resolution on an off-screen canvas. */
export async function renderPosterBlob(post: Post, brand: Brand, ratio: AspectRatio): Promise<Blob> {
  await ensureFontsLoaded();
  const assets = await loadPosterAssets(post, brand);
  const { width, height } = canvasSize(ratio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is not supported in this browser');
  renderPoster(ctx, { post, brand, ratio, assets, mode: 'export' });
  return canvasToBlob(canvas);
}

export function posterFilename(brand: Brand, post: Post, index?: number): string {
  const prefix = index === undefined ? '' : `${String(index + 1).padStart(2, '0')}-`;
  return `${prefix}${slugify(brand.name, 'brand')}_${post.templateId}_${slugify(post.headline)}.png`;
}

export async function downloadPoster(post: Post, brand: Brand, ratio: AspectRatio): Promise<void> {
  downloadBlob(await renderPosterBlob(post, brand, ratio), posterFilename(brand, post));
}

/**
 * Renders jobs sequentially (bounded memory: one full-size canvas at a time)
 * and adds them to a ZIP. PNGs are already compressed, so they are STOREd.
 */
export async function downloadPostersZip(jobs: ExportJob[], zipName: string, o: ExportOptions): Promise<void> {
  const zip = new JSZip();
  const used = new Set<string>();

  for (const [i, job] of jobs.entries()) {
    if (o.signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
    const post = job.templateId ? { ...job.post, templateId: getTemplate(job.templateId).id } : job.post;
    const blob = await renderPosterBlob(post, o.brand, o.ratio);

    const base = posterFilename(o.brand, post, i);
    let name = base;
    for (let n = 2; used.has(name); n++) name = base.replace(/\.png$/, `-${n}.png`);
    used.add(name);
    zip.file(name, blob);

    o.onProgress?.(i + 1, jobs.length);
    await new Promise((r) => setTimeout(r, 0)); // yield so the UI can paint progress
  }

  const archive = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  downloadBlob(archive, zipName);
}

export async function copyPosterToClipboard(post: Post, brand: Brand, ratio: AspectRatio): Promise<void> {
  if (!('ClipboardItem' in window) || !navigator.clipboard?.write) {
    throw new Error('Clipboard images are not supported in this browser');
  }
  // Pass a promise so Safari keeps the user-gesture activation while we render.
  const item = new ClipboardItem({ 'image/png': renderPosterBlob(post, brand, ratio) });
  await navigator.clipboard.write([item]);
}
