/**
 * Framed templates: a header (colour bar or logo + badge), a rounded photo box
 * with a coloured stroke, then the headline on white and a meta line.
 * Numbers are the reference's layout constants for a 1080-wide canvas.
 */
import { COLOR, FONT_STACK, font } from '../constants';
import {
  badgeLabel,
  drawAccentDivider,
  drawCenteredLine,
  drawCommentCallout,
  drawDottedMap,
  drawDualBar,
  drawInfoStrip,
  drawLogo,
  drawLogoCard,
  drawPill,
  logoWidth,
  drawStandardBottom,
  drawText,
  fillFrom,
} from '../primitives/decor';
import { drawHeadline } from '../primitives/headline';
import { clamp, drawFramedPhoto, drawPhotoInCell, drawPhotoPlaceholder } from '../primitives/photo';
import type { Rect, Scene, TemplateDef } from '../types';

const FOOTER_OFFSET = 58;
const footerY = (s: Scene) => s.height - FOOTER_OFFSET;

/** Right-hand rounded badge used by Sports / Cinema / Fact-check / Business. */
function cornerPill(s: Scene, y: number, fill: string, text: string, color: string, size = 26): void {
  drawPill(s, {
    rect: { x: s.width - 290, y, width: 240, height: 50 },
    radius: 25,
    fill,
    text,
    color,
    font: font(800, size),
  });
}

export const breaking: TemplateDef = {
  id: 'breaking',
  name: 'Breaking Banner',
  nameNe: 'बिशेष समाचार',
  category: 'news',
  description: 'Bold red BREAKING bar with white logo card and framed photo.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    const barH = isCompact ? 95 : 120;
    ctx.fillStyle = s.brand.primary;
    ctx.fillRect(0, 0, width, barH);
    drawLogoCard(s, { x: 35, y: isCompact ? 15 : 21, logoHeight: isCompact ? 48 : 58, padX: 18, padY: 8, fill: COLOR.white, radius: 10 });
    drawText(s, badgeLabel(s, '🔴 बिशेष समाचार'), width - 50, barH / 2, {
      font: font(800, isCompact ? 26 : 32),
      color: COLOR.white,
      align: 'right',
    });

    const photo: Rect = { x: 40, y: barH + 20, width: width - 80, height: clamp(height * (isCompact ? 0.36 : 0.44), 160, 500) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: s.brand.primary, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    fillFrom(s, whiteTop);
    const infoY = footerY(s) - 55;
    const bounds = drawHeadline(s, (whiteTop + infoY) / 2, 920);
    drawInfoStrip(s, 40, infoY, width - 80, '#f8fafc', COLOR.ink);
    drawStandardBottom(s);
    return bounds;
  },
};

export const sports: TemplateDef = {
  id: 'sports',
  name: 'Sports Update',
  nameNe: 'खेलकुद अपडेट',
  category: 'sports',
  description: 'Navy-to-sky gradient bar, amber match badge & framed action photo.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    const barH = isCompact ? 100 : 140;
    const g = ctx.createLinearGradient(0, 0, width, barH);
    g.addColorStop(0, COLOR.navy);
    g.addColorStop(0.5, '#1e3a8a');
    g.addColorStop(1, '#0284c7');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, barH);
    drawLogoCard(s, { x: 35, y: 20, logoHeight: isCompact ? 50 : 60, padX: 15, padY: 8, fill: COLOR.white, radius: 10 });
    cornerPill(s, 35, COLOR.amber, badgeLabel(s, '⚽ खेलकुद अपडेट'), COLOR.navy);

    const photo: Rect = { x: 35, y: barH + 20, width: width - 70, height: clamp(height * (isCompact ? 0.36 : 0.43), 160, 490) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: COLOR.amber, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    fillFrom(s, whiteTop);
    const infoY = footerY(s) - 55;
    const bounds = drawHeadline(s, (whiteTop + infoY) / 2, 920);
    drawInfoStrip(s, 35, infoY, width - 70, '#f1f5f9', COLOR.navy);
    drawStandardBottom(s);
    return bounds;
  },
};

export const cinema: TemplateDef = {
  id: 'cinema',
  name: 'Entertainment',
  nameNe: 'मनोरञ्जन',
  category: 'sports',
  description: 'Deep indigo bar with pink star badge for film & celebrity news.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    const barH = isCompact ? 95 : 130;
    ctx.fillStyle = COLOR.indigo;
    ctx.fillRect(0, 0, width, barH);
    drawLogoCard(s, { x: 35, y: 20, logoHeight: isCompact ? 50 : 58, padX: 12, padY: 8, fill: COLOR.white, radius: 10 });
    cornerPill(s, 35, COLOR.pink, badgeLabel(s, '🎬 मनोरन्जन खबर'), COLOR.white);

    const photo: Rect = { x: 40, y: barH + 20, width: width - 80, height: clamp(height * (isCompact ? 0.36 : 0.42), 160, 480) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: COLOR.pink, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    fillFrom(s, whiteTop);
    const commentY = footerY(s) - 55;
    const bounds = drawHeadline(s, (whiteTop + commentY) / 2, 920);
    drawCenteredLine(s, `💬 ${s.brand.commentTag} • 📅 ${s.post.date}`, commentY, COLOR.indigo, [600, 28]);
    drawStandardBottom(s);
    return bounds;
  },
};

