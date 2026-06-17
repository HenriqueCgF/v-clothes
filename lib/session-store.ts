// Simple sessionStorage helper for passing data between pages

export const store = {
  set(key: string, value: unknown) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  get<T>(key: string): T | null {
    if (typeof window !== "undefined") {
      const val = sessionStorage.getItem(key);
      return val ? (JSON.parse(val) as T) : null;
    }
    return null;
  },
  clear(...keys: string[]) {
    if (typeof window !== "undefined") {
      keys.forEach((k) => sessionStorage.removeItem(k));
    }
  },
};
