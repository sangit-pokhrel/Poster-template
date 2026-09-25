import { COLOR, FONT_STACK, font } from '../constants';
import type { Rect, Scene, SocialNetwork } from '../types';

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

type Align = CanvasTextAlign;

export function drawText(
  s: Scene,
  text: string,
  x: number,
  y: number,
  style: { font: string; color: string; align?: Align; baseline?: CanvasTextBaseline },
): number {
  const { ctx } = s;
  ctx.font = style.font;
  ctx.fillStyle = style.color;
  ctx.textAlign = style.align ?? 'left';
  ctx.textBaseline = style.baseline ?? 'middle';
  ctx.fillText(text, x, y);
  return ctx.measureText(text).width;
}

/** Template badge label, unless the editor overrode it for this post. */
export const badgeLabel = (s: Scene, fallback: string): string => s.post.badgeText.trim() || fallback;

export function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return `rgba(223, 28, 36, ${alpha})`;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h ?? '0', 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

/**
 * Width the logo occupies at a given height. When no logo is uploaded we fall
 * back to a text wordmark of the brand name, so layouts never collapse.
 */
export function logoWidth(s: Scene, height: number): number {
  const { logo } = s.assets;
  if (logo?.width) return (logo.width / logo.height) * height;
  if (!s.brand.name) return 0;
  s.ctx.font = font(800, Math.round(height * 0.62));
  return s.ctx.measureText(s.brand.name).width;
}

export function drawLogo(s: Scene, x: number, y: number, height: number, wordmarkColor = s.brand.primary): number {
  const { ctx } = s;
  const { logo } = s.assets;
  const w = logoWidth(s, height);
  if (logo?.width) {
    ctx.drawImage(logo, x, y, w, height);
  } else if (s.brand.name) {
    drawText(s, s.brand.name, x, y + height / 2, { font: font(800, Math.round(height * 0.62)), color: wordmarkColor });
  }
  return w;
}

export interface LogoCardOptions {
  x: number | 'center';
  y: number;
  logoHeight: number;
  padX: number;
  padY: number;
  fill: string;
  radius: number;
  shadow?: boolean;
}

/** Logo on a rounded card (white on photos/colour bars). Returns the card rect. */
export function drawLogoCard(s: Scene, o: LogoCardOptions): Rect {
  const { ctx } = s;
  const lw = logoWidth(s, o.logoHeight);
  const w = lw + o.padX * 2;
  const h = o.logoHeight + o.padY * 2;
  const x = o.x === 'center' ? (s.width - w) / 2 : o.x;

  ctx.save();
  ctx.fillStyle = o.fill;
  if (o.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
  }
  ctx.beginPath();
  ctx.roundRect(x, o.y, w, h, o.radius);
  ctx.fill();
  ctx.restore();

  const wordmark = o.fill === COLOR.white || o.fill === '#fff' ? s.brand.primary : COLOR.white;
  drawLogo(s, x + o.padX, o.y + o.padY, o.logoHeight, wordmark);
  return { x, y: o.y, width: w, height: h };
}

/* ------------------------------------------------------------------ */
/* Badges, strips, callouts                                            */
/* ------------------------------------------------------------------ */

export interface PillOptions {
  rect: Rect;
  radius: number;
  fill: string | CanvasGradient;
  text: string;
  color: string;
  font: string;
}

export function drawPill(s: Scene, o: PillOptions): void {
  const { ctx } = s;
  const { x, y, width, height } = o.rect;
  ctx.fillStyle = o.fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, o.radius);
  ctx.fill();
  drawText(s, o.text, x + width / 2, y + height / 2, { font: o.font, color: o.color, align: 'center' });
}

/** Grey strip with `📅 date` on the left and `💬 comment tag` on the right (Breaking / Sports). */
export function drawInfoStrip(s: Scene, x: number, y: number, width: number, fill: string, color: string): void {
  s.ctx.fillStyle = fill;
  s.ctx.fillRect(x, y, width, 45);
  const style = { font: font(600, 24), color };
  drawText(s, `📅 ${s.post.date}`, x + 20, y + 22, style);
  drawText(s, `💬 ${s.brand.commentTag}`, x + width - 20, y + 22, { ...style, align: 'right' });
}

