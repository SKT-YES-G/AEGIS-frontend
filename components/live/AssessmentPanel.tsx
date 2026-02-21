// components/live/AssessmentPanel.tsx
"use client";

import { useState } from "react";
import { useMission } from "@/hooks/useMission";
import { ktasService } from "@/services/ktas.service";
import { ConfirmDialog } from "@/components/live/ConfirmDialog";

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
  const [userReasoning, setUserReasoning] = useState("");

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

  // ✅ 판단동기화 확인 팝업
  const [syncConfirmOpen, setSyncConfirmOpen] = useState(false);

  const handleSyncToggle = () => {
    setSyncConfirmOpen(true);
  };

  const confirmSyncToggle = () => {
    setSyncConfirmOpen(false);
    const nextSynced = !isSynced;
    setIsSynced(nextSynced);
    if (!nextSynced) {
      setUserLevel(0);
      setUserReasoning("");
    }
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <div className="text-xs opacity-80">pre-KTAS ASSESSMENT</div>
            <div className="mt-1 md:mt-2 flex items-baseline gap-6">
              <span className="text-2xl md:text-4xl font-bold text-gray-300" style={{ color: "var(--assessment-level-fg)" }}>
                LV.{lvl}{" "}
                <span className="text-lg md:text-2xl font-semibold">{lvlUi.label}</span>
              </span>
              {/* ✅ 마지막 업데이트 시간 */}
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

          <div className="flex gap-3 items-center">
            {/* ✅ AI 자동 평가 토글 */}
            <button
              type="button"
              onClick={handleSyncToggle}
              className="py-1 font-semibold transition-all flex items-center gap-2.5"
              title={isSynced ? "AI 자동 평가 해제" : "AI 자동 평가 활성화"}
            >
              <span className="text-lg md:text-xl whitespace-nowrap" style={{ color: "var(--assessment-level-fg)" }}>AI 자동 평가</span>
              {/* 토글 스위치 */}
              <span
                className="relative inline-flex items-center shrink-0 rounded-full transition-colors duration-200"
                style={{
                  width: 64,
                  height: 30,
                  backgroundColor: isSynced ? "var(--toggle-track-on)" : "var(--toggle-track-off)",
                }}
              >
                {/* ON/OFF 텍스트 */}
                <span
                  className="absolute inset-0 flex items-center text-[10px] font-bold select-none"
                  style={{
                    justifyContent: isSynced ? "flex-start" : "flex-end",
                    padding: "0 10px",
                    color: isSynced ? "#ffffff" : "var(--toggle-text-off)",
                  }}
                >
                  {isSynced ? "ON" : "OFF"}
                </span>
                {/* 원형 노브 */}
                <span
                  className="inline-block rounded-full shadow transition-transform duration-200"
                  style={{
                    backgroundColor: "#ffffff",
                    width: 24,
                    height: 24,
                    marginTop: 0,
                    position: "absolute",
                    top: 3,
                    transform: isSynced ? "translateX(37px)" : "translateX(3px)",
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Body — grid overlay: ON/OFF 콘텐츠가 같은 셀을 공유해 높이 고정 */}
      <div
        className="px-3 py-3 md:p-6 md:py-4 flex-1 min-h-0 overflow-hidden"
        style={{ display: "grid" }}
      >
        {/* ✅ 동기화 OFF: 사용자 판단 모드 (항상 렌더링 → 높이 기준) */}
        <div
          className="overflow-auto flex flex-col gap-3"
          style={{ gridRow: 1, gridColumn: 1, visibility: !isSynced ? "visible" : "hidden" }}
        >
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
          </div>

          {/* 등급 선택 + 확인 버튼 */}
          <div className="flex items-end gap-2">
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
              }}
              disabled={userLevel === 0}
              className="h-8 md:h-9 px-4 md:px-5 rounded-lg text-sm md:text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
              style={{ backgroundColor: userLevel === 0 ? "var(--prektas-bg-0)" : levelStyle(userLevel).bg }}
            >
              확인
            </button>
          </div>
        </div>

        {/* ✅ 동기화 ON: AI 판정 근거 (같은 그리드 셀에 겹침) */}
        <div
          className="overflow-auto"
          style={{ gridRow: 1, gridColumn: 1, visibility: isSynced ? "visible" : "hidden" }}
        >
          {!data && !loading && !error && (
            <div className="text-sm md:text-xl text-[var(--text-muted)]">
              평가 데이터가 없습니다.
            </div>
          )}
          {data && (
            <div className="p-2 md:p-4">
              <div className="text-sm md:text-xl font-semibold mb-1 md:mb-2 text-[var(--text-strong)]">
                판정 근거
              </div>
              <div className="text-sm md:text-xl leading-5 md:leading-6 text-[var(--text)]">
                {data.aiReasoning ?? "판정 근거가 없습니다."}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={syncConfirmOpen}
        title={isSynced ? "AI 자동 평가를 끌까요?" : "AI 자동 평가를 켤까요?"}
        description={isSynced ? "동기화를 중지합니다." : "동기화를 시작합니다."}
        onConfirm={confirmSyncToggle}
        onCancel={() => setSyncConfirmOpen(false)}
      />

      <style>{`
        @keyframes sync-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
