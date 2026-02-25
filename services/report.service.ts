// services/report.service.ts
import { http } from "./http";
import type {
  AmbulanceReport,
  UpdateVitalsRequest,
  UpdateSummaryRequest,
  UpdateAiChecklistRequest,
  UpdateChecklistRequest,
  UpdateAssessmentRequest,
  OcrVitalsResponse,
} from "@/types/report";

function base(sessionId: number) {
  return `/api/dispatch/sessions/${sessionId}/report`;
}

export const reportService = {
  /** 리포트 조회 (없으면 자동 생성) */
  get: (sessionId: number) =>
    http.get<AmbulanceReport>(base(sessionId)),

  /** 활력징후 업데이트 (OCR) */
  updateVitals: (sessionId: number, req: UpdateVitalsRequest) =>
    http.patch<AmbulanceReport>(`${base(sessionId)}/vitals`, req),

  /** AI 요약 업데이트 */
  updateSummary: (sessionId: number, req: UpdateSummaryRequest) =>
    http.patch<AmbulanceReport>(`${base(sessionId)}/summary`, req),

  /** AI 체크리스트 업데이트 */
  updateAiChecklist: (sessionId: number, req: UpdateAiChecklistRequest) =>
    http.patch<AmbulanceReport>(`${base(sessionId)}/ai-checklist`, req),

  /** 구급대원 체크리스트 업데이트 */
  updateChecklist: (sessionId: number, req: UpdateChecklistRequest) =>
    http.patch<AmbulanceReport>(`${base(sessionId)}/checklist`, req),

  /** 평가 정보 업데이트 (주호소/진단/발생일시) */
  updateAssessment: (sessionId: number, req: UpdateAssessmentRequest) =>
    http.patch<AmbulanceReport>(`${base(sessionId)}/assessment`, req),

  /** OCR 이미지 업로드 → AI 서버에서 활력징후 자동 추출 */
  uploadOcr: (sessionId: number, imageFile: File) => {
    const fd = new FormData();
    fd.append("session_id", String(sessionId));
    fd.append("image", imageFile);
    return http.postForm<OcrVitalsResponse>("/ai/report/ocr", fd);
  },
};
