// components/live/MedicalTranslatorPanel.tsx
"use client";

import { useMemo } from "react";
import { PillActionButton } from "@/components/live/PillActionButton";

type Props = {
  onClose?: () => void;
};

function ReplayIcon() {
  // ✅ "되돌이표(↻)" 느낌의 다시듣기 아이콘 (TTS 재생/재출력)
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TranslateIcon() {
  // ✅ "양방향 번역/교환(⇄)" 느낌의 아이콘
  // - currentColor 기반이라 PillActionButton의 text 색상 토큰을 그대로 따라감
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      {/* 위쪽: 왼쪽으로 향하는 화살표(←) */}
      <path
        d="M4 8h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 8l3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8l3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 아래쪽: 오른쪽으로 향하는 화살표(→) */}
      <path
        d="M20 16H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 16l-3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16l-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MedicalTranslatorPanel({ onClose }: Props) {
  const sample = useMemo(
    () => ({
      modeTitle: "의료 통역 모드",
      subTitle: "Medical Translation Mode (언어 자동감지)",
      patientLangLabel: "환자언어",
      patientLang: "English",
      medicLabel: "구급대원 (Paramedic)",
      patientLabel: "환자 (Patient)",
      medicKo: "어디가 가장 아프신가요?",
      medicEn: "Where does it hurt the most?",
      patientEn: "My chest feels like it's being squeezed.",
      patientKo: "[통역] 가슴이 쥐어짜는 듯한 느낌입니다.",
    }),
    []
  );

  return (
    <div className="h-full w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-[var(--fg)]">
            {sample.modeTitle}
          </div>
          <div className="text-xl text-[var(--muted)]">{sample.subTitle}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xl text-[var(--muted)]">
            {sample.patientLangLabel}:
          </label>
          <select
            className="h-8 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2 text-xl text-[var(--fg)]"
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
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {/* ✅ Paramedic bubble + (쉬운번역기 / 다시듣기) */}
        <div className="flex justify-end">
          <div className="max-w-[85%] flex flex-col items-end gap-2">
            <div className="rounded-2xl px-4 py-3 bg-[var(--primary)] text-[var(--primary-contrast)]">
              <div className="text-xl opacity-90 mb-1">{sample.medicLabel}</div>
              <div className="text-xl font-semibold">{sample.medicKo}</div>
              <div className="mt-1 text-xl opacity-90">↳ {sample.medicEn}</div>
            </div>

            {/* ✅ 액션 버튼 2개 (말풍선 아래) */}
            <div className="flex items-center justify-end gap-2 px-1">
              <PillActionButton
                label="쉬운번역기"
                ariaLabel="easy-translate"
                title="쉬운번역기"
                icon={<TranslateIcon />}
                onClick={() => alert("쉬운번역기(추후 연결)")}
              />

              <PillActionButton
                label="다시듣기"
                ariaLabel="tts-replay"
                title="다시듣기"
                icon={<ReplayIcon />}
                onClick={() => alert("TTS 다시듣기(추후 연결)")}
              />
            </div>
          </div>
        </div>

        {/* ✅ Patient bubble + (구급활동 반영 / 다시듣기) */}
        <div className="flex justify-start">
          <div className="max-w-[85%] flex flex-col items-start gap-2">
            {/* Patient bubble */}
            <div className="rounded-2xl px-4 py-3 border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]">
              <div className="text-xl text-[var(--muted)] mb-1">
                {sample.patientLabel}
              </div>
              <div className="text-xl">{sample.patientEn}</div>
              <div className="mt-1 text-xl text-[var(--primary)]">
                ↳ {sample.patientKo}
              </div>
            </div>
            {/* ✅ 환자 말풍선 아래: [다시듣기] */}
            <div className="flex items-center justify-start gap-2 px-1">
              <PillActionButton
                label="다시듣기"
                ariaLabel="patient-tts-replay"
                title="다시듣기"
                icon={<ReplayIcon />}
                onClick={() => alert("환자 발화 다시듣기(추후 연결)")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
