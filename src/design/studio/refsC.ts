/**
 * Studio designs from references 18–31 (Thesis Companion and Artova Research
 * posters): two variations each. References 32–44 repeat 23–31.
 */
import type { AdContent, ElementSpec } from '../../types/template';
import { P, icon, linear, logo, shape } from '../builders';
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
  bullets,
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
  soft,
  stamp,
  sub,
} from './kit';
import type { StudioEntry, Tone, Variant } from './kit';

const clearOf = (t: Tone) => (t === 'dark' ? 'brand.primary/0' : 'rgba(255, 255, 255, 0)');
const lightBg = linear(160, [0, '#ffffff'], [1, PAPER]);
const bgOf = (t: Tone) => (t === 'dark' ? D : lightBg);
/** Photo that fades into the page on its inner edge. */
const fadePhoto = (v: Variant, src: string, x: number, y: number, w: number, h: number, id: 'photo' | 'photo2' = 'photo') =>
  photo(src, P(mx(v.flip, x, w), y, w, h), { overlay: linear(v.flip ? 180 : 0, [0, v.tone === 'dark' ? D : '#ffffff'], [0.35, clearOf(v.tone)]) }, id);

/* 18 · "Academic services" — photo top, logo disc, offer list + why-us box */
const services18 = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  return layout(
    dark ? D : PAPER,
    photo(photoSrc(c.photo, 'writing'), P(0, 0, 1080, 560), { overlay: linear(90, [0.6, 'rgba(0, 0, 0, 0)'], [1, dark ? 'brand.primary/60' : 'brand.paper/50']) }),
    chip('brand-pill', '{brand}', P(mx(v.flip, 680, 360), 40, 360, 70), 'accent', { size: 26, upper: true, font: 'heavy' }),
    shape('logo-disc', P(mx(v.flip, 700, 320), 390, 320, 320), { kind: 'ellipse', fill: WHITE, shadow: true, stroke: A, strokeWidth: 8 }, { name: 'Logo disc', aspect: 1 }),
    logo(P(mx(v.flip, 745, 230), 440, 230, 220), { variant: 'full', tone: 'dark', align: 'center' }),
    shape('dots', P(mx(v.flip, 60, 110), 600, 110, 24), { kind: 'dots', fill: A }, { name: 'Dots' }),
    headline(c.heading, P(mx(v.flip, 60, 640), 640, 640, 230), { tone: v.tone, size: 98, upper: true, lh: 1.0, color: fg(v.tone), hlColor: dark ? A : POP }),
    para('body', 'body', c.body, P(mx(v.flip, 60, 680), 880, 680, 130), { tone: v.tone, size: 22, lh: 1.45 }),
    para('offer-title', 'label', c.eyebrow, P(mx(v.flip, 60, 520), 1020, 520, 44), { tone: v.tone, font: 'heavy', size: 28, weight: 900, upper: true, color: dark ? A : POP }, 'List title'),
    bullets(c.bullets, P(mx(v.flip, 60, 540), 1068, 540, 180), { tone: v.tone, size: 20, weight: 700, upper: true, bullet: '●', lh: 1.35 }),
    panel('why-box', P(mx(v.flip, 630, 410), 1010, 410, 230), 'rgba(255, 255, 255, 0)', 40, { stroke: dark ? A : D, name: 'Why box' }),
    para('why-title', 'label', c.numberLabel, P(mx(v.flip, 660, 350), 1028, 350, 44), { tone: v.tone, font: 'heavy', size: 26, weight: 900, color: dark ? A : POP }, 'Box title'),
    bullets(c.items?.map((i) => i.title), P(mx(v.flip, 670, 330), 1080, 330, 150), { tone: v.tone, size: 21, bullet: '•', lh: 1.35 }, 'list-2'),
    cta(c.cta, P(60, 1266, 250, 62), 'accent', { arrow: false, size: 22, upper: true }),
    contactRow({ x: 340, y: 1266, w: 700, h: 62 }, { tone: v.tone, fields: ['phone', 'address'], size: 21 }),
  );
};

/* 19–22 · Thesis Companion series frame: centred lockup, rule, content, contact footer */
function seriesFrame(v: Variant, content: ElementSpec[], footerY = 1150): ReturnType<typeof layout> {
  const dark = v.tone === 'dark';
  return layout(
    dark ? D : WHITE,
    logo(P(170, 40, 740, 116), { variant: 'lockup', tone: dark ? 'light' : 'dark', align: 'center' }),
    shape('header-rule', P(0, 178, 1080, 3), { fill: dark ? 'rgba(255, 255, 255, 0.55)' : 'brand.ink/20' }, { name: 'Rule' }),
    content,
    panel('footer-bg', P(0, footerY, 1080, 1350 - footerY), dark ? A : D, 0, { name: 'Footer' }),
    contactRow({ x: 60, y: footerY + 30, w: 960, h: 60 }, { tone: dark ? 'light' : 'dark', fields: ['phone', 'email'], size: 22, iconBg: dark ? D : A, iconColor: dark ? A : INK, color: dark ? INK : WHITE }),
    contactRow({ x: 60, y: footerY + 110, w: 960, h: 60 }, { tone: dark ? 'light' : 'dark', fields: ['address', 'website'], size: 22, iconBg: dark ? D : A, iconColor: dark ? A : INK, color: dark ? INK : WHITE }),
  );
}

const confusion = (v: Variant) => (c: AdContent) =>
  seriesFrame(v, [
    headline(c.heading, P(60, 220, 960, 80), { tone: v.tone, size: 54, weight: 900, align: 'center', vAlign: 'middle' }),
    headline(c.sub, P(60, 300, 960, 70), { tone: v.tone, size: 40, weight: 800, align: 'center', hlColor: v.tone === 'dark' ? A : POP }, 'sub', 'subheading'),
    ...para('body', 'body', c.body, P(110, 390, 860, 110), { tone: v.tone, font: 'serif', size: 30, align: 'center' }),
    blob('blob', P(140, 560, 800, 560), v.tone === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'brand.accent/18'),
    photo(photoSrc(c.photo, 'students'), P(180, 540, 720, 570), { radius: 32, shadow: true }),
  ]);

const excellence = (v: Variant) => (c: AdContent) => {
  const items = (c.items ?? []).slice(0, 5);
  const cx = 540;
  const cy = 860;
  const r = 330;
  return seriesFrame(v, [
    headline(c.heading, P(40, 210, 1000, 140), { tone: v.tone, size: 112, align: 'center', vAlign: 'middle', hlColor: v.tone === 'dark' ? A : POP }),
    ...sub(c, P(60, 360, 960, 60), { tone: v.tone, size: 32, weight: 500, align: 'center', color: fg(v.tone) }),
    photo(photoSrc(c.photo, 'graduation'), P(cx - 150, cy - 150, 300, 300), { shape: 'circle', borderWidth: 10, borderColor: v.tone === 'dark' ? A : D }),
    ...items.flatMap((it, i) => {
      const a = Math.PI * (1.08 + (0.84 * i) / Math.max(1, items.length - 1));
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a) * 0.8;
      return [
        icon(`item-${i + 1}-icon`, P(x - 55, y - 55, 110, 110), { name: it.icon, color: v.tone === 'dark' ? INK : WHITE, bg: v.tone === 'dark' ? A : D, bgShape: 'circle', strokeWidth: 2 }, { name: `Item ${i + 1} icon` }),
        ...para(`item-${i + 1}-title`, 'label', it.title, P(x - 100, y + 62, 200, 60), { tone: v.tone, size: 21, weight: 700, align: 'center', color: fg(v.tone) }, `Item ${i + 1}`),
      ];
    }),
    ...para('eyebrow', 'label', c.eyebrow, P(60, 1040, 960, 60), { tone: v.tone, size: 28, weight: 700, align: 'center', color: v.tone === 'dark' ? A : POP }, 'Tagline'),
  ]);
};

