// components/live/SttToggleWithConfirm.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";
import { encodeWav } from "@/lib/wav-encoder";
import { sttService } from "@/services/stt.service";

const CHUNK_MS = 5000; // 5초마다 청크 전송

/**
 * AEGIS STT 수집 토글
 * - STT ON  → 마이크 녹음 시작, 5초마다 WAV 청크를 /stt/clova 로 전송
 * - STT OFF → 녹음 중지, 잔여 버퍼 전송
 */
export function SttToggleWithConfirm() {
  const [isOn, setIsOn] = useState(false);
  const [pendingNext, setPendingNext] = useState<null | boolean>(null);

  // 오디오 캡처 ref
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const bufferRef = useRef<Float32Array[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampleRateRef = useRef(16000);
  const chunkIndexRef = useRef(0);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  /** 현재 버퍼 → WAV 인코딩 → 큐에 추가 (이전 요청 완료 후 순차 전송) */
  const flushBuffer = useCallback(() => {
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

    const wavBlob = encodeWav(merged, sampleRateRef.current);
    const idx = ++chunkIndexRef.current;
    const filename = `recording_${idx}.wav`;

    // 이전 요청 완료 후 순차 실행
    queueRef.current = queueRef.current.then(async () => {
      try {
        const result = await sttService.recognize(wavBlob, undefined, filename);
        console.log(`[STT #${idx}]`, result.text);
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
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = proc;

      proc.onaudioprocess = (e) => {
        bufferRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      src.connect(proc);
      proc.connect(ctx.destination);

      bufferRef.current = [];
      chunkIndexRef.current = 0;
      intervalRef.current = setInterval(flushBuffer, CHUNK_MS);
    } catch (err) {
      console.error("[STT] 마이크 접근 실패:", err);
      setIsOn(false);
    }
  }, [flushBuffer]);

  /** 녹음 중지 */
  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    processorRef.current?.disconnect();
    processorRef.current = null;

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
      <button
        type="button"
        onClick={onPress}
        aria-label={isOn ? "음성 인식 켜짐" : "음성 인식 꺼짐"}
        className={`shrink-0 flex items-center gap-2 h-10 px-3 rounded-lg font-bold text-xs transition active:scale-[0.97]${isOn ? " stt-blink" : ""}`}
        style={{
          backgroundColor: isOn ? "var(--primary)" : "var(--danger)",
          color: "#ffffff",
          border: "none",
        }}
      >
        {/* 마이크 아이콘 */}
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
        </svg>
        <span>STT {isOn ? "ON" : "OFF"}</span>
      </button>

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
