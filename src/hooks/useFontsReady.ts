import { useEffect, useState } from 'react';
import { ensureFontsLoaded } from '../lib/fonts';

/** Flips to true once the poster webfonts are available, triggering a repaint with the right glyphs. */
export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    void ensureFontsLoaded().then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}
