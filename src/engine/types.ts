/**
 * Domain types for the poster engine.
 *
 * The engine is framework-agnostic: it only knows about a CanvasRenderingContext2D,
 * plain data (Post, Brand) and already-decoded images (PosterAssets). React never
 * reaches into it, which is what lets the same code drive the live preview,
 * the template thumbnails and the bulk ZIP export.
 */

export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';
export type PhotoFit = 'cover' | 'contain';
export type Lang = 'en' | 'ne';
export type TemplateCategory = 'photo' | 'news' | 'politics' | 'sports' | 'viral';
export type SocialNetwork = 'facebook' | 'youtube' | 'x' | 'instagram' | 'tiktok';
export type RenderMode = 'preview' | 'export';

/** One poster's content. Everything an intern types per news item lives here. */
export interface Post {
  id: string;
  templateId: string;
  headline: string;
  /** Indices into `tokenizeHeadline(headline)` that render in the highlight colour. */
  highlighted: number[];
  speaker: string;
  /** Overrides the template's built-in badge label (e.g. "🔴 बिशेष समाचार") when non-empty. */
  badgeText: string;
  date: string;

  photoSrc: string;
  /** Secondary photos for the collage template (max 3). */
  extraPhotoSrcs: string[];
  photoFit: PhotoFit;
  zoom: number;
  panX: number;
  panY: number;
  gradientHeight: number;

  fontSize: number;
  lineHeight: number;
  headlineX: number;
  headlineY: number;
}

/** Shared identity used by every poster. */
export interface Brand {
  name: string;
  logoSrc: string;
  websiteUrl: string;
  commentTag: string;
  primary: string;
  secondary: string;
  socials: SocialNetwork[];
  showMap: boolean;
}

export interface PosterAssets {
  photo: HTMLImageElement | null;
  extras: HTMLImageElement[];
  logo: HTMLImageElement | null;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Everything a template needs to paint one poster. */
export interface Scene {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** Landscape banner (16:9) — templates tighten spacing, same rule as the reference (`height <= 700`). */
  isCompact: boolean;
  post: Post;
  brand: Brand;
  assets: PosterAssets;
  mode: RenderMode;
}

export interface TemplateDef {
  id: string;
  name: string;
  nameNe: string;
  category: TemplateCategory;
  description: string;
  /** Shows the speaker field as relevant in the editor. */
  usesSpeaker?: boolean;
  /** Template draws no headline (photo-only layouts). */
  photoOnly?: boolean;
  /** Paints the poster and returns the headline's bounding box (for drag hit-testing), if any. */
  render(scene: Scene): Rect | null;
}

export interface RenderResult {
  headlineBounds: Rect | null;
}
