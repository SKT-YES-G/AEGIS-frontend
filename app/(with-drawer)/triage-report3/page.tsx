// app/(with-drawer)/triage-report3/page.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDraftState } from "@/hooks/useDraftState";
import "@/styles/triage-report.css";

const AI_MOCK_SUMMARY =
  "환자는 가슴 통증을 호소하며, 의식은 명료(Alert)입니다. 통증은 약 30분 전 갑자기 시작되었으며, 흉골 중앙부에서 좌측으로 방사되는 양상입니다. 활력징후는 BP 148/92, HR 102, SpO2 94%로 측정되었습니다. 과거력으로 고혈압 및 당뇨 복약 중이며, 심근경색 가능성을 고려하여 12-lead ECG 시행 및 응급의료센터 이송이 권고됩니다.";

export default function TriageReport3Page() {
  const router = useRouter();

  const [chiefComplaint, setChiefComplaint] = useDraftState("tr3_chiefComplaint", "");
  const [symptomDate, setSymptomDate] = useDraftState("tr3_symptomDate", "2024-05-30 17:26");
  const [opinion, setOpinion] = useDraftState("tr3_opinion", "");

  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "done">("idle");
  const [aiSummary, setAiSummary] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAiGenerate = useCallback(() => {
    if (aiStatus !== "idle") return;
    setAiStatus("loading");
    setAiSummary("AI가 평가 요약을 생성중입니다.");
    timerRef.current = setTimeout(() => {
      setAiSummary(AI_MOCK_SUMMARY);
      setAiStatus("done");
    }, 5000);
  }, [aiStatus]);

  const copyFromReport = () => {
    navigator.clipboard.writeText(symptomDate);
  };

  return (
    <div className="triage-page">
      <div className="triage-shell triage-content">
        {/* 상단 바 */}
        <div className="triage-topbar">
          <button
            type="button"
            className="triage-back"
            onClick={() => router.back()}
            aria-label="뒤로가기"
            title="뒤로가기"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
        </div>

        {/* 페이지 제목 */}
        <h1 className="step-text" style={{ fontSize: 20, marginBottom: 24 }}>
          구급대원 평가소견
        </h1>

        {/* 주호소 */}
        <section className="triage-section">
          <div className="vital-line">
            <div className="vital-label">주호소</div>
            <div className="vital-row">
              <input
                type="text"
                className="vital-input"
                placeholder="주호소를 입력하세요"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 증상 발생 일시 */}
        <section className="triage-section">
          <div className="vital-line">
            <div className="vital-label">증상 발생 일시</div>
            <div className="vital-row">
              <input
                type="text"
                className="vital-input"
                value={symptomDate}
                onChange={(e) => setSymptomDate(e.target.value)}
              />
              <button
                type="button"
                className="chip"
                style={{ flexShrink: 0 }}
                onClick={copyFromReport}
              >
                신고일시복사
              </button>
            </div>
          </div>
        </section>

        {/* 구급대원 평가소견 */}
        <section className="triage-section">
          <div className="vital-line" style={{ borderBottom: "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="vital-label" style={{ marginBottom: 0 }}>구급대원 평가소견</div>
              <button
                type="button"
                disabled={aiStatus !== "idle"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: aiStatus !== "idle" ? "#888" : "var(--primary)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: aiStatus !== "idle" ? "default" : "pointer",
                  opacity: aiStatus !== "idle" ? 0.6 : 1,
                }}
                onClick={handleAiGenerate}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C12.5 5.5 15.5 9.5 23 12C15.5 14.5 12.5 18.5 12 23C11.5 18.5 8.5 14.5 1 12C8.5 9.5 11.5 5.5 12 1Z"/></svg>
                AI 요약생성
              </button>
            </div>
            <textarea
              className="vital-input"
              style={{
                height: 200,
                resize: "vertical",
                borderRadius: 10,
                padding: 12,
                border: "1px solid var(--border)",
                background: "color-mix(in oklab, var(--card) 70%, transparent)",
                width: "100%",
              }}
              placeholder="평가소견을 입력하세요"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
            />

            {/* AI 요약 결과 (읽기 전용) */}
            {aiStatus !== "idle" && (
              <div style={{ position: "relative", marginTop: 10, width: "100%" }}>
                <div className="vital-label">AI 요약</div>
                <textarea
                  className="vital-input"
                  readOnly
                  style={{
                    height: 160,
                    resize: "none",
                    borderRadius: 10,
                    padding: 12,
                    border: "1px solid var(--border)",
                    background: "color-mix(in oklab, var(--card) 50%, transparent)",
                    width: "100%",
                    color: aiStatus === "loading" ? "transparent" : "var(--text-strong)",
                  }}
                  value={aiStatus === "loading" ? "" : aiSummary}
                />
                {aiStatus === "loading" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                      AI가 평가 요약을 생성중입니다.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>


        <div className="safe-bottom large" />
      </div>

      {/* 하단 CTA */}
      <div className="triage-bottom-cta">
        <button
          type="button"
          className="triage-bottom-cta__btn"
          onClick={() => router.push("/incident-summary")}
        >
          출동요약 보기
        </button>
      </div>
    </div>
  );
}
