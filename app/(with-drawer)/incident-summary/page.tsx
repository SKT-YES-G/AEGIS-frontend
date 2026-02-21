// app/(with-drawer)/incident-summary/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { PatientSummaryPanel } from "@/components/incident/PatientSummaryPanel";

export default function IncidentSummaryPage() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* ── 뒤로가기 ── */}
      <div className="shrink-0 px-2 md:px-4 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          title="뒤로가기"
          style={{
            width: 44,
            height: 44,
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

      {/* ── 본문: 2열 그리드 ── */}
      <main className="flex-1 min-h-0 overflow-auto md:overflow-hidden p-2 md:p-3">
        <div className="md:grid md:h-full md:grid-cols-2 md:gap-3 flex flex-col gap-3">
          {/* LEFT: 타임라인 로그 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full">
            <section className="aegis-surface-strong h-full min-h-0 overflow-hidden flex flex-col rounded-xl">
              <div
                className="h-10 md:h-12 px-4 flex items-center gap-2 border-b shrink-0"
                style={{ borderColor: "var(--border)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-xs md:text-sm font-bold text-[var(--text-strong)]">
                  활동 로그
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ActivityLogPanel />
              </div>
            </section>
          </div>

          {/* RIGHT: 환자 요약 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full">
            <PatientSummaryPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
