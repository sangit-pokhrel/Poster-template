import { useId } from 'react';
import { resolveColor } from '../../render/color';
import { useActivePoster, useBrandFor } from '../../store/selectors';
import type { ColorValue } from '../../types/element';
import { cx } from '../common/controls';

const TOKENS = ['brand.primary', 'brand.secondary', 'brand.accent', 'brand.ink', 'brand.paper'] as const;
const FIXED = ['#ffffff', '#000000'] as const;

/**
 * Colour picker that prefers brand tokens: picking a swatch stores
 * `brand.accent` (etc.), so the colour follows the brand when switching pages.
 */
export function ColorField({ label, value, onChange }: { label: string; value: ColorValue; onChange: (v: ColorValue) => void }) {
  const poster = useActivePoster();
  const brand = useBrandFor(poster.brandId);
  const id = useId();
  const resolved = resolveColor(value, brand);
  const hex = /^#[\da-f]{6}$/i.test(resolved) ? resolved : '#888888';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink-300">
        {label}
        {value.startsWith('brand.') && <span className="ml-1.5 text-[10px] text-brand">{value.replace('brand.', 'brand ')}</span>}
      </label>
      <div className="flex flex-wrap items-center gap-1.5">
        {[...TOKENS, ...FIXED].map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            aria-label={`Use ${c}`}
            onClick={() => onChange(c)}
            style={{ background: resolveColor(c, brand) }}
            className={cx('size-6 rounded-md border transition', value === c ? 'border-white ring-2 ring-brand' : 'border-ink-600 hover:scale-110')}
          />
        ))}
        <input id={id} type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-6 w-9 cursor-pointer rounded border border-ink-600 bg-transparent" title="Custom colour" />
      </div>
    </div>
  );
}
