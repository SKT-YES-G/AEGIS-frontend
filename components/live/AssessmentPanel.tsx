// components/live/AssessmentPanel.tsx
"use client";

import { useState } from "react";
import { useMission } from "@/hooks/useMission";
import { ktasService } from "@/services/ktas.service";

type LevelStyle = {
  bg: string; // header background color token
  label: string; // level label text
};

function levelStyle(level: number): LevelStyle {
  switch (level) {
    case 0:
      return { bg: "var(--prektas-bg-0)", label: "응급도 미분류" };
    case 1:
      return { bg: "var(--prektas-bg-1)", label: "즉시 응급" };
    case 2:
      return { bg: "var(--prektas-bg-2)", label: "고위험" };
    case 3:
      return { bg: "var(--prektas-bg-3)", label: "응급" };
    case 4:
      return { bg: "var(--prektas-bg-4)", label: "준응급" };
    case 5:
    default:
      return { bg: "var(--prektas-bg-5)", label: "비응급" };
  }
}

const USER_LEVEL_OPTIONS = [
  { level: 1, label: "즉시 응급" },
  { level: 2, label: "고위험" },
  { level: 3, label: "응급" },
  { level: 4, label: "준응급" },
  { level: 5, label: "비응급" },
];

type Props = {
  sessionId: number | null;
};

