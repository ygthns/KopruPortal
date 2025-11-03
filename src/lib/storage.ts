type StorageValue<T> = {
  version: number;
  data: T;
};

const VERSION = 1;

export function readPersisted<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as StorageValue<T> | T;

    if ('data' in (parsed as StorageValue<T>)) {
      const value = parsed as StorageValue<T>;
      return value.version === VERSION ? value.data : fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writePersisted<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  const value: StorageValue<T> = { version: VERSION, data };
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removePersisted(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
