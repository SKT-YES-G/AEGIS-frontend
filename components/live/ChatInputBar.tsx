// components/live/ChatInputBar.tsx
"use client";

import { useState } from "react";
import { SttToggleWithConfirm } from "@/components/live/SttToggleWithConfirm";

type Props = {
  rightAddon?: React.ReactNode;
  onSubmit?: (text: string) => void;
  loading?: boolean;
};

export function ChatInputBar({ rightAddon, onSubmit, loading }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit?.(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="chatbar">
      <SttToggleWithConfirm />

      <div className="relative flex-1 min-w-0">
        <input
          className="chatbar-input w-full pr-11 md:pr-12"
          placeholder="환자 정보 수동입력"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center bg-[var(--primary)] text-white active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="전송"
          title="전송"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      {rightAddon ? <div className="shrink-0">{rightAddon}</div> : null}
    </section>
  );
}