const problem = (v: Variant) => (c: AdContent) =>
  seriesFrame(v, [
    photo(photoSrc(c.photo, 'reader'), P(0, 520, 1080, 630), { overlay: linear(90, [0, v.tone === 'dark' ? D : WHITE], [0.3, clearOf(v.tone)]) }),
    headline(c.heading, P(60, 210, 960, 100), { tone: v.tone, size: 72, weight: 800, align: 'center', vAlign: 'middle', upper: true }),
    headline(c.sub, P(40, 316, 1000, 80), { tone: v.tone, size: 50, weight: 900, align: 'center', vAlign: 'middle', hlColor: v.tone === 'dark' ? A : POP }, 'sub', 'subheading'),
    ...chip('eyebrow', c.eyebrow, P(170, 416, 740, 68), 'accent', { size: 28 }),
  ]);

const alone = (v: Variant) => (c: AdContent) =>
  seriesFrame(
    v,
    [
      headline(c.heading, P(60, 210, 960, 110), { tone: v.tone, font: 'serif', size: 86, weight: 700, align: 'center', vAlign: 'middle' }),
      ...para('sub', 'subheading', c.sub, P(60, 326, 960, 70), { tone: v.tone, font: 'serif', size: 50, align: 'center', color: fg(v.tone) }),
      ...chip('eyebrow', c.eyebrow, P(220, 420, 640, 80), 'accent', { size: 36, font: 'heavy' }),
      photo(photoSrc(c.photo, 'campus'), P(120, 560, 840, 440), { radius: 6, shadow: true }),
      panel('strip', P(0, 1040, 1080, 90), v.tone === 'dark' ? A : D, 0, { name: 'Strip' }),
      ...para('body', 'body', c.body, P(60, 1040, 960, 90), { tone: v.tone === 'dark' ? 'light' : 'dark', font: 'serif', size: 30, weight: 700, align: 'center', vAlign: 'middle', color: v.tone === 'dark' ? INK : WHITE }),
    ],
    1150,
  );

/* 23 · "Call for research papers" — heavy headline, journal index card, portrait, sticky note */
const callPapers = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 600);
  const cmp = c.compare;
  const cell = (id: string, t: string, f: ReturnType<typeof P>) => para(id, 'label', t, f, { tone: 'light', font: 'serif', size: 23, weight: 700, color: M, vAlign: 'middle' }, 'Journal');
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'portraitWoman'), 600, 150, 480, 960),
    brandHeader(v.tone, x, 46),
    cornerTag('Research for a\nbrighter\ntomorrow', P(x + 370, 50, 200, 86), v.tone),
    panel('note', P(mx(v.flip, 830, 210), 40, 210, 190), 'brand.accent/35', 6, { rotation: v.flip ? -6 : 6, name: 'Sticky note' }),
    script('note-text', c.quote, P(mx(v.flip, 845, 180), 56, 180, 160), dark ? WHITE : INK, 38, v.flip ? -6 : 6, 'center'),
    headline(c.heading, P(x, 180, 620, 330), { tone: v.tone, size: 98, upper: true, lh: 0.98, hlColor: dark ? A : M }),
    chip('eyebrow', c.eyebrow, P(x, 520, 420, 58), dark ? 'glass' : 'soft', { size: 23 }),
    iconRow(c.items, { x, y: 604, w: 580, h: 150 }, { tone: v.tone, icon: 'ring', size: 18, max: 4 }),
    panel('journals', P(x, 780, 600, 380), WHITE, 22, { shadow: true, stroke: 'brand.ink/8', name: 'Journal card' }),
    para('journals-title', 'label', cmp?.leftTitle, P(x + 24, 796, 552, 40), { tone: 'light', size: 20, weight: 800, color: D, upper: true, ls: 1 }, 'Card title'),
    (cmp?.left ?? []).slice(0, 8).flatMap((t, i) => cell(`journal-${i + 1}`, t, P(x + 24 + (i % 4) * 140, 842 + Math.floor(i / 4) * 64, 136, 56))),
    shape('journals-rule', P(x + 24, 980, 552, 2), { fill: 'brand.ink/10' }, { name: 'Rule' }),
    para('journals-title-2', 'label', cmp?.rightTitle, P(x + 24, 992, 552, 40), { tone: 'light', size: 20, weight: 800, color: D, upper: true, ls: 1 }, 'Card title'),
    (cmp?.right ?? []).slice(0, 4).flatMap((t, i) => cell(`journal-np-${i + 1}`, t, P(x + 24 + i * 140, 1040, 136, 90))),
    cta(c.cta, P(mx(v.flip, 60, 340), 1196, 340, 76), dark ? 'accent' : 'mid', { size: 24 }),
    contactRow({ x: mx(v.flip, 420, 600), y: 1196, w: 600, h: 76 }, { tone: v.tone, fields: ['email', 'website'], size: 17 }),
  );
};

/* 24 · "From ideas to excellent results" — script lead-in, service cards, brush band */
const excellent = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 600);
  const items = c.items ?? [];
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'portraitWoman2'), 600, 170, 480, 880),
    brandHeader(v.tone, x, 46),
    cornerTag('Research for a\nbrighter\ntomorrow', P(x + 370, 50, 200, 86), v.tone),
    script('note', c.quote, P(mx(v.flip, 800, 250), 50, 250, 150), dark ? WHITE : INK, 40, v.flip ? -5 : 5, 'center'),
    script('lead', c.eyebrow, P(x, 186, 560, 90), fg(v.tone), 76),
    headline(c.heading, P(x, 270, 620, 240), { tone: v.tone, size: 104, upper: true, lh: 0.98, hlColor: dark ? A : M }),
    sub(c, P(x, 520, 560, 80), { tone: v.tone, size: 24 }),
    itemGrid(items.slice(0, 6), { x, y: 620, w: 600, h: 400 }, { cols: 2, tone: v.tone, card: dark ? 'glass' : 'white', layout: 'row', icon: 'soft', iconSize: 50, titleSize: 20, textSize: 15, gap: 12, radius: 12 }),
    panel('band', P(40, 1052, 1000, 124), dark ? WHITE : D, 62, { rotation: -1, name: 'Band' }),
    itemGrid(items.slice(6, 9), { x: 80, y: 1066, w: 920, h: 96 }, { cols: 3, tone: dark ? 'light' : 'dark', card: 'none', layout: 'row', icon: 'circle', iconSize: 56, titleSize: 20, textSize: 14, from: 6 }),
    cta(c.cta, P(mx(v.flip, 60, 280), 1212, 280, 72), dark ? 'accent' : 'mid', { size: 24 }),
    contactRow({ x: mx(v.flip, 360, 680), y: 1212, w: 680, h: 72 }, { tone: v.tone, fields: ['email', 'website'], size: 17 }),
    script('sign-off', c.body, P(mx(v.flip, 700, 340), 1284, 340, 60), dark ? A : M, 32, -3, 'right'),
  );
};

