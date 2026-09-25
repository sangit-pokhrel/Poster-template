import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { create } from 'zustand';
import { Button } from './controls';

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error' | 'info';
}

const useToasts = create<{ toasts: Toast[]; push(t: Omit<Toast, 'id'>): void; dismiss(id: number): void }>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), t.kind === 'error' ? 6000 : 3000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToasts.getState().push({ message, kind: 'success' }),
  error: (message: string) => useToasts.getState().push({ message, kind: 'error' }),
  info: (message: string) => useToasts.getState().push({ message, kind: 'info' }),
};

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto max-w-[90vw] rounded-xl border px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur ${
            t.kind === 'error' ? 'border-red-500/60 bg-red-950/90 text-red-100' : t.kind === 'info' ? 'border-ink-600 bg-ink-850/95 text-ink-200' : 'border-emerald-500/50 bg-ink-850/95 text-white'
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Confirm modal (proposal §25)                                        */
/* ------------------------------------------------------------------ */

interface ConfirmRequest {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
}

const useConfirmStore = create<{ request: ConfirmRequest | null; set(r: ConfirmRequest | null): void }>((set) => ({
  request: null,
  set: (request) => set({ request }),
}));

/** `if (await confirm({...})) doIt()` — renders the modal below. */
export function confirm(opts: Omit<ConfirmRequest, 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => useConfirmStore.getState().set({ ...opts, resolve }));
}

export function ConfirmDialog() {
  const request = useConfirmStore((s) => s.request);
  const setRequest = useConfirmStore((s) => s.set);
  const confirmBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(
    (ok: boolean) => {
      request?.resolve(ok);
      setRequest(null);
    },
    [request, setRequest],
  );

  useEffect(() => {
    if (!request) return;
    confirmBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [request, close]);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={() => close(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900 p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-white">
          {request.title}
        </h2>
        <div className="mt-2 text-sm text-ink-300">{request.message}</div>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => close(false)}>Cancel</Button>
          <Button ref={confirmBtn} variant={request.danger ? 'danger' : 'primary'} onClick={() => close(true)}>
            {request.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
