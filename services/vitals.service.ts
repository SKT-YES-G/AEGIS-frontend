// services/vitals.service.ts
import { http } from "./http";
import type { Vitals } from "@/types/vitals";

export const vitalsService = {
  getVitals: () => http.get<Vitals>("/api/vitals"),
};
