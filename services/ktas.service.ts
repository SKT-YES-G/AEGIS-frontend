// services/ktas.service.ts
import { http } from "./http";
import type {
  PreKtasResponse,
  UpdateAiKtasRequest,
  UpdateParamedicKtasRequest,
  ToggleSyncRequest,
} from "@/types/ktas";

function base(sessionId: number) {
  return `/api/dispatch/sessions/${sessionId}/ktas`;
}

export const ktasService = {
  /** KTAS 정보 조회 */
  get: (sessionId: number) =>
    http.get<PreKtasResponse>(base(sessionId)),

  /** AI KTAS 업데이트 */
  updateAi: (sessionId: number, req: UpdateAiKtasRequest) =>
    http.put<PreKtasResponse>(`${base(sessionId)}/ai`, req),

  /** 구급대원 KTAS 업데이트 */
  updateParamedic: (sessionId: number, req: UpdateParamedicKtasRequest) =>
    http.put<PreKtasResponse>(`${base(sessionId)}/paramedic`, req),

  /** 동기화 토글 */
  toggleSync: (sessionId: number, req: ToggleSyncRequest) =>
    http.patch<PreKtasResponse>(`${base(sessionId)}/sync`, req),
};
