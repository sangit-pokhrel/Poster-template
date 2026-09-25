/**
 * The ad library: 100 promotional ad types × 3 brand design systems.
 * An ad is brand-neutral content; `buildLayout(adId, brandId)` renders it in
 * that brand's own design language (different layouts, not just colours).
 */
import type { BrandId } from '../types/brand';
import type { AdCategory, AdDefinition, AdKind, Layout } from '../types/template';
import { ABROAD, BRAND, OFFERS, TIPS, TRAINING, TRUST } from './ads/growth';
import { ANALYSIS, ASSIGNMENTS, EDITING, PROPOSAL, PUBLICATION, THESIS } from './ads/services';
import { artovaSystem } from './systems/artova';
import { nepalScholarSystem } from './systems/nepalScholar';
import { thesisCompanionSystem } from './systems/thesisCompanion';

export const ADS: readonly AdDefinition[] = [...THESIS, ...PROPOSAL, ...ANALYSIS, ...PUBLICATION, ...EDITING, ...ASSIGNMENTS, ...ABROAD, ...TRAINING, ...OFFERS, ...TRUST, ...TIPS, ...BRAND];

export const CATEGORIES: ReadonlyArray<{ id: AdCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '✨' },
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

export const DEFAULT_AD_ID = 'thesis-support';

export function getAd(id: string): AdDefinition {
  return BY_ID.get(id) ?? (BY_ID.get(DEFAULT_AD_ID) as AdDefinition);
}

export const isAdId = (id: unknown): id is string => typeof id === 'string' && BY_ID.has(id);

export function adsIn(category: AdCategory | 'all', query = ''): AdDefinition[] {
  const q = query.trim().toLowerCase();
  return ADS.filter(
    (a) =>
      (category === 'all' || a.category === category) &&
      (!q || a.name.toLowerCase().includes(q) || (a.content.heading ?? a.content.quote ?? '').toLowerCase().replace(/\*/g, '').includes(q) || KIND_LABEL[a.kind].toLowerCase().includes(q)),
  );
}

const layoutCache = new Map<string, Layout>();

/** The ad rendered in a brand's design system (cached; callers must clone before mutating). */
export function buildLayout(adId: string, brandId: BrandId): Layout {
  const key = `${adId}|${brandId}`;
  let layout = layoutCache.get(key);
  if (!layout) {
    const ad = getAd(adId);
    layout = DESIGN_SYSTEMS[brandId][ad.kind](ad.content);
    layoutCache.set(key, layout);
  }
  return layout;
}
