import { useCallback, useRef } from 'react';
import { ASPECT_RATIOS, ASPECT_RATIO_KEYS, CANVAS_WIDTH, canvasSize, getTemplate } from '../../engine';
import type { AspectRatio } from '../../engine';
import { useElementSize } from '../../hooks/useElementSize';
import { useFontsReady } from '../../hooks/useFontsReady';
import { useFullscreen } from '../../hooks/useFullscreen';
import { usePosterAssets } from '../../hooks/usePosterAssets';
import { selectActivePost } from '../../state/reducer';
import { useStore } from '../../state/store';
import { useExport } from '../ExportProvider';
import { Icon } from '../ui/Icon';
import { PosterCanvas } from './PosterCanvas';
import type { DragTarget } from './PosterCanvas';

export type ViewMode = 'split' | 'minimized';

const DOCK_WIDTH = 220;

/**
 * Right half of the workspace: the real-time poster.
 * - split: fills its 50% column, canvas scaled to fit both width and height
 * - minimized: collapses to a floating mini-preview dock; the editor takes the full width
 * - fullscreen (either mode): the panel covers the screen for presenting / checking detail
 */
export function PreviewPanel({ view, onViewChange }: { view: ViewMode; onViewChange: (v: ViewMode) => void }) {
  const { state, dispatch, t } = useStore();
  const exporter = useExport();
  const post = selectActivePost(state);
  const template = getTemplate(post.templateId);
  const assets = usePosterAssets(post.photoSrc, post.extraPhotoSrcs, state.brand.logoSrc);
  const fontsReady = useFontsReady();

  const panelRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, emulated, toggle } = useFullscreen(panelRef);
  const stage = useElementSize(stageRef);

  const minimized = view === 'minimized' && !isFullscreen;
  const aspect = CANVAS_WIDTH / canvasSize(state.ratio).height;
  const fitted = Math.floor(Math.min(stage.width, stage.height * aspect));
  const cssWidth = minimized ? DOCK_WIDTH : Math.max(160, fitted || 0);

  const onDrag = useCallback(
    (target: DragTarget, x: number, y: number) =>
      dispatch({
        type: 'post/update',
        id: post.id,
        patch: target === 'headline' ? { headlineX: x, headlineY: y } : { panX: x, panY: y },
      }),
    [dispatch, post.id],
  );

  const className = [
    'preview',
    minimized && 'preview--dock',
    isFullscreen && 'preview--fullscreen',
    emulated && 'preview--emulated',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={panelRef} className={className} aria-label={t('previewTitle')}>
      <header className="preview__header">
        <div className="preview__title">
          <Icon name="eye" size={16} />
          <h2>{t('previewTitle')}</h2>
          {!minimized && <span className="badge">{template.name}</span>}
        </div>
        <div className="preview__actions">
          {!minimized && (
            <select
              aria-label={t('ratioLabel')}
              value={state.ratio}
              onChange={(e) => dispatch({ type: 'settings/ratio', ratio: e.target.value as AspectRatio })}
            >
              {ASPECT_RATIO_KEYS.map((r) => (
                <option key={r} value={r}>
                  {ASPECT_RATIOS[r].icon} {r}
                </option>
              ))}
            </select>
          )}
          {!isFullscreen && (
            <button
              type="button"
              className="icon-btn"
              title={view === 'split' ? t('minimize') : t('restore')}
              aria-label={view === 'split' ? t('minimize') : t('restore')}
              onClick={() => onViewChange(view === 'split' ? 'minimized' : 'split')}
            >
              <Icon name={view === 'split' ? 'minimize' : 'split'} />
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            aria-label={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            aria-pressed={isFullscreen}
            onClick={() => void toggle()}
          >
            <Icon name={isFullscreen ? 'exitFullscreen' : 'maximize'} />
          </button>
          {minimized && (
            <button
              type="button"
              className="icon-btn"
              title={t('downloadPng')}
              aria-label={t('downloadPng')}
              disabled={exporter.busy}
              onClick={() => void exporter.downloadActive()}
            >
              <Icon name="download" />
            </button>
          )}
        </div>
      </header>

      <div ref={stageRef} className="preview__stage" style={{ '--poster-aspect': aspect } as React.CSSProperties}>
        <PosterCanvas
          post={post}
          brand={state.brand}
          ratio={state.ratio}
          assets={assets}
          fontsReady={fontsReady}
          cssWidth={cssWidth}
          label={`${template.name}: ${post.headline}`}
          onDrag={minimized ? undefined : onDrag}
        />
      </div>

      {!minimized && (
        <>
          <p className="preview__hint">
            <Icon name="layers" size={14} /> {t('dragHint')}
          </p>
          <footer className="preview__toolbar">
            <button type="button" className="btn btn--success" disabled={exporter.busy} onClick={() => void exporter.downloadActive()}>
              <Icon name="download" /> {t('downloadPng')}
            </button>
            <button type="button" className="btn btn--secondary" disabled={exporter.busy} onClick={() => void exporter.copyActive()}>
              <Icon name="copy" /> {t('copy')}
            </button>
            <button type="button" className="btn btn--secondary" disabled={exporter.busy} onClick={() => void exporter.downloadAllPosts()}>
              <Icon name="layers" /> {t('downloadAll', { n: state.posts.length })}
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
