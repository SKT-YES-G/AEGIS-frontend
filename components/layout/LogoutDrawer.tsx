// components/layout/LogoutDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LogoutDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

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
          <button
            type="button"
            className="h-9 w-9 rounded-xl hover:bg-[rgba(255,255,255,0.08)] text-[var(--sidebar-fg)]"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 flex flex-col gap-3 min-h-0 flex-1">
          <div className="flex-1" />

          {/* 하단: 다크모드 토글 + 로그아웃 */}
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label="logout"
              className="h-10 px-5 rounded-lg active:scale-[0.99] transition font-bold text-sm border border-[var(--sidebar-border)] text-[var(--sidebar-fg)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmOpen}
        title="로그아웃 하시겠습니까?"
        confirmText="예"
        cancelText="아니요"
        onConfirm={() => {
          setConfirmOpen(false);
          onClose();
          router.push("/");
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
