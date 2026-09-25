/**
 * Artova Research — "Gradient Tech".
 * Violet gradients with cyan/magenta glow orbs, faceted triangles echoing the
 * logo, frosted-glass cards, Space Grotesk headlines, cyan pill CTAs, icon
 * tiles, rounded photos with soft shadows. Light-paper variants for variety.
 */
import type { AdContent, AdKind, ElementSpec, Layout } from '../../types/template';
import { P, badge, glow, icon, image, linear, logo, markup, photoSrc, shape, text } from '../builders';

const VIOLET = 'brand.primary';
const MAGENTA = 'brand.secondary';
const CYAN = 'brand.accent';
const INK = 'brand.ink';
const PAPER = 'brand.paper';
const WHITE = '#ffffff';
const GLASS = 'rgba(255, 255, 255, 0.10)';
const GLASS_EDGE = 'rgba(255, 255, 255, 0.24)';

type Align = 'left' | 'center' | 'right';
type Tone = 'dark' | 'light';
type F = ReturnType<typeof P>;

const fg = (tone: Tone) => (tone === 'light' ? WHITE : INK);
const muted = (tone: Tone, a = 70) => (tone === 'light' ? `rgba(255, 255, 255, ${a / 100})` : `brand.ink/${a}`);

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */

const gradientBg = linear(135, [0, VIOLET], [1, MAGENTA]);
const deepBg = linear(160, [0, '#1a0640'], [1, VIOLET]);

const glows = (): ElementSpec[] => [
  shape('glow-cyan', P(560, -260, 760, 760), { kind: 'ellipse', fill: glow('rgba(34, 211, 238, 0.45)') }, { name: 'Glow', aspect: 1 }),
  shape('glow-pink', P(-300, 820, 760, 760), { kind: 'ellipse', fill: glow('rgba(236, 72, 153, 0.35)') }, { name: 'Glow', aspect: 1 }),
];

/** Faceted triangles that echo the Artova "A". */
const facets = (x = 640, y = 760, s = 520, a = 0.08): ElementSpec[] => [
  shape('facet-a', P(x, y, s, s * 0.8), { kind: 'polygon', fill: `rgba(255, 255, 255, ${a})`, points: [0.5, 0, 1, 1, 0, 0.78] }, { name: 'Facet' }),
  shape('facet-b', P(x + s * 0.28, y + s * 0.28, s * 0.62, s * 0.5), { kind: 'polygon', fill: `rgba(255, 255, 255, ${a * 1.4})`, points: [0.4, 0, 1, 1, 0, 0.72] }, { name: 'Facet' }),
];

const glass = (id: string, f: F, radius = 36): ElementSpec => shape(id, f, { fill: GLASS, stroke: GLASS_EDGE, strokeWidth: 2, radius }, { name: 'Glass card' });

const header = (tone: Tone): ElementSpec[] => [logo(P(60, 50, 330, 86), { variant: 'full', tone: tone === 'light' ? 'light' : 'dark' })];

const footer = (tone: Tone, y = 1250): ElementSpec[] => [
  shape('footer-pill', P(60, y, 960, 68), { fill: tone === 'light' ? GLASS : 'brand.primary/8', stroke: tone === 'light' ? GLASS_EDGE : null, strokeWidth: 2, radius: 34 }, { name: 'Footer pill' }),
  text('footer', 'footer', P(90, y, 900, 68), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, fontWeight: 500, color: muted(tone, 80), align: 'center', vAlign: 'middle' }, { name: 'Footer' }),
];

/* ------------------------------------------------------------------ */
/* Text slots                                                          */
/* ------------------------------------------------------------------ */

/** Eyebrow as a tinted pill; its frame sets the position. */
const eyebrow = (t: string | undefined, f: F, tone: Tone): ElementSpec[] =>
  t
    ? [
        badge('eyebrow', 'label', f, { text: t, style: 'pill', fill: tone === 'light' ? 'rgba(34, 211, 238, 0.18)' : 'brand.primary/10', color: tone === 'light' ? CYAN : VIOLET, fontSize: 22, fontWeight: 700, letterSpacing: 3 }, { name: 'Eyebrow' }),
      ]
    : [];

