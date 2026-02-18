// app/(with-drawer)/live/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { FollowUpQuestionsPanel } from "@/components/live/FollowUpQuestionsPanel";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { ChatInputBar } from "@/components/live/ChatInputBar";
import { RightActions } from "@/components/live/RightActions";
import MedicalTranslatorPanel from "@/components/live/MedicalTranslatorPanel";

export default function LivePage() {
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(true);
  const [headerSlot, setHeaderSlot] = useState<Element | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target discovery on mount
    setHeaderSlot(document.getElementById("header-center-slot"));
  }, []);

  return (
    // ✅ layout이 이미 전체 배경/색/헤더/사이드바를 제공함
    // ✅ 이 페이지는 "본문 + footer"만 담당
    <div className="h-full flex flex-col min-h-0">
      {/* ✅ 헤더 중앙 슬롯에 의료 번역기 버튼 포털 */}
      {headerSlot &&
        createPortal(
          <button
            type="button"
            onClick={() => setIsTranslatorOpen((v) => !v)}
            className={[
              "h-8 px-3 rounded-lg text-sm font-semibold transition",
              isTranslatorOpen
                ? "bg-white/20 text-[var(--header-fg)]"
                : "border border-white/30 text-[var(--header-fg)] hover:bg-white/10",
            ].join(" ")}
            aria-label="toggle-medical-translator"
            title="의료 번역기"
          >
            의료 번역기
          </button>,
          headerSlot,
        )}
      {/* 본문 */}
      <main className="flex-1 min-h-0 overflow-auto md:overflow-hidden px-2 md:px-4 pt-3 md:pt-4 pb-2">
        <div className="md:grid md:h-full md:grid-cols-2 md:gap-4 flex flex-col gap-3">
          {/* LEFT: Assessment + 추가질문 */}
          <div className="min-h-0 md:h-full flex flex-col gap-3">
            <div className="min-h-0">
              <AssessmentPanel />
            </div>
            <div className="flex-1 min-h-0 min-h-[180px] overflow-hidden">
              <FollowUpQuestionsPanel />
            </div>
          </div>

          {/* RIGHT: 번역기 + 로그 */}
          <div className="min-h-[200px] md:min-h-0 md:h-full flex flex-col">
            {/* 번역기 슬롯 (로그 상단) */}
            <div
              className={[
                "transition-all duration-300 ease-in-out overflow-hidden",
                isTranslatorOpen
                  ? "max-h-[220px] mb-3 opacity-100 pointer-events-auto"
                  : "max-h-0 mb-0 opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <MedicalTranslatorPanel
                onClose={() => setIsTranslatorOpen(false)}
              />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ActivityLogPanel />
            </div>
          </div>
        </div>
      </main>

      {/* footer (LIVE 전용) */}
      <footer className="shrink-0 bg-[var(--bg)] p-2 md:p-3">
        <div className="flex justify-center">
          <div className="w-full max-w-[920px] flex items-center gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <ChatInputBar />
            </div>

            <div className="shrink-0">
              <RightActions />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}