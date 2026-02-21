// hooks/useMission.ts
"use client";

import { useCallback } from "react";
import { usePolling } from "./usePolling";
import { ktasService } from "@/services/ktas.service";
import type { PreKtasResponse } from "@/types/ktas";

/**
 * sessionId를 받아 PreKTAS 정보를 폴링으로 조회.
 * sessionId가 없으면 빈 상태 반환.
 */
export function useMission(sessionId: number | null) {
  const fetcher = useCallback(
    (): Promise<PreKtasResponse> => {
      if (!sessionId) return Promise.reject(new Error("No sessionId"));
      return ktasService.get(sessionId);
    },
    [sessionId],
  );

  const polled = usePolling<PreKtasResponse>(fetcher, 10_000);

  if (!sessionId) {
    return { data: null, loading: false, error: null } as const;
  }

  return polled;
}
