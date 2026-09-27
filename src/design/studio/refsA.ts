/**
 * Studio designs from references 1–8 (Nepal Scholar posters): two variations each.
 */
import type { AdContent } from '../../types/template';
import { P, icon, linear, shape } from '../builders';
import { photoSrc } from '../builders';
import {
  A,
  D,
  INK,
  M,
  PAPER,
  POP,
  V1,
  V2,
  WHITE,
  blob,
  brandHeader,
  chip,
  contactRow,
  cornerTag,
  cta,
  entry,
  fg,
  footerBar,
  headline,
  iconList,
  iconRow,
  itemGrid,
  layout,
  mx,
  panel,
  para,
  photo,
  script,
  stamp,
  soft,
  sub,
} from './kit';
import type { StudioEntry, Variant } from './kit';

const paperOr = (v: Variant) => (v.tone === 'dark' ? D : PAPER);

/* 1 · "Why choose us" — numbered 3 × 2 card grid, photo corner, footer pill */
const why = (v: Variant) => (c: AdContent) =>
  layout(
    v.tone === 'dark' ? linear(160, [0, D], [1, INK]) : linear(90, [0, '#ffffff'], [1, PAPER]),
    blob('blob', P(mx(v.flip, 610, 520), -60, 520, 520), v.tone === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'brand.accent/22'),
    photo(photoSrc(c.photo, 'books'), P(mx(v.flip, 650, 380), 40, 380, 420), { shape: 'arch', shadow: true }),
    brandHeader(v.tone, mx(v.flip, 60, 330), 50, { align: v.flip ? 'right' : 'left' }),
    headline(c.heading, P(mx(v.flip, 60, 560), 175, 560, 250), { tone: v.tone, size: 74, vAlign: 'bottom', align: v.flip ? 'right' : 'left' }),
    sub(c, P(mx(v.flip, 60, 560), 438, 560, 80), { tone: v.tone, size: 25, align: v.flip ? 'right' : 'left' }),
    itemGrid(c.items, { x: 60, y: 548, w: 960, h: 620 }, { cols: 3, tone: v.tone, card: v.tone === 'dark' ? 'glass' : 'white', layout: 'stack', number: true, icon: 'soft', titleSize: 25, textSize: 18 }),
    footerBar(v.tone, { y: 1204, h: 96, inset: 40, radius: 48 }),
  );

/* 2 · "Drowning in deadlines" — benefits list, arched photo, urgent-help card, wave */
const deadlines = (v: Variant) => (c: AdContent) => {
  const tx = mx(v.flip, 60, 600);
  return layout(
    v.tone === 'dark' ? D : WHITE,
    shape('wave-accent', P(mx(v.flip, -260, 820), 1150, 820, 340), { kind: 'ellipse', fill: A }, { name: 'Wave' }),
    shape('wave', P(mx(v.flip, -280, 820), 1172, 820, 340), { kind: 'ellipse', fill: v.tone === 'dark' ? WHITE : D }, { name: 'Wave' }),
    headline(c.heading, P(tx, 60, 600, 230), { tone: v.tone, size: 70, hlStyle: 'marker', hlColor: 'brand.accent/45', vAlign: 'bottom' }),
    headline(c.sub, P(tx, 300, 600, 120), { tone: v.tone, size: 42, weight: 800, color: v.tone === 'dark' ? A : M, hlColor: POP }, 'sub', 'subheading'),
    para('body', 'body', c.body, P(tx, 432, 560, 96), { tone: v.tone, size: 22 }),
    chip('eyebrow', c.eyebrow, P(tx, 548, 240, 56), 'accent', { upper: true, size: 22, font: 'heavy' }),
    iconList(c.items, { x: tx, y: 624, w: 560, h: 420 }, { tone: v.tone, icon: 'ring', titleSize: 24, textSize: 18, max: 4 }),
    blob('blob', P(mx(v.flip, 620, 440), 150, 440, 440), 'brand.accent/25'),
    photo(photoSrc(c.photo, 'studying'), P(mx(v.flip, 650, 390), 190, 390, 560), { shape: 'arch', shadow: true }),
    script('note', c.quote, P(mx(v.flip, 650, 390), 770, 390, 150), v.tone === 'dark' ? A : M, 44, -5, 'center'),
    panel('help-card', P(mx(v.flip, 640, 400), 940, 400, 210), v.tone === 'dark' ? WHITE : D, 26, { shadow: true, name: 'Help card' }),
    para('help', 'label', c.badge, P(mx(v.flip, 670, 340), 962, 340, 80), { tone: v.tone === 'dark' ? 'light' : 'dark', size: 22, weight: 600 }, 'Help note'),
    cta(c.cta, P(mx(v.flip, 670, 340), 1056, 340, 70), 'accent', { arrow: false, size: 24 }),
    brandHeader(v.tone === 'dark' ? 'light' : 'dark', mx(v.flip, 60, 300), 1236, { w: 300, h: 80, align: v.flip ? 'right' : 'left' }),
  );
};

