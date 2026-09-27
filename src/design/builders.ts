/**
 * Layout authoring DSL. Layouts are plain data (proposal §9): these helpers
 * fill in defaults so each design system reads like a spec. Geometry is given
 * in pixels on the 1080 × 1350 design canvas and stored normalized.
 */
import type {
  BadgeData,
  ContactField,
  ElementRole,
  Fill,
  Frame,
  IconData,
  ImageData,
  LogoData,
  Ratio,
  ShapeData,
  TextData,
} from '../types/element';
import type { ElementSpec } from '../types/template';

export const W = 1080;
export const H = 1350;

const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Pixel box on the 1080 × 1350 canvas → normalized frame. */
export const P = (x: number, y: number, w: number, h: number): Frame => ({ x: r4(x / W), y: r4(y / H), w: r4(w / W), h: r4(h / H) });

export interface CommonOpts {
  name?: string;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  editable?: boolean;
  visible?: boolean;
  aspect?: number;
  showIf?: ContactField;
  ratios?: Partial<Record<Ratio, Partial<Frame>>>;
}

function base(id: string, role: ElementRole, frame: Frame, name: string, o: CommonOpts) {
  return {
    id,
    role,
    name: o.name ?? name,
    frame,
    ratioFrames: o.ratios ?? {},
    ...(o.aspect ? { aspect: o.aspect } : {}),
    ...(o.showIf ? { showIf: o.showIf } : {}),
    rotation: o.rotation ?? 0,
    opacity: o.opacity ?? 1,
    visible: o.visible ?? true,
    locked: o.locked ?? false,
    editable: o.editable ?? true,
  };
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

const TEXT: TextData = {
  text: '',
  highlights: [],
  fontFamily: 'brand.body',
  fontSize: 32,
  fontWeight: 500,
  italic: false,
  color: 'brand.ink',
  highlightColor: 'brand.accent',
  highlightStyle: 'color',
  align: 'left',
  vAlign: 'top',
  lineHeight: 1.3,
  letterSpacing: 0,
  uppercase: false,
  autoFit: true,
  shadow: false,
  bullet: '',
  bulletColor: 'brand.accent',
};

export function text(id: string, role: ElementRole, frame: Frame, data: Partial<TextData>, o: CommonOpts & { name: string }): ElementSpec {
  return { ...base(id, role, frame, o.name, o), type: 'text', data: { ...TEXT, ...data } };
}

/** `*word*` markup → plain text + highlight indices. */
export function markup(input: string): { text: string; highlights: number[] } {
  const highlights: number[] = [];
  let open = false;
  let index = 0;
  const lines = input.split('\n').map((line) =>
    line
      .split(/\s+/)
      .filter(Boolean)
      .map((raw) => {
        // Punctuation may sit outside the markers: “*word …*” or *word*.
        const m = /^([“"‘'(]*)(\*?)(.*?)(\*?)([.,!?;:”"’')]*)$/.exec(raw) ?? ['', '', '', raw, '', ''];
        const starts = m[2] === '*';
        const ends = m[4] === '*';
        const w = `${m[1] ?? ''}${m[3] ?? ''}${m[5] ?? ''}`;
        if (starts) open = true;
        if (open) highlights.push(index);
        if (ends) open = false;
        index++;
        return w;
      })
      .join(' '),
  );
  return { text: lines.join('\n'), highlights };
}

/* ------------------------------------------------------------------ */
/* Images, logo                                                        */
/* ------------------------------------------------------------------ */

const IMAGE: ImageData = {
  src: '',
  fit: 'cover',
  zoom: 1,
  panX: 0,
  panY: 0,
  shape: 'rect',
  radius: 0,
  borderWidth: 0,
  borderColor: '#ffffff',
  grayscale: false,
  overlay: null,
  placeholder: 'Add photo',
  shadow: false,
};

export function image(id: string, role: ElementRole, frame: Frame, data: Partial<ImageData>, o: CommonOpts & { name?: string } = {}): ElementSpec {
  return { ...base(id, role, frame, o.name ?? 'Photo', o), type: 'image', data: { ...IMAGE, ...data } };
}

const LOGO: LogoData = { variant: 'full', tone: 'dark', card: false, cardColor: '#ffffff', align: 'left' };

export function logo(frame: Frame, data: Partial<LogoData> = {}, o: CommonOpts = {}): ElementSpec {
  return { ...base('logo', 'logo', frame, 'Brand logo', { locked: true, ...o }), type: 'logo', data: { ...LOGO, ...data } };
}

/* ------------------------------------------------------------------ */
/* Shapes, badges, icons                                               */
/* ------------------------------------------------------------------ */

const SHAPE: ShapeData = { kind: 'rect', fill: 'brand.primary', radius: 0, stroke: null, strokeWidth: 0, points: [], shadow: false };

/** Decorative shape: locked and hidden from Quick Edit. */
export function shape(id: string, frame: Frame, data: Partial<ShapeData>, o: CommonOpts = {}): ElementSpec {
  return { ...base(id, 'decoration', frame, o.name ?? 'Shape', { locked: true, editable: false, ...o }), type: 'shape', data: { ...SHAPE, ...data } };
}

const BADGE: BadgeData = {
  text: '',
  style: 'pill',
  fill: 'brand.accent',
  color: '#ffffff',
  fontFamily: 'brand.body',
  fontSize: 30,
  fontWeight: 700,
  uppercase: true,
  letterSpacing: 2,
};

export function badge(id: string, role: ElementRole, frame: Frame, data: Partial<BadgeData>, o: CommonOpts & { name: string }): ElementSpec {
  return { ...base(id, role, frame, o.name, o), type: 'badge', data: { ...BADGE, ...data } };
}

const ICON: IconData = { name: 'check', color: 'brand.accent', bg: null, bgShape: 'circle', strokeWidth: 2, };

export function icon(id: string, frame: Frame, data: Partial<IconData>, o: CommonOpts = {}): ElementSpec {
  return { ...base(id, 'decoration', frame, o.name ?? 'Icon', { aspect: 1, ...o }), type: 'icon', data: { ...ICON, ...data } };
}

/* ------------------------------------------------------------------ */
/* Reusable fills                                                      */
/* ------------------------------------------------------------------ */

export const linear = (angle: number, ...stops: Array<[number, string]>): Fill => ({ type: 'linear', angle, stops });
export const radial = (cx: number, cy: number, r: number, ...stops: Array<[number, string]>): Fill => ({ type: 'radial', cx, cy, r, stops });
/** Soft coloured glow that fades to transparent. */
export const glow = (color: string): Fill => radial(0.5, 0.5, 0.5, [0, color], [1, 'rgba(0, 0, 0, 0)']);

/* ------------------------------------------------------------------ */
/* Sample photos                                                       */
/* ------------------------------------------------------------------ */

export const SAMPLE = {
  graduation: '/samples/graduation.jpg',
  graduationSky: '/samples/graduation2.jpg',
  library: '/samples/library.jpg',
  books: '/samples/books.jpg',
  students: '/samples/students.jpg',
  writing: '/samples/writing.jpg',
  laptop: '/samples/laptop.jpg',
  campus: '/samples/campus.jpg',
  conference: '/samples/conference.jpg',
  research: '/samples/research.jpg',
  portraitMan: '/samples/portrait.jpg',
  portraitWoman: '/samples/portrait2.jpg',
  analytics: '/samples/analytics.jpg',
  coffee: '/samples/coffee.jpg',
  desk: '/samples/desk.jpg',
  handshake: '/samples/handshake.jpg',
  lab: '/samples/lab.jpg',
  mountains: '/samples/mountains.jpg',
  notes: '/samples/notes.jpg',
  online: '/samples/online.jpg',
  portraitMan2: '/samples/portrait3.jpg',
  portraitWoman2: '/samples/portrait4.jpg',
  reader: '/samples/reader.jpg',
  studying: '/samples/studying.jpg',
  team: '/samples/team.jpg',
  travel: '/samples/travel.jpg',
  seminar: '/samples/seminar.jpg',
} as const;

export type SampleKey = keyof typeof SAMPLE;

/** Resolves a sample key (or passes through a path/URL). */
export const photoSrc = (p: string | undefined, fallback: SampleKey): string =>
  p ? ((SAMPLE as Record<string, string>)[p] ?? p) : SAMPLE[fallback];
