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
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          className="font-semibold transition-all active:scale-[0.98]"
          onClick={onPress}
          aria-label={isOn ? "음성 인식 켜짐" : "음성 인식 꺼짐"}
        >
          {/* 토글 트랙 */}
          <span
            className="relative inline-flex items-center shrink-0 rounded-full transition-colors duration-200"
            style={{
              width: 64,
              height: 30,
              backgroundColor: isOn ? "var(--toggle-track-on)" : "var(--toggle-track-off)",
            }}
          >
            {/* ON/OFF 텍스트 */}
            <span
              className="absolute inset-0 flex items-center text-[10px] font-bold select-none"
              style={{
                justifyContent: isOn ? "flex-start" : "flex-end",
                padding: "0 10px",
                color: isOn ? "#ffffff" : "var(--toggle-text-off)",
              }}
            >
              {isOn ? "ON" : "OFF"}
            </span>
            {/* 원형 노브 */}
            <span
              className="inline-block rounded-full shadow transition-transform duration-200"
              style={{
                backgroundColor: "#ffffff",
                width: 24,
                height: 24,
                position: "absolute",
                top: 3,
                transform: isOn ? "translateX(37px)" : "translateX(3px)",
              }}
            />
          </span>
        </button>
        <span className="text-[10px] font-bold text-[var(--text)]">STT입력</span>
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
