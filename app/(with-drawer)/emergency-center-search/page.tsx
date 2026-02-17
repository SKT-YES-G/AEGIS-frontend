// app/(with-drawer)/emergency-center-search/page.tsx
"use client";

import { useMemo } from "react";
import TmapMap from "@/components/live/TmapMap";
import { HospitalListPanel } from "@/components/live/HospitalListPanel";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useHospitalList } from "@/hooks/useHospitalList";

export default function EmergencyCenterSearchPage() {
  /* ── 현재 위치 (페이지 진입 시 자동 요청) ── */
  const { coords } = useCurrentLocation({ autoFetch: true });

  /* ── 병원 목록 + 선택 ── */
  const { hospitals, selectedId, select, selectedHospital } =
    useHospitalList();

  /* ── 지도 중심: 선택된 병원 > 현재 GPS 위치 > undefined(서울 기본) ── */
  const mapCenter = useMemo(() => {
    if (selectedHospital) {
      return { lat: selectedHospital.lat, lng: selectedHospital.lng };
    }
    if (coords) {
      return { lat: coords.lat, lng: coords.lng };
    }
    return undefined;
  }, [selectedHospital, coords]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* ── 상단 바 ── */}
      <div className="shrink-0 flex items-center px-4 py-2">
        <span className="text-sm text-[var(--text-muted)]">
          주변 응급의료센터 검색
        </span>
      </div>

      {/* ── 본문: 좌측 패널 + 우측 지도 ── */}
      <div className="flex flex-1 min-h-0">
        {/* 좌측 병원 리스트 */}
        <div className="w-80 shrink-0 border-r border-[var(--border)] bg-[var(--bg)]">
          <HospitalListPanel
            hospitals={hospitals}
            selectedId={selectedId}
            onSelect={select}
          />
        </div>

        {/* 우측 지도 */}
        <div className="flex-1 min-w-0">
          <TmapMap heightPx={700} center={mapCenter} /> 
        </div>
      </div>
    </div>
  );
}
