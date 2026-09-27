import { formatEnglish, formatNepali, formatPosterDate, todayIso } from '../../utils/date';
import { useEditorStore } from '../../store/editorStore';
import { useActivePoster, useBrandFor } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { BadgeElement, BadgeStyle, ImageElement, LogoElement, PosterElement, TextElement } from '../../types/element';
import type { DateMode } from '../../types/poster';
import { Button, Field, IconButton, Section, Segmented, Select, TextInput, Toggle } from '../common/controls';
import { PhotoEditor } from './PhotoEditor';
import { TextEditor } from './TextEditor';

const BADGE_STYLES: ReadonlyArray<{ value: BadgeStyle; label: string }> = [
  { value: 'pill', label: 'Pill' },
  { value: 'tag', label: 'Tag' },
  { value: 'outline', label: 'Outline' },
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'circle', label: 'Circle seal' },
  { value: 'underline', label: 'Underline' },
];

function BadgeEditor({ el }: { el: BadgeElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const updateElement = useEditorStore((s) => s.updateElement);
  const select = useEditorStore((s) => s.select);
  return (
    <div className="flex flex-col gap-2 rounded-lg p-2" onFocusCapture={() => select(el.id)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-200">{el.name}</span>
        <Toggle label="Show" checked={el.visible} onChange={(visible) => updateElement(el.id, { visible })} />
      </div>
      <div className="grid grid-cols-[1fr_130px] gap-2">
        <TextInput aria-label={`${el.name} text`} value={el.data.text} onChange={(e) => updateData<'badge'>(el.id, { text: e.target.value })} />
        <Select<BadgeStyle> value={el.data.style} onChange={(style) => updateData<'badge'>(el.id, { style })} options={BADGE_STYLES} />
      </div>
    </div>
  );
}

/** Date element(s): Nepali / English / custom, today, show/hide (proposal §15). */
function DateEditor({ els }: { els: PosterElement[] }) {
  const poster = useActivePoster();
  const setMeta = useEditorStore((s) => s.setMeta);
  const updateElement = useEditorStore((s) => s.updateElement);
  const { meta } = poster;
  return (
    <Section title="Date" icon="calendar">
      <Segmented<DateMode>
        label="Date format"
        value={meta.dateMode}
        onChange={(dateMode) => setMeta({ dateMode })}
        options={[
          { value: 'nepali', label: 'नेपाली (BS)' },
          { value: 'english', label: 'English' },
          { value: 'custom', label: 'Custom text' },
        ]}
      />
      {meta.dateMode === 'custom' ? (
        <Field label="Date text">
          {(id) => <TextInput id={id} value={meta.customDate} placeholder="e.g. Every Saturday · ९ आश्विन" onChange={(e) => setMeta({ customDate: e.target.value })} />}
        </Field>
      ) : (
        <div className="flex items-end gap-2">
          <Field label="Date">
            {(id) => <TextInput id={id} type="date" value={meta.date} onChange={(e) => e.target.value && setMeta({ date: e.target.value })} />}
          </Field>
          <Button onClick={() => setMeta({ date: todayIso() })}>Use today</Button>
        </div>
      )}
      <p className="rounded-lg bg-ink-950 px-3 py-2 text-sm text-white">
        {formatPosterDate(meta) || <span className="text-ink-500">—</span>}
        {meta.dateMode !== 'custom' && (
          <span className="ml-2 text-xs text-ink-400">{meta.dateMode === 'nepali' ? formatEnglish(meta.date) : formatNepali(meta.date)}</span>
        )}
      </p>
      {els.map((el) => (
        <Toggle key={el.id} label={`Show ${el.name.toLowerCase()} on poster`} checked={el.visible} onChange={(visible) => updateElement(el.id, { visible })} />
      ))}
    </Section>
  );
}

/** Contact details live in the brand kit so every poster of that page stays consistent (proposal §17). */
function FooterEditor({ els }: { els: PosterElement[] }) {
  const poster = useActivePoster();
  const brand = useBrandFor(poster.brandId);
  const updateBrand = useEditorStore((s) => s.updateBrand);
  const updateElement = useEditorStore((s) => s.updateElement);
  const fields = [
    { key: 'handle', label: 'Page name / handle', placeholder: 'Nepal Scholar · Kathmandu' },
    { key: 'phone', label: 'Phone / WhatsApp', placeholder: '98XXXXXXXX' },
    { key: 'website', label: 'Website', placeholder: 'www.example.com' },
    { key: 'email', label: 'Email', placeholder: 'hello@example.com' },
  ] as const;
  return (
    <Section title="Footer & contact" icon="link">
      <p className="text-[11px] text-ink-400">Saved to the {brand.name} brand kit and reused on every {brand.name} poster. Empty fields are left out.</p>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <Field key={f.key} label={f.label}>
            {(id) => <TextInput id={id} value={brand[f.key]} placeholder={f.placeholder} onChange={(e) => updateBrand(brand.id, { [f.key]: e.target.value })} />}
          </Field>
        ))}
      </div>
      {els.map((el) => (
        <Toggle key={el.id} label={`Show ${el.name.toLowerCase()}`} checked={el.visible} onChange={(visible) => updateElement(el.id, { visible })} />
      ))}
    </Section>
  );
}

