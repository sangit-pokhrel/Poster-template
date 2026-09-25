/**
 * Nepal Scholar — "Heritage Editorial".
 * Navy + cream fields, gold hairlines and ornaments, Playfair Display headlines,
 * arched photo frames with an offset gold outline, crest logo, gold seals.
 */
import type { AdContent, AdKind, ElementSpec, Layout } from '../../types/template';
import { H, P, badge, icon, image, linear, logo, markup, photoSrc, shape, text } from '../builders';

const NAVY = 'brand.primary';
const MAROON = 'brand.secondary';
const GOLD = 'brand.accent';
const CREAM = 'brand.paper';
const INK = 'brand.ink';
const HEAD = 'brand.heading';
const CLEAR = 'rgba(0, 0, 0, 0)';

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */

const frame = (color = GOLD): ElementSpec[] => [
  shape('frame-outer', P(28, 28, 1024, 1294), { fill: CLEAR, stroke: `${color}/70`, strokeWidth: 2 }, { name: 'Frame' }),
  shape('frame-inner', P(42, 42, 996, 1266), { fill: CLEAR, stroke: `${color}/35`, strokeWidth: 1 }, { name: 'Frame (inner)' }),
];

const ornament = (id: string, cy: number, cx = 540, color = GOLD): ElementSpec[] => [
  shape(`${id}-l`, P(cx - 150, cy - 1, 120, 2), { fill: color }, { name: 'Ornament' }),
  shape(`${id}-d`, P(cx - 12, cy - 12, 24, 24), { kind: 'diamond', fill: color }, { name: 'Ornament', aspect: 1 }),
  shape(`${id}-r`, P(cx + 30, cy - 1, 120, 2), { fill: color }, { name: 'Ornament' }),
];

const texture = (color = 'rgba(201, 164, 92, 0.08)'): ElementSpec => shape('texture', P(0, 0, 1080, 1350), { kind: 'dots', fill: color, radius: 30 }, { name: 'Texture' });

const mountain = (y: number, color = 'rgba(201, 164, 92, 0.10)'): ElementSpec =>
  shape('mountain', P(0, y, 1080, 1350 - y), { kind: 'polygon', fill: color, points: [0, 1, 0, 0.62, 0.18, 0.3, 0.3, 0.52, 0.5, 0.05, 0.66, 0.4, 0.8, 0.22, 1, 0.58, 1, 1] }, { name: 'Mountains' });

/* ------------------------------------------------------------------ */
/* Text slots                                                          */
/* ------------------------------------------------------------------ */

type Align = 'left' | 'center' | 'right';

const eyebrow = (t: string | undefined, f: ReturnType<typeof P>, color = GOLD, align: Align = 'left'): ElementSpec[] =>
  t ? [text('eyebrow', 'label', f, { text: t, fontSize: 24, fontWeight: 600, uppercase: true, letterSpacing: 5, color, align, vAlign: 'middle' }, { name: 'Eyebrow' })] : [];

function heading(c: AdContent, f: ReturnType<typeof P>, o: { color: string; size: number; align?: Align; vAlign?: 'top' | 'middle' | 'bottom' }): ElementSpec {
  const m = markup(c.heading ?? '');
  return text(
    'heading',
    'heading',
    f,
    { text: m.text, highlights: m.highlights, fontFamily: HEAD, fontSize: o.size, fontWeight: 700, lineHeight: 1.14, color: o.color, highlightColor: GOLD, align: o.align ?? 'left', vAlign: o.vAlign ?? 'top' },
    { name: 'Heading' },
  );
}

const sub = (t: string | undefined, f: ReturnType<typeof P>, color: string, align: Align = 'left', size = 30): ElementSpec[] =>
  t ? [text('sub', 'subheading', f, { text: t, fontSize: size, fontWeight: 400, color, align, lineHeight: 1.4 }, { name: 'Sub-heading' })] : [];

const body = (t: string | undefined, f: ReturnType<typeof P>, color: string, align: Align = 'left', size = 30): ElementSpec[] =>
  t ? [text('body', 'body', f, { text: t, fontSize: size, fontWeight: 400, color, align, lineHeight: 1.5 }, { name: 'Body text' })] : [];

