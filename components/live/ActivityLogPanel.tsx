// components/live/ActivityLogPanel.tsx
"use client";

import { useActivityLog } from "@/hooks/useActivityLog";
import type { ActivityLogItem, LogTag } from "@/types/log";

function tagBadge(tag: LogTag) {
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
    <section className="h-full bg-white border-r">
      <div className="h-12 px-4 flex items-center justify-between border-b">
        <div className="font-semibold">활동 로그 (Activity Log)</div>
        <div className="text-xs text-rose-600 font-semibold">REC</div>
      </div>

      <div className="p-4 space-y-2">
        {loading && <div className="text-sm text-slate-500">불러오는 중...</div>}
        {error && <div className="text-sm text-rose-600">로그 로드 실패: {error.message}</div>}
        {data?.map((it) => (
          <LogRow key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
