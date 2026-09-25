import { useEffect, useState } from 'react';
import type { PosterAssets } from '../engine';
import { tryLoadImage } from '../lib/images';

const EMPTY: PosterAssets = { photo: null, extras: [], logo: null };
const SEP = '\u0000';

/**
 * Loads a post's images. Keeps the previous assets until the new ones decode,
 * so switching posts or sliders never flashes an empty poster.
 */
export function usePosterAssets(photoSrc: string, extraPhotoSrcs: readonly string[], logoSrc: string): PosterAssets {
  const [assets, setAssets] = useState<PosterAssets>(EMPTY);
  const extrasKey = extraPhotoSrcs.join(SEP);

  useEffect(() => {
    let alive = true;
    const extras = extrasKey ? extrasKey.split(SEP) : [];
    void Promise.all([tryLoadImage(photoSrc), tryLoadImage(logoSrc), Promise.all(extras.map(tryLoadImage))]).then(
      ([photo, logo, loaded]) => {
        if (alive) setAssets({ photo, logo, extras: loaded.filter((x): x is HTMLImageElement => x !== null) });
      },
    );
    return () => {
      alive = false;
    };
  }, [photoSrc, extrasKey, logoSrc]);

  return assets;
}
