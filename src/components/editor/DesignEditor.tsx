import { FONT_FAMILIES } from '../../services/fontService';
import type { LayerMove } from '../../store/editorStore';
import { useEditorStore } from '../../store/editorStore';
import { useActivePoster, useBrandFor } from '../../store/selectors';
import type { BadgeElement, BadgeStyle, ImageElement, LogoElement, PosterElement, ShapeElement, TextElement } from '../../types/element';
import { canvasSize, elementRect, pxToFrame } from '../../utils/aspectRatio';
import { Button, Field, IconButton, Section, Segmented, Select, Slider, TextInput, Toggle, cx } from '../common/controls';
import type { IconName } from '../common/Icon';
import { Icon } from '../common/Icon';
import { ColorField } from './ColorField';

const TYPE_ICON: Record<PosterElement['type'], IconName> = { text: 'text', image: 'image', logo: 'sparkles', shape: 'grid', badge: 'tag' };

function useFontOptions() {
  const poster = useActivePoster();
  const brand = useBrandFor(poster.brandId);
  return [
    { value: 'brand.heading', label: `Brand heading (${brand.fonts.heading})` },
    { value: 'brand.body', label: `Brand body (${brand.fonts.body})` },
    ...FONT_FAMILIES.map((f) => ({ value: f, label: f })),
  ];
}

/* ------------------------------------------------------------------ */
/* Typography (proposal §10)                                           */
/* ------------------------------------------------------------------ */

