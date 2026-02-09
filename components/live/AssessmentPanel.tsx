// components/live/AssessmentPanel.tsx
"use client";

import { useMission } from "@/hooks/useMission";
import { StatPill } from "./StatPill";

function confidenceText(v: "low" | "mid" | "high") {
  if (v === "high") return "High";
  if (v === "mid") return "Mid";
  return "Low";
}

export function AssessmentPanel() {
  const { data, loading, error } = useMission();

  return (
    <section className="flex-1 min-h-0 bg-[var(--prektas-bg-5)] text-white p-6 flex flex-col">

      {loading && <div className="text-sm opacity-80">평가 로딩 중...</div>}

      {error && (
        <div className="text-sm text-[var(--text-inverse)]/90">
          <span className="font-semibold">평가 로드 실패</span>: {error.message}
        </div>
      )}

      {data && (
        <>
          {/* ✅ 상단 요약(높이 고정 영역) */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs opacity-80">AEGIS ASSESSMENT</div>
              <div className="mt-2 text-4xl font-bold">
                LV.{data.level}{" "}
                <span className="text-2xl font-semibold">{data.levelLabel}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <StatPill
                label="AI Confidence:"
                value={confidenceText(data.aiConfidence)}
              />
            </div>
          </div>

          {/* ✅ 여기! 남은 높이를 전부 먹는 본문 영역 */}
          <div className="mt-5 flex-1 min-h-0 flex flex-col gap-4">
            {/* 판정 근거 */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs font-semibold mb-2">판정 근거</div>
              <div className="text-sm leading-6">{data.reasoning}</div>
            </div>

            {/* 권장 조치: 내용이 길어지면 이 박스 안에서 스크롤 되게 */}
            <div className="bg-white/10 rounded-xl p-4 flex-1 min-h-0 overflow-auto">
              <div className="text-xs font-semibold mb-2">권장 조치</div>
              <ol className="list-decimal ml-5 text-sm leading-6">
                {data.actions.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ol>
            </div>
          </div>


          {/* ✅ TEST: 내용 늘리기용 더미 블록 (확인 후 삭제) */}
<div className="bg-white/10 rounded-xl p-4">
  <div className="text-xs font-semibold mb-2">[TEST] 추가 내용</div>
  <div className="text-sm leading-6 opacity-95">
    {Array.from({ length: 1 }).map((_, i) => (
      <p key={i}>- 더미 라인 {i + 1}: 이 내용은 패널 높이 테스트용입니다.</p>
    ))}
  </div>
</div>
          
        </>
      )}
    </section>
  );
}