function heading(c: AdContent, f: F, o: { tone: Tone; size: number; align?: Align; vAlign?: 'top' | 'middle' | 'bottom' }): ElementSpec {
  const m = markup(c.heading ?? '');
  return text(
    'heading',
    'heading',
    f,
    {
      text: m.text,
      highlights: m.highlights,
      fontFamily: 'brand.heading',
      fontSize: o.size,
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: -1.5,
      color: fg(o.tone),
      highlightColor: o.tone === 'light' ? CYAN : VIOLET,
      align: o.align ?? 'left',
      vAlign: o.vAlign ?? 'top',
    },
    { name: 'Heading' },
  );
}

const sub = (t: string | undefined, f: F, tone: Tone, align: Align = 'left', size = 28): ElementSpec[] =>
  t ? [text('sub', 'subheading', f, { text: t, fontSize: size, fontWeight: 400, color: muted(tone, 75), align, lineHeight: 1.45 }, { name: 'Sub-heading' })] : [];

const body = (t: string | undefined, f: F, tone: Tone, size = 30): ElementSpec[] =>
  t ? [text('body', 'body', f, { text: t, fontSize: size, color: muted(tone, 85), lineHeight: 1.5 }, { name: 'Body text' })] : [];

const list = (items: string[] | undefined, f: F, tone: Tone, bullet = '✓', size = 30): ElementSpec[] =>
  items?.length ? [text('list', 'body', f, { text: items.join('\n'), fontSize: size, fontWeight: 500, color: fg(tone), lineHeight: 1.35, bullet, bulletColor: tone === 'light' ? CYAN : VIOLET }, { name: 'List' })] : [];

const cta = (t: string | undefined, f: F, variant: 'cyan' | 'violet' | 'white' = 'cyan'): ElementSpec[] =>
  t
    ? [
        badge(
          'cta',
          'cta',
          f,
          { text: `${t}  →`, style: 'pill', fill: variant === 'violet' ? VIOLET : variant === 'white' ? WHITE : CYAN, color: variant === 'violet' ? WHITE : INK, fontSize: 28, fontWeight: 700, letterSpacing: 1, uppercase: false },
          { name: 'Call to action' },
        ),
      ]
    : [];

const photo = (id: string, src: string, f: F, extra: Record<string, unknown> = {}): ElementSpec =>
  image(id, id === 'photo' ? 'photo' : 'photo2', f, { src, radius: 40, shadow: true, ...extra }, { name: id === 'photo' ? 'Main photo' : 'Photo' });

const tile = (id: string, name: string, f: F, tone: Tone): ElementSpec =>
  icon(id, f, { name, color: tone === 'light' ? INK : WHITE, bg: tone === 'light' ? CYAN : linear(135, [0, VIOLET], [1, MAGENTA]), bgShape: 'rounded', strokeWidth: 2 }, { name: 'Icon' });

/* ------------------------------------------------------------------ */
/* Layouts                                                             */
/* ------------------------------------------------------------------ */

