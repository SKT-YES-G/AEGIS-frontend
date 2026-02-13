// app/emergency-center/page.tsx
"use client";

import TmapMap from "@/components/live/TmapMap";

export default function EmergencyCenterSearchPage() {
  return (
    <div className="p-4">
      <div className="mb-3 text-sm text-[var(--text-muted)]">
        주변 응급의료센터 검색(지도)
      </div>

      <TmapMap heightPx={420} />
    </div>
  );
}