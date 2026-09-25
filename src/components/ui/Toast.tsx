import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'info';
interface ToastState {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<((message: string, kind?: ToastKind) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const seq = useRef(0);

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    seq.current += 1;
    setToast({ id: seq.current, message, kind });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), toast.kind === 'error' ? 6000 : 3000);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className={`toast toast--${toast.kind}`}>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
