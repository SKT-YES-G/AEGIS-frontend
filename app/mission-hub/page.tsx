// app/mission-hub/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutDrawer } from "@/components/layout/LogoutDrawer";
import "@/styles/components.css";

/* ── Mock 출동 기록 ── */
const MOCK_RECORDS = [
  {
    id: "2026-01301",
    level: 3 as const,
    levelLabel: "응급",
    dispatcher: "김민수",
    date: "2026. 01. 30",
    time: "17:26 ~ 18:43",
    patient: "흉통, 호흡곤란",
  },
  {
    id: "2026-01295",
    level: 5 as const,
    levelLabel: "비응급",
    dispatcher: "박지현",
    date: "2026. 01. 29",
    time: "09:12 ~ 10:05",
    patient: "발목 염좌",
  },
  {
    id: "2026-01288",
    level: 1 as const,
    levelLabel: "즉시응급",
    dispatcher: "이승호",
    date: "2026. 01. 28",
    time: "22:41 ~ 23:58",
    patient: "의식저하, 경련",
  },
];

const LEVEL_COLORS: Record<number, string> = {
  0: "var(--prektas-bg-0)",
  1: "var(--prektas-bg-1)",
  2: "var(--prektas-bg-2)",
  3: "var(--prektas-bg-3)",
  4: "var(--prektas-bg-4)",
  5: "var(--prektas-bg-5)",
};

export default function MenuSelectPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <LogoutDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* ── 상단 헤더 ── */}
      <header
        className="shrink-0 h-14 px-4 flex items-center gap-3 border-b"
        style={{
          backgroundColor: "var(--panel-header-bg)",
          borderColor: "var(--border)",
        }}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="h-10 w-10 rounded-lg flex items-center justify-center transition"
          style={{ color: "var(--panel-header-fg)" }}
          aria-label="메뉴"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <h1
          className="text-base md:text-lg font-bold"
          style={{ color: "var(--panel-header-fg)" }}
        >
          AEGIS 출동 관리
        </h1>
      </header>

      {/* ── 본문 ── */}
      <main className="flex-1 min-h-0 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* 출동 기록 목록 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h2 className="text-sm md:text-base font-bold text-[var(--text-strong)]">
                출동 기록
              </h2>
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-1">
                {MOCK_RECORDS.length}건
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {MOCK_RECORDS.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => router.push("/incident-summary")}
                  className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] active:scale-[0.99] transition-all p-4"
                >
                  {/* 상단: ID + 등급 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[var(--text-strong)]">
                      #{rec.id}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                      style={{ backgroundColor: LEVEL_COLORS[rec.level] }}
                    >
                      LV.{rec.level} {rec.levelLabel}
                    </span>
                  </div>

                  {/* 정보 행 */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">출동자</span>
                      <span className="text-[var(--text-strong)] font-medium">{rec.dispatcher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">환자</span>
                      <span className="text-[var(--text)] font-medium">{rec.patient}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">날짜</span>
                      <span className="text-[var(--text)]">{rec.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">시간</span>
                      <span className="text-[var(--text)]">{rec.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 새 출동 시작 */}
          <button
            type="button"
            onClick={() => router.push("/live")}
            className="w-full h-16 md:h-20 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 transition active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: "var(--prektas-bg-1)", color: "var(--dispatch-btn-fg)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            새 출동 시작
          </button>
        </div>
      </main>
    </div>
  );
}
