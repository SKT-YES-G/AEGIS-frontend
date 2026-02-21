// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutDrawer } from "@/components/layout/LogoutDrawer";
import { authService } from "@/services/auth.service";
import "@/styles/components.css";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      setError("소방서명과 비밀번호를 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.login({ name: name.trim(), password });
      router.push("/mission-hub");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e
        ? (e as { message: string }).message
        : "로그인에 실패했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ color: "var(--foreground)" }}
    >
      <LogoutDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* ── 좌측: 로그인 패널 ── */}
      <div
        className="relative flex flex-col items-center justify-center w-full md:w-1/2 min-h-[60vh] md:min-h-screen px-6 py-10"
        style={{ backgroundColor: "#0f1b33" }}
      >
        {/* 햄버거 메뉴 */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-4 left-4 h-12 w-12 rounded-lg flex items-center justify-center text-xl transition"
          style={{ color: "rgba(255,255,255,0.7)" }}
          aria-label="메뉴"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>

        <div className="w-full max-w-md">
          {/* 모바일/태블릿 세로: 로고 표시 */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <img
              src="/favicon.ico"
              alt="AEGIS"
              style={{ width: 80, height: 80, objectFit: "contain" }}
            />
            <div
              className="text-lg font-black mt-2 tracking-wide"
              style={{ color: "#ffffff" }}
            >
              AEGIS
            </div>
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: "#ffffff" }}
          >
            시스템 접속
          </h1>

          {/* 에러 메시지 */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          {/* 폼 */}
          <div className="space-y-5">
            {/* 관할 소방서 */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                관할 소방서
              </label>
              <input
                className="w-full h-14 px-4 rounded-xl text-base outline-none transition"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
                placeholder="소방서명 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                비밀번호
              </label>
              <input
                type="password"
                className="w-full h-14 px-4 rounded-xl text-base outline-none transition"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-14 mt-8 rounded-xl font-bold text-lg text-white transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#2563eb" }}
          >
            {loading ? "접속 중..." : "접속하기"}
          </button>

          {/* 시스템 버전 */}
          <p
            className="text-center mt-6 text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            AEGIS v1.0 — 구급활동 지원 시스템
          </p>
        </div>
      </div>

      {/* ── 우측: 브랜딩 영역 ── */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-white">
        <img
          src="/favicon.ico"
          alt="AEGIS"
          style={{ width: 240, height: 240, objectFit: "contain" }}
        />
        <div className="text-center mt-4">
          <div
            className="text-5xl font-black tracking-tight"
            style={{ color: "#0f1b33" }}
          >
            AEGIS
          </div>
          <div
            className="text-lg font-medium mt-2 tracking-wide"
            style={{ color: "#64748b" }}
          >
            Emergency Support System
          </div>
        </div>
      </div>
    </div>
  );
}
