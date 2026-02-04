// services/log.service.ts
import { http } from "./http";
import type { ActivityLogItem } from "@/types/log";

export const logService = {
  getLog: () => http.get<ActivityLogItem[]>("/api/log"),
};
