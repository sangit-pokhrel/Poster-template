import { useId } from 'react';
import { CATEGORIES, KIND_LABEL, getAd, studioInfo } from '../../design/registry';
import { useActivePoster } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { EditorMode, EditorTab } from '../../store/uiStore';
import { Segmented, cx } from '../common/controls';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { ContentEditor } from '../editor/ContentEditor';
import { DesignEditor } from '../editor/DesignEditor';
import { PostersPanel } from '../editor/PostersPanel';
import { GuidePanel } from '../guide/GuidePanel';
import { TemplateBrowser } from '../templates/TemplateBrowser';

const TABS: ReadonlyArray<{ id: EditorTab; label: string; icon: IconName; advancedOnly?: boolean }> = [
  { id: 'templates', label: 'Ads', icon: 'grid' },
  { id: 'content', label: 'Content', icon: 'text' },
  { id: 'design', label: 'Design', icon: 'sliders', advancedOnly: true },
  { id: 'posters', label: 'Posters', icon: 'posters' },
  { id: 'guide', label: 'Guide', icon: 'info' },
];

/** Left half of the workspace: every editable part of the poster (proposal §4, §21). */
export function EditorPanel() {
  const poster = useActivePoster();
  const mode = useUiStore((s) => s.editorMode);
  const storedTab = useUiStore((s) => s.tab);
  const set = useUiStore((s) => s.set);
  const baseId = useId();
  const tabs = TABS.filter((t) => mode === 'advanced' || !t.advancedOnly);
  const tab = tabs.some((t) => t.id === storedTab) ? storedTab : 'content';
  const ad = getAd(poster.templateId);
  const ref = studioInfo(ad.id);
  const category = CATEGORIES.find((c) => c.id === ad.category)?.label ?? ad.category;
  const adDescription = ref ? `Studio design · reference #${ref.ref}, variation ${ref.variation} · ${category}` : `Brand classic · ${KIND_LABEL[ad.kind]} layout · ${category}`;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.findIndex((t) => t.id === tab);
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    if (next) {
      set('tab', next.id);
      document.getElementById(`${baseId}-${next.id}`)?.focus();
    }
  };

  return (
    <section aria-label="Editor" className="flex h-full min-h-0 min-w-0 flex-col border-r border-ink-800 bg-ink-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-800 px-3 pt-2">
        <div role="tablist" aria-label="Editor sections" className="scroll-thin flex max-w-full gap-1 overflow-x-auto" onKeyDown={onKeyDown}>
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${baseId}-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`${baseId}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => set('tab', t.id)}
              className={cx(
                'flex shrink-0 items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-1.5 text-sm font-medium transition',
                tab === t.id ? 'border-brand text-white' : 'border-transparent text-ink-400 hover:text-ink-200',
              )}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="mb-2 w-44">
          <Segmented<EditorMode>
            label="Editing level"
            value={mode}
            onChange={(v) => set('editorMode', v)}
            options={[
              { value: 'quick', label: 'Quick', title: 'Just the content' },
              { value: 'advanced', label: 'Advanced', title: 'Fonts, colours, position, layers' },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-ink-800/60 px-4 py-2 text-[11px] text-ink-400">
        <span className="truncate" title={adDescription}>
          Ad: <span className="font-medium text-ink-200">{ad.name}</span>
          <span className="hidden sm:inline"> · {adDescription}</span>
        </span>
        {tab !== 'templates' && (
          <button type="button" className="shrink-0 text-brand hover:underline" onClick={() => set('tab', 'templates')}>
            Change ad
          </button>
        )}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${tab}`} className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4">
        {tab === 'templates' && <TemplateBrowser />}
        {tab === 'content' && <ContentEditor />}
        {tab === 'design' && <DesignEditor />}
        {tab === 'posters' && <PostersPanel />}
        {tab === 'guide' && <GuidePanel />}
      </div>
    </section>
  );
}
