import { G, SAMPLE, badge, date, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';

const P = G.portrait;
const S = G.square;

export const scholarship = defineTemplate({
  id: 'academic-scholarship',
  name: 'Scholarship Announcement',
  category: 'academic',
  description: 'Campus photo, funding ribbon, benefits list, Apply Now and deadline.',
  defaultRatio: '4:5',
  background: 'brand.paper',
  elements: [
    photo(P(0, 0, 1080, 640), {
      src: SAMPLE.campus,
      overlay: { type: 'linear', angle: 90, stops: [[0, 'rgba(0, 0, 0, 0.3)'], [0.3, 'rgba(0, 0, 0, 0)'], [0.72, 'rgba(0, 0, 0, 0)'], [1, 'brand.paper']] },
    }),
    logo(P(48, 44, 110, 110), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    badge('badge', 'badge', P(64, 600, 420, 72), { text: 'Fully funded', style: 'ribbon', fill: 'brand.accent', color: '#ffffff' }),
    heading(P(64, 690, 952, 210), { text: 'MEXT Scholarship 2027 — Study in Japan', highlights: [0, 1], color: 'brand.primary', fontSize: 72 }),
    text('body', 'body', P(64, 915, 952, 210), { text: '✔ Bachelor, Master’s & PhD\n✔ Full tuition + monthly stipend\n✔ Round-trip airfare', fontSize: 34, lineHeight: 1.45, color: 'brand.ink' }),
    badge('cta', 'cta', P(64, 1150, 360, 78), { text: 'Apply now', style: 'pill', fill: 'brand.primary', color: '#ffffff' }),
    date(P(450, 1150, 566, 78), { text: 'Deadline: {date}', align: 'right', vAlign: 'middle', color: 'brand.secondary', fontSize: 30 }),
    footer(P(64, 1262, 952, 60), { align: 'center', color: 'brand.ink/60' }),
  ],
});

export const achievement = defineTemplate({
  id: 'academic-achievement',
  name: 'Congratulations',
  category: 'academic',
  description: 'Circular portrait in a gold ring — celebrate a defence, admission or award.',
  defaultRatio: '4:5',
  background: { type: 'linear', angle: 90, stops: [[0, 'brand.primary'], [1, 'brand.secondary']] },
  elements: [
    shape('texture', P(0, 0, 1080, 1350), { kind: 'dots', fill: 'rgba(255, 255, 255, 0.07)', radius: 36 }),
    logo(P(485, 50, 110, 110), { variant: 'mark', tone: 'light', align: 'center' }, { aspect: 1 }),
    text('label', 'label', P(64, 186, 952, 90), { text: 'Congratulations!', uppercase: true, fontFamily: 'brand.heading', fontSize: 64, fontWeight: 700, color: 'brand.accent', align: 'center', vAlign: 'middle', letterSpacing: 4 }),
    shape('ring', P(330, 300, 420, 420), { kind: 'ellipse', fill: 'brand.accent' }, { aspect: 1 }),
    photo(P(346, 316, 388, 388), { src: SAMPLE.portraitWoman, shape: 'circle' }, { aspect: 1 }),
    text('name', 'name', P(64, 750, 952, 96), { text: 'Sita Sharma', fontFamily: 'brand.heading', fontSize: 66, fontWeight: 700, color: '#ffffff', align: 'center', vAlign: 'middle' }),
    text('body', 'body', P(114, 856, 852, 200), { text: 'for successfully defending her Master’s thesis in Environmental Science', fontSize: 36, color: 'rgba(255, 255, 255, 0.86)', align: 'center', lineHeight: 1.45 }),
    shape('rule', P(440, 1086, 200, 6), { kind: 'line', fill: 'brand.accent' }),
    text('sub', 'subheading', P(64, 1112, 952, 64), { text: 'Proud to be part of your journey — {brand}', fontSize: 30, fontWeight: 600, color: 'brand.accent', align: 'center', vAlign: 'middle' }),
    footer(P(64, 1250, 952, 60), { align: 'center', color: 'rgba(255, 255, 255, 0.7)' }),
  ],
});

export const publication = defineTemplate({
  id: 'academic-publication',
  name: 'Publication',
  category: 'academic',
  description: 'Paper-card layout for a newly published article: title, authors, journal.',
  defaultRatio: '4:5',
  background: 'brand.paper',
  elements: [
    shape('header', P(0, 0, 1080, 116), { fill: 'brand.primary' }),
    logo(P(40, 18, 80, 80), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(136, 24, 500, 68), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 34, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    badge('badge', 'badge', P(760, 32, 280, 54), { text: 'New paper', style: 'outline', fill: 'brand.accent', color: 'brand.accent', fontSize: 24 }),
    shape('card', P(80, 170, 920, 900), { fill: '#ffffff', radius: 20, stroke: 'brand.ink/10', strokeWidth: 2 }),
    shape('card-edge', P(80, 170, 14, 900), { fill: 'brand.accent' }),
    text('label', 'label', P(140, 214, 820, 50), { text: 'Research article · Open access', uppercase: true, letterSpacing: 2, fontSize: 24, fontWeight: 600, color: 'brand.secondary' }),
    heading(P(140, 282, 820, 330), { text: 'Impact of climate variability on rice yield in the Terai region of Nepal', highlights: [1, 2], color: 'brand.ink', fontSize: 58 }),
    text('name', 'name', P(140, 640, 820, 100), { text: 'R. Adhikari, S. Thapa & P. Karki', italic: true, fontSize: 32, color: 'brand.ink/80' }, { name: 'Authors' }),
    text('journal', 'subheading', P(140, 760, 820, 120), { text: 'Journal of Agriculture and Environment · Vol. 24 (2026)', fontSize: 30, fontWeight: 600, color: 'brand.primary' }, { name: 'Journal' }),
    shape('rule', P(140, 900, 820, 3), { fill: 'brand.ink/15' }),
    text('body', 'body', P(140, 930, 820, 110), { text: 'Supported by {brand} — from proposal to publication.', fontSize: 28, color: 'brand.ink/70' }),
    badge('cta', 'cta', P(80, 1110, 440, 78), { text: 'Read the paper', style: 'pill', fill: 'brand.primary', color: '#ffffff' }),
    date(P(560, 1110, 440, 78), { align: 'right', vAlign: 'middle', color: 'brand.ink/70' }),
    footer(P(80, 1228, 920, 64), { align: 'center', color: 'brand.ink/60' }),
  ],
});

export const thesisTip = defineTemplate({
  id: 'academic-thesis-tip',
  name: 'Thesis Tip',
  category: 'academic',
  description: 'Notebook-style numbered tip with a short explanation — great for weekly series.',
  defaultRatio: '1:1',
  background: 'brand.paper',
  elements: [
    shape('texture', S(0, 0, 1080, 1080), { kind: 'dots', fill: 'brand.ink/7', radius: 30 }),
    shape('margin', S(120, 0, 4, 1080), { fill: 'brand.secondary/45' }),
    text('number', 'number', S(160, 70, 700, 170), { text: 'Tip #07', uppercase: true, fontFamily: 'brand.heading', fontSize: 110, fontWeight: 800, color: 'brand.accent', vAlign: 'middle' }),
    heading(S(160, 262, 860, 260), { text: 'Write your literature review like a conversation', highlights: [4], color: 'brand.primary', fontSize: 66 }),
    text('body', 'body', S(160, 540, 860, 320), { text: 'Group studies by theme, not by author. Show where researchers agree, where they disagree — and where the gap for your thesis begins.', fontSize: 34, lineHeight: 1.5, color: 'brand.ink/85' }),
    logo(S(160, 900, 100, 100), { variant: 'mark' }, { aspect: 1 }),
    text('brand-name', 'label', S(280, 914, 420, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 36, fontWeight: 700, color: 'brand.primary', vAlign: 'middle' }, { name: 'Brand name' }),
    footer(S(640, 914, 380, 72), { text: '{handle}', align: 'right', color: 'brand.ink/60', fontSize: 22 }),
  ],
});

