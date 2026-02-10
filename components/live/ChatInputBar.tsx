// components/live/ChatInputBar.tsx
"use client";

import { SttToggleWithConfirm } from "@/components/live/SttToggleWithConfirm";

export function ChatInputBar() {
  return (
    <section className="chatbar">
      <SttToggleWithConfirm />
      <input className="chatbar-input" placeholder="text 입력창" />
    </section>
  );
}
