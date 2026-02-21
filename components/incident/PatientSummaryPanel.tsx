// components/incident/PatientSummaryPanel.tsx
"use client";

/**
 * PatientSummaryPanel
 * - 출동요약 페이지 우측: 환자증상 + 활력징후 요약
 * - 현재 Mock 데이터 기반 (백엔드 연동 전)
 */

const MOCK_SYMPTOMS = {
  incidentType: "질병",
  symptoms: ["흉통", "호흡곤란", "어지러움"],
  history: ["고혈압", "당뇨"],
  consciousness: "A (ALERT)",
  chiefComplaint: "갑작스러운 흉통 및 호흡곤란",
  opinion: "급성 흉통 발생, 심근경색 의심. 즉시 이송 필요.",
};

const MOCK_VITALS = {
  sbp: 148,
  dbp: 92,
  hr: 102,
  rr: 24,
  spo2: 94,
  temp: 36.8,
  glucose: 186,
  measuredAt: "17:26",
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="h-9 md:h-11 px-3 md:px-4 flex items-center border-b border-[var(--border)]">
      <span className="text-xs md:text-sm font-extrabold text-[var(--text-strong)]">
        {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-2 border-b border-[var(--border)] last:border-b-0">
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
          className="inline-flex items-center h-6 px-2 rounded-md text-xs font-semibold border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] text-[var(--fg)]"
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
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-2 md:p-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_70%,transparent)]">
      <div className="text-[10px] md:text-xs font-bold text-[var(--muted)]">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-base md:text-lg font-black text-[var(--fg)]">
          {value}
        </span>
        <span className="text-[10px] md:text-xs font-semibold text-[var(--text-subtle)]">
          {unit}
        </span>
      </div>
    </div>
  );
}

export function PatientSummaryPanel() {
  return (
    <section className="aegis-surface-strong h-full min-h-0 overflow-hidden flex flex-col">
      {/* 헤더 */}
      <div className="h-10 md:h-14 px-3 md:px-4 flex items-center border-b border-[var(--border)] shrink-0" style={{ backgroundColor: "var(--panel-header-bg)" }}>
        <div className="text-sm md:text-xl font-semibold" style={{ color: "var(--panel-header-fg)" }}>
          환자 요약
        </div>
      </div>

      {/* 본문 스크롤 */}
      <div className="flex-1 min-h-0 overflow-auto">
        {/* 환자 증상 섹션 */}
        <SectionHeader title="환자 증상" />
        <div className="p-3 md:p-4 flex flex-col gap-1">
          <InfoRow label="발생 유형" value={MOCK_SYMPTOMS.incidentType} />
          <InfoRow label="주호소" value={MOCK_SYMPTOMS.chiefComplaint} />
          <div className="flex gap-2 py-2 border-b border-[var(--border)]">
            <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-[var(--muted)] shrink-0">
              증상
            </div>
            <div className="flex-1">
              <ChipList items={MOCK_SYMPTOMS.symptoms} />
            </div>
          </div>
          <div className="flex gap-2 py-2 border-b border-[var(--border)]">
            <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-[var(--muted)] shrink-0">
              병력
            </div>
            <div className="flex-1">
              <ChipList items={MOCK_SYMPTOMS.history} />
            </div>
          </div>
          <InfoRow label="의식 상태" value={MOCK_SYMPTOMS.consciousness} />
          <InfoRow label="평가소견" value={MOCK_SYMPTOMS.opinion} />
        </div>

        {/* 활력징후 섹션 */}
        <div className="aegis-divider" />
        <SectionHeader title="활력징후" />
        <div className="p-3 md:p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <VitalCard
              label="최고혈압"
              value={MOCK_VITALS.sbp}
              unit="mmHg"
            />
            <VitalCard
              label="최저혈압"
              value={MOCK_VITALS.dbp}
              unit="mmHg"
            />
            <VitalCard
              label="맥박"
              value={MOCK_VITALS.hr}
              unit="회/min"
            />
            <VitalCard
              label="호흡"
              value={MOCK_VITALS.rr}
              unit="회/min"
            />
            <VitalCard
              label="SpO2"
              value={MOCK_VITALS.spo2}
              unit="%"
            />
            <VitalCard
              label="체온"
              value={MOCK_VITALS.temp}
              unit="℃"
            />
            <VitalCard
              label="혈당"
              value={MOCK_VITALS.glucose}
              unit="mg/dL"
            />
            <VitalCard
              label="측정시간"
              value={MOCK_VITALS.measuredAt}
              unit=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
