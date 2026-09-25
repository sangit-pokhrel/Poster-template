import type { Lang } from '../engine';
import { clearState } from '../state/persistence';
import { useStore } from '../state/store';
import { useExport } from './ExportProvider';
import { Icon } from './ui/Icon';
import { useToast } from './ui/Toast';

const LANGS: ReadonlyArray<{ id: Lang; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'ne', label: 'नेपाली' },
];

export function AppHeader() {
  const { state, dispatch, saveStatus, t } = useStore();
  const exporter = useExport();
  const toast = useToast();

  const reset = () => {
    if (!window.confirm(t('resetConfirm'))) return;
    clearState();
    dispatch({ type: 'reset' });
    toast(t('toastReset'));
  };

  const saveLabel = saveStatus === 'saved' ? t('saved') : saveStatus === 'partial' ? t('savePartial') : t('saveError');

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          P
        </span>
        <div>
          <h1>
            {t('appTitle')} <span>{state.brand.name}</span>
          </h1>
          <p>{t('appSubtitle')}</p>
        </div>
      </div>

      <div className="app-header__actions">
        <div className="lang-switch" role="group" aria-label="Language">
          <Icon name="globe" size={16} />
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={state.lang === l.id}
              className={state.lang === l.id ? 'is-active' : ''}
              onClick={() => dispatch({ type: 'settings/lang', lang: l.id })}
            >
              {l.label}
            </button>
          ))}
        </div>
        <span className={`save-status save-status--${saveStatus}`}>
          <Icon name={saveStatus === 'error' ? 'x' : 'check'} size={14} /> {saveLabel}
        </span>
        <button type="button" className="btn btn--secondary" onClick={reset}>
          <Icon name="reset" size={16} /> {t('reset')}
        </button>
        <button type="button" className="btn btn--primary" disabled={exporter.busy} onClick={() => void exporter.downloadActive()}>
          <Icon name="download" size={16} /> {t('downloadPng')}
        </button>
      </div>
    </header>
  );
}
