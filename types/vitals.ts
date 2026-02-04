// types/vitals.ts
export type Vitals = {
  sbp: number; // 수축기
  dbp: number; // 이완기
  hr: number; // 맥박
  spo2: number; // 산소포화도
  temp: number; // 체온
  rr: number; // 호흡수
  source: "device" | "manual";
  updatedAt: string; // ISO 문자열
};
