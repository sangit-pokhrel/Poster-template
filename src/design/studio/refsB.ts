/**
 * Studio designs from references 9–17 (Nepal Scholar and Thesis Companion posters): two variations each.
 */
import type { AdContent } from '../../types/template';
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
  seal,
  soft,
  sub,
} from './kit';
import type { StudioEntry, Tone, Variant } from './kit';

const clearOf = (t: Tone) => (t === 'dark' ? 'brand.primary/0' : 'rgba(255, 255, 255, 0)');
const baseOf = (t: Tone) => (t === 'dark' ? D : WHITE);

/* 9 · "Struggling with your thesis?" — condensed headline, degree tabs, service box, portrait + quote card */
const struggling = (v: Variant) => (c: AdContent) => {
  const bg = baseOf(v.tone);
  const tabs = (c.bullets ?? []).slice(0, 3);
  const x0 = mx(v.flip, 60, 620);
  return layout(
    v.tone === 'dark' ? D : linear(90, [0, '#ffffff'], [1, PAPER]),
    photo(photoSrc(c.photo, 'portraitWoman2'), P(mx(v.flip, 620, 460), 150, 460, 1100), { overlay: linear(v.flip ? 180 : 0, [0, bg], [0.3, clearOf(v.tone)]) }),
    brandHeader(v.tone, x0, 40, { w: 440, h: 104 }),
    headline(c.heading, P(x0, 170, 620, 270), { tone: v.tone, font: 'cond', size: 72, upper: true, lh: 1.04 }),
    sub(c, P(x0, 450, 580, 70), { tone: v.tone, size: 24, weight: 600, color: fg(v.tone) }),
    tabs.flatMap((t, i) => chip(`tab-${i + 1}`, t, P(x0 + i * 196, 530, 184, 54), v.tone === 'dark' ? 'accent' : 'dark', { size: 20 })),
    panel('services-box', P(x0, 610, 380, 420), v.tone === 'dark' ? 'rgba(255, 255, 255, 0.08)' : WHITE, 16, { stroke: v.tone === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'brand.ink/12', shadow: v.tone !== 'dark', name: 'Services box' }),
    para('services-title', 'label', c.eyebrow, P(x0 + 24, 626, 330, 44), { tone: v.tone, size: 22, weight: 800, upper: true, ls: 2, color: v.tone === 'dark' ? A : POP }, 'Box title'),
    iconList(c.items, { x: x0 + 24, y: 676, w: 340, h: 340 }, { tone: v.tone, icon: 'ring', titleSize: 21, iconSize: 46, max: 5 }),
    panel('message-card', P(x0 + 400, 610, 220, 420), v.tone === 'dark' ? A : D, 16, { name: 'Message card' }),
    icon('message-icon', P(x0 + 470, 650, 80, 80), { name: 'chat', color: v.tone === 'dark' ? A : D, bg: WHITE, bgShape: 'circle', strokeWidth: 2 }, { name: 'Icon' }),
    para('message', 'label', c.numberLabel, P(x0 + 420, 750, 180, 120), { tone: v.tone === 'dark' ? 'light' : 'dark', size: 22, weight: 700, align: 'center', color: v.tone === 'dark' ? INK : WHITE }, 'Card text'),
    para('message-phone', 'label', '{phone}', P(x0 + 410, 900, 200, 90), { tone: 'dark', font: 'heavy', size: 26, weight: 800, align: 'center', vAlign: 'middle', color: v.tone === 'dark' ? INK : A }, 'Card phone'),
    para('why-title', 'label', c.body, P(x0, 1052, 620, 40), { tone: v.tone, size: 20, weight: 800, upper: true, ls: 2, color: fg(v.tone) }, 'Row title'),
    iconRow((c.items ?? []).slice(5), { x: x0, y: 1100, w: 620, h: 130 }, { tone: v.tone, icon: 'circle', size: 18, from: 5, max: 4 }),
    panel('quote-card', P(mx(v.flip, 780, 280), 1000, 280, 180), v.tone === 'dark' ? WHITE : D, 20, { shadow: true, name: 'Quote card' }),
    para('quote', 'quote', c.quote, P(mx(v.flip, 800, 240), 1016, 240, 150), { tone: v.tone === 'dark' ? 'light' : 'dark', font: 'heavy', size: 28, weight: 800, align: 'center', vAlign: 'middle', color: v.tone === 'dark' ? D : WHITE }),
    footerBar(v.tone, { y: 1250, h: 100, fields: ['phone', 'email'] }),
  );
};

