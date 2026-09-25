import { AppHeader } from './components/AppHeader';
import { EditorPanel } from './components/editor/EditorPanel';
import { ExportProvider, useExport } from './components/ExportProvider';
import { PreviewPanel } from './components/preview/PreviewPanel';
import type { ViewMode } from './components/preview/PreviewPanel';
import { ToastProvider } from './components/ui/Toast';
import { useLocalPreference } from './hooks/useLocalPreference';
import { StoreProvider, useStore } from './state/store';

const VIEW_MODES: readonly ViewMode[] = ['split', 'minimized'];

function Workspace() {
  const [view, setView] = useLocalPreference<ViewMode>('poster-studio:view', 'split', VIEW_MODES);
  return (
    <main className={`workspace workspace--${view}`}>
      <EditorPanel />
      <PreviewPanel view={view} onViewChange={setView} />
    </main>
  );
}

/** Global progress pill so long ZIP exports stay visible from any tab. */
function ExportProgress() {
  const { progress, cancel } = useExport();
  const { t } = useStore();
  if (!progress) return null;
  return (
    <div className="export-pill" role="status">
      <progress value={progress.done} max={progress.total} />
      <span>{t('exporting', { done: progress.done, total: progress.total })}</span>
      <button type="button" className="btn btn--ghost btn--sm" onClick={cancel}>
        {t('cancel')}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <ExportProvider>
          <div className="app">
            <AppHeader />
            <Workspace />
            <ExportProgress />
          </div>
        </ExportProvider>
      </ToastProvider>
    </StoreProvider>
  );
}
