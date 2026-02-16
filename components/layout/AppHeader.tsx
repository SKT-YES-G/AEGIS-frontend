// components/layout/AppHeader.tsx
"use client";

type Props = {
  title?: string;
  onOpenMenu?: () => void;
};

export function AppHeader({ title = "AEGIS Live", onOpenMenu }: Props) {

  return (
    <header
      className="h-14 w-full flex items-center justify-between px-4 border-b border-[var(--border)]"
      style={{ backgroundColor: "var(--header-bg)" }}
    >
      {/* 좌측: 메뉴 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg hover:bg-[var(--header-overlay-10)] text-[var(--header-fg)] text-xl"
          aria-label="메뉴"
          onClick={onOpenMenu}
        >
          ☰
        </button>

        <span className="text-xl font-semibold text-[var(--header-fg-muted)]">
          {title}
        </span>
      </div>

      {/* 가운데: 세션 표시 */}
      <div className="flex items-center gap-2 text-xl text-[var(--header-fg)]">
        <span className="font-semibold">AEGIS Live</span>
      </div>

      {/* 우측: 상태 */}
      <div className="flex items-center gap-3 text-[var(--header-fg)]">
        <span className="text-xl opacity-90">출동시각: </span>

      </div>
    </header>
  );
}
