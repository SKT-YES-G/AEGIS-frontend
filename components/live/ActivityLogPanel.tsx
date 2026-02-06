// components/live/ActivityLogPanel.tsx
"use client";

import { useActivityLog } from "@/hooks/useActivityLog";
import type { ActivityLogItem, LogTag } from "@/types/log";

function tagBadge(tag: LogTag) {
  // ✅ 배지 스타일은 그대로 유지 (나중에 통일 가능)
  const base = "text-[10px] px-2 py-0.5 rounded-full border";
  switch (tag) {
    case "INFO":
      return <span className={`${base} border-slate-300 text-slate-700`}>INFO</span>;
    case "CREW":
      return <span className={`${base} border-indigo-300 text-indigo-700`}>CREW</span>;
    case "GPS":
      return <span className={`${base} border-emerald-300 text-emerald-700`}>GPS</span>;
    case "KTAS_CHANGE":
      return <span className={`${base} border-rose-300 text-rose-700`}>KTAS CHANGE</span>;
  }
}

function LogRow({ item }: { item: ActivityLogItem }) {
  const time = new Date(item.at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      <div className="w-20 text-xs text-slate-500">{time}</div>
      <div className="w-28">{tagBadge(item.tag)}</div>
      <div className="flex-1 text-sm text-slate-800">{item.message}</div>
    </div>
  );
}

export function ActivityLogPanel() {
  const { data, loading, error } = useActivityLog();

  return (
    <section className="h-full bg-white border-4 border-slate-700 rounded-2xl overflow-hidden">
      {/* ✅ 상단: 검색 버튼 */}
      <div className="h-14 px-3 flex items-center justify-end border-b bg-white">
        <button className="h-10 px-4 border-2 border-slate-700 rounded-xl flex items-center gap-2">
          <span>🔍</span>
          <span className="font-semibold">검색</span>
        </button>
      </div>

      {/* ✅ 내용: 로그 */}
      <div className="p-4">
        <div className="text-lg font-semibold mb-3">로그</div>

        {loading && <div className="text-sm text-slate-500">불러오는 중...</div>}
        {error && <div className="text-sm text-rose-600">로그 로드 실패: {error.message}</div>}

        <div className="mt-2">
          {data?.map((it) => (
            <LogRow key={it.id} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