/* 3 · "Your dream, our guidance" — text panel + curved photo, service list, seal */
const dream = (v: Variant) => (c: AdContent) =>
  layout(
    paperOr(v) === D ? D : WHITE,
    photo(photoSrc(c.photo, 'graduationSky'), P(mx(v.flip, 520, 560), 0, 560, 1200)),
    shape('curve', P(mx(v.flip, 330, 380), -150, 380, 1500), { kind: 'ellipse', fill: v.tone === 'dark' ? D : WHITE }, { name: 'Curve' }),
    brandHeader(v.tone, mx(v.flip, 60, 330), 50),
    ...(c.eyebrow ? [panel('eyebrow-card', P(mx(v.flip, 680, 360), 56, 360, 96), WHITE, 48, { shadow: true, name: 'Quote card' })] : []),
    para('eyebrow', 'label', c.eyebrow, P(mx(v.flip, 710, 300), 62, 300, 84), { tone: 'light', font: 'serif', italic: true, size: 20, align: 'center', vAlign: 'middle', color: INK }, 'Quote'),
    headline(c.heading, P(mx(v.flip, 60, 540), 180, 540, 250), { tone: v.tone, font: 'cond', size: 104, upper: true, lh: 1.0, color: v.tone === 'dark' ? WHITE : D, hlColor: v.tone === 'dark' ? A : POP }),
    sub(c, P(mx(v.flip, 60, 470), 440, 470, 90), { tone: v.tone, size: 24 }),
    iconList(c.items, { x: mx(v.flip, 60, 520), y: 550, w: 520, h: 600 }, { tone: v.tone, icon: 'circle', titleSize: 23, textSize: 18, upper: true, titleColor: v.tone === 'dark' ? A : POP, max: 5 }),
    stamp(c.badge, P(mx(v.flip, 810, 220), 960, 220, 220), v.tone === 'dark' ? A : D, v.tone === 'dark' ? INK : WHITE, 30, WHITE),
    footerBar(v.tone, { y: 1250, h: 100 }),
  );

/* 4 · "Questions into solutions" — thought bubble, quote box, icon grid, portrait */
const questions = (v: Variant) => (c: AdContent) => {
  const bg = paperOr(v);
  const tx = mx(v.flip, 60, 520);
  return layout(
    bg,
    photo(photoSrc(c.photo, 'portraitWoman'), P(mx(v.flip, 540, 540), 330, 540, 900), { overlay: linear(v.flip ? 180 : 0, [0, bg], [0.28, v.tone === 'dark' ? 'brand.primary/0' : 'brand.paper/0']) }),
    shape('bubble', P(mx(v.flip, 640, 390), 110, 390, 230), { kind: 'ellipse', fill: WHITE, shadow: true }, { name: 'Thought bubble' }),
    shape('bubble-2', P(mx(v.flip, 760, 60), 350, 60, 42), { kind: 'ellipse', fill: WHITE, shadow: true }, { name: 'Bubble', aspect: 60 / 42 }),
    shape('bubble-3', P(mx(v.flip, 790, 34), 406, 34, 26), { kind: 'ellipse', fill: WHITE }, { name: 'Bubble', aspect: 34 / 26 }),
    para('bubble-text', 'body', c.bullets?.join('\n'), P(mx(v.flip, 690, 290), 140, 290, 170), { tone: 'light', size: 21, weight: 600, align: 'center', vAlign: 'middle', lh: 1.35, color: INK }, 'Questions'),
    brandHeader(v.tone, tx, 50),
    headline(c.heading, P(tx, 170, 520, 240), { tone: v.tone, font: 'sans', size: 54, weight: 700, lh: 1.12, ls: 0 }),
    panel('quote-box', P(tx, 430, 470, 130), 'rgba(255, 255, 255, 0)', 0, { stroke: v.tone === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'brand.ink/60', name: 'Quote frame' }),
    para('quote', 'quote', c.quote, P(tx + 20, 440, 430, 110), { tone: v.tone, font: 'serif', italic: true, size: 26, align: 'center', vAlign: 'middle', color: fg(v.tone) }),
    itemGrid(c.items, { x: tx, y: 600, w: 480, h: 540 }, { cols: 2, tone: v.tone, card: 'none', layout: 'stack', icon: 'soft', titleSize: 22, titleColor: v.tone === 'dark' ? A : POP, gap: 10, max: 6 }),
    panel('band', P(0, 1236, 1080, 114), v.tone === 'dark' ? A : M, 0, { name: 'Contact band' }),
    contactRow({ x: 50, y: 1262, w: 980, h: 62 }, { tone: v.tone === 'dark' ? 'light' : 'dark', fields: ['website', 'phone', 'email'], iconBg: v.tone === 'dark' ? D : WHITE, iconColor: v.tone === 'dark' ? WHITE : M }),
  );
};

