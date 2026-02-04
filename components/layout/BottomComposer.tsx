// components/layout/BottomComposer.tsx
"use client";

export function BottomComposer() {
  return (
    <div className="h-16 border-t bg-white flex items-center gap-3 px-4">
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 rounded-full border text-sm">STT OFF</button>
        <button className="px-4 py-2 rounded-full border text-sm">의료 통역</button>
        <button className="px-4 py-2 rounded-full border text-sm">일지 작성</button>
      </div>

      <div className="flex-1 flex items-center gap-2">
        <input
          placeholder="환자 상태, 증상, 처치 내역 입력..."
          className="h-11 w-full border rounded-xl px-4"
        />
        <button className="h-11 w-11 rounded-full bg-slate-900 text-white">↗</button>
      </div>
    </div>
  );
}
