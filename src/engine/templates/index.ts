import type { TemplateCategory, TemplateDef } from '../types';
import { breaking, business, cinema, editorial, factCheck, international, interview, multiPhoto, sports } from './framed';
import { classic, flash, live, viral, weather } from './hero';
import { minPhoto, purePhoto } from './photoOnly';
import { split } from './split';
import { notice, quote, tribute } from './statement';

/**
 * Template registry — display order in the picker.
 * The first 13 are ports of the KrantiPatra reference templates; the last 7 extend
 * the set to 20 using the same primitives and layout grammar.
 */
export const TEMPLATES: readonly TemplateDef[] = [
  classic,
  purePhoto,
  minPhoto,
  multiPhoto,
  breaking,
  flash,
  quote,
  editorial,
  interview,
  sports,
  cinema,
  viral,
  factCheck,
  // extended set
  weather,
  business,
  international,
  split,
  notice,
  tribute,
  live,
];

const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

export const DEFAULT_TEMPLATE_ID = classic.id;

export function getTemplate(id: string): TemplateDef {
  return BY_ID.get(id) ?? classic;
}

export const isTemplateId = (id: string): boolean => BY_ID.has(id);

export const TEMPLATE_CATEGORIES: ReadonlyArray<{ id: TemplateCategory | 'all'; icon: string }> = [
  { id: 'all', icon: '✨' },
  { id: 'photo', icon: '📷' },
  { id: 'news', icon: '📰' },
  { id: 'politics', icon: '💼' },
  { id: 'sports', icon: '⚽' },
  { id: 'viral', icon: '🔥' },
];
