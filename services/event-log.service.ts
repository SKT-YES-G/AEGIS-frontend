// services/event-log.service.ts
import { http } from "./http";
import type { EventLogResponse } from "@/types/event-log";

function base(sessionId: number) {
  return `/api/dispatch/sessions/${sessionId}/logs`;
}

export const eventLogService = {
  /** 전체 이벤트 로그 조회 */
  getAll: (sessionId: number) =>
    http.get<EventLogResponse[]>(base(sessionId)),

  /** 이벤트 로그 저장 (KEYWORD_DETECTED) */
  save: (sessionId: number, description: string) =>
    http.post<EventLogResponse>(base(sessionId), { description }),
};
