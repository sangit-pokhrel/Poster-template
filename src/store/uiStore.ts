import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { TemplateCategory } from '../types/template';

export type ViewMode = 'split' | 'minimized';
export type EditorMode = 'quick' | 'advanced';
export type EditorTab = 'templates' | 'content' | 'design' | 'posters';
export type SaveStatus = 'saved' | 'saving' | 'error';
export type ExportFormat = 'png' | 'jpg';
export type MobilePane = 'editor' | 'preview';

export interface UiState {
  view: ViewMode;
  fullscreen: boolean;
  /** 'fit' scales to the available space; a number is an explicit display scale. */
  previewZoom: 'fit' | number;
  editorMode: EditorMode;
  tab: EditorTab;
  category: TemplateCategory | 'all';
  exportFormat: ExportFormat;
  exportScale: 1 | 2 | 3;
  saveStatus: SaveStatus;
  /** Actual scale the main preview is drawn at (published by the canvas; used for zoom steps). */
  displayScale: number;
  /** Below the desktop breakpoint the editor and preview are tabs (proposal §4.1). */
  mobilePane: MobilePane;
  /** Double-clicking a text on the canvas focuses its field in the editor. */
  focusRequest: { elementId: string; nonce: number } | null;

  set<K extends keyof UiState>(key: K, value: UiState[K]): void;
  requestFocus(elementId: string): void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      view: 'split',
      fullscreen: false,
      previewZoom: 'fit',
      editorMode: 'quick',
      tab: 'templates',
      category: 'all',
      exportFormat: 'png',
      exportScale: 1,
      saveStatus: 'saved',
      displayScale: 0.5,
      mobilePane: 'editor',
      focusRequest: null,
      set: (key, value) => set({ [key]: value } as Partial<UiState>),
      requestFocus: (elementId) => set({ focusRequest: { elementId, nonce: Date.now() }, tab: 'content' }),
    }),
    {
      name: 'template-studio:ui',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Per-browser preferences only; transient flags are not restored.
      partialize: (s) => ({
        view: s.view,
        editorMode: s.editorMode,
        tab: s.tab,
        category: s.category,
        exportFormat: s.exportFormat,
        exportScale: s.exportScale,
      }),
    },
  ),
);
