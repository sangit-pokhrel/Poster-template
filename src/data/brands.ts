import type { Brand, BrandAssets, BrandId, BrandOverrides } from '../types/brand';
import { droppedLogos } from '../services/logoFolder';

/**
 * The three Facebook pages this studio produces posters for.
 * Colours are sampled from each logo; contact details come from the pages'
 * own posters (design-references/). Everything is editable in the Brand kit.
 */
export const BRANDS: Record<BrandId, Brand> = {
  'nepal-scholar': {
    id: 'nepal-scholar',
    name: 'Nepal Scholar',
    tagline: 'Thesis · Research · Projects · Publications',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61577909248975',
    website: '',
    handle: 'Nepal Scholar · Kathmandu',
    phone: '9809816596',
    email: 'nepalscholar61@gmail.com',
    address: 'Chardobato, Thimi, Bhaktapur',
    // Yellow · white · black, as the team uses on the page
    palette: {
      primary: '#111111', // black
      secondary: '#b58500', // deep yellow for bands and highlights on white
      accent: '#f5b700', // yellow (the gold of the pen nib and wordmark)
      ink: '#111111',
      paper: '#ffffff',
    },
    fonts: { heading: 'Playfair Display', body: 'Poppins' },
    assets: {
      logo: '/brands/nepal-scholar/logo.png',
      mark: '/brands/nepal-scholar/mark.png',
      logoLight: '/brands/nepal-scholar/logo-light.png',
      markLight: '/brands/nepal-scholar/mark-light.png',
    },
    themeSeeds: ['#111111', '#f5b700'],
    themeFamily: {
      darks: [['Jet', '#111111'], ['Charcoal', '#1f1f1f'], ['Espresso', '#1c160c']],
      pops: [['Sunflower', '#f5b700'], ['Gold', '#e0a100'], ['Lemon', '#f7d117'], ['Amber', '#ffab00'], ['Honey', '#f2c14e']],
    },
  },
  'thesis-companion': {
    id: 'thesis-companion',
    name: 'Thesis Companion',
    tagline: 'Academic support from Bachelor to PhD',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61567854154156',
    website: '',
    handle: 'Thesis Companion · Kathmandu',
    phone: '970-7711397',
    email: 'thesiscompanionnepal@gmail.com',
    address: 'Chardobato, Thimi',
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
    // Navy, royal blue, warm yellow and campaign red from the page's posters
    themeSeeds: ['#0b2d52', '#1e5bd8', '#ffc21a', '#e11d2e'],
  },
  'artova-research': {
    id: 'artova-research',
    name: 'Artova Research',
    tagline: 'Research · Data · Innovation',
    // Logo and location from the Artova Solutions page (Kirtipur); replace in the Brand kit if needed.
    facebookUrl: 'https://www.facebook.com/artovasolutions/',
    website: 'www.artovaresearch.netlify.app',
    handle: 'Artova Research · Kirtipur',
    phone: '9744988551',
    email: 'artovaresearch@gmail.com',
    address: 'Kirtipur, Kathmandu',
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
    // Indigo, electric purple and lavender from the page's posters
    themeSeeds: ['#2e1065', '#7c3aed', '#a78bfa', '#1e1b4b'],
  },
};

/** Logos dropped into public/logo/<brand>/ replace the bundled artwork. */
function withDroppedLogo(assets: BrandAssets, id: BrandId): BrandAssets {
  const d = droppedLogos[id];
  if (!d) return assets;
  return {
    logo: d.logo,
    mark: d.mark ?? d.logo,
    // Without a dedicated light version, templates put the logo on a card on dark backgrounds.
    logoLight: d.logoLight,
    markLight: d.markLight ?? (d.mark ? undefined : d.logoLight),
  };
}

for (const brand of Object.values(BRANDS)) brand.assets = withDroppedLogo(brand.assets, brand.id);

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
