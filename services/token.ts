// services/token.ts
const ACCESS_KEY = "aegis-access-token";
const REFRESH_KEY = "aegis-refresh-token";

function get(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch { /* ignore */ }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}

export const tokenStore = {
  getAccessToken: () => get(ACCESS_KEY),
  setAccessToken: (t: string) => set(ACCESS_KEY, t),
  getRefreshToken: () => get(REFRESH_KEY),
  setRefreshToken: (t: string) => set(REFRESH_KEY, t),
  setTokens: (access: string, refresh: string) => {
    set(ACCESS_KEY, access);
    set(REFRESH_KEY, refresh);
  },
  clear: () => {
    remove(ACCESS_KEY);
    remove(REFRESH_KEY);
  },
};
