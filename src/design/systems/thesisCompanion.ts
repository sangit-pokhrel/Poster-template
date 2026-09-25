/**
 * Thesis Companion — "Swiss Monochrome".
 * Black / white / paper blocks with hard edges, Montserrat Black uppercase
 * headlines, B&W photography, a single blue accent, index numbers, hairline
 * grids and the Cinzel wordmark in the header.
 */
import type { AdContent, AdKind, ElementSpec, Layout } from '../../types/template';
import { P, badge, icon, image, logo, markup, photoSrc, shape, text } from '../builders';

const BLACK = 'brand.primary';
const BLUE = 'brand.accent';
const PAPER = 'brand.paper';
const INK = 'brand.ink';
const WHITE = '#ffffff';
const SERIF = 'Cinzel';

type Align = 'left' | 'center' | 'right';
type Tone = 'dark' | 'light';
type F = ReturnType<typeof P>;

const fg = (tone: Tone) => (tone === 'dark' ? INK : WHITE);
const muted = (tone: Tone, a = 60) => (tone === 'dark' ? `brand.ink/${a}` : `rgba(255, 255, 255, ${a / 100})`);

/* ------------------------------------------------------------------ */
/* Motifs & slots                                                      */
/* ------------------------------------------------------------------ */

/** Header: roundel + Cinzel wordmark left, index label right, hairline under. `tone` = colour of the ink. */
const header = (tone: Tone, label = ''): ElementSpec[] => [
  logo(P(60, 52, 76, 76), { variant: 'mark', tone: tone === 'dark' ? 'dark' : 'light' }, { aspect: 1 }),
  text('brand-name', 'label', P(152, 60, 520, 60), { text: '{brand}', fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: fg(tone), vAlign: 'middle' }, { name: 'Brand name' }),
  ...(label ? [text('index', 'label', P(640, 60, 380, 60), { text: label, fontSize: 22, fontWeight: 700, uppercase: true, letterSpacing: 4, color: muted(tone, 55), align: 'right', vAlign: 'middle' }, { name: 'Index label' })] : []),
  shape('header-rule', P(60, 150, 960, 3), { fill: tone === 'dark' ? INK : WHITE }, { name: 'Header rule' }),
];

const footer = (tone: Tone, y = 1262): ElementSpec[] => [
  shape('footer-rule', P(60, y, 960, 3), { fill: tone === 'dark' ? INK : WHITE }, { name: 'Footer rule' }),
  text('footer', 'footer', P(60, y + 12, 860, 60), { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, fontWeight: 600, color: muted(tone, 70), vAlign: 'middle' }, { name: 'Footer' }),
  icon('footer-arrow', P(964, y + 18, 48, 48), { name: 'arrow', color: tone === 'dark' ? INK : WHITE, strokeWidth: 2.4 }, { name: 'Arrow' }),
];

const grid = (color = 'rgba(17, 17, 17, 0.06)'): ElementSpec => shape('grid', P(0, 0, 1080, 1350), { kind: 'grid', fill: color, radius: 90, strokeWidth: 1.5 }, { name: 'Grid' });

const eyebrow = (t: string | undefined, f: F, color = BLUE): ElementSpec[] =>
  t ? [text('eyebrow', 'label', f, { text: t, fontSize: 24, fontWeight: 800, uppercase: true, letterSpacing: 4, color, vAlign: 'middle' }, { name: 'Eyebrow' })] : [];

function heading(c: AdContent, f: F, o: { tone: Tone; size: number; align?: Align; vAlign?: 'top' | 'middle' | 'bottom'; upper?: boolean }): ElementSpec {
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
      fontWeight: 900,
      lineHeight: 1.04,
      uppercase: o.upper ?? true,
      letterSpacing: -1,
      color: fg(o.tone),
      highlightColor: BLUE,
      highlightStyle: o.tone === 'dark' ? 'color' : 'marker',
      align: o.align ?? 'left',
      vAlign: o.vAlign ?? 'top',
    },
    { name: 'Heading' },
  );
}

const sub = (t: string | undefined, f: F, tone: Tone, size = 28): ElementSpec[] =>
  t ? [text('sub', 'subheading', f, { text: t, fontSize: size, fontWeight: 500, color: muted(tone, 70), lineHeight: 1.4 }, { name: 'Sub-heading' })] : [];

