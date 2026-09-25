import { G, SAMPLE, badge, date, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';

const P = G.portrait;
const S = G.square;

export const webinar = defineTemplate({
  id: 'event-webinar',
  name: 'Webinar / Event',
  category: 'events',
  description: 'Date block, speaker portrait, time & venue, and a registration button.',
  defaultRatio: '4:5',
  background: 'brand.primary',
  elements: [
    shape('texture', P(0, 0, 1080, 1350), { kind: 'dots', fill: 'rgba(255, 255, 255, 0.06)', radius: 36 }),
    shape('date-block', P(64, 80, 200, 220), { fill: 'brand.accent', radius: 22 }),
    text('number', 'number', P(64, 92, 200, 130), { text: '12', fontFamily: 'brand.heading', fontSize: 110, fontWeight: 800, color: '#ffffff', align: 'center', vAlign: 'middle' }, { name: 'Day' }),
    text('month', 'label', P(64, 216, 200, 60), { text: 'Oct 2026', uppercase: true, fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#ffffff', align: 'center', vAlign: 'middle' }, { name: 'Month' }),
    badge('badge', 'badge', P(300, 88, 340, 60), { text: 'Free webinar', style: 'outline', fill: 'brand.accent', color: 'brand.accent', fontSize: 26 }),
    heading(P(300, 170, 716, 320), { text: 'How to publish your first research paper', highlights: [2], color: '#ffffff', fontSize: 64 }),
    photo(P(64, 560, 380, 380), { src: SAMPLE.portraitMan, shape: 'circle', borderWidth: 10, borderColor: 'brand.accent' }, { aspect: 1, name: 'Speaker photo' }),
    text('name', 'name', P(480, 590, 536, 80), { text: 'Dr. Ramesh Adhikari', fontFamily: 'brand.heading', fontSize: 44, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Speaker' }),
    text('sub', 'subheading', P(480, 676, 536, 110), { text: 'Associate Professor, Research Methodology', fontSize: 30, color: 'rgba(255, 255, 255, 0.75)' }, { name: 'Speaker title' }),
    text('body', 'body', P(480, 800, 536, 140), { text: '🕖  7:00 PM (NPT)\n📍  Zoom — link in comments', fontSize: 30, lineHeight: 1.55, color: '#ffffff' }, { name: 'Time & venue' }),
    badge('cta', 'cta', P(64, 1016, 952, 92), { text: 'Register now — seats are limited', style: 'pill', fill: 'brand.accent', color: '#ffffff', uppercase: false, letterSpacing: 0, fontSize: 36 }),
    logo(P(64, 1180, 100, 100), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    text('brand-name', 'label', P(184, 1194, 400, 72), { text: '{brand}', fontFamily: 'brand.heading', fontSize: 34, fontWeight: 700, color: '#ffffff', vAlign: 'middle' }, { name: 'Brand name' }),
    footer(P(580, 1194, 436, 72), { align: 'right', color: 'rgba(255, 255, 255, 0.7)', fontSize: 22 }),
  ],
});

export const deadline = defineTemplate({
  id: 'event-deadline',
  name: 'Deadline Countdown',
  category: 'events',
  description: 'Huge “days left” number to create urgency before an application deadline.',
  defaultRatio: '1:1',
  background: 'brand.paper',
  elements: [
    shape('orb', S(-220, -220, 720, 720), { kind: 'ellipse', fill: 'brand.accent/15' }, { aspect: 1 }),
    shape('orb-2', S(760, 760, 520, 520), { kind: 'ellipse', fill: 'brand.primary/8' }, { aspect: 1 }),
    text('label', 'label', S(64, 110, 952, 64), { text: 'Application deadline', uppercase: true, letterSpacing: 6, fontSize: 30, fontWeight: 700, color: 'brand.secondary', align: 'center', vAlign: 'middle' }),
    text('number', 'number', S(64, 190, 952, 340), { text: '3', fontFamily: 'brand.heading', fontSize: 320, fontWeight: 800, color: 'brand.primary', align: 'center', vAlign: 'middle', lineHeight: 1 }),
    text('sub', 'subheading', S(64, 530, 952, 90), { text: 'Days left', uppercase: true, fontFamily: 'brand.heading', fontSize: 64, fontWeight: 700, letterSpacing: 10, color: 'brand.accent', align: 'center', vAlign: 'middle' }),
    heading(S(114, 640, 852, 170), { text: 'Fulbright Foreign Student Program 2027', highlights: [0], color: 'brand.ink', fontSize: 52, align: 'center', vAlign: 'middle' }),
    date(S(64, 820, 952, 52), { text: 'Closes on {date}', align: 'center', vAlign: 'middle', color: 'brand.secondary' }),
    logo(S(440, 900, 200, 140), { variant: 'full', align: 'center' }),
  ],
});
