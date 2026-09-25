import { G, SAMPLE, badge, defineTemplate, footer, heading, logo, photo, text } from './builders';

const V = G.story;

export const storyHighlight = defineTemplate({
  id: 'story-highlight',
  name: 'Story Highlight',
  category: 'story',
  description: 'Vertical 9:16 story with a tall photo, headline and swipe-up call to action.',
  defaultRatio: '9:16',
  background: 'brand.primary',
  elements: [
    photo(V(0, 0, 1080, 1180), {
      src: SAMPLE.graduation,
      overlay: { type: 'linear', angle: 90, stops: [[0, 'rgba(0, 0, 0, 0.35)'], [0.2, 'rgba(0, 0, 0, 0)'], [0.62, 'rgba(0, 0, 0, 0)'], [1, 'brand.primary']] },
    }),
    logo(V(64, 80, 120, 120), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', V(200, 98, 600, 84), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 42, fontWeight: 700, color: '#ffffff', vAlign: 'middle', shadow: true }, { name: 'Brand name' }),
    heading(V(64, 1140, 952, 400), { text: 'Get admitted to your dream university abroad', highlights: [4, 5], color: '#ffffff', fontSize: 92 }),
    text('body', 'body', V(64, 1550, 952, 120), { text: 'SOP · LOR · CV · Scholarship essays', fontSize: 36, color: 'rgba(255, 255, 255, 0.8)' }),
    badge('cta', 'cta', V(200, 1700, 680, 104), { text: 'Swipe up to book ↑', style: 'pill', fill: 'brand.accent', color: '#ffffff', uppercase: false, letterSpacing: 0, fontSize: 42 }),
    footer(V(64, 1834, 952, 56), { align: 'center', color: 'rgba(255, 255, 255, 0.7)' }),
  ],
});
