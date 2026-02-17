// types/hospital.ts

/** 카드 요약 + 아코디언 상세 + 비표시(좌표/ID) 필드를 하나의 타입으로 관리 */
export type Hospital = {
  /* ── 비표시: 백엔드 식별/좌표 ── */
  hospitalId: string;
  lat: number;
  lng: number;

  /* ── 카드 요약 ── */
  name: string;
  /** km 단위 (예: 1.2) */
  distanceKm: number;
  /** 가용 응급 병상 수 */
  erBedsAvailable: number;
  /** 병원 유형 (예: "권역응급의료센터", "지역응급의료기관") */
  hospitalType: string;

  /* ── 아코디언 상세 ── */
  departments: string[];
  address: string;
  phoneMain: string;
  phoneEr: string;
  phoneDuty: string;
};
