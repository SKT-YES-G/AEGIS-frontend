// components/layout/AppHeader.tsx
"use client";

type Props = {
  title?: string;
  onOpenMenu?: () => void;
};

export function AppHeader({ title = "AEGIS Live", onOpenMenu }: Props) {

  return (
    <header
      className="relative h-12 md:h-14 w-full flex items-center justify-between px-2 md:px-4 border-b border-[var(--border)]"
      style={{ backgroundColor: "var(--header-bg)" }}
    >
      {/* 좌측: 메뉴 */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg hover:bg-[var(--header-overlay-10)] text-[var(--header-fg)] text-xl"
          aria-label="메뉴"
          onClick={onOpenMenu}
        >
          ☰
        </button>

        <span className="text-sm md:text-xl font-semibold text-[var(--header-title-fg)]">
          {title}
        </span>
      </div>

      {/* 중앙: AEGIS */}
      <span className="absolute left-1/2 -translate-x-1/2 text-base md:text-2xl font-bold text-[var(--header-fg)]">
        AEGIS
      </span>

      {/* 우측: 슬롯 */}
      <div className="flex items-center gap-2 md:gap-4 text-sm md:text-xl text-[var(--header-fg)]">
        <div id="header-center-slot" />
      </div>
    </header>
  );
}
