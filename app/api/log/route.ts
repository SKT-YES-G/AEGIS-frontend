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
      tag: "CREW",
      message: "이송자 정보 등록 완료 (3명 탑승)",
    },
    {
      id: "3",
      at: new Date(now - 1000 * 60 * 3).toISOString(),
      tag: "GPS",
      message: "GPS 위치 추적 시작...",
    },
    {
      id: "4",
      at: new Date(now - 1000 * 60 * 2).toISOString(),
      tag: "KTAS_CHANGE",
      message: "초기 평가: LV.5 (비응급/초기 판정)",
    },
  ];

  return NextResponse.json(items);
}