const body = (t: string | undefined, f: F, tone: Tone, size = 30): ElementSpec[] =>
  t ? [text('body', 'body', f, { text: t, fontSize: size, fontWeight: 500, color: muted(tone, 80), lineHeight: 1.5 }, { name: 'Body text' })] : [];

const list = (items: string[] | undefined, f: F, tone: Tone, bullet = '■', size = 30): ElementSpec[] =>
  items?.length ? [text('list', 'body', f, { text: items.join('\n'), fontSize: size, fontWeight: 600, color: fg(tone), lineHeight: 1.3, bullet, bulletColor: BLUE }, { name: 'List' })] : [];

/** Square CTA with an arrow. */
const cta = (t: string | undefined, f: F, variant: 'black' | 'white' | 'blue' = 'black'): ElementSpec[] =>
  t
    ? [
        badge(
          'cta',
          'cta',
          f,
          { text: `${t}  →`, style: 'tag', radius: 0, fill: variant === 'white' ? WHITE : variant === 'blue' ? BLUE : BLACK, color: variant === 'white' ? INK : WHITE, fontSize: 28, fontWeight: 800, letterSpacing: 2 },
          { name: 'Call to action' },
        ),
      ]
    : [];

const bw = (id: string, src: string, f: F, extra: Record<string, unknown> = {}): ElementSpec => image(id, id === 'photo' ? 'photo' : 'photo2', f, { src, grayscale: true, ...extra }, { name: id === 'photo' ? 'Main photo' : 'Photo' });

/* ------------------------------------------------------------------ */
/* Layouts                                                             */
/* ------------------------------------------------------------------ */

