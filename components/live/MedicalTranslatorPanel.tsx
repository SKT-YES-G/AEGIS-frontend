// components/live/MedicalTranslatorPanel.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PillActionButton } from "@/components/live/PillActionButton";


function SpeakerIcon() {
  // ✅ 스피커(소리) 모양 아이콘 (TTS 재생)
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"
        fill="currentColor"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RecordingWaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
      <line x1="4" y1="8" x2="4" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="5" x2="8" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="5" x2="16" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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

export default function MedicalTranslatorPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!prev) {
        timerRef.current = setTimeout(() => {
          setIsRecording(false);
          timerRef.current = null;
        }, 5000);
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ✅ 대화 내용이 바뀔 때마다 최하단으로 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sample = useMemo(
    () => ({
      modeTitle: "의료 통역 모드",
      subTitle: "Medical Translation Mode",
      patientLangLabel: "언어감지",
      patientLang: "English",
      medicLabel: "구급대원 (Paramedic)",
      patientLabel: "환자 (Patient)",
      medicKo: "어디가 가장 아프신가요?",
      medicEn: "Where does it hurt the most?",
      patientEn: "My chest feels like it's being squeezed.",
      patientKo: "가슴이 쥐어짜는 듯한 느낌입니다.",
    }),
    []
  );

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col min-h-0">
      {/* 언어 바 (상단) */}
      <div className="shrink-0 flex items-center justify-end gap-3 px-4 py-2 bg-[var(--surface)]">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm md:text-base font-semibold text-[var(--text-muted)]">
            {sample.patientLangLabel}:
          </span>
          <span className="text-sm md:text-base font-semibold text-[var(--text)]">
            {sample.patientLang}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {/* ✅ Paramedic bubble + (쉬운말변환 / TTS재생) */}
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
                label="쉬운말변환"
                ariaLabel="easy-translate"
                title="쉬운말변환"
                icon={<TranslateIcon />}
                onClick={() => alert("쉬운말변환(추후 연결)")}
              />

              <PillActionButton
                label="TTS재생"
                ariaLabel="tts-replay"
                title="TTS재생"
                icon={<SpeakerIcon />}
                onClick={() => alert("TTS 재생(추후 연결)")}
              />
            </div>
          </div>
        </div>

        {/* ✅ Patient bubble + (구급활동 반영 / TTS재생) */}
        <div className="flex justify-start">
          <div className="max-w-[85%] flex flex-col items-start gap-2">
            {/* Patient bubble */}
            <div className="rounded-2xl px-4 py-3 text-white" style={{ backgroundColor: "#22c55e" }}>
              <div className="text-xl opacity-90 mb-1">
                {sample.patientLabel}
              </div>
              <div className="text-xl">{sample.patientEn}</div>
              <div className="mt-1 text-xl opacity-90">
                ↳ {sample.patientKo}
              </div>
            </div>
            {/* ✅ 환자 말풍선 아래: [TTS재생] */}
            <div className="flex items-center justify-start gap-2 px-1">
              <PillActionButton
                label="TTS재생"
                ariaLabel="patient-tts-replay"
                title="TTS재생"
                icon={<SpeakerIcon />}
                onClick={() => alert("환자 발화 TTS 재생(추후 연결)")}
              />
            </div>
          </div>
        </div>

        {/* 구급대원: 통증 시작 시점 */}
        <div className="flex justify-end">
          <div className="max-w-[85%] flex flex-col items-end gap-2">
            <div className="rounded-2xl px-4 py-3 bg-[var(--primary)] text-[var(--primary-contrast)]">
              <div className="text-xl opacity-90 mb-1">{sample.medicLabel}</div>
              <div className="text-xl font-semibold">통증이 언제부터 시작됐나요?</div>
              <div className="mt-1 text-xl opacity-90">↳ When did the pain start?</div>
            </div>
            <div className="flex items-center justify-end gap-2 px-1">
              <PillActionButton label="쉬운말변환" ariaLabel="easy-translate-2" title="쉬운말변환" icon={<TranslateIcon />} onClick={() => {}} />
              <PillActionButton label="TTS재생" ariaLabel="tts-2" title="TTS재생" icon={<SpeakerIcon />} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* 환자: 통증 시작 시점 응답 */}
        <div className="flex justify-start">
          <div className="max-w-[85%] flex flex-col items-start gap-2">
            <div className="rounded-2xl px-4 py-3 text-white" style={{ backgroundColor: "#22c55e" }}>
              <div className="text-xl opacity-90 mb-1">{sample.patientLabel}</div>
              <div className="text-xl">About 30 minutes ago, suddenly.</div>
              <div className="mt-1 text-xl opacity-90">↳ 약 30분 전에 갑자기 시작됐습니다.</div>
            </div>
            <div className="flex items-center justify-start gap-2 px-1">
              <PillActionButton label="TTS재생" ariaLabel="tts-3" title="TTS재생" icon={<SpeakerIcon />} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* 구급대원: 알레르기/약물 확인 */}
        <div className="flex justify-end">
          <div className="max-w-[85%] flex flex-col items-end gap-2">
            <div className="rounded-2xl px-4 py-3 bg-[var(--primary)] text-[var(--primary-contrast)]">
              <div className="text-xl opacity-90 mb-1">{sample.medicLabel}</div>
              <div className="text-xl font-semibold">알레르기나 복용 중인 약이 있나요?</div>
              <div className="mt-1 text-xl opacity-90">↳ Do you have any allergies or medications?</div>
            </div>
            <div className="flex items-center justify-end gap-2 px-1">
              <PillActionButton label="쉬운말변환" ariaLabel="easy-translate-3" title="쉬운말변환" icon={<TranslateIcon />} onClick={() => {}} />
              <PillActionButton label="TTS재생" ariaLabel="tts-4" title="TTS재생" icon={<SpeakerIcon />} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* 환자: 알레르기/약물 응답 */}
        <div className="flex justify-start">
          <div className="max-w-[85%] flex flex-col items-start gap-2">
            <div className="rounded-2xl px-4 py-3 text-white" style={{ backgroundColor: "#22c55e" }}>
              <div className="text-xl opacity-90 mb-1">{sample.patientLabel}</div>
              <div className="text-xl">I take aspirin daily. No allergies.</div>
              <div className="mt-1 text-xl opacity-90">↳ 아스피린을 매일 복용합니다. 알레르기는 없습니다.</div>
            </div>
            <div className="flex items-center justify-start gap-2 px-1">
              <PillActionButton label="TTS재생" ariaLabel="tts-5" title="TTS재생" icon={<SpeakerIcon />} onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* ✅ 자동 스크롤 앵커 */}
        <div ref={chatEndRef} />
      </div>

      {/* 하단 마이크 바 */}
      <div className="shrink-0 flex items-center justify-center py-3 border-t border-[var(--border)] bg-[var(--surface)]">
        <button
          type="button"
          onClick={toggleRecording}
          className={[
            "h-12 w-12 rounded-full flex items-center justify-center transition-all",
            isRecording
              ? "bg-[var(--primary)] text-white scale-110 animate-pulse"
              : "bg-[var(--primary)] text-white",
          ].join(" ")}
          aria-label={isRecording ? "녹음 중지" : "녹음 시작"}
          title={isRecording ? "녹음 중지" : "녹음 시작"}
        >
          {isRecording ? <RecordingWaveIcon /> : <MicIcon />}
        </button>
      </div>
    </div>
  );
}
