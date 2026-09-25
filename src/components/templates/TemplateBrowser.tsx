import { memo, useMemo } from 'react';
import { CATEGORIES, TEMPLATES, templatesIn } from '../../data/templateRegistry';
import { useThumbnail } from '../../hooks/useThumbnail';
import { hasLayoutEdits, instantiateElements, DEFAULT_META } from '../../services/templateService';
import { selectActivePoster, useEditorStore } from '../../store/editorStore';
import { buildEnv, useActivePoster } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { BrandId, BrandOverrides } from '../../types/brand';
import type { TemplateDefinition } from '../../types/template';
import { cx } from '../common/controls';
import { confirm, toast } from '../common/feedback';

const TemplateCard = memo(function TemplateCard({
  template,
  brandId,
  overrides,
  active,
  onPick,
}: {
  template: TemplateDefinition;
  brandId: BrandId;
  overrides: BrandOverrides | undefined;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const env = useMemo(() => buildEnv({ brandId, meta: DEFAULT_META }, overrides, 'export'), [brandId, overrides]);
  const poster = useMemo(() => ({ background: template.background, elements: instantiateElements(template.id) }), [template]);
  const key = `${template.id}:${brandId}:${JSON.stringify(overrides ?? {})}`;
  const thumb = useThumbnail(key, poster, template.defaultRatio, env, 260);

  return (
    <button
      type="button"
      onClick={() => onPick(template.id)}
      aria-pressed={active}
      title={template.description}
      className={cx(
        'group flex flex-col overflow-hidden rounded-xl border text-left transition',
        active ? 'border-brand ring-2 ring-brand/40' : 'border-ink-800 hover:border-ink-600',
      )}
    >
      <div className="grid aspect-[4/5] place-items-center bg-ink-950 p-2">
        {thumb ? (
          <img src={thumb} alt={`${template.name} template preview`} className="max-h-full max-w-full rounded shadow-lg transition group-hover:scale-[1.02]" />
        ) : (
          <div className="size-full animate-pulse rounded bg-ink-800" />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-ink-800 bg-ink-900 px-3 py-2">
        <span className="truncate text-xs font-semibold text-white">{template.name}</span>
        <span className="shrink-0 rounded bg-ink-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-300">
          {template.defaultRatio}
        </span>
      </div>
    </button>
  );
});

/** Template picker with category filters (proposal §7). */
export function TemplateBrowser() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const chooseTemplate = useEditorStore((s) => s.chooseTemplate);
  const category = useUiStore((s) => s.category);
  const set = useUiStore((s) => s.set);
  const visible = templatesIn(category);

  const onPick = async (id: string) => {
    const current = selectActivePoster(useEditorStore.getState());
    if (id === current.templateId) return;
    if (
      hasLayoutEdits(current) &&
      !(await confirm({
        title: 'Switch template?',
        message: 'Your text and photos are kept, but positions you adjusted on this poster will reset to the new layout.',
        confirmLabel: 'Switch',
      }))
    )
      return;
    chooseTemplate(id);
    toast.info('Template applied — your text and photos were kept');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Template categories">
        {CATEGORIES.map((c) => {
          const count = c.id === 'all' ? TEMPLATES.length : templatesIn(c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              onClick={() => set('category', c.id)}
              className={cx(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                category === c.id ? 'border-brand bg-brand text-brand-ink' : 'border-ink-700 text-ink-300 hover:border-ink-600 hover:text-white',
              )}
            >
              {c.icon} {c.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {visible.map((t) => (
          <TemplateCard key={t.id} template={t} brandId={poster.brandId} overrides={overrides} active={t.id === poster.templateId} onPick={(id) => void onPick(id)} />
        ))}
      </div>
    </div>
  );
}
