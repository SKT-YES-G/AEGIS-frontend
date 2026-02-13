// app/emergency-center-search/page.tsx
"use client";

import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { TmapMap } from "@/components/live/TmapMap";


export default function EmergencyCenterSearchPage() {
  const loc = useCurrentLocation({
  autoFetch: false,
  enableHighAccuracy: false,
  timeoutMs: 15000,
  maximumAgeMs: 60000,
});


  return (
    <div className="flex flex-col h-full w-full gap-4">


        <button
          type="button"
          onClick={() => loc.refresh()}
          className="h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)]"
        >
          {loc.isLoading ? "위치 확인중…" : "현재 위치 가져오기"}
        </button>

      {/* 지도 영역 */}
      <div className="flex-1 rounded-2xl border border-[var(--border)] overflow-hidden">
        <TmapMap
          center={
            loc.coords
              ? { lat: loc.coords.lat, lng: loc.coords.lng }
              : null
          }
        />
      </div>

      {/* 좌표 표시 (디버그용) */}
      <div className="text-xs text-[var(--muted)]">
        {loc.coords
          ? `${loc.coords.lat.toFixed(6)}, ${loc.coords.lng.toFixed(6)}`
          : loc.error ?? "위치를 가져오면 지도가 해당 위치로 이동합니다."}
      </div>
    </div>
  );
}
