// components/live/ChatInputBar.tsx
"use client";

export function ChatInputBar() {
  return (
    <section className="bg-white border-4 border-slate-700 rounded-2xl h-20 flex items-center px-4 gap-3">
      {/* ✅ 입력창 */}
      <input
        className="flex-1 h-12 border-2 border-slate-300 rounded-xl px-4"
        placeholder="text 입력창"
      />

      {/* ✅ 번역기 원형 버튼 */}
      <button
        type="button"
        className="h-14 w-14 rounded-full bg-emerald-300 border-2 border-slate-700 font-bold"
        // TODO: 번역 모달/오버레이 연결 예정
      >
        번역기
      </button>

      {/* ✅ 전송 버튼(원형) */}
      <button
        type="button"
        className="h-14 w-14 rounded-full bg-white border-2 border-slate-700 text-2xl"
        // TODO: 메시지 전송 로직 연결 예정
      >
        ➜
      </button>
    </section>
  );
}
