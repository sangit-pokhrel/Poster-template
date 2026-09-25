/**
 * Template authoring DSL. Templates are plain data (proposal §9): these helpers
 * only fill in sensible defaults so each template reads like a layout spec.
 *
 * Geometry helpers take pixels on the design canvas and return normalized frames.
 */
import type {
  BadgeData,
  ElementRole,
  Frame,
  ImageData,
  LogoData,
  Ratio,
  ShapeData,
  TextData,
} from '../../types/element';
import type { ElementSpec, TemplateDefinition } from '../../types/template';

export type Grid = (x: number, y: number, w: number, h: number) => Frame;

/** `grid(1080, 1350)(64, 900, 952, 200)` → normalized frame. */
export function grid(width: number, height: number): Grid {
  const r = (v: number) => Math.round(v * 10_000) / 10_000;
  return (x, y, w, h) => ({ x: r(x / width), y: r(y / height), w: r(w / width), h: r(h / height) });
}

export const G = {
  square: grid(1080, 1080),
  portrait: grid(1080, 1350),
  landscape: grid(1080, 608),
  story: grid(1080, 1920),
};

interface CommonOpts {
  name?: string;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  editable?: boolean;
  visible?: boolean;
  aspect?: number;
  ratios?: Partial<Record<Ratio, Partial<Frame>>>;
}

function base(id: string, role: ElementRole, frame: Frame, fallbackName: string, o: CommonOpts) {
  return {
    id,
    role,
    name: o.name ?? fallbackName,
    frame,
    ratioFrames: o.ratios ?? {},
    ...(o.aspect ? { aspect: o.aspect } : {}),
    rotation: o.rotation ?? 0,
    opacity: o.opacity ?? 1,
    visible: o.visible ?? true,
    locked: o.locked ?? false,
    editable: o.editable ?? true,
  };
}

const ROLE_LABEL: Partial<Record<ElementRole, string>> = {
  heading: 'Heading',
  subheading: 'Sub-heading',
  body: 'Body text',
  name: 'Name',
  date: 'Date',
  footer: 'Footer',
  quote: 'Quote',
  label: 'Label',
  number: 'Big number',
  cta: 'Call to action',
  badge: 'Badge',
  photo: 'Main photo',
  photo2: 'Photo 2',
  photo3: 'Photo 3',
  photo4: 'Photo 4',
};

const TEXT_DEFAULTS: TextData = {
  text: '',
  highlights: [],
  fontFamily: 'brand.body',
  fontSize: 36,
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
};

export function text(id: string, role: ElementRole, frame: Frame, data: Partial<TextData>, o: CommonOpts = {}): ElementSpec {
  return { ...base(id, role, frame, ROLE_LABEL[role] ?? 'Text', o), type: 'text', data: { ...TEXT_DEFAULTS, ...data } };
}

/** Heading preset: brand heading font, bold, tight leading, auto-fit. */
export function heading(frame: Frame, data: Partial<TextData>, o: CommonOpts = {}): ElementSpec {
  return text('heading', 'heading', frame, { fontFamily: 'brand.heading', fontSize: 76, fontWeight: 700, lineHeight: 1.12, ...data }, o);
}

export function date(frame: Frame, data: Partial<TextData> = {}, o: CommonOpts = {}): ElementSpec {
  return text('date', 'date', frame, { text: '{date}', fontSize: 26, fontWeight: 600, ...data }, o);
}

export function footer(frame: Frame, data: Partial<TextData> = {}, o: CommonOpts = {}): ElementSpec {
  return text(
    'footer',
    'footer',
    frame,
    { text: '{handle}  •  {phone}  •  {website}', fontSize: 24, fontWeight: 500, vAlign: 'middle', autoFit: true, ...data },
    o,
  );
}

const IMAGE_DEFAULTS: ImageData = {
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
};

export function image(id: string, role: ElementRole, frame: Frame, data: Partial<ImageData>, o: CommonOpts = {}): ElementSpec {
  return { ...base(id, role, frame, ROLE_LABEL[role] ?? 'Photo', o), type: 'image', data: { ...IMAGE_DEFAULTS, ...data } };
}

export function photo(frame: Frame, data: Partial<ImageData>, o: CommonOpts = {}): ElementSpec {
  return image('photo', 'photo', frame, data, o);
}

const LOGO_DEFAULTS: LogoData = { variant: 'full', tone: 'dark', card: false, cardColor: '#ffffff', align: 'left' };

/** Brand logo — locked by default so layouts stay on-brand (proposal §20). */
export function logo(frame: Frame, data: Partial<LogoData> = {}, o: CommonOpts = {}): ElementSpec {
  return { ...base('logo', 'logo', frame, 'Brand logo', { locked: true, ...o }), type: 'logo', data: { ...LOGO_DEFAULTS, ...data } };
}

const SHAPE_DEFAULTS: ShapeData = { kind: 'rect', fill: 'brand.primary', radius: 0, stroke: null, strokeWidth: 0 };

/** Decorative shape — locked and hidden from Quick Edit by default. */
export function shape(id: string, frame: Frame, data: Partial<ShapeData>, o: CommonOpts = {}): ElementSpec {
  return {
    ...base(id, 'decoration', frame, o.name ?? 'Shape', { locked: true, editable: false, ...o }),
    type: 'shape',
    data: { ...SHAPE_DEFAULTS, ...data },
  };
}

const BADGE_DEFAULTS: BadgeData = {
  text: 'NEW',
  style: 'pill',
  fill: 'brand.accent',
  color: '#ffffff',
  fontFamily: 'brand.body',
  fontSize: 30,
  fontWeight: 700,
  uppercase: true,
  letterSpacing: 2,
};

export function badge(id: string, role: ElementRole, frame: Frame, data: Partial<BadgeData>, o: CommonOpts = {}): ElementSpec {
  return { ...base(id, role, frame, ROLE_LABEL[role] ?? 'Badge', o), type: 'badge', data: { ...BADGE_DEFAULTS, ...data } };
}

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
} as const;

export function defineTemplate(t: TemplateDefinition): TemplateDefinition {
  return t;
}