export function AssessmentPanel({ sessionId }: Props) {
  // ✅ 판단동기화 토글 (기본: ON)
  const [isSynced, setIsSynced] = useState(true);

  // ✅ 사용자 판단 모드 상태
  const [userLevel, setUserLevel] = useState(0);
  const [confirmedLevel, setConfirmedLevel] = useState(0);

  // ✅ sessionId로 PreKTAS 정보 폴링
  const { data, loading, error } = useMission(sessionId);

  // ✅ 동기화 모드에 따라 표시할 레벨/라벨 결정
  const aiLevel = data?.aiKtasLevel ?? 0;
  const lvl = isSynced ? aiLevel : userLevel;
  const lvlUi = isSynced
    ? levelStyle(lvl)
    : userLevel === 0
      ? { bg: "var(--prektas-bg-0)", label: "사용자 판단" }
      : levelStyle(userLevel);

  const handleSyncToggle = () => {
    const nextSynced = !isSynced;
    setIsSynced(nextSynced);
    if (sessionId) {
      ktasService.toggleSync(sessionId, { synced: nextSynced });
    }
  };

  return (
    <section className="aegis-surface-strong flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="text-white px-3 py-2 md:px-6 md:py-3 shrink-0"
        style={{ backgroundColor: lvlUi.bg }}
      >
        {loading && <div className="text-sm md:text-xl opacity-80">평가 로딩 중...</div>}

        {error && (
          <div className="text-sm md:text-xl text-[var(--text-inverse)]/90">
            <span className="font-semibold">평가 로드 실패</span>: {error.message}
          </div>
        )}

        {/* ✅ data가 없어도 헤더 레이아웃은 유지(현장 UX에서 흔들림 방지) */}
        <div className="flex flex-col gap-1">
          <div className="text-xs opacity-80">pre-KTAS ASSESSMENT</div>

          {/* 메인 등급 표시 */}
          <div className="mt-1 md:mt-2 flex items-center gap-4 flex-wrap">
            <span className="text-2xl md:text-4xl font-bold" style={{ color: "var(--assessment-level-fg)" }}>
              LV.{lvl}{" "}
              <span className="text-lg md:text-2xl font-semibold">{lvlUi.label}</span>
            </span>

            {/* 직접 평가 모드: AI 등급을 우측에 표시 */}
            {!isSynced && (
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}
                >
                  AI
                </span>
                <span className="text-sm md:text-base font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {aiLevel > 0
                    ? `LV.${aiLevel} ${levelStyle(aiLevel).label}`
                    : "미평가"}
                </span>
              </div>
            )}

            {/* AI 모드: 마지막 업데이트 시간 */}
            {isSynced && data?.updatedAt && (
              <span className="text-xs md:text-sm text-white whitespace-nowrap">
                마지막 업데이트:{" "}
                {new Date(data.updatedAt).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-3 md:p-6 md:py-4 flex-1 min-h-0 overflow-auto flex flex-col gap-3">
        {/* ✅ 판정 근거 (항상 표시) */}
        <div>
          <div className="text-sm md:text-xl font-semibold mb-1 md:mb-2 text-[var(--text-strong)]">
            AI 판정 근거
          </div>
          {!data && !loading && !error && (
            <div className="text-sm md:text-xl text-[var(--text-muted)]">
              평가 데이터가 없습니다.
            </div>
          )}
          {data && (
            <div className="text-sm md:text-xl leading-5 md:leading-6 text-[var(--text)]">
              {data.aiReasoning ?? "판정 근거가 없습니다."}
            </div>
          )}
        </div>

        {/* ✅ 사용자 등급 평가 토글 */}
        <button
          type="button"
          onClick={handleSyncToggle}
          className="py-1 font-semibold transition-all flex items-center gap-2.5 self-start"
          title={isSynced ? "사용자 등급 평가 활성화" : "사용자 등급 평가 해제"}
        >
          <span className="text-sm md:text-base whitespace-nowrap text-[var(--text-strong)]">사용자 등급 평가</span>
          <span
            className="relative inline-flex items-center shrink-0 rounded-full transition-colors duration-200"
            style={{
              width: 64,
              height: 30,
              backgroundColor: !isSynced ? "var(--toggle-track-on)" : "var(--toggle-track-off)",
            }}
          >
            <span
              className="absolute inset-0 flex items-center text-[10px] font-bold select-none"
              style={{
                justifyContent: !isSynced ? "flex-start" : "flex-end",
                padding: "0 10px",
                color: !isSynced ? "#ffffff" : "var(--toggle-text-off)",
              }}
            >
              {!isSynced ? "ON" : "OFF"}
            </span>
            <span
              className="inline-block rounded-full shadow transition-transform duration-200"
              style={{
                backgroundColor: "#ffffff",
                width: 24,
                height: 24,
                position: "absolute",
                top: 3,
                transform: !isSynced ? "translateX(37px)" : "translateX(3px)",
              }}
            />
          </span>
        </button>

        {/* ✅ 등급 선택 + 확인 (OFF 시 숨김, 높이 유지) */}
        <div
          className="flex items-end gap-2 transition-opacity"
          style={{ visibility: isSynced ? "hidden" : "visible", pointerEvents: isSynced ? "none" : "auto" }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-xl font-semibold mb-2 text-[var(--text-strong)]">
              응급도 등급 선택
            </div>
            <div className="flex flex-wrap gap-2">
              {USER_LEVEL_OPTIONS.map((opt) => {
                const active = userLevel === opt.level;
                const style = levelStyle(opt.level);
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setUserLevel(opt.level)}
                    className={[
                      "h-8 md:h-9 px-3 rounded-lg text-xs md:text-sm font-bold transition-all border",
                      active
                        ? "text-white border-transparent"
                        : "text-[var(--fg)] border-[var(--border)] bg-[var(--surface-muted)] hover:opacity-80",
                    ].join(" ")}
                    style={active ? { backgroundColor: style.bg, borderColor: style.bg } : undefined}
                  >
                    LV.{opt.level} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!sessionId) return;
              ktasService.updateParamedic(sessionId, { level: userLevel });
              setConfirmedLevel(userLevel);
            }}
            disabled={userLevel === 0 || userLevel === confirmedLevel}
            className="h-8 md:h-9 px-4 md:px-5 rounded-lg text-sm md:text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
            style={{ backgroundColor: "var(--prektas-bg-5)" }}
          >
            확인
          </button>
        </div>
      </div>


      <style>{`
        @keyframes sync-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
