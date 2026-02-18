// hooks/useDraftState.ts
"use client";

import { useState, useEffect, useRef } from "react";

const PREFIX = "aegis_draft_";

/**
 * useState와 동일하지만, unmount(네비게이션) 시 sessionStorage에 저장하고
 * mount 시 복원한다. JSON 직렬화 가능한 값만 지원.
 */
export function useDraftState<T>(
  key: string,
  fallback: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = PREFIX + key;

  const [val, setVal] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });

  const ref = useRef(val);

  useEffect(() => {
    ref.current = val;
  }, [val]);

  useEffect(() => {
    return () => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(ref.current));
      } catch {
        /* ignore */
      }
    };
  }, [storageKey]);

  return [val, setVal];
}

/**
 * Set<string> 전용 draft state.
 * 내부적으로 배열로 직렬화/역직렬화 처리.
 */
export function useDraftSet(
  key: string,
): [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] {
  const storageKey = PREFIX + key;

  const [val, setVal] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const ref = useRef(val);

  useEffect(() => {
    ref.current = val;
  }, [val]);

  useEffect(() => {
    return () => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify([...ref.current]));
      } catch {
        /* ignore */
      }
    };
  }, [storageKey]);

  return [val, setVal];
}
