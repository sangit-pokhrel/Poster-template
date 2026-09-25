import { useUiStore } from '../../store/uiStore';
import { cx } from '../common/controls';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';

/**
 * 50 / 50 editor + live preview (proposal §4). The preview can be minimized
 * into a floating dock (editor goes full width) or opened full screen.
 * Below the `lg` breakpoint the two halves become tabs.
 */
export function Workspace() {
  const view = useUiStore((s) => s.view);
  const pane = useUiStore((s) => s.mobilePane);
  const set = useUiStore((s) => s.set);

  return (
    <>
      <div className="flex border-b border-ink-800 lg:hidden" role="tablist" aria-label="Workspace">
        {(['editor', 'preview'] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pane === p}
            onClick={() => set('mobilePane', p)}
            className={cx('flex-1 py-2.5 text-sm font-medium capitalize', pane === p ? 'border-b-2 border-brand text-white' : 'text-ink-400')}
          >
            {p}
          </button>
        ))}
      </div>
      <main className={cx('grid min-h-0 flex-1', view === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        <div className={cx('min-h-0 min-w-0', pane === 'preview' && 'max-lg:hidden', view === 'minimized' && 'mx-auto w-full max-w-4xl')}>
          <EditorPanel />
        </div>
        <div className={cx('min-h-0 min-w-0', pane === 'editor' && view === 'split' && 'max-lg:hidden')}>
          <PreviewPanel />
        </div>
      </main>
    </>
  );
}
