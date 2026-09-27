/**
 * Building blocks for the shared "studio" designs recreated from the team's
 * Canva references (design-references/). Every colour is a palette token, so
 * the same layout is recoloured by each brand's daily theme:
 *
 *   D  brand.primary    dark base (navy / indigo / charcoal)
 *   M  brand.secondary  supporting mid tone
 *   A  brand.accent     bright pop (gold / yellow / cyan) — fills, dark backgrounds
 *   POP brand.pop       the accent darkened to read on white
 */
import type { Fill, ImageData } from '../../types/element';
import type { AdContent, AdDefinition, AdItem, ElementSpec, Layout } from '../../types/template';
import { P, badge, icon, image, linear, logo, markup, shape, text } from '../builders';

export const D = 'brand.primary';
export const M = 'brand.secondary';
export const A = 'brand.accent';
export const POP = 'brand.pop';
export const INK = 'brand.ink';
export const PAPER = 'brand.paper';
export const WHITE = '#ffffff';

export type Tone = 'light' | 'dark';
export type Align = 'left' | 'center' | 'right';
export type F = ReturnType<typeof P>;

export const FONT = {
  serif: 'Playfair Display',
  heavy: 'Montserrat',
  sans: 'Poppins',
  cond: 'Oswald',
  script: 'Caveat',
  clean: 'Inter',
} as const;
export type FontKey = keyof typeof FONT;

export const fg = (t: Tone) => (t === 'dark' ? WHITE : INK);
export const soft = (t: Tone, a = 72) => (t === 'dark' ? `rgba(255, 255, 255, ${a / 100})` : `brand.ink/${a}`);
/** Highlight colour that reads on the tone. */
export const hl = (t: Tone) => (t === 'dark' ? A : POP);
/** Mirror a pixel x-range on the 1080 canvas. */
export const mx = (flip: boolean, x: number, w: number) => (flip ? 1080 - x - w : x);

/* ------------------------------------------------------------------ */
/* Backgrounds                                                         */
/* ------------------------------------------------------------------ */

export const bgFor = (t: Tone): Fill => (t === 'dark' ? D : '#ffffff');
export const paperBg: Fill = PAPER;
export const tintBg: Fill = linear(90, [0, '#ffffff'], [1, PAPER]);
export const deepBg: Fill = linear(150, [0, D], [1, 'brand.secondary']);

/* ------------------------------------------------------------------ */
/* Header / tags                                                       */
/* ------------------------------------------------------------------ */

/** Logo lockup, optionally with a stacked tagline after a hairline (e.g. "RESEARCH FOR A | BRIGHTER | TOMORROW"). */
export function brandHeader(tone: Tone, x = 60, y = 50, o: { w?: number; h?: number; tag?: string; align?: Align } = {}): ElementSpec[] {
  const w = o.w ?? 340;
  const h = o.h ?? 86;
  const out: ElementSpec[] = [logo(P(x, y, w, h), { variant: 'lockup', tone: tone === 'dark' ? 'light' : 'dark', align: o.align ?? 'left' })];
  if (o.tag) out.push(...cornerTag(o.tag, P(x + w + 26, y + 6, 220, h - 12), tone));
  return out;
}

