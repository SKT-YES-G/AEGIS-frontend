// hooks/useVitals.ts
"use client";

import { useCallback } from "react";
import { usePolling } from "./usePolling";
import { vitalsService } from "@/services/vitals.service";
import type { Vitals } from "@/types/vitals";

// ✅ 바이탈은 10초 폴링
export function useVitals() {
  const fetcher = useCallback(() => vitalsService.getVitals(), []);
  return usePolling<Vitals>(fetcher, 10_000);
}
