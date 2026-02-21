// app/(with-drawer)/emergency-center-search/page.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import TmapMap from "@/components/live/TmapMap";
import { HospitalListPanel } from "@/components/live/HospitalListPanel";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useHospitalList } from "@/hooks/useHospitalList";

export default function EmergencyCenterSearchPage() {
  /* ── 현재 위치 (페이지 진입 시 자동 요청) ── */
  const { coords, refresh } = useCurrentLocation({ autoFetch: true });

  /* ── 병원 목록 + 선택 ── */
  const { hospitals, selectedId, select, clearSelection, selectedHospital, fetchHospitals } =
    useHospitalList();

  /* ── 현재위치 버튼 → 선택 해제 + GPS 재요청 + 강제 센터링 ── */
  const [centerKey, setCenterKey] = useState(0);
  const goToMyLocation = useCallback(() => {
    clearSelection();
    refresh();
    setCenterKey((k) => k + 1);
  }, [clearSelection, refresh]);

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

  /* ── 병원 핀 배열 (TmapMap 전달용) ── */
  const hospitalPins = useMemo(
    () => hospitals.map((h) => ({ id: h.hospitalId, lat: h.lat, lng: h.lng })),
    [hospitals],
  );

  /* ── 초기 화면: 레이더 + 병원추천 버튼 ── */
  if (hospitals.length === 0) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center bg-[var(--bg)]">
        <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
          {/* 레이더 펄스 링 */}
          <span className="absolute rounded-full border border-[var(--primary)] opacity-20" style={{ width: 280, height: 280, animation: "radar-pulse 2.4s ease-out infinite" }} />
          <span className="absolute rounded-full border border-[var(--primary)] opacity-20" style={{ width: 280, height: 280, animation: "radar-pulse 2.4s ease-out infinite 0.8s" }} />
          <span className="absolute rounded-full border border-[var(--primary)] opacity-20" style={{ width: 280, height: 280, animation: "radar-pulse 2.4s ease-out infinite 1.6s" }} />

          {/* 레이더 배경 원 */}
          <span
            className="absolute rounded-full"
            style={{
              width: 240,
              height: 240,
              background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.08) 60%, transparent 100%)",
            }}
          />

          {/* 중앙 마커 아이콘 */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="var(--primary)" style={{ filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.5))", position: "relative", zIndex: 1 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </div>

        {/* 병원 추천 버튼 */}
        <button
          type="button"
          onClick={() => fetchHospitals({
            latitude: coords?.lat ?? 37.5665,
            longitude: coords?.lng ?? 126.978,
          })}
          className="mt-8 h-12 px-8 rounded-xl font-bold text-base text-white active:scale-[0.97] transition shadow-lg"
          style={{ backgroundColor: "var(--primary)" }}
        >
          응급의료센터 추천
        </button>

        {/* 레이더 애니메이션 키프레임 */}
        <style>{`
          @keyframes radar-pulse {
            0% { transform: scale(0.3); opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
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
          <TmapMap heightPx={700} center={mapCenter} centerKey={centerKey} myLocation={coords ?? undefined} hospitals={hospitalPins} selectedHospitalId={selectedId} onGoToMyLocation={goToMyLocation} />
        </div>
      </div>
    </div>
  );
}
