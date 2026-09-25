import { useMemo } from 'react';
import { resolveBrand } from '../data/brands';
import type { RenderEnv } from '../render/env';
import { imageSource } from '../services/imageService';
import type { Brand, BrandId, BrandOverrides } from '../types/brand';
import type { Poster } from '../types/poster';
import { formatPosterDate } from '../utils/date';
import { selectActivePoster, useEditorStore } from './editorStore';

export function useActivePoster(): Poster {
  return useEditorStore((s) => selectActivePoster(s));
}

export function useBrandFor(brandId: BrandId): Brand {
  const overrides = useEditorStore((s) => s.brandOverrides[brandId]);
  return useMemo(() => resolveBrand(brandId, overrides), [brandId, overrides]);
}

export function buildEnv(poster: Pick<Poster, 'brandId' | 'meta'>, overrides: BrandOverrides | undefined, mode: RenderEnv['mode']): RenderEnv {
  return {
    brand: resolveBrand(poster.brandId, overrides),
    dateText: formatPosterDate(poster.meta),
    images: imageSource,
    mode,
  };
}

/** Render environment for a poster in the editor (memoized on brand + date inputs). */
export function useRenderEnv(poster: Poster, mode: RenderEnv['mode'] = 'edit'): RenderEnv {
  const { brandId, meta } = poster;
  const overrides = useEditorStore((s) => s.brandOverrides[brandId]);
  return useMemo(() => buildEnv({ brandId, meta }, overrides, mode), [brandId, meta, overrides, mode]);
}
