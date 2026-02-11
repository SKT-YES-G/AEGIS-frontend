// components/live/ConfirmDialog.tsx
"use client";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string; // 기본: "네"
  cancelText?: string;  // 기본: "아니오"
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "네",
  cancelText = "아니오",
  onConfirm,
  onCancel,
}: Props) {
  // ✅ open=false면 렌더는 하되 클릭 차단만 풀지 않도록(또는 null 반환)도 가능.
  // 현재는 단순하게 null 반환해도 훅이 없으므로 안전.
  if (!open) return null;

  return (
    <>
      {/* Overlay: 반드시 화면 전체를 덮어야 하므로 style로 fixed 강제 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.55)",
        }}
        onClick={onCancel}
        aria-hidden
      />

      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="aegis-surface-strong"
          style={{
            width: "min(520px, 92vw)",
            overflow: "hidden",
          }}
        >
          {/* 헤더 */}
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <div className="text-xl font-bold text-[var(--text-strong)]">
              {title}
            </div>
            {description && (
              <div className="mt-1 text-xl text-[var(--text-muted)]">
                {description}
              </div>
            )}
          </div>

          {/* 액션 */}
          <div className="p-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="aegis-btn"
              onClick={onCancel}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className="aegis-btn aegis-btn--danger"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
