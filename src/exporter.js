import { toPng, getFontEmbedCSS } from 'html-to-image';
import JSZip from 'jszip';

export const slug = (s, fallback = 'poster') =>
  (s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || fallback;

async function waitForImages(node) {
  const imgs = [...node.querySelectorAll('img')];
  await Promise.all(
    imgs.map((img) =>
      img.complete ? null : new Promise((res) => { img.onload = res; img.onerror = res; })
    )
  );
}

// Renders each DOM node to a PNG data URL. Fonts are embedded once and reused for the batch.
export async function nodesToPngs(nodes, onProgress) {
  await document.fonts.ready;
  let fontEmbedCSS;
  try {
    fontEmbedCSS = await getFontEmbedCSS(nodes[0]);
  } catch {
    fontEmbedCSS = undefined;
  }
  const out = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    await waitForImages(node);
    const opts = { pixelRatio: 1, fontEmbedCSS, cacheBust: false };
    if (i === 0) await toPng(node, opts); // warm-up pass: first render can miss images in some browsers
    out.push(await toPng(node, opts));
    onProgress?.(i + 1, nodes.length);
  }
  return out;
}

function trigger(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadDataUrl(dataUrl, filename) {
  trigger(dataUrl, filename);
}

export async function downloadZip(files, zipName) {
  const zip = new JSZip();
  const used = new Set();
  files.forEach(({ name, dataUrl }) => {
    let n = name;
    for (let k = 2; used.has(n); k++) n = name.replace(/\.png$/, `-${k}.png`);
    used.add(n);
    zip.file(n, dataUrl.split(',')[1], { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  trigger(url, zipName);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
