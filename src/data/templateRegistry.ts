import type { TemplateCategory, TemplateDefinition } from '../types/template';
import { achievement, publication, scholarship, thesisTip } from './templates/academic';
import { announcement, servicePromotion } from './templates/business';
import { deadline, webinar } from './templates/events';
import { breakingBanner, classicNews, flashAlert } from './templates/news';
import { fullPhoto, photoCollage } from './templates/photo';
import { coursePromotion, limitedOffer } from './templates/promotional';
import { quote, testimonial } from './templates/social';
import { competitionResult } from './templates/sports';
import { storyHighlight } from './templates/story';
import { trending } from './templates/trending';

/** All templates, in picker order. Adding a template = add it here (proposal §40). */
export const TEMPLATES: readonly TemplateDefinition[] = [
  fullPhoto,
  photoCollage,
  classicNews,
  breakingBanner,
  flashAlert,
  scholarship,
  achievement,
  publication,
  thesisTip,
  servicePromotion,
  announcement,
  limitedOffer,
  coursePromotion,
  webinar,
  deadline,
  competitionResult,
  trending,
  quote,
  testimonial,
  storyHighlight,
];

/** Filter chips (proposal §7). */
export const CATEGORIES: ReadonlyArray<{ id: TemplateCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'photo', label: 'Photo', icon: '🖼️' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'academic', label: 'Academic', icon: '🎓' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'promotional', label: 'Promotional', icon: '🏷️' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'sports', label: 'Sports', icon: '🏆' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'social', label: 'Social', icon: '💬' },
  { id: 'story', label: 'Story', icon: '📱' },
];

const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

export const DEFAULT_TEMPLATE_ID = 'academic-scholarship';

export function getTemplate(id: string): TemplateDefinition {
  return BY_ID.get(id) ?? (BY_ID.get(DEFAULT_TEMPLATE_ID) as TemplateDefinition);
}

export const isTemplateId = (id: unknown): id is string => typeof id === 'string' && BY_ID.has(id);

export function templatesIn(category: TemplateCategory | 'all'): TemplateDefinition[] {
  return TEMPLATES.filter((t) => category === 'all' || t.category === category);
}
