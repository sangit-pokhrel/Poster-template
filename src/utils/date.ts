import NepaliDate from 'nepali-date-converter';
import type { PosterMeta } from '../types/poster';

export function todayIso(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseIso(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "९ आश्विन २०८३" — exact Bikram Sambat via a lookup-table converter. */
export function formatNepali(iso: string): string {
  const d = parseIso(iso);
  if (!d) return '';
  try {
    return new NepaliDate(d).format('D MMMM YYYY', 'np');
  } catch {
    return formatEnglish(iso);
  }
}

/** "25 September 2026" */
export function formatEnglish(iso: string): string {
  const d = parseIso(iso);
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}

export function formatPosterDate(meta: PosterMeta): string {
  switch (meta.dateMode) {
    case 'nepali':
      return formatNepali(meta.date);
    case 'english':
      return formatEnglish(meta.date);
    case 'custom':
      return meta.customDate;
  }
}
