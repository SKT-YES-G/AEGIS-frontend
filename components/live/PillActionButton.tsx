"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  className?: string; // 필요 시만(상황별 미세조정)
};

/**
 * PillActionButton
 * - 둥근 타원 형태의 보조 액션 버튼(아이콘+텍스트)
 * - 스타일은 styles/components.css의 .aegis-pill-btn로 고정
 */
export function PillActionButton({
  label,
  icon,
  onClick,
  ariaLabel,
  title,
  className,
}: Props) {
  return (
    <button
      type="button"
      className={["aegis-pill-btn", className ?? ""].join(" ").trim()}
      aria-label={ariaLabel ?? label}
      title={title ?? label}
      onClick={onClick}
    >
      {icon ? <span aria-hidden className="inline-flex">{icon}</span> : null}
      <span>{label}</span>
    </button>
  );
}
