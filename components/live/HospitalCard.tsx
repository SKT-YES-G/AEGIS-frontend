// components/live/HospitalCard.tsx
"use client";

import type { Hospital } from "@/types/hospital";

type Props = {
  hospital: Hospital;
  isOpen: boolean;
  onToggle: () => void;
};

export function HospitalCard({ hospital, isOpen, onToggle }: Props) {
  const bedsLabel =
    hospital.erBedsAvailable > 0
      ? `${hospital.erBedsAvailable}석`
      : "만석";

  const bedsColor =
    hospital.erBedsAvailable > 0
      ? "text-[var(--success)]"
      : "text-[var(--danger)]";

  return (
    <div
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* ── 요약 (항상 표시) ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-[var(--text-strong)]">
              {hospital.name}
            </span>
            <span className="shrink-0 rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
              {hospital.hospitalType}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>{hospital.distanceKm.toFixed(1)}km</span>
            <span className={bedsColor}>
              병상 {bedsLabel}
            </span>
          </div>
        </div>

        {/* 화살표 */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          aria-hidden
          className="shrink-0 text-[var(--text-subtle)] transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── 아코디언 상세 ── */}
      {isOpen && (
        <div className="border-t border-[var(--border)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text)]">
          {hospital.departments.length > 0 && (
            <Row label="진료과" value={hospital.departments.join(", ")} />
          )}
          <Row label="주소" value={hospital.address} />
          <Row label="대표" value={hospital.phoneMain} />
          <Row label="응급실" value={hospital.phoneEr} />
          <Row label="당직" value={hospital.phoneDuty} />
        </div>
      )}
    </div>
  );
}

/* ── 내부 행 컴포넌트 ── */
function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-0.5">
      <span className="shrink-0 w-12 text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--text-strong)]">{value}</span>
    </div>
  );
}