function LogoEditor({ el }: { el: LogoElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const updateElement = useEditorStore((s) => s.updateElement);
  return (
    <div className="flex items-center justify-between gap-3">
      <Segmented
        label="Logo style"
        value={el.data.variant}
        onChange={(variant) => updateData<'logo'>(el.id, { variant })}
        options={[
          { value: 'full', label: 'Full logo' },
          { value: 'lockup', label: 'Symbol + name' },
          { value: 'mark', label: 'Symbol only' },
        ]}
      />
      <IconButton icon={el.visible ? 'eye' : 'eyeOff'} label={el.visible ? 'Hide logo' : 'Show logo'} onClick={() => updateElement(el.id, { visible: !el.visible })} />
    </div>
  );
}

/** Quick Edit (proposal §21): the content of the current template, grouped by purpose. */
export function ContentEditor() {
  const poster = useActivePoster();
  const advanced = useUiStore((s) => s.editorMode === 'advanced');
  const els = poster.elements.filter((e) => e.editable);
  const byTop = [...els].sort((a, b) => a.frame.y - b.frame.y);

  const texts = byTop.filter((e): e is TextElement => e.type === 'text' && e.role !== 'date' && e.role !== 'footer');
  const photos = byTop.filter((e): e is ImageElement => e.type === 'image');
  const badges = byTop.filter((e): e is BadgeElement => e.type === 'badge' && e.role !== 'date');
  const dates = els.filter((e) => e.role === 'date');
  const footers = els.filter((e) => e.role === 'footer');
  const logos = els.filter((e): e is LogoElement => e.type === 'logo');

  return (
    <div className="flex flex-col gap-4">
      {texts.length > 0 && (
        <Section title="Text & headings" icon="text">
          {texts.map((el) => (
            <TextEditor key={el.id} el={el} />
          ))}
        </Section>
      )}
      {photos.length > 0 && (
        <Section title={photos.length > 1 ? `Photos (${photos.length})` : 'Photo'} icon="image">
          {photos.map((el) => (
            <PhotoEditor key={el.id} el={el} advanced={advanced} />
          ))}
        </Section>
      )}
      {badges.length > 0 && (
        <Section title="Badges & buttons" icon="tag">
          {badges.map((el) => (
            <BadgeEditor key={el.id} el={el} />
          ))}
        </Section>
      )}
      {dates.length > 0 && <DateEditor els={dates} />}
      {footers.length > 0 && <FooterEditor els={footers} />}
      {logos.length > 0 && (
        <Section title="Logo" icon="sparkles">
          {logos.map((el) => (
            <LogoEditor key={el.id} el={el} />
          ))}
        </Section>
      )}
    </div>
  );
}
