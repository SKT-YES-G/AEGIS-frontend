// components/live/MedicalTranslatorPanel.tsx
// 번역기 UI: "로그 상단에 끼워넣는" 전용 패널
// - 실제 번역 로직은 추후 services로 분리 (현재는 UI 예시)
// - 현장 가독성/터치 영역을 우선: 큰 타이틀, 명확한 구분선, 단순한 컨트롤

"use client";

import { useMemo } from "react";

type Props = {
  onClose?: () => void; // 우측 상단 X 버튼 (선택)
};

export default function MedicalTranslatorPanel({ onClose }: Props) {
  // 예시 데이터(3번째 이미지 느낌)
  const sample = useMemo(
    () => ({
      modeTitle: "의료 통역 모드",
      subTitle: "Medical Translation Mode (Auto-Detect)",
      patientLangLabel: "환자언어",
      patientLang: "English",
      medicLabel: "구급대원 (Paramedic)",
      patientLabel: "환자 (Patient)",
      medicKo: "어디가 가장 아프신가요?",
      medicEn: "Where does it hurt the most?",
      patientEn: "My chest feels like it's being squeezed.",
      patientKo: "[통역] 가슴이 쥐어짜는 듯한 느낌입니다.",
      applyBtn: "구급활동 반영",
    }),
    []
  );

  return (
    <div className="h-full w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--fg)]">{sample.modeTitle}</div>
          <div className="text-xs text-[var(--muted)]">{sample.subTitle}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-[var(--muted)]">{sample.patientLangLabel}:</label>
          <select
            className="h-8 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2 text-sm text-[var(--fg)]"
            defaultValue={sample.patientLang}
            aria-label="patient-language"
          >
            <option>Auto</option>
            <option>English</option>
            <option>中文</option>
            <option>日本語</option>
            <option>Tiếng Việt</option>
          </select>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]"
              aria-label="close-translator"
              title="닫기"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Paramedic bubble */}
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-[var(--primary)] text-[var(--primary-contrast)]">
            <div className="text-xs opacity-90 mb-1">{sample.medicLabel}</div>
            <div className="text-sm font-semibold">{sample.medicKo}</div>
            <div className="mt-1 text-xs opacity-90">↳ {sample.medicEn}</div>
          </div>
        </div>

        {/* Patient bubble */}
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]">
            <div className="text-xs text-[var(--muted)] mb-1">{sample.patientLabel}</div>
            <div className="text-sm">{sample.patientEn}</div>
            <div className="mt-1 text-xs text-[var(--primary)]">↳ {sample.patientKo}</div>

            <div className="mt-3">
              <button
                type="button"
                className="h-9 rounded-xl px-3 border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--fg)]"
              >
                {sample.applyBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
