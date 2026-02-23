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

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
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
          {/* 출동 기록 테이블 */}
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
              <div
                className="rounded-xl border border-[var(--border)] overflow-hidden"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--surface-muted)" }}>
                        {["세션번호", "출동자", "상태", "출동일시", "완료일시"].map((h) => (
                          <th
                            key={h}
                            className={`text-xs font-bold text-[var(--text-muted)] whitespace-nowrap ${h === "세션번호" ? "text-center" : "text-left"}`}
                            style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr
                          key={s.sessionId}
                          onClick={() =>
                            s.status === "ACTIVE"
                              ? router.push(`/live?sessionId=${s.sessionId}`)
                              : router.push(`/incident-summary?sessionId=${s.sessionId}`)
                          }
                          className="cursor-pointer transition-colors hover:bg-[var(--surface-muted)] active:bg-[var(--surface-muted)]"
                          style={{ borderBottom: "1px solid var(--border)" }}
                        >
                          <td className="text-xs md:text-sm text-[var(--text)] text-center whitespace-nowrap" style={{ padding: "12px 16px" }}>
                            {s.sessionId}
                          </td>
                          <td className="text-xs md:text-sm text-[var(--text)] whitespace-nowrap" style={{ padding: "12px 16px" }}>
                            {s.representativeName || "-"}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md text-white whitespace-nowrap"
                              style={{
                                backgroundColor: s.status === "ACTIVE"
                                  ? LEVEL_COLORS[1]
                                  : LEVEL_COLORS[0],
                              }}
                            >
                              {s.status === "ACTIVE" ? "출동중" : "완료"}
                            </span>
                          </td>
                          <td className="text-xs md:text-sm text-[var(--text)] whitespace-nowrap" style={{ padding: "12px 16px" }}>
                            {formatDateTime(s.dispatchedAt)}
                          </td>
                          <td className="text-xs md:text-sm text-[var(--text)] whitespace-nowrap" style={{ padding: "12px 16px" }}>
                            {s.completedAt ? formatDateTime(s.completedAt) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* 새 출동 시작 */}
          <button
            type="button"
            onClick={() => setShowNameModal(true)}
            className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-[0.99] border border-[var(--border)] text-[var(--text-strong)] hover:bg-[var(--surface-muted)]"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
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
                style={{ backgroundColor: "#3b82f6" }}
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
