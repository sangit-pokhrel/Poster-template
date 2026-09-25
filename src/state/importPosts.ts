import { isTemplateId } from '../engine';
import type { Post } from '../engine';
import { parseCsv } from '../lib/csv';
import { MAX_EXTRA_PHOTOS, createPost } from './defaults';

/**
 * Words wrapped in *asterisks* become highlighted words:
 * "नेपाल *प्रिमियर लिग* सुरु" → text without markers + highlighted indices [1, 2].
 */
export function parseHighlightMarkup(input: string): { headline: string; highlighted: number[] } {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const highlighted: number[] = [];
  let open = false;
  const clean = words.map((raw, i) => {
    let w = raw;
    const starts = w.startsWith('*');
    if (starts) w = w.slice(1);
    const ends = w.endsWith('*');
    if (ends) w = w.slice(0, -1);
    if (starts) open = true;
    if (open) highlighted.push(i);
    if (ends) open = false;
    return w;
  });
  return { headline: clean.join(' '), highlighted };
}

const pick = (row: Record<string, string>, ...keys: string[]) => {
  for (const k of keys) {
    const v = row[k];
    if (v) return v;
  }
  return '';
};

/** CSV rows → posts. Unknown template ids fall back to `fallbackTemplateId`. */
export function postsFromCsv(text: string, fallbackTemplateId: string, fallbackDate: string): Post[] {
  return parseCsv(text)
    .map((row) => {
      const { headline, highlighted } = parseHighlightMarkup(pick(row, 'headline', 'title'));
      const template = pick(row, 'template');
      return createPost({
        templateId: isTemplateId(template) ? template : fallbackTemplateId,
        headline,
        highlighted,
        speaker: pick(row, 'speaker', 'author'),
        badgeText: pick(row, 'badge', 'category'),
        date: pick(row, 'date') || fallbackDate,
        photoSrc: pick(row, 'photo', 'image'),
        extraPhotoSrcs: ['photo2', 'photo3', 'photo4'].map((k) => row[k] ?? '').filter(Boolean).slice(0, MAX_EXTRA_PHOTOS),
      });
    })
    .filter((p) => p.headline || p.photoSrc);
}
