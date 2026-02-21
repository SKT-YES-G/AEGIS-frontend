// services/hospital.service.ts
import { http } from "./http";
import type {
  HospitalSearchRequest,
  HospitalSearchResponse,
} from "@/types/hospital";

export const hospitalService = {
  /** 병원 검색 (위치 + KTAS 기반 랭킹) */
  search: (req: HospitalSearchRequest) =>
    http.post<HospitalSearchResponse>("/api/medical/hospitals/search", req),
};
