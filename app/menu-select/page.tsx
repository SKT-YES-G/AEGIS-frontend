// app/menu-select/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutDrawer } from "@/components/layout/LogoutDrawer";
import "@/styles/components.css";

export default function MenuSelectPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-10 relative"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <LogoutDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* 햄버거 메뉴 버튼 */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        className="absolute top-4 left-4 h-10 w-10 rounded-lg flex items-center justify-center text-xl hover:bg-[var(--surface-muted)] transition"
        style={{ color: "var(--foreground)" }}
        aria-label="메뉴"
      >
        ☰
      </button>

      {/* 출동일지(큰 영역) */}
      <div
        className="aegis-surface w-[60%] h-[60vh] flex flex-col"
        style={{ borderRadius: "1.25rem" }}
      >
        <div className="text-2xl font-semibold aegis-text-strong px-6 pt-5 pb-3">
          출동일지
        </div>

        {/* 출동 기록 리스트 */}
        <div className="flex-1 min-h-0 overflow-auto px-4 pb-4">
          {/* 예시 출동 기록 카드 */}
          <button
            type="button"
            onClick={() => router.push("/incident-summary")}
            className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-muted)] active:scale-[0.99] transition-all p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold aegis-text-strong">
                보고서 #2024-05301
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "var(--prektas-bg-3)" }}
              >
                LV.3 응급
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="aegis-text-muted w-16 shrink-0">출동자</span>
                <span className="aegis-text-strong font-medium">김민수</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="aegis-text-muted w-16 shrink-0">날짜</span>
                <span className="aegis-text-strong">2024. 05. 30</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="aegis-text-muted w-16 shrink-0">시간</span>
                <span className="aegis-text-strong">17:26 ~ 18:43</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 새 출동 시작 버튼 */}
      <button
        type="button"
        onClick={() => router.push("/live")}
        className="aegis-btn aegis-btn--danger"
        style={{ minWidth: 180 }}
      >
        새 출동 시작
      </button>
    </div>
  );
}
