// components/live/HospitalListPanel.tsx
"use client";

import type { Hospital } from "@/types/hospital";
import { HospitalCard } from "./HospitalCard";

type Props = {
  hospitals: Hospital[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function HospitalListPanel({ hospitals, selectedId, onSelect, onRefresh, refreshing }: Props) {
  if (hospitals.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
        추천 병원 정보가 없습니다
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-[var(--border)] px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text)]">
          추천순
        </span>

        {onRefresh && (
          <button
            type="button"
            onClick={() => { if (!refreshing) onRefresh(); }}
            disabled={refreshing}
            aria-label="병원 목록 새로고침"
            className="h-7 w-[90px] flex items-center justify-center gap-1 rounded-md active:scale-[0.92] transition text-[11px] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--surface-muted)",
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={refreshing ? "refresh-spin" : ""}
            >
              <path d="M21.5 2v6h-6" />
              <path d="M2.5 22v-6h6" />
              <path d="M2.5 11.5a10 10 0 0 1 16.5-5.5L21.5 8" />
              <path d="M21.5 12.5a10 10 0 0 1-16.5 5.5L2.5 16" />
            </svg>
            {refreshing ? "새로고침중" : "새로고침"}
          </button>
        )}
      </div>

      {/* 패널만 스크롤 */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-2">
        {hospitals.map((h, i) => (
          <HospitalCard
            key={h.hospitalId}
            hospital={h}
            rank={i + 1}
            isOpen={selectedId === h.hospitalId}
            onToggle={() => onSelect(h.hospitalId)}
          />
        ))}
      </div>

      <style>{`
        @keyframes refresh-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .refresh-spin {
          animation: refresh-spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
