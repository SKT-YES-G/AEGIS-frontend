// components/live/ChatPanel.tsx
"use client";

export function ChatPanel() {
  return (
    <section className="h-full bg-white border-4 border-slate-700 rounded-2xl overflow-hidden relative">
      {/* ✅ 우상단 검색 버튼 */}
      <div className="absolute top-3 right-3">
        <button className="h-10 px-4 border-2 border-slate-700 rounded-xl flex items-center gap-2 bg-white">
          <span>🔍</span>
          <span className="font-semibold">검색</span>
        </button>
      </div>

      {/* ✅ 중앙 텍스트 */}
      <div className="h-full flex items-center justify-center text-xl font-semibold text-slate-700">
        대화창
      </div>
    </section>
  );
}
