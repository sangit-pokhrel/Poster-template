/** Photo-only templates: full-bleed photo, brand chrome, no headline. */
import { COLOR, font } from '../constants';
import {
  drawAccentDivider,
  drawBottomVignette,
  drawDualBar,
  drawLightFooter,
  drawLogoCard,
  drawText,
} from '../primitives/decor';
import { drawPhotoLayer, hasPhoto } from '../primitives/photo';
import type { Scene, TemplateDef } from '../types';

function fullBleed(s: Scene): void {
  const { ctx, width, height } = s;
  if (hasPhoto(s)) drawPhotoLayer(s, { rect: { x: 0, y: 0, width, height } });
  else {
    ctx.fillStyle = COLOR.navy;
    ctx.fillRect(0, 0, width, height);
  }
}

export const purePhoto: TemplateDef = {
  id: 'purephoto',
  name: 'Corner Logo & Dual Line',
  nameNe: 'कुना लोगो र दुईरङ्गी रेखा',
  category: 'photo',
  description: 'Full photo, top-left logo card, top-right date pill & red-blue line.',
  photoOnly: true,
  render(s) {
    const { ctx, width, height } = s;
    fullBleed(s);
    drawBottomVignette(s, Math.min(220, height * 0.3), [
      [0, 'rgba(0, 0, 0, 0)'],
      [0.6, 'rgba(15, 23, 42, 0.75)'],
      [1, 'rgba(15, 23, 42, 0.95)'],
    ]);

    drawLogoCard(s, { x: 40, y: 30, logoHeight: 60, padX: 20, padY: 10, fill: COLOR.white, radius: 12, shadow: true });

    const box = { x: width - 40 - 240, y: 35, width: 240, height: 50 };
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.width, box.height, 25);
    ctx.fill();
    ctx.stroke();
    drawText(s, `📅 ${s.post.date}`, box.x + box.width / 2, box.y + box.height / 2, {
      font: font('bold', 24),
      color: COLOR.white,
      align: 'center',
    });

    const footerY = height - 48;
    drawAccentDivider(s, footerY - 32, 440);
    drawLightFooter(s, footerY, true);
    drawDualBar(s, height - 12, 12);
    return null;
  },
};

export const minPhoto: TemplateDef = {
  id: 'minphoto',
  name: 'Centered Logo & Dual Line',
  nameNe: 'केन्द्रित लोगो',
  category: 'photo',
  description: 'Centred logo card, red-blue accent & date over a full photo.',
  photoOnly: true,
  render(s) {
    const { ctx, width, height } = s;
    fullBleed(s);

    const top = ctx.createLinearGradient(0, 0, 0, 180);
    top.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
    top.addColorStop(0.7, 'rgba(15, 23, 42, 0.5)');
    top.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, width, 180);

    drawLogoCard(s, { x: 'center', y: 25, logoHeight: 55, padX: 20, padY: 8, fill: COLOR.white, radius: 12, shadow: true });
    drawDualBar(s, 110, 5, (width - 380) / 2, 380);
    drawText(s, `📅 ${s.post.date}`, width / 2, 138, { font: font('bold', 22), color: COLOR.white, align: 'center' });

    drawBottomVignette(s, Math.min(220, height * 0.3), [
      [0, 'rgba(0, 0, 0, 0)'],
      [1, 'rgba(15, 23, 42, 0.95)'],
    ]);
    drawLightFooter(s, height - 48, false);
    drawDualBar(s, height - 12, 12);
    return null;
  },
};