const layouts: Record<AdKind, (c: AdContent) => Layout> = {
  hero: (c) => ({
    background: WHITE,
    elements: [
      ...header('dark', c.eyebrow),
      bw('photo', photoSrc(c.photo, 'students'), P(60, 180, 960, 600)),
      shape('photo-block', P(60, 740, 420, 40), { fill: BLUE }, { name: 'Accent block' }),
      ...(c.badge ? [badge('badge', 'badge', P(820, 200, 180, 180), { text: c.badge, style: 'circle', fill: BLUE, color: WHITE, fontSize: 40, fontWeight: 900, letterSpacing: 0 }, { aspect: 1, name: 'Badge' })] : []),
      heading(c, P(60, 800, 960, 250), { tone: 'dark', size: 86, vAlign: 'bottom' }),
      ...sub(c.sub, P(60, 1064, 960, 70), 'dark', 26),
      ...cta(c.cta, P(60, 1150, 960, 90), 'black'),
      ...footer('dark'),
    ],
  }),

  services: (c) => {
    const items = (c.items ?? []).slice(0, 6);
    const rowH = items.length > 4 ? 108 : 140;
    return {
      background: BLACK,
      elements: [
        ...header('light'),
        ...eyebrow(c.eyebrow, P(60, 190, 700, 44)),
        heading(c, P(60, 244, 960, 250), { tone: 'light', size: 78 }),
        ...items.flatMap((it, i) => {
          const y = 530 + i * rowH;
          return [
            text(`item-${i + 1}-num`, 'label', P(60, y, 100, rowH - 20), { text: String(i + 1).padStart(2, '0'), fontSize: 34, fontWeight: 900, color: BLUE, vAlign: 'middle' }, { name: `Index ${i + 1}`, editable: false }),
            text(`item-${i + 1}-title`, 'item', P(170, y + 4, 700, 52), { text: it.title, fontSize: 34, fontWeight: 800, uppercase: true, color: WHITE, vAlign: 'middle' }, { name: `Service ${i + 1}` }),
            ...(it.text ? [text(`item-${i + 1}-text`, 'item', P(170, y + 56, 700, rowH - 70), { text: it.text, fontSize: 22, color: 'rgba(255, 255, 255, 0.55)' }, { name: `Service ${i + 1} detail` })] : []),
            icon(`item-${i + 1}-icon`, P(952, y + 18, 60, 60), { name: it.icon, color: WHITE, strokeWidth: 1.8 }, { name: `Service ${i + 1} icon` }),
            shape(`row-rule-${i}`, P(60, y + rowH - 12, 960, 1.5), { fill: 'rgba(255, 255, 255, 0.18)' }, { name: 'Row rule' }),
          ];
        }),
        ...cta(c.cta, P(60, 1180, 420, 64), 'blue'),
        text('footer', 'footer', P(500, 1180, 520, 64), { text: '{handle}  •  {phone}', fontSize: 22, fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', align: 'right', vAlign: 'middle' }, { name: 'Footer' }),
      ],
    };
  },

  offer: (c) => ({
    background: BLACK,
    elements: [
      ...header('light', c.eyebrow),
      badge('badge', 'badge', P(60, 200, 960, 300), { text: c.badge ?? 'OFFER', style: 'tag', radius: 0, fill: BLUE, color: WHITE, fontSize: 200, fontWeight: 900, letterSpacing: -2 }, { name: 'Discount' }),
      heading(c, P(60, 540, 960, 230), { tone: 'light', size: 68 }),
      ...(c.price ? [text('price', 'price', P(60, 800, 500, 120), { text: c.price, fontSize: 100, fontWeight: 900, color: WHITE, vAlign: 'middle', letterSpacing: -2 }, { name: 'Price' })] : []),
      ...(c.oldPrice ? [text('old-price', 'price', P(60, 920, 500, 50), { text: c.oldPrice, fontSize: 28, fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', vAlign: 'middle' }, { name: 'Old price' })] : []),
      shape('divider', P(590, 810, 3, 280), { fill: 'rgba(255, 255, 255, 0.3)' }, { name: 'Divider' }),
      ...list(c.bullets, P(630, 810, 390, 290), 'light', '■', 26),
      ...cta(c.cta, P(60, 1120, 460, 90), 'white'),
      ...footer('light'),
    ],
  }),

  stat: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    const colW = 960 / Math.max(1, items.length);
    return {
      background: PAPER,
      elements: [
        grid(),
        ...header('dark', c.eyebrow),
        text('number', 'number', P(50, 190, 980, 330), { text: c.number ?? '100+', fontSize: 300, fontWeight: 900, letterSpacing: -8, color: INK, vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
        ...(c.numberLabel ? [badge('number-label', 'label', P(60, 530, 520, 60), { text: c.numberLabel, style: 'tag', radius: 0, fill: BLUE, color: WHITE, fontSize: 24, fontWeight: 800, letterSpacing: 3 }, { name: 'Number label' })] : []),
        heading(c, P(60, 620, 900, 220), { tone: 'dark', size: 56, upper: false }),
        shape('thick-rule', P(60, 870, 960, 14), { fill: INK }, { name: 'Rule' }),
        ...items.flatMap((it, i) => [
          text(`item-${i + 1}-title`, 'item', P(60 + i * colW, 910, colW - 20, 110), { text: it.title, fontSize: 72, fontWeight: 900, color: INK, vAlign: 'middle', letterSpacing: -2 }, { name: `Stat ${i + 1}` }),
          text(`item-${i + 1}-text`, 'item', P(60 + i * colW, 1020, colW - 30, 110), { text: it.text ?? '', fontSize: 22, fontWeight: 600, uppercase: true, letterSpacing: 1, color: 'brand.ink/60', lineHeight: 1.3 }, { name: `Stat ${i + 1} label` }),
        ]),
        ...footer('dark'),
      ],
    };
  },

  steps: (c) => {
    const items = (c.items ?? []).slice(0, 4);
    const two = items.length === 4;
    return {
      background: WHITE,
      elements: [
        ...header('dark', c.eyebrow),
        heading(c, P(60, 190, 960, 250), { tone: 'dark', size: 76 }),
        ...items.flatMap((it, i) => {
          const x = two ? (i % 2 === 0 ? 60 : 550) : 60;
          const y = two ? 480 + Math.floor(i / 2) * 330 : 480 + i * 215;
          const w = two ? 470 : 960;
          const h = two ? 310 : 195;
          return [
            shape(`card-${i}`, P(x, y, w, h), { fill: BLACK }, { name: `Card ${i + 1}` }),
            text(`step-${i + 1}`, 'label', P(x + 34, y + 24, 160, 90), { text: String(i + 1).padStart(2, '0'), fontSize: 72, fontWeight: 900, color: BLUE, vAlign: 'middle' }, { name: `Step ${i + 1} number`, editable: false }),
            text(`item-${i + 1}-title`, 'item', P(two ? x + 34 : x + 210, two ? y + 130 : y + 30, two ? w - 68 : 710, 60), { text: it.title, fontSize: 32, fontWeight: 800, uppercase: true, color: WHITE, vAlign: 'middle' }, { name: `Step ${i + 1}` }),
            text(`item-${i + 1}-text`, 'item', P(two ? x + 34 : x + 210, two ? y + 196 : y + 96, two ? w - 68 : 710, two ? 96 : 76), { text: it.text ?? '', fontSize: 22, color: 'rgba(255, 255, 255, 0.62)', lineHeight: 1.4 }, { name: `Step ${i + 1} detail` }),
          ];
        }),
        ...cta(c.cta, P(60, 1150, 440, 84), 'blue'),
        ...footer('dark', 1262),
      ],
    };
  },

  testimonial: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: BLACK,
      elements: [
        bw('person-photo', photoSrc(c.person?.photo, 'portraitMan2'), P(0, 0, 500, 1350)),
        shape('photo-edge', P(500, 0, 14, 1350), { fill: BLUE }, { name: 'Accent edge' }),
        ...eyebrow(c.eyebrow ?? 'Client review', P(570, 70, 450, 44)),
        shape('quote-mark', P(570, 140, 150, 130), { kind: 'quote', fill: BLUE }, { name: 'Quote mark' }),
        text('quote', 'quote', P(570, 300, 450, 560), { text: q.text, highlights: q.highlights, fontSize: 36, fontWeight: 600, lineHeight: 1.4, color: WHITE, highlightColor: BLUE, vAlign: 'middle' }, { name: 'Quote' }),
        text('rating', 'label', P(570, 890, 450, 50), { text: c.number ?? '★★★★★', fontSize: 36, color: BLUE, vAlign: 'middle', letterSpacing: 6 }, { name: 'Rating' }),
        text('name', 'name', P(570, 960, 450, 56), { text: c.person?.name ?? 'Client name', fontSize: 34, fontWeight: 900, uppercase: true, color: WHITE, vAlign: 'middle' }, { name: 'Name' }),
        text('person-role', 'subheading', P(570, 1016, 450, 80), { text: c.person?.role ?? '', fontSize: 22, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.35 }, { name: 'Role' }),
        logo(P(570, 1190, 70, 70), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
        text('brand-name', 'label', P(656, 1195, 364, 60), { text: '{brand}', fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: WHITE, vAlign: 'middle' }, { name: 'Brand name' }),
      ],
    };
  },

  event: (c) => ({
    background: WHITE,
    elements: [
      grid(),
      shape('top-block', P(0, 0, 1080, 560), { fill: BLACK }, { name: 'Top block' }),
      ...header('light'),
      ...(c.badge ? [badge('badge', 'badge', P(60, 186, 300, 56), { text: c.badge, style: 'tag', radius: 0, fill: BLUE, color: WHITE, fontSize: 22, fontWeight: 800, letterSpacing: 3 }, { name: 'Badge' })] : []),
      heading(c, P(60, 262, 960, 270), { tone: 'light', size: 68 }),
      text('number', 'number', P(50, 600, 320, 200), { text: c.number ?? '12', fontSize: 190, fontWeight: 900, letterSpacing: -6, color: INK, vAlign: 'middle', lineHeight: 1 }, { name: 'Day' }),
      text('number-label', 'label', P(60, 800, 300, 50), { text: c.numberLabel ?? 'Oct', fontSize: 30, fontWeight: 900, uppercase: true, letterSpacing: 4, color: BLUE, vAlign: 'middle' }, { name: 'Month' }),
      shape('v-rule', P(380, 610, 6, 250), { fill: INK }, { name: 'Rule' }),
      ...(c.when ? [text('when', 'date', P(420, 616, 600, 56), { text: c.when, fontSize: 32, fontWeight: 800, color: INK, vAlign: 'middle' }, { name: 'When' })] : []),
      ...(c.where ? [text('where', 'label', P(420, 676, 600, 50), { text: c.where, fontSize: 26, fontWeight: 500, color: 'brand.ink/65', vAlign: 'middle' }, { name: 'Where' })] : []),
      ...(c.person
        ? [
            bw('photo', photoSrc(c.person.photo, 'portraitMan'), P(420, 750, 150, 150)),
            text('name', 'name', P(596, 760, 424, 50), { text: c.person.name, fontSize: 30, fontWeight: 900, uppercase: true, color: INK, vAlign: 'middle' }, { name: 'Speaker' }),
            text('person-role', 'subheading', P(596, 812, 424, 90), { text: c.person.role, fontSize: 22, color: 'brand.ink/60', lineHeight: 1.35 }, { name: 'Speaker role' }),
          ]
        : []),
      ...cta(c.cta, P(60, 1060, 960, 110), 'black'),
      ...footer('dark', 1230),
    ],
  }),

  deadline: (c) => ({
    background: BLUE,
    elements: [
      ...header('light', c.eyebrow),
      text('number', 'number', P(40, 170, 1000, 520), { text: c.number ?? '3', fontSize: 500, fontWeight: 900, letterSpacing: -12, color: WHITE, vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
      text('number-label', 'label', P(60, 690, 960, 110), { text: c.numberLabel ?? 'Days left', fontSize: 96, fontWeight: 900, uppercase: true, letterSpacing: -2, color: BLACK, vAlign: 'middle' }, { name: 'Number label' }),
      shape('rule', P(60, 820, 220, 16), { fill: WHITE }, { name: 'Rule' }),
      heading(c, P(60, 870, 960, 170), { tone: 'light', size: 50, upper: false }),
      ...sub(c.sub, P(60, 1050, 960, 60), 'light'),
      ...cta(c.cta, P(60, 1136, 460, 90), 'black'),
      ...footer('light'),
    ],
  }),

  announcement: (c) => ({
    background: PAPER,
    elements: [
      shape('side-bar', P(0, 0, 36, 1350), { fill: BLACK }, { name: 'Side bar' }),
      ...header('dark'),
      text('eyebrow', 'label', P(60, 180, 960, 150), { text: c.eyebrow ?? 'Notice', fontSize: 130, fontWeight: 900, uppercase: true, letterSpacing: -3, color: 'brand.ink/12', vAlign: 'middle' }, { name: 'Eyebrow' }),
      shape('blue-rule', P(60, 350, 180, 16), { fill: BLUE }, { name: 'Rule' }),
      heading(c, P(60, 390, 940, 320), { tone: 'dark', size: 66, upper: false, vAlign: 'bottom' }),
      ...body(c.body, P(60, 740, 900, 260), 'dark', 30),
      ...(c.sub ? [text('sub', 'subheading', P(60, 1010, 900, 56), { text: c.sub, fontSize: 28, fontWeight: 800, color: BLUE, vAlign: 'middle' }, { name: 'Details' })] : []),
      ...cta(c.cta, P(60, 1100, 440, 86), 'black'),
      ...footer('dark'),
    ],
  }),

  tip: (c) => ({
    background: WHITE,
    elements: [
      ...header('dark'),
      shape('num-block', P(60, 190, 250, 210), { fill: BLACK }, { name: 'Number block' }),
      text('number', 'number', P(60, 190, 250, 210), { text: c.number ?? '01', fontSize: 150, fontWeight: 900, letterSpacing: -6, color: WHITE, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Tip number' }),
      badge('eyebrow', 'label', P(340, 344, 300, 56), { text: c.eyebrow ?? 'Thesis tip', style: 'tag', radius: 0, fill: BLUE, color: WHITE, fontSize: 22, fontWeight: 800, letterSpacing: 3 }, { name: 'Eyebrow' }),
      heading(c, P(60, 430, 960, 210), { tone: 'dark', size: 68, vAlign: 'bottom' }),
      shape('rule', P(60, 660, 960, 6), { fill: INK }, { name: 'Rule' }),
      ...(c.bullets?.length ? list(c.bullets, P(60, 710, 960, 480), 'dark', '→', 30) : body(c.body, P(60, 710, 960, 480), 'dark', 32)),
      ...footer('dark'),
    ],
  }),

  checklist: (c) => ({
    background: BLACK,
    elements: [
      bw('photo', photoSrc(c.photo, 'desk'), P(560, 0, 520, 760)),
      shape('photo-edge', P(546, 0, 14, 760), { fill: BLUE }, { name: 'Accent edge' }),
      logo(P(60, 52, 76, 76), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
      text('brand-name', 'label', P(150, 60, 380, 60), { text: '{brand}', fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: WHITE, vAlign: 'middle' }, { name: 'Brand name' }),
      ...eyebrow(c.eyebrow, P(60, 220, 460, 44)),
      heading(c, P(60, 274, 470, 460), { tone: 'light', size: 62 }),
      shape('rule', P(60, 800, 960, 3), { fill: 'rgba(255, 255, 255, 0.3)' }, { name: 'Rule' }),
      ...list(c.bullets, P(60, 840, 960, 290), 'light', '■', 32),
      ...cta(c.cta, P(60, 1150, 440, 84), 'blue'),
      ...footer('light'),
    ],
  }),

  compare: (c) => {
    const cmp = c.compare ?? { leftTitle: 'Without', left: [], rightTitle: 'With us', right: [] };
    return {
      background: WHITE,
      elements: [
        ...header('dark', c.eyebrow),
        heading(c, P(60, 190, 960, 220), { tone: 'dark', size: 66 }),
        text('left-title', 'label', P(60, 450, 450, 60), { text: cmp.leftTitle, fontSize: 28, fontWeight: 900, uppercase: true, color: 'brand.ink/45', vAlign: 'middle' }, { name: 'Left title' }),
        shape('left-rule', P(60, 516, 450, 4), { fill: 'brand.ink/30' }, { name: 'Rule' }),
        text('left-list', 'body', P(60, 544, 450, 520), { text: cmp.left.join('\n'), fontSize: 27, fontWeight: 500, color: 'brand.ink/50', bullet: '✕', bulletColor: 'brand.ink/40', lineHeight: 1.35 }, { name: 'Left list' }),
        shape('right-card', P(550, 430, 470, 650), { fill: BLACK }, { name: 'Right card' }),
        text('right-title', 'label', P(586, 460, 400, 60), { text: cmp.rightTitle, fontSize: 28, fontWeight: 900, uppercase: true, color: BLUE, vAlign: 'middle' }, { name: 'Right title' }),
        text('right-list', 'body', P(586, 544, 400, 500), { text: cmp.right.join('\n'), fontSize: 27, fontWeight: 600, color: WHITE, bullet: '✓', bulletColor: BLUE, lineHeight: 1.35 }, { name: 'Right list' }),
        ...cta(c.cta, P(60, 1120, 440, 90), 'black'),
        ...footer('dark'),
      ],
    };
  },

  quote: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: BLACK,
      elements: [
        ...header('light', c.eyebrow),
        shape('quote-mark', P(60, 200, 190, 170), { kind: 'quote', fill: BLUE }, { name: 'Quote mark' }),
        text('quote', 'quote', P(60, 400, 960, 520), { text: q.text, highlights: q.highlights, fontSize: 58, fontWeight: 800, lineHeight: 1.18, color: WHITE, highlightColor: BLUE, vAlign: 'middle' }, { name: 'Quote' }),
        shape('rule', P(60, 960, 140, 10), { fill: BLUE }, { name: 'Rule' }),
        text('author', 'name', P(60, 990, 960, 56), { text: c.author ?? '', fontSize: 30, fontWeight: 900, uppercase: true, letterSpacing: 2, color: WHITE, vAlign: 'middle' }, { name: 'Author' }),
        ...sub(c.sub, P(60, 1046, 960, 50), 'light', 24),
        ...footer('light'),
      ],
    };
  },

  contact: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    return {
      background: WHITE,
      elements: [
        grid(),
        ...header('dark', c.eyebrow),
        heading(c, P(60, 190, 960, 300), { tone: 'dark', size: 92 }),
        ...sub(c.sub, P(60, 500, 900, 90), 'dark'),
        ...items.flatMap((it, i) => {
          const y = 640 + i * 136;
          return [
            shape(`row-${i}`, P(60, y, 960, 112), { fill: BLACK }, { name: `Row ${i + 1}` }),
            icon(`item-${i + 1}-icon`, P(96, y + 28, 56, 56), { name: it.icon, color: BLUE, strokeWidth: 2.2 }, { name: `Contact ${i + 1} icon` }),
            text(`item-${i + 1}-title`, 'contact', P(190, y, 800, 112), { text: it.title, fontSize: 32, fontWeight: 800, color: WHITE, vAlign: 'middle' }, { name: `Contact ${i + 1}` }),
          ];
        }),
        ...cta(c.cta, P(60, 1080, 460, 92), 'blue'),
        ...footer('dark'),
      ],
    };
  },
};

export const thesisCompanionSystem = layouts;