/** Small stacked uppercase tag with a hairline on its left. */
export function cornerTag(t: string, f: F, tone: Tone, id = 'tag'): ElementSpec[] {
  return [
    shape(`${id}-rule`, { ...f, w: 2 / 1080 }, { fill: soft(tone, 35) }, { name: 'Hairline' }),
    text(id, 'label', { ...f, x: f.x + 18 / 1080, w: f.w - 18 / 1080 }, { text: t, fontFamily: FONT.clean, fontSize: 16, fontWeight: 600, letterSpacing: 3, uppercase: true, color: soft(tone, 70), lineHeight: 1.35, vAlign: 'middle' }, { name: 'Corner tag' }),
  ];
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

export interface HeadOpts {
  font?: FontKey;
  size: number;
  tone: Tone;
  color?: string;
  hlColor?: string;
  hlStyle?: 'color' | 'marker';
  align?: Align;
  vAlign?: 'top' | 'middle' | 'bottom';
  weight?: number;
  upper?: boolean;
  lh?: number;
  ls?: number;
  italic?: boolean;
  shadow?: boolean;
}

export function headline(src: string | undefined, f: F, o: HeadOpts, id = 'heading', role: 'heading' | 'subheading' | 'quote' = 'heading'): ElementSpec {
  const m = markup(src ?? '');
  const font = o.font ?? 'heavy';
  return text(
    id,
    role,
    f,
    {
      text: m.text,
      highlights: m.highlights,
      fontFamily: FONT[font],
      fontSize: o.size,
      fontWeight: o.weight ?? (font === 'serif' ? 800 : font === 'cond' ? 700 : font === 'script' ? 700 : 900),
      italic: o.italic ?? false,
      lineHeight: o.lh ?? (font === 'script' ? 1.05 : 1.06),
      letterSpacing: o.ls ?? (font === 'heavy' ? -1.5 : font === 'cond' ? 0.5 : -0.5),
      color: o.color ?? fg(o.tone),
      highlightColor: o.hlColor ?? hl(o.tone),
      highlightStyle: o.hlStyle ?? 'color',
      align: o.align ?? 'left',
      vAlign: o.vAlign ?? 'top',
      uppercase: o.upper ?? false,
      shadow: o.shadow ?? false,
    },
    { name: role === 'heading' ? 'Heading' : role === 'quote' ? 'Quote' : 'Sub-heading' },
  );
}

export interface ParaOpts {
  tone: Tone;
  size?: number;
  font?: FontKey;
  weight?: number;
  color?: string;
  align?: Align;
  vAlign?: 'top' | 'middle' | 'bottom';
  lh?: number;
  italic?: boolean;
  upper?: boolean;
  ls?: number;
}

/** Paragraph text; `*word*` markup is highlighted. Nothing is emitted for empty text. */
export function para(id: string, role: 'subheading' | 'body' | 'label' | 'quote' | 'name', t: string | undefined, f: F, o: ParaOpts, name?: string): ElementSpec[] {
  if (!t) return [];
  const m = markup(t);
  return [
    text(
      id,
      role,
      f,
      {
        text: m.text,
        highlights: m.highlights,
        fontFamily: FONT[o.font ?? 'sans'],
        fontSize: o.size ?? 28,
        fontWeight: o.weight ?? 400,
        italic: o.italic ?? false,
        color: o.color ?? soft(o.tone, 78),
        highlightColor: hl(o.tone),
        align: o.align ?? 'left',
        vAlign: o.vAlign ?? 'top',
        lineHeight: o.lh ?? 1.4,
        uppercase: o.upper ?? false,
        letterSpacing: o.ls ?? 0,
      },
      { name: name ?? (role === 'subheading' ? 'Sub-heading' : role === 'body' ? 'Body text' : role === 'quote' ? 'Quote' : role === 'name' ? 'Name' : 'Label') },
    ),
  ];
}

export const sub = (c: AdContent, f: F, o: ParaOpts) => para('sub', 'subheading', c.sub, f, o);
export const body = (c: AdContent, f: F, o: ParaOpts) => para('body', 'body', c.body, f, o);

/** Handwritten note (Caveat). */
export function script(id: string, t: string | undefined, f: F, color: string, size = 44, rotation = 0, align: Align = 'left'): ElementSpec[] {
  if (!t) return [];
  const m = markup(t);
  return [text(id, 'label', f, { text: m.text, highlights: m.highlights, fontFamily: FONT.script, fontSize: size, fontWeight: 700, color, highlightColor: POP, lineHeight: 1.05, align, vAlign: 'middle' }, { name: 'Handwritten note', rotation })];
}

/** Bulleted list with a hanging indent. */
export function bullets(items: string[] | undefined, f: F, o: ParaOpts & { bullet?: string; bulletColor?: string }, id = 'list'): ElementSpec[] {
  if (!items?.length) return [];
  return [
    text(
      id,
      'body',
      f,
      {
        text: items.join('\n'),
        fontFamily: FONT[o.font ?? 'sans'],
        fontSize: o.size ?? 28,
        fontWeight: o.weight ?? 500,
        color: o.color ?? fg(o.tone),
        lineHeight: o.lh ?? 1.35,
        bullet: o.bullet ?? '✓',
        bulletColor: o.bulletColor ?? hl(o.tone),
        align: o.align ?? 'left',
        vAlign: o.vAlign ?? 'top',
        uppercase: o.upper ?? false,
      },
      { name: 'List' },
    ),
  ];
}

/* ------------------------------------------------------------------ */
/* Buttons, pills, badges                                              */
/* ------------------------------------------------------------------ */

export type Pill = 'dark' | 'accent' | 'white' | 'mid' | 'outline' | 'soft' | 'glass';

const PILL_FILL: Record<Pill, [fill: string, color: string]> = {
  dark: [D, WHITE],
  accent: [A, INK],
  white: [WHITE, D],
  mid: [M, WHITE],
  outline: [WHITE, D],
  soft: ['brand.primary/12', D],
  glass: ['rgba(255, 255, 255, 0.16)', WHITE],
};

/** Call-to-action pill; `arrow` appends →. */
export function cta(t: string | undefined, f: F, kind: Pill = 'dark', o: { arrow?: boolean; size?: number; upper?: boolean; square?: boolean } = {}): ElementSpec[] {
  if (!t) return [];
  const [fill, color] = PILL_FILL[kind];
  return [
    badge(
      'cta',
      'cta',
      f,
      {
        text: o.arrow === false ? t : `${t}  →`,
        style: kind === 'outline' ? 'outline' : o.square ? 'tag' : 'pill',
        fill: kind === 'outline' ? D : fill,
        color: kind === 'outline' ? D : color,
        fontFamily: FONT.sans,
        fontSize: o.size ?? 26,
        fontWeight: 700,
        uppercase: o.upper ?? false,
        letterSpacing: o.upper ? 2 : 0.5,
        ...(o.square ? { radius: 10 } : {}),
      },
      { name: 'Call to action' },
    ),
  ];
}

/** Label chip such as "BENEFITS" or "Publish in Reputed Journals". */
export function chip(id: string, t: string | undefined, f: F, kind: Pill = 'accent', o: { size?: number; upper?: boolean; font?: FontKey; rotation?: number; square?: boolean; role?: 'label' | 'badge' } = {}): ElementSpec[] {
  if (!t) return [];
  const [fill, color] = PILL_FILL[kind];
  return [
    badge(
      id,
      o.role ?? 'label',
      f,
      {
        text: t,
        style: kind === 'outline' ? 'outline' : o.square ? 'tag' : 'pill',
        fill: kind === 'outline' ? D : fill,
        color: kind === 'outline' ? D : color,
        fontFamily: FONT[o.font ?? 'sans'],
        fontSize: o.size ?? 22,
        fontWeight: 700,
        uppercase: o.upper ?? false,
        letterSpacing: o.upper ? 2 : 0,
        ...(o.square ? { radius: 8 } : {}),
      },
      { name: id === 'badge' ? 'Badge' : 'Label', rotation: o.rotation ?? 0 },
    ),
  ];
}

/** Round seal: a disc with the ad's `badge` text on several lines. */
export function stamp(t: string | undefined, f: F, fill: string, color: string, size = 30, ring?: string): ElementSpec[] {
  if (!t) return [];
  return [
    shape('badge-disc', f, { kind: 'ellipse', fill, stroke: ring ?? null, strokeWidth: ring ? 6 : 0, shadow: true }, { name: 'Seal', aspect: 1 }),
    text('badge', 'badge', { x: f.x + f.w * 0.14, y: f.y + f.h * 0.14, w: f.w * 0.72, h: f.h * 0.72 }, { text: t, fontFamily: FONT.heavy, fontSize: size, fontWeight: 900, color, align: 'center', vAlign: 'middle', uppercase: true, lineHeight: 1.05 }, { name: 'Badge' }),
  ];
}

/** Starburst / seal badge carrying the ad's `badge` text. */
export function seal(t: string | undefined, f: F, kind: 'burst' | 'circle' = 'burst', fill = A, color = INK, rotation = -8, size = 34): ElementSpec[] {
  if (!t) return [];
  return [badge('badge', 'badge', f, { text: t, style: kind, fill, color, fontFamily: FONT.heavy, fontSize: size, fontWeight: 900, letterSpacing: 0 }, { name: 'Badge', aspect: 1, rotation })];
}

/* ------------------------------------------------------------------ */
/* Photos                                                              */
/* ------------------------------------------------------------------ */

export function photo(src: string, f: F, data: Partial<ImageData> = {}, id: 'photo' | 'photo2' | 'photo3' = 'photo'): ElementSpec {
  return image(id, id, f, { src, ...data }, { name: id === 'photo' ? 'Main photo' : 'Photo' });
}

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

export type IconStyle = 'circle' | 'tile' | 'ring' | 'bare' | 'soft';

export function itemIcon(i: number, name: string, f: F, style: IconStyle, tone: Tone): ElementSpec {
  const n = i + 1;
  const look: Record<IconStyle, { color: string; bg: Fill | null; bgShape: 'circle' | 'rounded' }> = {
    circle: { color: tone === 'dark' ? INK : WHITE, bg: tone === 'dark' ? A : D, bgShape: 'circle' },
    tile: { color: WHITE, bg: linear(135, [0, D], [1, M]), bgShape: 'rounded' },
    ring: { color: tone === 'dark' ? A : D, bg: tone === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'brand.primary/8', bgShape: 'circle' },
    bare: { color: tone === 'dark' ? A : D, bg: null, bgShape: 'circle' },
    soft: { color: POP, bg: 'brand.accent/18', bgShape: 'circle' },
  };
  return icon(`item-${n}-icon`, f, { name, ...look[style], strokeWidth: 2 }, { name: `Item ${n} icon` });
}

export interface GridOpts {
  cols: number;
  tone: Tone;
  /** Card behind each item. */
  card?: 'white' | 'outline' | 'glass' | 'tint' | 'none';
  icon?: IconStyle;
  /** Icon above the title (centered) or to its left. */
  layout?: 'stack' | 'row';
  titleSize?: number;
  textSize?: number;
  titleFont?: FontKey;
  titleColor?: string;
  gap?: number;
  number?: boolean;
  radius?: number;
  iconSize?: number;
  max?: number;
  /** Offset for element ids when a design has two item groups. */
  from?: number;
}

/** Grid of service/feature cards: icon + title + detail. */
export function itemGrid(items: AdItem[] | undefined, area: { x: number; y: number; w: number; h: number }, o: GridOpts): ElementSpec[] {
  const list = (items ?? []).slice(0, o.max ?? 8);
  if (!list.length) return [];
  const cols = Math.min(o.cols, list.length);
  const rows = Math.ceil(list.length / cols);
  const gap = o.gap ?? 18;
  const cw = (area.w - gap * (cols - 1)) / cols;
  const ch = (area.h - gap * (rows - 1)) / rows;
  const layout = o.layout ?? 'row';
  const card = o.card ?? 'white';
  const ts = o.titleSize ?? 26;
  const xs = o.textSize ?? 19;
  const is = o.iconSize ?? Math.min(layout === 'row' ? 64 : 76, ch * 0.5);
  const pad = card === 'none' ? 0 : 20;
  const cardFill: Record<string, [string, string | null]> = {
    white: [WHITE, 'brand.ink/10'],
    outline: ['rgba(255, 255, 255, 0)', o.tone === 'dark' ? 'rgba(255, 255, 255, 0.35)' : 'brand.primary/35'],
    glass: ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.22)'],
    tint: ['brand.primary/6', null],
  };
  const titleColor = o.titleColor ?? (card === 'white' ? INK : fg(o.tone));
  const textColor = card === 'white' ? 'brand.ink/65' : soft(o.tone, 70);
  return list.flatMap((it, idx) => {
    const i = idx + (o.from ?? 0);
    const n = i + 1;
    const x = area.x + (idx % cols) * (cw + gap);
    const y = area.y + Math.floor(idx / cols) * (ch + gap);
    const out: ElementSpec[] = [];
    const cf = cardFill[card];
    if (cf) out.push(shape(`item-${n}-card`, P(x, y, cw, ch), { fill: cf[0], stroke: cf[1], strokeWidth: cf[1] ? 2 : 0, radius: o.radius ?? 18, shadow: card === 'white' }, { name: `Card ${n}` }));
    if (o.number) out.push(...chip(`item-${n}-no`, String(n).padStart(2, '0'), P(x + pad - 6, y + pad - 8, 52, 34), 'accent', { size: 16 }));
    if (layout === 'stack') {
      const top = y + pad + (o.number ? 18 : 0);
      out.push(itemIcon(i, it.icon, P(x + cw / 2 - is / 2, top, is, is), o.icon ?? 'soft', o.tone));
      out.push(text(`item-${n}-title`, 'item', P(x + 8, top + is + 10, cw - 16, ts * 2.5), { text: it.title, fontFamily: FONT[o.titleFont ?? 'sans'], fontSize: ts, fontWeight: 700, color: titleColor, align: 'center', lineHeight: 1.15 }, { name: `Item ${n}` }));
      if (it.text) {
        const ty = top + is + 10 + ts * 2.5;
        out.push(text(`item-${n}-text`, 'item', P(x + 10, ty, cw - 20, Math.max(30, y + ch - ty - 8)), { text: it.text, fontFamily: FONT.sans, fontSize: xs, color: textColor, align: 'center', lineHeight: 1.35 }, { name: `Item ${n} detail` }));
      }
    } else {
      const ix = x + pad;
      const iy = y + (it.text ? pad : (ch - is) / 2);
      out.push(itemIcon(i, it.icon, P(ix, iy, is, is), o.icon ?? 'circle', o.tone));
      const tx = ix + is + 16;
      const tw = x + cw - tx - pad / 2;
      const titleH = it.text ? Math.min(ts * 2.4, ch * 0.45) : ch - 2 * pad;
      out.push(text(`item-${n}-title`, 'item', P(tx, it.text ? y + pad - 2 : y + pad, tw, titleH), { text: it.title, fontFamily: FONT[o.titleFont ?? 'sans'], fontSize: ts, fontWeight: 700, color: titleColor, lineHeight: 1.15, vAlign: it.text ? 'top' : 'middle' }, { name: `Item ${n}` }));
      if (it.text) out.push(text(`item-${n}-text`, 'item', P(tx, y + pad + titleH + 2, tw, Math.max(30, ch - titleH - pad * 1.6)), { text: it.text, fontFamily: FONT.sans, fontSize: xs, color: textColor, lineHeight: 1.35 }, { name: `Item ${n} detail` }));
    }
    return out;
  });
}

