import { useEffect } from 'react';
import { selectActivePoster, useEditorStore } from '../store/editorStore';
import { useUiStore } from '../store/uiStore';
import { canvasSize, elementRect, pxToFrame } from '../utils/aspectRatio';

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/**
 * ⌘/Ctrl+Z undo · ⌘/Ctrl+Shift+Z or Ctrl+Y redo · Esc exits full screen / deselects ·
 * arrows nudge the selected element (Shift = 10 px) · Delete hides it.
 */
export function useShortcuts(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const editor = useEditorStore.getState();
      const ui = useUiStore.getState();

      if (mod && e.key.toLowerCase() === 'z' && !isTyping(e.target)) {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y' && !isTyping(e.target)) {
        e.preventDefault();
        editor.redo();
        return;
      }
      if (e.key === 'Escape') {
        if (ui.fullscreen) ui.set('fullscreen', false);
        else if (editor.selectedId) editor.select(null);
        return;
      }
      if (isTyping(e.target) || !editor.selectedId) return;

      const poster = selectActivePoster(editor);
      const el = poster.elements.find((x) => x.id === editor.selectedId);
      if (!el || el.locked) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        editor.updateElement(el.id, { visible: false });
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!delta) return;
      e.preventDefault();
      const r = elementRect(el, poster.ratio);
      const { width, height } = canvasSize(poster.ratio);
      editor.setFrame(el.id, pxToFrame({ ...r, x: r.x + (delta[0] ?? 0), y: r.y + (delta[1] ?? 0) }, width, height));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
