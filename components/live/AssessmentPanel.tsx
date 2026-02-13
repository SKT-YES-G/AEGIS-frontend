// components/live/AssessmentPanel.tsx
"use client";

import { useState } from "react";
import { useMission } from "@/hooks/useMission";
import { StatPill } from "./StatPill";

type Confidence = "low" | "mid" | "high";

function confidenceText(v: Confidence) {
  if (v === "high") return "High";
  if (v === "mid") return "Mid";
  return "Low";
}

type LevelStyle = {
  bg: string; // header background color token
  label: string; // level label text
};

function levelStyle(level: number): LevelStyle {
  switch (level) {
    case 1:
      return { bg: "var(--prektas-bg-1)", label: "즉시 응급" };
    case 2:
      return { bg: "var(--prektas-bg-2)", label: "고위험" };
    case 3:
      return { bg: "var(--prektas-bg-3)", label: "응급" };
    case 4:
      return { bg: "var(--prektas-bg-4)", label: "준응급" };
    case 5:
    default:
      return { bg: "var(--prektas-bg-5)", label: "비응급" };
  }
}

export function AssessmentPanel() {
  // ✅ Case 전환용 로컬 state (UI 테스트/데모용)
  const [caseIndex, setCaseIndex] = useState(0);

  // ✅ caseIndex를 훅으로 전달 (mock 케이스 반환)
  const { data, loading, error } = useMission(caseIndex);

  // ✅ data가 없을 때도 렌더가 깨지지 않도록 기본값 제공
  const lvl = data?.level ?? 5;
  const lvlUi = levelStyle(lvl);

  const onNextCase = () => {
    setCaseIndex((prev) => (prev + 1) % 5); // 0~4 순환 (케이스 5개 기준)
  };

  return (
    <section className="aegis-surface-strong flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="text-white p-6 py-5 shrink-0"
        style={{ backgroundColor: lvlUi.bg }}
      >
        {loading && <div className="text-xl opacity-80">평가 로딩 중...</div>}

        {error && (
          <div className="text-xl text-[var(--text-inverse)]/90">
            <span className="font-semibold">평가 로드 실패</span>: {error.message}
          </div>
        )}

        {/* ✅ data가 없어도 헤더 레이아웃은 유지(현장 UX에서 흔들림 방지) */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs opacity-80">AEGIS ASSESSMENT</div>
            <div className="mt-2 text-4xl font-bold">
              LV.{lvl}{" "}
              <span className="text-2xl font-semibold">{lvlUi.label}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {data && (
              <StatPill
                label="AI Confidence:"
                value={confidenceText(data.aiConfidence)}
              />
            )}

            {/* ✅ Case 전환 버튼 */}
            <button
              type="button"
              onClick={onNextCase}
              className="
                h-9 px-3
                rounded-lg
                border border-white/30
                text-xl
                hover:bg-white/15
                active:bg-white/25
              "
              title="데모용 케이스 전환"
            >
              Case {caseIndex} ▶
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 py-4 flex-1 min-h-0 flex flex-col gap-4">
        {/* data 없을 때의 안내 */}
        {!data && !loading && !error && (
          <div className="text-xl text-[var(--text-muted)]">
            평가 데이터가 없습니다.
          </div>
        )}

        {data && (
          <>
            {/* 판정 근거 */}
            <div className="p-4 flex-1 min-h-0 overflow-auto">
              <div className="text-xl font-semibold mb-2 text-[var(--text-strong)]">
                판정 근거
              </div>
              <div className="text-xl leading-6 text-[var(--text)]">
                {data.reasoning}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
