// components/live/VitalsPanel.tsx
"use client";

import { useVitals } from "@/hooks/useVitals";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export function VitalsPanel() {
  const { data, loading, error } = useVitals();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-slate-800">활력 징후 (Vital Signs)</div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md border text-sm">기록(Log)</button>
          <button className="px-3 py-1 rounded-md border text-sm">
            {data?.source === "device" ? "DEVICE" : "MANUAL"}
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500">바이탈 로딩 중...</div>}
      {error && <div className="text-sm text-rose-600">바이탈 로드 실패: {error.message}</div>}

      {data && (
        <div className="grid grid-cols-3 gap-3">
          <Field label="혈압 (mmHg)" value={`${data.sbp} / ${data.dbp}`} />
          <Field label="맥박 (BPM)" value={`${data.hr}`} />
          <Field label="SpO₂ (%)" value={`${data.spo2}`} />
          <Field label="체온 (°C)" value={`${data.temp.toFixed(1)}`} />
          <Field label="호흡 (회/분)" value={`${data.rr}`} />
          <Field label="업데이트" value={new Date(data.updatedAt).toLocaleTimeString("ko-KR")} />
        </div>
      )}
    </section>
  );
}
