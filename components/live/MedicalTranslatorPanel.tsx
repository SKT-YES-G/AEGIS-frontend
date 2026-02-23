// components/live/MedicalTranslatorPanel.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { encodeWav } from "@/lib/wav-encoder";
import { sttService } from "@/services/stt.service";


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

interface Props {
  sessionId: number | null;
}

export default function MedicalTranslatorPanel({ sessionId }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 녹음 관련 ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const accumulatedSamplesRef = useRef<Float32Array>(new Float32Array(0));
  const sampleRateRef = useRef(16000);

  /** 녹음 시작 */
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // 스트림 정리
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        chunksRef.current = [];

        // Blob → AudioBuffer → Float32 PCM
        const arrayBuf = await blob.arrayBuffer();
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        let audioBuf: AudioBuffer;
        try {
          audioBuf = await audioCtx.decodeAudioData(arrayBuf);
        } catch (err) {
          console.error("오디오 디코딩 실패:", err);
          await audioCtx.close();
          return;
        }
        sampleRateRef.current = audioBuf.sampleRate;
        const newSamples = audioBuf.getChannelData(0);
        await audioCtx.close();

        // 누적 연결: 기존 + 신규
        const prev = accumulatedSamplesRef.current;
        const merged = new Float32Array(prev.length + newSamples.length);
        merged.set(prev, 0);
        merged.set(newSamples, prev.length);
        accumulatedSamplesRef.current = merged;

        // WAV 인코딩
        const wavBlob = encodeWav(merged, sampleRateRef.current);
        setUploadCount((c) => c + 1);

        // STT API 호출
        try {
          const result = await sttService.recognize(wavBlob);
          console.log("STT 결과:", result.text);
        } catch (err) {
          console.error("STT 요청 실패:", err);
        }
      };

      recorder.start();
    } catch (err) {
      console.error("마이크 접근 실패:", err);
      setIsRecording(false);
    }
  }, [sessionId]);

  /** 녹음 중지 */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
  }, []);

  /** 마이크 버튼 토글 */
  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!prev) {
        // 녹음 시작
        startRecording();
        timerRef.current = setTimeout(() => {
          setIsRecording(false);
          stopRecording();
          timerRef.current = null;
        }, 5000);
      } else {
        // 녹음 중지
        stopRecording();
      }
      return !prev;
    });
  }, [startRecording, stopRecording]);

  // cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 대화 내용이 바뀔 때마다 최하단으로 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col min-h-0">
      {/* Body */}
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
        {/* ✅ 자동 스크롤 앵커 */}
        <div ref={chatEndRef} />
      </div>

      {/* 하단 마이크 바 */}
      <div className="shrink-0 flex items-center justify-center gap-3 py-3 border-t border-[var(--border)] bg-[var(--surface)]">
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
        {uploadCount > 0 && (
          <span className="text-xs text-[var(--text-muted)]">
            녹음 {uploadCount}회
          </span>
        )}
      </div>
    </div>
  );
}
