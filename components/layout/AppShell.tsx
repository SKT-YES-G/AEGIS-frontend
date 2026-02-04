// components/layout/AppShell.tsx
"use client";

import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomComposer } from "./BottomComposer";

export function AppShell({ missionId, children }: { missionId: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <TopBar missionId={missionId} />
      <main className="flex-1">{children}</main>
      <BottomComposer />
    </div>
  );
}