/** One row of small icon + label features, optionally separated by hairlines. */
export function iconRow(items: AdItem[] | undefined, area: { x: number; y: number; w: number; h: number }, o: { tone: Tone; icon?: IconStyle; size?: number; dividers?: boolean; labelColor?: string; iconSize?: number; max?: number; from?: number }): ElementSpec[] {
  const list = (items ?? []).slice(0, o.max ?? 5);
  if (!list.length) return [];
  const cw = area.w / list.length;
  const is = o.iconSize ?? Math.min(66, area.h * 0.5);
  return list.flatMap((it, idx) => {
    const i = idx + (o.from ?? 0);
    const n = i + 1;
    const x = area.x + idx * cw;
    return [
      itemIcon(i, it.icon, P(x + cw / 2 - is / 2, area.y, is, is), o.icon ?? 'soft', o.tone),
      text(`item-${n}-title`, 'item', P(x + 6, area.y + is + 8, cw - 12, area.h - is - 8), { text: it.title, fontFamily: FONT.sans, fontSize: o.size ?? 19, fontWeight: 600, color: o.labelColor ?? fg(o.tone), align: 'center', lineHeight: 1.2 }, { name: `Item ${n}` }),
      ...(o.dividers && idx > 0 ? [shape(`item-${n}-rule`, P(x, area.y + 6, 2, area.h - 12), { fill: soft(o.tone, 20) }, { name: 'Divider' })] : []),
    ];
  });
}

