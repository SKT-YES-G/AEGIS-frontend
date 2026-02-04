// app/live/page.tsx
"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ActivityLogPanel } from "@/components/live/ActivityLogPanel";
import { AssessmentPanel } from "@/components/live/AssessmentPanel";
import { VitalsPanel } from "@/components/live/VitalsPanel";
import { useMission } from "@/hooks/useMission";

export default function LivePage() {
  const { data } = useMission();
  const missionId = data?.missionId ?? "MAPO_20260204_058";

  return (
    <AppShell missionId={missionId}>
      <div className="h-[calc(100vh-56px-64px)] grid grid-cols-2">
        <ActivityLogPanel />
        <div className="flex flex-col overflow-auto">
          <AssessmentPanel />
          <VitalsPanel />
        </div>
      </div>
    </AppShell>
  );
}
