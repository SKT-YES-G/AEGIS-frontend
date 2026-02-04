// types/log.ts
export type LogTag = "INFO" | "CREW" | "GPS" | "KTAS_CHANGE";

export type ActivityLogItem = {
  id: string;
  at: string; // ISO 문자열
  tag: LogTag;
  message: string;
};
