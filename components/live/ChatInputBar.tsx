"use client";

import "@/styles/components.css";

export function ChatInputBar() {
  return (
    <section className="chatbar">
      <input
        className="chatbar-input flex-1"
        placeholder="text 입력창"
      />

      {/* RightActions를 여기서 붙인다면 */}
      {/* <div className="chatbar-actions"><RightActions ... /></div> */}
    </section>
  );
}
