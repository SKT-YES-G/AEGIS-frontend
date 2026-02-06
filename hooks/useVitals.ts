// hooks/useVitals.ts
"use client";

import { useEffect, useState } from "react";
import { vitalsService } from "@/services/vitals.service";
import type { Vitals } from "@/types/vitals";

export function useVitals() {
  const [data, setData] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    vitalsService
      .getVitals()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
