import { createMMKV } from 'react-native-mmkv';

const mmkvStorage = createMMKV();

export const StorageKeys = {
  accessToken: 'authToken',
  refreshToken: 'refreshToken',
  user: 'userData',
  appTheme: 'app_theme',
  attendanceState: 'attendance_state',
  attendanceDate: 'attendance_date',
} as const;

type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys] | string;

function safeParse<T>(value: string | undefined): T | null {
  if (value == null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export const storage = {
  setString(key: StorageKey, value: string): void {
    mmkvStorage.set(key, value);
  },

  getString(key: StorageKey): string | undefined {
    return mmkvStorage.getString(key);
  },

  setJSON<T>(key: StorageKey, value: T): void {
    mmkvStorage.set(key, JSON.stringify(value));
  },

  getJSON<T>(key: StorageKey): T | null {
    const raw = mmkvStorage.getString(key);
    return safeParse<T>(raw);
  },

  // ✅ CORRECT - Use remove() instead of delete()
  remove(key: StorageKey): boolean {
    return mmkvStorage.remove(key); // Returns true if removed
  },

  clear(): void {
    mmkvStorage.clearAll();
  },

  keys(): readonly string[] {
    return mmkvStorage.getAllKeys();
  },

  multiRemove(keys: StorageKey[]): void {
    keys.forEach((key) => mmkvStorage.remove(key)); // ✅ remove() not delete()
  },

  multiSetString(entries: Array<[StorageKey, string]>): void {
    entries.forEach(([key, value]) => mmkvStorage.set(key, value));
  },

  setTokens(tokens: { access: string; refresh: string }): void {
    mmkvStorage.set(StorageKeys.accessToken, tokens.access);
    mmkvStorage.set(StorageKeys.refreshToken, tokens.refresh);
  },

  getAccessToken(): string | undefined {
    return mmkvStorage.getString(StorageKeys.accessToken);
  },

  getRefreshToken(): string | undefined {
    return mmkvStorage.getString(StorageKeys.refreshToken);
  },

  // ✅ CORRECT clearAuth
  clearAuth(): void {
    mmkvStorage.remove(StorageKeys.accessToken);
    mmkvStorage.remove(StorageKeys.refreshToken);
    mmkvStorage.remove(StorageKeys.user);
  },

  setUser<T extends object = any>(user: T): void {
    mmkvStorage.set(StorageKeys.user, JSON.stringify(user));
  },

  getUser<T extends object = any>(): T | null {
    const raw = mmkvStorage.getString(StorageKeys.user);
    return safeParse<T>(raw);
  },

  updateUserPartial<T extends object = any>(partial: Partial<T>): T | null {
    const current = storage.getUser<T>() || ({} as T);
    const updated = { ...current, ...partial } as T;
    storage.setUser<T>(updated);
    return updated;
  },

  // Additional MMKV helpers
  contains(key: StorageKey): boolean {
    return mmkvStorage.contains(key);
  },

  trim(): void {
    mmkvStorage.trim();
  },

  getSize(): number {
    return mmkvStorage.size;
  },
};

export default storage;
