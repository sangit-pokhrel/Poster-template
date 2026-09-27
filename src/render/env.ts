import type { Brand } from '../types/brand';

/** Synchronous image lookup; the image service loads in the background and triggers a repaint. */
export interface ImageSource {
  get(src: string): HTMLImageElement | null;
}

/** Everything the drawing functions need besides the element itself. */
export interface RenderEnv {
  brand: Brand;
  /** Resolved date string for the {date} token. */
  dateText: string;
  images: ImageSource;
  /** `edit` may draw placeholders & hints; `export` never does. */
  mode: 'edit' | 'export';
}

export const FONT_FALLBACK = '"Mukta", "Noto Sans Devanagari", sans-serif';

/** `brand.heading` / `brand.body` tokens → family, then a Devanagari-capable fallback stack. */
export function fontStack(family: string, brand: Brand): string {
  const resolved = family === 'brand.heading' ? brand.fonts.heading : family === 'brand.body' ? brand.fonts.body : family;
  return `"${resolved}", ${FONT_FALLBACK}`;
}

export function resolveFontFamily(family: string, brand: Brand): string {
  return family === 'brand.heading' ? brand.fonts.heading : family === 'brand.body' ? brand.fonts.body : family;
}

/** {brand} {tagline} {website} {handle} {phone} {email} {address} {date} */
export function resolveTokens(text: string, env: Pick<RenderEnv, 'brand' | 'dateText'>): string {
  const { brand } = env;
  const values: Record<string, string> = {
    brand: brand.name,
    tagline: brand.tagline,
    website: brand.website,
    handle: brand.handle,
    phone: brand.phone,
    email: brand.email,
    address: brand.address,
    date: env.dateText,
  };
  const sub = (s: string) => s.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
  return text.split('\n').map((line) => resolveLine(line, sub)).join('\n');
}

/**
 * Substitutes tokens in one line. On lines built from tokens and separators
 * ("{website}  •  {phone}"), a segment whose token is empty is dropped together
 * with its separator, so blank brand fields never leave "•  •" behind.
 */
function resolveLine(line: string, sub: (s: string) => string): string {
  if (!/\{\w+\}/.test(line)) return line;
  const parts = line.split(/(\s*[•|]\s*)/);
  const out: string[] = [];
  let separator = '';
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      separator = part;
      return;
    }
    const value = sub(part).trim();
    if (!value) return;
    if (out.length > 0) out.push(separator);
    out.push(value);
  });
  return out.join('');
}
