import { useState } from 'react';
import { getTemplate } from '../../engine';
import { todayBs } from '../../lib/nepaliDate';
import { postsFromCsv } from '../../state/importPosts';
import { selectActivePost } from '../../state/reducer';
import { useStore } from '../../state/store';
import { useExport } from '../ExportProvider';
import { Card, FileButton } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

export function PostsTab() {
  const { state, dispatch, t } = useStore();
  const exporter = useExport();
  const toast = useToast();
  const active = selectActivePost(state);
  const [replace, setReplace] = useState(false);

  const importCsv = async (file: File) => {
    const posts = postsFromCsv(await file.text(), active.templateId, todayBs());
    if (posts.length === 0) {
      toast(t('toastImportEmpty'), 'error');
      return;
    }
    dispatch({ type: 'post/import', posts, replace });
    toast(t('toastImported', { n: posts.length }));
  };

  return (
    <>
      <Card
        title={`${t('postsTitle')} (${state.posts.length})`}
        icon="layers"
        actions={
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => dispatch({ type: 'post/add' })}>
            <Icon name="plus" size={14} /> {t('addPost')}
          </button>
        }
      >
        <p className="hint">{t('postsHint')}</p>
        <ol className="post-list">
          {state.posts.map((p, i) => (
            <li key={p.id} className={p.id === active.id ? 'is-active' : ''}>
              <button type="button" className="post-list__select" onClick={() => dispatch({ type: 'post/select', id: p.id })}>
                <span className="post-list__num">{i + 1}</span>
                <span className="post-list__title">{p.headline || t('untitled')}</span>
                <span className="post-list__tpl">{getTemplate(p.templateId).name}</span>
              </button>
              <div className="post-list__actions">
                <button
                  type="button"
                  className="icon-btn icon-btn--sm"
                  title={t('duplicate')}
                  aria-label={`${t('duplicate')} ${i + 1}`}
                  onClick={() => dispatch({ type: 'post/duplicate', id: p.id })}
                >
                  <Icon name="copy" size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--sm"
                  title={t('delete')}
                  aria-label={`${t('delete')} ${i + 1}`}
                  disabled={state.posts.length === 1}
                  onClick={() => dispatch({ type: 'post/remove', id: p.id })}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title={t('bulkTitle')} icon="upload">
        <p className="hint">{t('csvHint')}</p>
        <div className="row">
          <FileButton accept=".csv,text/csv" className="btn btn--secondary" onFile={(f) => void importCsv(f)}>
            <Icon name="upload" size={16} /> CSV
          </FileButton>
          <a className="btn btn--ghost" href={`${import.meta.env.BASE_URL}sample.csv`} download>
            <Icon name="download" size={16} /> {t('sampleCsv')}
          </a>
        </div>
        <label className="checkbox">
          <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
          {t('importReplace')}
        </label>
      </Card>

      <Card title={t('exportTitle')} icon="download">
        <div className="stack">
          <button type="button" className="btn btn--primary" disabled={exporter.busy} onClick={() => void exporter.downloadAllPosts()}>
            <Icon name="download" /> {t('downloadAll', { n: state.posts.length })}
          </button>
          <button type="button" className="btn btn--secondary" disabled={exporter.busy} onClick={() => void exporter.downloadActiveInAllTemplates()}>
            <Icon name="grid" /> {t('downloadAllTemplates')}
          </button>
        </div>
      </Card>
    </>
  );
}
