// app/(with-drawer)/live/page.tsx
"use client";

import { useState } from "react";

import { FollowUpQuestionsPanel } from "@/components/live/FollowUpQuestionsPanel";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { ChatInputBar } from "@/components/live/ChatInputBar";
import { RightActions } from "@/components/live/RightActions";
import MedicalTranslatorPanel from "@/components/live/MedicalTranslatorPanel";

export default function LivePage() {
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  return (
    // ✅ layout이 이미 전체 배경/색/헤더/사이드바를 제공함
    // ✅ 이 페이지는 "본문 + footer"만 담당
    <div className="h-full flex flex-col min-h-0">
      {/* 본문 */}
      <main className="flex-1 min-h-0 overflow-hidden px-4 pt-4 pb-2">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
          {/* LEFT: Assessment 위 + 추가질문 아래 */}
          <div className="min-h-0 h-full flex flex-col gap-3">
            {/* 응급도 패널 (위) */}
            <div className="min-h-0">
              <AssessmentPanel />
            </div>

            {/* 추가질문 리스트 (아래, 남은 공간) */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <FollowUpQuestionsPanel />
            </div>
          </div>

          {/* RIGHT */}
          <div className="min-h-0 h-full flex flex-col gap-3">
            {/* 번역기 슬롯 */}
            <div
              className={[
                "transition-all duration-300 ease-in-out",
                isTranslatorOpen
                  ? "max-h-[260px] opacity-100"
                  : "max-h-0 opacity-0",
                "overflow-hidden",
                isTranslatorOpen ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
            >
              <MedicalTranslatorPanel
                onClose={() => setIsTranslatorOpen(false)}
              />
            </div>

            {/* 로그: 남은 공간 */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ActivityLogPanel />
            </div>
          </div>
        </div>
      </main>

      {/* footer (LIVE 전용) */}
      <footer className="shrink-0 bg-[var(--bg)] p-3">
        <div className="flex justify-center">
          {/* ✅ 중앙 폭 컨테이너: 현장 태블릿 기준 적당한 최대폭 */}
          <div className="w-full max-w-[920px] flex items-center gap-3">
            {/* 입력창은 중앙 컨테이너의 남는 폭 사용 */}
            <div className="flex-1 min-w-0">
              <ChatInputBar
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setIsTranslatorOpen((v) => !v)}
                    className={[
                      "h-10 px-4 rounded-xl",
                      "border border-[var(--border)]",
                      "bg-[var(--surface)] text-[var(--text-strong)]",
                      "font-semibold",
                      "active:scale-[0.99] transition",
                    ].join(" ")}
                    aria-label="toggle-medical-translator"
                    title="의료 번역기"
                  >
                    의료 번역기
                  </button>
                }
              />
            </div>

            {/* ✅ RightActions는 구조 유지용으로 오른쪽에 둠 */}
            <div className="shrink-0">
              <RightActions />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}