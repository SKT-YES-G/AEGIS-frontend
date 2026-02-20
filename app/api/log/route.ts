// app/api/log/route.ts
import { NextResponse } from "next/server";
import type { ActivityLogItem } from "@/types/log";

export function GET() {
  const now = Date.now();

  const items: ActivityLogItem[] = [
    {
      id: "1",
      at: new Date(now - 1000 * 60 * 5).toISOString(),
      tag: "INFO",
      message: "출동 세션 시작 [MAPO_20260204_058]",
    },
    {
      id: "2",
      at: new Date(now - 1000 * 60 * 4).toISOString(),
      tag: "KTAS_CHANGE",
      message: "초기 평가: LV.0 (응급도 미분류)",
    },
    {
      id: "3",
      at: new Date(now - 1000 * 60 * 3).toISOString(),
      tag: "CREW",
      message: "환자 가슴 통증 호소",
    },
    {
      id: "5",
      at: new Date(now - 1000 * 90).toISOString(),
      tag: "KTAS_CHANGE",
      message: "AI 재평가: LV.1 (즉시 응급) — 의식 저하, SpO2 88%",
    },
    {
      id: "6",
      at: new Date(now - 1000 * 60).toISOString(),
      tag: "GPS",
      message: "현재 위치 갱신: 마포구 상암동 (37.577, 126.889)",
    },
    {
      id: "7",
      at: new Date(now - 1000 * 30).toISOString(),
      tag: "INFO",
      message: "응급의료센터 추천 완료 (4곳)",
    },
    {
      id: "8",
      at: new Date(now - 1000 * 10).toISOString(),
      tag: "CREW",
      message: "이송 병원 확정: 세브란스병원 응급의료센터",
    },
  ];

  return NextResponse.json(items);
}
