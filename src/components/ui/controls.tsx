import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export function Card({ title, icon, actions, children }: { title: string; icon?: IconName; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="card">
      <header className="card__header">
        <h3>
          {icon && <Icon name={icon} size={16} />} {title}
        </h3>
        {actions}
      </header>
      <div className="card__body">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: SliderProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="slider-row">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={o.value === value ? 'is-active' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Click-or-drop file picker. */
export function Dropzone({ text, hint, onFile }: { text: string; hint?: string; onFile: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className={`dropzone ${over ? 'is-over' : ''}`}
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
        if (f?.type.startsWith('image/')) onFile(f);
      }}
    >
      <Icon name="upload" size={28} />
      <p>{text}</p>
      {hint && <small>{hint}</small>}
      <input
        ref={input}
        type="file"
        accept="image/*"
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

/** Small button that opens a hidden file input. */
export function FileButton({
  accept,
  children,
  onFile,
  className = 'btn btn--ghost btn--sm',
}: {
  accept: string;
  children: ReactNode;
  onFile: (file: File) => void;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className={className} onClick={() => input.current?.click()}>
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </>
  );
}
