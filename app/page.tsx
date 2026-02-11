// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import "@/styles/components.css";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div
        className="w-full max-w-md overflow-hidden aegis-surface"
        style={{ borderRadius: "1.25rem" }} // rounded-2xl
      >
        {/* 상단 헤더(긴급 톤) */}
        <div
          className="px-6 py-8 text-center"
          style={{ background: "var(--danger)", color: "#ffffff" }}
        >
          <div
            className="mx-auto mb-3 flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.20)",
            }}
          >
            <span className="text-xl">🚑</span>
          </div>

          <div className="text-xl font-bold">AEGIS</div>
          <div className="mt-1 text-xl" style={{ opacity: 0.9 }}>
            지능형 구급활동 지원 시스템
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-xl font-semibold aegis-text-muted mb-2">
              관할 소방서 (JURISDICTION)
            </label>
            <input className="w-full aegis-input" placeholder="관할서 입력..." />
          </div>

          <div>
            <label className="block text-xl font-semibold aegis-text-muted mb-2">
              비밀번호 (PASSWORD)
            </label>

            <div
              className="flex items-center gap-2 px-3"
              style={{
                height: 44,
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                background: "var(--surface-muted)",
              }}
            >
              <span className="aegis-text-subtle">🔒</span>
              <input
                type="password"
                className="flex-1 bg-transparent outline-none"
                style={{ color: "var(--text)" }}
                placeholder="비밀번호 입력"
              />
            </div>
          </div>

          {/* 접속하기 */}
          <button
            type="button"
            onClick={() => router.push("/menu-select")}
            className="w-full aegis-btn aegis-btn--primary"
          >
            접속하기
          </button>
        </div>
      </div>
    </div>
  );
}
