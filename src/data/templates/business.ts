import { G, SAMPLE, badge, date, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';

const P = G.portrait;

export const servicePromotion = defineTemplate({
  id: 'business-service',
  name: 'Service Promotion',
  category: 'business',
  description: 'Diagonal photo split, service list and consultation CTA.',
  defaultRatio: '4:5',
  background: '#ffffff',
  elements: [
    photo(P(540, 0, 540, 760), { src: SAMPLE.writing }),
    shape('diagonal', P(540, 0, 200, 760), { kind: 'triangle', fill: '#ffffff' }, { rotation: 180 }),
    logo(P(64, 48, 200, 250), { variant: 'full' }),
    heading(P(64, 330, 560, 330), { text: 'Thesis Writing Support', highlights: [0], color: 'brand.primary', fontSize: 84, vAlign: 'bottom' }),
    text('sub', 'subheading', P(64, 674, 520, 70), { text: 'From proposal to final defence', italic: true, fontSize: 32, color: 'brand.secondary' }),
    shape('panel', P(0, 760, 1080, 590), { fill: 'brand.primary' }),
    text('body', 'body', P(64, 810, 952, 310), { text: '✔ Topic selection & proposal\n✔ Literature review & methodology\n✔ Data analysis — SPSS, R, Python\n✔ Plagiarism check & formatting', fontSize: 36, lineHeight: 1.55, color: '#ffffff' }),
    badge('cta', 'cta', P(64, 1150, 420, 82), { text: 'Book a consultation', style: 'pill', fill: 'brand.accent', color: '#ffffff', uppercase: false, letterSpacing: 0 }),
    footer(P(510, 1150, 506, 82), { text: '{phone}  •  {email}  •  {handle}', align: 'right', color: 'rgba(255, 255, 255, 0.85)', fontSize: 22 }),
    shape('bottom', P(0, 1318, 1080, 32), { fill: 'brand.accent' }),
  ],
});

export const announcement = defineTemplate({
  id: 'business-announcement',
  name: 'Announcement',
  category: 'business',
  description: 'Framed, centred notice with logo, title, message and signature.',
  defaultRatio: '4:5',
  background: 'brand.paper',
  elements: [
    shape('frame', P(40, 40, 1000, 1270), { fill: 'rgba(0, 0, 0, 0)', stroke: 'brand.primary', strokeWidth: 4, radius: 16 }),
    logo(P(415, 90, 250, 260), { variant: 'full', align: 'center' }),
    shape('rule', P(390, 384, 300, 4), { kind: 'line', fill: 'brand.accent' }),
    text('label', 'label', P(64, 410, 952, 84), { text: 'Announcement', uppercase: true, fontFamily: 'brand.heading', fontSize: 48, fontWeight: 700, letterSpacing: 8, color: 'brand.secondary', align: 'center', vAlign: 'middle' }),
    heading(P(120, 520, 840, 270), { text: 'We are now accepting PhD research consultations', highlights: [4], color: 'brand.primary', fontSize: 62, align: 'center', vAlign: 'middle' }),
    text('body', 'body', P(120, 806, 840, 260), { text: 'Book a one-to-one session with our research mentors for proposal writing, methodology design and journal publication.', fontSize: 32, lineHeight: 1.5, color: 'brand.ink/80', align: 'center' }),
    date(P(120, 1090, 840, 52), { align: 'center', vAlign: 'middle', color: 'brand.secondary' }),
    text('name', 'name', P(120, 1150, 840, 64), { text: '— Team {brand}', italic: true, fontFamily: 'brand.heading', fontSize: 34, color: 'brand.primary', align: 'center', vAlign: 'middle' }, { name: 'Signature' }),
    footer(P(120, 1228, 840, 52), { align: 'center', color: 'brand.ink/60', fontSize: 22 }),
  ],
});
