// components/live/HospitalListPanel.tsx
"use client";

import type { Hospital } from "@/types/hospital";
import { HospitalCard } from "./HospitalCard";

type Props = {
  hospitals: Hospital[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function HospitalListPanel({ hospitals, selectedId, onSelect }: Props) {
  if (hospitals.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
        추천 병원 정보가 없습니다
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-[var(--border)] px-3 py-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          추천 병원 {hospitals.length}곳
        </span>
      </div>

      {/* 패널만 스크롤 */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-2">
        {hospitals.map((h) => (
          <HospitalCard
            key={h.hospitalId}
            hospital={h}
            isOpen={selectedId === h.hospitalId}
            onToggle={() => onSelect(h.hospitalId)}
          />
        ))}
      </div>
    </div>
  );
}
