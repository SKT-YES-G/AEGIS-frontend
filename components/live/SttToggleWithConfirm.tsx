// components/live/SttToggleWithConfirm.tsx
"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";

/**
 * AEGIS STT 수집 토글
 * - 기본 OFF
 * - ON/OFF 전환 시마다 확인 팝업
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
        description: "켜면 현장 대화가 실시간으로 텍스트로 변환됩니다.",
        confirmText: "네",
        cancelText: "아니오",
      };
    }
    return {
      title: "음성 인식을 끌까요?",
      description: "끄면 음성 인식(STT)이 중지됩니다.",
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

    const btnClass = [
    "h-12 w-12 rounded-full flex items-center justify-center",
    "border border-[var(--border-strong)]",
    "text-white",
    "active:scale-[0.98] transition",
    isOn
        ? "bg-[var(--success)]"   // 🟢 STT ON
        : "bg-[var(--danger)]",   // 🔴 STT OFF
    ].join(" ");


  return (
    <>
      <button
  type="button"
  className={[
    "h-12 w-12 rounded-full flex items-center justify-center",
    "border border-[var(--border-strong)]",
    "text-white",
    "active:scale-[0.98] transition",
  ].join(" ")}
  style={{
  backgroundColor: isOn ? "var(--success)" : "var(--danger)",
}}

  onClick={onPress}
  aria-label={isOn ? "음성 인식 켜짐" : "음성 인식 꺼짐"}
>
        {/* 아이콘은 그대로 */}
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
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
          {!isOn && (
            <line
              x1="4"
              y1="4"
              x2="20"
              y2="20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </svg>
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
