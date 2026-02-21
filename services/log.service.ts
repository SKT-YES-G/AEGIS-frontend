// services/log.service.ts
import { eventLogService } from "./event-log.service";
import type { EventLogResponse } from "@/types/event-log";

export const logService = {
  getLog: (sessionId: number): Promise<EventLogResponse[]> =>
    eventLogService.getAll(sessionId),
};
