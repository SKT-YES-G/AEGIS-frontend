// app/triage-assessment/page.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDraftState } from "@/hooks/useDraftState";
import "@/styles/triage-report.css";

type MeasureStatus = "측정" | "거부" | "거절";
type Fever = "예" | "아니오";
type AVPU = "A" | "V" | "P" | "U";

export default function TriageAssessmentPage() {
  const router = useRouter();

  const [measureStatus, setMeasureStatus] = useDraftState<MeasureStatus>("tr2_measureStatus", "측정");
  const [avpu, setAvpu] = useDraftState<AVPU | null>("tr2_avpu", null);

  const [sbp, setSbp] = useDraftState("tr2_sbp", "");
  const [dbp, setDbp] = useDraftState("tr2_dbp", "");
  const [rr, setRr] = useDraftState("tr2_rr", "");
  const [pr, setPr] = useDraftState("tr2_pr", "");
  const [temp, setTemp] = useDraftState("tr2_temp", "");
  const [spo2, setSpo2] = useDraftState("tr2_spo2", "");
  const [glucose, setGlucose] = useDraftState("tr2_glucose", "");

  const [fever, setFever] = useDraftState<Fever | null>("tr2_fever", null);

  const measureOptions = useMemo<MeasureStatus[]>(() => ["측정", "거부", "거절"], []);

  const canProceed = true;

  return (
    <div className="triage-page">
      {/* ✅ triage-content wrapper 추가(하단 CTA 가림 방지) */}
      <div className="triage-shell triage-content">
        {/* 상단 바 */}
        <div className="triage-topbar">
          <button
            type="button"
            className="triage-back"
            onClick={() => router.back()}
            aria-label="뒤로가기"
          >
            ←
          </button>
        </div>

        <section className="triage-section">
          <div className="step-title">
            <span className="step-text">활력 징후를 입력하세요.</span>
          </div>

          {/* 측정 상태 */}
          <div className="chip-row">
            {measureOptions.map((opt) => {
              const isActive = measureStatus === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={["chip", isActive ? "is-active" : ""].join(" ")}
                  onClick={() => setMeasureStatus(opt)}
                  aria-pressed={isActive}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="triage-divider" />

          {/* 의식 상태 */}
          <div className="symptom-group">
            <div className="symptom-label">의식 상태</div>
            <div className="chip-grid">
              {[
                { k: "A", desc: "(ALERT)" },
                { k: "V", desc: "(언어자극반응)" },
                { k: "P", desc: "(통증자극반응)" },
                { k: "U", desc: "(COMA)" },
              ].map((o) => {
                const key = o.k as AVPU;
                const isActive = avpu === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={["chip", isActive ? "is-active" : ""].join(" ")}
                    onClick={() => setAvpu(key)}
                    aria-pressed={isActive}
                  >
                    <div style={{ fontWeight: 900 }}>{key}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 입력 영역(언더라인 스타일은 triage-report.css에 추가해도 됨) */}
          <div className="symptom-group" style={{ marginTop: 18 }}>
            <div className="vital-grid">
              <VitalLine label="최고혈압" unit="mmHg" value={sbp} onChange={setSbp} />
              <VitalLine label="최저혈압" unit="mmHg" value={dbp} onChange={setDbp} />
              <VitalLine label="호흡" unit="회/min" value={rr} onChange={setRr} />
              <VitalLine label="맥박" unit="회/min" value={pr} onChange={setPr} />
              <VitalLine label="체온(℃)" unit="℃" value={temp} onChange={setTemp} />
              <VitalLine label="SpO2(%)" unit="%" value={spo2} onChange={setSpo2} />
              <VitalLine label="혈당" unit="mg/dL" value={glucose} onChange={setGlucose} />
              <div className="vital-line">
                <div className="vital-label">측정시간</div>
                <div className="vital-row">
                  <div className="vital-input vital-input--readonly">
                    {new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="vital-unit">🕒</div>
                </div>
              </div>
            </div>
          </div>

          {/* 발열 여부 */}
          <div className="triage-divider" style={{ marginTop: 18 }} />
          <div className="symptom-group">
            <div className="step-title" style={{ marginBottom: 10 }}>
              <span className="step-text">발열 여부 (37.5℃ 이상)</span>
            </div>

            <div className="chip-row">
              {(["예", "아니오"] as Fever[]).map((opt) => {
                const isActive = fever === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={["chip", isActive ? "is-active" : ""].join(" ")}
                    onClick={() => setFever(opt)}
                    aria-pressed={isActive}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ✅ styles/triage-report.css의 CTA 사용 */}
      <div className="triage-bottom-cta">
        <button
          type="button"
          className="triage-bottom-cta__btn"
          onClick={() => router.push("/triage-report3")}
          disabled={!canProceed}
        >
          다음
        </button>
      </div>
    </div>
  );
}

/** 활력 입력 라인 컴포넌트(페이지 내부 로컬) */
function VitalLine(props: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="vital-line">
      <div className="vital-label">{props.label}</div>
      <div className="vital-row">
        <input
          className="vital-input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          inputMode="numeric"
        />
        <div className="vital-unit">{props.unit}</div>
      </div>
    </div>
  );
}