/* 5 · "Bachelor to PhD" — serif headline, three-stage photo journey, icon row, skyline */
const journey = (v: Variant) => (c: AdContent) => {
  const stages = (c.items ?? []).slice(0, 3);
  const rest = (c.items ?? []).slice(3);
  const pics = [photoSrc(c.photo, 'graduation'), photoSrc(c.person?.photo, 'analytics'), '/samples/books.jpg'];
  const ids = ['photo', 'photo2', 'photo3'] as const;
  return layout(
    paperOr(v),
    brandHeader(v.tone, 60, 46),
    cornerTag('Ideas\nAnalysis\nWriting\nPublication', P(850, 46, 190, 110), v.tone),
    headline(c.heading, P(60, 180, 960, 240), { tone: v.tone, font: 'serif', size: 86, weight: 800, lh: 1.02, color: v.tone === 'dark' ? WHITE : D, hlColor: v.tone === 'dark' ? A : M }),
    sub(c, P(60, 426, 900, 90), { tone: v.tone, font: 'serif', size: 30 }),
    stages.flatMap((it, i) => {
      const x = 80 + i * 330;
      return [
        shape(`stage-${i + 1}-ring`, P(x - 10, 530, 270, 270), { kind: 'ellipse', fill: v.tone === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'brand.accent/20' }, { name: 'Ring', aspect: 1 }),
        photo(pics[i] ?? pics[0] ?? '', P(x + 10, 550, 230, 230), { shape: 'circle', borderWidth: 6, borderColor: WHITE }, ids[i]),
        ...(i < 2 ? [icon(`stage-${i + 1}-arrow`, P(x + 272, 640, 46, 46), { name: 'arrow', color: v.tone === 'dark' ? A : M, bg: null }, { name: 'Arrow' })] : []),
        para(`item-${i + 1}-title`, 'label', it.title, P(x - 20, 810, 290, 56), { tone: v.tone, font: 'serif', size: 38, weight: 800, align: 'center', color: fg(v.tone) }, `Stage ${i + 1}`),
        para(`item-${i + 1}-text`, 'label', it.text, P(x - 20, 866, 290, 40), { tone: v.tone, size: 20, align: 'center' }, `Stage ${i + 1} detail`),
      ].flat();
    }),
    iconRow(rest, { x: 60, y: 940, w: 960, h: 130 }, { tone: v.tone, icon: 'ring', dividers: true, size: 18, from: 3 }),
    shape('sun', P(760, 1110, 70, 70), { kind: 'ellipse', fill: v.tone === 'dark' ? A : M }, { name: 'Sun', aspect: 1 }),
    shape('mountains', P(0, 1100, 1080, 150), { kind: 'polygon', fill: v.tone === 'dark' ? 'rgba(255, 255, 255, 0.14)' : 'brand.primary/85', points: [0, 1, 0, 0.55, 0.08, 0.2, 0.15, 0.5, 0.24, 0.05, 0.33, 0.45, 0.42, 0.25, 0.52, 0.6, 0.62, 0, 0.72, 0.5, 0.82, 0.3, 0.9, 0.55, 1, 0.35, 1, 1] }, { name: 'Mountains' }),
    panel('footer-bg', P(0, 1250, 1080, 100), v.tone === 'dark' ? WHITE : D, 0, { name: 'Footer bar' }),
    contactRow({ x: 60, y: 1268, w: 960, h: 64 }, { tone: v.tone === 'dark' ? 'light' : 'dark', fields: ['phone', 'email', 'website'] }),
  );
};

