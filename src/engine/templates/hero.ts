/**
 * Hero templates: the main photo fills the top of the poster and dissolves into
 * a white headline area (Classic / Flash / Weather / Viral), or fills the whole
 * poster with a dark lower third (Live).
 *
 * Paint order is always background → photo → fades → texture → chrome → text,
 * so nothing a template draws early gets covered by the photo.
 */
import { COLOR, FONT_STACK, font } from '../constants';
import {
  badgeLabel,
  drawAccentDivider,
  drawBottomVignette,
  drawCalendarIcon,
  drawCenteredLine,
  drawCommentCallout,
  drawDottedMap,
  drawDualBar,
  drawLightFooter,
  drawLogo,
  drawLogoCard,
  drawPill,
  drawStandardBottom,
  drawText,
  drawWhiteFade,
} from '../primitives/decor';
import { drawHeadline } from '../primitives/headline';
import { drawPhotoLayer, drawPhotoPlaceholder, hasPhoto } from '../primitives/photo';
import type { Scene, TemplateDef } from '../types';

function heroPhoto(s: Scene, heightRatio: number, centerRatio: number): void {
  if (hasPhoto(s)) drawPhotoLayer(s, { heightRatio, centerRatio });
  else drawPhotoPlaceholder(s, { x: 0, y: 0, width: s.width, height: s.height * heightRatio * 0.7 });
}

export const classic: TemplateDef = {
  id: 'classic',
  name: 'Classic',
  nameNe: 'क्लासिक',
  category: 'news',
  description: 'Full top photo with smooth white fade, dated header & comment call-out.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    heroPhoto(s, isCompact ? 0.45 : height >= 1800 ? 0.7 : 0.65, isCompact ? 0.25 : 0.35);
    drawWhiteFade(s, [[0, 0], [0.5, 0.75], [0.9, 0.98], [1, 1]], true);
    drawDottedMap(s);

    drawLogo(s, 50, 35, isCompact ? 60 : 75);
    ctx.strokeStyle = COLOR.ink;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(width - 250, 48);
    ctx.lineTo(width - 250, 95);
    ctx.stroke();
    drawCalendarIcon(s, width - 230, 58);
    drawText(s, s.post.date, width - 190, 74, { font: font('bold', 28), color: COLOR.ink });

    const commentY = height - 58 - 48;
    const dividerY = commentY - 45;
    const top = isCompact ? 180 : height * 0.45;
    const bounds = drawHeadline(s, (top + dividerY) / 2, 960);

    drawAccentDivider(s, dividerY, 420);
    drawCommentCallout(s, commentY, 30);
    drawStandardBottom(s);
    return bounds;
  },
};

interface BarHeroConfig {
  id: string;
  name: string;
  nameNe: string;
  description: string;
  bar: (s: Scene, barHeight: number) => string | CanvasGradient;
  logoCardFill: string;
  badge: string;
  badgeColor: string;
}

/** Coloured header bar over a hero photo (Flash Alert & Weather share this layout). */
function barHero(c: BarHeroConfig): TemplateDef {
  return {
    id: c.id,
    name: c.name,
    nameNe: c.nameNe,
    category: 'news',
    description: c.description,
    render(s) {
      const { ctx, width, height, isCompact } = s;
      const barH = isCompact ? 95 : 120;

      heroPhoto(s, isCompact ? 0.42 : 0.6, 0.35);
      drawWhiteFade(s, [[0, 0], [0.7, 0.9], [1, 1]], false);

      ctx.fillStyle = c.bar(s, barH);
      ctx.fillRect(0, 0, width, barH);
      const logoH = isCompact ? 48 : 60;
      drawLogoCard(s, { x: 35, y: isCompact ? 15 : 20, logoHeight: logoH, padX: 15, padY: 8, fill: c.logoCardFill, radius: 10 });
      drawText(s, badgeLabel(s, c.badge), width - 50, barH / 2, {
        font: font(800, isCompact ? 24 : 32),
        color: c.badgeColor,
        align: 'right',
      });

      const commentY = height - 58 - 55;
      const top = isCompact ? 180 : height * 0.45;
      const bounds = drawHeadline(s, (top + commentY) / 2, 940);
      drawCenteredLine(s, `💬 ${s.brand.commentTag} • 📅 ${s.post.date}`, commentY, COLOR.navy, [600, 28]);
      drawStandardBottom(s);
      return bounds;
    },
  };
}

