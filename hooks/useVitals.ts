// hooks/useVitals.ts
"use client";

import { useEffect, useState } from "react";
import { vitalsService } from "@/services/vitals.service";
import type { Vitals } from "@/types/vitals";

export function useVitals(sessionId: number | null) {
  const [data, setData] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(sessionId != null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    vitalsService
      .getVitals(sessionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { data, loading, error };
}
