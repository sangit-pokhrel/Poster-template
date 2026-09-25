import { BRANDS, BRAND_IDS } from '../../data/brands';
import { useEditorStore } from '../../store/editorStore';
import { useActivePoster } from '../../store/selectors';
import { cx } from '../common/controls';

/** Chooses which Facebook page the current poster is for — swaps logo, colours and fonts. */
export function BrandSwitcher() {
  const poster = useActivePoster();
  const setBrand = useEditorStore((s) => s.setBrand);
  return (
    <div role="radiogroup" aria-label="Brand" className="flex shrink-0 rounded-xl border border-ink-700 bg-ink-900 p-1">
      {BRAND_IDS.map((id) => {
        const b = BRANDS[id];
        const active = poster.brandId === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setBrand(id)}
            className={cx(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
              active ? 'bg-white text-ink-950 shadow' : 'text-ink-300 hover:text-white',
            )}
          >
            <img src={b.assets.mark} alt="" className={cx('size-6 object-contain', !active && 'rounded bg-white/90 p-0.5')} />
            <span className="hidden sm:inline">{b.name}</span>
          </button>
        );
      })}
    </div>
  );
}