export const flash = barHero({
  id: 'flash',
  name: 'Flash Alert',
  nameNe: 'द्रुत समाचार',
  description: 'Amber flash bar with dark logo card over a hero photo.',
  bar: () => COLOR.amber,
  logoCardFill: COLOR.navy,
  badge: '⚡ द्रुत समाचार (FLASH)',
  badgeColor: COLOR.navy,
});

export const weather = barHero({
  id: 'weather',
  name: 'Weather Update',
  nameNe: 'मौसम अपडेट',
  description: 'Sky-blue gradient bar for weather, disaster & travel alerts.',
  bar: (s, h) => {
    const g = s.ctx.createLinearGradient(0, 0, s.width, h);
    g.addColorStop(0, '#0c4a6e');
    g.addColorStop(0.5, '#0284c7');
    g.addColorStop(1, '#38bdf8');
    return g;
  },
  logoCardFill: COLOR.white,
  badge: '🌦️ मौसम अपडेट',
  badgeColor: COLOR.white,
});

export const viral: TemplateDef = {
  id: 'viral',
  name: 'Viral Trending',
  nameNe: 'ट्रेन्डिङ',
  category: 'viral',
  description: '🔥 Trending gradient badge, hero photo & centred meta line.',
  render(s) {
    const { ctx, width, height, isCompact } = s;
    heroPhoto(s, isCompact ? 0.45 : 0.65, 0.34);
    drawWhiteFade(s, [[0, 0], [0.6, 0.85], [1, 1]], true);
    drawDottedMap(s);

    drawLogo(s, 50, 40, isCompact ? 60 : 75);
    const badge = ctx.createLinearGradient(width - 290, 45, width - 50, 95);
    badge.addColorStop(0, '#ff416c');
    badge.addColorStop(1, '#ff4b2b');
    drawPill(s, {
      rect: { x: width - 290, y: 45, width: 240, height: 50 },
      radius: 25,
      fill: badge,
      text: badgeLabel(s, '🔥 TRENDING'),
      color: COLOR.white,
      font: font('bold', 24, FONT_STACK.latinDeva),
    });

    const commentY = height - 58 - 48;
    const dividerY = commentY - 45;
    const top = isCompact ? 180 : height * 0.45;
    const bounds = drawHeadline(s, (top + dividerY) / 2, 940);
    drawAccentDivider(s, dividerY, 440);
    drawCenteredLine(s, `💬 ${s.brand.commentTag} • 📅 ${s.post.date}`, commentY, COLOR.ink, [600, 28]);
    drawStandardBottom(s);
    return bounds;
  },
};

export const live: TemplateDef = {
  id: 'live',
  name: 'Live / TV Lower Third',
  nameNe: 'लाइभ',
  category: 'viral',
  description: 'Full-bleed photo, LIVE badge and white headline on a dark lower third.',
  render(s) {
    const { width, height, isCompact } = s;
    if (hasPhoto(s)) drawPhotoLayer(s, { rect: { x: 0, y: 0, width, height } });
    else {
      s.ctx.fillStyle = COLOR.navy;
      s.ctx.fillRect(0, 0, width, height);
    }
    drawBottomVignette(s, height * 0.62, [
      [0, 'rgba(15, 23, 42, 0)'],
      [0.45, 'rgba(15, 23, 42, 0.82)'],
      [1, 'rgba(15, 23, 42, 0.97)'],
    ]);

    drawLogoCard(s, { x: 40, y: 30, logoHeight: 60, padX: 20, padY: 10, fill: COLOR.white, radius: 12, shadow: true });
    drawPill(s, {
      rect: { x: width - 230, y: 35, width: 190, height: 56 },
      radius: 12,
      fill: s.brand.primary,
      text: badgeLabel(s, '● LIVE'),
      color: COLOR.white,
      font: font(800, 28, FONT_STACK.latinDeva),
    });
    drawText(s, `📅 ${s.post.date}`, width - 40, 118, {
      font: font('bold', 24),
      color: COLOR.white,
      align: 'right',
    });

    const footerY = height - 48;
    const commentY = footerY - 62;
    const top = isCompact ? height * 0.42 : height * 0.55;
    const bounds = drawHeadline(s, (top + commentY - 20) / 2, 960, {
      color: COLOR.white,
      highlightColor: COLOR.yellow,
      shadow: true,
    });
    drawCenteredLine(s, `💬 ${s.brand.commentTag}`, commentY, 'rgba(255, 255, 255, 0.9)', [600, 26]);
    drawLightFooter(s, footerY, true);
    drawDualBar(s, height - 12, 12);
    return bounds;
  },
};