/* 25 · "Assignment help: course code" — stacked label, huge code, feature grid, brush script */
const courseCode = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 620);
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'portraitWoman2'), 620, 170, 460, 1060),
    brandHeader(v.tone, x, 46, { w: 320 }),
    chip('eyebrow', c.eyebrow, P(x + 350, 30, 260, 120), dark ? 'accent' : 'dark', { size: 34, font: 'heavy', upper: true, square: true }),
    cornerTag('Research for a\nbrighter\ntomorrow', P(mx(v.flip, 840, 200), 50, 200, 86), v.tone),
    headline(c.heading, P(x, 170, 640, 150), { tone: v.tone, size: 132, ls: -5, color: dark ? A : D }),
    headline(c.sub, P(x, 320, 600, 140), { tone: v.tone, size: 54, weight: 800, lh: 1.04 }, 'sub', 'subheading'),
    para('body', 'body', c.body, P(x, 468, 600, 40), { tone: v.tone, size: 21 }),
    para('promise', 'label', c.quote, P(x, 508, 600, 40), { tone: v.tone, size: 22, italic: true, weight: 600, color: dark ? A : POP }, 'Promise'),
    itemGrid(c.items, { x, y: 570, w: 600, h: 450 }, { cols: 2, tone: v.tone, card: 'none', layout: 'row', icon: 'soft', iconSize: 58, titleSize: 22, textSize: 16, gap: 14, max: 6 }),
    panel('brush', P(mx(v.flip, 40, 560), 1046, 560, 136), dark ? WHITE : D, 24, { rotation: -3, name: 'Brush band' }),
    script('slogan', c.badge, P(mx(v.flip, 70, 500), 1052, 500, 124), dark ? D : WHITE, 46, -3, 'center'),
    panel('footer-bg', P(0, 1226, 1080, 124), dark ? WHITE : D, 0, { name: 'Footer bar' }),
    cta(c.cta, P(50, 1252, 260, 72), 'accent', { size: 24 }),
    contactRow({ x: 340, y: 1252, w: 700, h: 72 }, { tone: dark ? 'light' : 'dark', fields: ['email', 'website'], size: 18 }),
  );
};

/* 26 · "Thesis & research support" — heavy headline, 2 × 4 service list, sticker, band */
const supportList = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 600);
  const items = c.items ?? [];
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'studying'), 640, 250, 440, 760),
    brandHeader(v.tone, x, 46),
    cornerTag('Research for a\nbrighter\ntomorrow', P(x + 370, 50, 200, 86), v.tone),
    panel('sticker', P(mx(v.flip, 760, 280), 150, 280, 130), dark ? A : M, 18, { rotation: v.flip ? 5 : -5, shadow: true, name: 'Sticker' }),
    script('sticker-text', c.quote, P(mx(v.flip, 770, 260), 156, 260, 118), dark ? INK : WHITE, 36, v.flip ? 5 : -5, 'center'),
    headline(c.heading, P(x, 170, 660, 200), { tone: v.tone, size: 80, upper: true, lh: 1.0, hlColor: dark ? A : M }),
    sub(c, P(x, 380, 580, 64), { tone: v.tone, size: 23 }),
    para('promise', 'label', c.eyebrow, P(x, 446, 580, 36), { tone: v.tone, size: 21, italic: true, weight: 600, color: dark ? A : POP }, 'Promise'),
    itemGrid(items.slice(0, 8), { x, y: 500, w: 600, h: 480 }, { cols: 2, tone: v.tone, card: 'none', layout: 'row', icon: 'soft', iconSize: 48, titleSize: 19, textSize: 14, gap: 10 }),
    panel('band', P(40, 1010, 1000, 120), M, 60, { name: 'Band' }),
    itemGrid(items.slice(8, 11), { x: 80, y: 1022, w: 920, h: 96 }, { cols: 3, tone: 'dark', card: 'none', layout: 'row', icon: 'circle', iconSize: 54, titleSize: 19, textSize: 14, from: 8 }),
    footerBar(v.tone, { y: 1180, h: 110, fields: ['phone', 'email', 'website'], inset: 40, radius: 24 }),
    cta(c.cta, P(mx(v.flip, 60, 300), 1298, 300, 44), dark ? 'accent' : 'dark', { size: 18 }),
  );
};

/* 27 · "Stuck on your thesis?" (Artova) — photo corner, 3 × 2 cards, statement band */
const stuckCards = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 580);
  const items = c.items ?? [];
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'reader'), 620, 110, 460, 520),
    shape('photo-fade', P(mx(v.flip, 620, 460), 470, 460, 160), { fill: linear(90, [0, clearOf(v.tone)], [1, dark ? D : PAPER]) }, { name: 'Fade' }),
    brandHeader(v.tone, x, 46),
    headline(c.heading, P(x, 170, 600, 230), { tone: v.tone, size: 98, upper: true, lh: 0.98, hlColor: dark ? A : M }),
    sub(c, P(x, 412, 540, 150), { tone: v.tone, size: 25 }),
    itemGrid(items.slice(0, 6), { x: 60, y: 600, w: 960, h: 380 }, { cols: 3, tone: v.tone, card: dark ? 'glass' : 'white', layout: 'row', icon: 'soft', iconSize: 56, titleSize: 22, textSize: 16, gap: 14, radius: 14 }),
    panel('band', P(40, 1010, 1000, 130), dark ? WHITE : D, 65, { rotation: -1, name: 'Band' }),
    para('quote', 'quote', c.quote, P(90, 1016, 900, 118), { tone: dark ? 'light' : 'dark', font: 'heavy', size: 30, weight: 800, align: 'center', vAlign: 'middle', color: dark ? D : WHITE }),
    cta(c.cta, P(mx(v.flip, 60, 330), 1168, 330, 74), dark ? 'accent' : 'mid', { size: 24 }),
    para('cta-note', 'label', c.body, P(mx(v.flip, 60, 330), 1246, 330, 30), { tone: v.tone, size: 17, align: 'center' }, 'CTA note'),
    iconRow(items.slice(6, 9), { x: mx(v.flip, 620, 420), y: 1160, w: 420, h: 110 }, { tone: v.tone, icon: 'bare', size: 16, dividers: true, from: 6 }),
    contactRow({ x: 60, y: 1290, w: 960, h: 46 }, { tone: v.tone, fields: ['email', 'website'], size: 17 }),
  );
};

