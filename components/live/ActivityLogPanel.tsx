// components/live/ActivityLogPanel.tsx
"use client";

import { useActivityLog } from "@/hooks/useActivityLog";
import type { ActivityLogItem, LogTag } from "@/types/log";

/**
 * LogTag -> Badge UI 매핑
 * - 색상/테두리 값 하드코딩 금지: styles/components.css의 aegis-tag 계열 사용
 * - 프로젝트 LogTag: INFO | CREW | GPS | KTAS_CHANGE
 */
function TagBadge({ tag }: { tag: LogTag }) {
  const base = "aegis-tag";

  switch (tag) {
    case "INFO":
      return <span className={`${base} aegis-tag--info`}>INFO</span>;
    case "CREW":
      return <span className={`${base} aegis-tag--crew`}>CREW</span>;
    case "GPS":
      return <span className={`${base} aegis-tag--gps`}>GPS</span>;
    case "KTAS_CHANGE":
      return <span className={`${base} aegis-tag--ktas-change`}>KTAS CHANGE</span>;
  }
}

function LogRow({ item }: { item: ActivityLogItem }) {
  const time = new Date(item.at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex gap-2 md:gap-3 py-2 md:py-3 border-b border-[var(--border)] last:border-b-0">
      {/* 시간: 보조 텍스트 톤 */}
      <div className="w-16 md:w-20 text-xs md:text-sm text-[var(--text-muted)] shrink-0">{time}</div>

      {/* 태그 */}
      <div className="w-20 md:w-28 shrink-0">
        <TagBadge tag={item.tag} />
      </div>

      {/* 메시지: 본문 톤 */}
      <div className="flex-1 text-sm md:text-xl text-[var(--text)]">{item.message}</div>
    </div>
  );
}

export function ActivityLogPanel() {
  const { data, loading, error } = useActivityLog();

  return (
    /**
     * 패널 외곽:
     * - aegis-surface-strong: 공통 카드 스타일
     * - flex flex-col min-h-0: 헤더 고정 + 본문 스크롤 분리의 핵심
     */
    <section className="aegis-surface-strong h-full min-h-0 overflow-hidden flex flex-col">
      {/* ✅ 상단 헤더 */}
      <div className="h-10 md:h-14 px-3 md:px-4 flex items-center border-b border-[var(--border)] shrink-0" style={{ backgroundColor: "var(--panel-header-bg)" }}>
        <div className="text-sm md:text-xl font-semibold" style={{ color: "var(--panel-header-fg)" }}>로그</div>
      </div>

      {/* ✅ 본문: 리스트만 스크롤 */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
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
            <LogRow key={it.id} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
