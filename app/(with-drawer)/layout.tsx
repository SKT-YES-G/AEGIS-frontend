// app/(with-drawer)/layout.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { SideMenuItem } from "@/components/live/SideMenuItem";

export default function WithDrawerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ 경로별 헤더 타이틀(필요하면 계속 확장)
  const title = useMemo(() => {
    if (pathname.startsWith("/live")) return "LIVE";
    if (pathname.startsWith("/emergency-center-search")) return "응급실 찾기";
    if (pathname.startsWith("/triage-report")) return "구급일지";
    return "구급일지";
  }, [pathname]);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      {/* ✅ Drawer는 layout 루트에서 렌더(페이지마다 중복 X) */}
      <SideDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(href) => {
          setIsMenuOpen(false);
          router.push(href);
        }}
      />

      {/* ✅ 공통 헤더 */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
        <AppHeader title={title} onOpenMenu={() => setIsMenuOpen(true)} />
      </div>

      {/* ✅ 각 페이지 본문 */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function SideDrawer({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  // ✅ 열릴 때 배경 스크롤 방지
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
          zIndex: 9998,
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
          width: 360,
          maxWidth: "85vw",
          height: "100vh",
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

        {/* 본문 */}
        <div className="p-4 flex flex-col gap-3 min-h-0 flex-1">
          {/* ✅ 1번째: 중증도 분류(/live) */}
          <SideMenuItem
            label="중증도 분류"
            ariaLabel="go-live-triage"
            onClick={() => onNavigate("/live")}
          />

          <SideMenuItem
            label="응급실 찾기"
            ariaLabel="open-emergency-center-search"
            onClick={() => onNavigate("/emergency-center-search")}
          />

          <SideMenuItem
            label="구급일지"
            ariaLabel="open-triage-report"
            onClick={() => onNavigate("/triage-report")}
          />

          <div className="flex-1" />
          {/* 다크모드 토글은 추후 여기로 올리면 됨 */}
        </div>
      </aside>
    </>
  );
}