import { G, SAMPLE, defineTemplate, footer, logo, photo, shape, text } from './builders';

const S = G.square;
const P = G.portrait;

export const quote = defineTemplate({
  id: 'social-quote',
  name: 'Quote / Statement',
  category: 'social',
  description: 'Large quotation mark, serif quote, author line — optional author photo.',
  defaultRatio: '1:1',
  background: 'brand.paper',
  elements: [
    shape('quote-mark', S(64, 60, 220, 200), { kind: 'quote', fill: 'brand.accent' }, { name: 'Quote mark' }),
    text('quote', 'quote', S(64, 250, 952, 440), {
      text: 'Research is formalized curiosity. It is poking and prying with a purpose.',
      highlights: [3],
      fontFamily: 'brand.heading',
      italic: true,
      fontSize: 62,
      fontWeight: 600,
      lineHeight: 1.25,
      color: 'brand.primary',
      vAlign: 'middle',
    }),
    shape('rule', S(64, 716, 120, 6), { kind: 'line', fill: 'brand.accent' }),
    text('name', 'name', S(64, 744, 700, 72), { text: 'Zora Neale Hurston', fontSize: 40, fontWeight: 700, color: 'brand.ink', vAlign: 'middle' }, { name: 'Author' }),
    text('sub', 'subheading', S(64, 816, 700, 60), { text: 'Novelist & anthropologist', fontSize: 28, color: 'brand.ink/60', vAlign: 'middle' }, { name: 'Author title' }),
    photo(S(790, 700, 226, 226), { src: '', shape: 'circle', placeholder: 'Author', borderWidth: 6, borderColor: 'brand.accent' }, { aspect: 1, visible: false, name: 'Author photo' }),
    logo(S(64, 940, 90, 90), { variant: 'mark' }, { aspect: 1 }),
    text('brand-name', 'label', S(170, 950, 440, 70), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 34, fontWeight: 700, color: 'brand.primary', vAlign: 'middle' }, { name: 'Brand name' }),
    footer(S(620, 950, 396, 70), { text: '{handle}', align: 'right', color: 'brand.ink/60', fontSize: 22 }),
  ],
});

export const testimonial = defineTemplate({
  id: 'social-testimonial',
  name: 'Student Testimonial',
  category: 'social',
  description: 'Portrait overlapping a quote card with star rating, name and programme.',
  defaultRatio: '4:5',
  background: 'brand.primary',
  elements: [
    text('label', 'label', P(64, 80, 952, 80), { text: 'What our students say', uppercase: true, letterSpacing: 5, fontSize: 32, fontWeight: 700, color: '#ffffff', align: 'center', vAlign: 'middle' }),
    shape('card', P(64, 400, 952, 800), { fill: 'brand.paper', radius: 34 }),
    photo(P(390, 200, 300, 300), { src: SAMPLE.portraitMan, shape: 'circle', borderWidth: 10, borderColor: 'brand.paper' }, { aspect: 1 }),
    text('stars', 'number', P(64, 520, 952, 64), { text: '★★★★★', fontSize: 46, color: 'brand.accent', align: 'center', vAlign: 'middle', letterSpacing: 6 }, { name: 'Rating' }),
    text('quote', 'quote', P(130, 600, 820, 340), {
      text: '“I was stuck on my methodology chapter for months. The mentors helped me finish my thesis in six weeks.”',
      italic: true,
      fontSize: 36,
      lineHeight: 1.5,
      color: 'brand.ink',
      align: 'center',
      vAlign: 'middle',
    }),
    text('name', 'name', P(130, 960, 820, 72), { text: 'Aarav Shrestha', fontFamily: 'brand.heading', fontSize: 42, fontWeight: 700, color: 'brand.primary', align: 'center', vAlign: 'middle' }),
    text('sub', 'subheading', P(130, 1032, 820, 60), { text: 'MSc Microbiology, Tribhuvan University', fontSize: 28, color: 'brand.ink/60', align: 'center', vAlign: 'middle' }),
    shape('rule', P(490, 1112, 100, 6), { kind: 'line', fill: 'brand.accent' }),
    logo(P(64, 1228, 90, 90), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(170, 1238, 400, 70), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 32, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    footer(P(560, 1238, 456, 70), { align: 'right', color: 'rgba(255, 255, 255, 0.7)', fontSize: 22 }),
  ],
});
