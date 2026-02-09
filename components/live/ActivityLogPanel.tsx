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
  // 공통 pill 스타일은 globals 스타일 시스템의 aegis-tag를 사용
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
    <div className="flex gap-3 py-3 border-b border-[var(--border)] last:border-b-0">
      {/* 시간: 보조 텍스트 톤 */}
      <div className="w-20 text-xs text-[var(--text-muted)]">{time}</div>

      {/* 태그 */}
      <div className="w-28">
        <TagBadge tag={item.tag} />
      </div>

      {/* 메시지: 본문 톤 */}
      <div className="flex-1 text-sm text-[var(--text)]">{item.message}</div>
    </div>
  );
}

export function ActivityLogPanel() {
  const { data, loading, error } = useActivityLog();

  return (
    /**
     * 패널 외곽:
     * - aegis-surface-strong: 흰 표면 + 굵은 강조 테두리(전역 공통)
     * - overflow-hidden: 헤더/내용 스크롤에서 모서리 깨짐 방지
     */
    <section className="aegis-surface-strong h-full overflow-hidden">
      {/* 상단: 액션 영역(검색) */}
      <div className="h-14 px-3 flex items-center justify-end border-b border-[var(--border)] bg-[var(--surface-muted)]">
        <button
          type="button"
          className={[
            // 버튼은 “모양”이므로, 색은 토큰 기반으로만 지정
            "h-10 px-4 rounded-xl flex items-center gap-2",
            "border-2 border-[var(--border-strong)]",
            "bg-[var(--surface)] text-[var(--text-strong)]",
          ].join(" ")}
        >
          <span aria-hidden>🔍</span>
          <span className="font-semibold">검색</span>
        </button>
      </div>

      {/* 내용: 로그 리스트 */}
      <div className="p-4">
        <div className="text-lg font-semibold text-[var(--text-strong)] mb-3">로그</div>

        {loading && <div className="text-sm text-[var(--text-muted)]">불러오는 중...</div>}

        {/* 에러: 토큰 기반 danger 사용(다크모드/테마 변경에도 안정) */}
        {error && (
          <div className="text-sm text-[var(--danger)]">
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