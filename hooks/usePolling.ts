// hooks/usePolling.ts
"use client";

import { useEffect, useState } from "react";
import type { APIError } from "@/types/api";

// ✅ 공통 폴링 훅: data/loading/error 패턴을 강제로 통일
export function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        setError(null);
        const res = await fetcher();
        if (alive) setData(res);
      } catch (e) {
        if (alive) setError(e as APIError);
      } finally {
        if (alive) setLoading(false);
      }
    };

    tick();
    const t = setInterval(tick, intervalMs);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [fetcher, intervalMs]);

  return { data, loading, error };
}