function TypographyEditor({ el }: { el: TextElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const fonts = useFontOptions();
  const d = el.data;
  const set = (patch: Partial<TextElement['data']>) => updateData<'text'>(el.id, patch);
  return (
    <Section title="Typography" icon="text">
      <Field label="Font family">{(id) => <Select id={id} value={d.fontFamily} onChange={(fontFamily) => set({ fontFamily })} options={fonts} />}</Field>
      <div className="grid grid-cols-2 gap-3">
        <Slider label="Size" value={d.fontSize} min={12} max={240} onChange={(fontSize) => set({ fontSize })} format={(v) => `${v}px`} />
        <Field label="Weight">
          {(id) => (
            <Select
              id={id}
              value={String(d.fontWeight)}
              onChange={(w) => set({ fontWeight: Number(w) })}
              options={[400, 500, 600, 700, 800].map((w) => ({ value: String(w), label: String(w) }))}
            />
          )}
        </Field>
        <Slider label="Line spacing" value={d.lineHeight} min={0.8} max={2.2} step={0.05} onChange={(lineHeight) => set({ lineHeight })} format={(v) => v.toFixed(2)} />
        <Slider label="Letter spacing" value={d.letterSpacing} min={-4} max={24} step={0.5} onChange={(letterSpacing) => set({ letterSpacing })} format={(v) => `${v}px`} />
      </div>
      <Segmented
        label="Alignment"
        value={d.align}
        onChange={(align) => set({ align })}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
      />
      <Segmented
        label="Vertical alignment"
        value={d.vAlign}
        onChange={(vAlign) => set({ vAlign })}
        options={[
          { value: 'top', label: 'Top' },
          { value: 'middle', label: 'Middle' },
          { value: 'bottom', label: 'Bottom' },
        ]}
      />
      <ColorField label="Text colour" value={d.color} onChange={(color) => set({ color })} />
      <ColorField label="Highlight colour" value={d.highlightColor} onChange={(highlightColor) => set({ highlightColor })} />
      <Segmented
        label="Highlight style"
        value={d.highlightStyle}
        onChange={(highlightStyle) => set({ highlightStyle })}
        options={[
          { value: 'color', label: 'Coloured words' },
          { value: 'marker', label: 'Marker' },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <Toggle label="UPPERCASE" checked={d.uppercase} onChange={(uppercase) => set({ uppercase })} />
        <Toggle label="Italic" checked={d.italic} onChange={(italic) => set({ italic })} />
        <Toggle label="Auto-fit" checked={d.autoFit} onChange={(autoFit) => set({ autoFit })} />
        <Toggle label="Shadow" checked={d.shadow} onChange={(shadow) => set({ shadow })} />
      </div>
    </Section>
  );
}

function ImageStyleEditor({ el }: { el: ImageElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const d = el.data;
  const set = (patch: Partial<ImageElement['data']>) => updateData<'image'>(el.id, patch);
  return (
    <Section title="Photo frame" icon="image">
      <Segmented
        label="Frame shape"
        value={d.shape}
        onChange={(shape) => set({ shape })}
        options={[
          { value: 'rect', label: 'Rectangle' },
          { value: 'circle', label: 'Circle' },
          { value: 'arch', label: 'Arch' },
        ]}
      />
      {d.shape === 'rect' && <Slider label="Corner radius" value={d.radius} min={0} max={200} onChange={(radius) => set({ radius })} format={(v) => `${v}px`} />}
      <Slider label="Border" value={d.borderWidth} min={0} max={40} onChange={(borderWidth) => set({ borderWidth })} format={(v) => `${v}px`} />
      {d.borderWidth > 0 && <ColorField label="Border colour" value={d.borderColor} onChange={(borderColor) => set({ borderColor })} />}
      <Toggle label="Black & white" checked={d.grayscale} onChange={(grayscale) => set({ grayscale })} />
      {d.overlay && <Toggle label="Colour fade overlay" checked onChange={() => set({ overlay: null })} />}
    </Section>
  );
}

function ShapeStyleEditor({ el }: { el: ShapeElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const d = el.data;
  return (
    <Section title="Shape" icon="grid">
      {typeof d.fill === 'string' ? (
        <ColorField label="Fill" value={d.fill} onChange={(fill) => updateData<'shape'>(el.id, { fill })} />
      ) : (
        <div className="flex items-center justify-between text-xs text-ink-300">
          Gradient fill
          <Button size="sm" onClick={() => updateData<'shape'>(el.id, { fill: 'brand.primary' })}>
            Make solid
          </Button>
        </div>
      )}
      {(d.kind === 'rect' || d.kind === 'dots' || d.kind === 'stripes') && (
        <Slider label={d.kind === 'rect' ? 'Corner radius' : 'Pattern size'} value={d.radius} min={0} max={120} onChange={(radius) => updateData<'shape'>(el.id, { radius })} />
      )}
    </Section>
  );
}

function BadgeStyleEditor({ el }: { el: BadgeElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const fonts = useFontOptions();
  const d = el.data;
  const set = (patch: Partial<BadgeElement['data']>) => updateData<'badge'>(el.id, patch);
  return (
    <Section title="Badge style" icon="tag">
      <Field label="Style">
        {(id) => (
          <Select<BadgeStyle>
            id={id}
            value={d.style}
            onChange={(style) => set({ style })}
            options={(['pill', 'tag', 'outline', 'ribbon', 'circle', 'underline'] as const).map((v) => ({ value: v, label: v[0]?.toUpperCase() + v.slice(1) }))}
          />
        )}
      </Field>
      <Field label="Font">{(id) => <Select id={id} value={d.fontFamily} onChange={(fontFamily) => set({ fontFamily })} options={fonts} />}</Field>
      <Slider label="Max text size" value={d.fontSize} min={12} max={140} onChange={(fontSize) => set({ fontSize })} format={(v) => `${v}px`} />
      <ColorField label="Badge colour" value={d.fill} onChange={(fill) => set({ fill })} />
      <ColorField label="Text colour" value={d.color} onChange={(color) => set({ color })} />
      <Toggle label="UPPERCASE" checked={d.uppercase} onChange={(uppercase) => set({ uppercase })} />
    </Section>
  );
}

function LogoStyleEditor({ el }: { el: LogoElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const d = el.data;
  return (
    <Section title="Logo" icon="sparkles">
      <Segmented label="Artwork" value={d.variant} onChange={(variant) => updateData<'logo'>(el.id, { variant })} options={[{ value: 'full', label: 'Full logo' }, { value: 'mark', label: 'Symbol' }]} />
      <Segmented label="Background" value={d.tone} onChange={(tone) => updateData<'logo'>(el.id, { tone })} options={[{ value: 'dark', label: 'On light bg' }, { value: 'light', label: 'On dark bg' }]} />
      <Toggle label="White card behind logo" checked={d.card} onChange={(card) => updateData<'logo'>(el.id, { card })} />
      <Segmented label="Align" value={d.align} onChange={(align) => updateData<'logo'>(el.id, { align })} options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Position, size, rotation, opacity                                   */
/* ------------------------------------------------------------------ */

function GeometryEditor({ el }: { el: PosterElement }) {
  const poster = useActivePoster();
  const setFrame = useEditorStore((s) => s.setFrame);
  const resetFrame = useEditorStore((s) => s.resetFrame);
  const updateElement = useEditorStore((s) => s.updateElement);
  const r = elementRect(el, poster.ratio);
  const { width, height } = canvasSize(poster.ratio);
  const setPx = (key: 'x' | 'y' | 'w' | 'h', v: number) => {
    if (!Number.isFinite(v)) return;
    const next = { ...r, [key]: key === 'w' || key === 'h' ? Math.max(4, v) : v };
    setFrame(el.id, pxToFrame(next, width, height));
  };
  return (
    <Section title="Position & size" icon="crosshair">
      <div className="grid grid-cols-4 gap-2">
        {(['x', 'y', 'w', 'h'] as const).map((k) => (
          <Field key={k} label={k.toUpperCase()}>
            {(id) => (
              <TextInput id={id} type="number" disabled={el.locked} value={Math.round(r[k])} onChange={(e) => setPx(k, Number(e.target.value))} className="px-2 tabular-nums" />
            )}
          </Field>
        ))}
      </div>
      <Slider label="Rotation" value={el.rotation} min={-180} max={180} onChange={(rotation) => updateElement(el.id, { rotation })} format={(v) => `${v}°`} />
      <Slider label="Opacity" value={el.opacity} min={0} max={1} step={0.01} onChange={(opacity) => updateElement(el.id, { opacity })} format={(v) => `${Math.round(v * 100)}%`} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Toggle label="Locked" checked={el.locked} onChange={(locked) => updateElement(el.id, { locked })} />
        <Toggle label="Visible" checked={el.visible} onChange={(visible) => updateElement(el.id, { visible })} />
        <Button size="sm" icon="reset" onClick={() => resetFrame(el.id)}>
          Reset position
        </Button>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Layers (proposal §19)                                               */
/* ------------------------------------------------------------------ */

function LayerEditor() {
  const poster = useActivePoster();
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);
  const moveLayer = useEditorStore((s) => s.moveLayer);
  const updateElement = useEditorStore((s) => s.updateElement);
  const top = [...poster.elements].reverse();
  const moves: ReadonlyArray<{ move: LayerMove; icon: IconName; label: string }> = [
    { move: 'front', icon: 'toFront', label: 'Bring to front' },
    { move: 'forward', icon: 'chevronUp', label: 'Bring forward' },
    { move: 'backward', icon: 'chevronDown', label: 'Send backward' },
    { move: 'back', icon: 'toBack', label: 'Send to back' },
  ];
  return (
    <Section
      title={`Layers (${poster.elements.length})`}
      icon="layers"
      actions={
        <div className="flex gap-1">
          {moves.map((m) => (
            <IconButton key={m.move} icon={m.icon} label={m.label} disabled={!selectedId} className="size-7" onClick={() => selectedId && moveLayer(selectedId, m.move)} />
          ))}
        </div>
      }
    >
      <ol className="flex flex-col gap-0.5">
        {top.map((el, i) => (
          <li key={el.id}>
            <div
              className={cx(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition',
                el.id === selectedId ? 'bg-brand/15 text-white ring-1 ring-brand/50' : 'text-ink-300 hover:bg-ink-800',
              )}
            >
              <span className="w-5 text-right tabular-nums text-ink-500">{poster.elements.length - i}</span>
              <button type="button" onClick={() => select(el.id)} className={cx('flex min-w-0 flex-1 items-center gap-2 text-left', !el.visible && 'opacity-45')}>
                <Icon name={TYPE_ICON[el.type]} size={14} className="shrink-0 text-ink-400" />
                <span className="truncate">{el.name}</span>
              </button>
              <IconButton icon={el.locked ? 'lock' : 'unlock'} label={el.locked ? 'Unlock' : 'Lock'} className="size-6 border-transparent bg-transparent" onClick={() => updateElement(el.id, { locked: !el.locked })} />
              <IconButton icon={el.visible ? 'eye' : 'eyeOff'} label={el.visible ? 'Hide' : 'Show'} className="size-6 border-transparent bg-transparent" onClick={() => updateElement(el.id, { visible: !el.visible })} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function BackgroundEditor() {
  const poster = useActivePoster();
  const setBackground = useEditorStore((s) => s.setBackground);
  return (
    <Section title="Poster background" icon="palette" defaultOpen={false}>
      {typeof poster.background === 'string' ? (
        <ColorField label="Background" value={poster.background} onChange={setBackground} />
      ) : (
        <div className="flex items-center justify-between text-xs text-ink-300">
          Brand gradient
          <Button size="sm" onClick={() => setBackground('brand.primary')}>
            Make solid
          </Button>
        </div>
      )}
    </Section>
  );
}

/** Advanced Edit (proposal §21): full control over the selected element + layers. */
export function DesignEditor() {
  const poster = useActivePoster();
  const selectedId = useEditorStore((s) => s.selectedId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const el = poster.elements.find((e) => e.id === selectedId);

  return (
    <div className="flex flex-col gap-4">
      {el ? (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/5 px-3 py-2">
            <Icon name={TYPE_ICON[el.type]} size={16} className="text-brand" />
            <TextInput aria-label="Layer name" value={el.name} onChange={(e) => updateElement(el.id, { name: e.target.value })} className="border-transparent bg-transparent px-1 py-1 font-semibold" />
          </div>
          {el.type === 'text' && <TypographyEditor el={el} />}
          {el.type === 'image' && <ImageStyleEditor el={el} />}
          {el.type === 'shape' && <ShapeStyleEditor el={el} />}
          {el.type === 'badge' && <BadgeStyleEditor el={el} />}
          {el.type === 'logo' && <LogoStyleEditor el={el} />}
          <GeometryEditor el={el} />
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-ink-700 px-4 py-6 text-center text-sm text-ink-400">
          Select an element on the poster or in the layer list to edit its font, colour, position and more.
        </p>
      )}
      <LayerEditor />
      <BackgroundEditor />
    </div>
  );
}
