import { useMemo } from 'react';
import { resolveBrand } from '../data/brands';
import { brandThemes, themeIndexFor } from '../design/themes';
import type { ColorTheme } from '../design/themes';
import type { RenderEnv } from '../render/env';
import { imageSource } from '../services/imageService';
import { useLogoColors } from '../services/logoColors';
import type { Brand, BrandId, BrandOverrides } from '../types/brand';
import type { Poster } from '../types/poster';
import { formatPosterDate, todayIso } from '../utils/date';
import { selectActivePoster, useEditorStore } from './editorStore';

export function useActivePoster(): Poster {
  return useEditorStore((s) => selectActivePoster(s));
}

export function useBrandFor(brandId: BrandId): Brand {
  const overrides = useEditorStore((s) => s.brandOverrides[brandId]);
  return useMemo(() => resolveBrand(brandId, overrides), [brandId, overrides]);
}

/** The 15 colour themes of a brand (from its brand kit and logo). */
export function themesFor(brandId: BrandId, overrides: BrandOverrides | undefined): ColorTheme[] {
  return brandThemes(resolveBrand(brandId, overrides), useLogoColors.getState().colors[brandId]);
}

/** The theme a poster is drawn in today. */
export function posterTheme(poster: Pick<Poster, 'brandId' | 'meta'>, overrides: BrandOverrides | undefined): ColorTheme {
  const themes = themesFor(poster.brandId, overrides);
  return themes[themeIndexFor(poster.meta.theme, poster.brandId, todayIso())] ?? (themes[0] as ColorTheme);
}

export function buildEnv(poster: Pick<Poster, 'brandId' | 'meta'>, overrides: BrandOverrides | undefined, mode: RenderEnv['mode']): RenderEnv {
  const brand = resolveBrand(poster.brandId, overrides);
  return {
    brand: { ...brand, palette: posterTheme(poster, overrides).palette },
    dateText: formatPosterDate(poster.meta),
    images: imageSource,
    mode,
  };
}

/** Changes whenever logo colours finish loading, so memoized render envs refresh. */
export function useLogoColorKey(brandId: BrandId): string {
  return useLogoColors((s) => (s.colors[brandId] ?? []).join());
}

/** Render environment for a poster in the editor (memoized on brand, theme + date inputs). */
export function useRenderEnv(poster: Poster, mode: RenderEnv['mode'] = 'edit'): RenderEnv {
  const { brandId, meta } = poster;
  const overrides = useEditorStore((s) => s.brandOverrides[brandId]);
  const logoKey = useLogoColorKey(brandId);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- logoKey invalidates the theme cache read inside buildEnv
  return useMemo(() => buildEnv({ brandId, meta }, overrides, mode), [brandId, meta, overrides, mode, logoKey]);
}