const layouts: Record<AdKind, (c: AdContent) => Layout> = {
  hero: (c) => ({
    background: gradientBg,
    elements: [
      ...glows(),
      ...facets(620, 820, 520, 0.06),
      ...header('light'),
      photo('photo', photoSrc(c.photo, 'team'), P(60, 170, 960, 600)),
      ...(c.badge ? [badge('badge', 'badge', P(790, 120, 230, 230), { text: c.badge, style: 'burst', fill: CYAN, color: INK, fontFamily: 'brand.heading', fontSize: 50, letterSpacing: 0 }, { aspect: 1, rotation: 10, name: 'Badge' })] : []),
      ...eyebrow(c.eyebrow, P(60, 810, 380, 54), 'light'),
      heading(c, P(60, 888, 960, 250), { tone: 'light', size: 80 }),
      ...sub(c.sub, P(60, 1140, 560, 90), 'light'),
      ...cta(c.cta, P(640, 1150, 380, 84), 'cyan'),
      text('footer', 'footer', P(60, 1262, 960, 50), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color: 'rgba(255, 255, 255, 0.6)', vAlign: 'middle' }, { name: 'Footer' }),
    ],
  }),

  services: (c) => {
    const items = (c.items ?? []).slice(0, 6);
    const rows = Math.ceil(items.length / 2);
    const cardH = rows <= 2 ? 250 : 196;
    return {
      background: PAPER,
      elements: [
        shape('top', P(0, 0, 1080, 560), { fill: gradientBg, radius: 0 }, { name: 'Top block' }),
        shape('glow-cyan', P(600, -300, 700, 700), { kind: 'ellipse', fill: glow('rgba(34, 211, 238, 0.45)') }, { name: 'Glow', aspect: 1 }),
        ...facets(700, 250, 380, 0.08),
        ...header('light'),
        ...eyebrow(c.eyebrow, P(60, 190, 380, 52), 'light'),
        heading(c, P(60, 262, 900, 250), { tone: 'light', size: 72 }),
        ...items.flatMap((it, i) => {
          const x = i % 2 === 0 ? 60 : 555;
          const y = 500 + Math.floor(i / 2) * (cardH + 20);
          return [
            shape(`card-${i}`, P(x, y, 465, cardH), { fill: WHITE, radius: 30, shadow: true }, { name: `Card ${i + 1}` }),
            tile(`item-${i + 1}-icon`, it.icon, P(x + 28, y + 28, 80, 80), 'dark'),
            text(`item-${i + 1}-title`, 'item', P(x + 126, y + 28, 310, 80), { text: it.title, fontFamily: 'brand.heading', fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.12, vAlign: 'middle' }, { name: `Service ${i + 1}` }),
            ...(it.text ? [text(`item-${i + 1}-text`, 'item', P(x + 28, y + 124, 410, cardH - 140), { text: it.text, fontSize: 22, color: 'brand.ink/60', lineHeight: 1.4 }, { name: `Service ${i + 1} detail` })] : []),
          ];
        }),
        ...cta(c.cta, P(60, 1150, 440, 82), 'violet'),
        text('footer', 'footer', P(520, 1150, 500, 82), { text: '{handle}  •  {phone}', fontSize: 22, color: 'brand.ink/55', align: 'right', vAlign: 'middle' }, { name: 'Footer' }),
      ],
    };
  },

  offer: (c) => ({
    background: deepBg,
    elements: [
      ...glows(),
      ...facets(-120, 120, 560, 0.05),
      ...header('light'),
      badge('badge', 'badge', P(600, 150, 420, 420), { text: c.badge ?? 'OFFER', style: 'burst', fill: CYAN, color: INK, fontFamily: 'brand.heading', fontSize: 110, fontWeight: 700, letterSpacing: -2 }, { aspect: 1, rotation: 8, name: 'Discount seal' }),
      ...eyebrow(c.eyebrow, P(60, 220, 420, 52), 'light'),
      heading(c, P(60, 296, 540, 400), { tone: 'light', size: 74 }),
      glass('offer-card', P(60, 730, 960, 370)),
      ...(c.price ? [text('price', 'price', P(100, 770, 480, 130), { text: c.price, fontFamily: 'brand.heading', fontSize: 104, fontWeight: 700, color: WHITE, vAlign: 'middle', letterSpacing: -2 }, { name: 'Price' })] : []),
      ...(c.oldPrice ? [text('old-price', 'price', P(100, 900, 480, 50), { text: c.oldPrice, fontSize: 28, color: 'rgba(255, 255, 255, 0.5)', vAlign: 'middle' }, { name: 'Old price' })] : []),
      ...list(c.bullets, P(600, 770, 390, 300), 'light', '✓', 26),
      ...cta(c.cta, P(100, 980, 440, 84), 'cyan'),
      ...footer('light', 1150),
    ],
  }),

  stat: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    const n = Math.max(1, items.length);
    const cw = (960 - (n - 1) * 20) / n;
    return {
      background: gradientBg,
      elements: [
        ...glows(),
        ...header('light'),
        text('number', 'number', P(60, 200, 960, 330), { text: c.number ?? '100+', fontFamily: 'brand.heading', fontSize: 280, fontWeight: 700, letterSpacing: -10, color: WHITE, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
        ...(c.numberLabel ? [text('number-label', 'label', P(60, 536, 960, 50), { text: c.numberLabel, fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 6, color: CYAN, align: 'center', vAlign: 'middle' }, { name: 'Number label' })] : []),
        heading(c, P(120, 610, 840, 210), { tone: 'light', size: 54, align: 'center', vAlign: 'middle' }),
        ...items.flatMap((it, i) => {
          const x = 60 + i * (cw + 20);
          return [
            glass(`card-${i}`, P(x, 870, cw, 250), 30),
            text(`item-${i + 1}-title`, 'item', P(x, 900, cw, 110), { text: it.title, fontFamily: 'brand.heading', fontSize: 64, fontWeight: 700, color: CYAN, align: 'center', vAlign: 'middle' }, { name: `Stat ${i + 1}` }),
            text(`item-${i + 1}-text`, 'item', P(x + 20, 1010, cw - 40, 90), { text: it.text ?? '', fontSize: 22, color: 'rgba(255, 255, 255, 0.8)', align: 'center', lineHeight: 1.35 }, { name: `Stat ${i + 1} label` }),
          ];
        }),
        ...footer('light'),
      ],
    };
  },

  steps: (c) => {
    const items = (c.items ?? []).slice(0, 4);
    const gap = items.length <= 3 ? 190 : 162;
    return {
      background: PAPER,
      elements: [
        shape('glow', P(500, -300, 800, 800), { kind: 'ellipse', fill: glow('rgba(155, 0, 224, 0.18)') }, { name: 'Glow', aspect: 1 }),
        ...header('dark'),
        ...eyebrow(c.eyebrow, P(60, 180, 380, 52), 'dark'),
        heading(c, P(60, 250, 960, 220), { tone: 'dark', size: 70 }),
        ...items.flatMap((it, i) => {
          const y = 500 + i * gap;
          return [
            shape(`card-${i}`, P(60, y, 960, gap - 20), { fill: WHITE, radius: 30, shadow: true }, { name: `Card ${i + 1}` }),
            badge(`step-${i + 1}`, 'label', P(92, y + (gap - 20) / 2 - 42, 84, 84), { text: String(i + 1), style: 'circle', fill: VIOLET, color: WHITE, fontFamily: 'brand.heading', fontSize: 36, letterSpacing: 0 }, { aspect: 1, editable: false, name: `Step ${i + 1} number` }),
            text(`item-${i + 1}-title`, 'item', P(206, y + 22, 780, 52), { text: it.title, fontFamily: 'brand.heading', fontSize: 32, fontWeight: 700, color: INK, vAlign: 'middle' }, { name: `Step ${i + 1}` }),
            text(`item-${i + 1}-text`, 'item', P(206, y + 76, 780, gap - 110), { text: it.text ?? '', fontSize: 22, color: 'brand.ink/60', lineHeight: 1.35 }, { name: `Step ${i + 1} detail` }),
          ];
        }),
        ...cta(c.cta, P(60, 1160, 420, 76), 'violet'),
        text('footer', 'footer', P(500, 1160, 520, 76), { text: '{handle}  •  {phone}', fontSize: 22, color: 'brand.ink/55', align: 'right', vAlign: 'middle' }, { name: 'Footer' }),
      ],
    };
  },

  testimonial: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: gradientBg,
      elements: [
        ...glows(),
        ...header('light'),
        glass('card', P(60, 300, 960, 900), 44),
        shape('ring', P(386, 146, 308, 308), { kind: 'ellipse', fill: linear(135, [0, CYAN], [1, MAGENTA]) }, { aspect: 1, name: 'Photo ring' }),
        image('person-photo', 'photo', P(400, 160, 280, 280), { src: photoSrc(c.person?.photo, 'portraitWoman2'), shape: 'circle' }, { aspect: 1, name: 'Photo' }),
        text('rating', 'label', P(100, 480, 880, 56), { text: c.number ?? '★★★★★', fontSize: 40, color: CYAN, align: 'center', vAlign: 'middle', letterSpacing: 6 }, { name: 'Rating' }),
        text('quote', 'quote', P(130, 550, 820, 400), { text: q.text, highlights: q.highlights, fontSize: 38, fontWeight: 500, lineHeight: 1.45, color: WHITE, highlightColor: CYAN, align: 'center', vAlign: 'middle' }, { name: 'Quote' }),
        text('name', 'name', P(100, 980, 880, 60), { text: c.person?.name ?? 'Client name', fontFamily: 'brand.heading', fontSize: 40, fontWeight: 700, color: WHITE, align: 'center', vAlign: 'middle' }, { name: 'Name' }),
        text('person-role', 'subheading', P(130, 1040, 820, 80), { text: c.person?.role ?? '', fontSize: 24, color: 'rgba(255, 255, 255, 0.65)', align: 'center', lineHeight: 1.35 }, { name: 'Role' }),
        ...footer('light'),
      ],
    };
  },

  event: (c) => ({
    background: deepBg,
    elements: [
      ...glows(),
      ...header('light'),
      ...(c.badge ? [badge('badge', 'badge', P(60, 180, 330, 56), { text: `● ${c.badge}`, style: 'pill', fill: CYAN, color: INK, fontSize: 22, fontWeight: 700, letterSpacing: 2 }, { name: 'Badge' })] : []),
      heading(c, P(60, 260, 960, 270), { tone: 'light', size: 70 }),
      glass('date-card', P(60, 570, 250, 280), 32),
      text('number', 'number', P(60, 590, 250, 160), { text: c.number ?? '12', fontFamily: 'brand.heading', fontSize: 120, fontWeight: 700, color: WHITE, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Day' }),
      text('number-label', 'label', P(60, 750, 250, 60), { text: c.numberLabel ?? 'Oct', fontSize: 28, fontWeight: 700, uppercase: true, letterSpacing: 4, color: CYAN, align: 'center', vAlign: 'middle' }, { name: 'Month' }),
      ...(c.when ? [tile('when-icon', 'clock', P(350, 580, 64, 64), 'light'), text('when', 'date', P(432, 580, 588, 64), { text: c.when, fontSize: 30, fontWeight: 600, color: WHITE, vAlign: 'middle' }, { name: 'When' })] : []),
      ...(c.where ? [tile('where-icon', 'video', P(350, 664, 64, 64), 'light'), text('where', 'label', P(432, 664, 588, 64), { text: c.where, fontSize: 28, color: 'rgba(255, 255, 255, 0.8)', vAlign: 'middle' }, { name: 'Where' })] : []),
      ...(c.person
        ? [
            image('photo', 'photo', P(350, 760, 110, 110), { src: photoSrc(c.person.photo, 'portraitMan'), shape: 'circle', borderWidth: 4, borderColor: CYAN }, { aspect: 1, name: 'Speaker photo' }),
            text('name', 'name', P(480, 766, 540, 50), { text: c.person.name, fontFamily: 'brand.heading', fontSize: 30, fontWeight: 700, color: WHITE, vAlign: 'middle' }, { name: 'Speaker' }),
            text('person-role', 'subheading', P(480, 816, 540, 60), { text: c.person.role, fontSize: 22, color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.3 }, { name: 'Speaker role' }),
          ]
        : []),
      ...cta(c.cta, P(60, 1010, 960, 100), 'cyan'),
      ...footer('light', 1160),
    ],
  }),

  deadline: (c) => ({
    background: deepBg,
    elements: [
      ...glows(),
      ...header('light'),
      shape('ring-outer', P(220, 170, 640, 640), { kind: 'ring', fill: 'rgba(0,0,0,0)', stroke: 'rgba(34, 211, 238, 0.55)', strokeWidth: 4 }, { aspect: 1, name: 'Ring' }),
      shape('ring-inner', P(280, 230, 520, 520), { kind: 'ring', fill: 'rgba(0,0,0,0)', stroke: 'rgba(255, 255, 255, 0.14)', strokeWidth: 2 }, { aspect: 1, name: 'Ring' }),
      text('number', 'number', P(220, 170, 640, 640), { text: c.number ?? '3', fontFamily: 'brand.heading', fontSize: 320, fontWeight: 700, letterSpacing: -10, color: WHITE, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
      text('number-label', 'label', P(60, 830, 960, 60), { text: c.numberLabel ?? 'Days left', fontSize: 34, fontWeight: 700, uppercase: true, letterSpacing: 10, color: CYAN, align: 'center', vAlign: 'middle' }, { name: 'Number label' }),
      heading(c, P(100, 900, 880, 170), { tone: 'light', size: 52, align: 'center', vAlign: 'middle' }),
      ...sub(c.sub, P(100, 1070, 880, 50), 'light', 'center', 26),
      ...cta(c.cta, P(300, 1140, 480, 84), 'cyan'),
      text('footer', 'footer', P(60, 1260, 960, 50), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color: 'rgba(255, 255, 255, 0.55)', align: 'center', vAlign: 'middle' }, { name: 'Footer' }),
    ],
  }),

  announcement: (c) => ({
    background: PAPER,
    elements: [
      ...header('dark'),
      shape('card', P(60, 170, 960, 1010), { fill: gradientBg, radius: 48, shadow: true }, { name: 'Card' }),
      shape('card-glow', P(560, 170, 460, 460), { kind: 'ellipse', fill: glow('rgba(34, 211, 238, 0.4)') }, { aspect: 1, name: 'Glow' }),
      ...facets(620, 820, 360, 0.08),
      ...eyebrow(c.eyebrow ?? 'Announcement', P(110, 230, 380, 54), 'light'),
      heading(c, P(110, 320, 860, 320), { tone: 'light', size: 70 }),
      ...body(c.body, P(110, 660, 860, 300), 'light', 30),
      ...(c.sub ? [text('sub', 'subheading', P(110, 970, 860, 56), { text: c.sub, fontSize: 28, fontWeight: 600, color: CYAN, vAlign: 'middle' }, { name: 'Details' })] : []),
      ...cta(c.cta, P(110, 1060, 440, 84), 'cyan'),
      text('footer', 'footer', P(60, 1230, 960, 60), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color: 'brand.ink/55', align: 'center', vAlign: 'middle' }, { name: 'Footer' }),
    ],
  }),

  tip: (c) => ({
    background: PAPER,
    elements: [
      shape('glow', P(-260, -260, 760, 760), { kind: 'ellipse', fill: glow('rgba(155, 0, 224, 0.18)') }, { aspect: 1, name: 'Glow' }),
      ...header('dark'),
      shape('num-circle', P(60, 190, 200, 200), { kind: 'ellipse', fill: gradientBg, shadow: true }, { aspect: 1, name: 'Number circle' }),
      text('number', 'number', P(60, 190, 200, 200), { text: c.number ?? '01', fontFamily: 'brand.heading', fontSize: 84, fontWeight: 700, color: WHITE, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Tip number' }),
      ...eyebrow(c.eyebrow ?? 'Research tip', P(296, 262, 380, 54), 'dark'),
      heading(c, P(60, 430, 960, 260), { tone: 'dark', size: 66 }),
      shape('card', P(60, 720, 960, 460), { fill: WHITE, radius: 32, shadow: true }, { name: 'Card' }),
      ...(c.bullets?.length ? list(c.bullets, P(110, 770, 860, 360), 'dark', '→', 30) : body(c.body, P(110, 770, 860, 360), 'dark', 32)),
      text('footer', 'footer', P(60, 1230, 960, 60), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color: 'brand.ink/55', align: 'center', vAlign: 'middle' }, { name: 'Footer' }),
    ],
  }),

  checklist: (c) => ({
    background: gradientBg,
    elements: [
      ...glows(),
      ...header('light'),
      photo('photo', photoSrc(c.photo, 'online'), P(560, 170, 460, 560)),
      ...eyebrow(c.eyebrow, P(60, 190, 460, 52), 'light'),
      heading(c, P(60, 262, 470, 470), { tone: 'light', size: 60 }),
      glass('list-card', P(60, 780, 960, 330)),
      ...list(c.bullets, P(110, 815, 860, 260), 'light', '✓', 32),
      ...cta(c.cta, P(60, 1140, 440, 84), 'cyan'),
      text('footer', 'footer', P(520, 1140, 500, 84), { text: '{handle}  •  {phone}', fontSize: 22, color: 'rgba(255, 255, 255, 0.65)', align: 'right', vAlign: 'middle' }, { name: 'Footer' }),
    ],
  }),

  compare: (c) => {
    const cmp = c.compare ?? { leftTitle: 'Without', left: [], rightTitle: 'With us', right: [] };
    return {
      background: PAPER,
      elements: [
        ...header('dark'),
        ...eyebrow(c.eyebrow, P(60, 180, 380, 52), 'dark'),
        heading(c, P(60, 250, 960, 190), { tone: 'dark', size: 62 }),
        shape('left-card', P(60, 470, 450, 620), { fill: WHITE, radius: 32, shadow: true }, { name: 'Left card' }),
        text('left-title', 'label', P(90, 500, 390, 60), { text: cmp.leftTitle, fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 2, color: 'brand.ink/45', align: 'center', vAlign: 'middle' }, { name: 'Left title' }),
        text('left-list', 'body', P(96, 590, 380, 470), { text: cmp.left.join('\n'), fontSize: 26, color: 'brand.ink/60', bullet: '✕', bulletColor: '#ef4444', lineHeight: 1.35 }, { name: 'Left list' }),
        shape('right-card', P(570, 470, 450, 620), { fill: gradientBg, radius: 32, shadow: true }, { name: 'Right card' }),
        text('right-title', 'label', P(600, 500, 390, 60), { text: cmp.rightTitle, fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 2, color: CYAN, align: 'center', vAlign: 'middle' }, { name: 'Right title' }),
        text('right-list', 'body', P(606, 590, 380, 470), { text: cmp.right.join('\n'), fontSize: 26, fontWeight: 500, color: WHITE, bullet: '✓', bulletColor: CYAN, lineHeight: 1.35 }, { name: 'Right list' }),
        badge('vs', 'label', P(480, 720, 120, 120), { text: 'VS', style: 'circle', fill: INK, color: CYAN, fontFamily: 'brand.heading', fontSize: 36, letterSpacing: 0 }, { aspect: 1, editable: false, name: 'VS' }),
        ...cta(c.cta, P(320, 1130, 440, 84), 'violet'),
        text('footer', 'footer', P(60, 1250, 960, 50), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color: 'brand.ink/55', align: 'center', vAlign: 'middle' }, { name: 'Footer' }),
      ],
    };
  },

  quote: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: deepBg,
      elements: [
        ...glows(),
        ...facets(560, 620, 620, 0.07),
        ...header('light'),
        shape('quote-mark', P(60, 200, 190, 170), { kind: 'quote', fill: CYAN }, { name: 'Quote mark' }),
        text('quote', 'quote', P(60, 390, 960, 500), { text: q.text, highlights: q.highlights, fontFamily: 'brand.heading', fontSize: 58, fontWeight: 600, lineHeight: 1.2, letterSpacing: -1, color: WHITE, highlightColor: CYAN, vAlign: 'middle' }, { name: 'Quote' }),
        text('author', 'name', P(60, 930, 960, 56), { text: c.author ?? '', fontSize: 28, fontWeight: 700, uppercase: true, letterSpacing: 4, color: CYAN, vAlign: 'middle' }, { name: 'Author' }),
        ...sub(c.sub, P(60, 986, 960, 50), 'light', 'left', 24),
        ...footer('light'),
      ],
    };
  },

  contact: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    return {
      background: gradientBg,
      elements: [
        ...glows(),
        ...header('light'),
        heading(c, P(60, 210, 960, 250), { tone: 'light', size: 78, align: 'center', vAlign: 'middle' }),
        ...sub(c.sub, P(120, 470, 840, 80), 'light', 'center'),
        ...items.flatMap((it, i) => {
          const y = 590 + i * 138;
          return [
            glass(`row-${i}`, P(60, y, 960, 116), 58),
            tile(`item-${i + 1}-icon`, it.icon, P(84, y + 20, 76, 76), 'light'),
            text(`item-${i + 1}-title`, 'contact', P(188, y, 800, 116), { text: it.title, fontSize: 32, fontWeight: 600, color: WHITE, vAlign: 'middle' }, { name: `Contact ${i + 1}` }),
          ];
        }),
        ...cta(c.cta, P(300, 1040, 480, 92), 'cyan'),
        ...footer('light', 1190),
      ],
    };
  },
};

export const artovaSystem = layouts;