const list = (items: string[] | undefined, f: ReturnType<typeof P>, color: string, bullet = '✦', size = 30, bulletColor = GOLD): ElementSpec[] =>
  items?.length ? [text('list', 'body', f, { text: items.join('\n'), fontSize: size, fontWeight: 400, color, lineHeight: 1.35, bullet, bulletColor }, { name: 'List' })] : [];

const cta = (t: string | undefined, f: ReturnType<typeof P>, variant: 'gold' | 'navy' | 'outline' = 'gold'): ElementSpec[] =>
  t
    ? [
        badge(
          'cta',
          'cta',
          f,
          {
            text: t,
            style: variant === 'outline' ? 'outline' : 'tag',
            radius: 4,
            fill: variant === 'navy' ? NAVY : GOLD,
            color: variant === 'gold' ? NAVY : GOLD,
            fontSize: 28,
            letterSpacing: 3,
          },
          { name: 'Call to action' },
        ),
      ]
    : [];

const brandName = (f: ReturnType<typeof P>, color = GOLD): ElementSpec =>
  text('brand-name', 'label', f, { text: '{brand}', fontFamily: HEAD, fontSize: 32, fontWeight: 700, color, vAlign: 'middle' }, { name: 'Brand name' });

const footerText = (f: ReturnType<typeof P>, color: string, align: Align = 'right'): ElementSpec =>
  text('footer', 'footer', f, { text: '{handle}  •  {phone}  •  {website}', fontSize: 22, color, align, vAlign: 'middle' }, { name: 'Footer' });

