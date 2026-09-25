/**
 * Uploaded photos & logos live in IndexedDB as Blobs (proposal §24, §38) and
 * are referenced from poster state as `asset:<id>`. State stays small enough
 * for localStorage, and large originals never sit in React state.
 */
import { newId } from '../utils/id';

const DB_NAME = 'template-studio';
const STORE = 'assets';
const PREFIX = 'asset:';

export const isAssetRef = (src: string): boolean => src.startsWith(PREFIX);
export const assetIdOf = (src: string): string => src.slice(PREFIX.length);

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error ?? new Error('IndexedDB unavailable'));
    };
  });
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const req = run(db.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
      }),
  );
}

const urlCache = new Map<string, Promise<string>>();

export async function putAsset(blob: Blob): Promise<string> {
  const id = newId();
  await tx('readwrite', (s) => s.put(blob, id));
  const ref = PREFIX + id;
  urlCache.set(ref, Promise.resolve(URL.createObjectURL(blob)));
  return ref;
}

/** Object URL for an `asset:` reference (cached for the session). */
export function assetUrl(ref: string): Promise<string> {
  const hit = urlCache.get(ref);
  if (hit) return hit;
  const p = tx<Blob | undefined>('readonly', (s) => s.get(assetIdOf(ref))).then((blob) => {
    if (!blob) throw new Error(`Missing asset ${ref}`);
    return URL.createObjectURL(blob);
  });
  urlCache.set(ref, p);
  p.catch(() => urlCache.delete(ref));
  return p;
}

/** Deletes stored blobs no poster references any more (run at startup). */
export async function collectGarbage(referenced: ReadonlySet<string>): Promise<number> {
  try {
    const keys = await tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
    const orphans = keys.filter((k) => !referenced.has(PREFIX + String(k)));
    await Promise.all(orphans.map((k) => tx('readwrite', (s) => s.delete(k))));
    return orphans.length;
  } catch {
    return 0;
  }
}
