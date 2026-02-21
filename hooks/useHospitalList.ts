// hooks/useHospitalList.ts
"use client";

import { useCallback, useMemo, useState } from "react";
import { hospitalService } from "@/services/hospital.service";
import { toHospital } from "@/types/hospital";
import type { Hospital, HospitalSearchRequest } from "@/types/hospital";

type UseHospitalListReturn = {
  hospitals: Hospital[];
  loading: boolean;
  selectedId: string | null;
  select: (id: string) => void;
  clearSelection: () => void;
  selectedHospital: Hospital | null;
  fetchHospitals: (req: HospitalSearchRequest) => void;
};

export function useHospitalList(): UseHospitalListReturn {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchHospitals = useCallback(async (req: HospitalSearchRequest) => {
    setLoading(true);
    try {
      const res = await hospitalService.search(req);
      setHospitals(res.hospitals.map(toHospital));
    } catch {
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { hospitals, loading, selectedId, select, clearSelection, selectedHospital, fetchHospitals };
}
