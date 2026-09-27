export type BrandId = 'nepal-scholar' | 'thesis-companion' | 'artova-research';

export interface BrandPalette {
  /** Main brand colour: bars, headings, key shapes. */
  primary: string;
  /** Supporting colour: secondary shapes, gradients. */
  secondary: string;
  /** Highlight colour: highlighted words, badges, CTAs. */
  accent: string;
  /** Dark neutral for text on light backgrounds. */
  ink: string;
  /** Light neutral / paper background. */
  paper: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface BrandAssets {
  /** Full lockup (symbol + wordmark), transparent PNG, for light backgrounds. */
  logo: string;
  /** Symbol only, for small corners and circles. */
  mark: string;
  /** Variants for dark backgrounds. When missing, templates put the logo on a card. */
  logoLight?: string;
  markLight?: string;
}

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  facebookUrl: string;
  website: string;
  handle: string;
  phone: string;
  email: string;
  /** Street / area shown on location lines ({address}). */
  address: string;
  palette: BrandPalette;
  fonts: BrandFonts;
  assets: BrandAssets;
  /**
   * Extra colours seen in the logo and the page's own posters. Colour themes
   * are generated from these plus the palette (see `design/themes.ts`).
   */
  themeSeeds: string[];
}

/** User edits to a brand kit (contact details, colours, uploaded logo). */
export type BrandOverrides = Partial<Pick<Brand, 'tagline' | 'website' | 'handle' | 'phone' | 'email' | 'address'>> & {
  palette?: Partial<BrandPalette>;
  /** Replaces `assets.logo` (asset:… or URL). */
  logo?: string;
};