/** Vertical list: icon + title (+ detail) per row. */
export function iconList(items: AdItem[] | undefined, area: { x: number; y: number; w: number; h: number }, o: { tone: Tone; icon?: IconStyle; titleSize?: number; textSize?: number; titleColor?: string; iconSize?: number; max?: number; titleFont?: FontKey; upper?: boolean; from?: number }): ElementSpec[] {
  const list = (items ?? []).slice(0, o.max ?? 6);
  if (!list.length) return [];
  const rh = area.h / list.length;
  const is = o.iconSize ?? Math.min(62, rh * 0.8);
  const ts = o.titleSize ?? 25;
  return list.flatMap((it, idx) => {
    const i = idx + (o.from ?? 0);
    const n = i + 1;
    const y = area.y + idx * rh;
    const tx = area.x + is + 20;
    const tw = area.w - is - 20;
    const hasText = Boolean(it.text);
    return [
      itemIcon(i, it.icon, P(area.x, y + (rh - is) / 2, is, is), o.icon ?? 'circle', o.tone),
      text(`item-${n}-title`, 'item', P(tx, hasText ? y + rh * 0.08 : y, tw, hasText ? rh * 0.42 : rh), { text: it.title, fontFamily: FONT[o.titleFont ?? 'sans'], fontSize: ts, fontWeight: 700, color: o.titleColor ?? fg(o.tone), lineHeight: 1.15, vAlign: hasText ? 'bottom' : 'middle', uppercase: o.upper ?? false, letterSpacing: o.upper ? 1 : 0 }, { name: `Item ${n}` }),
      ...(hasText ? [text(`item-${n}-text`, 'item', P(tx, y + rh * 0.52, tw, rh * 0.46), { text: it.text ?? '', fontFamily: FONT.sans, fontSize: o.textSize ?? 19, color: soft(o.tone, 68), lineHeight: 1.3 }, { name: `Item ${n} detail` })] : []),
    ];
  });
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

type Field = 'phone' | 'email' | 'website' | 'address';
const FIELD_ICON: Record<Field, string> = { phone: 'phone', email: 'mail', website: 'globe', address: 'pin' };

/**
 * Contact strip: icon + value for each field, evenly spaced. Fields left blank
 * in the brand kit are not drawn (their icon disappears too).
 */
export function contactRow(area: { x: number; y: number; w: number; h: number }, o: { tone: Tone; fields?: Field[]; size?: number; iconBg?: string; iconColor?: string; color?: string; widths?: number[] }): ElementSpec[] {
  const fields = o.fields ?? ['phone', 'website', 'address'];
  const is = Math.min(44, area.h * 0.72);
  const weights = o.widths ?? fields.map((f) => (f === 'phone' ? 0.8 : 1.1));
  const total = weights.reduce((a, b) => a + b, 0);
  let x = area.x;
  return fields.flatMap((field, i) => {
    const w = (area.w * (weights[i] ?? 1)) / total;
    const cx = x;
    x += w;
    return [
      icon(`contact-${field}-icon`, P(cx, area.y + (area.h - is) / 2, is, is), { name: FIELD_ICON[field], color: o.iconColor ?? (o.tone === 'dark' ? INK : WHITE), bg: o.iconBg ?? (o.tone === 'dark' ? A : D), bgShape: 'circle', strokeWidth: 2 }, { name: `${field} icon`, showIf: field, locked: true }),
      text(`contact-${field}`, 'footer', P(cx + is + 10, area.y, w - is - 18, area.h), { text: `{${field}}`, fontFamily: FONT.sans, fontSize: o.size ?? 20, fontWeight: 600, color: o.color ?? fg(o.tone), vAlign: 'middle', lineHeight: 1.15 }, { name: `Footer ${field}`, showIf: field }),
    ];
  });
}

/** Full-width footer bar with contacts. */
export function footerBar(tone: Tone, o: { y?: number; h?: number; fields?: Field[]; fill?: Fill; inset?: number; radius?: number; size?: number } = {}): ElementSpec[] {
  const y = o.y ?? 1262;
  const h = o.h ?? 88;
  const inset = o.inset ?? 0;
  const barTone: Tone = tone === 'dark' ? 'light' : 'dark';
  return [
    shape('footer-bar', P(inset, y, 1080 - inset * 2, h), { fill: o.fill ?? (tone === 'dark' ? WHITE : D), radius: o.radius ?? 0 }, { name: 'Footer bar' }),
    ...contactRow({ x: inset + 40, y: y + h * 0.16, w: 1080 - inset * 2 - 70, h: h * 0.68 }, { tone: barTone, ...(o.fields ? { fields: o.fields } : {}), ...(o.size ? { size: o.size } : {}) }),
  ];
}

/** Decorative dots pattern. */
export const dots = (id: string, f: F, color: string) => shape(id, f, { kind: 'dots', fill: color }, { name: 'Dots' });
/** Soft blob behind a photo. */
export const blob = (id: string, f: F, fill: Fill) => shape(id, f, { kind: 'ellipse', fill }, { name: 'Blob' });
/** Rounded panel / band. */
export const panel = (id: string, f: F, fill: Fill, radius = 0, o: { stroke?: string; shadow?: boolean; name?: string; rotation?: number } = {}) =>
  shape(id, f, { fill, radius, stroke: o.stroke ?? null, strokeWidth: o.stroke ? 2 : 0, shadow: o.shadow ?? false }, { name: o.name ?? 'Panel', ...(o.rotation ? { rotation: o.rotation } : {}) });

/* ------------------------------------------------------------------ */
/* Design entries                                                      */
/* ------------------------------------------------------------------ */

/** How the second variation of a reference differs from the first. */
export interface Variant {
  tone: Tone;
  flip: boolean;
}

export const V1: Variant = { tone: 'light', flip: false };
export const V2: Variant = { tone: 'dark', flip: true };

/** A shared design: an ad whose layout is the same for every brand (recoloured by the theme). */
export interface StudioEntry {
  /** Reference image number in design-references/. */
  ref: number;
  ad: AdDefinition;
  build: (c: AdContent) => Layout;
}

export function entry(ref: number, ad: Omit<AdDefinition, 'design'>, build: (c: AdContent) => Layout): StudioEntry {
  return { ref, ad: { ...ad, design: ad.id }, build };
}

/** Flattens element groups into a layout. */
export const layout = (background: Fill, ...groups: Array<ElementSpec | ElementSpec[]>): Layout => ({ background, elements: groups.flat() });
