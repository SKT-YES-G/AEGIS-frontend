"use client";

import { useRouter } from "next/navigation";

export default function MenuSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-10">

      {/* 출동일지 (큰 흰색 영역) */}
      <div
        className="bg-white rounded-2xl
                   w-[60%] h-[60vh]
                   flex flex-col items-center justify-center"
      >
        <div className="text-2xl font-semibold text-slate-800 mb-3">
          출동일지
        </div>
        <div className="text-sm text-slate-500">
          최근 활동 기록이 없습니다
        </div>
      </div>

      {/* 새 출동 시작 버튼 */}
      <button
        type="button"
        onClick={() => router.push("/live")}
        className="w-[180px] h-[56px]
                   text-white font-semibold
                   rounded-xl border-4 border-white
                   hover:bg-slate-300 transition"
                   style={{ backgroundColor: "var(--prektas-bg-1)" }}
      >
        새 출동 시작
      </button>

    </div>
  );
}
