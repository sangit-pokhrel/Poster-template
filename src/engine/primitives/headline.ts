import { COLOR, font } from '../constants';
import type { Rect, Scene } from '../types';

export interface HeadlineWord {
  text: string;
  highlighted: boolean;
}

export interface HeadlineLine {
  words: HeadlineWord[];
  width: number;
}

/** Word split shared by the canvas renderer and the word-highlight picker, so indices always agree. */
export function tokenizeHeadline(headline: string): string[] {
  const trimmed = headline.trim();
  return trimmed ? trimmed.split(/\s+/) : [];
}

/**
 * Greedy word wrap (pure, unit-tested). Same algorithm as the reference
 * `renderMultilineHeadline`: a word moves to the next line when it would push
 * the current line past `maxWidth`; a single long word is never split.
 */
export function wrapWords(
  words: HeadlineWord[],
  measure: (text: string) => number,
  maxWidth: number,
): HeadlineLine[] {
  const space = measure(' ');
  const lines: HeadlineLine[] = [];
  let current: HeadlineWord[] = [];
  let currentWidth = 0;

  for (const word of words) {
    const w = measure(word.text);
    if (current.length > 0 && currentWidth + space + w > maxWidth) {
      lines.push({ words: current, width: currentWidth });
      current = [word];
      currentWidth = w;
    } else {
      if (current.length > 0) currentWidth += space;
      current.push(word);
      currentWidth += w;
    }
  }
  if (current.length > 0) lines.push({ words: current, width: currentWidth });
  return lines;
}

export interface HeadlineOptions {
  /** Horizontal centre of the text block. Defaults to the canvas centre. */
  centerX?: number;
  color?: string;
  highlightColor?: string;
  /** Soft drop shadow for text on photos. */
  shadow?: boolean;
}

/** Banner (16:9) caps the headline size so it fits the short canvas — reference rule. */
export function effectiveFontSize(s: Scene): number {
  return s.height <= 700 ? Math.min(s.post.fontSize, 40) : s.post.fontSize;
}

/**
 * Draws the wrapped, word-highlighted headline centred on (centerX, centerY),
 * offset by the post's drag position. Returns its bounding box for hit-testing.
 */
export function drawHeadline(s: Scene, centerY: number, maxWidth: number, o: HeadlineOptions = {}): Rect | null {
  const { ctx, width, post, brand } = s;
  const tokens = tokenizeHeadline(post.headline);
  if (tokens.length === 0) return null;

  const size = effectiveFontSize(s);
  const highlighted = new Set(post.highlighted);
  ctx.save();
  ctx.font = font('bold', size);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const lines = wrapWords(
    tokens.map((text, i) => ({ text, highlighted: highlighted.has(i) })),
    (t) => ctx.measureText(t).width,
    maxWidth,
  );
  const space = ctx.measureText(' ').width;
  const lineSpacing = size * post.lineHeight;
  const blockHeight = lines.length * lineSpacing;
  const top = centerY - blockHeight / 2 + post.headlineY;
  const centerX = (o.centerX ?? width / 2) + post.headlineX;

  if (o.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let baseline = top + size / 2;
  for (const line of lines) {
    let x = centerX - line.width / 2;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + line.width);
    for (const word of line.words) {
      ctx.fillStyle = word.highlighted ? (o.highlightColor ?? brand.primary) : (o.color ?? COLOR.ink);
      ctx.fillText(word.text, x, baseline);
      x += ctx.measureText(word.text).width + space;
    }
    baseline += lineSpacing;
  }
  ctx.restore();

  return { x: minX, y: top - size * 0.15, width: maxX - minX, height: blockHeight + size * 0.15 };
}

/** Dashed selection box with corner handles, drawn only on the interactive preview. */
export function drawSelectionBox(ctx: CanvasRenderingContext2D, b: Rect): void {
  const pad = 12;
  const x = b.x - pad;
  const y = b.y - pad;
  const w = b.width + pad * 2;
  const h = b.height + pad * 2;
  const handle = 10;

  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = '#3b82f6';
  for (const [cx, cy] of [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ] as const) {
    ctx.fillRect(cx - handle / 2, cy - handle / 2, handle, handle);
  }
  ctx.restore();
}
