// components/layout/AppHeader.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Tab({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "px-4 py-2 rounded-full text-sm font-semibold transition",
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isMenu = pathname === "/menu_select";
  const isLive = pathname.startsWith("/live");

  return (
    <header
      className="h-14 w-full flex items-center justify-between px-4 shadow-sm"
      style={{ backgroundColor: "var(--navy-primary)" }}
    >
      {/* 좌측: 토글 느낌 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg hover:bg-white/10 text-white text-xl"
          aria-label="메뉴"
          onClick={() => alert("사이드 메뉴는 추후 연결")}
        >
          ☰
        </button>

        <div className="flex items-center gap-2">
          <span className="text-white/80 text-sm font-semibold">다크모드</span>

          {/* 토글(모양만) */}
          <button
            type="button"
            className="h-7 w-14 rounded-full bg-blue-500/90 relative"
            aria-label="다크모드"
            onClick={() => alert("다크모드 기능은 추후 연결")}
          >
            <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
            <span className="absolute left-2 top-[6px] text-[11px] font-bold text-white">
              ON
            </span>
          </button>
        </div>
      </div>

      {/* 가운데: 탭 */}
      <nav className="flex items-center gap-2">
        <Tab label="AEGIS Live" href="/menu_select" active={isMenu} />
        <div className="text-white/30">|</div>
        <Tab label="추가질문" href="/live" active={isLive} />
        {/* 뱃지 느낌 */}
        <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-2 rounded-full bg-sky-400 text-[11px] font-bold text-slate-900">
          7
        </span>
      </nav>

      {/* 우측: 시간/알림/더보기 */}
      <div className="flex items-center gap-3 text-white">
        <span className="text-sm font-semibold opacity-90">오후 8:41</span>

        <button
          type="button"
          className="h-9 w-9 rounded-lg hover:bg-white/10 text-lg"
          aria-label="알림"
          onClick={() => alert("알림은 추후 연결")}
        >
          🔔
        </button>

        <button
          type="button"
          className="h-9 w-9 rounded-lg hover:bg-white/10 text-lg"
          aria-label="더보기"
          onClick={() => alert("더보기는 추후 연결")}
        >
          ⋮
        </button>
      </div>
    </header>
  );
}
