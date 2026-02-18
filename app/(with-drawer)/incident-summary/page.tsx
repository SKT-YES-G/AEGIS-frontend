// app/(with-drawer)/incident-summary/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { PatientSummaryPanel } from "@/components/incident/PatientSummaryPanel";

export default function IncidentSummaryPage() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="shrink-0 px-2 md:px-4 pt-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          title="뒤로가기"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "color-mix(in oklab, var(--card) 85%, transparent)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          ←
        </button>
      </div>
      <main className="flex-1 min-h-0 overflow-auto md:overflow-hidden px-2 md:px-4 pt-3 md:pt-3 pb-2">
        <div className="md:grid md:h-full md:grid-cols-2 md:gap-4 flex flex-col gap-3">
          {/* LEFT: 로그정보 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full">
            <ActivityLogPanel />
          </div>

          {/* RIGHT: 환자증상 + 활력징후 요약 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full">
            <PatientSummaryPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
