import type { Fill, PosterElement, Ratio } from './element';

export type TemplateCategory =
  | 'photo'
  | 'news'
  | 'business'
  | 'promotional'
  | 'academic'
  | 'events'
  | 'sports'
  | 'trending'
  | 'social'
  | 'story';

/** `Omit` that keeps a discriminated union discriminated. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Template elements are poster elements without user state (proposal §9). */
export type ElementSpec = DistributiveOmit<PosterElement, 'userFrames'>;

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  /** Ratio the design is authored for; applied when the template is chosen. */
  defaultRatio: Ratio;
  background: Fill;
  elements: ElementSpec[];
}