/** Speech-bubble icon + "पूरा समाचार कमेन्टमा" call-to-action (Classic family). */
export function drawCommentCallout(s: Scene, y: number, size: number): void {
  const cx = s.width / 2;
  drawSpeechBubbleIcon(s, cx - 150, y - 14);
  drawText(s, s.brand.commentTag, cx - 110, y, { font: font(600, size), color: COLOR.ink });
}

export function drawCenteredLine(s: Scene, text: string, y: number, color: string, weightSize: [string | number, number]): void {
  drawText(s, text, s.width / 2, y, { font: font(weightSize[0], weightSize[1]), color, align: 'center' });
}

/* ------------------------------------------------------------------ */
/* Bars, dividers, backgrounds                                         */
/* ------------------------------------------------------------------ */

/** Red/blue split bar — the brand signature at the bottom of every poster. */
export function drawDualBar(s: Scene, y: number, h: number, x = 0, w = s.width): void {
  s.ctx.fillStyle = s.brand.primary;
  s.ctx.fillRect(x, y, w / 2, h);
  s.ctx.fillStyle = s.brand.secondary;
  s.ctx.fillRect(x + w / 2, y, w / 2, h);
}

export function drawAccentDivider(s: Scene, y: number, width: number): void {
  drawDualBar(s, y, 4, (s.width - width) / 2, width);
}

/**
 * White fade from 18% of the height down to the user's "gradient height" — lets
 * a hero photo dissolve into the headline area (Classic / Flash / Viral).
 */
