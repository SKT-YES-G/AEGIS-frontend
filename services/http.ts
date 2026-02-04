// services/http.ts
import { env } from "@/lib/env";
import type { APIError } from "@/types/api";

type Method = "GET" | "POST";

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const base = env.API_BASE_URL || "";
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data?.message ?? msg;
    } catch {}

    const err: APIError = { status: res.status, message: msg };
    throw err;
  }

  return res.json();
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
};
