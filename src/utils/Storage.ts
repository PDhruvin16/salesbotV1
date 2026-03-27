import AsyncStorage from '@react-native-async-storage/async-storage';

// Provide a synchronous in-memory cache to maintain compatibility with existing components
const memoryCache: Map<string, string> = new Map();

// Fire-and-forget hydration of cache from AsyncStorage on boot
AsyncStorage.getAllKeys().then((keys) => {
  if (keys.length > 0) {
    AsyncStorage.multiGet(keys).then((pairs) => {
      pairs.forEach(([key, val]) => {
        if (val !== null) memoryCache.set(key, val);
      });
    });
  }
}).catch(console.error);

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
  // === REDUX PERSIST COMPATIBLE METHODS ===
  setItem: (key: string, value: string): Promise<void> => {
    memoryCache.set(key, value);
    return AsyncStorage.setItem(key, value);
  },
  getItem: (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  removeItem: (key: string): Promise<void> => {
    memoryCache.delete(key);
    return AsyncStorage.removeItem(key);
  },

  // === LEGACY SYNCHRONOUS METHODS ===
  setString(key: StorageKey, value: string): void {
    memoryCache.set(key, value);
    AsyncStorage.setItem(key, value).catch(console.error);
  },

  getString(key: StorageKey): string | undefined {
    return memoryCache.get(key);
  },

  setJSON<T>(key: StorageKey, value: T): void {
    const stringValue = JSON.stringify(value);
    memoryCache.set(key, stringValue);
    AsyncStorage.setItem(key, stringValue).catch(console.error);
  },

  getJSON<T>(key: StorageKey): T | null {
    const raw = memoryCache.get(key);
    return safeParse<T>(raw);
  },

  remove(key: StorageKey): boolean {
    const existed = memoryCache.has(key);
    memoryCache.delete(key);
    AsyncStorage.removeItem(key).catch(console.error);
    return existed;
  },

  clear(): void {
    memoryCache.clear();
    AsyncStorage.clear().catch(console.error);
  },

  keys(): readonly string[] {
    return Array.from(memoryCache.keys());
  },

  multiRemove(keys: StorageKey[]): void {
    keys.forEach((key) => memoryCache.delete(key));
    AsyncStorage.multiRemove(keys).catch(console.error);
  },

  multiSetString(entries: Array<[StorageKey, string]>): void {
    entries.forEach(([key, value]) => memoryCache.set(key, value));
    AsyncStorage.multiSet(entries).catch(console.error);
  },

  setTokens(tokens: { access: string; refresh: string }): void {
    this.setString(StorageKeys.accessToken, tokens.access);
    this.setString(StorageKeys.refreshToken, tokens.refresh);
  },

  getAccessToken(): string | undefined {
    return this.getString(StorageKeys.accessToken);
  },

  getRefreshToken(): string | undefined {
    return this.getString(StorageKeys.refreshToken);
  },

  clearAuth(): void {
    this.remove(StorageKeys.accessToken);
    this.remove(StorageKeys.refreshToken);
    this.remove(StorageKeys.user);
  },

  setUser<T extends object = any>(user: T): void {
    this.setJSON(StorageKeys.user, user);
  },

  getUser<T extends object = any>(): T | null {
    return this.getJSON<T>(StorageKeys.user);
  },

  updateUserPartial<T extends object = any>(partial: Partial<T>): T | null {
    const current = this.getUser<T>() || ({} as T);
    const updated = { ...current, ...partial } as T;
    this.setUser<T>(updated);
    return updated;
  },

  contains(key: StorageKey): boolean {
    return memoryCache.has(key);
  },

  trim(): void {
    // No-op for AsyncStorage
  },

  getSize(): number {
    return memoryCache.size; // rough estimate
  },
};

export default storage;
