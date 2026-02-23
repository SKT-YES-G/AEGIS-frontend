// services/mission.service.ts
import { ktasService } from "./ktas.service";
import type { PreKtasResponse } from "@/types/ktas";

export const missionService = {
  /** sessionId로 KTAS 정보 조회 */
  getMission: (sessionId: number): Promise<PreKtasResponse> =>
    ktasService.get(sessionId),
};
