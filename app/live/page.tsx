// app/live/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// app/live/page.tsx 상단 import 추가
import { FollowUpQuestionsPanel } from "@/components/live/FollowUpQuestionsPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { ChatInputBar } from "@/components/live/ChatInputBar";
import { RightActions } from "@/components/live/RightActions";
import MedicalTranslatorPanel from "@/components/live/MedicalTranslatorPanel";

/**
 * SideDrawer
 * - AppHeader 내부가 아니라, 페이지 루트에서 렌더해서
 *   sticky/overflow 컨텍스트 영향을 받지 않게 한다.
 * - Tailwind 임의값 클래스 의존을 줄이고, transform/width는 style로 강제한다.
 */
function SideDrawer({
  open,
  onClose,
  onOpenHospital,
  onOpenReport,
}: {
  open: boolean;
  onClose: () => void;
  onOpenHospital: () => void;
  onOpenReport: () => void;
}) {
  // ✅ 열릴 때 배경 스크롤 방지 (현장 사용 시 실수 스크롤 방지)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9998, // ✅ 최상위 바로 아래
    background: "rgba(0,0,0,0.45)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
  }}
  onClick={onClose}
  aria-hidden
/>


      {/* Drawer Panel */}
      <aside
  className="border-r border-[var(--border)] bg-[var(--surface)] flex flex-col"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,

    width: 360,            // 필요하면 320 유지
    maxWidth: "85vw",

    height: "100vh",       // ✅ 핵심: 화면 아래까지
    // (선택) 모바일 브라우저 주소창 대응이 필요하면:
    // height: "100dvh",

    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 200ms ease-out",
  }}
  role="dialog"
  aria-modal="true"
  aria-label="사이드 메뉴"
>



        {/* 상단 바 */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border)]">
          <div className="text-sm font-bold text-[var(--text-strong)]">메뉴</div>
          <button
            type="button"
            className="h-9 w-9 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-strong)]"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문: 두번째 사진 구성 */}
        <div className="p-4 flex flex-col gap-3 min-h-0 flex-1">
          <button
            type="button"
            className={[
              "w-full h-14 rounded-xl",
              "border border-[var(--border)]",
              "bg-[var(--surface-muted)] text-[var(--text-strong)]",
              "font-semibold",
              "active:scale-[0.99] transition",
            ].join(" ")}
            onClick={() => {
              onClose();
              onOpenHospital();
            }}
          >
            응급실 찾기
          </button>

          <button
            type="button"
            className={[
              "w-full h-14 rounded-xl",
              "border border-[var(--border)]",
              "bg-[var(--surface-muted)] text-[var(--text-strong)]",
              "font-semibold",
              "active:scale-[0.99] transition",
            ].join(" ")}
            onClick={() => {
              onClose();
              onOpenReport();
            }}
          >
            구급일지
          </button>

          {/* 큰 빈 영역(추후 메뉴 확장 슬롯) */}
          <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)]" />

          {/* 우하단 다크모드 버튼(현재는 모양만) */}
          <div className="flex justify-end">
            <button
              type="button"
              className={[
                "h-12 px-5 rounded-xl",
                "border border-[var(--border)]",
                "bg-[var(--surface-muted)] text-[var(--text-strong)]",
                "text-sm font-semibold",
                "active:scale-[0.99] transition",
              ].join(" ")}
              onClick={() => alert("다크모드 기능은 추후 연결")}
            >
              다크모드
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function LivePage() {
  const router = useRouter();

  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      {/* ✅ Drawer는 여기(페이지 루트)에서 렌더 */}
      <SideDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenHospital={() => router.push("/emergency-center-search")}
        onOpenReport={() => router.push("/triage-report")}
      />

      {/* ✅ 헤더는 sticky 유지 가능. Drawer는 헤더 밖이라 영향 없음 */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
        <AppHeader title="LIVE" onOpenMenu={() => setIsMenuOpen(true)} />
      </div>

      {/* 본문 */}
      <main className="flex-1 min-h-0 overflow-hidden p-4">
        <div className="grid h-full grid-rows-[1fr] grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          {/* LEFT: Assessment 위 + 추가질문 아래 */}
          <div className="min-h-0 h-full flex flex-col gap-3">
            {/* 응급도 패널 (위) */}
            <div className="max-h-[340px] overflow-hidden">
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
                isTranslatorOpen ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0",
                "overflow-hidden",
                isTranslatorOpen ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
            >
              <MedicalTranslatorPanel onClose={() => setIsTranslatorOpen(false)} />
            </div>

            {/* 로그: 남은 공간 */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ActivityLogPanel />
            </div>
          </div>
        </div>
      </main>

      {/* 하단 고정 */}
      <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ChatInputBar />
          </div>

          <RightActions
            isTranslatorOpen={isTranslatorOpen}
            onToggleTranslator={() => setIsTranslatorOpen((v) => !v)}
            onOpenHospital={() => router.push("/emergency-center-search")}
            onOpenReport={() => router.push("/triage-report")}
          />
        </div>
      </footer>
    </div>
  );
}
