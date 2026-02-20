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
            width: 60,
            height: 60,
            border: "none",
            background: "transparent",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
      <main className="flex-1 min-h-0 overflow-auto md:overflow-hidden px-2 md:px-4 pt-3 md:pt-3 pb-2">
        <div className="md:grid md:h-full md:grid-cols-2 md:gap-4 flex flex-col gap-3">
          {/* LEFT: 로그정보 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full">
            <section className="aegis-surface-strong h-full min-h-0 overflow-hidden flex flex-col">
              <div className="h-10 md:h-14 px-3 md:px-4 flex items-center border-b border-[var(--border)] bg-[var(--surface-muted)] shrink-0">
                <div className="text-sm md:text-xl font-semibold text-[var(--text-strong)]">
                  로그 기록
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ActivityLogPanel />
              </div>
            </section>
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