/* 10 · "Special offer" — framed card, offer banner, phone mock-up with floating chips */
const phoneOffer = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const card = dark ? D : WHITE;
  const chips = (c.bullets ?? []).slice(0, 2);
  const sides = [mx(v.flip, 90, 270), mx(v.flip, 720, 280)];
  return layout(
    dark ? linear(160, [0, INK], [1, D]) : linear(160, [0, PAPER], [1, '#ffffff']),
    blob('blob-1', P(-200, -200, 600, 600), dark ? 'rgba(255, 255, 255, 0.05)' : 'brand.accent/25'),
    blob('blob-2', P(700, 1000, 600, 600), dark ? 'rgba(255, 255, 255, 0.05)' : 'brand.secondary/15'),
    panel('frame', P(40, 40, 1000, 1270), card, 40, { shadow: true, ...(dark ? { stroke: 'rgba(255, 255, 255, 0.12)' } : {}), name: 'Frame' }),
    brandHeader(v.tone, 80, 70, { w: 320, h: 70 }),
    panel('banner', P(80, 162, 920, 100), dark ? A : D, 24, { name: 'Banner' }),
    headline(c.eyebrow, P(100, 162, 880, 100), { tone: 'dark', size: 46, weight: 900, color: dark ? INK : A, align: 'center', vAlign: 'middle', ls: -0.5 }, 'eyebrow', 'subheading'),
    para('lead', 'label', c.sub, P(80, 288, 920, 56), { tone: v.tone, size: 38, weight: 500, align: 'center', color: fg(v.tone) }, 'Lead-in'),
    headline(c.heading, P(80, 344, 920, 90), { tone: v.tone, size: 66, weight: 900, align: 'center', color: dark ? WHITE : D }),
    panel('mock-bg', P(320, 520, 440, 400), dark ? M : M, 40, { name: 'Backdrop' }),
    panel('mock', P(385, 460, 310, 560), INK, 54, { shadow: true, name: 'Phone' }),
    photo(photoSrc(c.photo, 'portraitWoman'), P(401, 478, 278, 524), { radius: 42 }),
    chips.flatMap((t, i) => [
      panel(`float-${i + 1}`, P(sides[i] ?? 90, i === 0 ? 560 : 780, i === 0 ? 270 : 280, 96), WHITE, 18, { shadow: true, name: 'Floating chip' }),
      ...para(`float-${i + 1}-text`, 'label', t, P((sides[i] ?? 90) + 14, i === 0 ? 566 : 786, i === 0 ? 242 : 252, 84), { tone: 'light', size: 20, weight: 700, align: 'center', vAlign: 'middle', color: INK }, 'Chip text'),
    ]),
    chip('badge', c.badge, P(mx(v.flip, 835, 230), 580, 230, 76), dark ? 'accent' : 'mid', { size: 34, font: 'heavy', rotation: -90, role: 'badge' }),
    para('body', 'body', c.body, P(80, 1050, 920, 56), { tone: v.tone, size: 32, weight: 800, align: 'center', color: fg(v.tone) }),
    para('list', 'body', c.items?.map((i) => i.title).join('   •   '), P(80, 1106, 920, 44), { tone: v.tone, size: 22, weight: 500, align: 'center' }, 'Services line'),
    cta(c.cta, P(240, 1164, 290, 68), dark ? 'accent' : 'mid', { arrow: false, size: 22 }),
    chip('cta-2', c.where, P(550, 1164, 290, 68), dark ? 'white' : 'dark', { size: 22 }),
    contactRow({ x: 90, y: 1246, w: 900, h: 46 }, { tone: v.tone, fields: ['phone', 'email', 'website'], size: 16 }),
  );
};

/* 11 · "Specialised services across degrees" — two-column service index, graduate photo, why-us boxes, number bar */
const specialised = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const list = (c.bullets ?? []).slice(0, 10);
  const lx = mx(v.flip, 60, 560);
  const degrees = (c.sub ?? '').split(' · ').slice(0, 3);
  return layout(
    dark ? D : linear(180, [0, '#ffffff'], [1, PAPER]),
    headline(c.heading, P(mx(v.flip, 60, 760), 56, 760, 80), { tone: v.tone, size: 54, weight: 900, color: dark ? WHITE : M }),
    chip('eyebrow', c.eyebrow, P(mx(v.flip, 60, 380), 142, 380, 78), dark ? 'accent' : 'dark', { size: 42, font: 'heavy', square: true }),
    logo(P(mx(v.flip, 880, 150), 50, 150, 110), { variant: 'mark', tone: dark ? 'light' : 'dark', align: v.flip ? 'left' : 'right' }),
    degrees.flatMap((d, i) => [
      shape(`degree-${i + 1}-rule`, P(lx + i * 190, 256, 176, 3), { fill: dark ? A : D }, { name: 'Rule' }),
      ...para(`degree-${i + 1}`, 'label', d, P(lx + i * 190, 266, 176, 64), { tone: v.tone, size: 19, weight: 700, color: fg(v.tone), lh: 1.2 }, `Degree ${i + 1}`),
    ]),
    list.flatMap((t, i) => {
      const x = lx + (i % 2) * 280;
      const y = 360 + Math.floor(i / 2) * 76;
      return [
        shape(`service-${i + 1}-bar`, P(x, y + 4, 5, 52), { fill: dark ? A : POP }, { name: 'Bar' }),
        ...para(`service-${i + 1}`, 'label', t, P(x + 18, y, 250, 60), { tone: v.tone, size: 22, weight: 600, color: fg(v.tone), vAlign: 'middle', lh: 1.15 }, `Service ${i + 1}`),
      ];
    }),
    panel('photo-bg', P(mx(v.flip, 700, 320), 330, 320, 460), dark ? M : D, 24, { name: 'Backdrop' }),
    photo(photoSrc(c.photo, 'graduation'), P(mx(v.flip, 660, 360), 250, 360, 540), { shape: 'arch', shadow: true }),
    para('why-title', 'label', c.body, P(60, 820, 960, 50), { tone: v.tone, font: 'heavy', size: 30, weight: 800, upper: true, ls: 4, color: fg(v.tone), align: 'center' }, 'Section title'),
    itemGrid(c.items, { x: 60, y: 884, w: 960, h: 190 }, { cols: 3, tone: v.tone, card: 'outline', layout: 'row', icon: 'bare', titleSize: 22, iconSize: 42, gap: 16, radius: 10, max: 6 }),
    panel('number-bar', P(140, 1106, 800, 84), dark ? A : D, 14, { name: 'Number bar' }),
    shape('number-icon-bg', P(160, 1118, 60, 60), { kind: 'ellipse', fill: dark ? D : A }, { name: 'Icon disc', aspect: 1 }),
    icon('number-icon', P(170, 1128, 40, 40), { name: 'phone', color: dark ? A : D, bg: null }, { name: 'Icon', showIf: 'phone' }),
    para('number', 'label', '{phone}', P(240, 1106, 680, 84), { tone: 'dark', font: 'heavy', size: 40, weight: 800, align: 'center', vAlign: 'middle', color: dark ? INK : WHITE }, 'Phone'),
    contactRow({ x: 160, y: 1216, w: 760, h: 58 }, { tone: v.tone, fields: ['email', 'website'], size: 20 }),
  );
};

