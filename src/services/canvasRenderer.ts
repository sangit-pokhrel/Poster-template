/**
 * Live, interactive poster canvas built on Fabric.js (proposal §18, §26).
 *
 * Each poster element is a custom Fabric object whose `_render` calls the same
 * pure `drawElementContent` used by the exporter, so what you see is exactly
 * what downloads. Fabric supplies interaction: select, drag, resize, rotate,
 * stacking. The canvas works in logical 1080-wide coordinates and is displayed
 * through a viewport zoom (proposal §32, §33); selection chrome only exists on
 * this canvas and never reaches an export.
 */
import { Canvas, FabricObject } from 'fabric';
import type { TPointerEventInfo } from 'fabric';
import { drawBackground, drawElementContent } from '../render/drawPoster';
import type { RenderEnv } from '../render/env';
import type { Frame, PosterElement, Ratio } from '../types/element';
import type { Poster } from '../types/poster';
import { canvasSize, elementRect, pxToFrame } from '../utils/aspectRatio';

const SNAP_PX = 10;
const UI_COLOR = '#3b82f6';

/* ------------------------------------------------------------------ */
/* Fabric objects                                                      */
/* ------------------------------------------------------------------ */

class ElementNode extends FabricObject {
  static type = 'PosterElementNode';
  declare elementId: string;
  private element: PosterElement;
  private readonly env: () => RenderEnv;

  constructor(element: PosterElement, env: () => RenderEnv) {
    super({
      objectCaching: false,
      strokeWidth: 0,
      lockScalingFlip: true,
      transparentCorners: false,
      cornerStyle: 'circle',
      cornerColor: '#ffffff',
      cornerStrokeColor: UI_COLOR,
      borderColor: UI_COLOR,
      cornerSize: 11,
      padding: 0,
      borderScaleFactor: 1.5,
      hoverCursor: 'move',
    });
    this.elementId = element.id;
    this.element = element;
    this.env = env;
  }

  update(element: PosterElement, ratio: Ratio): void {
    this.element = element;
    const r = elementRect(element, ratio);
    const locked = element.locked;
    this.set({
      left: r.x + r.w / 2,
      top: r.y + r.h / 2,
      width: Math.max(1, r.w),
      height: Math.max(1, r.h),
      scaleX: 1,
      scaleY: 1,
      angle: element.rotation,
      opacity: element.opacity,
      visible: element.visible,
      selectable: !locked,
      evented: !locked,
      hasControls: !locked,
    });
    this.setCoords();
  }

  /**
   * Draw at the *scaled* size and cancel Fabric's scale, so while the user
   * resizes, text re-wraps and photos re-crop live instead of stretching.
   */
  override _render(ctx: CanvasRenderingContext2D): void {
    const w = this.width * this.scaleX;
    const h = this.height * this.scaleY;
    if (w < 1 || h < 1) return;
    ctx.save();
    ctx.scale(1 / this.scaleX, 1 / this.scaleY);
    ctx.translate(-w / 2, -h / 2);
    drawElementContent(ctx, this.element, w, h, this.env());
    ctx.restore();
  }
}

class BackgroundNode extends FabricObject {
  static type = 'PosterBackgroundNode';
  private poster: Pick<Poster, 'background'> = { background: '#ffffff' };
  private readonly env: () => RenderEnv;

  constructor(env: () => RenderEnv) {
    super({ objectCaching: false, strokeWidth: 0, selectable: false, evented: false, originX: 'left', originY: 'top', left: 0, top: 0 });
    this.env = env;
  }

  update(poster: Pick<Poster, 'background'>, ratio: Ratio): void {
    this.poster = poster;
    const { width, height } = canvasSize(ratio);
    this.set({ width, height });
  }

  override _render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(-this.width / 2, -this.height / 2);
    drawBackground(ctx, this.poster, this.width, this.height, this.env());
    ctx.restore();
  }
}

/* ------------------------------------------------------------------ */
/* Stage controller                                                    */
/* ------------------------------------------------------------------ */

export interface StageCallbacks {
  onSelect(id: string | null): void;
  onFrame(id: string, frame: Frame, rotation: number): void;
  onDoubleClick(id: string): void;
}

export class PosterStage {
  private readonly canvas: Canvas;
  private readonly background: BackgroundNode;
  private readonly nodes = new Map<string, ElementNode>();
  private env: RenderEnv | null = null;
  private ratio: Ratio = '4:5';
  private selectedId: string | null = null;
  private lockedSelection: PosterElement | null = null;
  private guides = { v: false, h: false };
  private syncing = false;

  constructor(
    element: HTMLCanvasElement,
    private readonly cb: StageCallbacks,
  ) {
    this.canvas = new Canvas(element, {
      selection: false, // one element at a time
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      controlsAboveOverlay: true,
      fireRightClick: false,
    });
    this.background = new BackgroundNode(this.envGetter);
    this.canvas.add(this.background);
    this.bindEvents();
  }

  /** Nodes read the current env lazily, so a brand/date change repaints without rebuilding objects. */
  private readonly envGetter = () => this.env as RenderEnv;

