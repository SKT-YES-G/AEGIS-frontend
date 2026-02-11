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

      <input className="chatbar-input" placeholder="text 입력창" />

      {/* ✅ 추가: 패널 안 오른쪽 끝 슬롯 */}
      {rightAddon ? <div className="shrink-0">{rightAddon}</div> : null}
    </section>
  );
}
