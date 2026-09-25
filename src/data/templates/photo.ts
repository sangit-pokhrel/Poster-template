import { G, SAMPLE, badge, defineTemplate, footer, heading, image, logo, photo, shape, text } from './builders';

const P = G.portrait;

export const fullPhoto = defineTemplate({
  id: 'photo-full',
  name: 'Full Photo',
  category: 'photo',
  description: 'Edge-to-edge photo, corner logo, date pill and a headline over a brand fade.',
  defaultRatio: '4:5',
  background: 'brand.primary',
  elements: [
    photo(P(0, 0, 1080, 1350), {
      src: SAMPLE.graduationSky,
      overlay: {
        type: 'linear',
        angle: 90,
        stops: [
          [0, 'rgba(0, 0, 0, 0.35)'],
          [0.3, 'rgba(0, 0, 0, 0)'],
          [0.55, 'rgba(0, 0, 0, 0)'],
          [1, 'brand.primary/95'],
        ],
      },
    }),
    logo(P(48, 44, 110, 110), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(176, 64, 520, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 40, fontWeight: 700, color: '#ffffff', vAlign: 'middle', shadow: true }, { name: 'Brand name' }),
    badge('date', 'date', P(772, 70, 260, 56), { text: '{date}', style: 'pill', fill: 'rgba(0, 0, 0, 0.45)', color: '#ffffff', fontSize: 24, uppercase: false, letterSpacing: 0 }),
    heading(P(64, 990, 952, 200), { text: 'Your journey to a world-class degree starts here', highlights: [4, 5], color: '#ffffff', fontSize: 68, shadow: true, vAlign: 'bottom' }),
    shape('accent', P(64, 1214, 140, 8), { kind: 'line', fill: 'brand.accent' }),
    footer(P(64, 1244, 952, 64), { color: 'rgba(255, 255, 255, 0.9)' }),
  ],
});

export const photoCollage = defineTemplate({
  id: 'photo-collage',
  name: 'Photo Collage',
  category: 'photo',
  description: 'Three-photo grid with headline — for workshops, events and behind-the-scenes.',
  defaultRatio: '4:5',
  background: 'brand.paper',
  elements: [
    photo(P(40, 40, 640, 700), { src: SAMPLE.students, radius: 28 }),
    image('photo2', 'photo2', P(700, 40, 340, 340), { src: SAMPLE.library, radius: 28 }),
    image('photo3', 'photo3', P(700, 400, 340, 340), { src: SAMPLE.writing, radius: 28 }),
    heading(P(64, 790, 952, 220), { text: 'Inside our thesis bootcamp weekend', highlights: [2, 3], color: 'brand.primary', fontSize: 68 }),
    text('body', 'body', P(64, 1030, 952, 110), { text: '48 hours · 60 researchers · 12 finished proposals', fontSize: 32, color: 'brand.ink/75' }),
    shape('accent', P(64, 1166, 120, 8), { kind: 'line', fill: 'brand.accent' }),
    logo(P(64, 1206, 100, 100), { variant: 'mark' }, { aspect: 1 }),
    text('brand-name', 'label', P(180, 1220, 440, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 34, fontWeight: 700, color: 'brand.primary', vAlign: 'middle' }, { name: 'Brand name' }),
    footer(P(600, 1220, 436, 72), { text: '{handle}', align: 'right', color: 'brand.ink/60', fontSize: 22 }),
  ],
});
