// components/live/FollowUpQuestionsPanel.tsx
"use client";

import { useState } from "react";

type Props = {
  questions?: string[];
};

export function FollowUpQuestionsPanel({ questions }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const items = questions && questions.length > 0 ? questions : [];

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <section className="aegis-surface-strong h-full overflow-hidden flex flex-col min-h-0">
      {/* 헤더 */}
      <div className="h-10 md:h-12 px-3 md:px-4 flex items-center justify-between border-b border-[var(--border)] shrink-0" style={{ backgroundColor: "var(--panel-header-bg)" }}>
        <div className="text-sm md:text-xl font-bold" style={{ color: "var(--panel-header-fg)" }}>
          AI 추천 점검사항 <span style={{ fontWeight: 400, opacity: 0.7 }}>({items.length})</span>
        </div>
      </div>

      {/* 리스트 */}
      <div className="p-4 flex-1 min-h-0 overflow-auto">
        {items.length === 0 && (
          <div className="text-sm md:text-base text-[var(--text-muted)]">
            추가 질문이 없습니다.
          </div>
        )}
        {items.map((q, i) => (
          <label
            key={i}
            className="flex items-start gap-2 md:gap-3 py-2 md:py-3 border-b border-[var(--border)] last:border-b-0 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 h-4 w-4 md:h-5 md:w-5 shrink-0 accent-[var(--primary)] cursor-pointer"
            />
            <span
              className={[
                "text-sm md:text-xl font-semibold",
                checked.has(i)
                  ? "line-through text-[var(--text-muted)]"
                  : "text-[var(--text-strong)]",
              ].join(" ")}
            >
              {q}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
