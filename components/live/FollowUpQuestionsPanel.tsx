// components/live/FollowUpQuestionsPanel.tsx
"use client";

type FollowUpItem = {
  id: string;
  title: string;
  hint?: string;
  done?: boolean;
};

const MOCK: FollowUpItem[] = [
  { id: "q1", title: "의식 상태 확인", hint: "AVPU / GCS 등", done: false },
  { id: "q3", title: "통증/출혈 여부", hint: "부위, 양, 시작 시점", done: false },
];

function Row({ item }: { item: FollowUpItem }) {
  return (
    <div className="flex items-center gap-2 md:gap-3 py-2 md:py-3 border-b border-[var(--border)] last:border-b-0">
      {/* 상태 */}
      <div
        className={[
          "h-4 w-4 md:h-5 md:w-5 rounded-full border shrink-0",
          item.done
            ? "bg-[var(--primary-soft)] border-[var(--border-strong)]"
            : "bg-transparent border-[var(--border)]",
        ].join(" ")}
        aria-hidden
      />
      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <div className="text-sm md:text-xl font-semibold text-[var(--text-strong)] truncate">
          {item.title}
        </div>
        {item.hint && (
          <div className="text-xs md:text-xl text-[var(--text-muted)] truncate">{item.hint}</div>
        )}
      </div>

      {/* 이동/상세 */}
      <div className="text-[var(--text-muted)]">›</div>
    </div>
  );
}

export function FollowUpQuestionsPanel() {
  // TODO: 추후 훅으로 분리 (useFollowUpQuestions)
  const data = MOCK;

  return (
    <section className="aegis-surface-strong h-full overflow-hidden flex flex-col min-h-0">
      {/* 헤더 */}
      <div className="h-10 md:h-12 px-3 md:px-4 flex items-center justify-between border-b border-[var(--border)] shrink-0" style={{ backgroundColor: "var(--panel-header-bg)" }}>
        <div className="text-sm md:text-xl font-bold" style={{ color: "var(--panel-header-fg)" }}>
          AI 추천 점검사항 <span style={{ fontWeight: 400, opacity: 0.7 }}>({data.length})</span>
        </div>
      </div>

      {/* 리스트 */}
      <div className="p-4 flex-1 min-h-0 overflow-auto">
        {data.map((it) => ( 
          <Row key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
