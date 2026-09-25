import { useEffect, useState } from 'react';
import { assetUrl, isAssetRef } from '../services/assetService';

/** Displayable URL for an image `src` (resolves IndexedDB `asset:` refs to object URLs). */
export function useImageUrl(src: string): string | null {
  const [resolved, setResolved] = useState<{ src: string; url: string | null } | null>(null);

  useEffect(() => {
    if (!isAssetRef(src)) return;
    let alive = true;
    assetUrl(src)
      .then((url) => alive && setResolved({ src, url }))
      .catch(() => alive && setResolved({ src, url: null }));
    return () => {
      alive = false;
    };
  }, [src]);

  if (!isAssetRef(src)) return src || null;
  return resolved?.src === src ? resolved.url : null;
}
