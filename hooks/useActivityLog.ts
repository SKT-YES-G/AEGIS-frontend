// hooks/useActivityLog.ts
"use client";

import { useCallback } from "react";
import { usePolling } from "./usePolling";
import { logService } from "@/services/log.service";
import type { ActivityLogItem } from "@/types/log";

// ✅ 로그는 5초 폴링(데모)
export function useActivityLog() {
  const fetcher = useCallback(() => logService.getLog(), []);
  return usePolling<ActivityLogItem[]>(fetcher, 5_000);
}
