// app/api/mission/route.ts
import { NextResponse } from "next/server";
import type { Mission } from "@/types/mission";

export function GET() {
  const data: Mission = {
    missionId: "MAPO_20260204_058",
    stationName: "마포",
    startedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    aiConfidence: "high",
    lastModelCalledAt: new Date().toISOString(),
    level: 5,
    levelLabel: "비응급",
    reasoning:
      "현재까지 수집된 정보로는 즉각적인 처치가 필요한 응급 징후가 뚜렷하지 않습니다. 지속 관찰이 필요합니다.",
    actions: [
      "활력징후(BP, HR, BT)를 주기적으로 측정하십시오.",
      "환자의 주호소를 명확히 파악하고 과거 병력을 청취하십시오.",
      "보호자 연락 및 이송 가능한 병원을 확인하십시오.",
    ],
  };

  return NextResponse.json(data);
}
