// hooks/usePolling.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { APIError } from "@/types/api";

/**
 * 이벤트 기반 데이터 조회 훅
 * - 마운트 시 1회 자동 fetch
 * - window "aegis:refresh" 이벤트 수신 시 재조회
 */
export function usePolling<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const tick = useCallback(async () => {
    try {
      setError(null);
      const res = await fetcher();
      setData(res);
    } catch (e) {
      setError(e as APIError);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    // 마운트 시 1회 fetch
    tick();

    // aegis:refresh 이벤트 수신 시 재조회
    const handler = () => tick();
    window.addEventListener("aegis:refresh", handler);

    return () => {
      window.removeEventListener("aegis:refresh", handler);
    };
  }, [tick]);

  return { data, loading, error };
}