/* 28 · "Do you want to publish your research?" — question stack, icon list, CTA, desk photo */
const publishQ = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 620);
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'laptop'), 600, 330, 480, 820),
    brandHeader(v.tone, x, 46),
    cornerTag('Research for a\nbrighter\ntomorrow', P(mx(v.flip, 840, 200), 50, 200, 86), v.tone),
    para('eyebrow', 'label', c.eyebrow, P(x, 196, 640, 56), { tone: v.tone, font: 'heavy', size: 40, weight: 900, upper: true, color: fg(v.tone) }, 'Lead-in'),
    headline(c.heading, P(x, 250, 680, 220), { tone: v.tone, size: 100, upper: true, lh: 0.98, hlColor: dark ? A : M }),
    headline(c.sub, P(x, 480, 620, 110), { tone: v.tone, size: 38, weight: 900, upper: true, lh: 1.08, hlColor: dark ? A : M }, 'sub', 'subheading'),
    para('body', 'body', c.body, P(x, 600, 520, 80), { tone: v.tone, size: 25 }),
    iconList(c.items, { x, y: 700, w: 560, h: 400 }, { tone: v.tone, icon: 'bare', iconSize: 36, titleSize: 21, max: 7 }),
    cta(c.cta, P(x, 1124, 440, 72), dark ? 'accent' : 'dark', { size: 20, upper: true }),
    shape('sign-rule', P(x, 1236, 40, 2), { fill: soft(v.tone, 50) }, { name: 'Rule' }),
    para('sign-off', 'label', c.quote, P(x + 56, 1214, 520, 50), { tone: v.tone, size: 16, weight: 700, upper: true, ls: 3 }, 'Sign-off'),
    shape('footer-rule', P(60, 1280, 960, 2), { fill: soft(v.tone, 18) }, { name: 'Hairline' }),
    contactRow({ x: 60, y: 1290, w: 960, h: 50 }, { tone: v.tone, fields: ['email', 'website'], size: 17 }),
  );
};

/* 29 · "Turnitin similarity check" — keyword stack, report mock-up, receive-card, sticker */
const similarity = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 40, 580);
  const rx = mx(v.flip, 640, 400);
  const bars = [0.62, 0.44, 0.3, 0.2];
  return layout(
    bgOf(v.tone),
    brandHeader(v.tone, x, 40),
    script('note', c.quote, P(v.flip ? 150 : x + 380, 40, 280, 110), fg(v.tone), 50, v.flip ? 6 : -6, 'center'),
    headline(c.heading, P(x, 170, 600, 130), { tone: v.tone, size: 118, upper: true, ls: -4, color: dark ? A : D }),
    headline(c.sub, P(x, 296, 600, 70), { tone: v.tone, size: 54, weight: 900, upper: true }, 'sub', 'subheading'),
    chip('eyebrow', c.eyebrow, P(x, 376, 560, 56), dark ? 'accent' : 'mid', { size: 23, square: true }),
    para('body', 'body', c.body, P(x, 446, 560, 70), { tone: v.tone, size: 21 }),
    iconList(c.items, { x, y: 524, w: 560, h: 280 }, { tone: v.tone, icon: 'tile', iconSize: 44, titleSize: 22, max: 5 }),
    panel('receive-card', P(x, 824, 560, 340), dark ? WHITE : D, 20, { shadow: true, name: 'Receive card' }),
    para('receive-title', 'label', c.numberLabel, P(x + 28, 842, 500, 44), { tone: dark ? 'light' : 'dark', size: 24, weight: 800, color: dark ? D : A }, 'Card title'),
    bullets(c.bullets, P(x + 28, 892, 510, 260), { tone: dark ? 'light' : 'dark', size: 20, weight: 500, bullet: '✓', bulletColor: dark ? POP : A, lh: 1.45 }),
    panel('report', P(rx, 180, 400, 520), WHITE, 22, { shadow: true, stroke: 'brand.ink/8', rotation: v.flip ? -3 : 3, name: 'Report card' }),
    para('report-title', 'label', c.person?.role, P(rx + 28, 204, 344, 40), { tone: 'light', size: 22, weight: 800, color: D }, 'Report title'),
    para('number', 'name', c.number, P(rx + 28, 250, 344, 140), { tone: 'light', font: 'heavy', size: 120, weight: 900, color: M, align: 'center', vAlign: 'middle' }, 'Big number'),
    para('number-label', 'label', c.person?.name, P(rx + 28, 390, 344, 36), { tone: 'light', size: 20, weight: 600, align: 'center' }, 'Number label'),
    bars.flatMap((b, i) => [
      shape(`bar-${i + 1}-track`, P(rx + 40, 460 + i * 52, 320, 14), { fill: 'brand.ink/8', radius: 7 }, { name: 'Bar track' }),
      shape(`bar-${i + 1}`, P(rx + 40, 460 + i * 52, 320 * b, 14), { fill: i === 0 ? M : 'brand.secondary/55', radius: 7 }, { name: 'Bar' }),
    ]),
    photo(photoSrc(c.photo, 'laptop'), P(rx, 740, 400, 424), { radius: 22, shadow: true }),
    stamp(c.badge, P(mx(v.flip, 870, 190), 620, 190, 190), dark ? A : WHITE, dark ? INK : M, 26, dark ? WHITE : M),
    footerBar(v.tone, { y: 1200, h: 110, fields: ['phone', 'email', 'website'], inset: 40, radius: 24 }),
  );
};

/* 30 · "Research made easier" — long service list, why-us card, handwritten flow line */
const easier = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 560);
  const cx = mx(v.flip, 640, 400);
  const items = c.items ?? [];
  return layout(
    bgOf(v.tone),
    brandHeader(v.tone, x, 46),
    cornerTag('Research · Analyze\nWrite · Succeed', P(mx(v.flip, 820, 220), 50, 220, 70), v.tone),
    photo(photoSrc(c.photo, 'reader'), P(cx, 150, 400, 520), { radius: 26, shadow: true }),
    headline(c.heading, P(x, 170, 580, 170), { tone: v.tone, size: 60, lh: 1.08, hlColor: dark ? A : M }),
    sub(c, P(x, 350, 560, 80), { tone: v.tone, size: 22 }),
    iconList(items.slice(0, 8), { x, y: 440, w: 560, h: 560 }, { tone: v.tone, icon: 'tile', iconSize: 46, titleSize: 20, textSize: 15, max: 8 }),
    panel('why-card', P(cx, 700, 400, 300), dark ? WHITE : D, 22, { shadow: true, name: 'Why card' }),
    para('why-title', 'label', c.numberLabel, P(cx + 20, 716, 360, 50), { tone: dark ? 'light' : 'dark', size: 22, weight: 800, align: 'center', vAlign: 'middle', color: dark ? D : WHITE }, 'Card title'),
    itemGrid(items.slice(8, 12), { x: cx + 16, y: 776, w: 368, h: 210 }, { cols: 2, tone: dark ? 'light' : 'dark', card: 'none', layout: 'stack', icon: 'circle', iconSize: 50, titleSize: 16, gap: 6, from: 8 }),
    script('flow', c.quote, P(60, 1020, 960, 80), dark ? A : M, 46, 0, 'center'),
    para('body', 'body', c.body, P(60, 1100, 960, 40), { tone: v.tone, size: 21, align: 'center' }),
    cta(c.cta, P(310, 1150, 460, 74), dark ? 'accent' : 'dark', { size: 23 }),
    shape('footer-rule', P(60, 1256, 960, 2), { fill: soft(v.tone, 18) }, { name: 'Hairline' }),
    contactRow({ x: 60, y: 1270, w: 960, h: 60 }, { tone: v.tone, fields: ['phone', 'email', 'website'], size: 18 }),
  );
};

