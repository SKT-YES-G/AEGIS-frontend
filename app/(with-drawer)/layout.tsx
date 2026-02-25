// app/(with-drawer)/layout.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SideMenuItem } from "@/components/live/SideMenuItem";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";
import { sessionService } from "@/services/session.service";


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
    if (pathname.startsWith("/live")) return "중증도 분류";
    if (pathname.startsWith("/emergency-center-search")) return "응급의료센터 찾기";
    if (pathname.startsWith("/incident-summary")) return "출동요약";
    if (pathname.startsWith("/triage-report")) return "구급일지";
    return "구급일지";
  }, [pathname]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      {/* ✅ Drawer는 layout 루트에서 렌더(페이지마다 중복 X) */}
      <SideDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(href) => {
          setIsMenuOpen(false);
          // sessionId를 유지하며 페이지 이동 (mission-hub는 목록 페이지이므로 제외)
          const noSessionPages = ["/mission-hub", "/"];
          const sid = sessionStorage.getItem("aegis_active_sessionId");
          const url = sid && !href.includes("sessionId") && !noSessionPages.includes(href)
            ? `${href}${href.includes("?") ? "&" : "?"}sessionId=${sid}`
            : href;
          router.push(url);
        }}
      />

      {/* ✅ 공통 헤더 */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)]" style={{ background: "var(--header-bg)" }}>
        <AppHeader title={title} onOpenMenu={() => setIsMenuOpen(true)} />
      </div>

      {/* ✅ 각 페이지 본문 */}
      <div className="flex flex-col flex-1 min-h-0 overflow-auto">{children}</div>
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
  const [confirmType, setConfirmType] = useState<"end" | "logout" | null>(null);

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
        className="border-r flex flex-col"
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
          background: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="사이드 메뉴"
      >
        {/* 상단 바 */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
          <div className="text-xl font-bold text-[var(--sidebar-fg)]">메뉴</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmType("end")}
              aria-label="end-dispatch"
              className="h-8 px-3 rounded-lg active:scale-[0.99] transition font-bold text-xs border border-[var(--sidebar-border)] text-[var(--sidebar-fg)]"
            >
              출동 종료
            </button>
            <button
              type="button"
              className="h-9 w-9 rounded-xl hover:bg-[rgba(255,255,255,0.08)] text-[var(--sidebar-fg)]"
              onClick={onClose}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
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
            label="응급의료센터 찾기"
            ariaLabel="open-emergency-center-search"
            onClick={() => onNavigate("/emergency-center-search")}
          />

          <SideMenuItem
            label="구급일지"
            ariaLabel="open-triage-report"
            onClick={() => onNavigate("/triage-report")}
          />

          <SideMenuItem
            label="출동요약"
            ariaLabel="open-incident-summary"
            onClick={() => onNavigate("/incident-summary")}
          />

          <div className="flex-1" />

          {/* 하단: 테마 토글 + 로그아웃 */}
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setConfirmType("logout")}
              aria-label="logout"
              className="h-10 px-5 rounded-lg active:scale-[0.99] transition font-bold text-sm border border-[var(--sidebar-border)] text-[var(--sidebar-fg)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmType === "end"}
        title="출동을 종료하시겠습니까?"
        confirmText="예"
        cancelText="아니요"
        onConfirm={async () => {
          setConfirmType(null);
          // 현재 URL에서 sessionId를 읽어야 정확한 세션을 종료
          const params = new URLSearchParams(window.location.search);
          const sid = params.get("sessionId");
          if (sid) {
            try {
              const session = await sessionService.getById(Number(sid));
              if (session.status === "ACTIVE") {
                await sessionService.complete(Number(sid));
              }
            } catch {
              // 이미 완료되었거나 조회 실패 시 무시
            }
          }
          onNavigate("/mission-hub");
        }}
        onCancel={() => setConfirmType(null)}
      />
      <ConfirmDialog
        open={confirmType === "logout"}
        title="로그아웃 하시겠습니까?"
        confirmText="예"
        cancelText="아니요"
        onConfirm={() => { setConfirmType(null); onNavigate("/"); }}
        onCancel={() => setConfirmType(null)}
      />
    </>
  );
}