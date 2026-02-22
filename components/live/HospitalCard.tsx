// components/live/HospitalCard.tsx
"use client";

import type { Hospital } from "@/types/hospital";

type Props = {
  hospital: Hospital;
  rank: number;
  isOpen: boolean;
  onToggle: () => void;
};

export function HospitalCard({ hospital, rank, isOpen, onToggle }: Props) {
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
      className="rounded-lg transition-all"
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
      style={{
        border: isOpen ? "2px solid #3b5998" : "1px solid var(--border)",
        background: isOpen ? "var(--primary-soft)" : "var(--surface)",
        boxShadow: isOpen ? "0 0 0 2px rgba(59,89,152,0.2)" : "none",
      }}
    >
      {/* ── 요약 (항상 표시) ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        {/* 순위 뱃지 */}
        <span
          className="shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
          style={{
            width: 24,
            height: 24,
            backgroundColor: isOpen ? "#3b5998" : "var(--surface-muted)",
            color: isOpen ? "#ffffff" : "var(--text-muted)",
          }}
        >
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[var(--text-strong)]"
              style={{ fontSize: hospital.name.length > 12 ? "0.75rem" : "0.875rem" }}
            >
              {hospital.name}
            </span>
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px]"
              style={{
                backgroundColor: isOpen ? "var(--primary)" : "var(--surface-muted)",
                color: isOpen ? "#ffffff" : "var(--text-muted)",
                fontWeight: isOpen ? 700 : 500,
              }}
            >
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
          className="shrink-0 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? "var(--primary)" : "var(--text-subtle)",
          }}
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
        <div className="border-t border-[var(--primary)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text)]" style={{ borderColor: "rgba(59,130,246,0.3)" }}>
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
