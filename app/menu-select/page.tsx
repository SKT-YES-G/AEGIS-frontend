// app/menu-select/page.tsx
"use client";

import { useRouter } from "next/navigation";
import "@/styles/components.css"; // ✅ components 유틸 클래스 사용

export default function MenuSelectPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-10"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* 출동일지(큰 영역) */}
      <div
        className="aegis-surface w-[60%] h-[60vh] flex flex-col items-center justify-center"
        style={{ borderRadius: "1.25rem" }} // rounded-2xl 느낌 유지(토큰과 무관한 shape)
      >
        <div className="text-2xl font-semibold aegis-text-strong mb-3">
          출동일지
        </div>
        <div className="text-xl aegis-text-muted">
          최근 활동 기록이 없습니다
        </div>
      </div>

      {/* 새 출동 시작 버튼 */}
      <button
        type="button"
        onClick={() => router.push("/live")}
        className="aegis-btn aegis-btn--danger"
        style={{ minWidth: 180 }}
      >
        새 출동 시작
      </button>
    </div>
  );
}
