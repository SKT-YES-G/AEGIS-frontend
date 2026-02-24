// services/triage.service.ts — FA_server (AI) 엔드포인트 호출
import { http } from "./http";
import type { TriageInputResponse, TriageState } from "@/types/triage";

export const triageService = {
  /** 텍스트 입력 → KTAS 분류 실행 */
  submitInput: (text: string, source: "keyboard" | "stt", sessionId: string) =>
    http.post<TriageInputResponse>("/triage/input", {
      text,
      source,
      session_id: sessionId,
    }),

  /** 현재 분류 상태 조회 */
  getState: (sessionId: string) =>
    http.get<TriageState>(`/triage/state?session_id=${sessionId}`),

  /** 세션 초기화 */
  reset: (sessionId: string) =>
    http.post<{ session_id: string; message: string }>(
      `/triage/reset?session_id=${sessionId}`,
    ),
};
