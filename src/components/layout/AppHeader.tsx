import { useEffect, useRef, useState } from 'react';
import { useExportActions } from '../../hooks/useExportActions';
import { useEditorStore } from '../../store/editorStore';
import { useUiStore } from '../../store/uiStore';
import type { ExportFormat } from '../../store/uiStore';
import { Button, IconButton, Segmented } from '../common/controls';
import { confirm, toast } from '../common/feedback';
import { Icon } from '../common/Icon';
import { BrandSwitcher } from './BrandSwitcher';

function SaveIndicator() {
  const status = useUiStore((s) => s.saveStatus);
  const label = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Not saved';
  return (
    <span
      className={`hidden items-center gap-1.5 text-xs md:inline-flex ${status === 'error' ? 'text-red-400' : status === 'saving' ? 'text-ink-400' : 'text-emerald-400'}`}
      role="status"
    >
      <Icon name={status === 'error' ? 'x' : 'check'} size={14} />
      {label}
    </span>
  );
}

/** Download button with format & resolution options (proposal §36). */
function DownloadMenu() {
  const { busy, download } = useExportActions();
  const format = useUiStore((s) => s.exportFormat);
  const scale = useUiStore((s) => s.exportScale);
  const set = useUiStore((s) => s.set);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative flex">
      <Button variant="primary" icon="download" disabled={busy} onClick={() => void download()} className="rounded-r-none">
        <span className="hidden sm:inline">Download</span> {format.toUpperCase()}
      </Button>
      <button
        type="button"
        aria-label="Download options"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-r-lg border-l border-black/15 bg-brand px-2 text-brand-ink hover:brightness-110"
      >
        <Icon name="chevronDown" size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-ink-700 bg-ink-900 p-4 shadow-2xl">
          <p className="mb-2 text-xs font-medium text-ink-300">Format</p>
          <Segmented<ExportFormat>
            label="Format"
            value={format}
            onChange={(v) => set('exportFormat', v)}
            options={[
              { value: 'png', label: 'PNG' },
              { value: 'jpg', label: 'JPG' },
            ]}
          />
          <p className="mb-2 mt-4 text-xs font-medium text-ink-300">Resolution</p>
          <Segmented<1 | 2 | 3>
            label="Resolution"
            value={scale}
            onChange={(v) => set('exportScale', v)}
            options={[
              { value: 1, label: '1×', title: '1080 px wide' },
              { value: 2, label: '2×', title: '2160 px wide' },
              { value: 3, label: '3×', title: '3240 px wide' },
            ]}
          />
          <p className="mt-3 text-[11px] text-ink-400">1× is the standard social size (1080 px wide).</p>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const resetPoster = useEditorStore((s) => s.resetPoster);
  const setUi = useUiStore((s) => s.set);

  const onReset = async () => {
    const ok = await confirm({
      title: 'Reset this poster?',
      message: 'Text, photos and positions go back to the template defaults. Other posters are not affected.',
      confirmLabel: 'Reset',
      danger: true,
    });
    if (ok) {
      resetPoster();
      toast.info('Poster reset to template defaults');
    }
  };

  return (
    <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-ink-800 bg-ink-950/95 px-3 py-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden size-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink sm:grid" aria-hidden="true">
          <Icon name="sparkles" size={18} />
        </div>
        <div className="hidden min-w-0 lg:block">
          <h1 className="text-sm font-bold tracking-wide text-white">ARTOVA DESIGNS</h1>
          <p className="truncate text-[11px] text-ink-400">Ad posters for Nepal Scholar · Thesis Companion · Artova Research</p>
        </div>
        <BrandSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <SaveIndicator />
        <IconButton icon="info" label="Guide: how Artova Designs works" onClick={() => { setUi('tab', 'guide'); setUi('mobilePane', 'editor'); }} />
        <IconButton icon="undo" label="Undo (Ctrl+Z)" disabled={!canUndo} onClick={undo} />
        <IconButton icon="redo" label="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={redo} />
        <Button icon="reset" onClick={() => void onReset()} className="hidden md:inline-flex">
          Reset
        </Button>
        <DownloadMenu />
      </div>
    </header>
  );
}
