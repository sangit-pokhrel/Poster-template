import { useCallback, useState } from 'react';

/**
 * Per-browser UI preference (active tab, minimised preview). Storage can be
 * blocked or cleared at any time, so every access is guarded and the app
 * works identically without it.
 */
export function useLocalPreference<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null && (allowed as readonly string[]).includes(stored) ? (stored as T) : fallback;
    } catch {
      return fallback;
    }
  });

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, next);
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return [value, update] as const;
}