/** Navy footer band with gold hairline, crest mark, brand name and contact line. */
const footerBand = (y = 1238): ElementSpec[] => [
  shape('footer-band', P(0, y, 1080, H - y), { fill: NAVY }, { name: 'Footer band' }),
  shape('footer-rule', P(0, y, 1080, 3), { fill: GOLD }, { name: 'Footer rule' }),
  logo(P(56, y + 18, 76, 76), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
  brandName(P(146, y + 26, 400, 60)),
  footerText(P(540, y + 26, 484, 60), 'rgba(251, 248, 242, 0.7)'),
];

const crest = (x: number, y: number, h: number, tone: 'dark' | 'light'): ElementSpec => logo(P(x, y, h * 0.75, h), { variant: 'full', tone, align: 'center' });

/** Photo in an arch with an offset gold outline. */
const archPhoto = (id: string, role: 'photo' | 'photo2', src: string, x: number, y: number, w: number, h: number): ElementSpec[] => [
  shape(`${id}-outline`, P(x - 22, y - 22, w + 44, h + 44), { kind: 'arch', fill: CLEAR, stroke: GOLD, strokeWidth: 2 }, { name: 'Arch outline' }),
  image(id, role, P(x, y, w, h), { src, shape: 'arch', borderWidth: 6, borderColor: GOLD }, { name: role === 'photo' ? 'Main photo' : 'Photo' }),
];

const personName = (t: string, f: ReturnType<typeof P>, color: string, align: Align = 'center', size = 40): ElementSpec =>
  text('name', 'name', f, { text: t, fontFamily: HEAD, fontSize: size, fontWeight: 700, color, align, vAlign: 'middle' }, { name: 'Name' });

const personRole = (t: string, f: ReturnType<typeof P>, color: string, align: Align = 'center'): ElementSpec =>
  text('person-role', 'subheading', f, { text: t, fontSize: 24, color, align, vAlign: 'top', lineHeight: 1.35 }, { name: 'Role' });

/* ------------------------------------------------------------------ */
/* Layouts                                                             */
/* ------------------------------------------------------------------ */

const layouts: Record<AdKind, (c: AdContent) => Layout> = {
  hero: (c) => ({
    background: NAVY,
    elements: [
      texture(),
      ...frame(),
      logo(P(495, 58, 90, 90), { variant: 'mark', tone: 'light', align: 'center' }, { aspect: 1 }),
      ...archPhoto('photo', 'photo', photoSrc(c.photo, 'graduationSky'), 170, 190, 740, 560),
      ...(c.badge ? [badge('badge', 'badge', P(760, 640, 190, 190), { text: c.badge, style: 'circle', fill: GOLD, color: NAVY, fontFamily: HEAD, fontSize: 44, letterSpacing: 0 }, { name: 'Badge', aspect: 1, rotation: -10 })] : []),
      ...eyebrow(c.eyebrow, P(90, 800, 900, 44), GOLD, 'center'),
      heading(c, P(110, 852, 860, 200), { color: CREAM, size: 70, align: 'center', vAlign: 'middle' }),
      ...sub(c.sub, P(140, 1060, 800, 80), 'rgba(251, 248, 242, 0.75)', 'center', 28),
      ...cta(c.cta, P(330, 1152, 420, 76), 'gold'),
      footerText(P(90, 1250, 900, 50), 'rgba(251, 248, 242, 0.55)', 'center'),
    ],
  }),

  services: (c) => {
    const items = (c.items ?? []).slice(0, 6);
    const rows = Math.ceil(items.length / 2);
    const cardH = rows <= 2 ? 250 : 190;
    return {
      background: CREAM,
      elements: [
        shape('band', P(0, 0, 1080, 560), { fill: NAVY }, { name: 'Top band' }),
        texture(),
        crest(880, 60, 170, 'light'),
        ...eyebrow(c.eyebrow, P(72, 92, 700, 44)),
        heading(c, P(72, 148, 760, 250), { color: CREAM, size: 72 }),
        ...sub(c.sub, P(72, 402, 760, 80), 'rgba(251, 248, 242, 0.78)', 'left', 28),
        ...items.flatMap((it, i) => {
          const x = i % 2 === 0 ? 72 : 560;
          const y = 520 + Math.floor(i / 2) * (cardH + 20);
          return [
            shape(`card-${i}`, P(x, y, 448, cardH), { fill: '#ffffff', radius: 6, stroke: 'brand.accent/45', strokeWidth: 2, shadow: true }, { name: `Card ${i + 1}` }),
            icon(`item-${i + 1}-icon`, P(x + 28, y + 30, 72, 72), { name: it.icon, color: GOLD, bg: NAVY, bgShape: 'circle', strokeWidth: 2 }, { name: `Item ${i + 1} icon` }),
            text(`item-${i + 1}-title`, 'item', P(x + 118, y + 28, 304, 80), { text: it.title, fontFamily: HEAD, fontSize: 30, fontWeight: 700, color: NAVY, lineHeight: 1.15, vAlign: 'middle' }, { name: `Item ${i + 1}` }),
            ...(it.text
              ? [text(`item-${i + 1}-text`, 'item', P(x + 28, y + 118, 396, cardH - 136), { text: it.text, fontSize: 22, color: 'brand.ink/70', lineHeight: 1.4 }, { name: `Item ${i + 1} detail` })]
              : []),
          ];
        }),
        ...cta(c.cta, P(72, 1136, 460, 80), 'navy'),
        footerText(P(560, 1136, 448, 80), 'brand.ink/60'),
        shape('base-rule', P(0, 1312, 1080, 38), { fill: NAVY }, { name: 'Base band' }),
        shape('base-gold', P(0, 1312, 1080, 3), { fill: GOLD }, { name: 'Base rule' }),
      ],
    };
  },

  offer: (c) => ({
    background: linear(160, [0, NAVY], [1, '#121a29']),
    elements: [
      texture(),
      ...frame(),
      shape('seal-ring', P(640, 96, 380, 380), { kind: 'ring', fill: CLEAR, stroke: GOLD, strokeWidth: 3 }, { aspect: 1, name: 'Seal ring' }),
      badge('badge', 'badge', P(662, 118, 336, 336), { text: c.badge ?? 'OFFER', style: 'circle', fill: GOLD, color: NAVY, fontFamily: HEAD, fontSize: 96, fontWeight: 800, letterSpacing: 0 }, { name: 'Discount seal', aspect: 1, rotation: -8 }),
      logo(P(80, 80, 84, 84), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
      brandName(P(178, 92, 420, 60)),
      ...eyebrow(c.eyebrow, P(80, 290, 540, 44)),
      heading(c, P(80, 344, 560, 330), { color: CREAM, size: 74 }),
      ...(c.price ? [text('price', 'price', P(80, 700, 540, 130), { text: c.price, fontFamily: HEAD, fontSize: 108, fontWeight: 800, color: GOLD, vAlign: 'middle' }, { name: 'Price' })] : []),
      ...(c.oldPrice ? [text('old-price', 'price', P(80, 830, 540, 50), { text: c.oldPrice, fontSize: 28, color: 'rgba(251, 248, 242, 0.5)', vAlign: 'middle' }, { name: 'Old price' })] : []),
      ...archPhoto('photo', 'photo', photoSrc(c.photo, 'studying'), 668, 560, 332, 470),
      ...list(c.bullets, P(80, 900, 540, 210), CREAM, '✦', 28),
      ...cta(c.cta, P(80, 1140, 460, 80), 'gold'),
      footerText(P(80, 1244, 920, 50), 'rgba(251, 248, 242, 0.5)', 'left'),
    ],
  }),

  stat: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    const colW = 936 / Math.max(1, items.length);
    return {
      background: CREAM,
      elements: [
        ...frame(),
        crest(478, 70, 170, 'dark'),
        text('number', 'number', P(72, 260, 936, 290), { text: c.number ?? '100+', fontFamily: HEAD, fontSize: 250, fontWeight: 800, color: NAVY, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
        ...(c.numberLabel ? [text('number-label', 'label', P(72, 556, 936, 50), { text: c.numberLabel, fontSize: 26, fontWeight: 600, uppercase: true, letterSpacing: 6, color: GOLD, align: 'center', vAlign: 'middle' }, { name: 'Number label' })] : []),
        ...ornament('orn', 648),
        heading(c, P(130, 690, 820, 200), { color: INK, size: 54, align: 'center', vAlign: 'middle' }),
        ...items.flatMap((it, i) => [
          ...(i > 0 ? [shape(`col-rule-${i}`, P(72 + i * colW, 930, 2, 170), { fill: 'brand.accent/60' }, { name: 'Divider' })] : []),
          text(`item-${i + 1}-title`, 'item', P(72 + i * colW, 920, colW, 100), { text: it.title, fontFamily: HEAD, fontSize: 64, fontWeight: 800, color: MAROON, align: 'center', vAlign: 'middle' }, { name: `Stat ${i + 1}` }),
          text(`item-${i + 1}-text`, 'item', P(92 + i * colW, 1020, colW - 40, 80), { text: it.text ?? '', fontSize: 22, color: 'brand.ink/70', align: 'center', lineHeight: 1.35 }, { name: `Stat ${i + 1} label` }),
        ]),
        footerText(P(90, 1190, 900, 50), 'brand.ink/55', 'center'),
      ],
    };
  },

  steps: (c) => {
    const items = (c.items ?? []).slice(0, 4);
    const gap = items.length <= 3 ? 200 : 165;
    return {
      background: NAVY,
      elements: [
        texture(),
        ...eyebrow(c.eyebrow, P(90, 90, 900, 44), GOLD, 'center'),
        heading(c, P(110, 146, 860, 210), { color: CREAM, size: 64, align: 'center', vAlign: 'middle' }),
        ...ornament('orn', 392),
        shape('timeline', P(179, 470, 3, gap * (items.length - 1) + 20), { fill: 'brand.accent/60' }, { name: 'Timeline' }),
        ...items.flatMap((it, i) => {
          const y = 440 + i * gap;
          return [
            badge(`step-${i + 1}`, 'label', P(130, y, 100, 100), { text: String(i + 1).padStart(2, '0'), style: 'circle', fill: GOLD, color: NAVY, fontFamily: HEAD, fontSize: 40, letterSpacing: 0 }, { name: `Step ${i + 1} number`, aspect: 1, editable: false }),
            text(`item-${i + 1}-title`, 'item', P(268, y + 2, 740, 56), { text: it.title, fontFamily: HEAD, fontSize: 38, fontWeight: 700, color: CREAM, vAlign: 'middle' }, { name: `Step ${i + 1}` }),
            text(`item-${i + 1}-text`, 'item', P(268, y + 60, 740, gap - 80), { text: it.text ?? '', fontSize: 24, color: 'rgba(251, 248, 242, 0.7)', lineHeight: 1.4 }, { name: `Step ${i + 1} detail` }),
          ];
        }),
        ...cta(c.cta, P(330, 1130, 420, 80), 'outline'),
        ...footerBand(1250),
      ],
    };
  },

  testimonial: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: CREAM,
      elements: [
        ...frame(),
        ...eyebrow(c.eyebrow ?? 'What our scholars say', P(90, 86, 900, 44), GOLD, 'center'),
        shape('quote-mark', P(470, 144, 140, 120), { kind: 'quote', fill: GOLD }, { name: 'Quote mark' }),
        text('quote', 'quote', P(120, 290, 840, 420), { text: q.text, highlights: q.highlights, fontFamily: HEAD, italic: true, fontSize: 44, fontWeight: 500, lineHeight: 1.35, color: INK, align: 'center', vAlign: 'middle' }, { name: 'Quote' }),
        text('rating', 'label', P(90, 730, 900, 56), { text: c.number ?? '★★★★★', fontSize: 40, color: GOLD, align: 'center', vAlign: 'middle', letterSpacing: 8 }, { name: 'Rating' }),
        image('person-photo', 'photo', P(440, 806, 200, 200), { src: photoSrc(c.person?.photo, 'portraitWoman'), shape: 'circle', borderWidth: 6, borderColor: GOLD }, { aspect: 1, name: 'Photo' }),
        personName(c.person?.name ?? 'Student name', P(90, 1020, 900, 60), NAVY),
        personRole(c.person?.role ?? '', P(140, 1080, 800, 70), 'brand.ink/60'),
        ...footerBand(1238),
      ],
    };
  },

  event: (c) => ({
    background: NAVY,
    elements: [
      texture(),
      shape('date-block', P(72, 90, 210, 250), { fill: GOLD, radius: 4 }, { name: 'Date block' }),
      text('number', 'number', P(72, 100, 210, 150), { text: c.number ?? '12', fontFamily: HEAD, fontSize: 116, fontWeight: 800, color: NAVY, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Day' }),
      text('number-label', 'label', P(72, 256, 210, 60), { text: c.numberLabel ?? 'Oct', fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 3, color: NAVY, align: 'center', vAlign: 'middle' }, { name: 'Month' }),
      ...(c.badge ? [badge('badge', 'badge', P(318, 96, 330, 56), { text: c.badge, style: 'outline', fill: GOLD, color: GOLD, fontSize: 24, letterSpacing: 4 }, { name: 'Badge' })] : []),
      heading(c, P(318, 172, 700, 300), { color: CREAM, size: 62 }),
      ...archPhoto('photo', 'photo', photoSrc(c.person?.photo ?? c.photo, 'portraitMan'), 94, 530, 360, 470),
      ...(c.person ? [personName(c.person.name, P(510, 560, 500, 70), CREAM, 'left', 42), personRole(c.person.role, P(510, 636, 500, 100), 'rgba(251, 248, 242, 0.7)', 'left')] : []),
      ...(c.when
        ? [
            icon('when-icon', P(510, 780, 56, 56), { name: 'calendar', color: NAVY, bg: GOLD, bgShape: 'circle' }, { name: 'When icon' }),
            text('when', 'date', P(584, 780, 430, 56), { text: c.when, fontSize: 28, fontWeight: 600, color: CREAM, vAlign: 'middle' }, { name: 'When' }),
          ]
        : []),
      ...(c.where
        ? [
            icon('where-icon', P(510, 856, 56, 56), { name: 'pin', color: NAVY, bg: GOLD, bgShape: 'circle' }, { name: 'Where icon' }),
            text('where', 'label', P(584, 856, 430, 56), { text: c.where, fontSize: 26, color: 'rgba(251, 248, 242, 0.85)', vAlign: 'middle' }, { name: 'Where' }),
          ]
        : []),
      ...cta(c.cta, P(72, 1090, 936, 88), 'gold'),
      ...footerBand(1238),
    ],
  }),

  deadline: (c) => ({
    background: linear(90, [0, MAROON], [1, '#3d1716']),
    elements: [
      texture('rgba(201, 164, 92, 0.10)'),
      ...frame(),
      ...eyebrow(c.eyebrow ?? 'Deadline', P(90, 140, 900, 44), GOLD, 'center'),
      text('number', 'number', P(90, 200, 900, 420), { text: c.number ?? '3', fontFamily: HEAD, fontSize: 380, fontWeight: 800, color: CREAM, align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Big number' }),
      text('number-label', 'label', P(90, 620, 900, 60), { text: c.numberLabel ?? 'Days left', fontSize: 34, fontWeight: 600, uppercase: true, letterSpacing: 12, color: GOLD, align: 'center', vAlign: 'middle' }, { name: 'Number label' }),
      ...ornament('orn', 716),
      heading(c, P(120, 750, 840, 200), { color: CREAM, size: 56, align: 'center', vAlign: 'middle' }),
      ...sub(c.sub, P(140, 960, 800, 60), 'rgba(251, 248, 242, 0.75)', 'center', 28),
      ...cta(c.cta, P(300, 1050, 480, 84), 'gold'),
      crest(466, 1150, 150, 'light'),
    ],
  }),

  announcement: (c) => ({
    background: CREAM,
    elements: [
      ...frame(NAVY),
      crest(438, 80, 230, 'dark'),
      ...ornament('orn', 340),
      ...eyebrow(c.eyebrow ?? 'Announcement', P(90, 372, 900, 56), MAROON, 'center'),
      heading(c, P(110, 448, 860, 270), { color: NAVY, size: 68, align: 'center', vAlign: 'middle' }),
      ...body(c.body, P(130, 736, 820, 220), 'brand.ink/75', 'center', 30),
      ...sub(c.sub, P(130, 966, 820, 60), MAROON, 'center', 28),
      ...cta(c.cta, P(330, 1056, 420, 80), 'navy'),
      footerText(P(90, 1210, 900, 50), 'brand.ink/55', 'center'),
    ],
  }),

  tip: (c) => ({
    background: NAVY,
    elements: [
      texture(),
      mountain(1000),
      text('number', 'number', P(56, 40, 560, 300), { text: c.number ?? '01', fontFamily: HEAD, fontSize: 260, fontWeight: 800, color: GOLD, vAlign: 'middle', lineHeight: 1 }, { name: 'Tip number' }),
      ...eyebrow(c.eyebrow ?? 'Scholar tip', P(72, 360, 700, 44), CREAM),
      heading(c, P(72, 420, 936, 260), { color: CREAM, size: 64 }),
      shape('rule', P(72, 700, 140, 4), { fill: GOLD }, { name: 'Rule' }),
      ...(c.bullets?.length ? list(c.bullets, P(72, 740, 936, 380), 'rgba(251, 248, 242, 0.85)', '✦', 30) : body(c.body, P(72, 740, 936, 380), 'rgba(251, 248, 242, 0.85)', 'left', 32)),
      ...footerBand(1238),
    ],
  }),

  checklist: (c) => ({
    background: CREAM,
    elements: [
      image('photo', 'photo', P(560, 0, 520, 720), { src: photoSrc(c.photo, 'library') }, { name: 'Main photo' }),
      shape('photo-edge', P(552, 0, 8, 720), { fill: GOLD }, { name: 'Gold edge' }),
      crest(72, 60, 190, 'dark'),
      ...eyebrow(c.eyebrow, P(72, 300, 460, 44)),
      heading(c, P(72, 352, 460, 340), { color: NAVY, size: 62 }),
      shape('panel', P(0, 720, 1080, 630), { fill: NAVY }, { name: 'Panel' }),
      shape('panel-rule', P(0, 720, 1080, 3), { fill: GOLD }, { name: 'Panel rule' }),
      ...list(c.bullets, P(72, 780, 936, 330), CREAM, '✓', 32),
      ...cta(c.cta, P(72, 1150, 440, 82), 'gold'),
      footerText(P(540, 1150, 468, 82), 'rgba(251, 248, 242, 0.65)'),
    ],
  }),

  compare: (c) => {
    const cmp = c.compare ?? { leftTitle: 'Without', left: [], rightTitle: 'With us', right: [] };
    return {
      background: CREAM,
      elements: [
        ...frame(NAVY),
        logo(P(505, 62, 70, 70), { variant: 'mark', align: 'center' }, { aspect: 1 }),
        ...eyebrow(c.eyebrow, P(90, 140, 900, 40), GOLD, 'center'),
        heading(c, P(110, 184, 860, 180), { color: NAVY, size: 58, align: 'center', vAlign: 'middle' }),
        shape('left-card', P(72, 380, 456, 660), { fill: '#ffffff', radius: 6, stroke: 'brand.ink/12', strokeWidth: 2 }, { name: 'Left card' }),
        text('left-title', 'label', P(92, 410, 416, 60), { text: cmp.leftTitle, fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 3, color: MAROON, align: 'center', vAlign: 'middle' }, { name: 'Left title' }),
        text('left-list', 'body', P(104, 500, 392, 500), { text: cmp.left.join('\n'), fontSize: 27, color: 'brand.ink/70', bullet: '✕', bulletColor: MAROON, lineHeight: 1.35 }, { name: 'Left list' }),
        shape('right-card', P(552, 380, 456, 660), { fill: NAVY, radius: 6 }, { name: 'Right card' }),
        text('right-title', 'label', P(572, 410, 416, 60), { text: cmp.rightTitle, fontSize: 26, fontWeight: 700, uppercase: true, letterSpacing: 3, color: GOLD, align: 'center', vAlign: 'middle' }, { name: 'Right title' }),
        text('right-list', 'body', P(584, 500, 392, 500), { text: cmp.right.join('\n'), fontSize: 27, color: CREAM, bullet: '✓', bulletColor: GOLD, lineHeight: 1.35 }, { name: 'Right list' }),
        badge('vs', 'label', P(488, 660, 104, 104), { text: 'VS', style: 'circle', fill: GOLD, color: NAVY, fontFamily: HEAD, fontSize: 34, letterSpacing: 0 }, { aspect: 1, name: 'VS', editable: false }),
        ...cta(c.cta, P(330, 1080, 420, 80), 'navy'),
        footerText(P(90, 1210, 900, 50), 'brand.ink/55', 'center'),
      ],
    };
  },

  quote: (c) => {
    const q = markup(c.quote ?? c.heading ?? '');
    return {
      background: NAVY,
      elements: [
        texture(),
        ...frame(),
        shape('quote-mark', P(90, 110, 200, 180), { kind: 'quote', fill: GOLD }, { name: 'Quote mark' }),
        text('quote', 'quote', P(100, 300, 880, 540), { text: q.text, highlights: q.highlights, fontFamily: HEAD, italic: true, fontSize: 58, fontWeight: 600, lineHeight: 1.28, color: CREAM, highlightColor: GOLD, vAlign: 'middle' }, { name: 'Quote' }),
        ...ornament('orn', 890, 250),
        text('author', 'name', P(100, 924, 880, 50), { text: c.author ?? '', fontSize: 28, fontWeight: 600, uppercase: true, letterSpacing: 4, color: GOLD, vAlign: 'middle' }, { name: 'Author' }),
        ...sub(c.sub, P(100, 980, 880, 50), 'rgba(251, 248, 242, 0.6)', 'left', 24),
        crest(878, 1090, 150, 'light'),
        footerText(P(100, 1160, 700, 50), 'rgba(251, 248, 242, 0.55)', 'left'),
      ],
    };
  },

  contact: (c) => {
    const items = (c.items ?? []).slice(0, 3);
    return {
      background: NAVY,
      elements: [
        image('photo', 'photo', P(0, 0, 1080, 600), { src: photoSrc(c.photo, 'mountains'), overlay: linear(90, [0, 'rgba(31, 42, 60, 0.35)'], [0.55, 'rgba(31, 42, 60, 0.2)'], [1, NAVY]) }, { name: 'Main photo' }),
        crest(456, 70, 220, 'light'),
        ...eyebrow(c.eyebrow ?? 'Get in touch', P(90, 540, 900, 44), GOLD, 'center'),
        heading(c, P(110, 592, 860, 200), { color: CREAM, size: 64, align: 'center', vAlign: 'middle' }),
        ...sub(c.sub, P(140, 796, 800, 60), 'rgba(251, 248, 242, 0.72)', 'center', 28),
        ...items.flatMap((it, i) => {
          const y = 882 + i * 92;
          return [
            icon(`item-${i + 1}-icon`, P(250, y, 64, 64), { name: it.icon, color: NAVY, bg: GOLD, bgShape: 'circle' }, { name: `Contact ${i + 1} icon` }),
            text(`item-${i + 1}-title`, 'contact', P(336, y, 520, 64), { text: it.title, fontSize: 30, fontWeight: 500, color: CREAM, vAlign: 'middle' }, { name: `Contact ${i + 1}` }),
          ];
        }),
        ...cta(c.cta, P(300, 1170, 480, 80), 'gold'),
        footerText(P(90, 1270, 900, 44), 'rgba(251, 248, 242, 0.5)', 'center'),
      ],
    };
  },
};

export const nepalScholarSystem = layouts;
