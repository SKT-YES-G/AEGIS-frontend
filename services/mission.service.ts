// services/mission.service.ts
import { http } from "./http";
import type { Mission } from "@/types/mission";

export const missionService = {
  getMission: () => http.get<Mission>("/api/mission"),
};
