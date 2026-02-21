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

      <div className="relative flex-1 min-w-0">
        <input className="chatbar-input w-full pr-11 md:pr-12" placeholder="환자 정보 수동입력" />
        <button
          type="button"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center bg-[var(--primary)] text-white active:scale-95 transition"
          aria-label="전송"
          title="전송"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* ✅ 추가: 패널 안 오른쪽 끝 슬롯 */}
      {rightAddon ? <div className="shrink-0">{rightAddon}</div> : null}
    </section>
  );
}