/* 12 · "What we help you with" — centred serif headline, 2 × 3 service cards, CTA + photo */
const helpWith = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  return layout(
    dark ? linear(170, [0, D], [1, INK]) : WHITE,
    brandHeader(v.tone, 60, 44),
    cornerTag('Your research\njourney\nour support', P(440, 50, 210, 86), v.tone, 'tag-1'),
    cornerTag('Ideas\nAnalysis\nWriting\nSuccess', P(860, 50, 180, 86), v.tone),
    headline(c.heading, P(60, 170, 960, 230), { tone: v.tone, font: 'serif', size: 100, weight: 800, lh: 1.0, align: 'center', color: dark ? WHITE : INK, hlColor: dark ? A : M }),
    itemGrid(c.items, { x: 60, y: 430, w: 960, h: 480 }, { cols: 2, tone: v.tone, card: dark ? 'glass' : 'white', layout: 'row', icon: 'bare', iconSize: 76, titleSize: 30, titleFont: 'serif', textSize: 18, gap: 18, radius: 14, max: 6 }),
    shape('rule-l', P(60, 958, 150, 2), { fill: soft(v.tone, 30) }, { name: 'Hairline' }),
    shape('rule-r', P(870, 958, 150, 2), { fill: soft(v.tone, 30) }, { name: 'Hairline' }),
    para('body', 'body', c.body, P(220, 930, 640, 64), { tone: v.tone, font: 'serif', size: 23, align: 'center', vAlign: 'middle' }),
    cta(c.cta, P(mx(v.flip, 60, 560), 1030, 560, 80), dark ? 'accent' : 'mid', { size: 24 }),
    photo(photoSrc(c.photo, 'books'), P(mx(v.flip, 680, 340), 1010, 340, 210), { radius: 20, shadow: true }),
    shape('footer-rule', P(60, 1246, 960, 2), { fill: soft(v.tone, 20) }, { name: 'Hairline' }),
    contactRow({ x: 60, y: 1262, w: 960, h: 64 }, { tone: v.tone, fields: ['phone', 'email', 'address'] }),
  );
};

/* 13 · "Before the viva" — full-bleed photo under a dark wash, white feature cards */
const vivaPhoto = (v: Variant) => (c: AdContent) => {
  const tx = mx(v.flip, 60, 620);
  const align = v.flip ? 'right' : 'left';
  return layout(
    D,
    photo(photoSrc(c.photo, 'seminar'), P(0, 0, 1080, 1350), { overlay: linear(v.flip ? 180 : 0, [0, 'brand.primary/96'], [0.5, 'brand.primary/70'], [1, 'brand.primary/15']) }),
    shape('wash', P(0, 700, 1080, 650), { fill: linear(90, [0, 'brand.primary/0'], [0.45, D], [1, D]) }, { name: 'Wash' }),
    brandHeader('dark', tx, 50, { align }),
    headline(c.heading, P(tx, 190, 620, 330), { tone: 'dark', font: 'serif', size: 86, weight: 800, lh: 1.02, align }),
    shape('accent-rule', P(tx + (v.flip ? 520 : 0), 530, 100, 6), { fill: A }, { name: 'Accent rule' }),
    sub(c, P(tx, 560, 560, 110), { tone: 'dark', size: 25, align }),
    itemGrid(c.items, { x: 60, y: 780, w: 960, h: 270 }, { cols: 3, tone: 'dark', card: v.flip ? 'glass' : 'white', layout: 'stack', icon: 'soft', titleSize: 25, textSize: 17, gap: 20, radius: 14, max: 3 }),
    para('quote', 'quote', c.quote, P(60, 1078, 960, 56), { tone: 'dark', font: 'serif', size: 34, weight: 600, align: 'center', color: WHITE }),
    para('eyebrow', 'label', c.eyebrow, P(60, 1140, 960, 30), { tone: 'dark', size: 16, weight: 700, upper: true, ls: 5, align: 'center', color: A }, 'Small caps'),
    cta(c.cta, P(380, 1182, 320, 68), 'accent', { upper: true, size: 20 }),
    shape('footer-rule', P(60, 1272, 960, 2), { fill: 'rgba(255, 255, 255, 0.25)' }, { name: 'Hairline' }),
    contactRow({ x: 60, y: 1284, w: 960, h: 52 }, { tone: 'dark', fields: ['phone', 'email', 'address'], size: 18 }),
  );
};

