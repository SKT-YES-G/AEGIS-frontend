// services/session.service.ts
import { http } from "./http";
import type { DispatchSession, CreateSessionRequest } from "@/types/session";

const BASE = "/api/dispatch/sessions";

export const sessionService = {
  /** 전체 세션 목록 */
  getAll: () => http.get<DispatchSession[]>(BASE),

  /** 활성 세션만 */
  getActive: () => http.get<DispatchSession[]>(`${BASE}/active`),

  /** 단일 세션 조회 */
  getById: (id: number) => http.get<DispatchSession>(`${BASE}/${id}`),

  /** 새 세션 생성 */
  create: (req: CreateSessionRequest) => http.post<DispatchSession>(BASE, req),

  /** 세션 완료 */
  complete: (id: number) => http.patch<DispatchSession>(`${BASE}/${id}/complete`),
};
