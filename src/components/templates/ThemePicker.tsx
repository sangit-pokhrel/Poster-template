import { useMemo } from 'react';
import { BRANDS } from '../../data/brands';
import { dailyThemeIndex } from '../../design/themes';
import type { ColorTheme } from '../../design/themes';
import { useEditorStore } from '../../store/editorStore';
import { themesFor, useActivePoster, useLogoColorKey } from '../../store/selectors';
import { todayIso } from '../../utils/date';
import { cx } from '../common/controls';

function Swatch({ theme, active, today, onClick }: { theme: ColorTheme; active: boolean; today: boolean; onClick: () => void }) {
  const { primary, secondary, accent } = theme.palette;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      title={`${theme.index + 1}. ${theme.name}${today ? ' (today)' : ''}`}
      aria-label={`${theme.name}${today ? ', today’s theme' : ''}`}
      onClick={onClick}
      className={cx('relative size-8 shrink-0 overflow-hidden rounded-full border-2 transition', active ? 'border-white ring-2 ring-brand' : 'border-ink-700 hover:border-ink-500')}
      style={{ background: `conic-gradient(${primary} 0 50%, ${secondary} 50% 75%, ${accent} 75% 100%)` }}
    >
      {today && <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] font-bold leading-3 text-white">TODAY</span>}
    </button>
  );
}

/**
 * Colour theme for the poster: 15 palettes generated from the page's logo
 * colours. "Auto" follows the daily rotation; picking a swatch pins it.
 */
export function ThemePicker() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const setMeta = useEditorStore((s) => s.setMeta);
  const logoKey = useLogoColorKey(poster.brandId);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- logoKey refreshes themes once logo colours load
  const themes = useMemo(() => themesFor(poster.brandId, overrides), [poster.brandId, overrides, logoKey]);
  const todayIndex = dailyThemeIndex(poster.brandId, todayIso());
  const auto = poster.meta.theme === 'auto';
  const current = auto ? todayIndex : poster.meta.theme;
  const name = themes[current as number]?.name ?? '';

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-ink-800 bg-ink-900/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white">
          Colour theme <span className="font-normal text-ink-400">· {BRANDS[poster.brandId].name} · {name}</span>
        </p>
        <button
          type="button"
          aria-pressed={auto}
          onClick={() => setMeta({ theme: 'auto' })}
          className={cx('rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition', auto ? 'border-brand bg-brand text-brand-ink' : 'border-ink-700 text-ink-300 hover:text-white')}
          title="Follow the daily rotation (a new theme every day)"
        >
          Auto · daily
        </button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="radiogroup" aria-label="Colour themes">
        {themes.map((t) => (
          <Swatch key={t.index} theme={t} active={current === t.index} today={t.index === todayIndex} onClick={() => setMeta({ theme: t.index })} />
        ))}
      </div>
      <p className="text-[11px] text-ink-400">Themes come from the {BRANDS[poster.brandId].name} logo colours. Studio designs are shared by all pages; the theme makes each page’s poster its own.</p>
    </div>
  );
}
