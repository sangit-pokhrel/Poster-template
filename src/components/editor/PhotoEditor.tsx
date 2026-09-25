import { SAMPLE } from '../../data/templates/builders';
import { useImageUrl } from '../../hooks/useImageUrl';
import { UploadError, importImageFile } from '../../services/imageService';
import { useEditorStore } from '../../store/editorStore';
import type { ImageElement } from '../../types/element';
import { Button, Dropzone, IconButton, Segmented, Slider, cx } from '../common/controls';
import { toast } from '../common/feedback';

const SAMPLES = Object.entries(SAMPLE);

/** Upload / sample / crop / zoom / pan for one photo slot (proposal §12, §13). */
export function PhotoEditor({ el, advanced }: { el: ImageElement; advanced: boolean }) {
  const updateData = useEditorStore((s) => s.updateData);
  const updateElement = useEditorStore((s) => s.updateElement);
  const select = useEditorStore((s) => s.select);
  const selected = useEditorStore((s) => s.selectedId === el.id);
  const preview = useImageUrl(el.data.src);
  const d = el.data;

  const setSrc = (src: string) => {
    updateData<'image'>(el.id, { src, zoom: 1, panX: 0, panY: 0 });
    if (!el.visible) updateElement(el.id, { visible: true });
  };

  const onFile = async (file: File) => {
    try {
      setSrc(await importImageFile(file));
      toast.success('Photo added');
    } catch (e) {
      toast.error(e instanceof UploadError ? e.message : 'This image could not be read. Please try a different file.');
    }
  };

  return (
    <div
      className={cx('flex flex-col gap-3 rounded-lg p-2 transition', selected && 'bg-brand/5 ring-1 ring-brand/40')}
      onFocusCapture={() => select(el.id)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-200">{el.name}</span>
        <div className="flex gap-1">
          {d.src && <IconButton icon="trash" label={`Remove ${el.name}`} className="size-7" onClick={() => updateData<'image'>(el.id, { src: '' })} />}
          <IconButton
            icon={el.visible ? 'eye' : 'eyeOff'}
            label={el.visible ? `Hide ${el.name}` : `Show ${el.name}`}
            className="size-7"
            onClick={() => updateElement(el.id, { visible: !el.visible })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-700 bg-ink-950">
          {preview ? <img src={preview} alt="" className="size-full object-cover" /> : <span className="text-[10px] text-ink-600">No photo</span>}
        </div>
        <div className="min-w-0 flex-1">
          <Dropzone compact label="Drop a photo or click to upload" onFile={(f) => void onFile(f)} />
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-[11px] font-medium text-ink-400 hover:text-ink-200">Or pick a sample photo</summary>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {SAMPLES.map(([name, src]) => (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => setSrc(src)}
              className={cx('aspect-square overflow-hidden rounded-md border', d.src === src ? 'border-brand ring-1 ring-brand' : 'border-ink-700 hover:border-ink-500')}
            >
              <img src={src} alt={name} loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </details>

      {d.src && (
        <div className="flex flex-col gap-3 rounded-lg border border-ink-800 p-3">
          <Segmented
            label="Photo fit"
            value={d.fit}
            onChange={(fit) => updateData<'image'>(el.id, { fit })}
            options={[
              { value: 'cover', label: 'Cover crop', title: 'Fill the frame, cropping edges' },
              { value: 'contain', label: 'Contain fit', title: 'Show the whole photo over a blurred backdrop' },
            ]}
          />
          <Slider label="Zoom" value={d.zoom} min={0.5} max={3} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onChange={(zoom) => updateData<'image'>(el.id, { zoom })} />
          <div className="grid grid-cols-2 gap-3">
            <Slider label="Pan horizontal" value={d.panX} min={-1} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}`} onChange={(panX) => updateData<'image'>(el.id, { panX })} />
            <Slider label="Pan vertical" value={d.panY} min={-1} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}`} onChange={(panY) => updateData<'image'>(el.id, { panY })} />
          </div>
          <div className="flex items-center justify-between">
            <Button size="sm" variant="ghost" icon="reset" onClick={() => updateData<'image'>(el.id, { zoom: 1, panX: 0, panY: 0 })}>
              Reset framing
            </Button>
            {advanced && (
              <label className="flex items-center gap-2 text-xs text-ink-300">
                <input type="checkbox" checked={d.grayscale} onChange={(e) => updateData<'image'>(el.id, { grayscale: e.target.checked })} />
                Black & white
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
