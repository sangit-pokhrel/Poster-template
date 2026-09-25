import { G, SAMPLE, badge, defineTemplate, footer, heading, logo, photo, text } from './builders';

const P = G.portrait;

export const trending = defineTemplate({
  id: 'trending-viral',
  name: 'Trending',
  category: 'trending',
  description: 'Full-bleed photo, TRENDING pill and marker-highlighted headline — built for shares.',
  defaultRatio: '4:5',
  background: '#000000',
  elements: [
    photo(P(0, 0, 1080, 1350), {
      src: SAMPLE.students,
      overlay: { type: 'linear', angle: 90, stops: [[0, 'rgba(0, 0, 0, 0.25)'], [0.45, 'rgba(0, 0, 0, 0.1)'], [1, 'rgba(0, 0, 0, 0.92)']] },
    }),
    badge('badge', 'badge', P(64, 64, 300, 66), { text: '🔥 Trending', style: 'pill', fill: 'brand.accent', color: '#ffffff' }),
    logo(P(916, 44, 116, 116), { variant: 'mark', tone: 'light', align: 'right' }, { aspect: 1 }),
    heading(P(64, 820, 952, 320), {
      text: 'Why 70% of students delay their thesis — and how to beat it',
      highlights: [1, 2],
      highlightStyle: 'marker',
      highlightColor: 'brand.accent',
      color: '#ffffff',
      fontSize: 70,
      vAlign: 'bottom',
      lineHeight: 1.2,
    }),
    text('sub', 'subheading', P(64, 1160, 952, 70), { text: 'Swipe → 5 proven habits', fontSize: 34, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', vAlign: 'middle' }),
    footer(P(64, 1262, 952, 56), { color: 'rgba(255, 255, 255, 0.6)', fontSize: 22 }),
  ],
});
