import type { BrandId } from './brand';
import type { Fill, PosterElement, Ratio } from './element';

export type DateMode = 'nepali' | 'english' | 'custom';

export interface PosterMeta {
  dateMode: DateMode;
  /** ISO yyyy-mm-dd used for Nepali/English formatting. */
  date: string;
  /** Free text when `dateMode` is custom. */
  customDate: string;
  /** Colour theme index (0 = logo colours), or `auto` to follow the daily rotation. */
  theme: 'auto' | number;
}

/** One poster = one downloadable image. Single source of truth (proposal §29). */
export interface Poster {
  id: string;
  templateId: string;
  brandId: BrandId;
  ratio: Ratio;
  background: Fill;
  elements: PosterElement[];
  meta: PosterMeta;
  updatedAt: number;
}
