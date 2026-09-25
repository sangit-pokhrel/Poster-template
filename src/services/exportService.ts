/**
 * Export pipeline (proposal §22, §35): poster state → dedicated off-screen
 * canvas → draw → toBlob → download. The visible editor is never screenshotted,
 * so selection handles and UI can't leak into the file.
 */
import { drawPoster, posterFontFamilies, posterImageSources } from '../render/drawPoster';
import { buildEnv } from '../store/selectors';
import type { BrandOverrides } from '../types/brand';
import type { Poster } from '../types/poster';
import { canvasSize } from '../utils/aspectRatio';
import { ensureFonts } from './fontService';
import { preloadImages } from './imageService';

export type ExportFormat = 'png' | 'jpg';

export class ExportError extends Error {}

const MIME: Record<ExportFormat, string> = { png: 'image/png', jpg: 'image/jpeg' };

export async function renderPosterCanvas(poster: Poster, overrides: BrandOverrides | undefined, scale = 1): Promise<HTMLCanvasElement> {
  const env = buildEnv(poster, overrides, 'export');
  await Promise.all([ensureFonts(posterFontFamilies(poster, env)), preloadImages(posterImageSources(poster, env))]);
  const { width, height } = canvasSize(poster.ratio);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ExportError('Canvas is not supported in this browser.');
  ctx.scale(scale, scale);
  drawPoster(ctx, poster, poster.ratio, env);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, format: ExportFormat): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new ExportError('The poster could not be exported. Please try again.'))), MIME[format], 0.92);
    } catch {
      // Tainted canvas: a remote image without CORS headers
      reject(new ExportError('The poster could not be exported. A photo from another website blocks export — upload the file instead.'));
    }
  });
}

export async function renderPosterBlob(poster: Poster, overrides: BrandOverrides | undefined, format: ExportFormat, scale: number): Promise<Blob> {
  return toBlob(await renderPosterCanvas(poster, overrides, scale), format);
}

function slug(text: string): string {
  return (
    text
      .normalize('NFC')
      .toLowerCase()
      .replace(/\{[^}]*\}/g, '')
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'poster'
  );
}

export function posterFileName(poster: Poster, format: ExportFormat, index?: number): string {
  const heading = poster.elements.find((e) => e.type === 'text' && (e.role === 'heading' || e.role === 'quote'));
  const title = heading?.type === 'text' ? heading.data.text : poster.templateId;
  const prefix = index === undefined ? '' : `${String(index + 1).padStart(2, '0')}-`;
  return `${prefix}${poster.brandId}-${slug(title)}.${format}`;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function downloadPoster(poster: Poster, overrides: BrandOverrides | undefined, format: ExportFormat, scale: number): Promise<void> {
  download(await renderPosterBlob(poster, overrides, format, scale), posterFileName(poster, format));
}

export async function copyPoster(poster: Poster, overrides: BrandOverrides | undefined): Promise<void> {
  if (!('ClipboardItem' in window) || !navigator.clipboard?.write) {
    throw new ExportError('Copy to clipboard is not supported in this browser. Use Download PNG instead.');
  }
  // Pass the promise so Safari keeps the click's user activation while rendering
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': renderPosterBlob(poster, overrides, 'png', 1) })]);
}

/** Renders posters one at a time (bounded memory) into a single ZIP. */
export async function downloadAllPosters(
  posters: readonly Poster[],
  overridesFor: (p: Poster) => BrandOverrides | undefined,
  format: ExportFormat,
  scale: number,
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  const { default: JSZip } = await import('jszip'); // only loaded when someone exports a ZIP
  const zip = new JSZip();
  for (const [i, poster] of posters.entries()) {
    zip.file(posterFileName(poster, format, i), await renderPosterBlob(poster, overridesFor(poster), format, scale));
    onProgress(i + 1, posters.length);
    await new Promise((r) => setTimeout(r, 0));
  }
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  download(blob, `posters-${new Date().toISOString().slice(0, 10)}.zip`);
}
