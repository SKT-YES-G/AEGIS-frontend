// hooks/useDraftState.ts
"use client";

import { useState, useEffect, useCallback } from "react";

const PREFIX = "aegis_draft_";

/**
 * useState와 동일하지만, setter 호출 시 즉시 sessionStorage에 저장하고
 * mount 시 복원한다. JSON 직렬화 가능한 값만 지원.
 *
 * SSR hydration 안전: 초기값은 항상 fallback, mount 후 storage에서 복원.
 */
export function useDraftState<T>(
  key: string,
  fallback: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = PREFIX + key;
  const [val, setVal] = useState<T>(fallback);

  // mount 후 sessionStorage에서 복원
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setVal(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // setter를 감싸서 호출 즉시 sessionStorage에 저장
  const setAndSave: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (action) => {
      setVal((prev) => {
        const next = typeof action === "function"
          ? (action as (prev: T) => T)(prev)
          : action;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [storageKey],
  );

  return [val, setAndSave];
}

/**
 * Set<string> 전용 draft state.
 * 내부적으로 배열로 직렬화/역직렬화 처리.
 *
 * SSR hydration 안전: 초기값은 항상 빈 Set, mount 후 storage에서 복원.
 */
export function useDraftSet(
  key: string,
): [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] {
  const storageKey = PREFIX + key;
  const [val, setVal] = useState<Set<string>>(new Set());

  // mount 후 sessionStorage에서 복원
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setVal(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // setter를 감싸서 호출 즉시 sessionStorage에 저장
  const setAndSave: React.Dispatch<React.SetStateAction<Set<string>>> = useCallback(
    (action) => {
      setVal((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [storageKey],
  );

  return [val, setAndSave];
}
