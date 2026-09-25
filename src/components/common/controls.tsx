import { useId, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-brand-ink hover:brightness-110 font-semibold',
  secondary: 'bg-ink-800 text-ink-200 border border-ink-700 hover:border-ink-600 hover:text-white',
  ghost: 'text-ink-300 hover:text-white hover:bg-ink-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 font-semibold',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ComponentProps<'button'> & { variant?: Variant; size?: 'sm' | 'md'; icon?: IconName }) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
        VARIANT[variant],
        className,
      )}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  active,
  className,
  ...rest
}: ComponentProps<'button'> & { icon: IconName; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...rest}
      className={cx(
        'inline-grid size-8 place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-35',
        active ? 'border-brand bg-brand/15 text-white' : 'border-ink-700 bg-ink-850 text-ink-300 hover:border-ink-600 hover:text-white',
        className,
      )}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Section({
  title,
  icon,
  actions,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: IconName;
  actions?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="rounded-xl border border-ink-800 bg-ink-900">
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          className="flex min-w-0 items-center gap-2 text-left text-sm font-semibold text-white"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {icon && <Icon name={icon} size={16} className="text-brand" />}
          <span className="truncate">{title}</span>
          <Icon name={open ? 'chevronUp' : 'chevronDown'} size={14} className="text-ink-400" />
        </button>
        {actions}
      </header>
      {open && (
        <div id={id} className="flex flex-col gap-4 border-t border-ink-800 px-4 py-4">
          {children}
        </div>
      )}
    </section>
  );
}

export function Field({ label, hint, children, inline }: { label: string; hint?: string; children: (id: string) => ReactNode; inline?: boolean }) {
  const id = useId();
  return (
    <div className={cx('flex min-w-0 gap-1.5', inline ? 'items-center justify-between' : 'flex-col')}>
      <label htmlFor={id} className="text-xs font-medium text-ink-300">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-[11px] leading-snug text-ink-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-white placeholder:text-ink-600 focus:border-brand focus:outline-none';

export function TextInput(props: ComponentProps<'input'>) {
  return <input type="text" {...props} className={cx(inputCls, props.className)} />;
}

export function TextArea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={cx(inputCls, 'resize-y leading-relaxed', props.className)} />;
}

export function Select<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id?: string;
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cx(inputCls, 'cursor-pointer py-1.5')}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  format = (v) => String(v),
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-ink-300">
          {label}
        </label>
        <output htmlFor={id} className="text-xs tabular-nums text-ink-400">
          {format(value)}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: ReadonlyArray<{ value: T; label: string; title?: string }>;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-lg border border-ink-700 bg-ink-950 p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          title={o.title}
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cx(
            'flex-1 rounded-md px-2 py-1 text-xs font-medium transition',
            o.value === value ? 'bg-brand text-brand-ink' : 'text-ink-300 hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs font-medium text-ink-300">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx('relative h-5 w-9 shrink-0 rounded-full transition', checked ? 'bg-brand' : 'bg-ink-700')}
      >
        <span className={cx('absolute top-0.5 size-4 rounded-full bg-white transition-all', checked ? 'left-4.5' : 'left-0.5')} />
      </button>
    </label>
  );
}

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const hex = /^#[\da-f]{6}$/i.test(value) ? value : '#000000';
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-xs font-medium text-ink-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-ink-400">{hex}</span>
        <input id={id} type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-7 w-10 cursor-pointer rounded border border-ink-700 bg-transparent" />
      </div>
    </div>
  );
}

/** Drag-and-drop / click file picker (proposal §12). */
export function Dropzone({ onFile, label, compact }: { onFile: (f: File) => void; label: string; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={cx(
        'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition',
        compact ? 'px-3 py-3' : 'px-4 py-5',
        over ? 'border-brand bg-brand/10 text-white' : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-200',
      )}
    >
      <Icon name="upload" size={compact ? 18 : 22} />
      <span className="text-xs font-medium">{label}</span>
      {!compact && <span className="text-[11px] text-ink-600">JPG, PNG or WebP · max 10 MB</span>}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export { cx };
