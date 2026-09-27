/**
 * The ad library.
 * - Studio designs: layouts rebuilt from the team's reference posters, shared
 *   by every brand and recoloured by the brand's colour theme.
 * - Brand classics: 100 ad types drawn by each brand's own design system
 *   (different layouts per brand, not just colours).
 * `buildLayout(adId, brandId)` returns the layout for either kind.
 */
import type { BrandId } from '../types/brand';
import type { AdCategory, AdDefinition, AdKind, Layout } from '../types/template';
import { ABROAD, BRAND, OFFERS, TIPS, TRAINING, TRUST } from './ads/growth';
import { ANALYSIS, ASSIGNMENTS, EDITING, PROPOSAL, PUBLICATION, THESIS } from './ads/services';
import { artovaSystem } from './systems/artova';
import { nepalScholarSystem } from './systems/nepalScholar';
import { STUDIO } from './studio';
import { thesisCompanionSystem } from './systems/thesisCompanion';
import { dailyPick } from './themes';

/** Shared designs from the reference posters (same for every brand). */
export const STUDIO_ADS: readonly AdDefinition[] = STUDIO.map((e) => e.ad);
/** Ads drawn in each brand's own design system. */
export const CLASSIC_ADS: readonly AdDefinition[] = [...THESIS, ...PROPOSAL, ...ANALYSIS, ...PUBLICATION, ...EDITING, ...ASSIGNMENTS, ...ABROAD, ...TRAINING, ...OFFERS, ...TRUST, ...TIPS, ...BRAND];
export const ADS: readonly AdDefinition[] = [...STUDIO_ADS, ...CLASSIC_ADS];

const STUDIO_BUILD = new Map(STUDIO.map((e) => [e.ad.id, e.build]));
const STUDIO_REF = new Map(STUDIO.map((e, i) => [e.ad.id, { ref: e.ref, variation: STUDIO.findIndex((o) => o.ref === e.ref) === i ? 1 : 2 }]));

/** Which reference poster a studio design was rebuilt from (null for brand classics). */
export function studioInfo(adId: string): { ref: number; variation: 1 | 2 } | null {
  const hit = STUDIO_REF.get(adId);
  return hit ? { ref: hit.ref, variation: hit.variation === 1 ? 1 : 2 } : null;
}

/** Number of distinct reference posters rebuilt as studio designs. */
export const REFERENCE_COUNT = new Set(STUDIO.map((e) => e.ref)).size;

/** Library filters: a content category, or a collection. */
export type LibraryFilter = AdCategory | 'all' | 'today' | 'studio' | 'classic';

export const FEATURED_PER_DAY = 15;
const BRAND_SALT: Record<BrandId, number> = { 'nepal-scholar': 1, 'thesis-companion': 2, 'artova-research': 3 };

/** Today's featured studio designs for a page (a fresh set of 15 every day). */
export function featuredToday(brandId: BrandId, iso: string): AdDefinition[] {
  return dailyPick(STUDIO_ADS, iso, FEATURED_PER_DAY, BRAND_SALT[brandId]);
}

export const COLLECTIONS: ReadonlyArray<{ id: LibraryFilter; label: string; icon: string }> = [
  { id: 'today', label: 'Today’s 15', icon: '📅' },
  { id: 'studio', label: 'Studio designs', icon: '🎨' },
  { id: 'classic', label: 'Brand classics', icon: '🏛️' },
  { id: 'all', label: 'All', icon: '✨' },
];

export const CATEGORIES: ReadonlyArray<{ id: AdCategory; label: string; icon: string }> = [
  { id: 'thesis', label: 'Thesis', icon: '🎓' },
  { id: 'proposal', label: 'Proposal', icon: '📝' },
  { id: 'analysis', label: 'Data Analysis', icon: '📊' },
  { id: 'publication', label: 'Publication', icon: '📰' },
  { id: 'editing', label: 'Editing & Plagiarism', icon: '✍️' },
  { id: 'assignments', label: 'Assignments', icon: '📚' },
  { id: 'abroad', label: 'Study Abroad', icon: '✈️' },
  { id: 'training', label: 'Training', icon: '🎤' },
  { id: 'offers', label: 'Offers', icon: '🏷️' },
  { id: 'trust', label: 'Reviews & Results', icon: '⭐' },
  { id: 'tips', label: 'Tips & Quotes', icon: '💡' },
  { id: 'brand', label: 'Brand & Contact', icon: '📞' },
];

export const KIND_LABEL: Record<AdKind, string> = {
  hero: 'Hero',
  services: 'Services',
  offer: 'Offer',
  stat: 'Stats',
  steps: 'Steps',
  testimonial: 'Review',
  event: 'Event',
  deadline: 'Countdown',
  announcement: 'Notice',
  tip: 'Tip',
  checklist: 'Checklist',
  compare: 'Compare',
  quote: 'Quote',
  contact: 'Contact',
};

export const DESIGN_SYSTEMS: Record<BrandId, Record<AdKind, (c: AdDefinition['content']) => Layout>> = {
  'nepal-scholar': nepalScholarSystem,
  'thesis-companion': thesisCompanionSystem,
  'artova-research': artovaSystem,
};

const BY_ID = new Map(ADS.map((a) => [a.id, a]));

export const DEFAULT_AD_ID = 'studio-why-choose';

export function getAd(id: string): AdDefinition {
  return BY_ID.get(id) ?? (BY_ID.get(DEFAULT_AD_ID) as AdDefinition);
}

export const isAdId = (id: unknown): id is string => typeof id === 'string' && BY_ID.has(id);

const matches = (a: AdDefinition, q: string) =>
  !q || a.name.toLowerCase().includes(q) || (a.content.heading ?? a.content.quote ?? '').toLowerCase().replace(/\*/g, '').includes(q) || KIND_LABEL[a.kind].toLowerCase().includes(q);

/** Ads for a filter and search text. `today` needs the brand and date (the daily featured set). */
export function adsIn(filter: LibraryFilter, query = '', today?: { brandId: BrandId; iso: string }): AdDefinition[] {
  const q = query.trim().toLowerCase();
  const pool =
    filter === 'today' ? (today ? featuredToday(today.brandId, today.iso) : STUDIO_ADS.slice(0, FEATURED_PER_DAY))
    : filter === 'studio' ? STUDIO_ADS
    : filter === 'classic' ? CLASSIC_ADS
    : filter === 'all' ? ADS
    : ADS.filter((a) => a.category === filter);
  return pool.filter((a) => matches(a, q));
}

const layoutCache = new Map<string, Layout>();

/** The ad rendered in a brand's design system (cached; callers must clone before mutating). */
export function buildLayout(adId: string, brandId: BrandId): Layout {
  const ad = getAd(adId);
  const shared = ad.design ? STUDIO_BUILD.get(ad.design) : undefined;
  // Studio layouts are identical for every brand; the theme colours them.
  const key = shared ? ad.id : `${ad.id}|${brandId}`;
  let layout = layoutCache.get(key);
  if (!layout) {
    layout = shared ? shared(ad.content) : DESIGN_SYSTEMS[brandId][ad.kind](ad.content);
    layoutCache.set(key, layout);
  }
  return layout;
}
