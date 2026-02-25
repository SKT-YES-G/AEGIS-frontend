// components/live/MedicalTranslatorPanel.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PillActionButton } from "@/components/live/PillActionButton";
import { encodeWav } from "@/lib/wav-encoder";
import { translateService } from "@/services/translate.service";
import { translationService } from "@/services/translation.service";

// ── 상수 ──
const MAX_RECORD_MS = 15_000;   // 최대 15초
const SILENCE_MS = 2_000;       // 무음 2초 → 자동 중지
const SILENCE_THRESHOLD = 0.01; // RMS 기준 무음 임계값
const SILENCE_CHECK_MS = 200;   // 무음 체크 주기

// ── 메시지 타입 ──
export interface TranslatorMessage {
  id: string;
  role: "paramedic" | "patient";
  text: string;           // 원문
  translated?: string;    // 번역문
  translationId?: number; // 백엔드 저장 ID
  type?: "normal" | "easy"; // easy = 쉬운말 변환 말풍선
}

// ── 아이콘 ──
function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path d="M4 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 8l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 8l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 16l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" fill="currentColor" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

// ── 말풍선 컴포넌트 ──
function ChatBubble({
  msg,
  onSimplify,
  simplifyLoading,
}: {
  msg: TranslatorMessage;
  onSimplify?: (msgId: string) => void;
  simplifyLoading?: boolean;
}) {
  const isParamedic = msg.role === "paramedic";
  const isEasy = msg.type === "easy";

  if (isEasy) {
    // 쉬운말 변환 말풍선 — 흐릿한 파란색, TTS만
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] flex flex-col items-end gap-2">
          <div
            className="rounded-2xl px-4 py-3 text-white"
            style={{ backgroundColor: "rgba(59,130,246,0.55)" }}
          >
            <div className="text-xl opacity-90 mb-1">쉬운말 변환</div>
            <div className="text-xl">{msg.text}</div>
          </div>
          <div className="flex items-center gap-2 px-1 justify-end">
            <PillActionButton
              label="TTS재생"
              icon={<SpeakerIcon />}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  const roleLabel = isParamedic ? "구급대원 (Paramedic)" : "환자 (Patient)";

  return (
    <div className={`flex ${isParamedic ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] flex flex-col ${isParamedic ? "items-end" : "items-start"} gap-2`}>
        {/* 말풍선 */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isParamedic
              ? "bg-[var(--primary)] text-[var(--primary-contrast)]"
              : "text-white"
          }`}
          style={!isParamedic ? { backgroundColor: "#22c55e" } : undefined}
        >
          <div className="text-xl opacity-90 mb-1">{roleLabel}</div>
          <div className={`text-xl ${isParamedic ? "font-semibold" : ""}`}>{msg.text}</div>
          {msg.translated && (
            <div className="mt-1 text-xl opacity-90">↳ {msg.translated}</div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className={`flex items-center gap-2 px-1 ${isParamedic ? "justify-end" : "justify-start"}`}>
          {isParamedic && (
            <PillActionButton
              label={simplifyLoading ? "변환중..." : "쉬운말변환"}
              icon={<TranslateIcon />}
              onClick={() => onSimplify?.(msg.id)}
            />
          )}
          <PillActionButton
            label="TTS재생"
            icon={<SpeakerIcon />}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

// ── 메인 패널 ──
interface Props {
  sessionId: number | null;
}

export default function MedicalTranslatorPanel({ sessionId }: Props) {
  const [messages, setMessages] = useState<TranslatorMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [simplifyingId, setSimplifyingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 세션의 기존 번역 기록 불러오기
  useEffect(() => {
    if (!sessionId) return;
    translationService.getAll(sessionId).then((list) => {
      const restored: TranslatorMessage[] = [];
      for (const t of list) {
        restored.push({
          id: String(t.translationId),
          role: t.speaker === "patient" ? "patient" as const : "paramedic" as const,
          text: t.originalText,
          translated: t.translatedText,
          translationId: t.translationId,
        });
        // 쉬운말 변환이 있으면 바로 아래에 easy 말풍선 추가
        if (t.easyTranslation) {
          restored.push({
            id: `${t.translationId}-easy`,
            role: "paramedic",
            text: t.easyTranslation,
            type: "easy",
          });
        }
      }
      setMessages(restored);
    }).catch((err) => {
      console.error("[Translate] 기존 기록 불러오기 실패:", err);
    });
  }, [sessionId]);

  // 오디오 캡처 refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef(16000);

  // 타이머 refs
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const isStoppingRef = useRef(false);

  /** 녹음 리소스 정리 */
  const cleanup = useCallback(() => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    silenceStartRef.current = null;

    processorRef.current?.disconnect();
    processorRef.current = null;
    analyserRef.current = null;

    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  /** 녹음 중지 + WAV 전송 */
  const stopAndSend = useCallback(async () => {
    // 중복 중지 방지
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    setIsRecording(false);
    cleanup();

    // 버퍼 취합
    const frames = bufferRef.current;
    bufferRef.current = [];
    const totalLen = frames.reduce((s, f) => s + f.length, 0);

    if (totalLen === 0) {
      console.warn("[Translate] 녹음 데이터 없음");
      isStoppingRef.current = false;
      return;
    }

    const merged = new Float32Array(totalLen);
    let off = 0;
    for (const f of frames) {
      merged.set(f, off);
      off += f.length;
    }

    // 무음 체크 — RMS가 임계값 미만이면 전송하지 않음
    let sum = 0;
    for (let i = 0; i < merged.length; i++) {
      sum += merged[i] * merged[i];
    }
    const rms = Math.sqrt(sum / merged.length);
    if (rms < SILENCE_THRESHOLD) {
      console.warn("[Translate] 무음만 감지됨 — 전송 생략");
      isStoppingRef.current = false;
      return;
    }

    const wavBlob = encodeWav(merged, sampleRateRef.current);
    console.log(`[Translate] WAV 생성: ${(wavBlob.size / 1024).toFixed(1)} KB, RMS: ${rms.toFixed(4)}`);

    // API 호출
    setIsSending(true);
    try {
      const result = await translateService.audio(wavBlob, {
        sessionId: sessionId ? String(sessionId) : undefined,
      });
      console.log("[Translate] 결과:", result);

      const msgId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newMsg: TranslatorMessage = {
        id: msgId,
        role: result.speaker === "patient" ? "patient" : "paramedic",
        text: result.source_text,
        translated: result.translated_text,
      };
      setMessages((prev) => [...prev, newMsg]);

      // 백엔드에 번역 기록 저장
      if (sessionId) {
        try {
          const saved = await translationService.save(sessionId, {
            speaker: result.speaker,
            originalText: result.source_text,
            translatedText: result.translated_text,
            language: result.source_lang,
          });
          console.log("[Translate] 백엔드 저장 완료:", saved.translationId);
          // translationId 업데이트
          setMessages((prev) =>
            prev.map((m) => m.id === msgId ? { ...m, translationId: saved.translationId } : m),
          );
        } catch (saveErr) {
          console.error("[Translate] 백엔드 저장 실패:", saveErr);
        }
      }
    } catch (err) {
      console.error("[Translate] 실패:", err);
    } finally {
      setIsSending(false);
      isStoppingRef.current = false;
    }
  }, [cleanup, sessionId]);

  /** 녹음 시작 */
  const startRecording = useCallback(async () => {
    isStoppingRef.current = false;
    bufferRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1 },
      });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = ctx;
      sampleRateRef.current = ctx.sampleRate;

      const src = ctx.createMediaStreamSource(stream);

      // AnalyserNode — 무음 감지용
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // ScriptProcessorNode — PCM 캡처
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = proc;

      proc.onaudioprocess = (e) => {
        bufferRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      src.connect(analyser);
      analyser.connect(proc);
      proc.connect(ctx.destination);

      // 15초 최대 타이머
      maxTimerRef.current = setTimeout(() => {
        console.log("[Translate] 15초 최대 녹음 도달");
        stopAndSend();
      }, MAX_RECORD_MS);

      // 무음 감지 (200ms 주기)
      silenceStartRef.current = null;
      const timeDomainData = new Float32Array(analyser.fftSize);

      silenceTimerRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(timeDomainData);

        // RMS 계산
        let sum = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          sum += timeDomainData[i] * timeDomainData[i];
        }
        const rms = Math.sqrt(sum / timeDomainData.length);

        if (rms < SILENCE_THRESHOLD) {
          // 무음 시작
          if (silenceStartRef.current === null) {
            silenceStartRef.current = Date.now();
          } else if (Date.now() - silenceStartRef.current >= SILENCE_MS) {
            console.log("[Translate] 2초 무음 감지 → 자동 중지");
            stopAndSend();
          }
        } else {
          // 소리 감지 → 무음 타이머 초기화
          silenceStartRef.current = null;
        }
      }, SILENCE_CHECK_MS);

      console.log("[Translate] 녹음 시작");
    } catch (err) {
      console.error("[Translate] 마이크 접근 실패:", err);
      setIsRecording(false);
      isStoppingRef.current = false;
    }
  }, [stopAndSend]);

  /** 쉬운말 변환 */
  const handleSimplify = useCallback(async (msgId: string) => {
    const target = messages.find((m) => m.id === msgId);
    if (!target || target.type === "easy") return;

    // 이미 easy 말풍선이 바로 아래에 있으면 무시
    const idx = messages.findIndex((m) => m.id === msgId);
    if (idx < messages.length - 1 && messages[idx + 1]?.type === "easy") return;

    setSimplifyingId(msgId);
    try {
      // AI 서버로 쉬운말 변환
      const textToSimplify = target.translated ?? target.text;
      const result = await translateService.simplify(textToSimplify);
      console.log("[Simplify] 결과:", result);

      const easyMsg: TranslatorMessage = {
        id: `${msgId}-easy`,
        role: "paramedic",
        text: result.simplified_text,
        type: "easy",
      };

      // 원본 메시지 바로 아래에 삽입
      setMessages((prev) => {
        const i = prev.findIndex((m) => m.id === msgId);
        if (i === -1) return [...prev, easyMsg];
        const next = [...prev];
        next.splice(i + 1, 0, easyMsg);
        return next;
      });

      // 백엔드에도 저장
      if (sessionId && target.translationId) {
        try {
          await translationService.generateEasy(sessionId, target.translationId);
          console.log("[Simplify] 백엔드 저장 완료");
        } catch (saveErr) {
          console.error("[Simplify] 백엔드 저장 실패:", saveErr);
        }
      }
    } catch (err) {
      console.error("[Simplify] 실패:", err);
    } finally {
      setSimplifyingId(null);
    }
  }, [messages, sessionId]);

  /** 마이크 버튼 토글 */
  const toggleRecording = useCallback(() => {
    if (isSending) return; // 전송 중에는 무시

    if (!isRecording) {
      setIsRecording(true);
      startRecording();
    } else {
      stopAndSend();
    }
  }, [isRecording, isSending, startRecording, stopAndSend]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // 새 메시지 추가 시 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col min-h-0">
      {/* 채팅 영역 */}
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {messages.length === 0 && !isSending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 select-none opacity-70 pointer-events-none">
            <div className="text-center space-y-2 px-4">
              <p className="text-base font-semibold text-[var(--text)]">
                하단의 마이크 버튼을 눌러 대화를 시작하세요
              </p>
              <div className="text-sm text-[var(--text-muted)] space-y-1">
                <p>환자 또는 구급대원의 음성을 자동으로 인식하고</p>
                <p>실시간으로 번역합니다.</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            msg={msg}
            onSimplify={handleSimplify}
            simplifyLoading={simplifyingId === msg.id}
          />
        ))}

        {/* 번역 중 표시 */}
        {isSending && (
          <div className="flex justify-center">
            <span className="text-sm text-[var(--muted)] animate-pulse">번역 중...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 하단 마이크 바 */}
      <div className="shrink-0 flex items-center justify-center gap-3 py-3 border-t border-[var(--border)] bg-[var(--surface)]">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isSending}
          className={[
            "h-12 w-12 rounded-full flex items-center justify-center transition-all",
            isSending
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isRecording
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
