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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
        onClick={onCancel}
        aria-hidden
      />

      {/* Card */}
      <div
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        style={{ position: "relative", width: 320, maxWidth: "85vw", padding: 24 }}
      >
        <div className="text-sm font-semibold text-[var(--fg)] text-center mb-5">
          {title}
          {description && (
            <div className="mt-1 font-normal text-[var(--text-muted)]">
              {description}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg font-bold text-sm border border-[var(--border)] text-[var(--fg)] bg-[var(--surface-muted)] hover:bg-[var(--bg)] active:scale-[0.98] transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg font-bold text-sm text-white active:scale-[0.98] transition"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
