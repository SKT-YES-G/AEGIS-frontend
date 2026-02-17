// hooks/useMission.ts
"use client";

import { useCallback, useMemo } from "react";
import { usePolling } from "./usePolling";
import { missionService } from "@/services/mission.service";
import type { Mission } from "@/types/mission";

/**
 * ✅ UI 데모/테스트용 Mock 케이스
 * - Mission 타입 필수 필드가 더 많으면 여기 객체에 추가해주면 됨
 */
const MOCK_MISSIONS: Mission[] = [
  {
    level: 0,
    aiConfidence: "low",
    lastModelCalledAt: "2026-02-16T14:30:00+09:00",
    reasoning: "아직 평가 전입니다. 데이터 수집 중.",
    actions: ["환자 정보 입력", "활력징후 측정", "초기 평가 시작"],
  } as Mission,
  {
    level: 1,
    aiConfidence: "high",
    lastModelCalledAt: "2026-02-16T14:32:07+09:00",
    reasoning: "의식 저하 + 호흡/순환 이상 소견 의심",
    actions: ["기도 확보", "산소 공급", "즉시 수용 가능 병원 컨택"],
  } as Mission,
  {
    level: 2,
    aiConfidence: "mid",
    lastModelCalledAt: "2026-02-16T14:33:21+09:00",
    reasoning: "고위험 징후 가능성(예: 흉통/호흡곤란) 평가 필요",
    actions: ["SpO₂/심전도 확인", "고위험 병원 우선", "상태 변화 모니터링"],
  } as Mission,
  {
    level: 3,
    aiConfidence: "mid",
    lastModelCalledAt: "2026-02-16T14:35:45+09:00",
    reasoning: "응급 수준. 중증 징후는 뚜렷하지 않으나 처치/관찰 필요",
    actions: ["활력징후 재측정", "증상 경과 확인", "처치 후 반응 관찰"],
  } as Mission,
  {
    level: 4,
    aiConfidence: "low",
    lastModelCalledAt: "2026-02-16T14:37:12+09:00",
    reasoning: "준응급. 즉각 처치 필요성 낮고 상태 안정",
    actions: ["증상 완화 조치", "이송 필요성 재평가", "기록 정리"],
  } as Mission,
  {
    level: 5,
    aiConfidence: "low",
    lastModelCalledAt: "2026-02-16T14:38:59+09:00",
    reasoning: "비응급. 중증 징후 없음",
    actions: ["관찰", "주의사항 안내", "필요 시 외래/추적 권고"],
  } as Mission,
];

// ✅ 미션/평가 정보는 자주 안 바뀌므로 30초 폴링
export function useMission(caseIndex?: number) {
  const isMock = typeof caseIndex === "number";

  // ✅ caseIndex가 들어오면: 폴링 대신 Mock 반환 (버튼 테스트용)
  const mockData = useMemo(() => {
    if (!isMock) return null;
    const n = MOCK_MISSIONS.length;
    const safe = ((caseIndex % n) + n) % n;
    return MOCK_MISSIONS[safe];
  }, [caseIndex, isMock]);

  // ✅ 훅은 항상 동일한 순서로 호출 (rules-of-hooks)
  // mock 모드일 때는 즉시 resolve되는 no-op fetcher 사용 (API 호출 없음)
  const fetcher = useCallback(
    (): Promise<Mission> =>
      isMock
        ? Promise.resolve(MOCK_MISSIONS[0])
        : missionService.getMission(),
    [isMock],
  );
  const polled = usePolling<Mission>(fetcher, 30_000);

  if (mockData) {
    return {
      data: mockData,
      loading: false,
      error: null,
    } as const;
  }

  return polled;
}
