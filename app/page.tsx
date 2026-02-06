// app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* 상단 레드 헤더 */}
        <div className="bg-red-600 text-white px-6 py-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl">🚑</span>
          </div>
          <div className="text-xl font-bold">Smart Ambulance AI</div>
          <div className="mt-1 text-sm opacity-90">지능형 구급활동 지원 시스템</div>
        </div>

        {/* 입력 폼 (지금은 동작 안 해도 됨) */}
        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              관할 소방서 (JURISDICTION)
            </label>
            <input
              className="w-full h-11 rounded-xl border px-4 bg-slate-50"
              placeholder="관할서 입력..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              비밀번호 (PASSWORD)
            </label>
            <div className="flex items-center gap-2 h-11 rounded-xl border px-3 bg-slate-50">
              <span className="text-slate-400">🔒</span>
              <input
                type="password"
                className="flex-1 bg-transparent outline-none"
                placeholder="비밀번호 입력"
              />
            </div>
          </div>

          {/* 접속하기: 지금은 검증 없이 이동 */}
          <button
            type="button"
            onClick={() => router.push("/menu_select")}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            접속하기
          </button>
        </div>
      </div>
    </div>
  );
}
