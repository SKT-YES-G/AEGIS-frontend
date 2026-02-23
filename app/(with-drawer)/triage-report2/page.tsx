// app/triage-assessment/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDraftState } from "@/hooks/useDraftState";
import { reportService } from "@/services/report.service";
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

  /* ── OCR 활력징후 자동 채우기 ── */
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    const sid = sessionStorage.getItem("aegis_active_sessionId");
    if (!sid) return;
    let cancelled = false;
    setOcrLoading(true);

    reportService.get(Number(sid)).then((report) => {
      if (cancelled) return;

      // sessionStorage에서 직접 확인 → 빈 필드만 채우기 (사용자 수동 입력 우선)
      const prefix = (() => {
        try {
          return sid ? `aegis_draft_s${sid}_` : "aegis_draft_";
        } catch { return "aegis_draft_"; }
      })();

      const fillIfEmpty = (
        draftKey: string,
        val: number | null,
        setter: (v: string) => void,
      ) => {
        if (val == null) return;
        try {
          const raw = sessionStorage.getItem(prefix + draftKey);
          const current = raw ? JSON.parse(raw) : "";
          if (!current) setter(String(val));
        } catch {
          setter(String(val));
        }
      };

      fillIfEmpty("tr2_sbp", report.sbp, setSbp);
      fillIfEmpty("tr2_dbp", report.dbp, setDbp);
      fillIfEmpty("tr2_pr", report.pr, setPr);
      fillIfEmpty("tr2_rr", report.rr, setRr);
      fillIfEmpty("tr2_spo2", report.spO2, setSpo2);
      fillIfEmpty("tr2_temp", report.tempC, setTemp);
      fillIfEmpty("tr2_glucose", report.glucose, setGlucose);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setOcrLoading(false);
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 사진 촬영 ── */
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotos((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const removePhoto = useCallback((idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const measureOptions = useMemo<MeasureStatus[]>(() => ["측정", "거부", "거절"], []);

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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
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

          {/* OCR 업로드 */}
          <div className="symptom-group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleCapture}
                style={{
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: "2px dashed var(--border)",
                  background: "var(--surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>OCR 업로드</span>
              </button>

              {ocrLoading && (
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                  불러오는 중...
                </span>
              )}

              {photos.map((src, idx) => (
                <div key={idx} style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <img
                    src={src}
                    alt={`촬영 사진 ${idx + 1}`}
                    style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", border: "1px solid var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      lineHeight: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label={`사진 ${idx + 1} 삭제`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
              <VitalLine label="최고혈압 (mmHg)" unit="mmHg" value={sbp} onChange={setSbp} />
              <VitalLine label="최저혈압 (mmHg)" unit="mmHg" value={dbp} onChange={setDbp} />
              <VitalLine label="맥박 (회/min)" unit="회/min" value={pr} onChange={setPr} />
              <VitalLine label="호흡 (회/min)" unit="회/min" value={rr} onChange={setRr} />
              <VitalLine label="SpO₂ (%)" unit="%" value={spo2} onChange={setSpo2} />
              <VitalLine label="체온 (℃)" unit="℃" value={temp} onChange={setTemp} />
              <VitalLine label="혈당 (mg/dL)" unit="mg/dL" value={glucose} onChange={setGlucose} />
            </div>
          </div>
        </section>

        {/* 발열 여부 */}
        <section className="triage-section">
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
        </section>

        {/* 다음 버튼 */}
        <section className="triage-section" style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={() => {
              const sid = sessionStorage.getItem("aegis_active_sessionId");
              router.push(sid ? `/triage-report3?sessionId=${sid}` : "/triage-report3");
            }}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            다음
          </button>
        </section>

        <div className="safe-bottom large" />
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
          onChange={(e) => {
            const v = e.target.value;
            // 숫자 + 소수점만 허용
            if (/^\d*\.?\d*$/.test(v)) props.onChange(v);
          }}
          inputMode="numeric"
        />
        <div className="vital-unit">{props.unit}</div>
      </div>
    </div>
  );
}