/* 6 · "Not every problem needs more pages" — serif headline, big photo with note card, three pillars */
const pillars = (v: Variant) => (c: AdContent) =>
  layout(
    paperOr(v),
    brandHeader(v.tone, 60, 46),
    cornerTag('Quality\nResearch\nBetter\nTomorrow', P(850, 46, 190, 110), v.tone),
    headline(c.heading, P(60, 170, 960, 260), { tone: v.tone, font: 'serif', size: 76, weight: 800, lh: 1.02, color: v.tone === 'dark' ? WHITE : D, hlColor: v.tone === 'dark' ? A : M }),
    sub(c, P(60, 440, 780, 90), { tone: v.tone, font: 'serif', size: 28 }),
    photo(photoSrc(c.photo, 'notes'), P(v.flip ? 60 : 60, 550, 960, 430), { radius: 24, shadow: true }),
    panel('note-card', P(mx(v.flip, 640, 350), 580, 350, 250), WHITE, 16, { shadow: true, name: 'Note card', rotation: v.flip ? 3 : -3 }),
    para('note-title', 'label', c.eyebrow, P(mx(v.flip, 665, 300), 600, 300, 50), { tone: 'light', font: 'serif', size: 26, weight: 800, color: D }, 'Note title'),
    para('quote', 'quote', c.quote, P(mx(v.flip, 665, 300), 652, 300, 160), { tone: 'light', font: 'serif', italic: true, size: 22, color: INK }),
    itemGrid(c.items, { x: 60, y: 1010, w: 960, h: 210 }, { cols: 3, tone: v.tone, card: 'none', layout: 'stack', icon: 'soft', titleSize: 28, titleFont: 'serif', textSize: 18, max: 3 }),
    shape('footer-rule', P(60, 1250, 960, 2), { fill: soft(v.tone, 25) }, { name: 'Hairline' }),
    contactRow({ x: 60, y: 1268, w: 960, h: 60 }, { tone: v.tone, fields: ['phone', 'email', 'website'] }),
  );

/* 7 · "Stuck on your thesis?" — huge serif headline, four step boxes, desk photo, square CTA */
const stuckSerif = (v: Variant) => (c: AdContent) => {
  const bg = paperOr(v);
  const clear = v.tone === 'dark' ? 'brand.primary/0' : 'brand.paper/0';
  return layout(
    bg,
    photo(photoSrc(c.person?.photo, 'mountains'), P(mx(v.flip, 540, 540), 0, 540, 600), { overlay: linear(v.flip ? 180 : 0, [0, bg], [0.7, clear]) }, 'photo2'),
    shape('photo2-fade', P(mx(v.flip, 540, 540), 300, 540, 300), { fill: linear(90, [0, clear], [1, bg]) }, { name: 'Fade' }),
    shape('photo2-veil', P(mx(v.flip, 540, 540), 0, 540, 600), { fill: v.tone === 'dark' ? 'brand.primary/45' : 'brand.paper/45' }, { name: 'Veil' }),
    brandHeader(v.tone, mx(v.flip, 60, 330), 46),
    headline(c.heading, P(60, 170, 960, 300), { tone: v.tone, font: 'serif', size: 116, weight: 800, lh: 0.98, color: v.tone === 'dark' ? WHITE : D, hlColor: v.tone === 'dark' ? A : POP, align: v.flip ? 'right' : 'left' }),
    sub(c, P(60, 480, 960, 50), { tone: v.tone, font: 'serif', italic: true, size: 28, align: v.flip ? 'right' : 'left' }),
    para('body', 'body', c.body, P(60, 546, 960, 110), { tone: v.tone, font: 'serif', size: 36, weight: 700, color: fg(v.tone), lh: 1.2, align: v.flip ? 'right' : 'left' }),
    itemGrid(c.items, { x: 60, y: 690, w: 960, h: 270 }, { cols: 4, tone: v.tone, card: v.tone === 'dark' ? 'glass' : 'white', layout: 'stack', icon: 'bare', titleSize: 26, titleFont: 'serif', textSize: 16, gap: 14, radius: 4, max: 4 }),
    photo(photoSrc(c.photo, 'desk'), P(0, 990, 1080, 360), { overlay: linear(90, [0, bg], [0.4, clear]) }),
    cta(c.cta, P(mx(v.flip, 60, 460), 1226, 460, 78), v.tone === 'dark' ? 'accent' : 'dark', { upper: true, size: 20, square: true }),
    panel('contact-card', P(mx(v.flip, 560, 460), 1214, 460, 100), WHITE, 12, { shadow: true, name: 'Contact card' }),
    contactRow({ x: mx(v.flip, 580, 430), y: 1226, w: 430, h: 76 }, { tone: 'light', fields: ['phone', 'email'], size: 17, widths: [0.8, 1.3] }),
  );
};

