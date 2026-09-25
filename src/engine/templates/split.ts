/**
 * Split layout: photo on one half, headline panel on the other.
 * Landscape/square → side by side; portrait/story → stacked.
 */
import { COLOR, font } from '../constants';
import {
  badgeLabel,
  drawCommonFooter,
  drawDualBar,
  drawLogo,
  drawPill,
  drawText,
} from '../primitives/decor';
import { drawHeadline } from '../primitives/headline';
import { drawPhotoLayer, drawPhotoPlaceholder, hasPhoto } from '../primitives/photo';
import type { Rect, Scene, TemplateDef } from '../types';

function photoIn(s: Scene, r: Rect): void {
  const { ctx } = s;
  if (!hasPhoto(s)) {
    drawPhotoPlaceholder(s, r);
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.width, r.height);
  ctx.clip();
  drawPhotoLayer(s, { rect: r });
  ctx.restore();
}

function categoryPill(s: Scene, x: number, y: number, align: 'left' | 'center'): number {
  const label = badgeLabel(s, '📰 समाचार');
  s.ctx.font = font(800, 24);
  const w = s.ctx.measureText(label).width + 48;
  const left = align === 'center' ? (s.width - w) / 2 : x;
  drawPill(s, { rect: { x: left, y, width: w, height: 46 }, radius: 23, fill: s.brand.primary, text: label, color: COLOR.white, font: font(800, 24) });
  return y + 46;
}

export const split: TemplateDef = {
  id: 'split',
  name: 'Split Screen',
  nameNe: 'विभाजित',
  category: 'news',
  description: 'Photo on one half, headline panel on the other — great for 16:9 banners.',
  render(s) {
    const { width, height, isCompact } = s;
    const stacked = height / width >= 1.2;

    if (stacked) {
      const photo: Rect = { x: 0, y: 0, width, height: height * 0.5 };
      photoIn(s, photo);
      drawDualBar(s, photo.height, 10);
      const logoY = photo.height + 40;
      drawLogo(s, 50, logoY, 70);
      drawText(s, `📅 ${s.post.date}`, width - 50, logoY + 35, { font: font('bold', 26), color: COLOR.ink, align: 'right' });
      const pillBottom = categoryPill(s, 50, logoY + 100, 'center');
      const commentY = height - 58 - 55;
      const bounds = drawHeadline(s, (pillBottom + 20 + commentY) / 2, 960);
      drawText(s, `💬 ${s.brand.commentTag}`, width / 2, commentY, { font: font(600, 28), color: COLOR.ink, align: 'center' });
      drawCommonFooter(s, height - 58);
      drawDualBar(s, height - 12, 12);
      return bounds;
    }

    const half = width / 2;
    photoIn(s, { x: 0, y: 0, width: half, height });
    // vertical red/blue seam
    s.ctx.fillStyle = s.brand.primary;
    s.ctx.fillRect(half - 5, 0, 10, height / 2);
    s.ctx.fillStyle = s.brand.secondary;
    s.ctx.fillRect(half - 5, height / 2, 10, height / 2);

    const x0 = half + 40;
    const logoH = isCompact ? 55 : 70;
    drawLogo(s, x0, 40, logoH);
    const pillBottom = categoryPill(s, x0, 40 + logoH + (isCompact ? 18 : 30), 'left');
    const dateY = height - 58 - 50;
    const bounds = drawHeadline(s, (pillBottom + 10 + dateY - 20) / 2, half - 90, { centerX: half + half / 2 });
    drawText(s, `📅 ${s.post.date}   💬 ${s.brand.commentTag}`, x0, dateY, { font: font(600, isCompact ? 20 : 24), color: COLOR.slate });
    drawCommonFooter(s, height - 58, x0, { socials: false });
    drawDualBar(s, height - 12, 12, half, half);
    return bounds;
  },
};
