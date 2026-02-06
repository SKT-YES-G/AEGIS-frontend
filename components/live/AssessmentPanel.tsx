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
    <section className="bg-[var(--prektas-bg-5)] text-white p-6">
      {loading && <div className="text-sm opacity-80">평가 로딩 중...</div>}
      {error && <div className="text-sm text-red-200">평가 로드 실패: {error.message}</div>}

      {data && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs opacity-80">AEGIS ASSESSMENT</div>
              <div className="mt-2 text-4xl font-bold">
                LV.{data.level} <span className="text-2xl font-semibold">{data.levelLabel}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <StatPill label="AI Confidence:" value={confidenceText(data.aiConfidence)} />
            </div>
          </div>

          <div className="mt-5 bg-white/10 rounded-xl p-4">
            <div className="text-xs font-semibold mb-2">판정 근거</div>
            <div className="text-sm leading-6">{data.reasoning}</div>
          </div>

          <div className="mt-4 bg-white/10 rounded-xl p-4">
            <div className="text-xs font-semibold mb-2">권장 조치</div>
            <ol className="list-decimal ml-5 text-sm leading-6">
              {data.actions.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ol>
          </div>
        </>
      )}
    </section>
  );
}