/* 8 · "A weak THESIS…" — slanted photo, giant keyword, dark service band, contact cards */
const weak = (v: Variant) => (c: AdContent) => {
  const tx = mx(v.flip, 560, 480);
  return layout(
    v.tone === 'dark' ? D : WHITE,
    shape('slab', P(mx(v.flip, 0, 560), 120, 560, 800), { kind: 'polygon', fill: v.tone === 'dark' ? M : D, points: v.flip ? [0.2, 0, 1, 0, 1, 1, 0, 1] : [0, 0, 0.8, 0, 1, 1, 0, 1] }, { name: 'Slab' }),
    photo(photoSrc(c.photo, 'library'), P(mx(v.flip, 0, 520), 150, 520, 730), { shape: 'slant', shadow: true }),
    brandHeader(v.tone, tx, 40, { w: 300, h: 84 }),
    para('eyebrow', 'label', c.eyebrow, P(tx, 170, 460, 70), { tone: v.tone, font: 'heavy', size: 50, weight: 700, color: fg(v.tone) }, 'Eyebrow'),
    headline(c.heading, P(tx - 10, 240, 500, 150), { tone: v.tone, size: 138, color: v.tone === 'dark' ? A : M, ls: -3 }),
    headline(c.sub, P(tx, 390, 460, 120), { tone: v.tone, size: 44, weight: 800, lh: 1.08 }, 'sub', 'subheading'),
    shape('rule', P(tx, 540, 460, 2), { fill: soft(v.tone, 30) }, { name: 'Hairline' }),
    icon('cap', P(tx, 580, 100, 100), { name: 'cap', color: v.tone === 'dark' ? A : D, bg: v.tone === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'brand.primary/8', bgShape: 'circle', strokeWidth: 2 }, { name: 'Icon' }),
    para('body', 'body', c.body, P(tx + 120, 572, 340, 120), { tone: v.tone, size: 24, weight: 500 }),
    para('promise', 'label', c.quote, P(tx + 120, 700, 340, 110), { tone: v.tone, size: 26, weight: 700, color: v.tone === 'dark' ? A : POP }, 'Promise'),
    panel('band', P(0, 910, 1080, 290), v.tone === 'dark' ? 'rgba(255, 255, 255, 0.07)' : D, 0, { name: 'Service band' }),
    para('band-title', 'label', c.numberLabel, P(60, 930, 960, 44), { tone: 'dark', size: 22, weight: 700, upper: true, ls: 3, align: 'center', color: WHITE }, 'Band title'),
    iconRow(c.items, { x: 40, y: 996, w: 1000, h: 180 }, { tone: 'dark', icon: 'circle', size: 19, dividers: true }),
    panel('contact-card', P(40, 1224, 1000, 96), WHITE, 22, { shadow: true, stroke: 'brand.ink/10', name: 'Contact card' }),
    contactRow({ x: 70, y: 1240, w: 950, h: 64 }, { tone: 'light', fields: ['website', 'phone', 'email'] }),
  );
};