  private bindEvents(): void {
    const c = this.canvas;
    const selectFrom = (target: FabricObject | undefined) => {
      if (this.syncing) return;
      this.cb.onSelect(target instanceof ElementNode ? target.elementId : null);
    };
    c.on('selection:created', (e) => selectFrom(e.selected[0]));
    c.on('selection:updated', (e) => selectFrom(e.selected[0]));
    c.on('selection:cleared', () => selectFrom(undefined));

    c.on('object:moving', (e) => this.snap(e.target));
    c.on('mouse:up', () => {
      if (this.guides.v || this.guides.h) {
        this.guides = { v: false, h: false };
        c.requestRenderAll();
      }
    });

    c.on('object:modified', (e) => {
      const node = e.target;
      if (!(node instanceof ElementNode)) return;
      const w = node.width * node.scaleX;
      const h = node.height * node.scaleY;
      const center = node.getCenterPoint();
      const { width, height } = canvasSize(this.ratio);
      const frame = pxToFrame({ x: center.x - w / 2, y: center.y - h / 2, w, h }, width, height);
      this.cb.onFrame(node.elementId, frame, Math.round(node.angle * 10) / 10);
    });

    c.on('mouse:dblclick', (e: TPointerEventInfo) => {
      if (e.target instanceof ElementNode) this.cb.onDoubleClick(e.target.elementId);
    });

    c.on('after:render', () => this.drawOverlay());
  }

  /** Snap the dragged element's centre to the canvas centre lines. */
  private snap(target: FabricObject): void {
    const { width, height } = canvasSize(this.ratio);
    const c = target.getCenterPoint();
    const threshold = SNAP_PX / this.canvas.getZoom();
    const v = Math.abs(c.x - width / 2) < threshold;
    const h = Math.abs(c.y - height / 2) < threshold;
    if (v) target.set({ left: target.left + (width / 2 - c.x) });
    if (h) target.set({ top: target.top + (height / 2 - c.y) });
    target.setCoords();
    this.guides = { v, h };
  }

  /** Editor-only overlay: snap guides + outline for a selected locked element. */
  private drawOverlay(): void {
    const ctx = this.canvas.getContext();
    const vpt = this.canvas.viewportTransform;
    const { width, height } = canvasSize(this.ratio);
    ctx.save();
    ctx.setTransform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
    const px = 1 / this.canvas.getZoom();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = px;
    ctx.setLineDash([6 * px, 4 * px]);
    ctx.beginPath();
    if (this.guides.v) {
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
    }
    if (this.guides.h) {
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
    }
    ctx.stroke();
    if (this.lockedSelection) {
      const r = elementRect(this.lockedSelection, this.ratio);
      ctx.strokeStyle = UI_COLOR;
      ctx.lineWidth = 2 * px;
      ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
      ctx.rotate((this.lockedSelection.rotation * Math.PI) / 180);
      ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
    }
    ctx.restore();
  }

  /** Display size: logical canvas × scale (the backing store handles devicePixelRatio). */
  setScale(ratio: Ratio, scale: number): void {
    const { width, height } = canvasSize(ratio);
    this.canvas.setDimensions({ width: Math.round(width * scale), height: Math.round(height * scale) });
    this.canvas.setZoom(scale);
    this.canvas.requestRenderAll();
  }

  /** Reconciles Fabric objects with poster state (create / update / remove / restack). */
  sync(poster: Poster, env: RenderEnv, selectedId: string | null): void {
    this.syncing = true;
    this.env = env;
    this.ratio = poster.ratio;
    this.background.update(poster, poster.ratio);

    const seen = new Set<string>();
    poster.elements.forEach((el, i) => {
      seen.add(el.id);
      let node = this.nodes.get(el.id);
      if (!node) {
        node = new ElementNode(el, this.envGetter);
        this.nodes.set(el.id, node);
        this.canvas.add(node);
      }
      node.update(el, poster.ratio);
      if (this.canvas.getObjects().indexOf(node) !== i + 1) this.canvas.moveObjectTo(node, i + 1);
    });
    for (const [id, node] of this.nodes) {
      if (!seen.has(id)) {
        this.canvas.remove(node);
        this.nodes.delete(id);
      }
    }

    // Selection follows the store (layer list clicks, undo, template switch)
    const selected = selectedId ? poster.elements.find((e) => e.id === selectedId) : undefined;
    this.lockedSelection = selected && (selected.locked || !selected.visible) ? selected : null;
    const node = selected && !this.lockedSelection ? this.nodes.get(selected.id) : undefined;
    if (node) {
      if (this.canvas.getActiveObject() !== node) this.canvas.setActiveObject(node);
    } else if (this.canvas.getActiveObject()) {
      this.canvas.discardActiveObject();
    }
    this.selectedId = selectedId;
    this.syncing = false;
    this.canvas.requestRenderAll();
  }

  render(): void {
    this.canvas.requestRenderAll();
  }

  get selection(): string | null {
    return this.selectedId;
  }

  dispose(): Promise<boolean> {
    return this.canvas.dispose();
  }
}
