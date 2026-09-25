import { useEffect, useRef } from 'react';
import { tokenizeWords } from '../../render/text';
import { useEditorStore } from '../../store/editorStore';
import { useUiStore } from '../../store/uiStore';
import type { TextElement } from '../../types/element';
import { IconButton, TextArea, cx } from '../common/controls';

const MULTILINE_ROLES = new Set(['heading', 'body', 'quote', 'subheading']);
const HIGHLIGHT_ROLES = new Set(['heading', 'quote', 'subheading', 'body']);

/** Clickable words that toggle highlight (proposal §11). */
export function WordHighlighter({ el }: { el: TextElement }) {
  const toggle = useEditorStore((s) => s.toggleHighlight);
  const words = tokenizeWords(el.data.text);
  const on = new Set(el.data.highlights);
  if (words.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] text-ink-400">Tap words to highlight them on the poster</span>
      <div className="flex flex-wrap gap-1" role="group" aria-label={`Highlight words in ${el.name}`}>
        {words.map((w) => (
          <button
            key={w.index}
            type="button"
            aria-pressed={on.has(w.index)}
            onClick={() => toggle(el.id, w.index)}
            className={cx(
              'rounded-md border px-2 py-0.5 text-xs transition',
              on.has(w.index) ? 'border-brand bg-brand text-brand-ink' : 'border-ink-700 bg-ink-950 text-ink-300 hover:border-ink-600 hover:text-white',
            )}
          >
            {w.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Quick-edit field for one text element. */
export function TextEditor({ el }: { el: TextElement }) {
  const updateData = useEditorStore((s) => s.updateData);
  const updateElement = useEditorStore((s) => s.updateElement);
  const select = useEditorStore((s) => s.select);
  const selected = useEditorStore((s) => s.selectedId === el.id);
  const focusRequest = useUiStore((s) => s.focusRequest);
  const ref = useRef<HTMLTextAreaElement>(null);
  const multiline = MULTILINE_ROLES.has(el.role);

  // Double-click on the canvas → focus this field
  useEffect(() => {
    if (focusRequest?.elementId !== el.id) return;
    ref.current?.focus();
    ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [focusRequest, el.id]);

  return (
    <div className={cx('flex flex-col gap-2 rounded-lg p-2 transition', selected && 'bg-brand/5 ring-1 ring-brand/40')}>
      <div className="flex items-center justify-between">
        <label htmlFor={`text-${el.id}`} className="text-xs font-semibold text-ink-200">
          {el.name}
        </label>
        <IconButton
          icon={el.visible ? 'eye' : 'eyeOff'}
          label={el.visible ? `Hide ${el.name}` : `Show ${el.name}`}
          onClick={() => updateElement(el.id, { visible: !el.visible })}
          className="size-7"
        />
      </div>
      <TextArea
        ref={ref}
        id={`text-${el.id}`}
        rows={multiline ? Math.min(5, Math.max(2, Math.ceil(el.data.text.length / 42))) : 1}
        value={el.data.text}
        onFocus={() => select(el.id)}
        onChange={(e) => updateData<'text'>(el.id, { text: e.target.value })}
        className={cx(!el.visible && 'opacity-50')}
      />
      {/\{\w+\}/.test(el.data.text) && (
        <p className="text-[11px] text-ink-400">
          <code className="text-brand">{'{…}'}</code> fields fill in automatically from the brand kit and date.
        </p>
      )}
      {HIGHLIGHT_ROLES.has(el.role) && <WordHighlighter el={el} />}
    </div>
  );
}