/* 14 · "Explained clearly" — half-page photo, serif headline, insight card, icon row, square CTA */
const explained = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 560, 480);
  return layout(
    dark ? D : WHITE,
    photo(photoSrc(c.photo, 'notes'), P(mx(v.flip, 0, 500), 0, 500, 1350), { overlay: linear(v.flip ? 180 : 0, [0.7, 'rgba(0, 0, 0, 0)'], [1, 'rgba(0, 0, 0, 0.25)']) }),
    brandHeader(v.tone, x, 60),
    headline(c.heading, P(x, 200, 480, 250), { tone: v.tone, font: 'serif', size: 70, weight: 800, lh: 1.04, color: dark ? WHITE : INK, hlColor: dark ? A : M }),
    para('body', 'body', c.body, P(x, 470, 470, 110), { tone: v.tone, size: 22, lh: 1.45 }),
    panel('insight-card', P(x, 600, 470, 270), dark ? 'rgba(255, 255, 255, 0.08)' : PAPER, 20, { stroke: dark ? 'rgba(255, 255, 255, 0.18)' : 'brand.ink/10', name: 'Insight card' }),
    photo(photoSrc(c.person?.photo, 'analytics'), P(x + 20, 620, 230, 230), { radius: 14 }, 'photo2'),
    icon('insight-arrow', P(x + 262, 710, 40, 40), { name: 'arrow', color: dark ? A : M, bg: null }, { name: 'Arrow' }),
    para('insight-title', 'label', c.eyebrow, P(x + 310, 630, 150, 40), { tone: v.tone, size: 20, weight: 800, color: fg(v.tone) }, 'Card title'),
    para('quote', 'quote', c.quote, P(x + 310, 676, 150, 180), { tone: v.tone, size: 18, lh: 1.35 }),
    iconRow(c.items, { x, y: 900, w: 470, h: 130 }, { tone: v.tone, icon: 'bare', size: 17, max: 4 }),
    cta(c.cta, P(x, 1070, 470, 84), dark ? 'accent' : 'dark', { upper: true, size: 20, square: true }),
    contactRow({ x, y: 1210, w: 470, h: 90 }, { tone: v.tone, fields: ['phone', 'email'], size: 17, widths: [0.8, 1.4] }),
  );
};

/* 15 · "Stress starts here" — big photo, pinned checklist card, white feature band with phone */
const stress = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const x = mx(v.flip, 60, 640);
  return layout(
    dark ? D : WHITE,
    photo(photoSrc(c.photo, 'studying'), P(mx(v.flip, 360, 720), 0, 720, 1060), { overlay: linear(v.flip ? 180 : 0, [0, dark ? D : WHITE], [0.55, clearOf(v.tone)]) }),
    brandHeader(v.tone, x, 50),
    headline(c.heading, P(x, 170, 640, 200), { tone: v.tone, size: 78, lh: 1.02 }),
    sub(c, P(x, 380, 480, 90), { tone: v.tone, size: 25, weight: 500 }),
    panel('check-card', P(x, 500, 400, 440), WHITE, 12, { shadow: true, stroke: 'brand.ink/10', rotation: v.flip ? 2 : -2, name: 'Checklist card' }),
    script('card-title', c.eyebrow, P(x + 30, 518, 340, 80), M, 44, v.flip ? 2 : -2),
    bullets(c.bullets, P(x + 34, 606, 330, 310), { tone: 'light', size: 24, weight: 500, color: INK, bulletColor: POP, lh: 1.5 }),
    panel('band', P(0, 1060, 1080, 290), dark ? WHITE : PAPER, 0, { name: 'Feature band' }),
    iconRow(c.items, { x: 40, y: 1096, w: 640, h: 150 }, { tone: 'light', icon: 'ring', size: 19, max: 4 }),
    shape('band-rule', P(700, 1100, 2, 140), { fill: 'brand.ink/15' }, { name: 'Divider' }),
    icon('phone-icon', P(730, 1136, 64, 64), { name: 'phone', color: WHITE, bg: D, bgShape: 'circle', strokeWidth: 2 }, { name: 'Icon', showIf: 'phone' }),
    para('phone', 'label', '{phone}', P(806, 1126, 260, 84), { tone: 'light', font: 'heavy', size: 34, weight: 800, vAlign: 'middle', color: D }, 'Phone'),
    contactRow({ x: 60, y: 1268, w: 960, h: 56 }, { tone: 'light', fields: ['email', 'address'], size: 19 }),
  );
};