/* 31 · "Struggling with your research project?" — tall photo, two icon rows, audience band */
const stairs = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 540);
  const items = c.items ?? [];
  return layout(
    bgOf(v.tone),
    fadePhoto(v, photoSrc(c.photo, 'campus'), 540, 0, 540, 1190),
    brandHeader(v.tone, x, 46),
    script('note', c.eyebrow, P(mx(v.flip, 60, 400), 150, 400, 60), dark ? A : M, 42, -3),
    headline(c.heading, P(x, 210, 560, 250), { tone: v.tone, size: 60, lh: 1.06, hlColor: dark ? A : M }),
    para('lead', 'label', c.sub, P(x, 470, 520, 40), { tone: v.tone, size: 23, weight: 700, color: fg(v.tone) }, 'Lead-in'),
    iconRow(items.slice(0, 5), { x, y: 520, w: 540, h: 150 }, { tone: v.tone, icon: 'soft', size: 16 }),
    iconRow(items.slice(5, 9), { x, y: 690, w: 540, h: 140 }, { tone: v.tone, icon: 'circle', size: 16, from: 5 }),
    cta(c.cta, P(x, 860, 340, 70), dark ? 'accent' : 'mid', { size: 22 }),
    contactRow({ x, y: 950, w: 460, h: 50 }, { tone: v.tone, fields: ['phone'], size: 21 }),
    contactRow({ x, y: 1010, w: 460, h: 50 }, { tone: v.tone, fields: ['website'], size: 19 }),
    script('quote', c.quote, P(x, 1080, 480, 100), fg(v.tone), 44, -4),
    panel('band', P(0, 1200, 1080, 150), dark ? WHITE : D, 0, { name: 'Audience band' }),
    iconRow(items.slice(9, 13), { x: 40, y: 1220, w: 1000, h: 112 }, { tone: dark ? 'light' : 'dark', icon: 'bare', size: 17, dividers: true, from: 9 }),
  );
};

const JOURNALS = {
  leftTitle: 'International journals',
  left: ['Scopus', 'Web of Science', 'Springer', 'IEEE', 'Wiley', 'ScienceDirect', 'PubMed', 'Elsevier'],
  rightTitle: 'Nepal journals',
  right: ['NepJOL', 'TU Journals', 'NAST', 'NJL'],
};

