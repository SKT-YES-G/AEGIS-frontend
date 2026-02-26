// app/(with-drawer)/triage-report3/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDraftState, useDraftSet } from "@/hooks/useDraftState";
import { buildChecklistArray } from "@/hooks/useAiChecklist";
import { reportService } from "@/services/report.service";
import { sessionService } from "@/services/session.service";
import "@/styles/triage-report.css";


export default function TriageReport3Page() {
  const router = useRouter();

  const [chiefComplaint, setChiefComplaint] = useDraftState("tr3_chiefComplaint", "");
  const [symptomDate, setSymptomDate] = useDraftState("tr3_symptomDate", "");
  const [opinion, setOpinion] = useDraftState("tr3_opinion", "");

  // triage-report 페이지의 선택값 읽기 (체크리스트 저장용)
  const [incidentType] = useDraftState<string>("tr1_incidentType", "질병");
  const [selectedSymptoms] = useDraftSet("tr1_symptoms");
  const [historyPresence] = useDraftState<string>("tr1_historyPresence", "있음");
  const [historyDetails] = useDraftSet("tr1_historyDetails");
  const [simpleHistoryFlags] = useDraftSet("tr1_simpleHistoryFlags");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  // 저장 후 입력값 변경 시 버튼 재활성화
  const markDirty = useCallback(() => {
    setSaveStatus((prev) => (prev === "done" ? "idle" : prev));
  }, []);

  // 페이지 진입 시 백엔드에서 출동시작시각(dispatchedAt) 불러와 symptomDate 초기화
  useEffect(() => {
    const raw = sessionStorage.getItem("aegis_active_sessionId");
    const sid = raw ? Number(raw) : null;
    if (!sid) return;
    sessionService.getById(sid).then((session) => {
      if (session.dispatchedAt) {
        const d = new Date(session.dispatchedAt);
        if (!isNaN(d.getTime())) {
          const formatted =
            `${d.getFullYear()}-` +
            `${String(d.getMonth() + 1).padStart(2, "0")}-` +
            `${String(d.getDate()).padStart(2, "0")} ` +
            `${String(d.getHours()).padStart(2, "0")}:` +
            `${String(d.getMinutes()).padStart(2, "0")}`;
          setSymptomDate(formatted);
        }
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "done">("idle");
  const [aiSummary, setAiSummary] = useState("");


  const handleAiGenerate = useCallback(async () => {
    if (aiStatus !== "idle") return;
    const raw = sessionStorage.getItem("aegis_active_sessionId");
    const sid = raw ? Number(raw) : null;
    if (!sid) return;

    setAiStatus("loading");
    setAiSummary("");
    try {
      const report = await reportService.generate(sid);
      setAiSummary(report.summary || "AI 요약을 생성하지 못했습니다.");
      setAiStatus("done");
    } catch {
      setAiSummary("AI 요약 생성에 실패했습니다.");
      setAiStatus("done");
    }
  }, [aiStatus]);

  const copyFromReport = () => {
    navigator.clipboard.writeText(symptomDate);
  };

  const handleSave = async () => {
    const raw = sessionStorage.getItem("aegis_active_sessionId");
    const sid = raw ? Number(raw) : null;
    if (!sid) return;

    setSaveStatus("saving");
    let ok = false;

    // 1) 체크리스트 저장
    try {
      const checklistData = buildChecklistArray({
        incidentType,
        symptoms: selectedSymptoms,
        historyPresence,
        historyDetails,
        simpleHistoryFlags,
      });
      await reportService.updateChecklist(sid, { checklistData });
      ok = true;
    } catch (e) { console.error("[Save] checklist failed:", e); }

    // 2) 활력징후 저장 (triage-report2 draft 값 읽기)
    try {
      const prefix = `aegis_draft_s${sid}_`;
      const num = (key: string) => {
        try {
          const v = sessionStorage.getItem(prefix + key);
          if (!v) return undefined;
          const n = Number(JSON.parse(v));
          return isNaN(n) || v === '""' ? undefined : n;
        } catch { return undefined; }
      };
      const vitals = {
        sbp: num("tr2_sbp"),
        dbp: num("tr2_dbp"),
        pr: num("tr2_pr"),
        rr: num("tr2_rr"),
        spO2: num("tr2_spo2"),
        tempC: num("tr2_temp"),
        glucose: num("tr2_glucose"),
      };
      if (Object.values(vitals).some((v) => v !== undefined)) {
        await reportService.updateVitals(sid, vitals);
        ok = true;
      }
    } catch (e) { console.error("[Save] vitals failed:", e); }

    // 3) 평가 정보 저장
    try {
      // "2026-02-22 17:26" → "2026-02-22T17:26:00" ISO 변환
      let isoDate: string | undefined;
      if (symptomDate) {
        const d = new Date(symptomDate.replace(" ", "T"));
        isoDate = isNaN(d.getTime()) ? undefined : d.toISOString();
      }
      await reportService.updateAssessment(sid, {
        chiefComplaint: chiefComplaint || undefined,
        assessment: opinion || undefined,
        incidentDateTime: isoDate,
      });
      ok = true;
    } catch (e) { console.error("[Save] assessment failed:", e); }

    setSaveStatus(ok ? "done" : "error");
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
            <div className="vital-label" style={{ color: "var(--fg)" }}>주호소</div>
            <div className="vital-row">
              <input
                type="text"
                className="vital-input"
                placeholder="주호소를 입력하세요"
                value={chiefComplaint}
                onChange={(e) => { setChiefComplaint(e.target.value); markDirty(); }}
              />
            </div>
          </div>
        </section>

        {/* 증상 발생 일시 */}
        <section className="triage-section">
          <div className="vital-line">
            <div className="vital-label" style={{ color: "var(--fg)" }}>증상 발생 일시</div>
            <div className="vital-row">
              <input
                type="text"
                className="vital-input"
                value={symptomDate}
                onChange={(e) => { setSymptomDate(e.target.value); markDirty(); }}
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
              <div className="vital-label" style={{ marginBottom: 0, color: "var(--fg)" }}>구급대원 평가소견</div>
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
              onChange={(e) => { setOpinion(e.target.value); markDirty(); }}
            />

            {/* AI 요약 결과 (읽기 전용) */}
            {aiStatus !== "idle" && (
              <div style={{ position: "relative", marginTop: 10, width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <span className="vital-label" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, lineHeight: 1, padding: "1px 4px", borderRadius: 4, background: "#3b82f6", color: "#fff" }}>AI</span>
                    요약
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 2 }}>
                    <span style={{ color: "var(--fg)", fontWeight: 800 }}>*</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, lineHeight: 1, padding: "1px 4px", borderRadius: 4, background: "#3b82f6", color: "#fff" }}>AI</span>
                     요약은 구급일지에 반영되지 않습니다.
                  </span>
                </div>
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
                    <span style={{ color: "var(--text-strong)", fontSize: 14, fontWeight: 600 }}>
                      AI가 평가 요약을 생성중입니다.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>


        {/* 저장 버튼 */}
        <section className="triage-section" style={{ marginTop: 8 }}>
          <button
            type="button"
            disabled={saveStatus === "saving" || saveStatus === "done"}
            onClick={handleSave}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "none",
              background: saveStatus === "done" ? "#93c5fd" : "var(--primary)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: saveStatus === "saving" || saveStatus === "done" ? "default" : "pointer",
              opacity: saveStatus === "saving" || saveStatus === "done" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.2s, opacity 0.2s",
            }}
          >
            {saveStatus === "saving" && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {saveStatus === "done" && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {saveStatus === "error" && "저장 실패 — 다시 시도"}
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "done" && "저장됨"}
            {saveStatus === "idle" && "구급일지 저장"}
          </button>
        </section>

        <div className="safe-bottom large" />
      </div>
    </div>
  );
}
