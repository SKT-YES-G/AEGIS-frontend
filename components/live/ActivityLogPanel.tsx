// components/live/ActivityLogPanel.tsx
"use client";

import { useEffect, useRef } from "react";
import { useActivityLog } from "@/hooks/useActivityLog";
import type { EventLogResponse } from "@/types/event-log";

function LogRow({ item }: { item: EventLogResponse }) {
  const time = new Date(item.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const colonIdx = item.description.indexOf(": ");
  const hasDetail = colonIdx !== -1;
  const title = hasDetail ? item.description.slice(0, colonIdx) : item.description;
  const detail = hasDetail ? item.description.slice(colonIdx + 2) : null;

  return (
    <div className="flex gap-2 md:gap-3 py-2 md:py-3 border-b border-[var(--border)] last:border-b-0">
      {/* 시간 */}
      <div className="w-16 md:w-20 text-xs md:text-sm text-[var(--text-muted)] shrink-0">{time}</div>

      {/* 메시지 */}
      <div className="flex-1 min-w-0">
        <div className="text-base md:text-lg font-bold text-[var(--text-strong)]">{title}</div>
        {detail && (
          <div className="text-sm md:text-base font-semibold text-black mt-0.5 break-words">{detail}</div>
        )}
      </div>
    </div>
  );
}

type Props = {
  sessionId: number | null;
};

export function ActivityLogPanel({ sessionId }: Props) {
  const { data, loading, error } = useActivityLog(sessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div ref={scrollRef} className="h-full min-h-0 overflow-auto p-4">
        {loading && (
          <div className="text-xl text-[var(--text-muted)]">불러오는 중...</div>
        )}

        {error && (
          <div className="text-xl text-[var(--danger)]">
            로그 로드 실패: {error.message}
          </div>
        )}

        <div className="mt-2">
          {data?.map((it) => (
            <LogRow key={it.logId} item={it} />
          ))}
        </div>
    </div>
  );
}
