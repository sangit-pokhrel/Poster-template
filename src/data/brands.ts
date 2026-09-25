import type { Brand, BrandId, BrandOverrides } from '../types/brand';

/**
 * The two Facebook pages this studio produces posters for.
 * Colours are sampled from each logo; taglines and locations come from the
 * pages' public descriptions. Phone / website / email are left blank for the
 * team to fill in (Brand kit), rather than guessed.
 */
export const BRANDS: Record<BrandId, Brand> = {
  'nepal-scholar': {
    id: 'nepal-scholar',
    name: 'Nepal Scholar',
    tagline: 'Thesis · Research · Projects · Publications',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61577909248975',
    website: '',
    handle: 'Nepal Scholar · Kathmandu',
    phone: '',
    email: '',
    palette: {
      primary: '#1f2a3c', // slate navy (mountain / book)
      secondary: '#6d2f2c', // maroon (book gradient)
      accent: '#c9a45c', // gold (pen nib & wordmark)
      ink: '#1b2230',
      paper: '#fbf8f2',
    },
    fonts: { heading: 'Playfair Display', body: 'Poppins' },
    assets: {
      logo: '/brands/nepal-scholar/logo.png',
      mark: '/brands/nepal-scholar/mark.png',
    },
  },
  'thesis-companion': {
    id: 'thesis-companion',
    name: 'Thesis Companion',
    tagline: 'Academic support from Bachelor to PhD',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61567854154156',
    website: '',
    handle: 'Thesis Companion · Kathmandu',
    phone: '',
    email: '',
    palette: {
      primary: '#111111', // monochrome roundel
      secondary: '#3b3b3b',
      accent: '#2f6fed', // single accent for highlights & CTAs
      ink: '#141414',
      paper: '#f6f6f4',
    },
    fonts: { heading: 'Cinzel', body: 'Montserrat' },
    assets: {
      logo: '/brands/thesis-companion/logo.png',
      mark: '/brands/thesis-companion/mark.png',
      logoLight: '/brands/thesis-companion/logo-light.png',
      markLight: '/brands/thesis-companion/mark-light.png',
    },
  },
};

export const BRAND_IDS = Object.keys(BRANDS) as BrandId[];
export const DEFAULT_BRAND_ID: BrandId = 'nepal-scholar';

export const isBrandId = (v: unknown): v is BrandId => typeof v === 'string' && v in BRANDS;

/** Brand kit with the team's edits applied. */
export function resolveBrand(id: BrandId, overrides: BrandOverrides | undefined): Brand {
  const base = BRANDS[id];
  if (!overrides) return base;
  const { palette, logo, ...fields } = overrides;
  const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => typeof v === 'string'));
  return {
    ...base,
    ...clean,
    palette: { ...base.palette, ...palette },
    assets: logo ? { ...base.assets, logo, logoLight: undefined } : base.assets,
  };
}
