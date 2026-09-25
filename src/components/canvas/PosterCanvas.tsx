import { useEffect, useLayoutEffect, useRef } from 'react';
import { useElementSize } from '../../hooks/useElementSize';
import { posterFontFamilies } from '../../render/drawPoster';
import { PosterStage } from '../../services/canvasRenderer';
import { ensureFonts } from '../../services/fontService';
import { onImageLoaded } from '../../services/imageService';
import { useEditorStore } from '../../store/editorStore';
import { useActivePoster, useRenderEnv } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import { canvasSize } from '../../utils/aspectRatio';

const PADDING = 32;

/** Computes the display scale for "fit" or an explicit zoom (proposal §33). */
export function useDisplayScale(available: { width: number; height: number }, ratio: Parameters<typeof canvasSize>[0]): number {
  const zoom = useUiStore((s) => s.previewZoom);
  const { width, height } = canvasSize(ratio);
  if (zoom !== 'fit') return zoom;
  if (available.width <= 0 || available.height <= 0) return 0.4;
  return Math.max(0.08, Math.min((available.width - PADDING) / width, (available.height - PADDING) / height));
}

/**
 * The live poster. Owns a Fabric stage imperatively (Fabric wraps its canvas
 * in extra DOM, so it lives in a host div React never re-renders into) and
 * reconciles it with the store on every change.
 */
export function PosterCanvas({ compact = false }: { compact?: boolean }) {
  const poster = useActivePoster();
  const env = useRenderEnv(poster, 'edit');
  const selectedId = useEditorStore((s) => s.selectedId);

  const viewportRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<PosterStage | null>(null);
  const available = useElementSize(viewportRef);
  const scale = useDisplayScale(available, poster.ratio);

  // Mount / unmount Fabric
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const el = document.createElement('canvas');
    host.appendChild(el);
    const editor = useEditorStore.getState;
    const stage = new PosterStage(el, {
      onSelect: (id) => editor().select(id),
      onFrame: (id, frame, rotation) => editor().setFrame(id, frame, rotation),
      onDoubleClick: (id) => useUiStore.getState().requestFocus(id),
    });
    stageRef.current = stage;
    // Fabric wraps `el` in its own container div synchronously.
    const container = el.parentElement !== host ? el.parentElement : null;
    return () => {
      stageRef.current = null;
      // Remove only this mount's DOM (StrictMode may already have mounted a new stage).
      void stage.dispose().finally(() => {
        container?.remove();
        el.remove();
      });
    };
  }, []);

  useEffect(() => {
    if (!compact) useUiStore.getState().set('displayScale', scale);
  }, [scale, compact]);

  useLayoutEffect(() => {
    stageRef.current?.setScale(poster.ratio, compact ? Math.min(scale, 240 / canvasSize(poster.ratio).width) : scale);
  }, [poster.ratio, scale, compact]);

  useLayoutEffect(() => {
    stageRef.current?.sync(poster, env, selectedId);
  }, [poster, env, selectedId]);

  // Repaint when images decode or fonts arrive
  useEffect(() => onImageLoaded(() => stageRef.current?.render()), []);
  useEffect(() => {
    let alive = true;
    void ensureFonts(posterFontFamilies(poster, env)).then(() => alive && stageRef.current?.render());
    return () => {
      alive = false;
    };
  }, [poster, env]);

  return (
    <div
      ref={viewportRef}
      className={`scroll-thin relative flex min-h-0 flex-1 overflow-auto ${compact ? 'p-2' : 'p-4'}`}
      onMouseDown={(e) => {
        // Clicking the empty area around the poster deselects
        if (e.target === e.currentTarget) useEditorStore.getState().select(null);
      }}
    >
      <div ref={hostRef} className="poster-host m-auto" aria-label="Poster canvas" role="img" />
    </div>
  );
}
