// components/live/ActivityLogPanel.tsx
"use client";

import { useEffect, useRef } from "react";
import { useActivityLog } from "@/hooks/useActivityLog";
import type { EventLogResponse, EventType } from "@/types/event-log";

/**
 * EventType -> Badge UI 매핑
 */
function TagBadge({ tag }: { tag: EventType }) {
  const base = "aegis-tag";

  switch (tag) {
    case "SESSION_START":
    case "SESSION_END":
      return <span className={`${base} aegis-tag--info`}>{tag === "SESSION_START" ? "START" : "END"}</span>;
    case "AI_KTAS_CHANGE":
    case "PARAMEDIC_KTAS_CHANGE":
      return <span className={`${base} aegis-tag--ktas-change`}>KTAS</span>;
    case "SYNC_TOGGLE":
      return <span className={`${base} aegis-tag--crew`}>SYNC</span>;
    case "KEYWORD_DETECTED":
      return <span className={`${base} aegis-tag--gps`}>KEYWORD</span>;
    default:
      return <span className={`${base} aegis-tag--info`}>{tag}</span>;
  }
}

function LogRow({ item }: { item: EventLogResponse }) {
  const time = new Date(item.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex gap-2 md:gap-3 py-2 md:py-3 border-b border-[var(--border)] last:border-b-0">
      {/* 시간 */}
      <div className="w-16 md:w-20 text-xs md:text-sm text-[var(--text-muted)] shrink-0">{time}</div>

      {/* 태그 */}
      <div className="w-20 md:w-28 shrink-0">
        <TagBadge tag={item.eventType} />
      </div>

      {/* 메시지 */}
      <div className="flex-1 text-sm md:text-xl text-[var(--text)]">{item.description}</div>
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
