// components/live/SttToggleWithConfirm.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";
import { encodeWav } from "@/lib/wav-encoder";
import { sttService } from "@/services/stt.service";
import { triageService } from "@/services/triage.service";
import { ktasService } from "@/services/ktas.service";

const SILENCE_THRESHOLD = 0.01; // RMS 무음 기준
const SILENCE_MS = 2000; // 무음 지속 시간 (2초)
const SILENCE_CHECK_MS = 200; // 무음 체크 간격 (200ms)

/**
 * AEGIS STT 수집 토글
 * - STT ON  → 마이크 녹음 시작, 2초 무음 감지 시 WAV 청크를 STT + PreKTAS로 전송
 * - STT OFF → 녹음 중지, 잔여 버퍼 전송
 */
export function SttToggleWithConfirm() {
  const [isOn, setIsOn] = useState(false);
  const [pendingNext, setPendingNext] = useState<null | boolean>(null);

  // 오디오 캡처 ref
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef(16000);
  const chunkIndexRef = useRef(0);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  // 무음 감지 ref
  const silenceStartRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** 현재 버퍼 → WAV 인코딩 → STT → PreKTAS 순차 전송 */
  const flushBuffer = useCallback(() => {
    // 로그 + KTAS 즉시 재조회
    window.dispatchEvent(new CustomEvent("aegis:refresh"));

    const frames = bufferRef.current;
    bufferRef.current = [];
    if (frames.length === 0) return;

    const totalLen = frames.reduce((s, f) => s + f.length, 0);
    if (totalLen === 0) return;

    const merged = new Float32Array(totalLen);
    let off = 0;
    for (const f of frames) {
      merged.set(f, off);
      off += f.length;
    }

    // 무음만 있는 버퍼는 전송 생략
    let rmsSum = 0;
    for (let i = 0; i < merged.length; i++) {
      rmsSum += merged[i] * merged[i];
    }
    const rms = Math.sqrt(rmsSum / merged.length);
    if (rms < SILENCE_THRESHOLD) return;

    const wavBlob = encodeWav(merged, sampleRateRef.current);
    const idx = ++chunkIndexRef.current;
    const filename = `recording_${idx}.wav`;

    // 이전 요청 완료 후 순차 실행
    queueRef.current = queueRef.current.then(async () => {
      try {
        const result = await sttService.recognize(wavBlob, undefined, filename);
        const text = result.text?.trim();
        console.log(`[STT #${idx}]`, text);

        if (!text) return;

        // PreKTAS 분류 호출
        const sid = sessionStorage.getItem("aegis_active_sessionId") ?? "default";
        const triageResult = await triageService.input({
          text,
          source: "stt",
          session_id: sid,
        });
        console.log(`[PreKTAS #${idx}]`, triageResult.state.final_ktas_level, triageResult.message);

        // dispatch 백엔드에 AI KTAS 등급 저장 → AssessmentPanel 반영
        const level = triageResult.state.final_ktas_level;
        const numSid = Number(sid);
        if (level && !isNaN(numSid)) {
          await ktasService.updateAi(numSid, {
            level,
            reasoning: triageResult.message,
          });
          console.log(`[KTAS #${idx}] updateAi → LV.${level}`);
        }
      } catch (err) {
        console.error(`[STT #${idx}] 실패:`, err);
      }
    });
  }, []);

  /** 녹음 시작 */
  const startRecording = useCallback(async () => {
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

      // ScriptProcessorNode — PCM 프레임 수집
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = proc;

      proc.onaudioprocess = (e) => {
        bufferRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      src.connect(analyser);
      analyser.connect(proc);
      proc.connect(ctx.destination);

      bufferRef.current = [];
      chunkIndexRef.current = 0;
      silenceStartRef.current = null;

      // 200ms마다 무음 체크
      const timeDomainData = new Float32Array(analyser.fftSize);

      silenceTimerRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(timeDomainData);

        let sum = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          sum += timeDomainData[i] * timeDomainData[i];
        }
        const rms = Math.sqrt(sum / timeDomainData.length);

        if (rms < SILENCE_THRESHOLD) {
          // 무음 감지
          if (silenceStartRef.current === null) {
            silenceStartRef.current = Date.now();
          } else if (Date.now() - silenceStartRef.current >= SILENCE_MS) {
            // 2초 무음 → flush
            console.log("[STT] 2초 무음 감지 → 청크 전송");
            flushBuffer();
            silenceStartRef.current = null;
          }
        } else {
          // 음성 감지 → 무음 타이머 리셋
          silenceStartRef.current = null;
        }
      }, SILENCE_CHECK_MS);
    } catch (err) {
      console.error("[STT] 마이크 접근 실패:", err);
      setIsOn(false);
    }
  }, [flushBuffer]);

  /** 녹음 중지 */
  const stopRecording = useCallback(() => {
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

    // 남은 버퍼 전송
    flushBuffer();
  }, [flushBuffer]);

  const openConfirm = (next: boolean) => setPendingNext(next);
  const closeConfirm = () => setPendingNext(null);

  const dialogCopy = useMemo(() => {
    if (pendingNext === null) return null;

    if (pendingNext) {
      return {
        title: "음성 인식을 켤까요?",
        description: "실시간 응급도 평가에 반영됩니다.",
        confirmText: "네",
        cancelText: "아니오",
      };
    }
    return {
      title: "음성 인식을 끌까요?",
      description: "실시간 응급도 평가 반영이 중지됩니다.",
      confirmText: "네",
      cancelText: "아니오",
    };
  }, [pendingNext]);

  const onPress = () => openConfirm(!isOn);

  const onConfirm = () => {
    if (pendingNext === null) return;
    setIsOn(pendingNext);

    if (pendingNext) {
      startRecording();
    } else {
      stopRecording();
    }

    closeConfirm();
  };

  return (
    <>
      <div className="relative shrink-0">
        {/* STT OFF 알림 callout */}
        {!isOn && (
          <div className="stt-alert-callout" role="alert">
            음성인식이 꺼져 있습니다
          </div>
        )}

        <button
          type="button"
          onClick={onPress}
          aria-label={isOn ? "음성 인식 켜짐" : "음성 인식 꺼짐"}
          className={`stt-toggle-btn shrink-0 flex items-center justify-center gap-2 w-[100px] h-10 rounded-lg font-bold text-sm transition active:scale-[0.97]${!isOn ? " stt-off" : ""}`}
        >
          {/* 마이크 아이콘 — OFF 시 슬래시 표시 */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
            {!isOn && <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />}
          </svg>
          <span>STT {isOn ? "ON" : "OFF"}</span>
        </button>
      </div>

      {dialogCopy && (
        <ConfirmDialog
          open={pendingNext !== null}
          title={dialogCopy.title}
          description={dialogCopy.description}
          confirmText={dialogCopy.confirmText}
          cancelText={dialogCopy.cancelText}
          onConfirm={onConfirm}
          onCancel={closeConfirm}
        />
      )}
    </>
  );
}
