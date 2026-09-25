import { useCallback, useState } from 'react';
import { toast } from '../components/common/feedback';
import { copyPoster, downloadAllPosters, downloadPoster } from '../services/exportService';
import { selectActivePoster, useEditorStore } from '../store/editorStore';
import { useUiStore } from '../store/uiStore';

const message = (e: unknown) => (e instanceof Error ? e.message : 'The poster could not be exported. Please try again.');

/** Download / copy / ZIP actions with shared busy state and user-facing errors (proposal §43). */
export function useExportActions() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const run = useCallback(async (fn: () => Promise<void>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
    } catch (e) {
      toast.error(message(e));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, []);

  const download = useCallback(() => {
    const s = useEditorStore.getState();
    const { exportFormat, exportScale } = useUiStore.getState();
    const poster = selectActivePoster(s);
    return run(() => downloadPoster(poster, s.brandOverrides[poster.brandId], exportFormat, exportScale), `Downloaded ${exportFormat.toUpperCase()}`);
  }, [run]);

  const copy = useCallback(() => {
    const s = useEditorStore.getState();
    const poster = selectActivePoster(s);
    return run(() => copyPoster(poster, s.brandOverrides[poster.brandId]), 'Poster copied to clipboard');
  }, [run]);

  const downloadAll = useCallback(() => {
    const s = useEditorStore.getState();
    const { exportFormat, exportScale } = useUiStore.getState();
    setProgress({ done: 0, total: s.posters.length });
    return run(
      () =>
        downloadAllPosters(s.posters, (p) => s.brandOverrides[p.brandId], exportFormat, exportScale, (done, total) => setProgress({ done, total })),
      `Downloaded ${s.posters.length} posters (ZIP)`,
    );
  }, [run]);

  return { busy, progress, download, copy, downloadAll };
}
