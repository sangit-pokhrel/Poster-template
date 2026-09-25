/**
 * Poster elements (proposal §9, §29). A poster is an ordered list of elements;
 * array order is layer order (index 0 = bottom).
 *
 * Geometry is stored in normalized canvas coordinates (0..1) so switching the
 * aspect ratio never destroys a design (proposal §14, §32). Font sizes are in
 * logical pixels on the 1080-wide canvas, which is the same for every ratio.
 */

export type Ratio = '1:1' | '4:5' | '16:9' | '9:16';

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A colour is either a literal (`#1f2a3c`, `rgba(…)`) or a brand token:
 * `brand.primary` | `brand.secondary` | `brand.accent` | `brand.ink` | `brand.paper`,
 * optionally with alpha: `brand.primary/40` (40 % opacity).
 */
export type ColorValue = string;

export interface LinearGradient {
  type: 'linear';
  /** Degrees; 0 = left→right, 90 = top→bottom. */
  angle: number;
  stops: Array<[offset: number, color: ColorValue]>;
}

export type Fill = ColorValue | LinearGradient;

/** Semantic role: drives Quick Edit labels and content carry-over between templates. */
export type ElementRole =
  | 'background'
  | 'decoration'
  | 'photo'
  | 'photo2'
  | 'photo3'
  | 'photo4'
  | 'logo'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'name'
  | 'date'
  | 'badge'
  | 'cta'
  | 'footer'
  | 'quote'
  | 'label'
  | 'number';

export interface TextData {
  /** May contain tokens: {brand} {tagline} {website} {handle} {phone} {email} {date}. */
  text: string;
  /** Word indices (see `tokenizeWords`) drawn in the highlight style. */
  highlights: number[];
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  color: ColorValue;
  highlightColor: ColorValue;
  highlightStyle: 'color' | 'marker';
  align: 'left' | 'center' | 'right';
  vAlign: 'top' | 'middle' | 'bottom';
  lineHeight: number;
  /** Extra tracking in px. */
  letterSpacing: number;
  uppercase: boolean;
  /** Shrink the font (down to 50 %) until the text fits the box. */
  autoFit: boolean;
  shadow: boolean;
}

export type ImageShape = 'rect' | 'circle' | 'arch';

export interface ImageData {
  /** `asset:<id>` (IndexedDB), same-origin path, or CORS-enabled URL. Empty = placeholder. */
  src: string;
  fit: 'cover' | 'contain';
  /** 1 = fit exactly; up to 3. */
  zoom: number;
  /** Pan as a fraction of the frame size (-1..1). */
  panX: number;
  panY: number;
  shape: ImageShape;
  radius: number;
  borderWidth: number;
  borderColor: ColorValue;
  grayscale: boolean;
  /** Colour/gradient drawn over the photo inside its frame (e.g. a fade to paper). */
  overlay: Fill | null;
  placeholder: string;
}

export interface LogoData {
  variant: 'full' | 'mark';
  /** `light` uses the brand's light artwork (or a card when none exists). */
  tone: 'dark' | 'light';
  card: boolean;
  cardColor: ColorValue;
  align: 'left' | 'center' | 'right';
}

export type ShapeKind = 'rect' | 'ellipse' | 'line' | 'triangle' | 'dots' | 'quote' | 'stripes';

export interface ShapeData {
  kind: ShapeKind;
  fill: Fill;
  radius: number;
  stroke: ColorValue | null;
  strokeWidth: number;
}

export type BadgeStyle = 'pill' | 'tag' | 'outline' | 'ribbon' | 'circle' | 'underline';

export interface BadgeData {
  text: string;
  style: BadgeStyle;
  fill: ColorValue;
  color: ColorValue;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  uppercase: boolean;
  letterSpacing: number;
}

interface ElementBase {
  id: string;
  role: ElementRole;
  /** Label in the layer list and Quick Edit. */
  name: string;
  /** Base (template) frame for the template's design. */
  frame: Frame;
  /** Template-provided adjustments per aspect ratio. */
  ratioFrames: Partial<Record<Ratio, Partial<Frame>>>;
  /** Frames the user set by dragging/resizing, per ratio. Wins over the template's. */
  userFrames: Partial<Record<Ratio, Frame>>;
  /**
   * Pixel aspect (w/h) to preserve in every ratio — keeps circles circular when
   * normalized frames are stretched by a different canvas height.
   */
  aspect?: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  /** Locked elements cannot be moved or selected on the canvas (proposal §20). */
  locked: boolean;
  /** Editable elements appear in Quick Edit. */
  editable: boolean;
}

export type TextElement = ElementBase & { type: 'text'; data: TextData };
export type ImageElement = ElementBase & { type: 'image'; data: ImageData };
export type LogoElement = ElementBase & { type: 'logo'; data: LogoData };
export type ShapeElement = ElementBase & { type: 'shape'; data: ShapeData };
export type BadgeElement = ElementBase & { type: 'badge'; data: BadgeData };

export type PosterElement = TextElement | ImageElement | LogoElement | ShapeElement | BadgeElement;
export type ElementType = PosterElement['type'];

export type DataOf<T extends ElementType> = Extract<PosterElement, { type: T }>['data'];
