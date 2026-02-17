// hooks/useHospitalList.ts
"use client";

import { useCallback, useMemo, useState } from "react";
import type { Hospital } from "@/types/hospital";

/* ------------------------------------------------------------------ */
/*  Mock 데이터 (백엔드 연동 전 UI 확인용)                                */
/* ------------------------------------------------------------------ */
const MOCK_HOSPITALS: Hospital[] = [
  {
    hospitalId: "h-001",
    lat: 37.5612,
    lng: 126.9958,
    name: "서울대학교병원 응급의료센터",
    distanceKm: 0.8,
    erBedsAvailable: 3,
    hospitalType: "권역응급의료센터",
    departments: ["응급의학과", "외과", "신경외과", "정형외과"],
    address: "서울특별시 종로구 대학로 101",
    phoneMain: "02-2072-2114",
    phoneEr: "02-2072-3500",
    phoneDuty: "02-2072-3111",
  },
  {
    hospitalId: "h-002",
    lat: 37.5583,
    lng: 126.9985,
    name: "국립중앙의료원",
    distanceKm: 1.4,
    erBedsAvailable: 5,
    hospitalType: "지역응급의료센터",
    departments: ["응급의학과", "내과", "외과"],
    address: "서울특별시 중구 을지로 245",
    phoneMain: "02-2260-7114",
    phoneEr: "02-2260-7119",
    phoneDuty: "02-2260-7100",
  },
  {
    hospitalId: "h-003",
    lat: 37.5665,
    lng: 126.9913,
    name: "세브란스병원",
    distanceKm: 2.1,
    erBedsAvailable: 0,
    hospitalType: "권역응급의료센터",
    departments: ["응급의학과", "심장내과", "신경과", "외과", "흉부외과"],
    address: "서울특별시 서대문구 연세로 50-1",
    phoneMain: "02-2228-0114",
    phoneEr: "02-2228-6200",
    phoneDuty: "02-2228-6000",
  },
  {
    hospitalId: "h-004",
    lat: 37.5563,
    lng: 127.0012,
    name: "백병원 응급실",
    distanceKm: 3.5,
    erBedsAvailable: 2,
    hospitalType: "지역응급의료기관",
    departments: ["응급의학과", "내과"],
    address: "서울특별시 중구 퇴계로 327",
    phoneMain: "02-2270-0114",
    phoneEr: "02-2270-0119",
    phoneDuty: "02-2270-0100",
  },
];

/* ------------------------------------------------------------------ */
/*  Hook 반환 타입                                                     */
/* ------------------------------------------------------------------ */
type UseHospitalListReturn = {
  hospitals: Hospital[];
  selectedId: string | null;
  select: (id: string) => void;
  clearSelection: () => void;
  selectedHospital: Hospital | null;
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useHospitalList(): UseHospitalListReturn {
  // TODO: 백엔드 연동 시 usePolling 또는 fetch로 교체
  const hospitals = MOCK_HOSPITALS;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const select = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const selectedHospital = useMemo(
    () => hospitals.find((h) => h.hospitalId === selectedId) ?? null,
    [hospitals, selectedId],
  );

  return { hospitals, selectedId, select, clearSelection, selectedHospital };
}
