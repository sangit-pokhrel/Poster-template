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
      logoLight: '/brands/nepal-scholar/logo-light.png',
      markLight: '/brands/nepal-scholar/mark-light.png',
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
    // Montserrat for bold Swiss-style headlines; Cinzel echoes the wordmark in labels.
    fonts: { heading: 'Montserrat', body: 'Montserrat' },
    assets: {
      logo: '/brands/thesis-companion/logo.png',
      mark: '/brands/thesis-companion/mark.png',
      logoLight: '/brands/thesis-companion/logo-light.png',
      markLight: '/brands/thesis-companion/mark-light.png',
    },
  },
  'artova-research': {
    id: 'artova-research',
    name: 'Artova Research',
    tagline: 'Research · Data · Innovation',
    // Logo and location from the Artova Solutions page (Kirtipur); replace in the Brand kit if needed.
    facebookUrl: 'https://www.facebook.com/artovasolutions/',
    website: '',
    handle: 'Artova Research · Kirtipur',
    phone: '',
    email: '',
    palette: {
      primary: '#4c0ba8', // deep violet (logo background)
      secondary: '#9b00e0', // bright violet (logo gradient end)
      accent: '#22d3ee', // cyan for CTAs and highlights
      ink: '#1a0b2e',
      paper: '#f6f1ff',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    assets: {
      logo: '/brands/artova-research/logo.png',
      mark: '/brands/artova-research/mark.png',
      logoLight: '/brands/artova-research/logo-light.png',
      markLight: '/brands/artova-research/mark-light.png',
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
