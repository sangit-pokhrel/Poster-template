import { G, SAMPLE, badge, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';
import type { Frame } from '../../types/element';

const S = G.square;
const L = G.landscape;
const P = G.portrait;

/** Same stacked frame for every non-landscape ratio. */
const stacked = (f: Frame) => ({ '1:1': f, '4:5': f, '9:16': f });

export const limitedOffer = defineTemplate({
  id: 'promo-offer',
  name: 'Limited Offer',
  category: 'promotional',
  description: 'Big discount seal, headline and claim button over a brand gradient.',
  defaultRatio: '1:1',
  background: { type: 'linear', angle: 135, stops: [[0, 'brand.primary'], [1, 'brand.secondary']] },
  elements: [
    photo(S(540, 0, 540, 1080), {
      src: SAMPLE.students,
      overlay: { type: 'linear', angle: 0, stops: [[0, 'brand.primary'], [0.45, 'brand.primary/0']] },
    }),
    badge('badge', 'badge', S(610, 90, 300, 300), { text: '30%\nOFF', style: 'circle', fill: 'brand.accent', color: '#ffffff', fontFamily: 'brand.heading', fontSize: 96, fontWeight: 800 }, { aspect: 1, rotation: -8, name: 'Discount seal' }),
    logo(S(64, 64, 100, 100), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', S(180, 78, 400, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 36, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    text('label', 'subheading', S(64, 300, 520, 60), { text: 'Limited-time offer', uppercase: true, letterSpacing: 4, fontSize: 30, fontWeight: 700, color: 'brand.accent' }),
    heading(S(64, 370, 520, 330), { text: 'Proofreading & plagiarism check for your thesis', highlights: [0], color: '#ffffff', fontSize: 62 }),
    text('body', 'body', S(64, 712, 480, 120), { text: 'Valid for bookings until {date}', fontSize: 30, color: 'rgba(255, 255, 255, 0.8)' }),
    badge('cta', 'cta', S(64, 862, 360, 82), { text: 'Claim offer', style: 'pill', fill: 'brand.accent', color: '#ffffff' }),
    footer(S(64, 982, 952, 60), { color: 'rgba(255, 255, 255, 0.7)', fontSize: 22 }),
  ],
});

export const coursePromotion = defineTemplate({
  id: 'promo-course',
  name: 'Course Promotion',
  category: 'promotional',
  description: 'Landscape split for courses & workshops — stacks automatically in portrait ratios.',
  defaultRatio: '16:9',
  background: 'brand.paper',
  elements: [
    photo(L(0, 0, 460, 608), { src: SAMPLE.laptop }, { ratios: stacked(P(0, 0, 1080, 560)) }),
    shape('seam', L(460, 0, 12, 608), { fill: 'brand.accent' }, { ratios: stacked(P(0, 560, 1080, 14)) }),
    logo(L(520, 36, 72, 72), { variant: 'mark' }, { aspect: 1, ratios: stacked(P(64, 620, 96, 96)) }),
    text('brand-name', 'label', L(606, 44, 420, 56), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 30, fontWeight: 700, color: 'brand.primary', vAlign: 'middle' }, { name: 'Brand name', ratios: stacked(P(176, 632, 500, 72)) }),
    badge('badge', 'badge', L(520, 134, 300, 48), { text: 'Online course', style: 'tag', fill: 'brand.primary', color: '#ffffff', fontSize: 22 }, { ratios: stacked(P(720, 642, 296, 56)) }),
    heading(L(520, 196, 520, 190), { text: 'Research Methods with SPSS & R', highlights: [3, 4, 5], color: 'brand.primary', fontSize: 54 }, { ratios: stacked(P(64, 750, 952, 240)) }),
    text('body', 'body', L(520, 392, 520, 76), { text: '8 live sessions · Certificate · Recordings', fontSize: 24, color: 'brand.ink/70' }, { ratios: stacked(P(64, 1000, 952, 80)) }),
    badge('price', 'badge', L(520, 494, 200, 66), { text: 'Rs 4,999', style: 'outline', fill: 'brand.secondary', color: 'brand.secondary', uppercase: false, letterSpacing: 0 }, { name: 'Price', ratios: stacked(P(64, 1110, 300, 88)) }),
    badge('cta', 'cta', L(740, 494, 300, 66), { text: 'Enroll now', style: 'pill', fill: 'brand.accent', color: '#ffffff' }, { ratios: stacked(P(390, 1110, 626, 88)) }),
    footer(L(520, 572, 520, 30), { fontSize: 18, color: 'brand.ink/55' }, { ratios: stacked(P(64, 1250, 952, 60)) }),
  ],
});
