import type { TextData } from '../types/element';
import { resolveColor } from './color';
import type { RenderEnv } from './env';
import { fontStack, resolveTokens } from './env';

/* ------------------------------------------------------------------ */
/* Tokenizing                                                          */
/* ------------------------------------------------------------------ */

export interface WordToken {
  /** Global index used by `TextData.highlights`. */
  index: number;
  text: string;
  paragraph: number;
}

/**
 * Splits raw text into words, keeping paragraph (newline) boundaries.
 * The editor's word picker and the renderer both use this, so highlight
 * indices always refer to the same words.
 */
export function tokenizeWords(text: string): WordToken[] {
  const out: WordToken[] = [];
  text.split('\n').forEach((para, p) => {
    for (const w of para.split(/\s+/)) {
      if (w) out.push({ index: out.length, text: w, paragraph: p });
    }
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Layout (pure; unit-tested with a fake measure)                      */
/* ------------------------------------------------------------------ */

export interface LayoutWord {
  text: string;
  highlighted: boolean;
  width: number;
}

export interface LayoutLine {
  words: LayoutWord[];
  width: number;
  /** First line of a paragraph (where a bullet glyph goes). */
  first: boolean;
  /** Extra space above this line (between bullet items). */
  gapBefore: number;
}

export interface TextLayout {
  fontSize: number;
  lineHeightPx: number;
  spaceWidth: number;
  lines: LayoutLine[];
  height: number;
}

export interface LayoutInput {
  paragraphs: Array<Array<{ text: string; highlighted: boolean }>>;
  boxWidth: number;
  boxHeight: number;
  fontSize: number;
  lineHeight: number;
  autoFit: boolean;
  /** Hanging indent (as a multiple of the font size) for bulleted paragraphs; 0 = none. */
  indentEm?: number;
  /** Space between paragraphs (as a multiple of the font size). */
  paragraphGapEm?: number;
  /** Width of `text` at `size` (including letter spacing). */
  measure: (text: string, size: number) => number;
}

function wrapAt(input: LayoutInput, size: number): TextLayout {
  const space = input.measure(' ', size);
  const indent = (input.indentEm ?? 0) * size;
  const gap = (input.paragraphGapEm ?? 0) * size;
  const maxWidth = input.boxWidth - indent;
  const lines: LayoutLine[] = [];
  input.paragraphs.forEach((para, p) => {
    let current: LayoutWord[] = [];
    let width = 0;
    let first = true;
    const push = () => {
      lines.push({ words: current, width, first, gapBefore: first && p > 0 ? gap : 0 });
      first = false;
    };
    for (const w of para) {
      const ww = input.measure(w.text, size);
      if (current.length > 0 && width + space + ww > maxWidth) {
        push();
        current = [];
        width = 0;
      }
      if (current.length > 0) width += space;
      current.push({ ...w, width: ww });
      width += ww;
    }
    // empty paragraph = blank line
    push();
  });
  const lineHeightPx = size * input.lineHeight;
  const height = lines.reduce((h, l) => h + lineHeightPx + l.gapBefore, 0);
  return { fontSize: size, lineHeightPx, spaceWidth: space, lines, height };
}

const fits = (l: TextLayout, input: LayoutInput) => {
  const indent = (input.indentEm ?? 0) * l.fontSize;
  return l.height <= input.boxHeight + 0.5 && l.lines.every((line) => line.width + indent <= input.boxWidth + 0.5);
};

/** Greedy word wrap; with `autoFit`, shrinks the font in 4 % steps (min 50 %) until it fits. */
export function layoutText(input: LayoutInput): TextLayout {
  let layout = wrapAt(input, input.fontSize);
  if (!input.autoFit) return layout;
  const min = input.fontSize * 0.5;
  let size = input.fontSize;
  while (!fits(layout, input) && size > min) {
    size = Math.max(min, size * 0.96);
    layout = wrapAt(input, size);
  }
  return layout;
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

export function textFont(d: Pick<TextData, 'fontWeight' | 'italic' | 'fontFamily'>, size: number, env: RenderEnv): string {
  return `${d.italic ? 'italic ' : ''}${d.fontWeight} ${size}px ${fontStack(d.fontFamily, env.brand)}`;
}

/**
 * Builds paragraphs from raw text. Plain lines keep per-word highlight flags
 * (indices from `tokenizeWords`). Lines containing {tokens} are resolved as a
 * whole, so empty brand fields drop out together with their separators.
 */
export function buildParagraphs(d: TextData, env: RenderEnv): LayoutInput['paragraphs'] {
  const highlighted = new Set(d.highlights);
  const words = tokenizeWords(d.text);
  const upper = (s: string) => (d.uppercase ? s.toLocaleUpperCase() : s);
  return d.text.split('\n').map((line, p) => {
    if (/\{\w+\}/.test(line)) {
      // Contact lines ("{phone} • {website}") drop empty fields with their separators.
      if (/[•|]/.test(line)) {
        return upper(resolveTokens(line, env))
          .split(/\s+/)
          .filter(Boolean)
          .map((text) => ({ text, highlighted: false }));
      }
      // Prose with a token ("Why choose {brand}?"): a highlighted token highlights every word it becomes.
      return words
        .filter((w) => w.paragraph === p)
        .flatMap((w) =>
          upper(resolveTokens(w.text, env))
            .split(/\s+/)
            .filter(Boolean)
            .map((text) => ({ text, highlighted: highlighted.has(w.index) })),
        );
    }
    return words.filter((w) => w.paragraph === p).map((w) => ({ text: upper(w.text), highlighted: highlighted.has(w.index) }));
  });
}

export function drawText(ctx: CanvasRenderingContext2D, d: TextData, w: number, h: number, env: RenderEnv): void {
  const paragraphs = buildParagraphs(d, env);
  if (paragraphs.every((p) => p.length === 0)) {
    if (env.mode === 'edit') drawEmptyHint(ctx, w, h);
    return;
  }

  ctx.save();
  ctx.letterSpacing = `${d.letterSpacing}px`;
  const measure = (text: string, size: number) => {
    ctx.font = textFont(d, size, env);
    return ctx.measureText(text).width;
  };
  const bulleted = d.bullet.trim().length > 0;
  const layout = layoutText({
    paragraphs,
    boxWidth: w,
    boxHeight: h,
    fontSize: d.fontSize,
    lineHeight: d.lineHeight,
    autoFit: d.autoFit,
    indentEm: bulleted ? 1.35 : 0,
    paragraphGapEm: bulleted ? 0.35 : 0,
    measure,
  });
  const indent = bulleted ? layout.fontSize * 1.35 : 0;

  ctx.font = textFont(d, layout.fontSize, env);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  const color = resolveColor(d.color, env.brand);
  const highlight = resolveColor(d.highlightColor, env.brand);

  const top = d.vAlign === 'top' ? 0 : d.vAlign === 'bottom' ? h - layout.height : (h - layout.height) / 2;
  if (d.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = layout.fontSize * 0.25;
    ctx.shadowOffsetY = layout.fontSize * 0.04;
  }

  let y = top;
  layout.lines.forEach((line) => {
    y += line.gapBefore;
    const cy = y + layout.lineHeightPx / 2;
    y += layout.lineHeightPx;
    const avail = w - indent;
    let x = indent + (d.align === 'left' ? 0 : d.align === 'right' ? avail - line.width : (avail - line.width) / 2);
    if (bulleted && line.first && line.words.length > 0) {
      ctx.save();
      ctx.fillStyle = resolveColor(d.bulletColor, env.brand);
      ctx.fillText(d.bullet, 0, cy);
      ctx.restore();
    }
    for (const word of line.words) {
      if (word.highlighted && d.highlightStyle === 'marker') {
        ctx.save();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = highlight;
        const pad = layout.fontSize * 0.12;
        ctx.fillRect(x - pad, cy - layout.fontSize * 0.55, word.width + pad * 2, layout.fontSize * 1.1);
        ctx.restore();
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = word.highlighted ? highlight : color;
      }
      ctx.fillText(word.text, x, cy);
      x += word.width + layout.spaceWidth;
    }
  });
  ctx.restore();
}

function drawEmptyHint(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(120, 130, 150, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.restore();
}
