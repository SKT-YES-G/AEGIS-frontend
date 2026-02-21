// services/http.ts
// Next.js rewrites가 /api/auth, /api/dispatch 등을 백엔드로 프록시합니다.
// 브라우저에서는 같은 오리진 요청이므로 CORS 문제 없음.
import type { APIError } from "@/types/api";
import { tokenStore } from "@/services/token";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** 백엔드 공통 응답 껍데기 */
type APIResponse<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
};

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  /** true이면 Authorization 헤더를 붙이지 않는다 (로그인/리프레시 등) */
  skipAuth = false,
): Promise<T> {
  const url = path;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!skipAuth) {
    const token = tokenStore.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // 401 → 토큰 갱신 후 재시도 (1회)
  if (res.status === 401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${tokenStore.getAccessToken()}`;
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    let msg = "Request failed";
    let code = "UNKNOWN";
    try {
      const json = await res.json();
      msg = json?.error?.message ?? json?.message ?? msg;
      code = json?.error?.code ?? code;
    } catch { /* ignore */ }

    const err: APIError = { status: res.status, message: msg, code };
    throw err;
  }

  // 204 No Content 등 빈 응답 처리
  const text = await res.text();
  if (!text) return undefined as T;

  const json = JSON.parse(text) as APIResponse<T> | T;

  // 백엔드 공통 껍데기가 있으면 data만 꺼냄
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return (json as APIResponse<T>).data;
  }
  return json as T;
}

/** refreshToken으로 accessToken 갱신 */
async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) {
      tokenStore.clear();
      return false;
    }

    const json = await res.json();
    const newToken = json?.data?.accessToken ?? json?.accessToken;
    if (newToken) {
      tokenStore.setAccessToken(newToken);
      return true;
    }
    return false;
  } catch {
    tokenStore.clear();
    return false;
  }
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
  /** 인증 없이 호출 (로그인, 소방서 검색 등) */
  noAuth: {
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, body, true),
    get: <T>(path: string) => request<T>("GET", path, undefined, true),
  },
};
