// components/live/SttToggleWithConfirm.tsx
"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";

/**
 * AEGIS STT 수집 토글
 * - 태블릿 우선 / 스트레스 환경
 * - 마이크 아이콘 + 명확한 ON/OFF 상태 표시
 * - 최소 48px 터치 타겟
 */
export function SttToggleWithConfirm() {
  const [isOn, setIsOn] = useState(false);
  const [pendingNext, setPendingNext] = useState<null | boolean>(null);

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
    closeConfirm();
  };

  return (
    <>
      <button
        type="button"
        onClick={onPress}
        aria-label={isOn ? "음성 인식 켜짐" : "음성 인식 꺼짐"}
        className="shrink-0 flex items-center gap-2 h-10 px-3 rounded-lg font-bold text-xs transition active:scale-[0.97]"
        style={{
          backgroundColor: isOn ? "var(--primary)" : "var(--surface-muted)",
          color: isOn ? "#ffffff" : "var(--text-muted)",
          border: isOn ? "none" : "1px solid var(--border)",
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
