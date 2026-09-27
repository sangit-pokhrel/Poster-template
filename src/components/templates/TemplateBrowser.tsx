import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ADS, CATEGORIES, CLASSIC_ADS, COLLECTIONS, FEATURED_PER_DAY, KIND_LABEL, REFERENCE_COUNT, STUDIO_ADS, adsIn, buildLayout, studioInfo } from '../../design/registry';
import { BRANDS } from '../../data/brands';
import type { LibraryFilter } from '../../design/registry';
import { useThumbnail } from '../../hooks/useThumbnail';
import { hasLayoutEdits } from '../../services/templateService';
import { selectActivePoster, useEditorStore } from '../../store/editorStore';
import { buildEnv, posterTheme, useActivePoster, useLogoColorKey } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { BrandId, BrandOverrides } from '../../types/brand';
import type { PosterMeta } from '../../types/poster';
import { formatEnglish, todayIso } from '../../utils/date';
import type { AdDefinition } from '../../types/template';
import { TextInput, cx } from '../common/controls';
import { confirm, toast } from '../common/feedback';
import { Icon } from '../common/Icon';
import { ThemePicker } from './ThemePicker';

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

interface ThumbProps {
  ad: AdDefinition;
  brandId: BrandId;
  overrides: BrandOverrides | undefined;
  /** The active poster's date/theme settings: thumbnails preview in its colours. */
  meta: PosterMeta;
  themeKey: string;
}

function Thumb({ ad, brandId, overrides, meta, themeKey }: ThumbProps) {
  const env = useMemo(() => buildEnv({ brandId, meta }, overrides, 'export'), [brandId, meta, overrides]);
  const poster = useMemo(() => buildLayout(ad.id, brandId), [ad.id, brandId]);
  const url = useThumbnail(`${ad.id}:${brandId}:${themeKey}:${JSON.stringify(overrides ?? {})}`, poster, '4:5', env, 260);
  return url ? <img src={url} alt={`${ad.name} preview`} className="max-h-full max-w-full rounded shadow-lg transition group-hover:scale-[1.02]" /> : <div className="size-full animate-pulse rounded bg-ink-800" />;
}

const AdCard = memo(function AdCard({ active, onPick, ...thumb }: ThumbProps & { active: boolean; onPick: (id: string) => void }) {
  const { ad } = thumb;
  const [ref, inView] = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPick(ad.id)}
      aria-pressed={active}
      title={`${ad.name}${studioInfo(ad.id) ? ` — studio design from reference #${studioInfo(ad.id)?.ref}` : ` — ${KIND_LABEL[ad.kind]} layout`}`}
      className={cx('group flex flex-col overflow-hidden rounded-xl border text-left transition', active ? 'border-brand ring-2 ring-brand/40' : 'border-ink-800 hover:border-ink-600')}
    >
      <div className="grid aspect-[4/5] place-items-center bg-ink-950 p-2">{inView ? <Thumb {...thumb} /> : <div className="size-full rounded bg-ink-900" />}</div>
      <div className="flex items-center justify-between gap-2 border-t border-ink-800 bg-ink-900 px-3 py-2">
        <span className="truncate text-xs font-semibold text-white">{ad.name}</span>
        <span className={cx('shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide', ad.design ? 'bg-brand/15 text-brand' : 'bg-ink-800 text-ink-300')}>{ad.design ? 'Studio' : KIND_LABEL[ad.kind]}</span>
      </div>
    </button>
  );
});

/** One-line explanation of what the current filter shows. */
function filterInfo(filter: LibraryFilter, brandName: string, iso: string): string {
  switch (filter) {
    case 'today':
      return `${FEATURED_PER_DAY} studio designs picked for ${brandName} on ${formatEnglish(iso)}. A new set appears every day, and each page gets its own.`;
    case 'studio':
      return `${STUDIO_ADS.length} designs rebuilt from the team’s ${REFERENCE_COUNT} reference posters, 2 variations each. Every page shares them; the colour theme, logo and contacts make each page’s version its own.`;
    case 'classic':
      return `${CLASSIC_ADS.length} ads drawn in ${brandName}’s own design system. Switch page to see the same ad in a completely different layout.`;
    case 'all':
      return `The whole library: ${STUDIO_ADS.length} studio designs + ${CLASSIC_ADS.length} brand classics.`;
    default: {
      const label = CATEGORIES.find((c) => c.id === filter)?.label ?? filter;
      return `${label}: studio designs and brand classics for this topic.`;
    }
  }
}

/** Ad library: studio designs + brand classics, filterable and searchable (proposal §7). */
export function TemplateBrowser() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const chooseTemplate = useEditorStore((s) => s.chooseTemplate);
  const category = useUiStore((s) => s.category);
  const search = useUiStore((s) => s.search);
  const set = useUiStore((s) => s.set);
  const today = { brandId: poster.brandId, iso: todayIso() };
  const visible = adsIn(category, search, today);
  const logoKey = useLogoColorKey(poster.brandId);
  const theme = posterTheme(poster, overrides);
  const themeKey = `${theme.index}:${Object.values(theme.palette).join()}:${logoKey}`;

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
      <ThemePicker />
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Ad collections and categories">
        {[...COLLECTIONS, ...CATEGORIES].map((c: { id: LibraryFilter; label: string; icon: string }) => {
          const count = adsIn(c.id, search, today).length;
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
      <p className="-mt-1 flex gap-2 rounded-lg bg-ink-900 px-3 py-2 text-[11px] leading-relaxed text-ink-400">
        <Icon name="info" size={14} className="mt-0.5 shrink-0 text-brand" />
        <span>
          {filterInfo(category, BRANDS[poster.brandId].name, today.iso)} {search && <>Showing {visible.length} match{visible.length === 1 ? '' : 'es'} for “{search}”.</>}
        </span>
      </p>
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-700 px-4 py-8 text-center text-sm text-ink-400">No ads match “{search}”.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {visible.map((a) => (
            <AdCard key={a.id} ad={a} brandId={poster.brandId} overrides={overrides} meta={poster.meta} themeKey={themeKey} active={a.id === poster.templateId} onPick={(id) => void onPick(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