export const interview: TemplateDef = {
  id: 'interview',
  name: 'Special Interview',
  nameNe: 'विशेष कुराकानी',
  category: 'politics',
  description: 'Interview spotlight with blue speaker badge and framed portrait.',
  usesSpeaker: true,
  render(s) {
    const { width, height, isCompact } = s;
    drawDottedMap(s);
    drawLogo(s, 50, 40, isCompact ? 60 : 75);
    drawPill(s, {
      rect: { x: width - 310, y: 40, width: 260, height: 55 },
      radius: 28,
      fill: COLOR.royal,
      text: badgeLabel(s, '🎤 विशेष कुराकानी'),
      color: COLOR.white,
      font: font(800, 26),
    });

    const photo: Rect = { x: 50, y: 130, width: width - 100, height: clamp(height * (isCompact ? 0.36 : 0.42), 160, 480) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: COLOR.royal, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    const speakerY = footerY(s) - 55;
    const bounds = drawHeadline(s, (whiteTop + speakerY) / 2, 900);
    drawCenteredLine(s, s.post.speaker || '— विशेष अन्तरवार्ता', speakerY, COLOR.royal, ['bold', 32]);
    drawStandardBottom(s);
    return bounds;
  },
};

export const factCheck: TemplateDef = {
  id: 'factcheck',
  name: 'Fact Check',
  nameNe: 'सत्य तथ्य जाँच',
  category: 'viral',
  description: 'Green verified badge (सत्य तथ्य) with a truth-check frame.',
  render(s) {
    const { width, height, isCompact } = s;
    drawDottedMap(s);
    drawLogo(s, 50, 40, isCompact ? 60 : 75);
    cornerPill(s, 45, COLOR.emerald, badgeLabel(s, '✔️ सत्य तथ्य जाँच'), COLOR.white, 24);

    const photo: Rect = { x: 50, y: 130, width: width - 100, height: clamp(height * (isCompact ? 0.36 : 0.42), 160, 470) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: COLOR.emerald, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    const commentY = footerY(s) - 55;
    const bounds = drawHeadline(s, (whiteTop + commentY) / 2, 900);
    drawCenteredLine(s, `VERIFIED FACTS • 📅 ${s.post.date}`, commentY, COLOR.emerald, ['bold', 28]);
    drawStandardBottom(s);
    return bounds;
  },
};

export const editorial: TemplateDef = {
  id: 'editorial',
  name: 'Editorial Column',
  nameNe: 'सम्पादकीय स्तम्भ',
  category: 'politics',
  description: 'Double-ruled newspaper column with centred masthead & author line.',
  usesSpeaker: true,
  render(s) {
    const { ctx, width, height, isCompact } = s;
    ctx.strokeStyle = COLOR.navy;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    const logoH = isCompact ? 55 : 75;
    drawLogo(s, (width - logoWidth(s, logoH)) / 2, 45, logoH);

    ctx.strokeStyle = COLOR.rule;
    ctx.lineWidth = 2;
    for (const y of [130, 170]) {
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 50, y);
      ctx.stroke();
    }
    const meta = { font: font(600, 22), color: COLOR.slate };
    drawText(s, badgeLabel(s, 'सम्पादकीय स्तम्भ | EDITORIAL COLUMN'), 60, 150, meta);
    drawText(s, `📅 ${s.post.date}`, width - 60, 150, { ...meta, align: 'right' });

    // Banner: the reference's 0.32 ratio pushes the photo into the headline, so compact uses 0.26.
    const photo: Rect = { x: 60, y: 185, width: width - 120, height: clamp(height * (isCompact ? 0.26 : 0.38), 150, 420) };
    drawFramedPhoto(s, photo, { radius: 0, stroke: '#334155', lineWidth: 2 });

    const speakerY = footerY(s) - 55;
    const bounds = drawHeadline(s, (photo.y + photo.height + speakerY) / 2, 880);
    drawCenteredLine(s, s.post.speaker || '— विशेष विश्लेषण', speakerY, s.brand.primary, ['bold', 30]);
    drawStandardBottom(s, 60);
    return bounds;
  },
};

export const multiPhoto: TemplateDef = {
  id: 'multiphoto',
  name: 'Multi-Photo Collage',
  nameNe: 'बहु-फोटो कोलाज',
  category: 'news',
  description: 'Grid collage for 2, 3 or 4 photos with red frame.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    drawLogo(s, 50, 35, 70);
    drawText(s, `📅 ${s.post.date}`, width - 50, 70, { font: font('bold', 26), color: COLOR.ink, align: 'right' });

    const area: Rect = { x: 40, y: 120, width: width - 80, height: clamp(height * (isCompact ? 0.36 : 0.42), 180, 460) };
    const photos = [s.assets.photo, ...s.assets.extras].filter((p): p is HTMLImageElement => Boolean(p?.width));

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(area.x, area.y, area.width, area.height, 16);
    ctx.clip();
    if (photos.length === 0) drawPhotoPlaceholder(s, area, 16);
    for (const [img, cell] of collageCells(area, photos.length).map((c, i) => [photos[i], c] as const)) {
      if (img) drawPhotoInCell(s, img, cell);
    }
    ctx.restore();

    ctx.strokeStyle = s.brand.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(area.x, area.y, area.width, area.height, 16);
    ctx.stroke();

    const whiteTop = area.y + area.height + 15;
    fillFrom(s, whiteTop);
    drawDottedMap(s);
    const commentY = footerY(s) - 48;
    const dividerY = commentY - 45;
    const bounds = drawHeadline(s, (whiteTop + dividerY) / 2, 920);
    drawAccentDivider(s, dividerY, 420);
    drawCommentCallout(s, commentY, 28);
    drawStandardBottom(s);
    return bounds;
  },
};

