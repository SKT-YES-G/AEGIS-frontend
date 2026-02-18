// hooks/useTheme.ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "aegis-theme";

type Theme = "dark" | "light";

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggle } as const;
}
