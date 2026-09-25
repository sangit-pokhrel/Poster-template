import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { makeTranslator } from '../lib/i18n';
import type { Translate } from '../lib/i18n';
import type { AppState } from './defaults';
import { loadState, saveState } from './persistence';
import type { SaveStatus } from './persistence';
import { reducer, selectActivePost } from './reducer';
import type { Action, PostPatch } from './reducer';

interface StoreValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  saveStatus: SaveStatus;
  t: Translate;
}

const StoreContext = createContext<StoreValue | null>(null);

const SAVE_DEBOUNCE_MS = 400;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Debounced persistence: dragging a slider doesn't serialise the whole state 60×/s.
  useEffect(() => {
    const id = window.setTimeout(() => setSaveStatus(saveState(state)), SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.lang === 'ne' ? 'ne' : 'en';
  }, [state.lang]);

  const t = useMemo(() => makeTranslator(state.lang), [state.lang]);
  const value = useMemo(() => ({ state, dispatch, saveStatus, t }), [state, saveStatus, t]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

export function useActivePost() {
  const { state, dispatch } = useStore();
  const post = selectActivePost(state);
  return {
    post,
    update: (patch: PostPatch) => dispatch({ type: 'post/update', id: post.id, patch }),
  };
}
