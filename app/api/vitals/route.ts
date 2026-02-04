// app/api/vitals/route.ts
import { NextResponse } from "next/server";
import type { Vitals } from "@/types/vitals";

export function GET() {
  const jitter = (n: number) => n + Math.floor(Math.random() * 3) - 1;

  const data: Vitals = {
    sbp: jitter(120),
    dbp: jitter(80),
    hr: jitter(72),
    spo2: jitter(98),
    temp: 36.5 + (Math.random() * 0.2 - 0.1),
    rr: jitter(18),
    source: "device",
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
