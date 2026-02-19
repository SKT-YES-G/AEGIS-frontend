// components/live/AssessmentPanel.tsx
"use client";

import { useState } from "react";
import { useMission } from "@/hooks/useMission";

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

export function AssessmentPanel() {
  // ✅ 판단동기화 토글 (기본: ON)
  const [isSynced, setIsSynced] = useState(true);

  // ✅ 사용자 판단 모드 상태
  const [userLevel, setUserLevel] = useState(0);
  const [userReasoning, setUserReasoning] = useState("");

  // ✅ caseIndex를 훅으로 전달 (mock 케이스 반환) — 기본 1레벨
  const { data, loading, error } = useMission(1);

  // ✅ 동기화 모드에 따라 표시할 레벨/라벨 결정
  const lvl = isSynced ? (data?.level ?? 0) : userLevel;
  const lvlUi = isSynced
    ? levelStyle(lvl)
    : userLevel === 0
      ? { bg: "var(--prektas-bg-0)", label: "사용자 판단" }
      : { ...levelStyle(userLevel), label: `사용자 판단` };

  const handleSyncToggle = () => {
    setIsSynced((prev) => {
      if (prev) {
        // ON → OFF: 사용자 판단 모드 진입, LV.0으로 초기화
        setUserLevel(0);
        setUserReasoning("");
      }
      return !prev;
    });
  };

  return (
    <section className="aegis-surface-strong flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="text-white px-3 py-3 md:px-6 md:py-5 shrink-0"
        style={{ backgroundColor: lvlUi.bg }}
      >
        {loading && <div className="text-sm md:text-xl opacity-80">평가 로딩 중...</div>}

        {error && (
          <div className="text-sm md:text-xl text-[var(--text-inverse)]/90">
            <span className="font-semibold">평가 로드 실패</span>: {error.message}
          </div>
        )}

        {/* ✅ data가 없어도 헤더 레이아웃은 유지(현장 UX에서 흔들림 방지) */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <div className="text-xs opacity-80">AEGIS ASSESSMENT</div>
            <div className="mt-1 md:mt-2 text-2xl md:text-4xl font-bold">
              LV.{lvl}{" "}
              <span className="text-lg md:text-2xl font-semibold">{lvlUi.label}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* ✅ Case 전환 버튼 + 모델 호출 (동기화 ON일 때만) — 현재 숨김 */}
            {/* {isSynced && (
              <>
                <button
                  type="button"
                  onClick={onNextCase}
                  className="h-8 md:h-9 px-2 md:px-3 rounded-lg border border-white/30 text-sm md:text-xl hover:bg-white/15 active:bg-white/25"
                  title="데모용 케이스 전환"
                >
                  Case {caseIndex} ▶
                </button>

                {data && (
                  <StatPill
                    label="마지막 모델 호출:"
                    value={formatTime(data.lastModelCalledAt)}
                  />
                )}
              </>
            )} */}

            {/* ✅ 판단동기화 토글 */}
            <button
              type="button"
              onClick={handleSyncToggle}
              className="h-8 md:h-9 px-2 md:px-3 rounded-lg text-sm md:text-xl font-semibold transition-all flex items-center gap-1.5 border border-white/15"
              style={{ backgroundColor: "#1F2933" }}
              title={isSynced ? "판단동기화 해제" : "판단동기화 활성화"}
            >
              판단동기화
              <span
                className={[
                  "inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0",
                  isSynced
                    ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-[sync-blink_1.4s_ease-in-out_infinite]"
                    : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]",
                ].join(" ")}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-3 md:p-6 md:py-4 flex-1 min-h-0 flex flex-col gap-3 md:gap-4">
        {/* data 없을 때의 안내 */}
        {!data && !loading && !error && (
          <div className="text-sm md:text-xl text-[var(--text-muted)]">
            평가 데이터가 없습니다.
          </div>
        )}

        {/* ✅ 동기화 ON: AI 판정 근거 표시 */}
        {isSynced && data && (
          <div className="p-2 md:p-4 flex-1 min-h-0 overflow-auto">
            <div className="text-sm md:text-xl font-semibold mb-1 md:mb-2 text-[var(--text-strong)]">
              판정 근거
            </div>
            <div className="text-sm md:text-xl leading-5 md:leading-6 text-[var(--text)]">
              {data.reasoning}
            </div>
          </div>
        )}

        {/* ✅ 동기화 OFF: 사용자 판단 모드 */}
        {!isSynced && (
          <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-3">
            {/* 등급 선택 */}
            <div>
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

            {/* 판정 근거 입력 */}
            <div>
              <div className="text-sm md:text-xl font-semibold mb-2 text-[var(--text-strong)]">
                판정 근거
              </div>
              <textarea
                className="w-full h-16 md:h-20 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm md:text-base p-2 resize-none outline-none"
                placeholder="판정 근거를 입력하세요"
                value={userReasoning}
                onChange={(e) => setUserReasoning(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => alert(`LV.${userLevel} 확정\n근거: ${userReasoning}`)}
                  disabled={userLevel === 0}
                  className="h-8 md:h-9 px-4 md:px-5 rounded-lg text-sm md:text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                  style={{ backgroundColor: userLevel === 0 ? "var(--prektas-bg-0)" : levelStyle(userLevel).bg }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
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
