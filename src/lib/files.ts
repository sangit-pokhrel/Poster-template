/** Filename-safe slug that keeps Devanagari (letters + combining marks). */
export function slugify(text: string, fallback = 'poster'): string {
  const s = text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return s || fallback;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png');
    } catch (err) {
      // SecurityError: a remote image without CORS headers tainted the canvas.
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
