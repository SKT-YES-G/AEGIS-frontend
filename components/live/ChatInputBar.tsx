// components/live/ChatInputBar.tsx
"use client";

import { SttToggleWithConfirm } from "@/components/live/SttToggleWithConfirm";

// ✅ 추가: 입력 패널 우측에 붙일 요소(예: 의료 번역기 버튼)
type Props = {
  rightAddon?: React.ReactNode;
};

export function ChatInputBar({ rightAddon }: Props) {
  return (
    <section className="chatbar">
      <SttToggleWithConfirm />

      <input className="chatbar-input" placeholder="환자 정보 수동입력" />

      {/* 전송 버튼 */}
      <button
        type="button"
        className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center bg-[var(--primary)] text-white active:scale-95 transition"
        aria-label="전송"
        title="전송"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>

      {/* ✅ 추가: 패널 안 오른쪽 끝 슬롯 */}
      {rightAddon ? <div className="shrink-0">{rightAddon}</div> : null}
    </section>
  );
}
