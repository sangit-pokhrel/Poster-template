import { REQUIRED_FONTS } from '../engine';

let ready: Promise<void> | null = null;

/**
 * Canvas text never triggers a webfont download, and Google Fonts serves
 * Devanagari and Latin as separate unicode-range subsets, so we explicitly
 * load every face with sample text from both scripts before drawing.
 */
export function ensureFontsLoaded(): Promise<void> {
  if (ready) return ready;
  if (typeof document === 'undefined' || !('fonts' in document)) return Promise.resolve();
  const sample = 'कखग अआ १२३ Aa 123';
  ready = Promise.allSettled(REQUIRED_FONTS.map((f) => document.fonts.load(f, sample)))
    .then(() => document.fonts.ready)
    .then(() => undefined);
  return ready;
}
