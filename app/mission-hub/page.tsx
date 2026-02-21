// app/mission-hub/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutDrawer } from "@/components/layout/LogoutDrawer";
import { sessionService } from "@/services/session.service";
import type { DispatchSession } from "@/types/session";
import "@/styles/components.css";

const LEVEL_COLORS: Record<number, string> = {
  0: "var(--prektas-bg-0)",
  1: "var(--prektas-bg-1)",
  2: "var(--prektas-bg-2)",
  3: "var(--prektas-bg-3)",
  4: "var(--prektas-bg-4)",
  5: "var(--prektas-bg-5)",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function MissionHubPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<DispatchSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [repName, setRepName] = useState("");

  const fetchSessions = useCallback(async () => {
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch {
      // 에러 시 빈 목록 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewSession = async () => {
    if (creating) return;
    const trimmed = repName.trim();
    if (!trimmed) return;
    setCreating(true);
    try {
      const session = await sessionService.create({ representativeName: trimmed });
      setShowNameModal(false);
      setRepName("");
      router.push(`/live?sessionId=${session.sessionId}`);
    } catch {
      alert("출동 세션 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <LogoutDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* ── 상단 헤더 ── */}
      <header
        className="shrink-0 h-14 px-4 flex items-center gap-3 border-b"
        style={{
          backgroundColor: "var(--panel-header-bg)",
          borderColor: "var(--border)",
        }}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="h-10 w-10 rounded-lg flex items-center justify-center transition"
          style={{ color: "var(--panel-header-fg)" }}
          aria-label="메뉴"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <h1
          className="text-base md:text-lg font-bold"
          style={{ color: "var(--panel-header-fg)" }}
        >
          AEGIS 출동 관리
        </h1>
      </header>

      {/* ── 본문 ── */}
      <main className="flex-1 min-h-0 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* 출동 기록 목록 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h2 className="text-sm md:text-base font-bold text-[var(--text-strong)]">
                출동 기록
              </h2>
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-1">
                {sessions.length}건
              </span>
            </div>

            {loading ? (
              <div className="text-sm text-[var(--text-muted)] py-8 text-center">
                불러오는 중...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] py-8 text-center">
                출동 기록이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sessions.map((s) => (
                  <button
                    key={s.sessionId}
                    type="button"
                    onClick={() =>
                      s.status === "ACTIVE"
                        ? router.push(`/live?sessionId=${s.sessionId}`)
                        : router.push(`/incident-summary?sessionId=${s.sessionId}`)
                    }
                    className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] active:scale-[0.99] transition-all p-4"
                  >
                    {/* 상단: ID + 상태 */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[var(--text-strong)]">
                        #{s.sessionId}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                        style={{
                          backgroundColor: s.status === "ACTIVE"
                            ? LEVEL_COLORS[1]
                            : LEVEL_COLORS[0],
                        }}
                      >
                        {s.status === "ACTIVE" ? "진행 중" : "완료"}
                      </span>
                    </div>

                    {/* 정보 행 */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">출동자</span>
                        <span className="text-[var(--text-strong)] font-medium">
                          {s.representativeName || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">출동일</span>
                        <span className="text-[var(--text)]">
                          {formatDate(s.dispatchedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">출동시간</span>
                        <span className="text-[var(--text)]">
                          {formatTime(s.dispatchedAt)}
                        </span>
                      </div>
                      {s.completedAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-muted)] w-14 shrink-0 text-xs font-semibold">완료</span>
                          <span className="text-[var(--text)]">
                            {formatTime(s.completedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 새 출동 시작 */}
          <button
            type="button"
            onClick={() => setShowNameModal(true)}
            className="w-full h-16 md:h-20 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 transition active:scale-[0.98] shadow-lg disabled:opacity-60"
            style={{ backgroundColor: "var(--prektas-bg-1)", color: "var(--dispatch-btn-fg)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            새 출동 시작
          </button>
        </div>
      </main>

      {/* ── 대표자명 입력 모달 ── */}
      {showNameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => { setShowNameModal(false); setRepName(""); }}
        >
          <div
            className="w-[90%] max-w-sm rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: "var(--surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold mb-4 text-[var(--text-strong)]">
              출동 대표자명 입력
            </h3>
            <input
              autoFocus
              className="w-full h-12 px-4 rounded-xl text-base outline-none transition"
              style={{
                backgroundColor: "var(--surface-muted)",
                border: "1px solid var(--border)",
                color: "var(--text-strong)",
              }}
              placeholder="대표자명 (팀장/책임자)"
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNewSession(); }}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setShowNameModal(false); setRepName(""); }}
                className="flex-1 h-11 rounded-xl font-semibold text-sm transition"
                style={{ backgroundColor: "var(--surface-muted)", color: "var(--text-muted)" }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleNewSession}
                disabled={!repName.trim() || creating}
                className="flex-1 h-11 rounded-xl font-semibold text-sm text-white transition disabled:opacity-50"
                style={{ backgroundColor: "var(--prektas-bg-1)" }}
              >
                {creating ? "생성 중..." : "출동 시작"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
