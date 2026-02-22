// app/triage-report/page.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDraftState, useDraftSet } from "@/hooks/useDraftState";
import { useAiChecklist } from "@/hooks/useAiChecklist";
import "@/styles/triage-report.css";

/**
 * triage-report 페이지
 * - (1) 환자 발생 유형: 단일 선택
 * - (2) 환자 증상: 다중 선택 (카테고리별 칩)
 * - (3) 환자 병력 여부: 단일 선택 + 병력 상세(복수선택) + 감염병(의심) 여부
 * - 현재는 Mock 상태/라우팅만 구현 (백엔드 연동 전제)
 */

type IncidentType = "질병" | "질병 외 (외상)" | "기타";
type HistoryPresence = "있음" | "없음" | "미상";

type SymptomCategory = {
  key: string;
  items: string[];
};

export default function TriageReportPage() {
  const router = useRouter();

  // (1) 환자 발생 유형: 단일 선택
  const [incidentType, setIncidentType] = useDraftState<IncidentType>("tr1_incidentType", "질병");

  // (2) 환자 증상: 다중 선택
  const [selectedSymptoms, setSelectedSymptoms] = useDraftSet("tr1_symptoms");

  // (3) 병력
  const [historyPresence, setHistoryPresence] = useDraftState<HistoryPresence>("tr1_historyPresence", "있음");
  const [historyDetails, setHistoryDetails] = useDraftSet("tr1_historyDetails");
  const [simpleHistoryFlags, setSimpleHistoryFlags] = useDraftSet("tr1_simpleHistoryFlags");

  // AI 체크리스트 데이터
  const { aiSymptoms, aiHistory, aiInfection } = useAiChecklist();

  const incidentTypeOptions: IncidentType[] = ["질병", "질병 외 (외상)", "기타"];
  const historyPresenceOptions: HistoryPresence[] = ["있음", "없음", "미상"];

  const symptomCategories = useMemo<SymptomCategory[]>(
    () => [
      {
        key: "통증",
        items: ["두통", "흉통", "복통", "요통", "분만진통", "그 밖의 통증"],
      },
      {
        key: "외상",
        items: ["골절", "탈구", "염좌", "열상", "찰과상", "타박상", "절단", "암궤손상", "화상"],
      },
      {
        key: "출혈",
        items: ["객혈", "토혈", "혈변", "비출혈", "질출혈", "그 밖의 출혈"],
      },
      {
        key: "호흡 및 무의식",
        items: ["호흡곤란", "호흡정지", "심정지", "경련/발작"],
      },
      // ✅ 사용자가 준 “실신~기타”를 증상 섹션 안에 포함
      {
        key: "기타 증상",
        items: [
          "실신",
          "오심",
          "구토",
          "설사",
          "변비",
          "배뇨장애",
          "고열",
          "저체온증",
          "어지러움",
          "마비",
          "전신쇠약",
          "정신장애",
          "그 밖의 이물질",
          "기타",
        ],
      },
    ],
    []
  );

  const historyDetailOptions = useMemo(
    () => [
      "고혈압",
      "당뇨",
      "뇌혈관질환",
      "폐질환",
      "심장질환",
      "결핵",
      "간염",
      "간경화",
      "알레르기",
      "암",
      "신부전",
      "기타",
    ],
    []
  );

  const simpleHistoryOptions = useMemo(() => ["해당없음", "감염병(의심)"], []);

  const toggleSetItem = (value: string, setter: (fn: (prev: Set<string>) => Set<string>) => void) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  // 사용자 선택만 초기화 (AI 추천은 유지)
  const handleReset = () => {
    setSelectedSymptoms(() => new Set());
    setHistoryDetails(() => new Set());
    setSimpleHistoryFlags(() => new Set());
    setIncidentType("질병");
    setHistoryPresence("있음");
  };

  return (
    <div className="triage-page">
      <div className="triage-shell">
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

        {/* 1) 환자 발생 유형 */}
        <section className="triage-section">
          <div className="step-title">
            <span className="step-text">환자 발생 유형을 선택하세요.</span>
          </div>

          <div className="chip-row">
            {incidentTypeOptions.map((opt) => {
              const isActive = incidentType === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={["chip", isActive ? "is-active" : ""].join(" ")}
                  onClick={() => setIncidentType(opt)}
                  aria-pressed={isActive}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>

        <div className="section-spacer" />

        {/* 2) 환자 증상 */}
        <section className="triage-section">
          <div className="step-title">
            <span className="step-text">환자 증상을 모두 선택하세요.</span>
            <span className="step-hint">(복수선택)</span>
            <span className="step-hint triage-right-actions">
              <button type="button" className="triage-reset-btn" onClick={handleReset}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                초기화
              </button>
              <span className="triage-ai-notice">
                <span style={{ color: "var(--fg)", fontWeight: 800 }}>*</span>
                <span className="ai-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, lineHeight: 1, padding: "1px 4px", borderRadius: 4, background: "#3b82f6", color: "#fff", marginLeft: 2, marginRight: 2, verticalAlign: "middle" }}>AI</span>
                 미선택시 구급일지에 반영되지 않습니다.
              </span>
            </span>
          </div>

          {symptomCategories.map((cat) => (
            <div key={cat.key} className="symptom-group">
              <div className="symptom-label">{cat.key}</div>

              <div className="chip-grid">
                {cat.items.map((symptom) => {
                  const isActive = selectedSymptoms.has(symptom);
                  const isAi = aiSymptoms.has(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      className={["chip", isActive ? "is-active" : "", isAi ? "is-ai" : ""].join(" ")}
                      onClick={() => toggleSetItem(symptom, setSelectedSymptoms)}
                      aria-pressed={isActive}
                    >
                      {symptom}
                      {isAi && <span className="ai-badge">AI</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ✅ 구분선 (스크린샷처럼 섹션이 길어지면 시각적 분리) */}
        <div className="triage-divider" />

        {/* 3) 환자 병력 */}
        <section className="triage-section">
          <div className="step-title">
            <span className="step-text">환자의 병력이 있습니까?</span>
          </div>

          <div className="chip-row">
            {historyPresenceOptions.map((opt) => {
              const isActive = historyPresence === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={["chip", isActive ? "is-active" : ""].join(" ")}
                  onClick={() => setHistoryPresence(opt)}
                  aria-pressed={isActive}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="triage-divider subtle" />

          <div className="symptom-group">
            <div className="symptom-label">병력 상세 (복수선택)</div>
            <div className="chip-grid">
              {historyDetailOptions.map((item) => {
                const isActive = historyDetails.has(item);
                const isAi = aiHistory.has(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={["chip", isActive ? "is-active" : "", isAi ? "is-ai" : ""].join(" ")}
                    onClick={() => toggleSetItem(item, setHistoryDetails)}
                    aria-pressed={isActive}
                    disabled={historyPresence !== "있음"}
                  >
                    {item}
                    {isAi && <span className="ai-badge">AI</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="symptom-group">
            <div className="symptom-label">감염병(의심) 여부</div>
            <div className="chip-row">
              {simpleHistoryOptions.map((item) => {
                const isActive = simpleHistoryFlags.has(item);
                const isAi = aiInfection.has(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={["chip", isActive ? "is-active" : "", isAi ? "is-ai" : ""].join(" ")}
                    onClick={() => toggleSetItem(item, setSimpleHistoryFlags)}
                    aria-pressed={isActive}
                  >
                    {item}
                    {isAi && <span className="ai-badge">AI</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 하단 안전영역 (고정 버튼이 있으니 더 확보) */}
        <div className="safe-bottom large" />
      </div>

        <div className="triage-bottom-cta">
      <button
        type="button"
        className="triage-bottom-cta__btn"
        onClick={() => router.push("/triage-report2")}
      >
        다음
      </button>
     </div>
  </div>
  );
}