export const REFS_A: StudioEntry[] = [
  entry(1, {
    id: 'studio-why-choose', name: 'Why choose us — card grid', category: 'trust', kind: 'services',
    content: {
      heading: 'Why Choose\n*{brand}?*', sub: 'More than writing support — a *complete research journey*, start to finish.', photo: 'books',
      items: [
        { icon: 'target', title: 'Personalised Research Roadmap', text: 'A clear plan with milestones.' },
        { icon: 'users', title: '1-on-1 Mentor Guidance', text: 'Work directly with experts.' },
        { icon: 'fileCheck', title: 'Supervisor Feedback to Action', text: 'Turn feedback into clear steps.' },
        { icon: 'mic', title: 'Research to Viva Support', text: 'Support until your presentation.' },
        { icon: 'layers', title: 'Research Evidence Pack', text: 'All key resources, organised.' },
        { icon: 'lock', title: '100% Confidential', text: 'Your work and privacy are safe.' },
      ],
    },
  }, why(V1)),
  entry(1, {
    id: 'studio-why-promise', name: 'Our promise — dark card grid', category: 'brand', kind: 'services',
    content: {
      heading: 'Six Promises From\n*{brand}*', sub: 'What every student gets — Bachelor, Master’s or PhD.', photo: 'graduation',
      items: [
        { icon: 'clock', title: 'On-Time Delivery', text: 'Deadlines agreed up front.' },
        { icon: 'shield', title: 'Plagiarism-Free', text: 'Original work with a report.' },
        { icon: 'chat', title: 'Unlimited Revisions', text: 'Until your supervisor is happy.' },
        { icon: 'award', title: 'Subject Experts', text: 'Matched to your field.' },
        { icon: 'money', title: 'Student Pricing', text: 'Fair, transparent packages.' },
        { icon: 'lock', title: 'Full Privacy', text: 'Your identity stays private.' },
      ],
    },
  }, why(V2)),
  entry(2, {
    id: 'studio-drowning-deadlines', name: 'Drowning in deadlines', category: 'thesis', kind: 'hero',
    content: {
      heading: 'Drowning in *Thesis* Deadlines?', sub: 'We’ll help you *cross the finish line.*', eyebrow: 'Benefits',
      body: 'Stop pulling all-nighters. Get 1-on-1 expert academic guidance for your research and writing needs.',
      items: [
        { icon: 'cap', title: 'Expert Subject Mentors', text: 'Custom guidance for theses and papers.' },
        { icon: 'clock', title: 'Tight Deadline Solutions', text: 'Structured plans that get you back on track.' },
        { icon: 'doc', title: 'Original & High Quality', text: 'Thorough research, zero plagiarism.' },
        { icon: 'shield', title: '100% Confidential', text: 'Professional help at every step.' },
      ],
      quote: 'Turn academic stress into academic success', badge: 'Need urgent academic help? Message our experts now!', cta: 'Message on WhatsApp', photo: 'studying',
    },
  }, deadlines(V1)),
  entry(2, {
    id: 'studio-last-minute', name: 'Last-minute rescue', category: 'assignments', kind: 'deadline',
    content: {
      heading: 'Submission in *7 Days?*', sub: 'Don’t panic — *we work fast.*', eyebrow: 'How we help',
      body: 'Proposals, chapters, analysis and formatting finished properly, even on a short deadline.',
      items: [
        { icon: 'bolt', title: 'Same-Day Start', text: 'An expert is assigned within hours.' },
        { icon: 'list', title: 'Clear Daily Plan', text: 'You see progress every day.' },
        { icon: 'fileCheck', title: 'Quality Checked', text: 'Proofread and formatted before delivery.' },
        { icon: 'chat', title: 'Always Reachable', text: 'Message us any time, day or night.' },
      ],
      quote: 'Deadline stress? Leave it to us', badge: 'Short deadline? Talk to an expert right now.', cta: 'Get Help Today', photo: 'laptop',
    },
  }, deadlines(V2)),
  entry(3, {
    id: 'studio-dream-guidance', name: 'Your dream, our guidance', category: 'brand', kind: 'services',
    content: {
      heading: 'Your Dream\n*Our Guidance*', sub: 'Empowering students to achieve global education opportunities.', eyebrow: '“Guiding you today, for a better tomorrow.”', badge: 'Your future starts here', photo: 'graduationSky',
      items: [
        { icon: 'search', title: 'Topic Selection', text: 'Focused, researchable academic topics.' },
        { icon: 'pen', title: 'Proposal Writing', text: 'Clear, well-structured research proposals.' },
        { icon: 'book', title: 'Thesis & Dissertation', text: 'Guidance through thesis development.' },
        { icon: 'doc', title: 'Research Paper Writing', text: 'Coherent, well-formatted research papers.' },
      ],
    },
  }, dream(V1)),
  entry(3, {
    id: 'studio-dream-abroad', name: 'Study abroad dream', category: 'abroad', kind: 'services',
    content: {
      heading: 'Study Abroad\n*Made Simple*', sub: 'From your first SOP draft to your visa interview — guided at every step.', eyebrow: '“Your journey starts with one good application.”', badge: 'Apply with confidence', photo: 'travel',
      items: [
        { icon: 'school', title: 'University Shortlist', text: 'Programs that fit your profile.' },
        { icon: 'pen', title: 'SOP & Essays', text: 'Personal statements that stand out.' },
        { icon: 'money', title: 'Scholarship Search', text: 'Funding options that match you.' },
        { icon: 'plane', title: 'Visa Preparation', text: 'Documents and mock interviews.' },
      ],
    },
  }, dream(V2)),
  entry(4, {
    id: 'studio-questions-solutions', name: 'Questions into solutions', category: 'proposal', kind: 'hero',
    content: {
      heading: 'Turning Research Questions into *Clear Solutions.*', quote: '“Don’t let research confusion slow your progress.”', photo: 'portraitWoman',
      bullets: ['Which topic should I choose?', 'How do I structure my thesis?', 'Where do I start?'],
      items: [
        { icon: 'search', title: 'Topic Selection' }, { icon: 'pen', title: 'Proposal Writing' }, { icon: 'bars', title: 'Data Analysis' },
        { icon: 'cap', title: 'Publication Support' }, { icon: 'book', title: 'Thesis Writing' }, { icon: 'doc', title: 'Research Support' },
      ],
    },
  }, questions(V1)),
  entry(4, {
    id: 'studio-questions-analysis', name: 'Confused by your data?', category: 'analysis', kind: 'hero',
    content: {
      heading: 'Confused by Your Data? Get *Clear Results.*', quote: '“Numbers only matter when you can explain them.”', photo: 'portraitMan',
      bullets: ['Which test should I use?', 'Is my model correct?', 'How do I read this output?'],
      items: [
        { icon: 'bars', title: 'SPSS & STATA' }, { icon: 'code', title: 'R & Python' }, { icon: 'pie', title: 'Descriptive Stats' },
        { icon: 'trend', title: 'Regression & SEM' }, { icon: 'layers', title: 'NVivo Coding' }, { icon: 'doc', title: 'Results Chapter' },
      ],
    },
  }, questions(V2)),
  entry(5, {
    id: 'studio-bachelor-phd', name: 'Bachelor to PhD journey', category: 'thesis', kind: 'steps',
    content: {
      heading: 'Research Support\n*From Bachelor to PhD.*', sub: 'Support designed around the stage and requirements of your research.', photo: 'graduation',
      items: [
        { icon: 'cap', title: 'Bachelor', text: 'Projects · Reports' },
        { icon: 'bars', title: 'Master’s', text: 'Thesis · Data Analysis' },
        { icon: 'book', title: 'PhD', text: 'Research · Publication' },
        { icon: 'bulb', title: 'Topic Selection' }, { icon: 'doc', title: 'Methodology Support' }, { icon: 'bars', title: 'Data Analysis' },
        { icon: 'pen', title: 'Writing Guidance' }, { icon: 'book', title: 'Journal & Publication' },
      ],
    },
  }, journey(V1)),
  entry(5, {
    id: 'studio-idea-publication', name: 'Idea to publication path', category: 'publication', kind: 'steps',
    content: {
      heading: 'From First Idea\n*to Published Paper.*', sub: 'One team for every stage — so nothing gets lost between steps.', photo: 'notes',
      items: [
        { icon: 'bulb', title: 'Idea', text: 'Topic · Gap · Question' },
        { icon: 'bars', title: 'Research', text: 'Method · Data · Results' },
        { icon: 'book', title: 'Publish', text: 'Journal · Review · Print' },
        { icon: 'search', title: 'Literature Review' }, { icon: 'fileCheck', title: 'Plagiarism Check' }, { icon: 'translate', title: 'Language Editing' },
        { icon: 'target', title: 'Journal Selection' }, { icon: 'mail', title: 'Reviewer Replies' },
      ],
    },
  }, journey(V2)),
  entry(6, {
    id: 'studio-not-more-pages', name: 'Not more pages — clarity', category: 'proposal', kind: 'tip',
    content: {
      heading: 'Not Every Research Problem\n*Needs More Pages.*', sub: 'Sometimes it needs a clearer question, stronger methodology, or better analysis.', photo: 'notes',
      eyebrow: 'Research Question', quote: 'How does rainfall variability affect rice yield in Dang, Nepal?',
      items: [
        { icon: 'bulb', title: 'Clarity', text: 'A focused question guides better research.' },
        { icon: 'layers', title: 'Structure', text: 'A strong methodology brings direction.' },
        { icon: 'bars', title: 'Evidence', text: 'Sound analysis builds reliable conclusions.' },
      ],
    },
  }, pillars(V1)),
  entry(6, {
    id: 'studio-quality-over-length', name: 'Quality over word count', category: 'tips', kind: 'tip',
    content: {
      heading: 'Examiners Don’t Count Words.\n*They Count Arguments.*', sub: 'A shorter thesis with a sharp argument beats a long one that wanders.', photo: 'reader',
      eyebrow: 'Examiner’s note', quote: '“Clear objective, clean method, honest limitations — accepted.”',
      items: [
        { icon: 'target', title: 'Focus', text: 'One question, answered well.' },
        { icon: 'check', title: 'Rigour', text: 'Methods that match the question.' },
        { icon: 'pen', title: 'Clarity', text: 'Writing that is easy to follow.' },
      ],
    },
  }, pillars(V2)),
  entry(7, {
    id: 'studio-stuck-serif', name: 'Stuck on your thesis? — steps', category: 'thesis', kind: 'steps',
    content: {
      heading: 'Stuck on\n*Your Thesis?*', sub: 'Topic? Methodology? Analysis? Writing? Publication?', body: 'Let’s break the research journey into *manageable steps.*', cta: 'Start your research journey', photo: 'desk',
      person: { name: '', role: '', photo: 'mountains' },
      items: [
        { icon: 'search', title: 'Research', text: 'Topic selection, literature review and design.' },
        { icon: 'bars', title: 'Analysis', text: 'Data cleaning, statistics and interpretation.' },
        { icon: 'pen', title: 'Writing', text: 'Structured writing, editing and formatting.' },
        { icon: 'book', title: 'Publication', text: 'Journal guidance and submission support.' },
      ],
    },
  }, stuckSerif(V1)),
  entry(7, {
    id: 'studio-proposal-serif', name: 'Proposal pending? — steps', category: 'proposal', kind: 'steps',
    content: {
      heading: 'Proposal\n*Still Pending?*', sub: 'Problem statement? Objectives? Methods? Timeline?', body: 'We turn a rough idea into an *approvable proposal.*', cta: 'Book a free consultation', photo: 'writing',
      person: { name: '', role: '', photo: 'campus' },
      items: [
        { icon: 'bulb', title: 'Idea', text: 'Narrow the topic to a clear gap.' },
        { icon: 'target', title: 'Objectives', text: 'Specific, measurable research aims.' },
        { icon: 'layers', title: 'Method', text: 'Design, sampling and tools.' },
        { icon: 'calendar', title: 'Timeline', text: 'A realistic work plan and budget.' },
      ],
    },
  }, stuckSerif(V2)),
  entry(8, {
    id: 'studio-weak-thesis', name: 'A weak thesis holds you back', category: 'thesis', kind: 'services',
    content: {
      eyebrow: 'A weak', heading: 'THESIS', sub: 'can hold back your success', body: 'Don’t let a poor thesis limit your potential.', quote: 'Let’s build a thesis that opens doors.',
      numberLabel: 'We help you craft a thesis that stands out', photo: 'library',
      items: [
        { icon: 'pen', title: 'Thesis Writing' }, { icon: 'search', title: 'Literature Review' }, { icon: 'bars', title: 'Data Analysis' },
        { icon: 'fileCheck', title: 'Editing & Proofreading' }, { icon: 'book', title: 'Publication Support' },
      ],
    },
  }, weak(V1)),
  entry(8, {
    id: 'studio-weak-paper', name: 'A rejected paper? — rescue', category: 'publication', kind: 'services',
    content: {
      eyebrow: 'One more', heading: 'REJECT?', sub: 'Let’s make the next submission count', body: 'Most rejections are fixable — structure, language or journal fit.', quote: 'We revise, reformat and resubmit with you.',
      numberLabel: 'How we turn a rejection into an acceptance', photo: 'research',
      items: [
        { icon: 'search', title: 'Reviewer Analysis' }, { icon: 'refresh', title: 'Major Revision' }, { icon: 'translate', title: 'Language Polish' },
        { icon: 'target', title: 'Journal Match' }, { icon: 'mail', title: 'Response Letter' },
      ],
    },
  }, weak(V2)),
];
