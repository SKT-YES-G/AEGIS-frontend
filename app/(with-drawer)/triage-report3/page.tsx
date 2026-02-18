// app/(with-drawer)/triage-report3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useDraftState } from "@/hooks/useDraftState";
import "@/styles/triage-report.css";

export default function TriageReport3Page() {
  const router = useRouter();

  const [chiefComplaint, setChiefComplaint] = useDraftState("tr3_chiefComplaint", "");
  const [symptomDate, setSymptomDate] = useDraftState("tr3_symptomDate", "2024-05-30 17:26");
  const [opinion, setOpinion] = useDraftState("tr3_opinion", "");

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
            ←
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
            <div className="vital-label">구급대원 평가소견</div>
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
