import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { TEMPLATES } from '../engine';
import { copyPosterToClipboard, downloadPoster, downloadPostersZip } from '../lib/exporter';
import type { ExportJob } from '../lib/exporter';
import { slugify } from '../lib/files';
import { selectActivePost } from '../state/reducer';
import { useStore } from '../state/store';
import { useToast } from './ui/Toast';

interface Progress {
  done: number;
  total: number;
}

interface ExportApi {
  progress: Progress | null;
  busy: boolean;
  downloadActive: () => Promise<void>;
  copyActive: () => Promise<void>;
  downloadAllPosts: () => Promise<void>;
  downloadActiveInAllTemplates: () => Promise<void>;
  cancel: () => void;
}

const ExportContext = createContext<ExportApi | null>(null);

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

/** Owns every "turn posters into files" action and the shared progress state. */
export function ExportProvider({ children }: { children: ReactNode }) {
  const { state, t } = useStore();
  const toast = useToast();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);

  // Read state through a ref so callbacks stay stable while the user types.
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  const fail = useCallback(
    (err: unknown) => toast(t('toastExportFailed', { msg: err instanceof Error ? err.message : String(err) }), 'error'),
    [toast, t],
  );

  const runSingle = useCallback(
    async (fn: () => Promise<void>, okMessage: string) => {
      setBusy(true);
      try {
        await fn();
        toast(okMessage);
      } catch (err) {
        fail(err);
      } finally {
        setBusy(false);
      }
    },
    [toast, fail],
  );

  const runZip = useCallback(
    async (jobs: ExportJob[], zipName: string) => {
      if (abort.current) return;
      const controller = new AbortController();
      abort.current = controller;
      setBusy(true);
      setProgress({ done: 0, total: jobs.length });
      const { brand, ratio } = stateRef.current;
      try {
        await downloadPostersZip(jobs, zipName, {
          brand,
          ratio,
          signal: controller.signal,
          onProgress: (done, total) => setProgress({ done, total }),
        });
        toast(t('toastZipDone', { n: jobs.length }));
      } catch (err) {
        if (isAbort(err)) toast(t('toastCancelled'), 'info');
        else fail(err);
      } finally {
        abort.current = null;
        setBusy(false);
        setProgress(null);
      }
    },
    [toast, t, fail],
  );

  const api = useMemo<ExportApi>(() => {
    const active = () => selectActivePost(stateRef.current);
    const stamp = () => new Date().toISOString().slice(0, 10);
    return {
      progress,
      busy,
      downloadActive: () => {
        const { brand, ratio } = stateRef.current;
        return runSingle(() => downloadPoster(active(), brand, ratio), t('toastDownloaded'));
      },
      copyActive: () => {
        const { brand, ratio } = stateRef.current;
        return runSingle(() => copyPosterToClipboard(active(), brand, ratio), t('toastCopied'));
      },
      downloadAllPosts: () => {
        const { posts, brand } = stateRef.current;
        return runZip(
          posts.map((post) => ({ post })),
          `${slugify(brand.name, 'posters')}-${stamp()}.zip`,
        );
      },
      downloadActiveInAllTemplates: () => {
        const post = active();
        return runZip(
          TEMPLATES.map((tpl) => ({ post, templateId: tpl.id })),
          `${slugify(post.headline)}-all-templates.zip`,
        );
      },
      cancel: () => abort.current?.abort(),
    };
  }, [progress, busy, runSingle, runZip, t]);

  return <ExportContext.Provider value={api}>{children}</ExportContext.Provider>;
}

export function useExport(): ExportApi {
  const ctx = useContext(ExportContext);
  if (!ctx) throw new Error('useExport must be used inside <ExportProvider>');
  return ctx;
}
