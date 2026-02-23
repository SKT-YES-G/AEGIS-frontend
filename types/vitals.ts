// types/vitals.ts
export type Vitals = {
  sbp: number; // 수축기
  dbp: number; // 이완기
  hr: number; // 맥박 (백엔드: pr)
  spo2: number; // 산소포화도
  temp: number; // 체온 (백엔드: tempC)
  rr: number; // 호흡수
  glucose?: number; // 혈당 (mg/dL, -1 = 측정불가)
  source: "device" | "manual";
  updatedAt: string; // ISO 문자열
};
