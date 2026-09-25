import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Fullscreen for one element. Uses the Fullscreen API where available and
 * falls back to a CSS overlay (iPhone Safari has no element fullscreen).
 * Esc exits in both modes.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [emulated, setEmulated] = useState(false);

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === ref.current && ref.current !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [ref]);

  useEffect(() => {
    if (!emulated) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEmulated(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [emulated]);

  const enter = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenEnabled && el.requestFullscreen) {
      try {
        await el.requestFullscreen({ navigationUI: 'hide' });
        return;
      } catch {
        /* fall through to emulation */
      }
    }
    setEmulated(true);
    setIsFullscreen(true);
  }, [ref]);

  const exit = useCallback(async () => {
    if (emulated) {
      setEmulated(false);
      setIsFullscreen(false);
      return;
    }
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
  }, [emulated]);

  const toggle = useCallback(() => (isFullscreen ? exit() : enter()), [isFullscreen, enter, exit]);

  return { isFullscreen, emulated, enter, exit, toggle };
}
