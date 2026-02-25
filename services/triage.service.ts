// services/triage.service.ts
import { http } from "./http";
import type { TriageInputResponse, TriageState } from "@/types/triage";

export type TriageInputRequest = {
  text: string;
  source: "stt" | "keyboard";
  session_id: string;
};

export const triageService = {
  /** STT/키보드 텍스트 → PreKTAS 분류 */
  input: (req: TriageInputRequest) =>
    http.post<TriageInputResponse>("/ai/triage/input", req),

  /** 현재 분류 상태 조회 */
  getState: (sessionId: string) =>
    http.get<TriageState>(`/ai/triage/state?session_id=${sessionId}`),

  /** 세션 초기화 */
  reset: (sessionId: string) =>
    http.post<{ session_id: string; message: string }>(
      `/ai/triage/reset?session_id=${sessionId}`,
    ),
};
