import type { AspectRatio } from './types';

/** Every poster is 1080px wide; height follows the aspect ratio (same sizes as the reference). */
export const CANVAS_WIDTH = 1080;

export const ASPECT_RATIOS: Record<AspectRatio, { height: number; label: string; icon: string }> = {
  '1:1': { height: 1080, label: 'Square 1080×1080', icon: '⬛' },
  '4:5': { height: 1350, label: 'Portrait 1080×1350', icon: '📱' },
  '16:9': { height: 608, label: 'Banner 1080×608', icon: '🖥️' },
  '9:16': { height: 1920, label: 'Story 1080×1920', icon: '📲' },
};

export const ASPECT_RATIO_KEYS = Object.keys(ASPECT_RATIOS) as AspectRatio[];

export function canvasSize(ratio: AspectRatio): { width: number; height: number } {
  return { width: CANVAS_WIDTH, height: ASPECT_RATIOS[ratio].height };
}

/** Reference palette. Brand primary/secondary replace RED/BLUE at render time. */
export const COLOR = {
  ink: '#1e293b',
  navy: '#0f172a',
  slate: '#475569',
  rule: '#94a3b8',
  white: '#ffffff',
  amber: '#f59e0b',
  pink: '#ec4899',
  indigo: '#1e1b4b',
  royal: '#0f52ba',
  emerald: '#059669',
  gold: '#d4af37',
  yellow: '#facc15',
} as const;

export const FONT_STACK = {
  deva: '"Mukta", "Noto Sans Devanagari", sans-serif',
  latin: '"Outfit", sans-serif',
  latinDeva: '"Outfit", "Mukta", sans-serif',
  display: '"Cinzel", Georgia, serif',
} as const;

export function font(weight: string | number, size: number, family: string = FONT_STACK.deva): string {
  return `${weight} ${size}px ${family}`;
}

/** Faces the canvas needs. Canvas text does not trigger webfont downloads by itself, so we preload these. */
export const REQUIRED_FONTS = [
  '700 48px Mukta',
  '800 48px Mukta',
  '600 24px Mukta',
  '700 48px "Noto Sans Devanagari"',
  '600 24px Outfit',
  '700 24px Outfit',
  '700 120px Cinzel',
] as const;