export function drawWhiteFade(s: Scene, stops: ReadonlyArray<readonly [number, number]>, solidBelow: boolean): void {
  const { ctx, width, height } = s;
  const start = height * 0.18;
  const end = height * (s.post.gradientHeight / 100);
  const g = ctx.createLinearGradient(0, start, 0, end);
  for (const [offset, alpha] of stops) g.addColorStop(offset, `rgba(255, 255, 255, ${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, start, width, height - start);
  if (solidBelow) {
    ctx.fillStyle = COLOR.white;
    ctx.fillRect(0, end, width, height - end);
  }
}

/** Dark vignette at the bottom of full-bleed photo layouts. */
export function drawBottomVignette(s: Scene, heightPx: number, stops: ReadonlyArray<readonly [number, string]>): void {
  const { ctx, width, height } = s;
  const g = ctx.createLinearGradient(0, height - heightPx, 0, height);
  for (const [offset, color] of stops) g.addColorStop(offset, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, height - heightPx, width, heightPx);
}

/** Subtle dotted "world map" texture in the lower-left quadrant. */
export function drawDottedMap(s: Scene): void {
  if (!s.brand.showMap) return;
  const { ctx, width: w, height: h } = s;
  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.globalAlpha = 0.45;
  const spacing = 18;
  for (let x = 30; x < w * 0.45; x += spacing) {
    for (let y = h * 0.6; y < h - 50; y += spacing) {
      if (Math.sin(x * 0.05) * Math.cos(y * 0.05) > -0.2) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

export function fillFrom(s: Scene, y: number, color: string = COLOR.white): void {
  s.ctx.fillStyle = color;
  s.ctx.fillRect(0, y, s.width, s.height - y);
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export function drawCalendarIcon(s: Scene, x: number, y: number): void {
  const { ctx } = s;
  ctx.save();
  ctx.strokeStyle = COLOR.ink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, 30, 28);
  ctx.fillStyle = COLOR.ink;
  ctx.fillRect(x, y, 30, 8);
  ctx.fillRect(x + 5, y - 4, 4, 6);
  ctx.fillRect(x + 21, y - 4, 4, 6);
  for (const [dx, dy] of [
    [6, 13],
    [13, 13],
    [20, 13],
    [6, 20],
    [13, 20],
  ] as const) {
    ctx.fillRect(x + dx, y + dy, 4, 4);
  }
  ctx.restore();
}

export function drawSpeechBubbleIcon(s: Scene, x: number, y: number): void {
  const { ctx } = s;
  ctx.save();
  ctx.strokeStyle = s.brand.primary;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(x, y - 10, 34, 26, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 16);
  ctx.lineTo(x + 3, y + 23);
  ctx.lineTo(x + 15, y + 16);
  ctx.fillStyle = s.brand.primary;
  ctx.fill();
  ctx.restore();
}

export function drawGlobeIcon(s: Scene, x: number, y: number, color: string): void {
  const { ctx } = s;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x + 12, y, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 24, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x + 12, y, 6, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

const SOCIAL_GLYPH: Record<SocialNetwork, string> = {
  facebook: 'f',
  youtube: '▶',
  x: 'X',
  instagram: '📷',
  tiktok: '🎵',
};
export const SOCIAL_NETWORKS = Object.keys(SOCIAL_GLYPH) as SocialNetwork[];

const ICON_SIZE = 30;
const ICON_GAP = 14;

/** Row of round social icons. Returns the x just past the last icon. */
export function drawSocialIcons(s: Scene, startX: number, centerY: number, variant: 'dark' | 'light'): number {
  const { ctx } = s;
  ctx.save();
  let x = startX;
  for (const network of s.brand.socials) {
    ctx.fillStyle = variant === 'dark' ? COLOR.ink : 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(x + ICON_SIZE / 2, centerY, ICON_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    drawText(s, SOCIAL_GLYPH[network], x + ICON_SIZE / 2, centerY, {
      font: 'bold 14px sans-serif',
      color: COLOR.white,
      align: 'center',
    });
    x += ICON_SIZE + ICON_GAP;
  }
  ctx.restore();
  return x;
}

/* ------------------------------------------------------------------ */
/* Footers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Shared footer: social icons · separator · 🌐 website (right aligned).
 * With the default five networks the separator lands at leftX + 240, exactly as in the reference.
 */
export function drawCommonFooter(s: Scene, footerY: number, leftX = 50, opts: { socials?: boolean } = {}): void {
  const { ctx, width, brand } = s;
  const showSocials = opts.socials !== false && brand.socials.length > 0;
  if (showSocials) {
    const end = drawSocialIcons(s, leftX, footerY, 'dark');
    ctx.strokeStyle = COLOR.rule;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(end + 20, footerY - 15);
    ctx.lineTo(end + 20, footerY + 15);
    ctx.stroke();
  }
  const right = width - 55;
  const textW = drawText(s, brand.websiteUrl, right, footerY, {
    font: font(600, 22, FONT_STACK.latin),
    color: COLOR.ink,
    align: 'right',
  });
  if (brand.websiteUrl) drawGlobeIcon(s, right - textW - 30, footerY, COLOR.ink);
}

/** White-on-photo footer used by the full-bleed templates. */
export function drawLightFooter(s: Scene, footerY: number, withSeparator: boolean): void {
  const { ctx, width, brand } = s;
  if (brand.socials.length > 0) {
    const end = drawSocialIcons(s, 50, footerY, 'light');
    if (withSeparator) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(end + 20, footerY - 15);
      ctx.lineTo(end + 20, footerY + 15);
      ctx.stroke();
    }
  }
  const right = width - 50;
  const textW = drawText(s, brand.websiteUrl, right, footerY, {
    font: font(600, 24, FONT_STACK.latin),
    color: COLOR.white,
    align: 'right',
  });
  if (brand.websiteUrl) drawGlobeIcon(s, right - textW - 30, footerY, COLOR.white);
}

/** Standard footer + bottom dual bar, at the reference's fixed offsets. */
export function drawStandardBottom(s: Scene, leftX = 50): void {
  drawCommonFooter(s, s.height - 58, leftX);
  drawDualBar(s, s.height - 12, 12);
}
