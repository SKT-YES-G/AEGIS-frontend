// hooks/useMission.ts
"use client";

import { useCallback } from "react";
import { usePolling } from "./usePolling";
import { missionService } from "@/services/mission.service";
import type { Mission } from "@/types/mission";

// ✅ 미션/평가 정보는 자주 안 바뀌므로 30초 폴링
export function useMission() {
  const fetcher = useCallback(() => missionService.getMission(), []);
  return usePolling<Mission>(fetcher, 30_000);
}
