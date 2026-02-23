// app/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutDrawer } from "@/components/layout/LogoutDrawer";
import { authService } from "@/services/auth.service";
import type { FireStationSearchItem } from "@/types/auth";
import "@/styles/components.css";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 소방서명 자동완성
  const [suggestions, setSuggestions] = useState<FireStationSearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const searchStations = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    setShowDropdown(true);
    debounceRef.current = setTimeout(() => {
      authService.searchFireStations(query.trim()).then((items) => {
        setSuggestions(items);
        setShowDropdown(true);
        setActiveIdx(-1);
      }).catch(() => {
        setSuggestions([]);
      }).finally(() => setSearching(false));
    }, 300);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    searchStations(v);
  };

  const selectStation = (station: FireStationSearchItem) => {
    setName(station.name);
    setShowDropdown(false);
    setSuggestions([]);
    setActiveIdx(-1);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") handleLogin();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < suggestions.length) {
        selectStation(suggestions[activeIdx]);
      } else {
        handleLogin();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // 활성 항목 스크롤
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
            {/* 관할 소방서 — 자동완성 */}
            <div ref={wrapperRef} style={{ position: "relative" }}>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                관할 소방서
              </label>

              {/* 검색 입력 */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" }}>
                  {searching ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  )}
                </div>
                <input
                  className="w-full h-14 rounded-xl text-base outline-none transition"
                  style={{
                    paddingLeft: 42,
                    paddingRight: 16,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: showDropdown
                      ? "1px solid rgba(59,130,246,0.5)"
                      : "1px solid rgba(255,255,255,0.15)",
                    color: "#ffffff",
                  }}
                  placeholder="소방서명 검색"
                  value={name}
                  onChange={handleNameChange}
                  onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-autocomplete="list"
                />
              </div>

              {/* 드롭다운 */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "#162240",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  {/* 로딩 */}
                  {searching && suggestions.length === 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>검색 중...</span>
                    </div>
                  )}

                  {/* 결과 없음 */}
                  {!searching && suggestions.length === 0 && name.trim().length > 0 && (
                    <div style={{ padding: "18px", textAlign: "center" }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                        일치하는 소방서가 없습니다
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                        소방서명을 정확히 입력해주세요
                      </div>
                    </div>
                  )}

                  {/* 결과 리스트 */}
                  {suggestions.length > 0 && (
                    <ul
                      ref={listRef}
                      role="listbox"
                      style={{
                        maxHeight: 240,
                        overflowY: "auto",
                        listStyle: "none",
                        margin: 0,
                        padding: "4px 0",
                      }}
                    >
                      {suggestions.map((s, i) => (
                        <li
                          key={s.id}
                          role="option"
                          aria-selected={i === activeIdx}
                          onClick={() => selectStation(s)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            minHeight: 50,
                            padding: "0 16px",
                            cursor: "pointer",
                            backgroundColor: i === activeIdx ? "rgba(59,130,246,0.18)" : "transparent",
                            borderLeft: i === activeIdx ? "3px solid #3b82f6" : "3px solid transparent",
                            transition: "background-color 0.1s, border-color 0.1s",
                          }}
                          onMouseEnter={() => setActiveIdx(i)}
                          onMouseLeave={() => setActiveIdx(-1)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i === activeIdx ? "#60a5fa" : "rgba(255,255,255,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: i === activeIdx ? "#ffffff" : "rgba(255,255,255,0.8)",
                            letterSpacing: 0.2,
                          }}>
                            {s.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
