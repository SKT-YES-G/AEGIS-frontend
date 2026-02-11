// app/live/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FollowUpQuestionsPanel } from "@/components/live/FollowUpQuestionsPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { ChatInputBar } from "@/components/live/ChatInputBar";
import { RightActions } from "@/components/live/RightActions";
import MedicalTranslatorPanel from "@/components/live/MedicalTranslatorPanel";
import { SideMenuItem } from "@/components/live/SideMenuItem";

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

  // ✅ (1번 방식) 파일 생성 없이, 이 파일 안에서만 쓰는 로컬 토글 컴포넌트
function DarkModeToggleInline({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  // ✅ thumb 이동량: track(48px) - thumb(20px) - 좌우 여백(4px*2) = 20px
  // h-7(28px), w-12(48px), thumb h-5/w-5(20px), padding 4px 기준
  const THUMB_ON_X = 24; // px (오른쪽 위치)
  const THUMB_OFF_X = 4; // px (왼쪽 위치)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="다크모드 토글"
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full",
        "transition-colors",
        checked ? "bg-[var(--primary)]" : "bg-[var(--surface-muted)]",
      ].join(" ")}
    >
      <span
        className="absolute top-1 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{
          transform: `translateX(${checked ? THUMB_ON_X : THUMB_OFF_X}px)`,
        }}
      />
    </button>
  );
}


  // ✅ 다크모드 상태(지금은 UI만). 실제 테마 적용은 추후 Context/localStorage로 연결
  const [isDarkMode, setIsDarkMode] = useState(true);

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
          <div className="text-xl font-bold text-[var(--text-strong)]">메뉴</div>
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
  <SideMenuItem
    label="응급실 찾기"
    ariaLabel="open-emergency-center-search"
    onClick={() => {
      onClose();
      onOpenHospital();
    }}
  />

  <SideMenuItem
    label="구급일지"
    ariaLabel="open-triage-report"
    onClick={() => {
      onClose();
      onOpenReport();
    }}
  />
{/* (빈 슬롯 제거됨) */}
<div className="flex-1" />

{/* ✅ 다크모드: 버튼 → 토글 행 */}
<div className="flex items-center justify-between px-1">
  <span className="text-xl font-semibold text-[var(--text-strong)]">
    다크모드
  </span>

  <DarkModeToggleInline checked={isDarkMode} onChange={setIsDarkMode} />
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

      <footer className="shrink-0 bg-[var(--bg)] p-3">
  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 items-center">
    <div className="min-w-0">
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
