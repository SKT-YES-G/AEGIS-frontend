// types/event-log.ts

export type EventType =
  | "SESSION_START"
  | "SESSION_END"
  | "AI_KTAS_CHANGE"
  | "PARAMEDIC_KTAS_CHANGE"
  | "SYNC_TOGGLE"
  | "KEYWORD_DETECTED";

export type EventLogResponse = {
  logId: number;
  eventType: EventType;
  description: string;
  createdAt: string; // ISO
};
