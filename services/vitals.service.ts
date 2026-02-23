// services/vitals.service.ts
import { reportService } from "./report.service";
import type { AmbulanceReport } from "@/types/report";
import type { Vitals } from "@/types/vitals";

/** AmbulanceReport에서 Vitals 형태로 변환 */
function toVitals(r: AmbulanceReport): Vitals {
  return {
    sbp: r.sbp ?? 0,
    dbp: r.dbp ?? 0,
    hr: r.pr ?? 0,
    spo2: r.spO2 ?? 0,
    temp: r.tempC ?? 0,
    rr: r.rr ?? 0,
    glucose: r.glucose ?? undefined,
    source: "device",
    updatedAt: r.updatedAt,
  };
}

export const vitalsService = {
  getVitals: async (sessionId: number): Promise<Vitals> => {
    const report = await reportService.get(sessionId);
    return toVitals(report);
  },
};
