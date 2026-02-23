// types/hospital.ts

/** 병원 검색 요청 */
export type HospitalSearchRequest = {
  latitude: number;      // 33-39
  longitude: number;     // 124-132
  ktasLevel?: number;    // 1-5
  departments?: string[];
};

/** 병원 검색 응답 */
export type HospitalSearchResponse = {
  totalCount: number;
  ktasApplied: boolean;
  hospitals: HospitalRankItem[];
};

/** 개별 병원 (랭킹 포함) */
export type HospitalRankItem = {
  rank: number;
  score: number;          // 0.0 - 1.0
  hpid: string;
  hospitalName: string;
  distanceKm: number;
  emergencyBeds: number;
  icuBeds: number;
  inpatientBeds: number;
  availableBeds: number;
  hospitalType: string;
  departments: string[];
  address: string;
  mainTel: string;
  emergencyTel: string;
  dutyTel: string;
  latitude: number;
  longitude: number;
};

/** 프론트 내부에서 사용하는 통합 타입 (기존 코드 호환) */
export type Hospital = {
  hospitalId: string;
  lat: number;
  lng: number;
  name: string;
  distanceKm: number;
  erBedsAvailable: number;
  hospitalType: string;
  departments: string[];
  address: string;
  phoneMain: string;
  phoneEr: string;
  phoneDuty: string;
  rank?: number;
  score?: number;
};

/** HospitalRankItem → Hospital 변환 */
export function toHospital(item: HospitalRankItem): Hospital {
  return {
    hospitalId: item.hpid,
    lat: item.latitude,
    lng: item.longitude,
    name: item.hospitalName,
    distanceKm: item.distanceKm,
    erBedsAvailable: item.emergencyBeds,
    hospitalType: item.hospitalType,
    departments: Array.isArray(item.departments)
      ? item.departments
      : typeof item.departments === "string"
        ? (item.departments as string).split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    address: item.address,
    phoneMain: item.mainTel,
    phoneEr: item.emergencyTel,
    phoneDuty: item.dutyTel,
    rank: item.rank,
    score: item.score,
  };
}
