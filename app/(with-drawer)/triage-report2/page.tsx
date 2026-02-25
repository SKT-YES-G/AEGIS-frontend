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
  const [ocrDone, setOcrDone] = useState(false);

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

  /* ── OCR 사진 촬영 (단일 이미지) ── */
  const [ocrPhoto, setOcrPhoto] = useState<string | null>(null);
  const ocrFileRef = useRef<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    ocrFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setOcrPhoto(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const removePhoto = useCallback(() => {
    setOcrPhoto(null);
    ocrFileRef.current = null;
    setOcrDone(false);
  }, []);

  /** 확인 → AI OCR 전송 → 활력징후 자동 채우기 */
  const handleOcrConfirm = useCallback(async () => {
    const file = ocrFileRef.current;
    const sid = sessionStorage.getItem("aegis_active_sessionId");
    if (!file || !sid) return;

    setOcrLoading(true);
    try {
      const res = await reportService.uploadOcr(Number(sid), file);
      if (res.sbp) setSbp(res.sbp);
      if (res.dbp) setDbp(res.dbp);
      if (res.pr) setPr(res.pr);
      if (res.rr) setRr(res.rr);
      if (res.sp_o2) setSpo2(res.sp_o2);
      if (res.temp_c) setTemp(res.temp_c);
      if (res.glucose) setGlucose(res.glucose);
      setOcrDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "알 수 없는 오류";
      alert(`바이탈 모니터 인식에 실패했습니다.\n${msg}`);
    } finally {
      setOcrLoading(false);
    }
  }, [setSbp, setDbp, setPr, setRr, setSpo2, setTemp, setGlucose]);

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

          {/* OCR 업로드 (단일 이미지) */}
          <div className="symptom-group">
            <div className="symptom-label">바이탈 모니터 연동</div>
            {/* 갤러리 선택용 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {/* 카메라 촬영용 */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {!ocrPhoto ? (
              /* ── 빈 상태: 업로드 + 촬영 버튼 ── */
              <div className="ocr-upload-empty-row">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="ocr-upload-preview__btn ocr-upload-preview__btn--confirm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  사진 업로드
                </button>
                <button
                  type="button"
                  onClick={handleCamera}
                  className="ocr-upload-preview__btn ocr-upload-preview__btn--confirm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  사진 촬영
                </button>
                {ocrLoading && (
                  <span className="ocr-upload-loading">불러오는 중...</span>
                )}
              </div>
            ) : (
              /* ── 촬영 완료: 미리보기 + 액션 ── */
              <div className="ocr-upload-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ocrPhoto}
                  alt="촬영된 모니터 사진"
                  className="ocr-upload-preview__img"
                />
                <div className="ocr-upload-preview__actions">
                  <button type="button" onClick={handleOcrConfirm} disabled={ocrLoading || ocrDone} className="ocr-upload-preview__btn ocr-upload-preview__btn--confirm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {ocrLoading ? "인식 중..." : ocrDone ? "완료" : "확인"}
                  </button>
                  <button type="button" onClick={removePhoto} disabled={ocrLoading} className="ocr-upload-preview__btn ocr-upload-preview__btn--remove" aria-label="사진 삭제">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    삭제
                  </button>
                </div>
                {ocrLoading && (
                  <span className="ocr-upload-loading">불러오는 중...</span>
                )}
              </div>
            )}
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
