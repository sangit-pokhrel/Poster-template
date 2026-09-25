import NepaliDate from 'nepali-date-converter';

/**
 * Today's Bikram Sambat date, e.g. "९ आश्विन २०८३".
 * Uses a lookup-table converter (exact), replacing the reference's month-offset approximation.
 */
export function todayBs(date: Date = new Date()): string {
  try {
    return new NepaliDate(date).format('D MMMM YYYY', 'np');
  } catch {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
