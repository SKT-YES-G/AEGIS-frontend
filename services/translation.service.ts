// services/translation.service.ts
import { http } from "./http";
import type { TranslationResponse, SaveTranslationRequest } from "@/types/translation";

function base(sessionId: number) {
  return `/api/dispatch/sessions/${sessionId}/translations`;
}

export const translationService = {
  /** 전체 번역 기록 조회 */
  getAll: (sessionId: number) =>
    http.get<TranslationResponse[]>(base(sessionId)),

  /** 번역 저장 */
  save: (sessionId: number, req: SaveTranslationRequest) =>
    http.post<TranslationResponse>(base(sessionId), req),

  /** 쉬운 번역 생성 */
  generateEasy: (sessionId: number, translationId: number) =>
    http.post<TranslationResponse>(
      `${base(sessionId)}/${translationId}/easy`,
    ),
};
