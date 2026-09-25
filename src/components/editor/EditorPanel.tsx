import { useId } from 'react';
import { useLocalPreference } from '../../hooks/useLocalPreference';
import type { MessageKey } from '../../lib/i18n';
import { useStore } from '../../state/store';
import { Icon } from '../ui/Icon';
import type { IconName } from '../ui/Icon';
import { BrandTab } from './BrandTab';
import { PhotoTab } from './PhotoTab';
import { PostsTab } from './PostsTab';
import { TemplatesTab } from './TemplatesTab';
import { TextTab } from './TextTab';

const TABS = [
  { id: 'text', label: 'tabText', icon: 'text', Panel: TextTab },
  { id: 'templates', label: 'tabTemplates', icon: 'grid', Panel: TemplatesTab },
  { id: 'photo', label: 'tabPhoto', icon: 'image', Panel: PhotoTab },
  { id: 'brand', label: 'tabBrand', icon: 'calendar', Panel: BrandTab },
  { id: 'posts', label: 'tabPosts', icon: 'layers', Panel: PostsTab },
] as const satisfies ReadonlyArray<{ id: string; label: MessageKey; icon: IconName; Panel: () => React.JSX.Element }>;

type TabId = (typeof TABS)[number]['id'];
const TAB_IDS = TABS.map((tab) => tab.id);

/** Left half of the workspace: every editable part of the poster, grouped into tabs. */
export function EditorPanel() {
  const { t } = useStore();
  const [active, setActive] = useLocalPreference<TabId>('poster-studio:tab', 'text', TAB_IDS);
  const baseId = useId();
  const current = TABS.find((tab) => tab.id === active) ?? TABS[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TAB_IDS.indexOf(active);
    const next = TAB_IDS[(i + (e.key === 'ArrowRight' ? 1 : TAB_IDS.length - 1)) % TAB_IDS.length];
    if (next) {
      setActive(next);
      document.getElementById(`${baseId}-${next}`)?.focus();
    }
  };

  return (
    <section className="editor" aria-label="Editor">
      <nav className="tabs" role="tablist" aria-label="Editor sections" onKeyDown={onKeyDown}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={tab.id === active ? 0 : -1}
            className={`tab ${tab.id === active ? 'is-active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            <Icon name={tab.icon} size={16} />
            <span>{t(tab.label)}</span>
          </button>
        ))}
      </nav>
      <div id={`${baseId}-panel`} className="editor__body" role="tabpanel" aria-labelledby={`${baseId}-${current.id}`}>
        <current.Panel />
      </div>
    </section>
  );
}
