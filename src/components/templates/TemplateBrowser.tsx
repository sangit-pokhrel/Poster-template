import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ADS, CATEGORIES, KIND_LABEL, adsIn, buildLayout } from '../../design/registry';
import { useThumbnail } from '../../hooks/useThumbnail';
import { DEFAULT_META, hasLayoutEdits } from '../../services/templateService';
import { selectActivePoster, useEditorStore } from '../../store/editorStore';
import { buildEnv, useActivePoster } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { BrandId, BrandOverrides } from '../../types/brand';
import type { AdDefinition } from '../../types/template';
import { TextInput, cx } from '../common/controls';
import { confirm, toast } from '../common/feedback';
import { Icon } from '../common/Icon';

/** True once the element has scrolled near the viewport (then stays true). */
function useInView<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setSeen(true), { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

function Thumb({ ad, brandId, overrides }: { ad: AdDefinition; brandId: BrandId; overrides: BrandOverrides | undefined }) {
  const env = useMemo(() => buildEnv({ brandId, meta: DEFAULT_META }, overrides, 'export'), [brandId, overrides]);
  const poster = useMemo(() => buildLayout(ad.id, brandId), [ad.id, brandId]);
  const url = useThumbnail(`${ad.id}:${brandId}:${JSON.stringify(overrides ?? {})}`, poster, '4:5', env, 260);
  return url ? <img src={url} alt={`${ad.name} preview`} className="max-h-full max-w-full rounded shadow-lg transition group-hover:scale-[1.02]" /> : <div className="size-full animate-pulse rounded bg-ink-800" />;
}

const AdCard = memo(function AdCard({
  ad,
  brandId,
  overrides,
  active,
  onPick,
}: {
  ad: AdDefinition;
  brandId: BrandId;
  overrides: BrandOverrides | undefined;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const [ref, inView] = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPick(ad.id)}
      aria-pressed={active}
      title={ad.content.heading?.replace(/\*/g, '') ?? ad.name}
      className={cx('group flex flex-col overflow-hidden rounded-xl border text-left transition', active ? 'border-brand ring-2 ring-brand/40' : 'border-ink-800 hover:border-ink-600')}
    >
      <div className="grid aspect-[4/5] place-items-center bg-ink-950 p-2">{inView ? <Thumb ad={ad} brandId={brandId} overrides={overrides} /> : <div className="size-full rounded bg-ink-900" />}</div>
      <div className="flex items-center justify-between gap-2 border-t border-ink-800 bg-ink-900 px-3 py-2">
        <span className="truncate text-xs font-semibold text-white">{ad.name}</span>
        <span className="shrink-0 rounded bg-ink-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-300">{KIND_LABEL[ad.kind]}</span>
      </div>
    </button>
  );
});

/** Ad library: 100 promotional ads in 12 categories, searchable (proposal §7). */
export function TemplateBrowser() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const chooseTemplate = useEditorStore((s) => s.chooseTemplate);
  const category = useUiStore((s) => s.category);
  const search = useUiStore((s) => s.search);
  const set = useUiStore((s) => s.set);
  const visible = adsIn(category, search);

  const onPick = async (id: string) => {
    const current = selectActivePoster(useEditorStore.getState());
    if (id === current.templateId) return;
    if (
      hasLayoutEdits(current) &&
      !(await confirm({
        title: 'Switch ad?',
        message: 'Text and photos you changed are kept, but positions you adjusted on this poster will reset to the new layout.',
        confirmLabel: 'Switch',
      }))
    )
      return;
    chooseTemplate(id);
    toast.info('Ad applied — your own text and photos were kept');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Icon name="zoomIn" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <TextInput aria-label="Search ads" placeholder={`Search ${ADS.length} ads — e.g. SPSS, SOP, offer, webinar…`} value={search} onChange={(e) => {
            set('search', e.target.value);
            // A new search looks across the whole library
            if (e.target.value && !search) set('category', 'all');
          }} className="pl-9" />
      </div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Ad categories">
        {CATEGORIES.map((c) => {
          const count = adsIn(c.id, search).length;
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
                count === 0 && category !== c.id && 'opacity-40',
              )}
            >
              {c.icon} {c.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-700 px-4 py-8 text-center text-sm text-ink-400">No ads match “{search}”.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {visible.map((a) => (
            <AdCard key={a.id} ad={a} brandId={poster.brandId} overrides={overrides} active={a.id === poster.templateId} onPick={(id) => void onPick(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