/** Collage geometry (6px gutters): 1 = full, 2 = halves, 3 = 58/42 with stacked right, 4 = 2×2. */
export function collageCells(a: Rect, count: number): Rect[] {
  const gap = 6;
  const halfW = (a.width - gap) / 2;
  const halfH = (a.height - gap) / 2;
  if (count <= 1) return [a];
  if (count === 2) {
    return [
      { x: a.x, y: a.y, width: halfW, height: a.height },
      { x: a.x + halfW + gap, y: a.y, width: halfW, height: a.height },
    ];
  }
  if (count === 3) {
    const leftW = (a.width - gap) * 0.58;
    const rightW = (a.width - gap) * 0.42;
    return [
      { x: a.x, y: a.y, width: leftW, height: a.height },
      { x: a.x + leftW + gap, y: a.y, width: rightW, height: halfH },
      { x: a.x + leftW + gap, y: a.y + halfH + gap, width: rightW, height: halfH },
    ];
  }
  return [
    { x: a.x, y: a.y, width: halfW, height: halfH },
    { x: a.x + halfW + gap, y: a.y, width: halfW, height: halfH },
    { x: a.x, y: a.y + halfH + gap, width: halfW, height: halfH },
    { x: a.x + halfW + gap, y: a.y + halfH + gap, width: halfW, height: halfH },
  ];
}

export const business: TemplateDef = {
  id: 'business',
  name: 'Economy & Market',
  nameNe: 'अर्थ / बजार',
  category: 'news',
  description: 'Navy & gold finance layout with side accent band and data strip.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    const navy = '#1e3a8a';
    drawDottedMap(s);
    ctx.fillStyle = navy;
    ctx.fillRect(0, 0, 14, height);
    drawLogo(s, 50, 40, isCompact ? 60 : 75);
    cornerPill(s, 45, navy, badgeLabel(s, '📈 अर्थ / बजार'), COLOR.yellow, 24);

    const photo: Rect = { x: 50, y: 130, width: width - 100, height: clamp(height * (isCompact ? 0.36 : 0.42), 160, 470) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: navy, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    const infoY = footerY(s) - 62; // dark strip: keep clear of the footer icons
    const bounds = drawHeadline(s, (whiteTop + infoY) / 2, 900);
    drawInfoStrip(s, 50, infoY, width - 100, navy, COLOR.white);
    drawStandardBottom(s);
    return bounds;
  },
};

export const international: TemplateDef = {
  id: 'international',
  name: 'International',
  nameNe: 'अन्तर्राष्ट्रिय',
  category: 'news',
  description: 'Dark world-desk bar with brand accent line and framed photo.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    const barH = isCompact ? 95 : 120;
    ctx.fillStyle = COLOR.navy;
    ctx.fillRect(0, 0, width, barH);
    drawDualBar(s, barH, 6);
    drawLogoCard(s, { x: 35, y: isCompact ? 15 : 21, logoHeight: isCompact ? 48 : 58, padX: 18, padY: 8, fill: COLOR.white, radius: 10 });
    drawText(s, badgeLabel(s, '🌐 अन्तर्राष्ट्रिय'), width - 50, barH / 2, {
      font: font(800, isCompact ? 26 : 30, FONT_STACK.deva),
      color: COLOR.white,
      align: 'right',
    });

    const photo: Rect = { x: 40, y: barH + 26, width: width - 80, height: clamp(height * (isCompact ? 0.34 : 0.43), 160, 490) };
    drawFramedPhoto(s, photo, { radius: 16, stroke: s.brand.secondary, lineWidth: 6 });

    const whiteTop = photo.y + photo.height + 15;
    fillFrom(s, whiteTop);
    drawDottedMap(s);
    const commentY = footerY(s) - 48;
    const dividerY = commentY - 45;
    const bounds = drawHeadline(s, (whiteTop + dividerY) / 2, 920);
    drawAccentDivider(s, dividerY, 420);
    drawCommentCallout(s, commentY, 28);
    drawStandardBottom(s);
    return bounds;
  },
};
