// types/mission.ts
export type Mission = {
  missionId: string; // 예: MAPO_20260204_058
  stationName: string;
  startedAt: string; // ISO 문자열
  aiConfidence: "low" | "mid" | "high";
  level: 1 | 2 | 3 | 4 | 5;
  levelLabel: string; // 예: 비응급
  reasoning: string;
  actions: string[];
};
