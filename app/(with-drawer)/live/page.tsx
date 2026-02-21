// app/(with-drawer)/live/page.tsx
"use client";

import { useState } from "react";

import { FollowUpQuestionsPanel } from "@/components/live/FollowUpQuestionsPanel";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { ChatInputBar } from "@/components/live/ChatInputBar";
import { RightActions } from "@/components/live/RightActions";
import MedicalTranslatorPanel from "@/components/live/MedicalTranslatorPanel";

type RightTab = "log" | "translator";

export default function LivePage() {
  const [rightTab, setRightTab] = useState<RightTab>("translator");

  return (
    // ✅ layout이 이미 전체 배경/색/헤더/사이드바를 제공함
    // ✅ 이 페이지는 "본문 + footer"만 담당
    <div className="h-full flex flex-col min-h-0">
      {/* 본문 */}
      <main className="flex-1 min-h-0 overflow-auto md:overflow-hidden px-2 md:px-4 pt-3 md:pt-4 pb-1">
        <div className="md:grid md:h-full md:grid-cols-2 md:gap-4 flex flex-col gap-3">
          {/* LEFT: Assessment + 추가질문 */}
          <div className="min-h-0 md:h-full flex flex-col gap-3">
            <div className="min-h-0 overflow-hidden">
              <AssessmentPanel />
            </div>
            <div className="flex-1 min-h-0 min-h-[180px] overflow-hidden">
              <FollowUpQuestionsPanel />
            </div>
          </div>

          {/* RIGHT: 탭(로그 / 번역기) 전환 패널 */}
          <div className="max-h-[50vh] md:max-h-none min-h-[200px] md:min-h-0 md:h-full flex flex-col overflow-hidden aegis-surface-strong">
            {/* 탭 헤더 */}
            <div className="shrink-0 flex border-b border-[var(--border)]" style={{ backgroundColor: "var(--panel-header-bg)" }}>
              {(["log", "translator"] as const).map((tab) => {
                const active = rightTab === tab;
                const label = tab === "log" ? "로그" : "의료번역기";
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRightTab(tab)}
                    className={[
                      "h-10 md:h-12 px-4 md:px-5 text-sm md:text-base font-semibold transition-colors relative",
                      active ? "opacity-100" : "opacity-50 hover:opacity-75",
                    ].join(" ")}
                    style={{ color: "var(--panel-header-fg)" }}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ backgroundColor: "var(--fg)" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 탭 컨텐츠 */}
            <div className="flex-1 min-h-0 relative">
              <div className={[
                "absolute inset-0 transition-opacity duration-200",
                rightTab === "log" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
              ].join(" ")}>
                <ActivityLogPanel />
              </div>

              <div className={[
                "absolute inset-0 transition-opacity duration-200",
                rightTab === "translator" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
              ].join(" ")}>
                <MedicalTranslatorPanel />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* footer (LIVE 전용) */}
      <footer className="shrink-0 px-2 py-1 md:px-3 md:py-1.5" style={{ backgroundColor: "var(--bg)" }}>
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