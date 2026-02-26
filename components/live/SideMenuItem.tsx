// components/live/SideMenuItem.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  leftIcon?: ReactNode; // (선택) 나중에 아이콘 붙이고 싶을 때
  disabled?: boolean;
};

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * SideMenuItem
 * - 사이드 드로어의 "리스트 항목" 버튼 패턴
 * - 좌측: 라벨(및 선택 아이콘), 우측: chevron
 * - 토큰 기반 스타일만 사용
 */
export function SideMenuItem({ label, ariaLabel, onClick, leftIcon, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={[
        "w-full h-14",
        "px-4",
        "border-b border-[var(--sidebar-border)]",
        "flex items-center justify-between gap-3",
        "font-semibold transition",
        disabled
          ? "text-[var(--sidebar-muted)] opacity-40 cursor-not-allowed"
          : "text-[var(--sidebar-fg)] hover:bg-[rgba(255,255,255,0.08)] active:scale-[0.99]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 min-w-0">
        {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
        <span className="truncate">{label}</span>
      </div>

      <span className="shrink-0 text-[var(--sidebar-muted)]">
        <ChevronRightIcon />
      </span>
    </button>
  );
}
