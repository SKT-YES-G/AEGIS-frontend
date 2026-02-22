// components/incident/PatientSummaryPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/report.service";
import { parseChecklistArray } from "@/hooks/useAiChecklist";
import type { AmbulanceReport } from "@/types/report";

/**
 * PatientSummaryPanel
 * - 출동일지 페이지 우측: 환자증상 + 활력징후 요약
 * - 태블릿 우선, 스트레스 환경 — 큰 터치 타겟, 고대비, 명시적 라벨
 */

/* ── 서브 컴포넌트 ── */

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="h-10 md:h-12 px-4 flex items-center gap-2 border-b border-[var(--border)]">
      {icon}
      <span className="text-xs md:text-sm font-bold text-[var(--text-strong)]">
        {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-[var(--muted)] shrink-0">
        {label}
      </div>
      <div className="flex-1 text-xs md:text-sm text-[var(--text)]">
        {value}
      </div>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center h-7 px-2.5 rounded-lg text-xs font-semibold border border-[var(--border)] text-[var(--fg)]"
          style={{ backgroundColor: "var(--surface-muted)" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  alert,
}: {
  label: string;
  value: string | number;
  unit: string;
  alert?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-2.5 md:p-3 rounded-xl border"
      style={{
        borderColor: alert ? "var(--danger)" : "var(--border)",
        backgroundColor: alert
          ? "rgba(239, 68, 68, 0.06)"
          : "var(--surface-muted)",
      }}
    >
      <div className="text-[10px] md:text-xs font-bold text-[var(--muted)]">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-lg md:text-xl font-black"
          style={{ color: alert ? "var(--danger)" : "var(--fg)" }}
        >
          {value}
        </span>
        <span className="text-[10px] md:text-xs font-semibold text-[var(--text-subtle)]">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ── 아이콘 ── */

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function HeartPulseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      <path d="M12 6v4l2 2" />
    </svg>
  );
}

/* ── 메인 패널 ── */

type Props = {
  sessionId: number | null;
};

export function PatientSummaryPanel({ sessionId }: Props) {
  const [report, setReport] = useState<AmbulanceReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setLoading(true);
    reportService.get(sessionId).then((r) => {
      if (!cancelled) setReport(r);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [sessionId]);

  // 체크리스트 배열 → UI 표시 데이터
  const checklist = report?.checklistData;
  const parsed = checklist && checklist.length >= 68
    ? parseChecklistArray(checklist)
    : null;

  const incidentType = parsed?.incidentType ?? "";
  const symptoms = parsed?.symptoms ?? [];
  const history = parsed?.historyDetails ?? [];

  // 활력징후
  const vitals = report
    ? {
        sbp: report.sbp,
        dbp: report.dbp,
        hr: report.pr,
        rr: report.rr,
        spo2: report.spO2,
        temp: report.tempC,
        glucose: report.glucose,
      }
    : null;

  return (
    <section className="aegis-surface-strong h-full min-h-0 overflow-hidden flex flex-col rounded-xl">
      {/* 헤더 */}
      <div
        className="h-10 md:h-12 px-4 flex items-center gap-2 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-xs md:text-sm font-bold text-[var(--text-strong)]">
          환자 요약
        </span>
      </div>

      {/* 본문 스크롤 */}
      <div className="flex-1 min-h-0 overflow-auto">
        {loading && (
          <div className="p-4 text-sm text-[var(--muted)]">불러오는 중...</div>
        )}

        {!loading && (
          <>
            {/* 환자 증상 섹션 */}
            <SectionTitle icon={<ClipboardIcon />} title="환자 증상" />
            <div className="p-3 md:p-4 flex flex-col gap-1">
              <InfoRow label="발생 유형" value={incidentType || "미입력"} />
              <div className="flex gap-3 py-2.5 border-b border-[var(--border)]">
                <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-[var(--muted)] shrink-0">
                  증상
                </div>
                <div className="flex-1">
                  {symptoms.length > 0
                    ? <ChipList items={symptoms} />
                    : <span className="text-xs text-[var(--muted)]">선택 없음</span>}
                </div>
              </div>
              <div className="flex gap-3 py-2.5 border-b border-[var(--border)]">
                <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-[var(--muted)] shrink-0">
                  병력
                </div>
                <div className="flex-1">
                  {history.length > 0
                    ? <ChipList items={history} />
                    : <span className="text-xs text-[var(--muted)]">선택 없음</span>}
                </div>
              </div>
            </div>

            {/* 활력징후 섹션 */}
            <SectionTitle icon={<HeartPulseIcon />} title="활력징후" />
            <div className="p-3 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <VitalCard label="최고혈압" value={vitals?.sbp ?? "-"} unit="mmHg" />
                <VitalCard label="최저혈압" value={vitals?.dbp ?? "-"} unit="mmHg" />
                <VitalCard label="맥박" value={vitals?.hr ?? "-"} unit="회/min" />
                <VitalCard label="호흡" value={vitals?.rr ?? "-"} unit="회/min" />
                <VitalCard label="SpO₂" value={vitals?.spo2 ?? "-"} unit="%" />
                <VitalCard label="체온" value={vitals?.temp ?? "-"} unit="℃" />
                <VitalCard label="혈당" value={vitals?.glucose ?? "-"} unit="mg/dL" />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
