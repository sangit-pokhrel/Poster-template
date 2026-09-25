import { useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { canvasSize, drawSelectionBox, renderPoster } from '../../engine';
import type { AspectRatio, Brand, Post, PosterAssets, Rect } from '../../engine';

export type DragTarget = 'headline' | 'photo';

interface Props {
  post: Post;
  brand: Brand;
  ratio: AspectRatio;
  assets: PosterAssets;
  /** Changing this repaints once webfonts arrive. */
  fontsReady: boolean;
  cssWidth: number;
  label: string;
  onDrag?: (target: DragTarget, x: number, y: number) => void;
}

interface DragSession {
  target: DragTarget;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

const HIT_PADDING = 25;
const DRAG_LIMIT = 1200;

/**
 * The live poster. The canvas backing store is always the real export size
 * (1080 × H) and CSS scales it down, so what you see is exactly what downloads.
 * Dragging follows the reference: grab inside the headline box to move the
 * headline, anywhere else to pan the photo.
 */
export function PosterCanvas({ post, brand, ratio, assets, fontsReady, cssWidth, label, onDrag }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boundsRef = useRef<Rect | null>(null);
  const session = useRef<DragSession | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<{ target: DragTarget; x: number; y: number } | null>(null);
  const [activeTarget, setActiveTarget] = useState<DragTarget | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { width, height } = canvasSize(ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const { headlineBounds } = renderPoster(ctx, { post, brand, ratio, assets, mode: 'preview' });
    boundsRef.current = headlineBounds;
    if (activeTarget === 'headline' && headlineBounds) drawSelectionBox(ctx, headlineBounds);
  }, [post, brand, ratio, assets, fontsReady, activeTarget]);

  useLayoutEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const toCanvasPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const isOverHeadline = (p: { x: number; y: number }) => {
    const b = boundsRef.current;
    return (
      b !== null &&
      p.x >= b.x - HIT_PADDING &&
      p.x <= b.x + b.width + HIT_PADDING &&
      p.y >= b.y - HIT_PADDING &&
      p.y <= b.y + b.height + HIT_PADDING
    );
  };

  /** Coalesce pointermove bursts into one state update per animation frame. */
  const schedule = (target: DragTarget, x: number, y: number) => {
    pending.current = { target, x, y };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const p = pending.current;
      if (p && onDrag) onDrag(p.target, p.x, p.y);
    });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!onDrag || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const target: DragTarget = isOverHeadline(toCanvasPoint(e)) ? 'headline' : 'photo';
    session.current = {
      target,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: target === 'headline' ? post.headlineX : post.panX,
      originY: target === 'headline' ? post.headlineY : post.panY,
    };
    e.currentTarget.style.cursor = 'grabbing';
    setActiveTarget(target);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const s = session.current;
    if (!s) {
      if (onDrag) canvas.style.cursor = isOverHeadline(toCanvasPoint(e)) ? 'move' : 'grab';
      return;
    }
    if (e.pointerId !== s.pointerId) return;
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const clampDrag = (v: number) => Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, Math.round(v)));
    schedule(
      s.target,
      clampDrag(s.originX + (e.clientX - s.startX) * scale),
      clampDrag(s.originY + (e.clientY - s.startY) * scale),
    );
  };

  const endDrag = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!session.current || e.pointerId !== session.current.pointerId) return;
    session.current = null;
    e.currentTarget.style.cursor = 'grab';
    setActiveTarget(null);
  };

  const { height } = canvasSize(ratio);
  return (
    <canvas
      ref={canvasRef}
      className="poster-canvas"
      role="img"
      aria-label={label}
      style={{ width: cssWidth, height: (cssWidth * height) / 1080, touchAction: onDrag ? 'none' : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    />
  );
}