export const REFS_C: StudioEntry[] = [
  entry(18, {
    id: 'studio-academic-services', name: 'Academic services — logo disc', category: 'brand', kind: 'services',
    content: {
      heading: '*Academic*\nServices', body: 'Facing complex research hurdles or tight deadlines? Our expert team provides comprehensive, confidential support to help you excel.', photo: 'writing',
      eyebrow: 'What we offer:', bullets: ['Thesis & dissertation assistance', 'Academic writing & editing', 'Research guidance & proposals', 'Data analysis & methodology'],
      numberLabel: 'Why choose us?', items: [{ icon: 'star', title: 'Professionalism' }, { icon: 'users', title: 'Expert researchers' }, { icon: 'clock', title: 'On-time delivery' }, { icon: 'check', title: 'Accuracy' }], cta: 'Contact us',
    },
  }, services18(V1)),
  entry(18, {
    id: 'studio-editing-services', name: 'Editing services — logo disc', category: 'editing', kind: 'services',
    content: {
      heading: '*Editing*\nServices', body: 'Clear language, consistent formatting and clean references — so examiners read your ideas, not your typos.', photo: 'notes',
      eyebrow: 'What we fix:', bullets: ['Grammar & academic tone', 'APA / Harvard referencing', 'Tables, figures & captions', 'Similarity reduction'],
      numberLabel: 'You get', items: [{ icon: 'fileCheck', title: 'Tracked changes' }, { icon: 'chat', title: 'Editor comments' }, { icon: 'shield', title: 'Turnitin report' }, { icon: 'clock', title: '48-hour option' }], cta: 'Send your file',
    },
  }, services18(V2)),
  entry(19, {
    id: 'studio-confusion-completion', name: 'From confusion to completion', category: 'thesis', kind: 'hero',
    content: { heading: 'From Confusion to Completion', sub: 'With *{brand}*', body: 'Your research becomes structured, clear, and impactful.', photo: 'students' },
  }, confusion(V1)),
  entry(19, {
    id: 'studio-idea-to-degree', name: 'From idea to degree', category: 'brand', kind: 'hero',
    content: { heading: 'From First Idea to Final Degree', sub: 'Guided by *{brand}*', body: 'One team beside you at every stage of your academic journey.', photo: 'graduationSky' },
  }, confusion(V2)),
  entry(20, {
    id: 'studio-thesis-excellence', name: 'THESIS excellence', category: 'thesis', kind: 'services',
    content: {
      heading: '*THESIS* Excellence', sub: 'Expert guidance from research to final submission', photo: 'graduation', eyebrow: 'Topic · Research · Writing · Defence',
      items: [{ icon: 'book', title: 'Literature' }, { icon: 'search', title: 'Research' }, { icon: 'trophy', title: 'Excellence' }, { icon: 'pen', title: 'Writing' }, { icon: 'calendar', title: 'Deadlines' }],
    },
  }, excellence(V1)),
  entry(20, {
    id: 'studio-research-excellence', name: 'RESEARCH excellence', category: 'publication', kind: 'services',
    content: {
      heading: '*PAPER* Perfection', sub: 'From manuscript to accepted publication', photo: 'research', eyebrow: 'Draft · Edit · Submit · Publish',
      items: [{ icon: 'doc', title: 'Manuscript' }, { icon: 'translate', title: 'Editing' }, { icon: 'award', title: 'Acceptance' }, { icon: 'target', title: 'Journal fit' }, { icon: 'mail', title: 'Submission' }],
    },
  }, excellence(V2)),
  entry(21, {
    id: 'studio-thesis-problem', name: 'THESIS problem?', category: 'thesis', kind: 'hero',
    content: { heading: 'Thesis problem?', sub: '*{brand}* — your academic guide.', eyebrow: 'From idea 💡 to submission 🎓, we’ve got you covered.', photo: 'reader' },
  }, problem(V1)),
  entry(21, {
    id: 'studio-data-problem', name: 'DATA problem?', category: 'analysis', kind: 'hero',
    content: { heading: 'Data problem?', sub: '*{brand}* — your analysis partner.', eyebrow: 'From raw data 📊 to clear results ✅, sorted.', photo: 'analytics' },
  }, problem(V2)),
  entry(22, {
    id: 'studio-alone-in-thesis', name: 'Alone in thesis? Not anymore', category: 'thesis', kind: 'announcement',
    content: { heading: 'Alone in thesis?', sub: 'Not anymore', eyebrow: '{brand} xa ni', body: 'Start your thesis journey with confidence today.', photo: 'campus' },
  }, alone(V1)),
  entry(22, {
    id: 'studio-alone-abroad', name: 'Applying abroad alone?', category: 'abroad', kind: 'announcement',
    content: { heading: 'Applying abroad alone?', sub: 'Not anymore', eyebrow: '{brand} is with you', body: 'SOPs, applications and scholarships — done together.', photo: 'travel' },
  }, alone(V2)),
  entry(23, {
    id: 'studio-call-for-papers', name: 'Call for research papers', category: 'publication', kind: 'announcement',
    content: {
      heading: 'Call for\n*Research Papers*', eyebrow: 'Publish in reputed journals', quote: 'From research to real impact', photo: 'portraitWoman', cta: 'Get expert support', compare: JOURNALS,
      items: [{ icon: 'search', title: 'Journal Selection' }, { icon: 'pen', title: 'Manuscript Editing' }, { icon: 'arrow', title: 'Publication Support' }, { icon: 'bars', title: 'Indexing Guidance' }],
    },
  }, callPapers(V1)),
  entry(23, {
    id: 'studio-call-for-reviews', name: 'Call for review articles', category: 'publication', kind: 'announcement',
    content: {
      heading: 'Write a\n*Review Article*', eyebrow: 'Systematic & narrative reviews', quote: 'Your first paper starts here', photo: 'portraitMan2', cta: 'Start your review',
      compare: { ...JOURNALS, leftTitle: 'Target journals' },
      items: [{ icon: 'search', title: 'Search Strategy' }, { icon: 'layers', title: 'PRISMA Flow' }, { icon: 'pen', title: 'Drafting' }, { icon: 'fileCheck', title: 'Submission' }],
    },
  }, callPapers(V2)),
  entry(24, {
    id: 'studio-ideas-results', name: 'From ideas to excellent results', category: 'trust', kind: 'services',
    content: {
      eyebrow: 'From Ideas to', heading: 'Excellent\n*Results*', sub: 'Get expert help for your assignments, research, thesis and more.', quote: 'Your academic goals, our expert support', body: 'Research support for a brighter tomorrow', photo: 'portraitWoman2', cta: 'Message us',
      items: [
        { icon: 'doc', title: 'Research Proposal', text: 'Well-structured and professional.' },
        { icon: 'book', title: 'Literature Review', text: 'Find, organise and analyse.' },
        { icon: 'bars', title: 'Data Analysis', text: 'SPSS, R, Python and statistics.' },
        { icon: 'cap', title: 'Academic Writing', text: 'Clarity, structure and quality.' },
        { icon: 'fileCheck', title: 'Paid Turnitin Report', text: 'Official similarity report.' },
        { icon: 'shield', title: 'Plagiarism-Free', text: 'Original, high-quality content.' },
        { icon: 'clock', title: '24x7 Help', text: 'Support any time.' },
        { icon: 'users', title: 'Subject Experts', text: 'Qualified professionals.' },
        { icon: 'lock', title: '100% Confidential', text: 'Your information is safe.' },
      ],
    },
  }, excellent(V1)),
  entry(24, {
    id: 'studio-grades-results', name: 'From drafts to top grades', category: 'assignments', kind: 'services',
    content: {
      eyebrow: 'From Drafts to', heading: 'Top\n*Grades*', sub: 'Assignments, reports and projects written and checked by specialists.', quote: 'Less stress, better marks', body: 'Smart help for serious students', photo: 'portraitWoman', cta: 'Get a quote',
      items: [
        { icon: 'doc', title: 'Assignments', text: 'Any subject, any level.' },
        { icon: 'briefcase', title: 'Internship Reports', text: 'University formats.' },
        { icon: 'list', title: 'Case Studies', text: 'Analysis with sources.' },
        { icon: 'layers', title: 'Presentations', text: 'Slides that score.' },
        { icon: 'fileCheck', title: 'Proofreading', text: 'Clean, error-free writing.' },
        { icon: 'refresh', title: 'Free Revisions', text: 'Until it is right.' },
        { icon: 'bolt', title: 'Fast Turnaround', text: 'Urgent deadlines welcome.' },
        { icon: 'money', title: 'Student Pricing', text: 'Fair and upfront.' },
        { icon: 'lock', title: 'Private', text: 'Nobody else sees your work.' },
      ],
    },
  }, excellent(V2)),
  entry(25, {
    id: 'studio-course-code', name: 'Assignment help — course code', category: 'assignments', kind: 'offer',
    content: {
      eyebrow: 'Assignment\nHelp', heading: 'MBIS5014', sub: 'Leading People in Digital Organisations', body: 'Get research help for your assignments, research and more.', quote: 'Achieve better grades with {brand}.', badge: 'Your academic goals, our expert support', photo: 'portraitWoman2', cta: 'Message us',
      items: [
        { icon: 'cap', title: 'PhD Experts', text: 'Guidance from subject specialists.' },
        { icon: 'sparkle', title: 'AI-Free Work', text: '100% human-written content.' },
        { icon: 'shield', title: 'Plagiarism-Free', text: 'Original, high-quality work.' },
        { icon: 'fileCheck', title: 'Paid Turnitin Report', text: 'Official similarity report.' },
        { icon: 'clock', title: '24x7 Help', text: 'Support any time, anywhere.' },
        { icon: 'lock', title: '100% Privacy', text: 'Your information is safe with us.' },
      ],
    },
  }, courseCode(V1)),
  entry(25, {
    id: 'studio-course-code-mba', name: 'Course help — MBA module', category: 'assignments', kind: 'offer',
    content: {
      eyebrow: 'Module\nHelp', heading: 'MGT 612', sub: 'Strategic Management & Business Policy', body: 'Essays, case analyses and reports for your MBA modules.', quote: 'Built around your marking rubric.', badge: 'Submit with confidence', photo: 'portraitMan2', cta: 'Send the brief',
      items: [
        { icon: 'briefcase', title: 'MBA Specialists', text: 'Industry and academic experience.' },
        { icon: 'list', title: 'Rubric-Based', text: 'Every criterion addressed.' },
        { icon: 'book', title: 'Real Sources', text: 'Peer-reviewed references only.' },
        { icon: 'fileCheck', title: 'Similarity Report', text: 'Included with delivery.' },
        { icon: 'bolt', title: 'Urgent Orders', text: 'From 24 hours.' },
        { icon: 'refresh', title: 'Free Edits', text: 'After feedback.' },
      ],
    },
  }, courseCode(V2)),
  entry(26, {
    id: 'studio-thesis-research-support', name: 'Thesis & research support list', category: 'thesis', kind: 'services',
    content: {
      heading: 'Thesis & *Research*\nSupport', sub: 'Get expert help for your thesis, research, assignments and academic projects.', eyebrow: 'Achieve your academic goals with {brand}.', quote: 'Your research journey, our expert support', photo: 'studying',
      items: [
        { icon: 'doc', title: 'Research Proposal', text: 'A clear, well-structured proposal.' },
        { icon: 'book', title: 'Literature Review', text: 'Find, organise and analyse.' },
        { icon: 'bars', title: 'Data Analysis', text: 'SPSS, R, Python and statistics.' },
        { icon: 'target', title: 'Research Methodology', text: 'The right research approach.' },
        { icon: 'cap', title: 'Academic Writing', text: 'Clarity, structure and quality.' },
        { icon: 'list', title: 'Referencing & Formatting', text: 'Follow university guidelines.' },
        { icon: 'users', title: 'Thesis & Dissertation', text: 'Complete support with confidence.' },
        { icon: 'shield', title: 'Plagiarism Check', text: 'Original, high-quality content.' },
        { icon: 'clock', title: 'Expert help anytime' },
        { icon: 'users', title: 'Subject specialists' },
        { icon: 'lock', title: '100% confidential' },
      ],
    },
  }, supportList(V1)),
  entry(26, {
    id: 'studio-editing-support-list', name: 'Editing & formatting list', category: 'editing', kind: 'services',
    content: {
      heading: 'Editing & *Formatting*\nSupport', sub: 'Professional polish for theses, papers and reports before you submit.', eyebrow: 'Make your work read as good as it is.', quote: 'Polished, precise, publish-ready', photo: 'writing',
      items: [
        { icon: 'pen', title: 'Proofreading', text: 'Grammar, spelling, punctuation.' },
        { icon: 'translate', title: 'Language Editing', text: 'Academic tone and flow.' },
        { icon: 'list', title: 'APA / Harvard', text: 'References and citations.' },
        { icon: 'layers', title: 'Tables & Figures', text: 'Numbered and captioned.' },
        { icon: 'doc', title: 'University Template', text: 'Margins, fonts, headings.' },
        { icon: 'shield', title: 'Similarity Reduction', text: 'Paraphrasing done right.' },
        { icon: 'fileCheck', title: 'Turnitin Report', text: 'Before you submit.' },
        { icon: 'chat', title: 'Editor Notes', text: 'Know what changed and why.' },
        { icon: 'clock', title: '48-hour delivery' },
        { icon: 'star', title: 'Native-level editors' },
        { icon: 'lock', title: 'Strictly private' },
      ],
    },
  }, supportList(V2)),
  entry(27, {
    id: 'studio-stuck-cards', name: 'Stuck on your thesis? — cards', category: 'thesis', kind: 'services',
    content: {
      heading: 'Stuck on\nyour *thesis?*', sub: 'From choosing your research topic to understanding your data, every stage can feel overwhelming.', photo: 'reader',
      quote: 'You bring the research.\nWe help you *move forward with clarity.*', cta: 'Message us', body: 'to discuss your research needs',
      items: [
        { icon: 'doc', title: 'Research Proposal', text: 'Plan your research with a clear structure.' },
        { icon: 'book', title: 'Literature Review', text: 'Find and organise relevant research.' },
        { icon: 'bars', title: 'Methodology Support', text: 'Choose the right research approach.' },
        { icon: 'trend', title: 'Data Analysis', text: 'SPSS, R, Python and statistics.' },
        { icon: 'pen', title: 'Academic Editing', text: 'Improve clarity, structure and quality.' },
        { icon: 'list', title: 'Referencing & Formatting', text: 'Follow your university guidelines.' },
        { icon: 'cap', title: 'Student Focused' }, { icon: 'users', title: 'Expert Guidance' }, { icon: 'shield', title: 'Confidential' },
      ],
    },
  }, stuckCards(V1)),
  entry(27, {
    id: 'studio-stuck-publication', name: 'Stuck on publishing? — cards', category: 'publication', kind: 'services',
    content: {
      heading: 'Stuck on\nyour *paper?*', sub: 'Journal choice, formatting, reviewer comments — publishing has a lot of hidden steps.', photo: 'research',
      quote: 'You wrote the research.\nWe help you *get it published.*', cta: 'Message us', body: 'to discuss your manuscript',
      items: [
        { icon: 'target', title: 'Journal Selection', text: 'Scope, indexing and timelines.' },
        { icon: 'pen', title: 'Manuscript Editing', text: 'Language and structure.' },
        { icon: 'list', title: 'Author Guidelines', text: 'Formatted to the journal.' },
        { icon: 'mail', title: 'Cover Letter', text: 'A pitch editors read.' },
        { icon: 'chat', title: 'Reviewer Replies', text: 'Point-by-point responses.' },
        { icon: 'shield', title: 'Predatory Check', text: 'Avoid fake journals.' },
        { icon: 'award', title: 'Indexed Journals' }, { icon: 'users', title: 'Experienced Authors' }, { icon: 'lock', title: 'Confidential' },
      ],
    },
  }, stuckCards(V2)),
  entry(28, {
    id: 'studio-publish-question', name: 'Do you want to publish?', category: 'publication', kind: 'services',
    content: {
      eyebrow: 'Do you want to', heading: 'Publish your\n*research?*', sub: 'Do you want to become\na *researcher?*', body: 'Turn your research ideas into published work.', photo: 'laptop', cta: 'Let’s build your research profile', quote: 'Start your research journey with {brand}',
      items: [
        { icon: 'doc', title: 'Research paper development' }, { icon: 'book', title: 'Journal publication support' }, { icon: 'bars', title: 'Research methodology & data analysis' },
        { icon: 'cap', title: 'Thesis & dissertation support' }, { icon: 'pen', title: 'Manuscript editing & formatting' }, { icon: 'arrow', title: 'Journal selection & submission guidance' }, { icon: 'users', title: 'Researcher development & mentorship' },
      ],
    },
  }, publishQ(V1)),
  entry(28, {
    id: 'studio-study-abroad-question', name: 'Do you want to study abroad?', category: 'abroad', kind: 'services',
    content: {
      eyebrow: 'Do you want to', heading: 'Study\n*abroad?*', sub: 'Do you want a\n*scholarship?*', body: 'Turn your plan into a strong application.', photo: 'travel', cta: 'Start your application', quote: 'Your global journey starts with {brand}',
      items: [
        { icon: 'school', title: 'University & course shortlist' }, { icon: 'pen', title: 'SOP & personal statement' }, { icon: 'doc', title: 'CV & recommendation letters' },
        { icon: 'money', title: 'Scholarship applications' }, { icon: 'translate', title: 'IELTS / PTE guidance' }, { icon: 'plane', title: 'Visa documentation' }, { icon: 'chat', title: 'Mock interviews' },
      ],
    },
  }, publishQ(V2)),
  entry(29, {
    id: 'studio-turnitin-check', name: 'Turnitin similarity check', category: 'editing', kind: 'offer',
    content: {
      quote: 'Check before you submit', heading: 'Turnitin', sub: 'Similarity Check', eyebrow: 'Ensure the originality of your work.', body: 'Get your document checked through Turnitin and receive a detailed similarity report.', photo: 'laptop',
      items: [{ icon: 'book', title: 'Thesis & Dissertation' }, { icon: 'doc', title: 'Research Papers & Manuscripts' }, { icon: 'pen', title: 'Research Proposals' }, { icon: 'cap', title: 'Academic Projects' }, { icon: 'list', title: 'Assignments & Reports' }],
      numberLabel: 'What you will receive', bullets: ['Turnitin similarity report', 'Overall similarity percentage', 'Source identification', 'Detailed report', 'Guidance on reducing similarity (if needed)'],
      number: '12%', person: { name: 'Overall similarity', role: 'Similarity Report' }, badge: 'Submit with confidence',
    },
  }, similarity(V1)),
  entry(29, {
    id: 'studio-ai-check', name: 'AI content check', category: 'editing', kind: 'offer',
    content: {
      quote: 'Human-written, proven', heading: 'AI Check', sub: 'Content Detection', eyebrow: 'Make sure your writing reads as your own.', body: 'We scan your document for AI-generated text and help you rewrite flagged sections.', photo: 'online',
      items: [{ icon: 'book', title: 'Theses' }, { icon: 'doc', title: 'Journal Articles' }, { icon: 'pen', title: 'Essays & SOPs' }, { icon: 'list', title: 'Assignments' }, { icon: 'briefcase', title: 'Reports' }],
      numberLabel: 'What you will receive', bullets: ['AI-detection report', 'Flagged passages highlighted', 'Rewrite suggestions', 'Similarity check included', 'Final re-scan'],
      number: '0%', person: { name: 'AI-generated text', role: 'Detection Report' }, badge: '100% human',
    },
  }, similarity(V2)),
  entry(30, {
    id: 'studio-research-easier', name: 'Research made easier', category: 'brand', kind: 'services',
    content: {
      heading: 'Research Made Easier.\n*Results Made Stronger.*', sub: 'Got a research idea but feeling stuck? We help you turn it into meaningful, impactful research.', photo: 'reader',
      items: [
        { icon: 'bulb', title: 'Research Topic Selection', text: 'Find the right direction for your research.' },
        { icon: 'doc', title: 'Proposal & Methodology', text: 'Well-structured and research-focused.' },
        { icon: 'book', title: 'Literature & Systematic Review', text: 'Comprehensive and up to date.' },
        { icon: 'cap', title: 'Thesis & Dissertation Support', text: 'Guidance at every step.' },
        { icon: 'bars', title: 'Data Analysis', text: 'SPSS · R · Python · Excel · NVivo' },
        { icon: 'pen', title: 'Editing & Proofreading', text: 'Clear, accurate and professional.' },
        { icon: 'mail', title: 'Paper & Publication Support', text: 'From manuscript to submission.' },
        { icon: 'mic', title: 'Defence & Presentation', text: 'Be confident, be ready.' },
        { icon: 'users', title: 'Experienced researchers' }, { icon: 'award', title: 'Original & quality-focused' }, { icon: 'clock', title: 'Timely assistance' }, { icon: 'target', title: 'Personalised guidance' },
      ],
      numberLabel: 'Why choose {brand}?', quote: 'From idea → research → analysis → publication', body: 'Your research deserves the right guidance.', cta: 'Let’s turn your ideas into impact',
    },
  }, easier(V1)),
  entry(30, {
    id: 'studio-analysis-easier', name: 'Analysis made easier', category: 'analysis', kind: 'services',
    content: {
      heading: 'Data Made Simple.\n*Findings Made Clear.*', sub: 'Have data but no clear results? We clean, analyse and explain it in plain language.', photo: 'analytics',
      items: [
        { icon: 'list', title: 'Data Cleaning & Coding', text: 'Ready-to-analyse datasets.' },
        { icon: 'pie', title: 'Descriptive Statistics', text: 'Tables and charts that tell a story.' },
        { icon: 'trend', title: 'Regression & Correlation', text: 'The right model for your question.' },
        { icon: 'layers', title: 'SEM, CFA & PLS', text: 'AMOS and SmartPLS models.' },
        { icon: 'chat', title: 'Qualitative Coding', text: 'NVivo themes and quotes.' },
        { icon: 'code', title: 'R & Python', text: 'Reproducible scripts included.' },
        { icon: 'doc', title: 'Results Chapter', text: 'Written interpretation.' },
        { icon: 'video', title: 'Walkthrough Call', text: 'Understand every number.' },
        { icon: 'users', title: 'Statisticians' }, { icon: 'fileCheck', title: 'Checked outputs' }, { icon: 'bolt', title: 'Fast turnaround' }, { icon: 'refresh', title: 'Free re-runs' },
      ],
      numberLabel: 'Why analysts pick {brand}', quote: 'Raw data → clean data → analysis → insight', body: 'Numbers you can defend in your viva.', cta: 'Send your dataset',
    },
  }, easier(V2)),
  entry(31, {
    id: 'studio-stairs-success', name: 'Steps to success', category: 'trust', kind: 'steps',
    content: {
      eyebrow: 'From ideas to impact', heading: 'Struggling with your\n*Thesis, Dissertation,* or\n*Research Project?*', sub: 'We provide expert support for:', photo: 'campus', cta: 'Get expert help today', quote: 'Let’s turn your ideas into impact!',
      items: [
        { icon: 'bulb', title: 'Topic Selection' }, { icon: 'doc', title: 'Proposal Writing' }, { icon: 'bars', title: 'Data Analysis' }, { icon: 'book', title: 'Thesis Writing' }, { icon: 'pen', title: 'Research Papers' },
        { icon: 'users', title: 'Expert Researchers' }, { icon: 'shield', title: '100% Original' }, { icon: 'clock', title: 'On-Time Delivery' }, { icon: 'chat', title: '24/7 Support' },
        { icon: 'school', title: 'Students' }, { icon: 'search', title: 'Researchers' }, { icon: 'briefcase', title: 'Professionals' }, { icon: 'award', title: 'Institutions' },
      ],
    },
  }, stairs(V1)),
  entry(31, {
    id: 'studio-stairs-training', name: 'Level up your research skills', category: 'training', kind: 'steps',
    content: {
      eyebrow: 'Learn by doing', heading: 'Level up your\n*research skills*\nwith *live workshops*', sub: 'Hands-on training in:', photo: 'seminar', cta: 'Join the next batch', quote: 'Learn it once, use it forever!',
      items: [
        { icon: 'bars', title: 'SPSS' }, { icon: 'code', title: 'R Studio' }, { icon: 'layers', title: 'SmartPLS' }, { icon: 'chat', title: 'NVivo' }, { icon: 'pen', title: 'Academic Writing' },
        { icon: 'video', title: 'Live Classes' }, { icon: 'doc', title: 'Practice Data' }, { icon: 'award', title: 'Certificate' }, { icon: 'refresh', title: 'Recordings' },
        { icon: 'school', title: 'Students' }, { icon: 'search', title: 'Researchers' }, { icon: 'briefcase', title: 'Faculty' }, { icon: 'users', title: 'NGO Staff' },
      ],
    },
  }, stairs(V2)),
];