/* 16 · "ACADEMIC" — bold campaign poster: colour field, contrast band, rotated tags */
const campaign = (v: Variant) => (c: AdContent) => {
  const field = v.tone === 'dark' ? D : M;
  const band = v.tone === 'dark' ? M : A;
  const bandText = v.tone === 'dark' ? WHITE : INK;
  const tags = (c.bullets ?? []).slice(0, 4);
  const spots: Array<[number, number, number]> = [
    [mx(v.flip, 560, 250), 238, -6],
    [mx(v.flip, 720, 260), 1010, 5],
    [mx(v.flip, 60, 280), 1020, -5],
    [mx(v.flip, 390, 260), 1120, -3],
  ];
  return layout(
    field,
    shape('grid', P(0, 0, 1080, 1350), { kind: 'grid', fill: 'rgba(255, 255, 255, 0.06)' }, { name: 'Grid' }),
    panel('band', P(0, 520, 1080, 290), band, 0, { name: 'Band' }),
    shape('logo-disc', P(mx(v.flip, 60, 150), 40, 150, 150), { kind: 'ellipse', fill: WHITE, shadow: true }, { name: 'Logo disc', aspect: 1 }),
    logo(P(mx(v.flip, 82, 106), 62, 106, 106), { variant: 'mark', tone: 'dark', align: 'center' }, { aspect: 1 }),
    para('handle', 'label', '{handle}', P(mx(v.flip, 560, 460), 70, 460, 40), { tone: 'dark', size: 22, weight: 600, align: v.flip ? 'left' : 'right', color: 'rgba(255, 255, 255, 0.85)' }, 'Handle'),
    photo(photoSrc(c.photo, 'portraitWoman'), P(mx(v.flip, 40, 470), 230, 470, 470), { shape: 'circle', borderWidth: 10, borderColor: WHITE, shadow: true }),
    headline(c.heading, P(mx(v.flip, 460, 600), 330, 600, 180), { tone: 'dark', size: 150, italic: true, upper: true, ls: -4, align: v.flip ? 'left' : 'right', vAlign: 'bottom', shadow: true }),
    para('body', 'body', c.body, P(mx(v.flip, 540, 500), 540, 500, 250), { tone: 'dark', size: 26, weight: 600, align: v.flip ? 'left' : 'right', vAlign: 'middle', color: bandText }),
    headline(c.sub, P(40, 830, 1000, 150), { tone: 'dark', size: 108, upper: true, ls: -3, italic: true, shadow: true }, 'sub', 'subheading'),
    tags.flatMap((t, i) => {
      const [x, y, r] = spots[i] ?? [60, 1000, 0];
      return chip(`tag-${i + 1}`, t, P(x, y, 250, 72), i % 2 ? 'accent' : 'white', { size: 28, font: 'heavy', rotation: r, square: true });
    }),
    cta(c.cta, P(40, 1236, 250, 70), 'white', { size: 22, upper: true, square: true }),
    contactRow({ x: 320, y: 1240, w: 720, h: 62 }, { tone: 'dark', fields: ['phone', 'email'], size: 20 }),
  );
};

/* 17 · "Stuck on your thesis?" — big circle with photo, logo disc, starburst, script headline */
const circleStuck = (v: Variant) => (c: AdContent) => {
  const dark = v.tone === 'dark';
  const list = c.bullets ?? [];
  const half = Math.ceil(list.length / 2);
  const circleFill = dark ? WHITE : D;
  return layout(
    dark ? D : PAPER,
    shape('circle', P(mx(v.flip, 360, 940), -260, 940, 940), { kind: 'ellipse', fill: circleFill }, { name: 'Circle', aspect: 1 }),
    shape('dot', P(mx(v.flip, 84, 24), 96, 24, 24), { kind: 'ellipse', fill: dark ? WHITE : D }, { name: 'Dot', aspect: 1 }),
    photo(photoSrc(c.photo, 'team'), P(mx(v.flip, 420, 440), 40, 440, 440), { shape: 'circle', borderWidth: 8, borderColor: dark ? D : WHITE }),
    shape('logo-disc', P(mx(v.flip, 740, 300), 380, 300, 300), { kind: 'ellipse', fill: WHITE, shadow: true, stroke: dark ? D : A, strokeWidth: 6 }, { name: 'Logo disc', aspect: 1 }),
    logo(P(mx(v.flip, 780, 220), 430, 220, 200), { variant: 'full', tone: 'dark', align: 'center' }),
    seal(c.badge, P(mx(v.flip, 600, 200), 520, 200, 200), 'burst', A, INK, -12, 30),
    ...chip('brand-pill', '{brand}', P(mx(v.flip, 700, 340), 700, 340, 64), dark ? 'accent' : 'dark', { size: 24, upper: true, font: 'heavy' }),
    headline(c.heading, P(mx(v.flip, 60, 700), 760, 700, 130), { tone: v.tone, size: 112, upper: true, ls: -3, align: v.flip ? 'right' : 'left' }),
    headline(c.sub, P(mx(v.flip, 60, 700), 874, 700, 120), { tone: v.tone, font: 'script', size: 104, color: dark ? A : POP, align: v.flip ? 'right' : 'left' }, 'sub', 'subheading'),
    para('eyebrow', 'label', c.eyebrow, P(60, 1010, 600, 44), { tone: v.tone, size: 24, weight: 800, upper: true, ls: 2, color: fg(v.tone) }, 'List title'),
    bullets(list.slice(0, half), P(60, 1060, 440, 120), { tone: v.tone, size: 23, bullet: '✓', lh: 1.45 }),
    bullets(list.slice(half), P(510, 1060, 330, 120), { tone: v.tone, size: 23, bullet: '✓', lh: 1.45 }, 'list-2'),
    shape('bubble', P(820, 1000, 240, 240), { kind: 'ellipse', fill: M, shadow: true }, { name: 'Bubble', aspect: 1 }),
    para('body', 'body', c.body, P(846, 1030, 188, 180), { tone: 'dark', size: 18, weight: 600, align: 'center', vAlign: 'middle', color: WHITE }),
    panel('footer-pill', P(60, 1254, 960, 76), dark ? M : D, 38, { name: 'Footer pill' }),
    contactRow({ x: 100, y: 1262, w: 880, h: 60 }, { tone: 'dark', fields: ['phone', 'email'], size: 20 }),
  );
};

