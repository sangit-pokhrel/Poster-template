import { G, SAMPLE, badge, date, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';

const P = G.portrait;
const S = G.square;

export const classicNews = defineTemplate({
  id: 'news-classic',
  name: 'Classic News',
  category: 'news',
  description: 'Photo fading into white, centred headline with highlighted words and a comment call-out.',
  defaultRatio: '4:5',
  background: '#ffffff',
  elements: [
    photo(P(0, 0, 1080, 860), {
      src: SAMPLE.students,
      overlay: { type: 'linear', angle: 90, stops: [[0, 'rgba(0, 0, 0, 0.35)'], [0.25, 'rgba(0, 0, 0, 0)'], [0.62, 'rgba(255, 255, 255, 0)'], [1, '#ffffff']] },
    }),
    logo(P(48, 40, 104, 104), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(168, 56, 480, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 36, fontWeight: 700, color: '#ffffff', vAlign: 'middle', shadow: true }, { name: 'Brand name' }),
    date(P(660, 62, 372, 60), { align: 'right', vAlign: 'middle', color: '#ffffff', shadow: true }),
    heading(P(64, 800, 952, 320), { text: 'TU extends thesis submission deadline for Master’s students', highlights: [1, 2, 3], align: 'center', vAlign: 'middle', color: 'brand.ink', fontSize: 64 }),
    shape('rule-a', P(390, 1146, 150, 6), { kind: 'line', fill: 'brand.primary' }),
    shape('rule-b', P(540, 1146, 150, 6), { kind: 'line', fill: 'brand.accent' }),
    text('cta', 'cta', P(64, 1170, 952, 60), { text: 'Full details in the comments ↓', align: 'center', vAlign: 'middle', fontSize: 30, fontWeight: 600, color: 'brand.primary' }),
    shape('bar', P(0, 1266, 1080, 84), { fill: 'brand.primary' }),
    footer(P(64, 1266, 952, 84), { color: '#ffffff', align: 'center' }),
  ],
});

export const breakingBanner = defineTemplate({
  id: 'news-breaking',
  name: 'Breaking Banner',
  category: 'news',
  description: 'Brand bar with BREAKING tag, framed photo and an info strip.',
  defaultRatio: '4:5',
  background: '#ffffff',
  elements: [
    shape('top-bar', P(0, 0, 1080, 150), { fill: 'brand.primary' }),
    logo(P(40, 25, 100, 100), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(156, 40, 520, 70), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 38, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    badge('badge', 'badge', P(760, 46, 280, 58), { text: 'Breaking', style: 'tag', fill: 'brand.accent', color: '#ffffff' }),
    photo(P(40, 190, 1000, 560), { src: SAMPLE.campus, radius: 24 }),
    heading(P(56, 780, 968, 310), { text: 'Scholarship results for the 2026 intake are now published', highlights: [0, 1], color: 'brand.ink', fontSize: 66, vAlign: 'middle' }),
    shape('strip', P(40, 1112, 1000, 76), { fill: 'brand.primary/8', radius: 14 }),
    date(P(72, 1112, 460, 76), { vAlign: 'middle', color: 'brand.primary' }),
    text('cta', 'cta', P(540, 1112, 468, 76), { text: 'Read more in the comments', align: 'right', vAlign: 'middle', fontSize: 26, fontWeight: 600, color: 'brand.primary' }),
    footer(P(40, 1222, 1000, 70), { align: 'center', color: 'brand.ink/65' }),
    shape('bottom', P(0, 1326, 1080, 24), { fill: 'brand.accent' }),
  ],
});

export const flashAlert = defineTemplate({
  id: 'news-flash',
  name: 'Flash Alert',
  category: 'news',
  description: 'Text-only alert on a brand gradient — no photo needed.',
  defaultRatio: '1:1',
  background: { type: 'linear', angle: 45, stops: [[0, 'brand.primary'], [1, 'brand.secondary']] },
  elements: [
    shape('texture', S(0, 0, 1080, 1080), { kind: 'stripes', fill: 'rgba(255, 255, 255, 0.05)', radius: 44 }),
    badge('badge', 'badge', S(64, 80, 300, 72), { text: '⚡ Flash', style: 'tag', fill: 'brand.accent', color: '#ffffff' }),
    heading(S(64, 210, 952, 520), { text: 'Last date to apply for the Erasmus Mundus scholarship is this Friday', highlights: [7, 8], color: '#ffffff', fontSize: 84, vAlign: 'middle' }),
    text('body', 'body', S(64, 760, 952, 120), { text: 'Don’t miss out — share this with a friend who needs it.', fontSize: 34, color: 'rgba(255, 255, 255, 0.78)' }),
    logo(S(64, 930, 96, 96), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', S(176, 942, 460, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 36, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    date(S(640, 948, 376, 60), { align: 'right', vAlign: 'middle', color: 'rgba(255, 255, 255, 0.75)' }),
  ],
});
