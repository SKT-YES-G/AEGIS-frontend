// hooks/useActivityLog.ts
"use client";

import { useCallback } from "react";
import { usePolling } from "./usePolling";
import { eventLogService } from "@/services/event-log.service";
import type { EventLogResponse } from "@/types/event-log";

// ✅ 로그는 5초 폴링
export function useActivityLog(sessionId: number | null) {
  const fetcher = useCallback(
    (): Promise<EventLogResponse[]> => {
      if (!sessionId) return Promise.reject(new Error("No sessionId"));
      return eventLogService.getAll(sessionId);
    },
    [sessionId],
  );

  const polled = usePolling<EventLogResponse[]>(fetcher, 5_000);

  if (!sessionId) {
    return { data: null, loading: false, error: null } as const;
  }

  return polled;
}
