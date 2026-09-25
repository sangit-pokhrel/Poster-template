/** Statement templates: text-led layouts for quotes, official notices and tributes. */
import { COLOR, FONT_STACK, font } from '../constants';
import {
  badgeLabel,
  drawCenteredLine,
  drawCommentCallout,
  drawDottedMap,
  drawDualBar,
  drawLightFooter,
  drawLogo,
  drawLogoCard,
  drawStandardBottom,
  drawText,
  hexToRgba,
  logoWidth,
} from '../primitives/decor';
import { drawHeadline } from '../primitives/headline';
import { drawPhotoLayer, drawPhotoPlaceholder, hasPhoto } from '../primitives/photo';
import type { TemplateDef } from '../types';

export const quote: TemplateDef = {
  id: 'quote',
  name: 'Quote & Statement',
  nameNe: 'भनाइ / वक्तव्य',
  category: 'politics',
  description: 'Large quotation-mark watermark with speaker name & comment call-out.',
  usesSpeaker: true,
  render(s) {
    const { ctx, width, height, isCompact } = s;
    if (hasPhoto(s)) {
      drawPhotoLayer(s, { heightRatio: isCompact ? 0.45 : 0.6, centerRatio: 0.35 });
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      g.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      g.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }
    drawDottedMap(s);

    drawLogo(s, 50, 40, isCompact ? 60 : 75);
    drawText(s, `📅 ${s.post.date}`, width - 50, 75, { font: font('bold', 26), color: COLOR.ink, align: 'right' });
    drawText(s, '“', 50, height * (isCompact ? 0.22 : 0.32), {
      font: font('bold', isCompact ? 180 : 300, FONT_STACK.display),
      color: hexToRgba(s.brand.primary, 0.15),
      baseline: 'top',
    });

    const commentY = height - 58 - 48;
    const speakerY = commentY - 50;
    const top = isCompact ? 150 : 250;
    const bounds = drawHeadline(s, (top + speakerY) / 2, 880);
    drawCenteredLine(s, s.post.speaker || `— ${s.brand.name} Special`, speakerY, s.brand.primary, ['bold', 34]);
    drawCommentCallout(s, commentY, 24);
    drawStandardBottom(s);
    return bounds;
  },
};

export const notice: TemplateDef = {
  id: 'notice',
  name: 'Official Notice',
  nameNe: 'सूचना',
  category: 'politics',
  description: 'Framed सूचना / press-release layout — no photo needed.',
  usesSpeaker: true,
  render(s) {
    const { ctx, width, height, isCompact } = s;
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(0, 0, width, height);
    drawDottedMap(s);
    ctx.strokeStyle = s.brand.primary;
    ctx.lineWidth = 6;
    ctx.strokeRect(28, 28, width - 56, height - 56);
    ctx.strokeStyle = s.brand.secondary;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    const logoH = isCompact ? 55 : 80;
    drawLogo(s, (width - logoWidth(s, logoH)) / 2, 60, logoH);

    const titleY = 60 + logoH + (isCompact ? 50 : 70);
    const title = badgeLabel(s, 'सूचना');
    const titleW = drawText(s, title, width / 2, titleY, {
      font: font(800, isCompact ? 56 : 88),
      color: s.brand.primary,
      align: 'center',
    });
    ctx.strokeStyle = COLOR.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, titleY);
    ctx.lineTo(width / 2 - titleW / 2 - 30, titleY);
    ctx.moveTo(width / 2 + titleW / 2 + 30, titleY);
    ctx.lineTo(width - 90, titleY);
    ctx.stroke();

    const dateY = titleY + (isCompact ? 50 : 70);
    drawCenteredLine(s, `📅 ${s.post.date}`, dateY, COLOR.slate, [600, 26]);

    const speakerY = height - 58 - 70;
    const bounds = drawHeadline(s, (dateY + 40 + speakerY - 40) / 2, 860);
    drawCenteredLine(s, s.post.speaker || `— ${s.brand.name}`, speakerY, COLOR.ink, ['bold', 30]);
    drawStandardBottom(s, 60);
    return bounds;
  },
};

export const tribute: TemplateDef = {
  id: 'tribute',
  name: 'Tribute (श्रद्धाञ्जली)',
  nameNe: 'श्रद्धाञ्जली',
  category: 'news',
  description: 'Dark, respectful layout with a greyscale circular portrait and gold ring.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    drawLogoCard(s, { x: 40, y: 30, logoHeight: 55, padX: 20, padY: 10, fill: COLOR.white, radius: 12 });
    drawText(s, `📅 ${s.post.date}`, width - 50, 65, { font: font(600, 24), color: '#e5e7eb', align: 'right' });

    const r = Math.min(height * (isCompact ? 0.15 : 0.2), 230);
    const cx = width / 2;
    const cy = isCompact ? 80 + r : Math.max(150 + r, height * 0.33);
    const box = { x: cx - r, y: cy - r, width: r * 2, height: r * 2 };
    if (hasPhoto(s)) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.filter = 'grayscale(1)';
      drawPhotoLayer(s, { rect: box });
      ctx.restore();
    } else {
      drawPhotoPlaceholder(s, box, r);
    }
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLOR.gold;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
    ctx.stroke();

    const titleY = cy + r + (isCompact ? 40 : 64);
    drawCenteredLine(s, badgeLabel(s, 'भावपूर्ण श्रद्धाञ्जली'), titleY, COLOR.gold, [800, isCompact ? 34 : 44]);

    const footerY = height - 48;
    const commentY = footerY - 60;
    const bounds = drawHeadline(s, (titleY + 30 + commentY - 20) / 2, 900, {
      color: '#f9fafb',
      highlightColor: COLOR.gold,
    });
    drawCenteredLine(s, `💬 ${s.brand.commentTag}`, commentY, '#cbd5e1', [600, 26]);
    drawLightFooter(s, footerY, true);
    drawDualBar(s, height - 12, 12);
    return bounds;
  },
};
