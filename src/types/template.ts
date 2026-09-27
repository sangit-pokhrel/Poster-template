import type { Fill, PosterElement } from './element';

/** `Omit` that keeps a discriminated union discriminated. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Layout elements are poster elements without user state (proposal §9). */
export type ElementSpec = DistributiveOmit<PosterElement, 'userFrames'>;

/** Filter categories for the ad library (proposal §7). */
export type AdCategory =
  | 'thesis'
  | 'proposal'
  | 'analysis'
  | 'publication'
  | 'editing'
  | 'assignments'
  | 'abroad'
  | 'training'
  | 'offers'
  | 'trust'
  | 'tips'
  | 'brand';

/**
 * Layout archetypes. Every brand's design system implements all of them in its
 * own visual language, so one ad renders as three genuinely different designs.
 */
export type AdKind =
  | 'hero'
  | 'services'
  | 'offer'
  | 'stat'
  | 'steps'
  | 'testimonial'
  | 'event'
  | 'deadline'
  | 'announcement'
  | 'tip'
  | 'checklist'
  | 'compare'
  | 'quote'
  | 'contact';

export interface AdItem {
  /** Poster icon name (see `design/icons.ts`). */
  icon: string;
  title: string;
  text?: string;
}

/** The words of an ad — brand-neutral. Layouts decide how it looks. */
export interface AdContent {
  eyebrow?: string;
  /** `*word*` marks highlighted words. Testimonials/quotes use `quote` instead. */
  heading?: string;
  sub?: string;
  body?: string;
  bullets?: string[];
  items?: AdItem[];
  cta?: string;
  badge?: string;
  number?: string;
  numberLabel?: string;
  price?: string;
  oldPrice?: string;
  photo?: string;
  person?: { name: string; role: string; photo?: string };
  when?: string;
  where?: string;
  compare?: { leftTitle: string; left: string[]; rightTitle: string; right: string[] };
  quote?: string;
  author?: string;
}

export interface AdDefinition {
  id: string;
  name: string;
  category: AdCategory;
  kind: AdKind;
  content: AdContent;
  /**
   * Shared studio design (same layout for every brand, coloured by the theme).
   * Absent = the brand's own design system draws it from `kind`.
   */
  design?: string;
}

/** What a design system produces for one ad. */
export interface Layout {
  background: Fill;
  elements: ElementSpec[];
}
