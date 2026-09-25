/**
 * Canvas text never triggers webfont downloads, and Google Fonts serves
 * Devanagari/Latin as separate unicode-range subsets — so every family/weight
 * a poster uses is loaded explicitly (with mixed-script sample text) before
 * painting and before export.
 */

export const FONT_FAMILIES = [
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Cinzel',
  'Merriweather',
  'Oswald',
  'Bebas Neue',
  'Mukta',
  'Noto Sans Devanagari',
] as const;

const SAMPLE = 'Aa१२ कखग';
const WEIGHTS = [400, 500, 600, 700, 800] as const;
const loaded = new Map<string, Promise<void>>();

export function ensureFonts(families: readonly string[]): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return Promise.resolve();
  const all = [...new Set([...families, 'Mukta'])];
  return Promise.all(
    all.map((family) => {
      const hit = loaded.get(family);
      if (hit) return hit;
      const p = Promise.allSettled(
        WEIGHTS.flatMap((w) => [
          document.fonts.load(`${w} 40px "${family}"`, SAMPLE),
          document.fonts.load(`italic ${w} 40px "${family}"`, SAMPLE),
        ]),
      ).then(() => undefined);
      loaded.set(family, p);
      return p;
    }),
  ).then(() => undefined);
}