export const REFS_B: StudioEntry[] = [
  entry(9, {
    id: 'studio-struggling-thesis', name: 'Struggling with your thesis?', category: 'thesis', kind: 'services',
    content: {
      heading: 'Struggling with your\n*Thesis, Dissertation*\nor *Research Project?*', sub: 'We are here to help you achieve academic excellence!', eyebrow: 'Our services',
      bullets: ['Bachelor’s', 'Master’s', 'Ph.D.'], numberLabel: 'Message us for a free consultation', body: 'Why choose {brand}?', quote: 'Your success is our priority!', photo: 'portraitWoman2',
      items: [
        { icon: 'search', title: 'Topic Selection' }, { icon: 'pen', title: 'Proposal Writing' }, { icon: 'bars', title: 'Data Analysis' },
        { icon: 'book', title: 'Thesis & Dissertation' }, { icon: 'doc', title: 'Research Paper Writing' },
        { icon: 'users', title: 'Expert Researchers' }, { icon: 'award', title: '100% Original' }, { icon: 'clock', title: 'On-Time Delivery' }, { icon: 'chat', title: '24/7 Support' },
      ],
    },
  }, struggling(V1)),
  entry(9, {
    id: 'studio-struggling-assignment', name: 'Struggling with assignments?', category: 'assignments', kind: 'services',
    content: {
      heading: 'Too many\n*Assignments,*\n*Reports & Projects?*', sub: 'Get them done right — without the all-nighters.', eyebrow: 'We handle',
      bullets: ['+2 & Diploma', 'Bachelor’s', 'Master’s'], numberLabel: 'Send your brief — get a quote in minutes', body: 'Why students trust {brand}', quote: 'Better grades, less stress.', photo: 'portraitMan2',
      items: [
        { icon: 'doc', title: 'Assignments' }, { icon: 'briefcase', title: 'Internship Reports' }, { icon: 'list', title: 'Case Studies' },
        { icon: 'layers', title: 'Presentations' }, { icon: 'code', title: 'Project Reports' },
        { icon: 'shield', title: 'Plagiarism-Free' }, { icon: 'clock', title: 'Fast Delivery' }, { icon: 'money', title: 'Student Price' }, { icon: 'refresh', title: 'Free Revisions' },
      ],
    },
  }, struggling(V2)),
  entry(10, {
    id: 'studio-new-year-offer', name: 'New Year special offer', category: 'offers', kind: 'offer',
    content: {
      eyebrow: '🎉 New Year Special – 20% OFF', sub: 'Instant Help With', heading: 'Thesis & Dissertation', badge: '20% OFF', photo: 'portraitWoman',
      bullets: ['Highly recommended by students', 'Plagiarism-free & on-time delivery'],
      body: 'Get Premium Academic Writing Support',
      items: [{ icon: 'doc', title: 'Bachelor’s Assignments' }, { icon: 'book', title: 'Master’s Thesis' }, { icon: 'cap', title: 'PhD Dissertation' }],
      cta: 'Contact Now', where: 'Visit Page',
    },
  }, phoneOffer(V1)),
  entry(10, {
    id: 'studio-festival-offer', name: 'Festival offer — phone mock-up', category: 'offers', kind: 'offer',
    content: {
      eyebrow: '🪔 Dashain & Tihar Offer – 25% OFF', sub: 'This festive season, finish your', heading: 'Research & Reports', badge: '25% OFF', photo: 'portraitMan',
      bullets: ['Trusted by 1,000+ students', 'Free plagiarism report included'],
      body: 'Book before the festival ends',
      items: [{ icon: 'pen', title: 'Proposals' }, { icon: 'bars', title: 'Data Analysis' }, { icon: 'fileCheck', title: 'Editing' }],
      cta: 'Book Now', where: 'Message Us',
    },
  }, phoneOffer(V2)),
  entry(11, {
    id: 'studio-specialised-services', name: 'Specialised services index', category: 'brand', kind: 'services',
    content: {
      heading: 'Our Specialised Services', eyebrow: 'Across Degrees', sub: 'Bachelor’s Writing Services · Master’s Writing · Ph.D. Research Services', photo: 'graduation',
      bullets: ['Topic Selection', 'Proposal Writing', 'Research Paper Writing', 'Review Paper Writing', 'Literature Review', 'Thesis Writing', 'Data Analysis', 'Plagiarism Removal', 'Proofreading', 'Implementation'],
      body: 'Why choose us',
      items: [
        { icon: 'clock', title: 'On-time Delivery' }, { icon: 'money', title: 'Value for Money' }, { icon: 'award', title: 'Subject Matter Experts' },
        { icon: 'star', title: '100% Satisfaction' }, { icon: 'shield', title: '100% Plagiarism Free' }, { icon: 'chat', title: '24/7 Support' },
      ],
    },
  }, specialised(V1)),
  entry(11, {
    id: 'studio-analysis-menu', name: 'Data analysis menu', category: 'analysis', kind: 'services',
    content: {
      heading: 'Data Analysis Services', eyebrow: 'Every Method', sub: 'Quantitative · Qualitative · Mixed Methods', photo: 'analytics',
      bullets: ['SPSS', 'STATA', 'R Programming', 'Python', 'AMOS & SEM', 'SmartPLS', 'NVivo', 'Excel Dashboards', 'Meta-analysis', 'Result Writing'],
      body: 'What you get',
      items: [
        { icon: 'fileCheck', title: 'Clean Output Tables' }, { icon: 'bars', title: 'Charts & Figures' }, { icon: 'doc', title: 'Written Interpretation' },
        { icon: 'video', title: 'Walkthrough Call' }, { icon: 'code', title: 'Syntax / Code Files' }, { icon: 'refresh', title: 'Free Re-runs' },
      ],
    },
  }, specialised(V2)),
  entry(12, {
    id: 'studio-what-we-help', name: 'What we help you with', category: 'brand', kind: 'services',
    content: {
      heading: 'What We Help\n*You With*', body: 'From project structure to final preparation, get guidance where you need it.', cta: 'Send us a message to discuss your project', photo: 'books',
      items: [
        { icon: 'search', title: 'Data Collection', text: 'Guidance on data sources, tools and collection methods.' },
        { icon: 'bars', title: 'Data Analysis', text: 'Statistical analysis, visualisation and interpretation.' },
        { icon: 'doc', title: 'Layout & Formatting', text: 'Formatting to university guidelines (APA, Harvard…).' },
        { icon: 'pen', title: 'Report Assistance', text: 'Support in writing, structuring and improving reports.' },
        { icon: 'mic', title: 'Viva & Defence Prep', text: 'Presentations, likely questions and mock practice.' },
        { icon: 'cap', title: 'Research Support', text: 'Topic, methodology and literature review guidance.' },
      ],
    },
  }, helpWith(V1)),
  entry(12, {
    id: 'studio-what-we-train', name: 'What you will learn', category: 'training', kind: 'services',
    content: {
      heading: 'What You Will\n*Learn With Us*', body: 'Hands-on sessions with real datasets — small batches, certificate included.', cta: 'Reserve your seat', photo: 'seminar',
      items: [
        { icon: 'bars', title: 'SPSS Basics', text: 'Data entry, cleaning and descriptive statistics.' },
        { icon: 'trend', title: 'Regression', text: 'Linear and logistic models, step by step.' },
        { icon: 'code', title: 'R for Research', text: 'From scripts to publication-ready plots.' },
        { icon: 'search', title: 'Literature Search', text: 'Scopus, Google Scholar and reference managers.' },
        { icon: 'pen', title: 'Academic Writing', text: 'Structure, argument and citation style.' },
        { icon: 'award', title: 'Certificate', text: 'A certificate of completion for every learner.' },
      ],
    },
  }, helpWith(V2)),
  entry(13, {
    id: 'studio-viva-ready', name: 'Before the viva', category: 'thesis', kind: 'hero',
    content: {
      heading: 'Before the Viva,\n*Know Your Research.*', sub: 'Get expert support to present your research with clarity and confidence.', photo: 'seminar',
      items: [
        { icon: 'doc', title: 'Explain your methodology', text: 'Present your approach clearly and logically.' },
        { icon: 'bars', title: 'Defend your findings', text: 'Support your results with confidence.' },
        { icon: 'chat', title: 'Answer with confidence', text: 'Be ready for critical questions.' },
      ],
      quote: 'Preparation turns uncertainty into *confidence.*', eyebrow: 'Expert guidance for a stronger viva', cta: 'Contact us',
    },
  }, vivaPhoto(V1)),
  entry(13, {
    id: 'studio-conference-ready', name: 'Conference presentation', category: 'training', kind: 'event',
    content: {
      heading: 'Presenting at a\n*Conference?*', sub: 'Slides, script and rehearsal — so your 15 minutes land perfectly.', photo: 'conference',
      items: [
        { icon: 'layers', title: 'Slide design', text: 'Clear, academic, memorable slides.' },
        { icon: 'mic', title: 'Talk rehearsal', text: 'Timed practice with live feedback.' },
        { icon: 'chat', title: 'Q&A drills', text: 'Answer tough questions calmly.' },
      ],
      quote: 'Great research deserves a *great talk.*', eyebrow: 'Presentation coaching for researchers', cta: 'Book a session',
    },
  }, vivaPhoto(V2)),
  entry(14, {
    id: 'studio-explained-clearly', name: 'Your research, explained', category: 'analysis', kind: 'hero',
    content: {
      heading: 'Your Research,\n*Explained Clearly.*', body: 'Analysis is not just about producing numbers. It is about *understanding what they mean.*', photo: 'notes',
      person: { name: '', role: '', photo: 'analytics' }, eyebrow: 'Clear insight', quote: 'Higher rainfall during the growing season is linked with *increased crop yield.*',
      items: [{ icon: 'bars', title: 'Data Analysis' }, { icon: 'doc', title: 'Research Support' }, { icon: 'list', title: 'Formatting' }, { icon: 'cap', title: 'Viva Preparation' }],
      cta: 'Let’s start your journey',
    },
  }, explained(V1)),
  entry(14, {
    id: 'studio-literature-clearly', name: 'Literature review, organised', category: 'proposal', kind: 'hero',
    content: {
      heading: 'Hundreds of Papers,\n*One Clear Story.*', body: 'A literature review is not a summary. It is *an argument that leads to your gap.*', photo: 'library',
      person: { name: '', role: '', photo: 'reader' }, eyebrow: 'Research gap', quote: 'Few studies measure *long-term impact* in rural Nepal.',
      items: [{ icon: 'search', title: 'Search Strategy' }, { icon: 'layers', title: 'Synthesis Matrix' }, { icon: 'target', title: 'Gap Statement' }, { icon: 'book', title: 'Referencing' }],
      cta: 'Get your review organised',
    },
  }, explained(V2)),
  entry(15, {
    id: 'studio-stress-starts', name: 'Thesis stress starts here', category: 'thesis', kind: 'checklist',
    content: {
      heading: 'Thesis Stress\n*Starts Here.*', sub: 'You don’t have to figure out every step alone.', eyebrow: 'From confusion to clarity', photo: 'studying',
      bullets: ['Topic finalisation', 'Literature review', 'Methodology', 'Data analysis', 'Writing & formatting', 'Viva preparation'],
      items: [{ icon: 'book', title: 'Research Support' }, { icon: 'bars', title: 'Data Analysis' }, { icon: 'doc', title: 'Formatting' }, { icon: 'cap', title: 'Viva Prep' }],
    },
  }, stress(V1)),
  entry(15, {
    id: 'studio-exam-night', name: 'Late-night checklist', category: 'tips', kind: 'checklist',
    content: {
      heading: 'Before You\n*Hit Submit.*', sub: 'Run through this list — it saves marks every time.', eyebrow: 'Final checklist', photo: 'laptop',
      bullets: ['Title & abstract match', 'Every figure is cited', 'References in one style', 'Page numbers & margins', 'Similarity below limit', 'Supervisor sign-off'],
      items: [{ icon: 'fileCheck', title: 'Proofreading' }, { icon: 'shield', title: 'Plagiarism Check' }, { icon: 'list', title: 'Formatting' }, { icon: 'chat', title: 'Final Review' }],
    },
  }, stress(V2)),
  entry(16, {
    id: 'studio-academic-campaign', name: 'ACADEMIC — bold campaign', category: 'brand', kind: 'hero',
    content: {
      heading: 'Academic', sub: 'Research Support', photo: 'portraitWoman',
      body: 'Professional guidance from research planning through final documentation — thesis, dissertation, academic writing and data analysis.',
      bullets: ['Thesis Support', '100% Original', 'Expert Guidance', 'Data Analysis'], cta: 'Learn more',
    },
  }, campaign(V1)),
  entry(16, {
    id: 'studio-publish-campaign', name: 'PUBLISH — bold campaign', category: 'publication', kind: 'hero',
    content: {
      heading: 'Publish', sub: 'Your Research Now', photo: 'portraitMan2',
      body: 'Manuscript editing, journal selection and submission support for Scopus, Web of Science and UGC-listed journals.',
      bullets: ['Scopus Journals', 'Fast Review', 'Expert Editing', 'Cover Letter'], cta: 'Start today',
    },
  }, campaign(V2)),
  entry(17, {
    id: 'studio-stuck-circle', name: 'Stuck on your thesis? — circle', category: 'thesis', kind: 'services',
    content: {
      heading: 'Stuck on', sub: 'Your Thesis?', badge: 'Expert help', eyebrow: 'Our services:', photo: 'team',
      bullets: ['100% plagiarism-free', 'Thesis & research guidance', 'Data analysis support', 'Guaranteed on-time delivery'],
      body: 'Struggling with deadlines or research stress? Get expert help today!',
    },
  }, circleStuck(V1)),
  entry(17, {
    id: 'studio-proposal-circle', name: 'Need a proposal? — circle', category: 'proposal', kind: 'services',
    content: {
      heading: 'Need a', sub: 'Strong Proposal?', badge: 'Fast track', eyebrow: 'We cover:', photo: 'handshake',
      bullets: ['Problem statement', 'Objectives & questions', 'Methodology', 'Work plan & budget'],
      body: 'Get your proposal approved on the first submission.',
    },
  }, circleStuck(V2)),
];
