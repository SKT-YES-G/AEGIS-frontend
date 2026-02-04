// components/layout/TopBar.tsx
"use client";

export function TopBar({ missionId }: { missionId: string }) {
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b bg-slate-950 text-white">
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">{missionId}</span>
        <span className="font-semibold">AEGIS · LIVE MISSION</span>
        <span className="text-xs opacity-60">병원 현황 지도</span>
      </div>

      <button className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">
        출동 종료
      </button>
    </header>
  );
}
