import { useExportActions } from '../../hooks/useExportActions';
import { useEditorStore } from '../../store/editorStore';
import { useActivePoster } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { Ratio } from '../../types/element';
import { RATIOS, RATIO_KEYS, canvasSize } from '../../utils/aspectRatio';
import { PosterCanvas } from '../canvas/PosterCanvas';
import { Button, IconButton, cx } from '../common/controls';

const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5];

function RatioPicker() {
  const poster = useActivePoster();
  const setRatio = useEditorStore((s) => s.setRatio);
  return (
    <div role="radiogroup" aria-label="Aspect ratio" className="flex rounded-lg border border-ink-700 bg-ink-950 p-0.5">
      {RATIO_KEYS.map((r: Ratio) => (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={poster.ratio === r}
          title={`${RATIOS[r].hint} · ${RATIOS[r].width}×${RATIOS[r].height}`}
          onClick={() => setRatio(r)}
          className={cx(
            'rounded-md px-2 py-1 text-xs font-semibold tabular-nums transition',
            poster.ratio === r ? 'bg-brand text-brand-ink' : 'text-ink-300 hover:text-white',
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function ZoomControls() {
  const zoom = useUiStore((s) => s.previewZoom);
  const set = useUiStore((s) => s.set);
  const current = useUiStore((s) => s.displayScale);
  const step = (dir: 1 | -1) => {
    const next = dir > 0 ? ZOOM_STEPS.find((z) => z > current + 0.001) : [...ZOOM_STEPS].reverse().find((z) => z < current - 0.001);
    if (next) set('previewZoom', next);
  };
  return (
    <div className="flex items-center gap-1">
      <IconButton icon="zoomOut" label="Zoom out" onClick={() => step(-1)} />
      <button
        type="button"
        onClick={() => set('previewZoom', 'fit')}
        title="Fit to screen"
        className={cx('w-14 rounded-lg py-1.5 text-xs font-semibold tabular-nums', zoom === 'fit' ? 'text-brand' : 'text-ink-300 hover:text-white')}
      >
        {zoom === 'fit' ? 'Fit' : `${Math.round(zoom * 100)}%`}
      </button>
      <IconButton icon="zoomIn" label="Zoom in" onClick={() => step(1)} />
    </div>
  );
}

/**
 * Right half of the workspace — the real-time poster (proposal §5, §6, §34).
 * Split: 50 % column · Minimized: floating dock · Fullscreen: editor hidden, preview 100 %.
 */
export function PreviewPanel() {
  const view = useUiStore((s) => s.view);
  const fullscreen = useUiStore((s) => s.fullscreen);
  const set = useUiStore((s) => s.set);
  const poster = useActivePoster();
  const selected = useEditorStore((s) => poster.elements.find((e) => e.id === s.selectedId));
  const { busy, download, copy } = useExportActions();
  const docked = view === 'minimized' && !fullscreen;
  const { width, height } = canvasSize(poster.ratio);

  if (docked) {
    return (
      <aside className="fixed bottom-4 right-4 z-40 flex w-[272px] flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl" aria-label="Poster preview (minimized)">
        <div className="flex items-center justify-between border-b border-ink-800 px-3 py-2">
          <span className="text-xs font-semibold text-white">Live preview</span>
          <div className="flex gap-1">
            <IconButton icon="split" label="Restore split view" onClick={() => set('view', 'split')} />
            <IconButton icon="maximize" label="Full screen" onClick={() => set('fullscreen', true)} />
            <IconButton icon="download" label="Download" disabled={busy} onClick={() => void download()} />
          </div>
        </div>
        <div className="flex h-[300px]">
          <PosterCanvas compact />
        </div>
      </aside>
    );
  }

  return (
    <section
      aria-label="Poster preview"
      className={cx(
        'flex min-h-0 min-w-0 flex-col bg-[radial-gradient(circle_at_50%_40%,#172238,transparent_70%)]',
        fullscreen ? 'fixed inset-0 z-50 bg-ink-950' : 'h-full',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-800 px-4 py-2.5">
        <RatioPicker />
        <div className="flex items-center gap-2">
          <ZoomControls />
          <span className="mx-1 h-5 w-px bg-ink-700" />
          {!fullscreen && <IconButton icon="dock" label="Minimize preview" onClick={() => set('view', 'minimized')} />}
          <IconButton
            icon={fullscreen ? 'minimize' : 'maximize'}
            label={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'}
            active={fullscreen}
            onClick={() => set('fullscreen', !fullscreen)}
          />
        </div>
      </div>

      <PosterCanvas />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-800 px-4 py-2.5">
        <p className="text-[11px] text-ink-400">
          {width} × {height}px
          {selected ? (
            <>
              {' '}
              · <span className="text-ink-200">{selected.name}</span>
              {selected.locked ? ' (locked)' : ' — drag to move, handles to resize/rotate'}
            </>
          ) : (
            ' · click an element to select it · double-click text to edit'
          )}
        </p>
        <div className="flex gap-2">
          <Button size="sm" icon="copy" disabled={busy} onClick={() => void copy()}>
            Copy image
          </Button>
          <Button size="sm" variant="primary" icon="download" disabled={busy} onClick={() => void download()}>
            Download
          </Button>
        </div>
      </div>
    </section>
  );
}
